/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

/* eslint-disable @typescript-eslint/ban-ts-comment */

import React from "react";
import { config } from "@/config/config";
import AgregarLeasing from "./@components/form/AgregarLeasing";
import { columnasLeasing } from "./@components/types/ColumnasLeasing";
import { adaptarLeasing } from "./@components/types/AdaptarLeasing";
import { TablaGeneralLegacy } from "@/components/tables/TablaGeneraLegacy";
import ExportExcelLeasing from "./@components/excel/ExportExcelLeasing";
import VerLeasing from "./@components/form/VerLeasing";

export default async function LeasingPage({ searchParams }: { searchParams: any }) {
  const limit = searchParams?.limit || 10;
  const pageParam = searchParams?.page;

  const page = parseInt(Array.isArray(pageParam) ? pageParam[0] : pageParam ?? "1");
  const safePage = isNaN(page) || page < 1 ? 1 : page;

  const search = typeof searchParams.search === "string" ? searchParams.search : "";
  const fecha = typeof searchParams.fecha === "string" ? searchParams.fecha : "";
  const estado = typeof searchParams.estado === "string" ? searchParams.estado : "";
  console.log(`${config.apiUrl}/leasing`);
  const res = await fetch(
    `${config.apiUrl}/leasing?page=${safePage}
      &limit=${limit}
      &search=${encodeURIComponent(search)}
      &fecha=${encodeURIComponent(fecha)}
      &estado=${encodeURIComponent(estado)}
      `,
    {
      cache: "no-store",
      credentials: "include",
    }
  );

  const { data, pagination } = await res.json();

  console.log({ data });

  const datos = adaptarLeasing(data);

  const filtros = [
    {
      name: "fecha",
      label: "Mes",
      options: [
        { value: "enero", label: "Enero" },
        { value: "febrero", label: "Febrero" },
        { value: "marzo", label: "Marzo" },
        { value: "abril", label: "Abril" },
        { value: "mayo", label: "Mayo" },
        { value: "junio", label: "Junio" },
        { value: "julio", label: "Julio" },
        { value: "agosto", label: "Agosto" },
        { value: "septiembre", label: "Septiembre" },
        { value: "octubre", label: "Octubre" },
        { value: "noviembre", label: "Noviembre" },
        { value: "diciembre", label: "Diciembre" },
      ],
    },
    {
      name: "estado",
      label: "Estado del Leasing",
      options: [
        {
          value: "PENDIENTE",
          label: "Pendiente",
        },
        {
          value: "A_PLAZO",
          label: "A Plazo",
        },
        {
          value: "PAGADO",
          label: "Pagado",
        },
      ],
    },
  ];

  return (
    <section className="w-full">
      <TablaGeneralLegacy
        search={search}
        modalRenderAdd={<AgregarLeasing />}
        modalRenderEdit={<VerLeasing />}
        actionClick="editar"
        //@ts-ignore
        columns={columnasLeasing}
        pagination={pagination}
        textAdd="Agregar Leasing"
        data={datos}
        filters={filtros}
        formExportModal={<ExportExcelLeasing />}
        linkPath="/sistema/leasing/calculo-anio"
      />
    </section>
  );
}
