
'use client'

import { InputForm } from "@/components/form/InputForm";
import { useAuth } from "@/context/useAuthContext";
import { FieldArray, Formik, useFormik } from "formik"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
// import * as Yup from 'yup'
import { Plus, Trash2 } from "lucide-react";
import axios from "axios";
import { config } from "@/config/config";
import { ButtonCancelar } from "../../../../../@components/ButtonCancelar";
import { ButtonSubmit } from "../../../../../@components/ButtonSubmit";
import { generarOpcionesAnos } from "@/logic/generarOpcionesAnos";


/*
const AgregarFlujoPersonalSchema = Yup.object().shape({
  flujo: Yup.object().shape({
    dia: Yup.string().required("El día es requerido").matches(/^[0-9]+$/, 'Debe ser un número').test('is-valid-day', 'Día inválido', (value) => {
      const num = parseInt(value || '0', 10);
      return num >= 1 && num <= 31;
    }),
    mes: Yup.string().required("El mes es requerido").matches(/^[0-9]+$/, 'Debe ser un número').test('is-valid-month', 'Mes inválido', (value) => {
      const num = parseInt(value || '0', 10);
      return num >= 1 && num <= 12;
    }),
    anio: Yup.string().required("El año es requerido").matches(/^[0-9]+$/, 'Debe ser un número').test('is-valid-year', 'Año inválido', (value) => {
      const num = parseInt(value || '0', 10);
      return num >= 1900;
    }),
    tc: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    tipoFlujo: Yup.string().required("El tipo de flujo es requerido"),
    monto: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    ingresosPorDivisas: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    ingresosPorPrestamos: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    ingresosPorLeasing: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    interesesPorInversion: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    consultoria: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    etps: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    cts: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    internet: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    oficina: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    celular: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    factElectrica: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    contabilidad: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    gestionRiesgo: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    marketingComercial: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    combustible: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    alquilerVehiculos: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    gastosExtras: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    viajesEventosOtros: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    itfSoles: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    itfDolares: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    mantSoles: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    mantDolares: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    interbancarioSoles: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    interbancariosDolares: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    interesFondosSoles: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    interesFondosDolares: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    serviciosFondos: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    otrosGastosTotal: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    impuestosDetracciones: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    otrosGastos: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    utilidadOperativa: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    impuestos: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    utilidadNeta: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    flujoCaja: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    capitalTrabajo: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
    flujoCajaLibre: Yup.string().notRequired().matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
  }),
  personal: Yup.array().of(
    Yup.object().shape({
      nombre: Yup.string().required("El nombre del personal es requerido"),
      monto: Yup.string().required("El monto del personal es requerido").matches(/^[0-9]*\.?[0-9]+$/, 'Debe ser un número'),
      anio: Yup.string().required("El año del personal es requerido").matches(/^[0-9]+$/, 'Debe ser un número').test('is-valid-year', 'Año inválido', (value) => {
        const num = parseInt(value || '0', 10);
        return num >= 1900;
      }),
      mes: Yup.string().required("El mes del personal es requerido").matches(/^[0-9]+$/, 'Debe ser un número').test('is-valid-month', 'Mes inválido', (value) => {
        const num = parseInt(value || '0', 10);
        return num >= 1 && num <= 12;
      }),
    })
  ),
});
*/

interface AgregarFlujoPersonalValues {
  flujo: {
    dia: number;
    mes: string;
    anio: string;
    tc?: string;
    tipoFlujo: string;
    monto?: string;
    ingresosPorDivisas?: string;
    ingresosPorPrestamos?: string;
    ingresosPorLeasing?: string;
    interesesPorInversion?: string;
    consultoria?: string;
    etps?: string;
    cts?: string;
    internet?: string;
    oficina?: string;
    celular?: string;
    factElectrica?: string;
    contabilidad?: string;
    serviciosStaff?: string;
    gestionRiesgo?: string;
    marketingComercial?: string;
    combustible?: string;
    alquilerVehiculos?: string;
    gastosExtras?: string;
    viajesEventosOtros?: string;
    itfSoles?: string;
    itfDolares?: string;
    mantSoles?: string;
    mantDolares?: string;
    interbancarioSoles?: string;
    interbancariosDolares?: string;
    interesFondosSoles?: string;
    interesFondosDolares?: string;
    serviciosFondos?: string;
    otrosGastosTotal?: string;
    impuestosDetracciones?: string;
    otrosGastos?: string;
    utilidadOperativa?: string;
    impuestos?: string;
    utilidadNeta?: string;
    flujoCaja?: string;
    capitalTrabajo?: string;
    flujoCajaLibre?: string;
  };
  personal: {
    nombre: string;
    monto: string;
    anio: string;
    mes: string;
  }[];
}

