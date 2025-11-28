
import { IFacturacionOperacion } from "./CuadreFacturacionDatabase";
import { formatoFecha } from "@/libs/formateadorFecha";

export const AdaptarFacturacionCuadre = (data: IFacturacionOperacion[]) => {
  console.log(data)
  return data.map((item) => {
    const hasCuadre = item.cuadreFacturacion !== null && item.cuadreFacturacion !== undefined;

    const hasDifferences = hasCuadre && (
      item.cuadreFacturacion?.[0]?.difFecha !== 'FECHA OK' ||
      item.cuadreFacturacion?.[0]?.difMonto !== 'MONTO OK' ||
      item.cuadreFacturacion?.[0]?.difDocumento !== 'CLIENTE OK'
    );

    const fechaFormat = new Date(item.fecha);
    const dia = fechaFormat.getUTCDate();
    const mes = fechaFormat.getUTCMonth() + 1;

    return {
      id: item.id ?? '',
      doc: item.cuadreFacturacion ? item.cuadreFacturacion?.[0]?.docCuadre : '',
      numero: item.cuadreFacturacion ? item.cuadreFacturacion?.[0]?.numeroCuadre : '',
      cliente: item.cuadreFacturacion ? item.cuadreFacturacion?.[0]?.clienteCuadre : '',
      ruc: item.cuadreFacturacion ? item.cuadreFacturacion?.[0]?.rucCuadre : '',
      vendedor: item.cuadreFacturacion ? item.cuadreFacturacion?.[0]?.vendedorCuadre : '',
      subtotal: item.cuadreFacturacion ? item.cuadreFacturacion?.[0]?.subtotalCuadre : '',
      igv: item.cuadreFacturacion ? item.cuadreFacturacion?.[0]?.igvCuadre : '',
      fecha: (String(item.cuadreFacturacion?.[0]?.fechaCuadre ?? '')),
      dia: dia,
      mes: mes,
      total: item.cuadreFacturacion ? item.cuadreFacturacion?.[0]?.totalCuadre : '',
      m: item.cuadreFacturacion ? 'S' : '',
      cuadreFacturacionId: item.cuadreFacturacion ? item.cuadreFacturacion?.[0]?.id : 0,
      f_op: formatoFecha(String(item?.fecha)),
      cliente_op: `${item.usuario?.apellido_paterno} ${item.usuario?.apellido_materno}, ${item.usuario?.nombres}`,
      doc_cliente_op: item.usuario?.documento ?? '',
      monto_op: item.tipo === 'COMPRA' ? item.recibe : item.entrega,
      dif_f: item.cuadreFacturacion?.[0]?.difFecha ?? '',
      dif_m: item.cuadreFacturacion?.[0]?.difMonto ?? '',
      dif_d: item.cuadreFacturacion?.[0]?.difDocumento ?? '',
      resaltarFila: {
        active: hasDifferences,
        data: hasDifferences ? [
          { label: `Cantidad de Cuadres: ${item.cuadreFacturacion.length}` },
        ] : [],
      },
    };
  });
};