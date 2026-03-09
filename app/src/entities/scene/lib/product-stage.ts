import {
  AmbientLight,
  AxesHelper,
  Box3,
  Box3Helper,
  BufferGeometry,
  Color,
  DirectionalLight,
  FrontSide,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import { createModelGeometry } from '@/entities/model/create-geometry'
import { createUploadedGeometryDetail } from '@/entities/model/create-uploaded-geometry-detail'
import type {
  DetailLevel,
  LightPreset,
  MaterialMood,
} from '@/entities/model/types'

export interface ViewerVisualState {
  wireframe: boolean
  autoRotate: boolean
  showGrid: boolean
  showAxes: boolean
  showBounds: boolean
  lightPreset: LightPreset
  materialMood: MaterialMood
  renderScale: number
}

const DEFAULT_VISUAL_STATE: ViewerVisualState = {
  wireframe: false,
  autoRotate: true,
  showGrid: true,
  showAxes: false,
  showBounds: false,
  lightPreset: 'studio',
  materialMood: 'matte',
  renderScale: 1,
}

interface ProductStageOptions {
  container: HTMLDivElement
  onGeometryReady?: (geometry: BufferGeometry) => void
}

export class ProductStage {
  private container: HTMLDivElement
  private scene: Scene
  private camera: PerspectiveCamera
  private renderer: WebGLRenderer
  private controls: OrbitControls
  private resizeObserver: ResizeObserver
  private frameHandle: number | null = null

  private ambientLight: AmbientLight
  private keyLight: DirectionalLight
  private fillLight: DirectionalLight
  private rimLight: DirectionalLight
  private grid: GridHelper
  private axes: AxesHelper

  private model: Mesh<BufferGeometry, MeshStandardMaterial> | null = null
  private boundsHelper: Box3Helper | null = null
  private visualState: ViewerVisualState = DEFAULT_VISUAL_STATE
  private onGeometryReady?: (geometry: BufferGeometry) => void

  constructor(options: ProductStageOptions) {
    this.container = options.container
    this.onGeometryReady = options.onGeometryReady

    this.scene = new Scene()
    this.scene.background = new Color('#f8fafc')

    this.camera = new PerspectiveCamera(52, 1, 0.1, 100)
    this.camera.position.set(2.8, 2, 3.1)

    this.renderer = new WebGLRenderer({ antialias: true, alpha: false })
    this.renderer.setSize(10, 10)
    this.renderer.outputColorSpace = SRGBColorSpace
    this.renderer.domElement.style.width = '100%'
    this.renderer.domElement.style.height = '100%'
    this.container.appendChild(this.renderer.domElement)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.07
    this.controls.target = new Vector3(0, 0, 0)

    this.grid = new GridHelper(8, 24, '#d1d5db', '#e5e7eb')
    this.axes = new AxesHelper(1.5)
    this.scene.add(this.grid)
    this.scene.add(this.axes)

    this.ambientLight = new AmbientLight('#ffffff', 0.72)
    this.keyLight = new DirectionalLight('#f8fafc', 1.08)
    this.keyLight.position.set(2.6, 3.2, 2.2)
    this.fillLight = new DirectionalLight('#e2e8f0', 0.85)
    this.fillLight.position.set(-2.4, 1.8, -1.6)
    this.rimLight = new DirectionalLight('#cbd5e1', 0.58)
    this.rimLight.position.set(0, 2, -3.4)

    this.scene.add(this.ambientLight)
    this.scene.add(this.keyLight)
    this.scene.add(this.fillLight)
    this.scene.add(this.rimLight)

    this.resizeObserver = new ResizeObserver(() => {
      this.resize()
    })
    this.resizeObserver.observe(this.container)

    this.resize()
    this.animate()
  }

  setPresetModel(modelId: string, detailLevel: DetailLevel, color: string) {
    const geometry = createModelGeometry(modelId, detailLevel)
    geometry.computeVertexNormals()
    geometry.center()

    this.mountGeometry(geometry, color)
  }

  setUploadedModel(geometry: BufferGeometry, color: string, detailLevel: DetailLevel) {
    const geometryClone = createUploadedGeometryDetail(geometry, detailLevel)
    geometryClone.computeVertexNormals()
    geometryClone.center()

    this.mountGeometry(geometryClone, color)
  }

  updateVisualState(state: ViewerVisualState) {
    this.visualState = state
    this.applyVisualState(state)
  }

  getCurrentGeometry(): BufferGeometry | null {
    return this.model?.geometry ?? null
  }

  dispose() {
    if (this.frameHandle) {
      cancelAnimationFrame(this.frameHandle)
    }

    this.resizeObserver.disconnect()
    this.controls.dispose()

    if (this.boundsHelper) {
      this.scene.remove(this.boundsHelper)
      this.boundsHelper = null
    }

    if (this.model) {
      this.scene.remove(this.model)
      this.model.geometry.dispose()
      this.model.material.dispose()
      this.model = null
    }

    this.renderer.dispose()
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement)
    }
  }

  private mountGeometry(geometry: BufferGeometry, color: string) {
    if (this.model) {
      this.scene.remove(this.model)
      this.model.geometry.dispose()
      this.model.material.dispose()
      this.model = null
    }

    const material = new MeshStandardMaterial({
      color,
      roughness: 0.58,
      metalness: 0.35,
    })
    const mesh = new Mesh(geometry, material)

    this.model = mesh
    this.scene.add(mesh)
    this.updateBoundsHelper()
    this.applyVisualState(this.visualState)
    this.focusCameraOnModel()
    this.onGeometryReady?.(geometry)
  }

  private resize() {
    const width = Math.max(this.container.clientWidth, 300)
    const height = Math.max(this.container.clientHeight, 300)

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio * this.visualState.renderScale, 2.5),
    )
    this.renderer.setSize(width, height, false)
  }

  private animate = () => {
    this.frameHandle = requestAnimationFrame(this.animate)

    if (this.model && this.visualState.autoRotate) {
      this.model.rotation.y += 0.004
    }

    if (this.visualState.showBounds && this.boundsHelper && this.model) {
      this.boundsHelper.box.setFromObject(this.model)
    }

    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }

  private applyVisualState(state: ViewerVisualState) {
    this.grid.visible = state.showGrid
    this.axes.visible = state.showAxes

    if (this.boundsHelper) {
      this.boundsHelper.visible = state.showBounds
    }

    this.applyLightPreset(state.lightPreset)
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio * state.renderScale, 2.5),
    )

    if (!this.model) {
      return
    }

    this.model.material.wireframe = state.wireframe && state.materialMood !== 'xray'

    switch (state.materialMood) {
      case 'matte':
        this.model.material.metalness = 0.12
        this.model.material.roughness = 0.84
        this.model.material.transparent = false
        this.model.material.opacity = 1
        this.model.material.emissive.set('#000000')
        this.model.material.emissiveIntensity = 0
        this.model.material.side = FrontSide
        break
      case 'polished':
        this.model.material.metalness = 0.74
        this.model.material.roughness = 0.28
        this.model.material.transparent = false
        this.model.material.opacity = 1
        this.model.material.emissive.set('#111827')
        this.model.material.emissiveIntensity = 0.06
        this.model.material.side = FrontSide
        break
      case 'xray':
        this.model.material.metalness = 0.04
        this.model.material.roughness = 0.22
        this.model.material.transparent = true
        this.model.material.opacity = 0.34
        this.model.material.emissive.set('#38bdf8')
        this.model.material.emissiveIntensity = 0.22
        this.model.material.side = FrontSide
        break
    }

    this.model.material.needsUpdate = true
  }

  private applyLightPreset(lightPreset: LightPreset) {
    switch (lightPreset) {
      case 'studio':
        this.scene.background = new Color('#f8fafc')
        this.ambientLight.color.set('#ffffff')
        this.ambientLight.intensity = 0.72
        this.keyLight.color.set('#f8fafc')
        this.keyLight.intensity = 1.08
        this.fillLight.color.set('#e2e8f0')
        this.fillLight.intensity = 0.85
        this.rimLight.color.set('#cbd5e1')
        this.rimLight.intensity = 0.58
        break
      case 'sunset':
        this.scene.background = new Color('#fff7ed')
        this.ambientLight.color.set('#fffbeb')
        this.ambientLight.intensity = 0.64
        this.keyLight.color.set('#fed7aa')
        this.keyLight.intensity = 1.16
        this.fillLight.color.set('#fde68a')
        this.fillLight.intensity = 0.76
        this.rimLight.color.set('#fdba74')
        this.rimLight.intensity = 0.52
        break
      case 'arctic':
        this.scene.background = new Color('#eff6ff')
        this.ambientLight.color.set('#f8fafc')
        this.ambientLight.intensity = 0.78
        this.keyLight.color.set('#bfdbfe')
        this.keyLight.intensity = 1.02
        this.fillLight.color.set('#e0f2fe')
        this.fillLight.intensity = 0.74
        this.rimLight.color.set('#93c5fd')
        this.rimLight.intensity = 0.5
        break
    }
  }

  private updateBoundsHelper() {
    if (!this.model) {
      return
    }

    if (this.boundsHelper) {
      this.scene.remove(this.boundsHelper)
      this.boundsHelper = null
    }

    const box = new Box3().setFromObject(this.model)
    this.boundsHelper = new Box3Helper(box, new Color('#94a3b8'))
    this.boundsHelper.visible = this.visualState.showBounds
    this.scene.add(this.boundsHelper)
  }

  private focusCameraOnModel() {
    if (!this.model) {
      return
    }

    const box = new Box3().setFromObject(this.model)
    const size = box.getSize(new Vector3())
    const center = box.getCenter(new Vector3())

    const distance = Math.max(size.x, size.y, size.z) * 2.2
    this.camera.position.set(
      center.x + distance,
      center.y + distance * 0.65,
      center.z + distance,
    )
    this.controls.target.copy(center)
    this.controls.update()
  }
}