export function AgregarConsultoriaFlujo() {

  const router = useRouter();
  const { closeModal } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const anoInicioSistema = 2025;
  const opcionesAnos = generarOpcionesAnos(anoInicioSistema);

  const initialValues: AgregarFlujoPersonalValues = {
    flujo: {
      dia: 1,
      mes: "",
      anio: new Date().getFullYear().toString(),
      tc: "",
      tipoFlujo: "CONSULTORIA",
      monto: "",
      ingresosPorDivisas: "",
      ingresosPorPrestamos: "",
      ingresosPorLeasing: "",
      interesesPorInversion: "",
      consultoria: "",
      etps: "",
      cts: "",
      internet: "",
      oficina: "",
      celular: "",
      factElectrica: "",
      contabilidad: "",
      gestionRiesgo: "",
      marketingComercial: "",
      combustible: "",
      alquilerVehiculos: "",
      gastosExtras: "",
      viajesEventosOtros: "",
      itfSoles: "",
      itfDolares: "",
      mantSoles: "",
      mantDolares: "",
      interbancarioSoles: "",
      interbancariosDolares: "",
      interesFondosSoles: "",
      interesFondosDolares: "",
      serviciosStaff: "",
      serviciosFondos: "",
      otrosGastosTotal: "",
      impuestosDetracciones: "",
      otrosGastos: "",
      utilidadOperativa: "",
      impuestos: "",
      utilidadNeta: "",
      flujoCaja: "",
      capitalTrabajo: "",
      flujoCajaLibre: "",
    },
    personal: [{ nombre: "", monto: "", anio: new Date().getFullYear().toString(), mes: "1" }],
  };

  const agregarFlujoPersonal = async (values: AgregarFlujoPersonalValues): Promise<void> => {
    setLoading(true);
    console.log("Valores a enviar:", values);
    try {
      const res = await axios.post(`${config.apiUrl}/flujo-consultoria`, values, {
        withCredentials: true,
      })
      if (res.status !== 201) {
        throw new Error("Error al agregar flujo y personal");
      }
      toast.success("Flujo y personal agregado correctamente");
      router.push("/sistema/flujos/consultoria")
      closeModal();
    } catch (error) {
      console.error("Error al agregar flujo y personal:", error);
      toast.error("Error al agregar flujo y personal");
    } finally {
      setLoading(false);
    }
  };

  const { handleSubmit, handleChange, values, handleBlur, setFieldValue } =
    useFormik<AgregarFlujoPersonalValues>({
      initialValues,
      //validationSchema: AgregarFlujoPersonalSchema,
      onSubmit: agregarFlujoPersonal,
    });

  return (
    <Formik initialValues={initialValues} onSubmit={agregarFlujoPersonal} >
      <form onSubmit={handleSubmit} className="space-y-6 h-auto"  >
        <h2 className="mb-8 text-3xl font-medium text-center font_kanit text-secondary-main">
          Agregar Flujo Consultoría
        </h2>

        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-700">Información del Flujo - Consultoría</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <InputForm
                label="Día"
                name="flujo.dia"
                type="number"
                onChange={handleChange}
                onBlur={handleBlur}
                value={String(values.flujo.dia)}
              />
            </div>
            <div className="w-full">
              <label htmlFor="mes" className="text-black-800 text-sm">Mes</label>
              <select
                name="flujo.mes"
                id="mes"
                className="w-full p-2 border rounded-md outline-none placeholder:text-sm focus:border-secondary-main"
                onChange={handleChange}
                value={String(values.flujo.mes)}
              >
                <option value="">Selecciona el mes</option>
                <option value="1">Enero</option>
                <option value="2">Febrero</option>
                <option value="3">Marzo</option>
                <option value="4">Abril</option>
                <option value="5">Mayo</option>
                <option value="6">Junio</option>
                <option value="7">Julio</option>
                <option value="8">Agosto</option>
                <option value="9">Septiembre</option>
                <option value="10">Octubre</option>
                <option value="11">Noviembre</option>
                <option value="12">Diciembre</option>
              </select>

            </div>
            <div className="w-full">
              <label className="text-black-800">Año</label>
              <select
                name="flujo.anio"
                id="flujo.anio"
                value={values.flujo.anio}
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
            <div>
              <InputForm
                label="Tasa de Cambio (TC)"
                name="flujo.tc"
                type="number"
                onChange={handleChange}
                onBlur={handleBlur}
                value={String(values.flujo.tc)}
              />
            </div>
            <div>
              <InputForm
                label="Monto Total"
                name="flujo.monto"
                type="number"
                onChange={handleChange}
                onBlur={handleBlur}
                value={String(values.flujo.monto)}
                placeholder="Flujo Monto"
              />
            </div>
            <div>
              <InputForm label="Ingresos por Divisas" name="flujo.ingresosPorDivisas" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.ingresosPorDivisas)} />
            </div>
            <div>
              <InputForm label="Ingresos por Préstamos" name="flujo.ingresosPorPrestamos" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.ingresosPorPrestamos)} />
            </div>
            <div>
              <InputForm label="Ingresos por Leasing" name="flujo.ingresosPorLeasing" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.ingresosPorLeasing)} />
            </div>
            <div>
              <InputForm label="Intereses por Inversión" name="flujo.interesesPorInversion" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.interesesPorInversion)} />
            </div>
            <div>
              <InputForm label="Consultoría" name="flujo.consultoria" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.consultoria)} />
            </div>
            <div>
              <InputForm label="EPS" name="flujo.etps" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.etps)} />
            </div>
            <div>
              <InputForm label="CTS" name="flujo.cts" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.cts)} />
            </div>
            <div>
              <InputForm label="Internet" name="flujo.internet" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.internet)} />
            </div>
            <div>
              <InputForm label="Oficina" name="flujo.oficina" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.oficina)} />
            </div>
            <div>
              <InputForm label="Celular" name="flujo.celular" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.celular)} />
            </div>
            <div>
              <InputForm label="Facturación Electrónica" name="flujo.factElectrica" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.factElectrica)} />
            </div>
            <div>
              <InputForm label="Contabilidad" name="flujo.contabilidad" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.contabilidad)} />
            </div>
            <div>
              <InputForm label="Gestión de Riesgo" name="flujo.gestionRiesgo" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.gestionRiesgo)} />
            </div>
            <div>
              <InputForm label="Marketing Comercial" name="flujo.marketingComercial" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.marketingComercial)} />
            </div>
            <div>
              <InputForm label="Combustible" name="flujo.combustible" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.combustible)} />
            </div>
            <div>
              <InputForm label="Alquiler de Vehículos" name="flujo.alquilerVehiculos" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.alquilerVehiculos)} />
            </div>
            <div>
              <InputForm label="Gastos Extras" name="flujo.gastosExtras" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.gastosExtras)} />
            </div>
            <div>
              <InputForm label="Viajes, Eventos y Otros" name="flujo.viajesEventosOtros" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.viajesEventosOtros)} />
            </div>
            <div>
              <InputForm label="ITF Soles" name="flujo.itfSoles" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.itfSoles)} />
            </div>
            <div>
              <InputForm label="ITF Dólares" name="flujo.itfDolares" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.itfDolares)} />
            </div>
            <div>
              <InputForm label="Mantenimiento Soles" name="flujo.mantSoles" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.mantSoles)} />
            </div>
            <div>
              <InputForm label="Mantenimiento Dólares" name="flujo.mantDolares" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.mantDolares)} />
            </div>
            <div>
              <InputForm label="Interbancario Soles" name="flujo.interbancarioSoles" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.interbancarioSoles)} />
            </div>
            <div>
              <InputForm label="Interbancario Dólares" name="flujo.interbancariosDolares" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.interbancariosDolares)} />
            </div>
            <div>
              <InputForm label="Servicios Fondos" name="flujo.serviciosFondos" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.serviciosFondos)} disabled />
            </div>
            <div>
              <InputForm label="Interés Fondos Soles" name="flujo.interesFondosSoles" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.interesFondosSoles)} />
            </div>
            <div>
              <InputForm label="Interés Fondos Dólares" name="flujo.interesFondosDolares" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.interesFondosDolares)} />
            </div>
            <div>
              <InputForm label="Otros Gastos Totales" name="flujo.otrosGastosTotal" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.otrosGastosTotal)} disabled />
            </div>
            <div>
              <InputForm label="Impuestos y Detracciones" name="flujo.impuestosDetracciones" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.impuestosDetracciones)} />
            </div>
            <div>
              <InputForm label="Otros Gastos" name="flujo.otrosGastos" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.otrosGastos)} />
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-700">Información del Personal</h3>
          <FieldArray
            name="personal"
            render={() => (
              <div className="space-y-4">
                {values.personal.map((_, indexPersonal) => (
                  <div key={indexPersonal} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                      <InputForm
                        label={`Nombre ${indexPersonal + 1}`}
                        name={`personal.${indexPersonal}.nombre`}
                        type="text"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={String(values.personal[indexPersonal].nombre)}
                      />
                    </div>
                    <div>
                      <InputForm
                        label={`Monto ${indexPersonal + 1}`}
                        name={`personal.${indexPersonal}.monto`}
                        type="number"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={String(values.personal[indexPersonal].monto)}

                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setFieldValue('personal', values.personal.filter((item, index) => index !== indexPersonal))
                        }}
                        className="self-end"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    // push({ nombre: "aya", monto: "0", anio: new Date().getFullYear(), mes: "1" })
                    setFieldValue('personal', [
                      ...values.personal,
                      { nombre: "", monto: "0", anio: new Date().getFullYear().toString(), mes: "1" }
                    ])
                  }}
                  className="mt-2"
                >
                  <Plus className="mr-2 h-4 w-4" /> Agregar Personal
                </button>
              </div>
            )}
          />
        </div>

        <div className="flex flex-col items-center w-full gap-4 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <ButtonCancelar />
          </div>
          <div className="w-full lg:w-1/2">
            <ButtonSubmit loading={loading} text="Agregar Flujo y Personal" />
          </div>
        </div>
      </form>
    </Formik>
  );
}