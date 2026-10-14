import React from 'react'

export default function Slide15ThankYou({ isActive }) {
  return (
    <section className={`slide ${isActive ? 'active' : ''}`}>
      <div className="slide-content-wrapper" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div className="reveal" style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>

          <div className="badge-tag" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', color: 'var(--jvm-cyan)', fontSize: '15px', padding: '8px 24px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Presentation Complete
          </div>

          <h1 style={{ fontSize: 'clamp(48px, 6vw, 76px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Thank You.
          </h1>

          <p style={{ fontSize: 'clamp(18px, 2vw, 24px)', color: 'var(--text-dim)', maxWidth: '700px', lineHeight: 1.6 }}>
            Questions &amp; Discussion on JVM Architecture, Memory Management, JIT Compilation, and B-Trees.
          </p>

          <div className="glass-panel delay-1" style={{ padding: '32px 50px', marginTop: '20px', display: 'flex', gap: '60px', alignItems: 'center' }}>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>Platform</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: '#fff', fontWeight: 700 }}>React 18 + Vite</span>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }}></div>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>Animations</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--jvm-cyan)', fontWeight: 700 }}>GSAP 3 + Three.js</span>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }}></div>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>Total Slides</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--jvm-emerald)', fontWeight: 700 }}>15 Slides</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
