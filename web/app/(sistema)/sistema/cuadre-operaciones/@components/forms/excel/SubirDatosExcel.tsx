/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useAuth } from "@/context/useAuthContext";
import React, { Dispatch, SetStateAction, useState } from "react";
import * as XLSX from "xlsx";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { DeleteIcon } from "lucide-react";
import axios, { AxiosError } from "axios";
import { config } from "@/config/config";
import { toast } from "sonner";
export interface ExcelData {
  [key: string]: any;
}

interface HeadersExcel {
  key: string;
  title: string;
  id: number;
}

interface SubirDatosExcelProps {
  headers: HeadersExcel[];
  setData: Dispatch<SetStateAction<ExcelData[]>>;
  textAlert: string;
  rowExcelSelected: any;
  setRowExcelSelected: Dispatch<SetStateAction<any>>;
  fechaKey: string
  urlDelete?: string
  nombreDelete?: string
}

const formatCellValue = (value: any): any => {
  // Si es un número, Excel puede usarlo como fecha
  if (typeof value === "number") {
    // parse_date_code devuelve {y,m,d,H,M,S} o null
    const d = XLSX.SSF.parse_date_code(value);
    if (d) {
      // construimos Date y lo devolvemos en formato local
      return new Date(d.y, d.m - 1, d.d).toLocaleDateString("es-ES");
    }
  }
  // Si ya es Date
  if (value instanceof Date) {
    return value.toLocaleDateString("es-ES");
  }
  // Si es cualquier otro, lo devolvemos tal cual
  return value;
};

const SubirDatosExcel: React.FC<SubirDatosExcelProps> = ({
  headers,
  setData,
  textAlert,
  rowExcelSelected,
  setRowExcelSelected,
  fechaKey,
  urlDelete,
  nombreDelete
}) => {
  const { datosOperaciones, selectedRow } = useAuth();
  const [dataToDisplay, setDataToDisplay] =
    useState<ExcelData[]>(datosOperaciones);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const binaryStr = evt.target?.result;
      if (typeof binaryStr !== "string") return;

      const wb = XLSX.read(binaryStr, { type: "binary" });
      const wsName = wb.SheetNames[0];
      const ws = wb.Sheets[wsName];

      const raw: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const rows = raw.slice(1);

      const formatted: ExcelData[] = rows.map((row) => {
        const obj: ExcelData = {};
        headers.forEach((header) => {
          const key = header.key;
          const value = row[header.id - 1];
          if (key === fechaKey) {
            obj[key] = formatCellValue(value);
          }
          else {
            obj[key] = value;
          }
        });
        return obj;
      });

      setData(formatted);
      setDataToDisplay(formatted);
      localStorage.setItem("datosExcel", JSON.stringify(formatted));
    };
    reader.readAsBinaryString(file);
  };

  async function eliminarDato () {
    try {
      const res = await axios.post(`${config.apiUrl}/${urlDelete}/${selectedRow.id}`)

      if (res.status === 200) {
        toast.success(res.data.message)
        window.location.reload()
      }

    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message)
      }
    }
  }

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <p className="text-red-500">
          {dataToDisplay.length > 0 ? textAlert : ""}
        </p>
        <div className="flex gap-3">
          {
            urlDelete && (
              <button 
                type="button"
                onClick={eliminarDato}
                className="flex gap-2 text-white-100 rounded-main bg-red-500 hover:bg-red-600 px-4 py-2 shadow"
              >
                <DeleteIcon />
                <span>{ nombreDelete }</span>
              </button>
            )
          }
          <button className="relative cursor-pointer active:scale-90  justify-end flex items-center gap-2 px-4 py-2 transition bg-[#307750] rounded-main shadow text-white-main  hover:bg-green-800">
            {/* icono */}
            <PiMicrosoftExcelLogoFill />
            Subir Excel
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="absolute inset-0 block opacity-0 cursor-pointer"
            />
          </button>
        </div>
      </div>
      <div className="relative w-full">
        <div className="">
          <h3 className="mb-2 text-lg font-bold text-gray-700">
            Datos del archivo Excel:
          </h3>
          <table className="w-full bg-white border-collapse rounded shadow table-auto">
            <thead>
              <tr className="bg-gray-100 text-secondary-main">
                {headers.map((h: HeadersExcel, i) => (
                  <th
                    key={i}
                    className="px-4 py-2 font-semibold text-left border-b"
                  >
                    {h.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataToDisplay.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  onClick={() => {
                    setRowExcelSelected(row);
                  }}
                  className={`${rIdx % 2 === 0 ? "bg-gray-50" : "bg-white"} ${rowExcelSelected === row
                      ? "bg-green-300 hover:bg-green-300"
                      : "hover:bg-white-100"
                    }  cursor-pointer transition duration-200`}
                >
                  {headers.map((h: HeadersExcel, cIdx) => (
                    <td
                      key={cIdx}
                      className="px-4 py-2 text-gray-700 border-b "
                    >
                      {row[h.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SubirDatosExcel;
