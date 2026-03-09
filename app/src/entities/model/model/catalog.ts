import type { ModelPreset } from '@/entities/model/model/types'

export const MODEL_PRESETS: ModelPreset[] = [
  {
    id: 'precision-valve',
    title: 'Precision Valve Core',
    description: 'Осевой узел клапана для систем с высокими нагрузками.',
    baseColor: '#22d3ee',
    tags: ['fluid', 'CNC', 'core'],
  },
  {
    id: 'turbine-impeller',
    title: 'Turbine Impeller',
    description: 'Крыльчатка с акцентом на аэродинамический профиль.',
    baseColor: '#fb923c',
    tags: ['aero', 'heat', 'rotor'],
  },
  {
    id: 'drone-hub',
    title: 'Drone Hub',
    description: 'Центральный модуль крепления двигателей и датчиков.',
    baseColor: '#4ade80',
    tags: ['lightweight', 'composite', 'rigid'],
  },
  {
    id: 'fusion-nozzle',
    title: 'Fusion Nozzle',
    description: 'Сопло с управлением завихрением потока.',
    baseColor: '#f472b6',
    tags: ['propulsion', 'thermal', 'prototype'],
  },
]

export const getModelPreset = (id: string): ModelPreset => {
  return MODEL_PRESETS.find((preset) => preset.id === id) ?? MODEL_PRESETS[0]
}