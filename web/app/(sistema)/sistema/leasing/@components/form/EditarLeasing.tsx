/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { config } from "@/config/config";
import { useAuth } from "@/context/useAuthContext";
import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
// import { AgregarLeasingSchema } from "../schema/AgregarLeasingSchema";
import { calcularDiasEntreFechas } from "../logic/calcularDiferenciaEntreFechas";
import { BusquedaCliente } from "../../../@componentes/form/BusquedaCliente";
import { Errors } from "@/components/Errors";
import { InputForm } from "@/components/form/InputForm";
import { ButtonCancelar } from "../../../../@components/ButtonCancelar";
import { ButtonSubmit } from "../../../../@components/ButtonSubmit";

export default function EditarLeasing() {
  const [loading, setLoading] = useState<boolean>(false);
  const { closeModal, selectedRow } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [usuario, setUsuario] = useState<any>(null);

  console.log(selectedRow);

  async function editarLeasing(): Promise<void> {
    setLoading(true);
    try {
      const { status, data } = await axios.post(
        `${config.apiUrl}/leasing/${selectedRow.id}`,
        {
          ...values,
          usuarioId: selectedRow.usuarioId,
        },
        {
          withCredentials: true,
        }
      );

      if (status === 200) {
        console.log(data.prestamo);
        closeModal();
        router.push(
          `/sistema/leasing${searchParams.toString() ? `?${searchParams.toString()}` : ""
          }`
        );
        toast.success("Editado correctamente");
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

  async function buscarCliente() {
    try {
      const response = await axios.get(
        `${config.apiUrl}/user/cliente/${selectedRow.usuarioId}`
      );
      console.log(response.data);
      setUsuario(response.data.usuario);
    } catch (error) {
      console.error("Error buscando clientes:", error);
    }
  }

  useEffect(() => {
    buscarCliente();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
  }, []);

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
      codSer: selectedRow.codSer,
      documento: selectedRow.documento ?? "",
      tipo_documento: selectedRow.tipo_documento ?? "",
      numero: selectedRow.numero,
      precio: selectedRow.precio,
      fecha_inicial: selectedRow.fecha_inicial,
      fecha_final: selectedRow.fecha_final,
      dias: selectedRow.dias,
      estatus: selectedRow.estatus,
      cobroTotal: selectedRow.cobroTotal,
      tc: selectedRow.tc,
      factura: "",
      tipo: selectedRow.tipo,
      codigoFacturaBoletaAnulado: '',
      codigoFacturaBoleta: selectedRow.codigoFacturaBoleta
    },
    // validationSchema: AgregarLeasingSchema,
    onSubmit: editarLeasing,
  });

  useEffect(() => {
    if (usuario) {
      console.log("renderizo");
      setFieldValue("usuarioId", usuario.id ?? "");
      setFieldValue("documento", usuario.documento ?? "");
      setFieldValue("tipo_documento", usuario.tipo_documento ?? "");
      setFieldValue("tipo", usuario.tipo_cliente === 'persona_juridica' ? 'FACTURA' : 'BOLETA');
    }
  }, [setFieldValue, usuario]);

  useEffect(() => {
    if (values.fecha_inicial === "" || values.fecha_final === "") return;
    setFieldValue(
      "dias",
      calcularDiasEntreFechas(values.fecha_inicial, values.fecha_final)
    );
  }, [values.fecha_inicial, values.fecha_final, setFieldValue]);

  useEffect(() => {
    if (!values.precio || !values.numero) return;
    setFieldValue("cobroTotal", values.precio * values.numero);
  }, [values.precio, values.numero, setFieldValue]);

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
          Editar Leasing
        </h2>
        <div className="w-full">
          <div className="grid grid-cols-1 mb-5 gap-x-4 gap-y-6 md:grid-cols-3">
            <div className="w-full">
              <BusquedaCliente
                setUsuario={setUsuario}
                usuarioBuscado={usuario}
              />
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
                value={
                  usuario && usuario.tipo_documento
                    ? usuario.tipo_documento
                    : ""
                }
                className="uppercase"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors
                errors={errors.tipo_documento}
                touched={touched.tipo_documento}
              />
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
            <div className="w-full">
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
                value={values.codSer}
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
                  values.fecha_inicial
                    ? values.fecha_inicial.toString().split("T")[0]
                    : ""
                }
                className=""
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors
                errors={errors.fecha_inicial}
                touched={touched.fecha_inicial}
              />
            </div>
            <div className="w-full">
              <InputForm
                label="Fecha Final"
                name="fecha_final"
                placeholder="Fecha Final"
                type="date"
                value={
                  values.fecha_final
                    ? values.fecha_final.toString().split("T")[0]
                    : ""
                }
                className=""
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors
                errors={errors.fecha_final}
                touched={touched.fecha_final}
              />
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
              <label className="text-black-800">Estado Leasing</label>
              <select
                name="estatus"
                id=""
                value={values.estatus}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-2 border rounded-md outline-none placeholder:text-sm focus:border-secondary-main"
              >
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="A PLAZO">A PLAZO</option>
                <option value="PAGADO">PAGADO</option>
              </select>

              <Errors errors={errors.tipo} touched={touched.tipo} />
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
              <label className="text-black-800">
                Estado de la Factura o Boleta
              </label>
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
              <ButtonSubmit loading={loading} text="Editar Leasing" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
