
'use client'

import { Errors } from "@/components/Errors"
import { InputForm } from "@/components/form/InputForm"
import { useFormik } from "formik"
import { ButtonCancelar } from "../../../../@components/ButtonCancelar"
import { ButtonSubmit } from "../../../../@components/ButtonSubmit"
import { useState } from "react"
import axios, { AxiosError } from "axios"
import { config } from "@/config/config"
import { toast } from "sonner"
import { useAuth } from "@/context/useAuthContext"
import { useRouter } from "next/navigation"

export default function AgregarGastoAnio() {
  const [loading, setLoading] = useState<boolean>(false);
  const { closeModal } = useAuth();
  const router = useRouter()

  const agregarGasto = async (): Promise<void> => {
    try {
      setLoading(true);
      const { status, data } = await axios.post(
        `${config.apiUrl}/gastos//tipo/agregar`,
        values,
        {
          withCredentials: true,
        }
      );

      if (status === 201) {
        console.log(data);
        closeModal();
        router.push("/sistema/recopilacion-anio");
        toast.success("Creado correctamente");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log("Error: ", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error);
      }
    }
  };

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched
  } = useFormik({
    initialValues: {
      valor: 0,
      anio: new Date().getFullYear(),
      mes: 0,
    },
    onSubmit: agregarGasto
  })

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full text-black">
        <h2 className="mb-8 text-3xl font-medium text-center font_kanit text-secondary-main">
          Agregar Tipo de Cambio
        </h2>
        <div className="w-full">
          <div className="grid grid-cols-1 mb-5 gap-x-4 gap-y-6 md:grid-cols-3">
            <div className="w-full">
              <InputForm
                label="Valor"
                name="valor"
                placeholder="Valor"
                type="number"
                value={String(values.valor)}
                step={0.01}
                className=""
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.valor} touched={touched.valor} />
            </div>
            <div className="w-full">
              <InputForm
                label="Año"
                name="anio"
                placeholder="Año"
                type="number"
                value={String(values.anio)}
                className=""
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.anio} touched={touched.anio} />
            </div>
            <div className="w-full">
              <label className="text-black-800">Mes</label>
              <select
                id="mes"
                name="mes"
                value={values.mes}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-2 border rounded-md outline-none placeholder:text-sm focus:border-secondary-main"
              >
                <option value="">Selecciona una opcion</option>
                <option value={1}>Enero</option>
                <option value={2}>Febrero</option>
                <option value={3}>Marzo</option>
                <option value={4}>Abril</option>
                <option value={5}>Mayo</option>
                <option value={6}>Junio</option>
                <option value={7}>Julio</option>
                <option value={8}>Agosto</option>
                <option value={9}>Septiembre</option>
                <option value={10}>Octubre</option>
                <option value={11}>Noviembre</option>
                <option value={12}>Diciembre</option>
              </select>
            </div>

          </div>
          <div className="flex flex-col items-center w-full gap-4 mt-4 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <ButtonCancelar />
            </div>
            <div className="w-full lg:w-1/2">
              <ButtonSubmit loading={loading} text="Agregar gasto" />
            </div>
          </div>
        </div>
      </form>
    </>
  )
}