import { useEffect, useState } from 'react'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import useAuth from '../../../hooks/useAuth'
import axios from 'axios'
import { Global } from '../../../helper/Global'
import { Loading } from '../../shared/Loading'
import CardTicket from '../../shared/CardTicket'

const Home = (): JSX.Element => {
  const [mensaje, setMensaje] = useState('')
  const { auth, setTitle } = useAuth()
  const [categorias, setCategorias] = useState(0)
  const [productos, setProductos] = useState(0)
  const [promociones, setPromociones] = useState(0)
  const [loading, setLoading] = useState(false)

  const getAllCategories = async (): Promise<void> => {
    setLoading(true)
    const request = await axios.get(`${Global.url}/allCategorias`)
    setCategorias(request.data.length)
  }

  const getAllBanners = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/allBanners`)
    setPromociones(request.data.length)
  }

  const getALlProductos = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/allProductos`)
    setProductos(request.data.length)
    setLoading(false)
  }

  useEffect(() => {
    const fecha = new Date()
    const hora = fecha.getHours()

    if (hora >= 6 && hora < 12) {
      setMensaje('¡Buenos días!')
    } else if (hora >= 12 && hora < 20) {
      setMensaje('¡Buenas tardes!')
    } else {
      setMensaje('¡Buenas noches!')
    }
  }, [])

  useEffect(() => {
    setTitle('')
    getAllCategories()
    getAllBanners()
    getALlProductos()
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-10" >
        <h1 className="text-2xl md:text-4xl text-white">{mensaje}, {auth.nombres}!</h1>
      </div>
      {loading
        ? <Loading />
        : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {/* Card */}
          <CardTicket
            ticket="pending"
            totalTickets={productos}
            ruta="productos"
            tabla="Productos"
            dashboard="Productos"
            button="nuevo Producto"
            agregar="productos/agregar"
          />
          <CardTicket
            ticket="total"
            ruta="categorias"
            totalTickets={categorias}
            tabla="Categorias"
            dashboard="Productos"
            button="nueva Categoria"
            agregar="categorias/agregar"
          />
          <CardTicket
            ticket="inProcess"
            ruta="banners"
            totalTickets={promociones}
            tabla="Banners"
            dashboard="Productos"
            button="nuevo Banner"
            agregar="banners/agregar"
          />
          {/* <CardTicket
            ticket="inProcess"
            totalTickets="130,000"
            text="Tickets en proceso"
          /> */}
        </div>
      }

    </div>
  )
}

export default Home
