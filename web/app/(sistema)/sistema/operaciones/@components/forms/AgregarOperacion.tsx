/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Errors } from "@/components/Errors";
import { InputForm } from "@/components/form/InputForm";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { registroOperacionSchema } from "../SchemasOperaciones";
import { BusquedaCliente } from "../../../@componentes/form/BusquedaCliente";
import axios, { AxiosError } from "axios";
import { useAuth } from "@/context/useAuthContext";
import { config } from "@/config/config";
import { toast } from "sonner";
import { ButtonCancelar } from "../../../../@components/ButtonCancelar";
import { ButtonSubmit } from "../../../../@components/ButtonSubmit";
import { useRouter } from "next/navigation";

export const AgregarOperacion = () => {
  const [usuario, setUsuario] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [ultimaOperacion, setUltimaOperacion] = useState<any>({});
  const { closeModal } = useAuth();
  const router = useRouter();

  const obtenerUltimaOperacion = async () => {
    try {
      const request = await axios.get(
        `${config.apiUrl}/operaciones/ultimaOperacion`
      );
      setUltimaOperacion(request.data.ultimaOperacion);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerUltimaOperacion();
  }, []);


  const agregarOperacion = async (): Promise<void> => {
    setLoading(true);

    try {
      const { status, data } = await axios.post(
        `${config.apiUrl}/operaciones/agregar`,
        {
          ...values,
          dolares: parseFloat(values.dolares),
          compra: Number(values.compra),
          venta: Number(values.venta),
          spread: Number(values.spread),
          promedio: Number(values.promedio),
          compraUSD: values.movimiento_compraUSD,
          ventaUSD: values.movimiento_ventaUSD,
          montoPEN: Number(values.montoPEN),
        },
        {
          withCredentials: true,
        }
      );

      if (status === 201) {
        console.log(data);
        closeModal();
        router.push("/sistema/operaciones?page=1");
        toast.success("Creado correctamente");
      }
    } catch (error) {
      console.log("Error: ", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error);
      }
    }

    setLoading(false);
  };

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    touched,
    handleBlur,
    setFieldValue,
  } = useFormik({
    initialValues: {
      fecha: new Date().toISOString().split("T")[0],
      numero: "",
      usuarioId: "",
      tipo: "",
      dolares: "",
      t: "",

      // Tipo de Cambio
      compra: 0,
      venta: 0,
      spread: "",
      promedio: "",

      // Flujo de Fondos
      montoUSD: "",
      montoPEN: "",

      // Movimiento Fondos
      movimiento_compraUSD: "",
      movimiento_ventaUSD: "",
    },
    validationSchema: registroOperacionSchema, // asegúrate de importar el schema que ya hicimos
    onSubmit: agregarOperacion,
  });

  useEffect(() => {
    if (ultimaOperacion) {
      setFieldValue("compra", Number(ultimaOperacion?.tipoCambio?.compra));
      setFieldValue("venta", Number(ultimaOperacion?.tipoCambio?.venta));
    }
  }, [setFieldValue, ultimaOperacion]);


  useEffect(() => {
    if (usuario) {
      setFieldValue("usuarioId", usuario.id);
      setFieldValue("documento", usuario.documento);
      setFieldValue("t", usuario.tipo_cliente === "persona_juridica" ? "2" : "1");
    }
  }, [setFieldValue, usuario]);

  useEffect(() => {
    const compra = Number(values.compra);
    const venta = Number(values.venta);

    if (!isNaN(compra) && !isNaN(venta)) {
      setFieldValue("spread", venta - compra);
      setFieldValue("promedio", (venta + compra) / 2);
    }
  }, [values.compra, values.venta, setFieldValue]);

  useEffect(() => {
    if (values.tipo === "COMPRA") {
      setFieldValue("montoUSD", values.dolares);
      setFieldValue(
        "montoPEN",
        -values.dolares * Number(values.compra)
      );
      setFieldValue("movimiento_compraUSD", values.dolares);
      setFieldValue("movimiento_ventaUSD", 0);
    }
    if (values.tipo === "VENTA") {
      setFieldValue("montoUSD", -values.dolares);
      setFieldValue(
        "montoPEN",
        Number(values.dolares) * Number(values.venta)
      );
      setFieldValue("movimiento_compraUSD", 0);
      setFieldValue("movimiento_ventaUSD", values.dolares);
    }
  }, [values.tipo, values.dolares, setFieldValue, values.compra, values.venta]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2 className="mb-8 text-3xl font-medium text-center font_kanit text-secondary-main">
          Agregar operación
        </h2>
        <div className="w-full ">
          <div className="grid grid-cols-1 mb-5 gap-x-4 gap-y-6 md:grid-cols-3">
            <div className="w-full">
              <InputForm
                label="Fecha"
                name="fecha"
                placeholder="Fecha"
                type="date"
                value={
                  values.fecha ? values.fecha.toString().split("T")[0] : ""
                }
                className=""
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.fecha} touched={touched.fecha} />
            </div>
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
                label="T"
                name="t"
                placeholder="T"
                type="text"
                
                value={values.t}
                className=""
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <Errors errors={errors.t} touched={touched.t} />
            </div>
            <div className="w-full">
              <label className="text-black-800">Tipo</label>
              <select
                name="tipo"
                id=""
                value={values.tipo}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-2 border rounded-md outline-none placeholder:text-sm focus:border-secondary-main"
              >
                <option value="">Selecciona una opción</option>
                <option value="COMPRA">Compra</option>
                <option value="VENTA">Venta</option>
              </select>

              <Errors errors={errors.tipo} touched={touched.tipo} />
            </div>
            <div className="w-full">
              <InputForm
                label="Dólares"
                name="dolares"
                placeholder="Cantidad de dólares"
                type="number"
                value={values.dolares}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <Errors errors={errors.dolares} touched={touched.dolares} />
            </div>
            <div className="w-full">
              <InputForm
                label="Compra"
                name="compra"
                placeholder="Compra"
                type="text"
                step={0.0000}
                value={String(values.compra) || ''}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <Errors errors={errors.compra} touched={touched.compra} />
            </div>
            <div className="w-full">
              <InputForm
                label="Venta"
                name="venta"
                placeholder="Venta"
                type="text"
                step={0.0000}
                value={String(values.venta) || ''}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <Errors errors={errors.venta} touched={touched.venta} />
            </div>
            <div className="w-full">
              <InputForm
                label="Spread"
                name="spread"
                disabled
                placeholder="spread"
                type="number"
                value={values.spread}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <Errors errors={errors.spread} touched={touched.spread} />
            </div>
            <div className="w-full">
              <InputForm
                label="Promedio"
                name="promedio"
                disabled
                placeholder="promedio"
                type="number"
                value={values.promedio}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <Errors errors={errors.promedio} touched={touched.promedio} />
            </div>
            <div className="w-full">
              <InputForm
                label="Monto $"
                name="montoUSD"
                disabled
                placeholder="Monto $"
                type="number"
                value={values.montoUSD}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <Errors errors={errors.montoUSD} touched={touched.montoUSD} />
            </div>
            <div className="w-full">
              <InputForm
                label="Monto S"
                name="montoPEN"
                disabled
                placeholder="Monto S"
                type="number"
                value={values.montoPEN}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <Errors errors={errors.montoPEN} touched={touched.montoPEN} />
            </div>
            <div className="w-full">
              <InputForm
                label="Movimiento Compra"
                name="movimiento_compraUSD"
                disabled
                placeholder="Movimiento Compra USD"
                type="number"
                value={values.movimiento_compraUSD}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <Errors
                errors={errors.movimiento_compraUSD}
                touched={touched.movimiento_compraUSD}
              />
            </div>
            <div className="w-full">
              <InputForm
                label="Movimiento Venta USD"
                name="movimiento_ventaUSD"
                disabled
                placeholder="Movimiento Venta USD"
                type="number"
                value={values.movimiento_ventaUSD}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <Errors
                errors={errors.movimiento_ventaUSD}
                touched={touched.movimiento_ventaUSD}
              />
            </div>

          </div>
          <div className="flex flex-col items-center w-full gap-4 mt-4 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <ButtonCancelar />
            </div>
            <div className="w-full lg:w-1/2">
              <ButtonSubmit loading={loading} text="Agregar operación" />
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
