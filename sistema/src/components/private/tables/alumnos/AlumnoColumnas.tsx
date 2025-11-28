import React, { useContext } from 'react'
import { type Usuario } from '../../../../interfaces/UserInterface'
import { DeleteItems } from '../../../shared/DeleteItems'
import { ModalContext } from '../../../../context/ModalProvider'
import { useNavigate } from 'react-router-dom'
import { Button, Menu, MenuItem } from '@mui/material'
import { IoMdSettings } from 'react-icons/io'
import { VerAlumno } from './VerAlumno'

function formatTitle (title: string): string {
  if (!title) return title // Manejar cadenas vacías o nulas
  return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()
}

export function AlumnoColumnas ({ alum, token, getAlumnos, totalPosts, cantidadRegistros, paginaActual, setpaginaActual }: { alum: Usuario, token: string, getAlumnos: () => Promise<void>, totalPosts: number, cantidadRegistros: number, paginaActual: number, setpaginaActual: (pagina: number) => void }): JSX.Element {
  const { setModalContent } = useContext(ModalContext)
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = (): void => {
    setAnchorEl(null)
  }
  const handleEditar = (): void => {
    navigate(`/admin/alumnos/editar/${alum.id ?? ''}`)
  }

  const preguntar = (id: string): void => {
    DeleteItems({
      ruta: 'borrarAlumno',
      id,
      token,
      getData: getAlumnos,
      totalPosts,
      cantidadRegistros,
      paginaActual,
      setpaginaActual
    })
  }
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center mb-4 bg-secondary-900 p-4 rounded-xl"
    >
      <div className="md:text-center">
        <h5 className="md:hidden text-white font-bold mb-2">Código</h5>
        <span>{alum.id}</span>
      </div>
      <div className="md:text-center">
        <h5 className="md:hidden text-white font-bold mb-2">
          Nombres
        </h5>
        <span>
          {alum.nombres}
        </span>
      </div>

      <div className="md:text-center">
        <h5 className="md:hidden text-white font-bold mb-2">
          Apellidos
        </h5>
        <span>
          {alum.apellidos}
        </span>
      </div>

      <div className="md:text-center">
        <h5 className="md:hidden text-white font-bold mb-2">
          Email
        </h5>
        <span>
          {alum.email}
        </span>
      </div>

      <div className="md:text-center">
        <h5 className="md:hidden text-white font-bold mb-2">
          Rol
        </h5>
        <span className=''>
          {formatTitle(alum.rol?.nombre ?? '')}
        </span>
      </div>

      <div className="md:text-center">
        <h5 className="md:hidden text-white font-bold mb-2">
          Acciones
        </h5>
        <Button
          id="basic-menu"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <IoMdSettings color='gray' size={25} />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          aria-labelledby="basic-menu"
          MenuListProps={{
            'aria-labelledby': 'basic-button'
          }}
          sx={{
            '& .MuiMenuItem-root': {
              backgroundColor: '#202020 !important',
              color: 'white',
              '&:hover': {
                backgroundColor: 'white',
                color: 'black'
              }
            },
            '.css-6hp17o-MuiList-root-MuiMenu-list': {
              backgroundColor: '#202020 !important'
            }
          }}
        >
          <MenuItem onClick={() => { setModalContent({ title: 'Datos del Alumno', content: <VerAlumno alum={alum} /> }) }}>Ver</MenuItem>
          <MenuItem onClick={handleEditar}>Editar</MenuItem>
          <MenuItem onClick={() => { preguntar(alum.id ?? '') }}>Eliminar</MenuItem>
          <MenuItem >Ver cursos matriculados</MenuItem>
        </Menu>
      </div>

    </div>
  )
}