import AnimatedWrapper, {
  AnimationType,
} from "../@components/animacion/Animacion";
import { BannerInterna } from "../@components/estructura/BannerInterna";
import { ContentMain } from "../@components/estructura/ContentMain";
import { Footer } from "../@components/estructura/Footer";
import { Header } from "../@components/estructura/Header";
export default function page() {
  return (
    <>
      <Header />
      <BannerInterna
        banner="/images/slides/slide1.webp"
        title="Servicio PAY DAY"
      />
      <section className="relative py-20 overflow-hidden bg-white-main ">
        <ContentMain className="relative z-10">
          {/* Título y Subtítulo */}
          <div className="text-center">
            <AnimatedWrapper
              animationType={AnimationType.SlideUp}
              duration={0.3}
              delay={0}
            >
              <h2 className="mt-6 mb-6 text-5xl font-extrabold leading-tight tracking-tight text-secondary-main font_kanit">
                Capital de Trabajo <br />
                <span className="text-primary-main">Rápido y Seguro</span>
                <br className="hidden md:block" />{" "}
              </h2>
            </AnimatedWrapper>
            <AnimatedWrapper
              animationType={AnimationType.SlideUp}
              duration={0.3}
              delay={0 - 1}
            >
              <p className="max-w-3xl mx-auto text-xl font-light text-gray-600 md:text-2xl">
                La solución financiera definitiva para impulsar el crecimiento
                de tu negocio.
              </p>
              <div className="w-24 h-1 mx-auto mt-8 mb-6 rounded-full bg-amarrillo-main"></div>
            </AnimatedWrapper>
          </div>
        </ContentMain>
      </section>

      <section className="bg-primary-main">
        <ContentMain className="py-20">
          <AnimatedWrapper
            animationType={AnimationType.SlideUp}
            delay={0.3}
            duration={0.3}
          >
            <div className="px-5 py-10 transition-all duration-300 transform border-b-4 md:px-7 lg:px-10 bg-white-main border-secondary-main md:p-12 rounded-main hover:shadow-2xl">
              <div className="flex flex-col items-start md:flex-row">
                <div className="flex-shrink-0 p-4 mb-6 bg-secondary-50 md:mb-0 md:mr-8 rounded-main">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 text-secondary-main"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-4 text-2xl font-bold text-secondary-main font_kanit">
                    ¿Qué es PayDay?
                  </h3>
                  <p className="text-xl font-medium leading-relaxed text-gray-800">
                    <span className="">
                      Si necesitas capital de trabajo de forma rápida, sencilla
                      y segura,
                    </span>{" "}
                    tenemos la solución ideal para ti.
                  </p>
                  <p className="mt-6 text-lg leading-relaxed text-gray-700">
                    <span className="text-xl font-semibold ">
                      Te presentamos el servicio PayDay,
                    </span>{" "}
                    un servicio diseñado para garantizar el pago oportuno de
                    deudas, adelantos o compras, dirigido a micro, pequeñas y
                    medianas empresas que reciben ingresos después del
                    vencimiento de sus obligaciones. Esto permite evitar
                    penalidades e intereses, mejorar la calificación crediticia
                    y, lo más importante, asegurar la continuidad operativa y la
                    atención a tus clientes sin interrupciones.
                  </p>
                  <p className="mt-6 text-lg leading-relaxed text-gray-700">
                    Gracias a la tecnología y la innovación, hemos desarrollado
                    un esquema ágil de financiamiento a corto plazo, en el que
                    solo pagas intereses por los días en los que efectivamente
                    utilizas el capital prestado.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedWrapper>
        </ContentMain>
      </section>
      <section>
        <ContentMain className="py-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {/* Características */}
            <AnimatedWrapper
              animationType={AnimationType.SlideUp}
              delay={0}
              duration={0.3}
            >
              <div className="relative h-full px-5 py-10 overflow-hidden transition-all duration-500 transform bg-white border border-l-8 shadow-lg md:px-7 lg:px-10 border-primary-main group rounded-main hover:-translate-y-2">
                <div className="relative">
                  <div className="flex items-center mb-8">
                    <div className="flex items-center justify-center w-16 h-16 transition-colors duration-300 shadow-md bg-primary-100 rounded-main group-hover:bg-primary-main">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8 text-primary-main group-hover:text-white-main"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="ml-6 text-3xl font-bold font_kanit text-primary-main">
                      Características
                    </h3>
                  </div>
                  <ul className="space-y-6 text-gray-700">
                    <li className="flex items-start transition-transform duration-300 transform hover:translate-x-2">
                      <div className="flex-shrink-0 p-1 rounded-full bg-primary-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 text-primary-main"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="ml-4 text-lg font-medium">
                        Habilitación de capital de trabajo
                      </span>
                    </li>
                    <li className="flex items-start transition-transform duration-300 transform hover:translate-x-2">
                      <div className="flex-shrink-0 p-1 rounded-full bg-primary-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 text-primary-main"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="ml-4 text-lg font-medium">
                        Periodos cortos de financiamiento
                      </span>
                    </li>
                    <li className="flex items-start transition-transform duration-300 transform hover:translate-x-2">
                      <div className="flex-shrink-0 p-1 rounded-full bg-primary-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 text-primary-main"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="ml-4 text-lg font-medium">
                        Calculo de intereses sólo por los días que se mantiene
                        el préstamo
                      </span>
                    </li>
                    <li className="flex items-start transition-transform duration-300 transform hover:translate-x-2">
                      <div className="flex-shrink-0 p-1 rounded-full bg-primary-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 text-primary-main"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="ml-4 text-lg font-medium">
                        Tasa de interés acordada según evaluación del cliente
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </AnimatedWrapper>
            <AnimatedWrapper
              animationType={AnimationType.SlideUp}
              delay={0.2}
              duration={0.3}
            >
              {/* Procedimiento */}
              <div className="relative px-5 py-10 overflow-hidden transition-all duration-500 transform bg-white border border-l-8 shadow-lg md:px-7 lg:px-10 border-secondary-main group rounded-main hover:-translate-y-2">
                <div className="relative">
                  <div className="flex items-center mb-8">
                    <div className="flex items-center justify-center w-16 h-16 transition-colors duration-300 shadow-md bg-secondary-50 rounded-main group-hover:bg-secondary-main">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8 text-secondary-main group-hover:text-white-main"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </div>
                    <h3 className="ml-6 text-3xl font-bold font_kanit text-secondary-main">
                      Procedimiento
                    </h3>
                  </div>
                  <ol className="relative space-y-6 text-gray-700">
                    <div className="absolute left-4 top-3 bottom-3 w-0.5 bg-secondary-50"></div>
                    <li className="relative flex items-start pl-10 transition-transform duration-300 transform hover:translate-x-2">
                      <div className="absolute top-0 left-0 z-10 flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full shadow-md bg-secondary-50">
                        <span className="text-lg font-bold text-amarillo-main">
                          1
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-secondary-main">
                          El cliente solicita
                        </span>{" "}
                        el requerimiento o habilitación de capital de trabajo y
                        entrega los documentos de sustento de la operación.
                      </div>
                    </li>
                    <li className="relative flex items-start pl-10 transition-transform duration-300 transform hover:translate-x-2">
                      <div className="absolute top-0 left-0 z-10 flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full shadow-md bg-secondary-50">
                        <span className="text-lg font-bold text-amarillo-main">
                          2
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-secondary-main">
                          Se realiza una evaluación
                        </span>{" "}
                        de riesgo del cliente y de la operación a fin de
                        identificar su calificación crediticia.
                      </div>
                    </li>
                    <li className="relative flex items-start pl-10 transition-transform duration-300 transform hover:translate-x-2">
                      <div className="absolute top-0 left-0 z-10 flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full shadow-md bg-secondary-50">
                        <span className="text-lg font-bold text-amarillo-main">
                          3
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-secondary-main">
                          Se establece una tasa
                        </span>{" "}
                        de financiamiento neta y se calculan los costos
                        financieros y penalidades que el cliente asume.
                      </div>
                    </li>
                    <li className="relative flex items-start pl-10 transition-transform duration-300 transform hover:translate-x-2">
                      <div className="absolute top-0 left-0 z-10 flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full shadow-md bg-secondary-50">
                        <span className="text-lg font-bold text-amarillo-main">
                          4
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-secondary-main">
                          Se establece un punto
                        </span>{" "}
                        de corte para pre-pago o una fecha de pago tanto del
                        capital como de los intereses.
                      </div>
                    </li>
                    <li className="relative flex items-start pl-10 transition-transform duration-300 transform hover:translate-x-2">
                      <div className="absolute top-0 left-0 z-10 flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full shadow-md bg-secondary-50">
                        <span className="text-lg font-bold text-amarillo-main">
                          5
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-secondary-main">
                          El cliente paga
                        </span>{" "}
                        a Assessor el servicio de la deuda y recibe la
                        respectiva factura por los intereses generados.
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            </AnimatedWrapper>
          </div>
        </ContentMain>
      </section>
      <section>
        <ContentMain>
          <AnimatedWrapper
            animationType={AnimationType.SlideUp}
            delay={0}
            duration={0.3}
          >
            <div className="p-10 border shadow-md bg-secondary-main rounded-main">
              <div className="flex flex-col items-center md:flex-row">
                <div className="mb-6 mr-8 md:mb-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-16 h-16 text-amarrillo-main"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <p className="text-lg italic text-white-main">
                  Además, el servicio{" "}
                  <span className="font-bold text-white-200">PAYDAY</span>{" "}
                  mantiene los altos estándares de atención que caracterizan a
                  todos los servicios de
                  <span className="font-bold text-white-200">ASSESSOR</span>,
                  ofreciendo{" "}
                  <strong>
                    flexibilidad, calidad y un excelente servicio al cliente,{" "}
                  </strong>
                  lo que nos posiciona como líderes en el sector de servicios
                  financieros dirigidos a las pymes.
                </p>
              </div>
            </div>
          </AnimatedWrapper>
          {/* Botón de Llamada a la Acción (Opcional) */}
          <div className="my-12 text-center">
            <a
              href="https://api.whatsapp.com/send?phone=51922883878&text=Hola!%20Estoy%20interesado%20en%20sus%20servicios"
              target="_blank"
              className="px-8 py-4 text-lg font-bold transition duration-300 transform rounded-full shadow-lg text-white-main bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 hover:shadow-xl hover:translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            >
              ¡Solicita PayDay Ahora! &rarr;
            </a>
          </div>
        </ContentMain>
      </section>
      <Footer />
    </>
  );
}
