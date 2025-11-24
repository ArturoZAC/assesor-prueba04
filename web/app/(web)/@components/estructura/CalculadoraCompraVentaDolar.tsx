'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { NumericFormat } from "react-number-format"; // Importación de react-number-format

export default function CalculadoraCompraVentaDolar({
  precios,
}: {
  precios: any;
}) {
  const [value, setValue] = useState(""); // Valor de la entrada de USD
  const [resultado, setResultado] = useState(""); // Resultado en SOL
  const [tasaCompra] = useState(Number(precios.precioCompra));
  const [tasaVenta] = useState(Number(precios.precioVenta));
  const [operacion, setOperacion] = useState("compra");

  useEffect(() => {
    if (value !== "") {
      // Solo hacer la conversión si el valor no es vacío
      const tasa = operacion === "compra" ? tasaCompra : tasaVenta;
      const conversion = (Number(value) * tasa).toFixed(2);
      setResultado(conversion); // Guardamos el valor sin formatear
    } else {
      setResultado(""); // Si el valor está vacío, no mostrar ningún resultado
    }
  }, [value, operacion, tasaCompra, tasaVenta]);

  return (
    <div className="flex flex-col items-center max-w-[460px] px-12 py-12 mx-auto bg-white border border-gray-300 rounded-main shadow-lg bg-gray-200/40">
      <div className="relative z-10 flex w-full mb-8 overflow-hidden text-center bg-white-main rounded-main">
        <span
          className={`absolute top-0 ${
            operacion === "compra" ? "left-0" : "left-1/2"
          } block w-1/2 h-full bg-gradient-to-b from-primary-main to-primary-800 -z-10 transition-all duration-200`}
        ></span>
        <button
          onClick={() => setOperacion("compra")}
          className={`px-6 py-2 flex items-center justify-center flex-col w-1/2 ${
            operacion === "compra"
              ? " text-white-main "
              : " text-secondary-main"
          } transition delay-75 font-bold`}
        >
          COMPRA
          <span className="block text-sm">{tasaCompra.toFixed(6).slice(0, 5)}</span>
        </button>
        <button
          onClick={() => setOperacion("venta")}
          className={`px-6 py-2 flex items-center justify-center flex-col w-1/2 ${
            operacion === "venta" ? " text-white-main " : " text-secondary-main"
          } transition delay-75 font-bold`}
        >
          VENTA
          <span className="block text-sm">{tasaVenta.toFixed(6).slice(0, 5)}</span>
        </button>
      </div>

      <div className="w-full">
        <div className="flex w-full gap-1 mb-2">
          <div className="flex w-full">
            <div className="flex items-center justify-center w-1/5 py-2 font-bold text-center rounded-l-lg text-white-main bg-gradient-to-b from-secondary-700 to-secondary-main">
              USD
            </div>
            <NumericFormat
              className="w-4/5 p-2 text-center border border-gray-300 rounded-r-lg outline-none"
              value={value}
              min={0}
              decimalSeparator="."
              thousandSeparator=","
              decimalScale={2}
              fixedDecimalScale

              onValueChange={(values) => setValue(values.value)} // Actualiza el valor en tiempo real
              placeholder="Monto USD"
            />
          </div>
        </div>

        <div className="flex w-full gap-2">
          <div className="flex w-full">
            <div className="flex items-center justify-center w-1/5 py-2 font-bold text-center rounded-l-lg text-white-main bg-gradient-to-b from-primary-main to-primary-800">
              SOL
            </div>
            <div className="w-4/5 p-2 text-center bg-gray-100 border border-gray-300 rounded-r-lg">
              <NumericFormat
                value={resultado}
                min={0}
                className="text-center bg-gray-100 outline-none"
                decimalSeparator="."
                thousandSeparator=","
                prefix="S/. "
                decimalScale={2}
                fixedDecimalScale
                placeholder="S/. 0.00"
              />
            </div>
          </div>
        </div>
      </div>

      <a
        href={`https://wa.me/+51922883878?text=${encodeURIComponent(
          `Hola, quiero registrar una ${operacion} de ${value} USD.`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-full px-4 py-2 mt-4 transition-all duration-200 rounded-main text-white-main bg-secondary-main hover:bg-amarrillo-main hover:text-secondary-main"
      >
        Solicitar Operación
      </a>
    </div>
  );
}
