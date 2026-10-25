import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ------------------------------------------------------------------ *
 * Hero scene: an interactive, perspective developer composition. A    *
 * front code editor and a secondary terminal panel are layered in 3D   *
 * space (offset positions/rotations give visible sides and depth).    *
 * The whole group eases toward the pointer for mouse-driven rotation,  *
 * layered over a gentle idle float. Low-poly, no post-processing.     *
 * ------------------------------------------------------------------ */

function createParticlePositions(count = 200) {
  const data = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const radius = 3.2 + Math.random() * 3.4
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
        size={0.03}
        color="#56d9ff"
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/* ---- faint circuit/network details ---- */
const NETWORK_COUNT = 36

function generateNetwork() {
  let seed = 13
  const rand = () => {
    seed = (seed * 48271) % 2147483647
    return seed / 2147483647
  }
  const points: number[] = []
  for (let i = 0; i < NETWORK_COUNT; i++) {
    const radius = 2.6 + rand() * 2.4
    const theta = rand() * Math.PI * 2
    const phi = Math.acos(2 * rand() - 1)
    points.push(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi),
    )
  }
  const edges: number[] = []
  const connect = (a: number, b: number) => {
    const off = a * 3
    const off2 = b * 3
    for (let k = 0; k < 3; k++) edges.push(points[off + k], points[off2 + k])
  }
  for (let i = 0; i < NETWORK_COUNT; i++) connect(i, (i + 1) % NETWORK_COUNT)
  const chordCount = Math.floor(NETWORK_COUNT * 0.5)
  for (let c = 0; c < chordCount; c++) {
    const a = Math.floor(rand() * NETWORK_COUNT)
    let b = Math.floor(rand() * NETWORK_COUNT)
    if (b === a) b = (b + 1) % NETWORK_COUNT
    connect(a, b)
  }
  return new Float32Array(edges)
}

const NETWORK_LINES = generateNetwork()

function CircuitNetwork() {
  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[NETWORK_LINES, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#56d9ff" transparent opacity={0.18} />
    </lineSegments>
  )
}

interface LineSpec {
  x: number
  y: number
  w: number
  color: string
  opacity: number
}

const CODE_LINES: LineSpec[] = [
  { x: -0.9, y: 0.5, w: 1.0, color: '#c6ff4d', opacity: 0.9 },
  { x: -0.5, y: 0.29, w: 0.8, color: '#56d9ff', opacity: 0.85 },
  { x: -1.05, y: 0.08, w: 1.9, color: '#a78bfa', opacity: 0.85 },
  { x: -0.65, y: -0.13, w: 1.2, color: '#c6ff4d', opacity: 0.6 },
  { x: -0.95, y: -0.34, w: 0.65, color: '#56d9ff', opacity: 0.7 },
  { x: -0.45, y: -0.52, w: 0.9, color: '#f1f5f9', opacity: 0.35 },
]

const TERMINAL_LINES: LineSpec[] = [
  { x: -0.55, y: 0.28, w: 0.9, color: '#c6ff4d', opacity: 0.8 },
  { x: -0.65, y: 0.07, w: 1.2, color: '#56d9ff', opacity: 0.7 },
  { x: -0.7, y: -0.14, w: 0.75, color: '#f1f5f9', opacity: 0.45 },
]

/* ---- front code editor panel (independent float + tilt) ---- */
function EditorPanel() {
  const group = useRef<THREE.Group>(null)
  const caretRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (group.current) {
      // continuous float + gentle tilts (own phase, layered under the orbit)
      group.current.position.y = Math.sin(t * 0.6 + 0.4) * 0.1
      group.current.rotation.x = Math.sin(t * 0.4) * 0.05
      group.current.rotation.z = Math.sin(t * 0.5 + 1.2) * 0.06
    }
    if (caretRef.current) {
      ;(caretRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.5 + (Math.sin(t * 3) + 1) * 0.25
    }
  })

  return (
    <group ref={group}>
      <mesh>
        <boxGeometry args={[2.5, 1.7, 0.14]} />
        <meshBasicMaterial color="#0d121b" />
      </mesh>
      <mesh position={[0, 0.82, 0.07]}>
        <boxGeometry args={[2.5, 0.18, 0.05]} />
        <meshBasicMaterial color="#151b27" />
      </mesh>
      <mesh position={[-1.12, 0.82, 0.1]}>
        <boxGeometry args={[0.05, 0.05, 0.03]} />
        <meshBasicMaterial color="#c6ff4d" />
      </mesh>
      <mesh position={[-1.04, 0.82, 0.1]}>
        <boxGeometry args={[0.05, 0.05, 0.03]} />
        <meshBasicMaterial color="#56d9ff" />
      </mesh>
      {CODE_LINES.map((line, i) => (
        <mesh key={i} position={[line.x, line.y, 0.09]}>
          <boxGeometry args={[line.w, 0.06, 0.03]} />
          <meshBasicMaterial color={line.color} transparent opacity={line.opacity} />
        </mesh>
      ))}
      <mesh ref={caretRef} position={[0.5, 0.29, 0.1]}>
        <boxGeometry args={[0.03, 0.1, 0.03]} />
        <meshBasicMaterial color="#c6ff4d" transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

/* ---- secondary terminal panel, layered behind/right, independent motion ---- */
function TerminalPanel() {
  const group = useRef<THREE.Group>(null)
  const caretRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (group.current) {
      // independent speed / phase so it moves apart from the editor panel
      group.current.position.y = -0.12 + Math.sin(t * 0.5 + 2.1) * 0.1
      group.current.position.x = 1.1 + Math.sin(t * 0.32 + 0.8) * 0.1
      group.current.rotation.y = -0.55 + Math.sin(t * 0.38) * 0.09
      group.current.rotation.x = -0.12 + Math.sin(t * 0.45 + 0.5) * 0.06
    }
    if (caretRef.current) {
      ;(caretRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.5 + (Math.sin(t * 2.4) + 1) * 0.25
    }
  })

  return (
    <group ref={group} position={[1.1, -0.12, -0.85]} rotation={[-0.12, -0.55, 0]}>
      <mesh>
        <boxGeometry args={[1.55, 1.0, 0.12]} />
        <meshBasicMaterial color="#0a0d14" />
      </mesh>
      <mesh position={[0, 0.46, 0.06]}>
        <boxGeometry args={[1.55, 0.14, 0.04]} />
        <meshBasicMaterial color="#151b27" />
      </mesh>
      <mesh position={[-0.7, 0.46, 0.08]}>
        <boxGeometry args={[0.04, 0.04, 0.02]} />
        <meshBasicMaterial color="#c6ff4d" />
      </mesh>
      {TERMINAL_LINES.map((line, i) => (
        <mesh key={i} position={[line.x, line.y, 0.07]}>
          <boxGeometry args={[line.w, 0.05, 0.03]} />
          <meshBasicMaterial color={line.color} transparent opacity={line.opacity} />
        </mesh>
      ))}
      <mesh ref={caretRef} position={[0.55, -0.14, 0.07]}>
        <boxGeometry args={[0.03, 0.08, 0.03]} />
        <meshBasicMaterial color="#c6ff4d" transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

/* ---- grounding ring (subtle depth cue) ---- */
function GroundRing() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * 0.15
  })
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]} position={[0, -1.35, 0]}>
      <ringGeometry args={[1.7, 1.82, 64]} />
      <meshBasicMaterial color="#56d9ff" transparent opacity={0.16} side={THREE.DoubleSide} />
    </mesh>
  )
}

