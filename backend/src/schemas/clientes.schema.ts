import { z } from "zod";

export const AgregarClienteSchema = z
  .object({
    vigente: z
      .string()
      .nullable()
      .refine((val) => val?.trim(), {
        message: "Vigente es requerido",
      }),
    documento: z
      .string()
      .nullable()
      .refine((val) => val?.trim(), {
        message: "Documento es requerido",
      }),
    apellido_paterno: z
      .string()
      .nullable()
      .refine((val) => val?.trim(), {
        message: "Apellido paterno es requerido",
      }),
    apellido_materno: z.string().nullable().optional(),
    nombres: z
      .string()
      .nullable(),
    tipo_cliente: z
      .enum(["persona_natural", "persona_juridica"])
      .nullable()
      .refine((val) => val != null, {
        message: "Tipo de cliente es requerido",
      }),
   
    // email: z
    //   .string()
    //   .nullable()
    //   .refine((val) => val?.trim(), {
    //     message: "Correo es requerido",
    //   })
    //   .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    //     message: "Correo no válido",
    //   }),
    departamento: z
      .string()
      .nullable()
      .refine((val) => val?.trim(), {
        message: "Departamento es requerido",
      }),
    provincia: z
      .string()
      .nullable()
      .refine((val) => val?.trim(), {
        message: "Provincia es requerida",
      }),
    distrito: z
      .string()
      .nullable()
      .refine((val) => val?.trim(), {
        message: "Distrito es requerido",
      }),
    telefono: z.string().nullable().optional(),
    apellido_paterno_apo: z
      .string()
      .nullable()
      .refine((val) => val?.trim(), {
        message: "Apellido paterno del apoderado es requerido",
      }),
    apellido_materno_apo: z
      .string()
      .nullable()
      .refine((val) => val?.trim(), {
        message: "Apellido materno del apoderado es requerido",
      }),
    nombres_apo: z
      .string()
      .nullable()
      .refine((val) => val?.trim(), {
        message: "Nombres del apoderado son requeridos",
      }),
    tipo_documento: z
      .string()
      .nullable()
      .refine((val) => val?.trim(), {
        message: "Tipo de documento es requerido",
      }),
    numero_documento: z
      .string()
      .nullable()
      .refine((val) => val?.trim(), {
        message: "Número de documento es requerido",
      }),
    nacionalidad: z
      .string()
      .nullable()
      .refine((val) => val?.trim(), {
        message: "Nacionalidad es requerida",
      }),
    cliente: z
      .string()
      .nullable()
      .refine((val) => val?.trim(), {
        message: "Cliente es requerido",
      }),
    tipo_documento_cliente: z
      .string()
      .nullable()
      .refine((val) => val?.trim(), {
        message: "Tipo de documento del cliente es requerido",
      }),
    cliente2: z.string().nullable().optional(),
    documento2: z.string().nullable().optional(),
    otro: z.string().nullable().optional(),
    tercero: z.string().nullable().optional(),
    tipoTercero: z.string().nullable().optional(),
    documento_tercero: z.string().nullable().optional(),
    observacion: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.tipo_cliente === "persona_natural" &&
      (!data.apellido_materno || data.apellido_materno.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["apellidoMaterno"],
        message: "Apellido materno es requerido para Persona Natural",
      });
    }
  });
