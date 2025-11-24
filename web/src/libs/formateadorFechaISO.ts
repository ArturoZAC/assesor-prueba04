export function formatearFechaISO(fechaISO: string) {

  if (!fechaISO) return ''

  const fecha = new Date(fechaISO);
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // +1 porque los meses van de 0 a 11
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${dia}-${mes}-${año}`;
}