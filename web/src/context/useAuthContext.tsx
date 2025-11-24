"use client";
import { config } from "@/config/config";
import { UserInterface } from "@/interfaces/AuthInterface";
import axios from "axios";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { ExcelData } from "../../app/(sistema)/sistema/cuadre-operaciones/@components/forms/excel/SubirDatosExcel";

interface AuthContextInterface {
  isAuthenticated: boolean;
  titleSection: string;
  setTitleSection: Dispatch<SetStateAction<string>>;
  setIsAuthenticated: React.Dispatch<SetStateAction<boolean>>;
  user: UserInterface | null;
  setUser: React.Dispatch<SetStateAction<UserInterface | null>>;
  modalContent: ReactNode | null;
  setModalContent: Dispatch<SetStateAction<ReactNode>>;
  isModalOpen: boolean;
  selectedRow: any;
  setSelectedRow: Dispatch<SetStateAction<any>>;
  openModal: () => void;
  closeModal: () => void;
  cerrarSesion: () => void;
  datosOperaciones: any;
  setDatosOperaciones: Dispatch<SetStateAction<any[]>>;
  datosFacturacion: any;
  setDatosFacturacion: Dispatch<SetStateAction<any[]>>;
}

interface AuthProviderInterface {
  children: ReactNode;
  userInitial: UserInterface | null;
}

export type AuthContextValue = AuthContextInterface;

export const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderInterface> = ({ children, userInitial }) => {
  /*
    const datosGuardados = localStorage ? localStorage.getItem("datosExcel") : '';
    const parsedData: ExcelData[] = datosGuardados
      ? JSON.parse(datosGuardados)
      : [];
    
    const datosFacturacionGuardados = localStorage ? localStorage.getItem("datosFacturacion") : '';
    const parsedDataFacturacion: ExcelData[] = datosFacturacionGuardados
      ? JSON.parse(datosFacturacionGuardados)
      : [];

    */
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserInterface | null>(userInitial);
  // const [datosOperaciones, setDatosOperaciones] = useState<any[]>(parsedData);
  const [datosOperaciones, setDatosOperaciones] = useState<any[]>([]);
  // const [datosFacturacion, setDatosFacturacion] = useState<any[]>(parsedDataFacturacion);
  const [datosFacturacion, setDatosFacturacion] = useState<any[]>([]);

  const [titleSection, setTitleSection] = useState<string>("Bienvenido");
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const cerrarSesion = async () => {
    try {
      const response = await axios.post(`${config.apiUrl}/logout`, null, {
        withCredentials: true,
      });
      if (response.status === 200) {
        window.location.href = "/";
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const datosGuardados = localStorage.getItem("datosExcel");
      const parsedData: ExcelData[] = datosGuardados ? JSON.parse(datosGuardados) : [];
      setDatosOperaciones(parsedData);

      const datosFacturacionGuardados = localStorage.getItem("datosFacturacion");
      const parsedDataFacturacion: ExcelData[] = datosFacturacionGuardados
        ? JSON.parse(datosFacturacionGuardados)
        : [];
      setDatosFacturacion(parsedDataFacturacion);
    }
  }, []);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        cerrarSesion,
        openModal,
        closeModal,
        isModalOpen,
        modalContent,
        setModalContent,
        setTitleSection,
        titleSection,
        selectedRow,
        setSelectedRow,
        datosOperaciones,
        setDatosOperaciones,
        datosFacturacion,
        setDatosFacturacion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextInterface => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth se debe de utilizar dentro de AuthProvider");
  }
  return context;
};
