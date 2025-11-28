/* eslint-disable react-hooks/exhaustive-deps */

"use client";


import React, { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type FilterOption = {
  value: string;
  label: string;
};

export type FilterBuscador = {
  name: string;
  label: string;
  options: FilterOption[];
};

function generarOpcionesAnos(anoInicio: number): number[] {
  const anoActual = new Date().getFullYear();
  const opcionesAnos: number[] = [];

  for (let i = anoInicio; i <= anoActual; i++) {
    opcionesAnos.push(i);
  }

  return opcionesAnos.sort((a, b) => b - a); // Ordenar de forma descendente (año actual primero)
}

export const BuscadorTablaCalculoTotal = () => {
  const anoInicioSistema = 2025;
  const opcionesAnos = generarOpcionesAnos(anoInicioSistema);
  const [anoSeleccionadoLocal, setAnoSeleccionadoLocal] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const anoEnURL = new URLSearchParams(searchParams.toString());

    setAnoSeleccionadoLocal(anoEnURL.get('year') || '');
  }, [router, opcionesAnos]);

  const handleChangeAno = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoAno = event.target.value;
    setAnoSeleccionadoLocal(nuevoAno);
    const searchParams = new URLSearchParams(location.search);
    if (nuevoAno) {
      searchParams.set('year', nuevoAno);
    } else {
      searchParams.delete('year');
    }
    router.push(`${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ``}`);
    console.log('Año seleccionado:', nuevoAno);
  };

  return (
    <section className="flex justify-between w-full gap-3 mb-3">
      <h2 className="text-2xl font-bold text-secondary-main">Resultado:</h2>
      <div className="flex items-end justify-end w-full gap-4">
        <div className="flex flex-col gap-1" >
          <label
            htmlFor=""
            className="text-sm font-semibold text-secondary-main"
          >
            Escoja el año
          </label>
          <select
            value={anoSeleccionadoLocal}
            onChange={handleChangeAno}
            className="p-2 text-sm border rounded-md outline-none focus:border-secondary-main"
          >
            <option value="">Selecciona una opción</option>
            {opcionesAnos.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
};
