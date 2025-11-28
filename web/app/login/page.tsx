/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { FormLogin } from "../(sistema)/@components/FormLogin";

export default function page() {
  return (
    <>
      <section className="flex flex-col items-center justify-center w-full h-screen lg:flex-row">
        <div className="flex flex-col items-center justify-center w-full h-full px-5 py-16 md:px-10 lg:px-16 lg:w-1/2">
          <Link href={"/"}>
            <img
              src="/images/logo/favicon.ico"
              alt=""
              className="block w-[80px] md:w-[100px] mx-auto mb-8"
            />
          </Link>
          <h2 className="mb-8 text-4xl font-medium text-center text-secondary-main md:text-5xl lg:text-6xl font_kanit ">
            Iniciar <span className="text-primary-main">sesión</span>
          </h2>
          <FormLogin />
        </div>
        <div className="w-full h-full lg:w-1/2 relative hidden lg:flex items-center justify-center flex-col px-28 before:-z-10 z-10 before:absolute before:w-full before:h-full before:bg-secondary-main before:opacity-80 bg-[url(/images/fondos/fondo_login.webp)]">
          <Link href={"/"}>
            <img
              src="/images/logo/logo_white.png"
              alt=""
              className="block w-[670px] mx-auto mb-6"
            />
          </Link>
          <p className="text-2xl text-center text-white-main font_kanit">
            Gestiona tus operaciones de compra/venta, leasing y préstamos desde
            un solo lugar.
          </p>
        </div>
      </section>
    </>
  );
}
