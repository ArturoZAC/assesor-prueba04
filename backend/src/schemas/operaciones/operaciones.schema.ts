import { z } from "zod";

export const agregarOperacionSchema = z.object({
  fecha: z.coerce.date({
    required_error: "La fecha es obligatoria",
    invalid_type_error: "La fecha no tiene un formato válido",
  }),

  tipo: z.enum(["COMPRA", "VENTA"], {
    required_error: "El tipo de operación es obligatorio",
    invalid_type_error: "Tipo de operación no válido",
  }),

  dolares: z
    .number({
      required_error: "El monto en dólares es obligatorio",
      invalid_type_error: "Debe ser un número válido",
    })
    .positive("El monto en dólares debe ser mayor a 0"),

  usuarioId: z.string({
    required_error: "El ID del cliente es obligatorio",
  }),

  compra: z.number({ invalid_type_error: "Debe ser un número" }),
  venta: z.number({ invalid_type_error: "Debe ser un número" }),
  spread: z.number({ invalid_type_error: "Debe ser un número" }),
  promedio: z.number({ invalid_type_error: "Debe ser un número" }),
  montoUSD: z.number({ invalid_type_error: "Debe ser un número" }),
  montoPEN: z.number({ invalid_type_error: "Debe ser un número" }),
  compraUSD: z.number({ invalid_type_error: "Debe ser un número" }),
  ventaUSD: z.number({ invalid_type_error: "Debe ser un número" }),
});

export const editarOperacionSchema = z.object({
  fecha: z.coerce.date({
    required_error: "La fecha es obligatoria",
    invalid_type_error: "La fecha no tiene un formato válido",
  }),

  tipo: z.enum(["COMPRA", "VENTA"], {
    required_error: "El tipo de operación es obligatorio",
    invalid_type_error: "Tipo de operación no válido",
  }),

  compra: z.number({ invalid_type_error: "Debe ser un número" }),
  venta: z.number({ invalid_type_error: "Debe ser un número" }),
});
