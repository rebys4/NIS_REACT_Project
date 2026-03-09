import { CardActionArea, Chip, Stack, Typography, Box } from '@mui/material'

import { MODEL_PRESETS } from '@/entities/model/catalog'
import { useViewerStore } from '@/entities/scene/model/viewer-store'
import { GlassCard } from '@/shared/ui/glass-card'

export const ModelSelection = () => {
  const modelSource = useViewerStore((state) => state.modelSource)
  const selectedModelId = useViewerStore((state) => state.selectedModelId)
  const setSelectedModel = useViewerStore((state) => state.setSelectedModel)

  return (
    <Stack spacing={1.4}>
      {MODEL_PRESETS.map((preset, index) => {
        const isSelected =
          modelSource === 'preset' && preset.id === selectedModelId

        return (
          <GlassCard
            key={preset.id}
            className="float-in"
            sx={{
              overflow: 'hidden',
              animationDelay: `${100 + index * 90}ms`,
              borderColor: isSelected ? 'primary.main' : 'divider',
            }}
          >
            <CardActionArea
              onClick={() => setSelectedModel(preset.id)}
              sx={{ px: 1.8, py: 1.4 }}
            >
              <Stack spacing={0.8}>
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: 1,
                      backgroundColor: preset.baseColor,
                    }}
                  />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {preset.title}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {preset.description}
                </Typography>
                <Stack direction="row" spacing={0.8} useFlexGap flexWrap="wrap">
                  {preset.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Stack>
              </Stack>
            </CardActionArea>
          </GlassCard>
        )
      })}
    </Stack>
  )
}