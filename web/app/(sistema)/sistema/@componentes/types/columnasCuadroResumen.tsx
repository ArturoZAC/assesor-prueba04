
'use client'

import { redondearComoExcel } from "@/logic/formatearNumero";
import { ColumnDef } from "@tanstack/react-table";

interface TablaMes {
  mes: string
  totalClientes: number;
  totalEmpresas: number;
  totalOperaciones: number;
  primerPorcentaje: number;
  primerAcumulado: number;
  montos: number
  segundoPorcentaje: number;
  segundoAcumulado: number;
  ticketPromedio: number;
  comprasTransferencias: number
  ventasTransferencias: number
  tipoCambioCompra: number
  tipoCambioVenta: number
  totalClientesAtendidos: number;
  totalEmpresasAtendidas: number;
}

export const columnasCuadroResumen: ColumnDef<TablaMes>[] = [
  {
    header: 'Mes',
    accessorKey: 'mes',
  },
  {
    header: 'Personas',
    accessorKey: 'totalClientes',
  },
  {
    header: 'Empresas',
    accessorKey: 'totalEmpresas',
  },
  {
    header: 'Operaciones',
    accessorKey: 'totalOperaciones',
  },
  {
    header: '+/- %',
    accessorKey: 'primerPorcentaje',
    cell: info => `${info.getValue<number>() ?? 0}%`
  },
  {
    header: 'Acum.',
    accessorKey: 'primerAcumulado',
    cell: info => `${info.getValue<number>() ?? 0}%`
  },
  {
    header: 'Montos ($000)',
    accessorKey: 'montos',
    cell: info => redondearComoExcel(info.getValue<number>(), 2)
  },
  {
    header: '+/- %',
    accessorKey: 'segundoPorcentaje',
    cell: info => `${info.getValue<number>() ?? 0}%`
  },
  {
    header: 'Acum.',
    accessorKey: 'segundoAcumulado',
    cell: info => `${info.getValue<number>() ?? 0}%`
  },
  {
    header: 'Tick. Prom.',
    accessorKey: 'ticketPromedio',
    cell: info => info.getValue<number>()
  },
  {
    header: 'Compras Transferencias',
    accessorKey: 'comprasTransferencias',
    cell: info => redondearComoExcel(info.getValue<number>(), 2)
  },
  {
    header: 'Ventas Transferencias',
    accessorKey: 'ventasTransferencias',
    cell: info => redondearComoExcel(info.getValue<number>(), 2)
  },
  {
    header: 'TC Compra',
    accessorKey: 'tipoCambioCompra',
    cell: info => info.getValue<number>()
  },
  {
    header: 'TC Venta',
    accessorKey: 'tipoCambioVenta',
    cell: info => info.getValue<number>()
  },
  {
    header: 'Personas',
    accessorKey: 'totalClientesAtendidos',
  },
  {
    header: 'Empresas',
    accessorKey: 'totalEmpresasAtendidas',
  }
]