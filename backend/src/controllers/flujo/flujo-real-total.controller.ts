import { obtenerTotalOperacionCacluloFLUJO } from "../../controllers/operaciones/operaciones.controller";
import { Request, Response } from "express";
import { getTotalPrestamosFLUJO } from "../../controllers/prestamos/prestamos.controller";
import { obtenerLeasingCacluloFLUJO } from "../../controllers/leasing/leasing.controller";
import { recopilarGastosAnioFLUJO } from "../../controllers/gastos/recopilacionGastos.controller";
import { obtenerImpuestosAnualesSoles } from "../../controllers/gastos/gastos.controller";
import * as XLSX from "xlsx";
import prisma from "../../config/database";

function normalizeConcept(s: string) {
  return s
    .normalize("NFD") // separa acentos de letras
    .replace(/[\u0300-\u036f]/g, "") // elimina marcas de acentuación
    .replace(/[^a-z0-9]/gi, "") // elimina todo lo que no sea letra o número
    .toLowerCase(); // a minúsculas
}

export const depurando = async (req: Request, res: Response): Promise<any | undefined> => {
  try {
    await recopilarGastosAnioFLUJO("2025");
    return res.status(200).json({ message: "ok" });
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
};

export const getFlujoREALTOTAL = async (req: Request, res: Response): Promise<any | undefined> => {
  try {
    const anio = parseInt(req.query.anio as string) || 2025;

    const montoCambiado = await obtenerTotalOperacionCacluloFLUJO(String(anio));

    const prestamosData = await getTotalPrestamosFLUJO(String(anio));

    const leasingData = await obtenerLeasingCacluloFLUJO(String(anio));

    const gastosRecopilacion = await recopilarGastosAnioFLUJO(String(anio));

    console.log(gastosRecopilacion.data);

    const flujoAnualFormatted: any = {
      anio: anio,
      rows: [],
      dates: [
        "Mes",
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ],
    };

    const meses = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];

    const newResultados: { [key: string]: any } = {};
    meses.forEach((mes, index) => {
      newResultados[mes] = {
        monto: Number(montoCambiado[index]?.dolares || 0),
        tc: 0,
        ingresosPorDivisas: Number(montoCambiado[index]?.medio || 0),
        ingresosPorPrestamos: Number(prestamosData[index]?.totalGanancia || 0),
        leasing: Number(Number(leasingData[index]?.rendimiento?.toFixed(2)) || 0),
        consultoria: 0,
        ingresos: Number(
          Number(
            (montoCambiado[index]?.medio || 0) +
              (prestamosData[index]?.totalGanancia || 0) +
              (leasingData[index]?.rendimiento || 0)
          ).toFixed(2)
        ),
        personal: 0,
        liderOperaciones: 0,
        asistente1: 0,
        asistente2: 0,
        asistente3: 0,
        asistente4: 0,
        asistente5: 0,
        eps: 0,
        impuestosDetracciones: 0,
        cts: 0,
        servicios: 0,
        internet: 0,
        celular: 0,
        serviciosStaff: 0,
        oficina: 0,
        facturecElectr: 0,
        gestionRiesgo: 0,
        contabilidad: 0,
        alquilerVehiculos: 0,
        ti: 0,
        otros: 0,
        gastos: 0,
        divisas: 0,
        prestamo: 0,
        leasingGasto: 0,
        gastosBancarios: 0,
        itfSoles: 0,
        itfDolares: 0,
        otrosGastosTotal: 0,
        mantenimientoSoles: 0,
        mantenimientoDolares: 0,
        interbancarioSoles: 0,
        interbancarioDolares: 0,
        serviciosFondos: 0,
        interesFondosSoles: 0,
        interesFondosDolares: 0,
        marketing: 0,
        combustible: 0,
        redesSociales: 0,
        sistemas: 0,
        publicidad: 0,
        viajesEventosOtros: 0,
        cargos: 0,
        mantenimientoCtas: 0,
        pagoDeuda: 0,
        utilidadOperativa: 0,
        impuestos: 0,
        utilidadNeta: 0,
        flujoDeCaja: 0,
      };
    });

    /*
    const conceptosBancariosSoles = ["ITF S/.", "Mantto S/.", "Interbancarios S/."];
    const conceptosBancariosDolares = ["ITF $", "Mantto $", "Interbancarios $"];
    */
    /*
    const filasBancarias = gastosRecopilacion.data.filter((item: any) =>
      conceptosBancariosSoles.includes(item.concept)
    );
    const filasBancariasDolares = gastosRecopilacion.data.filter((item: any) =>
      conceptosBancariosDolares.includes(item.concept)
    );
    */
    /*
    const gastosFuncionamientoData = gastosRecopilacion.data.filter(
      (gasto: any) => gasto.tipo_gasto === "FUNCIONAMIENTO"
    );
    */
    const gastosStaffData = gastosRecopilacion.data.filter(
      (gasto: any) =>
        gasto.concept === "PAGO COMBUSTIBLE" ||
        gasto.concept === "PAGO ALQUILER AUTO" ||
        gasto.concept === "PAGO GASTOS EXTRAS" ||
        gasto.concept === "PAGO VIAJES/EVENTO/OTROS"
    );

    const gastosCargosData = gastosRecopilacion.data.filter(
      (gasto: any) => gasto.tipo_gasto === "CARGOS"
    );

    // console.log(gastosRecopilacion);
    // console.log("RECOGIDO DE BD:", gastosRecopilacion.data);
    for (let i = 0; i < 12; i++) {
      const mesNombre = meses[i];

      // Depuración: revisar los valores que vienen de la base
      // const interbancarioSolesRaw = gastosRecopilacion.data.find(
      //   (item: { concept: string }) => item.concept === "Interbancarios S/."
      // )?.[mesNombre];

      // const interbancarioDolaresRaw = gastosRecopilacion.data.find(
      //   (item: { concept: string }) => item.concept === "Interbancarios $"
      // )?.[mesNombre];

      // const tcValue = gastosRecopilacion.data.find(
      //   (item: { concept: string }) => item.concept === "TC"
      // )?.[mesNombre];

      // console.log({
      //   mes: mesNombre,
      //   tcValue,
      // });

      // console.log({
      //   mes: mesNombre,
      //   interbancarioSolesRaw,
      //   interbancarioDolaresRaw,
      //   tc: newResultados.tc,
      // });
      /*
      const gastoSoles = filasBancarias.reduce((acum: number, fila: any) => {
        const valor = fila[mesNombre];
        return acum + (typeof valor === "number" ? valor : 0);
      }, 0);

      const gastoDolaresConvertido = filasBancariasDolares.reduce(
        (acum: number, fila: any) => {
          const valor = fila[mesNombre];
          return (
            acum +
            (typeof valor === "number" ? valor * Number(mesData?.promedio || 0) : 0)
          );
        },
        0
      );
      */
      newResultados[mesNombre].tc =
        parseFloat(
          gastosRecopilacion.data.find((item: { concept: string }) => item.concept === "TC")?.[
            mesNombre
          ]
        ) || 0;
      newResultados[mesNombre].itfSoles =
        parseFloat(
          gastosRecopilacion.data.find((item: { concept: string }) => item.concept === "ITF S/.")?.[
            mesNombre
          ]
        ) || 0;
      newResultados[mesNombre].itfDolares =
        parseFloat(
          gastosRecopilacion.data.find((item: { concept: string }) => item.concept === "ITF $")?.[
            mesNombre
          ]
        ) || 0;
      newResultados[mesNombre].mantenimientoSoles =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "Mantto S/."
          )?.[mesNombre]
        ) || 0;
      newResultados[mesNombre].mantenimientoDolares =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "Mantto $"
          )?.[mesNombre]
        ) || 0;
      newResultados[mesNombre].interbancarioSoles =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "Interbancarios S/."
          )?.[mesNombre]
        ) || 0;
      // newResultados[mesNombre].interbancarioDolares =
      //   parseFloat(
      //     gastosRecopilacion.data.find(
      //       (item: { concept: string }) => item.concept === "Interbancarios $"
      //     )?.[mesNombre]
      //   ) || 0 * Number(newResultados.tc || 1);

      newResultados[mesNombre].interbancarioDolares =
        (parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "Interbancarios $"
          )?.[mesNombre] || "0"
        ) || 0) * Number(newResultados.tc || 1);
      // newResultados[mesNombre].gastosBancarios =
      //   Math.abs(Number(newResultados[mesNombre].itfSoles)) +
      //   Math.abs(
      //     Number(newResultados[mesNombre].itfDolares) * Number(newResultados[mesNombre].tc || 1)
      //   ) +
      //   Math.abs(Number(newResultados[mesNombre].mantenimientoSoles)) +
      //   Math.abs(
      //     Number(newResultados[mesNombre].mantenimientoDolares) *
      //       Number(newResultados[mesNombre].tc || 1)
      //   ) +
      //   Math.abs(Number(newResultados[mesNombre].interbancarioSoles)) +
      //   Math.abs(
      //     Number(newResultados[mesNombre].interbancarioDolares) *
      //       Number(newResultados[mesNombre].tc || 1)
      //   );
      // newResultados[mesNombre].gastosBancarios =
      //   Math.abs(Number(newResultados[mesNombre].itfSoles)) +
      //   Math.abs(
      //     Number(newResultados[mesNombre].itfDolares) * Number(newResultados[mesNombre].tc || 1)
      //   ) +
      //   Math.abs(Number(newResultados[mesNombre].mantenimientoSoles)) +
      //   Math.abs(
      //     Number(newResultados[mesNombre].mantenimientoDolares) *
      //       Number(newResultados[mesNombre].tc || 1)
      //   ) +
      //   Math.abs(Number(newResultados[mesNombre].interbancarioSoles)) +
      //   Math.abs(Number(newResultados[mesNombre].interbancarioDolares));

      newResultados[mesNombre].gastosBancarios =
        Math.abs(Number(newResultados[mesNombre].itfSoles)) +
        Math.abs(
          Number(newResultados[mesNombre].itfDolares) * Number(newResultados[mesNombre].tc || 1)
        ) +
        Math.abs(Number(newResultados[mesNombre].mantenimientoSoles)) +
        Math.abs(
          Number(newResultados[mesNombre].mantenimientoDolares) *
            Number(newResultados[mesNombre].tc || 1)
        ) +
        Math.abs(Number(newResultados[mesNombre].interbancarioSoles)) +
        Math.abs(
          Number(newResultados[mesNombre].interbancarioDolares) *
            Number(newResultados[mesNombre].tc || 1)
        );

      newResultados[mesNombre].asistente1 =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "ASISTENTE 1"
          )?.[mesNombre]
        ) || 0;
      newResultados[mesNombre].asistente2 =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "ASISTENTE 2"
          )?.[mesNombre]
        ) || 0;
      newResultados[mesNombre].asistente3 =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "ASISTENTE 3"
          )?.[mesNombre]
        ) || 0;
      newResultados[mesNombre].asistente4 =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "ASISTENTE 4"
          )?.[mesNombre]
        ) || 0;
      newResultados[mesNombre].asistente5 =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "ASISTENTE 5"
          )?.[mesNombre]
        ) || 0;
      newResultados[mesNombre].eps =
        parseFloat(
          gastosRecopilacion.data.find((item: { concept: string }) => item.concept === "EPS")?.[
            mesNombre
          ]
        ) || 0;
      newResultados[mesNombre].cts =
        parseFloat(
          gastosRecopilacion.data.find((item: { concept: string }) => item.concept === "CTS")?.[
            mesNombre
          ]
        ) || 0;
      newResultados[mesNombre].afp = Number(
        parseFloat(
          gastosRecopilacion.data.find((item: { concept: string }) => item.concept === "AFP")?.[
            mesNombre
          ]
        ) || 0
      );
      newResultados[mesNombre].personal = Number(
        Number(
          Number(newResultados[mesNombre].asistente1) +
            Number(newResultados[mesNombre].asistente2) +
            Number(newResultados[mesNombre].asistente3) +
            Number(newResultados[mesNombre].asistente4) +
            Number(newResultados[mesNombre].asistente5) +
            Math.abs(Number(newResultados[mesNombre].eps)) +
            Math.abs(Number(newResultados[mesNombre].cts)) +
            Math.abs(Number(newResultados[mesNombre].afp))
        ).toFixed(2)
      );

      newResultados[mesNombre].internet = Math.abs(
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "Internet"
          )?.[mesNombre]
        ) || 0
      );
      newResultados[mesNombre].celular = Math.abs(
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "Celulares"
          )?.[mesNombre]
        ) || 0
      );
      newResultados[mesNombre].oficina =
        parseFloat(
          gastosRecopilacion.data.find((item: { concept: string }) => item.concept === "Oficina")?.[
            mesNombre
          ]
        ) || 0;
      // newResultados.ti = Math.abs(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "TI - Facturación")?.[mesNombre]) || 0);
      newResultados[mesNombre].facturecElectr =
        Math.abs(
          parseFloat(
            gastosRecopilacion.data.find(
              (item: { concept: string }) => item.concept === "TI - Facturación"
            )?.[mesNombre]
          ) || 0
        ) || 0;
      newResultados[mesNombre].gestionRiesgo =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "Cumplimiento"
          )?.[mesNombre]
        ) || 0;
      newResultados[mesNombre].contabilidad = Math.abs(
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "Contabilidad"
          )?.[mesNombre]
        ) || 0
      );
      newResultados[mesNombre].marketing =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "Marketing/Comercial"
          )?.[mesNombre]
        ) || 0;
      newResultados[mesNombre].otros =
        parseFloat(
          gastosRecopilacion.data.find((item: { concept: string }) => item.concept === "Otros")?.[
            mesNombre
          ]
        ) || 0;
      newResultados[mesNombre].otrosGastos = Math.abs(
        gastosStaffData.reduce(
          (acc: number, gasto: { [x: string]: string }) =>
            acc + (parseFloat(gasto[mesNombre]) || 0),
          0
        )
      );
      // newResultados.servicios = gastosFuncionamientoData.reduce((acc: number, gasto: { [x: string]: string; }) => acc + (parseFloat(gasto[mesNombre]) || 0), 0) * (newResultados.porcentajeServicios/100);
      newResultados[mesNombre].servicios = Number(
        Number(
          Number(newResultados[mesNombre].internet) +
            Number(newResultados[mesNombre].celular) +
            Number(newResultados[mesNombre].oficina) +
            Number(newResultados[mesNombre].facturecElectr) +
            Number(newResultados[mesNombre].gestionRiesgo) +
            Number(newResultados[mesNombre].contabilidad) +
            Number(newResultados[mesNombre].marketing) +
            Number(newResultados[mesNombre].internet) +
            Number(newResultados[mesNombre].ti)
        ).toFixed(2)
      );

      newResultados[mesNombre].combustible = Number(
        gastosRecopilacion.data.find(
          (gasto: { concept: string }) => gasto.concept === "Combustible"
        )?.[mesNombre] || 0
      );
      newResultados[mesNombre].alquilerVehiculos = Number(
        gastosRecopilacion.data.find(
          (gasto: { concept: string }) => gasto.concept === "Alquiler Autos"
        )?.[mesNombre] || 0
      );
      newResultados[mesNombre].gastosExtras = Number(
        gastosRecopilacion.data.find(
          (gasto: { concept: string }) => gasto.concept === "Gastos Extras"
        )?.[mesNombre] || 0
      );
      newResultados[mesNombre].viajesEventosOtros = Number(
        gastosRecopilacion.data.find(
          (gasto: { concept: string }) => gasto.concept === "Viajes/eventos/Otros"
        )?.[mesNombre] || 0
      );

      newResultados[mesNombre].serviciosStaff =
        Number(newResultados[mesNombre].combustible) +
        Number(newResultados[mesNombre].alquilerVehiculos) +
        Number(newResultados[mesNombre].gastosExtras) +
        Number(newResultados[mesNombre].viajesEventosOtros);

      newResultados[mesNombre].cargos = gastosCargosData.reduce(
        (acc: number, gasto: { [x: string]: string }) => acc + (parseFloat(gasto[mesNombre]) || 0),
        0
      );
      newResultados[mesNombre].mantenimientoCtas =
        gastosCargosData.find(
          (gasto: { concept: string }) => gasto.concept?.trim() === "Mantenimiento Ctas."
        )?.[mesNombre] || 0;
      newResultados[mesNombre].pagoDeuda =
        gastosCargosData.find(
          (gasto: { concept: string }) => gasto.concept?.trim() === "Pago de Deuda"
        )?.[mesNombre] || 0;

      newResultados[mesNombre].interesFondosSoles =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "Interes x Fondo S/. "
          )?.[mesNombre]
        ) || 0;
      newResultados[mesNombre].interesFondosDolares =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "Interes x Fondo $ "
          )?.[mesNombre]
        ) || 0;
      newResultados[mesNombre].serviciosFondos =
        (parseFloat(newResultados[mesNombre].interesFondosSoles) || 0) +
        (parseFloat(newResultados[mesNombre].interesFondosDolares) || 0) *
          Number(newResultados[mesNombre].tc || 1);

      newResultados[mesNombre].impuestosDetracciones = Number(
        gastosRecopilacion.data.find(
          (gasto: { concept: string }) => gasto.concept === "Impuestos y Detracción"
        )?.[mesNombre] || 0
      );
      newResultados[mesNombre].otrosGastosTotal = Number(
        Math.abs(Number(newResultados[mesNombre].impuestosDetracciones || 0))
      );

      // Calcular el total de gastos
      newResultados[mesNombre].gastos = Number(
        Number(
          Math.abs(Number(newResultados[mesNombre].personal || 0)) +
            Math.abs(Number(newResultados[mesNombre].servicios || 0)) +
            Math.abs(Number(newResultados[mesNombre].serviciosStaff || 0)) +
            Math.abs(Number(newResultados[mesNombre].gastosBancarios || 0)) +
            Math.abs(Number(newResultados[mesNombre].serviciosFondos || 0)) +
            Math.abs(Number(newResultados[mesNombre].otrosGastosTotal || 0)) +
            Math.abs(Number(newResultados[mesNombre].cargos || 0))
        ).toFixed(2)
      );

      newResultados[mesNombre].divisas = Number(
        Number(newResultados[mesNombre].gastos * 0.65).toFixed(2)
      );
      newResultados[mesNombre].prestamo = Number(
        Number(newResultados[mesNombre].gastos * 0.2).toFixed(2)
      );
      newResultados[mesNombre].leasingGasto = Number(
        Number(newResultados[mesNombre].gastos * 0.1).toFixed(2)
      );
      newResultados[mesNombre].consultoria = Number(
        Number(newResultados[mesNombre].gastos * 0.05).toFixed(2)
      );
      newResultados[mesNombre].utilidadOperativa = Number(
        Number(
          Math.abs(newResultados[mesNombre].ingresos) - Math.abs(newResultados[mesNombre].gastos)
        ).toFixed(2)
      );

      newResultados[mesNombre].impuestos = Number(
        gastosRecopilacion.data.find(
          (gasto: { concept: string }) => gasto.concept === "Impuestos y Detracción"
        )?.[mesNombre] || 0
      );
      newResultados[mesNombre].utilidadNeta = Number(
        Number(
          Number(newResultados[mesNombre].utilidadOperativa) + newResultados[mesNombre].impuestos
        ).toFixed(2)
      );
      newResultados[mesNombre].flujoDeCaja = Number(newResultados[mesNombre].utilidadNeta); // O como se calcule
    }

    // console.log("==== RESUMEN MES A MES (newResultados) ====");
    // meses.forEach((mes) => {
    //   console.log(mes, newResultados[mes]);
    // });

    console.log("===== ANALISIS FEBRERO =====");
    console.log(JSON.stringify(newResultados["february"], null, 2));

    const processRow = (label: string, key: string) => {
      const rowData = [{ value: label }];
      meses.forEach((mes) => rowData.push({ value: newResultados[mes]?.[key] || 0 }));
      flujoAnualFormatted.rows.push(rowData);
    };

    // Orden de las filas según la imagen proporcionada
    processRow("TC", "tc");
    processRow("Monto Cambiado (US $)", "monto");
    processRow("INGRESOS (S/.)", "ingresos");
    processRow("Ingresos por Divisas", "ingresosPorDivisas");
    processRow("Ingresos por Préstamos", "ingresosPorPrestamos");
    processRow("LEASING", "leasing");
    processRow("GASTOS", "gastos");
    processRow("DIVISAS", "divisas");
    processRow("PRESTAMO", "prestamo");
    processRow("Leasing", "leasingGasto");
    processRow("Consultoría", "consultoria");

    processRow("Personal", "personal");
    processRow("Asistente 1", "asistente1");
    processRow("Asistente 2", "asistente2");
    processRow("Asistente 3", "asistente3");
    processRow("Asistente 4", "asistente4");
    processRow("Asistente 5", "asistente5");
    processRow("EPS", "eps");
    processRow("CTS", "cts");
    processRow("AFP", "afp");

    processRow("Servicios Operativos", "servicios");
    processRow("Internet", "internet");
    processRow("Celular", "celular");
    processRow("Oficina", "oficina");
    processRow("Facturec-Electr", "facturecElectr");
    processRow("Gestión Riesgo", "gestionRiesgo");
    processRow("Contabilidad", "contabilidad");
    processRow("Marketing", "marketing");

    processRow("Servicios Staff", "serviciosStaff");
    processRow("Combustible", "combustible");
    processRow("Alquiler Auto", "alquilerVehiculos");
    processRow("Gastos Extras", "gastosExtras");
    // processRow("Cargos", "cargos");
    processRow("Viajes/eventos/Otros", "viajesEventosOtros");

    processRow("Gastos Bancarios", "gastosBancarios");
    processRow("ITF S/.", "itfSoles");
    processRow("ITF $", "itfDolares");
    processRow("Mantto S/.", "mantenimientoSoles");
    processRow("Mantto $", "mantenimientoDolares");
    processRow("Interbancarios S/.", "interbancarioSoles");
    processRow("Interbancarios $", "interbancarioDolares");

    processRow("Servicios de Fondos", "serviciosFondos");
    processRow("Intereses x Fondos S/.", "interesFondosSoles");
    processRow("Intereses x Fondos $", "interesFondosDolares");

    // processRow("Redes Sociales", "redesSociales");
    // processRow("Sistemas", "sistemas");
    processRow("Otros Gastos", "otrosGastosTotal");
    processRow("Impuestos y Detracciones", "impuestosDetracciones");
    processRow("Otros Gastos", "otrosGastos");

    processRow("Utilidad Operativa", "utilidadOperativa");
    processRow("Impuestos a la Renta", "impuestos");
    processRow("Utilidad Neta", "utilidadNeta");
    processRow("Flujo de Caja", "flujoDeCaja");

    const responseData = {
      message: "Flujos REAL TOTAL obtenidos exitosamente",
      data: flujoAnualFormatted,
    };
    // console.log(responseData.data.rows);
    res.status(200).json(responseData);
  } catch (error: any) {
    // console.error("Error al obtener Flujos:", error);
    res.status(500).json({
      error: "Error al obtener Flujos",
      message: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};

interface GastosPorMes {
  fecha: string;
  monto: number;
  tc: number;
  divisas: number;
  ingresosDivisas: number;
  leasing: number;
  gastos: number;
  ingresosPorPrestamos: number;
  ingresos: number;
  interesFondosSoles: number;
  interesFondosDolares: number;
  gastosBancarios: number;
  personal: number;
  liderOperaciones: number;
  asistente1: number;
  asistente2: number;
  asistente3: number;
  asistente4: number;
  servicios: number;
  internet: number;
  celular: number;
  oficina: number;
  facturecElectr: number;
  gestionRiesgo: number;
  contabilidad: number;
  otros: number;

  prestamo: number;

  itfSoles: number;
  itfDolares: number;
  mantenimientoSoles: number;
  mantenimientoDolares: number;
  interbancarioSoles: number;
  interbancarioDolares: number;
  serviciosFondos: number;
  marketing: number;
  redesSociales: number;
  sistemas: number;
  publicidad: number;
  viajesEventosOtros: number;
  cargos: number;
  mantenimientoCtas: number;
  pagoDeuda: number;
  utilidadOperativa: number;
  impuestos: number;
  utilidadNeta: number;
  asistente5: number;
  eps: number;
  cts: number;
  afp: number;
  flujoDeCaja: number;
  otrosGastos: number;
  ingresosPorDivisas: number;
  consultoria: number;
  impuestosDetracciones: number;
  otrosGastosTotal: number;
  serviciosStaff: number;
  alquilerVehiculos: number;
  ti: number;
  leasingGasto: number;
  combustible: number;
  gastosExtras: number;
  serviciosOperativos: number;
}

export async function exportarFlujoTotalExcel(
  req: Request,
  res: Response
): Promise<any | undefined> {
  try {
    const anio = parseInt(req.query.anio as string) || 2025;

    const montoCambiado = await obtenerTotalOperacionCacluloFLUJO(String(req.query.anio));

    const prestamosData = await getTotalPrestamosFLUJO(String(req.query.anio));

    const leasingData = await obtenerLeasingCacluloFLUJO(String(req.query.anio));

    const gastosRecopilacion = await recopilarGastosAnioFLUJO(String(req.query.anio));

    console.log(gastosRecopilacion);

    const impuestosAnualesSoles = await obtenerImpuestosAnualesSoles(anio);

    const flujoAnualFormatted: any = {
      anio: anio,
      rows: [],
      dates: [
        "Mes",
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ],
    };

    const meses = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];

    const newResultados: { [key: string]: any } = {};
    meses.forEach((mes, index) => {
      newResultados[mes] = {
        monto: montoCambiado[index]?.dolares || 0,
        tc: montoCambiado[index]?.promedio || 0,
        ingresosPorDivisas: montoCambiado[index]?.medio || 0,
        ingresosPorPrestamos: prestamosData[index]?.totalGanacia || 0,
        leasing: Number(leasingData[index]?.rendimiento?.toFixed(2)) || 0,
        ingresos: Number(
          (montoCambiado[index]?.medio || 0) +
            (prestamosData[index]?.totalGanancia || 0) +
            (leasingData[index]?.rendimiento || 0)
        ).toFixed(2),
        personal: 0,
        liderOperaciones: 0,
        asistente1: 0,
        asistente2: 0,
        asistente3: 0,
        asistente4: 0,
        servicios: 0,
        internet: 0,
        celular: 0,
        oficina: 0,
        facturecElectr: 0,
        gestionRiesgo: 0,
        contabilidad: 0,
        otros: 0,
        gastos: 0,
        divisas: 0,
        prestamo: 0,
        gastosBancarios: 0,
        itfSoles: 0,
        itfDolares: 0,
        mantenimientoSoles: 0,
        mantenimientoDolares: 0,
        interbancarioSoles: 0,
        interbancarioDolares: 0,
        serviciosFondos: 0,
        interesFondosSoles: 0,
        interesFondosDolares: 0,
        marketing: 0,
        redesSociales: 0,
        sistemas: 0,
        publicidad: 0,
        viajesEventosOtros: 0,
        cargos: 0,
        mantenimientoCtas: 0,
        pagoDeuda: 0,
        utilidadOperativa: 0,
        impuestos: Math.abs(Number(impuestosAnualesSoles[mes])) || 0,
        utilidadNeta: 0,
        flujoDeCaja: 0,
      };
    });

    const interFondoSol = gastosRecopilacion.data.find(
      (item: any) =>
        normalizeConcept(item.concept).includes("interesxfondos") &&
        !normalizeConcept(item.concept).includes("dolar")
    );
    const interFondoDol = gastosRecopilacion.data.find(
      (item: any) =>
        normalizeConcept(item.concept).includes("interesxfondos") &&
        normalizeConcept(item.concept).includes("dolar")
    );

    meses.forEach((mes, index) => {
      newResultados[mes].interesFondosSoles = interFondoSol?.[mes] || 0;
      newResultados[mes].interesFondosDolares = interFondoDol?.[mes] || 0;
    });

    const conceptosBancariosSoles = ["ITF S/.", "Mantto S/.", "Interbancarios S/."];
    const conceptosBancariosDolares = ["ITF $", "Mantto $", "Interbancarios $"];

    const filasBancarias = gastosRecopilacion.data.filter((item: any) =>
      conceptosBancariosSoles.includes(item.concept)
    );
    const filasBancariasDolares = gastosRecopilacion.data.filter((item: any) =>
      conceptosBancariosDolares.includes(item.concept)
    );

    const gastosPersonalData = gastosRecopilacion.data.filter(
      (gasto: any) => gasto.tipo_gasto === "PERSONAL_PERSONAS" || gasto.tipo_gasto === "PERSONAL"
    );
    const gastosFuncionamientoData = gastosRecopilacion.data.filter(
      (gasto: any) => gasto.tipo_gasto === "FUNCIONAMIENTO"
    );
    console.log("gastos FUNCIONAMIENTO", gastosFuncionamientoData);
    const gastosStaffData = gastosRecopilacion.data.filter(
      (gasto: any) =>
        gasto.concept === "PAGO COMBUSTIBLE" ||
        gasto.concept === "PAGO ALQUILER AUTO" ||
        gasto.concept === "PAGO GASTOS EXTRAS" ||
        gasto.concept === "PAGO VIAJES/EVENTO/OTROS"
    );
    console.log("gastos STAFF", gastosStaffData);

    const gastosMarketingData = gastosRecopilacion.data.filter(
      (gasto: any) => gasto.tipo_gasto === "MARKETING"
    );

    const gastosCargosData = gastosRecopilacion.data.filter(
      (gasto: any) => gasto.tipo_gasto === "CARGOS"
    );

    for (let i = 0; i < 12; i++) {
      const mesNombre = meses[i];
      const mesData = montoCambiado[i];

      const vSol = interFondoSol?.[mesNombre];
      const vDol = interFondoDol?.[mesNombre];

      const gastoSoles = filasBancarias.reduce((acum: number, fila: any) => {
        const valor = fila[mesNombre];
        return acum + (typeof valor === "number" ? valor : 0);
      }, 0);

      const gastoDolaresConvertido = filasBancariasDolares.reduce((acum: number, fila: any) => {
        const valor = fila[mesNombre];
        return acum + (typeof valor === "number" ? valor * Number(mesData?.promedio || 0) : 0);
      }, 0);

      newResultados[mesNombre].gastosBancarios = gastoSoles + gastoDolaresConvertido;
      newResultados[mesNombre].itfSoles =
        parseFloat(
          gastosRecopilacion.data.find((item: { concept: string }) => item.concept === "ITF S/.")?.[
            mesNombre
          ]
        ) || 0;
      newResultados[mesNombre].itfDolares =
        parseFloat(
          gastosRecopilacion.data.find((item: { concept: string }) => item.concept === "ITF $")?.[
            mesNombre
          ]
        ) || 0;
      newResultados[mesNombre].mantenimientoSoles =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "Mantto S/."
          )?.[mesNombre]
        ) || 0;
      newResultados[mesNombre].mantenimientoDolares =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "Mantto $"
          )?.[mesNombre]
        ) || 0;
      newResultados[mesNombre].interbancarioSoles =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "Interbancarios S/."
          )?.[mesNombre]
        ) || 0;
      newResultados[mesNombre].interbancarioDolares =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "Interbancarios $"
          )?.[mesNombre]
        ) || 0;
      newResultados[mesNombre].serviciosFondos =
        (vSol || 0) + (vDol || 0) * (mesData?.promedio || 0);

      newResultados[mesNombre].liderOperaciones = Number(
        gastosPersonalData.find(
          (gasto: { tipo_gasto: string; concept: string }) =>
            gasto.tipo_gasto === "PERSONAL_PERSONAS" && gasto.concept === "Lider de Operaciones"
        )?.[mesNombre] || 0
      );
      newResultados[mesNombre].asistente1 = Number(
        gastosPersonalData.find(
          (gasto: { tipo_gasto: string; concept: string }) =>
            gasto.tipo_gasto === "PERSONAL_PERSONAS" && gasto.concept === "Asistente 1"
        )?.[mesNombre] || 0
      );
      newResultados[mesNombre].asistente2 = Number(
        gastosPersonalData.find(
          (gasto: { tipo_gasto: string; concept: string }) =>
            gasto.tipo_gasto === "PERSONAL_PERSONAS" && gasto.concept === "Asistente 2"
        )?.[mesNombre] || 0
      );
      newResultados[mesNombre].asistente3 = Number(
        gastosPersonalData.find(
          (gasto: { tipo_gasto: string; concept: string }) =>
            gasto.tipo_gasto === "PERSONAL_PERSONAS" && gasto.concept === "Asistente 3"
        )?.[mesNombre] || 0
      );
      newResultados[mesNombre].asistente4 = Number(
        gastosPersonalData.find(
          (gasto: { tipo_gasto: string; concept: string }) =>
            gasto.tipo_gasto === "PERSONAL_PERSONAS" && gasto.concept === "Asistente 4"
        )?.[mesNombre] || 0
      );
      newResultados[mesNombre].personal = Number(
        Number(newResultados[mesNombre].liderOperaciones) +
          Number(newResultados[mesNombre].asistente1) +
          Number(newResultados[mesNombre].asistente2) +
          Number(newResultados[mesNombre].asistente3) +
          Number(newResultados[mesNombre].asistente4)
      ).toFixed();

      newResultados[mesNombre].internet = Math.abs(
        Number(
          gastosFuncionamientoData.find(
            (gasto: { concept: string }) => gasto.concept?.trim() === "INTERNET"
          )?.[mesNombre] || 0
        )
      );

      newResultados[mesNombre].celular = Math.abs(
        Number(
          gastosFuncionamientoData.find(
            (gasto: { concept: string }) => gasto.concept?.trim() === "CELULARES"
          )?.[mesNombre] || 0
        )
      );
      newResultados[mesNombre].oficina = Math.abs(
        Number(
          gastosFuncionamientoData.find(
            (gasto: { concept: string }) => gasto.concept?.trim() === "OFICINA"
          )?.[mesNombre] || 0
        )
      );
      newResultados[mesNombre].facturecElectr = Math.abs(
        gastosFuncionamientoData.find(
          (gasto: { concept: string }) => gasto.concept?.trim() === "Facturec-Electr"
        )?.[mesNombre] || 0
      );
      newResultados[mesNombre].gestionRiesgo = Math.abs(
        gastosFuncionamientoData.find(
          (gasto: { concept: string }) => gasto.concept?.trim() === "Gestión Riesgo"
        )?.[mesNombre] || 0
      );
      newResultados[mesNombre].contabilidad = Math.abs(
        Number(
          gastosFuncionamientoData.find(
            (gasto: { concept: string }) => gasto.concept?.trim() === "CONTABILIDAD"
          )?.[mesNombre] || 0
        )
      );
      newResultados[mesNombre].otros =
        gastosFuncionamientoData.find(
          (gasto: { concept: string }) => gasto.concept?.trim() === "Otros"
        )?.[mesNombre] || 0;
      newResultados[mesNombre].otrosGastos = Math.abs(
        gastosStaffData.reduce(
          (acc: number, gasto: { [x: string]: string }) =>
            acc + (parseFloat(gasto[mesNombre]) || 0),
          0
        )
      );
      // newResultados[mesNombre].servicios = gastosFuncionamientoData.reduce((acc: number, gasto: { [x: string]: string; }) => acc + (parseFloat(gasto[mesNombre]) || 0), 0) * (newResultados[mesNombre].porcentajeServicios/100);
      newResultados[mesNombre].servicios = Number(
        Number(newResultados[mesNombre].internet) +
          Number(newResultados[mesNombre].celular) +
          Number(newResultados[mesNombre].oficina) +
          Number(newResultados[mesNombre].facturecElectr) +
          Number(newResultados[mesNombre].gestionRiesgo) +
          Number(newResultados[mesNombre].contabilidad) +
          Number(newResultados[mesNombre].otrosGastos)
      ).toFixed(2);

      newResultados[mesNombre].redesSociales =
        gastosMarketingData.find(
          (gasto: { concept: string }) => gasto.concept?.trim() === "Redes Sociales"
        )?.[mesNombre] || 0;
      newResultados[mesNombre].sistemas =
        gastosMarketingData.find(
          (gasto: { concept: string }) => gasto.concept?.trim() === "Sistemas"
        )?.[mesNombre] || 0;
      newResultados[mesNombre].publicidad =
        gastosMarketingData.find(
          (gasto: { concept: string }) => gasto.concept?.trim() === "Publicidad"
        )?.[mesNombre] || 0;
      newResultados[mesNombre].viajesEventosOtros =
        gastosMarketingData.find(
          (gasto: { concept: string }) => gasto.concept?.trim() === "Viajes/eventos/Otros"
        )?.[mesNombre] || 0;
      newResultados[mesNombre].marketing =
        Number(newResultados[mesNombre].redesSociales) +
        Number(newResultados[mesNombre].sistemas) +
        Number(newResultados[mesNombre].publicidad) +
        Number(newResultados[mesNombre].viajesEventosOtros);

      newResultados[mesNombre].cargos = gastosCargosData.reduce(
        (acc: number, gasto: { [x: string]: string }) => acc + (parseFloat(gasto[mesNombre]) || 0),
        0
      );
      newResultados[mesNombre].mantenimientoCtas =
        gastosCargosData.find(
          (gasto: { concept: string }) => gasto.concept?.trim() === "Mantenimiento Ctas."
        )?.[mesNombre] || 0;
      newResultados[mesNombre].pagoDeuda =
        gastosCargosData.find(
          (gasto: { concept: string }) => gasto.concept?.trim() === "Pago de Deuda"
        )?.[mesNombre] || 0;

      // Calcular el total de gastos
      newResultados[mesNombre].gastos = Number(
        Math.abs(Number(newResultados[mesNombre].personal || 0)) +
          Math.abs(Number(newResultados[mesNombre].servicios || 0)) +
          Math.abs(Number(newResultados[mesNombre].marketing || 0)) +
          Math.abs(Number(newResultados[mesNombre].cargos || 0))
      ).toFixed();

      newResultados[mesNombre].divisas = Number(newResultados[mesNombre].gastos * 0.8).toFixed(2);
      newResultados[mesNombre].prestamo = Number(newResultados[mesNombre].gastos * 0.2).toFixed(2);
      newResultados[mesNombre].utilidadOperativa = Number(
        Math.abs(newResultados[mesNombre].ingresos) - Math.abs(newResultados[mesNombre].gastos)
      ).toFixed(2);

      newResultados[mesNombre].utilidadNeta = Number(
        Number(newResultados[mesNombre].utilidadOperativa) + newResultados[mesNombre].impuestos
      ).toFixed(2);
      newResultados[mesNombre].flujoDeCaja = newResultados[mesNombre].utilidadNeta; // O como se calcule
    }

    const processRow = (label: string, key: string) => {
      const rowData = [{ value: label }];
      meses.forEach((mes) => rowData.push({ value: newResultados[mes]?.[key] || 0 }));
      flujoAnualFormatted.rows.push(rowData);
    };

    // Orden de las filas según la imagen proporcionada
    processRow("Monto Cambiado (US $)", "monto");
    processRow("INGRESOS (S/.)", "ingresos");
    processRow("Ingresos por Divisas", "ingresosPorDivisas");
    processRow("Ingresos por Préstamos", "ingresosPorPrestamos");
    processRow("LEASING", "leasing");
    processRow("GASTOS", "gastos");
    processRow("DIVISAS", "divisas");
    processRow("PRESTAMO", "prestamo");
    processRow("Personal", "personal");
    processRow("Líder de Operaciones", "liderOperaciones");
    processRow("Asistente 1", "asistente1");
    processRow("Asistente 2", "asistente2");
    processRow("Asistente 3", "asistente3");
    processRow("Asistente 4", "asistente4");
    processRow("Servicios", "servicios");
    processRow("Internet", "internet");
    processRow("Celular", "celular");
    processRow("Oficina", "oficina");
    processRow("Facturec-Electr", "facturecElectr");
    processRow("Gestión Riesgo", "gestionRiesgo");
    processRow("Contabilidad", "contabilidad");
    processRow("Otros Gastos", "otrosGastos");
    processRow("Marketing", "marketing");
    processRow("Redes Sociales", "redesSociales");
    processRow("Sistemas", "sistemas");
    processRow("Publicidad", "publicidad");
    processRow("Viajes/eventos/Otros", "viajesEventosOtros");
    processRow("Cargos", "cargos");
    processRow("Mantenimiento Ctas.", "mantenimientoCtas");
    processRow("Pago de Deuda", "pagoDeuda");
    processRow("Utilidad Operativa", "utilidadOperativa");
    processRow("Impuestos", "impuestos");
    processRow("Utilidad Neta", "utilidadNeta");
    processRow("Flujo de Caja", "flujoDeCaja");
    processRow("ITF S/.", "itfSoles");
    processRow("ITF $", "itfDolares");
    processRow("Mantto S/.", "mantenimientoSoles");
    processRow("Mantto $", "mantenimientoDolares");
    processRow("Interbancarios S/.", "interbancarioSoles");
    processRow("Interbancarios $", "interbancarioDolares");

    const ws = XLSX.utils.aoa_to_sheet(flujoAnualFormatted.rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Flujo Anual ${anio}`);

    // Buffer del archivo
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

    // Configurar encabezados HTTP
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename=Flujo_Anual_${anio}.xlsx`);

    // Enviar el archivo
    res.send(excelBuffer);
  } catch (error: any) {
    console.error("Error al obtener Flujos:", error);
    res.status(500).json({
      error: "Error al obtener Flujos",
      message: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function graficaDivisas(req: Request, res: Response): Promise<any | undefined> {
  try {
    const anio = parseInt(req.query.anio as string) || 2025;

    const montoCambiado = await obtenerTotalOperacionCacluloFLUJO(String(anio));

    const leasingData = await obtenerLeasingCacluloFLUJO(String(anio));

    const prestamosData = await getTotalPrestamosFLUJO(String(anio));

    const gastosRecopilacion = await recopilarGastosAnioFLUJO(String(anio));
    // console.log("GASTOS REC", gastosRecopilacion)

    const mesesIngles = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];

    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    const resultados: GastosPorMes[] = [];

    mesesIngles.forEach((mes, index) => {
      let newResultados: GastosPorMes = {
        tc: 0,
        fecha: meses[index],
        monto: Number(montoCambiado[index]?.dolares || 0),
        ingresosPorDivisas: Number(montoCambiado[index]?.medio || 0),
        ingresosPorPrestamos: Number(prestamosData[index]?.totalGanancia || 0),
        leasing: Number(Number(leasingData[index]?.rendimiento?.toFixed(2)) || 0),
        consultoria: 0,
        ingresos: Number(
          Number(
            (montoCambiado[index]?.medio || 0) +
              (prestamosData[index]?.totalGanancia || 0) +
              (leasingData[index]?.rendimiento || 0)
          ).toFixed(2)
        ),
        personal: 0,
        liderOperaciones: 0,
        asistente1: 0,
        asistente2: 0,
        asistente3: 0,
        asistente4: 0,
        asistente5: 0,
        eps: 0,
        impuestosDetracciones: 0,
        cts: 0,
        afp: 0,
        ingresosDivisas: 0,
        otrosGastos: 0,
        servicios: 0,
        internet: 0,
        celular: 0,
        serviciosStaff: 0,
        oficina: 0,
        facturecElectr: 0,
        gestionRiesgo: 0,
        contabilidad: 0,
        alquilerVehiculos: 0,
        ti: 0,
        otros: 0,
        gastos: 0,
        divisas: 0,
        prestamo: 0,
        leasingGasto: 0,
        gastosBancarios: 0,
        gastosExtras: 0,
        itfSoles: 0,
        itfDolares: 0,
        otrosGastosTotal: 0,
        mantenimientoSoles: 0,
        mantenimientoDolares: 0,
        interbancarioSoles: 0,
        interbancarioDolares: 0,
        serviciosFondos: 0,
        interesFondosSoles: 0,
        interesFondosDolares: 0,
        marketing: 0,
        combustible: 0,
        redesSociales: 0,
        sistemas: 0,
        publicidad: 0,
        viajesEventosOtros: 0,
        cargos: 0,
        mantenimientoCtas: 0,
        pagoDeuda: 0,
        utilidadOperativa: 0,
        impuestos: 0,
        utilidadNeta: 0,
        flujoDeCaja: 0,
        serviciosOperativos: 0,
      };
      const mesNombre = mesesIngles[index];

      newResultados.tc =
        parseFloat(
          gastosRecopilacion.data.find((item: { concept: string }) => item.concept === "TC")?.[
            mesNombre
          ]
        ) || 0;
      newResultados.itfSoles =
        parseFloat(
          gastosRecopilacion.data.find((item: { concept: string }) => item.concept === "ITF S/.")?.[
            mesNombre
          ]
        ) || 0;
      newResultados.itfDolares =
        parseFloat(
          gastosRecopilacion.data.find((item: { concept: string }) => item.concept === "ITF $")?.[
            mesNombre
          ]
        ) || 0;
      newResultados.mantenimientoSoles =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "Mantto S/."
          )?.[mesNombre]
        ) || 0;
      newResultados.mantenimientoDolares =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "Mantto $"
          )?.[mesNombre]
        ) || 0;
      newResultados.interbancarioSoles =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "Interbancarios S/."
          )?.[mesNombre]
        ) || 0;
      newResultados.interbancarioDolares =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "Interbancarios $"
          )?.[mesNombre]
        ) || 0;
      newResultados.gastosBancarios =
        Math.abs(Number(newResultados.itfSoles)) +
        Math.abs(Number(newResultados.itfDolares) * Number(newResultados.tc || 1)) +
        Math.abs(Number(newResultados.mantenimientoSoles)) +
        Math.abs(Number(newResultados.mantenimientoDolares) * Number(newResultados.tc || 1)) +
        Math.abs(Number(newResultados.interbancarioSoles)) +
        Math.abs(Number(newResultados.interbancarioDolares) * Number(newResultados.tc || 1));

      newResultados.asistente1 =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "ASISTENTE 1"
          )?.[mesNombre]
        ) || 0;
      newResultados.asistente2 =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "ASISTENTE 2"
          )?.[mesNombre]
        ) || 0;
      newResultados.asistente3 =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "ASISTENTE 3"
          )?.[mesNombre]
        ) || 0;
      newResultados.asistente4 =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "ASISTENTE 4"
          )?.[mesNombre]
        ) || 0;
      newResultados.asistente5 =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "ASISTENTE 5"
          )?.[mesNombre]
        ) || 0;
      newResultados.eps =
        parseFloat(
          gastosRecopilacion.data.find((item: { concept: string }) => item.concept === "EPS")?.[
            mesNombre
          ]
        ) || 0;
      newResultados.cts =
        parseFloat(
          gastosRecopilacion.data.find((item: { concept: string }) => item.concept === "CTS")?.[
            mesNombre
          ]
        ) || 0;
      newResultados.afp = Number(
        parseFloat(
          gastosRecopilacion.data.find((item: { concept: string }) => item.concept === "AFP")?.[
            mesNombre
          ]
        ) || 0
      );
      newResultados.personal = Number(
        Number(
          Number(newResultados.asistente1) +
            Number(newResultados.asistente2) +
            Number(newResultados.asistente3) +
            Number(newResultados.asistente4) +
            Number(newResultados.asistente5) +
            Math.abs(Number(newResultados.eps)) +
            Math.abs(Number(newResultados.cts)) +
            Math.abs(Number(newResultados.afp))
        ).toFixed(2)
      );

      newResultados.internet = Math.abs(
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "Internet"
          )?.[mesNombre]
        ) || 0
      );
      newResultados.celular = Math.abs(
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "Celulares"
          )?.[mesNombre]
        ) || 0
      );
      newResultados.oficina =
        parseFloat(
          gastosRecopilacion.data.find((item: { concept: string }) => item.concept === "Oficina")?.[
            mesNombre
          ]
        ) || 0;
      // newResultados[mesNombre].ti = Math.abs(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "TI - Facturación")?.[mesNombre]) || 0);
      newResultados.facturecElectr =
        Math.abs(
          parseFloat(
            gastosRecopilacion.data.find(
              (item: { concept: string }) => item.concept === "TI - Facturación"
            )?.[mesNombre]
          ) || 0
        ) || 0;
      newResultados.gestionRiesgo =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "Cumplimiento"
          )?.[mesNombre]
        ) || 0;
      newResultados.contabilidad = Math.abs(
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "Contabilidad"
          )?.[mesNombre]
        ) || 0
      );
      newResultados.marketing =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "Marketing/Comercial"
          )?.[mesNombre]
        ) || 0;
      newResultados.otros =
        parseFloat(
          gastosRecopilacion.data.find((item: { concept: string }) => item.concept === "Otros")?.[
            mesNombre
          ]
        ) || 0;
      newResultados.otrosGastos = 0;
      // newResultados[mesNombre].servicios = gastosFuncionamientoData.reduce((acc: number, gasto: { [x: string]: string; }) => acc + (parseFloat(gasto[mesNombre]) || 0), 0) * (newResultados[mesNombre].porcentajeServicios/100);
      newResultados.servicios = Number(
        Number(
          Number(newResultados.internet) +
            Number(newResultados.celular) +
            Number(newResultados.oficina) +
            Number(newResultados.facturecElectr) +
            Number(newResultados.gestionRiesgo) +
            Number(newResultados.contabilidad) +
            Number(newResultados.marketing) +
            Number(newResultados.internet) +
            Number(newResultados.ti)
        ).toFixed(2)
      );

      newResultados.combustible = Number(
        gastosRecopilacion.data.find(
          (gasto: { concept: string }) => gasto.concept === "Combustible"
        )?.[mesNombre] || 0
      );
      newResultados.alquilerVehiculos = Number(
        gastosRecopilacion.data.find(
          (gasto: { concept: string }) => gasto.concept === "Alquiler Autos"
        )?.[mesNombre] || 0
      );
      newResultados.gastosExtras = Number(
        gastosRecopilacion.data.find(
          (gasto: { concept: string }) => gasto.concept === "Gastos Extras"
        )?.[mesNombre] || 0
      );
      newResultados.viajesEventosOtros = Number(
        gastosRecopilacion.data.find(
          (gasto: { concept: string }) => gasto.concept === "Viajes/eventos/Otros"
        )?.[mesNombre] || 0
      );

      newResultados.serviciosStaff =
        Number(newResultados.combustible) +
        Number(newResultados.alquilerVehiculos) +
        Number(newResultados.gastosExtras) +
        Number(newResultados.viajesEventosOtros);

      newResultados.cargos = 0;
      newResultados.mantenimientoCtas =
        gastosRecopilacion.data.find(
          (gasto: { concept: string }) => gasto.concept?.trim() === "Mantenimiento Ctas."
        )?.[mesNombre] || 0;
      newResultados.pagoDeuda =
        gastosRecopilacion.data.find(
          (gasto: { concept: string }) => gasto.concept?.trim() === "Pago de Deuda"
        )?.[mesNombre] || 0;

      newResultados.interesFondosSoles =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "Interes x Fondo S/. "
          )?.[mesNombre]
        ) || 0;
      newResultados.interesFondosDolares =
        parseFloat(
          gastosRecopilacion.data.find(
            (item: { concept: string }) => item.concept === "Interes x Fondo $ "
          )?.[mesNombre]
        ) || 0;
      newResultados.serviciosFondos =
        (Number(newResultados.interesFondosSoles) || 0) +
        (Number(newResultados.interesFondosDolares) || 0) * Number(newResultados.tc || 1);

      newResultados.impuestosDetracciones = Number(
        gastosRecopilacion.data.find(
          (gasto: { concept: string }) => gasto.concept === "Impuestos y Detracción"
        )?.[mesNombre] || 0
      );
      newResultados.otrosGastosTotal = Number(
        Math.abs(Number(newResultados.impuestosDetracciones || 0))
      );

      // Calcular el total de gastos
      newResultados.gastos = Number(
        Number(
          Math.abs(Number(newResultados.personal || 0)) +
            Math.abs(Number(newResultados.servicios || 0)) +
            Math.abs(Number(newResultados.serviciosStaff || 0)) +
            Math.abs(Number(newResultados.gastosBancarios || 0)) +
            Math.abs(Number(newResultados.serviciosFondos || 0)) +
            Math.abs(Number(newResultados.otrosGastosTotal || 0))
        ).toFixed(2)
      );

      newResultados.divisas = Number(Number(newResultados.gastos * 0.65).toFixed(2));
      newResultados.prestamo = Number(Number(newResultados.gastos * 0.2).toFixed(2));
      newResultados.leasingGasto = Number(Number(newResultados.gastos * 0.1).toFixed(2));
      newResultados.consultoria = Number(Number(newResultados.gastos * 0.05).toFixed(2));
      newResultados.utilidadOperativa = Number(
        Number(Math.abs(newResultados.ingresos) - Math.abs(newResultados.gastos)).toFixed(2)
      );

      newResultados.impuestos = Number(
        gastosRecopilacion.data.find(
          (gasto: { concept: string }) => gasto.concept === "Impuestos y Detracción"
        )?.[mesNombre] || 0
      );
      newResultados.utilidadNeta = Number(
        Number(Number(newResultados.utilidadOperativa) + newResultados.impuestos).toFixed(2)
      );
      newResultados.flujoDeCaja = Number(newResultados.utilidadNeta); // O como se calcule
      resultados.push(newResultados);
    });

    return res.status(200).json(resultados);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Error interno en el servidor");
  } finally {
    prisma.$disconnect();
  }
}
