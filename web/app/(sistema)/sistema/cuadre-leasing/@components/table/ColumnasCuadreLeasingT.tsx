'use client'

import { ColumnDef } from "@tanstack/react-table";
import { ColumnasCuadreLeasingDatabase } from "./ColumnasCuadreLeasing"
import { formatoFecha } from "@/libs/formateadorFecha";
import { formatNumberToTwoDecimals } from "@/logic/formatearNumeroDecimal";

export const columnasCuadreLeasing: ColumnDef<ColumnasCuadreLeasingDatabase>[] = [
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
    header: 'Cliente'
  },
  {
    accessorKey: 'documento',
    header: 'Documento'
  },
  {
    accessorKey: 'monto',
    header: 'Monto US$',
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: 'monto_total',
    header: 'Monto Total',
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: 'fecha_pag',
    header: 'Fecha Pagos',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p>{formatoFecha(value)}</p>;
    },
  },
  {
    accessorKey: 'deposito_pag',
    header: 'Depósito'
  },
  {
    accessorKey: 'pagado_pag',
    header: 'Pagado',
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: 'tc_pag',
    header: 'TC'
  },
  {
    accessorKey: 'monto_final_pag',
    header: 'Monto Final',
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: 'referencia_pag',
    header: 'Referencia'
  },
  {
    accessorKey: 'diferencia_pag',
    header: 'Diferencia',
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: 'deposito_det',
    header: 'Depósito Detracción'
  },
  {
    accessorKey: 'pagado_det',
    header: 'Pagado Detracción',
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: 'tc_det',
    header: 'TC Detracción',
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: 'monto_final_det',
    header: 'Monto Final Detracción',
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: 'referencia_det',
    header: 'Referencia Detracción'
  },
  {
    accessorKey: 'diferencia_det',
    header: 'Diferencia Total',
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  }
]