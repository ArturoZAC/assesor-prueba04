"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  gastos: {
    label: "Gastos",
    color: "hsl(var(--chart-1))",
  },
  ingresos: {
    label: "Ingresos",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function AcumuladosPrestamos({ realPrestamos }: { realPrestamos: any }) {
  const dataAcumulada = realPrestamos.reduce((acc: any[], curr: any, i: number) => {
    const prev = acc[i - 1] || { ingresos: 0, gastos: 0 };
    acc.push({
      fecha: curr.fecha,
      ingresos: prev.ingresos + (curr.ingresos || 0),
      gastos: prev.gastos + (curr.gastos || 0),
    });
    return acc;
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>INGRESOS vs. GASTOS | ACUMULADOS - PRÉSTAMOS</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={dataAcumulada}
              // data={realPrestamos}
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
                stackId="a"
              />
              <Area
                dataKey="ingresos"
                type="linear"
                fill="hsl(var(--chart-2))"
                fillOpacity={0.4}
                stroke="hsl(var(--chart-2))"
                stackId="b"
              />
            </AreaChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
