export function parseDate (fechaISO?: Date): string {
  const fecha = new Date(fechaISO ?? new Date())

  if (isNaN(fecha.getTime())) {
    return 'Fecha inválida'
  }

  return fecha.toLocaleString('es-ES')
}

export function formatearFechaParaInputDate (fechaISO: string): string {
  const fecha = new Date(fechaISO)
  const año = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0') // Los meses van de 0 a 11
  const dia = String(fecha.getDate()).padStart(2, '0')
  console.log(año, mes, dia)
  return `${año}-${mes}-${dia}`
}
