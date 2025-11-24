export function calcularFacturaBoleta(numero: number, tipoDocumento: string): string {
  const prefijo = tipoDocumento.toUpperCase() === 'FACTURA' ? 'F003-' : 'B003-';
  const numeroString = String(numero);
  const cantidadCeros = 9 - numeroString.length;
  const ceros = cantidadCeros > 0 ? '0'.repeat(cantidadCeros) : '';
  return prefijo + ceros + numeroString;
}