import React from 'react'

export default function Slide02Features({ isActive }) {
  const features = [
    { title: 'Object-Oriented', color: 'var(--jvm-cyan)', desc: 'Java organizes programs around objects that combine data and behavior, making large programs easier to structure and maintain.' },
    { title: 'Distributed', color: 'var(--jvm-amber)', desc: 'Java provides features that support applications communicating and working across different computers and networks.' },
    { title: 'Interpreted', color: 'var(--jvm-emerald)', desc: 'Java bytecode can be executed by the JVM, allowing the same compiled program to run through JVM implementations on different systems.' },
    { title: 'Robust', color: 'var(--jvm-purple)', desc: 'Java provides strong type checking, exception handling and automatic memory management to help programs run reliably.' },
    { title: 'Secure', color: 'var(--jvm-rose)', desc: 'Java provides language and runtime mechanisms designed to reduce common programming and execution risks.' },
    { title: 'Architecture-Neutral', color: 'var(--jvm-cyan)', desc: 'Java bytecode is not designed for one specific processor architecture.' },
    { title: 'Portable', color: 'var(--jvm-amber)', desc: 'A Java program can move between systems and run wherever a compatible JVM is available.' },
    { title: 'High-Performance', color: 'var(--jvm-emerald)', desc: 'The JVM can use Just-In-Time compilation to convert frequently executed bytecode into native machine code.' },
    { title: 'Multithreaded', color: 'var(--jvm-purple)', desc: 'Java supports multiple threads so different tasks can execute concurrently within a program.' },
    { title: 'Dynamic', color: 'var(--text-main)', desc: 'Classes can be loaded and linked when they are needed during program execution.' }
  ]

  return (
    <section className={`slide ${isActive ? 'active' : ''}`}>
      <div className="slide-content-wrapper">
        <div className="slide-header reveal"><h2 className="slide-title">JAVA FEATURES — THE FOUNDATIONS OF JAVA</h2></div>
        <div className="reveal delay-1" style={{ flex: 1, display: 'flex', alignItems: 'stretch', justifyContent: 'center', height: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '16px', width: '100%' }}>
            {features.map((f, idx) => (
              <div key={idx} className="glow-box" style={{ '--gc1': f.color, gap: '10px', justifyContent: 'flex-start' }}>
                <div style={{ fontWeight: 800, fontSize: '17px', color: f.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.title}</div>
                <div style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: 1.45 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
