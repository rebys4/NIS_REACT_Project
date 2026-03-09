import { create } from 'zustand'

import { MODEL_PRESETS } from '@/entities/model/model/catalog'
import type {
  DetailLevel,
  LightPreset,
  MaterialMood,
  ModelMetrics,
} from '@/entities/model/model/types'

interface ViewerState {
  selectedModelId: string
  detailLevel: DetailLevel
  lightPreset: LightPreset
  materialMood: MaterialMood
  wireframe: boolean
  autoRotate: boolean
  showGrid: boolean
  showAxes: boolean
  showBounds: boolean
  renderScale: number
  metrics: ModelMetrics | null
  setSelectedModel: (selectedModelId: string) => void
  setDetailLevel: (detailLevel: DetailLevel) => void
  setLightPreset: (lightPreset: LightPreset) => void
  setMaterialMood: (materialMood: MaterialMood) => void
  setWireframe: (wireframe: boolean) => void
  setAutoRotate: (autoRotate: boolean) => void
  setShowGrid: (showGrid: boolean) => void
  setShowAxes: (showAxes: boolean) => void
  setShowBounds: (showBounds: boolean) => void
  setRenderScale: (renderScale: number) => void
  setMetrics: (metrics: ModelMetrics | null) => void
}

const initialModelId = MODEL_PRESETS[0].id

export const useViewerStore = create<ViewerState>((set) => ({
  selectedModelId: initialModelId,
  detailLevel: 'balanced',
  lightPreset: 'studio',
  materialMood: 'matte',
  wireframe: false,
  autoRotate: true,
  showGrid: true,
  showAxes: false,
  showBounds: false,
  renderScale: 1,
  metrics: null,
  setSelectedModel: (selectedModelId) => set({ selectedModelId, metrics: null }),
  setDetailLevel: (detailLevel) => set({ detailLevel, metrics: null }),
  setLightPreset: (lightPreset) => set({ lightPreset }),
  setMaterialMood: (materialMood) => set({ materialMood }),
  setWireframe: (wireframe) => set({ wireframe }),
  setAutoRotate: (autoRotate) => set({ autoRotate }),
  setShowGrid: (showGrid) => set({ showGrid }),
  setShowAxes: (showAxes) => set({ showAxes }),
  setShowBounds: (showBounds) => set({ showBounds }),
  setRenderScale: (renderScale) => set({ renderScale }),
  setMetrics: (metrics) => set({ metrics }),
}))