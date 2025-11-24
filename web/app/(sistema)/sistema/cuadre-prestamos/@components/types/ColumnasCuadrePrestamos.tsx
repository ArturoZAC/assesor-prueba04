
'use client'

import { formatoFecha } from "@/libs/formateadorFecha";
import { formatNumberToTwoDecimals } from "@/logic/formatearNumeroDecimal";
import { ColumnDef } from "@tanstack/react-table";

interface PrestamoTable {
  id: number;
  fecha: Date;
  numero_prestamo?: string | null;
  cliente: string;
  tipo_documento: string;
  documento?: string | null;
  capital_soles?: number | null;
  capital_dolares?: number | null;
  interes: number;
  montoTotal: number;
  fecha_salida: string;
  monto_sal: number;
  diferencia_sal: number;
  fecha_dev: string;
  pagado_dev: number;
  tc_dev: number;
  monto_final_dev: number;
  referencia_dev: number;
  diferencia_dev: number;
}

export const prestamosColumnDef: ColumnDef<PrestamoTable>[] = [
  {
    header: "Fecha",
    accessorKey: "fecha",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p>{formatoFecha(String(value))}</p>;
    },
  },
  {
    header: "No",
    accessorKey: "numero_prestamo",
  },
  {
    header: "Cliente",
    accessorKey: "cliente",
  },
  {
    header: "Documento",
    accessorKey: "documento",
  },
  {
    header: "Monto (S/.)",
    accessorKey: "capital_soles",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    header: "Monto (US$)",
    accessorKey: "capital_dolares",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    header: "Interés",
    accessorKey: "interes",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    header: "Monto Total",
    accessorKey: "montoTotal",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    header: "Fecha Salida",
    accessorKey: "fecha_salida",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p>{formatoFecha(String(value))}</p>;
    },
  },
  {
    header: "Descripción",
    accessorKey: "descripcion",
  },
  {
    header: "Monto Salida",
    accessorKey: "monto_sal",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    header: "Diferencia Salida",
    accessorKey: "diferencia_sal",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    header: "Fecha Devolución",
    accessorKey: "fecha_dev",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p>{formatoFecha(String(value))}</p>;
    },
  },
  {
    header: "Descripcion Dev",
    accessorKey: "descripcion_dev",
  },
  {
    header: "Pagado Devolución",
    accessorKey: "pagado_dev",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    header: "TC Devolución",
    accessorKey: "tc_dev",
  },
  {
    header: "Monto Final Dev.",
    accessorKey: "monto_final_dev",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
  {
    header: "Ref. Devolución",
    accessorKey: "referencia_dev",
  },
  {
    header: "Dif. Devolución",
    accessorKey: "diferencia_dev",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return <p>{formatNumberToTwoDecimals(Number(value))}</p>;
    },
  },
];