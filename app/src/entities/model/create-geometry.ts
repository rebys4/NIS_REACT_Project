import {
  BufferGeometry,
  CylinderGeometry,
  IcosahedronGeometry,
  LatheGeometry,
  TorusKnotGeometry,
  Vector2,
} from 'three'

import type { DetailLevel } from '@/entities/model/types'

const detailToIndex: Record<DetailLevel, number> = {
  draft: 0,
  balanced: 1,
  fine: 2,
}

const buildPrecisionValve = (detailIndex: number): BufferGeometry => {
  const segments = [30, 54, 80][detailIndex]
  const profile = [
    new Vector2(0.16, -1.2),
    new Vector2(0.52, -1.2),
    new Vector2(0.68, -0.78),
    new Vector2(0.4, -0.45),
    new Vector2(0.74, -0.08),
    new Vector2(0.58, 0.5),
    new Vector2(0.3, 0.88),
    new Vector2(0.35, 1.24),
    new Vector2(0.12, 1.24),
  ]
  const geometry = new LatheGeometry(profile, segments)

  geometry.rotateX(Math.PI / 2)
  geometry.scale(0.9, 0.9, 0.9)
  return geometry
}

const buildTurbineImpeller = (detailIndex: number): BufferGeometry => {
  const tubularSegments = [140, 240, 420][detailIndex]
  const radialSegments = [16, 26, 40][detailIndex]
  const geometry = new TorusKnotGeometry(
    0.82,
    0.26,
    tubularSegments,
    radialSegments,
    2,
    3,
  )

  geometry.rotateX(Math.PI / 2)
  return geometry
}

const buildDroneHub = (detailIndex: number): BufferGeometry => {
  const detail = [1, 2, 3][detailIndex]
  const geometry = new IcosahedronGeometry(1, detail)

  geometry.scale(1.15, 0.72, 1.15)
  return geometry
}

const buildFusionNozzle = (detailIndex: number): BufferGeometry => {
  const radialSegments = [18, 36, 60][detailIndex]
  const geometry = new CylinderGeometry(0.38, 1.04, 2.2, radialSegments, 1, false)

  geometry.rotateX(Math.PI / 2)
  geometry.scale(0.96, 0.96, 1.08)
  return geometry
}

export const createModelGeometry = (
  modelId: string,
  detailLevel: DetailLevel,
): BufferGeometry => {
  const detailIndex = detailToIndex[detailLevel]

  switch (modelId) {
    case 'precision-valve':
      return buildPrecisionValve(detailIndex)
    case 'turbine-impeller':
      return buildTurbineImpeller(detailIndex)
    case 'drone-hub':
      return buildDroneHub(detailIndex)
    case 'fusion-nozzle':
      return buildFusionNozzle(detailIndex)
    default:
      return buildPrecisionValve(detailIndex)
  }
}