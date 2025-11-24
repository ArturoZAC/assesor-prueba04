import * as Yup from 'yup'

export const SchemaBrief = Yup.object().shape({
  nombres: Yup.string().required('Este campo es requerido').min(1),
  email: Yup.string()
    .email('Email invalido')
    .required('Este campo es requerido'),
  celular: Yup.string()
    .required('Este campo es requerido')
    .min(9, 'El numero debe tener 9 digitos')
    .max(9, 'El numero debe tener 9 digitos')
})
// CATEGORIAS
export const SchemaCategorias = Yup.object().shape({
  nombre: Yup.string().required('Este campo es requerido').min(1)
})

export const SchemaBeneficio = Yup.object().shape({
  texto: Yup.string()
    .required('El campo texto es obligatorio')
    .min(3, 'Debe tener al menos 3 caracteres')
    .max(500, 'No puede superar los 500 caracteres'),
  cursoId: Yup.string().required('El cursoId es obligatorio')
})

export const SchemaDistritos = Yup.object().shape({
  nombre: Yup.string().required('Este campo es requerido').min(1),
  id_departamento: Yup.string().required('Este campo es requerido').min(1),
  precio: Yup.string().required('Este campo es requerido').min(1)
})

export const tipoCambioSchema = Yup.object().shape({
  precioCompra: Yup.number()
    .typeError('El precio de compra debe ser un número')
    .positive('El precio de compra debe ser mayor que cero')
    .max(9999.9999, 'El precio de compra no puede exceder 9999.9999')
    .required('El precio de compra es obligatorio'),
  precioVenta: Yup.number()
    .typeError('El precio de venta debe ser un número')
    .positive('El precio de venta debe ser mayor que cero')
    .max(9999.9999, 'El precio de venta no puede exceder 9999.9999')
    .required('El precio de venta es obligatorio')
})

// PRODUCTOS
export const ScheamaProductos = Yup.object().shape({
  categoriaId: Yup.number().required('El campo es requerido'),
  nombre: Yup.string().required('El campo es requerido'),
  precio: Yup.number()
    .required('El campo es requerido')
    .positive('El valor no puede ser negativo'),
  horas: Yup.number().required('El campo es requerido')
})

// PRIMERASECCION
export const ScheamaPrimeraSeccion = Yup.object().shape({
  nombre: Yup.string().required('El campo es requerido'),
  descripcion: Yup.string().required('El campo es requerido')
})

// SEGUNDA SECCION
export const ScheamaSegundaSeccion = Yup.object().shape({
  titulo: Yup.string().required('El campo es requerido'),
  descripcion: Yup.string().required('El campo es requerido')
})

// VALORES
export const ScheamaValores = Yup.object().shape({
  titulo: Yup.string().required('El campo es requerido')
})

// VALORES
export const SchemaValores = Yup.object().shape({
  mapa: Yup.string().required('El campo es requerido'),
  mapa2: Yup.string().required('El campo es requerido')
})

// CONFIGURACION
export const SchemaConfiguracion = Yup.object().shape({
  telefono: Yup.number().required('El campo es requerido'),
  celular1: Yup.number().required('El campo es requerido'),
  celular2: Yup.number().nullable(),
  correo1: Yup.string()
    .email('Digite un email valido')
    .required('El campo es requerido'),
  correo2: Yup.string().email('Digite un email valido').nullable(),
  horario1: Yup.string().required('El campo es requerido'),
  horario2: Yup.string().required('El campo es requerido'),
  direccion: Yup.string().required('El campo es requerido'),
  facebook: Yup.string().nullable(),
  instagram: Yup.string().nullable(),
  twiter: Yup.string().nullable(),
  linkedin: Yup.string().nullable(),
  youtube: Yup.string().nullable(),
  whatsapp: Yup.string().nullable()
})

// VALORES

