'use client'

import { ColumnDef } from "@tanstack/react-table"
import { ColumnasDataFacturacionApi } from "./ColumnasFacturacionInterface"
import { formatoFecha } from "@/libs/formateadorFecha";
import { toast } from "sonner";
import { formatNumberToTwoDecimals } from "@/logic/formatearNumeroDecimal";

function copyClipboard(text: string) {
  toast.success("Copiado al portapapeles");
  navigator.clipboard.writeText(text);
}

export const columnasFacturacion: ColumnDef<ColumnasDataFacturacionApi>[] = [
  {
    accessorKey: 'fecha',
    header: 'Fecha',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p>{formatoFecha(value)}</p>;
    },
  },
  {
    accessorKey: 'cliente',
    header: 'Cliente/Titular'
  },
  {
    accessorKey: 'documento',
    header: 'Documento'
  },
  {
    accessorKey: 'unit',
    header: 'Unit.',
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: 'glosa',
    header: 'Glosa',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p onClick={() => copyClipboard(value)} className="cursor-pointer">{value}</p>;
    },
  },
  {
    accessorKey: 'op',
    header: 'Op.'
  },
  {
    accessorKey: 'tipo',
    header: 'Tipo'
  },
  {
    accessorKey: 'accion',
    header: 'Acción'
  },
  {
    accessorKey: 'monto',
    header: 'Monto',
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: 'tc',
    header: 'TC',
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: 'entrega',
    header: 'Entrega',
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: 'm1',
    header: 'M1'
  },
  {
    accessorKey: 'recibe',
    header: 'Recibe',
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: 'm2',
    header: 'M2'
  },

]