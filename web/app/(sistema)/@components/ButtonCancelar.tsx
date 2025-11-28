'use client'
import { useAuth } from "@/context/useAuthContext";
import React from "react";

export const ButtonCancelar = () => {
  const { closeModal } = useAuth();
  return (
    <button
      type="button"
      onClick={closeModal}
      className="flex justify-center w-full py-2 transition-all duration-200 border-2 text-secondary-main rounded-main border-secondary-main hover:bg-secondary-900 hover:text-white-main hover:border-secondary-900"
    >
      Cancelar
    </button>
  );
};
