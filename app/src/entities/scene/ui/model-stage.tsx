import { Box, Stack, Typography } from '@mui/material'

import { getModelPreset } from '@/entities/model/model/catalog'
import { useViewerStore } from '@/entities/scene/model/viewer-store'

export const ModelStage = () => {
  const selectedModelId = useViewerStore((state) => state.selectedModelId)
  const detailLevel = useViewerStore((state) => state.detailLevel)
  const materialMood = useViewerStore((state) => state.materialMood)

  const preset = getModelPreset(selectedModelId)

  return (
    <Box
      className="ambient-shell float-in"
      sx={{
        minHeight: { xs: 320, lg: 560 },
        borderRadius: 4,
        border: '1px solid rgba(125, 211, 252, 0.28)',
        background:
          'radial-gradient(circle at 22% 20%, rgba(34, 211, 238, 0.22), transparent 48%), linear-gradient(150deg, rgba(15, 23, 42, 0.7), rgba(30, 58, 138, 0.12))',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <Stack spacing={1.2} sx={{ textAlign: 'center', px: 3 }}>
        <Typography variant="h5">3D Stage Bootstrapped</Typography>
        <Typography color="text.secondary">
          Модель: <strong>{preset.title}</strong>
        </Typography>
        <Typography color="text.secondary">
          Детализация: <strong>{detailLevel}</strong> | Материал: <strong>{materialMood}</strong>
        </Typography>
        <Typography sx={{ color: 'rgba(236, 254, 255, 0.7)' }}>
          На следующем чекпоинте здесь будет полноценный движок просмотра и анализа на Three.js.
        </Typography>
      </Stack>
    </Box>
  )
}