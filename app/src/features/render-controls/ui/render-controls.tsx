import type { MouseEvent } from 'react'
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'

import type {
  DetailLevel,
  LightPreset,
  MaterialMood,
} from '@/entities/model/types'
import { useViewerStore } from '@/entities/scene/model/viewer-store'

export const RenderControls = () => {
  const modelSource = useViewerStore((state) => state.modelSource)
  const detailLevel = useViewerStore((state) => state.detailLevel)
  const lightPreset = useViewerStore((state) => state.lightPreset)
  const materialMood = useViewerStore((state) => state.materialMood)
  const wireframe = useViewerStore((state) => state.wireframe)
  const autoRotate = useViewerStore((state) => state.autoRotate)
  const showGrid = useViewerStore((state) => state.showGrid)
  const showAxes = useViewerStore((state) => state.showAxes)
  const showBounds = useViewerStore((state) => state.showBounds)
  const renderScale = useViewerStore((state) => state.renderScale)

  const setDetailLevel = useViewerStore((state) => state.setDetailLevel)
  const setLightPreset = useViewerStore((state) => state.setLightPreset)
  const setMaterialMood = useViewerStore((state) => state.setMaterialMood)
  const setWireframe = useViewerStore((state) => state.setWireframe)
  const setAutoRotate = useViewerStore((state) => state.setAutoRotate)
  const setShowGrid = useViewerStore((state) => state.setShowGrid)
  const setShowAxes = useViewerStore((state) => state.setShowAxes)
  const setShowBounds = useViewerStore((state) => state.setShowBounds)
  const setRenderScale = useViewerStore((state) => state.setRenderScale)

  const handleDetailLevel = (
    _: MouseEvent<HTMLElement>,
    nextValue: DetailLevel | null,
  ) => {
    if (nextValue) {
      setDetailLevel(nextValue)
    }
  }

  const handleMaterialMood = (
    _: MouseEvent<HTMLElement>,
    nextValue: MaterialMood | null,
  ) => {
    if (nextValue) {
      setMaterialMood(nextValue)
    }
  }

  return (
    <Stack spacing={2.2}>
      <Stack spacing={1}>
        <Typography variant="subtitle2" color="text.secondary">
          Уровень детализации
        </Typography>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={detailLevel}
          onChange={handleDetailLevel}
        >
          <ToggleButton value="draft">Draft</ToggleButton>
          <ToggleButton value="balanced">Balanced</ToggleButton>
          <ToggleButton value="fine">Fine</ToggleButton>
        </ToggleButtonGroup>
        {modelSource === 'upload' ? (
          <Typography variant="caption" color="text.secondary">
            Для загруженной модели детализация управляет уровнем упрощения сетки.
          </Typography>
        ) : null}
      </Stack>

      <Stack spacing={1}>
        <Typography variant="subtitle2" color="text.secondary">
          Материал
        </Typography>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={materialMood}
          onChange={handleMaterialMood}
        >
          <ToggleButton value="matte">Matte</ToggleButton>
          <ToggleButton value="polished">Polished</ToggleButton>
          <ToggleButton value="xray">X-Ray</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <FormControl fullWidth size="small">
        <InputLabel id="light-preset-label">Свет</InputLabel>
        <Select
          labelId="light-preset-label"
          value={lightPreset}
          label="Свет"
          onChange={(event) => setLightPreset(event.target.value as LightPreset)}
        >
          <MenuItem value="studio">Studio</MenuItem>
          <MenuItem value="sunset">Sunset</MenuItem>
          <MenuItem value="arctic">Arctic</MenuItem>
        </Select>
      </FormControl>

      <Stack spacing={0.5}>
        <Typography variant="subtitle2" color="text.secondary">
          Render scale: {renderScale.toFixed(2)}x
        </Typography>
        <Slider
          value={renderScale}
          min={0.5}
          max={1.6}
          step={0.1}
          onChange={(_, value) => setRenderScale(value as number)}
        />
      </Stack>

      <Stack spacing={0.2}>
        <FormControlLabel
          control={
            <Switch
              checked={wireframe}
              onChange={(event) => setWireframe(event.target.checked)}
            />
          }
          label="Wireframe"
        />
        <FormControlLabel
          control={
            <Switch
              checked={autoRotate}
              onChange={(event) => setAutoRotate(event.target.checked)}
            />
          }
          label="Auto Rotate"
        />
        <FormControlLabel
          control={
            <Switch
              checked={showGrid}
              onChange={(event) => setShowGrid(event.target.checked)}
            />
          }
          label="Grid"
        />
        <FormControlLabel
          control={
            <Switch
              checked={showAxes}
              onChange={(event) => setShowAxes(event.target.checked)}
            />
          }
          label="Axes"
        />
        <FormControlLabel
          control={
            <Switch
              checked={showBounds}
              onChange={(event) => setShowBounds(event.target.checked)}
            />
          }
          label="Bounds"
        />
      </Stack>
    </Stack>
  )
}