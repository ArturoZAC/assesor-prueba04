import React from 'react'
import AgregarPorcentajePrestamo from './@components/form/AgregarPorcentajePrestamo';
import EditarPorcentajePrestamo from './@components/form/EditarPorcentajePrestamo';
import { TablaFlujos } from '../@components/TablaFlujos';
import { config } from '@/config/config';
import { ExportarPrestamosExcel } from './@components/form/ExportarPrestamosExcel';

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

  const res = await fetch(`${config.apiUrl}/flujo-prestamos${anio ? `?anio=${Number(anio)}` : ''}`, {
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
          AgregarModal={AgregarPorcentajePrestamo}
          EditarModal={EditarPorcentajePrestamo}
          textAdd="Agregar Porcentaje"
          ExportarExcel={ ExportarPrestamosExcel }
          hidePorcentajeButton
        />
      </section>
    </>
  );
}
