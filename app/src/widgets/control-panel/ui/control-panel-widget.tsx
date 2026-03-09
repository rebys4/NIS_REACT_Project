import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import { Divider, Stack, Typography } from '@mui/material'

import { ModelSelection } from '@/features/model-selection'
import { RenderControls } from '@/features/render-controls'
import { GlassCard } from '@/shared/ui/glass-card'

export const ControlPanelWidget = () => {
  return (
    <Stack spacing={2}>
      <GlassCard className="ambient-shell" sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <TuneRoundedIcon color="primary" />
            <Typography variant="h6">Model Catalog</Typography>
          </Stack>
          <ModelSelection />
        </Stack>
      </GlassCard>

      <GlassCard className="ambient-shell" sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          <Typography variant="h6">Render Controls</Typography>
          <Divider sx={{ borderColor: 'rgba(125, 211, 252, 0.22)' }} />
          <RenderControls />
        </Stack>
      </GlassCard>
    </Stack>
  )
}