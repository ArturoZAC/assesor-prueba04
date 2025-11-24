import * as Yup from "yup";
export const AgregarCuadreOperacionSchema = Yup.object().shape({
  fecha_usd: Yup.date().required("La fecha USD es obligatoria"),
  descripcion_op_usd: Yup.string().required(
    "La descripción USD es obligatoria"
  ),
  monto_usd: Yup.number()
    .typeError("Debe ser un número")
    .required("El monto USD es obligatorio"),
  referencia_usd: Yup.string().nullable(),
  diferencia_usd: Yup.number()
    .typeError("Debe ser un número")
    .required("La diferencia USD es obligatoria"),

  fecha_pen: Yup.date().required("La fecha PEN es obligatoria"),
  descripcion_op_pen: Yup.string().required(
    "La descripción PEN es obligatoria"
  ),
  monto_pen: Yup.number()
    .typeError("Debe ser un número")
    .required("El monto PEN es obligatorio"),
  referencia_pen: Yup.string().nullable(),
  diferencia_pen: Yup.number()
    .typeError("Debe ser un número")
    .required("La diferencia PEN es obligatoria"),
});

export const AgregarCuadreDolaresSchema = Yup.object().shape({
  fecha_usd: Yup.string().required("La fecha USD es obligatoria"),
  descripcion_op_usd: Yup.string().required(
    "La descripción USD es obligatoria"
  ),
  monto_usd: Yup.number()
    .typeError("Debe ser un número")
    .required("El monto USD es obligatorio"),
  referencia_usd: Yup.string().nullable(),
  diferencia_usd: Yup.number()
    .typeError("Debe ser un número")
    .required("La diferencia USD es obligatoria"),
});

export const AgregarCuadreSolesSchema = Yup.object().shape({
  fecha_pen: Yup.string().required("La fecha PEN es obligatoria"),
  descripcion_op_pen: Yup.string().required(
    "La descripción PEN es obligatoria"
  ),
  monto_pen: Yup.number()
    .typeError("Debe ser un número")
    .required("El monto PEN es obligatorio"),
  referencia_pen: Yup.string().nullable(),
  diferencia_pen: Yup.number()
    .typeError("Debe ser un número")
    .required("La diferencia PEN es obligatoria"),
});
