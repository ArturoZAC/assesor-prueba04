import { TipoFlujo } from "@prisma/client";
import prisma from "../../config/database";
import { Request, Response } from "express";

interface MonthlyConsultoriaData {
  monto: { value: number; id: number };
  tc: { value: number; id: number };
  ingresos: { value: number; id: number };
  ingresosPorDivisas: { value: number; id: number };
  ingresosPorPrestamos: { value: number; id: number };
  ingresosPorLeasing: { value: number; id: number };
  interesesPorInversion: { value: number; id: number };
  consultoria: { value: number; id: number };
  cts: { value: number; id: number };
  eps: { value: number; id: number };
  personalTotal: { value: number; id: number };
  internet: { value: number; id: number };
  oficina: { value: number; id: number };
  celular: { value: number; id: number };
  factElectronica: { value: number; id: number }; // Corregido el nombre
  contabilidad: { value: number; id: number };
  gestionRiesgo: { value: number; id: number };
  marketingComercial: { value: number; id: number };
  combustible: { value: number; id: number };
  alquilerVehiculos: { value: number; id: number };
  gastosExtras: { value: number; id: number };
  viajesEventosOtros: { value: number; id: number };
  itfSoles: { value: number; id: number };
  itfDolares: { value: number; id: number };
  mantSoles: { value: number; id: number }; // Corregido el nombre
  mantDolares: { value: number; id: number }; // Corregido el nombre
  interbancarioSoles: { value: number; id: number };
  interbancariosDolares: { value: number; id: number }; // Corregido el nombre
  gastosBancarios: { value: number; id: number };
  interesFondosSoles: { value: number; id: number };
  interesFondosDolares: { value: number; id: number };
  serviciosFondos: { value: number; id: number };
  impuestosDetracciones: { value: number; id: number };
  otrosGastos: { value: number; id: number };
  otrosGastosTotal: { value: number; id: number };
  utilidadOperativa: { value: number; id: number };
  impuestos: { value: number; id: number };
  utilidadNeta: { value: number; id: number };
  flujoCaja: { value: number; id: number };
  capitalTrabajo: { value: number; id: number };
  flujoCajaLibre: { value: number; id: number };
  gastos: { value: number; id: number };
  serviciosOperativos: { value: number; id: number }; // Propiedad calculada
  servciosStaff: { value: number; id: number }; // Propiedad calculada
  // Propiedades para personal dinámico se añadirán directamente a monthlyData[mes]
  [key: string]: { value: number; id: number }; // Índice de firma para propiedades dinámicas como nombres de personal
}

