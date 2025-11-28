/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import axios from "axios"; // Asegúrate de tener axios instalado
import { config } from "@/config/config";

export const BusquedaCliente = ({
  usuario,
  setUsuario,
  disabled,
  usuarioBuscado
}: {
  usuario?: any
  setUsuario: any;
  disabled?: boolean;
  usuarioBuscado?: any
}) => {
  const [search, setSearch] = useState<string>(usuario ?? '');
  const [clientes, setClientes] = useState<any[]>([]); // Puedes tipar esto mejor si tienes el tipo definido
  const [usuarioIdSelected, setUsuarioIdSelected] = useState(usuarioBuscado ?? null);
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setUsuarioIdSelected(undefined);
  };

  useEffect(() => {
    setUsuarioIdSelected(usuarioBuscado)
  }, [usuarioBuscado])

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get(
          `${config.apiUrl}/clientes/buscarClientes/${search}`,
          {
            withCredentials: true
          }
        );
        console.log(response.data);
        setClientes(response.data);
      } catch (error) {
        console.error("Error buscando clientes:", error);
      }
    };

    if (search.length > 2) {
      fetchClientes();
    } else {
      setClientes([]);
    }
  }, [search]);

  return (
    <>
      <div className="relative flex flex-col w-full">
        <label className="text-black-800">Cliente</label>
        <input
          type="text"
          disabled={disabled}
          placeholder="Buscar cliente"
          value={
            usuarioIdSelected
              ? //@ts-ignore
                `${usuarioIdSelected.nombres} ${usuarioIdSelected.apellido_paterno}`
              : search
          }
          onChange={handleChangeInput}
          className="w-full p-2 border rounded-md outline-none placeholder:text-sm focus:border-secondary-main"
        />
        <ul className="absolute left-0 z-20 w-full border border-t-0 bg-white-main top-full rounded-b-main">
          {clientes.map((cliente) => (
            <li
              key={cliente.id}
              onClick={() => {
                setUsuarioIdSelected(cliente);
                setUsuario(cliente);
                setClientes([]);
              }}
              className="p-2 text-black-700 hover:bg-gray-100"
            >
              {cliente.nombres} {cliente.apellido_paterno}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
