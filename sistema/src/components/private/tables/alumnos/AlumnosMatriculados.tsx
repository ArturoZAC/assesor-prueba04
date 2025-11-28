import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { Loading } from '../../../shared/Loading'
import { Paginacion } from '../../../shared/Paginacion'
import { type CursosUsuarios } from '../../../../interfaces/CursoInterface'
import AlumnosMatriculadosColumna from './AlumnosMatriculadosColumna'

interface Root {
  alumnos: CursosUsuarios[]
}

export default function AlumnosMatriculados (): JSX.Element {
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const [alumnos, setAlumnos] = useState<CursosUsuarios[]>([])
  const { setTitle, loadingComponents, setLoadingComponents } = useAuth()
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [paginaActual, setpaginaActual] = useState(1)
  const [cantidadRegistros] = useState(4)

  const getAlumnos = async (): Promise<void> => {
    try {
      setLoadingComponents(true)
      const { data } = await axios.get<Root>(`${Global.url}/alumno/matriculado/${id ?? ''}`, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''
            }`
        }
      })
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

  const filterDate = (): CursosUsuarios[] => {
    return alumnos.slice(indexOfFirstPost, indexOfLastPost).flatMap(cursoUs => cursoUs.curso?.cursosUsuarios ?? [] as CursosUsuarios[]) ?? [] as CursosUsuarios[]
  }
  console.log(filterDate())
  useEffect(() => {
    setTitle('Listado de alumnos')
    getAlumnos()
  }, [])

  return (
    <>
      {loadingComponents
        ? (
          <Loading />)
        : (
          <div className="bg-secondary-100 p-8 rounded-xl mt-4">
            <div className="hidden md:grid grid-cols-1 md:grid-cols-6 gap-4 mb-10 p-4">
              <h5 className="md:text-center">Código</h5>
              <h5 className="md:text-center">Nombres</h5>
              <h5 className="md:text-center">Apellidos</h5>
              <h5 className="md:text-center">Email</h5>
              <h5 className="md:text-center">Celular</h5>
              <h5 className="md:text-center">Fecha de Matricula</h5>

            </div>
            {filterDate().map((alum: CursosUsuarios) => (
              <AlumnosMatriculadosColumna key={alum.id} alum={alum} />
            ))}

            <div className="flex flex-col md:flex-row gap-5 md:gap-0 justify-between content_buttons ">
              <p className="text-md ml-1"> {totalRegistros} Registros </p>
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
