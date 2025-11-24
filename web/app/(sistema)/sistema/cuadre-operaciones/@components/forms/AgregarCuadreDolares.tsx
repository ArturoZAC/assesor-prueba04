/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { InputForm } from "@/components/form/InputForm";
import React, { useEffect, useState } from "react";
import { ButtonCancelar } from "../../../../@components/ButtonCancelar";
import { ButtonSubmit } from "../../../../@components/ButtonSubmit";
import { useFormik } from "formik";
import { Errors } from "@/components/Errors";
import axios, { AxiosError } from "axios";
import { config } from "@/config/config";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AgregarCuadreDolaresSchema } from "../schemas/CuadreOperacionesSchema";
import { useAuth } from "@/context/useAuthContext";
import SubirDatosExcel from "./excel/SubirDatosExcel";
import { formatoFecha } from "@/libs/formateadorFecha";

export const AgregarCuadreDolares = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { selectedRow, closeModal, setDatosOperaciones, datosOperaciones } =
    useAuth();

  const [dolaresCuadresAcumulados, setDolaresCuadresAculumados] =
    useState<number>(0);

  const sumatoria =
    selectedRow && selectedRow.cuadreDollaresAll
      ? selectedRow.cuadreDolaresAll.reduce(
          (acc: any, val: any) => acc + val.monto_usd,
          0
        )
      : 0;

  const [valorAproximacion] = useState<number | null>(sumatoria);

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

  const agregarCuadreOperacionDolar = async (): Promise<void> => {
    try {
      setLoading(true);
      const { status } = await axios.post(
        `${config.apiUrl}/operaciones/agregarCuadreOpDolar`,
        {
          ...values,
          operacionId: selectedRow?.operacionId,
          monto_usd: Number(values.monto_usd),
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
        toast.error(error.response?.data.error ?? "Ha ocurrido un error inesperado");
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
      fecha_usd: "",
      descripcion_op_usd: "",
      monto_usd: 0,
      referencia_usd: "",
      diferencia_usd: 0,
    },
    validationSchema: AgregarCuadreDolaresSchema,
    onSubmit: agregarCuadreOperacionDolar,
  });

  useEffect(() => {
    if (selectedRow) {
      const total =
        dolaresCuadresAcumulados +
        (Math.abs(Number(values.monto_usd)) - Math.abs(Number(selectedRow.dolares)));
      setFieldValue("diferencia_usd", Number(total.toFixed(2)));
    }
  }, [values.monto_usd, selectedRow, setFieldValue, dolaresCuadresAcumulados]);

  useEffect(() => {
    if (
      selectedRow?.cuadreDolaresAll &&
      selectedRow.cuadreDolaresAll.length > 0
    ) {
      const sumatoria =
        selectedRow && selectedRow.cuadreDolaresAll
          ? selectedRow.cuadreDolaresAll.reduce(
              (acc: any, val: any) => acc + val.monto_usd,
              0
            )
          : 0;

      setDolaresCuadresAculumados(sumatoria);
    }
  }, [selectedRow, selectedRow.cuadreDolaresAll]);
  console.log("RowExcel: ", rowExcelSelected);
  useEffect(() => {
    if (rowExcelSelected) {
      setFieldValue(
        "fecha_usd",
        rowExcelSelected['Fecha']
      );
      setFieldValue("descripcion_op_usd", rowExcelSelected['Descripción operación']);
      setFieldValue("monto_usd", rowExcelSelected['Monto']);
      setFieldValue("referencia_usd", rowExcelSelected['Referencia2']);
    }
  }, [rowExcelSelected, setFieldValue]);

  return (
    <>
      <h2 className="mb-8 text-3xl font-medium text-center font_kanit text-secondary-main">
        Agregar cuadre operación dólares
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

              {/* USD */}
              <div className="w-full">
                <InputForm
                  label="Fecha USD"
                  name="fecha_usd"
                  placeholder="Fecha USD"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.fecha_usd}
                  disabled
                />
                <Errors errors={errors.fecha_usd} touched={touched.fecha_usd} />
              </div>
              <div className="w-full">
                <InputForm
                  label="Descripción USD"
                  name="descripcion_op_usd"
                  placeholder="Descripción USD"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.descripcion_op_usd}
                  disabled
                />
                <Errors
                  errors={errors.descripcion_op_usd}
                  touched={touched.descripcion_op_usd}
                />
              </div>
              <div className="w-full">
                <InputForm
                  label="Monto USD"
                  name="monto_usd"
                  placeholder="Monto USD"
                  type="number"
                  value={String(values.monto_usd)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled
                />
                <Errors errors={errors.monto_usd} touched={touched.monto_usd} />
              </div>
              <div className="w-full">
                <InputForm
                  label="Referencia USD"
                  name="referencia_usd"
                  placeholder="Referencia USD"
                  type="text"
                  value={values.referencia_usd}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled
                />
                <Errors
                  errors={errors.referencia_usd}
                  touched={touched.referencia_usd}
                />
              </div>
              <div className="w-full">
                <InputForm
                  label="Diferencia USD"
                  name="diferencia_usd"
                  placeholder="Diferencia USD"
                  type="number"
                  disabled
                  value={String(values.diferencia_usd)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Errors
                  errors={errors.diferencia_usd}
                  touched={touched.diferencia_usd}
                />
              </div>
            </div>

            {selectedRow?.cuadreDolaresAll?.length > 0 && (
              <div className="p-4 mt-4 bg-white border border-gray-200 shadow-sm rounded-xl">
                <h3 className="mb-3 text-lg font-semibold text-gray-800">
                  Aproximaciones
                </h3>
                <div className="space-y-2">
                  {(() => {
                    let current = Number(selectedRow.dolares);
                    return selectedRow.cuadreDolaresAll.map(
                      (item: any, index: number) => {
                        const previous = current;
                        current = current - Number(item.monto_usd);
                        return (
                          <div
                            key={`aproximaciones${item.id}`}
                            className="flex justify-between text-sm text-gray-700"
                          >
                            <span className="font-medium">
                              {index + 1}° Cuadre:
                            </span>
                            <p>
                              {previous.toFixed(2)} -{" "}
                              <span className="font-bold">
                                {Number(item.monto_usd).toFixed(2)}
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
            {selectedRow?.cuadreDolaresAll?.length > 0 && (
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
                {selectedRow.cuadreDolaresAll.map((item: any) => (
                  <div
                    className="grid w-full grid-cols-4 mb-5 gap-y-1 text-black-900"
                    key={`CuadreRegistradosDolares${item.id}`}
                  >
                    <p>{formatoFecha(item.fecha_usd)}</p>
                    <p>{item.descripcion_op_usd}</p>
                    <p>{item.monto_usd}</p>
                    <p>{item.referencia_usd}</p>
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
                fechaKey='Fecha'
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
              disabled={valorAproximacion === selectedRow.dolares}
            />
          </div>
        </div>
      </form>
    </>
  );
};
