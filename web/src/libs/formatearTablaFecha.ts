export function formatearTablaFecha(fechaISO: string): string {
  const fecha = new Date(fechaISO);
  if (isNaN(fecha.getTime())) {
    return "";
  }
  const numeroDia = fecha.getDate();
  const opcionesMes: Intl.DateTimeFormatOptions = { month: 'long' };
  const nombreMes = new Intl.DateTimeFormat('es-PE', opcionesMes).format(fecha);

  return `${numeroDia + 1} de ${nombreMes}`;
}