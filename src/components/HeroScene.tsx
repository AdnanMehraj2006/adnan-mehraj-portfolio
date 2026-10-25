import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ------------------------------------------------------------------ *
 * Hero scene: a luminous central processor/chip centerpiece.
 * A glowing die, a faint wireframe circuit cage, radiating circuit
 * traces, connected orbital "code symbol" marks, and a restrained
 * particle field. Low-poly, no post-processing.
 * ------------------------------------------------------------------ */

function createParticlePositions(count = 180) {
  const data = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const radius = 3 + Math.random() * 3.4
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
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/* ---- circuit traces: thin lines radiating from the chip ---- */
const TRACE_COUNT = 22

function generateTraces() {
  let seed = 5
  const rand = () => {
    seed = (seed * 48271) % 2147483647
    return seed / 2147483647
  }
  const edges: number[] = []
  for (let i = 0; i < TRACE_COUNT; i++) {
    const theta = rand() * Math.PI * 2
    const phi = Math.acos(2 * rand() - 1)
    const r = 1.35 + rand() * 1.6
    const x = Math.sin(phi) * Math.cos(theta) * r
    const y = Math.sin(phi) * Math.sin(theta) * r
    const z = Math.cos(phi) * r
    // trace goes from a small chip-edge offset to the node
    edges.push(x * 0.16, y * 0.16, z * 0.16, x, y, z)
  }
  return new Float32Array(edges)
}

const TRACE_LINES = generateTraces()

function CircuitTraces() {
  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[TRACE_LINES, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#56d9ff" transparent opacity={0.35} />
    </lineSegments>
  )
}

/* ---- central processor chip ---- */
function Chip() {
  const group = useRef<THREE.Group>(null)
  const dieRef = useRef<THREE.Mesh>(null)
  const cageRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.25) * 0.5
      group.current.rotation.z = Math.sin(t * 0.2 + 1.1) * 0.05
    }
    if (dieRef.current) {
      ;(dieRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.75 + (Math.sin(t * 1.4) + 1) * 0.12
    }
    if (cageRef.current) {
      cageRef.current.rotation.y = -t * 0.2
      cageRef.current.rotation.z = t * 0.1
    }
  })

  return (
    <group ref={group}>
      {/* substrate */}
      <mesh>
        <boxGeometry args={[1.05, 1.05, 0.2]} />
        <meshBasicMaterial color="#0b0e16" />
      </mesh>
      {/* luminous die */}
      <mesh ref={dieRef}>
        <boxGeometry args={[0.6, 0.6, 0.06]} />
        <meshBasicMaterial color="#c6ff4d" transparent opacity={0.85} />
      </mesh>
      {/* soft halo */}
      <mesh>
        <boxGeometry args={[0.9, 0.9, 0.03]} />
        <meshBasicMaterial color="#c6ff4d" transparent opacity={0.15} />
      </mesh>
      {/* wireframe circuit cage */}
      <mesh ref={cageRef}>
        <boxGeometry args={[1.6, 1.6, 1.6]} />
        <meshBasicMaterial color="#56d9ff" wireframe transparent opacity={0.28} />
      </mesh>
      {/* surrounding ring */}
      <Ring radius={1.35} tilt={78} speed={0.5} color="#c6ff4d" opacity={0.2} />
    </group>
  )
}

/* ---- floating "code symbol" marks (orbit nodes) ---- */
interface OrbitNodeProps {
  radius: number
  speed: number
  size: number
  color: string
  phase: number
  tilt: number
  shape?: 'octahedron' | 'tetrahedron' | 'icosahedron'
}

function OrbitNode({ radius, speed, size, color, phase, tilt, shape = 'octahedron' }: OrbitNodeProps) {
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
        {shape === 'tetrahedron' ? (
          <tetrahedronGeometry args={[size, 0]} />
        ) : shape === 'icosahedron' ? (
          <icosahedronGeometry args={[size, 0]} />
        ) : (
          <octahedronGeometry args={[size, 0]} />
        )}
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

function GroundHalo() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * 0.12
  })
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]} position={[0, -1.3, 0]}>
      <ringGeometry args={[1.6, 1.72, 64]} />
      <meshBasicMaterial color="#56d9ff" transparent opacity={0.14} side={THREE.DoubleSide} />
    </mesh>
  )
}

function Core() {
  const group = useRef<THREE.Group>(null)
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useFrame((state) => {
    const { pointer } = state
    if (group.current) {
      const t = state.clock.elapsedTime
      const targetY = -0.3 + pointer.x * 0.45
      const targetX = 0.12 + pointer.y * 0.3

      if (reducedMotion) {
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.06)
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.06)
        group.current.position.set(0, 0, 0)
        return
      }

      // gentle center float
      group.current.position.y = Math.sin(t * 0.5) * 0.1
      group.current.position.x = 0
      group.current.position.z = 0
      // pointer parallax (smooth)
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        targetY + Math.sin(t * 0.3) * 0.05,
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
      <Chip />
      <CircuitTraces />
      <GroundHalo />
      <Ring radius={2} tilt={-58} speed={-0.4} color="#56d9ff" opacity={0.18} />
      <OrbitNode radius={2} speed={0.5} size={0.09} color="#56d9ff" phase={0} tilt={-58} shape="tetrahedron" />
      <OrbitNode radius={1.7} speed={0.6} size={0.07} color="#a78bfa" phase={3.2} tilt={12} shape="icosahedron" />
      <OrbitNode radius={2.3} speed={0.42} size={0.1} color="#c6ff4d" phase={1.6} tilt={70} />
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
      camera={{ position: [0, 0, 6.4], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Core />
      <Rig />
    </Canvas>
  )
}
