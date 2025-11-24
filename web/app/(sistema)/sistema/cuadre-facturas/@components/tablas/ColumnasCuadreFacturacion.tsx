
'use client'

import { ColumnDef } from '@tanstack/react-table';
import { IColumnasCuadreFacturacion } from './ColumnasCuadreDatabase';
import { formatNumberToTwoDecimals } from '@/logic/formatearNumeroDecimal';

export const columnasCuadreFacturacion: ColumnDef<IColumnasCuadreFacturacion>[] = [
  {
    accessorKey: 'f_op',
    header: 'F. Op',
  },
  {
    accessorKey: 'cliente_op',
    header: 'Cliente',
  },
    {
    accessorKey: 'doc_cliente_op',
    header: 'Doc Cliente',
  },
  {
    accessorKey: 'monto_op',
    header: 'Monto', 
     cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: 'fecha',
    header: 'Fecha',
  },
  {
    accessorKey: 'doc',
    header: 'DOC.',
  },
  {
    accessorKey: 'numero',
    header: 'NUMERO',
  },
  {
    accessorKey: 'cliente',
    header: 'CLIENTE',
  },
  {
    accessorKey: 'ruc',
    header: 'RUC',
  },
  {
    accessorKey: 'subtotal',
    header: 'SUBTOTAL',
    cell: ({ getValue }) => {
      const value = getValue<number>();
    
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: 'igv',
    header: 'IGV',
    cell: ({ getValue }) => {
      const value = getValue<number | null>();
       
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: 'total',
    header: 'TOTAL',
     cell: ({ getValue }) => {
      const value = getValue<number>();
      
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: 'm',
    header: 'M',
  },
  {
    accessorKey: 'dif_f',
    header: 'DIF.F',
  },
  {
    accessorKey: 'dif_m',
    header: 'DIF.M',
  },
  {
    accessorKey: 'dif_d',
    header: 'DIF.D',
  },
];