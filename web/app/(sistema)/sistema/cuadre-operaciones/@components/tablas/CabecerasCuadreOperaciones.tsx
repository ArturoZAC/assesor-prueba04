"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CuadreOperacion } from "../types/ColumasCuadreOperacion";
import { formatoFecha } from "@/libs/formateadorFecha";
import { formatNumberToTwoDecimals } from "@/logic/formatearNumeroDecimal";

export const cabecerasCuadreOperacion: ColumnDef<CuadreOperacion>[] = [
  {
    accessorKey: "fecha",
    header: "Fecha",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p>{formatoFecha(value)}</p>;
    },
  },
  { accessorKey: "cliente", header: "Cliente" },
  { accessorKey: "tipo", header: "Tipo" },
  {
    accessorKey: "tc_compra", 
    header: "TC Compra",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  { accessorKey: "tc_venta", header: "TC Venta",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
   },
  { accessorKey: "dolares", header: "Dólares",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
   },
  { accessorKey: "soles", header: "Soles",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
   },
  {
    accessorKey: "fecha_usd",
    header: "Fecha USD",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p>{formatoFecha(String(value))}</p>;
    },
  },
  { accessorKey: "descripcion_op_usd", header: "Descripción USD" },
  { accessorKey: "monto_usd", header: "Monto USD",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
   },
  { accessorKey: "referencia_usd", header: "Referencia USD" },
  { accessorKey: "diferencia_usd", header: "Diferencia USD",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
   },
  {
    accessorKey: "fecha_pen",
    header: "Fecha PEN",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p>{formatoFecha(String(value))}</p>;
    },
  },
  { accessorKey: "descripcion_op_pen", header: "Descripción PEN" },
  { accessorKey: "monto_pen", header: "Monto PEN",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
   },
  { accessorKey: "referencia_pen", header: "Referencia PEN" },
  { accessorKey: "diferencia_pen", header: "Diferencia PEN",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
   },
];
