import { Box } from '@mui/material'
import { useEffect, useRef } from 'react'

import { getModelPreset } from '@/entities/model/model/catalog'
import { analyzeGeometry } from '@/entities/model/model/analyze-geometry'
import { useViewerStore } from '@/entities/scene/model/viewer-store'
import {
  type ViewerVisualState,
  ProductStage,
} from '@/entities/scene/lib/product-stage'

export const ModelStage = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const stageRef = useRef<ProductStage | null>(null)

  const modelSource = useViewerStore((state) => state.modelSource)
  const selectedModelId = useViewerStore((state) => state.selectedModelId)
  const uploadedModel = useViewerStore((state) => state.uploadedModel)
  const detailLevel = useViewerStore((state) => state.detailLevel)
  const lightPreset = useViewerStore((state) => state.lightPreset)
  const materialMood = useViewerStore((state) => state.materialMood)
  const wireframe = useViewerStore((state) => state.wireframe)
  const autoRotate = useViewerStore((state) => state.autoRotate)
  const showGrid = useViewerStore((state) => state.showGrid)
  const showAxes = useViewerStore((state) => state.showAxes)
  const showBounds = useViewerStore((state) => state.showBounds)
  const renderScale = useViewerStore((state) => state.renderScale)
  const setMetrics = useViewerStore((state) => state.setMetrics)

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const stage = new ProductStage({
      container: containerRef.current,
      onGeometryReady: (geometry) => {
        setMetrics(analyzeGeometry(geometry))
      },
    })
    stageRef.current = stage

    return () => {
      stage.dispose()
      stageRef.current = null
    }
  }, [setMetrics])

  useEffect(() => {
    if (modelSource !== 'preset') {
      return
    }

    const preset = getModelPreset(selectedModelId)
    stageRef.current?.setPresetModel(preset.id, detailLevel, preset.baseColor)
  }, [modelSource, selectedModelId, detailLevel])

  useEffect(() => {
    if (modelSource !== 'upload' || !uploadedModel) {
      return
    }

    stageRef.current?.setUploadedModel(uploadedModel.geometry, uploadedModel.baseColor)
  }, [modelSource, uploadedModel])

  useEffect(() => {
    const state: ViewerVisualState = {
      wireframe,
      autoRotate,
      showGrid,
      showAxes,
      showBounds,
      lightPreset,
      materialMood,
      renderScale,
    }

    stageRef.current?.updateVisualState(state)
  }, [
    wireframe,
    autoRotate,
    showGrid,
    showAxes,
    showBounds,
    lightPreset,
    materialMood,
    renderScale,
  ])

  return (
    <Box
      ref={containerRef}
      className="float-in"
      sx={{
        width: '100%',
        minHeight: { xs: 320, lg: 560 },
        borderRadius: 2.5,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: '#f8fafc',
        overflow: 'hidden',
      }}
    />
  )
}