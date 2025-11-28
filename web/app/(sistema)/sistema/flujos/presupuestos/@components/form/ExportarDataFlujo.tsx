"use client";
import { config } from "@/config/config";
import { useFormik } from "formik";
import React from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/useAuthContext";
import { ButtonCancelar } from "../../../../../@components/ButtonCancelar";

export const ExportarDataFlujo = () => {
  const { closeModal } = useAuth();

  const options = Array.from({ length: 10 }, (_, i) => {
    const year = 2025 + i;
    return { value: String(year), label: String(year) };
  });

  const { values, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      anio: "",
    },
    onSubmit: async (values) => {
      const response = await fetch(
        `${config.apiUrl}/flujo/exportar/tabla-excel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        toast.error("Error al exportar el Excel");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      closeModal();
    },
  });
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2 className="mb-8 text-3xl font-medium text-center font_kanit text-secondary-main">
          Filtros de Exportación
        </h2>
        <div className="w-full">
          <div className="grid grid-cols-1 mb-5 gap-x-4 gap-y-6 md:grid-cols-2">
            <div className="w-full">
              <label className="text-black-800">Año</label>
              <select
                name="anio"
                id="anio"
                value={values.anio}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-2 border rounded-md outline-none placeholder:text-sm focus:border-secondary-main"
              >
                <option value="">Todos</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center w-full gap-4 mt-4 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <ButtonCancelar />
          </div>
          <div className="w-full lg:w-1/2">
            <button
              type="submit"
              className="flex items-center justify-center w-full py-3 transition-all duration-200 bg-green-600 text-white-main rounded-main"
            >
              Exportar Excel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
