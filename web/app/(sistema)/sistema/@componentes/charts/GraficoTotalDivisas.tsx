/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useInView } from "react-intersection-observer";

const chartConfig = {
  ingresos: {
    label: "Ingresos",
    color: "hsl(var(--chart-1))",
  },
  gastos: {
    label: "Gastos",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function GraficoTotalDivisas({ dataRealTotal }: { dataRealTotal: any }) {
  const [ref, view] = useInView({ triggerOnce: false });

  const dataAcumulada = dataRealTotal.reduce((acc: any[], curr: any, i: number) => {
    const prev = acc[i - 1] || { ingresos: 0, gastos: 0 };
    acc.push({
      fecha: curr.fecha,
      ingresos: prev.ingresos + (curr.ingresos || 0),
      gastos: prev.gastos + (curr.gastos || 0),
    });
    return acc;
  }, []);

  return (
    <div ref={ref}>
      {view && (
        <Card>
          <CardHeader>
            <CardTitle>Ingresos vs Gastos</CardTitle>
            <CardDescription>Acumulados - Divisas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  // data={dataRealTotal}
                  data={dataAcumulada}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="fecha"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 2)}
                  />
                  <YAxis />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" className="bg-white-main" />}
                  />
                  <Area
                    dataKey="gastos"
                    type="linear"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.4}
                    stroke="hsl(var(--chart-1))"
                    stackId="b"
                    isAnimationActive={false}
                  />
                  <Area
                    dataKey="ingresos"
                    type="linear"
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.4}
                    stroke="hsl(var(--chart-2))"
                    stackId="a"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ChartContainer>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
