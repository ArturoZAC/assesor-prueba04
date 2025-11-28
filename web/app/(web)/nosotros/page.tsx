/* eslint-disable @next/next/no-img-element */
import { BannerInterna } from "../@components/estructura/BannerInterna";
import { ContentMain } from "../@components/estructura/ContentMain";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { CardValores, Valor } from "../@components/nosotros/CardValores";
import AnimatedWrapper, {
  AnimationType,
} from "../@components/animacion/Animacion";
import { Header } from "../@components/estructura/Header";
import { Footer } from "../@components/estructura/Footer";
const valores: Valor[] = [
  {
    titulo: "TRANSPARENCIA",
    descripcion:
      "Cada uno de nuestros procesos se realiza de manera clara, honesta y buscando el bien de nuestros clientes.",
    imagen: "/images/nosotros/valores/valor1.png",
  },
  {
    titulo: "INNOVACIÓN",
    descripcion:
      "Al ser una fintech buscamos estar siempre a la vanguardia de las tendencias tecnológicas, ofreciendo de esta manera servicios más óptimos y eficientes.",
    imagen: "/images/nosotros/valores/valor2.png",
  },
  {
    titulo: "COMPROMISO",
    descripcion:
      "Estamos 100% involucrados con ser agentes de cambio para las finanzas de nuestros clientes.",
    imagen: "/images/nosotros/valores/valor3.png",
  },
  {
    titulo: "EXCELENCIA",
    descripcion:
      "La eficiencia se alcanza bajo un constante esfuerzo por atender de manera adecuada y personalizada a nuestros clientes.",
    imagen: "/images/nosotros/valores/valor4.png",
  },
  {
    titulo: "VOCACIÓN DE SERVICIO",
    descripcion:
      "Buscamos que cada uno de nuestros procesos estén dirigidos por y para el mejor rendimiento del dinero de nuestros clientes.",
    imagen: "/images/nosotros/valores/valor5.png",
  },
];
export default function Nosotros() {
  return (
    <>
      <Header />

      <BannerInterna banner="/images/fondos/nosotros.webp" title="Nosotros" />
      <section className="w-full bg-secondary-main">
        <ContentMain className="flex flex-col gap-8 py-20 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <AnimatedWrapper
              animationType={AnimationType.Flip}
              delay={0.3}
              duration={0.3}
            >
              <img src="/images/nosotros/nosotros2.webp" alt="" />
            </AnimatedWrapper>
          </div>
          <div className="w-full lg:w-1/2">
            <AnimatedWrapper
              animationType={AnimationType.SlideUp}
              delay={0.3}
              duration={0.3}
            >
              <h2 className="mt-3 text-3xl font-bold md:text-4xl lg:text-5xl text-white-main font_kanit">
                Innovación Financiera a{" "}
                <span className="text-primary-main">tu Alcance</span>
              </h2>
            </AnimatedWrapper>
            <AnimatedWrapper
              animationType={AnimationType.SlideUp}
              delay={0.4}
              duration={0.3}
            >
              <p className="mt-6 text-white-main">
                Somos una fintech 100% peruana comprometida con nuestros
                clientes y dedicada a ofrecer soluciones financieras accesibles
                y eficientes. Nuestro propósito es generar un impacto económico
                positivo, contreto e inmediato en los usuarios mediante
                transacciones simples y procesos ágiles, integrados de manera
                óptima en el sistema financiero nacional.
              </p>
            </AnimatedWrapper>
            <AnimatedWrapper
              animationType={AnimationType.SlideUp}
              delay={0.5}
              duration={0.3}
            >
              <p className="mt-3 text-white-main">
                ASSESSOR está registrada ante la Superintendencia de Banca,
                Seguros y AFPs con{" "}
                <strong>Resolución S.B.S. Nro. 00853-2019</strong>, posee un
                Sistema de Prevención de Lavado de Activos (SPLAFT), cuenta con
                un Oficial de Cumplimiento y reporta de manera directa a la UIF
                y cumple todos los requisitos que se exigen para las empresas
                del sector financiero en el país.
              </p>
            </AnimatedWrapper>
            <AnimatedWrapper
              animationType={AnimationType.SlideUp}
              delay={0.6}
              duration={0.3}
            >
              <p className="mt-3 text-white-main">
                Así nace ASSESSOR, con una idea clara de servicio al cliente y
                con orientación plena a sus resultados económicos que los ayude
                a lograr sus propias metas trazadas en cada etapa de su vida
                financiera.
              </p>
            </AnimatedWrapper>

            <div className="flex flex-col items-center w-full gap-5 mt-12 md:flex-row ">
              <AnimatedWrapper
                animationType={AnimationType.Scale}
                duration={0.3}
                delay={0.7}
              >
                <a
                  href={
                    "https://api.whatsapp.com/send?phone=51922883878&text=Hola!%20Estoy%20interesado%20en%20sus%20servicios"
                  }
                  target="_blank"
                  className="flex items-center gap-2 px-8 py-2 w-fit rounded-main bg-primary-main text-white-main"
                >
                  Conoce más aquí{" "}
                  <MdOutlineArrowRightAlt className="text-3xl" />
                </a>
              </AnimatedWrapper>
            </div>
            {/* <div className="flex flex-col items-center w-full mt-16 md:flex-row">
                <div className="flex flex-col items-center w-1/2">
                  <p className="mb-2 text-lg font-bold uppercase text-amarrillo-main">
                    Registrado en
                  </p>
                  <img
                    src="/images/nosotros/logo2.png"
                    alt=""
                    className="rounded-main w-[270px] h-[150px] object-contain bg-white-main p-4 shadow-md shadow-white-100/30"
                  />
                </div>
                <div className="flex flex-col items-center w-1/2">
                  <p className="mb-2 text-lg font-bold uppercase text-amarrillo-main">
                    Asociado a
                  </p>
                  <img
                    src="/images/nosotros/logo1.png"
                    alt=""
                    className="rounded-main w-[270px] h-[150px] object-contain bg-white-main p-4 shadow-md shadow-white-100/30"
                  />
                </div>
              </div> */}
          </div>
        </ContentMain>
      </section>
      <section className=" bg-white-main">
        <ContentMain className="py-20">
          {/* <h2 className="mb-12 text-5xl font-extrabold">Nuestros Valores</h2> */}
          <div className="flex flex-wrap justify-center max-w-5xl gap-2 mx-auto gap-y-10">
            {valores.map((valor, index) => (
              <AnimatedWrapper
                animationType={AnimationType.SlideUp}
                key={index}
                delay={index * 0.2}
                duration={0.3}
                className=" w-full md:w-[48%] lg:w-[32%] "
              >
                <CardValores index={index} valor={valor} key={index} />
              </AnimatedWrapper>
            ))}
          </div>
        </ContentMain>
      </section>
      <Footer />
    </>
  );
}
