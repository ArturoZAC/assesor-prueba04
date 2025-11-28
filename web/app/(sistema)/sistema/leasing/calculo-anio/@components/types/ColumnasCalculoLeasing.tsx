"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MonthlyTotalInterface } from "./ColumnaCalculoInterface";
import { formatNumberToTwoDecimals } from "@/logic/formatearNumeroDecimal";

export const leasingOperacionColumns: ColumnDef<MonthlyTotalInterface>[] = [
  {
    accessorKey: "fecha",
    header: "Fecha",
  },
  {
    accessorKey: "cobroTotal",
    header: "Cobro Total",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: "tc",
    header: "TC",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: "potencial",
    header: "Potencial",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: "igv",
    header: "IGV",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: "rendimiento",
    header: "Rendimiento",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: "ganancia",
    header: "Ganancia (S/.)",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
];
