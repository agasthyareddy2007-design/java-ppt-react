import test from 'node:test'
import assert from 'node:assert/strict'
import { BTreeAnimationController, PHASES } from '../src/btree-engine/animationController.js'

test('AnimationController: Sequential State Transitions (EXPLAIN -> EXECUTE -> RESULT -> EXPLAIN)', () => {
  const steps = [
    { name: 'Step 1', durations: { explain: 10, execute: 10, result: 10 } },
    { name: 'Step 2', durations: { explain: 10, execute: 10, result: 10 } }
  ]

  const transitions = []
  const controller = new BTreeAnimationController(steps, {
    onStateChange: (s) => transitions.push({ step: s.stepIndex, phase: s.phase }),
    loop: false
  })

  // Start sequence
  controller.start()
  assert.equal(controller.phase, PHASES.EXPLAIN)
  assert.equal(controller.stepIndex, 0)

  // Explicit advance 1: EXPLAIN -> EXECUTE
  controller.advance()
  assert.equal(controller.phase, PHASES.EXECUTE)
  assert.equal(controller.stepIndex, 0)

  // Explicit advance 2: EXECUTE -> RESULT
  controller.advance()
  assert.equal(controller.phase, PHASES.RESULT)
  assert.equal(controller.stepIndex, 0)

  // Explicit advance 3: RESULT -> EXPLAIN (Step 1)
  controller.advance()
  assert.equal(controller.phase, PHASES.EXPLAIN)
  assert.equal(controller.stepIndex, 1)

  // Explicit advance 4: EXPLAIN -> EXECUTE (Step 1)
  controller.advance()
  assert.equal(controller.phase, PHASES.EXECUTE)
  assert.equal(controller.stepIndex, 1)

  // Explicit advance 5: EXECUTE -> RESULT (Step 1)
  controller.advance()
  assert.equal(controller.phase, PHASES.RESULT)
  assert.equal(controller.stepIndex, 1)

  controller.stop()
})

test('AnimationController: Generation token protects against duplicate / stale callbacks', () => {
  const steps = [
    { name: 'Step 1', durations: { explain: 50, execute: 50, result: 50 } },
    { name: 'Step 2', durations: { explain: 50, execute: 50, result: 50 } }
  ]

  const controller = new BTreeAnimationController(steps)
  controller.start()

  const gen1 = controller.generation
  assert.ok(gen1 > 0, 'Generation token must be initialized')

  // Simulating rapid restart
  controller.restart()
  const gen2 = controller.generation
  assert.ok(gen2 > gen1, 'Restart must increment generation token to invalidate pending callbacks')

  // Calling clearTimer
  controller.clearTimer()
  const gen3 = controller.generation
  assert.ok(gen3 > gen2, 'clearTimer must increment generation token')

  controller.stop()
})

test('AnimationController: Pause and Resume preserves state', () => {
  const steps = [
    { name: 'Step 1', durations: { explain: 1000, execute: 1000, result: 1000 } }
  ]

  const controller = new BTreeAnimationController(steps)
  controller.start()
  assert.equal(controller.isPaused, false)

  controller.pause()
  assert.equal(controller.isPaused, true)
  assert.equal(controller.timer, null, 'Timer must be cleared when paused')
  assert.equal(controller.phase, PHASES.EXPLAIN, 'Phase must remain unchanged during pause')

  controller.resume()
  assert.equal(controller.isPaused, false)
  assert.ok(controller.timer !== null, 'Timer must be scheduled when resumed')

  controller.stop()
})

test('AnimationController: Slide navigation and clean restart', () => {
  const steps = [
    { name: 'Step 1', durations: { explain: 50, execute: 50, result: 50 } },
    { name: 'Step 2', durations: { explain: 50, execute: 50, result: 50 } }
  ]

  const controller = new BTreeAnimationController(steps)

  // Slide becomes active
  controller.start()
  controller.advance() // In EXECUTE phase
  assert.equal(controller.phase, PHASES.EXECUTE)

  // Leaving slide: stop()
  controller.stop()
  assert.equal(controller.isActive, false)
  assert.equal(controller.stepIndex, 0, 'Step index must reset to 0 on exit')
  assert.equal(controller.phase, PHASES.EXPLAIN, 'Phase must reset to EXPLAIN on exit')
  assert.equal(controller.timer, null, 'Timer must be null')

  // Returning to slide: start()
  controller.start()
  assert.equal(controller.isActive, true)
  assert.equal(controller.stepIndex, 0, 'Must start at step 0 on re-entry')
  assert.equal(controller.phase, PHASES.EXPLAIN, 'Must start at EXPLAIN on re-entry')

  controller.stop()
})
