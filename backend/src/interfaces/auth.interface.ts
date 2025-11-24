export interface RegisterRequest {
  nombres: string;
  apellidos: string;
  celular: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  mantenerConexion?: boolean;
}
