import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { LOGOS } from './logoAssets'

/* ------------------------------------------------------------------ *
 * Floating 3D Technology Logo Universe (DOM-overlay rendering).
 * Each logo is an inline SVG rendered by the browser inside a Three.js
 * <Html> node — guaranteeing genuine brand colors, transparent
 * backgrounds, and crisp vector silhouettes. The wrapper group is
 * animated in 3D (drift/float/depth/rotation). Borderless.
 * ------------------------------------------------------------------ */

interface LogoPlacement {
  key: keyof typeof LOGOS
  position: [number, number, number]
  size: number // CSS px at base camera distance
  speed: number
  phase: number
  layer: 'fg' | 'mid' | 'bg'
  mobile?: boolean
  hide?: boolean
}

const PLACEMENTS: LogoPlacement[] = [
  // A hidden placeholder is deliberately first so the first <Html> mount
  // (which is otherwise dropped in some browsers) is the invisible one.
  { key: 'mysql', position: [-5, -5, -5], size: 10, speed: 0.3, phase: 0, layer: 'fg', hide: true },
  // foreground — largest, nearest (the five shown on mobile)
  { key: 'react', position: [2.0, 1.1, -0.2], size: 130, speed: 0.45, phase: 1.1, layer: 'fg', mobile: true },
  { key: 'java', position: [-2.0, -1.2, -0.3], size: 120, speed: 0.5, phase: 3.4, layer: 'fg', mobile: true },
  { key: 'python', position: [2.1, -1.3, -0.5], size: 112, speed: 0.48, phase: 4.7, layer: 'fg', mobile: true },
  { key: 'rust', position: [-2.1, 1.2, -0.4], size: 116, speed: 0.48, phase: 3.7, layer: 'fg', mobile: true },
  { key: 'dsa', position: [-0.55, -1.9, 0.3], size: 112, speed: 0.4, phase: 4.1, layer: 'fg' },
  { key: 'cybersecurity', position: [0.8, -2.0, 0.2], size: 106, speed: 0.42, phase: 0.6, layer: 'fg' },

  // middle ground
  { key: 'typescript', position: [2.7, 1.35, -0.2], size: 100, speed: 0.48, phase: 2.0, layer: 'mid' },
  { key: 'html5', position: [-2.7, 1.5, -0.3], size: 98, speed: 0.55, phase: 3.0, layer: 'mid' },
  { key: 'nodejs', position: [-3.3, -0.35, -0.5], size: 94, speed: 0.45, phase: 1.7, layer: 'mid' },
  { key: 'git', position: [3.3, -0.45, -0.5], size: 94, speed: 0.5, phase: 5.2, layer: 'mid' },
  { key: 'cplusplus', position: [-3.6, 2.3, -0.7], size: 88, speed: 0.5, phase: 2.8, layer: 'mid' },
  { key: 'android', position: [0.25, 2.95, -0.4], size: 96, speed: 0.42, phase: 2.6, layer: 'mid' },
  { key: 'problemSolving', position: [-0.25, 1.85, -0.6], size: 92, speed: 0.44, phase: 1.8, layer: 'mid' },
  { key: 'vite', position: [3.0, 2.85, -0.8], size: 84, speed: 0.48, phase: 1.1, layer: 'mid' },
  { key: 'tailwindcss', position: [-3.0, 2.95, -0.9], size: 84, speed: 0.46, phase: 0.3, layer: 'mid' },
  { key: 'github', position: [3.4, -2.25, -0.7], size: 90, speed: 0.45, phase: 0.4, layer: 'mid' },
  { key: 'npm', position: [-3.4, -2.25, -0.8], size: 82, speed: 0.5, phase: 1.4, layer: 'mid' },
  { key: 'mysql', position: [-1.7, 3.3, -1.1], size: 80, speed: 0.48, phase: 2.4, layer: 'mid' },
  { key: 'mongodb', position: [1.8, 3.35, -1.1], size: 80, speed: 0.45, phase: 3.4, layer: 'mid' },

  // background — smallest, farthest
  { key: 'c', position: [-2.6, -3.0, -1.7], size: 66, speed: 0.5, phase: 1.9, layer: 'bg' },
  { key: 'csharp', position: [-1.0, -3.2, -1.8], size: 64, speed: 0.5, phase: 4.5, layer: 'bg' },
  { key: 'php', position: [2.5, -3.1, -1.6], size: 66, speed: 0.52, phase: 5.3, layer: 'bg' },
  { key: 'nextjs', position: [3.2, 0.85, -1.9], size: 70, speed: 0.4, phase: 0.8, layer: 'bg' },
  { key: 'javascript', position: [0, 0, -0.3], size: 150, speed: 0.35, phase: 0.0, layer: 'fg', mobile: true },
]

