import { type Categoria } from './CategoriaInterface'
import { type SeccionInterface } from './SeccionInterface'
import { type TestInterface } from './TestInterface'
import { type Usuario } from './UserInterface'

export interface Curso {
  id?: string
  nombre: string
  precio: number
  horas: number
  imagen: string
  banner: string
  categoriaId: number
  presentacion: string
  dirigido: string
  metodologia: string
  certificacion: string
  categoria?: Categoria
  createdAt?: Date
  updatedAt?: Date
  Seccion: SeccionInterface[]
  test: TestInterface[]
  cursosUsuarios: CursosUsuarios[]
}

export interface CursosUsuarios {
  id: number
  avance: string
  cursoId: string
  tipo: string
  userId: string
  usuario?: Usuario
  curso?: Curso
}
