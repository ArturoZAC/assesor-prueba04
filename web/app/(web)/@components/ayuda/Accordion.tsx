"use client";
import AccordionItem, { FaqItem } from "@/components/AccordionItem";
import React, { useState } from "react";

export const Accordion = ({ mostrar = false }: { mostrar?: boolean }) => {
  const [open, setOpen] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpen(open === index ? null : index);
  };

  const faqData: FaqItem[] = [
    {
      question:
        "¿Cuáles son los requisitos para ser usuario de los servicios de ASSESSOR?",
      answer:
        "Para personas jurídicas se requieren: Ficha RUC, DNI del Representante Legal (anverso y reverso), Correo corporativo del Representante Legal, Poder vigente del Representante Legal. Para Personas naturales solo necesitan enviar el DNI por ambos lados y correo electrónico.",
    },
    {
      question: "¿Por qué necesito entregar los documentos requeridos?",
      answer:
        "ASSESSOR participa de manera formal en el Sistema Financiero Nacional de tal manera que debe cumplir los requisitos que exige la SBS y otros entes gubernamentales para estos efectos, siendo uno de ellos la identificación del cliente para prevenir actos de lavado de activos.",
    },
    {
      question:
        "¿La información proporcionada en el registro de clientes es segura y confidencial?",
      answer:
        "Sí, su información es completamente confidencial y protegida por nuestros sistemas de datos seguros.",
    },
    {
      question: "¿Cómo puedo realizar una operación con ASSESSOR?",
      answer:
        "Contáctanos por nuestro canal de atención oficial vía WhatsApp al 922883878 para recibir las indicaciones e instrucciones personalizadas.",
    },
    {
      question:
        "¿Puedo recibir los fondos de mi operación de cambio en una cuenta mía de otro banco?",
      answer:
        "Sí, podemos hacer operaciones interbancarias sin problemas pero por montos limitados. Te daremos más información de montos y horarios en nuestro canal de atención.",
    },
    {
      question:
        "¿Por qué me piden indicar el origen de los fondos cuando hago operaciones de cambio por montos grandes?",
      answer:
        "Es nuestro deber legal informar el origen de fondos para cumplir con regulaciones anti-lavado según la normativa vigente en el sistema financiero.",
    },
    {
      question:
        "¿Existen montos mínimos y máximos para las operaciones de cambio?",
      answer:
        "Sí, para persona natural el monto mínimo es de 100.00 dólares y para Persona Jurídica es de 500.00 dólares.",
    },
    {
      question:
        "¿Brindan tasas preferenciales cuando realizo operaciones de cambio por montos grandes?",
      answer:
        "Sí. ASSESSOR brinda tasas preferenciales y ajustadas por montos mayores a 10 mil dólares. Consulta en nuestro canal de atención para recibir el tipo de cambio preferencial según el monto a cambiar.",
    },
    {
      question:
        "¿Se tiene un tiempo de vigencia cuando recibo el tipo de cambio solicitado para mi operación de cambio?",
      answer:
        "Sí. El tipo de cambio tiene una vigencia máxima de 10 minutos. En el caso de que este cambie por la volatilidad del mercado se le notificará para poder cerrar la tasa de la operación.",
    },
    {
      question: "¿Existen las transferencias interbancarias inmediatas?",
      answer:
        "Sí, en ASSESSOR ofrecemos transferencias interbancarias inmediatas dependiendo de los montos y de la hora en que se realiza dicha operación.",
    },
    {
      question:
        "¿Existe algún costo de ASSESSOR por las operaciones interbancarias?",
      answer:
        "No. ASSESSOR no cobra ninguna comisión por las operaciones interbancarias; sin embargo, los bancos emisores pueden aplicar sus comisiones dependiendo del tipo de cuenta que se tenga en esa institución.",
    },
    {
      question:
        "¿Qué requisitos necesito para solicitar un préstamo y en cuánto tiempo lo aprueban?",
      answer:
        "Contáctenos por nuestro canal de atención oficial vía WhatsApp al 922883878 para poder evaluar su perfil y enviarle los requisitos específicos.",
    },
    {
      question:
        "¿Cuál es el monto máximo que puedo obtener y qué tasas de interés manejan?",
      answer:
        "El monto y tasa de interés se definen en función de la evaluación personalizada de cada cliente.",
    },
    {
      question:
        "¿Puedo realizar pagos anticipados de mi préstamo para así reducir los intereses por el saldo pendiente?",
      answer:
        "En efecto. ASSESSOR cobra intereses únicamente por los días que mantiene el capital prestado y por el monto pendiente de pago, de tal manera que los pagos anticipados permiten reducir los intereses y hacer más viable el costo del servicio de la deuda.",
    },
    {
      question:
        "¿Qué activos puedo solicitar para los servicios de Leasing de ASSESSOR?",
      answer:
        "Se puede solicitar el arrendamiento de equipamiento para oficina, computadoras, servidores, equipos tecnológicos, entre otros. Prontamente estaremos ampliando la gama de activos hacia vehículos y maquinaria pesada (Línea amarilla).",
    },
    {
      question:
        "¿Qué tipo de asesoría ofrecen para optimizar el área de finanzas de mi empresa?",
      answer:
        "ASSESSOR ofrece asesoría en los siguientes campos: Control Interno, Planificación Financiera, Análisis de Riesgos e Inversiones y Soporte en la Toma de Decisiones.",
    },
  ];
  return (
    <div className="space-y-4">
      {faqData.map((item, index) =>
        mostrar ? (
          <AccordionItem
            key={index}
            question={item.question}
            answer={item.answer}
            index={index}
            open={open}
            toggleAccordion={toggleAccordion}
          />
        ) : (
          index < 4 && (
            <AccordionItem
              key={index}
              question={item.question}
              answer={item.answer}
              index={index}
              open={open}
              toggleAccordion={toggleAccordion}
            />
          )
        )
      )}
    </div>
  );
};
