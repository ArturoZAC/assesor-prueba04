/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { config } from "@/config/config";
import { TablaGeneral } from "../@componentes/TablaGeneral";
import { AgregarOperacion } from "./@components/forms/AgregarOperacion";
import { columnasOperaciones } from "./@components/types/ColumnasOperaciones";
import { adaptarOperaciones } from "./@components/types/AdaptarOperaciones";
import { EditarOperacion } from "./@components/forms/EditarOperacion";
export default async function page({ searchParams }: { searchParams: any }) {
  const limit = Number(searchParams?.limit || 10);
  const pageParam = searchParams?.page;

  const page = parseInt(Array.isArray(pageParam) ? pageParam[0] : pageParam ?? "1");
  const safePage = isNaN(page) || page < 1 ? 1 : page;

  const search = typeof searchParams.search === "string" ? searchParams.search : "";

  const tipoCliente = typeof searchParams.tipoCliente === "string" ? searchParams.tipoCliente : "";

  const tipo = typeof searchParams.tipo === "string" ? searchParams.tipo : "";

  const fecha = typeof searchParams.fecha === "string" ? searchParams.fecha : "";
  console.log(`${config.apiUrl}/operaciones`);
  const res = await fetch(
    `${config.apiUrl}/operaciones?page=${safePage}&limit=${limit}&tipoCliente=${encodeURIComponent(
      tipoCliente
    )}&tipo=${encodeURIComponent(tipo)}&search=${encodeURIComponent(
      search
    )}&fecha=${encodeURIComponent(fecha)}`,
    {
      cache: "no-store",
      credentials: "include",
    }
  );
  const { data, pagination } = await res.json();
  console.log(pagination);
  const datos = adaptarOperaciones(data);

  const filtros = [
    {
      name: "tipoCliente",
      label: "Tipo de Cliente",
      options: [
        { value: "persona_juridica", label: "Persona Jurídica" },
        { value: "persona_natural", label: "Persona Natural" },
      ],
    },
    {
      name: "tipo",
      label: "Tipo",
      options: [
        { value: "COMPRA", label: "Compra" },
        { value: "VENTA", label: "Venta" },
      ],
    },
    {
      name: "fecha",
      label: "Fecha",
      options: [
        { value: "hoy", label: "Hoy" },
        { value: "ayer", label: "Ayer" },
        { value: "ultimos_7_dias", label: "Últimos 7 días" },
        { value: "este_mes", label: "Este mes" },
        { value: "mes_pasado", label: "Mes pasado" },
      ],
    },
  ];

  const filtrosExportacion = [
    { label: "Todos", value: "todos" },
    { label: "Compra", value: "COMPRA" },
    { label: "Venta", value: "VENTA" },
  ];
  return (
    <>
      <section className="w-full">
        <TablaGeneral
          search={search}
          //@ts-ignore
          columns={columnasOperaciones}
          data={datos}
          modalRenderAdd={<AgregarOperacion />}
          modalRenderEdit={<EditarOperacion />}
          pagination={pagination}
          textAdd="Agregar"
          filters={filtros}
          actionClick="editar"
          linkPath="/sistema/operaciones/calcular-anio"
          endpoint="operaciones/exportarTablaOperaciones"
          exportFilters={filtrosExportacion}
          renderUploadMasive
          routeUploadApi="/operaciones/importar-operaciones"
          renderCalculoTotal
        />
      </section>
    </>
  );
}
