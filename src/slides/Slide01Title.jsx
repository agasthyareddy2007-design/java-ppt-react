import React from 'react'

export default function Slide01Title({ isActive }) {
  return (
    <section className={`slide ${isActive ? 'active' : ''}`}>
      <div className="slide-content-wrapper" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <h1 className="reveal" style={{ fontSize: 'clamp(40px, 5.5vw, 84px)', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 clamp(32px, 5vh, 56px) 0', background: 'linear-gradient(to right, #fff, #d4d4d8, #a1a1aa)', WebkitBackgroundClip: 'text', color: 'transparent', textTransform: 'uppercase' }}>
          JAVA — THE LANGUAGE &amp; THE RUNTIME
        </h1>

        <div className="glass-panel reveal delay-2" style={{ flexDirection: 'row', alignItems: 'center', padding: '16px 40px', gap: '28px', borderRadius: '100px', background: 'rgba(20, 22, 32, 0.4)' }}>
          <span style={{ fontSize: 'var(--label-important)', fontWeight: 800, color: '#fff' }}>K. Agasthya Reddy</span>
          <div style={{ width: '2px', height: '24px', background: 'rgba(255,255,255,0.1)' }}></div>
          <span className="mono" style={{ fontSize: 'var(--body-text)', color: 'var(--jvm-cyan)', fontWeight: 700 }}>25B81A6768</span>
          <div style={{ width: '2px', height: '24px', background: 'rgba(255,255,255,0.1)' }}></div>
          <span className="mono" style={{ fontSize: 'var(--body-text)', color: 'var(--jvm-amber)', fontWeight: 700 }}>CSD-B</span>
        </div>
      </div>
    </section>
  )
}
