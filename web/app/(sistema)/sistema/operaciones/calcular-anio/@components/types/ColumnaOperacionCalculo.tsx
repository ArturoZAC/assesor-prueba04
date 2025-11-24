'use client'

import { ColumnDef } from "@tanstack/react-table";
import { ColumnaOperacionInterface } from "./ColumnaOperacionInterface";
import { formatNumberToTwoDecimals } from "@/logic/formatearNumeroDecimal";

export const operacionColumns: ColumnDef<ColumnaOperacionInterface>[] = [
  {
    accessorKey: 'fecha',
    header: 'Fecha',
  },
  {
    accessorKey: 'operacionesMes',
    header: 'Operaciones',

  },
  {
    accessorKey: 'dolares',
    header: 'Dolares',
    cell({ getValue }) {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(value)}</p>;
    },
  },
  {
    accessorKey: 'compraUSD',
    header: 'Compra USD',
    cell({ getValue }) {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(value)}</p>;
    },
  },
  {
    accessorKey: 'ventaUSD',
    header: 'Venta USD',
    cell({ getValue }) {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(value)}</p>;
    },
  },
  {
    accessorKey: 'simple',
    header: 'Simple',
    cell({ getValue }) {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(value)}</p>;
    },
  },
  {
    accessorKey: 'estricto',
    header: 'Estricto',
    cell({ getValue }) {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(value)}</p>;
    },
  },
  {
    accessorKey: 'potencial',
    header: 'Potencial',
    cell({ getValue }) {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(value)}</p>;
    },
  },
  {
    accessorKey: 'compra',
    header: 'Compra',
    cell({ getValue }) {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(value, 3)}</p>;
    },
  },
  {
    accessorKey: 'venta',
    header: 'Venta',
    cell({ getValue }) {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(value, 3)}</p>;
    },
  },
  {
    accessorKey: 'spread',
    header: 'Spread',
    cell({ getValue }) {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(value, 3)}</p>;
    },
  },
  {
    accessorKey: 'promedio',
    header: 'Promedio',
    cell({ getValue }) {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(value, 3)}</p>;
    },
  },
  {
    accessorKey: 'montoUSDFlujo',
    header: 'Monto USD Flujo',
    cell({ getValue }) {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(value)}</p>;
    },
  },
  {
    accessorKey: 'montoPENFlujo',
    header: 'Monto PEN Flujo',
    cell({ getValue }) {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(value)}</p>;
    },
  },
  {
    accessorKey: 'forzado',
    header: 'Forzado',
    cell({ getValue }) {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(value)}</p>;
    },
  },
  {
    accessorKey: 'medio',
    header: 'Medio',
    cell({ getValue }) {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(value)}</p>;
    },
  },
  {
    accessorKey: 'esperado',
    header: 'Esperado',
    cell({ getValue }) {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(value)}</p>;
    },
  },
  {
    accessorKey: 'compraUSDMov',
    header: 'Compra USD Mov',
    cell({ getValue }) {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(value)}</p>;
    },
  },
  {
    accessorKey: 'ventaUSDMov',
    header: 'Venta USD Mov',
    cell({ getValue }) {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(value)}</p>;
    },
  },
  {
    accessorKey: 'equilibrio',
    header: 'Equilibrio',
    cell({ getValue }) {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(value)}</p>;
    },
  },
  {
    accessorKey: 'montoUSDSaldo',
    header: 'Monto USD Saldo',
    cell({ getValue }) {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(value)}</p>;
    },
  },
  {
    accessorKey: 'montoPENSaldo',
    header: 'Monto PEN Saldo',
    cell({ getValue }) {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(value)}</p>;
    },
  },
];