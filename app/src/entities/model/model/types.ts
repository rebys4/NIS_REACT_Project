export type DetailLevel = 'draft' | 'balanced' | 'fine'

export type LightPreset = 'studio' | 'sunset' | 'arctic'

export type MaterialMood = 'matte' | 'polished' | 'xray'

export interface ModelPreset {
  id: string
  title: string
  description: string
  baseColor: string
  tags: string[]
}

export interface ModelDimensions {
  width: number
  height: number
  depth: number
}

export interface ModelMetrics {
  vertexCount: number
  triangleCount: number
  surfaceArea: number
  volume: number
  complexityIndex: number
  dimensions: ModelDimensions
}