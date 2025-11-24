/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { PagoRealizadoLeasing } from '../types/CuadreLeasingDatabase'
import { ButtonCancelar } from '../../../../@components/ButtonCancelar';
import { ButtonSubmit } from '../../../../@components/ButtonSubmit';
import SubirDatosLeasing from '../excel/SubirDatosLeasing';
import { InputForm } from '@/components/form/InputForm';
import { Errors } from '@/components/Errors';
import { formatearFecha } from '@/libs/formateadorFecha';
import { useFormik } from 'formik';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/useAuthContext';
import { config } from '@/config/config';

export default function EditarItemCuadreLeasing({ rowCuadre }: { rowCuadre: PagoRealizadoLeasing }) {
  const { selectedRow, closeModal, setDatosOperaciones } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  console.log('ROW CUADRE: ', rowCuadre)

  const [rowExcelSelected, setRowExcelSelected] = useState<any>({
    'Fecha': formatearFecha(String(rowCuadre.detraccion?.fecha)) ?? "",
    'Descripción operación': rowCuadre.pagoLeasing?.deposito ?? '',
    'Monto': rowCuadre.pagoLeasing?.pagado ?? 0,
    'tc': rowCuadre.pagoLeasing?.tc ?? 0,
    'Referencia2': rowCuadre.pagoLeasing?.referencia ?? 0,
  });

  const headers = [
    { key: "Fecha", title: "Fecha", id: 1 },
    { key: "Descripción operación", title: "Depósito", id: 2 },
    { key: "Monto", title: "Pagado", id: 3 },
    { key: "Referencia2", title: "Referencia", id: 4 },
    { key: "tc", title: "T.C.", id: 5 },
  ];



  const agregarCuadreLeasing = async (): Promise<void> => {
    try {
      setLoading(true);
      const { status, data } = await axios.post(
        `${config.apiUrl}/cuadreleasing/${rowCuadre.id}`,
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
        router.push("/sistema/cuadre-leasing?page=1");
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
      deposito: rowCuadre.pagoLeasing?.deposito ?? '',
      depositoDet: 'DETRACCIÓN',
      pagadoDet: rowCuadre.detraccion?.pagado ?? 0,
      pagado: rowCuadre.pagoLeasing?.pagado ?? 0,
      tcDet: rowCuadre.detraccion?.tc ?? 0,
      tc: rowCuadre.pagoLeasing?.tc ?? 0,
      referencia: rowCuadre.pagoLeasing?.referencia ?? 0,
      referenciaDet: rowCuadre.detraccion?.referencia ?? 0,
      diferencia: rowCuadre.pagoLeasing?.diferencia ?? 0,
      diferenciaDet: rowCuadre.detraccion?.diferencia ?? 0,
      montoFinal: rowCuadre.pagoLeasing?.montoFinal ?? 0,
      montoFinalDet: rowCuadre.detraccion?.montoFinal ?? 0,
      fecha: formatearFecha(String(rowCuadre.detraccion?.fecha)) ?? ""
    },
    // validationSchema: AgregarCuadreLeasingSchema,
    onSubmit: agregarCuadreLeasing,
  });
  console.log(rowCuadre.detraccion?.fecha)
  useEffect(() => {
    if (rowExcelSelected) {
      setFieldValue("fecha", String(rowExcelSelected["Fecha"] || formatearFecha(String(rowCuadre.detraccion?.fecha)) || ""));
      setFieldValue("pagado", Math.abs(Number(rowExcelSelected['Monto'] ?? 0)));
      setFieldValue("deposito", rowExcelSelected['Descripción operación'] ?? '');
      setFieldValue("referencia", rowExcelSelected['Referencia2'] ?? '');
      setFieldValue("diferencia", rowExcelSelected['Monto']);
    }
  }, [rowExcelSelected, setFieldValue, rowCuadre]);

  useEffect(() => {
    setFieldValue("montoFinal", values.pagado)
    setFieldValue("diferencia", values.pagado)
    setFieldValue("pagadoDet", Number(selectedRow.monto_total - values.pagado))
    setFieldValue("montoFinalDet", Number(selectedRow.monto_total - values.pagado))
    setFieldValue("diferenciaDet", Number(values.pagado))
  }, [values.pagado, setFieldValue, selectedRow])

  return (
    <>
      <h2 className="mb-8 text-3xl font-medium text-center font_kanit text-secondary-main">
        Editar cuadre leasing
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
                  value={selectedRow?.documento}
                />
              </div>
              <div className="w-full">
                <InputForm
                  label="Monto Total"
                  name="monto_total"
                  placeholder="Monto Total"
                  type="text"
                  disabled
                  value={selectedRow?.monto_total}
                />

              </div>
              <div className="w-full">
                <InputForm
                  label="Depósito"
                  name="deposito"
                  placeholder="Depósito"
                  type="text"
                  value={values.deposito}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled
                />
                <Errors errors={errors.deposito} touched={touched.deposito} />
              </div>
              <div className="w-full">
                <InputForm
                  label="Pagado"
                  name="pagado"
                  placeholder="Pagado"
                  type="number"
                  value={String(values.pagado)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled
                />
                <Errors errors={errors.pagado} touched={touched.pagado} />
              </div>
              <div className="w-full">
                <InputForm
                  label="Monto Final"
                  name="montoFinal"
                  placeholder="Monto Final"
                  type="number"
                  value={String(values.montoFinal)}
                  disabled
                />
                <Errors errors={errors.montoFinal} touched={touched.montoFinal} />
              </div>
              <div>
                <InputForm
                  label="Fecha del Cuadre"
                  name="fecha"
                  placeholder="Fecha del Cuadre"
                  type="text"
                  value={values.fecha}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled
                />
                <Errors errors={errors.tc} touched={touched.tc} />
              </div>
              <div className="w-full">
                <InputForm
                  label="Tipo de Cambio"
                  name="tc"
                  placeholder="Tipo de Cambio"
                  type="number"
                  step={0.01}
                  value={String(values.tc)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled
                />
                <Errors errors={errors.tc} touched={touched.tc} />
              </div>
              <div className="w-full">
                <InputForm
                  label="Referencia"
                  name="referencia"
                  placeholder="Referencia"
                  type="number"
                  value={String(values.referencia)}
                  disabled
                />
                <Errors errors={errors.referencia} touched={touched.referencia} />
              </div>
              <div className="w-full">
                <InputForm
                  label="Diferencia"
                  name="diferencia"
                  placeholder="Diferencia"
                  type="number"
                  value={String(values.diferencia)}
                  disabled
                />
                <Errors errors={errors.diferencia} touched={touched.diferencia} />
              </div>
              <div className="w-full">
                <InputForm
                  label="Depósito (Detracción)"
                  name="depositoDet"
                  placeholder="Depósito (Detracción)"
                  type="text"
                  value={values.depositoDet}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled
                />
                <Errors errors={errors.depositoDet} touched={touched.depositoDet} />
              </div>
              <div className="w-full">
                <InputForm
                  label="Pagado (Detracción)"
                  name="pagadoDet"
                  placeholder="Pagado Detracción"
                  type="number"
                  disabled
                  value={String(values.pagadoDet)}
                />
                <Errors errors={errors.pagadoDet} touched={touched.pagadoDet} />
              </div>
              <div className="w-full">
                <InputForm
                  label="Tipo de Cambio (Detracción)"
                  name="tcDet"
                  placeholder="Tipo de Cambio (Detracción)"
                  type="number"
                  value={String(values.tcDet)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled
                />
                <Errors errors={errors.tcDet} touched={touched.tcDet} />
              </div>
              <div className="w-full">
                <InputForm
                  label="Monto Final (Detracción)"
                  name="montoFinalDet"
                  placeholder="Tipo de Cambio (Detracción)"
                  type="number"
                  value={String(values.montoFinalDet)}
                  disabled
                />
                <Errors errors={errors.montoFinalDet} touched={touched.montoFinalDet} />
              </div>
              <div className="w-full">
                <InputForm
                  label="Referencia (Detracción)"
                  name="referenciaDet"
                  placeholder="Referencia (Detracción)"
                  type="number"
                  value={String(values.referenciaDet)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled
                />
                <Errors errors={errors.referenciaDet} touched={touched.referenciaDet} />
              </div>
              <div className="w-full">
                <InputForm
                  label="Diferencia (Detracción)"
                  name="diferenciaDet"
                  placeholder="Diferencia (Detracción)"
                  type="number"
                  value={String(values.diferenciaDet)}
                  disabled
                />
                <Errors errors={errors.diferenciaDet} touched={touched.diferenciaDet} />
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
              text="Editar cuadre"
            />
          </div>
        </div>
      </form>
    </>
  );
}
