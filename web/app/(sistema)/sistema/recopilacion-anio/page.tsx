"use server";

import { TablaGeneralLegacy } from "@/components/tables/TablaGeneraLegacy";
import React from "react";
import { columnasRecopilacionAnios } from "./@components/types/columnasRecopilacionAnios";
import { config } from "@/config/config";
import AgregarGastoAnio from "./@components/form/AgregarGastoAnio";
import ExportarRecopilacionExcel from "./@components/excel/ExportarRecopilacionExcel";

export default async function page({ searchParams }: { searchParams: Promise<{ year: string }> }) {
  const { year } = await searchParams;
  console.log(`${config.apiUrl}/gastos/recopilacion-anio`);
  const res = await fetch(
    `${config.apiUrl}/gastos/recopilacion-anio${year ? `?anio=${year}` : ""}`,
    {
      method: "GET",
      cache: "no-store",
      credentials: "include",
    }
  );
  const { data } = await res.json();

  console.log("Data desde recopilacion año", data);

  return (
    <div className="w-full">
      <TablaGeneralLegacy
        columns={columnasRecopilacionAnios}
        data={data}
        actionClick="agregar"
        filters={[]}
        textAdd="Agregar Tipo de Cambio"
        modalRenderAdd={<AgregarGastoAnio />}
        formExportModal={<ExportarRecopilacionExcel />}
        hideExportarExcel
      />
    </div>
  );
}
