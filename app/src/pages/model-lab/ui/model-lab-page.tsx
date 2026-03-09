import { Box, Container, Stack, Typography } from '@mui/material'

import { AnalysisPanelWidget } from '@/widgets/analysis-panel'
import { ControlPanelWidget } from '@/widgets/control-panel'
import { ViewportWidget } from '@/widgets/viewport'

export const ModelLabPage = () => {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2.5, md: 4 } }}>
      <Stack spacing={2.6}>
        <Stack spacing={1} className="float-in">
          <Typography variant="overline" color="text.secondary">
            Product Scope Lab
          </Typography>
          <Typography variant="h1" sx={{ maxWidth: 760 }}>
            Просмотр и анализ 3D моделей
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