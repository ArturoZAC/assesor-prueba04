/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { useAuth } from "@/context/useAuthContext";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UploadData } from "../../@componentes/form/UploadData";
type FilterOption = {
  value: string;
  label: string;
};

export type FilterBuscador = {
  name: string;
  label: string;
  options: FilterOption[];
};

type BuscadorTablaProps = {
  modalRender: React.ReactNode;
  search: string;
  textAdd?: string;
  filters?: FilterBuscador[];
  hideAddButton?: boolean;
  renderUploadMasive?: boolean;
  routeUploadApi?: string
  hideSearch?: boolean
};

export const BuscadorTabla = ({
  modalRender,
  search,
  textAdd,
  filters = [],
  hideAddButton,
  renderUploadMasive,
  routeUploadApi,
  hideSearch
}: BuscadorTablaProps) => {
  const { openModal, setModalContent, setSelectedRow } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState<string>(search);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const newFilters: Record<string, string> = {};
    filters.forEach((filter) => {
      const value = searchParams.get(filter.name) ?? "";
      newFilters[filter.name] = value;
    });
    // setFilterValues(newFilters);
    router.push(`${pathname}?${searchParams.toString()}`)
  },  [searchParams, filterValues]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(filterValues).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    if (searchTerm.length >= 3) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }

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

    if (searchTerm.length >= 3) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    router.push(`${pathname}?${params.toString()}`)
  }, [searchTerm, JSON.stringify(filterValues), searchParams.toString()]);

  const handleClearFilters = () => {
    setSearchTerm("");
    const resetFilters: Record<string, string> = {};
    filters.forEach((filter) => {
      resetFilters[filter.name] = "";
    });
    setFilterValues(resetFilters);

    const params = new URLSearchParams();
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  const hasActiveFilters = Object.values(filterValues).some(
    (value) => value !== ""
  );
  return (
    <>
      {
        !hideSearch && (
          <section className="flex justify-between w-full gap-3 mb-3">
            <div className="my-2">
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                  type="text"
                  className="px-3 py-2 border outline-none rounded-main focus:border-secondary-main"
                  placeholder="🔍 Buscar en toda la tabla..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-secondary-main text-white-main rounded-main"
                >
                  Buscar
                </button>
              </form>
            </div>

            <div className="flex items-end justify-end w-full gap-4">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-3 py-2 text-sm text-red-600 underline"
                >
                  Limpiar filtros
                </button>
              )}
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
              {!hideAddButton && textAdd && (
                <button
                  type="button"
                  onClick={() => {
                    setModalContent(modalRender);

                    setSelectedRow("");
                    openModal();
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-primary-700 active:scale-90 bg-primary-main rounded-main text-white-main"
                >
                  <Plus />
                  {textAdd}
                </button>
              )}
              {renderUploadMasive && (
                <>
                  <UploadData route={routeUploadApi} />
                </>
              )}
            </div>
          </section>
        )
      }
    </>
  );
};
