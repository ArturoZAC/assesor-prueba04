"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/context/useAuthContext";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AgregarPrestamoSchema } from "../schemas/AgregarPrestamoSchema";
import { InputForm } from "@/components/form/InputForm";
import { Errors } from "@/components/Errors";
import { BusquedaCliente } from "../../../@componentes/form/BusquedaCliente";
import { calcularDiferenciaDias } from "../logic/sacarDias";
import { config } from "@/config/config";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { ButtonCancelar } from "../../../../@components/ButtonCancelar";
import { ButtonSubmit } from "../../../../@components/ButtonSubmit";

export default function AgregarPrestamo() {
  const [loading, setLoading] = useState<boolean>(false);
  const { closeModal } = useAuth();
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>();

  async function savePrestamo(): Promise<void> {
    if (loading) return;
    setLoading(true);
    try {
      const { status, data } = await axios.post(`${config.apiUrl}/prestamos`, values, {
        withCredentials: true,
      });

      if (status === 201) {
        console.log(data.prestamo);
        closeModal();
        router.push("/sistema/prestamos?page=1");
        toast.success("Creado correctamente");
      }
    } catch (error) {
      console.log("Error: ", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error);
      }
    } finally {
      setLoading(false);
    }
  }

  const { values, errors, touched, setFieldValue, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        usuarioId: "",
        documento: "",
        tipo_documento: "",
        capital_soles: 0,
        capital_dolares: 0,
        moneda: "",
        tasaInicial: 0,
        tasa: 0,
        devolucion: "",
        fechaInicial: "",
        dias: 0,
        tc: 0,
        cuadre: "",
        factura: "",
        esAntiguo: false,
        numero_prestamo: "",
        tipo: "boleta",
        codigoFacturaBoleta: "",
      },
      validationSchema: AgregarPrestamoSchema,
      onSubmit: savePrestamo,
    });

  useEffect(() => {
    if (usuario) {
      console.log(usuario.tipo_cliente);
      setFieldValue("usuarioId", usuario.id);
      setFieldValue("documento", usuario.documento);
      setFieldValue("tipo_documento", usuario.tipo_cliente === "persona_juridica" ? "RUC" : "DNI");
      setFieldValue("tipo", usuario.tipo_cliente === "persona_juridica" ? "factura" : "boleta");
    }
  }, [setFieldValue, usuario]);

  useEffect(() => {
    if (values.moneda === "PEN") {
      setFieldValue("capital_dolares", 0);
    }
    if (values.moneda === "USD") {
      setFieldValue("capital_soles", 0);
    }
  }, [values.moneda, setFieldValue]);

  useEffect(() => {
    setFieldValue("dias", calcularDiferenciaDias(values.fechaInicial, values.devolucion));
  }, [values.devolucion, setFieldValue, values.fechaInicial]);

  useEffect(() => {
    const nuevaTasa = parseFloat(String((values.tasaInicial / 100) * 1.18 * 100));
    setFieldValue("tasa", nuevaTasa);
  }, [values.tasaInicial, setFieldValue]);

  useEffect(() => {
    setFieldValue("numero_prestamo", "");
  }, [values.esAntiguo, setFieldValue]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2 className="mb-8 text-3xl font-medium text-center font_kanit text-secondary-main">
          Agregar Préstamo
        </h2>
        <div className="w-full">
          <div className="grid grid-cols-1 mb-5 gap-x-4 gap-y-6 md:grid-cols-3">
            <div className="w-full">
              <BusquedaCliente setUsuario={setUsuario} />
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
            </div>
            <div className="w-full">
              <InputForm
                label="Tipo de Documento"
                name="tipo_documento"
                placeholder="Tipo de Documento"
                type="text"
                disabled
                value={
                  usuario && usuario.tipo_documento
                    ? values.tipo_documento === "persona_juridica"
                      ? "RUC"
                      : "DNI"
                    : ""
                }
                className="uppercase"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="w-full">
              <InputForm
                label="Numero Prestamo"
                name="numero_prestamo"
                placeholder="Numero Prestamo"
                type="text"
                value={values.numero_prestamo}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={!values.esAntiguo}
              />
              <Errors errors={errors.numero_prestamo} touched={touched.numero_prestamo} />
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
                disabled={values.moneda === "USD" || values.moneda === ""}
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
                disabled={values.moneda === "PEN" || values.moneda === ""}
              />
              <Errors errors={errors.capital_dolares} touched={touched.capital_dolares} />
            </div>
            <div className="w-full">
              <InputForm
                label="Fecha de Registro"
                name="fechaInicial"
                placeholder="Fecha de Registro"
                type="date"
                value={values.fechaInicial ? values.fechaInicial.toString().split("T")[0] : ""}
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
                value={values.devolucion ? values.devolucion.toString().split("T")[0] : ""}
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
            <div className="w-full">
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
            <div className="w-full">
              <InputForm
                label="Tasa Calculada"
                name="tasa"
                placeholder="Tasa Calculada"
                type="number"
                step={0.01}
                disabled
                value={Number(values.tasa).toFixed(2)}
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
                <option value="boleta">BOLETA</option>
                <option value="factura">FACTURA</option>
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
            <div className="w-full flex flex-col gap-2 items-start">
              <label className="text-black-800">Es Antiguo?</label>
              <input
                type="checkbox"
                name="esAntiguo"
                checked={values.esAntiguo}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-col items-center w-full gap-4 mt-4 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <ButtonCancelar />
            </div>
            <div className="w-full lg:w-1/2">
              <ButtonSubmit loading={loading} text="Agregar prestamo" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
