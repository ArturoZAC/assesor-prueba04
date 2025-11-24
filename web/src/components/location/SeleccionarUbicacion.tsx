/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import departamentosData from "../location/data/departamentos.json";
import provinciasData from "../location/data/provincias.json";
import distritosData from "../location/data/distritos.json";
import { Errors } from "../Errors";

export interface Ubigeo {
  id_ubigeo: string;
  nombre_ubigeo: string;
}

const SeleccionarUbicacion = ({
  setSelectedDepartamentoName,
  setSelectedProvinciaName,
  setSelectedDistritoName,
  handleChange,
  errors,
  values,
  touched,
  handleBlur,
  classInputs,
  reclamaciones,
  classLabels,
}: {
  selectedDepartamentoName: any;
  setSelectedDepartamentoName: any;
  selectedProvinciaName: any;
  setSelectedProvinciaName: any;
  selectedDistritoName: any;
  setSelectedDistritoName: any;
  handleChange: any;
  errors: any;
  values: any;
  touched: any;
  handleBlur: any;
  classInputs: any;
  reclamaciones: boolean;
  classLabels: any;
}) => {
  const [selectedDepartamento, setSelectedDepartamento] = useState<string>("");
  const [selectedProvincia, setSelectedProvincia] = useState<string>("");
  const [, setSelectedDistrito] = useState<string>("");

  
  const handleDepartamentoChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const selectedDepartamentoId = e.target.value;
    setSelectedDepartamento(selectedDepartamentoId);
    setSelectedProvincia("");
    setSelectedDistrito("");

    // Buscar el departamento correspondiente en el JSON de departamentos
    const selectedDepartamento = departamentosData.find(
      (departamento: any) => departamento.id_ubigeo === selectedDepartamentoId
    );

    // Verificar si se encontró el departamento
    if (selectedDepartamento) {
      setSelectedDepartamentoName(selectedDepartamento.nombre_ubigeo);
      console.log(selectedDepartamento)
      console.log(selectedDepartamento.nombre_ubigeo)
    } else {
      console.log("Departamento no encontrado");
    }

    handleChange(e);
  };

  const handleProvinciaChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const selectedProvinciaId = e.target.value;
    setSelectedProvincia(selectedProvinciaId);
    setSelectedDistrito("");

    // Buscar la provincia correspondiente en el JSON de provincias
    //@ts-ignore
    const selectedProvincia = provinciasData[selectedDepartamento]?.find(
      (provincia: { id_ubigeo: string }) =>
        provincia.id_ubigeo === selectedProvinciaId
    );

    // Verificar si se encontró la provincia
    if (selectedProvincia) {
      setSelectedProvinciaName(selectedProvincia.nombre_ubigeo);
    } else {
      console.log("Provincia no encontrada");
    }

    handleChange(e);
  };

  const handleDistritoChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const selectedDistritoId = e.target.value;
    setSelectedDistrito(selectedDistritoId);

    // Buscar el distrito correspondiente en el JSON de distritos
    //@ts-ignore
    const selectedDistrito = distritosData[selectedProvincia]?.find(
      (distrito: { id_ubigeo: string }) =>
        distrito.id_ubigeo === selectedDistritoId
    );

    // Verificar si se encontró el distrito
    if (selectedDistrito) {
      setSelectedDistritoName(selectedDistrito.nombre_ubigeo);
    } else {
      console.log("Distrito no encontrado");
    }

    handleChange(e);
  };
  useEffect(() => {
    setSelectedDepartamento(values.departamento);
  }, [values.departamento]);
  
  useEffect(() => {
    setSelectedProvincia(values.provincia);
  }, [values.provincia]);
  return (
    <div
      className={`grid md:grid-cols-3 gap-4 col-span-3 w-full "
      }`}
    >
      <div
        className={` w-full
        flex flex-col`}
      >
        <label htmlFor="" className={`${classLabels}`}>
          Departamento
        </label>
        <select
          value={values.departamento}
          onChange={handleDepartamentoChange}
          name="departamento"
          onBlur={handleBlur}
          className={` ${classInputs} ${reclamaciones ? "py-3" : ""}`}
        >
          <option value="">Selecciona un departamento</option>
          {departamentosData.map((departamento: Ubigeo) => (
            <option
              key={departamento.nombre_ubigeo}
              value={departamento.id_ubigeo}
            >
              {departamento.nombre_ubigeo}
            </option>
          ))}
        </select>
        <Errors errors={errors.departamento} touched={touched.departamento} />
      </div>

      <div
        className={`${
          reclamaciones ? "w-full md:w-[290px]" : " w-full"
        } flex flex-col`}
      >
        <label htmlFor="" className={`${classLabels}`}>
          Provincia
        </label>

        <select
          value={values.provincia}
          onChange={handleProvinciaChange}
          className={` ${classInputs} ${reclamaciones ? "py-3" : ""}`}
          name="provincia"
          onBlur={handleBlur}
        >
          <option value="">Selecciona una provincia</option>
          {/*@ts-ignore */}
          {provinciasData[selectedDepartamento]?.map((provincia: Ubigeo) => (
            <option key={provincia.nombre_ubigeo} value={provincia.id_ubigeo}>
              {provincia.nombre_ubigeo}
            </option>
          ))}
        </select>
        <Errors errors={errors.provincia} touched={touched.provincia} />
      </div>

      <div
        className={`${
          reclamaciones ? "w-full md:w-[290px]" : "w-full"
        } flex flex-col`}
      >
        <label htmlFor="" className={`${classLabels}`}>
          Distrito
        </label>
        <select
          value={values.distrito}
          onChange={handleDistritoChange}
          className={` ${classInputs} ${reclamaciones ? "py-3" : ""}`}
          name="distrito"
          onBlur={handleBlur}
        >
          <option value="">Selecciona un distrito</option>
          {/*@ts-ignore */}
          {distritosData[selectedProvincia]?.map((distrito: Ubigeo) => (
            <option key={distrito.nombre_ubigeo} value={distrito.id_ubigeo}>
              {distrito.nombre_ubigeo}
            </option>
          ))}
        </select>
        <Errors errors={errors.distrito} touched={touched.distrito} />
      </div>
    </div>
  );
};

export default SeleccionarUbicacion;
