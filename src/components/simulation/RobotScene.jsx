/* eslint-disable react/no-unknown-property */
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Box3, Vector3 } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'

const ROBOT_MODEL_VERSION = '20260320-rigged-v2'
const ROBOT_MODEL_URL = `/models/rigged-robot-v2.glb?v=${ROBOT_MODEL_VERSION}`

function SceneFallback() {
  return <div className="h-full w-full rounded-[1.8rem] bg-[linear-gradient(180deg,#eff3f8_0%,#e7edf5_100%)]" />
}

function CameraRig({ fov, position, target }) {
  const { camera } = useThree()
  const targetRef = useRef(new Vector3(...target))
  const desiredTarget = useMemo(() => new Vector3(...target), [target])
  const desiredPosition = useMemo(() => new Vector3(...position), [position])

  useEffect(() => {
    camera.fov = fov
    camera.updateProjectionMatrix()
  }, [camera, fov])

  useEffect(() => {
    targetRef.current.set(...target)
    camera.position.set(...position)
    camera.lookAt(...target)
  }, [camera, position, target])

  useFrame((_, delta) => {
    const easing = 1 - Math.exp(-delta * 4.5)
    camera.position.lerp(desiredPosition, easing)
    targetRef.current.lerp(desiredTarget, easing)
    camera.lookAt(targetRef.current)
  })

  return null
}

const PART_FOCUS_MAP = {
  head: { position: [0, 3.95, 0.18], color: '#fb923c' },
  shoulder: { position: [-1.18, 3.02, 0.12], color: '#38bdf8' },
  arm: { position: [1.34, 2.32, 0.18], color: '#f97316' },
  hip: { position: [0, 1.92, 0.16], color: '#f59e0b' },
  knee: { position: [-0.48, 0.98, 0.26], color: '#60a5fa' },
  foot: { position: [0.74, 0.22, 0.52], color: '#34d399' },
}

function getModelBounds(root) {
  root.updateMatrixWorld(true)

  const bounds = new Box3()
  let hasBounds = false

  root.traverse((child) => {
    if (!child.isMesh || !child.geometry) return

    child.geometry.computeBoundingBox()
    const geometryBox = child.geometry.boundingBox

    if (!geometryBox) return

    const meshBounds = geometryBox.clone().applyMatrix4(child.matrixWorld)

    if (!Number.isFinite(meshBounds.min.x) || !Number.isFinite(meshBounds.max.x)) {
      return
    }

    if (!hasBounds) {
      bounds.copy(meshBounds)
      hasBounds = true
      return
    }

    bounds.union(meshBounds)
  })

  if (!hasBounds) return null

  const size = new Vector3()
  const center = new Vector3()

  bounds.getSize(size)
  bounds.getCenter(center)

  return {
    bounds,
    center,
    size,
  }
}

function StageEffects({ selectedPart, selectedTool }) {
  const orbitRingRef = useRef(null)
  const scanRingRef = useRef(null)
  const haloRingRef = useRef(null)
  const partFocus = selectedPart ? PART_FOCUS_MAP[selectedPart] : null

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime

    if (orbitRingRef.current) {
      orbitRingRef.current.rotation.z = elapsed * 0.28
    }

    if (haloRingRef.current?.material) {
      haloRingRef.current.material.opacity = 0.16 + Math.sin(elapsed * 0.9) * 0.04
    }

    if (scanRingRef.current?.material) {
      const isInspecting = selectedTool === 'inspect'
      const pulse = isInspecting
        ? 1 + Math.sin(elapsed * 2.4) * 0.09
        : 1 + Math.sin(elapsed * 1.2) * 0.03

      scanRingRef.current.scale.set(pulse, pulse, 1)
      scanRingRef.current.material.opacity = isInspecting ? 0.34 + Math.sin(elapsed * 2.4) * 0.06 : 0.14
    }
  })

  return (
    <>
      <mesh ref={orbitRingRef} position={[0, 4.2, -4.02]}>
        <ringGeometry args={[2.62, 2.82, 56]} />
        <meshBasicMaterial color="#d5dde8" transparent opacity={0.24} />
      </mesh>
      <mesh ref={haloRingRef} position={[0, 1.4, -3.92]}>
        <ringGeometry args={[1.12, 1.28, 48]} />
        <meshBasicMaterial color={partFocus?.color ?? '#cfd8e3'} transparent opacity={0.16} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.22, 0]}>
        <circleGeometry args={[5.9, 40]} />
        <meshStandardMaterial color="#edf2f7" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.1, 0.08]}>
        <circleGeometry args={[2.2, 36]} />
        <meshBasicMaterial color="#475569" transparent opacity={0.06} />
      </mesh>
      <mesh ref={scanRingRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.04, 0.08]}>
        <ringGeometry args={[0.96, 1.12, 48]} />
        <meshBasicMaterial color={partFocus?.color ?? '#64748b'} transparent opacity={0.14} />
      </mesh>
    </>
  )
}

