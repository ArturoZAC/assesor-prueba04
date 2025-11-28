/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useMemo, useState } from "react";
import { ColumnDef, getCoreRowModel, RowData, useReactTable } from "@tanstack/react-table";
import { TablaCalculoTotal } from "./TablaCalculoTotal";
import { BuscadorTablaCalculoTotal } from "./BuscadorTablaCalculoTotal";
import Link from "next/link";
import { FaTableCellsLarge } from "react-icons/fa6";
import * as XLSX from "xlsx";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";

export function TablaCalculoTotalGeneral<TData extends RowData>({
  data,
  columns,
  linkPath,
}: {
  data: TData[];
  columns: ColumnDef<TData>[];
  linkPath?: string;
}) {
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const cols = useMemo<ColumnDef<TData>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            ref={(el) => {
              if (el) el.indeterminate = table.getIsSomeRowsSelected();
            }}
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            ref={(el) => {
              if (el) el.indeterminate = row.getIsSomeSelected();
            }}
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        enableSorting: false,
        enableColumnFilter: false,
      },
      ...columns,
    ],
    [columns]
  );

  const table = useReactTable<TData>({
    data,
    columns: cols,
    state: {
      globalFilter,
      pagination: { pageIndex: 0, pageSize: 10 },
      // pagination: { pageIndex: 0, pageSize: data.length },
    },
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  });

  const exportToExcel = () => {
    const rows = table.getRowModel().rows.map((row) =>
      row.getVisibleCells().reduce((acc, cell) => {
        const columnId = cell.column.id;
        acc[columnId] = cell.getValue();
        return acc;
      }, {} as Record<string, any>)
    );

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
    XLSX.writeFile(workbook, "datos.xlsx");
  };
  return (
    <>
      <BuscadorTablaCalculoTotal />
      <TablaCalculoTotal
        columns={columns}
        data={data}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        linkPath={linkPath}
      />

      <div className="flex justify-end w-full gap-3">
        {linkPath && (
          <Link
            href={linkPath}
            className="flex items-center gap-2 px-4 py-2 mb-4 text-white transition-all duration-300 bg-blue-600 text-white-main rounded-main hover:bg-blue-700"
          >
            <FaTableCellsLarge />
            Ver Tabla Completa
          </Link>
        )}
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-4 py-2 mb-4 text-white bg-green-600 text-white-main rounded-main"
        >
          <PiMicrosoftExcelLogoFill />
          Exportar a Excel
        </button>
      </div>
    </>
  );
}
