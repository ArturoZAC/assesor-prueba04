/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"

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

/*
const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]
*/

const chartConfig = {
    mensual: {
        label: "Mensual",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export function GraficoTicketPromedio({ dataTicketPromedio }: { dataTicketPromedio: any }) {

    const [ref, view] = useInView({ triggerOnce: false });

    return (
        <div ref={ref}>
            {
                view && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Ticket Promedio 2025</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width='100%' height={300}>
                                <ChartContainer config={chartConfig}>
                                    <BarChart accessibilityLayer data={dataTicketPromedio}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="fecha"
                                            tickLine={false}
                                            tickMargin={4}
                                            axisLine={false}
                                            tickFormatter={(value) => value.slice(0, 1)}
                                        />
                                        <YAxis />
                                        <Legend />
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent indicator="dashed" className="bg-white-main" />}
                                        />
                                        <Bar dataKey="mensual" fill="hsl(var(--chart-2))" radius={8} isAnimationActive={false} />
                                    </BarChart>
                                </ChartContainer>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )
            }
        </div>
    )
}
