/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useInView } from "react-intersection-observer";
const chartConfig = {
  fecha: {
    label: "Fecha",
    color: "hsl(var(--chart-1))",
  },
  clientes: {
    label: "Clientes",
    color: "hsl(var(--chart-1))",
  },
  empresa: {
    label: "Empresas",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function GraficoCantidadClientesAtendidos({
  dataClientesAtendidos,
}: {
  dataClientesAtendidos: any;
}) {
  const [ref, view] = useInView({ triggerOnce: false });

  return (
    <div ref={ref}>
      {view && (
        <Card>
          <CardHeader>
            <CardTitle>Cantidad Clientes Atendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ChartContainer config={chartConfig} className="w-full">
                <LineChart
                  accessibilityLayer
                  data={dataClientesAtendidos.respuesta}
                  margin={{
                    left: 0,
                    right: 4,
                    top: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="fecha"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={2}
                    tickFormatter={(value) => {
                      const str = String(value);
                      const firstLetter = str.charAt(0).toUpperCase();
                      const rest = str.slice(1);
                      return (firstLetter + rest).slice(0, 1);
                    }}
                  />
                  <YAxis />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent className="bg-white-main" />}
                  />
                  <Line
                    dataKey="clientes"
                    type="linear"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                  <Line
                    dataKey="empresa"
                    type="linear"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ChartContainer>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
