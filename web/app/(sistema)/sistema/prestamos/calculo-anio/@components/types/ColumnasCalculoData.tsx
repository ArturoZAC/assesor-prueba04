"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MonthlyTotal } from "./ColumnasCalculoDatabase";
import { formatNumberToTwoDecimals } from "@/logic/formatearNumeroDecimal";

export const monthlyTotalColumns: ColumnDef<MonthlyTotal>[] = [
  { accessorKey: "fecha", header: "Fecha" },

  {
    accessorKey: "totalCapitalSoles",
    header: "Total Capital (Soles)",
    cell: ({ getValue }) => <p>{formatNumberToTwoDecimals(getValue<number>())}</p>,
  },
  {
    accessorKey: "totalCapitalDolares",
    header: "Total Capital (Dólares)",
    cell: ({ getValue }) => <p>{formatNumberToTwoDecimals(getValue<number>())}</p>,
  },
  {
    accessorKey: "totalInteres",
    header: "Total Interés",
    cell: ({ getValue }) => <p>{formatNumberToTwoDecimals(getValue<number>())}</p>,
  },
  {
    accessorKey: "totalCobroTotal",
    header: "Total Cobro",
    cell: ({ getValue }) => <p>{formatNumberToTwoDecimals(getValue<number>())}</p>,
  },
  {
    accessorKey: "totalTc",
    header: "Total TC",
    cell: ({ getValue }) => <p>{formatNumberToTwoDecimals(getValue<number>())}</p>,
  },
  {
    accessorKey: "totalPotencial",
    header: "Total Potencial",
    cell: ({ getValue }) => <p>{formatNumberToTwoDecimals(getValue<number>())}</p>,
  },
  {
    accessorKey: "totalIgv",
    header: "Total IGV",
    cell: ({ getValue }) => <p>{formatNumberToTwoDecimals(getValue<number>())}</p>,
  },
  {
    accessorKey: "totalRendimiento",
    header: "Total Rendimiento",
    cell: ({ getValue }) => <p>{formatNumberToTwoDecimals(getValue<number>())}</p>,
  },
  {
    accessorKey: "totalGanancia",
    header: "Total Ganancia",
    cell: ({ getValue }) => <p>{formatNumberToTwoDecimals(getValue<number>())}</p>,
  },
  {
    accessorKey: "totalDetraccion",
    header: "Total Detracción",
    cell: ({ getValue }) => <p>{formatNumberToTwoDecimals(getValue<number>())}</p>,
  },
  {
    accessorKey: "promedioDias",
    header: "Promedio Días",
  },
  {
    accessorKey: "promedioTasa",
    header: "Promedio Tasa",
    cell: ({ getValue }) => <p>{formatNumberToTwoDecimals(getValue<number>())}</p>,
  },
];