export async function obtenerConsultoriaFlujo(req: Request, res: Response): Promise<any | undefined> {
  const monthNames = [
    "", // Para que el índice coincida con el número de mes
    "ene", "feb", "mar", "abr", "may", "jun",
    "jul", "ago", "sep", "oct", "nov", "dic"
  ];

  try {
    const anio = parseInt(req.query.anio as string) || new Date().getFullYear();

    const flujos = await prisma.flujo.findMany({
      where: {
        anio: anio,
        tipoFlujo: "CONSULTORIA" as TipoFlujo
      },
      orderBy: [
        { mes: 'asc' },
        { dia: 'asc' },
      ],
      include: {
        personal: true
      }
    });

    if (!flujos || flujos.length === 0) {
      return res.status(200).json({
        message: 'No se encontraron flujos para el año especificado',
        data: { rows: [], dates: ["Mes", ...monthNames.slice(1).map(name => name.charAt(0).toUpperCase() + name.slice(1))], }, // Simplificado
      });
    }

    const monthlyData: { [month: number]: MonthlyConsultoriaData } = {};
    const personalDataByMonth: { [month: number]: { [nombre: string]: { monto: number; id: string } } } = {};
    const uniqueDatesSet = new Set<string>();
    const allPersonalNames = new Set<string>();

    for (let i = 1; i <= 12; i++) {
      monthlyData[i] = {
        monto: { value: 0, id: 0 },
        tc: { value: 0, id: 0 },
        ingresos: { value: 0, id: 0 },
        ingresosPorDivisas: { value: 0, id: 0 },
        ingresosPorPrestamos: { value: 0, id: 0 },
        ingresosPorLeasing: { value: 0, id: 0 },
        interesesPorInversion: { value: 0, id: 0 },
        consultoria: { value: 0, id: 0 },
        cts: { value: 0, id: 0 },
        eps: { value: 0, id: 0 },
        personalTotal: { value: 0, id: 0 },
        internet: { value: 0, id: 0 },
        oficina: { value: 0, id: 0 },
        celular: { value: 0, id: 0 },
        factElectronica: { value: 0, id: 0 },
        contabilidad: { value: 0, id: 0 },
        gestionRiesgo: { value: 0, id: 0 },
        marketingComercial: { value: 0, id: 0 },
        combustible: { value: 0, id: 0 },
        alquilerVehiculos: { value: 0, id: 0 },
        gastosExtras: { value: 0, id: 0 },
        viajesEventosOtros: { value: 0, id: 0 },
        itfSoles: { value: 0, id: 0 },
        itfDolares: { value: 0, id: 0 },
        mantSoles: { value: 0, id: 0 },
        mantDolares: { value: 0, id: 0 },
        interbancarioSoles: { value: 0, id: 0 },
        interbancariosDolares: { value: 0, id: 0 },
        gastosBancarios: { value: 0, id: 0 },
        interesFondosSoles: { value: 0, id: 0 },
        interesFondosDolares: { value: 0, id: 0 },
        serviciosFondos: { value: 0, id: 0 },
        impuestosDetracciones: { value: 0, id: 0 },
        otrosGastos: { value: 0, id: 0 },
        otrosGastosTotal: { value: 0, id: 0 },
        utilidadOperativa: { value: 0, id: 0 },
        impuestos: { value: 0, id: 0 },
        utilidadNeta: { value: 0, id: 0 },
        flujoCaja: { value: 0, id: 0 },
        capitalTrabajo: { value: 0, id: 0 },
        flujoCajaLibre: { value: 0, id: 0 },
        gastos: { value: 0, id: 0 },
        serviciosOperativos: { value: 0, id: 0 },
        servciosStaff: { value: 0, id: 0 },
      } as MonthlyConsultoriaData; // Aseguramos el tipo
      personalDataByMonth[i] = {};
    }

    flujos.forEach(flujo => {
      const mes = flujo.mes as number;
      if (mes < 1 || mes > 12 || !Number.isInteger(mes)) {
        console.warn(`Skipping flujo with invalid month: ${mes}, id: ${flujo.id || 'N/A'}`);
        return; // Salta este flujo si el mes no es válido
      }

      let personalSubTotal = 0

      monthlyData[mes].monto.value = Number(flujo.monto || 0);
      monthlyData[mes].tc = { value: flujo.tc, id: flujo.id };
      monthlyData[mes].ingresos = { value: (monthlyData[mes].ingresos?.value || 0) + (flujo.ingresos || 0), id: flujo.id };
      monthlyData[mes].ingresosPorDivisas = { value: (monthlyData[mes].ingresosPorDivisas?.value || 0) + (flujo.ingresosPorDivisas || 0), id: flujo.id };
      monthlyData[mes].ingresosPorPrestamos = { value: (monthlyData[mes].ingresosPorPrestamos?.value || 0) + (flujo.ingresosPorPrestamos || 0), id: flujo.id };
      monthlyData[mes].ingresosPorLeasing = { value: (monthlyData[mes].ingresosPorLeasing?.value || 0) + (flujo.ingresosPorLeasing || 0), id: flujo.id };
      monthlyData[mes].interesesPorInversion = { value: (monthlyData[mes].interesesPorInversion?.value || 0) + (flujo.interesesPorInversion || 0), id: flujo.id };
      monthlyData[mes].consultoria = { value: (monthlyData[mes].consultoria?.value || 0) + (flujo.consultoria || 0), id: flujo.id };
      /*
      flujo.personal.forEach(p => {
        personalSubTotal = personalSubTotal + p.monto;
        monthlyData[mes][p.nombre] = {
          value: Number((personalDataByMonth[mes][p.nombre]?.monto || 0) + p.monto),
          id: Number(flujo.id)
        };
      })
    */
      flujo.personal.forEach(p => {
        allPersonalNames.add(p.nombre); // Recoge todos los nombres de personal únicos
        const personalMonto = p.monto

        // Inicializar la propiedad de personal si no existe para este mes
        if (!monthlyData[mes][p.nombre]) {
          monthlyData[mes][p.nombre] = { value: 0, id: 0 };
        }
        monthlyData[mes][p.nombre].value += personalMonto; // Acumular el monto del personal
        monthlyData[mes][p.nombre].id = Number(flujo.id); // Asignar el ID del flujo
        personalSubTotal += personalMonto; // Sumar al subtotal de personal para el mes
      });
      monthlyData[mes].cts.value = Number(flujo.cts || 0);
      monthlyData[mes].eps.value = Number(flujo.eps || 0);
      monthlyData[mes].personalTotal = { value: (monthlyData[mes].personalTotal?.value || 0) + (flujo.personalTotal || 0) + personalSubTotal, id: flujo.id };

      monthlyData[mes].internet = { value: ((monthlyData[mes].internet?.value || 0) + (flujo.internet || 0)), id: flujo.id };
      monthlyData[mes].oficina = { value: (monthlyData[mes].oficina?.value || 0) + (flujo.oficina || 0), id: flujo.id };
      monthlyData[mes].celular = { value: (monthlyData[mes].celular?.value || 0) + (flujo.celular || 0), id: flujo.id };
      monthlyData[mes].factElectronica = { value: (monthlyData[mes].factElectronica?.value || 0) + (flujo.factElectronica || 0), id: flujo.id };
      monthlyData[mes].contabilidad = { value: (monthlyData[mes].contabilidad?.value || 0) + (flujo.contabilidad || 0), id: flujo.id };
      monthlyData[mes].gestionRiesgo = { value: (monthlyData[mes].gestionRiesgo?.value || 0) + (flujo.gestionRiesgo || 0), id: flujo.id };
      monthlyData[mes].marketingComercial = { value: (monthlyData[mes].marketingComercial?.value || 0) + (flujo.marketingComercial || 0), id: flujo.id };
      monthlyData[mes].serviciosOperativos = {
        value: Number(
          (flujo.internet || 0) +
          (flujo.oficina || 0) +
          (flujo.celular || 0) +
          (flujo.factElectronica || 0) +
          (flujo.contabilidad || 0) +
          (flujo.gestionRiesgo || 0) +
          (flujo.marketingComercial || 0)
        ), id: flujo.id
      };

      monthlyData[mes].combustible.value = Number(flujo.combustible || 0);
      monthlyData[mes].alquilerVehiculos = { value: Number(flujo.alquilerVehiculos || 0), id: flujo.id };
      monthlyData[mes].gastosExtras = { value: Number(flujo.gastosExtras || 0), id: flujo.id };
      monthlyData[mes].viajesEventosOtros = { value: Number(flujo.viajesEventosOtros), id: flujo.id };
      monthlyData[mes].servciosStaff.value = Number((flujo.combustible || 0) +
        (flujo.alquilerVehiculos || 0) +
        (flujo.gastosExtras || 0) +
        (flujo.viajesEventosOtros || 0)
      )

      monthlyData[mes].itfSoles = { value: Number(flujo.itfSoles || 0), id: flujo.id };
      monthlyData[mes].itfDolares = { value: Number(flujo.itfDolares || 0), id: flujo.id };
      monthlyData[mes].mantSoles = { value: Number(flujo.mantSoles || 0), id: flujo.id };
      monthlyData[mes].mantDolares = { value: Number(flujo.mantDolares || 0), id: flujo.id };
      monthlyData[mes].interbancarioSoles = { value: Number(flujo.interbancarioSoles || 0), id: flujo.id };
      monthlyData[mes].interbancariosDolares = { value: Number(flujo.interbancariosDolares || 0), id: flujo.id };
      monthlyData[mes].gastosBancarios = {
        value: Number(
          monthlyData[mes].itfSoles?.value || 0 +
          monthlyData[mes].itfDolares?.value || 0 +
          monthlyData[mes].mantSoles?.value || 0 +
          monthlyData[mes].mantDolares?.value || 0 +
          monthlyData[mes].interbancarioSoles?.value || 0 +
          monthlyData[mes].interbancariosDolares?.value || 0
        ), id: flujo.id
      };

      monthlyData[mes].interesFondosSoles = { value: (flujo.interesFondosSoles || 0), id: flujo.id };
      monthlyData[mes].interesFondosDolares = { value: (flujo.interesFondosDolares || 0), id: flujo.id };
      monthlyData[mes].serviciosFondos = {
        value: Number(
          (monthlyData[mes].interesFondosDolares?.value || 0) +
          (monthlyData[mes].interesFondosSoles?.value || 0)
        ), id: flujo.id
      };

      monthlyData[mes].impuestosDetracciones = { value: (monthlyData[mes].impuestosDetracciones?.value || 0) + (flujo.impuestosDetracciones || 0), id: flujo.id };
      monthlyData[mes].otrosGastos = { value: (monthlyData[mes].otrosGastos?.value || 0) + (flujo.otrosGastos || 0), id: flujo.id };
      monthlyData[mes].otrosGastosTotal = { value: (monthlyData[mes].impuestosDetracciones?.value || 0) + (monthlyData[mes].otrosGastos?.value || 0), id: flujo.id };

      monthlyData[mes].utilidadOperativa = { value: (monthlyData[mes].utilidadOperativa?.value || 0) + (flujo.utilidadOperativa || 0), id: flujo.id };
      monthlyData[mes].impuestos = { value: (monthlyData[mes].impuestos?.value || 0) + (flujo.impuestos || 0), id: flujo.id };

      monthlyData[mes].utilidadNeta = { value: (monthlyData[mes].utilidadNeta?.value || 0) + (flujo.utilidadNeta || 0), id: flujo.id };
      monthlyData[mes].flujoCaja = { value: (monthlyData[mes].flujoCaja?.value || 0) + (flujo.flujoCaja || 0), id: flujo.id };
      monthlyData[mes].capitalTrabajo = { value: (monthlyData[mes].capitalTrabajo?.value || 0) + (flujo.capitalTrabajo || 0), id: flujo.id };
      monthlyData[mes].flujoCajaLibre = { value: (monthlyData[mes].flujoCajaLibre?.value || 0) + (flujo.flujoCajaLibre || 0), id: flujo.id };

      monthlyData[mes].gastos = {
        value: Number(
          monthlyData[mes].personalTotal?.value || 0 +
          monthlyData[mes].serviciosOperativos?.value || 0 +
          monthlyData[mes].gastosBancarios?.value || 0 +
          monthlyData[mes].serviciosFondos?.value || 0 +
          monthlyData[mes].otrosGastosTotal?.value || 0 +
          monthlyData[mes].serviciosStaff?.value || 0
        ), id: flujo.id
      };

      const formattedDate = `${monthNames[mes]}-${String(flujo.dia).padStart(2, '0')}`;
      uniqueDatesSet.add(formattedDate);
    });

    const rows: any[] = [];
    const allColumns = Object.keys(prisma.flujo.fields);
    const excludedColumns = ['dia', 'mes', 'anio', 'createdAt', 'updatedAt', 'personal', 'id'];
    const dataColumns = allColumns.filter(col => !excludedColumns.includes(col));

    const getCustomLabel = (columnName: string): string => {
      const labelMap: { [key: string]: string } = {
        ingresos: "Ingresos (S/.)",
        gastos: "Gastos",
        monto: "Monto Cambiado (US$)",
        flujoCaja: "Flujo de Caja",
        ingresosPorDivisas: "Ingresos por Divisas",
        ingresosPorPrestamos: "Ingresos por Prestamos",
        ingresosPorLeasing: "Ingresos por Leasing",
        interesesPorInversion: "Intereses por Inversion",
        consultoria: "Consultoria",
        utilidadNeta: "Utilidad Neta",
        personalTotal: "Personal",
        cts: "CTS",
        eps: "EPS",
        tc: "TC",
        tipoFlujo: "-",
        serviciosOperativos: "Servicios Operativos",
        internet: "Internet",
        oficina: "Oficina",
        celular: "Celular",
        facturecElectrico: "Facturec-Electrico",
        contabilidad: "Contabilidad",
        gestionRiesgo: "Gestion Riesgo",
        marketingComercial: "Marketing Comercial",
        servciosStaff: "Servicios Staff",
        combustible: "Combustible",
        alquilerVehiculos: "Alquiler Vehiculos",
        gastosExtras: "Gastos Extras",
        viajesEventosOtros: "Viajes Eventos Otros",
        gastosBancarios: "Gastos Bancarios",
        itfSoles: "ITF S/.",
        itfDolares: "ITF $",
        mantenimientoSoles: "Mantenimiento Soles",
        mantenimientoDolares: "Mantenimiento Dolares",
        serviciosFondos: "Servicios Fondos",
        interesFondosSoles: "Interes x Fondos S/.",
        interesFondosDolares: "Interes x Fondos $",
        otrosGastosTotal: "Otros Gastos Total",
        impuestosDetracciones: "Impuestos y Detracciones",
        otrosGastos: "Otros Gastos",
        utilidadOperativa: "Utilidad Operativa",
        impuestos: "Impuestos",
        mantSoles: "Mantt S/.",
        mantDolares: "Mantt $",
        interbancariosSoles: "Interbancarios S/.",
        interbancariosDolares: "Interbancarios $",
        capitalTrabajo: "Capital Trabajo",
        flujoCajaLibre: "Flujo Caja Libre",
      };

      return labelMap[columnName] || columnName;
    };

    const processColumn = (columnName: string, getData: (month: number) => any) => {
      const columnData = [{ value: getCustomLabel(columnName) }];
      for (let i = 1; i <= 12; i++) {
        columnData.push(getData(i) || { value: 0, id: null });
      }
      rows.push(columnData);
    };

    dataColumns.forEach(column => {
      processColumn(column, (month) => monthlyData[month]?.[column]);
    });

    // Procesar Personal como columnas dinámicas
    /*
    allPersonalNames.forEach(name => {
      const personalColumnData: any[] = [{ value: name, isHeader: true }];
      for (let i = 1; i <= 12; i++) {
        personalColumnData.push(personalDataByMonth[i][name] ? { value: personalDataByMonth[i][name].monto } : { value: 0 });
      }
      rows.push(personalColumnData);
    });
    */
    allPersonalNames.forEach(name => {
      const personalColumnData: any[] = [{ value: name, isHeader: true }]; // No es isHeader, es el nombre de la fila
      for (let i = 1; i <= 12; i++) {
        personalColumnData.push({
          value: monthlyData[i][name]?.value || 0,
          id: monthlyData[i][name]?.id || null
        });
      }
      rows.push(personalColumnData);
    });
    // Crear el array de fechas con "0-Fecha" para los meses sin datos
    const uniqueDatesSorted = Array.from(uniqueDatesSet).sort((a, b) => {
      const [monthAStr, dayAStr] = a.split('-');
      const [monthBStr, dayBStr] = b.split('-');
      const monthA = monthNames.indexOf(monthAStr);
      const monthB = monthNames.indexOf(monthBStr);
      const dayA = parseInt(dayAStr, 10);
      const dayB = parseInt(dayBStr, 10);

      if (monthA !== monthB) {
        return monthA - monthB;
      }
      return dayA - dayB;
    });

    const datesArray = Array(13).fill('0-Fecha');
    uniqueDatesSorted.forEach((date, index) => {
      if (index === 0) {
        datesArray[index] = "";
        datesArray[index + 1] = date;
      } else {
        datesArray[index + 1] = date;
      }
    });

    const responseData = {
      message: 'Flujos obtenidos exitosamente',
      data: {
        anio: anio,
        rows: rows,
        dates: datesArray,
      },
    };

    res.status(200).json(responseData);
  } catch (error: any) {
    console.error('Error al obtener Flujos:', error);
    res.status(500).json({
      error: 'Error al obtener Flujos',
      message: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }

}

export async function registrarConsultoriaFlujo(req: any, res: any) {
  /*
  try {
    const ultimoFlujo = await prisma.flujo.findFirst({
      orderBy: {
        createdAt: 'desc'
      }
    })

    const porcentajeFLujo = await prisma.porcentajeFlujo.findFirst({
      where: {
        anio: Number(new Date().getUTCFullYear()),
        tipoFlujo: "CONSULTORIA"
      },
      orderBy: [
        {
          anio: 'asc'
        }
      ],
    })

    const result = await prisma.$transaction(async (tx) => {
      // Crear el registro de Flujo
      const flujoData = req.body.flujo;

      let totalPersonalEtpsCts = 0

      if (req.body.personal && Array.isArray(req.body.personal)) {
        req.body.personal.forEach((p: any) => {
          totalPersonalEtpsCts += p.monto ? Number(p.monto) * Number(Number(porcentajeFLujo?.porcentajePersonal ?? 0) / 100) : 0;
        });
      }
      totalPersonalEtpsCts += flujoData.etps ? Number(flujoData.etps) * Number(Number(porcentajeFLujo?.porcentajePersonal ?? 0) / 100) : 0;
      totalPersonalEtpsCts += flujoData.cts ? Number(flujoData.cts) * Number(Number(porcentajeFLujo?.porcentajePersonal ?? 0) / 100) : 0;

      const ingresosTotal = flujoData.ingresosPorDivisas + flujoData.ingresosPorPrestamos + flujoData.ingresosPorLeasing + flujoData.interesesPorInversion + flujoData.consultoria

      const totalServiciosOperativos = (flujoData.internet ? Number(flujoData.internet) * (Number(porcentajeFLujo?.porcentajeServicios || 0) / 100) : 0) +
        (flujoData.oficina ? Number(flujoData.oficina) * (Number(porcentajeFLujo?.porcentajeServicios || 0) / 100) : 0) +
        (flujoData.celular ? Number(flujoData.celular) * (Number(porcentajeFLujo?.porcentajeServicios || 0) / 100) : 0) +
        (flujoData.factElectrica ? Number(flujoData.factElectrica) * (Number(porcentajeFLujo?.porcentajeServicios || 0) / 100) : 0) +
        (flujoData.contabilidad ? Number(flujoData.contabilidad) * (Number(porcentajeFLujo?.porcentajeServicios || 0) / 100) : 0) +
        (flujoData.gestionRiesgo ? Number(flujoData.gestionRiesgo) * (Number(porcentajeFLujo?.porcentajeServicios || 0) / 100) : 0) +
        (flujoData.marketingComercial ? Number(flujoData.marketingComercial) * (Number(porcentajeFLujo?.porcentajeServicios || 0) / 100) : 0);
        

      const totalServiciosStaff = (flujoData.combustible ? Number(flujoData.combustible) * (Number(porcentajeFLujo?.porcentajeServiciosStaff || 0) / 100) : 0) +
        (flujoData.alquilerVehiculos ? Number(flujoData.alquilerVehiculos) * (Number(porcentajeFLujo?.porcentajeServiciosStaff || 0) / 100) : 0) +
        (flujoData.gastosExtras ? Number(flujoData.gastosExtras) * (Number(porcentajeFLujo?.porcentajeServiciosStaff || 0) / 100) : 0) +
        (flujoData.viajesEventosOtros ? Number(flujoData.viajesEventosOtros) * (Number(porcentajeFLujo?.porcentajeServiciosStaff || 0) / 100) : 0);

      // Calcular el total de gastos bancarios
      const totalGastosBancariosSoles = (flujoData.itfSoles ? Number(flujoData.itfSoles) * (Number(porcentajeFLujo?.porcentajeGastosBancarios || 0) / 100) : 0) +
        (flujoData.mantSoles ? Number(flujoData.mantSoles) * (Number(porcentajeFLujo?.porcentajeGastosBancarios || 0) / 100) : 0) +
        (flujoData.interbancarioSoles ? Number(flujoData.interbancarioSoles) * (Number(porcentajeFLujo?.porcentajeGastosBancarios || 0) / 100) : 0);

      const totalGastosBancariosDolares = (flujoData.itfDolares ? Number(flujoData.itfDolares) * (Number(porcentajeFLujo?.porcentajeGastosBancarios || 0) / 100) : 0) +
        (flujoData.mantDolares ? Number(flujoData.mantDolares) * (Number(porcentajeFLujo?.porcentajeGastosBancarios || 0) / 100) : 0) +
        (flujoData.interbancariosDolares ? Number(flujoData.interbancariosDolares) * (Number(porcentajeFLujo?.porcentajeGastosBancarios || 0) / 100) : 0);
      const tipoCambio = flujoData.tc ? Number(flujoData.tc) : 1;

      const totalGastosBancarios = totalGastosBancariosSoles + (totalGastosBancariosDolares * tipoCambio);

      const totalServiciosFondos = (flujoData.interesFondosSoles ? Number(flujoData.interesFondosSoles) * (Number(porcentajeFLujo?.porcentajeServiciosFondos || 0) / 100) : 0) +
        ((flujoData.interesFondosDolares ? Number(flujoData.interesFondosDolares) * (Number(porcentajeFLujo?.porcentajeServiciosFondos || 0) / 100) : 0) * tipoCambio);

      const totalOtrosGastosTotal = (flujoData.impuestosDetracciones ? Number(flujoData.impuestosDetracciones) * (Number(porcentajeFLujo?.porcentajeImpuestos || 0) / 100) : 0) +
        (flujoData.otrosGastos ? Number(flujoData.otrosGastos) : 0);

      const totalGastos = totalServiciosStaff + totalPersonalEtpsCts + totalServiciosStaff + totalGastosBancarios + totalServiciosFondos + totalOtrosGastosTotal

      const utilidadOperativa = ingresosTotal - totalGastos

      const flujo = await tx.flujo.create({
        data: {
          dia: Number(flujoData.dia),
          mes: Number(flujoData.mes),
          anio: Number(flujoData.anio),
          tc: Number(flujoData.tc),
          tipoFlujo: "CONSULTORIA" as TipoFlujo,
          monto: flujoData.monto ? Number(flujoData.monto) : undefined,

          ingresos: Number(ingresosTotal || 0),
          ingresosPorDivisas: flujoData.ingresosPorDivisas ? Number(flujoData.ingresosPorDivisas) : undefined,
          ingresosPorPrestamos: flujoData.ingresosPorPrestamos ? Number(flujoData.ingresosPorPrestamos) : undefined,
          ingresosPorLeasing: flujoData.ingresosPorLeasing ? Number(flujoData.ingresosPorLeasing) : undefined,
          interesesPorInversion: flujoData.interesesPorInversion ? Number(flujoData.interesesPorInversion) : undefined,
          consultoria: flujoData.consultoria ? Number(flujoData.consultoria) : undefined,

          gastos: Number(totalGastos),

          personalTotal: Number(totalPersonalEtpsCts),
          cts: flujoData.cts ? Number(flujoData.cts) * (Number(porcentajeFLujo?.porcentajePersonal || 0) / 100) : undefined,
          eps: flujoData.etps ? Number(flujoData.etps) * (Number(porcentajeFLujo?.porcentajePersonal || 0) / 100) : undefined,


          serviciosOperativos: Number(totalServiciosOperativos || 0),
          internet: flujoData.internet ? Number(flujoData.internet) * (Number(porcentajeFLujo?.porcentajeServicios || 0) / 100) : undefined,
          oficina: flujoData.oficina ? Number(flujoData.oficina) * (Number(porcentajeFLujo?.porcentajeServicios || 0) / 100) : undefined,
          celular: flujoData.celular ? Number(flujoData.celular) * (Number(porcentajeFLujo?.porcentajeServicios || 0) / 100) : undefined,
          factElectronica: flujoData.factElectrica ? Number(flujoData.factElectrica) * (Number(porcentajeFLujo?.porcentajeServicios || 0) / 100) : undefined,
          contabilidad: flujoData.contabilidad ? Number(flujoData.contabilidad) * (Number(porcentajeFLujo?.porcentajeServicios || 0) / 100) : undefined,
          gestionRiesgo: flujoData.gestionRiesgo ? Number(flujoData.gestionRiesgo) * (Number(porcentajeFLujo?.porcentajeServicios || 0) / 100) : undefined,
          marketingComercial: flujoData.marketingComercial ? Number(flujoData.marketingComercial) * (Number(porcentajeFLujo?.porcentajeServicios || 0) / 100) : undefined,


          servciosStaff: Number(totalServiciosStaff || 0),
          combustible: flujoData.combustible ? Number(flujoData.combustible) * (Number(porcentajeFLujo?.porcentajeServiciosStaff || 0) / 100) : undefined,
          alquilerVehiculos: flujoData.alquilerVehiculos ? Number(flujoData.alquilerVehiculos) * (Number(porcentajeFLujo?.porcentajeServiciosStaff || 0)  / 100) : undefined,
          gastosExtras: flujoData.gastosExtras ? Number(flujoData.gastosExtras)* (Number(porcentajeFLujo?.porcentajeServiciosStaff || 0) / 100) : undefined,
          viajesEventosOtros: flujoData.viajesEventosOtros ? Number(flujoData.viajesEventosOtros) * (Number(porcentajeFLujo?.porcentajeServiciosStaff || 0) / 100) : undefined,


          gastosBancarios: Number(totalGastosBancarios || 0),
          itfSoles: flujoData.itfSoles ? Number(flujoData.itfSoles) * (Number(porcentajeFLujo?.porcentajeGastosBancarios || 0) / 100) : undefined,
          itfDolares: flujoData.itfDolares ? Number(flujoData.itfDolares) * (Number(porcentajeFLujo?.porcentajeGastosBancarios || 0) / 100) : undefined,
          mantSoles: flujoData.mantSoles ? Number(flujoData.mantSoles) * (Number(porcentajeFLujo?.porcentajeGastosBancarios || 0) / 100) : undefined,
          mantDolares: flujoData.mantDolares ? Number(flujoData.mantDolares) * (Number(porcentajeFLujo?.porcentajeGastosBancarios || 0) / 100) : undefined,
          interbancarioSoles: flujoData.interbancarioSoles ? Number(flujoData.interbancarioSoles) * (Number(porcentajeFLujo?.porcentajeGastosBancarios || 0) / 100) : undefined,
          interbancariosDolares: flujoData.interbancariosDolares ? Number(flujoData.interbancariosDolares) * (Number(porcentajeFLujo?.porcentajeGastosBancarios || 0) / 100) : undefined,


          serviciosFondos: Number(totalServiciosFondos || 0),
          interesFondosSoles: flujoData.interesFondosSoles ? Number(flujoData.interesFondosSoles) * (Number(porcentajeFLujo?.porcentajeServiciosFondos || 0) / 100) : undefined,
          interesFondosDolares: flujoData.interesFondosDolares ? Number(flujoData.interesFondosDolares) * (Number(porcentajeFLujo?.porcentajeServiciosFondos || 0) / 100) : undefined,


          otrosGastosTotal: Number(totalOtrosGastosTotal || 0),
          impuestosDetracciones: flujoData.impuestosDetracciones ? Number(flujoData.impuestosDetracciones) * (Number(porcentajeFLujo?.porcentajeImpuestos || 0) / 100) : undefined,
          otrosGastos: flujoData.otrosGastos ? Number(flujoData.otrosGastos) : undefined,


          utilidadOperativa: Number(utilidadOperativa || 0),
          impuestos: Math.round(utilidadOperativa / 10),


          utilidadNeta: Number(utilidadOperativa - Math.round(utilidadOperativa / 10)),


          flujoCaja: Number(Number(ultimoFlujo?.flujoCaja) + Number(utilidadOperativa - Math.round(utilidadOperativa / 10))),


          capitalTrabajo: flujoData.capitalTrabajo ? Number(flujoData.capitalTrabajo) : undefined,


          flujoCajaLibre: Number(ultimoFlujo?.flujoCajaLibre ? ultimoFlujo.flujoCajaLibre : 0) + Number(utilidadOperativa - Math.round(utilidadOperativa / 10)),

          personal: { // Conectar los registros de Personal
            create: req.body.personal.map((p: any) => ({ // Iterar sobre el array de Personal
              nombre: p.nombre,
              monto: p.monto ? Number(p.monto) * (Number(porcentajeFLujo?.porcentajePersonal || 0) / 100) : undefined,
              anio: Number(flujoData.anio),
              mes: Number(flujoData.mes),
            })),
          },
        },
        include: { // Incluir los datos de Personal en la respuesta
          personal: true,
        },
      });

      return flujo;
    });

    res.status(201).json({
      message: 'Flujo y Personal registrados exitosamente',
      data: result,
    });
  } catch (error: any) {
    console.error('Error al registrar Flujo y Personal:', error);
    res.status(500).json({
      error: 'Error al registrar Flujo y Personal',
      message: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
    */
  try {

    const ultimoFlujo = await prisma.flujo.findFirst({
      orderBy: {
        createdAt: 'desc'
      }
    })

    const result = await prisma.$transaction(async (tx) => {
      // Crear el registro de Flujo
      const flujoData = req.body.flujo;
      console.log("FLUJO DATA ", flujoData)

      let totalPersonalEtpsCts = 0

      if (req.body.personal && Array.isArray(req.body.personal)) {
        req.body.personal.forEach((p: any) => {
          console.log(p)
          totalPersonalEtpsCts += p.monto ? Number(p.monto) : 0;
        });
      }
      totalPersonalEtpsCts += flujoData.etps ? Number(flujoData.etps) : 0;
      totalPersonalEtpsCts += flujoData.cts ? Number(flujoData.cts) : 0;

      const ingresosTotal = flujoData.ingresosPorDivisas + flujoData.ingresosPorPrestamos + flujoData.ingresosPorLeasing + flujoData.interesesPorInversion + flujoData.consultoria


      const totalServiciosOperativos = (flujoData.internet ? Number(flujoData.internet) : 0) +
        (flujoData.oficina ? Number(flujoData.oficina) : 0) +
        (flujoData.celular ? Number(flujoData.celular) : 0) +
        (flujoData.factElectrica ? Number(flujoData.factElectrica) : 0) +
        (flujoData.contabilidad ? Number(flujoData.contabilidad) : 0) +
        (flujoData.gestionRiesgo ? Number(flujoData.gestionRiesgo) : 0) +
        (flujoData.marketingComercial ? Number(flujoData.marketingComercial) : 0);

      const totalServiciosStaff = (flujoData.combustible ? Number(flujoData.combustible) : 0) +
        (flujoData.alquilerVehiculos ? Number(flujoData.alquilerVehiculos) : 0) +
        (flujoData.gastosExtras ? Number(flujoData.gastosExtras) : 0) +
        (flujoData.viajesEventosOtros ? Number(flujoData.viajesEventosOtros) : 0);

      // Calcular el total de gastos bancarios
      const totalGastosBancariosSoles = (flujoData.itfSoles ? Number(flujoData.itfSoles) : 0) +
        (flujoData.mantSoles ? Number(flujoData.mantSoles) : 0) +
        (flujoData.interbancarioSoles ? Number(flujoData.interbancarioSoles) : 0);

      const totalGastosBancariosDolares = (flujoData.itfDolares ? Number(flujoData.itfDolares) : 0) +
        (flujoData.mantDolares ? Number(flujoData.mantDolares) : 0) +
        (flujoData.interbancariosDolares ? Number(flujoData.interbancariosDolares) : 0);
      const tipoCambio = flujoData.tc ? Number(flujoData.tc) : 1;

      const totalGastosBancarios = totalGastosBancariosSoles + (totalGastosBancariosDolares * tipoCambio);

      const totalServiciosFondos = (flujoData.interesFondosSoles ? Number(flujoData.interesFondosSoles) : 0) +
        ((flujoData.interesFondosDolares ? Number(flujoData.interesFondosDolares) : 0) * tipoCambio);

      const totalOtrosGastosTotal = (flujoData.impuestosDetracciones ? Number(flujoData.impuestosDetracciones) : 0) +
        (flujoData.otrosGastos ? Number(flujoData.otrosGastos) : 0);

      const totalGastos = totalServiciosStaff + totalPersonalEtpsCts + totalServiciosStaff + totalGastosBancarios + totalServiciosFondos + totalOtrosGastosTotal

      const utilidadOperativa = Math.abs(ingresosTotal) - totalGastos

      const flujo = await tx.flujo.create({
        data: {
          dia: Number(flujoData.dia),
          mes: Number(flujoData.mes),
          anio: Number(flujoData.anio),
          tc: Number(flujoData.tc),
          tipoFlujo: "CONSULTORIA" as TipoFlujo,
          monto: flujoData.monto ? Number(flujoData.monto) : undefined,

          ingresos: Number(ingresosTotal || 0),
          ingresosPorDivisas: flujoData.ingresosPorDivisas ? Number(flujoData.ingresosPorDivisas) : undefined,
          ingresosPorPrestamos: flujoData.ingresosPorPrestamos ? Number(flujoData.ingresosPorPrestamos) : undefined,
          ingresosPorLeasing: flujoData.ingresosPorLeasing ? Number(flujoData.ingresosPorLeasing) : undefined,
          interesesPorInversion: flujoData.interesesPorInversion ? Number(flujoData.interesesPorInversion) : undefined,
          consultoria: flujoData.consultoria ? Number(flujoData.consultoria) : undefined,

          gastos: Number(totalGastos),

          personalTotal: Number(totalPersonalEtpsCts),
          cts: flujoData.cts ? Number(flujoData.cts) : undefined,
          eps: flujoData.etps ? Number(flujoData.etps) : undefined,


          serviciosOperativos: Number(totalServiciosOperativos || 0),
          internet: flujoData.internet ? Number(flujoData.internet) : undefined,
          oficina: flujoData.oficina ? Number(flujoData.oficina) : undefined,
          celular: flujoData.celular ? Number(flujoData.celular) : undefined,
          factElectronica: flujoData.factElectrica ? Number(flujoData.factElectrica) : undefined,
          contabilidad: flujoData.contabilidad ? Number(flujoData.contabilidad) : undefined,
          gestionRiesgo: flujoData.gestionRiesgo ? Number(flujoData.gestionRiesgo) : undefined,
          marketingComercial: flujoData.marketingComercial ? Number(flujoData.marketingComercial) : undefined,


          servciosStaff: Number(totalServiciosStaff || 0),
          combustible: flujoData.combustible ? Number(flujoData.combustible) : undefined,
          alquilerVehiculos: flujoData.alquilerVehiculos ? Number(flujoData.alquilerVehiculos) : undefined,
          gastosExtras: flujoData.gastosExtras ? Number(flujoData.gastosExtras) : undefined,
          viajesEventosOtros: flujoData.viajesEventosOtros ? Number(flujoData.viajesEventosOtros) : undefined,


          gastosBancarios: Number(totalGastosBancarios || 0),
          itfSoles: flujoData.itfSoles ? Number(flujoData.itfSoles) : undefined,
          itfDolares: flujoData.itfDolares ? Number(flujoData.itfDolares) : undefined,
          mantSoles: flujoData.mantSoles ? Number(flujoData.mantSoles) : undefined,
          mantDolares: flujoData.mantDolares ? Number(flujoData.mantDolares) : undefined,
          interbancarioSoles: flujoData.interbancarioSoles ? Number(flujoData.interbancarioSoles) : undefined,
          interbancariosDolares: flujoData.interbancariosDolares ? Number(flujoData.interbancariosDolares) : undefined,


          serviciosFondos: Number(totalServiciosFondos || 0),
          interesFondosSoles: flujoData.interesFondosSoles ? Number(flujoData.interesFondosSoles) : undefined,
          interesFondosDolares: flujoData.interesFondosDolares ? Number(flujoData.interesFondosDolares) : undefined,


          otrosGastosTotal: Number(totalOtrosGastosTotal || 0),
          impuestosDetracciones: flujoData.impuestosDetracciones ? Number(flujoData.impuestosDetracciones) : undefined,
          otrosGastos: flujoData.otrosGastos ? Number(flujoData.otrosGastos) : undefined,


          utilidadOperativa: Number(utilidadOperativa),
          impuestos: Math.round(utilidadOperativa * 0.1),


          utilidadNeta: Number(utilidadOperativa - Math.round(utilidadOperativa * 0.1)),


          flujoCaja: Math.abs(Number(Number(ultimoFlujo?.flujoCaja)) + Number(utilidadOperativa - Math.round(utilidadOperativa / 10))),


          capitalTrabajo: flujoData.capitalTrabajo ? Number(flujoData.capitalTrabajo) : undefined,


          flujoCajaLibre: Number(ultimoFlujo?.flujoCajaLibre ? ultimoFlujo.flujoCajaLibre : 0) + Number(utilidadOperativa - Math.round(utilidadOperativa / 10)),

          personal: { // Conectar los registros de Personal
            create: req.body.personal.map((p: any) => ({ // Iterar sobre el array de Personal
              nombre: p.nombre,
              monto: p.monto ? Number(p.monto) : undefined,
              anio: Number(flujoData.anio),
              mes: Number(flujoData.mes),
            })),
          },
        },
        include: { // Incluir los datos de Personal en la respuesta
          personal: true,
        },
      });

      return flujo;
    });

    res.status(201).json({
      message: 'Flujo y Personal registrados exitosamente',
      data: result,
    });
  } catch (error: any) {
    console.error('Error al registrar Flujo y Personal:', error);
    res.status(500).json({
      error: 'Error al registrar Flujo y Personal',
      message: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function editarConsultoriaFlujo(req: any, res: any) {
  try {
    const id = parseInt(req.params.id);

    const result = await prisma.$transaction(async (tx) => {

      const flujoData = req.body.flujo;

      let totalPersonalEtpsCts = 0;
      if (flujoData.personal && Array.isArray(flujoData.personal)) {
        flujoData.personal.forEach((p: any) => {

          totalPersonalEtpsCts += p.monto ? Number(p.monto) : 0;
        });
      }
      totalPersonalEtpsCts = totalPersonalEtpsCts + Number(flujoData.eps || 0);
      console.log(totalPersonalEtpsCts)
      totalPersonalEtpsCts = totalPersonalEtpsCts + Number(flujoData.cts || 0);
      console.log(totalPersonalEtpsCts)

      const ingresosTotal = Number(flujoData.ingresosPorDivisas || 0) + Number(flujoData.ingresosPorPrestamos || 0) + Number(flujoData.ingresosPorLeasing || 0) + Number(flujoData.interesesPorInversion || 0) + Number(flujoData.consultoria || 0)
      console.log(ingresosTotal)
      console.log(flujoData.ingresosPorDivisas)
      console.log(flujoData.ingresosPorPrestamos)
      console.log(flujoData.ingresosPorLeasing)
      console.log(flujoData.interesesPorInversion)
      console.log(flujoData.consultoria)

      const totalServiciosOperativos = (flujoData.internet ? Number(flujoData.internet) : 0) +
        (flujoData.oficina ? Number(flujoData.oficina) : 0) +
        (flujoData.celular ? Number(flujoData.celular) : 0) +
        (flujoData.factElectrica ? Number(flujoData.factElectrica) : 0) +
        (flujoData.contabilidad ? Number(flujoData.contabilidad) : 0) +
        (flujoData.gestionRiesgo ? Number(flujoData.gestionRiesgo) : 0) +
        (flujoData.marketingComercial ? Number(flujoData.marketingComercial) : 0);


      const totalServiciosStaff = (flujoData.combustible ? Number(flujoData.combustible) : 0) +
        (flujoData.alquilerVehiculos ? Number(flujoData.alquilerVehiculos) : 0) +
        (flujoData.gastosExtras ? Number(flujoData.gastosExtras) : 0) +
        (flujoData.viajesEventosOtros ? Number(flujoData.viajesEventosOtros) : 0);

      // Calcular el total de gastos bancarios
      const totalGastosBancariosSoles = (flujoData.itfSoles ? Number(flujoData.itfSoles) : 0) +
        (flujoData.mantSoles ? Number(flujoData.mantSoles) : 0) +
        (flujoData.interbancarioSoles ? Number(flujoData.interbancarioSoles) : 0);

      const totalGastosBancariosDolares = (flujoData.itfDolares ? Number(flujoData.itfDolares) : 0) +
        (flujoData.mantDolares ? Number(flujoData.mantDolares) : 0) +
        (flujoData.interbancariosDolares ? Number(flujoData.interbancariosDolares) : 0);
      const tipoCambio = flujoData.tc ? Number(flujoData.tc) : 1;  // Valor por defecto de 1

      const totalGastosBancarios = totalGastosBancariosSoles + (totalGastosBancariosDolares * tipoCambio);

      // Calcular el total de serviciosFondos
      const totalServiciosFondos = (flujoData.interesFondosSoles ? Number(flujoData.interesFondosSoles) : 0) +
        ((flujoData.interesFondosDolares ? Number(flujoData.interesFondosDolares) : 0) * tipoCambio);

      // Calcular el total de otrosGastosTotal
      const totalOtrosGastosTotal = (flujoData.impuestosDetracciones ? Number(flujoData.impuestosDetracciones) : 0) +
        (flujoData.otrosGastos ? Number(flujoData.otrosGastos) : 0);

      const totalGastos = totalServiciosStaff + totalPersonalEtpsCts + totalServiciosStaff + totalGastosBancarios + totalServiciosFondos + totalOtrosGastosTotal

      const utilidadOperativa = ingresosTotal - totalGastos

      const flujoActualizado = await tx.flujo.update({
        where: { id: id },
        data: {
          dia: Number(flujoData.dia),
          mes: Number(flujoData.mes),
          anio: Number(flujoData.anio),
          tc: Number(flujoData.tc),
          monto: flujoData.monto ? Number(flujoData.monto) : undefined,
          tipoFlujo: "CONSULTORIA" as TipoFlujo,
          ingresos: Number(ingresosTotal || 0),
          ingresosPorDivisas: flujoData.ingresosPorDivisas ? Number(flujoData.ingresosPorDivisas) : undefined,
          ingresosPorPrestamos: flujoData.ingresosPorPrestamos ? Number(flujoData.ingresosPorPrestamos) : undefined,
          ingresosPorLeasing: flujoData.ingresosPorLeasing ? Number(flujoData.ingresosPorLeasing) : undefined,
          interesesPorInversion: flujoData.interesesPorInversion ? Number(flujoData.interesesPorInversion) : undefined,
          consultoria: flujoData.consultoria ? Number(flujoData.consultoria) : undefined,

          gastos: Number(totalGastos),

          personalTotal: Number(totalPersonalEtpsCts),
          cts: flujoData.cts ? Number(flujoData.cts) : undefined,
          eps: flujoData.etps ? Number(flujoData.etps) : undefined,

          serviciosOperativos: Number(totalServiciosOperativos || 0),
          internet: flujoData.internet ? Number(flujoData.internet) : undefined,
          oficina: flujoData.oficina ? Number(flujoData.oficina) : undefined,
          celular: flujoData.celular ? Number(flujoData.celular) : undefined,
          factElectronica: flujoData.factElectrica ? Number(flujoData.factElectrica) : undefined,
          contabilidad: flujoData.contabilidad ? Number(flujoData.contabilidad) : undefined,
          gestionRiesgo: flujoData.gestionRiesgo ? Number(flujoData.gestionRiesgo) : undefined,
          marketingComercial: flujoData.marketingComercial ? Number(flujoData.marketingComercial) : undefined,

          servciosStaff: Number(totalServiciosStaff || 0),
          combustible: flujoData.combustible ? Number(flujoData.combustible) : undefined,
          alquilerVehiculos: flujoData.alquilerVehiculos ? Number(flujoData.alquilerVehiculos) : undefined,
          gastosExtras: flujoData.gastosExtras ? Number(flujoData.gastosExtras) : undefined,
          viajesEventosOtros: flujoData.viajesEventosOtros ? Number(flujoData.viajesEventosOtros) : undefined,

          gastosBancarios: Number(totalGastosBancarios || 0),
          itfSoles: flujoData.itfSoles ? Number(flujoData.itfSoles) : undefined,
          itfDolares: flujoData.itfDolares ? Number(flujoData.itfDolares) : undefined,
          mantSoles: flujoData.mantSoles ? Number(flujoData.mantSoles) : undefined,
          mantDolares: flujoData.mantDolares ? Number(flujoData.mantDolares) : undefined,
          interbancarioSoles: flujoData.interbancarioSoles ? Number(flujoData.interbancarioSoles) : undefined,
          interbancariosDolares: flujoData.interbancariosDolares ? Number(flujoData.interbancariosDolares) : undefined,

          serviciosFondos: Number(totalServiciosFondos || 0),
          interesFondosSoles: flujoData.interesFondosSoles ? Number(flujoData.interesFondosSoles) : undefined,
          interesFondosDolares: flujoData.interesFondosDolares ? Number(flujoData.interesFondosDolares) : undefined,

          otrosGastosTotal: Number(totalOtrosGastosTotal || 0),
          impuestosDetracciones: flujoData.impuestosDetracciones ? Number(flujoData.impuestosDetracciones) : undefined,
          otrosGastos: flujoData.otrosGastos ? Number(flujoData.otrosGastos) : undefined,

          utilidadOperativa: Number(utilidadOperativa || 0),
          impuestos: Math.round(utilidadOperativa / 10),
          utilidadNeta: Number(utilidadOperativa - Math.round(utilidadOperativa / 10)),
          flujoCaja: Number(flujoData.flujoCaja || 0),
          capitalTrabajo: flujoData.capitalTrabajo ? Number(flujoData.capitalTrabajo) : undefined,
          flujoCajaLibre: Number(Number(flujoData.flujoCajaLibre || 0).toFixed(2)),
        },
        include: {
          personal: true
        }
      });

      const personalData = flujoData.personal;
      if (personalData && Array.isArray(personalData)) {

        const eliminados = await tx.personal.deleteMany({
          where: { flujoId: id },
        });
        console.log(eliminados)
        const personalCreado = await tx.personal.createMany({
          data: personalData.map((p: any) => ({
            nombre: p.nombre,
            monto: p.monto ? Number(p.monto) : 0,
            anio: Number(p.anio),
            mes: Number(p.mes),
            flujoId: id
          })),
        });
        console.log(personalCreado)
      }
      console.log(flujoActualizado)
    });

    return res.status(200).json({
      message: 'Flujo y Personal actualizados exitosamente',
      data: result,
    });
  } catch (error: any) {
    console.error('Error al actualizar Flujo y Personal:', error);
    res.status(500).json({
      error: 'Error al actualizar Flujo y Personal',
      message: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function obtenerIdConsultoriaFlujo(req: Request, res: Response): Promise<any | undefined> {
  const id = req.params.id
  try {
    const flujo = await prisma.flujo.findUnique({
      where: {
        id: Number(id),
        tipoFlujo: 'CONSULTORIA'
      },
      include: {
        personal: true
      }
    })

    return res.status(200).json({
      flujo
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Error en la base de datos' })
  } finally {
    prisma.$disconnect();
  }
}