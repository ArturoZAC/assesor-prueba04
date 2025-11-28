import { TituloSeccion } from "../../@components/structure/TituloSeccion";
import { TablaGeneral } from "../@componentes/TablaGeneral";
import { AgregarCliente } from "./@components/forms/AgregarCliente";
import { config } from "@/config/config";
import { columnasClientes } from "./@components/types/ColumnasClientes";
import { EditarCliente } from "./@components/forms/EditarCliente";

export default async function Clientes({
  searchParams,
}: {
  searchParams: any
}) {

  const limitParam = searchParams?.limit;

  const rawLimit = Array.isArray(limitParam)
    ? limitParam[0]
    : limitParam ?? "10";
  const pageParam = searchParams?.page;

  const limit = parseInt(rawLimit);

  const page = parseInt(
    Array.isArray(pageParam) ? pageParam[0] : pageParam ?? "1"
  );

  const safePage = isNaN(page) || page < 1 ? 1 : page;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : "";

  const tipoCliente =
    typeof searchParams.tipoCliente === "string"
      ? searchParams.tipoCliente
      : "";


  const res = await fetch(
    `${
      config.apiUrl
    }/clientes?page=${safePage}&limit=${limit}&search=${encodeURIComponent(
      search
    )}&tipoCliente=${encodeURIComponent(tipoCliente)}`,
    {
      cache: "no-store",
      credentials: 'include',
    }
  );

  console.log(`${config.apiUrl}/clientes`)

  const { data, pagination } = await res.json();

  const filtros = [
    {
      name: "tipoCliente",
      label: "Tipo de Cliente",
      options: [
        { value: "persona_juridica", label: "Persona Jurídica" },
        { value: "persona_natural", label: "Persona Natural" },
      ],
    },
  ];

  const filtrosExportacion = [
    { label: "Todos", value: "todos" },
    { label: "Persona Natural", value: "persona_natural" },
    { label: "Persona Jurídica", value: "persona_juridica" },
  ];

  return (
    <>
      <TituloSeccion />
      <section className="w-full">
        <TablaGeneral
          search={search}
          columns={columnasClientes}
          data={data}
          modalRenderAdd={<AgregarCliente />}
          pagination={pagination}
          textAdd="Agregar cliente"
          filters={filtros}
          modalRenderEdit={<EditarCliente />}
          actionClick="editar"
          endpoint="clientes/exportarTabla"
          exportFilters={filtrosExportacion}
          renderUploadMasive
          routeUploadApi="/clientes/importar-usuarios"
          renderCalculoTotal={false}
        />
      </section>
    </>
  );
}
