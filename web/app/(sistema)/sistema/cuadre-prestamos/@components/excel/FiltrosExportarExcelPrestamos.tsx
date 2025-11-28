/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'


import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { ButtonCancelar } from '../../../../@components/ButtonCancelar'
import { useAuth } from '@/context/useAuthContext'
import { config } from '@/config/config'
import { toast } from 'sonner'
import { generarOpcionesAnos } from '@/logic/generarOpcionesAnos'
import { BusquedaCliente } from '../../../@componentes/form/BusquedaCliente'

export default function FiltrosExportarExcelPrestamos() {
  const { closeModal } = useAuth()
  const anoInicioSistema = 2025;
  const opcionesAnos = generarOpcionesAnos(anoInicioSistema);
  const [usuario, setUsario] = useState<any>(null)

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue
  } = useFormik({
    initialValues: {
      nombre: '',
      anio: anoInicioSistema
    },
    onSubmit: async (values) => {
      const response = await fetch(`${config.apiUrl}/cuadreprestamos/exportar/tabla-excel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values),
        credentials: 'include',
      })

      if (!response.ok) {
        toast.error('Error al exportar el Excel')
        return
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      closeModal()
    }
  })

  useEffect(() => {
    if (!usuario) return
    setFieldValue('nombre', `${usuario?.nombres} ${usuario?.apellido_paterno}`)
  }, [usuario, setFieldValue])

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2 className="mb-8 text-3xl font-medium text-center font_kanit text-secondary-main">
          Filtros de Exportación - Cuadre Préstamos
        </h2>
        <div className='w-full'>
          <div className="grid grid-cols-1 mb-5 gap-x-4 gap-y-6 md:grid-cols-3">
            <div className="w-full">
              <BusquedaCliente setUsuario={setUsario} />
            </div>

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

          </div>
        </div>
        <div className="flex flex-col items-center w-full gap-4 mt-4 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <ButtonCancelar />
          </div>
          <div className="w-full lg:w-1/2">
            <button type='submit' className='bg-green-600 text-white-main py-3 w-full flex justify-center items-center transition-all duration-200 rounded-main'>
              Exportar Excel
            </button>
          </div>
        </div>

      </form >

    </div >
  )
}
