/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { config } from "@/config/config";
import { useAuth } from "@/context/useAuthContext";
import { formatoFecha } from "@/libs/formateadorFecha";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { EditarCuadroDolares } from "./edicion/EditarCuadroDolares";
import { EditarCuadroSoles } from "./edicion/EditarCuadroSoles";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MdDelete } from "react-icons/md";

export const EditarCuadreOperacion = () => {
  const {
    selectedRow,
    setModalContent,
    openModal,
    closeModal,
  } = useAuth();
  const [cuadresGeneral, setCuadreGeneral] = useState<[]>([]);
  const [, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const traerCuadres = async () => {
      try {
        setLoading(true);
        const request = await axios.get(
          `${config.apiUrl}/operaciones/traerCuadres/${selectedRow.operacionId}`,
          {
            withCredentials: true
          }
        );

        if (request.status === 200) {
          console.log(request.data?.cuadreOperacion);
          setCuadreGeneral(request.data?.cuadreOperacion);
          setLoading(false);
        }
      } catch (error: any) {
        console.log(error);
        setLoading(false);
      }
    };

    traerCuadres();
  }, [selectedRow]);

  const handleEditCuadre = (item: any, moneda: string) => {
    closeModal();
    setTimeout(() => {
      if (moneda === "dolar") {
        setModalContent(<EditarCuadroDolares rowCuadre={item}/>);
      }
      if (moneda === "sol") {
        setModalContent(<EditarCuadroSoles rowCuadre={item}/>);
      }
      openModal();
    }, 250);
  };

  async function handleDeleteSoles (id: number) {
    try {
      const request = await axios.post(`${config.apiUrl}/operaciones/eliminarCuadreOperacionSoles/${id}`, {
        withCredentials: true,
      });
      if (request.status === 200) {
        toast.success("Cuadre eliminado correctamente");
        router.push("/sistema/cuadre-operaciones?page=1");
        closeModal()
      } else {
        toast.error("Error al eliminar el cuadre")
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteDolares (id: number) {
    try {
      const request = await axios.post(`${config.apiUrl}/operaciones/eliminarCuadreOperacionDolares/${id}`, {
        withCredentials: true,
      });
      if (request.status === 200) {
        toast.success("Cuadre eliminado correctamente");
        router.push("/sistema/cuadre-operaciones?page=1");
        closeModal()
      }
    } catch (error) {
      toast.error("Error al eliminar cuadre");
      console.log(error);
    }
  }

  return (
    <>
      <h2 className="mb-12 text-3xl font-medium text-center font_kanit text-secondary-main">
        Selecciona un cuadre para editarlo
      </h2>
      <div className="grid w-full gap-5 lg:grid-cols-2">
        <div className="w-full">
          <h2 className="mb-3 text-lg font-bold text-center text-secondary-main">
            Cuadres dólares
          </h2>
          <div className="grid w-full grid-cols-5 border rounded-main bg-secondary-main text-white-main border-secondary-main">
            <p className="px-4 py-2 font-semibold text-left ">Fecha</p>
            <p className="px-4 py-2 font-semibold text-left ">Descripción</p>
            <p className="px-4 py-2 font-semibold text-left ">Monto</p>
            <p className="px-4 py-2 font-semibold text-left ">Referencia</p>
            <p className="px-4 py-2 font-semibold text-left ">Acción</p>
          </div>
          {/* @ts-ignore */}
          {cuadresGeneral !== null &&
            //@ts-ignore
            cuadresGeneral.CuadreOperacionDolares &&
            //@ts-ignore
            cuadresGeneral?.CuadreOperacionDolares.map((item: any) => (
              <div
                className="grid w-full grid-cols-5 border-l border-r items-center cursor-pointer hover:bg-white-200 rounded-b-main gap-y-1 text-black-900"
                key={`EditarCuadreRegistradosDolares${item.id}`}
              >
                <p onClick={() => {
                  handleEditCuadre(item, "dolar");
                }} className="px-4 py-3 text-gray-700 border-b h-full">
                  {formatoFecha(item.fecha_usd)}
                </p>
                <p onClick={() => {
                  handleEditCuadre(item, "dolar");
                }} className="px-4 py-3 text-gray-700 border-b truncate h-full">
                  {item.descripcion_op_usd}
                </p>
                <p onClick={() => {
                  handleEditCuadre(item, "dolar");
                }} className="px-4 py-3 text-gray-700 border-b h-full">
                  $ {item.monto_usd}
                </p>
                <p onClick={() => {
                  handleEditCuadre(item, "dolar");
                }} className="px-4 py-3 text-gray-700 border-b h-full">
                  {item.referencia_usd}
                </p>
                <p onClick={() => handleDeleteDolares(item.id)} className="px-4 py-3 border-b z-50" title="Eliminar cuadre" id={item.id}>
                  <button className="text-red-500 mx-auto">
                    <MdDelete size={27} />
                  </button>
                </p>
              </div>
            ))}
        </div>
        <div className="w-full">
          <h2 className="mb-3 text-lg font-bold text-center text-secondary-main">
            Cuadres soles
          </h2>
          <div className="grid w-full grid-cols-5 border bg-secondary-main text-white-main rounded-main border-secondary-main">
            <p className="px-4 py-2 font-semibold text-left ">Fecha</p>
            <p className="px-4 py-2 font-semibold text-left ">Descripción</p>
            <p className="px-4 py-2 font-semibold text-left ">Monto</p>
            <p className="px-4 py-2 font-semibold text-left ">Referencia</p>
            <p className="px-4 py-2 font-semibold text-left ">Acción</p>
          </div>
          {/* @ts-ignore */}
          {cuadresGeneral !== null &&
            //@ts-ignore
            cuadresGeneral.CuadreOperacionSoles &&
            //@ts-ignore
            cuadresGeneral?.CuadreOperacionSoles.map((item: any) => (
              <div
                className="grid w-full grid-cols-5 border-l border-r cursor-pointer hover:bg-white-200 rounded-b-main gap-y-1 text-black-900"
                key={`EditarCuadreRegistradosSoles${item.id}`}
              >
                <p onClick={() => {
                  handleEditCuadre(item, "sol");
                }} className="px-4 py-3 text-gray-700 border-b">
                  {formatoFecha(item.fecha_pen)}
                </p>
                <p onClick={() => {
                  handleEditCuadre(item, "sol");
                }} className="px-4 py-3 text-gray-700 border-b">
                  {item.descripcion_op_pen}
                </p>
                <p onClick={() => {
                  handleEditCuadre(item, "sol");
                }} className="px-4 py-3 text-gray-700 border-b">
                  S/. {item.monto_pen}
                </p>
                <p onClick={() => {
                  handleEditCuadre(item, "sol");
                }} className="px-4 py-3 text-gray-700 border-b">
                  {item.referencia_pen}
                </p>
                <p  onClick={() => handleDeleteSoles(item.id)} className="px-4 py-3 border-b z-50" title="Eliminar cuadre" id={item.id}>
                  <button className="text-red-500 mx-auto">
                    <MdDelete size={27} />
                  </button>
                </p>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};
