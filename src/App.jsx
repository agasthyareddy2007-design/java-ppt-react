import React, { useState, useEffect, useRef } from 'react'
import AmbientBackground from './components/AmbientBackground.jsx'
import Chrome from './components/Chrome.jsx'

import Slide01Title from './slides/Slide01Title.jsx'
import Slide02Features from './slides/Slide02Features.jsx'
import Slide03HowJavaRuns from './slides/Slide03HowJavaRuns.jsx'
import Slide04Architecture from './slides/Slide04Architecture.jsx'
import Slide05Overview from './slides/Slide05Overview.jsx'
import Slide06ClassLoader from './slides/Slide06ClassLoader.jsx'
import Slide07MemoryComponents from './slides/Slide07MemoryComponents.jsx'
import Slide08JITCompiler from './slides/Slide08JITCompiler.jsx'
import Slide09GarbageCollection from './slides/Slide09GarbageCollection.jsx'
import Slide10PlatformIndependence from './slides/Slide10PlatformIndependence.jsx'
import Slide11LiveJVMExecution from './slides/Slide11LiveJVMExecution.jsx'
import Slide12BTreesUnderstanding from './slides/Slide12BTreesUnderstanding.jsx'
import Slide13BTreesInsertion from './slides/Slide13BTreesInsertion.jsx'
import Slide14BTreesDeletion from './slides/Slide14BTreesDeletion.jsx'
import Slide15ThankYou from './slides/Slide15ThankYou.jsx'

export default function App() {
  const totalSlides = 15
  const stageRef = useRef(null)

  const getInitialSlide = () => {
    try {
      const params = new URLSearchParams(window.location.search)
      const s = params.get('slide')
      if (s !== null) {
        const parsed = parseInt(s, 10)
        if (!isNaN(parsed) && parsed >= 0 && parsed < totalSlides) return parsed
      }
      const hash = window.location.hash.replace('#', '')
      if (hash) {
        const parsed = parseInt(hash, 10)
        if (!isNaN(parsed) && parsed >= 0 && parsed < totalSlides) return parsed
      }
    } catch (_) {}
    return 0
  }

  const [currentSlide, setCurrentSlide] = useState(getInitialSlide)

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash) {
        const parsed = parseInt(hash, 10)
        if (!isNaN(parsed) && parsed >= 0 && parsed < totalSlides) {
          setCurrentSlide(parsed)
        }
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [totalSlides])

  // Sync hash with current slide
  useEffect(() => {
    try {
      window.location.hash = String(currentSlide)
    } catch (_) {}
  }, [currentSlide])

  // Handle stage scaling to 1920x1080 fixed aspect ratio
  useEffect(() => {
    const updateScale = () => {
      const stage = stageRef.current
      if (!stage) return
      const w = window.innerWidth
      const h = window.innerHeight
      const scaleX = w / 1920
      const scaleY = h / 1080
      const scale = Math.min(scaleX, scaleY)
      stage.style.transform = `scale(${scale})`
      stage.style.left = `${(w - 1920 * scale) / 2}px`
      stage.style.top = `${(h - 1080 * scale) / 2}px`
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  // Keyboard navigation & Fullscreen toggle (F key)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1))
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        setCurrentSlide((prev) => Math.max(0, prev - 1))
      } else if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {})
        } else {
          document.exitFullscreen().catch(() => {})
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleNext = () => setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1))
  const handlePrev = () => setCurrentSlide((prev) => Math.max(0, prev - 1))

  return (
    <div className="deck-viewport">
      <AmbientBackground currentSlide={currentSlide} totalSlides={totalSlides} />
      <Chrome currentSlide={currentSlide} totalSlides={totalSlides} onPrev={handlePrev} onNext={handleNext} />

      <div className="deck-stage" ref={stageRef}>
        <Slide01Title isActive={currentSlide === 0} />
        <Slide02Features isActive={currentSlide === 1} />
        <Slide03HowJavaRuns isActive={currentSlide === 2} />
        <Slide04Architecture isActive={currentSlide === 3} />
        <Slide05Overview isActive={currentSlide === 4} />
        <Slide06ClassLoader isActive={currentSlide === 5} />
        <Slide07MemoryComponents isActive={currentSlide === 6} />
        <Slide08JITCompiler isActive={currentSlide === 7} />
        <Slide09GarbageCollection isActive={currentSlide === 8} />
        <Slide10PlatformIndependence isActive={currentSlide === 9} />
        <Slide11LiveJVMExecution isActive={currentSlide === 10} />
        <Slide12BTreesUnderstanding isActive={currentSlide === 11} />
        <Slide13BTreesInsertion isActive={currentSlide === 12} />
        <Slide14BTreesDeletion isActive={currentSlide === 13} />
        <Slide15ThankYou isActive={currentSlide === 14} />
      </div>
    </div>
  )
}
