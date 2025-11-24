import { Usuario } from "../../../../interfaces/UserInterface";
import { parseDate } from "../../../../logic/parseDate";

export function VerAlumno ({ alum }: {alum: Usuario }) {
  return (
      <div className="space-y-4">
        <div>
          <h3 className='font-bold'>Nombres</h3>
          <p className='font-medium'>{alum.nombres}</p>
        </div>
        <div>
          <h3 className='font-bold'>Apellidos</h3>
          <p className='font-medium'>{alum.apellidos}</p>
        </div>
        <div>
          <h3 className='font-bold'>Email</h3>
          <p className='font-medium'>{alum.email}</p>
        </div>
        <div>
          <h3 className='font-bold'>Rol</h3>
          <p className='font-medium'>{alum.rol?.nombre ?? ''}</p>
        </div>
        <div>
          <h3 className='font-bold'>Fecha de Registro al Sistema</h3>
          <p className='font-medium'>{parseDate(alum.createdAt ?? new Date())}</p>
        </div>
        <div>
          <h3 className='font-bold'>Fecha de Última Modificación</h3>
          <p className='font-medium'>{parseDate(alum.updatedAt ?? new Date())}</p>
        </div>
      </div>
    )
}