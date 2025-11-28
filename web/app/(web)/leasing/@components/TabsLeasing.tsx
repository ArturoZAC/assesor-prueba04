/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import {
  Server,
  Laptop,
  Car,
  Heater,
  CheckCircle,
  Briefcase,
  FileText,
  Clock,
  CreditCard,
  BarChart,
} from "lucide-react";
type LeasingType = "financial" | "operational";
interface EquipmentType {
  name: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
}
import { BsTruckFlatbed } from "react-icons/bs";
import AnimatedWrapper, {
  AnimationType,
} from "../../@components/animacion/Animacion";
interface LeasingFeature {
  title: string;
  description: string;
  icon: React.ReactNode;
}
export const TabsLeasing = () => {
  const [activeTab, setActiveTab] = useState<LeasingType>("financial");
  const [hoverEquipment, setHoverEquipment] = useState<number | null>(null);

  const features: LeasingFeature[] = [
    {
      title: "Evaluación rápida",
      description:
        "Evaluación rápida del equipamiento que se desea adquirir para agilizar el proceso.",
      icon: (
        <Clock className="w-8 h-8 text-secondary-main group-hover:text-white-main" />
      ),
    },
    {
      title: "Periodos flexibles",
      description:
        "Periodos establecidos con el cliente de acuerdo a sus requerimientos y disponibilidad de liquidez.",
      icon: (
        <FileText className="w-8 h-8 text-secondary-main group-hover:text-white-main" />
      ),
    },
    {
      title: "Opción de compra",
      description:
        "Opción de compra al final del contrato a fin de que el cliente se haga dueño del bien.",
      icon: (
        <Briefcase className="w-8 h-8 text-secondary-main group-hover:text-white-main" />
      ),
    },
    {
      title: "Condiciones a medida",
      description:
        "Tasas, condiciones y procesos simplificados y a la medida del requerimiento del cliente.",
      icon: (
        <CreditCard className="w-8 h-8 text-secondary-main group-hover:text-white-main" />
      ),
    },
    {
      title: "Beneficios tributarios",
      description:
        "Genera beneficios tributarios por el escudo fiscal que genera el hecho de ser parte del gasto.",
      icon: (
        <BarChart className="w-8 h-8 text-secondary-main group-hover:text-white-main" />
      ),
    },
  ];

  const equipmentTypes: EquipmentType[] = [
    { name: "Computadoras", icon: <Laptop className="w-10 h-10 " /> },
    { name: "Servidores", icon: <Server className="w-10 h-10 " /> },
    { name: "Maquinarias", icon: <Heater className="w-10 h-10 " /> },
    {
      name: "Vehículos",
      icon: <Car className="w-10 h-10 " />,
      comingSoon: true,
    },
    {
      name: "Maquinaria pesada",
      icon: <BsTruckFlatbed className="w-10 h-10 " />,
      comingSoon: true,
    },
  ];

  const leasingTypes = {
    financial: {
      title: "Leasing Financiero",
      description:
        "Es un contrato de alquiler-venta mediante el cual el cliente utiliza el bien por un determinado tiempo y al final del plazo del alquiler se le da la opción de compra del bien.",
      benefits: [
        "Adquisición del bien al término del contrato.",
        "Pagos fijos y predecibles durante la vigencia del contrato.",
        "Especialmente útil para equipos que se desean mantener a largo plazo.",
      ],
    },
    operational: {
      title: "Leasing Operativo",
      description:
        "Es un contrato de alquiler que no tiene opción de compra; sin embargo, tiene el beneficio del soporte técnico que tienen los activos alquilados. En caso de avería o falla, el cliente puede solicitar el arreglo del problema o el cambio del bien si es necesario.",
      benefits: [
        "Mantenimiento y asistencia técnica incluidos.",
        "Renovación constante de tecnología.",
        "Reducción de costos para equipos con rápida obsolescencia.",
      ],
    },
  };
  return (
    <>
      {/* Leasing Type Tabs - Improved */}
      <div className="flex flex-col items-center justify-center max-w-xl gap-5 mx-auto mb-16 lg:gap-20 overflow-x-clip md:flex-row">
        <AnimatedWrapper
          animationType={AnimationType.Scale}
          delay={0}
          duration={0.3}
        >
          <button
            className={`px-4 py-3 rounded-main font-medium transition-all duration-300 ${
              activeTab === "financial"
                ? "bg-primary-main text-white-main shadow-lg sm:scale-105 md:scale-110"
                : "bg-white-main text-primary-main hover:bg-secondary-100 shadow"
            }`}
            onClick={() => setActiveTab("financial")}
          >
            Leasing Financiero
          </button>
        </AnimatedWrapper>
        <AnimatedWrapper
          animationType={AnimationType.Scale}
          delay={0.2}
          duration={0.3}
        >
          <button
            className={`px-8 py-4 rounded-xl font-medium transition-all duration-300 ${
              activeTab === "operational"
                ? "bg-primary-main text-white-main shadow-lg sm:scale-105 md:scale-110"
                : "bg-white-main text-primary-main hover:bg-secondary-100 shadow"
            }`}
            onClick={() => setActiveTab("operational")}
          >
            Leasing Operativo
          </button>
        </AnimatedWrapper>
      </div>

      {/* Leasing Information - Card with more details */}
      <div className="relative z-10 p-8 mb-16 transition-all duration-500 transform border border-l-4 shadow-xl bg-white-main border-primary-main rounded-2xl md:p-10 hover:shadow-2xl">
        <img
          src="/images/logo/favicon.ico"
          alt=""
          className="block absolute left-10  object-contain mx-auto bottom-0 -z-10  opacity-15 w-[230px]"
        />
        <div className="grid gap-8 md:grid-cols-3 overflow-x-clip">
          <div className="md:col-span-2">
            <AnimatedWrapper
              animationType={AnimationType.SlideLeft}
              delay={0}
              duration={0.3}
            >
              <h3 className="mb-3 text-2xl font-bold text-secondary-main font_kanit">
                {leasingTypes[activeTab].title}
              </h3>
            </AnimatedWrapper>
            <AnimatedWrapper
              animationType={AnimationType.SlideLeft}
              delay={0.2}
              duration={0.3}
            >
              <p className="mb-6 leading-relaxed text-black-900 min-h-[87px]">
                {leasingTypes[activeTab].description}
              </p>
            </AnimatedWrapper>
            <AnimatedWrapper
              animationType={AnimationType.SlideLeft}
              delay={0.3}
              duration={0.3}
            >
              <h4 className="mb-3 text-lg font-semibold text-secondary-900">
                Principales beneficios:
              </h4>
              <ul className="space-y-2">
                {leasingTypes[activeTab].benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="flex-shrink-0 w-5 h-5 mt-1 mr-2 text-secondary-main" />
                    <span className="text-black-900">{benefit}</span>
                  </li>
                ))}
              </ul>
            </AnimatedWrapper>
          </div>

          <div className="flex items-center justify-center rounded-main">
            <div className="text-center">
              <AnimatedWrapper
                animationType={AnimationType.Scale}
                delay={0.3}
                duration={0.3}
              >
                <div className="inline-block rounded-full ">
                  {activeTab === "financial" ? (
                    <>
                      <img
                        src="/images/nosotros/leasing2.webp"
                        alt=""
                        className="block rounded-main"
                      />
                    </>
                  ) : (
                    <img
                      src="/images/nosotros/leasing1.webp"
                      alt=""
                      className="block rounded-main"
                    />
                  )}
                </div>
              </AnimatedWrapper>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Types - Enhanced Grid */}
      <div className="relative z-10 p-12 mb-16 bg-secondary-main rounded-main">
        <div className="absolute top-0 left-0 flex items-start justify-between w-full h-full -z-10">
            <img src="/images/logo/dolar.png" alt="" className="block opacity-20 object-contain ml-10 w-[120px]"/>
            <img src="/images/logo/dolar.png" alt="" className="block opacity-20 object-contain mr-10 mt-20 w-[120px]"/>

        </div>
        <h3 className="mb-8 text-3xl font-bold text-center text-white-main font_kanit">
          Financiamos todo tipo de equipamiento
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
          {equipmentTypes.map((item, index) => (
            <AnimatedWrapper
              key={index}
              animationType={AnimationType.Scale}
              delay={index * 0.2}
              duration={0.3}
            >
              <div
                key={index}
                className={`bg-white-main rounded-xl flex flex-col justify-center px-6 py-2 text-center transition-all duration-300 ${
                  hoverEquipment === index
                    ? "shadow-lg transform -translate-y-2"
                    : "shadow"
                } ${
                  item.comingSoon
                    ? "bg-gradient-to-br from-white to-blue-50"
                    : "hover:shadow-lg hover:-translate-y-2"
                }`}
                onMouseEnter={() => setHoverEquipment(index)}
                onMouseLeave={() => setHoverEquipment(null)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`${
                      item.comingSoon
                        ? "text-secondary-800"
                        : "text-primary-main"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <p
                    className={`font-medium ${
                      item.comingSoon
                        ? "text-secondary-800"
                        : "text-primary-main"
                    }`}
                  >
                    {item.name}
                  </p>
                </div>
                {item.comingSoon && (
                  <span className="inline-block px-2 py-1 mt-2 text-xs rounded-full text-secondary-700 bg-secondary-100">
                    Próximamente
                  </span>
                )}
              </div>
            </AnimatedWrapper>
          ))}
        </div>
      </div>

      {/* Features - Improved cards */}
      <h3 className="mb-8 text-3xl font-bold text-center text-secondary-main font_kanit">
        Características y Beneficios
      </h3>

      <div className="grid gap-8 mb-16 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <AnimatedWrapper
            key={index}
            animationType={AnimationType.FadeScale}
            delay={index * 0.2}
            className="h-full"
            duration={0.3}
          >
            <div className="h-full p-6 transition-all duration-300 border border-l-4 shadow-md border-secondary-main bg-white-main group rounded-xl hover:shadow-xl hover:-translate-y-1 hover:border-secondary-600">
              <div className="inline-block p-3 mb-4 transition-colors duration-300 rounded-lg text-secondary-main bg-secondary-100 group-hover:bg-secondary-main">
                {feature.icon}
              </div>
              <h4 className="mb-3 text-xl font-semibold text-secondary-main">
                {feature.title}
              </h4>
              <p className="text-black-900">{feature.description}</p>
            </div>
          </AnimatedWrapper>
        ))}
      </div>
    </>
  );
};
