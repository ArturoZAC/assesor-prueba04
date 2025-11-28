/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { motion } from "framer-motion";

export interface Valor {
  imagen: string;
  titulo: string;
  descripcion: string;
}

// Función para generar un valor aleatorio dentro de un rango
const getRandomFloat = (min: number, max: number) =>
  (Math.random() * (max - min) + min).toFixed(2);

export const CardValores = ({
  valor,
  index,
}: {
  valor: Valor;
  index: number;
}) => {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="transition duration-300 bg-white/20 rounded-3xl backdrop-blur-lg hover:bg-white/30 hover:scale-105"
    >
      <motion.div
        className="flex justify-center p-5 mx-auto mb-6 rounded-full w-[220px] h-[220px] shadow-main bg-white-main"
        animate={{
          x: [
            `${getRandomFloat(-10, 10)}%`,
            `${getRandomFloat(-10, 10)}%`,
            `${getRandomFloat(-10, 10)}%`,
          ],
          y: [
            `${getRandomFloat(-10, 10)}%`,
            `${getRandomFloat(-10, 10)}%`,
            `${getRandomFloat(-10, 10)}%`,
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      >
        <img src={valor.imagen} alt="" className="block w-full mx-auto" />
      </motion.div>
      <h3 className="mb-3 text-xl font-bold text-center font_kanit text-secondary-main">
        {valor.titulo}
      </h3>
      <p className="font-light text-center">{valor.descripcion}</p>
    </motion.div>
  );
};
