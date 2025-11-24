import { z } from "zod";

export const registerSchema = z.object({
  nombres: z.string({
    required_error: "Nombres requeridos",
  }),
  apellidos: z.string({
    required_error: "Apellidos requeridos",
  }),
  celular: z
    .string({
      required_error: "Celular requerido",
    })
    .min(6, {
      message: "El celular debe tener mínimo 6 caracteres",
    })
    .max(15, {
      message: "El celular tiene un máximo de 15 caracteres",
    }),
  email: z
    .string({
      required_error: "Correo electrónico requerido",
    })
    .email({
      message: "Correo inválido",
    }),
  password: z
    .string({
      required_error: "Contraseña requerida",
    })
    .min(8, {
      message: "La contraseña debe tener mínimo 8 caracteres",
    }),
});

export const loginSchema = z.object({
  email: z.string({
    required_error: "El correo es requreido",
  }),
  password: z.string({
    required_error: "La contraseña es requerida",
  }),
});

export const recuperarSchema = z.object({
  email: z.string({
    required_error: "El correo es requreido",
  }),
});

export const cambiarContrasenaSchema = z.object({
  token: z.string({
    required_error: "Token requerido",
  }),
  newPassword: z.string({
    required_error: "La contraseña es requerida",
  }),
});
