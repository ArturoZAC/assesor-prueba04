/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { config } from "@/config/config";
import AgregarCuadreFacturacion from "./@components/form/AgregarCuadreFacturacion";
import { TablaGeneralLeasing } from "../cuadre-leasing/@components/table/TableGeneralLeasing";
import { AdaptarFacturacionCuadre } from "./@components/types/AdaptarCuadreFacturacion";
import { columnasCuadreFacturacion } from "./@components/tablas/ColumnasCuadreFacturacion";
import ModalEditarCuadreFacturacion from "./@components/edicion/ModalEditarCuadreFacturacion";
import ExportarFormCuadreFacturas from "./@components/excel/ExportarFormCuadreFacturas";

export default async function page({ searchParams }: { searchParams: any }) {
  const limit = searchParams?.limit || 10;
  const pageParam = searchParams?.page;
  const search = typeof searchParams.search === "string" ? searchParams.search : "";

  const page = parseInt(Array.isArray(pageParam) ? pageParam[0] : pageParam ?? "1");
  const safePage = isNaN(page) || page < 1 ? 1 : page;

  const boleta = typeof searchParams.boleta === "string" ? searchParams.boleta : "";

  console.log(`${config.apiUrl}/cuadrefacturacion`);

  const res = await fetch(
    `${config.apiUrl}/cuadrefacturacion?page=${safePage}&limit=${limit}
          &search=${encodeURIComponent(search)}
          &boleta=${encodeURIComponent(boleta)}
          `,
    {
      cache: "no-store",
      credentials: "include",
    }
  );

  const { data, pagination } = await res.json();

  console.log({ data });

  const contextMenuOptions = [
    {
      label: "Agregar Cuadre Facturación",
      modal: <AgregarCuadreFacturacion />,
    },
    {
      label: "Editar Cuadre Facturacion",
      modal: <ModalEditarCuadreFacturacion />,
    },
  ];
  const dataFormateada = AdaptarFacturacionCuadre(data);

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
      name: "boleta",
      label: "Boleta",
      options: [
        {
          value: "BOL",
          label: "Boleta",
        },
        {
          value: "FAC ",
          label: "Factura",
        },
      ],
    },
  ];

  return (
    <section className="w-full">
      <TablaGeneralLeasing
        search={search}
        //@ts-ignore
        columns={columnasCuadreFacturacion}
        data={dataFormateada}
        modalRenderAdd={<AgregarCuadreFacturacion />}
        pagination={pagination}
        textAdd="Agregar cuadre leasing"
        filters={filtros}
        hideAddButton
        actionClick="agregar"
        showContextMenu
        endpoint="operaciones/exportarTablaOperaciones"
        formExportModal={<ExportarFormCuadreFacturas />}
        contextMenuOptions={contextMenuOptions}
      />
    </section>
  );
}
