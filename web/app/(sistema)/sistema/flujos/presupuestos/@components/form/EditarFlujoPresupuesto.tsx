/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { InputForm } from "@/components/form/InputForm";
import { config } from "@/config/config";
import { useAuth } from "@/context/useAuthContext";
import axios from "axios";
import { FieldArray, Formik, useFormik } from "formik";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ButtonCancelar } from "../../../../../@components/ButtonCancelar";
import { ButtonSubmit } from "../../../../../@components/ButtonSubmit";
import { generarOpcionesAnos } from "@/logic/generarOpcionesAnos";

interface EditarFlujoPersonalValues {
  id: number; // ID del flujo a editar
  flujo: {
    dia: string;
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
    personal: {
      id?: string; // ID del personal a editar
      nombre: string;
      monto: string;
      anio: string;
      mes: string;
    }[];
  };
}

export default function EditarFlujoPresupuesto({ id }: { id?: number }) {

  const router = useRouter();
  const { closeModal } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [flujoData, setFlujoData] = useState<EditarFlujoPersonalValues | null>(null)
  const anoInicioSistema = 2025;
  const opcionesAnos = generarOpcionesAnos(anoInicioSistema);

  async function obtenerFlujo() {
    const response = await axios.get(`${config.apiUrl}/flujo/${id}`, {
      withCredentials: true,
    })
    setFieldValue('id', response.data.id);
    setFieldValue('flujo.dia', String(response.data.flujo.dia));
    setFieldValue('flujo.mes', String(response.data.flujo.mes));
    setFieldValue('flujo.anio', String(response.data.flujo.anio));
    setFieldValue('flujo.tc', String(response.data.flujo.tc || ''));
    setFieldValue('flujo.tipoFlujo', response.data.flujo.tipoFlujo || '');
    setFieldValue('flujo.monto', String(response.data.flujo.monto || ''));
    setFieldValue('flujo.ingresosPorDivisas', String(response.data.flujo.ingresosPorDivisas || ''));
    setFieldValue('flujo.ingresosPorPrestamos', String(response.data.flujo.ingresosPorPrestamos || ''));
    setFieldValue('flujo.ingresosPorLeasing', String(response.data.flujo.ingresosPorLeasing || ''));
    setFieldValue('flujo.interesesPorInversion', String(response.data.flujo.interesesPorInversion || ''));
    setFieldValue('flujo.consultoria', String(response.data.flujo.consultoria || ''));
    setFieldValue('flujo.etps', String(response.data.flujo.etps || ''));
    setFieldValue('flujo.cts', String(response.data.flujo.cts || ''));
    setFieldValue('flujo.internet', String(response.data.flujo.internet || ''));
    setFieldValue('flujo.oficina', String(response.data.flujo.oficina || ''));
    setFieldValue('flujo.celular', String(response.data.flujo.celular || ''));
    setFieldValue('flujo.factElectrica', String(response.data.flujo.factElectrica || ''));
    setFieldValue('flujo.contabilidad', String(response.data.flujo.contabilidad || ''));
    setFieldValue('flujo.gestionRiesgo', String(response.data.flujo.gestionRiesgo || ''));
    setFieldValue('flujo.marketingComercial', String(response.data.flujo.marketingComercial || ''));
    setFieldValue('flujo.combustible', String(response.data.flujo.combustible || ''));
    setFieldValue('flujo.alquilerVehiculos', String(response.data.flujo.alquilerVehiculos || ''));
    setFieldValue('flujo.gastosExtras', String(response.data.flujo.gastosExtras || ''));
    setFieldValue('flujo.viajesEventosOtros', String(response.data.flujo.viajesEventosOtros || ''));
    setFieldValue('flujo.itfSoles', String(response.data.flujo.itfSoles || ''));
    setFieldValue('flujo.itfDolares', String(response.data.flujo.itfDolares || ''));
    setFieldValue('flujo.mantSoles', String(response.data.flujo.mantSoles || ''));
    setFieldValue('flujo.mantDolares', String(response.data.flujo.mantDolares || ''));
    setFieldValue('flujo.interbancarioSoles', String(response.data.flujo.interbancarioSoles || ''));
    setFieldValue('flujo.interbancariosDolares', String(response.data.flujo.interbancariosDolares || ''));
    setFieldValue('flujo.interesFondosSoles', String(response.data.flujo.interesFondosSoles || ''));
    setFieldValue('flujo.interesFondosDolares', String(response.data.flujo.interesFondosDolares || ''));
    setFieldValue('flujo.serviciosFondos', String(response.data.flujo.serviciosFondos || ''));
    setFieldValue('flujo.otrosGastosTotal', String(response.data.flujo.otrosGastosTotal || ''));
    setFieldValue('flujo.impuestosDetracciones', String(response.data.flujo.impuestosDetracciones || ''));
    setFieldValue('flujo.otrosGastos', String(response.data.flujo.otrosGastos || ''));
    setFieldValue('flujo.utilidadOperativa', String(response.data.flujo.utilidadOperativa || ''));
    setFieldValue('flujo.impuestos', String(response.data.flujo.impuestos || ''));
    setFieldValue('flujo.utilidadNeta', String(response.data.flujo.utilidadNeta || ''));
    setFieldValue('flujo.flujoCaja', String(response.data.flujo.flujoCaja || ''));
    setFieldValue('flujo.capitalTrabajo', String(response.data.flujo.capitalTrabajo || ''));
    setFieldValue('flujo.flujoCajaLibre', String(response.data.flujo.flujoCajaLibre || ''));

    // Personal
    setFieldValue('flujo.personal', response.data.flujo.personal.map((p: any) => ({
      id: p.id || "",
      nombre: p.nombre || "",
      monto: String(p.monto) || "",
      anio: String(p.anio) || new Date().getFullYear().toString(),
      mes: String(p.mes) || "1",
    })));
    console.log(response.data)
    setFlujoData(response.data)
  }
  console.log('FLUJO', flujoData)

  const initialValues: EditarFlujoPersonalValues = {
    id: Number(id),
    flujo: {
      dia: flujoData?.flujo.dia || "1",
      mes: flujoData?.flujo.mes || "1",
      anio: flujoData?.flujo?.anio || new Date().getFullYear().toString(),
      tc: flujoData?.flujo?.tc || "",
      tipoFlujo: flujoData?.flujo?.tipoFlujo || "",
      monto: flujoData?.flujo?.monto || "",
      ingresosPorDivisas: flujoData?.flujo?.ingresosPorDivisas || "",
      ingresosPorPrestamos: flujoData?.flujo.ingresosPorPrestamos || "",
      ingresosPorLeasing: flujoData?.flujo.ingresosPorLeasing || "",
      interesesPorInversion: flujoData?.flujo.interesesPorInversion || "",
      consultoria: flujoData?.flujo.consultoria || "",
      etps: flujoData?.flujo.etps || "",
      cts: flujoData?.flujo.cts || "",
      internet: flujoData?.flujo.internet || "",
      oficina: flujoData?.flujo.oficina || "",
      celular: flujoData?.flujo.celular || "",
      factElectrica: flujoData?.flujo?.factElectrica || "",
      contabilidad: flujoData?.flujo?.contabilidad || "",
      gestionRiesgo: flujoData?.flujo?.gestionRiesgo || "",
      marketingComercial: flujoData?.flujo?.marketingComercial || "",
      combustible: flujoData?.flujo?.combustible || "",
      alquilerVehiculos: flujoData?.flujo?.alquilerVehiculos || "",
      gastosExtras: flujoData?.flujo?.gastosExtras || "",
      viajesEventosOtros: flujoData?.flujo?.viajesEventosOtros || "",
      itfSoles: flujoData?.flujo?.itfSoles || "",
      itfDolares: flujoData?.flujo?.itfDolares || "",
      mantSoles: flujoData?.flujo?.mantSoles || "",
      mantDolares: flujoData?.flujo?.mantDolares || "",
      interbancarioSoles: flujoData?.flujo?.interbancarioSoles || "",
      interbancariosDolares: flujoData?.flujo?.interbancariosDolares || "",
      interesFondosSoles: flujoData?.flujo?.interesFondosSoles || "",
      interesFondosDolares: flujoData?.flujo?.interesFondosDolares || "",
      serviciosFondos: flujoData?.flujo?.serviciosFondos || "",
      otrosGastosTotal: flujoData?.flujo?.otrosGastosTotal || "",
      impuestosDetracciones: flujoData?.flujo?.impuestosDetracciones || "",
      otrosGastos: flujoData?.flujo?.otrosGastos || "",
      utilidadOperativa: flujoData?.flujo?.utilidadOperativa || "",
      impuestos: flujoData?.flujo?.impuestos || "",
      utilidadNeta: flujoData?.flujo?.utilidadNeta || "",
      flujoCaja: flujoData?.flujo?.flujoCaja || "",
      capitalTrabajo: flujoData?.flujo?.capitalTrabajo || "",
      flujoCajaLibre: flujoData?.flujo?.flujoCajaLibre || "",
      personal: flujoData?.flujo.personal?.map((p) => ({
        id: p.id || "",
        nombre: p.nombre || "",
        monto: p.monto || "",
        anio: p.anio || new Date().getFullYear().toString(),
        mes: p.mes || "1",
      })) || [],
    },
  }

  useEffect(() => {
    obtenerFlujo()
  }, [])

  const editarFlujoPersonal = async (values: EditarFlujoPersonalValues): Promise<void> => {
    setLoading(true);
    console.log("Valores a editar:", values);
    try {
      const res = await axios.post(`${config.apiUrl}/flujo/${id}`, values, {
        withCredentials: true,
      });

      if (res.status !== 200) {
        throw new Error("Error al editar flujo y personal");
      }
      toast.success("Flujo y personal editado correctamente");

      closeModal();
      router.push("/sistema/flujos/presupuestos");
    } catch (error: any) {
      console.error("Error al editar flujo y personal:", error);
      toast.error("Error al editar flujo y personal");
    } finally {
      setLoading(false);
    }
  };

  const { handleSubmit, handleChange, values, handleBlur, setFieldValue } =
    useFormik<EditarFlujoPersonalValues>({
      initialValues,
      // validationSchema: EditarFlujoPersonalSchema,
      onSubmit: editarFlujoPersonal,
    });

  return (
    <Formik initialValues={initialValues} onSubmit={editarFlujoPersonal} >
      <form onSubmit={handleSubmit} className="space-y-6 h-auto"  >
        <h2 className="mb-8 text-3xl font-medium text-center font_kanit text-secondary-main">
          Editar Flujo Presupuesto
        </h2>

        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-700">Información del Flujo - Flujo Presupuesto</h3>
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
                step={0.01}
                onChange={handleChange}
                onBlur={handleBlur}
                value={String(values.flujo.tc)}
              />
            </div>
            <div>
              <InputForm
                label="Tipo de Flujo"
                name="flujo.tipoFlujo"
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}

                value={values.flujo.tipoFlujo}
                disabled
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
                step={0.01}
              />
            </div>
            <div>
              <InputForm label="Ingresos por Divisas" name="flujo.ingresosPorDivisas" type="number" step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.ingresosPorDivisas)} />
            </div>
            <div>
              <InputForm label="Ingresos por Préstamos" name="flujo.ingresosPorPrestamos" type="number" step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.ingresosPorPrestamos)} />
            </div>
            <div>
              <InputForm label="Ingresos por Leasing" name="flujo.ingresosPorLeasing" type="number" step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.ingresosPorLeasing)} />
            </div>
            <div>
              <InputForm label="Intereses por Inversión" name="flujo.interesesPorInversion" type="number" step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.interesesPorInversion)} />
            </div>
            <div>
              <InputForm label="Consultoría" name="flujo.consultoria" type="number" step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.consultoria)} />
            </div>
            <div>
              <InputForm label="EPS" name="flujo.etps" type="number" step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.etps)} />
            </div>
            <div>
              <InputForm label="CTS" name="flujo.cts" type="number" step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.cts)} />
            </div>
            <div>
              <InputForm label="Internet" name="flujo.internet" type="number" step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.internet)} />
            </div>
            <div>
              <InputForm label="Oficina" name="flujo.oficina" type="number" step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.oficina)} />
            </div>
            <div>
              <InputForm label="Celular" name="flujo.celular" type="number" step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.celular)} />
            </div>
            <div>
              <InputForm label="Facturación Electrónica" name="flujo.factElectrica" step={0.01} type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.factElectrica)} />
            </div>
            <div>
              <InputForm label="Contabilidad" name="flujo.contabilidad" type="number" onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.contabilidad)} />
            </div>
            <div>
              <InputForm label="Gestión de Riesgo" name="flujo.gestionRiesgo" type="number" step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.gestionRiesgo)} />
            </div>
            <div>
              <InputForm label="Marketing Comercial" name="flujo.marketingComercial" type="number" step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.marketingComercial)} />
            </div>
            <div>
              <InputForm label="Combustible" name="flujo.combustible" type="number" step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.combustible)} />
            </div>
            <div>
              <InputForm label="Alquiler de Vehículos" name="flujo.alquilerVehiculos" type="number" step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.alquilerVehiculos)} />
            </div>
            <div>
              <InputForm label="Gastos Extras" name="flujo.gastosExtras" type="number" step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.gastosExtras)} />
            </div>
            <div>
              <InputForm label="Viajes, Eventos y Otros" name="flujo.viajesEventosOtros" type="number" step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.viajesEventosOtros)} />
            </div>
            <div>
              <InputForm label="ITF Soles" name="flujo.itfSoles" type="number" step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.itfSoles)} />
            </div>
            <div>
              <InputForm label="ITF Dólares" name="flujo.itfDolares" type="number" step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.itfDolares)} />
            </div>
            <div>
              <InputForm label="Mantenimiento Soles" name="flujo.mantSoles" type="number" step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.mantSoles)} />
            </div>
            <div>
              <InputForm label="Mantenimiento Dólares" name="flujo.mantDolares" type="number" step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.mantDolares)} />
            </div>
            <div>
              <InputForm label="Interbancario Soles" name="flujo.interbancarioSoles" type="number" step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.interbancarioSoles)} />
            </div>
            <div>
              <InputForm label="Interbancario Dólares" name="flujo.interbancariosDolares" type="number" step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.interbancariosDolares)} />
            </div>
            <div>
              <InputForm label="Servicios Fondos" name="flujo.serviciosFondos" type="number" step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.serviciosFondos)} disabled />
            </div>
            <div>
              <InputForm label="Interés Fondos Soles" name="flujo.interesFondosSoles" type="number" step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.interesFondosSoles)} />
            </div>
            <div>
              <InputForm label="Interés Fondos Dólares" name="flujo.interesFondosDolares" type="number" step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.interesFondosDolares)} />
            </div>
            <div>
              <InputForm label="Otros Gastos Totales" name="flujo.otrosGastosTotal" type="number" step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.otrosGastosTotal)} disabled />
            </div>
            <div>
              <InputForm label="Impuestos y Detracciones" name="flujo.impuestosDetracciones" type="number" step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.impuestosDetracciones)} />
            </div>
            <div>
              <InputForm label="Otros Gastos" name="flujo.otrosGastos" type="number" step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.otrosGastos)}  />
            </div>
            <div>
              <InputForm label="Utilidad Operativa" name="flujo.utilidadOperativa" type="number" disabled step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.utilidadOperativa)} />
            </div>
            <div>
              <InputForm label="Impuestos" name="flujo.impuestos" type="number" step={0.01} disabled onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.impuestos)} placeholder="hola" />
            </div>
            <div>
              <InputForm label="Utilidad Neta" name="flujo.utilidadNeta" type="number" step={0.01} disabled onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.utilidadNeta)} />
            </div>
            <div>
              <InputForm label="Flujo de Caja" name="flujo.flujoCaja" type="number" step={0.01} disabled onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.flujoCaja)} />
            </div>
            <div>
              <InputForm label="Capital de Trabajo" name="flujo.capitalTrabajo" type="number" disabled step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.capitalTrabajo)} />
            </div>
            <div>
              <InputForm label="Flujo de Caja Libre" name="flujo.flujoCajaLibre" type="number" disabled step={0.01} onChange={handleChange} onBlur={handleBlur} value={String(values.flujo.flujoCajaLibre)} />
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-700">Información del Personal</h3>
          <FieldArray
            name="flujo.personal"
            render={() => (
              <div className="space-y-4">
                {values.flujo.personal.map((_, indexPersonal) => (
                  <div key={indexPersonal} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                      <InputForm
                        label={`Nombre ${indexPersonal + 1}`}
                        name={`flujo.personal.${indexPersonal}.nombre`}
                        type="text"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={String(values.flujo.personal[indexPersonal].nombre)}
                      />
                    </div>
                    <div>
                      <InputForm
                        label={`Monto ${indexPersonal + 1}`}
                        name={`flujo.personal.${indexPersonal}.monto`}
                        type="number"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={String(values.flujo.personal[indexPersonal].monto)}
                        step={0.01}
                      />
                    </div>
                    <div>
                      <InputForm
                        label={`Año ${indexPersonal + 1}`}
                        name={`flujo.personal.${indexPersonal}.anio`}
                        type="number"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={String(values.flujo.personal[indexPersonal].anio)}
                        step={0.01}
                      />
                    </div>
                    <div>
                      <InputForm
                        label={`Mes ${indexPersonal + 1}`}
                        name={`flujo.personal.${indexPersonal}.mes`}
                        type="number"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={String(values.flujo.personal[indexPersonal].mes)}
                        step={0.01}
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setFieldValue('flujo.personal', values.flujo.personal.filter((item, index) => index !== indexPersonal))
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
                    setFieldValue('flujo.personal', [
                      ...values.flujo.personal,
                      { nombre: "", monto: "0", anio: new Date().getFullYear().toString(), mes: "1" }
                    ])
                  }}
                  className="mt-2"
                >
                  <Plus className="mr-2 h-4 w-4" /> Agregar Trabajador
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
            <ButtonSubmit loading={loading} text="Editar Flujo y Personal" />
          </div>
        </div>
      </form>
    </Formik>
  );
}