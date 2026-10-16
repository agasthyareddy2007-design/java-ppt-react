/**
 * Deterministic B-Tree Animation State Machine and Controller
 * Supports both manual keyboard stepping (Enter/Backspace/R) and automated sequences.
 *
 * Guarantees explicit state transitions:
 * EXPLAIN -> EXECUTE -> RESULT -> NEXT STEP EXPLAIN
 *
 * Fully protected against:
 * - Concurrent timers
 * - Stale closures
 * - Strict mode double invocations
 * - Key-repeat and rapid double-press skipping
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
    // In manual mode (autoAdvance === false), transitions execute on keypress and never auto-advance
    this.autoAdvance = options.autoAdvance !== false;

    this.stepIndex = 0;
    this.phase = PHASES.EXPLAIN;
    this.isPaused = false;
    this.isActive = false;
    this.hasStarted = false;
    this.isTransitioning = false;

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
      hasStarted: this.hasStarted,
      isTransitioning: this.isTransitioning,
      currentStep: this.getCurrentStep()
    };
  }

  notify() {
    this.onStateChange(this.getState());
  }

  getDurationForCurrentPhase() {
    const step = this.getCurrentStep();
    if (!step || !step.durations) {
      if (this.phase === PHASES.EXPLAIN) return 5000;
      if (this.phase === PHASES.EXECUTE) return 3000;
      return 4000;
    }

    if (this.phase === PHASES.EXPLAIN) {
      return step.durations.explain || 5000;
    } else if (this.phase === PHASES.EXECUTE) {
      return step.durations.execute || 3000;
    } else {
      const isLastStep = this.stepIndex === this.steps.length - 1;
      if (isLastStep && step.durations.finalResult) {
        return step.durations.finalResult;
      }
      return step.durations.result || 4000;
    }
  }

  getDurationForExecutePhase() {
    const step = this.getCurrentStep();
    if (!step || !step.durations) return 3000;
    return step.durations.execute || 3000;
  }

  start(initialStepIndex = 0, initialPhase = PHASES.EXPLAIN) {
    this.isActive = true;
    this.isPaused = false;
    this.hasStarted = false;
    this.isTransitioning = false;
    this.clearTimer();
    this.stepIndex = (initialStepIndex >= 0 && initialStepIndex < this.steps.length) ? initialStepIndex : 0;
    this.phase = initialPhase || PHASES.EXPLAIN;

    // Only schedule auto-timer if explicitly in autoAdvance mode
    if (this.autoAdvance) {
      this.scheduleCurrentPhase();
    }
    this.notify();
  }

  stop() {
    this.isActive = false;
    this.clearTimer();
    this.stepIndex = 0;
    this.phase = PHASES.EXPLAIN;
    this.isPaused = false;
    this.hasStarted = false;
    this.isTransitioning = false;
    this.notify();
  }

  restart() {
    this.clearTimer();
    this.stepIndex = 0;
    this.phase = PHASES.EXPLAIN;
    this.isPaused = false;
    this.hasStarted = false;
    this.isTransitioning = false;
    if (this.isActive && this.autoAdvance) {
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
    if (this.isTransitioning) {
      const duration = this.phaseRemainingTime > 0 ? this.phaseRemainingTime : this.getDurationForExecutePhase();
      this.scheduleExecuteTimer(duration);
    } else if (this.autoAdvance) {
      const duration = this.phaseRemainingTime > 0 ? this.phaseRemainingTime : this.getDurationForCurrentPhase();
      this.scheduleTimer(duration);
    }
    this.notify();
  }

  togglePause() {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  /**
   * Manual forward step triggered by ENTER keypress.
   * - In EXPLAIN: starts EXECUTE, runs visual transition, settles into RESULT, and WAITS.
   * - In RESULT: advances to next step EXPLAIN and WAITS.
   * - During transition: ignores keypresses to prevent skipping.
   */
  next() {
    this.isActive = true;
    if (this.isTransitioning) return; // Prevent skipping during transition

    this.hasStarted = true;

    if (this.phase === PHASES.EXPLAIN) {
      // Begin execution transition
      this.phase = PHASES.EXECUTE;
      this.isTransitioning = true;
      this.notify();

      const duration = this.getDurationForExecutePhase();
      this.scheduleExecuteTimer(duration);
    } else if (this.phase === PHASES.RESULT) {
      // Advance to next step in EXPLAIN phase
      if (this.stepIndex < this.steps.length - 1) {
        this.stepIndex++;
        this.phase = PHASES.EXPLAIN;
      } else if (this.loop) {
        this.stepIndex = 0;
        this.phase = PHASES.EXPLAIN;
      }
      this.isTransitioning = false;
      this.notify();
    } else if (this.phase === PHASES.EXECUTE) {
      // If manually advancing from EXECUTE
      this.clearTimer();
      this.phase = PHASES.RESULT;
      this.isTransitioning = false;
      this.notify();
    }
  }

  /**
   * Manual backward step triggered by BACKSPACE keypress.
   * - If transitioning: cancels transition and returns to current step EXPLAIN.
   * - If in RESULT: returns to current step EXPLAIN.
   * - If in EXPLAIN: moves back to previous step EXPLAIN.
   */
  prev() {
    this.isActive = true;

    if (this.isTransitioning) {
      this.clearTimer();
      this.isTransitioning = false;
      this.phase = PHASES.EXPLAIN;
      this.notify();
      return;
    }

    if (this.phase === PHASES.RESULT) {
      this.phase = PHASES.EXPLAIN;
      this.notify();
      return;
    }

    if (this.phase === PHASES.EXPLAIN) {
      if (this.stepIndex > 0) {
        this.stepIndex--;
        this.phase = PHASES.EXPLAIN;
        this.notify();
      }
    }
  }

  nextStep() {
    this.clearTimer();
    this.isTransitioning = false;
    if (this.stepIndex < this.steps.length - 1) {
      this.stepIndex++;
    } else {
      this.stepIndex = 0;
    }
    this.phase = PHASES.EXPLAIN;
    this.isPaused = false;
    this.notify();
  }

  prevStep() {
    this.clearTimer();
    this.isTransitioning = false;
    if (this.stepIndex > 0) {
      this.stepIndex--;
    } else {
      this.stepIndex = this.steps.length - 1;
    }
    this.phase = PHASES.EXPLAIN;
    this.isPaused = false;
    this.notify();
  }

  jumpToStep(index) {
    if (index < 0 || index >= this.steps.length) return;
    this.clearTimer();
    this.isTransitioning = false;
    this.stepIndex = index;
    this.phase = PHASES.EXPLAIN;
    this.isPaused = false;
    this.notify();
  }

  clearTimer() {
    this.generation++;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  scheduleExecuteTimer(duration) {
    this.clearTimer();
    if (!this.isActive || this.isPaused) return;

    this.phaseStartTime = Date.now();
    const gen = this.generation;

    this.timer = setTimeout(() => {
      if (gen !== this.generation || !this.isActive || this.isPaused) {
        return;
      }
      // Transition finishes: settle cleanly into RESULT phase and wait indefinitely
      this.phase = PHASES.RESULT;
      this.isTransitioning = false;
      this.timer = null;
      this.notify();
    }, duration);
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
        return;
      }
      this.advance();
    }, duration);
  }

  /**
   * Synchronous phase advance.
   * Kept for direct testing and programmatic phase progression:
   * EXPLAIN -> EXECUTE -> RESULT -> NEXT STEP EXPLAIN
   */
  advance() {
    this.clearTimer();
    this.isTransitioning = false;
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
    if (this.autoAdvance) {
      this.scheduleCurrentPhase();
    }
  }
}
