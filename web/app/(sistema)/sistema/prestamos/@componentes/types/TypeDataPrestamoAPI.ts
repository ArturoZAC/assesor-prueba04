export type TypeDataPrestamoAPI = {
  id: number
  numero_prestamo: string;
  codigoFacturaBoleta: string;
  capital_soles: string
  capital_dolares: number
  moneda: string
  fechaInicial: string
  tasa: number
  devolucion: string
  dias: number
  estatus: string
  interes: number
  cobroTotal: number
  tc: number
  potencial: number
  igv: number
  rendimiento: number
  ganancia: number
  cuadre?: string
  detraccion: number
  factura: string
  createdAt: Date
  updatedAt: Date

  usuarioId: string
  usuario: {
    id: string
    nombres: string;
    apellido_paterno: string;
    documento: string;
    tipo_documento: string;
    tipo_cliente: string;
  };
  PrestamoAnulados: PrestamoAnulado[]
}

export type PrestamoAnulado = {
  id: number
  codigoFacturaBoleta: string;
  factura: string;
  prestamoId: number;
}