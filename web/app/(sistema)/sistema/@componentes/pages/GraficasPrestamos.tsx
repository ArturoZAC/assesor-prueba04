import { config } from "@/config/config";
import { GraficoPrestamo } from "../charts/GraficoPrestamo";
import { AcumuladosPrestamos } from "../charts/ingresos_vs_gastos/AcumuladosPrestamos";

const dataPrestamos = await fetch(`${config.apiUrl}/flujo-prestamos/grafica-acumulados`, {
    cache: "no-store",
    credentials: 'include',
})
const realPrestamos = await dataPrestamos.json()

const resDataRealTotal = await fetch(`${config.apiUrl}/flujo-real-total/grafica-divisas`, {
    cache: "no-store",
    credentials: 'include',
})
const dataRealTotal = await resDataRealTotal.json()

export default async function GraficasPrestamos() {
    return (
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <GraficoPrestamo dataRealTotal={dataRealTotal} />
            <AcumuladosPrestamos realPrestamos={realPrestamos} />
        </div>
    )
}