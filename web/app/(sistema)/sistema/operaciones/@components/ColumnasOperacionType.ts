export type ColumnasOperacion = {
  // Operaciones
  fecha: string | Date;
  numero: string;
  cliente: string;
  tipo: "COMPRA" | "VENTA";
  dolares: number;

  // Tipo de Cambio
  tipoCambio_compra: number;
  tipoCambio_venta: number;
  tipoCambio_venta2?: number; // si es opcional
  tipoCambio_spread: number;
  tipoCambio_promedio: number;
  tipoCambio_v3?: number; // si es opcional

  // Flujo de Fondos
  flujoFondos_montoUSD: number;
  flujoFondos_montoPEN: number;

  // Rendimiento
  rendimiento_forzado: number;
  rendimiento_medio: number;
  rendimiento_esperado: number;

  // Movimiento Fondos
  movimiento_compraUSD: number;
  movimiento_ventaUSD: number;

  // Saldo Final
  saldoFinal_montoUSD: number;
  saldoFinal_montoPEN: number;

  // Resultado
  resultado_simple: number;
  resultado_estricto: number;
  resultado_potencial: number;
  resultado_q: number;
  resultado_tipoCli: string;
};
