"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

const LinkHeader = ({
  href,
  text,
  setMenu,
}: {
  href: string;
  text: string;

  setMenu: Dispatch<SetStateAction<boolean>>;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li className="relative list-none">
      <Link
        href={href}
        onClick={() => {
          setMenu(false);
        }}
        className={`block p-2 text-center rounded-md transition-colors duration-300 ${
          isActive ? "text-primary-main font-semibold" : "text-gray-700"
        }`}
      >
        <span
          className={`absolute inset-0 bg-contain bg-center rounded-md transition-opacity duration-300 ${
            isActive ? "opacity-10" : "opacity-0"
          } bg-contain bg-no-repeat bg-[url('/images/logo/dolar.png')]`}
        ></span>
        <span className="relative z-10">{text}</span>
      </Link>
    </li>
  );
};

export default LinkHeader;
