import { type Curso } from './CursoInterface'
import { type Usuario } from './UserInterface'

export interface DetallesVentas {
  id: string
  ventaId: string
  productoId: string
  cantidad: number
  precio: string
  venta?: Ventas
  curso?: Curso
}

export interface Ventas {
  id: string
  usuarioId: string
  pedidoMercadoId: string
  fecha_aprobada: Date
  estado: string
  estado_detalle: string
  total_neto: string
  total: string
  ultimo_caracteres: string
  usuario?: Usuario
  detalles?: DetallesVentas[]
}
