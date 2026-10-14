import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Slide04Architecture({ isActive }) {
  const pulseRef = useRef(null)

  useEffect(() => {
    if (!isActive) return
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.0 })
    tl.fromTo('.flow-line', { strokeDashoffset: 50 }, { strokeDashoffset: 0, duration: 1.8, ease: 'linear' })

    return () => {
      tl.kill()
      gsap.killTweensOf('.flow-line')
    }
  }, [isActive])

  return (
    <section className={`slide ${isActive ? 'active' : ''}`}>
      <div className="slide-content-wrapper">
        <div className="slide-header reveal"><h2 className="slide-title">JVM Architecture</h2></div>
        <div className="glass-panel reveal delay-1" style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'space-between', gap: '16px', position: 'relative' }}>

          {/* Subsystem 1: Class Loader */}
          <div className="glow-box" style={{ '--gc1': 'var(--jvm-cyan)', width: '100%', borderColor: 'rgba(6,182,212,0.4)', padding: '16px 24px', background: 'rgba(6,182,212,0.06)' }}>
            <h3 style={{ textAlign: 'center', fontWeight: 900, fontSize: '18px', color: 'var(--jvm-cyan)', marginBottom: '12px', letterSpacing: '0.05em' }}>CLASS LOADER SUBSYSTEM</h3>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                <h4 style={{ fontWeight: 800, color: '#fff', fontSize: '15px' }}>Bootstrap Loader</h4>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Core rt.jar / base modules</span>
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                <h4 style={{ fontWeight: 800, color: '#fff', fontSize: '15px' }}>Platform Loader</h4>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Standard extensions / modules</span>
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                <h4 style={{ fontWeight: 800, color: '#fff', fontSize: '15px' }}>Application Loader</h4>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Classpath user classes</span>
              </div>
            </div>
          </div>

          {/* Subsystem 2: Runtime Data Areas */}
          <div className="glow-box" style={{ '--gc1': 'var(--jvm-purple)', width: '100%', borderColor: 'rgba(168,85,247,0.4)', padding: '16px 24px', background: 'rgba(168,85,247,0.06)' }}>
            <h3 style={{ textAlign: 'center', fontWeight: 900, fontSize: '18px', color: 'var(--jvm-purple)', marginBottom: '12px', letterSpacing: '0.05em' }}>RUNTIME DATA AREAS</h3>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', alignItems: 'stretch' }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h4 style={{ fontWeight: 800, color: '#fff', marginBottom: '4px', fontSize: '15px' }}>Method Area</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-dim)', lineHeight: 1.4 }}>Class structures, static variables &amp; code.</p>
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h4 style={{ fontWeight: 800, color: '#fff', marginBottom: '4px', fontSize: '15px' }}>Heap</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-dim)', lineHeight: 1.4 }}>Dynamic objects and arrays (GC managed).</p>
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h4 style={{ fontWeight: 800, color: '#fff', marginBottom: '4px', fontSize: '15px' }}>JVM Stack</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-dim)', lineHeight: 1.4 }}>Frames, local variables, method invocations.</p>
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h4 style={{ fontWeight: 800, color: '#fff', marginBottom: '4px', fontSize: '15px' }}>PC Register</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-dim)', lineHeight: 1.4 }}>Current execution bytecode address pointer.</p>
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h4 style={{ fontWeight: 800, color: '#fff', marginBottom: '4px', fontSize: '15px' }}>Native Stack</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-dim)', lineHeight: 1.4 }}>C/C++ native method execution state.</p>
              </div>
            </div>
          </div>

          {/* Subsystem 3: Execution Engine */}
          <div className="glow-box" style={{ '--gc1': 'var(--jvm-emerald)', width: '100%', borderColor: 'rgba(16,185,129,0.4)', padding: '16px 24px', background: 'rgba(16,185,129,0.06)' }}>
            <h3 style={{ textAlign: 'center', fontWeight: 900, fontSize: '18px', color: 'var(--jvm-emerald)', marginBottom: '12px', letterSpacing: '0.05em' }}>EXECUTION ENGINE</h3>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                <h4 style={{ fontWeight: 800, color: '#fff', marginBottom: '2px', fontSize: '15px' }}>Interpreter</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Executes bytecode stream instruction by instruction.</p>
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                <h4 style={{ fontWeight: 800, color: '#fff', marginBottom: '2px', fontSize: '15px' }}>JIT Compiler</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Compiles hot paths directly to native CPU code.</p>
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                <h4 style={{ fontWeight: 800, color: '#fff', marginBottom: '2px', fontSize: '15px' }}>Garbage Collector</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Automatic reachability analysis and memory cleanup.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
