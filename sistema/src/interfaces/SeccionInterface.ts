import { type ClasesInterface } from './ClasesInterface'
import { type Curso } from './CursoInterface'

export interface SeccionInterface {
  id: string
  nombre: string
  posicion: number
  curso: Curso
  cursoId: string
  clases?: ClasesInterface[]
  createdAt?: Date
  updatedAt?: Date
}
