import type { BufferGeometry } from 'three'

export type DetailLevel = 'draft' | 'balanced' | 'fine'

export type LightPreset = 'studio' | 'sunset' | 'arctic'

export type MaterialMood = 'matte' | 'polished' | 'xray'

export type ModelSource = 'preset' | 'upload'

export type UploadModelFormat = 'obj' | 'stl' | 'glb'

export interface ModelPreset {
  id: string
  title: string
  description: string
  baseColor: string
  tags: string[]
}

export interface UploadedModel {
  id: string
  name: string
  format: UploadModelFormat
  geometry: BufferGeometry
  baseColor: string
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