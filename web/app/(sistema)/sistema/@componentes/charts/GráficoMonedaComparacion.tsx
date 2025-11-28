/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
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

const chartConfig = {
  soles: {
    label: "Soles",
    color: "hsl(var(--chart-4))",
  },
  dolares: {
    label: "Dolares",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function GraficoMonedaComparacion({ dataMoneda }: { dataMoneda?: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gráfico Préstamos</CardTitle>
        <CardDescription>
          Comparación de los préstamos realizados en el mes de Enero a diciembre entre los soles y los dólares
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={dataMoneda}
            margin={{
              left: 12,
              right: 12,
            }}

          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              className="text-black-500 text-xs"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" className="flex flex-col gap-4 bg-white-100" >
              </ChartTooltipContent>}
            />
            <Area
              dataKey="dolares"
              type="natural"
              fill="var(--color-dolares)"
              fillOpacity={0.4}
              stroke="var(--color-dolares)"
              stackId="a"
              strokeWidth={2}
              isAnimationActive={false}
            />
            <Area
              dataKey="soles"
              type="natural"
              fill="var(--color-soles)"
              fillOpacity={1}
              stroke="var(--color-soles)"
              letterSpacing={0.5}
              stackId="b"
              strokeWidth={2}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}