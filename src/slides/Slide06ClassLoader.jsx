import React, { useEffect, useState, useCallback } from 'react'
import gsap from 'gsap'
import AnimationKeyboardHint from '../components/AnimationKeyboardHint.jsx'

export default function Slide06ClassLoader({ isActive, onRegisterAnimation }) {
  const [activeLinkStep, setActiveLinkStep] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  // Step forward (ENTER)
  const stepForward = useCallback(() => {
    setHasStarted(true)
    setActiveLinkStep((prev) => (prev + 1) % 3)
  }, [])

  // Step backward (BACKSPACE)
  const stepBackward = useCallback(() => {
    setActiveLinkStep((prev) => (prev - 1 + 3) % 3)
  }, [])

  // Restart (R)
  const restart = useCallback(() => {
    setActiveLinkStep(0)
    setHasStarted(false)
  }, [])

  useEffect(() => {
    if (!isActive) {
      setActiveLinkStep(0)
      setHasStarted(false)
      return
    }

    const pAnim = (id) => gsap.fromTo(id, {y: -15, opacity: 0}, {y: 15, opacity: 1, duration: 0.6, ease: "power1.in", yoyo: true, repeat: -1, repeatDelay: 0.2})
    pAnim('#p6-1')
    const t2 = gsap.delayedCall(0.3, () => pAnim('#p6-2'))
    const t3 = gsap.delayedCall(0.6, () => pAnim('#p6-3'))

    return () => {
      t2.kill(); t3.kill()
      gsap.killTweensOf('.packet')
    }
  }, [isActive])

  // Register animation controls with App authoritative keyboard handler
  useEffect(() => {
    if (isActive && onRegisterAnimation) {
      return onRegisterAnimation({
        next: stepForward,
        prev: stepBackward,
        restart: restart,
        togglePause: () => {}
      })
    }
  }, [isActive, onRegisterAnimation, stepForward, stepBackward, restart])

  return (
    <section className={`slide ${isActive ? 'active' : ''}`}>
      <div className="slide-content-wrapper">
        <div className="slide-header reveal"><h2 className="slide-title">Class Loader</h2></div>
        <div className="split-grid reveal delay-1" style={{ gridTemplateColumns: '1fr 340px' }}>

          <div className="glass-panel" style={{ padding: '40px', justifyContent: 'center', gap: '28px' }}>
            <div>
              <h3 style={{ fontSize: 'var(--title-component)', color: 'var(--jvm-cyan)', fontWeight: 900, marginBottom: '8px' }}>Loading</h3>
              <p style={{ fontSize: 'var(--body-text)', color: 'var(--text-main)', lineHeight: 1.5 }}>The Class Loader finds the required class and loads its bytecode into the JVM.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--title-component)', color: 'var(--jvm-amber)', fontWeight: 900, marginBottom: '8px' }}>Linking</h3>
              <p style={{ fontSize: 'var(--body-text)', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '12px' }}>The JVM verifies the loaded class and prepares the runtime structures. Three steps:</p>
              <ul style={{ fontSize: 'var(--body-text)', color: 'var(--text-dim)', lineHeight: 1.6, paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li style={{ color: activeLinkStep === 0 ? '#fff' : 'var(--text-dim)' }}><b style={{ color: 'var(--jvm-cyan)' }}>Verification</b> — checks that class structure and bytecode are valid.</li>
                <li style={{ color: activeLinkStep === 1 ? '#fff' : 'var(--text-dim)' }}><b style={{ color: 'var(--jvm-amber)' }}>Preparation</b> — prepares memory for static data.</li>
                <li style={{ color: activeLinkStep === 2 ? '#fff' : 'var(--text-dim)' }}><b style={{ color: 'var(--jvm-emerald)' }}>Resolution</b> — resolves symbolic references when required.</li>
              </ul>
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--title-component)', color: 'var(--jvm-purple)', fontWeight: 900, marginBottom: '8px' }}>Initialization</h3>
              <p style={{ fontSize: 'var(--body-text)', color: 'var(--text-main)', lineHeight: 1.5 }}>The JVM initializes the class, executing static blocks and constructors.<br/><br/><span style={{ color: 'var(--text-dim)' }}>The result is a class ready to be executed.</span></p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <div className="glow-box" style={{ width: '85%', textAlign: 'center', padding: '16px' }}>
              <span style={{ fontWeight: 900, fontSize: 'var(--label-important)', color: 'var(--jvm-cyan)' }}>LOADING</span>
            </div>
            <div className="arrow-container" style={{ height: '35px' }}>↓<div className="packet" id="p6-1"></div></div>

            <div className="glow-box" style={{ width: '85%', textAlign: 'center', padding: '16px' }}>
              <span style={{ fontWeight: 900, fontSize: 'var(--label-important)', color: 'var(--jvm-amber)' }}>LINKING</span>
              <div style={{ display: 'flex', flexDirection: 'column', fontSize: '13px', color: 'var(--text-dim)', marginTop: '8px', lineHeight: 1.4 }}>
                <span style={{ color: activeLinkStep === 0 ? 'var(--jvm-cyan)' : 'inherit', fontWeight: activeLinkStep === 0 ? 'bold' : 'normal' }}>Verify</span>
                <span style={{ color: activeLinkStep === 1 ? 'var(--jvm-amber)' : 'inherit', fontWeight: activeLinkStep === 1 ? 'bold' : 'normal' }}>Prepare</span>
                <span style={{ color: activeLinkStep === 2 ? 'var(--jvm-emerald)' : 'inherit', fontWeight: activeLinkStep === 2 ? 'bold' : 'normal' }}>Resolve</span>
              </div>
            </div>
            <div className="arrow-container" style={{ height: '35px' }}>↓<div className="packet" id="p6-2"></div></div>

            <div className="glow-box" style={{ width: '85%', textAlign: 'center', padding: '16px' }}>
              <span style={{ fontWeight: 900, fontSize: 'var(--label-important)', color: 'var(--jvm-purple)' }}>INITIALIZATION</span>
            </div>
            <div className="arrow-container" style={{ height: '35px' }}>↓<div className="packet" id="p6-3"></div></div>

            <div style={{ fontWeight: 900, fontSize: 'var(--label-important)', color: 'var(--jvm-emerald)', background: 'rgba(16,185,129,0.1)', padding: '12px 24px', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.3)', width: '85%', textAlign: 'center' }}>
              CLASS READY
            </div>
          </div>

        </div>

        {/* ─── BOTTOM KEYBOARD HINT ─── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <AnimationKeyboardHint
            hasStarted={hasStarted}
            customNote={hasStarted ? `Linking: ${['Verification', 'Preparation', 'Resolution'][activeLinkStep]}` : null}
          />
        </div>
      </div>
    </section>
  )
}
