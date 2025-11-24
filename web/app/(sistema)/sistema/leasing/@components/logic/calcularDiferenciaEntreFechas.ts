'use client'


export function calcularDiasEntreFechas(fechaInicio: string, fechaFin: string) {

  if (fechaInicio && fechaFin) {
    const fecha_Inicio = new Date(fechaInicio);
    const fecha_Fin = new Date(fechaFin);

    if (isNaN(fecha_Inicio.getTime()) || isNaN(fecha_Fin.getTime())) {
      return null; // Indica que las fechas no son válidas
    }

    const inicioEnMilisegundos = fecha_Inicio.getTime();
    const finEnMilisegundos = fecha_Fin.getTime();
    const diferenciaEnMilisegundos = Math.abs(finEnMilisegundos - inicioEnMilisegundos);
    const unDiaEnMilisegundos = 1000 * 60 * 60 * 24;
    const diasDeDiferencia = Math.ceil(diferenciaEnMilisegundos / unDiaEnMilisegundos);

    return diasDeDiferencia;
  }
  return null; // Si alguna fecha falta, no se puede calcular la diferencia
}