import { Usuario } from "@/interfaces/UsuarioDatabase";

export interface LeasingOperacion {
  id: number;
  usuarioId: string;
  codSer: string;
  numero: number;
  numero_leasing: string;
  precio: number;
  fecha_inicial: string;
  fecha_final: string;
  dias: number;
  tipo: string;
  fecha: string

  estatus: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'PAGADO';
  cobroTotal: number;
  tc: number;
  potencial: number;
  igv: number;
  rendimiento: number;
  detraccion: number;
  codigoFacturaBoleta: string | null;
  descripcion: string | null;
  factura: string | null;
  cuadreLeasing?: CuadreLeasing | null;
  createdAt: Date;
  updatedAt: Date;
  usuario: Usuario
}

export interface CuadreLeasing {
  id: number;
  leasingId?: number | null;
  leasing?: LeasingOperacion | null;
  pagosRealizados: PagoRealizadoLeasing[];
  fecha: Date
  createdAt: Date;
  updatedAt: Date;
  detraccion: {
    fecha: Date
  }
}

export interface PagoRealizadoLeasing {
  id: number;
  cuadreLeasingId: number;
  cuadreLeasing?: CuadreLeasing | null;
  detraccion?: DetraccionLeasing | null;
  pagoLeasing?: PagoLeasing | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DetraccionLeasing {
  id: number;
  deposito: string;
  pagado: number;
  tc?: number | null;
  montoFinal: number;
  referencia?: number | null;
  diferencia: number;
  CuadreLeasing?: PagoRealizadoLeasing | null;
  cuadreLeasingRealizadoId?: number | null;
  fecha: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PagoLeasing {
  id: number;
  deposito: string;
  pagado: number;
  tc?: number | null;
  montoFinal: number;
  referencia?: number | null;
  diferencia: number;
  fecha: string
  CuadreLeasing?: PagoRealizadoLeasing | null;
  cuadreLeasingRealizadoId?: number | null;

  createdAt: Date;
  updatedAt: Date;
}