export function formatNumberToTwoDecimals(num: number, digits?: number) {
  if (!num) {
    return null
  }
  return num.toLocaleString('en-US', {
    minimumFractionDigits: digits ?? 2,
    maximumFractionDigits: digits ?? 2,
  });
}