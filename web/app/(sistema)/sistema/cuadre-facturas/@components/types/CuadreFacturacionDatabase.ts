
export type TipoOperacion = 'COMPRA' | 'VENTA';
export type Moneda = 'US$' | 'S/.';
export type EstatusPrestamo = 'PAGADO' | 'PENDIENTE' | 'A PLAZO';

export interface IUsuario {
  id: string;
  nombres: string;
  email: string;
  password?: string;
  activo: boolean;
  cliente: string | null;
  departamento: string | null;
  direccion: string | null;
  distrito: string | null;
  nacionalidad: string | null;
  observacion: string | null;
  ocupacion: string | null;
  otro: string | null;
  provincia: string | null;
  telefono: string | null;
  tercero: string | null;
  vigente: string | null;
  apellido_materno: string | null;
  apellido_materno_apo: string | null;
  apellido_paterno: string | null;
  apellido_paterno_apo: string | null;
  cliente_2: string | null;
  codigo: string;
  created_at: Date;
  documento: string | null;
  documento_2: string | null;
  documento_tercero: string | null;
  nombres_apo: string | null;
  numero_documento: string | null;
  rol_id: number;
  tipo_cliente: string | null;
  tipo_documento: string | null;
  tipo_documento_cliente: string | null;
  tipo_tercero: string | null;
  updated_at: Date;
  Facturacion?: IFacturacionOperacion[];
}

/**
 * Interface for the Operacion model
 * Included as FacturacionOperacion relates to Operacion
 */
export interface IOperacion {
  id: number;
  fecha: Date;
  numero: number;
  tipo: TipoOperacion;
  dolares: number; // Float mapped to number

  usuarioId: string;
  created_at: Date;
  updated_at: Date;

  tipoCambioId: number;
  flujoFondosId: number;
  rendimientoId: number | null;
  movimientoId: number;
  saldoFinalId: number | null;
  resultadoId: number | null;

  // Relations (can be included based on query)
  usuario?: IUsuario;
  Facturacion?: IFacturacionOperacion[];
}

/**
 * Interface for the FacturacionOperacion model
 * Included as CuadreFacturacion is related to FacturacionOperacion
 */
export interface IFacturacionOperacion {
  id: number;
  unit: number; // Decimal mapped to number
  glosa: string;
  op: number;
  tipo: string;
  accion: string;
  monto: number; // Decimal mapped to number
  tc: number; // Decimal mapped to number
  entrega: number; // Decimal mapped to number
  m1: string;
  recibe: number; // Decimal mapped to number
  m2: string;
  fecha: string;
  operacionId: number;
  usuarioId: string;
  createdAt: Date | null;
  updatedAt: Date | null;

  // Relations (can be included based on query)
  operacion?: IOperacion;
  usuario?: IUsuario;
  cuadreFacturacion: ICuadreFacturacion[]; // Inverse relation to CuadreFacturacion
}


export interface ICuadreFacturacion {
  id: number;
  difFecha: string;
  difMonto: string;
  difDocumento: string;

  facturacionId: number; // Foreign key

  fechaCuadre: string;
  docCuadre: string;
  numeroCuadre: string;
  clienteCuadre: string;
  rucCuadre: string;
  vendedorCuadre: string | null;
  subtotalCuadre: number;
  igvCuadre: number | null;
  totalCuadre: number

  createdAt: Date;
  updatedAt: Date;

  // Relation to FacturacionOperacion (can be included based on query)
  facturacion?: IFacturacionOperacion;
}