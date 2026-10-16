import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import BTreeEngineVisualizer from '../btree-engine/BTreeEngineVisualizer.jsx'
import AnimationKeyboardHint from '../components/AnimationKeyboardHint.jsx'
import {
  createEmptyTree,
  createNode,
  cloneTree,
  getAllKeys,
  treeContains,
  validateTree,
  generateInsertSteps,
  generateDeleteSteps,
  generateSearchSteps,
  rebuildTreeWithDegree,
  PRESET_EXAMPLES
} from '../btree-engine/bTreePlaygroundEngine.js'

const STATUS_COLORS = {
  cyan: {
    color: '#00f0ff',
    bg: 'rgba(0, 240, 255, 0.12)',
    border: 'rgba(0, 240, 255, 0.45)',
    glow: 'rgba(0, 240, 255, 0.25)'
  },
  green: {
    color: '#00ff88',
    bg: 'rgba(0, 255, 136, 0.12)',
    border: 'rgba(0, 255, 136, 0.45)',
    glow: 'rgba(0, 255, 136, 0.25)'
  },
  amber: {
    color: '#ffb300',
    bg: 'rgba(255, 179, 0, 0.12)',
    border: 'rgba(255, 179, 0, 0.45)',
    glow: 'rgba(255, 179, 0, 0.25)'
  },
  red: {
    color: '#ff4466',
    bg: 'rgba(255, 68, 102, 0.14)',
    border: 'rgba(255, 68, 102, 0.50)',
    glow: 'rgba(255, 68, 102, 0.30)'
  },
  purple: {
    color: '#b388ff',
    bg: 'rgba(179, 136, 255, 0.14)',
    border: 'rgba(179, 136, 255, 0.50)',
    glow: 'rgba(179, 136, 255, 0.30)'
  }
}

