import * as yup from "yup";
export const AgregarClienteSchema = yup.object({
  vigente: yup.string().nullable().required("Vigente es requerido"), 
  documento: yup.string().nullable().required("Documento es requerido"),
  apellido_paterno: yup
    .string()
    .nullable()
    .required("Apellido paterno es requerido"),
  apellido_materno: yup.string().when("tipo_cliente", {
    is: "Persona Natural",
    then: (schema) =>
      schema.required("Apellido materno es requerido para Persona Natural"),
    otherwise: (schema) => schema.optional(),
  }),
  nombres: yup.string().nullable(),
  tipo_cliente: yup
    .string()
    .oneOf(["persona_natural", "persona_juridica"])
    .nullable()
    .required("Tipo de cliente es requerido"),
  departamento: yup.string().nullable().required("Departamento es requerido"),
  provincia: yup.string().nullable().required("Provincia es requerida"),
  distrito: yup.string().nullable().required("Distrito es requerido"),
  telefono: yup.string().nullable().optional(),
  apellido_paterno_apo: yup
    .string()
    .nullable()
    .required("Apellido paterno del apoderado es requerido"),
  apellido_materno_apo: yup
    .string()
    .nullable()
    .required("Apellido materno del apoderado es requerido"),
  nombres_apo: yup
    .string()
    .nullable()
    .required("Nombres del apoderado son requeridos"),
  tipo_documento: yup
    .string()
    .nullable()
    .required("Tipo de documento es requerido"),
  numero_documento: yup
    .string()
    .nullable()
    .required("Número de documento es requerido"),
  nacionalidad: yup.string().nullable().required("Nacionalidad es requerida"),
  cliente: yup.string().nullable().required("Cliente es requerido"),
  tipo_documento_cliente: yup
    .string()
    .nullable()
    .required("Tipo de documento del cliente es requerido"),
  cliente_2: yup.string().nullable().optional(),
  documento_2: yup.string().nullable().optional(),
  otro: yup.string().nullable().optional(),
  tercero: yup.string().nullable().optional(),
  tipo_tercero: yup.string().nullable().optional(),
  documento_tercero: yup.string().nullable().optional(),
  observacion: yup.string().nullable().optional(),
});
