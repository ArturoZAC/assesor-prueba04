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
  fecha: {
    label: "Fecha",
    color: "black",
  },
  compra: {
    label: "Compra",
    color: "black",
  },
  venta: {
    label: "Venta",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export default function GraficoMontosCambiados({ dataMontosCambiados }: { dataMontosCambiados: any }) {

  const [ref, view] = useInView({ triggerOnce: false });

  return (
    <div ref={ref}>
      {
        view && (
          <Card className='w-full'>
            <CardHeader>
              <CardTitle>Montos Cambiados ($000)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width='100%' height={300}>
                <ChartContainer config={chartConfig}>
                  <BarChart accessibilityLayer data={dataMontosCambiados.resultados}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="fecha"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dashed" className="bg-white-main" />}
                    />
                    <Bar dataKey="compra" fill="hsl(var(--chart-2))" radius={10} accentHeight={1} isAnimationActive={false} />
                    <Bar dataKey="venta" fill="hsl(var(--chart-3))" radius={10} accentHeight={1} isAnimationActive={false} />
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
