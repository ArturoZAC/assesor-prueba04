/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import {
    Card,
    CardContent,
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
    ppto: {
        label: "Presupuesto",
        color: "hsl(var(--chart-1))",
    },
    real: {
        label: "Real",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

export function GraficoRealVsPresupuesto({ dataRealVsPresupuesto }: { dataRealVsPresupuesto: any }) {
    const [ref, view] = useInView({ triggerOnce: false });
    return (
        <div ref={ref}>
            {
                view && (
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Ingresos Totales Real vs Ppto
                            </CardTitle>
                            <Legend />
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width='100%' height={300}>
                                <ChartContainer config={chartConfig}>
                                    <LineChart
                                        accessibilityLayer
                                        data={dataRealVsPresupuesto.data}
                                        margin={{
                                            left: 4,
                                            right: 4,
                                        }}
                                    >
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="fecha"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            tickFormatter={(value) => value.slice(0, 1)}
                                        />
                                        <YAxis />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                        <Line
                                            dataKey="ppto"
                                            type="monotone"
                                            stroke="hsl(var(--chart-1))"
                                            strokeWidth={2}
                                            dot={false}
                                            isAnimationActive={false}
                                        />
                                        <Line
                                            dataKey="real"
                                            type="monotone"
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
                )
            }
        </div>
    )
}