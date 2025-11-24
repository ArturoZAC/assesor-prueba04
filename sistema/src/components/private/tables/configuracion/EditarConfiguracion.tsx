import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import Swal from 'sweetalert2'
import { Loading } from '../../../shared/Loading'
import { useFormik } from 'formik'
import { SchemaConfiguracion } from '../../../shared/Schemas'
import { InputsBriefs } from '../../../shared/InputsBriefs'
import { Errors } from '../../../shared/Errors'
import { TitleBriefs } from '../../../shared/TitleBriefs'

export const EditarConfiguracion = (): JSX.Element => {
  const token = localStorage.getItem('token')
  const { setTitle, loadingComponents, setLoadingComponents } = useAuth()

  useEffect(() => {
    setTitle('CONFIGURACION')
    getBanner()
  }, [])

  const upadateBanner = async (): Promise<void> => {
    setLoadingComponents(true)
    const data = new FormData()
    data.append('telefono', values.telefono)
    data.append('celular1', values.celular1)
    data.append('celular2', values.celular2)
    data.append('correo1', values.correo1)
    data.append('correo2', values.correo2)
    data.append('horario1', values.horario1)
    data.append('horario2', values.horario2)
    data.append('direccion', values.direccion)
    data.append('facebook', values.facebook)
    data.append('instagram', values.instagram)
    data.append('twiter', values.twiter)
    data.append('linkedin', values.linkedin)
    data.append('youtube', values.youtube)
    data.append('whatsapp', values.whatsapp)
    data.append('_method', 'PUT')

    try {
      const respuesta = await axios.post(`${Global.url}/updateConfiguracion/1`, data, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })

      if (respuesta.data.status == 'success') {
        Swal.fire('Actualizado correctamente', '', 'success')
      } else {
        Swal.fire('Error al realizar la edicion', '', 'error')
      }
    } catch (error) {
      console.log(error)
      Swal.fire('Error', '', 'error')
    }
    setLoadingComponents(false)
  }

  const getBanner = async (): Promise<void> => {
    setLoadingComponents(true)
    const request = await axios.get(`${Global.url}/oneConfi/1`, {
      headers: {
        Authorization: `Bearer ${
          token !== null && token !== '' ? `Bearer ${token}` : ''
        }`
      }
    })
    setValues({
      ...values,
      telefono: request.data.telefono,
      celular1: request.data.celular1,
      celular2: request.data.celular2,
      correo1: request.data.correo1,
      correo2: request.data.correo2,
      horario1: request.data.horario1,
      horario2: request.data.horario2,
      direccion: request.data.direccion,
      facebook: request.data.facebook,
      instagram: request.data.instagram,
      twiter: request.data.twiter,
      linkedin: request.data.linkedin,
      youtube: request.data.youtube,
      whatsapp: request.data.whatsapp
    })
    setLoadingComponents(false)
  }

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    setValues,
    touched,
    handleBlur
  } = useFormik({
    initialValues: {
      telefono: '',
      celular1: '',
      celular2: '',
      correo1: '',
      correo2: '',
      horario1: '',
      horario2: '',
      direccion: '',
      facebook: '',
      instagram: '',
      twiter: '',
      linkedin: '',
      youtube: '',
      whatsapp: ''
    },
    validationSchema: SchemaConfiguracion,
    onSubmit: upadateBanner
  })

  return (
    <>
      {loadingComponents
        ? (
        <Loading />
          )
        : (
        <form
          className="bg-secondary-100 p-8 rounded-xl"
          onSubmit={handleSubmit}
        >
          <h2 className="text-main text-2xl font-bold text-center mb-10">
            Configuracion General
          </h2>
          <section className="w-full flex gap-2">
            <div className="w-1/3 lg:relative mb-5">
              <TitleBriefs titulo="Telefono" />
              <InputsBriefs
                name="telefono"
                type="number"
                value={values.telefono}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.telefono} touched={touched.telefono} />
            </div>
            <div className="w-1/3 lg:relative mb-5">
              <TitleBriefs titulo="Celular 1" />
              <InputsBriefs
                name="celular1"
                type="number"
                value={values.celular1}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.celular1} touched={touched.celular1} />
            </div>
            <div className="w-1/3 lg:relative mb-5">
              <TitleBriefs titulo="Celular 2" />
              <InputsBriefs
                name="celular2"
                type="number"
                value={values.celular2}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.celular2} touched={touched.celular2} />
            </div>
          </section>

          <section className="w-full flex gap-2">
            <div className="w-1/2 lg:relative mb-5">
              <TitleBriefs titulo="Correo electronico 1" />
              <InputsBriefs
                name="correo1"
                type="email"
                value={values.correo1}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.correo1} touched={touched.correo1} />
            </div>
            <div className="w-1/2 lg:relative mb-5">
              <TitleBriefs titulo="Correo electronico 2" />
              <InputsBriefs
                name="correo2"
                type="email"
                value={values.correo2}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.correo2} touched={touched.correo2} />
            </div>
          </section>

          <section className="w-full flex gap-2">
            <div className="w-1/2 lg:relative mb-5">
              <TitleBriefs titulo="Horario 1" />
              <InputsBriefs
                name="horario1"
                type="text"
                value={values.horario1}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.horario1} touched={touched.horario1} />
            </div>
            <div className="w-1/2 lg:relative mb-5">
              <TitleBriefs titulo="Horario 2" />
              <InputsBriefs
                name="horario2"
                type="text"
                value={values.horario2}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.horario2} touched={touched.horario2} />
            </div>
          </section>

          <section className="w-full flex gap-2">
            <div className="w-full lg:relative mb-5">
              <TitleBriefs titulo="Direccion" />
              <InputsBriefs
                name="direccion"
                type="text"
                value={values.direccion}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.direccion} touched={touched.direccion} />
            </div>
          </section>

          <h2 className="text-main text-2xl font-bold text-center mb-10">
            Url Redes
          </h2>
          <div className="w-full lg:relative mb-5">
            <TitleBriefs titulo="Facebook" />
            <InputsBriefs
              name="facebook"
              type="text"
              value={values.facebook}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors errors={errors.facebook} touched={touched.facebook} />
          </div>
          <div className="w-full lg:relative mb-5">
            <TitleBriefs titulo="Instagram" />
            <InputsBriefs
              name="instagram"
              type="text"
              value={values.instagram}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors errors={errors.instagram} touched={touched.instagram} />
          </div>
          <div className="w-full lg:relative mb-5">
            <TitleBriefs titulo="Twiter" />
            <InputsBriefs
              name="twiter"
              type="text"
              value={values.twiter}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors errors={errors.twiter} touched={touched.twiter} />
          </div>
          <div className="w-full lg:relative mb-5">
            <TitleBriefs titulo="Linkedin" />
            <InputsBriefs
              name="linkedin"
              type="text"
              value={values.linkedin}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors errors={errors.linkedin} touched={touched.linkedin} />
          </div>
          <div className="w-full lg:relative mb-5">
            <TitleBriefs titulo="Youtube" />
            <InputsBriefs
              name="youtube"
              type="text"
              value={values.youtube}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors errors={errors.youtube} touched={touched.youtube} />
          </div>
          <div className="w-full lg:relative mb-5">
            <TitleBriefs titulo="Whatsapp" />
            <InputsBriefs
              name="whatsapp"
              type="text"
              value={values.whatsapp}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors errors={errors.whatsapp} touched={touched.whatsapp} />
          </div>

          <div className="flex gap-2 w-full justify-end">
            <input type="hidden" name="oculto" value="1" />
            <Link
              to="/admin/marcas"
              className="bg-red-500 px-4 py-2 rounded-md text-white"
            >
              Grabar
            </Link>
            <input
              type="submit"
              className="bg-green-500 text-black hover:bg-green-600 flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
              value="Editar"
            />
          </div>
        </form>
          )}
    </>
  )
}
