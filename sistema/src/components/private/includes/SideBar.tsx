import { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
// Icons
import {
  RiLogoutCircleRLine,
  RiMenu3Line,
  RiCloseLine,
  //   RiStackFill,
  RiRadioButtonLine
} from 'react-icons/ri'

import axios from 'axios'
import { Global } from '../../../helper/Global'
import { icono } from '../../shared/Images'
import AdminSection from './section/AdminSection'

const SideBar = (): JSX.Element => {
  const { auth, setAuth, setLoading, setShowNotificaciones } = useAuth()
  const token = localStorage.getItem('token')
  const [showMenu, setShowMenu] = useState(false)
  const navigate = useNavigate()
  //   const [showSubmenu2, setShowSubmenu2] = useState(false);

  const cerrarSession = async (): Promise<void> => {
    setLoading(true)
    const data = new FormData()
    data.append('_method', 'POST')

    await axios.post(`${Global.url}/logout`, data, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    localStorage.clear()
    setAuth({
      id: '',
      nombres: '',
      apellidos: '',
      email: '',
      rolId: null
    })
    navigate('/login')
    setLoading(false)
  }

  return (
    <>
      <div
        className={`xl:h-[96vh] fixed xl:static w-[70%] md:w-[40%] lg:w-[30%] xl:w-auto h-full lg:ml-4 top-0 my-auto lg:rounded-2xl bg-primary shadow-xl px-4 pb-4 pt-2 flex flex-col justify-between z-50 ${
          showMenu ? 'left-0' : '-left-full'
        } transition-all`}
      >
        <div>
          <nav className="py-4">
            <div
              className="relative mx-auto mb-4 cursor-pointer w-fit"
              onClick={() => {
                setShowNotificaciones(true)
              }}
            >
              <img
                src={icono}
                alt=""
                className="object-contain w-20 h-20 p-2 mx-auto border-2 border-gray-800 rounded-full"
              />
              <span className="absolute bottom-0 right-0 text-xl text-green-500 animate-pulse">
                <RiRadioButtonLine />
              </span>
            </div>
            <h2 className="text-sm font-bold text-center text-gray-300">
              {auth.nombres}
            </h2>
            <h2 className="text-xs text-center text-gray-400">{auth.email}</h2>
          </nav>
          <div className="mb-5 h-[1px] w-full bg-gray-500 text-gray-500 block" />
          {auth.rol_id === 1 ? <AdminSection /> : null}

        </div>
        <nav>
          <Link
            to={''}
            onClick={() => {
              void cerrarSession()
            }}
            className="flex items-center gap-4 px-4 py-2 transition-colors rounded-lg hover:bg-main_2-100 text-main hover:text-main"
          >
            <RiLogoutCircleRLine className="text-main " /> Cerrar sesión
          </Link>
        </nav>
      </div>
      <button
        onClick={() => {
          setShowMenu(!showMenu)
        }}
        className="fixed z-50 p-3 text-white rounded-full xl:hidden bottom-4 right-4 bg-main"
      >
        {showMenu ? <RiCloseLine /> : <RiMenu3Line />}
      </button>
    </>
  )
}

export default SideBar
