export function calcularDetraccionLeasing(potencial: number, tipo: string) {
  if (tipo.toUpperCase() === 'BOLETA') {
    return 0
  }
  if (potencial > 700) {
    return potencial * 0.10; // 12% se representa como 0.12 en JavaScript
  } else {
    return 0;
  }
}