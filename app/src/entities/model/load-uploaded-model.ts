import { BufferGeometry, Color, Object3D, Vector3 } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { STLLoader } from 'three/addons/loaders/STLLoader.js'

import type { UploadModelFormat, UploadedModel } from '@/entities/model/types'

const SUPPORTED_FORMATS: UploadModelFormat[] = ['obj', 'stl', 'glb']

const getFileFormat = (fileName: string): UploadModelFormat => {
  const extension = fileName.split('.').pop()?.toLowerCase()

  if (extension && SUPPORTED_FORMATS.includes(extension as UploadModelFormat)) {
    return extension as UploadModelFormat
  }

  throw new Error('Поддерживаются только форматы .obj, .stl и .glb')
}

const getFirstMeshGeometry = (root: Object3D): BufferGeometry => {
  root.updateMatrixWorld(true)

  let extractedGeometry: BufferGeometry | null = null

  root.traverse((child) => {
    if (extractedGeometry) {
      return
    }

    const candidate = child as Object3D & {
      geometry?: BufferGeometry
      isMesh?: boolean
    }

    if (candidate.geometry?.isBufferGeometry) {
      const geometryClone = candidate.geometry.clone()
      geometryClone.applyMatrix4(child.matrixWorld)
      extractedGeometry = geometryClone
    }
  })

  if (!extractedGeometry) {
    throw new Error('Не удалось извлечь геометрию из загруженной модели')
  }

  return extractedGeometry
}

const normalizeGeometry = (geometry: BufferGeometry): BufferGeometry => {
  const normalizedGeometry = geometry.clone()

  normalizedGeometry.computeBoundingBox()
  const box = normalizedGeometry.boundingBox

  if (box) {
    const size = box.getSize(new Vector3())
    const maxSide = Math.max(size.x, size.y, size.z)

    if (maxSide > 0) {
      const targetSize = 2.4
      const scale = targetSize / maxSide
      normalizedGeometry.scale(scale, scale, scale)
    }
  }

  normalizedGeometry.computeVertexNormals()
  normalizedGeometry.center()

  return normalizedGeometry
}

const createModelColor = (seed: string): string => {
  let hash = 0

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(index)
    hash |= 0
  }

  const hue = Math.abs(hash % 360) / 360
  const color = new Color().setHSL(hue, 0.35, 0.45)
  return `#${color.getHexString()}`
}

const parseGlbGeometry = async (buffer: ArrayBuffer): Promise<BufferGeometry> => {
  const loader = new GLTFLoader()

  const gltf = await new Promise<{
    scene: Object3D
  }>((resolve, reject) => {
    loader.parse(
      buffer,
      '',
      (loaded) => resolve(loaded),
      (error) => {
        reject(error)
      },
    )
  })

  return getFirstMeshGeometry(gltf.scene)
}

const sanitizeObjContent = (content: string): string => {
  return content
    .split(/\r?\n/)
    .filter((line) => {
      const trimmedLine = line.trimStart()

      // Some CAD exporters add non-standard tokens (vc/vp) that OBJLoader cannot parse.
      return !trimmedLine.startsWith('vc ') && !trimmedLine.startsWith('vp ')
    })
    .join('\n')
}

const parseObjGeometry = async (content: string): Promise<BufferGeometry> => {
  const loader = new OBJLoader()

  try {
    const root = loader.parse(content)
    return getFirstMeshGeometry(root)
  } catch {
    const sanitizedContent = sanitizeObjContent(content)
    const root = loader.parse(sanitizedContent)
    return getFirstMeshGeometry(root)
  }
}

const parseStlGeometry = async (buffer: ArrayBuffer): Promise<BufferGeometry> => {
  const loader = new STLLoader()
  return loader.parse(buffer)
}

const parseGeometryByFormat = async (
  format: UploadModelFormat,
  file: File,
): Promise<BufferGeometry> => {
  switch (format) {
    case 'obj': {
      const content = await file.text()
      return parseObjGeometry(content)
    }
    case 'stl': {
      const buffer = await file.arrayBuffer()
      return parseStlGeometry(buffer)
    }
    case 'glb': {
      const buffer = await file.arrayBuffer()
      return parseGlbGeometry(buffer)
    }
    default:
      throw new Error('Неподдерживаемый формат модели')
  }
}

export const loadUploadedModel = async (file: File): Promise<UploadedModel> => {
  const format = getFileFormat(file.name)
  const geometry = await parseGeometryByFormat(format, file)

  return {
    id: `upload-${Date.now()}`,
    name: file.name,
    format,
    geometry: normalizeGeometry(geometry),
    baseColor: createModelColor(file.name),
  }
}