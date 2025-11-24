
import { LeasingOperacion } from "./CuadreLeasingDatabase"

export const AdaptarLeasingCuadre = (data: LeasingOperacion[]) => {
  console.log(data)
  return data.map((item) => ({
    id: item.cuadreLeasing?.id ?? '',
    fecha: item.fecha_inicial,
    leasingId: item.id,
    cliente: `${item.usuario.apellido_paterno} ${item.usuario.apellido_materno}, ${item.usuario.nombres}`,
    documento: item.usuario.documento,
    monto: item.cobroTotal,
    monto_total: item.cobroTotal,
    fecha_pag: item.cuadreLeasing?.pagosRealizados[0] && item.cuadreLeasing?.pagosRealizados[0].pagoLeasing?.fecha ? item.cuadreLeasing?.pagosRealizados[0].pagoLeasing?.fecha : null,
    deposito_pag: item.cuadreLeasing?.pagosRealizados[0] && item.cuadreLeasing?.pagosRealizados[0].pagoLeasing?.deposito ? item.cuadreLeasing?.pagosRealizados[0].pagoLeasing?.deposito :  null,
    pagado_pag: item.cuadreLeasing?.pagosRealizados[0] && item.cuadreLeasing?.pagosRealizados[0].pagoLeasing?.pagado ? item.cuadreLeasing?.pagosRealizados[0].pagoLeasing?.pagado : null,
    tc_pag:item.cuadreLeasing?.pagosRealizados[0] && item.cuadreLeasing?.pagosRealizados[0].pagoLeasing?.tc ? item.cuadreLeasing?.pagosRealizados[0].pagoLeasing?.tc : null,
    monto_final_pag: item.cuadreLeasing?.pagosRealizados[0] && item.cuadreLeasing?.pagosRealizados[0].pagoLeasing?.montoFinal ? item.cuadreLeasing?.pagosRealizados[0].pagoLeasing?.montoFinal : null,
    referencia_pag: item.cuadreLeasing?.pagosRealizados[0] && item.cuadreLeasing?.pagosRealizados[0].pagoLeasing?.referencia ? item.cuadreLeasing?.pagosRealizados[0].pagoLeasing?.referencia : null,
    diferencia_pag: item.cuadreLeasing?.pagosRealizados[0] && item.cuadreLeasing?.pagosRealizados[0].pagoLeasing?.diferencia ? item.cuadreLeasing?.pagosRealizados[0].pagoLeasing?.diferencia : null,
    deposito_det: item.cuadreLeasing?.pagosRealizados[0] && item.cuadreLeasing?.pagosRealizados[0].detraccion?.deposito ? item.cuadreLeasing?.pagosRealizados[0].detraccion?.deposito : null,
    pagado_det: item.cuadreLeasing?.pagosRealizados[0] && item.cuadreLeasing?.pagosRealizados[0] && item.cuadreLeasing?.pagosRealizados[0].detraccion?.pagado ? item.cuadreLeasing?.pagosRealizados[0].detraccion?.pagado : null,
    tc_det: item.cuadreLeasing?.pagosRealizados[0] && item.cuadreLeasing?.pagosRealizados[0].detraccion?.tc ? item.cuadreLeasing?.pagosRealizados[0].detraccion?.tc : null,
    monto_final_det: item.cuadreLeasing?.pagosRealizados[0] && item.cuadreLeasing?.pagosRealizados[0].detraccion?.montoFinal ? item.cuadreLeasing?.pagosRealizados[0].detraccion?.montoFinal : null,
    referencia_det: item.cuadreLeasing?.pagosRealizados[0] && item.cuadreLeasing?.pagosRealizados[0].detraccion?.referencia ? item.cuadreLeasing?.pagosRealizados[0].detraccion?.referencia : null,
    // diferencia_det: item.cuadreLeasing?.pagosRealizados[0] && item.cuadreLeasing?.pagosRealizados[0].detraccion?.diferencia ? item.cuadreLeasing?.pagosRealizados[0].detraccion?.diferencia : null,
    diferencia_det: (() => {
      let current = Number(item.cobroTotal);
      item.cuadreLeasing?.pagosRealizados?.forEach((cuadre) => {
        
        current = Math.abs(current) - Math.abs(Number(cuadre.pagoLeasing?.montoFinal) + Math.abs(Number(cuadre.detraccion?.pagado)));
        
      });

      return Number(-(current).toFixed(2));
    })(),
    resaltarFila: {
      active:
      item.cuadreLeasing !== null && item.cuadreLeasing?.pagosRealizados !== undefined && item.cuadreLeasing.pagosRealizados.length > 0 ? true : false,
      data: [
        {
          label: `${item.cuadreLeasing?.pagosRealizados.length} cuadres de leasing`,
        }
      ],
    },
  }))
}