import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, OrbitControls, useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'

class ModelBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <div className="model-error">The 3D view could not load. Please refresh to try again.</div> : this.props.children }
}
function FitCamera() {
  const { camera, size } = useThree()
  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1)
    const angle = Math.min(THREE.MathUtils.degToRad(34 / 2), Math.atan(Math.tan(THREE.MathUtils.degToRad(34 / 2)) * aspect))
    const distance = 3.2 / Math.sin(angle)
    camera.position.set(0, distance * .12, distance)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [camera, size])
  return null
}
function Model({ kind, progress, pointer, reduced, interactive }) {
  const { scene } = useGLTF(`./models/${kind}.glb`, './draco/')
  const root = useRef()
  const meshes = useMemo(() => {
    scene.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    const extent = box.getSize(new THREE.Vector3())
    const scale = 4 / Math.max(extent.x, extent.y, extent.z)
    const normalise = new THREE.Matrix4().makeScale(scale, scale, scale).multiply(new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z))
    const items = []
    scene.traverse(object => {
      if (!object.isMesh) return
      const geometry = object.geometry.clone()
      geometry.applyMatrix4(new THREE.Matrix4().multiplyMatrices(normalise, object.matrixWorld))
      const original = Array.isArray(object.material) ? object.material : [object.material]
      const materials = original.map(material => {
        const m = material.clone()
        if (kind === 'valve') {
          m.color.set('#b9c5ce'); m.metalness = .65; m.roughness = .28
        }
        return m
      })
      const mesh = new THREE.Mesh(geometry, Array.isArray(object.material) ? materials : materials[0])
      mesh.name = object.name
      mesh.userData.lift = /wheel|stem|disc/i.test(object.name) ? .6 : /bonnet|nuts_back/i.test(object.name) ? .25 : 0
      items.push(mesh)
    })
    return items
  }, [scene, kind])
  useEffect(() => () => meshes.forEach(mesh => {
    mesh.geometry.dispose()
    ;(Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(material => material.dispose())
  }), [meshes])
  useFrame((state, delta) => {
    if (!root.current) return
    const x = pointer?.current?.x || 0, y = pointer?.current?.y || 0
    const rotation = kind === 'globe' ? -.35 : -.5
    const turn = interactive || reduced ? 0 : progress * Math.PI * 2
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, rotation + turn + (reduced ? 0 : x * .38), 4, delta)
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, -.12 + (reduced ? 0 : y * .12), 4, delta)
    meshes.forEach(mesh => {
      mesh.position.y = THREE.MathUtils.damp(mesh.position.y, kind === 'globe' ? mesh.userData.lift * progress : 0, 5, delta)
    })
  })
  return <group ref={root}>{meshes.map((mesh, i) => <primitive key={i} object={mesh} />)}</group>
}
export default function Valve3D({ kind = 'valve', progress = 0, pointer, interactive = false }) {
  const holder = useRef()
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update(); media.addEventListener('change', update)
    const preload = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setNear(true) }, { rootMargin: '250px' })
    const visibility = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    preload.observe(holder.current); visibility.observe(holder.current)
    return () => { preload.disconnect(); visibility.disconnect(); media.removeEventListener('change', update) }
  }, [])
  return <div ref={holder} className="model-canvas" role="img" aria-label={kind === 'globe' ? 'Interactive cutaway globe valve model' : 'Rotating three-dimensional valve model'}>
    <ModelBoundary>{near && <Canvas frameloop={visible ? 'always' : 'never'} dpr={[1, 1.5]} camera={{ fov: 34, near: .1, far: 100 }} gl={{ antialias: true, alpha: true }}>
      <FitCamera />
      <ambientLight intensity={1.6} />
      <directionalLight position={[5, 8, 7]} intensity={3} />
      <directionalLight position={[-5, 2, -4]} intensity={2} />
      <Environment resolution={128}>
        <Lightformer intensity={3} position={[0, 5, -4]} scale={[10, 5, 1]} />
        <Lightformer intensity={2} position={[-5, 0, 3]} rotation={[0, Math.PI / 2, 0]} scale={[5, 8, 1]} />
      </Environment>
      <Suspense fallback={<Html center><span className="model-loading">Loading 3D model…</span></Html>}>
        <Model kind={kind} progress={progress} pointer={pointer} reduced={reduced} interactive={interactive} />
      </Suspense>
      {interactive && <OrbitControls enableZoom={false} enablePan={false} target={[0, 0, 0]} />}
    </Canvas>}</ModelBoundary>
  </div>
}
