import * as Yup from 'yup';

export const CuadreFacturacionSchema = Yup.object().shape({
  facturacionId: Yup.string()
    .required('El ID de facturación es requerido'),

  fechaCuadre: Yup.string()
    .required('La fecha del cuadre es requerida'),

  docCuadre: Yup.string()
    .required('El tipo de documento del cuadre es requerido')
    .oneOf(['BOL', 'FAC', 'NCR'], 'El tipo de documento debe ser BOL o FAC'),

  clienteCuadre: Yup.string()
    .required('El cliente del cuadre es requerido'),

  rucCuadre: Yup.string()
    .required('El RUC del cuadre es requerido'),

  subtotalCuadre: Yup.number()
    .required('El subtotal del cuadre es requerido')
    .typeError('El subtotal debe ser un número') // Ensure it's a number
    .min(0, 'El subtotal no puede ser negativo'), // Add minimum value validation

  igvCuadre: Yup.number()
    .nullable()
    .typeError('El IGV debe ser un número')
    .min(0, 'El IGV no puede ser negativo'),
});