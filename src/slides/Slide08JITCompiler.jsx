import React, { useEffect } from 'react'
import gsap from 'gsap'

export default function Slide08JITCompiler({ isActive }) {
  useEffect(() => {
    if (!isActive) return
    const pAnim = (id) => gsap.fromTo(id, {y: -15, opacity: 0}, {y: 15, opacity: 1, duration: 0.6, ease: "power1.in", yoyo: true, repeat: -1, repeatDelay: 0.2})
    pAnim('#p9-1')
    const t2 = gsap.delayedCall(0.2, () => pAnim('#p9-2'))
    const t3 = gsap.delayedCall(0.4, () => pAnim('#p9-3'))
    const t4 = gsap.delayedCall(0.6, () => pAnim('#p9-4'))

    return () => {
      t2.kill(); t3.kill(); t4.kill()
      gsap.killTweensOf('.packet')
    }
  }, [isActive])

  return (
    <section className={`slide ${isActive ? 'active' : ''}`}>
      <div className="slide-content-wrapper">
        <div className="slide-header reveal"><h2 className="slide-title">JIT Compiler</h2></div>
        <div className="split-grid reveal delay-1" style={{ gridTemplateColumns: '1fr 340px' }}>

          <div className="glass-panel" style={{ padding: '40px', justifyContent: 'center', gap: '28px', overflowY: 'auto' }}>
            <div>
              <h3 style={{ fontSize: 'var(--title-component)', color: 'var(--jvm-purple)', fontWeight: 900, marginBottom: '8px' }}>WHAT IS JIT?</h3>
              <p style={{ fontSize: 'var(--body-text)', color: 'var(--text-main)', lineHeight: 1.6 }}>The Just-In-Time compiler is part of the JVM&apos;s Execution Engine. It converts suitable Java bytecode into native machine code while the program is running.<br/><br/><span style={{ color: 'var(--text-dim)' }}>This means the JVM does not need to interpret every instruction repeatedly for the entire lifetime of the program.</span></p>
            </div>

            <div>
              <h3 style={{ fontSize: 'var(--title-component)', color: 'var(--jvm-cyan)', fontWeight: 900, marginBottom: '8px' }}>WHY DOES THE JVM USE JIT?</h3>
              <p style={{ fontSize: 'var(--body-text)', color: 'var(--text-main)', lineHeight: 1.6 }}>Interpreting bytecode instruction by instruction provides flexibility, but repeatedly executing hot loops introduces overhead.<br/><br/><span style={{ color: 'var(--text-dim)' }}>The JIT Compiler identifies code executed repeatedly and compiles it into native machine code executed directly by the processor.</span></p>
            </div>

            <div style={{ background: 'rgba(20,22,32,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontSize: 'var(--label-important)', color: 'var(--jvm-emerald)', fontWeight: 900, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Key Idea</h3>
              <p style={{ fontSize: 'var(--body-text)', color: 'var(--text-main)', lineHeight: 1.5 }}>The JVM combines <b style={{ color: '#fff' }}>interpretation + runtime compilation</b> rather than relying on only one execution technique.</p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <div className="glow-box" style={{ width: '85%', textAlign: 'center', padding: '12px' }}>
              <span style={{ fontWeight: 800, fontSize: 'var(--label-important)', color: '#fff' }}>Java Bytecode</span>
            </div>
            <div className="arrow-container" style={{ height: '30px' }}>↓<div className="packet" id="p9-1"></div></div>

            <div className="glow-box" style={{ width: '85%', textAlign: 'center', padding: '12px' }}>
              <span style={{ fontWeight: 800, fontSize: 'var(--label-important)', color: '#fff' }}>Interpreter</span>
            </div>
            <div className="arrow-container" style={{ height: '50px' }}>↓
              <div style={{ position: 'absolute', right: '110%', top: '50%', transform: 'translateY(-50%)', textAlign: 'right', whiteSpace: 'nowrap', fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.4 }}>Repeated runtime<br/>execution detected</div>
              <div className="packet" id="p9-2"></div>
            </div>

            <div className="glow-box" style={{ width: '85%', textAlign: 'center', borderColor: 'var(--jvm-purple)', padding: '16px' }}>
              <span style={{ fontWeight: 900, fontSize: 'var(--title-component)', color: 'var(--jvm-purple)' }}>JIT Compiler</span>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>Optimizing to Native...</div>
            </div>
            <div className="arrow-container" style={{ height: '30px' }}>↓<div className="packet" id="p9-3"></div></div>

            <div className="glow-box" style={{ width: '85%', textAlign: 'center', padding: '12px' }}>
              <span style={{ fontWeight: 800, fontSize: 'var(--label-important)', color: '#fff' }}>Native Machine Code</span>
            </div>
            <div className="arrow-container" style={{ height: '30px' }}>↓<div className="packet" id="p9-4"></div></div>

            <div style={{ fontWeight: 900, fontSize: 'var(--title-component)', color: '#fff', fontFamily: 'var(--font-mono)' }}>CPU</div>
          </div>

        </div>
      </div>
    </section>
  )
}
