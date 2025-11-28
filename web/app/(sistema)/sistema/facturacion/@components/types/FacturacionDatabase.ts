

export interface FacturacionOperacion {
  id: number;
  unit: number; // Representación de Decimal en TypeScript
  glosa: string;
  op: number;
  tipo: string;
  fecha: Date;
  accion: string;
  monto: number; // Representación de Decimal en TypeScript
  tc: number; // Representación de Decimal en TypeScript
  entrega: number; // Representación de Decimal en TypeScript
  m1: string;
  recibe: number; // Representación de Decimal en TypeScript
  m2: string;
  operacionId: number;
  operacion: Operacion;
  usuarioId: string;
  usuario: Usuario;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

interface Operacion {
  id: number;
  fecha: Date;
  numero: number;
  tipo: TipoOperacion;
  dolares: number;
  usuarioId: string;
  usuario: Usuario;
  created_at: Date;
  updated_at: Date;
  Facturacion: FacturacionOperacion[];
}

interface Usuario {
  id: string;
  nombres: string;
  email: string;
  password: string;
  activo: boolean;
  cliente?: string | null;
  departamento?: string | null;
  direccion?: string | null;
  distrito?: string | null;
  nacionalidad?: string | null;
  observacion?: string | null;
  ocupacion?: string | null;
  otro?: string | null;
  provincia?: string | null;
  telefono?: string | null;
  tercero?: string | null;
  vigente?: string | null;
  apellido_materno?: string | null;
  apellido_materno_apo?: string | null;
  apellido_paterno?: string | null;
  apellido_paterno_apo?: string | null;
  cliente_2?: string | null;
  codigo: string;
  created_at: Date;
  documento?: string | null;
  documento_2?: string | null;
  documento_tercero?: string | null;
  nombres_apo?: string | null;
  numero_documento?: string | null;
  rol_id: number;
  tipo_cliente?: string | null;
  tipo_documento?: string | null;
  tipo_documento_cliente?: string | null;
  tipo_tercero?: string | null;
  updated_at: Date;
  Facturacion: FacturacionOperacion[];
  rol: Rol;
}

interface Rol {
  id: number;
  nombre: string;
  createdAt: Date;
  updatedAt: Date;
  Usuario: Usuario[];
}

enum TipoOperacion {
  COMPRA = "COMPRA",
  VENTA = "VENTA",
}