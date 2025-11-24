"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useInView } from "react-intersection-observer";

export function GraficoLineaComparacion({ title, data }: { title: string; data: any }) {
  const [ref, view] = useInView({ triggerOnce: false });

  // console.log({ data });

  return (
    <div ref={ref}>
      {view && (
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="!p-2">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <XAxis dataKey="mes" />
                <YAxis /* tickFormatter={(value) => value.toFixed(2)} */ />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === "totalDolares") {
                      return [`$${value.toFixed(2)}`, "Total Dólares"];
                    }
                    return [value, "Total Operaciones"];
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalDolares"
                  stroke="#6366f1"
                  strokeWidth={2}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="totalOperaciones"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
