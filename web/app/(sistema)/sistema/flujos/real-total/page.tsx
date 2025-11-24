import { config } from "@/config/config";
import { TablaFlujos } from "../@components/TablaFlujos";
import { ExportarTotalExcel } from "./@components/form/ExportarTotalExcel";

export default async function page({ searchParams }: { searchParams: Promise<{ anio: string }> }) {
  const { anio } = await searchParams;
  const filtros = [
    {
      name: "anio",
      label: "Filtro por año:",
      options: Array.from({ length: 10 }, (_, i) => {
        const year = new Date().getFullYear() + i;
        return { value: year.toString(), label: year.toString() };
      }),
    },
  ];

  const res = await fetch(
    `${config.apiUrl}/flujo-real-total${anio ? `?anio=${Number(anio)}` : ""}`,
    {
      credentials: "include",
    }
  );
  const dataResponse = await res.json();
  console.log(`${config.apiUrl}/flujo-real-total`);
  // console.log({
  //   mitadRows: dataResponse.data.rows.slice(Math.ceil(dataResponse.data.rows.length / 2)),
  //   fechas: dataResponse.data.dates,
  // });

  // console.log({
  //   mitadRows: dataResponse.data.rows,
  //   fechas: dataResponse.data.dates,
  // });
  const paginas = {
    total: 125,
    page: 2,
    limit: 10,
    totalPages: 13,
  };
  return (
    <>
      <section className="w-full">
        <TablaFlujos
          columns={dataResponse.data.dates}
          rows={dataResponse.data.rows}
          filters={filtros}
          pagination={paginas}
          textAdd="Agregar Porcentaje"
          hideAgregarButton
          hidePorcentajeButton
          ExportarExcel={ExportarTotalExcel}
        />
      </section>
    </>
  );
}
