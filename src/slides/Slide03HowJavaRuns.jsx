import React, { useEffect } from 'react'
import gsap from 'gsap'

export default function Slide03HowJavaRuns({ isActive }) {
  useEffect(() => {
    if (!isActive) return
    const pAnim = (id) => gsap.fromTo(id, {y: -15, opacity: 0}, {y: 15, opacity: 1, duration: 0.6, ease: "power1.in", yoyo: true, repeat: -1, repeatDelay: 0.2})
    pAnim('#p3-1')
    const t2 = gsap.delayedCall(0.2, () => pAnim('#p3-2'))
    const t3 = gsap.delayedCall(0.4, () => pAnim('#p3-3'))
    const t4 = gsap.delayedCall(0.6, () => pAnim('#p3-4'))
    const t5 = gsap.delayedCall(0.8, () => pAnim('#p3-5'))

    return () => {
      t2.kill(); t3.kill(); t4.kill(); t5.kill()
      gsap.killTweensOf('.packet')
    }
  }, [isActive])

  return (
    <section className={`slide ${isActive ? 'active' : ''}`}>
      <div className="slide-content-wrapper">
        <div className="slide-header reveal"><h2 className="slide-title">How Java Runs</h2></div>
        <div className="split-grid reveal delay-1" style={{ gridTemplateColumns: '1fr 340px' }}>
          <div className="glass-panel" style={{ padding: '36px', gap: '20px', overflowY: 'auto' }}>
            <div>
              <h3 style={{ fontSize: 'var(--label-important)', color: 'var(--jvm-cyan)', fontWeight: 800, marginBottom: '6px' }}>1. Java Source Code</h3>
              <p style={{ fontSize: 'var(--body-text)', color: 'var(--text-main)', lineHeight: 1.5 }}>A programmer writes Java source code in a <span className="mono">.java</span> source file. The source code is human-readable and contains classes, methods, variables and instructions.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--label-important)', color: 'var(--jvm-amber)', fontWeight: 800, marginBottom: '6px' }}>2. Compilation</h3>
              <p style={{ fontSize: 'var(--body-text)', color: 'var(--text-main)', lineHeight: 1.5 }}>The Java compiler, <span className="mono">javac</span>, translates the source code into Java bytecode.<br/><span className="mono" style={{color: 'var(--text-dim)'}}>.java → javac → .class</span><br/>The resulting <span className="mono">.class</span> file contains bytecode rather than processor-specific machine instructions.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--label-important)', color: 'var(--jvm-purple)', fontWeight: 800, marginBottom: '6px' }}>3. Bytecode</h3>
              <p style={{ fontSize: 'var(--body-text)', color: 'var(--text-main)', lineHeight: 1.5 }}>Bytecode is an intermediate instruction format designed to be executed by the JVM. It is not directly tied to Windows, Linux, macOS or one specific CPU.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--label-important)', color: 'var(--jvm-emerald)', fontWeight: 800, marginBottom: '6px' }}>4. Class Loading &amp; Runtime</h3>
              <p style={{ fontSize: 'var(--body-text)', color: 'var(--text-main)', lineHeight: 1.5 }}>The JVM loads classes, verifies them, and uses Runtime Memory areas (Heap, Stack, Method Area) before execution.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--label-important)', color: 'var(--jvm-rose)', fontWeight: 800, marginBottom: '6px' }}>5. Execution &amp; CPU</h3>
              <p style={{ fontSize: 'var(--body-text)', color: 'var(--text-main)', lineHeight: 1.5 }}>The Execution Engine interprets bytecode or compiles it via JIT into native machine instructions for the CPU.</p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', alignItems: 'center', justifyContent: 'space-around' }}>
            <div className="glow-box" style={{ '--gc1': 'var(--jvm-cyan)', width: '85%', textAlign: 'center', padding: '12px' }}>
              <div style={{ fontWeight: 800, fontSize: 'var(--label-important)' }}>Java Source</div>
            </div>
            <div className="arrow-container" style={{ height: '20px' }}>↓<div className="packet" id="p3-1"></div></div>

            <div className="glow-box" style={{ '--gc1': 'var(--jvm-amber)', width: '85%', textAlign: 'center', padding: '12px' }}>
              <div style={{ fontWeight: 800, fontSize: 'var(--label-important)' }}>javac</div>
            </div>
            <div className="arrow-container" style={{ height: '20px' }}>↓<div className="packet" id="p3-2"></div></div>

            <div className="glow-box" style={{ '--gc1': 'var(--jvm-purple)', width: '85%', textAlign: 'center', padding: '12px' }}>
              <div style={{ fontWeight: 800, fontSize: 'var(--label-important)' }}>Bytecode</div>
            </div>
            <div className="arrow-container" style={{ height: '20px' }}>↓<div className="packet" id="p3-3"></div></div>

            <div className="glow-box" style={{ '--gc1': 'var(--jvm-emerald)', width: '85%', textAlign: 'center', padding: '12px' }}>
              <div style={{ fontWeight: 800, fontSize: 'var(--label-important)' }}>JVM</div>
            </div>
            <div className="arrow-container" style={{ height: '20px' }}>↓<div className="packet" id="p3-4"></div></div>

            <div className="glow-box" style={{ '--gc1': 'var(--jvm-rose)', width: '85%', textAlign: 'center', padding: '12px' }}>
              <div style={{ fontWeight: 800, fontSize: 'var(--label-important)' }}>Execution</div>
            </div>
            <div className="arrow-container" style={{ height: '20px' }}>↓<div className="packet" id="p3-5"></div></div>

            <div style={{ fontWeight: 900, fontSize: 'var(--label-important)', color: '#fff', fontFamily: 'var(--font-mono)' }}>CPU</div>
          </div>
        </div>
      </div>
    </section>
  )
}
