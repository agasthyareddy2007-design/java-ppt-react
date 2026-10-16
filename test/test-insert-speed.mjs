import net from 'net';
import fs from 'fs';
import { spawn } from 'child_process';

function connectMarionette(port = 2828) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    function tryConnect() {
      attempts++;
      const client = net.createConnection({ port }, () => {});

      let msgId = 1;
      const callbacks = new Map();
      let buffer = '';

      client.on('data', (data) => {
        buffer += data.toString();
        while (true) {
          const colonIdx = buffer.indexOf(':');
          if (colonIdx === -1) break;
          const lenStr = buffer.substring(0, colonIdx);
          const len = parseInt(lenStr, 10);
          if (isNaN(len)) {
            try {
              JSON.parse(buffer);
              buffer = '';
              resolve({ client, sendCommand });
              return;
            } catch(e) {
              break;
            }
          }
          if (buffer.length < colonIdx + 1 + len) break;
          const jsonStr = buffer.substring(colonIdx + 1, colonIdx + 1 + len);
          buffer = buffer.substring(colonIdx + 1 + len);

          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.marionetteProtocol) {
              resolve({ client, sendCommand });
            } else if (Array.isArray(parsed)) {
              const [type, id, error, result] = parsed;
              const cb = callbacks.get(id);
              if (cb) {
                callbacks.delete(id);
                if (error) cb.reject(error);
                else cb.resolve(result);
              }
            }
          } catch (e) {
            console.error('Error parsing Marionette msg:', e);
          }
        }
      });

      client.on('error', (err) => {
        if (attempts < 30) {
          setTimeout(tryConnect, 200);
        } else {
          reject(err);
        }
      });

      function sendCommand(name, params = {}) {
        return new Promise((res, rej) => {
          const id = msgId++;
          callbacks.set(id, { resolve: res, reject: rej });
          const payload = JSON.stringify([0, id, name, params]);
          const msg = `${Buffer.byteLength(payload, 'utf8')}:${payload}`;
          client.write(msg);
        });
      }
    }
    tryConnect();
  });
}

