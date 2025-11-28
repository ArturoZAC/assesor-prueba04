/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { useAuth } from '@/context/useAuthContext';
import React, { useEffect, useState } from 'react'
import EditarCuadreFacturacion from '../form/EditarCuadreFacturacion';
import axios from 'axios';
import { config } from '@/config/config';
import { ICuadreFacturacion } from '../types/CuadreFacturacionDatabase';

export default function ModalEditarCuadreFacturacion() {

  const {
    selectedRow,
    setModalContent,
    openModal,
    closeModal,
  } = useAuth();
  const [, setLoading] = useState<boolean>(false);
  const [cuadreFacturacion, setCuadreFacturacion] = useState<ICuadreFacturacion[]>([]);
  console.log(selectedRow)

  useEffect(() => {
    const traerCuadres = async () => {
      try {
        setLoading(true);
        const request = await axios.get(
          `${config.apiUrl}/cuadrefacturacion/${selectedRow.id}`
        );

        if (request.status === 200) {
          console.log(request.data?.cuadreFacturacion);
          setCuadreFacturacion(request.data?.cuadreFacturacion);
          setLoading(false);
        }
      } catch (error: any) {
        console.log(error);
        setLoading(false);
      }
    };

    traerCuadres();
  }, [selectedRow]);


  const handleEditCuadre = (item: ICuadreFacturacion) => {
    closeModal();
    setTimeout(() => {
      setModalContent(<EditarCuadreFacturacion rowCuadre={item} />);
      openModal();
    }, 250);
  };


  return (
    <div className="w-full">
      <h2 className="mb-12 text-3xl font-medium text-center font_kanit text-secondary-main">
        Selecciona un cuadre para editarlo
      </h2>
      <div className="grid w-full gap-5 lg:grid-cols-1">
        <div className="w-full">
          <h2 className="mb-3 text-lg font-bold text-center text-secondary-main">
            Cuadre Facturaciones
          </h2>
          <div className="grid w-full grid-cols-12 border rounded-main bg-secondary-main text-white-main border-secondary-main">
            <p className="px-4 py-2 font-semibold text-left truncate">Fecha</p>
            <p className="px-4 py-2 font-semibold text-left truncate">Doc.</p>
            <p className="px-4 py-2 font-semibold text-left truncate">Numero</p>
            <p className="px-4 py-2 font-semibold text-left truncate">Cliente</p>
            <p className="px-4 py-2 font-semibold text-left truncate">RUC</p>
            <p className="px-4 py-2 font-semibold text-left truncate">Subtotal</p>
            <p className="px-4 py-2 font-semibold text-left truncate">IGV</p>
            <p className="px-4 py-2 font-semibold text-left truncate">Total</p>
            <p className="px-4 py-2 font-semibold text-left truncate">M</p>
            <p className="px-4 py-2 font-semibold text-left truncate">Dif. F</p>
            <p className="px-4 py-2 font-semibold text-left truncate">Dif. M</p>
            <p className="px-4 py-2 font-semibold text-left truncate">Dif. D</p>
          </div>

          {cuadreFacturacion !== null &&

            cuadreFacturacion &&

            cuadreFacturacion?.map((item: ICuadreFacturacion) => (
              <div
                className="grid w-full grid-cols-12 border-l border-r cursor-pointer hover:bg-white-200 rounded-b-main gap-y-1 text-black-900"
                key={`EditarCuadreRegistradosDolares${item.id}`}
                onClick={() => {
                  handleEditCuadre(item);
                }}
              >
                <p className="px-4 py-3 text-gray-700 border-b truncate">
                  {item.fechaCuadre}
                </p>
                <p className="px-4 py-3 text-gray-700 border-b truncate">
                  {item.docCuadre}
                </p>
                <p className="px-4 py-3 text-gray-700 border-b truncate">
                  {item.clienteCuadre}
                </p>
                <p className="px-4 py-3 text-gray-700 border-b truncate">
                  {item.rucCuadre}
                </p>
                <p className="px-4 py-3 text-gray-700 border-b truncate">
                  {item.rucCuadre}
                </p>
                <p className="px-4 py-3 text-gray-700 border-b truncate">
                  {item.subtotalCuadre}
                </p>
                <p className="px-4 py-3 text-gray-700 border-b truncate">
                  {item.igvCuadre}
                </p>
                <p className="px-4 py-3 text-gray-700 border-b truncate">
                  {item.totalCuadre}
                </p>
                <p className="px-4 py-3 text-gray-700 border-b truncate">
                  M
                </p>
                <p className="px-4 py-3 text-gray-700 border-b truncate">
                  {item.difFecha}
                </p>
                <p className="px-4 py-3 text-gray-700 border-b truncate">
                  {item.difMonto}
                </p>
                <p className="px-4 py-3 text-gray-700 border-b truncate">
                  {item.difDocumento}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
