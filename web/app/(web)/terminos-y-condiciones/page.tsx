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
        title="Términos y condiciones"
      />
      <section className="w-full">
        <ContentMain className="py-20">
          {/* <h2 className="mb-8 text-3xl font-bold md:text-4xl text-secondary-main font_kanit">
            Términos y condiciones
          </h2> */}

          <div className="w-full max-w-3xl p-8 mx-auto shadow-main rounded-main">
            <p>ASSESSOR S.A.C.</p>
            <p className="my-3">Versión: 1.0</p>
            <p>
              Este es un contrato entre el usuario, en adelante “EL CLIENTE” y
              ASSESSOR S.A.C., en adelante “ASSESSOR”. Este contrato detalla los
              servicios que presta ASSESSOR.
            </p>

            <div className="w-full mt-6">
              <p className="mb-3 text-lg font-bold text-black-main">
                1. Empresa
              </p>
              <div className="w-full space-y-3">
                <p className="text-black-900">
                  ASSESSOR S.A.C., proveedor del servicio de cambio de divisas
                  en el Perú, es una sociedad debidamente registrada en la
                  Superintendencia Nacional de Administración Tributaria, en
                  adelante “SUNAT”, con RUC N° 20604122482, teniendo sus
                  oficinas en Jr. Morro Solar 420. Block B-6. Dpto. 201,
                  Chacarilla, Surco, Lima, Perú.
                </p>
                <p className="text-black-900">
                  ASSESSOR está autorizado por la Municipalidad de Santiago de
                  Surco e inscrito en la Superintendecia de Banca y Seguros y
                  AFPs. Asimismo, está supervisado en materia de prevención de
                  lavado de activos y financiamiento del terrorismo por
                  Superintendencia de Banca, Seguros y AFPs para realizar las
                  actividades económicas detalladas en el presente contrato.
                </p>
                <p className="text-black-900">
                  ASSESSOR se encuentra autorizada para operar como empresa
                  virtual de cambio de divisas por la Superintendencia de Banca,
                  Seguros y AFPs, en adelante “SBS”, a través de la Resolución
                  SBS N° 00853-2019.
                </p>
              </div>
            </div>
            <div className="w-full mt-6">
              <p className="mb-3 text-lg font-bold text-black-main">
                2. Servicio
              </p>
              <div className="w-full space-y-3">
                <p className="text-black-900">
                  ASSESSOR ofrece sus servicios a través de medios digitales,
                  donde cuenta con un portal en Internet{" "}
                  <span className="font-semibold">“assessorperu.com”</span> y
                  una aplicación móvil denominada{" "}
                  <span className="font-semibold">Assessor</span>, el cual en
                  adelante denominaremos en su conjunto como{" "}
                  <span className="font-semibold">“LAS APLICACIONES”</span>. LAS
                  APLICACIONES han sido creadas con la finalidad de brindar el
                  servicio de cambio de divisas en el Perú.
                </p>
                <p className="text-black-900">
                  Se denomina <span className="font-semibold">“CLIENTE”</span> a
                  todo usuario que se registra a través de cualquiera de LAS
                  APLICACIONES. Para hacer uso de los servicios de ASSESSOR, el
                  CLIENTE debe contar con una cuenta bancaria en una entidad
                  financiera supervisada por la SBS; es decir, debe aceptar
                  realizar transferencias y recepción de fondos a través de
                  entidades financieras.
                </p>
                <p className="text-black-900">
                  Tener en cuenta que los datos e información incluidos en LAS
                  APLICACIONES brindan elementos para la toma de decisión
                  financiera, por lo cual no deben tomarse como una asesoría o
                  sugerencia por parte de ASSESSOR para la compra o venta de
                  dólares o cualquier transacción o negocio.
                </p>
              </div>
            </div>
            <div className="w-full mt-6">
              <p className="mb-3 text-lg font-bold text-black-main">
                3. Objeto del contrato
              </p>
              <div className="w-full space-y-3">
                <p className="text-black-900">
                  Este contrato tiene como objeto que EL CLIENTE se informe de
                  la Política de Privacidad y los Términos y Condiciones de Uso
                  de ASSESSOR. En base a ello, le pedimos al CLIENTE que lea
                  cuidadosamente este contrato y se asegure que lo entiende
                  completamente antes de usar los servicios. El simple uso y
                  acceso a LAS APLICACIONES o uso de sus servicios digitales que
                  ASSESSOR pone a su disposición, se entenderá como la
                  aceptación de los mismos y por ende su compromiso para
                  respetar las condiciones de uso y la observancia de la
                  normativa que rige a las casas de cambio conforme a la
                  regulación del Perú. Le recomendamos a su vez, que guarde una
                  copia de este contrato.
                </p>
                <p className="text-black-900">
                  En el caso de que EL CLIENTE no esté de acuerdo con este
                  contrato deberá abstenerte de utilizar LAS APLICACIONES y
                  servicios asociados a ASSESSOR.
                </p>
              </div>
            </div>

            <div className="w-full mt-6">
              <p className="mb-3 text-lg font-bold text-black-main">
                4. Tarifas
              </p>
              <div className="w-full space-y-3">
                <p className="text-black-900">
                  ASSESSOR no realiza ningún cobro de comisión por el uso de sus
                  servicios.
                </p>
                <p className="text-black-900">
                  Sin embargo, EL CLIENTE debe considerar que existen cobros de
                  comisiones o impuesto a las transacciones financieras (ITF)
                  efectuados por las entidades financieras. Así también, cuando
                  EL CLIENTE solicite una transferencia a cuentas bancarias de
                  plazas distintas a Lima, ASSESSOR trasladará dichas comisión
                  de la entidad financiera, al CLIENTE.
                </p>
              </div>
            </div>

            <div className="w-full mt-6">
              <p className="mb-3 text-lg font-bold text-black-main">
                5. Propiedad Intelectual
              </p>
              <div className="w-full space-y-3">
                <p className="text-black-900">
                  ASSESSOR está protegido por los derechos de propiedad de
                  autor. Todos los derechos involucrados como por ejemplo el
                  contenido, el diseño visual, logos y eslogan que forman parte
                  del contenido y servicios, pertenecen a ASSESSOR. En base a
                  ello, se prohíbe utilizar, codificar, copiar, distribuir,
                  transmitir o comercializar los derechos involucrados sin el
                  permiso expreso por escrito.
                </p>
                <p className="text-black-900">
                  EL CLIENTE no adquiere ningún derecho de propiedad intelectual
                  por el uso de los Servicios y Contenidos de LAS APLICACIONES,
                  no siendo considerado una autorización ni licencia para
                  utilizar los servicios y contenidos con fines distintos a los
                  mencionados en el presente contrato.
                </p>
              </div>
            </div>

            <div className="w-full mt-6">
              <p className="mb-3 text-lg font-bold text-black-main">
                6. Seguridad
              </p>
              <ul className="w-full pl-10 space-y-3 list-disc ">
                <li className="text-black-900 ">
                  Proteger su privacidad es muy importante para ASSESSOR. El
                  acceso a los servicios se realiza a través de una contraseña
                  que EL CLIENTE ha asignado en el momento del registro a través
                  de cualquiera de LAS APLICACIONES de ASSESSOR. Por lo tanto,
                  EL CLIENTE es el único que conoce esta información. EL CLIENTE
                  no deberá revelar dicha información a terceros, habiendo sido
                  creada la cuenta para uso exclusivo de EL CLIENTE.
                </li>
                <li className="text-black-900">
                  ASSESSOR no revela los datos de su cuenta, direcciones
                  postales, correo electrónico, operaciones, datos personales a
                  terceros; excepto ante un mandato emitido por una autoridad
                  competente.
                </li>
                <li className="text-black-900">
                  Debe tener en cuenta que todas las actividades de registro de
                  EL CLIENTE, datos personales, cuentas, operaciones, entrega de
                  voucher, validación de recepción de fondos en las cuentas de
                  ASSESSOR, entre otros, están sujetos a todos los controles de
                  seguridad y de identificación del CLIENTE que se realizan de
                  acuerdo con nuestras Políticas de Privacidad y en observancia
                  a la normativa vigente de la SBS. Por tanto, si es necesaria
                  una verificación adicional, le informaremos, previo a
                  continuar realizando operaciones.
                </li>
                <li className="text-black-900">
                  ASSESSOR cuenta con una Política de Privacidad que forma parte
                  de los presentes Términos y Condiciones de Uso, por lo que se
                  recomienda AL CLIENTE leerlas previo al uso del servicio. Esta
                  Política es aplicada durante todo el proceso y el
                  mantenimiento de la información del CLIENTE y usuarios de LAS
                  APLICACIONES.
                </li>
              </ul>
            </div>
            <div className="w-full mt-6">
              <p className="mb-3 text-lg font-bold text-black-main">
                7. Horario de atención
              </p>
              <div className="w-full space-y-3">
                <p className="text-black-900">
                  El horario de atención de ASSESSOR es de lunes a viernes de
                  8:30 am a 6:00 pm y sábados de 9:00 am a 1:00 pm, siempre y
                  cuando sean días hábiles, es decir excluyendo feriados
                  locales. Por lo tanto, las operaciones y transferencias a ser
                  solicitadas por parte del CLIENTE deberán realizarse de
                  acuerdo a lo antes señalado.
                </p>
                <p className="text-black-900">
                  Si la transferencia del monto por parte del CLIENTE se realiza
                  a las cuentas de ASSESSOR fuera del horario de atención, la
                  operación podrá ser anulada o aceptada bajo las condiciones
                  que ASSESSOR considere pertinentes.
                </p>
              </div>
            </div>

            <div className="w-full mt-6">
              <p className="mb-3 text-lg font-bold text-black-main">
                8. Conceptos Generales
              </p>
              <div className="w-full space-y-3 text-black-900">
                <ul className="space-y-2 list-decimal list-inside">
                  <li>
                    <span className="font-semibold">Compra:</span> operación
                    donde EL CLIENTE hace la transferencia de una moneda
                    extranjera y ASSESSOR hace el cambio a soles.
                  </li>
                  <li>
                    <span className="font-semibold">Venta:</span> operación
                    donde EL CLIENTE hace la transferencia de soles y ASSESSOR
                    hace el cambio a una moneda extranjera.
                  </li>
                  <li>
                    <span className="font-semibold">BCP:</span> Banco de Crédito
                    del Perú, en adelante denominado BCP.
                  </li>
                  <li>
                    <span className="font-semibold">Interbank:</span> Banco
                    Internacional del Perú, en adelante denominado Interbank.
                  </li>
                  <li>
                    <span className="font-semibold">
                      Transferencias a cuentas del mismo banco:
                    </span>{" "}
                    cuando las cuentas origen o destino del CLIENTE son en
                    alguno de los bancos donde ASSESSOR también tiene cuentas
                    bancarias, se denomina una transferencia entre cuentas del
                    mismo banco. Es decir, cuando EL CLIENTE tiene cuentas en el
                    banco BCP e Interbank al igual que ASSESSOR.
                  </li>
                  <li>
                    <span className="font-semibold">
                      Transferencias interbancarias:
                    </span>{" "}
                    cuando las transferencias son entre cuentas de distintos
                    bancos locales. Es decir, cuando EL CLIENTE tiene cuentas en
                    otros bancos distintos al BCP e Interbank como los tiene
                    ASSESSOR.
                  </li>
                  <li>
                    <span className="font-semibold">
                      Transferencias inmediatas:
                    </span>{" "}
                    transferencias interbancarias que se pueden ejecutar en un
                    plazo aproximado de quince (15) minutos, donde la entidad
                    financiera establecerá una comisión por dicho servicio que
                    EL CLIENTE deberá asumir.
                  </li>
                  <li>
                    <span className="font-semibold">
                      Transferencias regulares:
                    </span>{" "}
                    transferencias interbancarias que pueden tener una comisión
                    cobrada por la entidad financiera, y puede tomar hasta
                    cuarenta y ocho (48) horas llegar a la cuenta destino una
                    vez ejecutada dicha transferencia por EL CLIENTE. El tiempo
                    de la transferencia dependerá del momento en que EL CLIENTE
                    ejecutó su transferencia desde su banco y los horarios de
                    transferencias interbancarias establecidas por la entidad
                    financiera (de la cuenta origen y la cuenta destino).
                  </li>
                  <li>
                    <span className="font-semibold">
                      Transferencias interplaza:
                    </span>{" "}
                    ASSESSOR trabaja con cuentas del banco BCP a nivel nacional
                    y para todo el resto de bancos sólo trabaja con cuentas de
                    Lima. Cualquier comisión de las entidades financieras por el
                    traslado de fondos a una plaza distinta a la de Lima deberá
                    ser asumido por EL CLIENTE.
                  </li>
                  <li>
                    <span className="font-semibold">
                      Plazo de recepción de fondos:
                    </span>{" "}
                    el tiempo total de espera entre que EL CLIENTE registra la
                    operación en LAS APLICACIONES, se realiza la transferencia y
                    depósito del fondo en las cuentas de ASSESSOR.
                  </li>
                </ul>
              </div>
            </div>

            <div className="w-full mt-6">
              <p className="mb-3 text-lg font-bold text-black-main">
                9. Registro
              </p>
              <div className="w-full space-y-6 text-black-900">
                <div>
                  <p className="font-semibold">9.1. Registro de Usuario</p>
                  <ul className="mt-2 space-y-2 list-disc list-inside">
                    <li>
                      EL CLIENTE para hacer uso de LAS APLICACIONES y los
                      servicios de ASSESSOR, debe declarar tener al menos
                      dieciocho (18) años de edad cumplidos; cuya nacionalidad
                      podrá ser peruana o extranjera con residencia en Perú, con
                      un documento de identidad asignado por entidades peruanas
                      y contar con capacidad legal para celebrar contratos.
                    </li>
                    <li>
                      EL CLIENTE declara y garantiza que el usuario aperturado
                      en LAS APLICACIONES de ASSESSOR, es para su uso personal o
                      a nombre de la empresa que representa.
                    </li>
                    <li>
                      Para el caso de que EL CLIENTE sea una persona natural,
                      declara que no está actuando en nombre de un tercera
                      persona.
                    </li>
                    <li>
                      Para el caso de que EL CLIENTE sea una persona jurídica,
                      declara que los datos consignados son verídicos y vigentes
                      respecto a: persona responsable de contacto para el
                      registro y operación, información del representante legal
                      e información actualizada de la empresa.
                    </li>
                    <li>
                      EL CLIENTE, al crear un usuario en LAS APLICACIONES deberá
                      registrar un correo electrónico personal y una clave
                      segura, la cual será de su exclusiva responsabilidad no
                      compartirla.
                    </li>
                    <li>
                      EL CLIENTE deberá registrar sus datos personales y de
                      contacto (como persona natural o como responsable de la
                      empresa registrada), lo cual incluye adjuntar un documento
                      de identidad (digitalizado). En base a ello, EL CLIENTE
                      nos brinda su consentimiento para hacer uso de sus datos
                      personales, para la verificación de identidad y
                      operaciones de tipo de cambio acordadas.
                    </li>
                    <li>
                      Asimismo, ASSESSOR podrá solicitar información adicional
                      para el registro del usuario, en caso la información
                      enviada no sea legible o no sea suficiente para probar que
                      actúa en nombre de la persona natural o jurídica que se
                      indica.
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">
                    9.2. Registro de Cuentas Bancarias
                  </p>
                  <ul className="mt-2 space-y-2 list-disc list-inside">
                    <li>
                      EL CLIENTE deberá registrar datos de la cuenta bancaria,
                      tanto en soles como en moneda extranjera.
                    </li>
                    <li>
                      En ASSESSOR aceptamos cuentas de las siguientes entidades
                      financieras:
                      <ul className="pl-5 mt-1 space-y-1 list-disc list-inside">
                        <li>BCP, generados a nivel nacional.</li>
                        <li>
                          Interbank, generados en el departamento de Lima -
                          Perú.
                        </li>
                        <li>
                          Otros Bancos, generados en el departamento de Lima -
                          Perú. Para este tipo de transferencias se solicitará
                          el código de cuenta interbancaria y será EL CLIENTE
                          quien asuma los costos de la comisión interbancaria,
                          en caso de existir, cobrada por su entidad financiera.
                        </li>
                      </ul>
                    </li>
                    <li>
                      ASSESSOR no será responsable del bloqueo de cuentas
                      bancarias registradas por el CLIENTE en una entidad
                      financiera o por otra situación similar a esta.
                    </li>
                    <li>
                      ASSESSOR no será responsable por las comisiones cobradas
                      por las entidades financieras por concepto de
                      transferencia inmediata o transferencia regular, en el
                      momento de la transferencia a cuentas de ASSESSOR.
                    </li>
                    <li>
                      En caso de que EL CLIENTE no tenga cuentas bancarias en
                      Lima y opere con una cuenta distinta a la del banco BCP,
                      ASSESSOR deducirá del monto a enviar los costos bancarios
                      asociados al envío del dinero.
                    </li>
                    <li>
                      ASSESSOR no será responsable por los tiempos de
                      transferencia de dinero desde la cuenta del CLIENTE a la
                      cuenta de ASSESSOR, en que la entidad financiera incurra;
                      sea esto para el caso de una transferencia a cuentas del
                      mismo banco o interbancaria.
                    </li>
                    <li>
                      ASSESSOR no será responsable de errores, gastos,
                      comisiones o tiempos incurridos debidos a errores del
                      CLIENTE donde este transfiera a otra cuenta de la
                      especificada por ASSESSOR.
                    </li>
                    <li>
                      ASSESSOR no será responsable de errores, gastos,
                      comisiones o tiempos incurridos debidos a errores del
                      CLIENTE donde este transfiera de una cuenta de una moneda
                      a otra cuenta en una moneda diferente.
                    </li>
                    <li>
                      ASSESSOR podrá solicitar el registro de información
                      adicional, a fin de cumplir con la normativa que rige la
                      Ley de Prevención de Lavado de Activos y del
                      Financiamiento del Terrorismo (PLAFT).
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="w-full mt-6">
              <p className="mb-3 text-lg font-bold text-black-main">
                10. Verificación
              </p>
              <div className="w-full space-y-3 text-black-900">
                <ul className="space-y-2 list-disc list-inside">
                  <li>
                    ASSESSOR es una empresa que cumple con la normativa vigente
                    de PLAFT otorgada por la Unidad de Inteligencia Financiera
                    (UIF-SBS) y por lo tanto, ASSESSOR realizará la verificación
                    de los datos personales y, de ser necesario, establecerá
                    contacto con EL CLIENTE en cualquier momento que lo
                    considere pertinente.
                  </li>
                  <li>
                    ASSESSOR podrá solicitarle información adicional necesaria
                    para verificar la identidad del CLIENTE.
                  </li>
                  <li>
                    ASSESSOR se reserva el derecho de acceder a otras fuentes de
                    información para verificar la información proporcionada por
                    EL CLIENTE. Si ciertas bases de datos proporcionan una
                    coincidencia con la información que usted proporciona, podrá
                    operar sin ningún inconveniente.
                  </li>
                  <li>
                    ASSESSOR se reserva el derecho de admitir a un nuevo
                    CLIENTE, de llevar a cabo una operación, total o
                    parcialmente, a su entera discreción.
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-full mt-6">
              <p className="mb-3 text-lg font-bold text-black-main">
                11. Cuentas duplicadas
              </p>
              <div className="w-full space-y-3 text-black-900">
                <p>
                  ASSESSOR no permite la creación de cuentas de usuario
                  duplicadas para un mismo CLIENTE, debido a los requisitos de
                  seguridad y de identificación del CLIENTE. En caso de que se
                  detecten cuentas duplicadas, ASSESSOR cerrará o fusionará
                  estas cuentas de usuario duplicadas sin notificación previa.
                  Por lo cual, ASSESSOR queda exenta de todo tipo de
                  responsabilidad por esa situación.
                </p>
              </div>
            </div>
            <div className="w-full mt-6">
              <p className="mb-3 text-lg font-bold text-black-main">
                12. Operación de cambio de moneda
              </p>
              <div className="w-full space-y-6 text-black-900">
                <div className="space-y-3">
                  <p className="font-semibold">
                    12.1. Registro de una operación y recepción de fondos
                  </p>
                  <p>
                    Para registrar una operación, EL CLIENTE lo debe hacer
                    usando su cuenta de usuario a través de alguna de LAS
                    APLICACIONES de ASSESSOR, que lo identifica como EL CLIENTE;
                    u otros canales digitales que ASSESSOR ponga a disposición.
                  </p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>
                      EL CLIENTE indicará el monto a transferir y el tipo de
                      operación (compra o venta).
                    </li>
                    <li>
                      EL CLIENTE está obligado a indicarnos el origen de los
                      fondos en base a la normativa vigente de prevención de
                      lavado de activos y financiamiento de terrorismo, y esta
                      indicación tendrá validez de una declaración jurada.
                    </li>
                    <li>
                      EL CLIENTE indicará la cuenta bancaria de origen y destino
                      a utilizar para esta operación, estas cuentas podrían ser
                      previamente registradas o registrarse en el momento de la
                      operación. Para bancos distintos a BCP o Interbank, deberá
                      registrar su CCI.
                    </li>
                  </ul>
                  <p>
                    Cuando se hayan completado estos pasos se dará por
                    registrada la operación, estableciéndose desde este momento
                    un acuerdo de cambio de dólares entre EL CLIENTE y ASSESSOR.
                  </p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>
                      EL CLIENTE deberá transferir el monto desde su cuenta
                      bancaria previamente registrada hacia la cuenta de
                      ASSESSOR en un tiempo máximo de quince (15) minutos desde
                      el registro de la operación.
                    </li>
                    <li>
                      EL CLIENTE deberá enviar el voucher de la transferencia al
                      correo <strong>pagos@assessorperu.com</strong>.
                    </li>
                    <li>
                      Las transferencias deben realizarse desde cuentas
                      personales o empresariales registradas. No se aceptan
                      depósitos en efectivo ni cheques.
                    </li>
                  </ul>
                  <p>
                    ASSESSOR no se hace responsable del tiempo de transferencia
                    de fondos por parte de las entidades financieras.
                  </p>
                  <p>Para operaciones interbancarias:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>
                      EL CLIENTE deberá asumir el costo de la transferencia
                      inmediata y ejecutarla dentro del horario interbancario
                      (lunes a viernes de 8:30 am a 3:45 pm, días hábiles).
                    </li>
                    <li>
                      Si se opta por una transferencia regular y el fondo se
                      recibe luego de las 18:00 horas del día de registro, se
                      puede aplicar lo estipulado en la cláusula 12.2.
                    </li>
                  </ul>
                  <p>
                    ASSESSOR puede informar sobre operaciones sospechosas
                    conforme a la normativa de la SBS.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="font-semibold">
                    12.2. Operaciones interbancarias
                  </p>
                  <p>
                    ASSESSOR recomienda que las transferencias interbancarias
                    sean inmediatas y dentro del horario bancario. Si EL CLIENTE
                    realiza una transferencia regular y esta excede las 18:00
                    horas del día de registro, ASSESSOR podrá anular la
                    operación.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="font-semibold">
                    12.3. Transferencias a la cuenta destino
                  </p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>
                      ASSESSOR realizará la transferencia del monto acordado a
                      la cuenta destino previamente registrada del CLIENTE.
                    </li>
                    <li>
                      ASSESSOR no se hace responsable del tiempo de
                      transferencia de fondos por parte de las entidades
                      financieras.
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <p className="font-semibold">
                    12.4. Acuerdo de tipo de cambio
                  </p>
                  <p>
                    El tipo de cambio se fija al momento del registro de la
                    operación por EL CLIENTE en LAS APLICACIONES. Tendrá
                    vigencia máxima de:
                  </p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>15 minutos para realizar la transferencia.</li>
                    <li>
                      Hasta las 18:00 horas del día de registro para operaciones
                      interbancarias.
                    </li>
                  </ul>
                  <p>
                    El “plazo de recepción de fondos” comprende desde el
                    registro hasta la recepción de fondos por ASSESSOR.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="font-semibold">
                    12.5. Anulación de transacciones
                  </p>
                  <p>
                    Si EL CLIENTE no transfiere a tiempo, ASSESSOR podrá anular
                    la operación. En ese caso:
                  </p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>
                      EL CLIENTE podrá aceptar un nuevo tipo de cambio, según la
                      hora de recepción del fondo.
                    </li>
                    <li>
                      O solicitar la devolución del monto, asumiendo los costos
                      que ello implique.
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <p className="font-semibold">12.6. Límites de cambio</p>
                  <p>
                    ASSESSOR se reserva el derecho de establecer límites en
                    función del mercado. Si esto ocurre, se informará al CLIENTE
                    antes de ejecutar la transferencia.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="font-semibold">
                    12.7. Cancelación de transacciones
                  </p>
                  <p>
                    Una vez registrada la operación y realizada la
                    transferencia, el proceso de cambio es irreversible e
                    irreivindicable.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full mt-6">
              <p className="mb-3 text-lg font-bold text-black-main">
                13. Términos Generales
              </p>
              <div className="w-full space-y-6 text-black-900">
                <div className="space-y-3">
                  <p className="font-semibold">13.1. Comunicaciones</p>
                  <p>
                    Al aceptar este contrato, aceptas que podamos comunicarnos
                    por: teléfono, correo electrónico, WhatsApp o publicando
                    avisos en LAS APLICACIONES.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="font-semibold">
                    13.2. Quejas, Reclamos y Solicitudes
                  </p>
                  <p>
                    Estamos comprometidos a proporcionarle AL CLIENTE los más
                    altos estándares de servicio. Puede encontrar información
                    sobre nuestro procedimiento de reclamaciones aquí.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="font-semibold">
                    13.3. Disponibilidad del servicio
                  </p>
                  <p>
                    LAS APLICACIONES estarán disponibles salvo que existan
                    circunstancias de fuerza mayor, caso fortuito o hechos de
                    terceros que impidan o restrinjan el acceso o uso del
                    servicio, lo cual puede incluir, pero no se limita a,
                    cambios regulatorios.
                  </p>
                  <p>
                    ASSESSOR no será responsable por ningún daño o pérdida de
                    cualquier naturaleza debido a la falta de disponibilidad o
                    continuidad de LAS APLICACIONES, Servicios o Contenidos.
                  </p>
                  <p>
                    En estos casos, para operaciones en curso con transferencia
                    completada, ASSESSOR procederá a la devolución de los fondos
                    transferidos en el menor plazo posible.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="font-semibold">
                    13.4. Marcas, Patentes y Logotipos
                  </p>
                  <p>
                    Las marcas, patentes, slogans y logotipos que aparecen en
                    este sitio son de propiedad de ASSESSOR. Se prohíbe su uso
                    sin consentimiento escrito previo.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="font-semibold">
                    13.5. Actualización de las Condiciones
                  </p>
                  <p>
                    ASSESSOR podrá actualizar estos términos y condiciones
                    debido a cambios regulatorios o ajustes del servicio. Toda
                    actualización será efectiva desde su publicación en LAS
                    APLICACIONES.
                  </p>
                  <p>
                    ASSESSOR realizará los esfuerzos necesarios para notificar
                    estas actualizaciones a EL CLIENTE a través del correo
                    registrado o publicaciones dentro de LAS APLICACIONES.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="font-semibold">13.6. Acuerdo completo</p>
                  <p>
                    Este contrato y cualquier documento mencionado en él
                    constituye el acuerdo completo entre EL CLIENTE y ASSESSOR,
                    reemplazando cualquier entendimiento previo.
                  </p>
                  <p>
                    Para su interpretación, cumplimiento y ejecución, se
                    aplicarán las leyes vigentes en la República del Perú. Ambas
                    partes se someten a la jurisdicción de los Jueces y
                    Tribunales de Lima, Perú, renunciando a cualquier otro
                    fuero.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ContentMain>
      </section>
      <Footer />
    </>
  );
}
