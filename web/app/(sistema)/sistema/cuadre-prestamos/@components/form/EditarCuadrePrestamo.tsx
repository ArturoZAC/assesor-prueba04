/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from '@/config/config';
import { useAuth } from '@/context/useAuthContext';
import axios, { AxiosError } from 'axios';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { ButtonCancelar } from '../../../../@components/ButtonCancelar';
import { ButtonSubmit } from '../../../../@components/ButtonSubmit';
import SubirDatosLeasing from '../../../cuadre-leasing/@components/excel/SubirDatosLeasing';
import { Errors } from '@/components/Errors';
import { InputForm } from '@/components/form/InputForm';
import { formatearFecha } from '@/libs/formateadorFecha';

export default function EditarCuadrePrestamo({ rowCuadre }: { rowCuadre: PagosPrestamo }) {

  const { selectedRow, closeModal, setDatosOperaciones } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  console.log(rowCuadre)
  const [rowExcelSelected, setRowExcelSelected] = useState<any>({
    'Fecha': formatearFecha(String(rowCuadre.fecha)),
    'Descripción operación': rowCuadre.descripcion,
    'Monto': rowCuadre.moonto,
    'tc': 0,
    'Referencia2': '',
  });

  const headers = [
    { key: "Fecha", title: "Fecha", id: 1 },
    { key: "Descripción operación", title: "Depósito", id: 2 },
    { key: "Monto", title: "Pagado", id: 3 },
    { key: "Referencia2", title: "Referencia", id: 4 },
    { key: "tc", title: "T.C.", id: 5 },
  ];

  const editarCuadrePrestamo = async (): Promise<void> => {
    try {
      setLoading(true);
      const { status, data } = await axios.post(
        `${config.apiUrl}/cuadreprestamos/salida/editar/${rowCuadre.id}`,
        {
          ...values,
          leasingId: selectedRow?.leasingId ?? ""
        },
        {
          withCredentials: true,
        }
      );

      if (status === 200) {
        console.log(data);
        closeModal();
        router.push("/sistema/cuadre-prestamos?page=1");
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
      fecha: formatearFecha(String(rowCuadre.fecha)),
      descripcion: rowCuadre.descripcion,
      monto: rowCuadre.moonto,
      diferencia: rowCuadre.diferencia,
    },
    // validationSchema: AgregarCuadreLeasingSchema,
    onSubmit: editarCuadrePrestamo,
  });

  useEffect(() => {
    if (rowExcelSelected) {
      console.log(rowExcelSelected)
      setFieldValue(
        "fecha",
        rowExcelSelected['Fecha'] ?? formatearFecha(String(rowCuadre.fecha))
      );
      setFieldValue("descripcion", rowExcelSelected['Descripción operación'] ?? rowCuadre.descripcion);
      setFieldValue("monto", rowExcelSelected['Monto'] ?? rowCuadre.moonto);
      setFieldValue("diferencia", Number(Number(selectedRow.capital_dolares || 0) + Number(selectedRow.capital_soles || 0) - Number(rowExcelSelected['Monto'] || 0)) ?? 0);
    }
  }, [rowCuadre.descripcion, rowCuadre.moonto, rowExcelSelected, selectedRow.capital_dolares, selectedRow.capital_soles, setFieldValue]);

  return (
    <>
      <h2 className="mb-8 text-3xl font-medium text-center font_kanit text-secondary-main">
        Editar Cuadre Salida
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
                  type="text"
                  disabled
                  value={
                    values.fecha
                  }
                />
              </div>
              <div className="w-full">
                <InputForm
                  label="Descripción"
                  name="descripcion"
                  placeholder="Descripción"
                  type="text"
                  value={String(values.descripcion)}
                  disabled
                />
                <Errors errors={errors.descripcion} touched={touched.descripcion} />
              </div>
              <div className="w-full">
                <InputForm
                  label="Monto"
                  name="monto"
                  placeholder="Monto"
                  type="number"
                  value={String(values.monto)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled
                />
                <Errors errors={errors.monto} touched={touched.monto} />
              </div>
              <div className="w-full">
                <InputForm
                  label="Diferencia"
                  name="diferencia"
                  placeholder="Diferencia"
                  type="number"
                  step={0.01}
                  value={String(values.diferencia)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled
                />
                <Errors errors={errors.diferencia} touched={touched.diferencia} />
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
            {/* selectedRow?.cuadreSolesAll?.length > 0 && (
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
            ) */}
            <div className="w-full max-h-[410px] overflow-y-auto">
              <SubirDatosLeasing
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
              text="Editar Cuadre Prestamo"
            />
          </div>
        </div>
      </form>
    </>
  );
}
