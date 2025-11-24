import axios from 'axios'
import Swal, { type SweetAlertResult } from 'sweetalert2'
import { Global } from '../../helper/Global'
import { type deleteValues } from './Interfaces'
import { toast } from 'sonner'

export const DeleteItems = ({
  ruta,
  id,
  token,
  getData,
  setpaginaActual
}: deleteValues): void => {
  Swal.fire({
    title: `¿Estás seguro de eliminar el registro N° ${id}?`,
    showDenyButton: true,
    confirmButtonText: 'Eliminar',
    denyButtonText: 'Cancelar'
  }).then(async (result: SweetAlertResult) => {
    if (result.isConfirmed) {
      try {
        const { data } = await axios.post(
          `${Global.url}/${ruta}/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${
                token !== null && token !== '' ? token : ''
              }`
            }
          }
        )

        console.log(data)
        if (data) {
          toast.success('Registro eliminado correctamente')
          getData()
          setpaginaActual(1)
        } else {
          toast.error('Error al eliminar el registro')
        }
      } catch (error: any) {
        console.log(error)
        let dataError = error.request.response
        if (dataError) {
          dataError = JSON.parse(dataError)
          console.log(dataError)
          if (dataError.message === 'Existe un producto relacionado') {
            toast.warning('Existe un producto relacionado con esta categoría')
          } else {
            toast.error('Error al eliminar el registro')
          }
        } else {
          toast.error('Error al eliminar el registro')
        }
      }
    }
  })
}
