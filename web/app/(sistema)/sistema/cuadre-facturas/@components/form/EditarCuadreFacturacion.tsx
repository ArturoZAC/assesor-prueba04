/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from "react";
import { ButtonCancelar } from "../../../../@components/ButtonCancelar";
import { ButtonSubmit } from "../../../../@components/ButtonSubmit";
import { useAuth } from "@/context/useAuthContext";
import { useRouter } from "next/navigation";
import { config } from "@/config/config";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { InputForm } from '@/components/form/InputForm';
import { Errors } from "@/components/Errors";
import { useFormik } from "formik";
import { CuadreFacturacionSchema } from "../schemas/AgregarCuadreFacturacionSchema";
import SubirDatosFacturacion from "../excel/SubitDatosFacturacion";

export default function EditarCuadreFacturacion({ rowCuadre }: { rowCuadre: any }) {
  const { selectedRow, closeModal, setDatosFacturacion, datosFacturacion } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [primeraVisita, setPrimeraVisita] = useState<boolean>(true)

  console.log(selectedRow)

  const [rowExcelSelected, setRowExcelSelected] = useState<any>({
    'F. Emisión': '',
    'Documento': '',
    'Nombre Cliente':'',
    'Nro. Cliente':'',
    VENDEDOR: '',
    'Subtotal': '',
    'IGV': '',
    'Total': '',
    M: ''
  });

  const headers = [
    { key: "F. Emisión", title: "F. Emisión", id: 1 },
    { key: "T. Doc.", title: "T. Doc.", id: 2 },
    { key: "Documento", title: "Documento", id: 3 },
    { key: "Nombre Cliente", title: "Nombre Cliente", id: 4 },
    { key: "Nro. Cliente", title: "Nro. Cliente", id: 5 },
    { key: "Subtotal", title: "Subtotal", id: 6},
    { key: "IGV", title: "IGV", id: 7 },
    { key: "Total", title: "Total", id: 8 },
    { key: "M", title: "M", id: 9 },
  ];

  const agregarCuadrePrestamo = async (): Promise<void> => {
    try {
      setLoading(true);
      const { status, data } = await axios.post(
        `${config.apiUrl}/cuadrefacturacion/${rowCuadre.id}`,
        {
          ...values,
        },
        {
          withCredentials: true,
        }
      );

      if (status === 200) {
        console.log(data);
        closeModal();
        router.push("/sistema/cuadre-facturas?page=1");
        toast.success("Actualizado correctamente");
        setLoading(false);
        setDatosFacturacion((prev) =>
          prev.filter((item) => item !== rowExcelSelected)
        );
        const nuevosDatos = datosFacturacion.filter(
          (item: any) => item !== rowExcelSelected
        );
        localStorage.setItem("datosFacturacion", JSON.stringify(nuevosDatos));
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
    errors,
    values,
    touched,
    setFieldValue,
  } = useFormik({
    initialValues: {
      facturacionId: selectedRow?.id || '',
      fechaCuadre: selectedRow?.fecha || '',
      docCuadre: selectedRow?.doc || '',
      clienteCuadre: selectedRow?.cliente || '',
      rucCuadre: selectedRow?.ruc || '',
      subtotalCuadre: selectedRow?.subtotal || '',
      igvCuadre: selectedRow?.igv || '',
      totalCuadre: selectedRow?.total || '',
      numeroCuadre: selectedRow?.numero || ''
    },
    validationSchema: CuadreFacturacionSchema,
    onSubmit: agregarCuadrePrestamo,
  });

  useEffect(() => {
    if (primeraVisita) {
      setPrimeraVisita(false)
      return
    }
    if (rowExcelSelected) {
      console.log("Populating form from Excel row:", rowExcelSelected);

      setFieldValue("fechaCuadre", rowExcelSelected["F. Emisión"] || '');
      setFieldValue("docCuadre", rowExcelSelected["T. Doc."] || '');
      setFieldValue("clienteCuadre", rowExcelSelected["Nombre Cliente"] || '');
      setFieldValue("rucCuadre", String(rowExcelSelected["Nro. Cliente"]) || '');
      setFieldValue("subtotalCuadre", Number(rowExcelSelected["Total"]) || 0);
      setFieldValue("igvCuadre", rowExcelSelected["IGV"] !== undefined && rowExcelSelected["IGV"] !== null ? Number(rowExcelSelected["IGV"]) : null);
      setFieldValue("totalCuadre", rowExcelSelected["Total"] || '');
      setFieldValue("numeroCuadre", rowExcelSelected["Documento"] || '');
      if (selectedRow?.id) {
        setFieldValue("facturacionId", selectedRow.id);
      }
    }
  }, [rowExcelSelected, selectedRow.id, setFieldValue]);

  useEffect(() => {
    if (selectedRow?.id) {
      setFieldValue("facturacionId", selectedRow.id);
    }
  }, [selectedRow, setFieldValue]);

  return (
    <>
      <h2 className="mb-8 text-3xl font-medium text-center font_kanit text-secondary-main">
        Editar Cuadre Facturación
      </h2>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="grid w-full gap-5 lg:grid-cols-2">
          <div className="w-full">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Detalles del Cuadre (desde Excel)</h3>
            <div className="grid grid-cols-1 gap-4 mb-5 md:grid-cols-2">
              <div className="w-full">
                <InputForm
                  label="Cliente"
                  name="cliente"
                  type="text"
                  placeholder="Cliente"
                  disabled
                  value={selectedRow.cliente_op}
                />
              </div>
              <div className="w-full">
                <InputForm
                  label="Monto Operación (S/.)"
                  name="monto"
                  type="text"
                  placeholder="Monto"
                  disabled
                  value={selectedRow.monto_op}
                />
              </div>
              <div className="w-full">
                <InputForm
                  label="Documento"
                  name="documento"
                  type="text"
                  placeholder="Documento"
                  disabled
                  value={selectedRow.doc_cliente_op}
                />
              </div>
              <div className="w-full">
                <InputForm
                  label="Fecha Cuadre"
                  name="fechaCuadre"
                  type="text" // Use text as date format might vary from Excel, display as string
                  placeholder="Fecha del Cuadre"
                  disabled // Disabled as it's populated from Excel
                  value={values.fechaCuadre}
                />
                <Errors errors={errors.fechaCuadre} touched={touched.fechaCuadre} />
              </div>
              <div className="w-full">
                <InputForm
                  label="DOC. Cuadre"
                  name="docCuadre"
                  type="text"
                  placeholder="DOC. del Cuadre"
                  disabled // Disabled as it's populated from Excel
                  value={values.docCuadre}
                />
                <Errors errors={errors.docCuadre} touched={touched.docCuadre} />
              </div>
              <div className="w-full">
                <InputForm
                  label="NUMERO Cuadre"
                  name="numeroCuadre"
                  type="text"
                  placeholder="NUMERO del Cuadre"
                  disabled // Disabled as it's populated from Excel
                  value={values.numeroCuadre}
                />
                <Errors errors={errors.docCuadre} touched={touched.docCuadre} />
              </div>
              <div className="w-full">
                <InputForm
                  label="CLIENTE Cuadre"
                  name="clienteCuadre"
                  type="text"
                  placeholder="Cliente del Cuadre"
                  disabled // Disabled as it's populated from Excel
                  value={values.clienteCuadre}
                />
                <Errors errors={errors.clienteCuadre} touched={touched.clienteCuadre} />
                <Errors errors={errors.facturacionId} touched={touched.facturacionId} />
              </div>
              <div className="w-full">
                <InputForm
                  label="RUC Cuadre"
                  name="rucCuadre"
                  type="text"
                  placeholder="RUC del Cuadre"
                  disabled // Disabled as it's populated from Excel
                  value={values.rucCuadre}
                />
                <Errors errors={errors.rucCuadre} touched={touched.rucCuadre} />
              </div>
              <div className="w-full">
                <InputForm
                  label="SUBTOTAL Cuadre"
                  name="subtotalCuadre"
                  type="number"
                  step={0.01}
                  placeholder="Subtotal del Cuadre"
                  disabled
                  value={values.subtotalCuadre?.toString() || ''}
                />
                <Errors errors={errors.subtotalCuadre} touched={touched.subtotalCuadre} />
              </div>
              <div className="w-full">
                <InputForm
                  label="IGV Cuadre"
                  name="igvCuadre"
                  type="number"
                  step={0.01}
                  placeholder="IGV del Cuadre"
                  disabled
                  value={values.igvCuadre?.toString() || ''}
                />
                <Errors errors={errors.igvCuadre} touched={touched.igvCuadre} />
              </div>
            </div>
          </div>

          <div className="w-full max-h-[410px] overflow-y-auto mt-4">

            <SubirDatosFacturacion
              fechaKey="F. Emisión"
              setData={setDatosFacturacion}
              headers={headers}
              textAlert="Selecciona un registro del Excel"
              rowExcelSelected={rowExcelSelected}
              setRowExcelSelected={setRowExcelSelected}
              urlDelete="cuadrefacturacion/borrar"
              nombreDelete="Eliminar Cuadre"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center w-full gap-4 mt-8 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <ButtonCancelar />
          </div>
          <div className="w-full lg:w-1/2">
            <ButtonSubmit
              loading={loading}
              text="Registrar Cuadre Facturación"
            />
          </div>
        </div>
      </form>
    </>
  );
}