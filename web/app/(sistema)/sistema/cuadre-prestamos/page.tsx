/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */

'use server'

import { config } from "@/config/config";
import RegistrarCuadrePrestamo from "./@components/form/RegistrarCuadrePrestamo";
import { TablaGeneralPrestamo } from "./@components/tablas/TablaGeneralPrestamo";
import { prestamosColumnDef } from "./@components/types/ColumnasCuadrePrestamos";
import { adaptarPrestamosCuadre } from "./@components/types/AdaptarCuadrePrestamos";
import EditarCuadrePrestamoGeneral from "./@components/edicion/EditarCuadrePrestamoGeneral";
import RegistrarCuadreDevolucion from "./@components/form/RegistrarCuadreDevolucion";
import FiltrosExportarExcelPrestamos from "./@components/excel/FiltrosExportarExcelPrestamos";

export default async function CuadrePrestamosPage({
  searchParams
}: {
  searchParams: any
}) {

  const limit = 10;
  const pageParam = searchParams?.page;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : "";

  const page = parseInt(
    Array.isArray(pageParam) ? pageParam[0] : pageParam ?? "1"
  );
  const safePage = isNaN(page) || page < 1 ? 1 : page;
  const fecha = typeof searchParams.fecha === "string" ? searchParams.fecha : ""
  console.log(`${config.apiUrl}/cuadreprestamos`)
  const res = await fetch(
    `${config.apiUrl
    }/cuadreprestamos?page=${safePage}&limit=${limit}
        &search=${encodeURIComponent(search)}
        &fecha=${encodeURIComponent(fecha)}`,
    {
      cache: "no-store",
      credentials: 'include',
    }
  );
  const { data, pagination } = await res.json();
  console.log(data)

  const contextMenuOptions = [
    {
      label: "Agregar Devolución Prestamo",
      modal: <RegistrarCuadreDevolucion />,
    },
    {
      label: "Agregar Salida Prestamo",
      modal: <RegistrarCuadrePrestamo />,
    },
    {
      label: "Editar Cuadre Prestamo",
      modal: <EditarCuadrePrestamoGeneral />,
    }
  ];

  const dataFormateada = adaptarPrestamosCuadre(data);
  console.log('Data',dataFormateada)
  return (
    <div className="w-full">
      <TablaGeneralPrestamo 
      
        search={search}
        //@ts-ignore
        columns={prestamosColumnDef}
        data={dataFormateada}
        modalRenderAdd={<RegistrarCuadrePrestamo />}
        pagination={pagination}
        textAdd="Agregar cuadre prestamo"
        filters={[]}
        hideAddButton
        actionClick="editar"
        showContextMenu
        contextMenuOptions={contextMenuOptions}
        formExportModal={<FiltrosExportarExcelPrestamos />}
      />
    </div>
  )
}