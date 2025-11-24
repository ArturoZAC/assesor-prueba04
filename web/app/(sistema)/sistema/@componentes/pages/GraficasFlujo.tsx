import { config } from "@/config/config";
import { GraficoConsultoria } from "../charts/GraficaConsultoria";
import { GraficoAcumuladosTotales } from "../charts/GraficoAcumuladosTotales";
import { GraficoRealVsPresupuesto } from "../charts/GraficoRealVsPresupuesto";
import { GraficoTotalesFlujo } from "../charts/GraficoTotalesFlujo";

const resRealVsPresupuesto = await fetch(`${config.apiUrl}/flujo/grafica/total-real-ppto`, {
  cache: "no-store",
  credentials: "include",
});
const dataRealVsPresupuesto = await resRealVsPresupuesto.json();

const resDataRealTotal = await fetch(`${config.apiUrl}/flujo-real-total/grafica-divisas`, {
  cache: "no-store",
  credentials: "include",
});
const dataRealTotal = await resDataRealTotal.json();

const resDataConsultoria = await fetch(`${config.apiUrl}/flujo/grafica/consultoria`, {
  cache: "no-store",
  credentials: "include",
});
const dataConsultoria = await resDataConsultoria.json();

export default async function GraficasFlujo() {
  return (
    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <GraficoRealVsPresupuesto dataRealVsPresupuesto={dataRealVsPresupuesto} />
      <GraficoAcumuladosTotales dataRealTotal={dataRealTotal} />
      <GraficoTotalesFlujo dataRealTotal={dataRealTotal} />
      <GraficoConsultoria dataConsultoria={dataConsultoria} />
    </div>
  );
}
