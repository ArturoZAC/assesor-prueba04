export function formatoFecha(fechaStr: string | null | undefined): string {

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

export function convertirFecha(fecha: any) {
  const [day, month, year] = fecha.split("/");
  if (day && month && year) {
    // Convertir al formato YYYY-MM-DD
    return `${year}-${month}-${day}`;
  }
  return ""; // Si la fecha no es válida, devuelve una cadena vacía
}

export function formatearFecha(fechaISO: string): string {
    const [anio, mes, dia] = fechaISO.split("T")[0].split("-");
    return `${dia}/${mes}/${anio}`;
  }