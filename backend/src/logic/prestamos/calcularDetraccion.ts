export function calcularDetraccion(potencial: number, tipo: string) {
  // if (tipo.toUpperCase() === "BOLETA") {
  //   return 0;
  // }
  // if (potencial >= 700) {
  //   return potencial * 0.12;
  // } else {
  //   return 0;
  // }

  const tipoNormalizado = tipo?.toUpperCase() ?? "BOLETA";

  if (tipoNormalizado === "BOLETA") return 0;
  if (potencial >= 700) return potencial * 0.12;
  return 0;
}
