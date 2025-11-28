
'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { config } from '@/config/config';
import { useAuth } from '@/context/useAuthContext';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { PrestamoAnulado } from '../types/TypeDataPrestamoAPI';
import EditarPrestamo from './EditarPrestamo';

export default function VerPrestamos() {
  const {
    selectedRow,
    // setSelectedRow,
    setModalContent,
    openModal,
    closeModal,
  } = useAuth();
  const [prestamosAnulados, setPrestamosAnulados] = useState<PrestamoAnulado[]>();
  const [, setLoading] = useState<boolean>(false)

  console.log(selectedRow)
  useEffect(() => {
    const traerCuadres = async () => {
      try {
        setLoading(true);
        const request = await axios.get(
          `${config.apiUrl}/prestamos/prestamos-anulados/${selectedRow.id}`,
          {
            withCredentials: true,
          }
        );

        if (request.status === 200) {
          console.log(request.data);
          setPrestamosAnulados(request.data);
          setLoading(false);
        }
      } catch (error: any) {
        console.log(error);
        setLoading(false);
      }
    };

    traerCuadres();
  }, [selectedRow]);

  const handleEditCuadre = () => {
    closeModal();
    setTimeout(() => {
      setModalContent(<EditarPrestamo />);
      openModal();
    }, 250);
  };

  return (
    <div className="w-full">
      <h2 className="mb-12 text-3xl font-medium text-center font_kanit text-secondary-main">
        Selecciona un código de boleta o factura
      </h2>
      <div className="grid w-full gap-5 lg:grid-cols-2">
        <div className="w-full">
          <h2 className="mb-3 text-lg font-bold text-center text-secondary-main">
            Prestamo
          </h2>
          <div className="grid w-full grid-cols-2 border rounded-main bg-secondary-main text-white-main border-secondary-main">
            <p className="px-4 py-2 font-semibold text-left truncate">Codigo Factura/Boleta</p>
            <p className="px-4 py-2 font-semibold text-left truncate">Estado</p>
          </div>
          <div
            className="grid w-full grid-cols-2 border-l border-r cursor-pointer hover:bg-white-200 rounded-b-main gap-y-1 text-black-900"
            key={`EditarCuadreRegistradosDolares${selectedRow.id}`}
            onClick={() => {
              handleEditCuadre();
            }}
          >
            <p className="px-4 py-3 text-gray-700 truncate border-b">
              {selectedRow.codigoFacturaBoleta ? selectedRow.codigoFacturaBoleta : 'NO HAY CODIGO'}
            </p>
            <p className="px-4 py-3 text-gray-700 truncate border-b">
              {selectedRow.factura ?? '-'}
            </p>

          </div>
        </div>
        <div className="w-full">
          <h2 className="mb-3 text-lg font-bold text-center text-secondary-main">
            Prestamos Tipo Anulados o Nota de Crédito
          </h2>
          <div className="grid w-full grid-cols-2 border bg-secondary-main text-white-main rounded-main border-secondary-main">
            <p className="px-4 py-2 font-semibold text-left truncate">Codigo Factura/Boleta</p>
            <p className="px-4 py-2 font-semibold text-left truncate">Estado</p>
          </div>
          {/* @ts-ignore */}
          {prestamosAnulados !== null &&
            //@ts-ignore
            prestamosAnulados?.map((item: PrestamoAnulado) => (
              <div
                className="grid w-full grid-cols-2 border-l border-r cursor-pointer hover:bg-white-200 rounded-b-main gap-y-1 text-black-900"
                key={`EditarCuadreRegistradosSoles${item.id}`}
              >

                <p className="px-4 py-3 text-gray-700 truncate border-b">
                  {item.codigoFacturaBoleta}
                </p>
                <p className="px-4 py-3 text-gray-700 truncate border-b">
                  {item.factura}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