export const ProfesorSchema = Yup.object().shape({
  nombres: Yup.string().required('El campo es requerido'),
  apellidos: Yup.string().required('El campo es requerido'),
  email: Yup.string()
    .email('Email invalido')
    .required('Este campo es requerido'),
  celular: Yup.string()
    .required('Este campo es requerido')
    .min(9, 'El numero debe tener 9 digitos')
    .max(9, 'El numero debe tener 9 digitos'),
  password: Yup.string().required('El campo es requerido')
})

export const ProfesorEditSchema = Yup.object().shape({
  nombres: Yup.string().required('El campo es requerido'),
  apellidos: Yup.string().required('El campo es requerido'),
  email: Yup.string()
    .email('Email invalido')
    .required('Este campo es requerido'),
  celular: Yup.string()
    .required('Este campo es requerido')
    .min(9, 'El numero debe tener 9 digitos')
    .max(9, 'El numero debe tener 9 digitos')
})
// TRANSACCIONES

export const SchemaTransacciones = Yup.object().shape({
  estado: Yup.number().required('El campo es requerido')
})

export const cuponSchema = Yup.object().shape({
  codigo: Yup.string()
    .required('El código del cupón es obligatorio')
    .min(3, 'El código debe tener al menos 3 caracteres'),

  tipoDescuento: Yup.string()
    .required('Debes seleccionar el tipo de descuento')
    .oneOf(['porcentaje', 'montoFijo'], 'El tipo de descuento no es válido'),

  // Validación condicional personalizada para porcentaje de descuento
  porcentajeDescuento: Yup.number()
    .nullable() // Permite que el valor sea null
    .transform((value, originalValue) => {
      // Asegúrate de que originalValue sea una cadena antes de aplicar trim
      const strValue = originalValue ? originalValue.toString() : ''
      return strValue.trim() === '' ? null : value
    }) // Convierte strings vacíos a null
    .test(
      'isValidPorcentaje',
      'El porcentaje de descuento es obligatorio si seleccionas "Porcentaje"',
      function (value) {
        const { tipoDescuento } = this.parent
        if (tipoDescuento === 'porcentaje') {
          return (
            value !== null && value !== undefined && value > 0 && value <= 100
          )
        }
        return true // No se requiere validación si no es "porcentaje"
      }
    )
    .typeError('Debe ser un número válido'),

  // Validación condicional personalizada para monto fijo de descuento
  montoDescuento: Yup.number()
    .nullable() // Permite que el valor sea null
    .transform((value, originalValue) => {
      // Asegúrate de que originalValue sea una cadena antes de aplicar trim
      const strValue = originalValue ? originalValue.toString() : ''
      return strValue.trim() === '' ? null : value
    }) // Convierte strings vacíos a null
    .test(
      'isValidMonto',
      'El monto de descuento es obligatorio si seleccionas "Monto Fijo"',
      function (value) {
        const { tipoDescuento } = this.parent
        if (tipoDescuento === 'montoFijo') {
          return value !== null && value !== undefined && value > 0
        }
        return true // No se requiere validación si no es "montoFijo"
      }
    )
    .typeError('Debe ser un número válido'),

  validoDesde: Yup.date()
    .required('La fecha de inicio es obligatoria')
    .typeError('La fecha de inicio debe ser válida'),

  validoHasta: Yup.date()
    .required('La fecha de expiración es obligatoria')
    .min(
      Yup.ref('validoDesde'),
      'La fecha de expiración debe ser posterior a la fecha de inicio'
    )
    .typeError('La fecha de expiración debe ser válida'),

  maximoUsos: Yup.number()
    .required('El número máximo de usos es obligatorio')
    .min(1, 'Debe permitir al menos 1 uso')
    .typeError('Debe ser un número válido'),

  valorMinimoPedido: Yup.number()
    .nullable() // Permite null o vacío
    .min(0, 'El valor mínimo debe ser mayor o igual a 0')
    .typeError('Debe ser un número válido')
})
