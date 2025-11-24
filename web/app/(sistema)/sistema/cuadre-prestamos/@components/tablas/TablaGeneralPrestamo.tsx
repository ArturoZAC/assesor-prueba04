/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { ReactNode, useMemo, useState } from "react";
import {
  BuscadorTabla,
  FilterBuscador,
} from "../../../master-clientes/@components/BuscadorTabla";
import { ColumnDef, getCoreRowModel, RowData, useReactTable } from "@tanstack/react-table";
import Link from "next/link";
import { BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "../../../@componentes/interfaces/TableInterfaces";
import { ActionType, ContextMenuOption, TablaDatosPrestamo } from "./TablaDatosPrestamo";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import * as XLSX from "xlsx"
import { useAuth } from "@/context/useAuthContext";
import { toast } from "sonner";

export function TablaGeneralPrestamo<TData extends RowData>({
  search,
  data,
  columns,
  modalRenderAdd,
  modalRenderEdit,
  pagination,
  textAdd,
  filters,
  hideAddButton,
  actionClick,
  showContextMenu,
  contextMenuOptions,
  formExportModal
}: {
  search: string;
  data: TData[];
  columns: ColumnDef<TData>[];
  modalRenderAdd: ReactNode;
  modalRenderEdit?: ReactNode;
  pagination: Pagination;
  textAdd: string;
  filters?: FilterBuscador[];
  hideAddButton?: boolean;
  actionClick: ActionType;
  showContextMenu?: boolean;
  contextMenuOptions?: ContextMenuOption[];
  formExportModal?: ReactNode;
}) {
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { openModal, setModalContent } = useAuth()
  const router = useRouter()
  const [page, setPage] = useState(searchParams.get("page") || pagination.page)

  const getPageUrl = (newPage: number) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set("page", newPage.toString());
    return `${pathname}?${params.toString()}`;
  };

  function openModalExportar() {
    setModalContent(formExportModal)
    openModal()
  }

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
      <BuscadorTabla
        modalRender={modalRenderAdd}
        search={search}
        textAdd={textAdd}
        filters={filters}
        hideAddButton={hideAddButton}
      />
      <TablaDatosPrestamo
        columns={columns}
        data={data}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        modalRenderAdd={modalRenderAdd}
        modalRenderEdit={modalRenderEdit}
        actionClick={actionClick}
        contextMenuOptions={contextMenuOptions}
        showContextMenu={showContextMenu}
      />

      <div className="relative flex justify-end w-full gap-3 mt-6">
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-4 py-2 mb-4 text-white bg-green-800 text-white-main rounded-main"
        >
          <PiMicrosoftExcelLogoFill />
          Exportar Tabla
        </button>
        <button
          onClick={openModalExportar}
          className="relative flex items-center gap-2 px-4 py-2 mb-4 text-white bg-green-600 text-white-main rounded-main"
        >
          <PiMicrosoftExcelLogoFill />
          Exportar a Excel
        </button>
      </div>

      {data.length > 0 && pagination && (
        <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
          <div className="flex items-center gap-2">
            <label
              htmlFor="limit"
              className="text-sm font-medium text-black-main"
            >
              Mostrar:
            </label>
            <select
              id="limit"
              className="p-2 text-sm border text-black-main bg-white-main rounded-main"
              value={searchParams.get("limit") || pagination.limit}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("limit", e.target.value);
                params.set("page", "1");
                router.push(`${pathname}?${params.toString()}`);
              }}
            >
              {[10, 20, 50, 100].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="page"
              type="number"
              min={0}
              className="p-2 text-sm border text-black-main bg-white-main rounded-main w-fit"
              value={page}
              onChange={(e) => {
                setPage(e.target.valueAsNumber)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (page === 0) return
                  if (Number(page) > pagination.totalPages) {
                    toast.error("No se puede ir más allá de la página " + pagination.totalPages)
                    return
                  }
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("page", String(page));
                  router.push(`${pathname}?${params.toString()}`);
                }
              }}
            />
            <label htmlFor="page">{pagination.page} de {pagination.totalPages}</label>
          </div>

          <div className="flex items-center justify-between flex-1 gap-4">
            <Link
              prefetch={false}
              className={`p-2 text-white-main active:scale-90 transition-all duration-200 flex bg-secondary-main border rounded-main  disabled:opacity-50 ${pagination.page === 1 ? "pointer-events-none opacity-80" : ""
                }`}
              href={getPageUrl(pagination.page - 1)}
            >
              <BsCaretLeftFill />
            </Link>
            <span>
              Página{" "}
              <strong>
                {pagination.page} de {pagination.totalPages}
              </strong>
            </span>
            <Link
              className={`p-2 text-white-main active:scale-90 transition-all duration-200 flex bg-secondary-main border rounded-main  disabled:opacity-50 ${pagination.page === pagination.totalPages
                ? "pointer-events-none opacity-80"
                : ""
                }`}
              prefetch={false}
              href={getPageUrl(pagination.page + 1)}
            >
              <BsCaretRightFill />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}