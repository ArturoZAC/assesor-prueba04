export interface LoginInterface {
  email: string;
  password: string;
}

export type UserInterface = {
  id: string;
  email: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  celular: string;
  rol?: RolesInterface;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface RolesInterface {
  id: number;
  nombre: string;
  createdAt: Date;
  updatedAt: Date;
}
