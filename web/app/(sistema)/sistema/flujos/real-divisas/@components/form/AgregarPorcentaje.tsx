
'use client'

import { generarOpcionesAnos } from '@/logic/generarOpcionesAnos';
import { useFormik } from 'formik'
import React from 'react'
import { ButtonCancelar } from '../../../../../@components/ButtonCancelar';
import { ButtonSubmit } from '../../../../../@components/ButtonSubmit';
import axios from 'axios';
import { config } from '@/config/config';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { InputForm } from '@/components/form/InputForm';
import { useAuth } from '@/context/useAuthContext';

export default function AgregarPorcentaje() {
  const anoInicioSistema = 2025;
  const opcionesAnos = generarOpcionesAnos(anoInicioSistema);
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const { closeModal } = useAuth()

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      porcentajePersonal: 0,
      porcentajeServicios: 0,
      porcentajeGastosBancarios: 0,
      porcentajeImpuestos: 0,
      porcentajeOtrosGastos: 0,
      porcentajeServiciosFondos: 0,
      porcentajeServiciosStaff: 0,
      tipoFlujo: 'REAL_DIVISA',
      anio: new Date().getFullYear().toString(),
      mes: "1",
    },
    onSubmit: async (values) => {
      if (loading) return
      try {

        const res = await axios.post(`${config.apiUrl}/flujo-porcentaje`, values, {
          withCredentials: true,
        })
        if (res.status !== 201) {
          throw new Error("Error al agregar flujo y personal");
        }
        toast.success("Flujo y personal agregado correctamente");
        router.push("/sistema/flujos/real-divisas")
        closeModal()
        setLoading(true);
      } catch (error) {
        console.log("Error: ", error);
      } finally {
        setLoading(false);
      }
    }
  })

  return (
    <div>
      <h2 className="mb-8 text-3xl font-medium text-center font_kanit text-secondary-main">
        Agregar porcentaje
      </h2>
      <form className='w-full' onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 mb-5 gap-x-4 gap-y-6 md:grid-cols-3">
          <div className="w-full">
            <label className="text-black-800">Año</label>
            <select
              name="anio"
              id="anio"
              value={values.anio}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full p-2 border rounded-md outline-none placeholder:text-sm focus:border-secondary-main"
            >
              <option value="">Todos</option>
              {
                opcionesAnos.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))
              }
            </select>
          </div>
          <div className='w-full'>
            <InputForm
              label="Personal (%)"
              name="porcentajePersonal"
              placeholder="Porcentaje Personal"
              type="number"
              step={0.01}
              value={String(values.porcentajePersonal)}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className='w-full'>
            <InputForm
              label="Servicios (%)"
              name="porcentajeServicios"
              placeholder="Porcentaje Servicios"
              type="number"
              step={0.01}
              value={String(values.porcentajeServicios)}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className='w-full'>
            <InputForm
              label="Porcentaje Impuestos (%)"
              name="porcentajeImpuestos"
              placeholder="Porcentaje Impuestos"
              type="number"
              step={0.01}
              value={String(values.porcentajeImpuestos)}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className='w-full'>
            <InputForm
              label="Otros Gastos (%)"
              name="porcentajeOtrosGastos"
              placeholder="Porcentaje Otros Gastos"
              type="number"
              step={0.01}
              value={String(values.porcentajeOtrosGastos)}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className='w-full'>
            <InputForm
              label="Gastos Bancarios (%)"
              name="porcentajeGastosBancarios"
              placeholder="Gastos Bancarios"
              type="number"
              step={0.01}
              value={String(values.porcentajeGastosBancarios)}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className='w-full'>
            <InputForm
              label="Servicios Staff (%)"
              name="porcentajeServiciosStaff"
              placeholder="Servicios Staff"
              type="number"
              step={0.01}
              value={String(values.porcentajeServiciosStaff)}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className='w-full'>
            <InputForm
              label="Servicios Fondos (%)"
              name="porcentajeServiciosFondos"
              placeholder="Porcentaje Servicios Fondo"
              type="number"
              step={0.01}
              value={String(values.porcentajeServiciosFondos)}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

        </div>
        <div className="flex flex-col items-center w-full gap-4 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <ButtonCancelar />
          </div>
          <div className="w-full lg:w-1/2">
            <ButtonSubmit loading={loading} text="Agregar Porcentaje" />
          </div>
        </div>
      </form>
    </div>
  )
}
