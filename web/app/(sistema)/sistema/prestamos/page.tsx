/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react";
import { config } from "@/config/config";
import AgregarPrestamo from "./@componentes/form/AgregarPrestamo";
import { columnasPrestamos } from "./@componentes/types/ColumnasPrestamos";
import { adaptarPrestamos } from "./@componentes/types/AdaptarPrestamos";
import { TablaGeneralLegacy } from "@/components/tables/TablaGeneraLegacy";
import ExportExcelPrestamo from "./@componentes/excel/ExportExcelPrestamo";
import VerPrestamos from "./@componentes/form/VerPrestamos";

export default async function page({ searchParams }: { searchParams: any }) {
  const limit = 10;
  const pageParam = searchParams?.page;

  const page = parseInt(Array.isArray(pageParam) ? pageParam[0] : pageParam ?? "1");
  const safePage = isNaN(page) || page < 1 ? 1 : page;

  const search = typeof searchParams.search === "string" ? searchParams.search : "";
  const fecha = typeof searchParams.fecha === "string" ? searchParams.fecha : "";
  const estado = typeof searchParams.estado === "string" ? searchParams.estado : "";
  const moneda = typeof searchParams.moneda === "string" ? searchParams.moneda : "";
  console.log(`${config.apiUrl}/prestamos`);
  const res = await fetch(
    `${config.apiUrl}/prestamos?page=${safePage}
    &limit=${limit}
    &search=${encodeURIComponent(search)}
    &fecha=${encodeURIComponent(fecha)}
    &estado=${encodeURIComponent(estado)}
    &moneda=${encodeURIComponent(moneda)}
    `,
    {
      cache: "no-store",
      credentials: "include",
    }
  );

  const { data, pagination } = await res.json();
  console.log({ data });

  const datos = adaptarPrestamos(data);

  // console.log({ datos });

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
      label: "Estado del Prestamo",
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
    {
      name: "moneda",
      label: "Moneda",
      options: [
        {
          value: "USD",
          label: "Dólares",
        },
        {
          value: "PEN",
          label: "Soles",
        },
      ],
    },
  ];

  return (
    <section className="w-full">
      <TablaGeneralLegacy
        search={search}
        modalRenderAdd={<AgregarPrestamo />}
        modalRenderEdit={<VerPrestamos />}
        actionClick="editar"
        //@ts-ignore
        columns={columnasPrestamos}
        pagination={pagination}
        textAdd="Agregar prestamo"
        data={datos}
        filters={filtros}
        linkPath="/sistema/prestamos/calculo-anio"
        formExportModal={<ExportExcelPrestamo />}
      />
    </section>
  );
}
