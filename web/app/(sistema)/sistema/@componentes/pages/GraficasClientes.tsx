"use server";

import { config } from "@/config/config";
import GraficoCantidadClientesAtendidos from "../charts/GraficoCantidadClientesAtendidos";

const resClientesAtendidos = await fetch(
  `${config.apiUrl}/operaciones/grafico-cantidad-clientes-atendidos`,
  {
    cache: "no-store",
    credentials: "include",
  }
);
const dataClientesAtendidos = await resClientesAtendidos.json();

export default async function GraficasClientes() {
  return (
    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <GraficoCantidadClientesAtendidos dataClientesAtendidos={dataClientesAtendidos} />
    </div>
  );
}
