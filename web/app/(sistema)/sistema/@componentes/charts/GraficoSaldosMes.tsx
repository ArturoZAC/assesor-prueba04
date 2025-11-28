
"use client"

import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useInView } from "react-intersection-observer"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useState } from "react"


const chartConfig = {
  utilidad: {
    label: "Gastos",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

export function GraficoSaldosMes({ dataSaldosMes }: { dataSaldosMes: any }) {

  
  const [ref, view] = useInView({ triggerOnce: false });
  const searchParams = useSearchParams()
  const [mes, setMes] = useState(searchParams.get('mes') || String(new Date().getMonth()))

  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMes(e.target.value)
    router.push(`/sistema?option=saldos&mes=${e.target.value}`)
  }

  return (
    <div ref={ref}>
      {
        view && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle><p className="uppercase">SALDOS {meses[Number(mes) - 1]}</p></CardTitle>
                <select name="" value={mes} onChange={handleChange} id="" className="border-2 border-gray-500 p-2 rounded-lg shadow-xl">
                  <option value="1">Enero</option>
                  <option value="2">Febrero</option>
                  <option value="3">Marzo</option>
                  <option value="4">Abril</option>
                  <option value="5">Mayo</option>
                  <option value="6">Junio</option>
                  <option value="7">Julio</option>
                  <option value="8">Agosto</option>
                  <option value="9">Septiembre</option>
                  <option value="10">Octubre</option>
                  <option value="11">Noviembre</option>
                  <option value="12">Diciembre</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ChartContainer config={chartConfig}>
                  <LineChart
                    accessibilityLayer
                    data={dataSaldosMes}
                    margin={{
                      left: 12,
                      right: 12,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="key"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}

                    />
                    <YAxis />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel className="bg-white-main" />}
                    />
                    <Line
                      dataKey="utilidad"
                      type="linear"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ChartContainer>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )
      }
    </div>
  )
}
