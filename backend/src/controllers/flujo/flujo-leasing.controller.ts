

import { recopilarGastosAnioFLUJO } from "../../controllers/gastos/recopilacionGastos.controller";
import { obtenerLeasingCacluloFLUJO } from "../../controllers/leasing/leasing.controller";
import { obtenerTotalOperacionCacluloFLUJO } from "../../controllers/operaciones/operaciones.controller";
// import { getTotalPrestamosFLUJO } from "../../controllers/prestamos/prestamos.controller";
import { Request, Response } from "express";
import { obtenerImpuestosAnualesSoles } from "../../controllers/gastos/gastos.controller";
import prisma from "../../config/database";

function normalizeConcept(s: string) {
  return s
    .normalize("NFD") // separa acentos de letras
    .replace(/[\u0300-\u036f]/g, "") // elimina marcas de acentuación
    .replace(/[^a-z0-9]/gi, "") // elimina todo lo que no sea letra o número
    .toLowerCase(); // a minúsculas
}

export async function obtenerTotalFlujoLeasing(req: Request, res: Response): Promise<any | undefined> {

  try {
    const anio = parseInt(String(req.query.anio ?? new Date().getFullYear()));

    const porcentajeFlujo = await prisma.porcentajeFlujo.findFirst({
      where: {
        anio: Number(anio),
        tipoFlujo: "LEASING" // Filtro por tipoFlujo
      }
    });


    const montoCambiado = await obtenerTotalOperacionCacluloFLUJO(
      String(req.query.anio ?? new Date().getFullYear())
    );

    // const prestamosData = await getTotalPrestamosFLUJO(String(req.query.anio ?? new Date().getFullYear()));

    const leasingData = await obtenerLeasingCacluloFLUJO(
      String(req.query.anio ?? new Date().getFullYear())
    );

    const gastosRecopilacion = await recopilarGastosAnioFLUJO(
      String(req.query.anio ?? new Date().getFullYear())
    );

    const impuestosAnualesSoles = await obtenerImpuestosAnualesSoles(anio);

    const flujoAnualFormatted: any = {
      anio: anio,
      rows: [],
      dates: ["Mes", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    };

    const meses = [
      "january", "february", "march", "april", "may", "june",
      "july", "august", "september", "october", "november", "december",
    ];

    const monthlyData: { [key: string]: any } = {};
    meses.forEach((mes, index) => {
      monthlyData[mes] = {
        monto: montoCambiado[index]?.dolares || 0,
        tc: 0,
        ingresosPorDivisas: 0,
        ingresosPorPrestamos: 0,
        leasing: Number(leasingData[index]?.rendimiento?.toFixed(2)) || 0,
        /*
        ingresos:
          Number((montoCambiado[index]?.medio || 0) +
            (prestamosData[index]?.totalGanancia || 0) +
            (leasingData[index]?.rendimiento || 0)).toFixed(2),
        */
        ingresos: Number(leasingData[index]?.rendimiento?.toFixed(2) || 0),
        personal: 0,
        liderOperaciones: 0,
        asistente1: 0,
        asistente2: 0,
        asistente3: 0,
        asistente4: 0,
        asistente5: 0,
        cts: 0,
        eps: 0,
        servicios: 0,
        internet: 0,
        celular: 0,
        oficina: 0,
        facturecElectr: 0,
        gestionRiesgo: 0,
        contabilidad: 0,
        otros: 0,
        gastos: 0,
        afp: 0,
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
        impuestos: (Math.abs(Number(impuestosAnualesSoles[mes])) || 0 * (Number(porcentajeFlujo?.porcentajeImpuestos || 0) / 100 || 1)),
        utilidadNeta: 0,
        flujoDeCaja: 0,
        porcentajePersonal: porcentajeFlujo?.porcentajePersonal || 0, // Usar el valor del modelo o 0 si no existe
        porcentajeServicios: porcentajeFlujo?.porcentajeServicios || 0,
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

    meses.forEach((mes) => {
      monthlyData[mes].interesFondosSoles = interFondoSol?.[mes] || 0;
      monthlyData[mes].interesFondosDolares = interFondoDol?.[mes] || 0;
    });

    
    const gastosFuncionamientoData = gastosRecopilacion.data.filter(
      (gasto: any) => gasto.tipo_gasto === "FUNCIONAMIENTO"
    );
    console.log('gastos FUNCIONAMIENTO', gastosFuncionamientoData)
    const gastosStaffData = gastosRecopilacion.data.filter(
      (gasto: any) =>
        gasto.concept === "COMBUSTIBLE" ||
        gasto.concept === "ALQUILER AUTO" ||
        gasto.concept === "GASTOS EXTRAS" ||
        gasto.concept === "VIAJES/EVENTO/OTROS"
    );

    const gastosMarketingData = gastosRecopilacion.data.filter(
      (gasto: any) => gasto.tipo_gasto === "MARKETING"
    );

    const gastosCargosData = gastosRecopilacion.data.filter(
      (gasto: any) => gasto.tipo_gasto === "CARGOS"
    );


    for (let i = 0; i < 12; i++) {
      const mesNombre = meses[i]
    
      monthlyData[mesNombre].tc = parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "TC")?.[mesNombre]) || 0;
      monthlyData[mesNombre].itfSoles = parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "ITF S/.")?.[mesNombre]) * (Number(porcentajeFlujo?.porcentajeGastosBancarios) / 100);
      monthlyData[mesNombre].itfDolares = parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "ITF $")?.[mesNombre]) * (Number(porcentajeFlujo?.porcentajeGastosBancarios) / 100);
      monthlyData[mesNombre].mantenimientoSoles = parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "Mantto S/.")?.[mesNombre] || 0) * (Number(porcentajeFlujo?.porcentajeGastosBancarios) / 100);
      monthlyData[mesNombre].mantenimientoDolares = parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "Mantto $")?.[mesNombre] || 0) * (Number(porcentajeFlujo?.porcentajeGastosBancarios) / 100);
      monthlyData[mesNombre].interbancarioSoles = Math.abs(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "Interbancarios S/.")?.[mesNombre] || 0) * (Number(porcentajeFlujo?.porcentajeGastosBancarios) / 100));
      monthlyData[mesNombre].interbancarioDolares = Math.abs(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "Interbancarios $")?.[mesNombre] || 0) * (Number(porcentajeFlujo?.porcentajeGastosBancarios) / 100));
      monthlyData[mesNombre].gastosBancarios = Number(Number(monthlyData[mesNombre].itfSoles) +
        Number(monthlyData[mesNombre].itfDolares) * Number(monthlyData[mesNombre].tc || 1) +
        Number(monthlyData[mesNombre].mantenimientoDolares) * Number(monthlyData[mesNombre].tc || 1) +
        Number(monthlyData[mesNombre].mantenimientoSoles) +
        Number(monthlyData[mesNombre].interbancarioDolares) * Number(monthlyData[mesNombre].tc || 1) +
        Number(monthlyData[mesNombre].interbancarioSoles) || 0).toFixed(2);

      monthlyData[mesNombre].asistente1 = Number(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "ASISTENTE 1")?.[mesNombre]) || 0) * (Number(porcentajeFlujo?.porcentajePersonal || 0) / 100);
      monthlyData[mesNombre].asistente2 = Number(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "ASISTENTE 2")?.[mesNombre]) || 0) * (Number(porcentajeFlujo?.porcentajePersonal || 0) / 100);
      monthlyData[mesNombre].asistente3 = Number(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "ASISTENTE 3")?.[mesNombre]) || 0) * (Number(porcentajeFlujo?.porcentajePersonal || 0) / 100);
      monthlyData[mesNombre].asistente4 = Number(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "ASISTENTE 4")?.[mesNombre]) || 0) * (Number(porcentajeFlujo?.porcentajePersonal || 0) / 100);
      monthlyData[mesNombre].asistente5 = Number(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "ASISTENTE 5")?.[mesNombre]) || 0) * (Number(porcentajeFlujo?.porcentajePersonal || 0) / 100);
      monthlyData[mesNombre].eps = Number(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "EPS")?.[mesNombre]) || 0) * (Number(porcentajeFlujo?.porcentajePersonal || 0) / 100)
      monthlyData[mesNombre].cts = Number(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "CTS")?.[mesNombre]) || 0) * (Number(porcentajeFlujo?.porcentajePersonal || 0) / 100)
      monthlyData[mesNombre].afp = Number(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "AFP")?.[mesNombre]) || 0) * (Number(porcentajeFlujo?.porcentajePersonal || 0) / 100)
      monthlyData[mesNombre].personal = Number( Number(monthlyData[mesNombre].asistente1) +
        Number(monthlyData[mesNombre].asistente2) +
        Number(monthlyData[mesNombre].asistente3) +
        Number(monthlyData[mesNombre].asistente4) +
        Number(monthlyData[mesNombre].asistente5) +
        Number(monthlyData[mesNombre].eps) +
        Number(monthlyData[mesNombre].cts) + 
        Number(monthlyData[mesNombre].afp)).toFixed(2)


      monthlyData[mesNombre].internet = (Math.abs(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "Internet")?.[mesNombre]) || 0) * Number(porcentajeFlujo?.porcentajeServicios || 0) / 100);
      monthlyData[mesNombre].celular = Math.abs(Math.abs(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "Celulares")?.[mesNombre]) || 0) * Number(porcentajeFlujo?.porcentajeServicios || 0) / 100);
      monthlyData[mesNombre].oficina = Math.abs(Number(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "Oficina")?.[mesNombre]) || 0) * Number(porcentajeFlujo?.porcentajeServicios || 0) / 100);
      monthlyData[mesNombre].facturecElectr = Math.abs(gastosRecopilacion.data.find((gasto: { concept: string; }) => gasto.concept === "TI - Facturación")?.[mesNombre] || 0) * Number(porcentajeFlujo?.porcentajeServicios || 0) / 100;
      monthlyData[mesNombre].gestionRiesgo = Math.abs(gastosRecopilacion.data.find((gasto: { concept: string; }) => gasto.concept === "Cumplimiento")?.[mesNombre] || 0) * Number(porcentajeFlujo?.porcentajeServicios || 0) / 100;
      monthlyData[mesNombre].contabilidad = Math.abs(Number(gastosRecopilacion.data.find((gasto: { concept: string; }) => gasto.concept === "Contabilidad")?.[mesNombre] || 0) * Number(porcentajeFlujo?.porcentajeServicios || 0) / 100);
      monthlyData[mesNombre].marketing = Math.abs(gastosRecopilacion.data.find((gasto: { concept: string; }) => gasto.concept === "Marketing/Comercial")?.[mesNombre] || 0) * Number(porcentajeFlujo?.porcentajeServicios || 0) / 100;
      monthlyData[mesNombre].otrosGastos = Math.abs(gastosStaffData.reduce((acc: number, gasto: { [x: string]: string; }) => acc + (parseFloat(gasto[mesNombre]) || 0), 0) * (Number(porcentajeFlujo?.porcentajeServicios || 0) / 100));
      // monthlyData[mesNombre].servicios = gastosFuncionamientoData.reduce((acc: number, gasto: { [x: string]: string; }) => acc + (parseFloat(gasto[mesNombre]) || 0), 0) * (monthlyData[mesNombre].porcentajeServicios/100);
      monthlyData[mesNombre].servicios = Number(Number(monthlyData[mesNombre].internet) +
        Number(monthlyData[mesNombre].celular) +
        Number(monthlyData[mesNombre].oficina) +
        Number(monthlyData[mesNombre].facturecElectr) +
        Number(monthlyData[mesNombre].gestionRiesgo) +
        Number(monthlyData[mesNombre].contabilidad) +
        Number(monthlyData[mesNombre].marketing)).toFixed(2);


      monthlyData[mesNombre].redesSociales = gastosRecopilacion.data.find((gasto: { concept: string; }) => gasto.concept === "Redes Sociales")?.[mesNombre] || 0 * (Number(porcentajeFlujo?.porcentajeOtrosGastos || 0) / 100);
      monthlyData[mesNombre].combustible = Math.abs(Math.abs(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "Combustible")?.[mesNombre]) || 0) * Number(porcentajeFlujo?.porcentajeServiciosStaff || 0) / 100);
      monthlyData[mesNombre].alquilerVehiculos = Math.abs(Math.abs(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "Alquiler Autos")?.[mesNombre]) || 0) * Number(porcentajeFlujo?.porcentajeServiciosStaff || 0) / 100);
      monthlyData[mesNombre].viajesEventosOtros = gastosMarketingData.find((gasto: { concept: string; }) => gasto.concept === "Viajes/eventos/Otros")?.[mesNombre] || 0 * (Number(porcentajeFlujo?.porcentajeOtrosGastos || 0) / 100);
      monthlyData[mesNombre].serviciosStaff = Number(monthlyData[mesNombre].redesSociales) +
        Number(monthlyData[mesNombre].combustible) +
        Number(monthlyData[mesNombre].alquilerVehiculos) +
        Number(monthlyData[mesNombre].publicidad) +
        Number(monthlyData[mesNombre].viajesEventosOtros)

      monthlyData[mesNombre].interesFondosSoles = (Math.abs(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === 'Interes x Fondo S/. ')?.[mesNombre]) || 0) * Number(porcentajeFlujo?.porcentajeServiciosFondos || 0) / 100)
      monthlyData[mesNombre].interesFondosDolares = (Math.abs(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === 'Interes x Fondo $ ')?.[mesNombre]) || 0) * Number(porcentajeFlujo?.porcentajeServiciosFondos || 0) / 100)
      monthlyData[mesNombre].serviciosFondos = Number(Number(monthlyData[mesNombre].interesFondosDolares) +
        (Number(monthlyData[mesNombre].interesFondosSoles) * Number(monthlyData[mesNombre].tc || 1))).toFixed(2)

      monthlyData[mesNombre].impuestosDetracciones = Number(gastosRecopilacion.data.find((gasto: { concept: string; }) => gasto.concept === "Impuestos y Detracción")?.[mesNombre] || 0) * (Number(porcentajeFlujo?.porcentajeImpuestos)) / 100 || 1
      monthlyData[mesNombre].otrosGastosTotal = Number(
        Math.abs(Number(monthlyData[mesNombre].impuestosDetracciones || 0))
      )
      monthlyData[mesNombre].cargos = gastosCargosData.reduce((acc: number, gasto: { [x: string]: string; }) => acc + (parseFloat(gasto[mesNombre]) || 0), 0);
      monthlyData[mesNombre].mantenimientoCtas = gastosCargosData.find((gasto: { concept: string; }) => gasto.concept?.trim() === "Mantenimiento Ctas.")?.[mesNombre] || 0 * (Number(porcentajeFlujo?.porcentajeServicios || 0) / 100);
      monthlyData[mesNombre].pagoDeuda = gastosCargosData.find((gasto: { concept: string; }) => gasto.concept?.trim() === "Pago de Deuda")?.[mesNombre] || 0 * (Number(porcentajeFlujo?.porcentajeServicios || 0) / 100);

      // Calcular el total de gastos
      monthlyData[mesNombre].gastos =
        Number(Number(Math.abs(Number(monthlyData[mesNombre].personal || 0)) +
          Math.abs(Number(monthlyData[mesNombre].servicios || 0)) +
          Math.abs(Number(monthlyData[mesNombre].gastosBancarios || 0)) +
          Math.abs(Number(monthlyData[mesNombre].cargos || 0)) +
          Math.abs(Number(monthlyData[mesNombre].serviciosFondos || 0)) +
          Math.abs(Number(monthlyData[mesNombre].otrosGastosTotal || 0)) +
          Math.abs(Number(monthlyData[mesNombre].serviciosStaff || 0))).toFixed(2))

      monthlyData[mesNombre].utilidadOperativa =
        Number(Math.abs(monthlyData[mesNombre].ingresos || 0) - Math.abs(monthlyData[mesNombre].gastos || 0)).toFixed(2);

      monthlyData[mesNombre].utilidadNeta = Number(Number(monthlyData[mesNombre].utilidadOperativa) + monthlyData[mesNombre].impuestos).toFixed(2);
      monthlyData[mesNombre].flujoDeCaja = monthlyData[mesNombre].utilidadNeta; // O como se calcule
    }

    const processRow = (label: string, key: string) => {
      const rowData = [{ value: label }];
      meses.forEach(mes => rowData.push({ value: monthlyData[mes]?.[key] || 0 }))
      flujoAnualFormatted.rows.push(rowData);
    };

    // Orden de las filas según la imagen proporcionada
    processRow("Monto Cambiado (US $)", "monto");
    processRow("INGRESOS (S/.)", "ingresos");
    processRow("Ingresos por Divisas", "ingresosPorDivisas");
    processRow("Ingresos por Préstamos", "ingresosPorPrestamos");
    processRow("Ingresos de Leasing", "leasing");

    processRow("GASTOS", "gastos");

    processRow("Personal", "personal");
    processRow("Asistente 1", "asistente1");
    processRow("Asistente 2", "asistente2");
    processRow("Asistente 3", "asistente3");
    processRow("Asistente 4", "asistente4");
    processRow("Asistente 5", "asistente5");
    processRow("EPS", "eps");
    processRow("CTS", "cts");
    processRow("AFP", "afp")

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
    processRow("ITF S/.", "itfSoles")
    processRow("ITF $", "itfDolares")
    processRow("Mantto S/.", "mantenimientoSoles")
    processRow("Mantto $", "mantenimientoDolares")
    processRow("Interbancarios S/.", "interbancarioSoles")
    processRow("Interbancarios $", "interbancarioDolares")

    processRow("Servicios de Fondos", "serviciosFondos")
    processRow("Intereses x Fondos S/.", "interesFondosSoles")
    processRow("Intereses x Fondos $", "interesFondosDolares")

    // processRow("Redes Sociales", "redesSociales");
    // processRow("Sistemas", "sistemas");
    processRow("Otros Gastos", "otrosGastosTotal")
    processRow("Impuestos y Detracciones", "impuestosDetracciones")
    processRow("Otros Gastos", "otrosGastos")
    
    processRow("Utilidad Operativa", "utilidadOperativa");
    processRow("Impuestos a la Renta", "impuestos");
    processRow("Utilidad Neta", "utilidadNeta");
    processRow("Flujo de Caja", "flujoDeCaja");
    const responseData = {
      message: "Flujos REAL TOTAL obtenidos exitosamente",
      data: flujoAnualFormatted,
    };

    res.status(200).json(responseData);
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