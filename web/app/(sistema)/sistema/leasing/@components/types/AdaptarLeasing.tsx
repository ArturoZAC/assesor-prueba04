import { TypeDataLeasingApi } from "./TypeDataLeasingApi"

export const adaptarLeasing = (data: TypeDataLeasingApi[]) => {
  console.log(data)
  return data.map((leasing) => ({
    id: leasing.id,
    usuarioId: leasing.usuarioId,
    codSer: leasing.codSer,
    numero: leasing.numero,
    fecha: leasing.createdAt,
    numero_leasing: leasing.numero_leasing,
    cliente: `${leasing.usuario.nombres ? `${leasing.usuario.nombres} ` : ''}${leasing.usuario.apellido_paterno}`,
    tipo_documento: `${leasing.usuario.tipo_cliente === 'persona_juridica' ? 'RUC' : 'DNI'}`,
    documento: leasing.usuario.documento,
    precio: leasing.precio,
    factura: leasing.factura,
    fecha_inicial: leasing.fecha_inicial,
    fecha_final: leasing.fecha_final,
    dias: leasing.dias,
    cobroTotal: leasing.cobroTotal,
    tc: leasing.tc,
    potencial: leasing.potencial,
    igv: leasing.igv,
    tipo: leasing.tipo,
    rendimiento: leasing.rendimiento,
    estatus: leasing.estatus,
    detraccion: leasing.detraccion,
    codigoFacturaBoleta: `${leasing.codigoFacturaBoleta}`,
    codigo: `${leasing.codigoFacturaBoleta} ${leasing.factura ?? ''}`,
    resaltarFila: {
      active: leasing.leasingAnulados.length > 0,
      data: leasing.leasingAnulados.length > 0 ? [
        { label: `Leasing Anulados: ${leasing.leasingAnulados.length}` },
      ] : [],
    }
  }))
}