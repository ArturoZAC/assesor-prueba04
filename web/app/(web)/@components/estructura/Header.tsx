"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { ContentMain } from "./ContentMain";
import LinkHeader from "./LinkHeader";
import { IoMdMenu } from "react-icons/io";
import Link from "next/link";
import { IoClose } from "react-icons/io5";
export interface LinkHeaderInterface {
  href: string;
  text: string;
}

const rutas = [
  { text: "Inicio", href: "/" },
  { text: "Nosotros", href: "/nosotros" },
  { text: "Pay Day", href: "/payday" },
  { text: "Leasing", href: "/leasing" },
  { text: "Asesoría", href: "/asesoria" },
  { text: "Ayuda", href: "/ayuda" },
];

export const Header = () => {
  const [menu, setMenu] = useState<boolean>(false);
  return (
    <header className="fixed top-0 left-0 z-[1300] w-full">
      <div
        className={`fixed top-0  w-full h-screen px-8 py-16 bg-white-main ${
          menu ? "left-0" : "-left-full"
        } transition-all duration-300 ease-out`}
      >
        <div className="flex justify-between w-full">
          <Link href={""}>
            <img
              src="/images/logo/logo.png"
              alt=""
              className="block w-[220px]"
            />
          </Link>
          <button
            type="button"
            onClick={() => {
              setMenu(false);
            }}
          >
            <IoClose className="text-3xl text-gray-600" />
          </button>
        </div>
        <div className="w-full">
          <ul className="flex flex-col items-center gap-5 mt-6">
            {rutas.map((item: LinkHeaderInterface) => (
              <LinkHeader
                href={item.href}
                text={item.text}
                key={item.href}
                setMenu={setMenu}
              />
            ))}
          </ul>
        </div>
      </div>
      <ContentMain className="mt-4 shadow rounded-main bg-white-main">
        <nav className="flex items-center justify-between px-4">
          <picture className="block w-[210px] md:w-[230px] lg:w-[260px]">
            <img
              src="/images/logo/logo.png"
              alt=""
              className="block w-full h-[90px] object-contain"
            />
          </picture>
          <ul className="items-center hidden gap-5 lg:flex">
            {rutas.map((item: LinkHeaderInterface) => (
              <LinkHeader
                href={item.href}
                text={item.text}
                key={item.href}
                setMenu={setMenu}
              />
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              setMenu(!menu);
            }}
            className="flex items-center justify-center w-10 h-10 p-2 text-2xl rounded-full bg-primary-main text-white-main lg:hidden"
          >
            <IoMdMenu />
          </button>
        </nav>
      </ContentMain>
    </header>
  );
};
