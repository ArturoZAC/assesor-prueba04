/* eslint-disable @next/next/no-img-element */
import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { ContentMain } from "./ContentMain";
import { IoChevronForward } from "react-icons/io5";
import Link from "next/link";
export const Footer = () => {
  return (
    <footer className="text-gray-300 bg-secondary-main">
      <ContentMain className="py-12 ">
        <div className="flex flex-col items-center justify-between lg:flex-row">
          {/* Logo y Redes Sociales */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="mb-4">
              <img
                src="/images/logo/logo_white.png"
                alt=""
                className="block w-80"
              />
            </div>
            <div className="flex mt-2 space-x-4">
              <a href="https://www.facebook.com/assessorperu#" target="_blank">
                <FaFacebook className="text-2xl transition text-amarrillo-main hover:text-yellow-500" />
              </a>
              <a
                href="https://www.instagram.com/assessorperu/?hl=es"
                target="_blank"
              >
                <FaInstagram className="text-2xl transition text-amarrillo-main hover:text-yellow-500" />
              </a>
              <a
                href="https://www.linkedin.com/company/assessorsac/"
                target="_blank"
              >
                <FaLinkedin className="text-2xl transition text-amarrillo-main hover:text-yellow-500" />
              </a>
            </div>
          </div>

          {/* Soporte */}
          <div className="mt-8 lg:mt-0">
            <h4 className="mb-2 text-lg font-bold text-white-main font_kanit">
              SOPORTE
            </h4>
            <hr className="w-10 mb-2 border-yellow-400" />
            <ul className="space-y-2">
              <li className="flex items-center gap-1">
                <IoChevronForward className="text-xl text-amarrillo-main" />{" "}
                <Link
                  href="/ayuda"
                  className="transition-all duration-200 text-white-200 hover:text-white-main"
                >
                  Preguntas Frecuentes
                </Link>
              </li>
              <li className="flex items-center gap-1">
                <IoChevronForward className="text-xl text-amarrillo-main" />{" "}
                <Link
                  href="/terminos-y-condiciones"
                  className="transition-all duration-200 text-white-200 hover:text-white-main"
                >
                  Términos y Condiciones de Uso
                </Link>
              </li>
              <li className="flex items-center gap-1">
                <IoChevronForward className="text-xl text-amarrillo-main" />{" "}
                <Link
                  href="/politicas-de-privacidad"
                  className="transition-all duration-200 text-white-200 hover:text-white-main"
                >
                  Políticas de Privacidad
                </Link>
              </li>
              <li className="flex items-center gap-1">
                <IoChevronForward className="text-xl text-amarrillo-main" />{" "}
                <Link
                  href="/libro-de-reclamaciones"
                  className="transition-all duration-200 text-white-200 hover:text-white-main"
                >
                  Libro de Reclamaciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="mt-8 lg:mt-0">
            <h4 className="mb-2 text-lg font-bold text-white-main font_kanit">
              CONTACTO
            </h4>
            <hr className="w-10 mb-2 border-yellow-400" />
            <ul className="space-y-2">
              <li className="flex items-center gap-1">
                <IoChevronForward className="text-xl text-amarrillo-main" />{" "}
                contacto@assessorperu.com
              </li>
              <li className="flex items-center gap-1">
                <IoChevronForward className="text-xl text-amarrillo-main" />{" "}
                (+51) 922 883 878
              </li>
              <li className="flex items-center gap-1">
                <IoChevronForward className="text-xl text-amarrillo-main" /> Jr.
                Morro Solar 420. Int-201. Chacarilla. Surco
              </li>
              <li className="flex items-center gap-1">
                <IoChevronForward className="text-xl text-amarrillo-main" /> L -
                V: 8:30am - 6:00pm / S: 9:00am - 1:00pm
              </li>
            </ul>
          </div>
        </div>
      </ContentMain>
      <div className="flex flex-col items-center justify-center py-4 mt-12 text-center border-t md:flex-row border-secondary-800/30 text-white-100">
        © 2025 <span className="text-amarrillo-main"> ASSESSOR</span> - Todos
        los derechos reservados -{" "}
        <p className="flex items-center gap-2">
          {" "}
          Design by:{" "}
          <a href="https://logosperu.com.pe/" target="_blank" className="">
            <img src="/images/logo/lp.svg" alt="" className="w-[18px] block" />
          </a>
        </p>
      </div>
    </footer>
  );
};
