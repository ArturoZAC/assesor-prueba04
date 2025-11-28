import { type CursosUsuarios } from './CursoInterface'
import { type Rol } from './UserInterface'

export interface ProfesorInterface {
  id?: string
  nombres: string
  apellidos: string
  email: string
  celular: string
  password: string
  rolId?: number
  rol?: Rol
  createdAt?: Date
  updatedAt?: Date
  cursosUsuarios?: CursosUsuarios
}
