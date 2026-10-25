import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ------------------------------------------------------------------ *
 * Floating Technology Constellation — expanded showcase.
 * Brand-styled wordmark sprites at different depths/sizes. Borderless,
 * lightweight, no external assets, no 3D models. Optimized DPR and a
 * visibility-aware frame loop.
 * ------------------------------------------------------------------ */

interface TechSpec {
  label: string
  color: string
  position: [number, number, number]
  scale: number
  speed: number
  phase: number
}

const TECH: TechSpec[] = [
  // hub
  { label: 'JavaScript', color: '#F7DF1E', position: [0, 0, 0], scale: 1.05, speed: 0.4, phase: 0 },
  { label: 'React', color: '#61DAFB', position: [1.15, 0.35, -0.4], scale: 0.8, speed: 0.5, phase: 1.0 },
  { label: 'TypeScript', color: '#3178C6', position: [-1.2, 0.4, -0.5], scale: 0.72, speed: 0.52, phase: 2.0 },
  { label: 'HTML5', color: '#E44D26', position: [-0.75, 0.95, -0.7], scale: 0.68, speed: 0.6, phase: 3.1 },
  { label: 'CSS3', color: '#2965F1', position: [0.85, 1.0, -0.75], scale: 0.62, speed: 0.58, phase: 4.2 },

  // web
  { label: 'Next.js', color: '#e6edf3', position: [1.8, 0.9, -1.2], scale: 0.6, speed: 0.45, phase: 0.8 },
  { label: 'Node.js', color: '#68A063', position: [-1.85, 0.95, -1.2], scale: 0.62, speed: 0.5, phase: 1.6 },
  { label: 'Express.js', color: '#8a8f98', position: [2.0, -0.5, -1.5], scale: 0.52, speed: 0.5, phase: 2.4 },
  { label: 'PHP', color: '#777BB4', position: [-2.0, -0.55, -1.5], scale: 0.55, speed: 0.52, phase: 3.0 },
  { label: 'Tailwind CSS', color: '#38BDF8', position: [-0.4, 1.6, -1.3], scale: 0.55, speed: 0.48, phase: 4.6 },

  // mobile
  { label: 'React Native', color: '#61DAFB', position: [1.55, -1.1, -1.0], scale: 0.58, speed: 0.5, phase: 5.2 },
  { label: 'Expo', color: '#e6edf3', position: [-1.5, -1.2, -1.1], scale: 0.58, speed: 0.52, phase: 0.4 },
  { label: 'Android', color: '#3DDC84', position: [0.3, 1.8, -1.6], scale: 0.6, speed: 0.46, phase: 1.8 },

  // languages
  { label: 'Java', color: '#E76F00', position: [-1.0, -1.5, -0.8], scale: 0.66, speed: 0.5, phase: 2.8 },
  { label: 'C#', color: '#68217A', position: [1.15, -1.6, -0.9], scale: 0.6, speed: 0.55, phase: 3.6 },
  { label: 'C', color: '#A8B9CC', position: [-2.1, 1.5, -1.8], scale: 0.5, speed: 0.5, phase: 4.4 },
  { label: 'C++', color: '#00599C', position: [2.1, 1.5, -1.8], scale: 0.52, speed: 0.48, phase: 5.4 },
  { label: 'Python', color: '#3776AB', position: [0.15, -1.9, -1.4], scale: 0.62, speed: 0.5, phase: 0.9 },

  // tools / platforms
  { label: 'Git', color: '#F05032', position: [-1.7, 0.1, -1.0], scale: 0.6, speed: 0.55, phase: 2.6 },
  { label: 'GitHub', color: '#e6edf3', position: [1.7, 0.15, -1.05], scale: 0.6, speed: 0.5, phase: 3.8 },
  { label: 'VS Code', color: '#007ACC', position: [-2.1, -1.4, -1.7], scale: 0.55, speed: 0.5, phase: 5.0 },
  { label: 'npm', color: '#CB3837', position: [2.1, -1.4, -1.7], scale: 0.52, speed: 0.52, phase: 0.6 },
  { label: 'Vite', color: '#646CFF', position: [-0.35, -2.1, -1.9], scale: 0.55, speed: 0.46, phase: 1.4 },
  { label: 'Linux', color: '#FCC624', position: [0.4, -2.2, -2.0], scale: 0.55, speed: 0.5, phase: 2.2 },

  // databases / backend
  { label: 'MySQL', color: '#00758F', position: [-1.85, 2.0, -2.1], scale: 0.5, speed: 0.48, phase: 3.4 },
  { label: 'PostgreSQL', color: '#336791', position: [-0.1, 2.2, -2.2], scale: 0.52, speed: 0.46, phase: 4.8 },
  { label: 'MongoDB', color: '#47A248', position: [1.85, 2.0, -2.1], scale: 0.52, speed: 0.5, phase: 0.2 },
  { label: 'Firebase', color: '#FFCA28', position: [2.15, -2.1, -2.4], scale: 0.5, speed: 0.48, phase: 1.2 },

  // computer engineering / DSA
  { label: 'DSA', color: '#c6ff4d', position: [-0.6, -0.55, -0.6], scale: 0.72, speed: 0.42, phase: 2.0 },
  { label: 'Problem Solving', color: '#56d9ff', position: [0.75, -0.6, -0.7], scale: 0.62, speed: 0.44, phase: 3.2 },
  { label: 'Cybersecurity', color: '#a78bfa', position: [0, 0.9, -1.0], scale: 0.62, speed: 0.46, phase: 4.4 },
]

