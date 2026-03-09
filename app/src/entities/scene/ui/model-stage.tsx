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

  const selectedModelId = useViewerStore((state) => state.selectedModelId)
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

  const preset = getModelPreset(selectedModelId)

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
    stageRef.current?.setModel(selectedModelId, detailLevel, preset.baseColor)
  }, [selectedModelId, detailLevel, preset.baseColor])

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
      className="ambient-shell float-in"
      sx={{
        width: '100%',
        minHeight: { xs: 320, lg: 560 },
        borderRadius: 4,
        border: '1px solid rgba(125, 211, 252, 0.28)',
        background:
          'radial-gradient(circle at 22% 20%, rgba(34, 211, 238, 0.22), transparent 48%), linear-gradient(150deg, rgba(15, 23, 42, 0.7), rgba(30, 58, 138, 0.12))',
        overflow: 'hidden',
      }}
    />
  )
}