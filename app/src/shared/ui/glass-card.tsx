import Paper from '@mui/material/Paper'
import { alpha, styled } from '@mui/material/styles'

export const GlassCard = styled(Paper)(({ theme }) => ({
  border: `1px solid ${alpha(theme.palette.primary.light, 0.25)}`,
  borderRadius: 22,
  background: `linear-gradient(170deg, ${alpha('#0b2537', 0.86)} 0%, ${alpha('#10263a', 0.7)} 100%)`,
  backdropFilter: 'blur(14px)',
  boxShadow: '0 24px 58px rgba(2, 6, 23, 0.35)',
}))