import * as yup from 'yup'

export const EditarLeasingSchema = yup.object().shape({
  usuarioId: yup.string().required('El información del cliente es obligatorio')
})