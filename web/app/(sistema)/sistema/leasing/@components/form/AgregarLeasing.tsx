/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { config } from '@/config/config';
import { useAuth } from '@/context/useAuthContext';
import axios, { AxiosError } from 'axios';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { AgregarLeasingSchema } from '../schema/AgregarLeasingSchema';
import { Errors } from '@/components/Errors';
import { InputForm } from '@/components/form/InputForm';
import { BusquedaCliente } from '../../../@componentes/form/BusquedaCliente';
import { ButtonCancelar } from '../../../../@components/ButtonCancelar';
import { ButtonSubmit } from '../../../../@components/ButtonSubmit';
import { calcularDiasEntreFechas } from '../logic/calcularDiferenciaEntreFechas';

export default function AgregarLeasing() {

  const [loading, setLoading] = useState<boolean>(false);
  const { closeModal } = useAuth();
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>();

  async function saveLeasing(): Promise<void> {
    if (loading) return
    setLoading(true)
    try {
      const { status, data } = await axios.post(`${config.apiUrl}/leasing`, values, {
        withCredentials: true
      })

      if (status === 201) {
        console.log(data.leasing)
        closeModal();
        router.push("/sistema/leasing?page=1");
        toast.success("Creado correctamente");
      }

    } catch (error) {
      console.log("Error: ", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error);
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
      usuarioId: '',
      documento: '',
      tipo_documento: '',
      codSer: '',
      numero: 0,
      precio: 0,
      fecha_inicial: '',
      fecha_final: '',
      dias: 0,
      estatus: '',
      cobroTotal: 0,
      tc: 0,
      factura: '',
      tipo: 'BOLETA',
      codigoFacturaBoleta: ''
    },
    validationSchema: AgregarLeasingSchema,
    onSubmit: saveLeasing
  })

  useEffect(() => {
    if (usuario) {
      console.log(usuario)
      setFieldValue("usuarioId", usuario.id);
      setFieldValue("documento", usuario.documento);
      setFieldValue("tipo_documento", usuario.tipo_cliente === 'persona_juridica' ? 'RUC' : 'DNI');
      setFieldValue("tipo", usuario.tipo_cliente === 'persona_juridica' ? 'FACTURA' : 'BOLETA');
    }
  }, [setFieldValue, usuario]);

  useEffect(() => {
    if (values.fecha_inicial === '' || values.fecha_final === '') return
    setFieldValue('dias', calcularDiasEntreFechas(values.fecha_inicial, values.fecha_final))
  }, [values.fecha_inicial, values.fecha_final, setFieldValue])

  useEffect(() => {
    if (!values.precio || !values.numero) return
    setFieldValue('cobroTotal', values.precio * values.numero)
  }, [values.precio, values.numero, setFieldValue])

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2 className="mb-8 text-3xl font-medium text-center font_kanit text-secondary-main">
          Agregar Leasing
        </h2>
        <div className='w-full'>
          <div className="grid grid-cols-1 mb-5 gap-x-4 gap-y-6 md:grid-cols-3">
            <div className="w-full">
              <BusquedaCliente setUsuario={setUsuario} />
              <Errors errors={errors.usuarioId} touched={touched.usuarioId} />
            </div>
            <div className="w-full">
              <InputForm
                label="Documento"
                name="documento"
                placeholder="Documento"
                type="text"
                disabled
                value={usuario && usuario.documento ? usuario.documento : ""}
                className=""
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.documento} touched={touched.documento} />
            </div>
            <div className="w-full">
              <InputForm
                label="Tipo de Documento"
                name="tipo_documento"
                placeholder="Tipo de Documento"
                type="text"
                disabled
                value={usuario && usuario.tipo_documento ? usuario.tipo_documento : ""}
                className="uppercase"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.tipo_documento} touched={touched.tipo_documento} />
            </div>
            <div className="w-full">
              <InputForm
                label="Cantidad de Productos"
                name="numero"
                placeholder="Cantidad de Productos"
                type="number"
                value={String(values.numero)}
                className=""
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.numero} touched={touched.numero} />
            </div>
            <div className="w-full">
              <InputForm
                label="Precio"
                name="precio"
                placeholder="Precio"
                type="number"
                step={0.01}
                value={String(values.precio)}
                className=""
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.precio} touched={touched.precio} />
            </div>
            <div className='w-full'>
              <InputForm
                label="Cobro Total"
                name="cobroTotal"
                placeholder="Cobro Total"
                type="number"
                step={0.01}
                disabled
                value={Number(values.cobroTotal).toFixed(2)}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.cobroTotal} touched={touched.cobroTotal} />
            </div>
            <div className="w-full">
              <InputForm
                label="Cod. Ser"
                name="codSer"
                placeholder="Cod. Ser"
                type="text"
                value={
                  values.codSer
                }
                className=""
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.codSer} touched={touched.codSer} />
            </div>
            <div className="w-full">
              <InputForm
                label="Fecha Inicial"
                name="fecha_inicial"
                placeholder="Fecha Inicial"
                type="date"
                value={
                  values.fecha_inicial ? values.fecha_inicial.toString().split("T")[0] : ""
                }
                className=""
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.fecha_inicial} touched={touched.fecha_inicial} />
            </div>
            <div className="w-full">
              <InputForm
                label="Fecha Final"
                name="fecha_final"
                placeholder="Fecha Final"
                type="date"
                value={
                  values.fecha_final ? values.fecha_final.toString().split("T")[0] : ""
                }
                className=""
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.fecha_final} touched={touched.fecha_final} />
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

          </div>
          <div className="flex flex-col items-center w-full gap-4 mt-4 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <ButtonCancelar />
            </div>
            <div className="w-full lg:w-1/2">
              <ButtonSubmit loading={loading} text="Agregar leasing" />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
