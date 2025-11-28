// AccordionItem.js
import React from "react";
import { Collapse } from "react-collapse";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface AccordionItemProps {
  question: string;
  answer: string;
  index: number;
  open: number | null;
  toggleAccordion: (index: number) => void;
}

const AccordionItem = ({
  question,
  answer,
  index,
  open,
  toggleAccordion,
}: AccordionItemProps) => {
  return (
    <div className="border-b">
      <button
        className="w-full px-6 py-4 font-bold text-left transition duration-300 ease-in-out border-b rounded-lg rounded-b-none text-secondary-main bg-white-main focus:outline-none"
        onClick={() => toggleAccordion(index)}
      >
        <div className="flex items-center justify-between">
          <span>{question}</span>
          <svg
            className={`w-5 h-5 transform text-secondary-main transition duration-300 ${
              open === index ? "rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>
      <Collapse isOpened={open === index} className="">
        <div
          className="p-4 overflow-hidden transition-all duration-500 ease-in-out bg-gray-50"
          style={{
            maxHeight: open === index ? "1000px" : "0", // Valor alto para garantizar que el contenido se vea
            paddingTop: open === index ? "1rem" : "0", // Animar también el padding si es necesario
            paddingBottom: open === index ? "1rem" : "0", // Similar a paddingTop
          }}
        >
          <p className="text-black-900">{answer}</p>
        </div>
      </Collapse>
    </div>
  );
};

export default AccordionItem;
