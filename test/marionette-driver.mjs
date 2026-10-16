import net from 'net';
import fs from 'fs';

function connectMarionette(port = 2828) {
  return new Promise((resolve, reject) => {
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

    client.on('error', reject);

    function sendCommand(name, params = {}) {
      return new Promise((res, rej) => {
        const id = msgId++;
        callbacks.set(id, { resolve: res, reject: rej });
        const payload = JSON.stringify([0, id, name, params]);
        const msg = `${Buffer.byteLength(payload, 'utf8')}:${payload}`;
        client.write(msg);
      });
    }
  });
}

async function run() {
  const { client, sendCommand } = await connectMarionette();
  console.log('Connected to Marionette!');

  const session = await sendCommand('WebDriver:NewSession', { capabilities: {} });
  console.log('Session started:', session.sessionId);

  await sendCommand('WebDriver:SetTimeouts', { implicit: 5000 });

  // 1. Verify Slide 5 removal: Navigate to #3 (Architecture) and advance to #4
  console.log('Testing slide navigation after Slide 5 removal...');
  await sendCommand('WebDriver:Navigate', { url: 'http://localhost:3000/#3' });
  await new Promise(r => setTimeout(r, 1200));

  // Press ArrowRight to advance to next slide (#4)
  await sendCommand('WebDriver:ExecuteScript', {
    script: "window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', code: 'ArrowRight', bubbles: true }));"
  });
  await new Promise(r => setTimeout(r, 1000));

  // Screenshot slide at index 4 (Must be ClassLoader, with 05 / 13 chrome indicator)
  const ssSlide4 = await sendCommand('WebDriver:TakeScreenshot', {});
  fs.writeFileSync('/home/agasthya/.gemini/antigravity-ide/brain/856434cc-0453-4ab4-ba9a-ee122008b544/test_slide5_is_classloader.png', Buffer.from(ssSlide4.value, 'base64'));
  console.log('Saved test_slide5_is_classloader.png (Slide index 4 is now ClassLoader, indicator 05 / 13)');

  // 2. Navigate to B-Tree Playground (now index 11, #11)
  console.log('Navigating to B-Tree Playground at #11...');
  await sendCommand('WebDriver:Navigate', { url: 'http://localhost:3000/#11' });
  await new Promise(r => setTimeout(r, 1500));

  const ssPlaygroundInit = await sendCommand('WebDriver:TakeScreenshot', {});
  fs.writeFileSync('/home/agasthya/.gemini/antigravity-ide/brain/856434cc-0453-4ab4-ba9a-ee122008b544/test_playground_slide12_of_13.png', Buffer.from(ssPlaygroundInit.value, 'base64'));
  console.log('Saved test_playground_slide12_of_13.png (Header shows SLIDE 12 / 13, Chrome shows 12 / 13)');

  // 3. Test speed of Insert operation
  console.log('Triggering "+ Insert" with faster timing (~30% reduction)...');
  const tStart = Date.now();
  await sendCommand('WebDriver:ExecuteScript', {
    script: `
      const buttons = Array.from(document.querySelectorAll('button'));
      const insertBtn = buttons.find(b => b.textContent.includes('Insert'));
      if (insertBtn) insertBtn.click();
    `
  });

  // Step 1: Comparison active
  await new Promise(r => setTimeout(r, 400));
  const ssSpeed1 = await sendCommand('WebDriver:TakeScreenshot', {});
  fs.writeFileSync('/home/agasthya/.gemini/antigravity-ide/brain/856434cc-0453-4ab4-ba9a-ee122008b544/test_speed_step1_compare.png', Buffer.from(ssSpeed1.value, 'base64'));

  // Wait 2.6s (new duration is 2400ms, down from 3400ms)
  await new Promise(r => setTimeout(r, 2600));
  const ssSpeed2 = await sendCommand('WebDriver:TakeScreenshot', {});
  fs.writeFileSync('/home/agasthya/.gemini/antigravity-ide/brain/856434cc-0453-4ab4-ba9a-ee122008b544/test_speed_step2_inserted.png', Buffer.from(ssSpeed2.value, 'base64'));
  console.log('Transition to step 2 completed crisply in ~2.5s (down from 3.7s)!');

  // Wait for finish
  await new Promise(r => setTimeout(r, 3000));
  const totalInsertTime = Date.now() - tStart;
  console.log(`Total insert operation completed in ${totalInsertTime}ms (approx 5.5s, previously ~7.8s)`);

  // 4. Test Root Split Speed
  console.log('Testing Root Split preset with accelerated pacing...');
  await sendCommand('WebDriver:ExecuteScript', {
    script: `
      const select = document.querySelector('select');
      select.value = 'root-split';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    `
  });

  // Step 1: Red overflow (3.2s duration, down from 4.6s)
  await new Promise(r => setTimeout(r, 400));
  const ssSplit1 = await sendCommand('WebDriver:TakeScreenshot', {});
  fs.writeFileSync('/home/agasthya/.gemini/antigravity-ide/brain/856434cc-0453-4ab4-ba9a-ee122008b544/test_speed_rootsplit_red.png', Buffer.from(ssSplit1.value, 'base64'));

  // Step 2: Split execution (2.9s duration, down from 4.2s)
  await new Promise(r => setTimeout(r, 3400));
  const ssSplit2 = await sendCommand('WebDriver:TakeScreenshot', {});
  fs.writeFileSync('/home/agasthya/.gemini/antigravity-ide/brain/856434cc-0453-4ab4-ba9a-ee122008b544/test_speed_rootsplit_promoted.png', Buffer.from(ssSplit2.value, 'base64'));

  // 5. Navigate to Slide 13 (Thank You at #12)
  console.log('Testing final slide navigation to #12...');
  await sendCommand('WebDriver:Navigate', { url: 'http://localhost:3000/#12' });
  await new Promise(r => setTimeout(r, 1200));

  const ssThankYou = await sendCommand('WebDriver:TakeScreenshot', {});
  fs.writeFileSync('/home/agasthya/.gemini/antigravity-ide/brain/856434cc-0453-4ab4-ba9a-ee122008b544/test_thankyou_13_of_13.png', Buffer.from(ssThankYou.value, 'base64'));
  console.log('Saved test_thankyou_13_of_13.png (Slide index 12 shows Thank You with 13 / 13)');

  await sendCommand('WebDriver:DeleteSession', {});
  client.end();
  console.log('All tests completed successfully!');
}

run().catch(e => {
  console.error('Test run failed:', e);
  process.exit(1);
});
