export type OperacionAPI = {
    id: number,
  fecha: string;
  numero: string;
  tipo: string;
  dolares: number;
  usuarioId: string
  t: string
  usuario: {
    id: string
    nombres: string;
    documento: string;
    apellido_paterno: string;
    apellido_materno: string;
    tipo_documento: string;
    tipo_cliente: string
  };
  tipoCambio: {
    compra: number;
    venta: number;
    spread: number;
    promedio: number;
  };
  flujoFondos: {
    montoUSD: number;
    montoPEN: number;
  };
  rendimiento: {
    forzado: number;
    medio: number;
    esperado: number;
  };
  movimiento: {
    compraUSD: number;
    ventaUSD: number;
  };
  saldoFinal: {
    montoUSD: number;
    montoPEN: number;
  };
  resultado: {
    simple: number;
    estricto: number;
    potencial: number;
  };
};
