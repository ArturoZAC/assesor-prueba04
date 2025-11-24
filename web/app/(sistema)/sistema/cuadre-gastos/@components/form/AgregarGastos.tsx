/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { InputForm } from "@/components/form/InputForm";
import { useFormik } from "formik";
import React, { ChangeEvent, useEffect, useState } from "react";
import { agregarGastoSchema } from "../schemas/AgregarGasto";
import { Errors } from "@/components/Errors";
import { ButtonCancelar } from "../../../../@components/ButtonCancelar";
import { ButtonSubmit } from "../../../../@components/ButtonSubmit";
import SubirDatosExcel from "../../../cuadre-operaciones/@components/forms/excel/SubirDatosExcel";
import { useAuth } from "@/context/useAuthContext";
import axios, { AxiosError } from "axios";
import { config } from "@/config/config";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RowExcelSelectInterface {
  'Fecha': string;
  'Descripción operación': string;
  'Referencia2' ?: string;
  'Monto': string;
  'Clase' ?: string;
}

export const AgregarGastos = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { closeModal, setDatosOperaciones, datosOperaciones } = useAuth();
  const [isRecopilado, setIsRecopilado] = useState<boolean>(false)

  const router = useRouter();

  const headers = [
    { key: "Fecha", title: "Fecha", id: 1 },
    { key: "Descripción operación", title: "Descripción", id: 2 },
    { key: "Monto", title: "Monto", id: 3 },
    { key: "Referencia2", title: "Referencia", id: 4 },
    { key: "Clase", title: "Clase", id: 5 },
    { key: "Concepto", title: "Concepto", id: 6 },
  ];

  const cambiarValorCheckBox = (event: ChangeEvent<HTMLInputElement>) => {
    setIsRecopilado(event.target.checked)
  };

  const agregarGasto = async (): Promise<void> => {
    try {
      setLoading(true);
      const { status, data } = await axios.post(
        `${config.apiUrl}/gastos/agregar`,
        {
          ...values,
          isRecopilado
        },
        {
          withCredentials: true,
        }
      );

      if (status === 201) {
        console.log(data);
        setDatosOperaciones((prev) =>
          prev.filter((item) => item !== rowExcelSelected)
        );
        const nuevosDatos = datosOperaciones.filter(
          (item: any) => item !== rowExcelSelected
        );
        localStorage.setItem("datosExcel", JSON.stringify(nuevosDatos));
        closeModal();
        router.push("/sistema/cuadre-gastos?page=1");
        toast.success("Creado correctamente");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log("Error: ", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  };

  const [rowExcelSelected, setRowExcelSelected] =
    useState<RowExcelSelectInterface>({
      'Fecha': "22/04/2025",
      "Descripción operación": "",
      Monto: "0",
      Referencia2: "",
      Clase: "",
    });

  const {
    handleSubmit,
    handleChange,
    setFieldValue,
    errors,
    values,
    touched,
    handleBlur,
  } = useFormik({
    initialValues: {
      fecha: "",
      descripcion: "",
      monto: "",
      referencia: "",
      tipoMoneda: "",
      clase: "",
      concepto: "",
      tipoGasto: "",
    },
    validationSchema: agregarGastoSchema,
    onSubmit: agregarGasto,
  });

  useEffect(() => {
    if (rowExcelSelected) {
      setFieldValue(
        "fecha",
        rowExcelSelected['Fecha']
      );
      setFieldValue("descripcion", rowExcelSelected['Descripción operación']);
      setFieldValue("monto", rowExcelSelected['Monto']);
      setFieldValue("referencia", rowExcelSelected['Referencia2'] ?? '');
      setFieldValue("clase", rowExcelSelected['Clase'] ?? '');
    }
  }, [rowExcelSelected, setFieldValue]);
  return (
    <form onSubmit={handleSubmit}>
      <h2 className="mb-8 text-3xl font-medium text-center font_kanit text-secondary-main">
        Agregar gasto
      </h2>
      <div className="w-full ">
        <div className="flex flex-col w-full gap-6 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-1 mb-5 gap-x-4 gap-y-6 md:grid-cols-3">
              <div className="w-full">
                <label className="text-black-800">Tipo de Gasto</label>
                <select
                  name="tipoGasto"
                  value={values.tipoGasto}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full p-2 border rounded-md outline-none placeholder:text-sm focus:border-secondary-main"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="MANTENIMIENTO">Gastos de Mantenimiento</option>
                  <option value="FUNCIONAMIENTO">
                    Gastos de Funcionamiento
                  </option>
                  <option value="PERSONAL">Gastos de Personal</option>
                  <option value="PERSONAL_PERSONAS">Personal / Asistentes</option>
                  <option value="DIVERSOS_OPERATIVOS">
                    Gastos Diversos Operativos
                  </option>
                  <option value="IMPUESTOS">Gastos de Pago de Impuestos</option>
                  <option value="INTERESES_RENTA_SEGUNDA">
                    Intereses por Préstamo de Fondo (Renta Segunda Categoría)
                  </option>
                  <option value="OVERNIGHT_BCP">Overnight BCP</option>
                  <option value="ITF">Gastos de ITF</option>
                  <option value="PRESTAMOS_SIN_INTERES">
                    Préstamos que No Generan Intereses
                  </option>
                  <option value="GASTO_LEASING">Gastos de Leasing</option>
                  <option value="GASTO_PRESTAMOS">Gastos de Prestamos</option>
                  <option value="OTROS_GASTOS">Otros Gastos 1</option>
                  <option value="OTROS_GASTOS_1">Otros Gastos 2</option>
                  <option value="OTROS_GASTOS_2">Otros Gastos 3</option>
                  <option value="OTROS_GASTOS_3">Otros Gastos 4</option>
                  <option value="OTROS_GASTOS_4">Otros Gastos 5</option>
                  <option value="OTROS_GASTOS_5">Otros Gastos 6</option>
                  <option value="OTROS_GASTOS_6">Otros Gastos 7</option>
                  <option value="OTROS_GASTOS_7">Otros Gastos 8</option>

                </select>
                <Errors errors={errors.tipoGasto} touched={touched.tipoGasto} />
              </div>
              <div className="w-full">
                <InputForm
                  label="Fecha"
                  name="fecha"
                  disabled
                  placeholder="Fecha"
                  type="text"
                  value={
                    values.fecha
                  }
                  className=""
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Errors errors={errors.fecha} touched={touched.fecha} />
              </div>

              <div className="w-full">
                <InputForm
                  label="Descripción"
                  name="descripcion"
                  disabled
                  type="text"
                  placeholder="Descripción de la operación"
                  value={values.descripcion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Errors
                  errors={errors.descripcion}
                  touched={touched.descripcion}
                />
              </div>

              <div className="w-full">
                <InputForm
                  label="Monto"
                  disabled
                  name="monto"
                  placeholder="Monto"
                  type="number"
                  value={values.monto}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Errors errors={errors.monto} touched={touched.monto} />
              </div>

              <div className="w-full">
                <InputForm
                  label="Referencia"
                  disabled
                  name="referencia"
                  type="text"
                  placeholder="Referencia"
                  value={values.referencia}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Errors
                  errors={errors.referencia}
                  touched={touched.referencia}
                />
              </div>

              <div className="w-full">
                <label className="text-black-800">Moneda</label>
                <select
                  name="tipoMoneda"
                  value={values.tipoMoneda}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full p-2 border rounded-md outline-none placeholder:text-sm focus:border-secondary-main"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="PEN">PEN</option>
                  <option value="USD">USD</option>
                </select>
                <Errors
                  errors={errors.tipoMoneda}
                  touched={touched.tipoMoneda}
                />
              </div>

              <div className="w-full">
                <InputForm
                  label="Clase"
                  name="clase"
                  type="text"
                  placeholder="Clase (si aplica)"
                  value={values.clase}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Errors errors={errors.clase} touched={touched.clase} />
              </div>

              <div className="w-full">
                <InputForm
                  label="Concepto"
                  name="concepto"
                  type="text"
                  placeholder="Concepto (si aplica)"
                  value={values.concepto}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Errors errors={errors.concepto} touched={touched.concepto} />
              </div>
              { /** Separador */ }
              <div className="w-full"></div>
              <div className="w-full flex gap-2 items-center">
                <input type="checkbox" id="isRecopilado" name="recopilado" checked={isRecopilado} onChange={cambiarValorCheckBox} />
                <label htmlFor="isRecopilado" className="text-sm">Registrar para la Recopilación de Gastos</label>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="w-full max-h-[410px] overflow-y-auto">
              <SubirDatosExcel
                setData={setDatosOperaciones}
                headers={headers}
                textAlert="Selecciona un registro"
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
            <ButtonSubmit loading={loading} text="Agregar gasto" />
          </div>
        </div>
      </div>
    </form>
  );
};
