import { type ClaseValues } from '../components/shared/Interfaces'
import { type Usuario } from './UserInterface'

export interface Comentario {
  id: string
  userId: string
  claseId: string
  comentario: string
  estado: string
  createdAt: Date
  updatedAt: Date
  clase: ClaseValues
  usuario: Usuario
}

export interface RespuestaComentario {
  id: string
  userId: string
  comentarioId: string
  respuesta: string
  createdAt: Date
  updatedAt: Date
  user: Usuario
  comentario: Comentario
}

export interface RespuestaComentarioModificate {
  respuesta: string
}
