"use client";
import { useAuth } from "@/context/useAuthContext";
import React from "react";

import { AgregarCuadreDolares } from "./AgregarCuadreDolares";
import { AgregarCuadreSoles } from "./AgregarCuadreSoles";

export const AgregarCuadreOperacion = () => {
  const { selectedRow } = useAuth();

  const cuadreCompleto = selectedRow
    ? JSON.parse(selectedRow.cuadreCompleto)
    : null;
  const renderCuadreDolares =
    cuadreCompleto && !cuadreCompleto.cuadre_dolares ? true : false;

  return (
    <div>
     
      {renderCuadreDolares && <AgregarCuadreDolares />}
      {!renderCuadreDolares && <AgregarCuadreSoles />}
    </div>
  );
};