function PartFocusMarker({ selectedPart }) {
  const ringRef = useRef(null)
  const beaconRef = useRef(null)
  const pointRef = useRef(null)
  const focus = selectedPart ? PART_FOCUS_MAP[selectedPart] : null

  useFrame((state) => {
    if (!focus) return

    const elapsed = state.clock.elapsedTime

    if (ringRef.current) {
      const scale = 1 + Math.sin(elapsed * 2.8) * 0.08
      ringRef.current.scale.set(scale, scale, 1)
      ringRef.current.rotation.z = elapsed * 0.4
    }

    if (pointRef.current) {
      pointRef.current.position.y = 0.92 + Math.sin(elapsed * 2.4) * 0.05
    }

    if (beaconRef.current?.material) {
      beaconRef.current.material.opacity = 0.2 + Math.sin(elapsed * 2.2) * 0.06
    }
  })

  if (!focus) return null

  return (
    <group position={focus.position}>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.16, 0.24, 36]} />
        <meshBasicMaterial color={focus.color} transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]}>
        <circleGeometry args={[0.07, 24]} />
        <meshBasicMaterial color={focus.color} transparent opacity={0.16} />
      </mesh>
      <mesh ref={beaconRef} position={[0, 0.44, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.86, 12]} />
        <meshBasicMaterial color={focus.color} transparent opacity={0.2} />
      </mesh>
      <mesh ref={pointRef} position={[0, 0.92, 0]}>
        <sphereGeometry args={[0.08, 20, 20]} />
        <meshBasicMaterial color={focus.color} />
      </mesh>
      <pointLight position={[0, 0.86, 0]} intensity={0.45} distance={1.8} color={focus.color} />
    </group>
  )
}

function ToolAssist({ selectedPart, selectedTool }) {
  const inspectRef = useRef(null)
  const rotateRef = useRef(null)
  const moveRef = useRef(null)
  const measureRef = useRef(null)
  const focus = selectedPart ? PART_FOCUS_MAP[selectedPart] ?? PART_FOCUS_MAP.hip : PART_FOCUS_MAP.hip
  const anchor = focus.position

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime

    if (inspectRef.current?.material) {
      inspectRef.current.position.x = anchor[0] + Math.sin(elapsed * 1.5) * (selectedPart ? 0.18 : 0.75)
      inspectRef.current.material.opacity = 0.14 + Math.sin(elapsed * 2) * 0.04
    }

    if (rotateRef.current) {
      rotateRef.current.rotation.y = elapsed * 0.9
      rotateRef.current.rotation.x = Math.PI / 2 + Math.sin(elapsed * 1.2) * 0.08
    }

    if (moveRef.current) {
      const scale = 1 + Math.sin(elapsed * 2.1) * 0.03
      moveRef.current.scale.set(scale, scale, scale)
      moveRef.current.position.y = anchor[1] + Math.sin(elapsed * 1.8) * 0.03
    }

    if (measureRef.current) {
      measureRef.current.rotation.y = elapsed * 0.18
    }
  })

  if (selectedTool === 'inspect') {
    return (
      <mesh ref={inspectRef} position={[anchor[0], 2.15, anchor[2] + 0.04]}>
        <boxGeometry args={[0.08, 5.3, selectedPart ? 0.78 : 2.65]} />
        <meshBasicMaterial color="#fb923c" transparent opacity={0.16} />
      </mesh>
    )
  }

  if (selectedTool === 'rotate') {
    return (
      <group ref={rotateRef} position={selectedPart ? anchor : [0, 2.18, 0.14]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[selectedPart ? 0.34 : 1.45, 0.022, 18, 96]} />
          <meshBasicMaterial color="#f97316" transparent opacity={0.28} />
        </mesh>
      </group>
    )
  }

  if (selectedTool === 'move') {
    return (
      <group ref={moveRef} position={anchor}>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.26, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.52, 14]} />
          <meshBasicMaterial color="#fb923c" transparent opacity={0.72} />
        </mesh>
        <mesh position={[0.56, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.045, 0.12, 14]} />
          <meshBasicMaterial color="#fb923c" transparent opacity={0.9} />
        </mesh>

        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.56, 14]} />
          <meshBasicMaterial color="#34d399" transparent opacity={0.72} />
        </mesh>
        <mesh position={[0, 0.64, 0]}>
          <coneGeometry args={[0.045, 0.12, 14]} />
          <meshBasicMaterial color="#34d399" transparent opacity={0.9} />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.26]}>
          <cylinderGeometry args={[0.015, 0.015, 0.52, 14]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.72} />
        </mesh>
        <mesh position={[0, 0, 0.56]}>
          <coneGeometry args={[0.045, 0.12, 14]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.9} />
        </mesh>
      </group>
    )
  }

  if (selectedTool === 'measure') {
    const floorOffset = -2.03
    const verticalHeight = Math.max(anchor[1] - floorOffset, 1.4)

    return (
      <group ref={measureRef} position={[anchor[0], floorOffset, anchor[2]]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[selectedPart ? 0.42 : 1.82, 0.014, 16, 90]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.28} />
        </mesh>
        <mesh position={[0, verticalHeight / 2, 0]}>
          <cylinderGeometry args={[0.012, 0.012, verticalHeight, 14]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.32} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.05, 0]}>
          <boxGeometry args={[selectedPart ? 0.84 : 3.64, 0.022, 0.022]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.34} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.022, 0.022, selectedPart ? 0.84 : 3.64]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.34} />
        </mesh>
      </group>
    )
  }

  return null
}

