import ViewInArRoundedIcon from '@mui/icons-material/ViewInArRounded'
import { Chip, Stack, Typography } from '@mui/material'

import { getModelPreset } from '@/entities/model/model/catalog'
import { ModelStage } from '@/entities/scene/ui/model-stage'
import { useViewerStore } from '@/entities/scene/model/viewer-store'
import { GlassCard } from '@/shared/ui/glass-card'

export const ViewportWidget = () => {
  const selectedModelId = useViewerStore((state) => state.selectedModelId)
  const preset = getModelPreset(selectedModelId)

  return (
    <GlassCard className="ambient-shell" sx={{ p: { xs: 2, md: 2.4 } }}>
      <Stack spacing={1.8}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          spacing={1}
        >
          <Stack direction="row" spacing={1.2} alignItems="center">
            <ViewInArRoundedIcon color="primary" />
            <Typography variant="h6">Interactive Viewport</Typography>
          </Stack>
          <Chip label={preset.title} variant="outlined" />
        </Stack>

        <ModelStage />
      </Stack>
    </GlassCard>
  )
}