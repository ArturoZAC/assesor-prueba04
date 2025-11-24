export interface Usuario {
  id?: string
  nombres: string
  apellidos: string
  email: string
  password: string
  celular: string
  rolId: number
  createdAt?: Date
  updatedAt?: Date
  rol?: Rol
}

export interface Rol {
  id?: number
  nombre: string
  createdAt?: Date
  updatedAt?: Date
  // usuario: Usuario
}
