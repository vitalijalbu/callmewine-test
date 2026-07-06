import type { Money } from '~/types/product'

export function formatMoney(
  value: Money | number | string,
  currencyCode = 'EUR',
  locale = 'it-IT'
): string {
  const amount = typeof value === 'object' ? Number(value.amount) : Number(value)
  const currency = typeof value === 'object' ? value.currencyCode : currencyCode

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(Number.isFinite(amount) ? amount : 0)
}
