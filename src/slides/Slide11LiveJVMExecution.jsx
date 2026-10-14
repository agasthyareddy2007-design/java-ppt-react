import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Slide11LiveJVMExecution({ isActive }) {
  const timelineRef = useRef(null)

  useEffect(() => {
    if (!isActive) {
      resetSimulation()
      return
    }

    startSimulation()

    return () => {
      resetSimulation()
    }
  }, [isActive])

  const resetSimulation = () => {
    if (timelineRef.current) {
      timelineRef.current.kill()
      timelineRef.current = null
    }

    // Reset rows
    for (let i = 0; i <= 15; i++) {
      const row = document.getElementById('s8-l' + i)
      if (row) row.classList.remove('active')
    }

    // Reset status
    const stateName = document.getElementById('s8-state-name')
    if (stateName) {
      stateName.innerText = 'INITIALIZING'
      stateName.style.color = 'var(--jvm-amber)'
    }

    // Method Area
    const mPlaceholder = document.getElementById('s8-m-placeholder')
    const mClass = document.getElementById('s8-m-class')
    const mCount = document.getElementById('s8-m-count')
    const mStaticBlock = document.getElementById('s8-m-static-block')
    if (mPlaceholder) { mPlaceholder.style.display = 'block'; mPlaceholder.style.opacity = '1'; }
    if (mClass) { mClass.style.display = 'none'; mClass.style.opacity = '0'; }
    if (mCount) { mCount.innerText = '10'; mCount.style.color = 'var(--text-dim)'; }
    if (mStaticBlock) { mStaticBlock.style.color = 'var(--text-dim)'; }

    // Heap
    const hPlaceholder = document.getElementById('s8-h-placeholder')
    const hObj = document.getElementById('s8-h-obj')
    if (hPlaceholder) { hPlaceholder.style.display = 'block'; hPlaceholder.style.opacity = '1'; }
    if (hObj) { hObj.style.display = 'none'; hObj.style.opacity = '0'; }

    // Stack
    const sPlaceholder = document.getElementById('s8-s-placeholder')
    const sfMain = document.getElementById('s8-sf-main')
    const sfCalc = document.getElementById('s8-sf-calc')
    const vObj = document.getElementById('s8-v-obj')
    const vXy = document.getElementById('s8-v-xy')
    const vMres = document.getElementById('s8-v-mres')
    const vAb = document.getElementById('s8-v-ab')
    const vCres = document.getElementById('s8-v-cres')
    if (sPlaceholder) { sPlaceholder.style.display = 'block'; sPlaceholder.style.opacity = '1'; }
    if (sfMain) { sfMain.style.display = 'none'; sfMain.style.opacity = '0'; }
    if (sfCalc) { sfCalc.style.display = 'none'; sfCalc.style.opacity = '0'; }
    if (vObj) { vObj.style.display = 'none'; vObj.style.opacity = '0'; }
    if (vXy) { vXy.style.display = 'none'; vXy.style.opacity = '0'; }
    if (vMres) { vMres.style.display = 'none'; vMres.style.opacity = '0'; }
    if (vAb) { vAb.style.display = 'none'; vAb.style.opacity = '0'; }
    if (vCres) { vCres.style.display = 'none'; vCres.style.opacity = '0'; }

    // PC Register
    const pcIdle = document.getElementById('s8-pc-idle')
    const pcActive = document.getElementById('s8-pc-active')
    const pcInst = document.getElementById('s8-pc-inst')
    if (pcIdle) { pcIdle.style.display = 'block'; pcIdle.style.opacity = '1'; }
    if (pcActive) { pcActive.style.display = 'none'; pcActive.style.opacity = '0'; }
    if (pcInst) { pcInst.innerText = '→ initializing'; }

    // Native Method Stack
    const nativeStatus = document.getElementById('s8-native-status')
    if (nativeStatus) {
      nativeStatus.innerText = 'IDLE'
      nativeStatus.style.color = 'var(--text-dim)'
      nativeStatus.style.background = 'rgba(255,255,255,0.05)'
    }

    // Caption Bar
    const captionText = document.getElementById('s8-caption-text')
    if (captionText) {
      captionText.innerText = 'The JVM prepares runtime memory structures before executing bytecode.'
    }

    // Console
    const consoleOut = document.getElementById('s8-console-out')
    if (consoleOut) {
      consoleOut.style.opacity = '0'
      consoleOut.innerText = ''
    }

    // Region highlights
    ['s8-panel-method', 's8-panel-heap', 's8-panel-stack', 's8-panel-pc', 's8-panel-native'].forEach(id => {
      const el = document.getElementById(id)
      if (el) el.classList.remove('active-glow')
    })
  }

  const startSimulation = () => {
    resetSimulation()

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.delayedCall(3.0, () => {
          if (isActive) {
            startSimulation()
          }
        })
      }
    })
    timelineRef.current = tl

    const highlightLine = (lineId) => {
      for (let i = 0; i <= 15; i++) {
        const row = document.getElementById('s8-l' + i)
        if (row) row.classList.remove('active')
      }
      if (lineId) {
        const target = document.getElementById(lineId)
        if (target) target.classList.add('active')
      }
    }

    const setPC = (inst) => {
      const pcIdle = document.getElementById('s8-pc-idle')
      const pcActive = document.getElementById('s8-pc-active')
      const pcInst = document.getElementById('s8-pc-inst')
      if (pcIdle) pcIdle.style.display = 'none'
      if (pcActive) {
        pcActive.style.display = 'block'
        gsap.to(pcActive, { opacity: 1, duration: 0.3 })
      }
      if (pcInst) pcInst.innerText = inst
    }

    const setState = (name, color = 'var(--jvm-amber)') => {
      const el = document.getElementById('s8-state-name')
      if (el) {
        el.innerText = name
        el.style.color = color
      }
    }

    const setCaption = (text) => {
      const el = document.getElementById('s8-caption-text')
      if (el) {
        gsap.to(el, {
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            el.innerText = text
            gsap.to(el, { opacity: 1, duration: 0.3 })
          }
        })
      }
    }

    // Phase 0: Standby
    tl.add(() => {
      setState('INITIALIZING')
      setCaption('The JVM prepares runtime memory structures before executing bytecode.')
      highlightLine(null)
    }, 0.5)

    // Phase 1: Class Loading
    tl.add(() => {
      setState('CLASS LOADING', 'var(--jvm-purple)')
      setPC('→ load Demo.class')
      highlightLine('s8-l0')
      setCaption('Demo.class metadata is loaded into the Method Area by the Class Loader.')

      const mPlaceholder = document.getElementById('s8-m-placeholder')
      const mClass = document.getElementById('s8-m-class')
      if (mPlaceholder) mPlaceholder.style.display = 'none'
      if (mClass) {
        mClass.style.display = 'block'
        gsap.fromTo(mClass, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' })
      }
      const pMethod = document.getElementById('s8-panel-method')
      if (pMethod) pMethod.classList.add('active-glow')
    }, 1.5)

    // Phase 2: Static Initialization
    tl.add(() => {
      const pMethod = document.getElementById('s8-panel-method')
      if (pMethod) pMethod.classList.remove('active-glow')
      setState('STATIC INITIALIZATION', 'var(--jvm-purple)')
      highlightLine('s8-l1')
      setPC('→ static int count = 10;')
      setCaption('Static fields are allocated and initialized inside the Method Area.')
    }, 4.5)

    tl.add(() => {
      highlightLine('s8-l2')
      setPC('→ static { count = 20; }')
      setCaption('Static initializer block runs, updating count from 10 to 20.')
      const mCount = document.getElementById('s8-m-count')
      const mStatic = document.getElementById('s8-m-static-block')
      if (mCount) {
        gsap.to(mCount, {
          color: 'var(--jvm-emerald)',
          scale: 1.25,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          onComplete: () => { mCount.innerText = '20' }
        })
      }
      if (mStatic) mStatic.style.color = 'var(--jvm-amber)'
    }, 6.8)

    // Phase 3: main() Stack Frame
    tl.add(() => {
      setState('MAIN STACK FRAME', 'var(--jvm-cyan)')
      highlightLine('s8-l8')
      setPC('→ invokestatic main(String[])')
      setCaption('Invoking main() pushes a new Stack Frame onto the call stack.')

      const sPlaceholder = document.getElementById('s8-s-placeholder')
      const sfMain = document.getElementById('s8-sf-main')
      if (sPlaceholder) sPlaceholder.style.display = 'none'
      if (sfMain) {
        sfMain.style.display = 'block'
        gsap.fromTo(sfMain, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)' })
      }
      const pStack = document.getElementById('s8-panel-stack')
      if (pStack) pStack.classList.add('active-glow')
    }, 9.5)

    // Phase 4: Object Allocation in Heap
    tl.add(() => {
      const pStack = document.getElementById('s8-panel-stack')
      if (pStack) pStack.classList.remove('active-glow')
      setState('OBJECT ALLOCATION', 'var(--jvm-emerald)')
      highlightLine('s8-l9')
      setPC('→ new Demo() (bytecode: new, dup, invokespecial)')
      setCaption('Objects are allocated in the Heap; instance variables live inside the object.')

      const hPlaceholder = document.getElementById('s8-h-placeholder')
      const hObj = document.getElementById('s8-h-obj')
      if (hPlaceholder) hPlaceholder.style.display = 'none'
      if (hObj) {
        hObj.style.display = 'block'
        gsap.fromTo(hObj, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.75, ease: 'back.out(1.7)' })
      }
      const pHeap = document.getElementById('s8-panel-heap')
      if (pHeap) pHeap.classList.add('active-glow')
    }, 13.5)

    // Phase 5: Reference Binding
    tl.add(() => {
      const pHeap = document.getElementById('s8-panel-heap')
      if (pHeap) pHeap.classList.remove('active-glow')
      setState('REFERENCE BINDING', 'var(--jvm-emerald)')
      setPC('→ Demo obj = @0x7A4F (store reference)')
      setCaption('The reference variable obj in the Stack frame points to the object in Heap.')

      const vObj = document.getElementById('s8-v-obj')
      if (vObj) {
        vObj.style.display = 'flex'
        gsap.fromTo(vObj, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' })
      }
    }, 18.0)

    // Phase 6: Local Variables
    tl.add(() => {
      setState('LOCAL VARIABLES', 'var(--jvm-cyan)')
      highlightLine('s8-l10')
      setPC('→ int x = 10; int y = 20;')
      setCaption('Primitive local variables x and y are stored directly in main() stack frame.')

      const vXy = document.getElementById('s8-v-xy')
      if (vXy) {
        vXy.style.display = 'flex'
        gsap.fromTo(vXy, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out' })
      }
    }, 22.0)

    // Phase 7: calculate() Invocation
    tl.add(() => {
      setState('METHOD INVOCATION', 'var(--jvm-amber)')
      highlightLine('s8-l12')
      setPC('→ invokevirtual calculate(x, y)')
      setCaption('A method call creates a new stack frame on top of the call stack.')

      const sfCalc = document.getElementById('s8-sf-calc')
      const vAb = document.getElementById('s8-v-ab')
      if (sfCalc) {
        sfCalc.style.display = 'block'
        gsap.fromTo(sfCalc, { opacity: 0, y: -20, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'back.out(1.4)' })
      }
      if (vAb) {
        vAb.style.display = 'flex'
        gsap.fromTo(vAb, { opacity: 0 }, { opacity: 1, delay: 0.3, duration: 0.4 })
      }
      const pStack = document.getElementById('s8-panel-stack')
      if (pStack) pStack.classList.add('active-glow')
    }, 25.5)

    // Phase 8: Calculation
    tl.add(() => {
      const pStack = document.getElementById('s8-panel-stack')
      if (pStack) pStack.classList.remove('active-glow')
      setState('CALCULATION', 'var(--jvm-amber)')
      highlightLine('s8-l5')
      setPC('→ int result = a + b; (iadd)')
      setCaption('Execution engine computes a + b (10 + 20) = 30 inside calculate().')

      const vCres = document.getElementById('s8-v-cres')
      if (vCres) {
        vCres.style.display = 'flex'
        gsap.fromTo(vCres, { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' })
      }
    }, 29.5)

    // Phase 9: Return & Pop Frame
    tl.add(() => {
      setState('FRAME POP / RETURN', 'var(--jvm-cyan)')
      highlightLine('s8-l6')
      setPC('→ return result; (ireturn: 30)')
      setCaption('A return value is sent back and the completed calculate() frame pops off.')

      const sfCalc = document.getElementById('s8-sf-calc')
      if (sfCalc) {
        gsap.to(sfCalc, { opacity: 0, y: -15, scale: 0.9, duration: 0.6, ease: 'power2.in', onComplete: () => {
          sfCalc.style.display = 'none'
        }})
      }

      const vMres = document.getElementById('s8-v-mres')
      if (vMres) {
        vMres.style.display = 'flex'
        gsap.fromTo(vMres, { opacity: 0, x: -10 }, { opacity: 1, x: 0, delay: 0.35, duration: 0.45 })
      }
    }, 33.5)

    // Phase 10: Native Execution & Output
    tl.add(() => {
      setState('NATIVE OUTPUT', 'var(--jvm-rose)')
      highlightLine('s8-l13')
      setPC('→ System.out.println(result)')
      setCaption('System.out.println() invokes the C/C++ native method layer to write to stdout.')

      const nativeStatus = document.getElementById('s8-native-status')
      if (nativeStatus) {
        nativeStatus.innerText = 'EXECUTING'
        nativeStatus.style.color = '#fff'
        nativeStatus.style.background = 'rgba(225,29,72,0.3)'
      }
      const pNative = document.getElementById('s8-panel-native')
      if (pNative) pNative.classList.add('active-glow')
    }, 37.0)

    tl.add(() => {
      const consoleOut = document.getElementById('s8-console-out')
      if (consoleOut) {
        consoleOut.innerText = '30'
        consoleOut.style.opacity = '1'
        gsap.fromTo(consoleOut, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' })
      }

      const nativeStatus = document.getElementById('s8-native-status')
      if (nativeStatus) {
        nativeStatus.innerText = 'RETURN'
        nativeStatus.style.color = 'var(--jvm-emerald)'
        nativeStatus.style.background = 'rgba(16,185,129,0.2)'
      }
      setCaption('Standard output stream receives 30. Native execution completes.')
    }, 39.0)

    // Phase 11: Completion
    tl.add(() => {
      const pNative = document.getElementById('s8-panel-native')
      if (pNative) pNative.classList.remove('active-glow')
      const nativeStatus = document.getElementById('s8-native-status')
      if (nativeStatus) {
        nativeStatus.innerText = 'IDLE'
        nativeStatus.style.color = 'var(--text-dim)'
        nativeStatus.style.background = 'rgba(255,255,255,0.05)'
      }
      setState('EXECUTION COMPLETE', 'var(--jvm-emerald)')
      highlightLine(null)
      setPC('→ Program execution terminated')
      setCaption('Execution cycle complete. All local frames destroyed.')
    }, 41.0)
  }

  return (
    <section className={`slide ${isActive ? 'active' : ''}`} id="slide-8">
      <div className="slide-content-wrapper">
        <div className="slide-header reveal" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h2 className="slide-title">LIVE JVM EXECUTION</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="badge-tag" id="s8-live-badge" style={{ background: 'rgba(245,158,11,0.12)', color: 'var(--jvm-amber)', border: '1px solid rgba(245,158,11,0.3)', fontSize: '13px', padding: '6px 14px', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--jvm-amber)', boxShadow: '0 0 10px var(--jvm-amber)', animation: 'pulseDot 1.5s infinite' }}></span>
              LIVE JVM SIMULATION
            </div>
          </div>
        </div>

        <div className="dashboard-grid reveal delay-1">

          {/* Col 1: Source Debugger */}
          <div className="dashboard-col" style={{ gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
              <div className="col-header" style={{ margin: 0 }}>SOURCE DEBUGGER</div>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--jvm-cyan)', background: 'rgba(6,182,212,0.1)', padding: '2px 6px', borderRadius: '4px' }}>Demo.java</span>
            </div>
            <div className="code-block" id="s8-code-container" style={{ flex: 1, padding: '8px 10px', fontSize: '14.5px', lineHeight: 1.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
              <div className="code-row" id="s8-l0"><span className="kw">class</span> <span className="type">Demo</span> &#123;</div>
              <div className="code-row" id="s8-l1" style={{ paddingLeft: '14px' }}><span className="kw">static</span> <span className="type">int</span> count = <span className="num">10</span>;</div>
              <div className="code-row" id="s8-l2" style={{ paddingLeft: '14px' }}><span className="kw">static</span> &#123; count = <span className="num">20</span>; &#125;</div>
              <div className="code-row" id="s8-l3" style={{ paddingLeft: '14px' }}><span className="type">int</span> value = <span className="num">42</span>;</div>
              <div className="code-row" id="s8-l4" style={{ paddingLeft: '14px' }}><span className="type">int</span> <span className="fn">calculate</span>(<span className="type">int</span> a, <span className="type">int</span> b) &#123;</div>
              <div className="code-row" id="s8-l5" style={{ paddingLeft: '28px' }}><span className="type">int</span> result = a + b;</div>
              <div className="code-row" id="s8-l6" style={{ paddingLeft: '28px' }}><span className="kw">return</span> result;</div>
              <div className="code-row" id="s8-l7" style={{ paddingLeft: '14px' }}>&#125;</div>
              <div className="code-row" id="s8-l8" style={{ paddingLeft: '14px' }}><span className="kw">public static</span> <span className="type">void</span> <span className="fn">main</span>(<span className="type">String</span>[] args) &#123;</div>
              <div className="code-row" id="s8-l9" style={{ paddingLeft: '28px' }}><span className="type">Demo</span> obj = <span className="kw">new</span> <span className="fn">Demo</span>();</div>
              <div className="code-row" id="s8-l10" style={{ paddingLeft: '28px' }}><span className="type">int</span> x = <span className="num">10</span>;</div>
              <div className="code-row" id="s8-l11" style={{ paddingLeft: '28px' }}><span className="type">int</span> y = <span className="num">20</span>;</div>
              <div className="code-row" id="s8-l12" style={{ paddingLeft: '28px' }}><span className="type">int</span> result = obj.<span className="fn">calculate</span>(x, y);</div>
              <div className="code-row" id="s8-l13" style={{ paddingLeft: '28px' }}>System.out.<span className="fn">println</span>(result);</div>
              <div className="code-row" id="s8-l14" style={{ paddingLeft: '14px' }}>&#125;</div>
              <div className="code-row" id="s8-l15">&#125;</div>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: 'var(--jvm-amber)' }}>●</span> Instruction pointer tracks highlighted statement
            </div>
          </div>

          {/* Col 2: JVM Runtime Area */}
          <div className="dashboard-col" style={{ gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
              <span className="col-header" style={{ margin: 0, color: 'var(--text-main)', fontWeight: 800 }}>JVM RUNTIME ENVIRONMENT</span>
              <div id="s8-state-banner" className="badge-tag" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '13px' }}>
                CURRENT STATE: <span id="s8-state-name" style={{ color: 'var(--jvm-amber)', marginLeft: '6px' }}>INITIALIZING</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateRows: '1fr 1.35fr auto', gap: '10px', flex: 1, minHeight: 0 }}>

              {/* Top Row: Method Area & Heap */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: '10px' }}>
                {/* Method Area */}
                <div className="memory-region method-area" id="s8-panel-method" style={{ background: 'rgba(15, 17, 26, 0.6)', border: '1px solid rgba(168,85,247,0.25)', borderRadius: '10px', padding: '12px 16px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--jvm-purple)', fontWeight: 800, fontSize: 'var(--body-sm)', letterSpacing: '0.05em' }}>METHOD AREA</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>CLASS METADATA</span>
                  </div>
                  <div id="s8-method-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div id="s8-m-placeholder" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--body-sm)', color: 'var(--text-dim)', textAlign: 'center' }}>Loading...</div>
                    <div id="s8-m-class" style={{ display: 'none', opacity: 0, background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '6px', padding: '8px' }}>
                      <div style={{ fontWeight: 800, color: 'var(--jvm-purple)', fontSize: '17px', fontFamily: 'var(--font-mono)', borderBottom: '1px solid rgba(168,85,247,0.2)', paddingBottom: '3px', marginBottom: '5px' }}>Demo.class</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', lineHeight: 1.4, color: 'var(--text-main)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-dim)' }}>static count</span>
                          <span id="s8-m-count" style={{ fontWeight: 700, color: 'var(--jvm-amber)' }}>10</span>
                        </div>
                        <div id="s8-m-static-block" style={{ color: 'var(--text-dim)', fontSize: '13px' }}>• static block [executed]</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>• main(String[])</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>• calculate(int, int)</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Heap */}
                <div className="memory-region heap" id="s8-panel-heap" style={{ background: 'rgba(15, 17, 26, 0.6)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '10px', padding: '12px 16px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--jvm-emerald)', fontWeight: 800, fontSize: 'var(--body-sm)', letterSpacing: '0.05em' }}>HEAP</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>OBJECT INSTANCES</span>
                  </div>
                  <div id="s8-heap-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <div id="s8-h-placeholder" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--body-sm)', color: 'var(--text-dim)', textAlign: 'center' }}>empty</div>
                    <div id="s8-h-obj" style={{ display: 'none', opacity: 0, width: '100%', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '6px', padding: '8px', boxShadow: '0 0 15px rgba(16,185,129,0.1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(16,185,129,0.2)', paddingBottom: '4px', marginBottom: '5px' }}>
                        <span style={{ fontWeight: 800, color: 'var(--jvm-emerald)', fontSize: '18px', fontFamily: 'var(--font-mono)' }}>Demo Object</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>@0x7A4F</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', display: 'flex', justifyContent: 'space-between', color: '#fff' }}>
                        <span style={{ color: 'var(--text-dim)' }}>value (field)</span>
                        <span style={{ fontWeight: 700, color: 'var(--jvm-cyan)' }}>= 42</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Row: Stack & PC Register */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: '10px' }}>
                {/* Stack */}
                <div className="memory-region stack" id="s8-panel-stack" style={{ background: 'rgba(15, 17, 26, 0.6)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: '10px', padding: '12px 16px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--jvm-cyan)', fontWeight: 800, fontSize: 'var(--body-sm)', letterSpacing: '0.05em' }}>CALL STACK</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>FRAMES (LIFO)</span>
                  </div>
                  <div id="s8-stack-body" style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', justifyContent: 'flex-start', gap: '6px', overflow: 'hidden' }}>
                    <div id="s8-s-placeholder" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--body-sm)', color: 'var(--text-dim)', textAlign: 'center', margin: 'auto' }}>empty</div>

                    <div id="s8-sf-main" style={{ display: 'none', opacity: 0, background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.35)', borderRadius: '6px', padding: '6px 8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: 'var(--jvm-cyan)', fontSize: '16px', fontFamily: 'var(--font-mono)', borderBottom: '1px solid rgba(6,182,212,0.2)', paddingBottom: '2px', marginBottom: '4px' }}>
                        <span>main() Frame</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 'normal' }}>base</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', lineHeight: 1.4 }}>
                        <div id="s8-v-obj" style={{ display: 'none', opacity: 0, justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-dim)' }}>obj</span>
                          <span style={{ color: 'var(--jvm-emerald)', fontWeight: 600 }}>─────────→ Heap</span>
                        </div>
                        <div id="s8-v-xy" style={{ display: 'none', opacity: 0, justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-dim)' }}>x, y</span>
                          <span style={{ color: '#fff' }}>10, 20</span>
                        </div>
                        <div id="s8-v-mres" style={{ display: 'none', opacity: 0, justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-dim)' }}>result</span>
                          <span id="s8-v-mres-val" style={{ color: 'var(--jvm-amber)', fontWeight: 700 }}>= 30</span>
                        </div>
                      </div>
                    </div>

                    <div id="s8-sf-calc" style={{ display: 'none', opacity: 0, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '6px', padding: '6px 8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: 'var(--jvm-amber)', fontSize: '16px', fontFamily: 'var(--font-mono)', borderBottom: '1px solid rgba(245,158,11,0.2)', paddingBottom: '2px', marginBottom: '4px' }}>
                        <span>calculate(a, b) Frame</span>
                        <span style={{ fontSize: '11px', color: 'var(--jvm-amber)' }}>▲ current</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', lineHeight: 1.4 }}>
                        <div id="s8-v-ab" style={{ display: 'none', opacity: 0, justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-dim)' }}>a, b</span>
                          <span style={{ color: '#fff' }}>10, 20</span>
                        </div>
                        <div id="s8-v-cres" style={{ display: 'none', opacity: 0, justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-dim)' }}>result (a + b)</span>
                          <span style={{ color: 'var(--jvm-amber)', fontWeight: 700 }}>= 30</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* PC Register */}
                <div className="memory-region pc" id="s8-panel-pc" style={{ background: 'rgba(15, 17, 26, 0.6)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '10px', padding: '12px 16px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--jvm-amber)', fontWeight: 800, fontSize: 'var(--body-sm)', letterSpacing: '0.05em' }}>PC REGISTER</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>BYTECODE OFFSET</span>
                  </div>
                  <div id="s8-pc-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div id="s8-pc-idle" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--body-sm)', color: 'var(--text-dim)', textAlign: 'center' }}>idle</div>
                    <div id="s8-pc-active" style={{ display: 'none', opacity: 0 }}>
                      <div style={{ fontSize: '13px', color: 'var(--jvm-amber)', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>Current Instruction</div>
                      <div id="s8-pc-inst" className="mono" style={{ fontSize: '16px', color: '#fff', background: 'rgba(0,0,0,0.4)', padding: '6px 10px', borderRadius: '4px', border: '1px solid rgba(245,158,11,0.4)', lineHeight: 1.35 }}>
                        → initializing
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Native Method Stack */}
              <div className="memory-region native" id="s8-panel-native" style={{ background: 'rgba(15, 17, 26, 0.6)', border: '1px solid rgba(225,29,72,0.25)', borderRadius: '8px', padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'var(--jvm-rose)', fontWeight: 800, fontSize: 'var(--body-sm)', letterSpacing: '0.05em' }}>NATIVE METHOD STACK</span>
                  <span id="s8-native-desc" style={{ fontSize: '13px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>[C/C++ System Layer]</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span id="s8-native-status" className="mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dim)', background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '4px' }}>IDLE</span>
                </div>
              </div>

            </div>

            {/* Conceptual Caption Bar */}
            <div id="s8-caption-bar" style={{ marginTop: '4px', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: '8px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--jvm-cyan)', fontSize: '18px' }}>ℹ</span>
              <span id="s8-caption-text" style={{ fontSize: 'var(--body-sm)', color: 'var(--text-main)', fontFamily: 'var(--font-display)', lineHeight: 1.3 }}>
                The JVM prepares runtime memory structures before executing bytecode.
              </span>
            </div>
          </div>

          {/* Col 3: Output Console */}
          <div className="dashboard-col" style={{ background: 'rgba(4, 5, 8, 0.9)', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
              <div className="col-header" style={{ margin: 0, color: 'var(--jvm-emerald)', fontWeight: 800 }}>STDOUT CONSOLE</div>
              <span className="mono" style={{ fontSize: '12px', color: 'var(--text-dim)' }}>System.out</span>
            </div>
            <div className="console-out" style={{ flex: 1, padding: '10px 4px', fontFamily: 'var(--font-mono)', fontSize: '32px', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
              <div id="s8-console-out" style={{ opacity: 0, color: 'var(--jvm-emerald)', fontWeight: 'bold', textShadow: '0 0 12px rgba(16,185,129,0.5)' }}></div>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-dim)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '6px', fontFamily: 'var(--font-mono)' }}>
              Standard program output stream only
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
