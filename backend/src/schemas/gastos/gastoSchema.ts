import { z } from "zod";
export const agregarGastoSchema = z.object({
  fecha: z.coerce.string({
    required_error: "La fecha es obligatoria",
    invalid_type_error: "La fecha es obligatoria",
  }),
  descripcion: z.string({
    required_error: "La descripción es obligatoria",
  }),
  monto: z.coerce.number({
    required_error: "El monto es obligatorio",
    invalid_type_error: "El monto debe ser un número",
  }),
  referencia: z.string().nullable(),
  tipoMoneda: z.enum(["PEN", "USD"], {
    invalid_type_error: "Moneda no válida",
    required_error: "La moneda es obligatoria",
  }),
  clase: z.string().nullable(),
  concepto: z.string().nullable(),
});
