import * as yup from 'yup'

export const AgregarLeasingSchema = yup.object().shape({
  usuarioId: yup.string().required('El ID de usuario es requerido'),
  documento: yup.string().required('El documento es requerido'),
  tipo_documento: yup.string().required('El tipo de documento es requerido'),
  codSer: yup.string().required('El código de servicio es requerido'),
  numero: yup.number().positive('La cantidad debe ser positivo').required('El número es requerido'),
  precio: yup.number().required('El precio es requerido').positive('El precio debe ser positivo'),
  fecha_inicial: yup.string().required('La fecha inicial es requerida'),
  fecha_final: yup.string()
    .required('La fecha final es requerida')
    .test(
      'is-greater',
      'La fecha final debe ser posterior a la fecha inicial',
      function (value) {
        const { fecha_inicial } = this.parent;
        if (!fecha_inicial || !value) return true; // Si alguna fecha no existe, la validación pasa (se manejará con el required)
        return new Date(value) > new Date(fecha_inicial);
      }
    ),
  tc: yup.number().required('El tipo de cambio es requerido').positive('El tipo de cambio debe ser positivo'),
  factura: yup.string().optional(),
  tipo: yup.string().oneOf(['BOLETA', 'FACTURA'], 'Debe ser BOLETA o FACTURA').optional(),
})