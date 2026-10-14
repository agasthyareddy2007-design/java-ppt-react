/**
 * Deterministic B-Tree Animation State Machine and Controller
 * Guarantees explicit state transitions:
 * EXPLAIN -> EXECUTE -> RESULT -> NEXT STEP
 *
 * Fully protected against:
 * - Concurrent timers
 * - Stale closures
 * - Strict mode double invocations
 * - Out-of-order callbacks
 * - Interrupted slide visits
 */

export const PHASES = {
  EXPLAIN: 'EXPLAIN',
  EXECUTE: 'EXECUTE',
  RESULT: 'RESULT'
};

export class BTreeAnimationController {
  constructor(steps, options = {}) {
    this.steps = steps;
    this.onStateChange = options.onStateChange || (() => {});
    this.loop = options.loop !== false; // default true

    this.stepIndex = 0;
    this.phase = PHASES.EXPLAIN;
    this.isPaused = false;
    this.isActive = false;

    this.timer = null;
    this.generation = 0;
    this.phaseStartTime = 0;
    this.phaseRemainingTime = 0;
  }

  getCurrentStep() {
    return this.steps[this.stepIndex];
  }

  getState() {
    return {
      stepIndex: this.stepIndex,
      phase: this.phase,
      isPaused: this.isPaused,
      isActive: this.isActive,
      currentStep: this.getCurrentStep()
    };
  }

  notify() {
    this.onStateChange(this.getState());
  }

  getDurationForCurrentPhase() {
    const step = this.getCurrentStep();
    if (!step || !step.durations) {
      // Default fallback minimums
      if (this.phase === PHASES.EXPLAIN) return 5000;
      if (this.phase === PHASES.EXECUTE) return 3000;
      return 4000;
    }

    if (this.phase === PHASES.EXPLAIN) {
      return step.durations.explain || 5000;
    } else if (this.phase === PHASES.EXECUTE) {
      return step.durations.execute || 3000;
    } else {
      // RESULT phase
      const isLastStep = this.stepIndex === this.steps.length - 1;
      if (isLastStep && step.durations.finalResult) {
        return step.durations.finalResult;
      }
      return step.durations.result || 4000;
    }
  }

  start(initialStepIndex = 0, initialPhase = PHASES.EXPLAIN) {
    this.isActive = true;
    this.isPaused = false;
    this.stepIndex = (initialStepIndex >= 0 && initialStepIndex < this.steps.length) ? initialStepIndex : 0;
    this.phase = initialPhase || PHASES.EXPLAIN;
    this.scheduleCurrentPhase();
    this.notify();
  }

  stop() {
    this.isActive = false;
    this.clearTimer();
    this.stepIndex = 0;
    this.phase = PHASES.EXPLAIN;
    this.isPaused = false;
    this.notify();
  }

  restart() {
    this.clearTimer();
    this.stepIndex = 0;
    this.phase = PHASES.EXPLAIN;
    this.isPaused = false;
    if (this.isActive) {
      this.scheduleCurrentPhase();
    }
    this.notify();
  }

  pause() {
    if (!this.isActive || this.isPaused) return;
    this.clearTimer();
    const elapsed = Date.now() - this.phaseStartTime;
    const total = this.getDurationForCurrentPhase();
    this.phaseRemainingTime = Math.max(500, total - elapsed);
    this.isPaused = true;
    this.notify();
  }

  resume() {
    if (!this.isActive || !this.isPaused) return;
    this.isPaused = false;
    const duration = this.phaseRemainingTime > 0 ? this.phaseRemainingTime : this.getDurationForCurrentPhase();
    this.scheduleTimer(duration);
    this.notify();
  }

  togglePause() {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  nextStep() {
    this.clearTimer();
    if (this.stepIndex < this.steps.length - 1) {
      this.stepIndex++;
    } else {
      this.stepIndex = 0;
    }
    this.phase = PHASES.EXPLAIN;
    this.isPaused = false;
    if (this.isActive) {
      this.scheduleCurrentPhase();
    }
    this.notify();
  }

  prevStep() {
    this.clearTimer();
    if (this.stepIndex > 0) {
      this.stepIndex--;
    } else {
      this.stepIndex = this.steps.length - 1;
    }
    this.phase = PHASES.EXPLAIN;
    this.isPaused = false;
    if (this.isActive) {
      this.scheduleCurrentPhase();
    }
    this.notify();
  }

  jumpToStep(index) {
    if (index < 0 || index >= this.steps.length) return;
    this.clearTimer();
    this.stepIndex = index;
    this.phase = PHASES.EXPLAIN;
    this.isPaused = false;
    if (this.isActive) {
      this.scheduleCurrentPhase();
    }
    this.notify();
  }

  clearTimer() {
    this.generation++;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  scheduleCurrentPhase() {
    const duration = this.getDurationForCurrentPhase();
    this.scheduleTimer(duration);
  }

  scheduleTimer(duration) {
    this.clearTimer();
    if (!this.isActive || this.isPaused) return;

    this.phaseStartTime = Date.now();
    const gen = this.generation;

    this.timer = setTimeout(() => {
      if (gen !== this.generation || !this.isActive || this.isPaused) {
        return; // Stale timer or paused
      }
      this.advance();
    }, duration);
  }

  advance() {
    if (this.phase === PHASES.EXPLAIN) {
      this.phase = PHASES.EXECUTE;
    } else if (this.phase === PHASES.EXECUTE) {
      this.phase = PHASES.RESULT;
    } else if (this.phase === PHASES.RESULT) {
      if (this.stepIndex < this.steps.length - 1) {
        this.stepIndex++;
        this.phase = PHASES.EXPLAIN;
      } else {
        if (this.loop) {
          this.stepIndex = 0;
          this.phase = PHASES.EXPLAIN;
        } else {
          this.isPaused = true;
          this.notify();
          return;
        }
      }
    }

    this.notify();
    this.scheduleCurrentPhase();
  }
}
