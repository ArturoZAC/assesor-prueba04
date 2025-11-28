export function generarOpcionesAnos(anoInicio: number): number[] {
  const anoActual = new Date().getFullYear();
  const opcionesAnos: number[] = [];

  for (let i = anoInicio; i <= anoActual; i++) {
    opcionesAnos.push(i);
  }

  return opcionesAnos.sort((a, b) => b - a); // Ordenar de forma descendente (año actual primero)
}