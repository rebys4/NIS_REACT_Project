import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import { Box, Chip, Container, Stack, Typography } from '@mui/material'

import { AnalysisPanelWidget } from '@/widgets/analysis-panel'
import { ControlPanelWidget } from '@/widgets/control-panel'
import { ViewportWidget } from '@/widgets/viewport'

export const ModelLabPage = () => {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2.5, md: 3.5 } }}>
      <Stack spacing={2.2}>
        <Stack spacing={1} className="float-in">
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip icon={<BoltRoundedIcon />} label="3D Model Intelligence" />
            <Chip variant="outlined" label="FSD Architecture" />
          </Stack>
          <Typography variant="h1" sx={{ maxWidth: 820 }}>
            Product Scope Lab: просмотр и анализ инженерных 3D моделей
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 740 }}>
            Интерактивная лаборатория для инспекции геометрии, контроля параметров
            рендера и анализа вычисленных метрик по изделиям.
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              xl: '340px minmax(0, 1fr) 320px',
            },
            alignItems: 'start',
          }}
        >
          <ControlPanelWidget />
          <ViewportWidget />
          <AnalysisPanelWidget />
        </Box>
      </Stack>
    </Container>
  )
}