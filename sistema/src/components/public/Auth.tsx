/* eslint-disable @typescript-eslint/restrict-template-expressions */
import axios from 'axios'
import { useState } from 'react'
// Icons
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri'
import { Toaster, toast } from 'sonner'
import { Global } from '../../helper/Global'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Errors } from '../shared/Errors'
import useAuth from '../../hooks/useAuth'

const Schema = Yup.object().shape({
  email: Yup.string()
    .email('Email invalido')
    .required('Este campo es requerido'),
  password: Yup.string().required('Este campo es requerido').min(1)
})

interface Values {
  email: string
  password: string
}

const Auth = (): JSX.Element | undefined => {
  const [showPassword, setShowPassword] = useState(false)
  const [loadingC, setLoading] = useState(false)
  const { auth, loading } = useAuth()

  if (auth.id && !loading) {
    window.location.href = '/admin'
  } else {
    const validar = async (values: Values): Promise<void> => {
      setLoading(true)
      const datos = {
        email: values.email,
        password: values.password
      }
      try {
        const { data } = await axios.post(`${Global.url}/login`, datos, {
          headers: {
            'Content-Type': 'application/json' // Incluye cualquier encabezado necesario
          }
        })
        if (data.usuario.rol_id === 1 || data.usuario.rol_id === 3) {
          console.log(data)
          toast.success('Usuario identificado correctamente')
          localStorage.setItem('token', data.token)
          if (data.usuario.rol_id === 1) {
            window.location.href = '/admin'
          } else {
            window.location.href = `/admin/cargos/${data.usuario.id}`
          }
        } else {
          toast.error('Usuario no autorizado')
          setLoading(false)
          console.log(data)
          return
        }
      } catch (error: any) {
        console.log(error)
        let dataError = error.request.response
        if (dataError) {
          dataError = JSON.parse(dataError)
          //   console.log(dataError)
          if (dataError.message == 'Complete todos los campos') {
            toast.warning('Complete todos los campos')
          } else if (dataError.message == 'Contraseña incorrecta') {
            toast.warning('Contraseña incorrecta')
          } else {
            toast.error('El usuario no existe')
          }
        } else {
          toast.error('El usuario no existe')
        }
      }
      setLoading(false)
    }

    const openAlerta = (): void => {
      toast.warning('Metodo no disponible')
    }

    const { handleSubmit, handleChange, errors, values, touched, handleBlur } =
      useFormik({
        initialValues: {
          email: '',
          password: ''
        },
        validationSchema: Schema,
        onSubmit: validar
      })

    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Toaster position="top-center" richColors />
        <div className="w-full rounded-md bg-[#1E1F25] px-6 lg:px-10 py-12 shadow-2xl lg:w-[450px] relative">
          <h1 className="mb-8 text-center text-3xl font-bold uppercase tracking-[5px] text-white">
            Iniciar <span className="text-main">sesión</span>
          </h1>
          <form className="mb-8" onSubmit={handleSubmit}>
            <button
              onClick={() => {
                openAlerta()
              }}
              type="button"
              className="mb-8 flex w-full items-center justify-center gap-4 rounded-full bg-[#131517] px-4 py-3 text-gray-100"
            >
              <img
                src="https://api.logosperu.com.pe/public/archivosVarios/google_logo.png"
                className="w-4 h-4"
                alt="Ingresa con google"
              />
              Ingresa con google
            </button>
            <div className="relative mb-4">
              <div className="relative flex items-center">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  className="absolute -translate-y-1/2 left-2 top-1/2 text-main"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm17 4.238l-7.928 7.1L4 7.216V19h16V7.238zM4.511 5l7.55 6.662L19.502 5H4.511z"></path>
                  </g>
                </svg>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full rounded-lg bg-[#131517] py-3 pl-8 pr-4 text-gray-300 outline-none"
                  placeholder="Correo electrónico"
                />
              </div>
              <Errors errors={errors.email} touched={touched.email} />
            </div>
            <div className="relative mb-8">
              <div className="relative">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  className="absolute -translate-y-1/2 left-2 top-1/2 text-main"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M19 10h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1V9a7 7 0 1 1 14 0v1zM5 12v8h14v-8H5zm6 2h2v4h-2v-4zm6-4V9A5 5 0 0 0 7 9v1h10z"></path>
                  </g>
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full rounded-lg bg-[#131517] px-8 py-3 text-gray-300 outline-none"
                  placeholder="Contraseña"
                  name="password"
                  onBlur={handleBlur}
                  value={values.password}
                  onChange={handleChange}
                />
                {showPassword
                  ? (
                  <RiEyeOffLine
                    onClick={() => {
                      setShowPassword(!showPassword)
                    }}
                    className="absolute -translate-y-1/2 right-2 top-1/2 text-main hover:cursor-pointer"
                  />
                    )
                  : (
                  <RiEyeLine
                    onClick={() => {
                      setShowPassword(!showPassword)
                    }}
                    className="absolute -translate-y-1/2 right-2 top-1/2 text-main hover:cursor-pointer"
                    name="password"
                  />
                    )}
              </div>
              <Errors errors={errors.password} touched={touched.password} />
            </div>

            <div>
              <button
                type={loadingC ? 'button' : 'submit'}
                disabled={loadingC}
                className="w-full px-4 py-3 text-sm font-bold text-white uppercase transition-colors rounded-lg bg-main hover:bg-darKmain"
              >
                {loadingC ? 'Validando...' : 'Ingresar'}
              </button>
            </div>
            <div className="mt-3"></div>
          </form>
          <div className="flex flex-col items-center gap-4">
            <a
              className="text-gray-300 transition-colors hover:text-main"
              href="https://wa.me//+51987038024"
              target="_blank"
              rel="noreferrer noopener"
            >
              ¿Olvidaste tu contraseña?
            </a>
            <span className="flex items-center gap-2 text-gray-300">
              ¿No tienes cuenta?{' '}
              <a
                className="transition-colors text-main hover:text-gray-100"
                href="https://wa.me//+51987038024"
                target="_blank"
                rel="noreferrer noopener"
              >
                Registrate
              </a>
            </span>
          </div>
        </div>
      </div>
    )
  }
}

export default Auth
