"use server";

// import { config } from "@/config/config";
import { GraficoDIVISAS } from "../charts/GraficoDIVISAS";
import { GraficoTotalDivisas } from "../charts/GraficoTotalDivisas";

const URL = process.env.NEXT_PUBLIC_API_URL;

const resDataRealTotal = await fetch(`${URL}/flujo-real-total/grafica-divisas`, {
  cache: "no-store",
  credentials: "include",
});
const dataRealTotal = await resDataRealTotal.json();

const resDataDivisas = await fetch(`${URL}/flujo-divisas/grafica-divisas`, {
  cache: "no-store",
  credentials: "include",
});
const dataDivisas = await resDataDivisas.json();

export default async function GraficasDivisas() {
  return (
    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <GraficoTotalDivisas dataRealTotal={dataDivisas} />
      <GraficoDIVISAS dataRealTotal={dataRealTotal} />
    </div>
  );
}
