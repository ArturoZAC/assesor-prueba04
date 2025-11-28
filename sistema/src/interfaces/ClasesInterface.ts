import { type MaterialesInterface } from './MaterialesInterface'
import { type SeccionInterface } from './SeccionInterface'
import { type TestInterface } from './TestInterface'

export interface ClasesInterface {
  id: string
  nombre: string
  duracion: string
  posicion: number
  url_video: string
  seccionId: string
  createdAt?: Date
  updatedAt?: Date
  seccion?: SeccionInterface
  test?: TestInterface[]
  materiales?: MaterialesInterface[]
}
