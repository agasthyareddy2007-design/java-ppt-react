import React from 'react'

export default function Slide05Overview({ isActive }) {
  return (
    <section className={`slide ${isActive ? 'active' : ''}`}>
      <div className="slide-content-wrapper">
        <div className="slide-header reveal"><h2 className="slide-title">JVM Components Overview</h2></div>
        <div className="glass-panel reveal delay-1" style={{ flex: 1, padding: '56px', display: 'flex', flexDirection: 'column', gap: '36px', justifyContent: 'center' }}>
          <div>
            <h3 style={{ fontSize: 'var(--title-component)', color: 'var(--jvm-cyan)', fontWeight: 900, marginBottom: '12px' }}>CLASS LOADER</h3>
            <p style={{ fontSize: 'var(--body-text)', color: 'var(--text-main)', lineHeight: 1.6 }}>
              The Class Loader subsystem loads Java class files into the JVM when they are required. It identifies classes, loads their bytecode and participates in preparing those classes for execution.<br/><br/>
              <span style={{ color: 'var(--text-dim)' }}>It also provides the mechanism through which different classes become available to the running Java program.</span>
            </p>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', width: '100%' }}></div>

          <div>
            <h3 style={{ fontSize: 'var(--title-component)', color: 'var(--jvm-purple)', fontWeight: 900, marginBottom: '12px' }}>RUNTIME DATA AREAS</h3>
            <p style={{ fontSize: 'var(--body-text)', color: 'var(--text-main)', lineHeight: 1.6 }}>
              Runtime Data Areas are the memory regions used by the JVM while a Java program is executing. Different areas have different responsibilities, such as storing objects, active method calls, class information and the current instruction being executed.
            </p>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', width: '100%' }}></div>

          <div>
            <h3 style={{ fontSize: 'var(--title-component)', color: 'var(--jvm-emerald)', fontWeight: 900, marginBottom: '12px' }}>EXECUTION ENGINE</h3>
            <p style={{ fontSize: 'var(--body-text)', color: 'var(--text-main)', lineHeight: 1.6 }}>
              The Execution Engine is responsible for executing Java bytecode. The Interpreter can execute instructions directly, while the JIT Compiler can translate suitable bytecode into native machine code to improve execution performance.<br/><br/>
              <span style={{ color: 'var(--text-dim)' }}>The Garbage Collector also works with the runtime memory by reclaiming memory occupied by objects that are no longer reachable.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
