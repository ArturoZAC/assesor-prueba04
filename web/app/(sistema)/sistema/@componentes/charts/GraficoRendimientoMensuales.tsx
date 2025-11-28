
'use client'

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useState } from "react"
import { FaTableCellsLarge } from "react-icons/fa6"
import { FaChartLine } from "react-icons/fa"
import { Montserrat } from "next/font/google"

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--montserrat-font'
})

interface RendimientoMensualData {
  fecha: string
  forzado: number
  medio: number
  esperado: number
}

const chartConfig = {
  fecha: {
    label: "Fecha",
    color: "hsl(var(--chart-1))",
  },
  forzado: {
    label: "Forzado",
    color: "hsl(var(--chart-2))",
  },
  medio: {
    label: "Medio",
    color: "hsl(var(--chart-3))",
  },
  esperado: {
    label: "Esperado",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export default function GraficoRendimientoMensuales({ dataRendimientosMensuales }: { dataRendimientosMensuales: RendimientoMensualData[] }) {

  const [mostrarTabla, setMostrarTabla] = useState(false)

  function handleTabla() {
    setMostrarTabla(!mostrarTabla)
  }

  console.log(dataRendimientosMensuales)

  return (
    <div className="w-full space-y-3">
      <div className="w-full">

      </div>
      <div>
        {
          mostrarTabla ? (
            <div className="p-3 shadow-xl shadow-neutral-300 rounded-xl space-y-4">
              <h2 className="font-bold ">Rendimientos Mensuales (%)</h2>
              <button
                type="button"
                className="px-4 py-2 mt-4 text-sm text-white bg-blue-600 text-white-main rounded-xl"
                onClick={handleTabla}
              >
                {
                  mostrarTabla ? <p className="flex gap-2 items-center">
                    <FaChartLine />
                    Mostrar Grafico
                  </p> : <p className="flex gap-2 items-center">
                    <FaTableCellsLarge />
                    Mostrar Tabla
                  </p>
                }
              </button>
              <table className="w-full">
                <thead className={`${montserrat.className} w-full border-b border-neutral-300 text-base`}>
                  <tr className="w-full">
                    <th className="pb-3">Mes</th>
                    <th className="pb-3">Forzado</th>
                    <th className="pb-3">Medio</th>
                    <th className="pb-3">Esperado</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    dataRendimientosMensuales.map((item) => {
                      return (
                        <tr key={item.fecha} className="border-b border-neutral-300">
                          <td className="text-center py-1 text-sm">{item.fecha}</td>
                          <td className="text-center py-1 text-sm">{item.forzado}</td>
                          <td className="text-center py-1 text-sm">{item.medio}</td>
                          <td className="text-center py-1 text-sm">{item.esperado}</td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
          )
            : (
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Rendimientos Mensuales (%)</CardTitle>
                  <CardDescription>
                    <button
                      type="button"
                      className="px-4 py-2 mt-4 text-sm text-white bg-blue-600 text-white-main rounded-xl"
                      onClick={handleTabla}
                    >
                      {
                        mostrarTabla ? <p className="flex gap-2 items-center">
                          <FaChartLine />
                          Mostrar Grafico
                        </p> : <p className="flex gap-2 items-center">
                          <FaTableCellsLarge />
                          Mostrar Tabla
                        </p>
                      }
                    </button>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width='100%' height={300}>
                    <ChartContainer config={chartConfig}>
                      <BarChart accessibilityLayer data={dataRendimientosMensuales}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="fecha"
                          tickLine={false}
                          tickMargin={5}
                          axisLine={false}
                          tickFormatter={(value) => value.slice(0, 1)}
                        />
                        <YAxis />
                        <Legend />
                        <ChartTooltip
                          cursor={false}
                          content={
                            <ChartTooltipContent
                              indicator="dashed"
                              className="bg-white-main"
                            />
                          }
                        />
                        <Bar dataKey="forzado" fill="hsl(var(--chart-2))" radius={4} isAnimationActive={false} />
                        <Bar dataKey="medio" fill="hsl(var(--chart-4))" radius={4} isAnimationActive={false} />
                        <Bar dataKey="esperado" fill="hsl(var(--chart-3))" radius={4} isAnimationActive={false} />
                      </BarChart>
                    </ChartContainer>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )
        }
      </div>
    </div>
  )
}