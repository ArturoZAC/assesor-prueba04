/* eslint-disable react/display-name */

"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useInView } from "react-intersection-observer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React, { useMemo } from "react";

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

interface GraficoConsultoriaProps {
  dataConsultoria: Array<{
    fecha: string;
    ingresos: number;
    gastos: number;
  }>;
}

export const GraficoConsultoria = ({ dataConsultoria }: { dataConsultoria: any }) => {
  const [ref, view] = useInView({ triggerOnce: false });
  const rawData = useMemo(() => {
    return dataConsultoria.map((item: { fecha: any; ingresos: any; gastos: any }) => ({
      fecha: item.fecha,
      ingresos: item.ingresos,
      gastos: item.gastos,
    }));
  }, [dataConsultoria]);

  return (
    <div className="w-full" ref={ref}>
      {view && <ChartItem dataConsultoria={rawData} />}
    </div>
  );
};

const ChartItem = React.memo<GraficoConsultoriaProps>(({ dataConsultoria }) => {
  const formattedData = useMemo(() => {
    console.log("RENDERIZA");
    return dataConsultoria.map((item) => ({
      ...item,
      // Si es necesario, formatear fechas u otros valores
    }));
  }, [dataConsultoria]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consultoría</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={formattedData}
              margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="fecha"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)} // Mostrar abreviatura (ej: "Ene")
              />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" className="bg-white-main" />}
              />

              <Bar
                dataKey="ingresos"
                name="Ingresos"
                fill="hsl(var(--chart-2))"
                radius={4}
                isAnimationActive={false}
              />
              <Bar
                dataKey="gastos"
                name="Gastos"
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
});
