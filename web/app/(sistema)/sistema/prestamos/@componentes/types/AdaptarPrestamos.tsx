import { TypeDataPrestamoAPI } from "./TypeDataPrestamoAPI";

export const adaptarPrestamos = (data: TypeDataPrestamoAPI[]) => {
  // console.log(data);
  return data.map((pres) => ({
    id: pres.id,
    fecha: pres.fechaInicial,
    numero_prestamo: pres.numero_prestamo,
    cliente: `${pres.usuario.nombres} ${pres.usuario.apellido_paterno}`,
    tipo_documento: `${pres.usuario.tipo_cliente === "persona_juridica" ? "RUC" : "DNI"}`,
    documento: pres.usuario.documento,
    capital_soles: pres.capital_soles,
    capital_dolares: pres.capital_dolares,
    moneda: pres.moneda,
    tasa: Number(pres.tasa).toFixed(2),
    devolucion: pres.devolucion,
    dias: pres.dias,
    estatus: pres.estatus,
    interes: pres.interes,
    cobroTotal: pres.cobroTotal,
    tc: pres.tc,
    potencial: pres.potencial,
    igv: pres.igv,
    rendimiento: pres.rendimiento,
    ganancia: pres.ganancia,
    cuadre: pres.cuadre,
    detraccion: pres.detraccion,
    factura: pres.factura,
    codigoFacturaBoleta: `${pres.codigoFacturaBoleta}`,
    codigo: `${pres.codigoFacturaBoleta} ${pres.factura ?? ""}`,
    resaltarFila: {
      active: pres.PrestamoAnulados.length > 0,
      data:
        pres.PrestamoAnulados.length > 0
          ? [{ label: `Prestamos Anulados: ${pres.PrestamoAnulados.length}` }]
          : [],
    },
  }));
};
