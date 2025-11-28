/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"
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
  fecha: {
    label: "Fecha",
    color: "black",
  },
  forzado: {
    label: "Forzado",
    color: "black",
  },
  esperado: {
    label: "Esperado",
    color: "hsl(var(--chart-3))",

  },
  medio: {
    label: "Medio",
    color: "hsl(var(--chart-4))",
  }
} satisfies ChartConfig

export default function GraficoGeneracionCaja({ dataGeneracionCaja }: { dataGeneracionCaja: any }) {

  const [ref, view] = useInView({ triggerOnce: false });

  return (
    <div ref={ref}>
      {
        view && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Generación de Caja (S/.)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ChartContainer config={chartConfig}>
                  <BarChart accessibilityLayer data={dataGeneracionCaja.resultados}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="fecha"
                      tickLine={false}
                      tickMargin={5}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <Legend />
                    <YAxis />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dashed" className="bg-white-main" />}
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
  )
}
