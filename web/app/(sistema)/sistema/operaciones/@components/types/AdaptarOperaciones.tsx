import { FaEquals, FaLongArrowAltUp } from "react-icons/fa";
import { FaLongArrowAltDown } from "react-icons/fa";
import { OperacionAPI } from "./TypeDataOperacionAPI";

export const adaptarOperaciones = (data: OperacionAPI[]) => {

  console.log(data)

  return data.map((op, index) => ({
    id: op.id,
    t: op.t,
    usuarioId: op.usuarioId,
    fecha: op.fecha,
    numero: op.numero,
    cliente: `${op.usuario.nombres} ${op.usuario.apellido_paterno} ${op.usuario.apellido_materno}`,
    documento: op.usuario.documento,
    tipo: op.tipo,
    dolares: op.dolares,
    

    tipoCambio_compra: op.tipoCambio.compra,
    tipoCambio_v1:
      op.tipoCambio.compra > data[index - 1]?.tipoCambio.compra ? (
        <FaLongArrowAltUp className="text-lg text-blue-500" />
      ) : op.tipoCambio.compra < data[index - 1]?.tipoCambio.compra ? (
        <FaLongArrowAltDown className="text-lg text-blue-500" />
      ) : (
        <FaEquals className="text-lg text-blue-500" />
      ),
    tipoCambio_venta: op.tipoCambio.venta,
    tipoCambio_v2:
      op.tipoCambio.venta > data[index - 1]?.tipoCambio.venta ? (
        <FaLongArrowAltUp className="text-lg text-blue-500" />
      ) : op.tipoCambio.venta < data[index - 1]?.tipoCambio.venta ? (
        <FaLongArrowAltDown className="text-lg text-blue-500" />
      ) : (
        <FaEquals className="text-lg text-blue-500" />
      ),
    tipoCambio_spread: op.tipoCambio.spread,
    tipoCambio_promedio: op.tipoCambio.promedio,
    tipoCambio_v3:
      op.tipoCambio.promedio > data[index - 1]?.tipoCambio.promedio ? (
        <FaLongArrowAltUp className="text-lg text-blue-500" />
      ) : op.tipoCambio.promedio < data[index - 1]?.tipoCambio.promedio ? (
        <FaLongArrowAltDown className="text-lg text-blue-500" />
      ) : (
        <FaEquals className="text-lg text-blue-500" />
      ),

    flujoFondos_montoUSD: op.flujoFondos.montoUSD,
    flujoFondos_montoPEN: op.flujoFondos.montoPEN,

    rendimiento_forzado: op.rendimiento.forzado,
    rendimiento_medio: op.rendimiento.medio,
    rendimiento_esperado: op.rendimiento.esperado,

    movimiento_compraUSD: op.movimiento.compraUSD,
    movimiento_ventaUSD: op.movimiento.ventaUSD,

    saldoFinal_montoUSD: op.saldoFinal.montoUSD,
    saldoFinal_montoPEN: op.saldoFinal.montoPEN,

    resultado_simple: op.resultado.simple,
    resultado_estricto: op.resultado.estricto,
    resultado_potencial: op.resultado.potencial,
    resultado_q: op.usuario.documento.length === 11 ? 1 : 0,
    resultado_tipoCli: `${op.usuario.tipo_cliente === 'persona_juridica' ? 'RUC' : 'DNI'}`,
    usuario: op.usuario
  }));
};
