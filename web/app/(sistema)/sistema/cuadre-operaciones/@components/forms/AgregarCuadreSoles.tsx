/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Errors } from "@/components/Errors";
import { InputForm } from "@/components/form/InputForm";
import { config } from "@/config/config";
import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ButtonCancelar } from "../../../../@components/ButtonCancelar";
import { ButtonSubmit } from "../../../../@components/ButtonSubmit";
import { useAuth } from "@/context/useAuthContext";
import { AgregarCuadreSolesSchema } from "../schemas/CuadreOperacionesSchema";
import SubirDatosExcel from "./excel/SubirDatosExcel";
import { formatoFecha } from "@/libs/formateadorFecha";

export const AgregarCuadreSoles = () => {
  const { selectedRow, closeModal, setDatosOperaciones, datosOperaciones } =
    useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [solesCuadresAcumulados, setSolesCuadresAculumados] =
    useState<number>(0);

  const [valorAproximacion] = useState<number | null>(
    selectedRow?.diferencia_pen
  );

  const [rowExcelSelected, setRowExcelSelected] = useState<any>({
    'Fecha': '',
    'Descripción operación': "",
    'Monto': 0,
    'Referencia2': "",
  });


  const headers = [
    { key: "Fecha", title: "Fecha", id: 1 },
    { key: "Descripción operación", title: "Descripción", id: 2 },
    { key: "Monto", title: "Monto", id: 3 },
    { key: "Referencia2", title: "Referencia", id: 4 },
  ];

  const agregarCliente = async (): Promise<void> => {
    try {
      setLoading(true);
      const { status } = await axios.post(
        `${config.apiUrl}/operaciones/agregarCuadreOpSoles`,
        {
          ...values,
          operacionId: selectedRow?.operacionId ?? "",
          monto_pen: Number(values.monto_pen),
        },
        {
          withCredentials: true,
        }
      );

      if (status === 201) {
        setDatosOperaciones((prev) =>
          prev.filter((item) => item !== rowExcelSelected)
        );

        const nuevosDatos = datosOperaciones.filter(
          (item: any) => item !== rowExcelSelected
        );
        localStorage.setItem("datosExcel", JSON.stringify(nuevosDatos));

        setRowExcelSelected(null);
        closeModal();
        router.push("/sistema/cuadre-operaciones?page=1");
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
    handleSubmit,
    handleChange,
    errors,
    values,
    touched,
    handleBlur,
    setFieldValue,
  } = useFormik({
    initialValues: {
      fecha_pen: "",
      descripcion_op_pen: "",
      monto_pen: 0,
      referencia_pen: "",
      diferencia_pen: "",
    },
    validationSchema: AgregarCuadreSolesSchema,
    onSubmit: agregarCliente,
  });

  useEffect(() => {
    if (selectedRow && selectedRow.soles) {
      const total =
        solesCuadresAcumulados + (Math.abs(Number(values.monto_pen)) - Math.abs(selectedRow.soles));
      setFieldValue("diferencia_pen", Number(total.toFixed(2)));
    }
  }, [values.monto_pen, selectedRow, setFieldValue, solesCuadresAcumulados]);

  useEffect(() => {
    if (selectedRow?.cuadreSolesAll && selectedRow.cuadreSolesAll.length > 0) {
      const sumatoria = selectedRow.cuadreSolesAll.reduce(
        (acc: any, val: any) => acc + val.monto_pen,
        0
      );

      setSolesCuadresAculumados(sumatoria);
    }
  }, [selectedRow.cuadreSolesAll]);

  useEffect(() => {
    if (rowExcelSelected) {
      setFieldValue(
        "fecha_pen",
        rowExcelSelected['Fecha']
      );
      setFieldValue("descripcion_op_pen", rowExcelSelected['Descripción operación']);
      setFieldValue("monto_pen", rowExcelSelected['Monto']);
      setFieldValue("referencia_pen", rowExcelSelected['Referencia2']);
    }
  }, [rowExcelSelected, setFieldValue]);

  return (
    <>
      <h2 className="mb-8 text-3xl font-medium text-center font_kanit text-secondary-main">
        Agregar cuadre operación soles
      </h2>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="grid w-full gap-5 lg:grid-cols-2">
          <div className="w-full">
            <div className="grid grid-cols-1 mb-5 gap-x-4 gap-y-6 md:grid-cols-3">
              <div className="w-full">
                <InputForm
                  label="Fecha"
                  name="fecha"
                  placeholder="Fecha"
                  type="date"
                  disabled
                  value={
                    new Date(selectedRow?.fecha).toISOString().split("T")[0]
                  }
                />
              </div>
              <div className="w-full">
                <InputForm
                  label="Cliente"
                  name="cliente"
                  placeholder="Cliente"
                  type="text"
                  disabled
                  value={selectedRow?.cliente}
                />
              </div>
              <div className="w-full">
                <InputForm
                  label="Tipo"
                  name="tipo"
                  placeholder="Tipo"
                  type="text"
                  disabled
                  value={selectedRow?.tipo}
                />
              </div>
              <div className="w-full">
                <InputForm
                  label="TC Compra"
                  name="tc_compra"
                  placeholder="TC Compra"
                  type="text"
                  disabled
                  value={selectedRow?.tc_compra}
                />
              </div>
              <div className="w-full">
                <InputForm
                  label="TC Venta"
                  name="tc_venta"
                  placeholder="TC Venta"
                  type="text"
                  disabled
                  value={selectedRow?.tc_venta}
                />
              </div>
              <div className="w-full">
                <InputForm
                  label="Dólares"
                  name="dolares"
                  placeholder="Dólares"
                  type="text"
                  disabled
                  value={selectedRow?.dolares}
                />
              </div>
              <div className="w-full">
                <InputForm
                  label="Soles"
                  name="soles"
                  placeholder="Soles"
                  type="text"
                  disabled
                  value={selectedRow?.soles}
                />
              </div>

              {/* PEN */}
              <div className="w-full">
                <InputForm
                  label="Fecha PEN"
                  name="fecha_pen"
                  placeholder="Fecha PEN"
                  type="text"
                  disabled
                  value={values.fecha_pen}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Errors errors={errors.fecha_pen} touched={touched.fecha_pen} />
              </div>
              <div className="w-full">
                <InputForm
                  label="Descripción PEN"
                  name="descripcion_op_pen"
                  placeholder="Descripción PEN"
                  type="text"
                  disabled
                  value={values.descripcion_op_pen}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Errors
                  errors={errors.descripcion_op_pen}
                  touched={touched.descripcion_op_pen}
                />
              </div>
              <div className="w-full">
                <InputForm
                  label="Monto PEN"
                  name="monto_pen"
                  placeholder="Monto PEN"
                  type="number"
                  disabled
                  value={String(values.monto_pen)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Errors errors={errors.monto_pen} touched={touched.monto_pen} />
              </div>
              <div className="w-full">
                <InputForm
                  label="Referencia PEN"
                  name="referencia_pen"
                  placeholder="Referencia PEN"
                  type="text"
                  disabled
                  value={values.referencia_pen}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Errors
                  errors={errors.referencia_pen}
                  touched={touched.referencia_pen}
                />
              </div>
              <div className="w-full">
                <InputForm
                  label="Diferencia PEN"
                  name="diferencia_pen"
                  placeholder="Diferencia PEN"
                  type="number"
                  disabled
                  value={values.diferencia_pen}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Errors
                  errors={errors.diferencia_pen}
                  touched={touched.diferencia_pen}
                />
              </div>
            </div>
            {selectedRow?.cuadreSolesAll?.length > 0 && (
              <div className="p-4 mt-4 bg-white border border-gray-200 shadow-sm rounded-xl">
                <h3 className="mb-3 text-lg font-semibold text-gray-800">
                  Aproximaciones
                </h3>
                <div className="space-y-2">
                  {(() => {
                    let current = Number(selectedRow.soles);
                    return selectedRow.cuadreSolesAll.map(
                      (item: any, index: number) => {
                        const previous = current;
                        current = current + Number(item.monto_pen);
                        return (
                          <div
                            key={`aproximaciones${item.id}`}
                            className="flex justify-between text-sm text-gray-700"
                          >
                            <span className="font-medium">
                              {index + 1}° Cuadre:
                            </span>
                            <p>
                              {previous.toFixed(2)} +{" "}
                              <span className="font-bold">
                                {Number(item.monto_pen).toFixed(2)}
                              </span>
                            </p>
                            <span className="block min-w-[62px] text-right font-semibold text-blue-600">
                              = {current.toFixed(2)}
                            </span>
                          </div>
                        );
                      }
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
          <div className="w-full">
            {selectedRow?.cuadreSolesAll?.length > 0 && (
              <>
                <p className="mb-2 font-bold text-secondary-main">
                  Cuadres registrados anteriormente
                </p>
                <div className="grid w-full grid-cols-4 mb-2 font-bold">
                  <p>Fecha</p>
                  <p>Descripción</p>
                  <p>Monto</p>
                  <p>Referencia</p>
                </div>
                {selectedRow.cuadreSolesAll.map((item: any) => (
                  <div
                    className="grid w-full grid-cols-4 mb-5 gap-y-1 text-black-900"
                    key={`CuadreRegistradosSoles${item.id}`}
                  >
                    <p>{formatoFecha(item.fecha_pen)}</p>
                    <p>{item.descripcion_op_pen}</p>
                    <p>{item.monto_pen}</p>
                    <p>{item.referencia_pen}</p>
                  </div>
                ))}
              </>
            )}
            <div className="w-full max-h-[410px] overflow-y-auto">
              <SubirDatosExcel
                setData={setDatosOperaciones}
                headers={headers}
                textAlert="Selecciona un registro para realizar el cuadre "
                rowExcelSelected={rowExcelSelected}
                setRowExcelSelected={setRowExcelSelected}
                fechaKey="fecha"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center w-full gap-4 mt-4 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <ButtonCancelar />
          </div>
          <div className="w-full lg:w-1/2">
            <ButtonSubmit
              loading={loading}
              text="Agregar cuadre"
              disabled={valorAproximacion === 0}
            />
          </div>
        </div>
      </form>
    </>
  );
};
