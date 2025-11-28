/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { config } from "@/config/config";
import { TablaGeneral } from "../@componentes/TablaGeneral";
import { AgregarCuadreOperacion } from "./@components/forms/AgregarCuadreOperacion";
import { cabecerasCuadreOperacion } from "./@components/tablas/CabecerasCuadreOperaciones";
import { EditarCuadreOperacion } from "./@components/forms/EditarCuadreOperacion";
import { AgregarCuadreDolares } from "./@components/forms/AgregarCuadreDolares";
import { AgregarCuadreSoles } from "./@components/forms/AgregarCuadreSoles";

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

  const tipoCliente = typeof searchParams.tipoCliente === "string" ? searchParams.tipoCliente : "";

  const tipo = typeof searchParams.tipo === "string" ? searchParams.tipo : "";

  const fecha = typeof searchParams.fecha === "string" ? searchParams.fecha : "";
  console.log(`${config.apiUrl}/operacions/obtenerCuadreOperaciones`);
  const res = await fetch(
    `${
      config.apiUrl
    }/operaciones/obtenerCuadreOperaciones?page=${safePage}&limit=${safeLimit}&tipoCliente=${encodeURIComponent(
      tipoCliente
    )}&search=${encodeURIComponent(search)}&tipo=${encodeURIComponent(
      tipo
    )}&fecha=${encodeURIComponent(fecha)}`,
    {
      cache: "no-store",
      credentials: "include",
    }
  );

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
  ];
  const { data, pagination } = await res.json();
  console.log(data);
  const dataFormateada = data.map((item: any) => ({
    id: item.cuadreOperacion?.id ?? null,
    operacionId: item.id,
    fecha: item.fecha,
    cliente: `${item.usuario.apellido_paterno} ${item.usuario.apellido_materno}, ${item.usuario.nombres}`,
    tipo: item.tipo,
    tc_compra: item.tipoCambio?.compra ?? null,
    tc_venta: item.tipoCambio?.venta ?? null,
    dolares: item.flujoFondos?.montoUSD ?? null,
    soles: item.flujoFondos?.montoPEN ?? null,
    cuadreDolaresAll: item.cuadreDolaresAll ?? null,
    cuadreSolesAll: item.cuadreSolesAll ?? null,
    fecha_usd: item.cuadreOperacion?.CuadreOperacionDolares[0]?.fecha_usd ?? null,
    descripcion_op_usd: item.cuadreOperacion?.CuadreOperacionDolares[0]?.descripcion_op_usd ?? null,
    monto_usd: item.cuadreOperacion?.CuadreOperacionDolares[0]?.monto_usd ?? null,
    referencia_usd: item.cuadreOperacion?.CuadreOperacionDolares[0]?.referencia_usd ?? null,
    diferencia_usd: (() => {
      let current = Number(item.dolares);

      console.log(item.cuadreDolaresAll);
      item.cuadreDolaresAll?.forEach((cuadre: any) => {
        console.log(current, cuadre.monto_usd);
        current = Math.abs(current) - Math.abs(Number(cuadre.monto_usd));
      });
      return Number(-current.toFixed(2));
    })(),
    fecha_pen: item.cuadreOperacion?.CuadreOperacionSoles[0]?.fecha_pen ?? null,
    descripcion_op_pen: item.cuadreOperacion?.CuadreOperacionSoles[0]?.descripcion_op_pen ?? null,
    monto_pen: item.cuadreOperacion?.CuadreOperacionSoles[0]?.monto_pen ?? null,
    referencia_pen: item.cuadreOperacion?.CuadreOperacionSoles[0]?.referencia_pen ?? null,
    // item.cuadreOperacion?.CuadreOperacionSoles[0]?.diferencia_pen ?? null,
    diferencia_pen: (() => {
      let current = Number(item.flujoFondos.montoPEN);
      item.cuadreSolesAll?.forEach((cuadre: any) => {
        current = Math.abs(current) - Math.abs(Number(cuadre.monto_pen));
      });

      return Number(-current.toFixed(2));
    })(),

    cuadreIncompleto: item.cuadreIncompleto,
    cuadreCompleto: JSON.stringify(item.cuadreCompleto),
    resaltarFila: {
      active: item.cuadreOperacion?.CuadreOperacionDolares.length > 1 ? true : false,
      data: [
        {
          label: `${item.cuadreOperacion?.CuadreOperacionDolares.length} cuadres dólares`,
        },
        {
          label: `${item.cuadreOperacion?.CuadreOperacionSoles.length} cuadres soles`,
        },
      ],
    },
  }));

  const contextMenuOptions = [
    {
      label: "Editar",
      modal: <EditarCuadreOperacion />,
    },
    {
      label: "Agregar cuadre operación ($)",
      modal: <AgregarCuadreDolares />,
    },
    {
      label: "Agregar cuadre operación (S)",
      modal: <AgregarCuadreSoles />,
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
          columns={cabecerasCuadreOperacion}
          data={dataFormateada}
          modalRenderAdd={<AgregarCuadreOperacion />}
          modalRenderEdit={<EditarCuadreOperacion />}
          pagination={pagination}
          textAdd="Agregar cuadre operación"
          filters={filtros}
          hideAddButton
          actionClick="agregar"
          showContextMenu
          contextMenuOptions={contextMenuOptions}
          endpoint="operaciones/exportarTablaCuadreOperaciones"
          exportFilters={filtrosExportacion}
          renderUploadMasive
          routeUploadApi="/operaciones/importar-cuadres"
        />
      </section>
    </>
  );
}
