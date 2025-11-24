"use client";
import React from "react";
import ModalWrapper from "./ModalWrapper";
import { useAuth } from "@/context/useAuthContext";

export const ModalRender = () => {
  const { modalContent } = useAuth();
  return (
    <>
      <ModalWrapper componente={modalContent} />
    </>
  );
};
