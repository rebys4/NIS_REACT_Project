import { BufferAttribute, BufferGeometry, Vector3 } from 'three'

import type { ModelMetrics } from '@/entities/model/model/types'

const safeRound = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0
  }

  return value
}

export const analyzeGeometry = (geometry: BufferGeometry): ModelMetrics => {
  const positionAttribute = geometry.getAttribute('position') as BufferAttribute

  if (!positionAttribute || positionAttribute.count === 0) {
    return {
      vertexCount: 0,
      triangleCount: 0,
      surfaceArea: 0,
      volume: 0,
      complexityIndex: 0,
      dimensions: {
        width: 0,
        height: 0,
        depth: 0,
      },
    }
  }

  const sampledGeometry = geometry.index ? geometry.toNonIndexed() : geometry
  const sampledPositions = sampledGeometry.getAttribute('position') as BufferAttribute

  const a = new Vector3()
  const b = new Vector3()
  const c = new Vector3()
  const ab = new Vector3()
  const ac = new Vector3()
  const cross = new Vector3()

  let surfaceArea = 0
  let signedVolume = 0

  for (let i = 0; i < sampledPositions.count; i += 3) {
    a.fromBufferAttribute(sampledPositions, i)
    b.fromBufferAttribute(sampledPositions, i + 1)
    c.fromBufferAttribute(sampledPositions, i + 2)

    ab.subVectors(b, a)
    ac.subVectors(c, a)
    cross.crossVectors(ab, ac)

    surfaceArea += cross.length() * 0.5
    signedVolume += a.dot(cross) / 6
  }

  const triangleCount = Math.floor(sampledPositions.count / 3)

  if (sampledGeometry !== geometry) {
    sampledGeometry.dispose()
  }

  geometry.computeBoundingBox()
  const box = geometry.boundingBox

  const width = box ? box.max.x - box.min.x : 0
  const height = box ? box.max.y - box.min.y : 0
  const depth = box ? box.max.z - box.min.z : 0
  const volume = Math.abs(signedVolume)

  const complexityIndex =
    triangleCount / 420 + surfaceArea / Math.max(volume * 8.5, 0.001)

  return {
    vertexCount: positionAttribute.count,
    triangleCount,
    surfaceArea: safeRound(surfaceArea),
    volume: safeRound(volume),
    complexityIndex: safeRound(complexityIndex),
    dimensions: {
      width: safeRound(width),
      height: safeRound(height),
      depth: safeRound(depth),
    },
  }
}