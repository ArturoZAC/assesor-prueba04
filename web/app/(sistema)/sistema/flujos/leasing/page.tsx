import { config } from "@/config/config";
import { TablaFlujos } from "../@components/TablaFlujos";
import AgregarPorcentaje from "./@components/form/AgregarPorcentaje";
import EditarPorcentaje from "./@components/form/EditarPorcentaje";
import { ExportarDivisasExcel } from "./@components/form/ExportarDivisasExcel";

export default async function page({
  searchParams
}: {
  searchParams: Promise<{ anio: string }>
}) {

  const { anio } = await searchParams
  const filtros = [
    {
      name: "anio",
      label: "Filtro por año:",
      options: Array.from({ length: 10 }, (_, i) => {
        const year = new Date().getFullYear() + i;
        return { value: year.toString(), label: year.toString() };
      }),
    }
  ];

  const res = await fetch(`${config.apiUrl}/flujo-leasing${anio ? `?anio=${Number(anio)}` : ''}`, {
    credentials: 'include',
  })
  const dataResponse = await res.json()
  console.log(dataResponse)
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
          columns={
            dataResponse.data.dates
          }
          rows={
            dataResponse.data.rows
          }
          filters={filtros}
          pagination={paginas}
          AgregarModal={AgregarPorcentaje}
          AgregarPorcentaje={ AgregarPorcentaje }
          EditarModal={EditarPorcentaje}
          textAdd="Agregar Porcentaje"
          textAddPorcentaje="Agregar Porcentaje"
          ExportarExcel={ ExportarDivisasExcel }
          hidePorcentajeButton
        />
      </section>
    </>
  );
}