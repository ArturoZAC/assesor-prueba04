"use client";

import React from "react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
// Nota: Normalmente estos imports vendrían de la instalación del paquete
// npm install swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FaUser } from "react-icons/fa";
// Definir interfaz para los testimonios
interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  content: string;
  rating: number;
}

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`w-5 h-5 ${
            index < rating ? "text-amarrillo-main" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

export const SwiperTestimonios = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Daisy Guzmán",
      role: "Propietaria Agencia de Viajes",
      company: "TechSolutions Inc.",
      image: "/api/placeholder/100/100",
      content:
        "Cambiar dólares con ASSESSOR es fácil, cómodo y seguro; además me ofrecen unas tasas de cambio muy convenientes y ya no necesito recurrir a la calle a buscar la mejor opción para mi dinero. Estoy muy contenta de trabajar con ellos y lo recomiendo totalmente.",
      rating: 5,
    },
    {
      id: 2,
      name: "Gianpierre Terry",
      role: "Gerente Financiero",
      company: "Innovate Systems",
      image: "/api/placeholder/100/100",
      content:
        "Es una gran cosa poder contar con los servicios de ASSESSOR, me ofrecen siempre un servicio rápido, seguro y con la mejor tasa del mercado. Los felicito y los animo a que sigan creciendo por esta línea de los servicios financieros porque el mercado nacional los requiere.",
      rating: 4,
    },
    {
      id: 3,
      name: "Manuel Galdoz",
      role: "Emprendedor",
      company: "GrowthPartners",
      image: "/api/placeholder/100/100",
      content:
        "Cambio constantemente con ASSESSOR para pagar mis cuentas y realizar diversas transacciones de mi empresa. Desde que empecé a trabajar con ellos, me han aliviado bastante la labor de buscar las mejores condiciones para cambiar mi dinero y ahora me puedo enfocar en el crecimiento de mi negocio.",
      rating: 5,
    },
  ];
  return (
    <div className="swiper-container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        loop
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        breakpoints={{
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        className="pb-12"
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.id}>
            <div className="flex flex-col h-full p-6 shadow-lg rounded-main bg-white-main">
              <div className="flex items-center mb-4">
                <span className="flex items-center justify-center object-cover w-12 h-12 mr-4 text-2xl border-2 rounded-full border-primary-main text-white-main bg-primary-main">
                  <FaUser />
                </span>
                <div>
                  <h4 className="text-lg font-semibold text-secondary-main">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-black-700">{testimonial.role}</p>
                </div>
              </div>
              <div className="mb-4">
                <RatingStars rating={testimonial.rating} />
              </div>
              <p className="flex-grow text-black-900">{testimonial.content}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
