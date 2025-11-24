import SubMenuComponent from "./@componentes/form/SubMenuComponent";
import GraficasDivisas from "./@componentes/pages/GraficasDivisas";
import GraficasClientes from "./@componentes/pages/GraficasClientes";
import GraficasSaldos from "./@componentes/pages/GraficasSaldos";
import GraficasPrestamos from "./@componentes/pages/GraficasPrestamos";
import GraficasFlujo from "./@componentes/pages/GraficasFlujo";
import GraficasOperaciones from "./@componentes/pages/GraficasOperaciones";
import CuadroResumen from "./@componentes/pages/CuadroResumen";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ option: string; mes: string }>;
}) {
  const { option, mes } = await searchParams;

  return (
    <>
      <SubMenuComponent opcionParam={option} />
      <>
        {option === "cuadro-resumen" && <CuadroResumen />}
        {option === "operaciones" && <GraficasOperaciones />}
        {option === "flujo" && <GraficasFlujo />}
        {option === "prestamos" && <GraficasPrestamos />}
        {option === "saldos" && <GraficasSaldos mes={mes} />}
        {option == "clientes" && <GraficasClientes />}
        {option === "divisas" && <GraficasDivisas />}
        {/* <GraficaLineaSpread dataSpreadTodos={dataSpreadTodos} /> */}
        {/* <GraficoLineaTC dataPromedioTodos={dataPromedioTodos} /> */}
        {/* <GraficoLeasing dataRealTotal={dataRealTotal} /> */}
        {/* <GraficoCantidadClientesAtendidos dataClientesAtendidos={dataClientesAtendidos} />
        <GraficoRendimientoMensuales dataRendimientosMensuales={dataRendimientosMensuales} />
        <GraficoTicketPromedio dataTicketPromedio={dataTicketPromedio} />
        <GraficoRealVsPresupuesto dataRealVsPresupuesto={dataRealVsPresupuesto} />
        <GraficoDIVISAS dataRealTotal={dataRealTotal} />
        <GraficoPrestamo dataRealTotal={dataRealTotal} />
        <GraficoTotalesFlujo dataRealTotal={dataRealTotal} />
        <GraficoConsultoria dataConsultoria={dataConsultoria} />
        <GraficoAcumuladosTotales dataRealTotal={dataRealTotal} />
        <GraficoTotalDivisas dataRealTotal={dataDivisas} />
        <GraficoSaldosMes dataSaldosMes={dataSaldosMes} /> */}
      </>
    </>
  );
}
