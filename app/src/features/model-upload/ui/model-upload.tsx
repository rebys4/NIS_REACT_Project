import type { ChangeEvent } from 'react'
import { useRef, useState } from 'react'
import {
  Alert,
  Button,
  Divider,
  Stack,
  Typography,
} from '@mui/material'

import { loadUploadedModel } from '@/entities/model/model/load-uploaded-model'
import { useViewerStore } from '@/entities/scene/model/viewer-store'

export const ModelUpload = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const modelSource = useViewerStore((state) => state.modelSource)
  const uploadedModel = useViewerStore((state) => state.uploadedModel)
  const uploadError = useViewerStore((state) => state.uploadError)

  const setUploadedModel = useViewerStore((state) => state.setUploadedModel)
  const activateUploadedModel = useViewerStore((state) => state.activateUploadedModel)
  const clearUploadedModel = useViewerStore((state) => state.clearUploadedModel)
  const setUploadError = useViewerStore((state) => state.setUploadError)

  const handleOpenDialog = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setIsLoading(true)
    setUploadError(null)

    try {
      const preparedModel = await loadUploadedModel(file)
      setUploadedModel(preparedModel)
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : 'Не удалось загрузить модель',
      )
    } finally {
      setIsLoading(false)
      event.target.value = ''
    }
  }

  return (
    <Stack spacing={1.2}>
      <input
        ref={fileInputRef}
        hidden
        type="file"
        accept=".obj,.stl,.glb"
        onChange={handleFileChange}
      />

      <Button
        onClick={handleOpenDialog}
        variant="outlined"
        disabled={isLoading}
        fullWidth
      >
        {isLoading ? 'Загрузка...' : 'Загрузить 3D модель'}
      </Button>

      <Typography variant="caption" color="text.secondary">
        Поддерживаемые форматы: OBJ, STL, GLB
      </Typography>

      {uploadedModel ? (
        <>
          <Divider />
          <Stack spacing={0.7}>
            <Typography variant="body2">Загружено: {uploadedModel.name}</Typography>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant={modelSource === 'upload' ? 'contained' : 'outlined'}
                onClick={activateUploadedModel}
              >
                Показать
              </Button>
              <Button
                size="small"
                color="inherit"
                variant="outlined"
                onClick={clearUploadedModel}
              >
                Удалить
              </Button>
            </Stack>
          </Stack>
        </>
      ) : null}

      {uploadError ? (
        <Alert severity="error" sx={{ py: 0.4 }}>
          {uploadError}
        </Alert>
      ) : null}
    </Stack>
  )
}
