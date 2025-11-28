/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import { BarChart3, UserCircle2, FileText, Scale } from "lucide-react";
import { CgLogOut } from "react-icons/cg";
import { IoChevronBackOutline } from "react-icons/io5";
import { useAuth } from "@/context/useAuthContext";
import { BsCash } from "react-icons/bs";
import { FaMoneyCheck } from "react-icons/fa6";
import { PiAlignLeftBold } from "react-icons/pi";
import { TbReportMoney } from "react-icons/tb";
import { BiCategory } from "react-icons/bi";
import DropdownMenu from "./DropMenu";

const menuItems = [
  {
    title: "Resumen",
    icon: <BarChart3 />,
    route: "?option=operaciones",
  },
  {
    title: "Máster clientes",
    icon: <UserCircle2 />,
    route: "master-clientes",
  },
  {
    title: "Operaciones",
    icon: <Scale />,
    options: [
      { icon: <FileText />, label: "Operaciones", route: "operaciones" },
      { icon: <Scale />, label: "Cuadre Op.", route: "cuadre-operaciones" },
    ],
  },
  {
    title: "Gastos",
    icon: <Scale />,
    options: [
      { icon: <Scale />, label: "Cuadre Gastos", route: "cuadre-gastos" },
      { icon: <Scale />, label: "Recopilación Año", route: "recopilacion-anio" },
    ],
  },
  {
    title: "Préstamos",
    icon: <BsCash />,
    options: [
      { icon: <BsCash />, label: "Préstamos", route: "prestamos" },
      { icon: <Scale />, label: "Cuadre Prest.", route: "cuadre-prestamos" },
    ],
  },
  {
    title: "Leasing",
    icon: <FaMoneyCheck />,
    options: [
      { icon: <FaMoneyCheck />, label: "Leasing", route: "leasing" },
      { icon: <Scale />, label: "Cuadre Leas.", route: "cuadre-leasing" },
    ],
  },
  {
    title: "Facturación",
    icon: <PiAlignLeftBold />,
    options: [
      { icon: <PiAlignLeftBold />, label: "Facturación", route: "facturacion" },
      {
        icon: <TbReportMoney />,
        label: "Cuadre Fact.",
        route: "cuadre-facturas",
      },
    ],
  },
  {
    title: "Flujos",
    icon: <BiCategory />,
    options: [
      {
        label: "Presupuestos",
        route: "flujos/presupuestos"
      },
      {
        label: "Real Total",
        route: "flujos/real-total"
      },
      {
        label: "Real Divisas",
        route: "flujos/real-divisas"
      },
      {
        label: "Real Préstamos",
        route: "flujos/real-prestamos"
      },
      {
        label: "Consultoria",
        route: "flujos/consultoria"
      },
      {
        label: "Leasing",
        route: "flujos/leasing"
      }
    ]
  },
  {
    title: 'Tipo de Cambio',
    icon: <BiCategory />,
    route: 'tipo-cambio'
  }
];

export const SideBarSistema = ({
  showMenu,
  ocultarSideBar,
  setOcultarSideBar,
}: {
  showMenu: boolean;
  setShowMenu: Dispatch<SetStateAction<boolean>>;
  ocultarSideBar: boolean;
  setOcultarSideBar: Dispatch<SetStateAction<boolean>>;
}) => {
  const { cerrarSesion } = useAuth();

  return (
    <header
      className={`py-8 lg:py-12 fixed z-[1201] top-[90px] lg:top-0 ${
        showMenu ? "left-0" : "-left-full lg:left-0"
      }  lg:relative lg:block px-4 ${
        ocultarSideBar
          ? "w-full lg:min-w-20 lg:w-20"
          : "w-full lg:min-w-56 lg:w-56"
      }   bg-secondary-main h-auto min-h-dvh  transition-all duration-500 ease-out`}
    >
      <button
        type="button"
        onClick={() => {
          setOcultarSideBar(!ocultarSideBar);
        }}
        className={`hidden lg:flex bg-gradient-to-br z-[1200] outline-none  from-secondary-800 to-secondary-main absolute top-6 -right-4  w-8 h-8  items-center justify-center text-white-main text-2xl rounded-full transition-all duration-500 ease-out ${
          ocultarSideBar ? "rotate-180" : "rotate-0"
        }`}
      >
        <IoChevronBackOutline />
      </button>
      <div className="flex flex-col justify-between h-auto">
        <div className="w-full">
          <Link href={"/"} className="w-full">
            <img
              src="/images/logo/logo_white.png"
              alt=""
              className="hidden mx-auto w-36 lg:block"
            />
          </Link>
          <nav className="h-auto lg:py-10 ">
            <DropdownMenu
              menuItems={menuItems}
              ocultarSideBar={ocultarSideBar}
            />
          </nav>
        </div>
        <button
          type="button"
          onClick={() => {
            cerrarSesion();
          }}
          className={`px-5 outline-none text-white-main py-3 flex ${
            ocultarSideBar ? "justify-center" : "justify-start"
          } items-center gap-2 transition-all duration-500 group hover:bg-secondary-main rounded-main`}
        >
          <span className="text-xl transition-all text-primary-main group-hover:text-primary-main">
            <CgLogOut />
          </span>
          <p className={`${ocultarSideBar ? "hidden" : "block"} delay-75`}>
            Cerrar sesión
          </p>
        </button>
      </div>
    </header>
  );
};
