/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import SubirDatosExcel from "../excel/SubirDatosExcel";
import {
  convertirFecha,
  formatearFecha,
  formatoFecha,
} from "@/libs/formateadorFecha";
import { ButtonCancelar } from "../../../../../@components/ButtonCancelar";
import { ButtonSubmit } from "../../../../../@components/ButtonSubmit";
import { InputForm } from "@/components/form/InputForm";
import { Errors } from "@/components/Errors";
import { useFormik } from "formik";
import { AgregarCuadreSolesSchema } from "../../schemas/CuadreOperacionesSchema";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { config } from "@/config/config";
import { useAuth } from "@/context/useAuthContext";
import { useRouter } from "next/navigation";

export const EditarCuadroSoles = ({ rowCuadre }: { rowCuadre: any }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { selectedRow, closeModal, setDatosOperaciones } = useAuth();
  console.log(rowCuadre);
  const [solesCuadresAcumulados, setSolesCuadresAculumados] =
    useState<number>(0);

  const [rowExcelSelected, setRowExcelSelected] = useState<any>({
    'Fecha': formatearFecha(rowCuadre.fecha_pen),
    'Descripción operación': rowCuadre.descripcion_op_pen,
    'Monto': rowCuadre.monto_pen,
    'Referencia2': rowCuadre.referencia_pen,
  });

  const headers = [
    { key: "Fecha", title: "Fecha", id: 1 },
    { key: "Descripción operación", title: "Descripción", id: 2 },
    { key: "Monto", title: "Monto", id: 3 },
    { key: "Referencia2", title: "Referencia", id: 4 },
  ];

  const editarCuadreOperacionSoles = async (): Promise<void> => {
    try {
      setLoading(true);
      const { status, data } = await axios.post(
        `${config.apiUrl}/operaciones/editarCuadreOpSoles/${rowCuadre.id}`,
        {
          ...values,
          operacionId: selectedRow?.operacionId,
          monto_pen: Number(values.monto_pen),
        },
        {
          withCredentials: true,
        }
      );

      if (status === 200) {
        console.log(data);
        closeModal();
        router.push("/sistema/cuadre-operaciones?page=1");
        toast.success("Editado correctamente");
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
    onSubmit: editarCuadreOperacionSoles,
  });

  useEffect(() => {
    if (selectedRow) {
      const local =
        selectedRow.cuadreSolesAll.length > 1 ? 0 : solesCuadresAcumulados;
      const total = local + (Math.abs(Number(values.monto_pen)) - Math.abs(selectedRow.soles));
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
      const fechaConvertida = convertirFecha(rowExcelSelected?.fecha);
      const validFecha = new Date(fechaConvertida);
      setFieldValue(
        "fecha_pen",
        validFecha ? validFecha.toISOString().split("T")[0] : ""
      );
      setFieldValue("descripcion_op_pen", rowExcelSelected?.descripcion);
      setFieldValue("monto_pen", rowExcelSelected?.monto);
      setFieldValue("referencia_pen", rowExcelSelected?.referencia);
    }
  }, [rowExcelSelected, setFieldValue]);

  return (
    <>
      <h2 className="mb-8 text-3xl font-medium text-center font_kanit text-secondary-main">
        Editar cuadre operación soles
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
                  type="date"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.fecha_pen}
                  disabled
                />
                <Errors errors={errors.fecha_pen} touched={touched.fecha_pen} />
              </div>
              <div className="w-full">
                <InputForm
                  label="Descripción PEN"
                  name="descripcion_op_pen"
                  placeholder="Descripción PEN"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.descripcion_op_pen}
                  disabled
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
                  value={String(values.monto_pen)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled
                />
                <Errors errors={errors.monto_pen} touched={touched.monto_pen} />
              </div>
              <div className="w-full">
                <InputForm
                  label="Referencia PEN"
                  name="referencia_pen"
                  placeholder="Referencia PEN"
                  type="text"
                  value={values.referencia_pen}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled
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
                        current = current - Number(item.monto_pen);
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
                fechaKey="Fecha"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center w-full gap-4 mt-4 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <ButtonCancelar />
          </div>
          <div className="w-full lg:w-1/2">
            <ButtonSubmit loading={loading} text="Editar cuadre" />
          </div>
        </div>
      </form>
    </>
  );
};
