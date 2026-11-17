// Currency formatting utility for Philippine Peso
export function formatPHP(amount) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function formatPHPShort(amount) {
  if (amount >= 1000000) {
    return `₱${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `₱${(amount / 1000).toFixed(1)}k`
  }
  return `₱${amount}`
}