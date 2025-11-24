'use client'

import { ColumnDef } from "@tanstack/react-table"
import { ColumnasDataPrestamoAPi } from "./ColumnasDataPrestamoAPi"
import { formatoFecha } from "@/libs/formateadorFecha";
import { formatNumberToTwoDecimals } from "@/logic/formatearNumeroDecimal";

export const columnasPrestamos: ColumnDef<ColumnasDataPrestamoAPi>[] = [
  {
    accessorKey: 'fecha',
    header: 'Fecha',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p>{formatoFecha((value))}</p>;
    },
  },
  {
    accessorKey: 'numero_prestamo',
    header: 'No.'
  },
  {
    accessorKey: 'cliente',
    header: 'Cliente/Titular'
  },
  {
    accessorKey: 'tipo_documento',
    header: 'Tipo Documento'
  },
  {
    accessorKey: 'documento',
    header: 'Documento'
  },
  {
    accessorKey: 'capital_soles',
    header: 'Capital S/.',
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: 'capital_dolares',
    header: 'Capital USD',
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: 'moneda',
    header: 'Moneda',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p>{ value === 'PEN' ? 'S/.' : 'US$'}</p>;
    },
  },
  {
    accessorKey: 'tasa',
    header: 'Tasa',
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: 'devolucion',
    header: 'Devolución',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p>{formatoFecha(value)}</p>;
    },
  },
  {
    accessorKey: 'dias',
    header: 'Días'
  },
  {
    accessorKey: 'estatus',
    header: 'Estatus'
  },
  {
    accessorKey: 'interes',
    header: 'Interes',
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: 'cobroTotal',
    header: 'Cobro Total',
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
    accessorKey: 'potencial',
    header: 'Potencial',
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: 'igv',
    header: 'IGV',
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: 'rendimiento',
    header: 'Rendimiento',
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: 'ganancia',
    header: 'Ganancia (S/.)',
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: 'cuadre',
    header: 'Cuadre',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p className="text-center">{value ?? '-'}</p>;
    },
  },
  {
    accessorKey: 'detraccion',
    header: 'Detracción',
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: 'codigo',
    header: 'Factura / Boleta'
  }
]