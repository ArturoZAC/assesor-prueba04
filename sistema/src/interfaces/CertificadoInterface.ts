import { type Curso } from './CursoInterface'
import { type Usuario } from './UserInterface'

export interface Certificado {
  id: string
  nombre: string
  emitido_en: Date
  url_archivo: string
  size: number
  type_mime: string

  usuarioId: string
  usuario: Usuario

  cursoId: string
  curso: Curso

  createdAt: Date
  updatedAt: Date
}

export interface CertificadoModificate {
  nombre: string
  emitido_en: Date

}
