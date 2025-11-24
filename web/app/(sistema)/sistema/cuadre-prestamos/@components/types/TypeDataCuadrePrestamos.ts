interface PrestamoOperacion {
  id: number;
  numero_prestamo?: string | null;
  capital_soles?: number | null; // Representación de Decimal
  capital_dolares?: number | null; // Representación de Decimal
  moneda: Moneda;
  tasa: number;
  devolucion: string;
  fechaInicial: string;
  dias: number;
  estatus: EstatusPrestamo;
  interes: number; // Representación de Decimal
  cobroTotal: number; // Representación de Decimal
  tc: number; // Representación de Decimal
  potencial: number; // Representación de Decimal
  igv: number; // Representación de Decimal
  rendimiento: number; // Representación de Decimal
  ganancia: number; // Representación de Decimal
  cuadre?: string | null;
  detraccion: number; // Representación de Decimal
  factura?: string | null;
  usuarioId: string;
  createdAt: Date;
  updatedAt: Date;
  codigoFacturaBoleta?: string | null;
  tipo: string;
  usuario: Usuario;
  cuadrePrestamo: CuadrePrestamo[];
}

interface CuadrePrestamo {
  id: number;
  prestamoId: number;
  prestamo: PrestamoOperacion;
  salidasPrestamo?: PagosPrestamo[];
  devolucionesPrestamo?: DevolucionesPrestamo[];
  createdAt: Date;
  updatedAt: Date;
}

interface PagosPrestamo {
  id: number;
  cuadrePrestamoId: number;
  descripcion: string;
  moonto: number; // Representación de Decimal
  diferencia: number; // Representación de Decimal
  cuadrePrestamo: CuadrePrestamo;
  fecha: Date

  createdAt: Date;
  updatedAt: Date;
}

interface DevolucionesPrestamo {
  id: number;
  cuadrePrestamoId: number;
  deposito: string;
  pagado: number; // Representación de Decimal
  tc?: number | null;
  montoFinal: number; // Representación de Decimal
  referencia?: number | null;
  diferencia: number; // Representación de Decimal
  cuadrePrestamo: CuadrePrestamo;
  fecha: Date

  createdAt: Date;
  updatedAt: Date;
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
  Prestamos: PrestamoOperacion[];
}

enum Moneda {
  USD = "US$",
  PEN = "S/.",
}

enum EstatusPrestamo {
  PAGADO = "PAGADO",
  PENDIENTE = "PENDIENTE",
  A_PLAZO = "A PLAZO",
}