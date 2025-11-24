"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ColumnasGastos } from "./TypesColumnasGastos";
import { formatoFecha } from "@/libs/formateadorFecha";
import { formatNumberToTwoDecimals } from "@/logic/formatearNumeroDecimal";
export const columnasGastos: ColumnDef<ColumnasGastos>[] = [
  {
    accessorKey: "fecha",
    header: "Fecha",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p>{formatoFecha(value)}</p>;
    },
  },
  { accessorKey: "monto", header: "Monto",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    }
   },

  { accessorKey: "descripcion", header: "Descripción" },
  { accessorKey: "referencia", header: "Referencia" },
  { accessorKey: "clase", header: "Clase" },
  { accessorKey: "concepto", header: "Concepto" },
  { accessorKey: "tipoMoneda", header: "Tipo Moneda" },
];