function getCameraConfig(selectedView, selectedPart, selectedTool) {
  const focus = selectedPart ? PART_FOCUS_MAP[selectedPart] : null

  if (selectedView === 'side') {
    if (focus) {
      return {
        fov: 25,
        position: [5.2, 1.55 + focus.position[1] * 0.24, selectedTool === 'inspect' ? 4.35 : 4.85],
        target: [focus.position[0] * 0.08, focus.position[1], focus.position[2]],
      }
    }

    if (selectedTool === 'inspect') {
      return {
        fov: 25,
        position: [5.05, 2.5, 4.7],
        target: [0, 1.45, 0],
      }
    }

    if (selectedTool === 'measure') {
      return {
        fov: 27,
        position: [5.4, 2.4, 5.35],
        target: [0, 1.05, 0],
      }
    }

    return {
      fov: 26,
      position: [5.15, 2.35, 5.05],
      target: [0, 1.18, 0],
    }
  }

  if (selectedView === 'top') {
    if (focus) {
      return {
        fov: 24,
        position: [0.55 + focus.position[0] * 0.34, 6.9, 2.15 + focus.position[2] * 0.3],
        target: [focus.position[0] * 0.28, focus.position[1], focus.position[2]],
      }
    }

    return {
      fov: selectedTool === 'measure' ? 24 : 25,
      position: [0.55, selectedTool === 'measure' ? 8.1 : 7.55, 2.8],
      target: [0, 1.16, 0],
    }
  }

  if (focus) {
    return {
      fov: selectedTool === 'inspect' ? 23 : 24,
      position: [
        3.75 + focus.position[0] * 0.38,
        1.7 + focus.position[1] * 0.28,
        selectedTool === 'inspect' ? 4.75 : 5.15,
      ],
      target: [focus.position[0] * 0.22, focus.position[1], focus.position[2]],
    }
  }

  if (selectedTool === 'inspect') {
    return {
      fov: 24,
      position: [3.45, 2.65, 5.2],
      target: [0, 1.55, 0.08],
    }
  }

  if (selectedTool === 'measure') {
    return {
      fov: 27,
      position: [4.45, 2.7, 6.65],
      target: [0, 1.06, 0],
    }
  }

  return {
    fov: 26,
    position: [4.05, 2.55, 6.15],
    target: [0, 1.15, 0],
  }
}

