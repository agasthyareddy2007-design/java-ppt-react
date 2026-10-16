import { useState, useEffect, useRef } from 'react'
import { BTreeAnimationController, PHASES } from './animationController.js'

export { PHASES }

/**
 * Custom React hook for driving deterministic B-Tree animations with manual keyboard stepping.
 * Completely immune to StrictMode double-rendering, stale closures, and race conditions.
 */
export function useBTreeAnimator(steps, isActive, onRegisterAnimation = null) {
  const getInitialStep = () => {
    try {
      const params = new URLSearchParams(window.location.search)
      const st = params.get('step')
      if (st !== null) {
        const parsed = parseInt(st, 10)
        if (!isNaN(parsed) && parsed >= 0 && parsed < steps.length) return parsed
      }
    } catch (_) {}
    return 0
  }

  const getInitialPhase = () => {
    try {
      const params = new URLSearchParams(window.location.search)
      const ph = params.get('phase')
      if (ph && (ph === PHASES.EXECUTE || ph === PHASES.RESULT)) return ph
    } catch (_) {}
    return PHASES.EXPLAIN
  }

  const [animState, setAnimState] = useState(() => {
    const initIdx = getInitialStep()
    const initPhase = getInitialPhase()
    return {
      stepIndex: initIdx,
      phase: initPhase,
      isPaused: false,
      isActive: !!isActive,
      hasStarted: false,
      isTransitioning: false,
      currentStep: steps[initIdx] || steps[0] || null
    }
  })

  const controllerRef = useRef(null)

  // Initialize or update controller when steps change
  if (!controllerRef.current) {
    controllerRef.current = new BTreeAnimationController(steps, {
      autoAdvance: false,
      onStateChange: (newState) => {
        setAnimState({ ...newState })
      }
    })
  } else {
    controllerRef.current.steps = steps
  }

  // Handle slide mount / unmount and isActive toggle
  useEffect(() => {
    const controller = controllerRef.current
    if (!controller) return

    if (isActive) {
      const initIdx = getInitialStep()
      const initPhase = getInitialPhase()
      controller.start(initIdx, initPhase)
    } else {
      controller.stop()
    }

    return () => {
      controller.stop()
    }
  }, [isActive])

  // Register animation handlers with App keyboard manager when active
  useEffect(() => {
    if (isActive && onRegisterAnimation && controllerRef.current) {
      const controller = controllerRef.current
      const unregister = onRegisterAnimation({
        next: () => controller.next(),
        prev: () => controller.prev(),
        restart: () => controller.restart(),
        togglePause: () => controller.togglePause()
      })
      return () => {
        if (typeof unregister === 'function') unregister()
      }
    }
  }, [isActive, onRegisterAnimation])

  return {
    stepIndex: animState.stepIndex,
    phase: animState.phase,
    isPaused: animState.isPaused,
    hasStarted: animState.hasStarted,
    isTransitioning: animState.isTransitioning,
    currentStep: animState.currentStep || steps[animState.stepIndex],
    next: () => controllerRef.current?.next(),
    prev: () => controllerRef.current?.prev(),
    restart: () => controllerRef.current?.restart(),
    togglePause: () => controllerRef.current?.togglePause(),
    nextStep: () => controllerRef.current?.nextStep(),
    prevStep: () => controllerRef.current?.prevStep(),
    jumpToStep: (idx) => controllerRef.current?.jumpToStep(idx)
  }
}
