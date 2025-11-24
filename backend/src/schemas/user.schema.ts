import { z } from "zod";

export const cambiarContrasenaPerfilSchema = z
  .object({
    newPassword: z
      .string({ required_error: "La nueva contraseña es requerida" })
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmNewPassword: z.string({
      required_error: "La confirmación de contraseña es requerida",
    }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmNewPassword"],
  });
