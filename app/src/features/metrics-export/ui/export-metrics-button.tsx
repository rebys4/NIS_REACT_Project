import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import { Button } from '@mui/material'

import type { ModelMetrics } from '@/entities/model/model/types'

interface ExportMetricsButtonProps {
  metrics: ModelMetrics | null
  modelId: string
}

export const ExportMetricsButton = ({
  metrics,
  modelId,
}: ExportMetricsButtonProps) => {
  const handleDownload = () => {
    if (!metrics) {
      return
    }

    const fileName = `${modelId}-analysis-${new Date().toISOString().slice(0, 10)}.json`
    const blob = new Blob([JSON.stringify(metrics, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button
      disabled={!metrics}
      onClick={handleDownload}
      startIcon={<DownloadRoundedIcon />}
      variant="contained"
      color="secondary"
      fullWidth
    >
      Скачать метрики JSON
    </Button>
  )
}