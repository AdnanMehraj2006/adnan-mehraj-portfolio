import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function createParticlePositions(count = 360) {
  const data = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const radius = 2.6 + Math.random() * 3.4
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
  const positions = PARTICLE_POSITIONS

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        color="#56d9ff"
        transparent
        opacity={0.65}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

interface OrbitNodeProps {
  radius: number
  speed: number
  size: number
  color: string
  phase: number
  tilt: number
}

function OrbitNode({ radius, speed, size, color, phase, tilt }: OrbitNodeProps) {
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
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * speed
    }
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

function Core() {
  const group = useRef<THREE.Group>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const wireRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (group.current) {
      group.current.rotation.y = t * 0.12
      group.current.rotation.x = Math.sin(t * 0.1) * 0.15
    }
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.3
      const s = 1 + Math.sin(t * 1.6) * 0.06
      coreRef.current.scale.setScalar(s)
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = -t * 0.2
      wireRef.current.rotation.z = t * 0.12
    }
  })

  return (
    <group ref={group}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.72, 32, 32]} />
        <meshBasicMaterial color="#c6ff4d" />
      </mesh>
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.7, 1]} />
        <meshBasicMaterial color="#56d9ff" wireframe transparent opacity={0.35} />
      </mesh>
      <Ring radius={2.4} tilt={72} speed={0.5} color="#56d9ff" opacity={0.28} />
      <Ring radius={2.05} tilt={-58} speed={-0.4} color="#c6ff4d" opacity={0.2} />
      <OrbitNode radius={2.4} speed={0.5} size={0.12} color="#c6ff4d" phase={0} tilt={72} />
      <OrbitNode radius={2.05} speed={0.44} size={0.09} color="#56d9ff" phase={2.2} tilt={-58} />
      <OrbitNode radius={1.9} speed={0.6} size={0.06} color="#a78bfa" phase={4.1} tilt={10} />
      <Particles />
    </group>
  )
}

function Rig() {
  useFrame((state) => {
    const { pointer, camera } = state
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.55, 0.04)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.4, 0.04)
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
