"use client";
import React, { Dispatch, SetStateAction, useContext } from "react";
import { GoTriangleDown } from "react-icons/go";
import { TbMenu2 } from "react-icons/tb";
import { IoCloseOutline } from "react-icons/io5";
import { useAuth } from "@/context/useAuthContext";
import { UserContext } from "@/context/UserContext";
export const HeaderSistema = ({
  scrolled,
  setShowMenu,
  showMenu,
}: {
  scrolled: boolean;
  setShowMenu: Dispatch<SetStateAction<boolean>>;
  showMenu: boolean;
}) => {
  const { titleSection } = useAuth();
  const { user } = useContext(UserContext)

  return (
    <div
      className={`w-full z-[1200] top-0 left-0 bg-primary-main lg:bg-white-main flex items-center justify-between pl-4 lg:pl-10 pr-4 h-20 ${
        scrolled ? "fixed " : "relative shadow"
      }`}
    >
      <div className="flex items-center gap-2 w-fit">
        <button
          type="button"
          onClick={() => {
            setShowMenu(!showMenu);
          }}
          className="flex items-center justify-center w-8 h-8 p-1 text-xl rounded-full bg-primary-main lg:hidden text-secondary-main"
        >
          {showMenu ? <IoCloseOutline /> : <TbMenu2 />}
        </button>
        <p className="text-base sm:text-xl text-white-main lg:text-black-main">
          {titleSection}
        </p>
      </div>
      <div className="w-fit">
        <button
          type="button"
          className="relative flex items-center gap-1 px-2 py-3 md:px-4 btn--menuProfile rounded-main sm:gap-2 hover:bg-secondary-50"
        >
          <span className="flex items-center justify-center w-8 h-8 font-bold uppercase rounded-full bg-primary-main sm:w-10 sm:h-10 text-white-main">
            <p className="text-sm sm:text-base text-white-main ">
              {user?.nombres +
                "" +
                user?.apellido_paterno}
            </p>
          </span>
          <p className="hidden text-sm sm:block sm:text-base lg:text-black-main">
            {user?.nombres +
              " " +
              user?.apellido_paterno}
          </p>

          <span className="text-secondary-main lg:text-black-main">
            <GoTriangleDown />
          </span>
        </button>
      </div>
    </div>
  );
};
