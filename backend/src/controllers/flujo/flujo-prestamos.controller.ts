
import { recopilarGastosAnioFLUJO } from "../../controllers/gastos/recopilacionGastos.controller";
import { obtenerLeasingCacluloFLUJO } from "../../controllers/leasing/leasing.controller";
import { obtenerTotalOperacionCacluloFLUJO } from "../../controllers/operaciones/operaciones.controller";
import { getTotalPrestamosFLUJO } from "../../controllers/prestamos/prestamos.controller";
import { Request, Response } from "express";
import * as XLSX from "xlsx";
import prisma from "../../config/database";


interface MesIngresos {
  fecha: string;
  real: number;
  ppto: number;
}

function normalizeConcept(s: string) {
  return s
    .normalize("NFD") // separa acentos de letras
    .replace(/[\u0300-\u036f]/g, "") // elimina marcas de acentuación
    .replace(/[^a-z0-9]/gi, "") // elimina todo lo que no sea letra o número
    .toLowerCase(); // a minúsculas
}

export async function obtenerTotalFlujoPorPrestamos(req: Request, res: Response): Promise<any | undefined> {

  try {

    const anio = parseInt(req.query.anio as string) || 2025;

    const porcentajeFlujo = await prisma.porcentajeFlujo.findFirst({
      where: {
        anio: Number(anio),
        tipoFlujo: "REAL_PRESTAMO" // Filtro por tipoFlujo
      }
    });


    const montoCambiado = await obtenerTotalOperacionCacluloFLUJO(
      String(anio)
    );

    const prestamosData = await getTotalPrestamosFLUJO(String(anio));

    const gastosRecopilacion = await recopilarGastosAnioFLUJO(
      String(anio)
    );

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
        ingresosPorPrestamos: prestamosData[index]?.totalGanancia || 0,
        leasing: 0,
        /*
        ingresos:
          (montoCambiado[index]?.medio || 0) +
          (prestamosData[index]?.totalGanancia || 0) +
          (leasingData[index]?.rendimiento || 0),
        */
        ingresos: Number(prestamosData[index]?.totalGanancia || 0),
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
    console.log('gastos STAFF', gastosStaffData)

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
      monthlyData[mesNombre].serviciosFondos = Number((Number(monthlyData[mesNombre].interesFondosDolares) * Number(monthlyData[mesNombre].tc || 1)) +
        Number(monthlyData[mesNombre].interesFondosSoles)).toFixed(2)

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
      monthlyData[mesNombre].flujoDeCaja = monthlyData[mesNombre].utilidadNeta; // O como se calcules
    }

    const processRow = (label: string, key: string) => {
      const rowData = [{ value: label }];
      meses.forEach(mes => rowData.push({ value: monthlyData[mes]?.[key] || 0 }))
      flujoAnualFormatted.rows.push(rowData);
    };

    // Orden de las filas según la imagen proporcionada
    /*
    processRow("Monto Cambiado (US $)", "monto");
    processRow("INGRESOS (S/.)", "ingresos");
    processRow("Ingresos por Divisas", "ingresosPorDivisas");
    processRow("Ingresos por Préstamos", "ingresosPorPrestamos");
    processRow("Otros Ingresos", "leasing");
    processRow("GASTOS", "gastos");
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
    */
    
    processRow("TC", "tc")
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
    return res.status(500).json({
      error: "Error al obtener Flujos",
      message: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function graficoTotalRealPpto(req: Request, res: Response) {
  
  try {
    const anio = parseInt(req.query.anio as string) || new Date().getFullYear();

    const flujoData = await prisma.flujo.findMany({
      where: {
        anio: anio,
        tipoFlujo: "PRESUPUESTO"
      },
      orderBy: {
        mes: 'desc'
      }
    })

    console.log(flujoData)

    const montoCambiado = await obtenerTotalOperacionCacluloFLUJO(String(anio));


    const prestamosData = await getTotalPrestamosFLUJO(String(anio));


    const leasingData = await obtenerLeasingCacluloFLUJO(String(anio));


    const gastosRecopilacion = await recopilarGastosAnioFLUJO(String(anio));


    // Inicializar el objeto para almacenar los datos del año, incluyendo los 12 valores mensuales
    const flujoAnual: any = {
      anio: anio,
      ingresos: Array(12).fill(0), // Inicializar con 12 ceros
      gastos: Array(12).fill(0),
      ingresosPorDivisas: Array(12).fill(0),
      ingresosPorPrestamos: Array(12).fill(0),
      leasing: Array(12).fill(0),
    };

    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
    ];



    for (let i = 0; i < 12; i++) {
      const mesData = montoCambiado[i];
      const prestamos = prestamosData[i];
      const leasing = leasingData[i];
      const gastos = gastosRecopilacion.data[i];


      if (mesData && prestamos && leasing && gastos) {
        flujoAnual.ingresos[i] = Number(mesData.medio) + Number(prestamos.totalCapitalDolares) + Number(leasing.rendimiento);
      }
      else {
        flujoAnual.ingresos[i] = 0;
      }
    }
    const resultadoCompleto: MesIngresos[] = [];
    for (let i = 0; i < 12; i++) {
      resultadoCompleto.push({
        fecha: meses[i],
        ppto: flujoData[i] ? flujoData[i].ingresos || 0 : 0,
        real: Number(Number((montoCambiado[i]?.medio || 0) +
            (prestamosData[i]?.totalGanancia || 0) +
            (leasingData[i]?.rendimiento || 0)).toFixed(2)),
      });
    }

    const responseData = {
      message: "Ingresos anuales obtenidos exitosamente",
      data: resultadoCompleto,
    };
    res.status(200).json(responseData);
  } catch (error: any) {
    console.error("Error al obtener ingresos anuales:", error);
    res.status(500).json({
      error: "Error al obtener ingresos anuales",
      message: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function exportarFlujoPrestamosExcel(req: Request, res: Response): Promise<any | undefined> {
  try {
    const anio = parseInt(req.query.anio as string) || 2025;

    const porcentajeFlujo = await prisma.porcentajeFlujo.findFirst({
      where: {
        anio: Number(anio),
        tipoFlujo: "REAL_PRESTAMO"
      }
    });

    console.log('porcentajeFlujo', porcentajeFlujo)

    const montoCambiado = await obtenerTotalOperacionCacluloFLUJO(
      String(req.query.anio)
    );

    const prestamosData = await getTotalPrestamosFLUJO(String(req.query.anio));

    const leasingData = await obtenerLeasingCacluloFLUJO(
      String(req.query.anio)
    );

    const gastosRecopilacion = await recopilarGastosAnioFLUJO(
      String(req.query.anio)
    );

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
        tc: montoCambiado[index]?.promedio || 0,
        ingresosPorDivisas: montoCambiado[index]?.medio || 0,
        ingresosPorPrestamos: prestamosData[index]?.totalGanacia || 0,
        leasing: Number(leasingData[index]?.rendimiento?.toFixed(2)) || 0,
        ingresos:
          (montoCambiado[index]?.medio || 0) +
          (prestamosData[index]?.totalGanancia || 0) +
          (leasingData[index]?.rendimiento || 0),
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
        impuestos: 0,
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

    meses.forEach((mes, index) => {
      monthlyData[mes].interesFondosSoles = interFondoSol?.[mes] || 0;
      monthlyData[mes].interesFondosDolares = interFondoDol?.[mes] || 0;
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
      (gasto: any) =>
        gasto.tipo_gasto === "PERSONAL_PERSONAS" ||
        gasto.tipo_gasto === "PERSONAL"
    );
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
    console.log('gastos STAFF', gastosStaffData)

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

      monthlyData[mesNombre].gastosBancarios = gastoSoles + gastoDolaresConvertido;
      monthlyData[mesNombre].itfSoles = parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "ITF S/.")?.[mesNombre]) || 0;
      monthlyData[mesNombre].itfDolares = parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "ITF $")?.[mesNombre]) || 0;
      monthlyData[mesNombre].mantenimientoSoles = parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "Mantto S/.")?.[mesNombre]) || 0;
      monthlyData[mesNombre].mantenimientoDolares = parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "Mantto $")?.[mesNombre]) || 0;
      monthlyData[mesNombre].interbancarioSoles = parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "Interbancarios S/.")?.[mesNombre]) || 0;
      monthlyData[mesNombre].interbancarioDolares = parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "Interbancarios $")?.[mesNombre]) || 0;
      monthlyData[mesNombre].serviciosFondos = (vSol || 0) + ((vDol || 0) * (mesData?.promedio || 0));


      monthlyData[mesNombre].liderOperaciones = Number(gastosPersonalData.find((gasto: { tipo_gasto: string; concept: string; }) => gasto.tipo_gasto === "PERSONAL_PERSONAS" && gasto.concept === "Lider de Operaciones")?.[mesNombre] || 0) * (Number(porcentajeFlujo?.porcentajePersonal || 0) / 100 || 1);
      monthlyData[mesNombre].asistente1 = Number(gastosPersonalData.find((gasto: { tipo_gasto: string; concept: string; }) => gasto.tipo_gasto === "PERSONAL_PERSONAS" && gasto.concept === "Asistente 1")?.[mesNombre] || 0) * (Number(porcentajeFlujo?.porcentajePersonal || 0) / 100 || 1);
      monthlyData[mesNombre].asistente2 = Number(gastosPersonalData.find((gasto: { tipo_gasto: string; concept: string; }) => gasto.tipo_gasto === "PERSONAL_PERSONAS" && gasto.concept === "Asistente 2")?.[mesNombre] || 0) * (Number(porcentajeFlujo?.porcentajePersonal || 0) / 100 || 1);
      monthlyData[mesNombre].asistente3 = Number(gastosPersonalData.find((gasto: { tipo_gasto: string; concept: string; }) => gasto.tipo_gasto === "PERSONAL_PERSONAS" && gasto.concept === "Asistente 3")?.[mesNombre] || 0) * (Number(porcentajeFlujo?.porcentajePersonal || 0) / 100 || 1);
      monthlyData[mesNombre].asistente4 = Number(gastosPersonalData.find((gasto: { tipo_gasto: string; concept: string; }) => gasto.tipo_gasto === "PERSONAL_PERSONAS" && gasto.concept === "Asistente 4")?.[mesNombre] || 0) * (Number(porcentajeFlujo?.porcentajePersonal || 0) / 100 || 1);
      monthlyData[mesNombre].personal = Number(monthlyData[mesNombre].liderOperaciones) +
        Number(monthlyData[mesNombre].asistente1) +
        Number(monthlyData[mesNombre].asistente2) +
        Number(monthlyData[mesNombre].asistente3) +
        Number(monthlyData[mesNombre].asistente4)


      monthlyData[mesNombre].internet = Number(gastosFuncionamientoData.find((gasto: { concept: string; }) => gasto.concept?.trim() === "INTERNET")?.[mesNombre] || 0) * Number(porcentajeFlujo?.porcentajeServicios || 0) / 100;
      monthlyData[mesNombre].celular = Number(gastosFuncionamientoData.find((gasto: { concept: string; }) => gasto.concept?.trim() === "CELULARES")?.[mesNombre] || 0) * Number(porcentajeFlujo?.porcentajeServicios || 0) / 100;
      monthlyData[mesNombre].oficina = Number(gastosFuncionamientoData.find((gasto: { concept: string; }) => gasto.concept?.trim() === "OFICINA")?.[mesNombre] || 0) * Number(porcentajeFlujo?.porcentajeServicios || 0) / 100;
      monthlyData[mesNombre].facturecElectr = gastosFuncionamientoData.find((gasto: { concept: string; }) => gasto.concept?.trim() === "Facturec-Electr")?.[mesNombre] || 0;
      monthlyData[mesNombre].gestionRiesgo = gastosFuncionamientoData.find((gasto: { concept: string; }) => gasto.concept?.trim() === "Gestión Riesgo")?.[mesNombre] || 0;
      monthlyData[mesNombre].contabilidad = Number(gastosFuncionamientoData.find((gasto: { concept: string; }) => gasto.concept?.trim() === "CONTABILIDAD")?.[mesNombre] || 0) * Number(porcentajeFlujo?.porcentajeServicios || 0) / 100;
      monthlyData[mesNombre].otros = gastosFuncionamientoData.find((gasto: { concept: string; }) => gasto.concept?.trim() === "Otros")?.[mesNombre] || 0;
      monthlyData[mesNombre].otrosGastos = gastosStaffData.reduce((acc: number, gasto: { [x: string]: string; }) => acc + (parseFloat(gasto[mesNombre]) || 0), 0) * (Number(porcentajeFlujo?.porcentajeServicios || 0) / 100 || 1);
      // monthlyData[mesNombre].servicios = gastosFuncionamientoData.reduce((acc: number, gasto: { [x: string]: string; }) => acc + (parseFloat(gasto[mesNombre]) || 0), 0) * (monthlyData[mesNombre].porcentajeServicios/100);
      monthlyData[mesNombre].servicios = Number(monthlyData[mesNombre].internet) +
        Number(monthlyData[mesNombre].celular) +
        Number(monthlyData[mesNombre].oficina) +
        Number(monthlyData[mesNombre].facturecElectr) +
        Number(monthlyData[mesNombre].gestionRiesgo) +
        Number(monthlyData[mesNombre].contabilidad) +
        Number(monthlyData[mesNombre].otrosGastos);


      monthlyData[mesNombre].redesSociales = gastosMarketingData.find((gasto: { concept: string; }) => gasto.concept?.trim() === "Redes Sociales")?.[mesNombre] || 0 * (Number(porcentajeFlujo?.porcentajeOtrosGastos || 0) / 100 || 1);
      monthlyData[mesNombre].sistemas = gastosMarketingData.find((gasto: { concept: string; }) => gasto.concept?.trim() === "Sistemas")?.[mesNombre] || 0 * (Number(porcentajeFlujo?.porcentajeOtrosGastos || 0) / 100 || 1);
      monthlyData[mesNombre].publicidad = gastosMarketingData.find((gasto: { concept: string; }) => gasto.concept?.trim() === "Publicidad")?.[mesNombre] || 0 * (Number(porcentajeFlujo?.porcentajeOtrosGastos || 0) / 100 || 1);
      monthlyData[mesNombre].viajesEventosOtros = gastosMarketingData.find((gasto: { concept: string; }) => gasto.concept?.trim() === "Viajes/eventos/Otros")?.[mesNombre] || 0 * (Number(porcentajeFlujo?.porcentajeOtrosGastos || 0) / 100 || 1);
      monthlyData[mesNombre].marketing = Number(monthlyData[mesNombre].redesSociales) +
        Number(monthlyData[mesNombre].sistemas) +
        Number(monthlyData[mesNombre].publicidad) +
        Number(monthlyData[mesNombre].viajesEventosOtros)

      monthlyData[mesNombre].cargos = gastosCargosData.reduce((acc: number, gasto: { [x: string]: string; }) => acc + (parseFloat(gasto[mesNombre]) || 0), 0);
      monthlyData[mesNombre].mantenimientoCtas = gastosCargosData.find((gasto: { concept: string; }) => gasto.concept?.trim() === "Mantenimiento Ctas.")?.[mesNombre] || 0 * (Number(porcentajeFlujo?.porcentajeServicios || 0) / 100 || 1);
      monthlyData[mesNombre].pagoDeuda = gastosCargosData.find((gasto: { concept: string; }) => gasto.concept?.trim() === "Pago de Deuda")?.[mesNombre] || 0 * (Number(porcentajeFlujo?.porcentajeServicios || 0) / 100 || 1);

      // Calcular el total de gastos
      monthlyData[mesNombre].gastos =
        Math.abs(Number(monthlyData[mesNombre].personal || 0)) +
        Math.abs(Number(monthlyData[mesNombre].servicios || 0)) +
        Math.abs(Number(monthlyData[mesNombre].marketing || 0)) +
        Math.abs(Number(monthlyData[mesNombre].cargos || 0));

      monthlyData[mesNombre].utilidadOperativa =
        Math.abs(monthlyData[mesNombre].ingresos) - Math.abs(monthlyData[mesNombre].gastos);

      monthlyData[mesNombre].impuestos = 0;  // You'll need to fetch this data
      monthlyData[mesNombre].utilidadNeta = monthlyData[mesNombre].utilidadOperativa - monthlyData[mesNombre].impuestos;
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
    processRow("Otros Ingresos", "leasing");
    processRow("GASTOS", "gastos");
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

    // Generar hoja de cálculo
    const ws = XLSX.utils.aoa_to_sheet(flujoAnualFormatted.rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Flujo Anual ${anio}`);

    // Buffer del archivo
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    // Configurar encabezados HTTP
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Flujo_Anual_${anio}.xlsx`);

    // Enviar el archivo
    res.send(excelBuffer);
  } catch (error: any) {
    console.error("Error al obtener Flujos:", error);
    return res.status(500).json({
      error: "Error al obtener Flujos",
      message: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
}

interface GastosPorMes {
  fecha: string;
  monto: number
  tc: number
  divisas: number;
  ingresosDivisas: number;
  leasing: number
  gastos: number
  ingresosPorPrestamos: number
  ingresos: number
  interesFondosSoles: number
  interesFondosDolares: number
  gastosBancarios: number
  personal: number,
  liderOperaciones: number,
  asistente1: number,
  asistente2: number,
  asistente3: number,
  asistente4: number,
  servicios: number,
  internet: number,
  celular: number,
  oficina: number,
  facturecElectr: number,
  gestionRiesgo: number,
  contabilidad: number,
  otros: number,
  prestamo: number,
  itfSoles: number,
  itfDolares: number,
  mantenimientoSoles: number,
  mantenimientoDolares: number,
  interbancarioSoles: number,
  interbancarioDolares: number,
  serviciosFondos: number,
  marketing: number,
  redesSociales: number,
  sistemas: number,
  publicidad: number,
  viajesEventosOtros: number,
  cargos: number,
  mantenimientoCtas: number,
  pagoDeuda: number,
  utilidadOperativa: number,
  impuestos: number,
  utilidadNeta: number,
  asistente5: number,
  eps: number,
  cts: number,
  afp: number
  flujoDeCaja: number,
  otrosGastos: number,
  ingresosPorDivisas: number,
  consultoria: number
  impuestosDetracciones: number,
  otrosGastosTotal: number,
  serviciosStaff: number,
  alquilerVehiculos: number,
  ti: number,
  leasingGasto: number,
  combustible: number,
  gastosExtras: number,
  serviciosOperativos: number
}

export async function graficaAcumuladosPrestamos(req: Request, res: Response): Promise<any | undefined> {
  try {
    const anio = parseInt(req.query.anio as string) || 2025;

    const porcentajeFlujo = await prisma.porcentajeFlujo.findFirst({
      where: {
        anio: Number(anio),
        tipoFlujo: "REAL_PRESTAMO" // Filtro por tipoFlujo
      }
    });

    const montoCambiado = await obtenerTotalOperacionCacluloFLUJO(
      String(anio)
    );

    const leasingData = await obtenerLeasingCacluloFLUJO(
      String(anio)
    );

    const prestamosData = await getTotalPrestamosFLUJO(String(anio));

    const gastosRecopilacion = await recopilarGastosAnioFLUJO(
      String(anio)
    );

    const mesesIngles = [
      "january", "february", "march", "april", "may", "june",
      "july", "august", "september", "october", "november", "december",
    ];

    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
    ];

    const resultados: GastosPorMes[] = [];

    mesesIngles.forEach((mes, index) => {
      let newResultados: GastosPorMes = {
        tc: 0,
        fecha: meses[index],
        monto: Number(montoCambiado[index]?.dolares || 0),
        ingresosPorDivisas: 0,
        ingresosPorPrestamos: Number(prestamosData[index]?.totalGanancia || 0),
        leasing: Number(Number(leasingData[index]?.rendimiento?.toFixed(2)) || 0),
        consultoria: 0,
        ingresos: Number(prestamosData[index]?.totalGanancia || 0),
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
        serviciosOperativos: 0
      }
      const mesNombre = mesesIngles[index]

      newResultados.tc = parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "TC")?.[mesNombre]) || 0;
      newResultados.itfSoles = parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "ITF S/.")?.[mesNombre]) * (Number(porcentajeFlujo?.porcentajeGastosBancarios) / 100) || 0;
      newResultados.itfDolares = parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "ITF $")?.[mesNombre]) * (Number(porcentajeFlujo?.porcentajeGastosBancarios) / 100) || 0;
      newResultados.mantenimientoSoles = parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "Mantto S/.")?.[mesNombre] || 0) * (Number(porcentajeFlujo?.porcentajeGastosBancarios) / 100);
      newResultados.mantenimientoDolares = parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "Mantto $")?.[mesNombre] || 0) * (Number(porcentajeFlujo?.porcentajeGastosBancarios) / 100);
      newResultados.interbancarioSoles = Math.abs(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "Interbancarios S/.")?.[mesNombre] || 0) * (Number(porcentajeFlujo?.porcentajeGastosBancarios) / 100));
      newResultados.interbancarioDolares = Math.abs(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "Interbancarios $")?.[mesNombre] || 0) * (Number(porcentajeFlujo?.porcentajeGastosBancarios) / 100));
      newResultados.gastosBancarios =
        Math.abs(Number(newResultados.itfSoles)) +
        Math.abs(Number(newResultados.itfDolares) * Number(newResultados.tc || 1)) +
        Math.abs(Number(newResultados.mantenimientoSoles)) +
        Math.abs(Number(newResultados.mantenimientoDolares) * Number(newResultados.tc || 1)) +
        Math.abs(Number(newResultados.interbancarioSoles)) +
        Math.abs(Number(newResultados.interbancarioDolares) * Number(newResultados.tc || 1))

      newResultados.asistente1 = Number(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "ASISTENTE 1")?.[mesNombre]) || 0) * (Number(porcentajeFlujo?.porcentajePersonal || 0) / 100);
      newResultados.asistente2 = Number(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "ASISTENTE 2")?.[mesNombre]) || 0) * (Number(porcentajeFlujo?.porcentajePersonal || 0) / 100);
      newResultados.asistente3 = Number(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "ASISTENTE 3")?.[mesNombre]) || 0) * (Number(porcentajeFlujo?.porcentajePersonal || 0) / 100);
      newResultados.asistente4 = Number(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "ASISTENTE 4")?.[mesNombre]) || 0) * (Number(porcentajeFlujo?.porcentajePersonal || 0) / 100);
      newResultados.asistente5 = Number(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "ASISTENTE 5")?.[mesNombre]) || 0) * (Number(porcentajeFlujo?.porcentajePersonal || 0) / 100);
      newResultados.eps = Number(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "EPS")?.[mesNombre]) || 0) * (Number(porcentajeFlujo?.porcentajePersonal || 0) / 100)
      newResultados.cts = Number(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "CTS")?.[mesNombre]) || 0) * (Number(porcentajeFlujo?.porcentajePersonal || 0) / 100)
      newResultados.afp = Number(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "AFP")?.[mesNombre]) || 0) * (Number(porcentajeFlujo?.porcentajePersonal || 0) / 100)
      newResultados.personal = Number(Number(Number(newResultados.asistente1) +
        Number(newResultados.asistente2) +
        Number(newResultados.asistente3) +
        Number(newResultados.asistente4) +
        Number(newResultados.asistente5) +
        Math.abs(Number(newResultados.eps)) +
        Math.abs((Number(newResultados.cts))) +
        Math.abs(Number(newResultados.afp))).toFixed(2))

      newResultados.internet = (Math.abs(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "Internet")?.[mesNombre]) || 0) * Number(porcentajeFlujo?.porcentajeServicios || 0) / 100);
      newResultados.celular = Math.abs(Math.abs(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "Celulares")?.[mesNombre]) || 0) * Number(porcentajeFlujo?.porcentajeServicios || 0) / 100);
      newResultados.oficina = Math.abs(Number(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "Oficina")?.[mesNombre]) || 0) * Number(porcentajeFlujo?.porcentajeServicios || 0) / 100);
      newResultados.facturecElectr = Math.abs(gastosRecopilacion.data.find((gasto: { concept: string; }) => gasto.concept === "TI - Facturación")?.[mesNombre] || 0) * Number(porcentajeFlujo?.porcentajeServicios || 0) / 100;
      newResultados.gestionRiesgo = Math.abs(gastosRecopilacion.data.find((gasto: { concept: string; }) => gasto.concept === "Cumplimiento")?.[mesNombre] || 0) * Number(porcentajeFlujo?.porcentajeServicios || 0) / 100;
      newResultados.contabilidad = Math.abs(Number(gastosRecopilacion.data.find((gasto: { concept: string; }) => gasto.concept === "Contabilidad")?.[mesNombre] || 0) * Number(porcentajeFlujo?.porcentajeServicios || 0) / 100);
      newResultados.marketing = Math.abs(gastosRecopilacion.data.find((gasto: { concept: string; }) => gasto.concept === "Marketing/Comercial")?.[mesNombre] || 0) * Number(porcentajeFlujo?.porcentajeServicios || 0) / 100;
      newResultados.otros = parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "Otros")?.[mesNombre]) || 0;
      newResultados.servicios = Number(Number(Number(newResultados.internet) +
        Number(newResultados.celular) +
        Number(newResultados.oficina) +
        Number(newResultados.facturecElectr) +
        Number(newResultados.gestionRiesgo) +
        Number(newResultados.contabilidad) +
        Number(newResultados.marketing)).toFixed(2));

      newResultados.combustible = Math.abs(Math.abs(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "Combustible")?.[mesNombre]) || 0) * Number(porcentajeFlujo?.porcentajeServiciosStaff || 0) / 100);
      newResultados.alquilerVehiculos = Math.abs(Math.abs(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === "Alquiler Autos")?.[mesNombre]) || 0) * Number(porcentajeFlujo?.porcentajeServiciosStaff || 0) / 100);
      newResultados.gastosExtras = Number(gastosRecopilacion.data.find((gasto: { concept: string; }) => gasto.concept === "Gastos Extras")?.[mesNombre] || 0);
      newResultados.viajesEventosOtros = Number(gastosRecopilacion.data.find((gasto: { concept: string; }) => gasto.concept === "Viajes/eventos/Otros")?.[mesNombre] || 0);

      newResultados.serviciosStaff = Number(newResultados.combustible) +
        Number(newResultados.alquilerVehiculos) +
        Number(newResultados.gastosExtras) +
        Number(newResultados.viajesEventosOtros)

      newResultados.cargos = 0;
      newResultados.mantenimientoCtas = gastosRecopilacion.data.find((gasto: { concept: string; }) => gasto.concept?.trim() === "Mantenimiento Ctas.")?.[mesNombre] || 0;
      newResultados.pagoDeuda = gastosRecopilacion.data.find((gasto: { concept: string; }) => gasto.concept?.trim() === "Pago de Deuda")?.[mesNombre] || 0

      newResultados.interesFondosSoles = (Math.abs(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === 'Interes x Fondo S/. ')?.[mesNombre]) || 0) * Number(porcentajeFlujo?.porcentajeServiciosFondos || 0) / 100)
      newResultados.interesFondosDolares = (Math.abs(parseFloat(gastosRecopilacion.data.find((item: { concept: string; }) => item.concept === 'Interes x Fondo $ ')?.[mesNombre]) || 0) * Number(porcentajeFlujo?.porcentajeServiciosFondos || 0) / 100)
      newResultados.serviciosFondos = Number(Number((Number(newResultados.interesFondosDolares) * Number(newResultados.tc || 1)) + Number(newResultados.interesFondosSoles)).toFixed(2))

      newResultados.impuestosDetracciones = Number(gastosRecopilacion.data.find((gasto: { concept: string; }) => gasto.concept === "Impuestos y Detracción")?.[mesNombre] || 0) * (Number(porcentajeFlujo?.porcentajeImpuestos)) / 100 || 1
      newResultados.otrosGastosTotal = Number(
        Math.abs(Number(newResultados.impuestosDetracciones || 0))
      )
    
      // Calcular el total de gastos
      newResultados.gastos =
        Number(Number(Math.abs(Number(newResultados.personal || 0)) +
          Math.abs(Number(newResultados.servicios || 0)) +
          Math.abs(Number(newResultados.serviciosStaff || 0)) +
          Math.abs(Number(newResultados.gastosBancarios || 0)) +
          Math.abs(Number(newResultados.serviciosFondos || 0)) +
          Math.abs(Number(newResultados.otrosGastosTotal || 0))).toFixed(2))

      newResultados.divisas = Number(Number(newResultados.gastos * 0.65).toFixed(2))
      newResultados.prestamo = Number(Number(newResultados.gastos * 0.2).toFixed(2))
      newResultados.leasingGasto = Number(Number(newResultados.gastos * 0.1).toFixed(2))
      newResultados.consultoria = Number(Number(newResultados.gastos * 0.05).toFixed(2))
      newResultados.utilidadOperativa =
        Number(Number(Math.abs(newResultados.ingresos) - Math.abs(newResultados.gastos)).toFixed(2));

      newResultados.impuestos = Number(gastosRecopilacion.data.find((gasto: { concept: string; }) => gasto.concept === "Impuestos y Detracción")?.[mesNombre] || 0)
      newResultados.utilidadNeta = Number(Number(Number(newResultados.utilidadOperativa) + newResultados.impuestos).toFixed(2));
      newResultados.flujoDeCaja = Number(newResultados.utilidadNeta); // O como se calcule
      resultados.push(newResultados)
    })

    return res.status(200).json(resultados);
  } catch (error) {
    console.log(error)
    return res.status(500).json('Error interno en el servidor')
  } finally {
    prisma.$disconnect()
  }
}