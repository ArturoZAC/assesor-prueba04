export function calcularDiferenciaDias(fechaInicial: string, fechaDevolucion: string): number {
  if (!fechaInicial || !fechaDevolucion) return 0;

  const inicio = new Date(fechaInicial);
  const fin = new Date(fechaDevolucion);

  // Normalizamos la hora a medianoche para evitar errores por diferencias de hora
  inicio.setHours(0, 0, 0, 0);
  fin.setHours(0, 0, 0, 0);

  if (fin < inicio) return 0;

  const diferenciaMilisegundos = fin.getTime() - inicio.getTime();
  const diferenciaDias = Math.ceil(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

  return diferenciaDias;
}