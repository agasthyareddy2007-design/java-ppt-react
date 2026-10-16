import React, { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import AnimationKeyboardHint from '../components/AnimationKeyboardHint.jsx'

export default function Slide09GarbageCollection({ isActive, onRegisterAnimation }) {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const isTransitioningRef = useRef(false)
  const currentPhaseRef = useRef(0)
  currentPhaseRef.current = currentPhase

  // Deterministic state apply (for instant backward stepping or resets)
  const applyPhaseInstant = useCallback((phase) => {
    gsap.killTweensOf(['#gc-scan-ring', '#gcn-c', '#gcn-e', '#gcn-f'])
    isTransitioningRef.current = false

    const scanner = document.getElementById('gc-scan-ring')
    const c = document.getElementById('gcn-c')
    const e = document.getElementById('gcn-e')
    const f = document.getElementById('gcn-f')

    if (!scanner || !c || !e || !f) return

    gsap.set(c, { opacity: phase >= 1 ? 0.2 : 1, scale: phase >= 1 ? 0.7 : 1 })
    gsap.set(e, { opacity: phase >= 2 ? 0.2 : 1, scale: phase >= 2 ? 0.7 : 1 })
    gsap.set(f, { opacity: phase >= 3 ? 0.2 : 1, scale: phase >= 3 ? 0.7 : 1 })

    if (phase === 0) {
      gsap.set(scanner, { opacity: 0, x: 0, y: -50 })
    } else if (phase === 1) {
      gsap.set(scanner, { opacity: 1, x: 335, y: 135 })
    } else if (phase === 2) {
      gsap.set(scanner, { opacity: 1, x: 605, y: 105 })
    } else if (phase === 3) {
      gsap.set(scanner, { opacity: 1, x: 635, y: 305 })
    } else if (phase >= 4) {
      gsap.set(scanner, { opacity: 0, x: 635, y: 450 })
    }

    setCurrentPhase(phase)
  }, [])

  // Run smooth animated transition for forward step
  const runTransitionTo = useCallback((targetPhase) => {
    isTransitioningRef.current = true
    const scanner = document.getElementById('gc-scan-ring')
    if (!scanner) {
      applyPhaseInstant(targetPhase)
      return
    }

    const finish = () => {
      isTransitioningRef.current = false
      setCurrentPhase(targetPhase)
    }

    if (targetPhase === 1) {
      // Step 1: Scanner enters and sweeps to C
      gsap.set(scanner, { opacity: 0, x: 0, y: -50 })
      gsap.timeline({ onComplete: finish })
        .to(scanner, { opacity: 1, duration: 0.4 })
        .to(scanner, { x: 335, y: 135, duration: 1.2, ease: "power1.inOut" })
        .to('#gcn-c', { opacity: 0.2, scale: 0.7, duration: 0.4 }, "-=0.3")
    } else if (targetPhase === 2) {
      // Step 2: Scanner sweeps to E
      gsap.timeline({ onComplete: finish })
        .to(scanner, { x: 605, y: 105, duration: 1.2, ease: "power1.inOut" })
        .to('#gcn-e', { opacity: 0.2, scale: 0.7, duration: 0.4 }, "-=0.3")
    } else if (targetPhase === 3) {
      // Step 3: Scanner sweeps to F
      gsap.timeline({ onComplete: finish })
        .to(scanner, { x: 635, y: 305, duration: 1.0, ease: "power1.inOut" })
        .to('#gcn-f', { opacity: 0.2, scale: 0.7, duration: 0.4 }, "-=0.3")
    } else if (targetPhase === 4) {
      // Step 4: Sweep completes and scanner exits
      gsap.timeline({ onComplete: finish })
        .to(scanner, { y: 450, opacity: 0, duration: 1.2, ease: "power1.in" })
    } else {
      finish()
    }
  }, [applyPhaseInstant])

  // Step forward (ENTER)
  const stepForward = useCallback(() => {
    if (!isActive || isTransitioningRef.current) return
    setHasStarted(true)

    const nextP = currentPhaseRef.current + 1
    if (nextP <= 4) {
      runTransitionTo(nextP)
    } else {
      // Loop or restart on additional Enter at end
      applyPhaseInstant(0)
    }
  }, [isActive, runTransitionTo, applyPhaseInstant])

  // Step backward (BACKSPACE)
  const stepBackward = useCallback(() => {
    if (!isActive) return
    if (currentPhaseRef.current > 0) {
      applyPhaseInstant(currentPhaseRef.current - 1)
    }
  }, [isActive, applyPhaseInstant])

  // Restart (R)
  const restart = useCallback(() => {
    applyPhaseInstant(0)
    setHasStarted(false)
  }, [applyPhaseInstant])

  // Slide mount / unmount
  useEffect(() => {
    if (!isActive) {
      applyPhaseInstant(0)
      setHasStarted(false)
      return
    }
    applyPhaseInstant(0)
    setHasStarted(false)

    return () => {
      gsap.killTweensOf(['#gc-scan-ring', '#gcn-c', '#gcn-e', '#gcn-f'])
    }
  }, [isActive, applyPhaseInstant])

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
        <div className="slide-header reveal"><h2 className="slide-title">Garbage Collection</h2></div>
        <div className="split-grid reveal delay-1" style={{ gridTemplateColumns: '1fr 1fr', gap: '40px' }}>

          <div className="glass-panel" style={{ padding: '40px', justifyContent: 'center', gap: '28px' }}>
            <div>
              <h3 style={{ fontSize: 'var(--title-component)', color: 'var(--jvm-cyan)', fontWeight: 900, marginBottom: '12px' }}>WHAT IS GARBAGE COLLECTION?</h3>
              <p style={{ fontSize: 'var(--body-text)', color: 'var(--text-main)', lineHeight: 1.6 }}>Garbage Collection is the JVM&apos;s automatic memory-management mechanism for reclaiming memory occupied by objects that are no longer reachable by the running program.<br/><br/>The programmer does not normally need to manually free Java objects.</p>
            </div>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', width: '100%' }}></div>

            <div>
              <h3 style={{ fontSize: 'var(--title-component)', color: 'var(--jvm-amber)', fontWeight: 900, marginBottom: '12px' }}>WHY IS IT NEEDED?</h3>
              <p style={{ fontSize: 'var(--body-text)', color: 'var(--text-main)', lineHeight: 1.6 }}>Objects are continuously created while a program executes.<br/><br/><span style={{ color: 'var(--text-dim)' }}>Objects eventually become unreachable when references to them are lost. Memory is then reclaimed by the Garbage Collector automatically, avoiding memory leaks.</span></p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '100%', height: '520px', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '20px', background: 'rgba(0,0,0,0.25)' }}>
              <div className="mono" style={{ position: 'absolute', top: '20px', left: '30px', fontWeight: 900, fontSize: 'var(--label-important)', color: 'var(--text-muted)' }}>HEAP AREA</div>

              <div className="gc-node reachable" id="gcn-a" style={{ position: 'absolute', top: '100px', left: '120px' }}>A</div>
              <div className="gc-node reachable" id="gcn-b" style={{ position: 'absolute', top: '300px', left: '200px' }}>B</div>
              <div className="gc-node unreachable" id="gcn-c" style={{ position: 'absolute', top: '150px', left: '350px' }}>C</div>
              <div className="gc-node reachable" id="gcn-d" style={{ position: 'absolute', top: '360px', left: '460px' }}>D</div>
              <div className="gc-node unreachable" id="gcn-e" style={{ position: 'absolute', top: '120px', left: '620px' }}>E</div>
              <div className="gc-node unreachable" id="gcn-f" style={{ position: 'absolute', top: '320px', left: '650px' }}>F</div>
              <div className="gc-node reachable" id="gcn-g" style={{ position: 'absolute', top: '250px', left: '80px' }}>G</div>

              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.65 }}>
                <path d="M50 250 L120 135" stroke="var(--jvm-emerald)" strokeWidth="3" strokeDasharray="5,5" fill="none" markerEnd="url(#arrow)"/>
                <path d="M50 250 L200 335" stroke="var(--jvm-emerald)" strokeWidth="3" strokeDasharray="5,5" fill="none" markerEnd="url(#arrow)"/>
                <path d="M50 250 L80 285" stroke="var(--jvm-emerald)" strokeWidth="3" strokeDasharray="5,5" fill="none" markerEnd="url(#arrow)"/>
                <path d="M190 135 L460 395" stroke="var(--jvm-emerald)" strokeWidth="3" strokeDasharray="5,5" fill="none" markerEnd="url(#arrow)"/>
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--jvm-emerald)" />
                  </marker>
                </defs>
              </svg>

              <div style={{ position: 'absolute', bottom: '30px', right: '30px', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '15px', background: 'rgba(20,25,30,0.7)', padding: '18px 24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '3px solid var(--jvm-emerald)' }}></div> Reachable Reference</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '3px solid var(--text-muted)' }}></div> Unreachable / Garbage</div>
              </div>

              <div className="gc-scanner" id="gc-scan-ring" style={{ top: 0, left: 0, transform: 'translate(-15px, -15px)' }}></div>
            </div>
          </div>

        </div>

        {/* ─── BOTTOM KEYBOARD HINT ─── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <AnimationKeyboardHint
            hasStarted={hasStarted}
            customNote={hasStarted ? [
              'Ready',
              'Scanning: Node C (Unreachable)',
              'Scanning: Node E (Unreachable)',
              'Scanning: Node F (Unreachable)',
              'Reclaimed: Unreachable Memory Swept'
            ][currentPhase] : null}
          />
        </div>
      </div>
    </section>
  )
}
