import { create } from 'zustand'

import { MODEL_PRESETS } from '@/entities/model/model/catalog'
import type {
  DetailLevel,
  LightPreset,
  MaterialMood,
  ModelSource,
  ModelMetrics,
  UploadedModel,
} from '@/entities/model/model/types'

interface ViewerState {
  modelSource: ModelSource
  selectedModelId: string
  uploadedModel: UploadedModel | null
  uploadError: string | null
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
  setUploadedModel: (uploadedModel: UploadedModel) => void
  activateUploadedModel: () => void
  clearUploadedModel: () => void
  setUploadError: (uploadError: string | null) => void
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
  modelSource: 'preset',
  selectedModelId: initialModelId,
  uploadedModel: null,
  uploadError: null,
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
  setSelectedModel: (selectedModelId) =>
    set({
      modelSource: 'preset',
      selectedModelId,
      metrics: null,
      uploadError: null,
    }),
  setUploadedModel: (uploadedModel) =>
    set((state) => {
      if (state.uploadedModel && state.uploadedModel.id !== uploadedModel.id) {
        state.uploadedModel.geometry.dispose()
      }

      return {
        modelSource: 'upload',
        selectedModelId: uploadedModel.id,
        uploadedModel,
        uploadError: null,
        metrics: null,
      }
    }),
  activateUploadedModel: () =>
    set((state) => {
      if (!state.uploadedModel) {
        return state
      }

      return {
        modelSource: 'upload',
        selectedModelId: state.uploadedModel.id,
        metrics: null,
      }
    }),
  clearUploadedModel: () =>
    set((state) => {
      if (state.uploadedModel) {
        state.uploadedModel.geometry.dispose()
      }

      const fallbackModelId = MODEL_PRESETS.some(
        (preset) => preset.id === state.selectedModelId,
      )
        ? state.selectedModelId
        : initialModelId

      return {
        modelSource: 'preset',
        selectedModelId: fallbackModelId,
        uploadedModel: null,
        uploadError: null,
        metrics: null,
      }
    }),
  setUploadError: (uploadError) => set({ uploadError }),
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