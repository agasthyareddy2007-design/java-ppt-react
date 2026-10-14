import React, { useEffect } from 'react'
import gsap from 'gsap'

export default function Slide10PlatformIndependence({ isActive }) {
  useEffect(() => {
    if (!isActive) return
    const pAnim = (id) => gsap.fromTo(id, {y: -15, opacity: 0}, {y: 15, opacity: 1, duration: 0.6, ease: "power1.in", yoyo: true, repeat: -1, repeatDelay: 0.2})
    pAnim('#p11-3')
    const tl1 = gsap.fromTo('#p11-4L', {x: 0, opacity: 1}, {x: -140, opacity: 0, duration: 0.8, repeat: -1, ease: "power1.in"})
    const tl2 = gsap.fromTo('#p11-4R', {x: 0, opacity: 1}, {x: 140, opacity: 0, duration: 0.8, repeat: -1, ease: "power1.in"})
    pAnim('#p11-5L')
    pAnim('#p11-5C')
    pAnim('#p11-5R')

    return () => {
      tl1.kill(); tl2.kill()
      gsap.killTweensOf(['#p11-3', '#p11-4L', '#p11-4R', '#p11-5L', '#p11-5C', '#p11-5R'])
    }
  }, [isActive])

  return (
    <section className={`slide ${isActive ? 'active' : ''}`}>
      <div className="slide-content-wrapper">
        <div className="slide-header reveal"><h2 className="slide-title">Platform Independence</h2></div>
        <div className="split-grid reveal delay-1" style={{ gridTemplateColumns: '1fr 400px' }}>

          <div className="glass-panel" style={{ padding: '40px', justifyContent: 'center', gap: '20px', overflowY: 'auto' }}>
            <h3 style={{ fontSize: 'var(--label-important)', color: 'var(--jvm-cyan)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Core Idea</h3>
            <p style={{ fontSize: 'var(--body-text)', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '16px' }}>Java source code is compiled into bytecode rather than directly into machine code for one specific operating system. The bytecode can then be executed by a JVM implementation designed for the target platform.</p>

            <ul style={{ fontSize: 'var(--body-text)', color: 'var(--text-dim)', lineHeight: 1.6, paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <li><b style={{ color: '#fff' }}>1. Source code is compiled once</b> — The Java compiler converts <span className="mono">.java</span> into <span className="mono">.class</span> bytecode.</li>
              <li><b style={{ color: '#fff' }}>2. Bytecode is platform-independent</b> — The bytecode is not tied to a particular operating system or processor.</li>
              <li><b style={{ color: '#fff' }}>3. JVM is platform-specific</b> — Windows, Linux and macOS have JVM implementations tailored to their system APIs.</li>
              <li><b style={{ color: '#fff' }}>4. Universal bytecode, distinct runtimes</b> — A compiled program runs across different systems without recompilation.</li>
              <li><b style={{ color: '#fff' }}>5. Write Once, Run Anywhere</b> — The bytecode travels; the platform-specific JVM abstracts OS differences.</li>
            </ul>
          </div>

          <div className="glass-panel" style={{ padding: '24px', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <div className="glow-box" style={{ width: '70%', textAlign: 'center', padding: '12px' }}>
              <span style={{ fontWeight: 900, fontSize: 'var(--label-important)', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>BYTECODE</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', margin: '20px 0' }}>
              <div style={{ height: '30px', width: '2px', background: 'var(--text-muted)', position: 'relative' }}>
                <div className="packet" id="p11-3"></div>
              </div>
              <div style={{ width: '85%', height: '2px', background: 'var(--text-muted)', position: 'relative' }}>
                <div className="packet" id="p11-4L" style={{ top: '-2px' }}></div>
                <div className="packet" id="p11-4R" style={{ top: '-2px' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '85%' }}>
                <div style={{ height: '30px', width: '2px', background: 'var(--text-muted)', position: 'relative' }}><div className="packet" id="p11-5L"></div></div>
                <div style={{ height: '30px', width: '2px', background: 'var(--text-muted)', position: 'relative' }}><div className="packet" id="p11-5C"></div></div>
                <div style={{ height: '30px', width: '2px', background: 'var(--text-muted)', position: 'relative' }}><div className="packet" id="p11-5R"></div></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '12px' }}>
              <div className="glow-box" style={{ flex: 1, textAlign: 'center', padding: '16px', borderColor: 'var(--jvm-cyan)' }}>
                <span style={{ fontWeight: 900, fontSize: 'var(--label-important)', color: 'var(--jvm-cyan)', display: 'block' }}>JVM</span>
                <span style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: 600, marginTop: '4px', display: 'block' }}>Windows</span>
              </div>
              <div className="glow-box" style={{ flex: 1, textAlign: 'center', padding: '16px', borderColor: 'var(--jvm-cyan)' }}>
                <span style={{ fontWeight: 900, fontSize: 'var(--label-important)', color: 'var(--jvm-cyan)', display: 'block' }}>JVM</span>
                <span style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: 600, marginTop: '4px', display: 'block' }}>Linux</span>
              </div>
              <div className="glow-box" style={{ flex: 1, textAlign: 'center', padding: '16px', borderColor: 'var(--jvm-cyan)' }}>
                <span style={{ fontWeight: 900, fontSize: 'var(--label-important)', color: 'var(--jvm-cyan)', display: 'block' }}>JVM</span>
                <span style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: 600, marginTop: '4px', display: 'block' }}>macOS</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', width: '90%', padding: '0 30px', margin: '12px 0' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '20px' }}>↓</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '20px' }}>↓</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '20px' }}>↓</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '8px' }}>
              <div style={{ flex: 1, textAlign: 'center' }}><span style={{ fontWeight: 900, fontSize: '13px', color: 'var(--jvm-emerald)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Native Execution</span></div>
              <div style={{ flex: 1, textAlign: 'center' }}><span style={{ fontWeight: 900, fontSize: '13px', color: 'var(--jvm-emerald)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Native Execution</span></div>
              <div style={{ flex: 1, textAlign: 'center' }}><span style={{ fontWeight: 900, fontSize: '13px', color: 'var(--jvm-emerald)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Native Execution</span></div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
