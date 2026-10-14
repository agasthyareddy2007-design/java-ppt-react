import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

export default function AmbientBackground({ currentSlide = 0, totalSlides = 15 }) {
  const ambientCanvasRef = useRef(null)
  const matrixCanvasRef = useRef(null)
  const threeEnvRef = useRef(null)

  // Matrix Rain effect
  useEffect(() => {
    const canvas = matrixCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const tokens = ['0xCAFEBABE', '0x0021', '0x7A', '0x8B', '0x0004', '0x0008']
    let items = []
    let animationFrameId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const init = () => {
      items = []
      const count = Math.floor(window.innerWidth / 90)
      for (let i = 0; i < count; i++) {
        items.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: 0.25 + Math.random() * 0.5,
          text: tokens[Math.floor(Math.random() * tokens.length)],
          opacity: 0.15 + Math.random() * 0.35
        })
      }
    }
    init()

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.font = '12px "JetBrains Mono", monospace'
      items.forEach(item => {
        ctx.fillStyle = `rgba(6, 182, 212, ${item.opacity})`
        ctx.fillText(item.text, item.x, item.y)
        item.y -= item.speed
        if (item.y < -30) {
          item.y = canvas.height + 30
          item.x = Math.random() * canvas.width
        }
      })
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // Three.js Ambient Particle Space & Meshes
  useEffect(() => {
    const canvas = ambientCanvasRef.current
    if (!canvas || typeof THREE === 'undefined') return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 3500)
    camera.position.z = 800

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    let mouseX = 0, mouseY = 0, targetMouseX = 0, targetMouseY = 0, autoTime = 0

    // Particles
    const particleCount = 1200 // Reduced density for cleaner appearance on B-Tree slides
    const particleGeometry = new THREE.BufferGeometry()
    const basePositions = new Float32Array(particleCount * 3)
    const currentPositions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    const colorAmber = new THREE.Color(0xf59e0b)
    const colorEmerald = new THREE.Color(0x10b981)
    const colorCyan = new THREE.Color(0x06b6d4)
    const colorZinc = new THREE.Color(0x3f3f46)

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 2600
      const y = (Math.random() - 0.5) * 1800
      const z = (Math.random() - 0.5) * 1500 - 150
      basePositions[i*3] = x
      basePositions[i*3+1] = y
      basePositions[i*3+2] = z
      currentPositions[i*3] = x
      currentPositions[i*3+1] = y
      currentPositions[i*3+2] = z

      let c = colorZinc
      const r = Math.random()
      if (r < 0.15) c = colorAmber
      else if (r < 0.3) c = colorEmerald
      else if (r < 0.4) c = colorCyan

      colors[i*3] = c.r
      colors[i*3+1] = c.g
      colors[i*3+2] = c.b
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3))
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const material = new THREE.PointsMaterial({ size: 3.5, vertexColors: true, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending })
    const particles = new THREE.Points(particleGeometry, material)
    scene.add(particles)

    // Peripheral Meshes (hidden on B-Tree slides 11+)
    const nodesGroup = new THREE.Group()
    const mAmber = new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true, transparent: true, opacity: 0.12 })
    const mEmerald = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true, transparent: true, opacity: 0.10 })
    const mCyan = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true, transparent: true, opacity: 0.08 })

    const mesh1 = new THREE.Mesh(new THREE.IcosahedronGeometry(140, 1), mAmber)
    const mesh2 = new THREE.Mesh(new THREE.DodecahedronGeometry(120, 0), mEmerald)
    const mesh3 = new THREE.Mesh(new THREE.TorusGeometry(90, 24, 12, 28), mCyan)
    nodesGroup.add(mesh1, mesh2, mesh3)
    scene.add(nodesGroup)

    const updatePeripheralMeshes = () => {
      const aspect = window.innerWidth / window.innerHeight
      const baseOffset = 640
      const dynamicOffset = baseOffset * (aspect > 1.77 ? (aspect / 1.77) * 1.2 : 1)
      mesh1.position.set(-dynamicOffset, 220, -220)
      mesh2.position.set(dynamicOffset, -240, -320)
      mesh3.position.set(-dynamicOffset * 0.85, -300, -180)
    }
    updatePeripheralMeshes()

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      updatePeripheralMeshes()
    }
    const onMouseMove = (e) => {
      targetMouseX = (e.clientX - window.innerWidth / 2) * 0.25
      targetMouseY = (e.clientY - window.innerHeight / 2) * 0.25
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouseMove)

    let animationFrameId
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      autoTime += 0.01
      mouseX += (targetMouseX - mouseX) * 0.04
      mouseY += (targetMouseY - mouseY) * 0.04

      const positions = particleGeometry.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3
        const bx = basePositions[idx]
        const by = basePositions[idx + 1]
        const bz = basePositions[idx + 2]
        positions[idx + 1] = by + Math.sin(autoTime * 0.6 + bx * 0.003) * 15
        positions[idx] = bx + Math.cos(autoTime * 0.5 + bz * 0.002) * 10
      }
      particleGeometry.attributes.position.needsUpdate = true

      particles.rotation.y += 0.0002
      particles.rotation.x += 0.0001
      mesh1.rotation.x += 0.0015
      mesh1.rotation.y += 0.002
      mesh2.rotation.x -= 0.0012
      mesh2.rotation.y -= 0.0015
      mesh3.rotation.x += 0.002
      mesh3.rotation.z += 0.0015

      const autoCamX = Math.sin(autoTime * 0.3) * 25
      const autoCamY = Math.cos(autoTime * 0.25) * 18
      camera.position.x += ((mouseX * 0.3 + autoCamX) - camera.position.x) * 0.04
      camera.position.y += ((-mouseY * 0.3 + autoCamY) - camera.position.y) * 0.04
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }
    animate()

    threeEnvRef.current = { camera, nodesGroup, particles }

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(animationFrameId)
      renderer.dispose()
    }
  }, [])

  // Camera response to slide change
  useEffect(() => {
    if (!threeEnvRef.current) return
    const { camera, nodesGroup, particles } = threeEnvRef.current

    const isBTreeSlide = currentSlide >= 11
    if (nodesGroup) nodesGroup.visible = !isBTreeSlide
    if (particles && particles.material) {
      particles.material.opacity = isBTreeSlide ? 0.12 : 0.4
    }

    const angle = (currentSlide / totalSlides) * Math.PI * 0.85
    const targetX = Math.sin(angle) * 120
    const targetZ = 800 + Math.cos(angle) * 100

    gsap.to(camera.position, { x: targetX, z: targetZ, duration: 1.8, ease: "power2.out" })
  }, [currentSlide, totalSlides])

  return (
    <>
      <canvas id="ambientCanvas" ref={ambientCanvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 'var(--z-bg)', pointerEvents: 'none' }}></canvas>
      <canvas id="matrixCanvas" ref={matrixCanvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 'var(--z-bg)', pointerEvents: 'none', opacity: 0.1 }}></canvas>
      <div className="noise-overlay"></div>
    </>
  )
}
