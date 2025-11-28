/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import { Errors } from "@/components/Errors";
import { InputForm } from "@/components/form/InputForm";
import SeleccionarUbicacion from "@/components/location/SeleccionarUbicacion";
import { config } from "@/config/config";
import { useAuth } from "@/context/useAuthContext";
import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ButtonCancelar } from "../../../../@components/ButtonCancelar";
import { ButtonSubmit } from "../../../../@components/ButtonSubmit";
import { AgregarClienteSchema } from "../SchemasClientes";
import departamentosData from "../../../../../../src/components/location/data/departamentos.json";
import provinciasData from "../../../../../../src/components/location/data/provincias.json";
import distritosData from "../../../../../../src/components/location/data/distritos.json";

// 👉 Utilidades de mapeo nombre → id
const findDepartmentIdByName = (nombre: string) => {
  const d = departamentosData.find((x) => x.nombre_ubigeo === nombre);
  return d?.id_ubigeo ?? "";
};
const findProvinceIdByName = (nombre: string, departamentoId: string) => {
  if (!departamentoId) return "";
  //@ts-ignore
  const arr = provinciasData[departamentoId] || [];
  const p = arr.find((x: any) => x.nombre_ubigeo === nombre);
  return p?.id_ubigeo ?? "";
};
const findDistrictIdByName = (nombre: string, provinciaId: string) => {
  if (!provinciaId) return "";

  //@ts-ignore
  const arr = distritosData[provinciaId] || [];
  const d = arr.find((x: any) => x.nombre_ubigeo === nombre);
  return d?.id_ubigeo ?? "";
};