function ModelRobot({ zoom, selectedTool, selectedPart, selectedView }) {
  const { scene } = useLoader(GLTFLoader, ROBOT_MODEL_URL)
  const pose = useMemo(() => {
    if (selectedView === 'side') {
      return { rotation: [0, Math.PI / 1.9, 0], position: [0, -1.16, 0] }
    }

    if (selectedView === 'top') {
      return { rotation: [0, Math.PI / 7, 0], position: [0, -1.16, 0] }
    }

    return { rotation: [0, Math.PI / 7.5, 0], position: [0, -1.16, 0] }
  }, [selectedView])

  const rigRef = useRef(null)
  const shouldAutoRotate = selectedView === 'front' && selectedTool !== 'inspect' && !selectedPart
  const model = useMemo(() => {
    const cloned = SkeletonUtils.clone(scene)
    const modelBounds = getModelBounds(cloned)
    const scale = modelBounds?.size.y > 0 ? 4.85 / modelBounds.size.y : 0.39

    cloned.scale.setScalar(scale)

    if (modelBounds) {
      cloned.position.x -= modelBounds.center.x * scale
      cloned.position.y -= modelBounds.bounds.min.y * scale
      cloned.position.z -= modelBounds.center.z * scale
    }

    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false
        child.receiveShadow = false
        child.frustumCulled = false
        child.geometry.computeBoundingSphere()

        if (Array.isArray(child.material)) {
          child.material = child.material.map((material) => {
            const nextMaterial = material.clone()
            if ('metalness' in nextMaterial) nextMaterial.metalness = Math.max(nextMaterial.metalness ?? 0.18, 0.22)
            if ('roughness' in nextMaterial) nextMaterial.roughness = Math.min(nextMaterial.roughness ?? 0.9, 0.58)
            if ('envMapIntensity' in nextMaterial) nextMaterial.envMapIntensity = 0.85
            return nextMaterial
          })
        } else if (child.material) {
          child.material = child.material.clone()
          if ('metalness' in child.material) child.material.metalness = Math.max(child.material.metalness ?? 0.18, 0.22)
          if ('roughness' in child.material) child.material.roughness = Math.min(child.material.roughness ?? 0.9, 0.58)
          if ('envMapIntensity' in child.material) child.material.envMapIntensity = 0.85
        }
      }
    })

    return cloned
  }, [scene])

  useEffect(() => {
    if (!rigRef.current) return
    rigRef.current.rotation.set(...pose.rotation)
    rigRef.current.position.set(...pose.position)
  }, [pose])

  useFrame((state, delta) => {
    if (!rigRef.current) return

    const bob = shouldAutoRotate ? Math.sin(state.clock.elapsedTime * 1.5) * 0.03 : 0
    const sway =
      selectedTool === 'move'
        ? Math.sin(state.clock.elapsedTime * 2) * 0.03
        : selectedPart === 'head'
          ? Math.sin(state.clock.elapsedTime * 1.6) * 0.02
          : 0

    rigRef.current.position.y = pose.position[1] + bob
    rigRef.current.rotation.z = sway

    if (shouldAutoRotate) {
      rigRef.current.rotation.y += delta * (selectedTool === 'rotate' ? 0.42 : 0.3)
    }
  })

  return (
    <group ref={rigRef} scale={zoom * 0.78}>
      <primitive object={model} />
    </group>
  )
}

export function RobotScene({ selectedPart, selectedTool, selectedView, zoom }) {
  const shouldAnimateScene = selectedView === 'front' || selectedTool !== 'select' || Boolean(selectedPart)
  const camera = useMemo(
    () => getCameraConfig(selectedView, selectedPart, selectedTool),
    [selectedPart, selectedTool, selectedView],
  )

  return (
    <Suspense fallback={<SceneFallback />}>
      <Canvas
        camera={{ position: camera.position, fov: camera.fov }}
        dpr={[1, 1.4]}
        frameloop={shouldAnimateScene ? 'always' : 'demand'}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
      >
          <CameraRig fov={camera.fov} position={camera.position} target={camera.target} />
          <color attach="background" args={['#eff3f8']} />
          <fog attach="fog" args={['#eff3f8', 9, 19]} />

          <ambientLight intensity={1.05} />
          <hemisphereLight intensity={1.25} color="#ffffff" groundColor="#d8e4f6" />
          <directionalLight position={[4.5, 7.2, 5.4]} intensity={1.9} color="#ffffff" />
          <directionalLight position={[-4.2, 5.3, -2.8]} intensity={0.55} color="#93c5fd" />
          <pointLight position={[0.8, 4.2, 2.6]} intensity={1} color="#d6f4ff" />
          <pointLight position={[-2.8, 2.2, 2.8]} intensity={0.42} color="#fb923c" />

          <StageEffects selectedPart={selectedPart} selectedTool={selectedTool} />
          <PartFocusMarker selectedPart={selectedPart} />
          <ToolAssist selectedPart={selectedPart} selectedTool={selectedTool} />

          <ModelRobot
            selectedPart={selectedPart}
            selectedTool={selectedTool}
            selectedView={selectedView}
            zoom={zoom}
          />
      </Canvas>
    </Suspense>
  )
}

useLoader.preload(GLTFLoader, ROBOT_MODEL_URL)
