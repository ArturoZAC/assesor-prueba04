import { z } from "zod";

export const PrestamoOperacionSchema = z.object({
  id: z.number().int().positive().optional(),
  capital_soles: z
    .number({ invalid_type_error: "El capital en soles debe ser un número." })
    .optional()
    .nullable(),
  capital_dolares: z
    .number({ invalid_type_error: "El capital en dólares debe ser un número." })
    .optional()
    .nullable(),
  moneda: z.enum(["USD", "PEN"], {
    invalid_type_error: 'La moneda debe ser "US$" o "S/."',
    required_error: "La moneda es requerida.",
  }),
  tasa: z
    .number({ invalid_type_error: "La tasa debe ser un número." })
    .positive({ message: "La tasa debe ser un valor positivo." }),
  devolucion: z
    .string({
      invalid_type_error: "La devolución debe ser un texto.",
      required_error: "La devolución es requerida.",
    })
    .min(1, { message: "La devolución no puede estar vacía." })
    .max(20, { message: "La devolución no puede tener más de 20 caracteres." }),
  dias: z
    .number({ invalid_type_error: "Los días deben ser un número entero." })
    .int({ message: "Los días deben ser un número entero." })
    .positive({ message: "Los días deben ser un valor positivo." }),
  cuadre: z.string({ invalid_type_error: "El cuadre debe ser un texto." }).optional().nullable(),
  factura: z.string({ invalid_type_error: "La factura debe ser un texto." }).optional().nullable(),
  usuarioId: z
    .string({
      invalid_type_error: "El ID del usuario debe ser un texto.",
      required_error: "El ID del usuario es requerido.",
    })
    .min(1, { message: "El ID del usuario no puede estar vacío." }),
  tipo: z.string({
    invalid_type_error: "El tipo de factura o boleta debe ser un texto.",
    required_error: "El tipo de factura o boleta es requerido.",
  }),
});
