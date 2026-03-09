export const formatNumber = (value: number, fractionDigits = 2): string => {
  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits === 0 ? 0 : Math.min(fractionDigits, 1),
  }).format(value)
}