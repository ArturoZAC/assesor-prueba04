
'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { config } from '@/config/config';
import { useAuth } from '@/context/useAuthContext';
import { formatoFecha } from '@/libs/formateadorFecha';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import EditarCuadrePrestamo from '../form/EditarCuadrePrestamo';
import EditarCuadreDevolucion from '../form/EditarCuadreDevolucion';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { MdDelete } from 'react-icons/md';

export default function EditarCuadrePrestamoGeneral() {
  const {
    selectedRow,
    setModalContent,
    openModal,
    closeModal,
  } = useAuth();
  const [cuadresGeneral, setCuadreGeneral] = useState<CuadrePrestamo>();
  const [, setLoading] = useState<boolean>(false);

  const router = useRouter();

  console.log(selectedRow)
  useEffect(() => {
    const traerCuadres = async () => {
      try {
        setLoading(true);
        const request = await axios.get(
          `${config.apiUrl}/cuadreprestamos/${selectedRow.id}`,
          {
            withCredentials: true,
          }
        );

        if (request.status === 200) {
          console.log(request.data?.cuadrePrestamo);
          setCuadreGeneral(request.data?.cuadrePrestamo);
          setLoading(false);
        }
      } catch (error: any) {
        console.log(error);
        setLoading(false);
      }
    };

    traerCuadres();
  }, [selectedRow]);

  const handleEditCuadre = (item: PagosPrestamo) => {
    closeModal();
    setTimeout(() => {
      setModalContent(<EditarCuadrePrestamo rowCuadre={item} />);
      openModal();
    }, 250);
  };

  const handleEditSalida = (item: DevolucionesPrestamo) => {
    closeModal();
    setTimeout(() => {
      setModalContent(<EditarCuadreDevolucion rowCuadre={item} />);
      openModal();
    }, 250);
  };

  async function handleDeleteSalida(id: number) {
    try {
      const request = await axios.post(`${config.apiUrl}/cuadreprestamos/salida/borrar/${id}`, {
        withCredentials: true,
      });
      if (request.status === 200) {
        toast.success("Cuadre prestamos correctamente");
        router.push("/sistema/cuadre-prestamos?page=1");
        closeModal()
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteDevolucion(id: number) {
    try {
      const request = await axios.post(`${config.apiUrl}/cuadreprestamos/devolucion/borrar/${id}`, {
        withCredentials: true,
      });
      if (request.status === 200) {
        toast.success("Cuadre prestamos correctamente");
        router.push("/sistema/cuadre-prestamos?page=1");
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
            Cuadre Salidas
          </h2>
          <div className="grid w-full grid-cols-5 border rounded-main bg-secondary-main text-white-main border-secondary-main">
            <p className="px-4 py-2 font-semibold text-left truncate">Fecha</p>
            <p className="px-4 py-2 font-semibold text-left truncate">Descripción</p>
            <p className="px-4 py-2 font-semibold text-left truncate">Monto S</p>
            <p className="px-4 py-2 font-semibold text-left truncate">Diferencia</p>
            <p className="px-4 py-2 font-semibold text-left truncate">Acción</p>
          </div>
          {/* @ts-ignore */}
          {cuadresGeneral !== null &&
            //@ts-ignore
            cuadresGeneral?.salidasPrestamo &&
            //@ts-ignore
            cuadresGeneral?.salidasPrestamo.map((item: PagosPrestamo) => (
              <div
                className="grid w-full grid-cols-5 border-l border-r cursor-pointer hover:bg-white-200 rounded-b-main gap-y-1 text-black-900"
                key={`EditarCuadreRegistradosDolares${item.id}`}
              >
                <p onClick={() => {
                  handleEditCuadre(item);
                }} className="px-4 py-3 text-gray-700 border-b truncate">
                  {formatoFecha(String(item.fecha))}
                </p>
                <p onClick={() => {
                  handleEditCuadre(item);
                }} className="px-4 py-3 text-gray-700 border-b truncate">
                  {item.descripcion}
                </p>
                <p onClick={() => {
                  handleEditCuadre(item);
                }} className="px-4 py-3 text-gray-700 border-b truncate">
                  {item.moonto}
                </p>
                <p onClick={() => {
                  handleEditCuadre(item);
                }} className="px-4 py-3 text-gray-700 border-b truncate">
                  {item.diferencia}
                </p>
                <p onClick={() => handleDeleteSalida(item.id)} className="px-4 py-3 border-b z-50" title="Eliminar cuadre">
                  <button className="text-red-500 mx-auto">
                    <MdDelete size={27} />
                  </button>
                </p>
              </div>
            ))}
        </div>
        <div className="w-full">
          <h2 className="mb-3 text-lg font-bold text-center text-secondary-main">
            Cuadres Devoluciones
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
          {cuadresGeneral !== null &&
            //@ts-ignore
            cuadresGeneral?.devolucionesPrestamo &&
            //@ts-ignore
            cuadresGeneral?.devolucionesPrestamo.map((item: DevolucionesPrestamo) => (
              <div
                className="grid w-full grid-cols-8 border-l border-r cursor-pointer hover:bg-white-200 rounded-b-main gap-y-1 text-black-900"
                key={`EditarCuadreRegistradosSoles${item.id}`}
              >
                <p onClick={() => {
                  handleEditSalida(item);
                }} className="px-4 py-3 text-gray-700 border-b truncate">
                  {formatoFecha(String(item.fecha))}
                </p>
                <p onClick={() => {
                  handleEditSalida(item);
                }} className="px-4 py-3 text-gray-700 border-b truncate">
                  {item.deposito}
                </p>
                <p onClick={() => {
                  handleEditSalida(item);
                }} className="px-4 py-3 text-gray-700 border-b truncate">
                  {item.pagado}
                </p>
                <p onClick={() => {
                  handleEditSalida(item);
                }} className="px-4 py-3 text-gray-700 border-b truncate">
                  {item.tc}
                </p>
                <p onClick={() => {
                  handleEditSalida(item);
                }} className="px-4 py-3 text-gray-700 border-b truncate">
                  {item.montoFinal}
                </p>
                <p onClick={() => {
                  handleEditSalida(item);
                }} className="px-4 py-3 text-gray-700 border-b truncate">
                  {item.referencia}
                </p>
                <p onClick={() => {
                  handleEditSalida(item);
                }} className="px-4 py-3 text-gray-700 border-b truncate">
                  {item.diferencia}
                </p>
                <p onClick={() => handleDeleteDevolucion(item.id)} className="px-4 py-3 border-b z-50" title="Eliminar cuadre">
                  <button className="text-red-500 mx-auto">
                    <MdDelete size={27} />
                  </button>
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
