/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
'use server'

import { config } from "@/config/config";
import AgregarCuadreLeasing from "./@components/form/AgregarCuadreLeasing";
import EditarCuadreLeasing from "./@components/form/EditarCuadreLeasing";
import { TablaGeneralLeasing } from "./@components/table/TableGeneralLeasing";
import { columnasCuadreLeasing } from "./@components/table/ColumnasCuadreLeasingT";
import { AdaptarLeasingCuadre } from "./@components/types/AdaptarLeasing";
import ExportarExcelCuadreLeasing from "./@components/excel/ExportarExcelCuadreLeasing";


export default async function CuadreLeasingPage({
  searchParams
}: {
  searchParams: any
}) {

  const limit = searchParams?.limit || 10
  const pageParam = searchParams?.page || 1;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : "";

  const page = parseInt(
    Array.isArray(pageParam) ? pageParam[0] : pageParam ?? "1"
  );
  const safePage = isNaN(page) || page < 1 ? 1 : page;
  const fecha = typeof searchParams.fecha === "string" ? searchParams.fecha : ""
  console.log(`${config.apiUrl}/cuadreleasing`)
  const res = await fetch(
    `${config.apiUrl
    }/cuadreleasing?page=${safePage}&limit=${limit}
      &search=${encodeURIComponent(search)}
      &fecha=${encodeURIComponent(fecha)}`,
    {
      cache: "no-store",
      credentials: 'include',
    }
  );
  const { data, pagination } = await res.json();

  const contextMenuOptions = [
    {
      label: "Editar Cuadre Leasing",
      modal: <EditarCuadreLeasing />,
    },
    {
      label: "Agregar Cuadre Leasing",
      modal: <AgregarCuadreLeasing />,
    },
  ];
  const dataFormateada = AdaptarLeasingCuadre(data);
  console.log(dataFormateada)
  return (
    <>
      <section className="w-full">
        <TablaGeneralLeasing
          search={search}
          //@ts-ignore
          columns={columnasCuadreLeasing}
          data={dataFormateada}
          modalRenderAdd={<AgregarCuadreLeasing />}
          modalRenderEdit={<EditarCuadreLeasing />}
          pagination={pagination}
          textAdd="Agregar cuadre leasing"
          filters={[]}
          hideAddButton
          actionClick="agregar"
          showContextMenu
          contextMenuOptions={contextMenuOptions}
          formExportModal={<ExportarExcelCuadreLeasing />}
        />
      </section>
    </>
  )
}