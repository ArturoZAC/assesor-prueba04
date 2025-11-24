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
        title="Política de Privacidad"
      />
      <section className="w-full">
        <ContentMain className="py-20">
          <div className="w-full max-w-3xl p-8 mx-auto shadow-main rounded-main">
            <p>ASSESSOR S.A.C.</p>
            <p className="my-3">Versión: 2.0</p>
            <p className="mb-3">
              ASSESSOR es una sociedad debidamente inscrita en el Registro de
              Personas Jurídicas de la Oficina Registral de Lima, con RUC N°
              20604122482, siendo su domicilio fiscal en Jr. Morro Solar 420.
              Block B6. Dpto. 201. Chacarilla, Surco – Lima.
            </p>
            <p className="mb-3">
              Asimismo, ASSESSOR se encuentra inscrita en el Registro de
              Empresas que efectúan operaciones financieras de cambio de moneda,
              a cargo de la Superintendencia de Banca, Seguros y AFP (en
              adelante “SBS”) a través de la Resolución SBS N° 00853-2019.
            </p>
            <p className="mb-3">
              ASSESSOR ha alineado su política de privacidad de acuerdo a la Ley
              N° 29733, el Decreto Supremo No. 003-2013-JUS por el que se
              aprueba su Reglamento y la Directiva de Seguridad de la
              Información (en adelante “Ley de Protección de Datos Personales”).
            </p>
            <p className="mb-3">
              En este sentido ASSESSOR está comprometido a cuidar y proteger la
              información, privacidad y datos financieros del usuario, en
              adelante CLIENTE, que se utiliza para realizar las operaciones de
              cambio de divisas.
            </p>
            <p className="mb-3">
              Esta política (en conjunto con los términos y condiciones de uso y
              cualquier documento referido en él), define las bases sobre las
              cuales cualquier información recolectada del CLIENTE será
              procesada por ASSESSOR. Por favor lea detalladamente para entender
              los tipos de información que recolectamos de usted, cómo usamos
              esa información y las circunstancias bajo las cuales la
              compartiremos con terceras partes. Al visitar nuestra página web
              el CLIENTE acepta y consiente las prácticas descritas en esta
              política.
            </p>
            <p className="mb-6">
              Para propósitos de las leyes asociadas a la protección de datos,
              el controlador de la información es ASSESSOR S.A.C.
            </p>

            <div className="w-full mt-6">
              <p className="mb-3 text-lg font-bold text-black-main">
                Información del Cliente
              </p>
              <div className="w-full space-y-3">
                <p className="">
                  ASESSOR podría recolectar y procesar los siguientes datos
                  sobre el CLIENTE:
                </p>
                <ul className="pl-5 space-y-4 list-disc list-inside">
                  <li>
                    Información proporcionada al llenar formatos en nuestra
                    página web y/o interactuar con nosotros vía teléfono, correo
                    electrónico o de otra forma. Esto incluye (pero no se limita
                    a) información proporcionada al registrarse como usuario
                    para utilizar la página web, realizar operaciones utilizando
                    la página web o reportar algún problema en la página web. La
                    información que nos brinda podría incluir su nombre, fecha
                    de nacimiento, dirección, números de cuenta bancarios e
                    interbancarios, descripción personal, ubicación geográfica,
                    fotografía, copias de documentos de identidad, y otros
                    documentos.
                  </li>
                  <li>
                    Información recolectada por ASSESSOR con respecto a cada
                    visita que el CLIENTE realiza a nuestra página web, referida
                    a lo siguiente:
                    <ul className="pl-5 space-y-4 list-disc list-inside">
                      <li>
                        Detalles de las transferencias de dinero realizadas a
                        través de la página web, incluyendo la ubicación
                        geográfica desde la cual se genera.
                      </li>
                      <li>
                        Ubicación técnica, incluyendo la dirección IP utilizada
                        para conectarse desde tu computadora a internet, la
                        información de ingreso a tu cuenta de usuario, tipo de
                        navegador y versión, configuración horaria, plug-ins
                        asociados, sistema operativo y plataforma, etc.
                      </li>
                      <li>
                        Información sobre su visita, incluyendo el clickstream
                        completo de URL hacia, a lo largo de, y desde nuestra
                        página web (incluyendo fecha y hora); lo que se vio y
                        las búsquedas que se realizaron; tiempos de respuesta de
                        la página, errores de descarga, tiempos de visita a
                        ciertas páginas, información de interacción con la
                        página y métodos usados para salir de la página, así
                        como cualquier número de teléfono utilizado para
                        contactar a servicio al cliente.
                      </li>
                    </ul>
                  </li>
                  <li>
                    Información que recibimos de otras fuentes: Nosotros
                    podríamos recibir información acerca de usted si utiliza
                    cualquier otra página web operada por nosotros o asociada a
                    cualquier otro servicio provisto por nosotros. Nosotros
                    también podríamos recibir información de los bancos u otras
                    instituciones financieras utilizadas para transferir fondos.
                    También trabajamos cercanamente con terceras partes (como
                    por ejemplo, agencias de historial crediticio, proveedores
                    de análisis de datos, redes de publicidad, negocios aliados,
                    entre otros) y podríamos recibir información de ellos.
                  </li>
                </ul>
              </div>
            </div>

            <div className="w-full mt-6">
              <p className="mb-3 text-lg font-bold text-black-main">Cookies</p>
              <div className="w-full space-y-3">
                <p className="">
                  Nuestra página web utiliza cookies para distinguirlo de
                  cualquier otro usuario. Esto nos ayuda a brindarle una buena
                  experiencia cuando navegues por nuestra página web y, al mismo
                  tiempo, nos permite mejorarla. Los Cookies son pequeños
                  ficheros de información que se almacenan en tu ordenador o
                  dispositivo móvil. Esto es una práctica común en todos los
                  sitios web. Las cookies no se usan para identificarte
                  personalmente.
                </p>
                <p className="">
                  La utilización de nuestro sitio web implica su aceptación para
                  el uso de cookies por nuestra parte. Recuerda que es posible
                  desactivar las cookies almacenadas en su computadora cambiando
                  la configuración de su navegador. Sin embargo, esto podría
                  afectar el correcto funcionamiento de nuestra página web.
                </p>
              </div>
            </div>

            <div className="w-full mt-6">
              <p className="mb-3 text-lg font-bold text-black-main">
                Usos de la información recolectada
              </p>
              <div className="w-full space-y-3">
                <p className="">
                  ASSESSOR utilizamos la información de las siguientes formas:
                </p>
                <p className="mb-3 text-lg font-bold text-black-main">
                  Información proporcionada por el CLIENTE:
                </p>
                <ul className="pl-5 space-y-4 list-disc list-inside">
                  <li>
                    Para realizar nuestras obligaciones adquiridas en cualquier
                    contrato entre el CLIENTE y nosotros (incluyendo los
                    Términos y Condiciones) y para proveerle con información,
                    productos y servicios que requiera.
                  </li>
                  <li>
                    Para proveerle información sobre otros bienes y servicios
                    que ofrecemos y que son similares a aquellos que el CLIENTE
                    ya utiliza.
                  </li>
                  <li>
                    Para darle información sobre productos o servicios que
                    podrían interesarle.
                  </li>
                  <li>Para notificarle sobre cambios en nuestro servicio.</li>
                  <li>
                    Para asegurarnos que el contenido de la página web sea
                    presentado de la manera más efectiva para usted y su
                    computadora o dispositivo móvil.
                  </li>
                  <li>
                    Para cumplir con todos los requerimientos legales y
                    regulatorios impuestos por los entes relevantes.
                  </li>
                </ul>
                <p className="mb-3 text-lg font-bold text-black-main">
                  Información recolectada por ASSESSOR:
                </p>
                <ul className="pl-5 space-y-4 list-disc list-inside">
                  <li>
                    Para administrar nuestra página web y para operaciones
                    internas como solución de problemas operativos, análisis de
                    datos, pruebas, así como fines estadísticos y de
                    investigación.
                  </li>
                  <li>
                    Para mejorar nuestra página web y asegurarnos que el
                    contenido de la página web sea presentado de la manera más
                    efectiva para usted y su computadora o dispositivo móvil.
                  </li>
                  <li>
                    Para permitirle participar en partes interactivas de nuestro
                    servicios cuando usted desee hacerlo.
                  </li>
                  <li>
                    Para asegurar, mantener y mejorar la seguridad de la página
                    web.
                  </li>
                  <li>
                    Para medir y entender la efectividad de la publicidad
                    enviada a usted y a otros, con el fin de poder enviarle
                    publicidad relevante y adecuada a sus intereses.
                  </li>
                  <li>
                    Para realizarle recomendaciones a usted y otros usuarios de
                    la página web sobre otros bienes y servicios que podrían
                    interesarle.
                  </li>
                </ul>
                <p className="mb-3 text-lg font-bold text-black-main">
                  Información que recibimos de otras fuentes:
                </p>
                <p className="">
                  Nosotros podríamos combinar esta información con la
                  información brindada por el CLIENTE y con la información
                  recolectada. Esta información, y la información combinada,
                  podría ser usada para cualquiera de los fines mencionados
                  anteriormente.
                </p>
              </div>
            </div>

            <div className="w-full mt-6">
              <p className="mb-3 text-lg font-bold text-black-main">
                Revelación de su información
              </p>
              <div className="w-full space-y-3">
                <p className="">
                  ASSESSOR podría compartir la información personal del CLIENTE
                  con cualquier otro miembro de nuestro grupo, es decir
                  subsidiarias, holding o sus subsidiarias.
                </p>
                <p className="">
                  Podría compartir su información con terceros seleccionados,
                  incluyendo:
                </p>
                <ul className="pl-5 space-y-4 list-disc list-inside">
                  <li>
                    Negocios aliados, proveedores o terceros contratados para
                    proveer cualquier contrato que tengamos con usted o para
                    ayudar a mejorar nuestro servicio.
                  </li>
                  <li>
                    Agencias de publicidad que requieran datos para seleccionar
                    y enviar avisos relevantes al CLIENTE y a otros.
                  </li>
                  <li>
                    Proveedores de análisis de datos y de buscadores que nos
                    asistan en la mejora y optimización de nuestros servicios.
                  </li>
                  <li>
                    Entes reguladores como la Superintendencia de Banca y
                    Seguros y la Unidad de Inteligencia Financiera.
                  </li>
                </ul>
              </div>
            </div>

            <div className="w-full mt-6">
              <p className="mb-3 text-lg font-bold text-black-main">
                Información compartida con terceros
              </p>
              <div className="w-full space-y-3">
                <p className="">ASSESSOR podrá compartir información:</p>
                <ul className="pl-5 space-y-4 list-disc list-inside">
                  <li>
                    En el caso que se venda o compre cualquier unidad de negocio
                    o activo y sea necesario revelar su información personal a
                    potenciales compradores o vendedores de dichas unidades de
                    negocio o activos.
                  </li>
                  <li>
                    Si ASSESSOR o todos sus activos son adquiridos por un
                    tercero, caso en el cual información personal recolectada
                    sería uno de los activos a transferir.
                  </li>
                  <li>
                    Si es que estamos bajo obligación de revelar o compartir la
                    información personal del CLIENTE para cumplir con cualquier
                    obligación legal o para poder aplicar los Términos y
                    Condiciones o cualquier documento al cual se haga referencia
                    en estos, o para proteger los derechos, propiedad y
                    seguridad de ASSESSOR, nuestros usuarios u otros. Esto
                    incluye intercambiar información con otras compañías y
                    organizaciones con objetivos de protección frente a fraudes,
                    investigación relacionada crímenes financieros o proveer
                    datos para asistir al cumplimiento de la ley.
                  </li>
                </ul>
              </div>
            </div>

            <div className="w-full mt-6">
              <p className="mb-3 text-lg font-bold text-black-main">
                Dónde almacenamos la información personal
              </p>
              <div className="w-full space-y-3">
                <p className="mb-3">
                  La información recolectada podría ser transferida y almacenada
                  en un destino fuera del Perú. Esta podría ser también
                  procesada por trabajadores operando fuera del Perú que
                  trabajen para nosotros o para algún proveedor. Estos
                  trabajadores podrían estar asociados a actividades como la
                  provisión de servicios de soporte o de análisis de datos. Al
                  enviar su información personal el CLIENTE acepta estar de
                  acuerdo con esta transferencia, almacenamiento o
                  procesamiento. Nosotros tomaremos todas las medidas necesarias
                  para asegurarnos que su información sea tratada de forma
                  segura y de acuerdo con la Política de Privacidad.
                </p>
                <p className="mb-3">
                  Toda la información que nos envíe se almacena en nuestros
                  servidores seguros. Cualquier transacción de pago se
                  encriptará usando SSL y/o alguna otra tecnología de seguridad
                  cibernética. Usted es responsable de mantener la
                  confidencialidad de la contraseña seleccionada para acceder a
                  ciertas partes de la página web. Le pedimos no compartir su
                  contraseña con nadie ya que ASSESSOR no se hará responsable
                  ante la pérdida o robo de su contraseña.
                </p>
                <p className="mb-3">
                  Desafortunadamente la transmisión de información a través de
                  internet no es completamente segura. A pesar de que haremos el
                  mayor esfuerzo posible para proteger su información, no
                  podemos garantizar la seguridad de la información transmitida
                  a nuestra página web; cualquier transmisión es bajo su propio
                  riesgo. Una vez recibida la información, utilizamos
                  procedimientos estrictos y procesos de seguridad para evitar
                  cualquier acceso a esta sin autorización.
                </p>
                <p className="mb-3">
                  Nosotros no restringimos el acceso a su información personal a
                  empleados de ASSESSOR que tengan necesidad de conocerla por
                  razones asociadas a los servicios brindados. Continuamente
                  capacitamos a nuestros trabajadores sobre la importancia de la
                  confidencialidad y privacidad de la información de los
                  usuarios. Mantenemos procesos que cumplen con los
                  requerimientos legales para proteger su información personal
                  de cualquier acceso no autorizado.
                </p>
              </div>
            </div>

            <div className="w-full mt-6">
              <p className="mb-3 text-lg font-bold text-black-main">
                Derechos del Cliente
              </p>
              <div className="w-full space-y-3">
                <p className="">
                  El CLIENTE tiene el derecho de solicitarnos no procesar su
                  información para fines de marketing contactándonos a{" "}
                  <a
                    href="mailto:contacto@assessorperu.com"
                    className="text-blue-500"
                  >
                    contacto@assessorperu.com
                  </a>
                  .
                </p>
                <p className="">
                  Nuestra página web podría contener links a otras páginas web
                  de empresas aliadas, afiliadas o publicitarias. Si usted sigue
                  un link hacia cualquiera de estas páginas, por favor tenga en
                  cuenta que ellas tienen sus propias políticas de privacidad y
                  que nosotros no aceptamos ninguna responsabilidad por ellas.
                  Se recomienda revisar dichas políticas antes de enviar
                  información a cualquiera de esas páginas.
                </p>
                <p className="">
                  Dependiendo de las leyes aplicables, el CLIENTE podría tener
                  el derecho a acceder a la información que tenemos sobre él. Su
                  derecho al acceso podrá ser ejecutado de acuerdo a la
                  legislación de protección de información relevante. Cualquier
                  solicitud de acceso podría estar sujeta a una tarifa para
                  cubrir los costos asociados a brindarle dicha información.
                </p>
                <p className="">
                  Cualquier cambio que se realice a nuestra política de
                  privacidad en el futuro será publicada en esta página y
                  notificada a usted vía correo electrónico, de ser apropiado.
                  Se recomienda revisar frecuentemente esta página para ver
                  cualquier actualización o cambios a nuestra política de
                  privacidad.
                </p>
              </div>

              <p className="mt-6 mb-3 text-lg font-bold text-black-main">
                Marco Normativo
              </p>
              <div className="w-full space-y-3">
                <p className="">
                  Ley N° 29733 - Protección de Datos Personales.
                </p>
                <p className="">
                  Superintendencia de Banca, Seguros y AFP. (Ente regulador)
                </p>
              </div>

              <p className="mt-6 mb-3 text-lg font-bold text-black-main">
                Ley y Jurisdicción
              </p>
              <div className="w-full space-y-3">
                <p className="">
                  Esta política de privacidad y cualquier disputa o reclamo que
                  surjan como consecuencia de la misma se encuentra normada por
                  la ley peruana.
                </p>
                <p className="">
                  Las partes se someten, a su elección, para la resolución de
                  los conflictos y con renuncia a cualquier otro fuero, a los
                  juzgados y tribunales del domicilio del usuario.
                </p>
              </div>

              <p className="mt-6 mb-3 text-lg font-bold text-black-main">
                Contacto
              </p>
              <div className="w-full space-y-3">
                <p className="">
                  Preguntas, solicitudes y comentarios asociados a esta política
                  de privacidad son bienvenidos y deberán ser dirigidos a{" "}
                  <a
                    href="mailto:contacto@assessorperu.com"
                    className="text-blue-500"
                  >
                    contacto@assessorperu.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </ContentMain>
      </section>
      <Footer />
    </>
  );
}
