import * as yup from "yup";

export const AgregarPrestamoSchema = yup.object().shape({
  usuarioId: yup.string().required("El cliente o titular es requerido"),
  capital_soles: yup.number().optional(),
  capital_dolares: yup.number().optional(),
  moneda: yup.string().required("El tipo de Moneda Requerido"),
  tasa: yup.number().required("La tasa es requerida"),
  fechaInicial: yup
    .string()
    .required("La fecha inicial es requerida")
    .test("fechaInicial-mayor-o-igual", "La fecha inicial no debe ser menor que la fecha de devolución", function (value) {
      const { devolucion } = this.parent;
      if (!value || !devolucion) return true; // Evita errores si aún no están completos
      return new Date(value) <= new Date(devolucion);
    }),
  devolucion: yup
    .string()
    .required("La fecha de la devolución es requerida"),
  dias: yup.number().required("Los días de la devolución es requerido"),
  tc: yup.number().required("El TC es requerido"),
  cuadre: yup.string().optional(),
  factura: yup.string().optional(),
  tipo: yup.string().required("El tipo de documento es requerido")
});