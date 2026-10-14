import React from 'react'
import BTreeEngineVisualizer from './BTreeEngineVisualizer.jsx'

/**
 * Native React & SVG B-Tree Renderer with In-Canvas Teaching Overlay
 * and Playback Controls (Pause / Resume / Restart / Step Navigation).
 */
export default function BTreeRenderer({
  nodeData,
  highlightData = { nodes: {}, edges: {} },
  width = 1760,
  height = 800,
  teachingOverlay = null,
  controls = null
}) {
  // Semantic status indicators: cyan, red, amber, green, purple
  const getSemanticColor = (type) => {
    switch (type) {
      case 'cyan':
      case 'inspect':
      case 'compare':
        return {
          label: 'INSPECTION / SEARCH',
          color: '#06b6d4',
          bg: 'rgba(6, 182, 212, 0.18)',
          border: 'rgba(6, 182, 212, 0.65)',
          glow: '0 0 25px rgba(6, 182, 212, 0.4)'
        }
      case 'red':
      case 'overflow':
      case 'split-required':
        return {
          label: 'OVERFLOW / SPLIT REQUIRED',
          color: '#f43f5e',
          bg: 'rgba(244, 63, 94, 0.22)',
          border: 'rgba(244, 63, 94, 0.8)',
          glow: '0 0 30px rgba(244, 63, 94, 0.5)'
        }
      case 'amber':
      case 'split':
      case 'promotion':
      case 'borrow':
      case 'merge':
      case 'underflow':
        return {
          label: 'REBALANCING / PROMOTION',
          color: '#f59e0b',
          bg: 'rgba(245, 158, 11, 0.22)',
          border: 'rgba(245, 158, 11, 0.75)',
          glow: '0 0 30px rgba(245, 158, 11, 0.5)'
        }
      case 'green':
      case 'safe':
      case 'success':
        return {
          label: 'SAFE / SUCCESSFUL',
          color: '#10b981',
          bg: 'rgba(16, 185, 129, 0.20)',
          border: 'rgba(16, 185, 129, 0.75)',
          glow: '0 0 25px rgba(16, 185, 129, 0.4)'
        }
      case 'purple':
      case 'updated':
      case 'structural':
        return {
          label: 'STRUCTURAL UPDATE COMPLETE',
          color: '#c084fc',
          bg: 'rgba(192, 132, 252, 0.22)',
          border: 'rgba(192, 132, 252, 0.8)',
          glow: '0 0 30px rgba(192, 132, 252, 0.5)'
        }
      default:
        return {
          label: 'INFO',
          color: '#06b6d4',
          bg: 'rgba(6, 182, 212, 0.18)',
          border: 'rgba(6, 182, 212, 0.5)',
          glow: '0 0 20px rgba(6, 182, 212, 0.3)'
        }
    }
  }

  const sc = teachingOverlay ? getSemanticColor(teachingOverlay.statusType) : null

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: `${height}px`,
        background: 'linear-gradient(135deg, rgba(8, 11, 19, 0.96) 0%, rgba(4, 6, 12, 0.98) 100%)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.85), 0 20px 50px rgba(0,0,0,0.6)',
        overflow: 'hidden'
      }}
    >
      {/* Background Grid Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
          opacity: 0.6
        }}
      />

      {/* In-Canvas Teaching Overlay Card */}
      {teachingOverlay && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '24px',
            zIndex: 30,
            width: '450px',
            background: 'rgba(11, 16, 28, 0.95)',
            backdropFilter: 'blur(20px)',
            border: `1.5px solid ${sc.border}`,
            borderRadius: '16px',
            padding: '20px 24px',
            boxShadow: `0 16px 40px rgba(0,0,0,0.8), ${sc.glow}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            pointerEvents: 'auto'
          }}
        >
          {/* Header Row: Step Badge + Semantic Status Badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                className="mono"
                style={{
                  fontSize: '11px',
                  fontWeight: 900,
                  color: '#ffffff',
                  background: 'rgba(255, 255, 255, 0.12)',
                  padding: '3px 10px',
                  borderRadius: '5px',
                  letterSpacing: '0.06em'
                }}
              >
                {teachingOverlay.stepLabel}
              </span>
              <span
                className="mono"
                style={{
                  fontSize: '10px',
                  fontWeight: 900,
                  color: sc.color,
                  background: sc.bg,
                  border: `1px solid ${sc.border}`,
                  padding: '3px 8px',
                  borderRadius: '5px',
                  letterSpacing: '0.06em'
                }}
              >
                {teachingOverlay.statusBadgeText || sc.label}
              </span>
            </div>

            <span className="mono" style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
              {teachingOverlay.progressLabel}
            </span>
          </div>

          {/* Operation Title & Full Explanation */}
          <div>
            <div
              style={{
                fontSize: '16px',
                color: '#ffffff',
                fontWeight: 900,
                marginBottom: '6px',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: sc.color, boxShadow: `0 0 10px ${sc.color}` }} />
              {teachingOverlay.statusTitle}
            </div>
            <p
              style={{
                fontSize: '13.5px',
                color: 'var(--text-main)',
                lineHeight: '1.6',
                margin: 0
              }}
            >
              {teachingOverlay.explanation}
            </p>
          </div>

          {/* Result Verification / Detail Note if available */}
          {teachingOverlay.resultNote && (
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.35)',
                borderLeft: `3px solid ${sc.color}`,
                padding: '8px 12px',
                borderRadius: '0 8px 8px 0',
                fontSize: '12px',
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {teachingOverlay.resultNote}
            </div>
          )}

          {/* Playback Controls Toolbar */}
          {controls && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '8px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={controls.onTogglePause}
                  title={controls.isPaused ? 'Resume sequence' : 'Pause sequence'}
                  style={{
                    background: controls.isPaused ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.22)',
                    border: `1px solid ${controls.isPaused ? 'rgba(16, 185, 129, 0.6)' : 'rgba(245, 158, 11, 0.6)'}`,
                    color: controls.isPaused ? 'var(--jvm-emerald)' : 'var(--jvm-amber)',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    transition: 'all 0.2s'
                  }}
                >
                  {controls.isPaused ? '▶ Resume' : '⏸ Pause'}
                </button>

                <button
                  onClick={controls.onRestart}
                  title="Restart from beginning"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'var(--text-main)',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    transition: 'all 0.2s'
                  }}
                >
                  ↺ Restart
                </button>
              </div>

              {/* Step indicator pills */}
              {controls.totalSteps && controls.totalSteps > 1 && (
                <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                  {Array.from({ length: controls.totalSteps }, (_, idx) => {
                    const isCur = controls.currentStepIndex === idx
                    return (
                      <button
                        key={idx}
                        onClick={() => controls.onJumpToStep && controls.onJumpToStep(idx)}
                        title={`Jump to Step ${idx + 1}`}
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          border: isCur ? '1px solid var(--jvm-cyan)' : '1px solid rgba(255,255,255,0.1)',
                          background: isCur ? 'var(--jvm-cyan)' : 'rgba(255,255,255,0.06)',
                          color: isCur ? '#000000' : 'var(--text-dim)',
                          fontSize: '10px',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: isCur ? 900 : 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0
                        }}
                      >
                        {idx + 1}
                      </button>
                    )
                  })}
                </div>
              )}

              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={controls.onPrev}
                  disabled={controls.isFirstStep}
                  title="Previous Step"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: controls.isFirstStep ? 'rgba(255, 255, 255, 0.2)' : 'var(--text-main)',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    cursor: controls.isFirstStep ? 'default' : 'pointer',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  ◀ Prev
                </button>
                <button
                  onClick={controls.onNext}
                  disabled={controls.isLastStep}
                  title="Next Step"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: controls.isLastStep ? 'rgba(255, 255, 255, 0.2)' : 'var(--text-main)',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    cursor: controls.isLastStep ? 'default' : 'pointer',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  Next ▶
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interactive Visualizer Canvas */}
      <BTreeEngineVisualizer
        nodeData={nodeData}
        highlightData={highlightData}
        width={width}
        height={height}
      />
    </div>
  )
}