/* ---- restrained orbital marks ---- */
function OrbitNode({ radius, speed, size, color, phase, tilt }: { radius: number; speed: number; size: number; color: string; phase: number; tilt: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + phase
    const x = Math.cos(t) * radius
    const z = Math.sin(t) * radius
    const y = Math.sin(t * 0.7) * radius * 0.25
    if (ref.current) {
      ref.current.position.set(x, y, z)
      ref.current.rotation.x = t
      ref.current.rotation.y = t * 0.8
    }
  })
  const tiltRad = (tilt * Math.PI) / 180
  return (
    <group rotation={[tiltRad, 0, tiltRad * 0.6]}>
      <mesh ref={ref}>
        <octahedronGeometry args={[size, 0]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.85} />
      </mesh>
    </group>
  )
}

function Ring({ radius, tilt, speed, color, opacity }: { radius: number; tilt: number; speed: number; color: string; opacity: number }) {
  const ref = useRef<THREE.Mesh>(null)
  const tiltRad = (tilt * Math.PI) / 180
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * speed
  })
  return (
    <group rotation={[tiltRad, 0, 0]}>
      <mesh ref={ref}>
        <torusGeometry args={[radius, 0.008, 8, 120]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
    </group>
  )
}

/**
 * Interactive group: a gentle continuous orbital path (sine x / cosine y)
 * with a subtle tilt that follows the motion, layered under the mouse
 * parallax rotation. Respects reduced motion by holding a neutral pose.
 */
function Core() {
  const group = useRef<THREE.Group>(null)
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useFrame((state) => {
    const { pointer } = state
    if (group.current) {
      const t = state.clock.elapsedTime
      const targetY = -0.35 + pointer.x * 0.5
      const targetX = 0.14 + pointer.y * 0.35

      if (reducedMotion) {
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.06)
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.06)
        group.current.position.set(0, 0, 0)
        group.current.rotation.z = 0
        return
      }

      // circular orbital drift (up/down + left/right), different phases on axes
      group.current.position.x = Math.sin(t * 0.5 + 1.2) * 0.22
      group.current.position.y = Math.cos(t * 0.45) * 0.14
      group.current.position.z = 0
      // subtle tilt follows the motion
      group.current.rotation.z = Math.sin(t * 0.4) * 0.05

      // mouse parallax (additional), smoothly lerped; does not fight orbit
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        targetY + Math.sin(t * 0.3) * 0.06,
        0.06,
      )
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        targetX + Math.cos(t * 0.35) * 0.03,
        0.06,
      )
    }
  })

  return (
    <group ref={group}>
      <EditorPanel />
      <TerminalPanel />
      <GroundRing />
      <Ring radius={2.2} tilt={72} speed={0.5} color="#56d9ff" opacity={0.2} />
      <Ring radius={1.8} tilt={-58} speed={-0.4} color="#c6ff4d" opacity={0.14} />
      <OrbitNode radius={2.2} speed={0.5} size={0.09} color="#c6ff4d" phase={0} tilt={72} />
      <OrbitNode radius={1.8} speed={0.44} size={0.07} color="#56d9ff" phase={2.2} tilt={-58} />
      <CircuitNetwork />
      <Particles />
    </group>
  )
}

function Rig() {
  useFrame((state) => {
    const { pointer, camera } = state
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.4, 0.04)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.3, 0.04)
    camera.lookAt(0, 0, 0)
  })
  return null
}

export function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0.2, 6.6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Core />
      <Rig />
    </Canvas>
  )
}
