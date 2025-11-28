"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useInView } from "react-intersection-observer";

interface Props {
  title: string;
  data: any[];
  dataKey: string;
  color: string;
  label: string;
  prefix?: string;
}

export function GraficoLineaSimple({ title, data, dataKey, color, label, prefix }: Props) {
  const [ref, view] = useInView({ triggerOnce: false });

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
                <YAxis
                // tickFormatter={(v) =>
                //   prefix
                //     ? `${prefix}${v.toLocaleString("en-US", {
                //         minimumFractionDigits: 2,
                //         maximumFractionDigits: 2,
                //       })}`
                //     : v
                // }
                />
                <Tooltip
                  formatter={(value: number) =>
                    prefix ? [`${prefix}${value.toFixed(2)}`, label] : [value, label]
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={dataKey}
                  stroke={color}
                  strokeWidth={2}
                  name={label}
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
