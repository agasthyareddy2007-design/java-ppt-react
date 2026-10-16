import React, { useEffect } from 'react'
import gsap from 'gsap'

export default function Slide09GarbageCollection({ isActive }) {
  useEffect(() => {
    if (!isActive) {
      gsap.killTweensOf(['#gc-scan-ring', '#gcn-c', '#gcn-e', '#gcn-f'])
      gsap.set(['#gcn-c', '#gcn-e', '#gcn-f'], { opacity: 1, scale: 1 })
      gsap.set('#gc-scan-ring', { opacity: 0, x: 0, y: -50 })
      return
    }

    const scanner = document.getElementById('gc-scan-ring')
    if (!scanner) return

    const tlgc = gsap.timeline({ repeat: -1, repeatDelay: 3.5 })
    tlgc.set(['#gcn-c', '#gcn-e', '#gcn-f'], { opacity: 1, scale: 1 })
      .set('#gc-scan-ring', { opacity: 0, x: 0, y: -50 })
      .to('#gc-scan-ring', { opacity: 1, duration: 0.5 }, 1.0)
      .to('#gc-scan-ring', { x: 335, y: 135, duration: 1.5, ease: 'power1.inOut' }, 1.5)
      .to('#gcn-c', { opacity: 0.2, scale: 0.7, duration: 0.5 }, 3.0)
      .to('#gc-scan-ring', { x: 605, y: 105, duration: 1.5, ease: 'power1.inOut' }, 4.0)
      .to('#gcn-e', { opacity: 0.2, scale: 0.7, duration: 0.5 }, 5.5)
      .to('#gc-scan-ring', { x: 635, y: 305, duration: 1.0, ease: 'power1.inOut' }, 6.5)
      .to('#gcn-f', { opacity: 0.2, scale: 0.7, duration: 0.5 }, 7.5)
      .to('#gc-scan-ring', { y: 450, opacity: 0, duration: 1.5, ease: 'power1.in' }, 8.5)

    return () => {
      tlgc.kill()
      gsap.killTweensOf(['#gc-scan-ring', '#gcn-c', '#gcn-e', '#gcn-f'])
      gsap.set(['#gcn-c', '#gcn-e', '#gcn-f'], { opacity: 1, scale: 1 })
      gsap.set('#gc-scan-ring', { opacity: 0, x: 0, y: -50 })
    }
  }, [isActive])

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
      </div>
    </section>
  )
}
