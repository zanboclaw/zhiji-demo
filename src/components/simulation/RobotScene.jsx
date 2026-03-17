/* eslint-disable react/no-unknown-property */
import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, Float, OrbitControls, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

function useRobotMaterials(selectedPart) {
  return useMemo(() => {
    const baseShell = new THREE.MeshPhysicalMaterial({
      color: '#f5f8ff',
      metalness: 0.7,
      roughness: 0.22,
      clearcoat: 0.85,
      clearcoatRoughness: 0.16,
      envMapIntensity: 1.4,
    })

    const activeShell = new THREE.MeshPhysicalMaterial({
      color: '#e7fbff',
      metalness: 0.72,
      roughness: 0.18,
      clearcoat: 0.95,
      clearcoatRoughness: 0.12,
      emissive: '#67e8f9',
      emissiveIntensity: 0.22,
      envMapIntensity: 1.6,
    })

    const trim = new THREE.MeshStandardMaterial({
      color: '#111827',
      metalness: 0.92,
      roughness: 0.22,
    })

    const joint = new THREE.MeshStandardMaterial({
      color: '#2d3748',
      metalness: 0.78,
      roughness: 0.35,
    })

    const glow = new THREE.MeshStandardMaterial({
      color: selectedPart ? '#67e8f9' : '#38bdf8',
      emissive: selectedPart ? '#67e8f9' : '#38bdf8',
      emissiveIntensity: selectedPart ? 2.1 : 1.45,
      metalness: 0.35,
      roughness: 0.14,
    })

    return { baseShell, activeShell, trim, joint, glow }
  }, [selectedPart])
}

function getShell(materials, active) {
  return active ? materials.activeShell : materials.baseShell
}