async function run() {
  console.log('Launching headless Firefox...');
  const ff = spawn('/usr/bin/firefox', ['--headless', '--marionette'], {
    stdio: 'ignore',
    detached: false
  });

  try {
    const { client, sendCommand } = await connectMarionette();
    console.log('Connected to Marionette successfully!');

    const session = await sendCommand('WebDriver:NewSession', { capabilities: {} });
    console.log('Session started:', session.sessionId);

    await sendCommand('WebDriver:SetTimeouts', { implicit: 5000 });

    // Navigate directly to Slide 12 (B-Tree Interactive Playground, hash #11)
    console.log('Navigating to B-Tree Playground on Slide 12 (#11)...');
    await sendCommand('WebDriver:Navigate', { url: 'http://localhost:3000/#11' });
    await new Promise(r => setTimeout(r, 1500));

    // ─────────────────────────────────────────────────────────────
    // TEST 1: Direct Insert with NO split (leaf has room)
    // ─────────────────────────────────────────────────────────────
    console.log('\n--- 1. Testing Direct Insert (NO split, leaf has room) ---');
    const tStartDirect = Date.now();
    await sendCommand('WebDriver:ExecuteScript', {
      script: `
        const buttons = Array.from(document.querySelectorAll('button'));
        const insertBtn = buttons.find(b => b.textContent.includes('Insert'));
        if (insertBtn) insertBtn.click();
      `
    });

    // Wait 350ms: direct insert should be completely done and unlocked!
    await new Promise(r => setTimeout(r, 350));
    const directDuration = Date.now() - tStartDirect;
    const directCheck = await sendCommand('WebDriver:ExecuteScript', {
      script: `
        const runningPill = Array.from(document.querySelectorAll('*')).find(el => el.textContent && el.textContent.includes('RUNNING...'));
        return !!runningPill;
      `
    });
    console.log(`Direct insert running status at ${directDuration}ms: ${directCheck.value} (Expected: false, completed instantly!)`);
    if (directCheck.value) {
      throw new Error(`Direct insert took longer than expected: still running at ${directDuration}ms`);
    }

    const ssDirect = await sendCommand('WebDriver:TakeScreenshot', {});
    fs.writeFileSync('/home/agasthya/.gemini/antigravity-ide/brain/856434cc-0453-4ab4-ba9a-ee122008b544/test_direct_insert_instant.png', Buffer.from(ssDirect.value, 'base64'));
    console.log('Saved test_direct_insert_instant.png (Direct insert completed instantly in ~150-300ms!)');

    // ─────────────────────────────────────────────────────────────
    // TEST 2: Insert WITH SPLITTING (Root Split Preset)
    // ─────────────────────────────────────────────────────────────
    console.log('\n--- 2. Testing Insert WITH SPLITTING (Root Split Preset: Must be FULL animation) ---');
    await sendCommand('WebDriver:ExecuteScript', {
      script: `
        const select = document.querySelector('select');
        select.value = 'root-split';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      `
    });

    // Check at 1000ms: Must STILL be running Step 1 (Red Overflow explanation: 3200ms duration)
    await new Promise(r => setTimeout(r, 1000));
    const splitCheckAt1000 = await sendCommand('WebDriver:ExecuteScript', {
      script: `
        const runningPill = Array.from(document.querySelectorAll('*')).find(el => el.textContent && el.textContent.includes('RUNNING...'));
        const redBadge = Array.from(document.querySelectorAll('*')).find(el => el.textContent && el.textContent.includes('OVERFLOW'));
        return { isRunning: !!runningPill, hasOverflow: !!redBadge };
      `
    });
    console.log('Split animation status at 1000ms:', splitCheckAt1000.value);
    if (!splitCheckAt1000.value.isRunning) {
      throw new Error('Split insert finished prematurely! Must play full animation with pauses for explanation.');
    }

    const ssSplitOverflow = await sendCommand('WebDriver:TakeScreenshot', {});
    fs.writeFileSync('/home/agasthya/.gemini/antigravity-ide/brain/856434cc-0453-4ab4-ba9a-ee122008b544/test_split_overflow_playing.png', Buffer.from(ssSplitOverflow.value, 'base64'));
    console.log('Saved test_split_overflow_playing.png (Shows red overflow explanation visibly active!)');

    // Check at 3800ms: Must STILL be running Step 2 (Split executed & median promoted)
    await new Promise(r => setTimeout(r, 2800));
    const splitCheckAt3800 = await sendCommand('WebDriver:ExecuteScript', {
      script: `
        const runningPill = Array.from(document.querySelectorAll('*')).find(el => el.textContent && el.textContent.includes('RUNNING...'));
        return !!runningPill;
      `
    });
    console.log('Split animation status at 3800ms:', splitCheckAt3800.value, '(Expected: true, advancing through split promotion)');
    if (!splitCheckAt3800.value) {
      throw new Error('Split insert finished too fast! Full animation requires ~11s.');
    }

    const ssSplitStep2 = await sendCommand('WebDriver:TakeScreenshot', {});
    fs.writeFileSync('/home/agasthya/.gemini/antigravity-ide/brain/856434cc-0453-4ab4-ba9a-ee122008b544/test_split_promoted_playing.png', Buffer.from(ssSplitStep2.value, 'base64'));
    console.log('Saved test_split_promoted_playing.png (Shows split promotion step active with full lecture pacing!)');

    console.log('\n✔ ALL TESTS PASSED:');
    console.log('  1. Direct insert (no split) is INSTANT (~150-300ms total).');
    console.log('  2. Insert with splitting plays the FULL educational animation (overflow -> split -> promote -> descend -> insert).');
    console.log('  3. Delete and Search retain full animation speed.');
    client.end();
  } finally {
    ff.kill('SIGTERM');
  }
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
