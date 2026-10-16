import React, { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import AnimationKeyboardHint from '../components/AnimationKeyboardHint.jsx'

export default function Slide11LiveJVMExecution({ isActive, onRegisterAnimation }) {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const isTransitioningRef = useRef(false)
  const currentPhaseRef = useRef(0)

  // Keep ref in sync
  currentPhaseRef.current = currentPhase

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
      pcActive.style.opacity = '1'
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
      el.innerText = text
      el.style.opacity = '1'
    }
  }

  const resetSimulation = useCallback(() => {
    isTransitioningRef.current = false
    gsap.killTweensOf('*')

    // Reset rows
    for (let i = 0; i <= 15; i++) {
      const row = document.getElementById('s8-l' + i)
      if (row) row.classList.remove('active')
    }

    // Reset status
    setState('INITIALIZING', 'var(--jvm-amber)')

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
    setCaption('The JVM prepares runtime memory structures before executing bytecode.')

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
  }, [])

  // Instantly apply static DOM state for any phase (used for Backspace navigation)
  const applyPhaseInstant = useCallback((targetPhase) => {
    resetSimulation()

    if (targetPhase >= 1) {
      setState('CLASS LOADING', 'var(--jvm-purple)')
      setPC('→ load Demo.class')
      highlightLine('s8-l0')
      setCaption('Demo.class metadata is loaded into the Method Area by the Class Loader.')
      const mPlaceholder = document.getElementById('s8-m-placeholder')
      const mClass = document.getElementById('s8-m-class')
      if (mPlaceholder) mPlaceholder.style.display = 'none'
      if (mClass) { mClass.style.display = 'block'; mClass.style.opacity = '1'; }
    }

    if (targetPhase >= 2) {
      setState('STATIC INITIALIZATION', 'var(--jvm-purple)')
      highlightLine('s8-l2')
      setPC('→ static { count = 20; }')
      setCaption('Static initializer block runs, updating count from 10 to 20.')
      const mCount = document.getElementById('s8-m-count')
      const mStatic = document.getElementById('s8-m-static-block')
      if (mCount) { mCount.innerText = '20'; mCount.style.color = 'var(--jvm-emerald)'; }
      if (mStatic) mStatic.style.color = 'var(--jvm-amber)'
    }

    if (targetPhase >= 3) {
      setState('MAIN STACK FRAME', 'var(--jvm-cyan)')
      highlightLine('s8-l8')
      setPC('→ invokestatic main(String[])')
      setCaption('Invoking main() pushes a new Stack Frame onto the call stack.')
      const sPlaceholder = document.getElementById('s8-s-placeholder')
      const sfMain = document.getElementById('s8-sf-main')
      if (sPlaceholder) sPlaceholder.style.display = 'none'
      if (sfMain) { sfMain.style.display = 'block'; sfMain.style.opacity = '1'; }
    }

    if (targetPhase >= 4) {
      setState('OBJECT ALLOCATION', 'var(--jvm-emerald)')
      highlightLine('s8-l9')
      setPC('→ new Demo() (bytecode: new, dup, invokespecial)')
      setCaption('Objects are allocated in the Heap; instance variables live inside the object.')
      const hPlaceholder = document.getElementById('s8-h-placeholder')
      const hObj = document.getElementById('s8-h-obj')
      if (hPlaceholder) hPlaceholder.style.display = 'none'
      if (hObj) { hObj.style.display = 'block'; hObj.style.opacity = '1'; }
    }

    if (targetPhase >= 5) {
      setState('REFERENCE BINDING', 'var(--jvm-emerald)')
      setPC('→ Demo obj = @0x7A4F (store reference)')
      setCaption('The reference variable obj in the Stack frame points to the object in Heap.')
      const vObj = document.getElementById('s8-v-obj')
      if (vObj) { vObj.style.display = 'flex'; vObj.style.opacity = '1'; }
    }

    if (targetPhase >= 6) {
      setState('LOCAL VARIABLES', 'var(--jvm-cyan)')
      highlightLine('s8-l10')
      setPC('→ int x = 10; int y = 20;')
      setCaption('Primitive local variables x and y are stored directly in main() stack frame.')
      const vXy = document.getElementById('s8-v-xy')
      if (vXy) { vXy.style.display = 'flex'; vXy.style.opacity = '1'; }
    }

    if (targetPhase >= 7) {
      setState('METHOD INVOCATION', 'var(--jvm-amber)')
      highlightLine('s8-l12')
      setPC('→ invokevirtual calculate(x, y)')
      setCaption('A method call creates a new stack frame on top of the call stack.')
      const sfCalc = document.getElementById('s8-sf-calc')
      const vAb = document.getElementById('s8-v-ab')
      if (sfCalc) { sfCalc.style.display = 'block'; sfCalc.style.opacity = '1'; }
      if (vAb) { vAb.style.display = 'flex'; vAb.style.opacity = '1'; }
    }

    if (targetPhase >= 8) {
      setState('CALCULATION', 'var(--jvm-amber)')
      highlightLine('s8-l5')
      setPC('→ int result = a + b; (iadd)')
      setCaption('Execution engine computes a + b (10 + 20) = 30 inside calculate().')
      const vCres = document.getElementById('s8-v-cres')
      if (vCres) { vCres.style.display = 'flex'; vCres.style.opacity = '1'; }
    }

    if (targetPhase >= 9) {
      setState('FRAME POP / RETURN', 'var(--jvm-cyan)')
      highlightLine('s8-l6')
      setPC('→ return result; (ireturn: 30)')
      setCaption('A return value is sent back and the completed calculate() frame pops off.')
      const sfCalc = document.getElementById('s8-sf-calc')
      if (sfCalc) { sfCalc.style.display = 'none'; sfCalc.style.opacity = '0'; }
      const vMres = document.getElementById('s8-v-mres')
      if (vMres) { vMres.style.display = 'flex'; vMres.style.opacity = '1'; }
    }

    if (targetPhase >= 10) {
      setState('NATIVE OUTPUT', 'var(--jvm-rose)')
      highlightLine('s8-l13')
      setPC('→ System.out.println(result)')
      setCaption('System.out.println() invokes the C/C++ native method layer to write to stdout.')
      const nativeStatus = document.getElementById('s8-native-status')
      if (nativeStatus) {
        nativeStatus.innerText = 'RETURN'
        nativeStatus.style.color = 'var(--jvm-emerald)'
        nativeStatus.style.background = 'rgba(16,185,129,0.2)'
      }
      const consoleOut = document.getElementById('s8-console-out')
      if (consoleOut) {
        consoleOut.innerText = '30'
        consoleOut.style.opacity = '1'
      }
    }

    if (targetPhase >= 11) {
      setState('EXECUTION COMPLETE', 'var(--jvm-emerald)')
      highlightLine(null)
      setPC('→ Program execution terminated')
      setCaption('Execution cycle complete. All local frames destroyed.')
      const nativeStatus = document.getElementById('s8-native-status')
      if (nativeStatus) {
        nativeStatus.innerText = 'IDLE'
        nativeStatus.style.color = 'var(--text-dim)'
        nativeStatus.style.background = 'rgba(255,255,255,0.05)'
      }
    }

    setCurrentPhase(targetPhase)
  }, [resetSimulation])

  // Animate natural forward transition from currentPhase to targetPhase
  const runTransitionTo = useCallback((targetPhase) => {
    isTransitioningRef.current = true

    const finishTransition = () => {
      isTransitioningRef.current = false
      setCurrentPhase(targetPhase)
    }

    switch (targetPhase) {
      case 1: { // Phase 1: Class Loading
        setState('CLASS LOADING', 'var(--jvm-purple)')
        setPC('→ load Demo.class')
        highlightLine('s8-l0')
        setCaption('Demo.class metadata is loaded into the Method Area by the Class Loader.')

        const mPlaceholder = document.getElementById('s8-m-placeholder')
        const mClass = document.getElementById('s8-m-class')
        if (mPlaceholder) mPlaceholder.style.display = 'none'
        if (mClass) {
          mClass.style.display = 'block'
          gsap.fromTo(mClass, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out', onComplete: finishTransition })
        } else {
          finishTransition()
        }
        const pMethod = document.getElementById('s8-panel-method')
        if (pMethod) pMethod.classList.add('active-glow')
        break
      }

      case 2: { // Phase 2: Static Initialization
        const pMethod = document.getElementById('s8-panel-method')
        if (pMethod) pMethod.classList.remove('active-glow')
        setState('STATIC INITIALIZATION', 'var(--jvm-purple)')
        highlightLine('s8-l2')
        setPC('→ static { count = 20; }')
        setCaption('Static initializer block runs, updating count from 10 to 20.')
        const mCount = document.getElementById('s8-m-count')
        const mStatic = document.getElementById('s8-m-static-block')
        if (mCount) {
          gsap.to(mCount, {
            color: 'var(--jvm-emerald)',
            scale: 1.25,
            duration: 0.35,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
              mCount.innerText = '20'
              finishTransition()
            }
          })
        } else {
          finishTransition()
        }
        if (mStatic) mStatic.style.color = 'var(--jvm-amber)'
        break
      }

      case 3: { // Phase 3: main() Stack Frame
        setState('MAIN STACK FRAME', 'var(--jvm-cyan)')
        highlightLine('s8-l8')
        setPC('→ invokestatic main(String[])')
        setCaption('Invoking main() pushes a new Stack Frame onto the call stack.')

        const sPlaceholder = document.getElementById('s8-s-placeholder')
        const sfMain = document.getElementById('s8-sf-main')
        if (sPlaceholder) sPlaceholder.style.display = 'none'
        if (sfMain) {
          sfMain.style.display = 'block'
          gsap.fromTo(sfMain, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)', onComplete: finishTransition })
        } else {
          finishTransition()
        }
        const pStack = document.getElementById('s8-panel-stack')
        if (pStack) pStack.classList.add('active-glow')
        break
      }

      case 4: { // Phase 4: Object Allocation in Heap
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
          gsap.fromTo(hObj, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.7)', onComplete: finishTransition })
        } else {
          finishTransition()
        }
        const pHeap = document.getElementById('s8-panel-heap')
        if (pHeap) pHeap.classList.add('active-glow')
        break
      }

      case 5: { // Phase 5: Reference Binding
        const pHeap = document.getElementById('s8-panel-heap')
        if (pHeap) pHeap.classList.remove('active-glow')
        setState('REFERENCE BINDING', 'var(--jvm-emerald)')
        setPC('→ Demo obj = @0x7A4F (store reference)')
        setCaption('The reference variable obj in the Stack frame points to the object in Heap.')

        const vObj = document.getElementById('s8-v-obj')
        if (vObj) {
          vObj.style.display = 'flex'
          gsap.fromTo(vObj, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.55, ease: 'power2.out', onComplete: finishTransition })
        } else {
          finishTransition()
        }
        break
      }

      case 6: { // Phase 6: Local Variables
        setState('LOCAL VARIABLES', 'var(--jvm-cyan)')
        highlightLine('s8-l10')
        setPC('→ int x = 10; int y = 20;')
        setCaption('Primitive local variables x and y are stored directly in main() stack frame.')

        const vXy = document.getElementById('s8-v-xy')
        if (vXy) {
          vXy.style.display = 'flex'
          gsap.fromTo(vXy, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', onComplete: finishTransition })
        } else {
          finishTransition()
        }
        break
      }

      case 7: { // Phase 7: calculate() Invocation
        setState('METHOD INVOCATION', 'var(--jvm-amber)')
        highlightLine('s8-l12')
        setPC('→ invokevirtual calculate(x, y)')
        setCaption('A method call creates a new stack frame on top of the call stack.')

        const sfCalc = document.getElementById('s8-sf-calc')
        const vAb = document.getElementById('s8-v-ab')
        if (sfCalc) {
          sfCalc.style.display = 'block'
          gsap.fromTo(sfCalc, { opacity: 0, y: -20, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.4)' })
        }
        if (vAb) {
          vAb.style.display = 'flex'
          gsap.fromTo(vAb, { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 0.2, onComplete: finishTransition })
        } else {
          finishTransition()
        }
        const pStack = document.getElementById('s8-panel-stack')
        if (pStack) pStack.classList.add('active-glow')
        break
      }

      case 8: { // Phase 8: Calculation
        const pStack = document.getElementById('s8-panel-stack')
        if (pStack) pStack.classList.remove('active-glow')
        setState('CALCULATION', 'var(--jvm-amber)')
        highlightLine('s8-l5')
        setPC('→ int result = a + b; (iadd)')
        setCaption('Execution engine computes a + b (10 + 20) = 30 inside calculate().')

        const vCres = document.getElementById('s8-v-cres')
        if (vCres) {
          vCres.style.display = 'flex'
          gsap.fromTo(vCres, { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out', onComplete: finishTransition })
        } else {
          finishTransition()
        }
        break
      }

      case 9: { // Phase 9: Return & Pop Frame
        setState('FRAME POP / RETURN', 'var(--jvm-cyan)')
        highlightLine('s8-l6')
        setPC('→ return result; (ireturn: 30)')
        setCaption('A return value is sent back and the completed calculate() frame pops off.')

        const sfCalc = document.getElementById('s8-sf-calc')
        if (sfCalc) {
          gsap.to(sfCalc, { opacity: 0, y: -15, scale: 0.9, duration: 0.5, ease: 'power2.in', onComplete: () => {
            sfCalc.style.display = 'none'
          }})
        }

        const vMres = document.getElementById('s8-v-mres')
        if (vMres) {
          vMres.style.display = 'flex'
          gsap.fromTo(vMres, { opacity: 0, x: -10 }, { opacity: 1, x: 0, delay: 0.25, duration: 0.45, onComplete: finishTransition })
        } else {
          finishTransition()
        }
        break
      }

      case 10: { // Phase 10: Native Execution & Output
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

        const consoleOut = document.getElementById('s8-console-out')
        if (consoleOut) {
          consoleOut.innerText = '30'
          consoleOut.style.opacity = '1'
          gsap.fromTo(consoleOut, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.45, delay: 0.25, ease: 'back.out(2)', onComplete: () => {
            if (nativeStatus) {
              nativeStatus.innerText = 'RETURN'
              nativeStatus.style.color = 'var(--jvm-emerald)'
              nativeStatus.style.background = 'rgba(16,185,129,0.2)'
            }
            finishTransition()
          }})
        } else {
          finishTransition()
        }
        break
      }

      case 11: { // Phase 11: Completion
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
        finishTransition()
        break
      }

      default:
        finishTransition()
    }
  }, [])

  // Manual step forward (ENTER)
  const stepForward = useCallback(() => {
    if (isTransitioningRef.current) return
    setHasStarted(true)

    const nextP = currentPhaseRef.current + 1
    if (nextP <= 11) {
      runTransitionTo(nextP)
    } else {
      // Completed, loop back to initial on subsequent Enter
      resetSimulation()
      setCurrentPhase(0)
    }
  }, [runTransitionTo, resetSimulation])

  // Manual step backward (BACKSPACE)
  const stepBackward = useCallback(() => {
    if (isTransitioningRef.current) {
      isTransitioningRef.current = false
      gsap.killTweensOf('*')
    }

    if (currentPhaseRef.current > 0) {
      applyPhaseInstant(currentPhaseRef.current - 1)
    }
  }, [applyPhaseInstant])

  // Manual restart (R)
  const restart = useCallback(() => {
    resetSimulation()
    setCurrentPhase(0)
    setHasStarted(false)
  }, [resetSimulation])

  // Handle slide mount/unmount and active state
  useEffect(() => {
    if (!isActive) {
      resetSimulation()
      setCurrentPhase(0)
      setHasStarted(false)
      return
    }

    // Initialize at Phase 0 and wait indefinitely
    resetSimulation()
    setCurrentPhase(0)
    setHasStarted(false)

    return () => {
      resetSimulation()
    }
  }, [isActive, resetSimulation])

  // Register animation handlers with App keyboard manager
  useEffect(() => {
    if (isActive && onRegisterAnimation) {
      return onRegisterAnimation({
        next: stepForward,
        prev: stepBackward,
        restart: restart,
        togglePause: () => {}
      })
    }
  }, [isActive, onRegisterAnimation, stepForward, stepBackward, restart])

  return (
    <section className={`slide ${isActive ? 'active' : ''}`} id="slide-8">
      <div className="slide-content-wrapper" style={{ padding: '24px 44px 16px 44px' }}>
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

        <div className="dashboard-grid reveal delay-1" style={{ flex: 1, minHeight: 0 }}>

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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '10px', flex: 1, minHeight: 0 }}>

              {/* Method Area */}
              <div className="runtime-panel" id="s8-panel-method">
                <div className="panel-header">
                  <span>METHOD AREA</span>
                  <span className="mono" style={{ fontSize: '10px', color: 'var(--text-dim)' }}>CLASS METADATA</span>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className="empty-placeholder" id="s8-m-placeholder" style={{ padding: '16px' }}>loading...</div>
                  <div id="s8-m-class" style={{ display: 'none', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '12px' }}>
                    <div className="mono" style={{ color: 'var(--jvm-purple)', fontWeight: 'bold', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '4px' }}>Demo.class</div>
                    <div className="mono" style={{ fontSize: '12px', marginTop: '6px', color: 'var(--text-dim)' }}>
                      static count: <span id="s8-m-count" style={{ color: 'var(--text-dim)', fontWeight: 'bold' }}>10</span>
                    </div>
                    <div className="mono" style={{ fontSize: '11px', marginTop: '4px', color: 'var(--text-dim)' }}>
                      static block: <span id="s8-m-static-block">&#123; count=20; &#125;</span>
                    </div>
                    <div className="mono" style={{ fontSize: '11px', marginTop: '4px', color: 'var(--text-dim)' }}>
                      methods: <span style={{ color: 'var(--jvm-cyan)' }}>calculate(), main()</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Heap */}
              <div className="runtime-panel" id="s8-panel-heap">
                <div className="panel-header">
                  <span>HEAP</span>
                  <span className="mono" style={{ fontSize: '10px', color: 'var(--text-dim)' }}>OBJECT INSTANCES</span>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className="empty-placeholder" id="s8-h-placeholder" style={{ padding: '16px' }}>empty</div>
                  <div id="s8-h-obj" style={{ display: 'none', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px', padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(16,185,129,0.2)', paddingBottom: '4px' }}>
                      <span className="mono" style={{ color: 'var(--jvm-emerald)', fontWeight: 'bold', fontSize: '13px' }}>Demo Instance</span>
                      <span className="mono" style={{ color: 'var(--text-dim)', fontSize: '10px' }}>@0x7A4F</span>
                    </div>
                    <div className="mono" style={{ fontSize: '12px', marginTop: '6px', color: 'var(--text-dim)' }}>
                      value: <span style={{ color: '#fff' }}>42</span>
                    </div>
                    <div className="mono" style={{ fontSize: '10px', marginTop: '2px', color: 'var(--text-dim)' }}>
                      header: mark/klass word
                    </div>
                  </div>
                </div>
              </div>

              {/* Call Stack */}
              <div className="runtime-panel" id="s8-panel-stack">
                <div className="panel-header">
                  <span>CALL STACK</span>
                  <span className="mono" style={{ fontSize: '10px', color: 'var(--text-dim)' }}>FRAMES (LIFO)</span>
                </div>
                <div id="s8-stack-frames" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'flex-end', overflow: 'hidden' }}>
                  <div className="empty-placeholder" id="s8-s-placeholder" style={{ margin: 'auto' }}>empty</div>

                  {/* calculate() frame */}
                  <div id="s8-sf-calc" style={{ display: 'none', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '6px', padding: '8px 10px' }}>
                    <div className="mono" style={{ color: 'var(--jvm-amber)', fontWeight: 'bold', fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>calculate()</span>
                      <span style={{ fontSize: '9px', color: 'var(--text-dim)' }}>FRAME #2</span>
                    </div>
                    <div id="s8-v-ab" className="mono" style={{ display: 'none', fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px', gap: '8px' }}>
                      <span>a: <span style={{ color: '#fff' }}>10</span></span>
                      <span>b: <span style={{ color: '#fff' }}>20</span></span>
                    </div>
                    <div id="s8-v-cres" className="mono" style={{ display: 'none', fontSize: '11px', color: 'var(--jvm-amber)', marginTop: '2px' }}>
                      result: <span style={{ fontWeight: 'bold' }}>30</span>
                    </div>
                  </div>

                  {/* main() frame */}
                  <div id="s8-sf-main" style={{ display: 'none', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '6px', padding: '8px 10px' }}>
                    <div className="mono" style={{ color: 'var(--jvm-cyan)', fontWeight: 'bold', fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>main()</span>
                      <span style={{ fontSize: '9px', color: 'var(--text-dim)' }}>FRAME #1</span>
                    </div>
                    <div id="s8-v-obj" className="mono" style={{ display: 'none', fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                      obj: <span style={{ color: 'var(--jvm-emerald)' }}>@0x7A4F</span>
                    </div>
                    <div id="s8-v-xy" className="mono" style={{ display: 'none', fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px', gap: '8px' }}>
                      <span>x: <span style={{ color: '#fff' }}>10</span></span>
                      <span>y: <span style={{ color: '#fff' }}>20</span></span>
                    </div>
                    <div id="s8-v-mres" className="mono" style={{ display: 'none', fontSize: '11px', color: 'var(--jvm-cyan)', marginTop: '2px' }}>
                      result: <span style={{ fontWeight: 'bold' }}>30</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Execution Engine + PC + Native */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* PC Register */}
                <div className="runtime-panel" id="s8-panel-pc" style={{ flex: 1 }}>
                  <div className="panel-header">
                    <span>PC REGISTER</span>
                    <span className="mono" style={{ fontSize: '10px', color: 'var(--text-dim)' }}>BYTECODE OFFSET</span>
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="empty-placeholder" id="s8-pc-idle">idle</div>
                    <div id="s8-pc-active" className="mono" style={{ display: 'none', fontSize: '11px', color: 'var(--jvm-amber)', background: 'rgba(245,158,11,0.08)', padding: '6px 8px', borderRadius: '4px', border: '1px solid rgba(245,158,11,0.2)', width: '100%', textAlign: 'center' }}>
                      <span id="s8-pc-inst"></span>
                    </div>
                  </div>
                </div>

                {/* Native Method Stack */}
                <div className="runtime-panel" id="s8-panel-native" style={{ flex: 1 }}>
                  <div className="panel-header">
                    <span>NATIVE METHOD STACK</span>
                    <span className="mono" style={{ fontSize: '10px', color: 'var(--text-dim)' }}>C/C++ SYSTEM LAYER</span>
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span id="s8-native-status" className="mono" style={{ fontSize: '11px', color: 'var(--text-dim)', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}>
                      IDLE
                    </span>
                  </div>
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

        {/* ─── BOTTOM KEYBOARD HINT ─── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <AnimationKeyboardHint
            hasStarted={hasStarted}
            customNote={hasStarted ? `Phase ${currentPhase} of 11` : null}
          />
        </div>
      </div>
    </section>
  )
}
