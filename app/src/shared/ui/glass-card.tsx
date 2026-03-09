import Paper from '@mui/material/Paper'
import { alpha, styled } from '@mui/material/styles'

export const GlassCard = styled(Paper)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 14,
  background: alpha(theme.palette.background.paper, 0.96),
  backdropFilter: 'blur(6px)',
  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
}))