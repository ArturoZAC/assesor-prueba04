import { ChevronRight } from "lucide-react";
import { TabsLeasing } from "./@components/TabsLeasing";
import { BannerInterna } from "../@components/estructura/BannerInterna";
import { ContentMain } from "../@components/estructura/ContentMain";
import AnimatedWrapper, {
  AnimationType,
} from "../@components/animacion/Animacion";
import { Header } from "../@components/estructura/Header";
import { Footer } from "../@components/estructura/Footer";

export default function page() {
  return (
    <>
      <Header />
      <BannerInterna title="Leasing" banner="/images/slides/slide2.webp" />
      <section className="py-16 bg-white-main">
        <ContentMain>
          {/* Header */}
          <div className="mb-12 text-center">
            <AnimatedWrapper
              animationType={AnimationType.Scale}
              delay={0}
              duration={0.3}
            >
              <h2 className="mb-4 text-3xl font-bold text-secondary-main font_kanit md:text-4xl">
                Soluciones de Leasing para tu Empresa
              </h2>
            </AnimatedWrapper>
            <AnimatedWrapper animationType={AnimationType.SlideUp}>
              <p className="max-w-3xl mx-auto text-lg text-black-900">
                Si necesitas realizar la compra de algún equipamiento o
                maquinaria para tu empresa y no tienes la liquidez, ASSESSOR te
                ofrece el servicio de Arrendamiento financiero y Operativo.
              </p>
            </AnimatedWrapper>
          </div>

          {/* Leasing Type Tabs */}
          <TabsLeasing />

          {/* CTA - Enhanced */}
          <div className="p-8 text-white border-l-4 shadow-lg border-primary-main bg-primary-main rounded-main md:p-10">
            <div className="grid items-center gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <AnimatedWrapper
                  animationType={AnimationType.SlideLeft}
                  delay={0}
                  duration={0.3}
                >
                  <h3 className="mb-3 text-2xl font-bold font_kanit text-white-main">
                    ¿Listo para empezar?
                  </h3>
                </AnimatedWrapper>
                <p className="mb-6 text-white-100 md:mb-0">
                  Contáctanos hoy mismo para obtener más información sobre
                  nuestras soluciones de leasing y cómo pueden beneficiar a tu
                  empresa.
                </p>
              </div>
              <div className="flex justify-center md:justify-end">
                <AnimatedWrapper
                  animationType={AnimationType.SlideRight}
                  delay={0}
                  duration={0.3}
                >
                  <a
                    href="https://api.whatsapp.com/send?phone=51922883878&text=Hola!%20Estoy%20interesado%20en%20sus%20servicios"
                    target="_blank"
                    className="inline-flex items-center px-6 py-3 font-medium transition shadow-md rounded-main text-white-main bg-amarrillo-main hover:bg-amarrillo-600 hover:shadow-lg"
                  >
                    Solicitar información
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </a>
                </AnimatedWrapper>
              </div>
            </div>
          </div>
        </ContentMain>
      </section>
      <Footer />
    </>
  );
}
