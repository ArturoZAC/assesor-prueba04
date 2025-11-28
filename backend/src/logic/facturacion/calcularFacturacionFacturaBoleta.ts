export function calcularFacturacionBoleta(numero: number, tipoDocumento: string) {
  const prefijo = tipoDocumento.toUpperCase() === 'FAC' ? 'F001-' : 'B001-';
    const numeroString = String(numero + 6000);
    const cantidadCeros = 9 - numeroString.length;
    const ceros = cantidadCeros > 0 ? '0'.repeat(cantidadCeros) : '';
    return prefijo + ceros + numeroString;
}