"use client";
import React, { FC, useEffect, useState } from "react";
import { FilterBuscador } from "../../master-clientes/@components/BuscadorTabla";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { useAuth } from "@/context/useAuthContext";
import { Pagination } from "../../@componentes/interfaces/TableInterfaces";
import { FaPlus } from "react-icons/fa";
import { toast } from "sonner";
import { formatNumberToTwoDecimals } from "@/logic/formatearNumeroDecimal";

type CellData = {
  value: string | number;
  id: number | null;
  isHeader?: boolean;
  isTotal?: boolean;
  colSpan?: number;
  className?: string;
};

type RowData = CellData[];

type TablaFlujosProps = {
  columns: string[];
  rows: RowData[];
  filters: FilterBuscador[];
  pagination: Pagination
  AgregarModal?: FC
  EditarModal?: FC<{ id: number }>
  textAdd?: string
  ExportarExcel: FC
  AgregarPorcentaje?: FC
  hideAgregarButton?: boolean
  textAddPorcentaje?: string
  hidePorcentajeButton?: boolean
};

/*
function formatNumero(value: number | string) {
  if (typeof value === 'string') {
    return value
  }
  return Number(value).toFixed(2)
}
*/

export const TablaFlujos: React.FC<TablaFlujosProps> = ({
  columns,
  rows,
  filters = [],
  AgregarModal,
  EditarModal,
  textAdd,
  ExportarExcel,
  hideAgregarButton,
  AgregarPorcentaje,
  textAddPorcentaje,
  hidePorcentajeButton
}) => {
  //Obtener search params
  const searchParams = useSearchParams();
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const router = useRouter();
  const pathname = usePathname();
  const { openModal, setModalContent } = useAuth();

  useEffect(() => {
    const newFilters: Record<string, string> = {};
    filters.forEach((filter) => {
      const value = searchParams.get(filter.name) ?? "";
      newFilters[filter.name] = value;
    });
    setFilterValues(newFilters);
  }, [searchParams, filters]);

  const handleClearFilters = () => {
    const resetFilters: Record<string, string> = {};
    filters.forEach((filter) => {
      resetFilters[filter.name] = "";
    });
    setFilterValues(resetFilters);

    const params = new URLSearchParams();
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(filterValues).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    const newUrl = `${pathname}?${params.toString()}`;
    const currentUrl = `${pathname}?${searchParams.toString()}`;

    if (newUrl !== currentUrl) {
      router.push(newUrl);
    }
  }, [filterValues, pathname, router, searchParams]);

  const hasActiveFilters = Object.values(filterValues).some(
    (value) => value !== ""
  );

  function openModalExportar() {
    setModalContent(<ExportarExcel />);
    openModal();
  }

  function abrirModalAgregar() {
    if (AgregarModal) {
      setModalContent(<AgregarModal />)
    }
    openModal()
  }

  function abrirModalAgregarPorcentaje() {
    if (AgregarPorcentaje) {
      setModalContent(<AgregarPorcentaje />)
    }
    openModal()
  }

  function abrirModalEditar(id: number) {
    if (id === 0) {
      toast.error("Debes seleccionar un registro para editar");
      return;
    }
    toast.success("Buscando registro para editar");
    if (EditarModal) {
      setModalContent(<EditarModal id={id} />)
      openModal()
    }
  }

  //   const getPageUrl = (newPage: number) => {
  //     const params = new URLSearchParams(searchParams?.toString());
  //     params.set("page", newPage.toString());
  //     return `${pathname}?${params.toString()}`;
  //   };
  return (
    <>
      <div className="flex items-end justify-between w-full gap-4 mb-6">
        <div className="flex items-end gap-4 ">
          {filters.map((filter) => (
            <div className="flex flex-col gap-1" key={filter.name}>
              <label
                htmlFor=""
                className="text-sm font-semibold text-secondary-main"
              >
                {filter.label}
              </label>
              <select
                value={filterValues[filter.name] ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (filterValues[filter.name] !== value) {
                    setFilterValues((prev) => ({
                      ...prev,
                      [filter.name]: value,
                    }));
                  }
                }}
                className="p-2 text-sm border rounded-md outline-none focus:border-secondary-main"
              >
                <option value="">Selecciona una opción</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-3 py-2 text-sm text-red-600 underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
        <div className="w-fit">
          <div className="relative flex justify-end w-full gap-3 ">
            <button
              onClick={openModalExportar}
              className="relative text-sm flex items-center gap-2 px-4 py-2 text-white transition-all duration-300 bg-green-600 text-white-main rounded-main hover:bg-green-700 active:scale-90"
            >
              <PiMicrosoftExcelLogoFill />
              Exportar a Excel
            </button>
            {
              !hidePorcentajeButton && (
                <button
                  onClick={abrirModalAgregarPorcentaje}
                  className="relative text-sm flex items-center gap-2 px-4 py-2 text-white transition-all duration-300 bg-orange-600 text-white-main rounded-main hover:bg-blue-700 active:scale-90"
                >
                  <FaPlus />
                  { textAddPorcentaje ?? "Agregar Flujo Presupuesto" }
                </button>
              )
            }
          {
            !hideAgregarButton && (
              <button
                onClick={abrirModalAgregar}
                className="relative text-sm flex items-center gap-2 px-4 py-2 text-white transition-all duration-300 bg-blue-600 text-white-main rounded-main hover:bg-blue-700 active:scale-90"
              >
                <FaPlus />
                { textAdd ?? "Agregar Flujo Presupuesto" }
              </button>
            )
          }
          </div>
        </div>
      </div>
      <div className="overflow-auto border rounded shadow">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${columns.length}, minmax(120px, 1fr))`,
          }}
        >
          {/* Header */}
          {columns.map((col, i) => (
            <div
              key={i}
              className="p-2 font-bold text-center border-b border-r text-white-main bg-secondary-main"
            >
              {col}
            </div>
          ))}

          {/* Rows */}
          {rows.map((row, rowIndex) => {
            console.log(row)
            return row.map((cell, cellIndex) => {
              const colSpan = cell.colSpan ?? 1;
              const styles = `p-2 border-b flex  border-r items-center text-sm  ${cell.isHeader || cell.isTotal
                  ? "font-bold bg-orange-100"
                  : " text-right justify-end"
                } ${cell.className ?? ""}`;
              return (
                <div
                  key={`${rowIndex}-${cellIndex}`}
                  className={styles}
                  style={{ gridColumn: `span ${colSpan}` }}
                  onClick={() => { abrirModalEditar(Number(cell.id))}}
                >
                  {cell.value === null ? '' : typeof(cell.value) === "string" ? cell.value : formatNumberToTwoDecimals(Number(cell.value))}
                </div>
              );
            })}
          )}
        </div>
      </div>

      {/* {rows.length > 0 && (
        <div className="flex items-center justify-between mt-2">
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
      )} */}
    </>
  );
};
