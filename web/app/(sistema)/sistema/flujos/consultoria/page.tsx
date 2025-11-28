
'use server'

import { config } from "@/config/config";

import { TablaFlujos } from "../@components/TablaFlujos";
import { AgregarConsultoriaFlujo } from "./@components/form/AgregarConsultoriaFlujo";
import EditarConsultoriaFlujo from "./@components/form/EditarConsultoriaFlujo";
import ExportarConsultoriaExcel from "./@components/form/ExportarConsultoriaExcel";
import AgregarConsultoriaPorcentaje from "./@components/form/AgregarConsultoriaPorcentaje";

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

  const res = await fetch(`${config.apiUrl}/flujo-consultoria${anio ? `?anio=${Number(anio)}` : ''}`, {
    credentials: 'include',
  })
  const dataResponse = await res.json()
  
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
          textAddPorcentaje="Agregar Porcentaje"
          textAdd="Agregar Consultoria"
          filters={filtros}
          pagination={paginas}
          AgregarModal={ AgregarConsultoriaFlujo }
          EditarModal={ EditarConsultoriaFlujo }
          ExportarExcel={ ExportarConsultoriaExcel }
          AgregarPorcentaje={ AgregarConsultoriaPorcentaje }
        />
      </section>
    </>
  );
}
