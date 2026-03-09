import { Divider, Stack, Typography } from '@mui/material'

import { getModelPreset } from '@/entities/model/model/catalog'
import { useViewerStore } from '@/entities/scene/model/viewer-store'
import { ExportMetricsButton } from '@/features/metrics-export'
import { formatNumber } from '@/shared/lib/format-number'
import { GlassCard } from '@/shared/ui/glass-card'

const MetricRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={1}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace' }}
      >
        {value}
      </Typography>
    </Stack>
  )
}

const getComplexityBand = (index: number): string => {
  if (index < 5) {
    return 'Low'
  }
  if (index < 12) {
    return 'Medium'
  }
  return 'High'
}

export const AnalysisPanelWidget = () => {
  const modelSource = useViewerStore((state) => state.modelSource)
  const selectedModelId = useViewerStore((state) => state.selectedModelId)
  const uploadedModel = useViewerStore((state) => state.uploadedModel)
  const metrics = useViewerStore((state) => state.metrics)

  const activeModelName =
    modelSource === 'upload' && uploadedModel
      ? uploadedModel.name
      : getModelPreset(selectedModelId).title

  const exportModelId =
    modelSource === 'upload' && uploadedModel
      ? uploadedModel.name.replace(/\.[^/.]+$/, '')
      : selectedModelId

  return (
    <GlassCard sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Typography variant="h6">Анализ геометрии</Typography>

        <Typography variant="body2" color="text.secondary">
          Модель: {activeModelName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Источник: {modelSource === 'upload' ? 'Загруженная пользователем' : 'Каталог пресетов'}
        </Typography>

        <Divider />

        {metrics ? (
          <Stack spacing={1}>
            <MetricRow
              label="Vertices"
              value={formatNumber(metrics.vertexCount, 0)}
            />
            <MetricRow
              label="Triangles"
              value={formatNumber(metrics.triangleCount, 0)}
            />
            <MetricRow
              label="Surface area"
              value={`${formatNumber(metrics.surfaceArea, 2)} u²`}
            />
            <MetricRow
              label="Volume"
              value={`${formatNumber(metrics.volume, 2)} u³`}
            />
            <MetricRow
              label="Bounds"
              value={`${formatNumber(metrics.dimensions.width, 2)} × ${formatNumber(metrics.dimensions.height, 2)} × ${formatNumber(metrics.dimensions.depth, 2)}`}
            />
            <MetricRow
              label="Complexity index"
              value={formatNumber(metrics.complexityIndex, 2)}
            />
            <MetricRow
              label="Complexity band"
              value={getComplexityBand(metrics.complexityIndex)}
            />
          </Stack>
        ) : (
          <Typography color="text.secondary" variant="body2">
            Метрики появятся сразу после отрисовки модели.
          </Typography>
        )}

        <ExportMetricsButton metrics={metrics} modelId={exportModelId} />
      </Stack>
    </GlassCard>
  )
}