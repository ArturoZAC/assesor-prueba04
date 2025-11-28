export function formatearNumeroDecimal (number: any): number {
  return Number(Number(number).toFixed(2)) || 0;
}