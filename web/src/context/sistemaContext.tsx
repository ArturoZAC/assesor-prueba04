"use client";

import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface SistemaContextType {
  modalContent: ReactNode | null;
  setModalContent: Dispatch<SetStateAction<ReactNode | null>>;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const sistemaContext = createContext<SistemaContextType | undefined>(undefined);

export const useSistemaContext = () => {
  const context = useContext(sistemaContext);

  if (!context) {
    throw new Error("useSistemaContext debe usarse dentro de SistemaProvider");
  }

  return context;
};

export const SistemaProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <sistemaContext.Provider
      value={{
        openModal,
        closeModal,
        isModalOpen,
        modalContent,
        setModalContent,
      }}
    >
      {children}
    </sistemaContext.Provider>
  );
};