function RobotModel({ selectedPart }) {
  const materials = useRobotMaterials(selectedPart)

  return (
    <Float speed={1.4} rotationIntensity={0.07} floatIntensity={0.18}>
      <group position={[0, -1.08, 0]} rotation={[0, -0.08, 0]}>
        <group position={[0, 2.68, 0]}>
          <mesh position={[0, 0.02, 0]} material={getShell(materials, selectedPart === 'head')}>
            <capsuleGeometry args={[0.42, 0.62, 10, 24]} />
          </mesh>
          <RoundedBox
            args={[0.86, 0.34, 0.55]}
            radius={0.12}
            smoothness={5}
            position={[0, -0.08, 0.28]}
            material={materials.trim}
          />
          <mesh position={[0, -0.08, 0.34]} material={materials.glow}>
            <sphereGeometry args={[0.1, 24, 24]} />
          </mesh>
          <mesh position={[-0.22, -0.08, 0.34]} material={materials.glow}>
            <sphereGeometry args={[0.06, 24, 24]} />
          </mesh>
          <mesh position={[0.22, -0.08, 0.34]} material={materials.glow}>
            <sphereGeometry args={[0.06, 24, 24]} />
          </mesh>
          <RoundedBox
            args={[0.2, 0.24, 0.12]}
            radius={0.05}
            smoothness={4}
            position={[0, 0.2, 0.34]}
            material={getShell(materials, selectedPart === 'head')}
          />
          <mesh position={[0, -0.54, 0]} material={materials.joint}>
            <cylinderGeometry args={[0.14, 0.18, 0.34, 24]} />
          </mesh>
        </group>

        <group position={[0, 1.56, 0]}>
          <mesh material={getShell(materials, selectedPart === 'shoulder')}>
            <capsuleGeometry args={[0.68, 0.74, 10, 28]} />
          </mesh>
          <RoundedBox
            args={[1.7, 0.44, 0.88]}
            radius={0.16}
            smoothness={5}
            position={[0, 0.32, 0.02]}
            material={getShell(materials, selectedPart === 'shoulder')}
          />
          <RoundedBox
            args={[1.12, 0.42, 0.16]}
            radius={0.07}
            smoothness={4}
            position={[0, 0.22, 0.48]}
            material={materials.trim}
          />
          <mesh position={[0, -0.74, 0.18]} material={materials.trim}>
            <cylinderGeometry args={[0.36, 0.44, 0.8, 24]} />
          </mesh>
          <RoundedBox
            args={[0.86, 1.12, 0.46]}
            radius={0.12}
            smoothness={5}
            position={[0, -0.36, 0.1]}
            material={getShell(materials, selectedPart === 'hip')}
          />
          <RoundedBox
            args={[0.42, 0.54, 0.24]}
            radius={0.08}
            smoothness={4}
            position={[0, -1.02, 0.18]}
            material={materials.trim}
          />
        </group>

        {[
          { x: -1.34, z: 0.02 },
          { x: 1.34, z: 0.02 },
        ].map((arm) => (
          <group key={arm.x} position={[arm.x, 1.78, arm.z]}>
            <mesh material={getShell(materials, selectedPart === 'shoulder')}>
              <sphereGeometry args={[0.34, 24, 24]} />
            </mesh>
            <RoundedBox
              args={[0.56, 0.62, 0.58]}
              radius={0.12}
              smoothness={4}
              position={[0, -0.08, 0]}
              material={getShell(materials, selectedPart === 'shoulder')}
            />
            <mesh position={[0, -0.62, 0]} material={materials.joint}>
              <cylinderGeometry args={[0.13, 0.18, 0.52, 20]} />
            </mesh>
            <RoundedBox
              args={[0.34, 1.24, 0.34]}
              radius={0.08}
              smoothness={4}
              position={[0, -1.38, 0]}
              material={getShell(materials, selectedPart === 'arm')}
            />
            <mesh position={[0, -2.12, 0]} material={materials.joint}>
              <sphereGeometry args={[0.15, 24, 24]} />
            </mesh>
            <RoundedBox
              args={[0.28, 1.08, 0.28]}
              radius={0.06}
              smoothness={4}
              position={[0, -2.82, 0]}
              material={getShell(materials, selectedPart === 'arm')}
            />
            <RoundedBox
              args={[0.26, 0.3, 0.22]}
              radius={0.04}
              smoothness={4}
              position={[0, -3.52, 0.08]}
              material={materials.trim}
            />
            {[-0.09, 0, 0.09].map((offset) => (
              <mesh key={offset} position={[offset, -3.72, 0.16]} material={materials.trim}>
                <boxGeometry args={[0.05, 0.2, 0.05]} />
              </mesh>
            ))}
          </group>
        ))}

        <group position={[0, -0.12, 0]}>
          <RoundedBox
            args={[1.06, 0.82, 0.78]}
            radius={0.16}
            smoothness={5}
            material={getShell(materials, selectedPart === 'hip')}
          />
          <RoundedBox
            args={[0.46, 0.42, 0.22]}
            radius={0.08}
            smoothness={4}
            position={[0, -0.54, 0.18]}
            material={materials.trim}
          />
        </group>

        {[
          { x: -0.46, footTilt: 0.08 },
          { x: 0.46, footTilt: -0.08 },
        ].map((leg) => (
          <group key={leg.x} position={[leg.x, -0.84, 0]}>
            <mesh position={[0, 0, 0]} material={materials.joint}>
              <sphereGeometry args={[0.18, 24, 24]} />
            </mesh>
            <RoundedBox
              args={[0.48, 1.68, 0.52]}
              radius={0.1}
              smoothness={5}
              position={[0, -0.96, 0]}
              material={getShell(materials, selectedPart === 'hip')}
            />
            <mesh position={[0, -2.06, 0]} material={materials.joint}>
              <sphereGeometry args={[0.19, 24, 24]} />
            </mesh>
            <RoundedBox
              args={[0.44, 1.54, 0.44]}
              radius={0.09}
              smoothness={4}
              position={[0, -3.08, 0]}
              material={getShell(materials, selectedPart === 'knee')}
            />
            <RoundedBox
              args={[0.52, 0.44, 1.1]}
              radius={0.09}
              smoothness={4}
              position={[0, -4.04, 0.22]}
              rotation={[0, leg.footTilt, 0]}
              material={getShell(materials, selectedPart === 'foot')}
            />
            <mesh position={[0, -4.02, 0.56]} material={materials.trim}>
              <boxGeometry args={[0.32, 0.16, 0.48]} />
            </mesh>
            {[-0.14, 0, 0.14].map((offset) => (
              <mesh key={offset} position={[offset, -4.08, 0.8]} material={materials.trim}>
                <boxGeometry args={[0.08, 0.08, 0.24]} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </Float>
  )
}

function SceneFallback() {
  return <div className="h-full w-full animate-pulse rounded-[1.8rem] bg-slate-100" />
}

export function RobotScene({ selectedPart, selectedView, zoom }) {
  const camera = useMemo(() => {
    if (selectedView === 'side') {
      return {
        position: [5.8, 0.65, 0.8],
        fov: 26,
        target: [0, -0.1, 0],
      }
    }

    if (selectedView === 'top') {
      return {
        position: [0.2, 6.6, 1.4],
        fov: 24,
        target: [0, -0.4, 0],
      }
    }

    return {
      position: [0.75, 1.05, 5.8],
      fov: 24,
      target: [0, -0.35, 0],
    }
  }, [selectedView])

  return (
    <Suspense fallback={<SceneFallback />}>
      <Canvas
        shadows
        camera={{ position: camera.position, fov: camera.fov }}
        dpr={[1, 1.6]}
      >
        <color attach="background" args={['#f6f8fc']} />
        <fog attach="fog" args={['#f6f8fc', 9, 17]} />
        <ambientLight intensity={1.25} />
        <hemisphereLight intensity={0.7} color="#f8fbff" groundColor="#dbeafe" />
        <directionalLight
          castShadow
          position={[5, 8, 6]}
          intensity={1.9}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-5, 4, -4]} intensity={0.42} color="#c7d2fe" />
        <spotLight position={[0, 7, 5]} intensity={0.7} angle={0.35} penumbra={0.7} color="#cffafe" />
        <Environment preset="city" />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5.05, 0]}>
          <circleGeometry args={[5.4, 48]} />
          <meshStandardMaterial color="#edf3fb" />
        </mesh>

        <group scale={zoom}>
          <RobotModel selectedPart={selectedPart} />
        </group>

        <ContactShadows position={[0, -5.02, 0]} opacity={0.22} scale={10.4} blur={2.9} far={6.2} />
        <OrbitControls
          enablePan={false}
          target={camera.target}
          minDistance={3.8}
          maxDistance={8.2}
          minPolarAngle={selectedView === 'top' ? 0.18 : 0.95}
          maxPolarAngle={selectedView === 'top' ? 0.7 : 2.08}
          autoRotate={selectedView === 'front'}
          autoRotateSpeed={0.55}
        />
      </Canvas>
    </Suspense>
  )
}
