import { Link, useNavigate } from 'react-router-dom'
import { Errors } from '../../../shared/Errors'
import { InputsBriefs } from '../../../shared/InputsBriefs'
import { TitleBriefs } from '../../../shared/TitleBriefs'
import { Loading } from '../../../shared/Loading'
import { ProfesorSchema } from '../../../shared/Schemas'
import { useFormik } from 'formik'
import { toast } from 'sonner'
import { Global } from '../../../../helper/Global'
import axios from 'axios'
import { type Usuario } from '../../../../interfaces/UserInterface'
import { useState } from 'react'

export function CrearAlumno (): JSX.Element {
  const navigate = useNavigate()
  const [loadingComponents, setLoadingComponents] = useState(false)

  const saveBanner = async (
    values: Usuario
  ): Promise<void> => {
    setLoadingComponents(true)
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('nombres', values.nombres)
    formData.append('apellidos', values.apellidos)
    formData.append('email', values.email)
    formData.append('celular', values.celular)
    formData.append('password', values.password)
    const body = {
      nombres: values.nombres,
      apellidos: values.apellidos,
      email: values.email,
      celular: values.celular,
      password: values.password
    }
    try {
      const { status } = await axios.post(
        `${Global.url}/alumnos`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token !== null && token !== '' ? token : ''
              }`
          }
        }
      )
      if (status === 201) {
        toast.success('Registro exitoso')
        navigate('/admin/alumnos')
      }
      if (status === 400) {
        toast.warning('Complete todos los datos')
      }
      if (status === 401) {
        navigate('/login')
      }
    } catch (error) {
      console.log(error)
      toast.error('Error al crear registro')
    }
    setLoadingComponents(false)
  }

  const { handleSubmit, handleChange, errors, values, touched, handleBlur } =
    useFormik({
      initialValues: {
        nombres: '',
        apellidos: '',
        email: '',
        celular: '',
        password: '',
        rolId: 2
      },
      validationSchema: ProfesorSchema,
      onSubmit: saveBanner
    })
  return (
    <>
      {loadingComponents
        ? (
          <Loading />
          )
        : (
          <form
            className="p-8 mt-4 bg-secondary-100 rounded-xl"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col w-full gap-5 lg:flex-row">
              <div className="w-full mb-5 lg:relative">
                <TitleBriefs titulo="Nombres" />
                <InputsBriefs
                  name="nombres"
                  type="text"
                  value={values.nombres}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Errors errors={errors.nombres} touched={touched.nombres} />
              </div>
              <div className="w-full mb-5 lg:relative">
                <TitleBriefs titulo="Apellidos" />
                <InputsBriefs
                  name="apellidos"
                  type="text"
                  value={values.apellidos}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Errors errors={errors.apellidos} touched={touched.apellidos} />
              </div>
              <div className="w-full mb-5 lg:relative">
                <TitleBriefs titulo="Celular" />
                <InputsBriefs
                  name="celular"
                  type="text"
                  value={values.celular}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Errors errors={errors.celular} touched={touched.celular} />
              </div>
            </div>
            <div>
            </div>
            <div className="flex flex-col w-full gap-5 lg:flex-row">
              <div className="w-full mb-5 lg:relative">
                <TitleBriefs titulo="Email" />
                <InputsBriefs
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Errors errors={errors.email} touched={touched.email} />
              </div>
              <div className="w-full mb-5 lg:relative">
                <TitleBriefs titulo="Contraseña" />
                <InputsBriefs
                  name="password"
                  type="text"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Errors errors={errors.password} touched={touched.password} />
              </div>
            </div>
            {/* <div className="flex flex-col gap-2 mb-8 md:flex-row md:items-center">
              <div className="w-full ">
                <div className="w-full ">
                  <p>
                    Fondo<span className="text-red-500">*</span>
                  </p>
                </div>
                <div className="flex items-center flex-1 gap-4">
                  <ImageUploader
                    url={url1}
                    setUrl={setUrl1}
                    boton={boton1}
                    setBoton={setBoton1}
                    setImagen={setImagen1}
                    clase="1"
                  />
                </div>
              </div>
            </div> */ }

            <div className="flex justify-end w-full gap-2">
              <input type="hidden" name="oculto" value="1" />
              <Link
                to="/admin/alumnos"
                className="px-4 py-2 text-white bg-red-500 rounded-md"
              >
                Cancelar
              </Link>
              <input
                type="submit"
                className="flex items-center gap-2 px-4 py-2 text-black transition-colors bg-green-500 rounded-lg cursor-pointer hover:bg-green-600"
                value="Registrar"
              />
            </div>
          </form>
          )}
    </>
  )
}
