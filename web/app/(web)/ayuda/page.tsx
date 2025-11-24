import { BannerInterna } from "../@components/estructura/BannerInterna";
import { ContentMain } from "../@components/estructura/ContentMain";
import { Accordion } from "../@components/ayuda/Accordion";
import { Header } from "../@components/estructura/Header";
import { Footer } from "../@components/estructura/Footer";

export default function page() {
  return (
    <>
      <Header />
      <BannerInterna
        banner="/images/slides/slide1.webp"
        title="Preguntas frecuentes"
      />
      <section className="px-6 py-12 bg-white-main">
        <ContentMain>
          <h2 className="mb-4 text-2xl font-bold text-center font_kanit text-secondary-main">
            ¿Aún tienes dudas del servicio que te ofrecemos?
          </h2>
          <p className="mb-6 text-lg text-center text-black-900">
            A continuación encontrarás algunas preguntas que nos hacen nuestros
            clientes y otras que pensamos que podrían servirte para aclarar tus
            dudas. Si aún así no encuentras una respuesta a tu consulta,
            escríbenos a{" "}
            <a
              href="mailto:contacto@assessorperu.com"
              className="text-blue-600 hover:underline"
            >
              contacto@assessorperu.com
            </a>
          </p>
        </ContentMain>
      </section>
      <section className="pb-16 bg-white-main">
        <ContentMain className="px-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between w-full gap-12 lg:flex-row">
            {/* Columna de Preguntas Frecuentes */}
            <div className="w-full max-w-4xl mx-auto space-y-6">
              <Accordion mostrar />
            </div>
          </div>
        </ContentMain>
      </section>
      <section className="bg-fixed bg-[url(/images/fondos/parallax1.webp)] relative z-10 before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-secondary-main before:opacity-50 before:-z-10">
        <ContentMain className="flex flex-col items-center py-20">
          <h2 className="mb-4 text-3xl font-bold text-center text-white-main font_kanit">
            Somos una fintech 100% peruana 🚀
          </h2>
          <p className="mb-8 text-white-100">
            ¿Estás listo para mejorar tu experiencia financiera?
          </p>
          <a
            href="https://api.whatsapp.com/send?phone=51922883878&text=Hola!%20Estoy%20interesado%20en%20sus%20servicios"
            target="_blank"
            className="px-8 py-3 font-bold transition duration-300 shadow-lg text-black-main bg-amarrillo-main hover:bg-amarrillo-600 rounded-main"
          >
            ¡Solicita tu consulta gratuita!
          </a>
        </ContentMain>
      </section>
      <Footer />
    </>
  );
}
