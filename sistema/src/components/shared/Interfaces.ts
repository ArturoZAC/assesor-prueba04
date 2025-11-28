import { type Curso } from '../../interfaces/CursoInterface'

export interface valuesTransaccion {
  id: number
  nombres: string
  paymentId: string
  paymentDate?: string
  apellidos: string
  email: string
  direccion: string
  tipo_documento: string
  ruc: string
  dni: string
  tipoEntrega: string
  empresaCarga: string
  otraEmpresa: string
  celular: string
  status: string
  additionalInfo: string
  transactionAmount: string
  estado: number
  productos: string // Aquí puede ser string si guardas el JSON en formato string
  imagen1?: string

  cupon?: {
    codigo: string
    tipoDescuento: string // Tipo de descuento (porcentaje o monto fijo)
    porcentajeDescuento?: number // Si el descuento es en porcentaje
    montoDescuento?: number // Si el descuento es un monto fijo
    validoDesde?: string // Fecha desde cuando es válido
    validoHasta?: string // Fecha hasta cuando es válido
    maximoUsos?: number // Máximo número de usos del cupón
    valorMinimoPedido?: number // Valor mínimo del pedido para aplicar el cupón
    cantUsos?: number // Cantidad de usos actuales del cupón
  }
}
export interface valuesClientes {
  id: number
  nombres: string
  apellidos: string
  email: string
  celular: string
  tipo_documento: string
  dni: string
  ruc: string
}

export interface configuracionValues {
  telefono: string
  celular1: string
  celular2: string
  correo1: string
  correo2: string
  horario1: string
  horario2: string
  direccion: string
  facebook: string
  instagram: string
  twiter: string
  linkedin: string
  youtube: string
  whatsapp: string
}

export interface Values {
  nombres: string
  celular: string
  email: string
  base_proyecto: string
  nombre_empresa: string
  historia_empresa: string
  principales_servicios: string
  colores: string
  referencias: string
  transmitir: string
}

export interface ImagenState {
  archivo: File | null
  archivoName: string
}

export interface ImagePreviewProps {
  url: string
  setUrl: React.Dispatch<React.SetStateAction<string>>
  boton: boolean
  setBoton: React.Dispatch<React.SetStateAction<boolean>>
  setImagen: React.Dispatch<React.SetStateAction<ImagenState>>
  clase: string
}

export interface ImagePreviewPropsUdpdate {
  globalUrl: string
  url: string
  setUrl: React.Dispatch<React.SetStateAction<string>>
  boton: boolean
  setBoton: React.Dispatch<React.SetStateAction<boolean>>
  imagen: string
  setImagen: React.Dispatch<React.SetStateAction<ImagenState>>
  clase: string
}

export interface interfaceListaDiseño {
  id: number
  nombres: string
  celular: number
  email: string
  nombre_empresa: string
  created_at: string
  uptated_at: string
}

// PAGINACION
export interface paginacionValues {
  totalPosts: number
  cantidadRegistros: number
  paginaActual: number
  setpaginaActual: (pagina: number) => void
}

// DELETE
export interface deleteValues {
  ruta: string
  id: string | number
  token: string | null
  getData: () => Promise<void>
  totalPosts: number
  cantidadRegistros: number
  paginaActual: number
  setpaginaActual: (pagina: number) => void
}

// BANNERS
export interface bannersValues {
  id: number
  imagen1: string
  created_at: string | null
  updated_at: string | null
}

// BANNERS
export interface bannersValuesModificate {
  titulo: string
  descripcion: string
}

// MARCAS
export interface marcasValue {
  id: number
  imagen1: string
  imagen2: string
  created_at: string | null
  updated_at: string | null
}

// CATEGORIAS
// LISTA
export interface categoriasValues {
  id: number
  nombre: string
  url_imagen: string
  url_icono: string
  created_at: string | null
  updated_at: string | null
}

export interface Beneficio {
  id: number
  icono: string
  texto: string
  cursoId: string
  createdAt: Date
  updatedAt: Date
  curso: Curso[]
}

// CREACION - UPDATE
export interface categoriasValuesMoficate {
  nombre: string
}

export interface beneficiosValuesModificate {
  texto: string
  cursoId: string
}

export interface seccionValues {
  id: string
  nombre: string
  posicion: number
  cursoId: string
}

export interface SeccionValues {
  posicion: string
  nombre: string
  cursoId: string
  curso?: Curso
}

export interface ClaseValues {
  nombre: string
  duracion: string
  posicion: string
  seccionId: string
  seccion?: SeccionValues
}

export interface ClaseValuesModificate {
  nombre: string
  duracion: string
  posicion: string
  url_video?: string
  seccionId: string
}

// PRODUCTOS
export interface productosValuesModificate {
  nombre: string
  categoriaId: string
  precio: string
  horas: number
}

// UPDATE-CREATE
export interface segundaSeccionValuesModificate {
  titulo: string
  descripcion: string
}

export interface valoresValues {
  titulo: string
}

export interface mapaValues {
  mapa: string
  mapa2: string
}

export interface editorValues {
  content: string
  setContent: React.Dispatch<React.SetStateAction<string>>
}

export interface arrayValues {
  id: number | null
  medida: string
  precio: string
  cantidad: string
  oferta: string
}

// PRODUCTOS
export interface productosValues {
  id: string
  nombre: string
  categoriaId: number
  imagen: string
  precio: string
  categoria: categoriasValues
  detalles: CursoDetalles
  createdAt: string | null
  updatedAt: string | null
}

export interface CursoDetalles {
  id: string
  cursoId: string
  presentacion?: string
  dirigido?: string
  metodologia?: string
  objetivo?: string
  certificacion?: string
  createdAt?: Date
  updatedAt?: Date
  curso?: productosValues
}

export interface CuponValues {
  id: string
  codigo: string
  tipoDescuento: 'porcentaje' | 'montoFijo'
  porcentajeDescuento?: number
  montoDescuento?: number
  validoDesde: string
  validoHasta: string
  maximoUsos: number
  usosActuales: number
  valorMinimoPedido: number
  estaActivo: boolean
}
