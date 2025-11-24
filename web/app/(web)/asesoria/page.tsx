import { BannerInterna } from "../@components/estructura/BannerInterna";
import { ContentMain } from "../@components/estructura/ContentMain";
import { Footer } from "../@components/estructura/Footer";
import { Header } from "../@components/estructura/Header";
import { TabsAsesoria } from "./@components/TabsAsesoria";

export default function page() {
  const colors = {
    primary: "#cb4325",
    secondary: "#00387c",
    accent: "#ffc107",
  };
  return (
    <>
      <Header />
      <BannerInterna
        title="Asesoría en Gestión Comercial y Financiera"
        banner="/images/slides/slide1.webp"
      />

      <section className=" bg-primary-main">
        <ContentMain className="py-20">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl text-white-main font_kanit">
              ¿Por qué elegir{" "}
              <span className="text-amarrillo-main">nuestra asesoría?</span>
            </h2>
            <div
              className="w-16 h-1 mx-auto mb-6"
              style={{ backgroundColor: colors.accent }}
            ></div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="p-8 shadow-md rounded-main bg-white-main">
              <h3
                className="mb-4 text-xl font-semibold text-blue-900"
                style={{ color: colors.secondary }}
              >
                ¿Manejas y haces seguimientos periódicos a los principales
                indicadores de tu empresa?
              </h3>
              <p className="text-justify text-black-900">
                Nuestra asesoría te ayudará a desarrollar nuevos procesos de
                organización y gestión para controlar mejor las actividades
                financieras y comerciales, fijando objetivos tangibles, midiendo
                resultados y detectando problemas.
              </p>
            </div>
            <div className="p-8 shadow-md bg-white-main rounded-main">
              <h3
                className="mb-4 text-xl font-semibold text-blue-900"
                style={{ color: colors.secondary }}
              >
                ¿Sientes que tu empresa crece pero no ves la liquidez de tu caja
                creciendo en esa dimensión?
              </h3>
              <p className="text-justify text-black-900">
                La asesoría en Gestión Comercial y Financiera tiene el objetivo
                de ayudar a tu empresa o emprendimiento a gestionar de manera
                eficiente la facturación y los gastos del negocio.
              </p>
            </div>
          </div>

          <div className="max-w-3xl p-8 mx-auto mt-10 shadow-md bg-white-main rounded-main">
            <p className="mb-4 text-justify text-black-900">
              Este tipo de asesoría se encarga de analizar tu situación
              financiera y trabajar contigo o con el responsable de finanzas de
              tu empresa para preparar un plan estratégico financiero que
              contribuya a alcanzar los objetivos propuestos a lo largo del año.
            </p>
            <p className="text-justify text-black-900">
              A partir de un análisis del funcionamiento de tu negocio la
              asesoría que te brindamos realiza un diagnóstico y sugiere
              soluciones en lo que se refiere a un determinado tema o campo del
              negocio. En definitiva, nuestra función es ayudar a tu empresa en
              todos aquellos ámbitos comerciales y financieros en los que se
              puede mejorar y orientarla para que sea más eficaz.
            </p>
          </div>
        </ContentMain>
      </section>

      <section id="servicios" className="bg-white-main">
        <ContentMain className="py-20">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h2
              className="mb-4 text-3xl font-bold text-secondary-main md:text-4xl font_kanit"
              style={{ color: colors.secondary }}
            >
              Nuestros Servicios
            </h2>
            <div
              className="w-16 h-1 mx-auto mb-6"
              style={{ backgroundColor: colors.primary }}
            ></div>
            <p className="text-black-900">
              La asesoría DE GESTIÓN FINANCIERA es una propuesta de ASSESSOR que
              aborda las principales áreas de la gestión financiera que
              permitirán fortalecer la posición estratégica de su empresa.
            </p>
          </div>

          <TabsAsesoria />
        </ContentMain>
      </section>

      <section className="mb-20 text-white-main">
        <ContentMain className="py-12 text-center rounded-main bg-secondary-main">
          <h2 className="mb-4 text-3xl font-bold text-white-main font_kanit">
            ¿Listo para impulsar el crecimiento de tu empresa?
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-xl">
            Nuestro equipo está listo para ayudarte a desarrollar estrategias
            financieras efectivas que lleven tu negocio al siguiente nivel.
          </p>
          <a
            href="https://api.whatsapp.com/send?phone=51922883878&text=Hola!%20Estoy%20interesado%20en%20sus%20servicios"
            className="inline-block px-8 py-3 font-semibold rounded-main"
            style={{ backgroundColor: colors.primary }}
          >
            Solicitar una Consulta Gratuita
          </a>
        </ContentMain>
      </section>
      <Footer />
    </>
  );
}
