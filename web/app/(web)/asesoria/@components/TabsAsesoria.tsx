"use client";
import React, { useState } from "react";

export const TabsAsesoria = () => {
  const colors = {
    primary: "#cb4325",
    secondary: "#00387c",
    accent: "#ffc107",
  };
  const [activeTab, setActiveTab] = useState("controlInterno");
  const tabs = [
    { id: "controlInterno", name: "Control Interno" },
    { id: "planificacion", name: "Planificación Financiera" },
    { id: "riesgos", name: "Análisis de Riesgos" },
    { id: "decisiones", name: "Toma de Decisiones" },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`px-4 py-2 rounded-main font-medium transition-colors ${
              activeTab === tab.id
                ? "text-white-main"
                : "text-gray-900 bg-black-50 hover:bg-gray-100"
            }`}
            style={
              activeTab === tab.id ? { backgroundColor: colors.secondary } : {}
            }
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div className="p-8 bg-white border border-l-4 shadow-md rounded-main border-secondary-main">
        {activeTab === "controlInterno" && (
          <div>
            <h3
              className="mb-4 text-2xl font-bold"
              style={{ color: colors.secondary }}
            >
              Control Interno
            </h3>
            <div
              className="w-12 h-1 mb-6"
              style={{ backgroundColor: colors.accent }}
            ></div>
            <p className="text-gray-700">
              El control interno en la empresa es un componente clave para
              garantizar la transparencia, eficiencia y seguridad en sus
              operaciones financieras y administrativas. Se enfoca en la
              protección de activos, el cumplimiento normativo y la prevención y
              minimización de los riesgos operativos y financiera.
            </p>
            <div className="flex justify-end mt-6">
              <a
                href="https://api.whatsapp.com/send?phone=51922883878&text=Hola!%20Estoy%20interesado%20en%20sus%20servicios"
                target="_blank"
                className="px-6 py-2 font-medium text-white-main rounded-main"
                style={{ backgroundColor: colors.primary }}
              >
                Solicitar Asesoría
              </a>
            </div>
          </div>
        )}

        {activeTab === "planificacion" && (
          <div>
            <h3
              className="mb-4 text-2xl font-bold"
              style={{ color: colors.secondary }}
            >
              Planificación Financiera
            </h3>
            <div
              className="w-12 h-1 mb-6"
              style={{ backgroundColor: colors.accent }}
            ></div>
            <p className="text-gray-700">
              La planificación financiera en la empresa es un proceso clave para
              garantizar la estabilidad y crecimiento sostenible de la empresa.
              Abarca la proyección de ingresos y egresos, la optimización del
              capital y la toma de decisiones estratégicas alineadas con los
              objetivos organizacionales, lo que permite establecer estrategias
              a corto, mediano y largo plazo.
            </p>
            <div className="flex justify-end mt-6">
              <a
                href="https://api.whatsapp.com/send?phone=51922883878&text=Hola!%20Estoy%20interesado%20en%20sus%20servicios"
                target="_blank"
                className="px-6 py-2 font-medium text-white-main rounded-main"
                style={{ backgroundColor: colors.primary }}
              >
                Solicitar Asesoría
              </a>
            </div>
          </div>
        )}

        {activeTab === "riesgos" && (
          <div>
            <h3
              className="mb-4 text-2xl font-bold"
              style={{ color: colors.secondary }}
            >
              Análisis de Riesgos e Inversiones
            </h3>
            <div
              className="w-12 h-1 mb-6"
              style={{ backgroundColor: colors.accent }}
            ></div>
            <p className="text-gray-700">
              La operativa en muchos sectores de la economía nacional es
              altamente volátil y presenta riesgos específicos que la empresa
              debe gestionar antes de realizar cualquier inversión. El análisis
              de riesgos de inversión se enfoca en identificar, evaluar y
              mitigar los factores que puedan afectar la rentabilidad y
              sostenibilidad de las inversiones.
            </p>
            <div className="flex justify-end mt-6">
              <a
                href="https://api.whatsapp.com/send?phone=51922883878&text=Hola!%20Estoy%20interesado%20en%20sus%20servicios"
                target="_blank"
                className="px-6 py-2 font-medium text-white-main rounded-main"
                style={{ backgroundColor: colors.primary }}
              >
                Solicitar Asesoría
              </a>
            </div>
          </div>
        )}

        {activeTab === "decisiones" && (
          <div>
            <h3
              className="mb-4 text-2xl font-bold"
              style={{ color: colors.secondary }}
            >
              Toma de Decisiones Financieras
            </h3>
            <div
              className="w-12 h-1 mb-6"
              style={{ backgroundColor: colors.accent }}
            ></div>
            <p className="text-gray-700">
              Las decisiones financieras en la empresa deben estar alineadas con
              los objetivos estratégicos y el contexto del sector en el que
              participa la empresa, de esta manera se busca lograr una toma de
              decisiones efectiva y coherente con los objetivos estratégicos
              trazados.
            </p>
            <div className="flex justify-end mt-6">
              <a
                href="https://api.whatsapp.com/send?phone=51922883878&text=Hola!%20Estoy%20interesado%20en%20sus%20servicios"
                target="_blank"
                className="px-6 py-2 font-medium text-white-main rounded-main"
                style={{ backgroundColor: colors.primary }}
              >
                Solicitar Asesoría
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
