"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FinancialDataItem } from "./RecopilacionAnioDatabase";
import { formatNumberToTwoDecimals } from "@/logic/formatearNumeroDecimal";

export const columnasRecopilacionAnios: ColumnDef<FinancialDataItem>[] = [
  {
    header: "Concepto",
    accessorKey: "concept",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      if (
        String(value) === "Ingresos" ||
        String(value) === "GASTOS DE PERSONAL" ||
        String(value) === "EGRESOS"
      ) {
        return <p className="font-bold uppercase">{String(value)}</p>;
      }
      return <p>{value}</p>;
    },
  },
  {
    header: "Enero",
    accessorKey: "january",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      if (typeof value === "number") {
        return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
      }
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    header: "Febrero",
    accessorKey: "february",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      if (typeof value === "number") {
        return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
      }
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    header: "Marzo",
    accessorKey: "march",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      if (typeof value === "number") {
        return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
      }
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    header: "Abril",
    accessorKey: "april",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      if (typeof value === "number") {
        return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
      }
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    header: "Mayo",
    accessorKey: "may",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      if (typeof value === "number") {
        return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
      }
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    header: "Junio",
    accessorKey: "june",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      if (typeof value === "number") {
        return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
      }
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    header: "Julio",
    accessorKey: "july",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      if (typeof value === "number") {
        return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
      }
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    header: "Agosto",
    accessorKey: "august",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      if (typeof value === "number") {
        return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
      }
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    header: "Setiembre",
    accessorKey: "september",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      if (typeof value === "number") {
        return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
      }
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    header: "Octubre",
    accessorKey: "october",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      if (typeof value === "number") {
        return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
      }
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    header: "Noviembre",
    accessorKey: "november",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      if (typeof value === "number") {
        return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
      }
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    header: "Diciembre",
    accessorKey: "december",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      if (typeof value === "number") {
        return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
      }
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
];
