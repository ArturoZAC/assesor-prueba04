import * as yup from "yup";
export const registroOperacionSchema = yup.object({
  // Operaciones
  fecha: yup.date().required("La fecha es obligatoria"),
  usuarioId: yup.string().required("El cliente es obligatorio"),
  tipo: yup
    .mixed<"COMPRA" | "VENTA">()
    .oneOf(["COMPRA", "VENTA"], "Tipo inválido")
    .required("El tipo es obligatorio"),
  dolares: yup
    .number()
    .positive("Debe ser un valor positivo")
    .required("El monto en dólares es obligatorio"),

  compra: yup.number().required("Compra es obligatoria"),
  venta: yup.number().required("Venta es obligatoria"),
  spread: yup.number().required("Spread es obligatorio"),
  promedio: yup.number().required("Promedio es obligatorio"),

  montoUSD: yup.number().required("Monto en USD es obligatorio"),
  montoPEN: yup.number().required("Monto en PEN es obligatorio"),

  movimiento_compraUSD: yup.number().required("Compra USD es obligatoria"),
  movimiento_ventaUSD: yup.number().required("Venta USD es obligatoria"),
});

export const editarRegistroOperacionSchema = yup.object({
  fecha: yup.date().required("La fecha es obligatoria"),
  tipo: yup
    .mixed<"COMPRA" | "VENTA">()
    .oneOf(["COMPRA", "VENTA"], "Tipo inválido")
    .required("El tipo es obligatorio"),
  dolares: yup
    .number()
    .positive("Debe ser un valor positivo")
    .required("El monto en dólares es obligatorio"),

  compra: yup.number().required("Compra es obligatoria"),
  venta: yup.number().required("Venta es obligatoria"),
});
