'use client'

import { ColumnDef } from "@tanstack/react-table";
import { ColumnasDataLeasingApi } from "./ColumnasDataLeasingApi";
import { formatoFecha } from "@/libs/formateadorFecha";

export const columnasLeasing: ColumnDef<ColumnasDataLeasingApi>[] = [
  {
    accessorKey: 'numero_leasing',
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
    accessorKey: 'codSer',
    header: 'Cod. Ser.'
  },
  {
    accessorKey: 'numero',
    header: 'Nº'
  },
  {
    accessorKey: 'precio',
    header: 'Precio'
  },
  {
    accessorKey: 'fecha_inicial',
    header: 'Fecha Inicial',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <p>{formatoFecha(value)}</p>;
    },
  },
  {
    accessorKey: 'fecha_final',
    header: 'Fecha Final',
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
    accessorKey: 'cobroTotal',
    header: 'Cobro Total'
  },
  {
    accessorKey: 'tc',
    header: 'TC'
  },
  {
    accessorKey: 'potencial',
    header: 'Potencial'
  },
  {
    accessorKey: 'igv',
    header: 'IGV'
  },
  {
    accessorKey: 'rendimiento',
    header: 'Rendimiento'
  },
  {
    accessorKey: 'detraccion',
    header: 'Detracción'
  },
  {
    accessorKey: 'codigo',
    header: 'Factura / Boleta'
  }
]