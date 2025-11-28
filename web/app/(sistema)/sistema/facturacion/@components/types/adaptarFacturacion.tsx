
import { FacturacionOperacion } from "./FacturacionDatabase";

export function adaptarFacturacion(data: FacturacionOperacion[]) {
  return data.map((item) => ({
    id: item.id,
    fecha: item.fecha,
    cliente: `${item.usuario.nombres} ${item.usuario.apellido_paterno}`,
    documento: item.usuario.documento,
    unit: Math.abs(item.unit),
    glosa: item.glosa,
    op: item.op,
    tipo: item.tipo,
    accion: item.accion,
    monto: item.monto,
    tc: item.tc,
    entrega: item.entrega,
    m1: item.m1,
    recibe: item.recibe,
    m2: item.m2,
    resaltarFila: {
      active: false
    }
  }));
}