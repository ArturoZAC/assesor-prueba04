/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ContentMain } from "../estructura/ContentMain";
import CalculadoraCompraVentaDolar from "../estructura/CalculadoraCompraVentaDolar";

import AnimatedWrapper, { AnimationType } from "../animacion/Animacion";

type TitlePart = {
  text: string;
  color?: string;
};

type Slide = {
  id: number;
  image: string;
  title: TitlePart[];
  subtitle: string;
};
const slides: Slide[] = [
  {
    id: 1,
    image: "/images/slides/slide1.webp",
    title: [
      { text: "Impulsamos tu economía con ", color: "text-white-main" },
      { text: "transacciones rápidas y seguras", color: "text-primary-main" },
    ],
    subtitle:
      "Somos una fintech peruana que impulsa beneficios económicos concretos con soluciones rápidas y justas.",
  },
  {
    id: 2,
    image: "/images/slides/slide2.webp",
    title: [
      { text: "Finanzas inteligentes para ", color: "text-white-main" },
      { text: "un futuro sólido ", color: "text-primary-main" },
    ],
    subtitle:
      "Optimizamos tus finanzas con procesos justos y eficientes, pensados para el sistema nacional.",
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    scale: 1.2,
    x: direction > 0 ? 100 : -100,
  }),
  center: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
  exit: (direction: number) => ({
    opacity: 0,
    scale: 0.8,
    x: direction > 0 ? -100 : 100,
    transition: { duration: 0.8, ease: "easeIn" },
  }),
};

const MainSlider = ({ precios }: { precios: any }) => {
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);

  const paginate = (newDirection: number) => {
    setPage(([prevPage]) => {
      let newPage = prevPage + newDirection;
      if (newPage < 0) newPage = slides.length - 1;
      if (newPage >= slides.length) newPage = 0;
      return [newPage, newDirection];
    });
  };

  return (
    <div className="relative slider-container">
      <div className="absolute top-0 left-0 z-20 flex items-center w-full h-full">
        <ContentMain className="flex flex-col gap-5 lg:flex-row ">
          <div className="w-full lg:w-1/2">
            <div className="slide-content">
              <motion.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-3xl font-extrabold text-center font_kanit md:text-left md:text-3xl lg:text-5xl text-white-main"
              >
                {slides[page].title.map((part, index) => (
                  <span key={index} className={part.color}>
                    {part.text}
                  </span>
                ))}
              </motion.h1>
              <motion.p
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="hidden mt-6 text-lg text-left text-white md:block"
              >
                {slides[page].subtitle}
              </motion.p>
              <a
                href="https://api.whatsapp.com/send?phone=51922883878&text=Hola!%20Estoy%20interesado%20en%20sus%20servicios"
                target="_blank"
                className="flex px-6 py-3 mx-auto mt-8 transition-all duration-200 md:mx-0 w-fit font_kanit bg-primary-main hover:bg-amarrillo-main rounded-main text-white-main"
              >
                Contactar ahora
              </a>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <AnimatedWrapper
              animationType={AnimationType.Scale}
              delay={0}
              duration={0.2}
            >
              <CalculadoraCompraVentaDolar precios={precios} />
            </AnimatedWrapper>
          </div>
        </ContentMain>
      </div>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          className="relative z-10 slide before:w-full before:h-full before:absolute before:bg-black-main before:opacity-50 before:top-0 before:left-0 before:-z-10"
          key={slides[page].id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{
            backgroundImage: `url(${slides[page].image})`,
          }}
        ></motion.div>
      </AnimatePresence>
      <div className="controls">
        <button onClick={() => paginate(-1)}>Previo</button>
        <button onClick={() => paginate(1)}>Siguiente</button>
      </div>
    </div>
  );
};

export default MainSlider;
