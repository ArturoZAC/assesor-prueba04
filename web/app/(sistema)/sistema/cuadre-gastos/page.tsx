/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { config } from "@/config/config";
import { TablaGeneral } from "../@componentes/TablaGeneral";
import { AgregarGastos } from "./@components/form/AgregarGastos";
import { columnasGastos } from "./@components/types/ColumnasGastos";
import { EditarGastos } from "./@components/form/EditarGastos";

export default async function page({ searchParams }: { searchParams: any }) {
  const pageParam = searchParams?.page;
  const limitParam = searchParams?.limit;

  const rawLimit = Array.isArray(limitParam) ? limitParam[0] : limitParam ?? "10";
  const rawPage = Array.isArray(pageParam) ? pageParam[0] : pageParam ?? "1";

  const limit = parseInt(rawLimit);
  const page = parseInt(rawPage);

  const safeLimit = isNaN(limit) || limit <= 0 ? 10 : limit;
  const safePage = isNaN(page) || page < 1 ? 1 : page;

  const search = typeof searchParams.search === "string" ? searchParams.search : "";

  const tipoMoneda = typeof searchParams.tipoMoneda === "string" ? searchParams.tipoMoneda : "";

  const tipoGasto = typeof searchParams.tipoGasto === "string" ? searchParams.tipoGasto : "";

  console.log(`${config.apiUrl}/gastos`);
  const res = await fetch(
    `${config.apiUrl}/gastos?page=${safePage}&limit=${safeLimit}&tipoGasto=${encodeURIComponent(
      tipoGasto
    )}&search=${encodeURIComponent(search)}&tipoMoneda=${encodeURIComponent(tipoMoneda)}`,
    {
      cache: "no-store",
      credentials: "include",
    }
  );
  const { data, pagination } = await res.json();

  console.log("DATA: ", data);

  const filtros = [
    {
      name: "tipoGasto",
      label: "Tipo de Gasto",
      options: [
        { value: "mantenimiento", label: "Gastos de Mantenimiento" },
        { value: "funcionamiento", label: "Gastos de Funcionamiento" },
        { value: "personal", label: "Gastos de Personal" },
        { value: "diversos_operativos", label: "Gastos Diversos Operativos" },
        { value: "impuestos", label: "Gastos de Pago de Impuestos" },
        {
          value: "intereses_renta_segunda",
          label: "Intereses por Préstamo de Fondo (Renta Segunda Categoría)",
        },
        { value: "overnight_bcp", label: "Overnight BCP" },
        { value: "itf", label: "Gastos de ITF" },
        {
          value: "prestamos_sin_interes",
          label: "Préstamos que No Generan Intereses",
        },
      ],
    },
    {
      name: "tipoMoneda",
      label: "Tipo de Moneda",
      options: [
        { value: "PEN", label: "PEN" },
        { value: "USD", label: "USD" },
      ],
    },
  ];

  const filtrosExportacion = [
    { label: "Todos", value: "todos" },
    { value: "mantenimiento", label: "Gastos de Mantenimiento" },
    { value: "funcionamiento", label: "Gastos de Funcionamiento" },
    { value: "personal", label: "Gastos de Personal" },
    { value: "diversos_operativos", label: "Gastos Diversos Operativos" },
    { value: "impuestos", label: "Gastos de Pago de Impuestos" },
    {
      value: "intereses_renta_segunda",
      label: "Intereses por Préstamo de Fondo (Renta Segunda Categoría)",
    },
    { value: "overnight_bcp", label: "Overnight BCP" },
    { value: "itf", label: "Gastos de ITF" },
    {
      value: "prestamos_sin_interes",
      label: "Préstamos que No Generan Intereses",
    },
  ];
  return (
    <section className="w-full">
      <TablaGeneral
        search={search}
        //@ts-ignore
        columns={columnasGastos}
        data={data}
        modalRenderAdd={<AgregarGastos />}
        modalRenderEdit={<EditarGastos />}
        pagination={pagination}
        textAdd="Agregar gastos"
        filters={filtros}
        actionClick="editar"
        endpoint="gastos/exportarTablaGastos"
        exportFilters={filtrosExportacion}
        renderTotal
      />
    </section>
  );
}
