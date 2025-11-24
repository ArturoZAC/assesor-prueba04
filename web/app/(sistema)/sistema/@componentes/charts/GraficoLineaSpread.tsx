/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { CartesianGrid, LabelList, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
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
import { useInView } from "react-intersection-observer"

const chartConfig = {
  fecha: {
    label: "Fecha",
    color: "hsl(var(--chart-1))"
  },
  spread: {
    label: "Spread",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function GraficaLineaSpread({ dataSpreadTodos }: { dataSpreadTodos: any }) {

  const [ref, view] = useInView({ triggerOnce: false });

  return (
    <div ref={ref}>
      {
        view && (
          <Card className="w-full max-w-4xl">
            <CardHeader className="py-10">
              <CardTitle>Spread</CardTitle>
              <CardDescription>Enero - Diciembre 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width='100%' height={300}>
                <ChartContainer config={chartConfig}>
                  <LineChart
                    accessibilityLayer
                    data={dataSpreadTodos}
                    margin={{
                      left: 4,
                      right: 4,
                      top: 10
                    }}
                  >
                    <CartesianGrid vertical={false} />

                    <XAxis
                      dataKey="fecha"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(0, 0)}
                    />
                    <YAxis />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent className="bg-white-main" />}
                    />
                    <Legend className="uppercase" />
                    <Line
                      dataKey="spread"
                      type="linear"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={3}
                      dot={{
                        fill: "var(--chart-2)",
                      }}
                      activeDot={{
                        r: 6,
                      }}

                      isAnimationActive={false}
                    >
                      <LabelList
                        position="top"
                        offset={12}
                        className="text-black fill-foreground"
                        fontSize={12}
                      ></LabelList>
                    </Line>
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