/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  ingresos: {
    label: "Gastos",
    color: "hsl(var(--chart-1))",
  },
  gastos: {
    label: "Ingresos",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;
export function GraficoTotalesFlujo({ dataRealTotal }: { dataRealTotal: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Totales</CardTitle>
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
              <Bar
                dataKey="gastos"
                label="Gastos"
                fill="hsl(var(--chart-2))"
                radius={4}
                isAnimationActive={false}
              />
              <Bar
                dataKey="ingresos"
                label="Consultoria"
                fill="hsl(var(--chart-1))"
                radius={4}
                isAnimationActive={false}
              />
            </BarChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