const dataUrlCache = new Map<string, string>()

function logoDataUrl(key: keyof typeof LOGOS): string {
  const cached = dataUrlCache.get(key)
  if (cached) return cached
  const b64 = btoa(unescape(encodeURIComponent(LOGOS[key].svg)))
  const url = `data:image/svg+xml;base64,${b64}`
  dataUrlCache.set(key, url)
  return url
}

function motionFactor() {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1200
  if (w <= 700) return 1.35
  if (w <= 1024) return 1.1
  return 1
}

function TechLogo({ placement }: { placement: LogoPlacement }) {
  const ref = useRef<THREE.Group>(null)
  const { key, position, size, speed, phase, layer, mobile, hide } = placement
  const responsiveSize = Math.round(size * motionFactor())

  useFrame((state) => {
    if (document.hidden) return
    const t = state.clock.elapsedTime
    if (ref.current) {
      // Layered low-frequency sines give each logo a slowly-morphing,
      // multi-direction drift (up/down, sideways, and depth) with smooth
      // direction transitions — no snapping, deterministic per logo.
      const x1 = Math.cos(t * speed + phase)
      const x2 = Math.sin(t * speed * 0.23 + phase * 3)
      const y1 = Math.sin(t * speed * 0.82 + phase * 1.7)
      const y2 = Math.cos(t * speed * 0.2 + phase * 2.4)
      const z1 = Math.sin(t * speed * 0.7 + phase * 2)
      const z2 = Math.cos(t * speed * 0.31 + phase * 1.2)
      ref.current.position.x = position[0] + 0.5 * x1 + 0.28 * x2
      ref.current.position.y = position[1] + 0.34 * y1 + 0.2 * y2
      ref.current.position.z = position[2] + 0.55 * z1 + 0.3 * z2
      ref.current.rotation.z = Math.sin(t * speed * 0.45 + phase) * 0.08
      ref.current.rotation.y = Math.sin(t * speed * 0.38 + phase * 1.3) * 0.4
    }
  })

  return (
    <group ref={ref} position={position}>
      <Html
        center
        transform
        zIndexRange={[20, 0]}
        wrapperClass={`hero-logo hero-logo--${layer}${mobile ? ' hero-logo--keep' : ''}${hide ? ' hero-logo--hidden' : ''}`}
        style={{ pointerEvents: 'none' }}
      >
        <img
          src={logoDataUrl(key)}
          alt={LOGOS[key].name}
          data-logo={key}
          style={{
            width: `${responsiveSize}px`,
            height: `${responsiveSize}px`,
            display: 'block',
          }}
        />
      </Html>
    </group>
  )
}

function Core() {
  const group = useRef<THREE.Group>(null)
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useFrame((state) => {
    const { pointer } = state
    if (group.current) {
      const targetY = -0.2 + pointer.x * 0.3
      const targetX = 0.08 + pointer.y * 0.2
      if (reducedMotion) {
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.05)
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.05)
        group.current.position.set(0, 0, 0)
        return
      }
      if (document.hidden) return
      const t = state.clock.elapsedTime
      group.current.position.y = Math.sin(t * 0.35) * 0.08
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        targetY + Math.sin(t * 0.18) * 0.04,
        0.05,
      )
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        targetX + Math.cos(t * 0.22) * 0.02,
        0.05,
      )
    }
  })

  return (
    <group ref={group}>
      {PLACEMENTS.map((p) => (
        <TechLogo key={p.key} placement={p} />
      ))}
    </group>
  )
}

export function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 12], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Core />
    </Canvas>
  )
}
