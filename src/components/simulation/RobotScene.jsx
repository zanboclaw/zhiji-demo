/* eslint-disable react/no-unknown-property */
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Center, ContactShadows, Environment, Html, OrbitControls, useAnimations, useGLTF } from '@react-three/drei'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'

const ROBOT_MODEL_URL = '/models/RobotExpressive.glb'

function SceneFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-[1.8rem] bg-slate-100">
      <div className="rounded-full border border-sky-100 bg-white/90 px-4 py-2 text-sm text-slate-500 shadow-[0_10px_24px_rgba(148,163,184,0.14)]">
        正在加载 3D 机器人模型...
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <Html center>
      <div className="rounded-full border border-sky-100 bg-white/95 px-4 py-2 text-sm text-slate-500 shadow-[0_10px_24px_rgba(148,163,184,0.14)]">
        正在加载本地 RobotExpressive 模型...
      </div>
    </Html>
  )
}

function resolveAnimationName(names, selectedTool, selectedPart) {
  if (selectedTool === 'move' && names.includes('Walking')) return 'Walking'
  if (selectedTool === 'rotate' && names.includes('Running')) return 'Running'
  if (selectedTool === 'inspect' && names.includes('Gesture')) return 'Gesture'
  if (selectedTool === 'inspect' && names.includes('Wave')) return 'Wave'
  if ((selectedPart === 'head' || selectedPart === 'shoulder') && names.includes('Talking')) return 'Talking'
  if (selectedPart === 'arm' && names.includes('Wave')) return 'Wave'
  if (selectedPart === 'hip' && names.includes('Dance')) return 'Dance'
  if ((selectedPart === 'knee' || selectedPart === 'foot') && names.includes('Walking')) return 'Walking'
  if (names.includes('Idle')) return 'Idle'
  return names[0]
}

function AnimatedRobot({ selectedPart, selectedTool, selectedView, zoom }) {
  const group = useRef(null)
  const { scene, animations } = useGLTF(ROBOT_MODEL_URL)
  const clonedScene = useMemo(() => clone(scene), [scene])
  const { actions, names } = useAnimations(animations, group)

  const activeAnimation = useMemo(
    () => resolveAnimationName(names, selectedTool, selectedPart),
    [names, selectedPart, selectedTool],
  )

  useEffect(() => {
    if (!actions || !activeAnimation) return undefined

    const nextAction = actions[activeAnimation]
    if (!nextAction) return undefined

    nextAction.reset().fadeIn(0.35).play()

    return () => {
      nextAction.fadeOut(0.25)
    }
  }, [actions, activeAnimation])

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [clonedScene])

  const pose = useMemo(() => {
    if (selectedView === 'side') {
      return {
        rotation: [0, Math.PI / 2.2, 0],
        position: [0, -1.15, 0],
      }
    }

    if (selectedView === 'top') {
      return {
        rotation: [0, Math.PI / 6, 0],
        position: [0, -1.15, 0],
      }
    }

    return {
      rotation: [0, Math.PI / 5, 0],
      position: [0, -1.15, 0],
    }
  }, [selectedView])

  return (
    <group ref={group} position={pose.position} rotation={pose.rotation} scale={zoom * 1.85}>
      <Center>
        <primitive object={clonedScene} />
      </Center>
    </group>
  )
}

export function RobotScene({ selectedPart, selectedTool, selectedView, zoom }) {
  const camera = useMemo(() => {
    if (selectedView === 'side') {
      return {
        position: [4.8, 2.1, 4.3],
        target: [0, 0.95, 0],
      }
    }

    if (selectedView === 'top') {
      return {
        position: [0.4, 7.1, 2.3],
        target: [0, 1.05, 0],
      }
    }

    return {
      position: [3.4, 2.25, 5.4],
      target: [0, 1, 0],
    }
  }, [selectedView])

  return (
    <Suspense fallback={<SceneFallback />}>
      <Canvas camera={{ position: camera.position, fov: selectedView === 'top' ? 26 : 28 }} dpr={[1, 1.5]}>
        <Suspense fallback={<LoadingState />}>
          <color attach="background" args={['#f7f9fc']} />
          <fog attach="fog" args={['#f7f9fc', 10, 22]} />

          <ambientLight intensity={1.5} />
          <hemisphereLight intensity={0.95} color="#ffffff" groundColor="#dbeafe" />
          <directionalLight position={[5, 8, 6]} intensity={2.1} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
          <directionalLight position={[-4, 4, -4]} intensity={0.55} color="#bfdbfe" />
          <spotLight position={[0, 10, 3]} angle={0.4} penumbra={0.8} intensity={1.1} color="#d9f9ff" />

          <Environment preset="city" />

          <mesh position={[0, 4.2, -4]}>
            <ringGeometry args={[2.7, 2.88, 80]} />
            <meshBasicMaterial color="#dbeafe" transparent opacity={0.36} />
          </mesh>
          <mesh position={[0, 1.35, -3.9]}>
            <ringGeometry args={[1.2, 1.28, 80]} />
            <meshBasicMaterial color="#bfdbfe" transparent opacity={0.3} />
          </mesh>

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]}>
            <circleGeometry args={[5.6, 48]} />
            <meshStandardMaterial color="#edf3fb" />
          </mesh>

          <AnimatedRobot
            selectedPart={selectedPart}
            selectedTool={selectedTool}
            selectedView={selectedView}
            zoom={zoom}
          />

          <ContactShadows position={[0, -1.7, 0]} opacity={0.24} scale={7.6} blur={2.6} far={4.2} />

          <OrbitControls
            enablePan={false}
            target={camera.target}
            minDistance={4.8}
            maxDistance={9}
            minPolarAngle={selectedView === 'top' ? 0.2 : 0.9}
            maxPolarAngle={selectedView === 'top' ? 0.68 : 2.05}
            autoRotate={selectedView === 'front' && selectedTool !== 'inspect'}
            autoRotateSpeed={0.45}
          />
        </Suspense>
      </Canvas>
    </Suspense>
  )
}

useGLTF.preload(ROBOT_MODEL_URL)
