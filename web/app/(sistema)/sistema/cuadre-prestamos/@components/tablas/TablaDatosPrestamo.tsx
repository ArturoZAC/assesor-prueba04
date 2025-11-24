/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useAuth } from "@/context/useAuthContext";
import {
  ColumnDef,
  RowData,
  SortingState,
  ColumnFiltersState,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
export type TablaDatosProps<TData extends RowData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
};

type TooltipFilaCompletaProps = {
  children: React.ReactNode;
  data: Record<string, any>;
};

export type ActionType = "agregar" | "editar";

export function TooltipFilaCompleta({
  children,
  data,
}: TooltipFilaCompletaProps) {
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

export type ContextMenuOption = {
  label: string;
  modal: ReactNode;
};

export function TablaDatosPrestamo<TData extends RowData>({
  data,
  columns,
  globalFilter,
  setGlobalFilter,
  modalRenderAdd,
  modalRenderEdit,
  actionClick,
  showContextMenu,
  contextMenuOptions,
}: {
  data: TData[];
  columns: ColumnDef<TData>[];
  globalFilter: string;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
  modalRenderAdd?: React.ReactNode;
  modalRenderEdit?: React.ReactNode;
  actionClick: ActionType;
  showContextMenu?: boolean;
  contextMenuOptions?: ContextMenuOption[];
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleContextMenu = (e: React.MouseEvent, row: any) => {
    e.preventDefault();

    console.log("ROW: ", row.original);

    if (showContextMenu) {
      setSelectedRow(row.original);
      setMenuPosition({ x: e.pageX, y: e.pageY });
      setIsMenuVisible(true);
    }
  };

  const handleClickOutside = () => {
    setIsMenuVisible(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const { setModalContent, openModal, setSelectedRow } = useAuth();
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
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
                    header.column.getCanSort()
                      ? header.column.getToggleSortingHandler()
                      : undefined
                  }
                  style={{
                    cursor: header.column.getCanSort() ? "pointer" : undefined,
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}

          <tr className="">
            {table.getHeaderGroups()[0].headers.map((header) => (
              <th
                key={header.id}
                className="px-1 py-1 border-b border-r border-gray-200 "
              >
                {header.column.getCanFilter() ? (
                  <input
                    className="w-full px-2 py-2 text-sm font-normal border outline-none text-black-900 rounded-main focus:border-secondary-main"
                    placeholder={`Filtrar ${header.column.id}`}
                    value={(header.column.getFilterValue() ?? "") as string}
                    onChange={(e) =>
                      header.column.setFilterValue(e.target.value)
                    }
                  />
                ) : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onContextMenu={(e) => handleContextMenu(e, row)}

              onClick={() => {

                //@ts-ignore
                if (row.original?.resaltarFila.data.length === 0) {
                  if (actionClick === "agregar") {
                    setModalContent(modalRenderAdd);
                  }
                  if (actionClick === "editar") setModalContent(modalRenderEdit);
                  setSelectedRow(row.original);
                  openModal();
                }
              }}

              className={`border-t-2  even:bg-gray-200 hover:bg-secondary-50 `}
            >
              {row.getVisibleCells().map((cell, index) => {
                const cellContent = flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                );

                if (index === 1) {
                  return (
                    <td
                      key={cell.id}
                      className={`px-3 py-3 text-sm border-b border-r relative border-gray-200  whitespace-nowrap `}
                    >
                      {/*@ts-ignore */}
                      {row.original?.resaltarFila.active != undefined ? row.original?.resaltarFila.active && (
                        <span className="absolute block w-2 h-2 rounded-full cursor-pointer group bg-primary-main top-1 right-1">
                          <ul className="absolute top-0 hidden text-white-main w-fit px-3 py-2 shadow-md left-[calc(100%+2px)] group-hover:block rounded  bg-secondary-main">
                            {/*@ts-ignore */}
                            {row.original?.resaltarFila.data.map(
                              (item: any, index: number) => (
                                <li key={`resaltaFila${index}`}>
                                  {item.label}
                                </li>
                              )
                            )}
                          </ul>
                        </span>
                      ) : null}

                      {/*@ts-ignore */}
                      <TooltipFilaCompleta data={row.original}>
                        {cellContent}
                      </TooltipFilaCompleta>
                    </td>
                  );
                }

                return (
                  <td
                    key={cell.id}
                    className={
                      "px-3 py-3 text-sm border-b border-r border-gray-200 whitespace-nowrap"
                    }
                  >
                    {cellContent}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {isMenuVisible && (
        <div
          className="overflow-hidden relative z-30  border rounded shadow text-black-main bg-white-main"
          style={{
            position: "absolute",
            left: menuPosition.x,
            top: menuPosition.y,
          }}
        >
          <ul>
            {contextMenuOptions?.map((option, index) => (
              <li
                key={index}
                onClick={() => {
                  setModalContent(option.modal);
                  openModal();
                }}
                className="px-4 py-2 cursor-pointer hover:bg-secondary-900 hover:text-white-main"
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
