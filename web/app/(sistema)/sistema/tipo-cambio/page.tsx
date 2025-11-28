"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { config } from "@/config/config";

interface TipoCambio {
  precioCompra: number;
  precioVenta: number;
  moneda: string;
  fecha: string;
}

export default function TipoCambioPage() {
  // const token = localStorage?.getItem("token");

  const [intervaloCompra, setIntervaloCompra] = useState(0.01);
  const [intervaloVenta, setIntervaloVenta] = useState(0.01);
  const [precioCompraAjustado, setPrecioCompraAjustado] = useState(0);
  const [precioVentaAjustado, setPrecioVentaAjustado] = useState(0);

  const [tipoCambio, setTipoCambio] = useState<TipoCambio>({
    precioCompra: 0,
    precioVenta: 0,
    moneda: "USD",
    fecha: "2029-29-09",  
  });

  const traerTipoCambio = async (): Promise<any> => {
    try {
      console.log("Actualizando precio");

      const request = await axios.get(`${config.apiUrl}/traerTipoCambio`/* , {
        headers: {
          Authorization: `Bearer ${token ?? ""}`,
        },
      } */);

      console.log(request.data);

      setTipoCambio({
        precioCompra: Number(request.data.tipoCambio.precioCompra) ?? 0,
        precioVenta: Number(request.data.tipoCambio.precioVenta) ?? 0,
        fecha: request.data.tipoCambio.fecha ?? "",
        moneda: request.data.tipoCambio.moneda ?? "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const traerIntervalosYTipoCambio = async (): Promise<any> => {
      try {
        const request = await axios.get(`${config.apiUrl}/traerIntervalos`/* , {
          headers: {
            Authorization: `Bearer ${token ?? ""}`,
          },
        } */);
        console.log(request.data);

        const { intervalos } = request.data;

        setIntervaloCompra(Number(intervalos.intervaloCompra) ?? 0);
        setIntervaloVenta(Number(intervalos.intervaloVenta) ?? 0);
        setTipoCambio({
          precioCompra: Number(intervalos.ultimoPrecio) ?? 0,
          precioVenta: Number(intervalos.ultimoPrecio) ?? 0,
          fecha: intervalos.updatedAt ?? "",
          moneda: "USD",
        });

        const ultimaActualizacion = new Date(intervalos.updatedAt);
        const fechaActual = new Date();
        const diferenciaTiempo =
          fechaActual.getTime() - ultimaActualizacion.getTime();

        const intervaloInicial =
          diferenciaTiempo < 240000 ? 240000 - diferenciaTiempo : 240000;
        console.log(
          `Tiempo restante hasta la próxima actualización: ${
            intervaloInicial / 1000
          } segundos`
        );

        setTimeout(() => {
          console.log("Primera actualización de tipo de cambio");
          traerTipoCambio();

          setInterval(() => {
            console.log("Actualizando tipo de cambio");
            traerTipoCambio();
          }, 240000);
        }, intervaloInicial);
      } catch (error) {
        console.log(error);
      }
    };

    traerIntervalosYTipoCambio();
  }, []);

  const formatCurrency = (value: number): string => {
    return value.toFixed(5);
  };

  useEffect(() => {
    setPrecioCompraAjustado(tipoCambio.precioCompra - Number(intervaloCompra));
  }, [intervaloCompra, tipoCambio]);

  useEffect(() => {
    setPrecioVentaAjustado(tipoCambio.precioVenta + intervaloVenta);
  }, [intervaloVenta, tipoCambio]);

  const handleActualizarPrecios = async (): Promise<any> => {
    try {
      const request = await axios.put(
        `${config.apiUrl}/actualizarTipoCambio`,
        {
          precioCompra: precioCompraAjustado,
          precioVenta: precioVentaAjustado,
          intervaloCompra,
          intervaloVenta,
        },
        {
          // headers: {
          //   Authorization: `Bearer ${token ?? ""}`,
          // },
        }
      );
      if (request.status === 200) {
        toast.success(request.data.message);
      }
    } catch (error) {
      console.error("Error al actualizar el tipo de cambio:", error);
    }
  };

  return (
    <div className="flex w-full gap-4 pt-4">
      {/* Bloque principal */}
      <div className="w-full p-6 rounded-lg shadow-md lg:w-2/5 bg-primary">
        <div className="flex items-center justify-between w-full">
          <h2 className="mb-4 text-2xl font-bold text-white">
            Tipo de Cambio
          </h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 rounded-lg">
            <div className="space-y-1">
              <p className="text-sm text-black">Moneda</p>
              <p className="text-lg font-medium text-white">
                {tipoCambio.moneda}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-black">Fecha</p>
              <p className="text-lg font-medium text-white">
                {tipoCambio.fecha}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-black">Precio Compra</p>
              <p className="text-lg font-medium text-green-600">
                S/ {formatCurrency(tipoCambio.precioCompra)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-black">Precio Venta</p>
              <p className="text-lg font-medium text-blue-600">
                S/ {formatCurrency(tipoCambio.precioVenta)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bloque de intervalos */}
      <div className="w-full p-6 rounded-lg shadow-md lg:w-1/5 bg-primary">
        <h2 className="mb-4 text-2xl font-bold text-white">Intervalo</h2>

        <div className="w-full py-4 space-y-4">
          <div className="flex w-full gap-2">
            <label className="block text-base min-w-[95px] text-center text-black">
              Intervalo de Venta (S/)
            </label>
            <input
              type="number"
              min={0.0}
              max={9999}
              step={0.001}
              value={intervaloVenta}
              onChange={(e) => setIntervaloVenta(parseFloat(e.target.value))}
              className="block w-full pt-2 pb-2 pl-4 pr-4 mt-2 text-base placeholder-gray-400 transition-all border border-black rounded-md outline-none bg-gray-100"
            />
          </div>

          <div className="flex w-full gap-2">
            <label className="block text-base min-w-[95px] text-center text-black">
              Intervalo de Compra (S/)
            </label>
            <input
              type="number"
              min={0.0}
              max={9999}
              step={0.001}
              value={intervaloCompra}
              onChange={(e) => setIntervaloCompra(parseFloat(e.target.value))}
              className="block w-full pt-2 pb-2 pl-4 pr-4 mt-2 text-base placeholder-gray-400 transition-all border border-black rounded-md outline-none bg-gray-100"
            />
          </div>

          <button
            onClick={() => {
              handleActualizarPrecios();
            }}
            disabled={
              precioCompraAjustado === tipoCambio.precioCompra ||
              precioVentaAjustado === tipoCambio.precioVenta
            }
            className={`w-full px-4 py-2 mt-5 font-medium text-white transition-colors rounded-md bg-primary-main ${
              tipoCambio.precioCompra === precioCompraAjustado ||
              tipoCambio.precioVenta === precioVentaAjustado
                ? "opacity-50"
                : "hover:bg-main_dark"
            }`}
          >
            Aplicar Precios
          </button>
        </div>
      </div>

      {/* Bloque de precios ajustados */}
      <div className="w-full lg:w-2/5">
        <div className="h-full p-4 rounded-lg bg-primary">
          <h2 className="mb-4 text-2xl font-bold text-white">
            Precios Ajustados
          </h2>
          <div className="flex flex-col w-full gap-6">
            <p className="flex items-center justify-between max-w-sm gap-2 text-white">
              Precio Compra Ajustado:{" "}
              <span className="text-3xl font-bold">
                S/ {precioCompraAjustado?.toFixed(5)}
              </span>
            </p>
            <p className="flex items-center justify-between max-w-sm gap-2 text-white">
              Precio Venta Ajustado:{" "}
              <span className="text-3xl font-bold">
                S/ {precioVentaAjustado?.toFixed(5)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
