/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { config } from "@/config/config";
import { useAuth } from "@/context/useAuthContext";
import { formatoFecha } from "@/libs/formateadorFecha";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { CuadreLeasing, PagoRealizadoLeasing } from "../types/CuadreLeasingDatabase";
import EditarItemCuadreLeasing from "../edicion/EditarItemCuadreLeasing";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MdDelete } from "react-icons/md";

export const EditarCuadreLeasing = () => {
  const {
    selectedRow,
    // setSelectedRow,
    setModalContent,
    openModal,
    closeModal,
  } = useAuth();
  const [cuadresGeneral, setCuadreGeneral] = useState<CuadreLeasing>();
  const [, setLoading] = useState<boolean>(false);
  const router = useRouter();
  
  useEffect(() => {
    const traerCuadres = async () => {
      try {
        setLoading(true);
        const request = await axios.get(
          `${config.apiUrl}/cuadreleasing/${selectedRow.id}`
        );

        if (request.status === 200) {
          console.log(request.data?.cuadreLeasing);
          setCuadreGeneral(request.data?.cuadreLeasing);
          setLoading(false);
        }
      } catch (error: any) {
        console.log(error);
        setLoading(false);
      }
    };

    traerCuadres();
  }, [selectedRow]);

  const handleEditCuadre = (item: PagoRealizadoLeasing) => {
    closeModal();
    setTimeout(() => {
      setModalContent(<EditarItemCuadreLeasing rowCuadre={item} />);
      openModal();
    }, 250);
  };

  async function handleDelete(id: number) {
    try {
      const request = await axios.post(`${config.apiUrl}/cuadreleasing/borrar/${id}/${selectedRow.leasingId}`, {
        withCredentials: true,
      });
      if (request.status === 200) {
        toast.success("Cuadre leasing correctamente");
        router.push("/sistema/cuadre-leasing?page=1");
        closeModal()
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="w-full">
      <h2 className="mb-12 text-3xl font-medium text-center font_kanit text-secondary-main">
        Selecciona un cuadre para editarlo
      </h2>
      <div className="grid w-full gap-5 lg:grid-cols-2">
        <div className="w-full">
          <h2 className="mb-3 text-lg font-bold text-center text-secondary-main">
            Cuadre Pagos
          </h2>
          <div className="grid w-full grid-cols-9 border rounded-main bg-secondary-main text-white-main border-secondary-main">
            <p className="px-4 py-2 font-semibold text-left truncate">Fecha</p>
            <p className="px-4 py-2 font-semibold text-left truncate">Deposito</p>
            <p className="px-4 py-2 font-semibold text-left truncate">Pagado</p>
            <p className="px-4 py-2 font-semibold text-left truncate">T.C</p>
            <p className="px-4 py-2 font-semibold text-left truncate">Monto Final</p>
            <p className="px-4 py-2 font-semibold text-left truncate">Referencia</p>
            <p className="px-4 py-2 font-semibold text-left truncate">Diferencia</p>
            <p className="px-4 py-2 font-semibold text-left truncate">Acción</p>
          </div>
          {/* @ts-ignore */}
          {
            //@ts-ignore
            cuadresGeneral?.pagosRealizados &&
            //@ts-ignore
            cuadresGeneral?.pagosRealizados.map((item: PagoRealizadoLeasing) => (
              <div
                className="grid w-full grid-cols-9 border-l border-r cursor-pointer hover:bg-white-200 rounded-b-main gap-y-1 text-black-900"
                key={`EditarCuadreRegistradosDolares${item.id}`}
              >
                <p onClick={() => {
                  handleEditCuadre(item);
                }} className="px-4 py-3 text-gray-700 truncate border-b">
                  {formatoFecha(String(item.pagoLeasing?.fecha))}
                </p>
                <p onClick={() => {
                  handleEditCuadre(item);
                }} className="px-4 py-3 text-gray-700 truncate border-b">
                  {item.pagoLeasing?.deposito}
                </p>
                <p onClick={() => {
                  handleEditCuadre(item);
                }} className="px-4 py-3 text-gray-700 truncate border-b">
                  {item.pagoLeasing?.pagado}
                </p>
                <p onClick={() => {
                  handleEditCuadre(item);
                }} className="px-4 py-3 text-gray-700 truncate border-b">
                  {item.pagoLeasing?.tc}
                </p>
                <p onClick={() => {
                  handleEditCuadre(item);
                }} className="px-4 py-3 text-gray-700 truncate border-b">
                  {item.pagoLeasing?.montoFinal}
                </p>
                <p onClick={() => {
                  handleEditCuadre(item);
                }} className="px-4 py-3 text-gray-700 truncate border-b">
                  {item.pagoLeasing?.referencia}
                </p>
                <p onClick={() => {
                  handleEditCuadre(item);
                }} className="px-4 py-3 text-gray-700 truncate border-b">
                  {item.pagoLeasing?.diferencia}
                </p>
                <p onClick={() => handleDelete(item.id)} className="px-4 py-3 border-b z-50" title="Eliminar cuadre">
                  <button className="text-red-500 mx-auto">
                    <MdDelete size={27} />
                  </button>
                </p>
              </div>
            ))}
        </div>
        <div className="w-full">
          <h2 className="mb-3 text-lg font-bold text-center text-secondary-main">
            Cuadres Detracción
          </h2>
          <div className="grid w-full grid-cols-8 border bg-secondary-main text-white-main rounded-main border-secondary-main">
            <p className="px-4 py-2 font-semibold text-left truncate">Fecha</p>
            <p className="px-4 py-2 font-semibold text-left truncate">Deposito</p>
            <p className="px-4 py-2 font-semibold text-left truncate">Pagado</p>
            <p className="px-4 py-2 font-semibold text-left truncate">T.C</p>
            <p className="px-4 py-2 font-semibold text-left truncate">Monto Final</p>
            <p className="px-4 py-2 font-semibold text-left truncate">Referencia</p>
            <p className="px-4 py-2 font-semibold text-left truncate">Diferencia</p>
            <p className="px-4 py-2 font-semibold text-left truncate">Acción</p>
          </div>
          {/* @ts-ignore */}
          {
            //@ts-ignore
            cuadresGeneral?.pagosRealizados &&
            //@ts-ignore
            cuadresGeneral?.pagosRealizados.map((item: PagoRealizadoLeasing) => (
              <div
                className="grid w-full grid-cols-8 border-l border-r cursor-pointer hover:bg-white-200 rounded-b-main gap-y-1 text-black-900"
                key={`EditarCuadreRegistradosSoles${item.id}`}
              >
                <p className="px-4 py-3 text-gray-700 truncate border-b">
                  {formatoFecha(String(item.detraccion?.fecha))}
                </p>
                <p className="px-4 py-3 text-gray-700 truncate border-b">
                  {item.detraccion?.deposito}
                </p>
                <p className="px-4 py-3 text-gray-700 truncate border-b">
                  {item.detraccion?.pagado}
                </p>
                <p className="px-4 py-3 text-gray-700 truncate border-b">
                  {item.detraccion?.tc}
                </p>
                <p className="px-4 py-3 text-gray-700 truncate border-b">
                  {item.detraccion?.montoFinal}
                </p>
                <p className="px-4 py-3 text-gray-700 truncate border-b">
                  {item.detraccion?.referencia}
                </p>
                <p className="px-4 py-3 text-gray-700 truncate border-b">
                  {item.detraccion?.diferencia}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default EditarCuadreLeasing;