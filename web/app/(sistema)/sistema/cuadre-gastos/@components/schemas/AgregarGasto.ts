import * as yup from "yup";
export const agregarGastoSchema = yup.object().shape({
  fecha: yup.string().required("La fecha es obligatoria"),
  descripcion: yup.string().required("La descripción es obligatoria"),
  monto: yup
    .number()
    .typeError("El monto debe ser un número")
    .required("El monto es obligatorio"),
  referencia: yup.string().nullable(),
  tipoMoneda: yup
    .string()
    .oneOf(["PEN", "USD"], "Moneda no válida")
    .required("La moneda es obligatoria"),
  clase: yup.string().nullable(),
  concepto: yup.string().nullable(),
});
