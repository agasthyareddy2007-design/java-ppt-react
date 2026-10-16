import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BTreeAnimationController, PHASES } from '../src/btree-engine/animationController.js';

test('Keyboard Separation: Animation Keys vs Slide Navigation Keys', () => {
  let currentSlide = 12; // Slide 13 (B-Tree Insertion)
  let animationStep = 0;
  let animationPhase = 'EXPLAIN';
  let restartCalled = false;
  let isTransitioning = false;

  const mockAnimation = {
    next: () => {
      if (isTransitioning) return; // Prevent double-press skip
      animationStep++;
      animationPhase = 'RESULT';
    },
    prev: () => {
      if (animationStep > 0) animationStep--;
      animationPhase = 'EXPLAIN';
    },
    restart: () => {
      animationStep = 0;
      animationPhase = 'EXPLAIN';
      restartCalled = true;
    }
  };

  const handleKeyDown = (e, target = { tagName: 'DIV', isContentEditable: false }) => {
    // 1. Ignore if in input
    if (['input', 'textarea', 'select'].includes(target.tagName?.toLowerCase()) || target.isContentEditable) {
      return;
    }

    // 2. Prevent key repeat on animation keys
    if (e.repeat && ['Enter', 'Backspace', 'r', 'R'].includes(e.key)) {
      return;
    }

    // 3. Slide navigation
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      currentSlide = Math.min(14, currentSlide + 1);
      return;
    }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      currentSlide = Math.max(0, currentSlide - 1);
      return;
    }

    // 4. Animation navigation
    if (e.key === 'Enter') {
      mockAnimation.next();
      return;
    }
    if (e.key === 'Backspace') {
      mockAnimation.prev();
      return;
    }
    if (e.key === 'r' || e.key === 'R') {
      mockAnimation.restart();
      return;
    }
  };

  // Test 1: Enter advances animation ONLY, does not change slide
  handleKeyDown({ key: 'Enter', repeat: false });
  assert.equal(currentSlide, 12, 'Enter must not advance slide');
  assert.equal(animationStep, 1, 'Enter must advance animation step');
  assert.equal(animationPhase, 'RESULT');

  // Test 2: Rapid double Enter when transitioning must be ignored
  isTransitioning = true;
  handleKeyDown({ key: 'Enter', repeat: false });
  assert.equal(animationStep, 1, 'Second Enter during transition must be ignored');
  isTransitioning = false;

  // Test 3: Backspace steps backward in animation ONLY, does not change slide
  handleKeyDown({ key: 'Backspace', repeat: false });
  assert.equal(currentSlide, 12, 'Backspace must not change slide');
  assert.equal(animationStep, 0, 'Backspace must step back animation');

  // Test 4: R restarts animation ONLY
  handleKeyDown({ key: 'Enter', repeat: false });
  assert.equal(animationStep, 1);
  handleKeyDown({ key: 'r', repeat: false });
  assert.equal(animationStep, 0, 'R must restart animation to step 0');
  assert.equal(restartCalled, true);

  // Test 5: Slide navigation keys (Space, ArrowRight) change slide ONLY, not animation
  handleKeyDown({ key: ' ', repeat: false });
  assert.equal(currentSlide, 13, 'Space must advance slide');
  assert.equal(animationStep, 0, 'Space must not advance animation');

  handleKeyDown({ key: 'ArrowRight', repeat: false });
  assert.equal(currentSlide, 14, 'ArrowRight must advance slide');

  handleKeyDown({ key: 'ArrowLeft', repeat: false });
  assert.equal(currentSlide, 13, 'ArrowLeft must retreat slide');

  // Test 6: Inputs ignore shortcuts
  handleKeyDown({ key: 'Enter', repeat: false }, { tagName: 'INPUT', isContentEditable: false });
  assert.equal(animationStep, 0, 'Enter inside text input must not trigger animation');

  handleKeyDown({ key: ' ', repeat: false }, { tagName: 'INPUT', isContentEditable: false });
  assert.equal(currentSlide, 13, 'Space inside text input must not advance slide');
});

test('BTreeAnimationController: Manual next(), prev(), and restart() transitions', () => {
  const steps = [
    {
      name: 'Step 1: Insert 10',
      treeBefore: { name: { id: 0, keys: [] } },
      treeAfter: { name: { id: 1, keys: ['10'] } },
      durations: { explain: 100, execute: 100, result: 100 }
    },
    {
      name: 'Step 2: Insert 20',
      treeBefore: { name: { id: 1, keys: ['10'] } },
      treeAfter: { name: { id: 1, keys: ['10', '20'] } },
      durations: { explain: 100, execute: 100, result: 100 }
    }
  ];

  const controller = new BTreeAnimationController(steps, { autoAdvance: false });
  controller.start();

  // Initial state: Step 0, EXPLAIN, waiting indefinitely for Enter
  assert.equal(controller.stepIndex, 0);
  assert.equal(controller.phase, PHASES.EXPLAIN);
  assert.equal(controller.hasStarted, false);
  assert.equal(controller.isTransitioning, false);

  // Press Enter: runs transition, settles in RESULT
  controller.next();
  assert.equal(controller.hasStarted, true);
  assert.equal(controller.stepIndex, 0);
  assert.equal(controller.phase, PHASES.EXECUTE);
  assert.equal(controller.isTransitioning, true);

  // During transition, additional next() calls are ignored
  controller.next();
  assert.equal(controller.stepIndex, 0);
  assert.equal(controller.phase, PHASES.EXECUTE);

  // Complete transition to RESULT
  controller.advance(); // simulates transition completing
  assert.equal(controller.stepIndex, 0);
  assert.equal(controller.phase, PHASES.RESULT);

  // Press Enter again: advances to Step 1 EXPLAIN
  controller.next();
  assert.equal(controller.stepIndex, 1);
  assert.equal(controller.phase, PHASES.EXPLAIN);

  // Press Backspace: deterministic step back to Step 0 EXPLAIN
  controller.prev();
  assert.equal(controller.stepIndex, 0);
  assert.equal(controller.phase, PHASES.EXPLAIN);

  // Press R: restarts cleanly
  controller.restart();
  assert.equal(controller.stepIndex, 0);
  assert.equal(controller.phase, PHASES.EXPLAIN);
  assert.equal(controller.hasStarted, false);

  controller.stop();
});
