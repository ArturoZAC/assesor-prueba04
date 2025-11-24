import * as yup from 'yup';

export const AgregarCuadreLeasingSchema = yup.object().shape({
  depositoDet: yup.string().required(),
  pagadoDet: yup.number().required().min(0, 'El pago de detracción no puede ser negativo'),
  pagado: yup.number().required().min(0, 'El pago no puede ser negativo'),
  tcDet: yup.number().optional(),
  tc: yup.number().optional(),
  referencia: yup.string().optional(),
  referenciaDet: yup.number().optional(),
  diferencia: yup.number().required(),
  diferenciaDet: yup.number().required(),
  montoFinal: yup.number().required().min(0, 'El monto final no puede ser negativo'),
  montoFinalDet: yup.number().required().min(0, 'El monto final de detracción no puede ser negativo'),
  fecha: yup.string().required(),
});
