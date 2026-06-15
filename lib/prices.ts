export const PRICING_MAP: Record<string, { basic: number; standard: number; premium: number }> = {
  'USD': { basic: 50, standard: 65, premium: 80 },
  'EUR': { basic: 50, standard: 65, premium: 80 },
  'GBP': { basic: 35, standard: 45, premium: 55 },
  'AUD': { basic: 50, standard: 65, premium: 80 },
  'PLN': { basic: 50, standard: 65, premium: 80 },
  'SEK': { basic: 50, standard: 65, premium: 80 },
  'AED': { basic: 50, standard: 65, premium: 80 },
  'MDL': { basic: 50, standard: 65, premium: 80 },
  'BAM': { basic: 50, standard: 65, premium: 80 },
  'RON': { basic: 50, standard: 65, premium: 80 },
  'DKK': { basic: 50, standard: 65, premium: 80 },
  'CHF': { basic: 50, standard: 65, premium: 80 },
  'CZK': { basic: 50, standard: 65, premium: 80 },
  'BGN': { basic: 50, standard: 65, premium: 80 },
  'HUF': { basic: 50, standard: 65, premium: 80 },
  'UAH': { basic: 50, standard: 65, premium: 80 },
}

export const CURRENCY_SYMBOLS: Record<string, string> = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'AUD': 'A$',
  'PLN': 'zł',
  'SEK': 'kr',
  'AED': 'د.إ',
  'MDL': 'L',
  'BAM': 'KM',
  'RON': 'lei',
  'DKK': 'kr',
  'CHF': 'CHF',
  'CZK': 'Kč',
  'BGN': 'лв',
  'HUF': 'Ft',
  'UAH': '₴',
}

export function getPrice(packageId: 'basic' | 'standard' | 'premium', currency = 'USD') {
  const pricing = PRICING_MAP[currency] || PRICING_MAP['USD']
  return pricing[packageId]
}

export function getCurrencySymbol(currency = 'USD') {
  return CURRENCY_SYMBOLS[currency] || '$'
}

export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US') {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount)
  } catch (e) {
    // Fallback to simple formatting
    const symbol = getCurrencySymbol(currency)
    return `${symbol} ${amount.toFixed(2)}`
  }
}
