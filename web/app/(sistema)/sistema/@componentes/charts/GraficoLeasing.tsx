/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
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

const chartConfig = {
  ingresosDivisas: {
    label: "Divisas",
    color: "hsl(var(--chart-1))",
  },
  ingresosPorPrestamos: {
    label: "Préstamos",
    color: "hsl(var(--chart-2))",
  },
  leasing: {
    label: "Leasing",
    color: "hsl(var(--chart-3))",
  }
} satisfies ChartConfig
export function GraficoLeasing({ dataRealTotal }: { dataRealTotal: any }) {

  const [ref, view] = useInView({ triggerOnce: false });

  return (
    <div ref={ref}>
      {
        view && (
          <Card>
            <CardHeader>
              <CardTitle>Ingresos</CardTitle>

            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ChartContainer config={chartConfig}>
                  <BarChart accessibilityLayer data={dataRealTotal}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="fecha"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 2)}
                    />
                    <YAxis />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dashed" className="bg-white-main" />}
                    />
                    <Bar dataKey="ingresosDivisas" label="Divisas" fill="hsl(var(--chart-1))" radius={4} isAnimationActive={false} />
                    <Bar dataKey="ingresosPorPrestamos" label="Prestamos" fill="hsl(var(--chart-2))" radius={4} isAnimationActive={false} />
                    <Bar dataKey="leasing" label="Leasing" fill="hsl(var(--chart-3))" radius={4} isAnimationActive={false} />
                  </BarChart>
                </ChartContainer>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )
      }
    </div>
  )
}