export default function Slide13BTreePlayground({ isActive, onRegisterAnimation }) {
  // Current tree state & configuration
  const [degree, setDegree] = useState(2)
  const [persistentTree, setPersistentTree] = useState(() => PRESET_EXAMPLES[1].getTree())
  const [activeOp, setActiveOp] = useState('INSERT')
  const [customKeyInput, setCustomKeyInput] = useState('6')
  const [toastMsg, setToastMsg] = useState('Loaded: Simple Insertion example (t=2)')

  // Degree Change Modal state
  const [degreeModalOpen, setDegreeModalOpen] = useState(false)
  const [pendingDegree, setPendingDegree] = useState(null)

  // Degree Info Tooltip state
  const [showDegreeInfo, setShowDegreeInfo] = useState(false)

  // Automatic Playback state
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const isPlayingRef = useRef(false)
  isPlayingRef.current = isPlaying
  const isPausedRef = useRef(false)
  isPausedRef.current = isPaused

  const timerRef = useRef(null)
  const generationRef = useRef(0)

  // Current Animation sequence
  const [steps, setSteps] = useState(() => {
    const initTree = PRESET_EXAMPLES[1].getTree()
    return generateInsertSteps(initTree, 6, 2).steps
  })
  const [stepIndex, setStepIndex] = useState(0)

  // References to keep callbacks fresh without re-registering
  const stepsRef = useRef(steps)
  stepsRef.current = steps
  const stepIndexRef = useRef(stepIndex)
  stepIndexRef.current = stepIndex
  const persistentTreeRef = useRef(persistentTree)
  persistentTreeRef.current = persistentTree
  const degreeRef = useRef(degree)
  degreeRef.current = degree
  const activeOpRef = useRef(activeOp)
  activeOpRef.current = activeOp
  const [hasSplit, setHasSplit] = useState(false)
  const hasSplitRef = useRef(false)

  // Helper to determine educational reading & animation duration for each phase
  const getStepDuration = useCallback((step, op = activeOpRef.current, split = hasSplitRef.current) => {
    if (!step) return (op === 'INSERT' && !split) ? 80 : 2500

    const effectiveOp = op || activeOpRef.current
    const effectiveSplit = split !== undefined ? split : hasSplitRef.current

    // Instant snappy insert ONLY when there is no splitting / node shifting
    if (effectiveOp === 'INSERT' && !effectiveSplit) {
      if (
        step.statusType === 'green' ||
        (step.statusLabel &&
          (step.statusLabel.includes('INSERTED') ||
            step.statusLabel.includes('COMPLETE')))
      ) {
        return 90
      }
      return 50
    }

    // FULL ANIMATION for:
    // 1. Insert with splitting (like splitting then insert etc)
    // 2. Delete operations
    // 3. Search operations
    // Red full-node overflow / underflow condition: clear reading pause
    if (step.statusType === 'red' || (step.statusLabel && step.statusLabel.includes('OVERFLOW'))) {
      return 3200
    }
    // Structural updates: split, promotion, borrow rotation, merge, root collapse
    if (
      step.statusType === 'purple' ||
      (step.statusLabel &&
        (step.statusLabel.includes('SPLIT') ||
          step.statusLabel.includes('BORROW') ||
          step.statusLabel.includes('MERGE') ||
          step.statusLabel.includes('COLLAPSE') ||
          step.statusLabel.includes('PROMOTION') ||
          step.statusLabel.includes('ROTATION')))
    ) {
      return 2900
    }
    // Completed final result: verify resulting tree state
    if (
      step.statusType === 'green' ||
      (step.statusLabel &&
        (step.statusLabel.includes('INSERTED') ||
          step.statusLabel.includes('DELETED') ||
          step.statusLabel.includes('FOUND') ||
          step.statusLabel.includes('COMPLETE')))
    ) {
      return 2800
    }
    // Comparison and descent traversal
    return 2400
  }, [])

  // Safely stop playback
  const stopPlayback = useCallback(() => {
    generationRef.current++
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setIsPlaying(false)
    setIsPaused(false)
  }, [])

  // Schedule subsequent steps in the automatic demonstration
  const scheduleNextStep = useCallback((idx, stepsList, gen, op = activeOpRef.current, split = hasSplitRef.current) => {
    if (gen !== generationRef.current) return
    if (!stepsList || idx >= stepsList.length) {
      setIsPlaying(false)
      return
    }

    const currentStepObj = stepsList[idx]
    const dur = getStepDuration(currentStepObj, op, split)

    timerRef.current = setTimeout(() => {
      if (gen !== generationRef.current) return

      if (idx < stepsList.length - 1) {
        const nextIdx = idx + 1
        setStepIndex(nextIdx)

        // If reaching the final step, commit resulting tree to persistent state immediately
        if (nextIdx === stepsList.length - 1) {
          const finalTree = stepsList[nextIdx].treeDisplay
          if (finalTree) {
            setPersistentTree(finalTree)
          }
        }

        scheduleNextStep(nextIdx, stepsList, gen, op, split)
      } else {
        // Last step finished its full display duration
        const finalTree = stepsList[idx].treeDisplay
        if (finalTree) {
          setPersistentTree(finalTree)
        }
        setIsPlaying(false)
        timerRef.current = null
      }
    }, dur)
  }, [getStepDuration])

  // Helper to choose a smart key if input is empty
  const getSmartKey = useCallback((opType, tree, t) => {
    const keys = getAllKeys(tree)
    if (opType === 'INSERT') {
      const candidates = [6, 12, 17, 25, 4, 15, 30, 8, 35, 45, 50, 7, 22, 14, 28]
      for (const cand of candidates) {
        if (!keys.includes(cand)) return cand
      }
      return keys.length > 0 ? Math.max(...keys) + 5 : 10
    }
    if (opType === 'DELETE' || opType === 'SEARCH') {
      if (keys.length === 0) return 10
      // Pick a representative key (middle or leaf key)
      return keys[Math.floor(keys.length / 2)]
    }
    return 10
  }, [])

  // Starts and automatically plays an entire operation with a single click
  const startOperation = useCallback(
    (opType, keyToUse = null, currentTreeOverride = null, degreeOverride = null) => {
      // Cancel previous in-flight animation timer
      generationRef.current++
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }

      const curTree = currentTreeOverride || persistentTreeRef.current
      const curDegree = degreeOverride || degreeRef.current

      let key = keyToUse
      if (key === null || key === undefined || isNaN(key)) {
        if (customKeyInput && customKeyInput.trim() !== '' && !isNaN(Number(customKeyInput))) {
          key = Number(customKeyInput)
        } else {
          key = getSmartKey(opType, curTree, curDegree)
        }
      }

      setCustomKeyInput(String(key))
      setActiveOp(opType)
      activeOpRef.current = opType

      let result
      let isSplit = false
      if (opType === 'INSERT') {
        result = generateInsertSteps(curTree, key, curDegree)
        isSplit = result.steps.some(step =>
          (step.statusType === 'red' || step.statusType === 'purple') ||
          (step.statusLabel && (
            step.statusLabel.includes('SPLIT') ||
            step.statusLabel.includes('OVERFLOW') ||
            step.statusLabel.includes('PROMOTION')
          ))
        )
      } else if (opType === 'DELETE') {
        result = generateDeleteSteps(curTree, key, curDegree)
      } else {
        result = generateSearchSteps(curTree, key, curDegree)
      }

      setHasSplit(isSplit)
      hasSplitRef.current = isSplit

      setSteps(result.steps)
      setStepIndex(0)
      setIsPlaying(true)
      setIsPaused(false)
      setToastMsg(`Demonstrating ${opType}: Key ${key}`)

      const currentGen = generationRef.current

      // Automatically advance through all steps
      if (result.steps.length > 1) {
        scheduleNextStep(0, result.steps, currentGen, opType, isSplit)
      } else {
        // Single step operation (e.g. duplicate check or initial node)
        const dur = getStepDuration(result.steps[0], opType, isSplit)
        timerRef.current = setTimeout(() => {
          if (currentGen !== generationRef.current) return
          if (result.steps[0].treeDisplay) {
            setPersistentTree(result.steps[0].treeDisplay)
          }
          setIsPlaying(false)
          timerRef.current = null
        }, dur)
      }
    },
    [customKeyInput, getSmartKey, scheduleNextStep, getStepDuration]
  )

  // Step fast-forward / manual skip (Enter keypress)
  const handleNextStep = useCallback(() => {
    const currentSteps = stepsRef.current
    const curIdx = stepIndexRef.current

    if (curIdx < currentSteps.length - 1) {
      generationRef.current++
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }

      const nextIdx = curIdx + 1
      setStepIndex(nextIdx)

      if (nextIdx === currentSteps.length - 1) {
        const lastStep = currentSteps[nextIdx]
        if (lastStep.treeDisplay) {
          setPersistentTree(lastStep.treeDisplay)
        }
        setIsPlaying(false)
      } else {
        setIsPlaying(true)
        scheduleNextStep(nextIdx, currentSteps, generationRef.current, activeOpRef.current, hasSplitRef.current)
      }
    }
  }, [scheduleNextStep])

  // Step backwards (Backspace press)
  const handlePrevStep = useCallback(() => {
    const curIdx = stepIndexRef.current
    if (curIdx > 0) {
      generationRef.current++
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      setStepIndex(curIdx - 1)
      setIsPlaying(false)
    }
  }, [])

  // Restart current operation (R press)
  const handleRestart = useCallback(() => {
    startOperation(activeOp, Number(customKeyInput))
  }, [startOperation, activeOp, customKeyInput])

  // Toggle Pause/Resume (P press)
  const handleTogglePause = useCallback(() => {
    if (isPausedRef.current) {
      setIsPaused(false)
      setIsPlaying(true)
      const curIdx = stepIndexRef.current
      const currentSteps = stepsRef.current
      scheduleNextStep(curIdx, currentSteps, generationRef.current, activeOpRef.current, hasSplitRef.current)
    } else if (isPlayingRef.current) {
      generationRef.current++
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      setIsPaused(true)
      setIsPlaying(false)
    }
  }, [scheduleNextStep])

  // Clean up timers on slide unmount or when slide becomes inactive
  useEffect(() => {
    if (!isActive) {
      stopPlayback()
    }
  }, [isActive, stopPlayback])

  // Register animation handlers with App.jsx authoritative keyboard controller
  useEffect(() => {
    if (isActive && onRegisterAnimation) {
      const unregister = onRegisterAnimation({
        next: handleNextStep,
        prev: handlePrevStep,
        restart: handleRestart,
        togglePause: handleTogglePause
      })
      return () => {
        if (typeof unregister === 'function') unregister()
      }
    }
  }, [isActive, onRegisterAnimation, handleNextStep, handlePrevStep, handleRestart, handleTogglePause])

  // Handle Preset selection
  const handleSelectPreset = (presetId) => {
    const preset = PRESET_EXAMPLES.find(p => p.id === presetId)
    if (!preset) return

    const newTree = preset.getTree()
    const newDegree = preset.degree || 2
    setDegree(newDegree)
    setPersistentTree(newTree)
    setCustomKeyInput(String(preset.defaultKey))
    setToastMsg(`Loaded Preset: ${preset.name} (t=${newDegree})`)

    // Immediately start the preset operation automatically!
    startOperation(preset.defaultOp, preset.defaultKey, newTree, newDegree)
  }

  // Handle Degree Change request
  const handleDegreeChangeClick = (newT) => {
    if (newT === degree || isPlaying) return
    const keys = getAllKeys(persistentTree)
    if (keys.length === 0) {
      setDegree(newT)
      setToastMsg(`Switched to degree t=${newT}`)
      return
    }
    setPendingDegree(newT)
    setDegreeModalOpen(true)
  }

  // Confirm degree change: rebuild tree
  const confirmRebuildDegree = () => {
    if (!pendingDegree) return
    const newT = pendingDegree
    const rebuilt = rebuildTreeWithDegree(persistentTree, newT)
    setDegree(newT)
    setPersistentTree(rebuilt)
    setDegreeModalOpen(false)
    setPendingDegree(null)
    setToastMsg(`Rebuilt B-Tree with ${getAllKeys(rebuilt).length} keys for degree t=${newT}`)
    startOperation(activeOp, null, rebuilt, newT)
  }

  // Confirm degree change: reset to empty
  const confirmResetDegree = () => {
    if (!pendingDegree) return
    const newT = pendingDegree
    const empty = createEmptyTree()
    setDegree(newT)
    setPersistentTree(empty)
    setDegreeModalOpen(false)
    setPendingDegree(null)
    setToastMsg(`Reset to empty B-Tree for degree t=${newT}`)
    startOperation('INSERT', 10, empty, newT)
  }

  // Current Step details
  const currentStep = steps[stepIndex] || steps[0] || {
    title: 'B-TREE PLAYGROUND',
    explanation: 'Select an operation above and press Enter to step through the animation.',
    statusType: 'cyan',
    statusLabel: 'READY',
    treeDisplay: persistentTree,
    highlightData: { nodes: {}, edges: {} }
  }

  const sc = STATUS_COLORS[currentStep.statusType] || STATUS_COLORS.cyan
  const currentTreeData = currentStep.treeDisplay || persistentTree
  const currentHighlight = currentStep.highlightData || { nodes: {}, edges: {} }

  // Capacity calculation strings for current degree
  const maxKeys = 2 * degree - 1
  const minKeys = degree - 1
  const maxChildren = 2 * degree
  const minChildren = degree

  return (
    <section className={`slide ${isActive ? 'active' : ''}`}>
      <div
        className="slide-content-wrapper"
        style={{
          padding: '52px 48px 16px 48px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
          position: 'relative'
        }}
      >
        {/* ─── TOP SECTION: TITLE + OPERATION TOOLBAR ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span className="mono" style={{ fontSize: '13px', color: 'var(--jvm-cyan)', letterSpacing: '0.08em', fontWeight: 700 }}>
                SLIDE 12 / 13 · INTERACTIVE B-TREE PLAYGROUND
              </span>
              <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '2px 0 0 0', color: '#ffffff' }}>
                B-Tree Engine — Multi-Degree Operations & Splitting
              </h1>
            </div>

            {/* Notification / Toast pill */}
            {toastMsg && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(0, 240, 255, 0.08)',
                  border: '1px solid rgba(0, 240, 255, 0.25)',
                  borderRadius: '20px',
                  padding: '4px 14px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--jvm-cyan)'
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--jvm-cyan)' }} />
                {toastMsg}
              </div>
            )}
          </div>

          {/* ─── OPERATION TOOLBAR ─── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, rgba(13, 19, 33, 0.95), rgba(9, 13, 23, 0.98))',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              borderRadius: '12px',
              padding: '8px 16px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
            }}
          >
            {/* Left: Operation Selector + Key Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.05em' }}>
                OPERATION:
              </span>

              {/* Segmented Buttons */}
              <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', padding: '3px' }}>
                <button
                  type="button"
                  disabled={isPlaying}
                  onClick={() => startOperation('INSERT')}
                  style={{
                    background: activeOp === 'INSERT' ? 'rgba(0, 255, 136, 0.2)' : 'transparent',
                    border: activeOp === 'INSERT' ? '1px solid rgba(0, 255, 136, 0.5)' : '1px solid transparent',
                    color: activeOp === 'INSERT' ? '#00ff88' : 'var(--text-dim)',
                    padding: '5px 14px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: isPlaying ? 'not-allowed' : 'pointer',
                    opacity: isPlaying && activeOp !== 'INSERT' ? 0.4 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '14px' }}>+</span> Insert
                </button>

                <button
                  type="button"
                  disabled={isPlaying}
                  onClick={() => startOperation('DELETE')}
                  style={{
                    background: activeOp === 'DELETE' ? 'rgba(255, 68, 102, 0.2)' : 'transparent',
                    border: activeOp === 'DELETE' ? '1px solid rgba(255, 68, 102, 0.5)' : '1px solid transparent',
                    color: activeOp === 'DELETE' ? '#ff4466' : 'var(--text-dim)',
                    padding: '5px 14px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: isPlaying ? 'not-allowed' : 'pointer',
                    opacity: isPlaying && activeOp !== 'DELETE' ? 0.4 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '14px' }}>−</span> Delete
                </button>

                <button
                  type="button"
                  disabled={isPlaying}
                  onClick={() => startOperation('SEARCH')}
                  style={{
                    background: activeOp === 'SEARCH' ? 'rgba(0, 240, 255, 0.2)' : 'transparent',
                    border: activeOp === 'SEARCH' ? '1px solid rgba(0, 240, 255, 0.5)' : '1px solid transparent',
                    color: activeOp === 'SEARCH' ? '#00f0ff' : 'var(--text-dim)',
                    padding: '5px 14px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: isPlaying ? 'not-allowed' : 'pointer',
                    opacity: isPlaying && activeOp !== 'SEARCH' ? 0.4 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>🔍</span> Search
                </button>
              </div>

              {/* Custom Key Input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="mono" style={{ fontSize: '11px', color: 'var(--text-dim)' }}>KEY:</span>
                <input
                  type="number"
                  disabled={isPlaying}
                  value={customKeyInput}
                  onChange={(e) => setCustomKeyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.stopPropagation()
                      if (!isPlaying) startOperation(activeOp, Number(customKeyInput))
                    }
                  }}
                  placeholder="e.g. 15"
                  style={{
                    width: '64px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    color: '#ffffff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    fontWeight: 700,
                    textAlign: 'center',
                    outline: 'none',
                    opacity: isPlaying ? 0.5 : 1,
                    cursor: isPlaying ? 'not-allowed' : 'text'
                  }}
                />
                <button
                  type="button"
                  disabled={isPlaying}
                  onClick={() => startOperation(activeOp, Number(customKeyInput))}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    cursor: isPlaying ? 'not-allowed' : 'pointer',
                    opacity: isPlaying ? 0.5 : 1
                  }}
                >
                  Set
                </button>
              </div>

              {/* In-flight Operation Status Pill */}
              {isPlaying && (
                <div
                  className="mono"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    color: sc.color,
                    background: sc.bg,
                    border: `1px solid ${sc.border}`,
                    borderRadius: '6px',
                    padding: '3px 10px',
                    letterSpacing: '0.04em'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: sc.color }} />
                  RUNNING...
                </div>
              )}
            </div>

            {/* Center: Degree Selector with Formula Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 700 }}>
                DEGREE t:
              </span>

              <div style={{ display: 'flex', gap: '4px' }}>
                {[2, 3, 4, 5].map((t) => (
                  <button
                    key={t}
                    type="button"
                    disabled={isPlaying}
                    onClick={() => handleDegreeChangeClick(t)}
                    style={{
                      background: degree === t ? 'rgba(179, 136, 255, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      border: degree === t ? '1px solid #b388ff' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: degree === t ? '#b388ff' : 'var(--text-dim)',
                      borderRadius: '6px',
                      padding: '3px 10px',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      cursor: isPlaying ? 'not-allowed' : 'pointer',
                      opacity: isPlaying && degree !== t ? 0.4 : 1,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    t = {t}
                  </button>
                ))}
              </div>

              {/* Tooltip trigger for degree formula */}
              <button
                type="button"
                onClick={() => setShowDegreeInfo(!showDegreeInfo)}
                onMouseEnter={() => setShowDegreeInfo(true)}
                onMouseLeave={() => setShowDegreeInfo(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'var(--text-dim)',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ℹ
              </button>

              {/* Floating Degree Formula Tooltip */}
              {showDegreeInfo && (
                <div
                  style={{
                    position: 'absolute',
                    top: '36px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '320px',
                    background: 'rgba(11, 16, 28, 0.98)',
                    border: '1px solid rgba(179, 136, 255, 0.4)',
                    boxShadow: '0 12px 36px rgba(0,0,0,0.8), 0 0 20px rgba(179, 136, 255, 0.2)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    zIndex: 50,
                    pointerEvents: 'none'
                  }}
                >
                  <div className="mono" style={{ fontSize: '11px', color: '#b388ff', fontWeight: 800, marginBottom: '6px' }}>
                    MINIMUM DEGREE FORMULAS (t = {degree})
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-main)', lineHeight: 1.6 }}>
                    <div>• <strong>Max Keys/Node:</strong> 2t − 1 = <strong>{maxKeys}</strong></div>
                    <div>• <strong>Min Keys/Node (non-root):</strong> t − 1 = <strong>{minKeys}</strong></div>
                    <div>• <strong>Max Children/Node:</strong> 2t = <strong>{maxChildren}</strong></div>
                    <div>• <strong>Min Children/Node:</strong> t = <strong>{minChildren}</strong></div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Preset Examples Dropdown + Reset */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 700 }}>
                TEACHING PRESETS:
              </span>

              <select
                disabled={isPlaying}
                onChange={(e) => {
                  if (e.target.value) handleSelectPreset(e.target.value)
                }}
                defaultValue="simple-insert"
                style={{
                  background: 'rgba(11, 16, 28, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  cursor: isPlaying ? 'not-allowed' : 'pointer',
                  opacity: isPlaying ? 0.5 : 1,
                  outline: 'none'
                }}
              >
                <optgroup label="Setup">
                  <option value="empty">Empty Tree</option>
                </optgroup>
                <optgroup label="Insertions & Splits">
                  <option value="simple-insert">Simple Insertion (Leaf Room)</option>
                  <option value="root-split">Root Split (Capacity Overflow)</option>
                  <option value="child-split">Internal Child Split (Proactive)</option>
                </optgroup>
                <optgroup label="Searching">
                  <option value="search-hit">Successful Search (Hit)</option>
                  <option value="search-miss">Unsuccessful Search (Miss)</option>
                </optgroup>
                <optgroup label="Deletions">
                  <option value="del-leaf">Leaf Deletion (Direct)</option>
                  <option value="del-borrow">Deletion: Borrow from Sibling</option>
                  <option value="del-merge">Deletion: Sibling Merge</option>
                  <option value="del-collapse">Deletion: Root Collapse</option>
                </optgroup>
              </select>

              <button
                type="button"
                disabled={isPlaying}
                onClick={() => {
                  const empty = createEmptyTree()
                  setPersistentTree(empty)
                  setToastMsg('Tree cleared to empty state')
                  startOperation('INSERT', 10, empty, degree)
                }}
                style={{
                  background: 'rgba(255, 68, 102, 0.1)',
                  border: '1px solid rgba(255, 68, 102, 0.3)',
                  color: '#ff4466',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  cursor: isPlaying ? 'not-allowed' : 'pointer',
                  opacity: isPlaying ? 0.5 : 1
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* ─── CENTRAL STAGE: B-TREE VISUALIZER ─── */}
        <div
          style={{
            position: 'relative',
            background: 'linear-gradient(180deg, rgba(8, 12, 22, 0.90) 0%, rgba(5, 8, 16, 0.98) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.08), 0 16px 40px rgba(0, 0, 0, 0.5)',
            height: '635px',
            overflow: 'hidden',
            margin: '6px 0'
          }}
        >
          {/* Subtle grid background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
              pointerEvents: 'none'
            }}
          />

          {/* Active Status Badge in Top-Left Corner of Tree Stage */}
          <div
            style={{
              position: 'absolute',
              top: '14px',
              left: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              zIndex: 10
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: '10px',
                fontWeight: 800,
                color: sc.color,
                background: sc.bg,
                border: `1px solid ${sc.border}`,
                padding: '4px 10px',
                borderRadius: '6px',
                letterSpacing: '0.06em',
                boxShadow: `0 0 12px ${sc.glow}`
              }}
            >
              {activeOp}: {customKeyInput || 'Auto'} (t = {degree})
            </div>

            <div
              className="mono"
              style={{
                fontSize: '10px',
                color: 'var(--text-dim)',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '4px 10px',
                borderRadius: '6px'
              }}
            >
              KEYS: [{getAllKeys(currentTreeData).join(', ') || 'none'}]
            </div>
          </div>

          {/* Native SVG B-Tree Visualizer */}
          <BTreeEngineVisualizer
            nodeData={currentTreeData}
            highlightData={currentHighlight}
            width={1808}
            height={625}
            centered={true}
            large={true}
            degree={degree}
            fastTransition={activeOp === 'INSERT' && !hasSplit}
          />
        </div>

        {/* ─── BOTTOM SECTION: INTEGRATED EXPLANATION PANEL ─── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            gap: '24px',
            alignItems: 'center',
            background: 'linear-gradient(145deg, rgba(11, 16, 28, 0.94), rgba(8, 12, 22, 0.98))',
            borderRadius: '16px',
            border: `1.5px solid ${sc.border}`,
            padding: '16px 28px',
            boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 25px ${sc.bg}`,
            transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
            minHeight: '115px'
          }}
        >
          {/* Left Column: Step counter & Status Label */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              minWidth: '130px'
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: '32px',
                fontWeight: 900,
                color: sc.color,
                lineHeight: 1,
                textShadow: `0 0 20px ${sc.glow}`
              }}
            >
              {stepIndex + 1}
              <span style={{ fontSize: '15px', color: 'var(--text-dim)', fontWeight: 600 }}>
                {' '}/ {steps.length}
              </span>
            </div>

            <div
              className="mono"
              style={{
                fontSize: '10px',
                fontWeight: 900,
                color: sc.color,
                background: sc.bg,
                border: `1px solid ${sc.border}`,
                padding: '3px 8px',
                borderRadius: '6px',
                letterSpacing: '0.06em',
                whiteSpace: 'nowrap',
                textAlign: 'center'
              }}
            >
              {currentStep.statusLabel || 'INSPECTING'}
            </div>
          </div>

          {/* Center Column: Operation Title & Detailed Explanation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: sc.color,
                  boxShadow: `0 0 10px ${sc.color}`,
                  flexShrink: 0
                }}
              />
              <span
                className="mono"
                style={{
                  fontSize: '16px',
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '0.02em'
                }}
              >
                {currentStep.title}
              </span>
            </div>

            <p
              style={{
                fontSize: '15px',
                color: 'var(--text-main)',
                lineHeight: 1.5,
                margin: 0,
                maxWidth: '1200px'
              }}
            >
              {currentStep.explanation}
            </p>
          </div>

          {/* Right Column: Step Dots & Keyboard Hints */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
            {/* Progress Dots */}
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              {steps.map((_, idx) => {
                const isCurrentActive = idx === stepIndex
                const isPast = idx < stepIndex
                return (
                  <div
                    key={idx}
                    style={{
                      width: isCurrentActive ? '10px' : '6px',
                      height: isCurrentActive ? '10px' : '6px',
                      borderRadius: '50%',
                      background: isCurrentActive
                        ? sc.color
                        : isPast
                        ? 'rgba(255,255,255,0.35)'
                        : 'rgba(255,255,255,0.12)',
                      boxShadow: isCurrentActive ? `0 0 8px ${sc.color}` : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  />
                )
              })}
            </div>

            {/* Keyboard Hint */}
            <AnimationKeyboardHint
              hasStarted={true}
              customNote={isPlaying ? 'Demonstrating automatically · Enter to skip · P to pause' : 'Operation complete · Tree persisted'}
            />
          </div>
        </div>

        {/* ─── MODAL: DEGREE CHANGE CONFIRMATION ─── */}
        {degreeModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100
            }}
          >
            <div
              style={{
                width: '520px',
                background: 'linear-gradient(145deg, #0d1321, #080c16)',
                border: '1.5px solid #b388ff',
                borderRadius: '16px',
                padding: '28px 32px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(179, 136, 255, 0.3)'
              }}
            >
              <div className="mono" style={{ fontSize: '13px', color: '#b388ff', fontWeight: 800, marginBottom: '8px' }}>
                SWITCH MINIMUM DEGREE TO t = {pendingDegree}?
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: '0 0 12px 0' }}>
                Rebalance Tree Invariants
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: 1.6, margin: '0 0 20px 0' }}>
                The current tree was constructed under degree <strong>t = {degree}</strong> (max {2 * degree - 1} keys).
                Under <strong>t = {pendingDegree}</strong>, the capacity changes to max <strong>{2 * pendingDegree - 1} keys</strong>.
                How would you like to update the tree?
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  type="button"
                  onClick={confirmRebuildDegree}
                  style={{
                    background: 'rgba(179, 136, 255, 0.2)',
                    border: '1px solid #b388ff',
                    color: '#ffffff',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>Rebuild Tree (Preserve All Keys)</span>
                  <span className="mono" style={{ fontSize: '11px', color: '#b388ff' }}>Recommended</span>
                </button>

                <button
                  type="button"
                  onClick={confirmResetDegree}
                  style={{
                    background: 'rgba(255, 68, 102, 0.15)',
                    border: '1px solid rgba(255, 68, 102, 0.5)',
                    color: '#ff4466',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  Reset to Empty Tree (t = {pendingDegree})
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDegreeModalOpen(false)
                    setPendingDegree(null)
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--text-dim)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: '4px'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
