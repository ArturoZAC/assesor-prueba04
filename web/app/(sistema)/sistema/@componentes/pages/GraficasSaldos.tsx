
'use server'

import { config } from "@/config/config";
import { GraficoSaldosMes } from "../charts/GraficoSaldosMes";


export default async function GraficasSaldos({ mes }: { mes: string }) {

    const resDataSaldosMes = await fetch(`${config.apiUrl}/saldos/grafica-saldos${mes ? `?mes=${mes}` : ''}`, {
        cache: "no-store",
        credentials: 'include',
    })
    const dataSaldosMes = await resDataSaldosMes.json()

    return (
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <GraficoSaldosMes dataSaldosMes={dataSaldosMes} />
        </div>
    )
}