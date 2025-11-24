"use server";

// import { config } from "@/config/config";
import GraficoGeneracionCaja from "../charts/GraficoGeneracionCaja";
// import { GraficoLineaComparacion } from "../charts/GraficoLineaComparacion";
import GraficoMontosCambiados from "../charts/GraficoMontosCambiados";
import GraficoRendimientoMensuales from "../charts/GraficoRendimientoMensuales";
import { GraficoTicketPromedio } from "../charts/GraficoTicketPromedio";
import { GraficoLineaSimple } from "../charts/GraficoLineaSimple";

const url = process.env.NEXT_PUBLIC_API_URL;

const res = await fetch(`${url}/operaciones/operaciones-por-mes`, {
  cache: "no-store",
  credentials: "include",
});
const data = await res.json();

const resGeneracionCaja = await fetch(`${url}/operaciones/grafico-generacion-caja`, {
  cache: "no-store",
  credentials: "include",
});
const dataGeneracionCaja = await resGeneracionCaja.json();

const resMontosCambiados = await fetch(`${url}/operaciones/grafico-montos-cambiados`, {
  cache: "no-store",
  credentials: "include",
});
const dataMontosCambiados = await resMontosCambiados.json();

const resTicketPromedio = await fetch(`${url}/operaciones/grafico-ticket-promedio`, {
  cache: "no-store",
  credentials: "include",
});
const dataTicketPromedio = await resTicketPromedio.json();

const resRendimientosMensuales = await fetch(`${url}/operaciones/grafico-rendimiento-mensuales`, {
  cache: "no-store",
  credentials: "include",
});
const dataRendimientosMensuales = await resRendimientosMensuales.json();

export default async function GraficasOperaciones() {
  return (
    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <GraficoLineaSimple
        title="Evolución Total en Dólares"
        data={data}
        dataKey="totalDolares"
        color="#6366f1"
        label="Total Dólares"
        prefix="$"
      />
      <GraficoLineaSimple
        title="Evolución Total de Operaciones"
        data={data}
        dataKey="totalOperaciones"
        color="#f43f5e"
        label="Total Operaciones"
      />
      <GraficoGeneracionCaja dataGeneracionCaja={dataGeneracionCaja} />
      <GraficoMontosCambiados dataMontosCambiados={dataMontosCambiados} />
      <GraficoTicketPromedio dataTicketPromedio={dataTicketPromedio} />
      <GraficoRendimientoMensuales dataRendimientosMensuales={dataRendimientosMensuales} />
    </div>
  );
}