export const EditarCliente = () => {
  const { selectedRow, closeModal } = useAuth();

  // 1️⃣ Preparar los IDs que necesitan los <select>
  const deptId = findDepartmentIdByName(selectedRow.departamento);
  const provId = findProvinceIdByName(selectedRow.provincia, deptId);
  const distId = findDistrictIdByName(selectedRow.distrito, provId);
  const [primeraVisita, setPrimeraVisita] = useState<boolean>(true)

  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedDepartamentoName, setSelectedDepartamentoName] = useState(
    selectedRow.departamento
  );
  const [selectedProvinciaName, setSelectedProvinciaName] = useState(
    selectedRow.provincia
  );
  const [selectedDistritoName, setSelectedDistritoName] = useState(
    selectedRow.distrito
  );
  useEffect(() => {
    setSelectedDepartamentoName(selectedRow.departamento);
    setSelectedProvinciaName(selectedRow.provincia);
    setSelectedDistritoName(selectedRow.distrito);
  }, [selectedRow]);



  const agregarCliente = async (): Promise<void> => {
    try {
      const { status, data } = await axios.post(
        `${config.apiUrl}/clientes/editar/${selectedRow.id}`,
        {
          ...values,
          departamento: selectedDepartamentoName,
          provincia: selectedProvinciaName,
          distrito: selectedDistritoName,
        },
        {
          withCredentials: true,
        }
      );

      if (status === 200) {
        console.log(data);
        closeModal();
        router.push("/sistema/master-clientes?page=1");
        toast.success(data.mensaje);
      }
    } catch (error) {
      console.log("Error: ", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.mensaje);
      }
    }

    setLoading(false);
  };

  const { handleSubmit, handleChange, errors, values, touched, handleBlur, setFieldValue } =
    useFormik({
      initialValues: {
        vigente: selectedRow?.vigente ?? false,
        documento: selectedRow?.documento ?? "",
        apellido_paterno: selectedRow?.apellido_paterno ?? "",
        apellido_materno: selectedRow?.apellido_materno ?? "",
        nombres: selectedRow?.nombres ?? "",
        ocupacion: selectedRow?.ocupacion ?? "",
        tipo_cliente: selectedRow?.tipo_cliente ?? "",
        direccion: selectedRow?.direccion ?? "",
        email: selectedRow?.email ?? "",
        departamento: deptId,
        provincia: provId,
        distrito: distId,
        telefono: selectedRow?.telefono ?? "",
        apellido_paterno_apo: selectedRow?.apellido_paterno_apo ?? "",
        apellido_materno_apo: selectedRow?.apellido_materno_apo ?? "",
        nombres_apo: selectedRow?.nombres_apo ?? "",
        tipo_documento: selectedRow?.tipo_documento ?? "",
        numero_documento: selectedRow?.numero_documento ?? "",
        nacionalidad: selectedRow?.nacionalidad ?? "",
        cliente: selectedRow?.cliente ?? "",
        tipo_documento_cliente: selectedRow?.tipo_documento_cliente ?? "",
        cliente_2: selectedRow?.cliente_2 ?? "",
        documento_2: selectedRow?.documento_2 ?? "",
        otro: selectedRow?.otro ?? "",
        tercero: selectedRow?.tercero ?? "",
        tipo_tercero: selectedRow?.tipo_tercero ?? "",
        documento_tercero: selectedRow?.documento_tercero ?? "",
        observacion: selectedRow?.observacion ?? "",
      },
      validationSchema: AgregarClienteSchema,
      onSubmit: agregarCliente,
    });

  useEffect(() => {
    if (primeraVisita) {
      setPrimeraVisita(false)
      return
    }
    if (
      values.nombres !== "" ||
      values.apellido_materno !== "" ||
      values.apellido_paterno !== ""
    ) {
      const nombreCompleto = `${values.nombres}${values.apellido_paterno ? ` ${values.apellido_paterno}` : ''}${values.apellido_materno ? ` ${values.apellido_materno}` : ''}`;
      setFieldValue("cliente", nombreCompleto);
      setFieldValue("cliente_2", nombreCompleto);
    }
  }, [values.nombres, values.apellido_materno, values.apellido_paterno, setFieldValue]);

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="mb-8 text-3xl font-medium text-center font_kanit text-secondary-main">
        Editar cliente
      </h2>
      <div className="w-full ">
        <div className="grid grid-cols-1 mb-5 gap-x-4 gap-y-6 md:grid-cols-3">
          <div className="w-full">
            <label className="text-black-800">Vigente</label>
            <select
              name="vigente"
              id=""
              value={values.vigente}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full p-2 border rounded-md outline-none placeholder:text-sm focus:border-secondary-main"
            >
              <option value="">Selecciona una opción</option>
              <option value="si">Si</option>
              <option value="no">No</option>
            </select>

            <Errors errors={errors.vigente} touched={touched.vigente} />
          </div>

          <div className="w-full">
            <InputForm
              label="Documento"
              name="documento"
              type="text"
              placeholder="Docu"
              value={values.documento}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors errors={errors.documento} touched={touched.documento} />
          </div>
          <div className="w-full">
            <InputForm
              label="Apellido Paterno"
              name="apellido_paterno"
              type="text"
              placeholder="Apellido Paterno"
              value={values.apellido_paterno}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors
              errors={errors.apellido_paterno}
              touched={touched.apellido_paterno}
            />
          </div>
          <div className="w-full">
            <InputForm
              label="Apellido Materno"
              name="apellido_materno"
              type="text"
              placeholder="Apellido Materno"
              value={values.apellido_materno}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors
              errors={errors.apellido_materno}
              touched={touched.apellido_materno}
            />
          </div>
          <div className="w-full">
            <InputForm
              label="Nombres"
              name="nombres"
              type="text"
              placeholder="Nombres"
              value={values.nombres}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors errors={errors.nombres} touched={touched.nombres} />
          </div>
          <div className="w-full">
            <InputForm
              label="Ocupación"
              name="ocupacion"
              type="text"
              placeholder="Ocupación"
              value={values.ocupacion}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors errors={errors.ocupacion} touched={touched.ocupacion} />
          </div>
          <div className="w-full">
            <label className="text-black-800">Tipo de cliente</label>
            <select
              name="tipo_cliente"
              id=""
              value={values.tipo_cliente}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full p-2 border rounded-md outline-none placeholder:text-sm focus:border-secondary-main"
            >
              <option value="">Selecciona una opción</option>
              <option value="persona_natural">Persona Natural</option>
              <option value="persona_juridica">Persona Jurídica</option>
            </select>

            <Errors
              errors={errors.tipo_cliente}
              touched={touched.tipo_cliente}
            />
          </div>
          <div className="w-full">
            <InputForm
              label="Dirección"
              name="direccion"
              type="text"
              placeholder="Dirección"
              value={values.direccion}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors errors={errors.direccion} touched={touched.direccion} />
          </div>
          <div className="w-full">
            <InputForm
              label="Email"
              name="email"
              type="email"
              placeholder="Correo electrónico"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors errors={errors.email} touched={touched.email} />
          </div>
          <SeleccionarUbicacion
            classLabels={"text-black-800"}
            reclamaciones={false}
            errors={errors}
            classInputs={
              "border w-full placeholder:text-sm focus:border-secondary-main outline-none  rounded-md p-2"
            }
            handleBlur={handleBlur}
            handleChange={handleChange}
            touched={touched}
            values={values}
            selectedDepartamentoName={selectedDepartamentoName}
            selectedDistritoName={selectedDistritoName}
            selectedProvinciaName={selectedProvinciaName}
            setSelectedDepartamentoName={setSelectedDepartamentoName}
            setSelectedDistritoName={setSelectedDistritoName}
            setSelectedProvinciaName={setSelectedProvinciaName}
          />
          {/* <div className="w-full">
        <InputForm
          label="Departamento"
          name="departamento"
          type="text"
          placeholder="Departamento"
          value={values.departamento}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Errors
          errors={errors.departamento}
          touched={touched.departamento}
        />
      </div>
      <div className="w-full">
        <InputForm
          label="Provincia"
          name="provincia"
          type="text"
          placeholder="Provincia"
          value={values.provincia}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Errors errors={errors.provincia} touched={touched.provincia} />
      </div>
      <div className="w-full">
        <InputForm
          label="Distrito"
          name="distrito"
          type="text"
          placeholder="Distrito"
          value={values.distrito}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Errors errors={errors.distrito} touched={touched.distrito} />
      </div> */}
          <div className="w-full">
            <InputForm
              label="Teléfono"
              name="telefono"
              type="text"
              placeholder="Teléfono"
              value={values.telefono}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors errors={errors.telefono} touched={touched.telefono} />
          </div>
          <div className="w-full">
            <InputForm
              label="Apellido Paterno Apoderado"
              name="apellido_paterno_apo"
              type="text"
              placeholder="Apellido Paterno Apoderado"
              value={values.apellido_paterno_apo}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors
              errors={errors.apellido_paterno_apo}
              touched={touched.apellido_paterno_apo}
            />
          </div>
          <div className="w-full">
            <InputForm
              label="Apellido Materno Apoderado"
              name="apellido_materno_apo"
              type="text"
              placeholder="Apellido Materno Apoderado"
              value={values.apellido_materno_apo}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors
              errors={errors.apellido_materno_apo}
              touched={touched.apellido_materno_apo}
            />
          </div>
          <div className="w-full">
            <InputForm
              label="Nombres Apoderado"
              name="nombres_apo"
              type="text"
              placeholder="Nombres Apoderado"
              value={values.nombres_apo}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors errors={errors.nombres_apo} touched={touched.nombres_apo} />
          </div>

          <div className="w-full">
            <label className="text-black-800">Tipo documento</label>
            <select
              name="tipo_documento"
              id=""
              value={values.tipo_documento}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full p-2 border rounded-md outline-none placeholder:text-sm focus:border-secondary-main"
            >
              <option value="">Selecciona una opción</option>
              <option value="dni">DNI</option>
              <option value="ruc">RUC</option>
              <option value="ce">Carné de extranjería</option>
            </select>

            <Errors
              errors={errors.tipo_documento}
              touched={touched.tipo_documento}
            />
          </div>

          <div className="w-full">
            <InputForm
              label="Nro Documento"
              name="numero_documento"
              type="text"
              placeholder="Número Documento"
              value={values.numero_documento}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors
              errors={errors.numero_documento}
              touched={touched.numero_documento}
            />
          </div>
          <div className="w-full">
            <InputForm
              label="Nacionalidad"
              name="nacionalidad"
              type="text"
              placeholder="Nacionalidad"
              value={values.nacionalidad}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors
              errors={errors.nacionalidad}
              touched={touched.nacionalidad}
            />
          </div>
          <div className="w-full">
            <InputForm
              label="Cliente"
              name="cliente"
              type="text"
              placeholder="Cliente"
              value={values.cliente}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors errors={errors.cliente} touched={touched.cliente} />
          </div>
          <div className="w-full">
            <label className="text-black-800">Tipo Documento Cliente</label>
            <select
              name="tipo_documento_cliente"
              id=""
              value={values.tipo_documento_cliente}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full p-2 border rounded-md outline-none placeholder:text-sm focus:border-secondary-main"
            >
              <option value="">Selecciona una opción</option>
              <option value="dni">DNI</option>
              <option value="ruc">RUC</option>
              <option value="ce">Carné de extranjería</option>
            </select>

            <Errors
              errors={errors.tipo_documento_cliente}
              touched={touched.tipo_documento_cliente}
            />
          </div>

          <div className="w-full">
            <InputForm
              label="Cliente 2"
              name="cliente_2"
              type="text"
              placeholder="Cliente 2"
              value={values.cliente_2}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors errors={errors.cliente_2} touched={touched.cliente_2} />
          </div>
          <div className="w-full">
            <InputForm
              label="Documento 2"
              name="documento_2"
              type="text"
              placeholder="Documento Cliente 2"
              value={values.documento_2}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors errors={errors.documento_2} touched={touched.documento_2} />
          </div>
          <div className="w-full">
            <InputForm
              label="Otro"
              name="otro"
              type="text"
              placeholder="Otro"
              value={values.otro}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors errors={errors.otro} touched={touched.otro} />
          </div>
          <div className="w-full">
            <InputForm
              label="Tercero"
              name="tercero"
              type="text"
              placeholder="Tercero"
              value={values.tercero}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors errors={errors.tercero} touched={touched.tercero} />
          </div>
          <div className="w-full">
            <InputForm
              label="Tipo Tercero"
              name="tipo_tercero"
              type="text"
              placeholder="Tipo Tercero"
              value={values.tipo_tercero}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors
              errors={errors.tipo_tercero}
              touched={touched.tipo_tercero}
            />
          </div>
          <div className="w-full">
            <InputForm
              label="Doc Tercero"
              name="documento_tercero"
              type="text"
              placeholder="Doc Tercero"
              value={values.documento_tercero}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors
              errors={errors.documento_tercero}
              touched={touched.documento_tercero}
            />
          </div>
          <div className="w-full">
            <InputForm
              label="Observación"
              name="observacion"
              type="text"
              placeholder="Observación"
              value={values.observacion}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors errors={errors.observacion} touched={touched.observacion} />
          </div>
        </div>
        <div className="flex flex-col items-center w-full gap-4 mt-4 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <ButtonCancelar />
          </div>
          <div className="w-full lg:w-1/2">
            <ButtonSubmit loading={loading} text="Editar cliente" />
          </div>
        </div>
      </div>
    </form>
  );
};
