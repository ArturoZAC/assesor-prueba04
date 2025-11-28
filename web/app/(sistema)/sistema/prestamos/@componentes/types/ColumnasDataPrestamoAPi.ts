export type ColumnasDataPrestamoAPi = {
  id: number
  numero_prestamo: string;
  codigoFacturaBoleta: string;
  capital_soles: string
  capital_dolares: number
  moneda: string
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

  usuarioId: string
  usuario: {
    id: string
    nombres: string;
    documento: string;
    tipo_documento: string;
  }
}