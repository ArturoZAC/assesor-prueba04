import * as yup from "yup";

export const EditarPrestamoSchema = yup.object().shape({
  documento: yup.string().required("El cliente o titular es requerido"),
  capital_soles: yup.number().optional(),
  capital_dolares: yup.number().optional(),
  moneda: yup.string().required("El tipo de Moneda Requerido"),
  tasa: yup.number().required("Requerido"),
  devolucion: yup.string().required("La fecha de la devolución es requerida"),
  dias: yup.number().required("Los días de la devolución es requerido"),
  tc: yup.number().required("El TC es requerido"),
  cuadre: yup.string().optional(),
  factura: yup.string().optional(),
  tipo: yup.string().required("El tipo de documento es requerido")
});