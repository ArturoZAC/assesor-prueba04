import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { useEffect, useState } from 'react'
import useAuth from '../../../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { type Usuario } from '../../../../interfaces/UserInterface'
import { Paginacion } from '../../../shared/Paginacion'
import { AlumnoColumnas } from './AlumnoColumnas'
import { Loading } from '../../../shared/Loading'

export function ListaAlumnos (): JSX.Element {
  const token = localStorage.getItem('token')
  const [alumnos, setAlumnos] = useState([])
  const { setTitle, loadingComponents, setLoadingComponents } = useAuth()
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [paginaActual, setpaginaActual] = useState(1)
  const [cantidadRegistros] = useState(4)
  const navigate = useNavigate()
  const [filtroEstado, setFiltroEstado] = useState<
  'todos' | 'aprobados' | 'desaprobados'
  >('todos')
  const getAlumnos = async (): Promise<void> => {
    try {
      setLoadingComponents(true)
      const { data } = await axios.get(`${Global.url}/alumnos`, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })
      console.log(data)
      setAlumnos(data.alumnos)
      setTotalRegistros(data.alumnos.length)
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingComponents(false)
    }
  }

  const indexOfLastPost = paginaActual * cantidadRegistros
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros
  const totalPosts = alumnos.length

  const filterDate = (): Usuario[] => {
    let alumnosFiltrados = [...alumnos]

    if (filtroEstado === 'aprobados') {
      alumnosFiltrados = alumnosFiltrados.filter((alumno: any) =>
        alumno.examenesResueltos?.[0]?.puntaje_final >= 14
      )
    } else if (filtroEstado === 'desaprobados') {
      alumnosFiltrados = alumnosFiltrados.filter((alumno: any) =>
        alumno.examenesResueltos?.[0]?.puntaje_final < 14
      )
    }

    return alumnosFiltrados.slice(indexOfFirstPost, indexOfLastPost)
  }

  useEffect(() => {
    setTitle('Listado de alumnos')
    getAlumnos()
  }, [])

  return (
    <>
      {loadingComponents
        ? (
        <Loading />
          )
        : (
        <div className="p-8 mt-4 bg-secondary-100 rounded-xl">
          <div className="flex gap-4 mb-4">
            <button
              className={`px-4 py-1 text-black rounded ${
                filtroEstado === 'todos' ? 'bg-main text-white' : 'bg-gray-200'
              }`}
              onClick={() => { setFiltroEstado('todos') }}
            >
              Todos
            </button>
            <button
              className={`px-4 py-1 text-black rounded ${
                filtroEstado === 'aprobados'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200'
              }`}
              onClick={() => { setFiltroEstado('aprobados') }}
            >
              Aprobados
            </button>
            <button
              className={`px-4 py-1 text-black rounded ${
                filtroEstado === 'desaprobados'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200'
              }`}
              onClick={() => { setFiltroEstado('desaprobados') }}
            >
              Desaprobados
            </button>
          </div>
          <div className="flex justify-end w-full">
            <button
              className="flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg bg-main hover:bg-main_dark w-fit"
              onClick={() => {
                navigate('/admin/alumnos/agregar')
              }}
            >
              Registrar Alumno
            </button>
          </div>
          <div className="hidden grid-cols-1 gap-4 p-4 mb-10 md:grid md:grid-cols-6">
            <h5 className="md:text-center">Código</h5>
            <h5 className="md:text-center">Nombres</h5>
            <h5 className="md:text-center">Apellidos</h5>
            <h5 className="md:text-center">Email</h5>
            <h5 className="md:text-center">Rol</h5>
            <h5 className="md:text-center">Acciones</h5>
          </div>
          {filterDate().map((alum: Usuario) => (
            <AlumnoColumnas
              key={alum.id}
              alum={alum}
              cantidadRegistros={cantidadRegistros}
              token={token ?? ''}
              getAlumnos={getAlumnos}
              totalPosts={totalPosts}
              paginaActual={paginaActual}
              setpaginaActual={setpaginaActual}
            />
          ))}

          <div className="flex flex-col justify-between gap-5 md:flex-row md:gap-0 content_buttons ">
            <p className="ml-1 text-md"> {totalRegistros} Registros </p>
            <Paginacion
              totalPosts={totalPosts}
              cantidadRegistros={cantidadRegistros}
              paginaActual={paginaActual}
              setpaginaActual={setpaginaActual}
            />
          </div>
        </div>
          )}
    </>
  )
}
