/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  CartesianGrid,
  LabelList,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useInView } from "react-intersection-observer";

const chartConfig = {
  promedio: {
    label: "Promedio",
    color: "hsl(var(--chart-1))",
  },
  fecha: {
    label: "Fecha",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export default function GraficoLineaTC({
  dataPromedioTodos,
}: {
  dataPromedioTodos: any;
}) {

  const [ref, view] = useInView({ triggerOnce: false });

  return (
    <div ref={ref}>
      {
        view && (
          <Card className="w-full max-w-4xl">
            <CardHeader>
              <CardTitle>TC - Promedio</CardTitle>
              <CardDescription>Enero - Diciembre 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ChartContainer config={chartConfig}>
                  <LineChart
                    accessibilityLayer
                    data={dataPromedioTodos}
                    margin={{
                      left: 4,
                      right: 4,
                      top: 24,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="fecha"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis />
                    <Legend />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Line
                      dataKey="promedio"
                      type="linear"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      dot={false}
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
  );
}
