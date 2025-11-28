/* eslint-disable react-hooks/exhaustive-deps */
'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from '@/context/useAuthContext';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { ButtonCancelar } from '../../../../@components/ButtonCancelar';
import { ButtonSubmit } from '../../../../@components/ButtonSubmit';
import { useFormik } from 'formik';
// import { EditarPrestamoSchema } from '../schemas/EditarPrestamoSchema';
import { BusquedaCliente } from '../../../@componentes/form/BusquedaCliente';
import { config } from '@/config/config';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { InputForm } from '@/components/form/InputForm';
import { Errors } from '@/components/Errors';
import { calcularDiferenciaDias } from '../logic/sacarDias';
import { descubridorDeBoletas } from '../logic/descubridorDeBoletas';

export default function EditarPrestamo() {
  const [loading, setLoading] = useState<boolean>(false)
  const { closeModal, selectedRow } = useAuth()
  const router = useRouter()
  const [usuario, setUsuario] = useState<any>()
  console.log(selectedRow)

  async function editarPrestamo(): Promise<void> {
    setLoading(true)
    try {
      const { status, data } = await axios.post(`${config.apiUrl}/prestamos/${selectedRow.id}`, values, {
        withCredentials: true
      })

      if (status === 200) {

        console.log(data.prestamo);
        closeModal();
        router.push(`/sistema/prestamos?page=1`);
        toast.success("Editado correctamente")
      }

    } catch (error) {
      console.log("Error: ", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error)
      }
    } finally {
      setLoading(false)
    }
  }

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      documento: selectedRow.documento,
      tipo_documento: selectedRow.tipo_documento,
      capital_soles: selectedRow.capital_soles,
      capital_dolares: selectedRow.capital_dolares,
      moneda: selectedRow.moneda,
      fechaInicial: selectedRow.fecha,
      tasa: Number(selectedRow.tasa),
      devolucion: selectedRow.devolucion,
      dias: selectedRow.dias,
      estatus: String(selectedRow.estatus).toUpperCase(),
      tc: selectedRow.tc,
      cuadre: selectedRow.cuadre,
      factura: selectedRow.factura,
      tasaInicial: 0,
      tipo: String(descubridorDeBoletas(selectedRow.codigoFacturaBoleta)).toUpperCase(),
      codigoFacturaBoleta: selectedRow.codigoFacturaBoleta,
      codigoFacturaBoletaAnulado: '',
      numero_prestamo: selectedRow.numero_prestamo
    },
    // validationSchema: EditarPrestamoSchema,
    onSubmit: editarPrestamo
  })

  useEffect(() => {
    if (usuario) {
      setFieldValue("usuarioId", usuario.id);
      setFieldValue("documento", usuario.documento);
      setFieldValue("tipo_documento", usuario.tipo_documento);
    }
  }, [setFieldValue, usuario]);

  useEffect(() => {
    if (values.moneda === 'PEN') {
      setFieldValue('capital_dolares', 0)
    }
    if (values.moneda === 'USD') {
      setFieldValue('capital_soles', 0)
    }
  }, [values.moneda, setFieldValue])

  useEffect(() => {
    setFieldValue('dias', calcularDiferenciaDias(values.fechaInicial, values.devolucion))
  }, [values.devolucion, setFieldValue, values.fechaInicial])

  useEffect(() => {
    if (values.tasaInicial === 0) return
    const nuevaTasa = parseFloat(String(((values.tasaInicial / 100) * 1.18) * 100))
    setFieldValue('tasa', nuevaTasa)
  }, [values.tasaInicial, setFieldValue])

  useEffect(() => {

    if (values.factura === '') {
      if (values.codigoFacturaBoletaAnulado === '') return
      setFieldValue('codigoFacturaBoleta', values.codigoFacturaBoletaAnulado)
    }
    else if (values.factura === 'ANULADO' || values.factura === 'NOTA DE CREDITO') {
      setFieldValue('codigoFacturaBoletaAnulado', values.codigoFacturaBoleta)
      setFieldValue('codigoFacturaBoleta', '')
    }

  }, [values.factura, setFieldValue])

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2 className="mb-8 text-3xl font-medium text-center font_kanit text-secondary-main">
          Editar Préstamo
        </h2>
        <div className='w-full'>
          <div className="grid grid-cols-1 mb-5 gap-x-4 gap-y-6 md:grid-cols-3">
            <div className="w-full">
              <InputForm
                label="Numero Prestamo"
                name="numero_prestamo"
                placeholder="Numero Prestamo"
                type="text"
                value={values.numero_prestamo}
                className=""
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="w-full">
              <InputForm
                label="Documento"
                name="documento"
                placeholder="Documento"
                type="text"
                disabled
                value={usuario && usuario.documento ? usuario.documento : values.documento}
                className=""
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="w-full">
              <BusquedaCliente setUsuario={setUsuario} usuario={selectedRow.cliente} />
            </div>
            <div className="w-full">
              <InputForm
                label="Tipo de Documento"
                name="tipo_documento"
                placeholder="Tipo de Documento"
                type="text"
                disabled
                value={usuario && usuario.tipo_documento ? usuario.tipo_documento : values.tipo_documento}
                className="uppercase"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="w-full">
              <label className="text-black-800">Moneda</label>
              <select
                name="moneda"
                id=""
                value={values.moneda}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-2 border rounded-md outline-none placeholder:text-sm focus:border-secondary-main"
              >
                <option value="">Selecciona una opción</option>
                <option value="USD">Dólares</option>
                <option value="PEN">Soles</option>
              </select>

              <Errors errors={errors.moneda} touched={touched.moneda} />
            </div>
            <div className="w-full">
              <InputForm
                label="Capital Soles"
                name="capital_soles"
                placeholder="Capital Soles"
                type="number"
                step={0.01}
                value={String(values.capital_soles)}
                onBlur={handleBlur}
                onChange={handleChange}
                disabled={values.moneda === 'USD' || values.moneda === ''}
              />
              <Errors errors={errors.capital_soles} touched={touched.capital_soles} />
            </div>
            <div className="w-full">
              <InputForm
                label="Capital Dolares"
                name="capital_dolares"
                placeholder="Capital Dolares"
                type="number"
                step={0.01}
                value={String(values.capital_dolares)}
                onBlur={handleBlur}
                onChange={handleChange}
                disabled={values.moneda === 'PEN' || values.moneda === ''}
              />
              <Errors errors={errors.capital_dolares} touched={touched.capital_dolares} />
            </div>
            <div className='w-full'>
              <InputForm
                label="Fecha de Registro"
                name="fechaInicial"
                placeholder="Fecha de Registro"
                type="date"
                value={
                  values.fechaInicial ? values.fechaInicial.toString().split("T")[0] : ""
                }
                className=""
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.fechaInicial} touched={touched.fechaInicial} />
            </div>
            <div className="w-full">
              <InputForm
                label="Fecha de Devolución"
                name="devolucion"
                placeholder="Fecha de Devolución"
                type="date"
                value={
                  values.devolucion ? values.devolucion.toString().split("T")[0] : ""
                }
                className=""
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.devolucion} touched={touched.devolucion} />
            </div>
            <div className="w-full">
              <InputForm
                label="Días"
                name="dias"
                placeholder="Días"
                type="text"
                disabled
                value={String(values.dias)}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="w-full">
              <InputForm
                label="TC"
                name="tc"
                placeholder="TC"
                type="number"
                step={0.01}
                value={String(values.tc)}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.tc} touched={touched.tc} />
            </div>
            <div className='w-full'>
              <InputForm
                label="Porcentaje Inicial"
                name="tasaInicial"
                placeholder="Porcentaje Inicial"
                type="number"
                step={0.01}
                value={String(values.tasaInicial)}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.tasaInicial} touched={touched.tasaInicial} />
            </div>
            <div className='w-full'>
              <InputForm
                label="Tasa Calculada"
                name="tasa"
                placeholder="Tasa Calculada"
                type="number"
                step={0.01}
                disabled
                value={String(values.tasa)}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.tasa} touched={touched.tasa} />
            </div>
            <div>
              <InputForm
                label="Codigo Factura / Boleta"
                name="codigoFacturaBoleta"
                placeholder="Codigo Factura / Boleta"
                type="text"
                value={values.codigoFacturaBoleta}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.codigoFacturaBoleta} touched={touched.codigoFacturaBoleta} />
            </div>
            <div className="w-full">
              <label className="text-black-800">Factura o Boleta?</label>
              <select
                name="tipo"
                id=""
                value={values.tipo}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-2 border rounded-md outline-none placeholder:text-sm focus:border-secondary-main"
              >
                <option value="BOLETA">BOLETA</option>
                <option value="FACTURA">FACTURA</option>
              </select>

              <Errors errors={errors.tipo} touched={touched.tipo} />
            </div>
            <div className="w-full">
              <label className="text-black-800">Estado de la Factura o Boleta</label>
              <select
                name="factura"
                id=""
                value={values.factura}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-2 border rounded-md outline-none placeholder:text-sm focus:border-secondary-main"
              >
                <option value=""> - </option>
                <option value="ANULADO">ANULADO</option>
                <option value="NOTA DE CREDITO">NOTA DE CREDITO</option>
              </select>

              <Errors errors={errors.factura} touched={touched.factura} />
            </div>
            <div className="w-full">
              <label className="text-black-800">Estado del Préstamo</label>
              <select
                name="estatus"
                id=""
                value={values.estatus}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={selectedRow.estatus === 'PAGADO'}
                className="w-full p-2 border rounded-md outline-none placeholder:text-sm focus:border-secondary-main"
              >
                <option value="PENDIENTE">Pendiente</option>
                <option value="A_PLAZO">A Plazo</option>
                <option value="PAGADO">Pagado</option>
              </select>

              <Errors errors={errors.estatus} touched={touched.estatus} />
            </div>

          </div>
          <div className="flex flex-col items-center w-full gap-4 mt-4 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <ButtonCancelar />
            </div>
            <div className="w-full lg:w-1/2">
              <ButtonSubmit loading={loading} text="Editar prestamo" />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
