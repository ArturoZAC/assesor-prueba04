/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { ButtonCancelar } from '../../../../@components/ButtonCancelar'
import { useAuth } from '@/context/useAuthContext'
import { config } from '@/config/config'
import { toast } from 'sonner'
import { BusquedaCliente } from '../../../@componentes/form/BusquedaCliente'

export default function ExportExcelLeasing() {
  const { closeModal } = useAuth()
  const [usuario, setUsario] = useState<any>(null)

  const options = [
    { value: "enero", label: "Enero" },
    { value: "febrero", label: "Febrero" },
    { value: "marzo", label: "Marzo" },
    { value: "abril", label: "Abril" },
    { value: "mayo", label: "Mayo" },
    { value: "junio", label: "Junio" },
    { value: "julio", label: "Julio" },
    { value: "agosto", label: "Agosto" },
    { value: "septiembre", label: "Septiembre" },
    { value: "octubre", label: "Octubre" },
    { value: "noviembre", label: "Noviembre" },
    { value: "diciembre", label: "Diciembre" },
  ]

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue
  } = useFormik({
    initialValues: {
      nombre: '',
      estado: '',
      fecha: '',
    },
    onSubmit: async (values) => {
      const response = await fetch(`${config.apiUrl}/leasing/exportar/tabla-excel`, {
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
          Filtros de Exportación - Leasing
        </h2>
        <div className='w-full'>
          <div className="grid grid-cols-1 mb-5 gap-x-4 gap-y-6 md:grid-cols-3">
            <div className="w-full">
              <BusquedaCliente setUsuario={setUsario} />
            </div>

            <div className="w-full">
              <label className="text-black-800">Factura o Boleta</label>
              <select
                name="estado"
                id="estado"
                value={values.estado}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-2 border rounded-md outline-none placeholder:text-sm focus:border-secondary-main"
              >
                <option value="">Todos</option>
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="A_PLAZO">A PLAZO</option>
                <option value="PAGADO">PAGAOD</option>
              </select>
            </div>

            <div className="w-full">
              <label className="text-black-800">Mes</label>
              <select
                name="fecha"
                id="fecha"
                value={values.fecha}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-2 border rounded-md outline-none placeholder:text-sm focus:border-secondary-main"
              >
                <option value="">Todos</option>
                {
                  options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
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
