/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import MainSlider from "./(web)/@components/slide/Slider";
import { ContentMain } from "./(web)/@components/estructura/ContentMain";
import { Accordion } from "./(web)/@components/ayuda/Accordion";
import AnimatedWrapper, {
  AnimationType,
} from "./(web)/@components/animacion/Animacion";
import { SwiperTestimonios } from "./(web)/@components/testimonios/SwiperTestimonios";
import { Header } from "./(web)/@components/estructura/Header";
import { Footer } from "./(web)/@components/estructura/Footer";
import { config } from "@/config/config";

export default async function Home() {
  const res = await fetch(
    `${config.apiUrl}/traerPrecios`,
    {
      cache: "no-store",
      credentials: 'include',
    }
  );
  const data = await res.json();
  const pasos = [
    {
      icon: "/images/nosotros/icono1.png",
      title: "Cotiza",
      description:
        "Para iniciar tu operación, contáctanos a través de nuestro canal de atención oficial y consulta el tipo de cambio de Compra o Venta que desees realizar.",
    },
    {
      icon: "/images/nosotros/icono2.png",
      title: "Confirma",
      description:
        "Indica el monto que deseas cambiar o recibir y confirma la cuenta bancaria donde deseas recibir tu cambio para completar tu transacción.",
    },
    {
      icon: "/images/nosotros/icono3.png",
      title: "Transfiere",
      description:
        "Realiza la transferencia por el monto acordado a la cuenta de ASSESSOR y envía la constancia de abono por  nuestro canal de atnción.",
    },
    {
      icon: "/images/nosotros/icono4.png",
      title: "Recibe",
      description:
        "Te haremos la transferencia de tu cambio y enviaremos la constancia de la operación. Adicionalmente recibirás por correo electrónico la factura o boleta respectiva.",
    },
  ];
  return (
    <>
      <Header />

      <div className="w-full overflow-x-clip">
        <MainSlider precios={data.precios} />
      </div>
      <section className="w-full">
        <ContentMain className="flex flex-col py-20 lg:flex-row ">
          <div className="w-full px-5 py-16 rounded-r-none md:px-10 lg:px-16 lg:w-1/2 rounded-3xl rounded-tl-main rounded-bl-main bg-primary-main">
            <h2 className="mt-4 mb-16 text-3xl font-bold md:text-4xl text-white-main font_kanit">
              Realizar{" "}
              <span className="text-amarrillo-main">tus operaciones </span>
              nunca fue tan fácil.
            </h2>
            <div className="relative w-full">
              <div className="relative lg:absolute min-h-[470px] top-0 left-0 grid w-full lg:w-[225%] gap-4 md:grid-cols-2 lg:grid-cols-4">
                {pasos.map((step: any, index: number) => (
                  <AnimatedWrapper
                    key={index}
                    animationType={AnimationType.SlideUp}
                    delay={index * 0.2}
                    duration={0.3}
                    className="h-full"
                  >
                    <div className="w-full h-full px-4 pt-6 pb-6 shadow-lg md:pb-0 rounded-main bg-white-main">
                      <img src={step.icon} alt="" className="block w-36" />
                      <h5 className="mt-4 mb-2 text-2xl font-bold text-secondary-main font_kanit">
                        {step.title}
                      </h5>
                      <p className="text-black-900">{step.description}</p>
                    </div>
                  </AnimatedWrapper>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <img
              src="/images/nosotros/nosotros1.webp"
              alt=""
              className="block rounded-tl-none rounded-bl-none rounded-main"
            />
          </div>
        </ContentMain>
      </section>

      <section className=" bg-secondary-main">
        <ContentMain className="py-28">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white-main md:text-4xl font_kanit">
              Lo que dicen{" "}
              <span className="text-amarrillo-main">nuestros clientes</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-white-200">
              Descubre por qué nuestros clientes confían en nosotros para
              impulsar su crecimiento.
            </p>
          </div>

          <SwiperTestimonios />
        </ContentMain>
      </section>

      <section className="py-20 bg-gray-50">
        <ContentMain className="px-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between w-full gap-12 lg:flex-row">
            {/* Columna de Preguntas Frecuentes */}
            <div className="w-full space-y-6 lg:w-1/2">
              <div className="text-center lg:text-left">
                <h2 className="mb-2 text-4xl font-extrabold text-primary-main font_kanit">
                  Preguntas Frecuentes
                </h2>
                <p className="text-lg text-gray-600">
                  Resolvemos tus dudas de manera rápida y clara.
                </p>
              </div>

              <Accordion />

              {/* Botones adicionales */}
              <div className="flex justify-center gap-4 mt-6 lg:justify-start">
                <Link
                  href={"/ayuda"}
                  className="px-6 py-2 font-semibold transition shadow-md rounded-main text-white-main bg-secondary-900 hover:bg-secondary-main"
                >
                  Ver Más Preguntas
                </Link>
                <a
                  href="https://api.whatsapp.com/send?phone=51922883878&text=Hola!%20Estoy%20interesado%20en%20sus%20servicios"
                  target="_blank"
                  className="px-6 py-2 font-semibold text-gray-700 transition bg-gray-300 shadow-md rounded-main hover:bg-gray-400"
                >
                  Contáctanos
                </a>
              </div>
            </div>

            {/* Columna de Imagen */}
            <div className="flex items-center justify-center w-full lg:w-1/2">
              <div className="relative">
                <img
                  src="/images/preguntas/preguntas.png"
                  alt="Preguntas Frecuentes"
                  className="w-[450px] h-auto mx-auto rounded-lg shadow-xl"
                />

                {/* Elemento decorativo */}
                <div className="absolute w-20 h-20 bg-blue-600 rounded-full -top-6 -left-6 opacity-30 blur-lg"></div>
                <div className="absolute w-20 h-20 bg-blue-400 rounded-full -bottom-6 -right-6 opacity-30 blur-lg"></div>
              </div>
            </div>
          </div>
        </ContentMain>
      </section>
      <section className="bg-gray-100/80 ">
        <ContentMain className="py-28">
          <h2 className="mb-12 text-3xl font-extrabold text-center md:text-4xl text-secondary-main font_kanit">
            Nuestros Servicios
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Servicio Leasing */}
            <div className="p-6 shadow-md rounded-main bg-primary-main">
              <h3 className="mb-2 text-xl font-semibold md:text-2xl font_kanit text-white-main">
                Leasing
              </h3>
              <p className="text-white-main min-h-[87px]">
                Ofrecemos soluciones de leasing flexibles y adaptadas a tus
                necesidades empresariales.
              </p>
              <Link
                href="/leasing"
                className="inline-block px-4 py-2 mt-8 font-bold rounded-main text-white-main bg-secondary-main hover:bg-amarrillo-main"
              >
                Más información
              </Link>
            </div>

            {/* Servicio Payday */}
            <div className="p-6 shadow-md rounded-main bg-primary-main">
              <h3 className="mb-2 text-xl font-semibold md:text-2xl font_kanit text-white-main">
                PayDay
              </h3>
              <p className="text-white-main min-h-[87px]">
                Accede a financiamiento rápido y seguro para cubrir tus
                necesidades de liquidez inmediata.
              </p>
              <Link
                href="/payday"
                className="inline-block px-4 py-2 mt-8 font-bold rounded-main text-white-main bg-secondary-main hover:bg-amarrillo-main"
              >
                Más información
              </Link>
            </div>

            <div className="p-6 shadow-md rounded-main bg-primary-main">
              <h3 className="mb-2 text-xl font-semibold md:text-2xl font_kanit text-white-main">
                Asesoría
              </h3>
              <p className="text-white-main min-h-[87px]">
                Nuestro equipo de expertos te brinda asesoramiento estratégico
                para el crecimiento de tu negocio.
              </p>
              <Link
                href="/asesoria"
                className="inline-block px-4 py-2 mt-8 font-bold rounded-main text-white-main bg-secondary-main hover:bg-amarrillo-main"
              >
                Más información
              </Link>
            </div>
          </div>
        </ContentMain>
      </section>

      <Footer />
    </>
  );
}
