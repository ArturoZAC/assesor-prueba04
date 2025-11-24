import { z } from "zod";

export const cuadreOperacionSchema = z.object({
  operacionId: z.number().int().positive(),

  fecha_usd: z.string(),
  descripcion_op_usd: z.string().max(500),
  monto_usd: z.number(),
  referencia_usd: z.string().max(500).nullable(),
  diferencia_usd: z.number(),

  fecha_pen: z.string(),
  descripcion_op_pen: z.string().max(500),
  monto_pen: z.number(),
  referencia_pen: z.string().max(500),
  diferencia_pen: z.number(),
});

export const editarCuadreOperacionSchema = z.object({
  fecha_usd: z.string(),
  descripcion_op_usd: z.string().max(500),
  monto_usd: z.number(),
  referencia_usd: z.string().max(500),
  diferencia_usd: z.number(),

  fecha_pen: z.string(),
  descripcion_op_pen: z.string().max(500),
  monto_pen: z.number(),
  referencia_pen: z.string().max(500).nullable(),
  diferencia_pen: z.number(),
});

export const agregarCuadreOperacionDolarSchema = z.object({
  fecha_usd: z.string(),
  descripcion_op_usd: z.string().max(500),
  monto_usd: z.number(),
  referencia_usd: z.string().max(500),
  diferencia_usd: z.number(),
});

export const agregarCuadreOperacionSolesSchema = z.object({
  fecha_pen: z.string(),
  descripcion_op_pen: z.string().max(500),
  monto_pen: z.number(),
  referencia_pen: z.string().max(500).nullable(),
  diferencia_pen: z.number(),
});
