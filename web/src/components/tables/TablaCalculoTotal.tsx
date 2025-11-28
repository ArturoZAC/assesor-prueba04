/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  ColumnDef,
  RowData,
  SortingState,
  ColumnFiltersState,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  // getPaginationRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { Dispatch, SetStateAction, useMemo, useRef, useState } from "react";
export type TablaDatosProps<TData extends RowData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
};

type TooltipFilaCompletaProps = {
  children: React.ReactNode;
  data: Record<string, any>;
};

export type ActionType = "agregar" | "editar";

export function TooltipFilaCompleta({ children, data }: TooltipFilaCompletaProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), 2000);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {visible && (
        <div className="fixed border-l right-0 z-50 h-screen max-w-xs py-8 px-5 text-sm rounded shadow-lg w-[420px] bg-white-main text-black-800 top-20">
          <div className="space-y-2">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-semibold text-black-main">{key}</span>
                <span className="ml-2">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function TablaCalculoTotal<TData extends RowData>({
  data,
  columns,
  globalFilter,
  setGlobalFilter,
}: {
  data: TData[];
  columns: ColumnDef<TData>[];
  globalFilter: string;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
  linkPath?: string;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
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
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
      // pagination: { pageIndex: 0, pageSize: 10 },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
  });

  return (
    <div className="overflow-x-auto">
      {/* Tabla */}
      <table className="min-w-full overflow-hidden border border-gray-300 rounded-main">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-3 py-3 text-left border-b border-r border-gray-200 text-white-main bg-secondary-main whitespace-nowrap"
                  // Ordenamiento
                  onClick={
                    header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined
                  }
                  style={{
                    cursor: header.column.getCanSort() ? "pointer" : undefined,
                  }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className={`border-t-2  even:bg-gray-200 hover:bg-secondary-50 `}>
              {row.getVisibleCells().map((cell, index) => {
                const cellContent = flexRender(cell.column.columnDef.cell, cell.getContext());
                console.log({ number: flexRender(cell.column.columnDef.cell, cell.getContext()) });

                // Solo en la PRIMERA CELDA mostramos el popover
                if (index === 1) {
                  return (
                    <td
                      key={cell.id}
                      className={`px-3 py-3 text-sm border-b border-r border-gray-200 whitespace-nowrap `}
                    >
                      {/*@ts-ignore */}
                      <TooltipFilaCompleta data={row.original}>{cellContent}</TooltipFilaCompleta>
                    </td>
                  );
                }
                return (
                  <td
                    key={cell.id}
                    className="px-3 py-3 text-sm border-b border-r border-gray-200 whitespace-nowrap"
                  >
                    {cellContent}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
