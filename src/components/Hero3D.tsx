import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Stars, MeshDistortMaterial, Sphere, Octahedron, Torus } from '@react-three/drei'
import * as THREE from 'three'

function ProfitLine() {
  const ref = useRef<THREE.Group>(null)
  const data = [0, 0.4, 0.2, 0.7, 0.5, 0.9, 0.7, 1.1, 1.0, 1.3, 1.2, 1.5]

  const points = useMemo(() =>
    data.map((v, i) => new THREE.Vector3(
      (i / (data.length - 1)) * 5 - 2.5,
      v * 0.8 - 0.4,
      0
    )), [])

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points])

  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.25) * 0.3
      ref.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.15) * 0.08
    }
  })

  return (
    <group ref={ref} position={[0, -0.2, -1]}>
      <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: '#00ff88', linewidth: 2 }))} />
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={1} />
        </mesh>
      ))}
    </group>
  )
}

function FloatShape({ position, color, shape, speed = 2 }: {
  position: [number, number, number]
  color: string
  shape: 'sphere' | 'octa' | 'torus'
  speed?: number
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.x = s.clock.elapsedTime * 0.2
      ref.current.rotation.y = s.clock.elapsedTime * 0.3
    }
  })

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
      {shape === 'sphere' && (
        <Sphere ref={ref} args={[0.4, 32, 32]} position={position}>
          <MeshDistortMaterial color={color} distort={0.4} speed={3} wireframe opacity={0.5} transparent />
        </Sphere>
      )}
      {shape === 'octa' && (
        <Octahedron ref={ref} args={[0.4, 0]} position={position}>
          <meshStandardMaterial color={color} wireframe opacity={0.6} transparent emissive={color} emissiveIntensity={0.3} />
        </Octahedron>
      )}
      {shape === 'torus' && (
        <Torus ref={ref} args={[0.35, 0.12, 16, 32]} position={position}>
          <meshStandardMaterial color={color} wireframe opacity={0.5} transparent />
        </Torus>
      )}
    </Float>
  )
}

function MouseCamera() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })

  useFrame(() => {
    camera.position.x += (mouse.current.x * 1.5 - camera.position.x) * 0.05
    camera.position.y += (-mouse.current.y * 1.0 - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
  })

  useMemo(() => {
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return null
}

function Particles() {
  const count = 120
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return pos
  }, [])

  const ref = useRef<THREE.Points>(null)
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.02
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#8b5cf6" transparent opacity={0.7} />
    </points>
  )
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 pointer-events-none hidden lg:block" style={{ zIndex: 1 }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#00ff88" />
        <pointLight position={[-5, -5, -5]} intensity={0.8} color="#8b5cf6" />

        <MouseCamera />
        <Stars radius={80} depth={50} count={3000} factor={3} saturation={0} fade speed={0.5} />
        <Particles />
        <ProfitLine />

        <FloatShape position={[3.5, 1.5, -1]} color="#00ff88" shape="sphere" speed={1.5} />
        <FloatShape position={[-3.5, -1, -2]} color="#8b5cf6" shape="octa" speed={2} />
        <FloatShape position={[2.5, -2, -1]} color="#06b6d4" shape="torus" speed={2.5} />
        <FloatShape position={[-2, 2, -3]} color="#00ff88" shape="octa" speed={1.8} />
        <FloatShape position={[0.5, 2.5, -2]} color="#8b5cf6" shape="sphere" speed={3} />
      </Canvas>
    </div>
  )
}