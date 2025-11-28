"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Registro } from "./RegistroCliente";

export const columnasClientes: ColumnDef<Registro>[] = [
  {
    accessorKey: "codigo",
    header: "Código",
  },
  {
    accessorKey: "vigente",
    header: "Vigente",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value.toUpperCase();
    },
  },
  { accessorKey: "documento", header: "Docu" },
  { accessorKey: "apellido_paterno", header: "Apellido Paterno" },
  { accessorKey: "apellido_materno", header: "Apellido Materno" },
  { accessorKey: "nombres", header: "Nombres" },
  { accessorKey: "ocupacion", header: "Ocupación" },
  {
    accessorKey: "tipo_cliente",
    header: "Tip/Cli",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      if (value === "persona_juridica") return "Persona Jurídica";
      if (value === "persona_natural") return "Persona Natural";
    },
  },
  { accessorKey: "direccion", header: "Dirección" },
  { accessorKey: "email", header: "Correo" },
  { accessorKey: "departamento", header: "Departamento" },
  { accessorKey: "provincia", header: "Provincia" },
  { accessorKey: "distrito", header: "Distrito" },
  { accessorKey: "telefono", header: "Teléfono" },
  { accessorKey: "apellido_paterno_apo", header: "Paterno - Apo" },
  { accessorKey: "apellido_materno_apo", header: "Materno - Apo" },
  { accessorKey: "nombres_apo", header: "Nombres - Apo" },
  {
    accessorKey: "tipo_documento",
    header: "Tdocu",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value.toUpperCase();
    },
  },
  { accessorKey: "numero_documento", header: "Nro Docu" },
  { accessorKey: "nacionalidad", header: "Nacionalidad" },
  { accessorKey: "cliente", header: "Cliente" },
  {
    accessorKey: "tipo_documento_cliente",
    header: "Tip Docu",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value.toUpperCase();
    },
  },
  { accessorKey: "cliente_2", header: "Cliente - 2" },
  { accessorKey: "documento_2", header: "Docu-2" },
  { accessorKey: "otro", header: "Otro" },
  { accessorKey: "tercero", header: "Tercero" },
  { accessorKey: "tipo_tercero", header: "Tip/Terc" },
  { accessorKey: "documento_tercero", header: "Doc/Terc" },
  { accessorKey: "observacion", header: "Observación" },
];
