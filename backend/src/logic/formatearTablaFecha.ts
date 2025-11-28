export function formatearTablaFecha(fechaStr: string): string {
  /*
  const fecha = new Date(fechaISO);
  if (isNaN(fecha.getTime())) {
    return "";
  }
  const numeroDia = fecha.getUTCDay();
  const opcionesMes: Intl.DateTimeFormatOptions = { month: 'long' };
  const nombreMes = new Intl.DateTimeFormat('es-PE', opcionesMes).format(fecha);

  return `${numeroDia} de ${nombreMes}`;
  */
  if (!fechaStr) return "";

  const fecha = new Date(fechaStr);
  if (isNaN(fecha.getTime())) return "";

  const dia = fecha.getUTCDate();
  const mes = fecha.getUTCMonth();
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  return `${dia} ${meses[mes]}`;
}