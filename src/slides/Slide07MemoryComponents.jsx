import React from 'react'

export default function Slide07MemoryComponents({ isActive }) {
  const components = [
    {
      name: "Method Area",
      color: "var(--jvm-cyan)",
      border: "rgba(6,182,212,0.4)",
      bg: "rgba(6,182,212,0.06)",
      scope: "Shared across all threads",
      desc: "Stores class-level structures such as runtime constant-pool information, field and method metadata, static variables, and method bytecode as applicable to the JVM specification."
    },
    {
      name: "Heap",
      color: "var(--jvm-emerald)",
      border: "rgba(16,185,129,0.4)",
      bg: "rgba(16,185,129,0.06)",
      scope: "Shared across all threads",
      desc: "Stores class instances and arrays. It is the primary runtime memory area managed by automatic garbage collection and shared across all application threads."
    },
    {
      name: "Java Stack",
      color: "var(--jvm-purple)",
      border: "rgba(168,85,247,0.4)",
      bg: "rgba(168,85,247,0.06)",
      scope: "Isolated per thread",
      desc: "Each thread has its own JVM stack, containing stack frames for active method invocations. Frames hold local variables, operand stacks, and method return data."
    },
    {
      name: "PC Register",
      color: "var(--jvm-amber)",
      border: "rgba(245,158,11,0.4)",
      bg: "rgba(245,158,11,0.06)",
      scope: "Isolated per thread",
      desc: "Each thread has its own program counter. For non-native methods, it identifies the current JVM instruction being executed; its value is undefined for native methods."
    },
    {
      name: "Native Method Stack",
      color: "var(--jvm-rose)",
      border: "rgba(244,63,94,0.4)",
      bg: "rgba(244,63,94,0.06)",
      scope: "Isolated per thread",
      desc: "Supports native (C/C++) method execution invoked via JNI (Java Native Interface). Its exact memory format depends on the underlying OS and JVM implementation."
    }
  ]

  return (
    <section className={`slide ${isActive ? 'active' : ''}`}>
      <div className="slide-content-wrapper">
        <div className="slide-header reveal">
          <h2 className="slide-title">JVM Memory Components</h2>
        </div>
        <div className="glass-panel reveal delay-1" style={{ flex: 1, padding: '32px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px', overflowY: 'auto' }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {components.slice(0, 3).map((comp, idx) => (
              <div key={idx} className="glow-box" style={{ background: comp.bg, borderColor: comp.border, padding: '22px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 900, color: comp.color }}>{comp.name}</h3>
                  <span className="mono" style={{ fontSize: '10px', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '4px' }}>{comp.scope}</span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: 1.5 }}>{comp.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {components.slice(3, 5).map((comp, idx) => (
              <div key={idx} className="glow-box" style={{ background: comp.bg, borderColor: comp.border, padding: '22px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 900, color: comp.color }}>{comp.name}</h3>
                  <span className="mono" style={{ fontSize: '10px', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '4px' }}>{comp.scope}</span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: 1.5 }}>{comp.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
