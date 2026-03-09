import { Divider, Stack, Typography } from '@mui/material'

import { ModelUpload } from '@/features/model-upload'
import { ModelSelection } from '@/features/model-selection'
import { RenderControls } from '@/features/render-controls'
import { GlassCard } from '@/shared/ui/glass-card'

export const ControlPanelWidget = () => {
  return (
    <Stack spacing={2}>
      <GlassCard sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          <Typography variant="h6">Модели</Typography>
          <ModelUpload />
          <Divider />
          <ModelSelection />
        </Stack>
      </GlassCard>

      <GlassCard sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          <Typography variant="h6">Настройки</Typography>
          <Divider />
          <RenderControls />
        </Stack>
      </GlassCard>
    </Stack>
  )
}