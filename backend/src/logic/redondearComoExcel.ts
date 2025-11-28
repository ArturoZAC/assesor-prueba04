export function redondearComoExcel(num: number, decimales: number) {

  const factor = Math.pow(10, decimales);
  const adjustedNum = num + (num > 0 ? Number.EPSILON : -Number.EPSILON);
  
  const roundedValue = Math.round(adjustedNum * factor) / factor;
  return parseFloat(roundedValue.toFixed(decimales));
}