const textureCache = new Map<string, THREE.CanvasTexture>()

function labelTexture(label: string, color: string): THREE.CanvasTexture {
  const cached = textureCache.get(label)
  if (cached) return cached
  const canvas = document.createElement('canvas')
  canvas.width = 640
  canvas.height = 200
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.clearRect(0, 0, 640, 200)
    ctx.font = '700 80px Inter, Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = color
    ctx.fillText(label, 320, 100)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  textureCache.set(label, tex)
  return tex
}

function createParticlePositions(count = 110) {
  const data = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const radius = 3.2 + Math.random() * 3.2
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    data[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    data[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    data[i * 3 + 2] = radius * Math.cos(phi)
  }
  return data
}

const PARTICLE_POSITIONS = createParticlePositions()

function Particles() {
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[PARTICLE_POSITIONS, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#56d9ff"
        transparent
        opacity={0.24}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function TechLogo({ spec }: { spec: TechSpec }) {
  const ref = useRef<THREE.Group>(null)
  const { label, color, position, scale, speed, phase } = spec
  const tex = labelTexture(label, color)
  const width = (0.5 + label.length * 0.17) * scale
  const height = width * 0.32

  useFrame((state) => {
    // pause motion when the tab is hidden or element is offscreen
    if (document.hidden) return
    const t = state.clock.elapsedTime
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(t * speed + phase) * 0.1
      ref.current.rotation.z = Math.sin(t * speed * 0.5 + phase) * 0.05
    }
  })

  return (
    <group ref={ref} position={position}>
      <sprite scale={[width, height, 1]}>
        <spriteMaterial map={tex} transparent depthWrite={false} />
      </sprite>
    </group>
  )
}

function Core() {
  const group = useRef<THREE.Group>(null)
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useFrame((state) => {
    const { pointer } = state
    if (group.current) {
      const t = state.clock.elapsedTime
      const targetY = -0.25 + pointer.x * 0.35
      const targetX = 0.1 + pointer.y * 0.25

      if (reducedMotion) {
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.05)
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.05)
        group.current.position.set(0, 0, 0)
        return
      }

      if (document.hidden) return

      group.current.position.y = Math.sin(t * 0.4) * 0.08
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        targetY + Math.sin(t * 0.2) * 0.04,
        0.05,
      )
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        targetX + Math.cos(t * 0.25) * 0.02,
        0.05,
      )
    }
  })

  return (
    <group ref={group}>
      {TECH.map((spec) => (
        <TechLogo key={spec.label} spec={spec} />
      ))}
      <Particles />
    </group>
  )
}

function Rig() {
  useFrame((state) => {
    const { pointer, camera } = state
    if (document.hidden) return
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.3, 0.04)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.22, 0.04)
    camera.lookAt(0, 0, 0)
  })
  return null
}

export function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7.2], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <Core />
      <Rig />
    </Canvas>
  )
}
