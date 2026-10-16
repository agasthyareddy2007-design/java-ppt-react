import React from 'react'

/**
 * Subtle Keyboard Hint Overlay for Animated Slides
 * Displays clean keynote-style shortcut indicators near the bottom edge.
 */
export default function AnimationKeyboardHint({ hasStarted = true, customNote = null }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(11, 16, 28, 0.88)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: '8px',
        padding: '5px 14px',
        fontSize: '11px',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-dim)',
        letterSpacing: '0.04em',
        userSelect: 'none',
        pointerEvents: 'none',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
      }}
    >
      {!hasStarted ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: 'var(--jvm-amber)',
              boxShadow: '0 0 8px var(--jvm-amber)',
              display: 'inline-block'
            }}
          />
          <span style={{ color: 'var(--jvm-amber)', fontWeight: 700 }}>
            Ready — press Enter to begin
          </span>
        </div>
      ) : customNote ? (
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{customNote}</span>
      ) : null}

      {!hasStarted && <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>}

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <kbd
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            padding: '2px 6px',
            fontSize: '10px',
            fontWeight: 700,
            color: '#fff',
            fontFamily: 'inherit'
          }}
        >
          ENTER
        </kbd>
        <span>Next animation step</span>
      </div>

      <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <kbd
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            padding: '2px 6px',
            fontSize: '10px',
            fontWeight: 700,
            color: '#fff',
            fontFamily: 'inherit'
          }}
        >
          ← →
        </kbd>
        <span>Navigate slides</span>
      </div>

      <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <kbd
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            padding: '2px 6px',
            fontSize: '10px',
            fontWeight: 700,
            color: '#fff',
            fontFamily: 'inherit'
          }}
        >
          R
        </kbd>
        <span>Restart animation</span>
      </div>
    </div>
  )
}
