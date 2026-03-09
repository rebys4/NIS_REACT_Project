import { BufferAttribute, BufferGeometry, Float32BufferAttribute } from 'three'

import type { DetailLevel } from '@/entities/model/types'

const detailToRatio: Record<DetailLevel, number> = {
  draft: 0.28,
  balanced: 0.58,
  fine: 1,
}

const pushAttributeValues = (
  attribute: BufferAttribute,
  vertexIndex: number,
  target: number[],
) => {
  const sourceArray = attribute.array
  const baseOffset = vertexIndex * attribute.itemSize

  for (let component = 0; component < attribute.itemSize; component += 1) {
    target.push(sourceArray[baseOffset + component] as number)
  }
}

const getAttribute = (
  geometry: BufferGeometry,
  name: string,
): BufferAttribute | null => {
  const attribute = geometry.getAttribute(name)

  if (!attribute || !(attribute instanceof BufferAttribute)) {
    return null
  }

  return attribute
}

export const createUploadedGeometryDetail = (
  sourceGeometry: BufferGeometry,
  detailLevel: DetailLevel,
): BufferGeometry => {
  const reductionRatio = detailToRatio[detailLevel]
  const workingGeometry = sourceGeometry.index
    ? sourceGeometry.toNonIndexed()
    : sourceGeometry.clone()

  const position = getAttribute(workingGeometry, 'position')

  if (!position || position.count < 3 || reductionRatio >= 0.999) {
    return workingGeometry
  }

  const triangleCount = Math.floor(position.count / 3)
  const targetTriangleCount = Math.max(4, Math.floor(triangleCount * reductionRatio))

  if (targetTriangleCount >= triangleCount) {
    return workingGeometry
  }

  const normal = getAttribute(workingGeometry, 'normal')
  const uv = getAttribute(workingGeometry, 'uv')

  const selectedTriangleIndexes = new Set<number>([0, triangleCount - 1])
  const samplingStep = triangleCount / targetTriangleCount

  for (let sampleIndex = 0; sampleIndex < targetTriangleCount; sampleIndex += 1) {
    selectedTriangleIndexes.add(
      Math.min(triangleCount - 1, Math.floor(sampleIndex * samplingStep)),
    )
  }

  const positionValues: number[] = []
  const normalValues: number[] = []
  const uvValues: number[] = []

  const orderedTriangleIndexes = Array.from(selectedTriangleIndexes).sort((a, b) => a - b)

  for (const triangleIndex of orderedTriangleIndexes) {
    const firstVertex = triangleIndex * 3

    for (let offset = 0; offset < 3; offset += 1) {
      const vertexIndex = firstVertex + offset
      pushAttributeValues(position, vertexIndex, positionValues)

      if (normal) {
        pushAttributeValues(normal, vertexIndex, normalValues)
      }

      if (uv) {
        pushAttributeValues(uv, vertexIndex, uvValues)
      }
    }
  }

  const simplifiedGeometry = new BufferGeometry()

  simplifiedGeometry.setAttribute(
    'position',
    new Float32BufferAttribute(positionValues, position.itemSize),
  )

  if (normal && normalValues.length > 0) {
    simplifiedGeometry.setAttribute(
      'normal',
      new Float32BufferAttribute(normalValues, normal.itemSize),
    )
  }

  if (uv && uvValues.length > 0) {
    simplifiedGeometry.setAttribute(
      'uv',
      new Float32BufferAttribute(uvValues, uv.itemSize),
    )
  }

  simplifiedGeometry.computeBoundingBox()
  simplifiedGeometry.computeBoundingSphere()

  if (!simplifiedGeometry.getAttribute('normal')) {
    simplifiedGeometry.computeVertexNormals()
  }

  workingGeometry.dispose()

  return simplifiedGeometry
}