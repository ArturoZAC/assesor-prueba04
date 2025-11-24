export interface TypeDataLeasingApi {
  id: number
  numero: number
  codSer: string
  numero_leasing: string;
  codigoFacturaBoleta: string;
  precio: number
  factura: string
  fecha_inicial: Date
  fecha_final: Date
  dias: number
  cobroTotal: number
  tc: number
  potencial: number
  igv: number
  rendimiento: number
  estatus: string
  detraccion: number
  descripcion: string
  tipo: string
  leasingAnulados: LeasingAnulado[]

  createdAt: Date
  updatedAt: Date

  usuarioId: string
  usuario: {
    id: string
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    documento: string;
    tipo_documento: string;
    tipo_cliente: string
  };
  
}

export type LeasingAnulado = {
  id: number
  codigoFacturaBoleta: string;
  factura: string;
  leasingId: number;
}