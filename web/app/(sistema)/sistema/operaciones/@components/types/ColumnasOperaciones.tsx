"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ColumnasOperacion } from "../ColumnasOperacionType";

import { formatoFecha } from "@/libs/formateadorFecha";
import { formatNumberToTwoDecimals } from "@/logic/formatearNumeroDecimal";
export const columnasOperaciones: ColumnDef<ColumnasOperacion>[] = [
  {
    accessorKey: "t",
    header: "T",
  },
  {
    accessorKey: "fecha",
    header: "Fecha",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p>{formatoFecha(value)}</p>;
    },
  },
  { accessorKey: "numero", header: "No." },
  { accessorKey: "cliente", header: "Cliente/Titular" },
  { accessorKey: "documento", header: "Documento" },
  { accessorKey: "tipo", header: "Tipo" },
  {
    accessorKey: "dolares",
    header: "Dólares",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },

  // Tipo de Cambio
  {
    accessorKey: "tipoCambio_compra",
    header: "Compra",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value),3)}</p>;
    },
  },
  {
    accessorKey: "tipoCambio_v1",
    header: "V",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p>{value}</p>;
    },
  },
  {
    accessorKey: "tipoCambio_venta",
    header: "Venta",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value),3)}</p>;
    },
  },
  {
    accessorKey: "tipoCambio_v2",
    header: "V2",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p>{value}</p>;
    },
  },
  {
    accessorKey: "tipoCambio_spread",
    header: "Spread",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value), 3)}</p>;
    },
  },
  {
    accessorKey: "tipoCambio_promedio",
    header: "Prom.",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value), 3)}</p>;
    },
  },
  {
    accessorKey: "tipoCambio_v3",
    header: "V3",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p>{value}</p>;
    },
  },

  // Flujo de Fondos
  {
    accessorKey: "flujoFondos_montoUSD",
    header: "Monto US$",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: "flujoFondos_montoPEN",
    header: "Monto S/.",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },

  // Rendimiento
  {
    accessorKey: "rendimiento_forzado",
    header: "Forzado",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: "rendimiento_medio",
    header: "Medio",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: "rendimiento_esperado",
    header: "Esperado",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  // Movimiento Fondos
  {
    accessorKey: "movimiento_compraUSD",
    header: "Compra $",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: "movimiento_ventaUSD",
    header: "Venta $",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },

  // Saldo Final
  {
    accessorKey: "saldoFinal_montoUSD",
    header: "US$",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: "saldoFinal_montoPEN",
    header: "S/.",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },

  // Resultado
  {
    accessorKey: "resultado_simple",
    header: "Simple",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: "resultado_estricto",
    header: "Estricto",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    accessorKey: "resultado_potencial",
    header: "Potencial",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  { accessorKey: "resultado_q", header: "Q" },
  {
    accessorKey: "resultado_tipoCli",
    header: "TipCli",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value.toUpperCase();
    },
  },
];
