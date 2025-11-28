import { TipoFlujo } from '@prisma/client';
import { Request, Response } from 'express';
import * as XLSX from 'xlsx'
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import prisma from '../../config/database';


/*
interface FlujoFormatted {
  fecha: string;
  monto: { [mes: number]: number };
  ingresos: { [mes: number]: number, isTotal: boolean };
  ingresosPorDivisas?: { [mes: number]: number };
  ingresosPorPrestamos?: { [mes: number]: number };
  ingresosPorLeasing?: { [mes: number]: number };
  interesesPorInversion?: { [mes: number]: number };
  consultoria?: { [mes: number]: number };
  gastos: { [mes: number]: number, isTotal: boolean };
  personalTotal: { [mes: number]: number, isTotal: boolean };
  cts?: { [mes: number]: number };
  eps?: { [mes: number]: number };
  serviciosOperativos: { [mes: number]: number, isTotal: boolean };
  internet?: { [mes: number]: number };
  oficina?: { [mes: number]: number };
  celular?: { [mes: number]: number };
  factElectronica?: { [mes: number]: number };
  contabilidad?: { [mes: number]: number };
  gestionRiesgo?: { [mes: number]: number };
  marketingComercial?: { [mes: number]: number };
  serviciosStaff: { [mes: number]: number, isTotal: boolean };
  combustible?: { [mes: number]: number };
  alquilerVehiculos?: { [mes: number]: number };
  gastosExtras?: { [mes: number]: number };
  viajesEventosOtros?: { [mes: number]: number };
  gastosBancarios: { [mes: number]: number, isTotal: boolean };
  itfSoles?: { [mes: number]: number };
  itfDolares?: { [mes: number]: number };
  mantSoles?: { [mes: number]: number };
  mantDolares?: { [mes: number]: number };
  interbancarioSoles?: { [mes: number]: number };
  interbancariosDolares?: { [mes: number]: number };
  serviciosFondos: { [mes: number]: number, isTotal: boolean };
  interesFondosSoles?: { [mes: number]: number };
  interesFondosDolares?: { [mes: number]: number };
  otrosGastosTotal: { [mes: number]: number, isTotal: boolean };
  impuestosDetracciones?: { [mes: number]: number };
  otrosGastos?: { [mes: number]: number };
  utilidadOperativa?: { [mes: number]: number };
  impuestos?: { [mes: number]: number };
  utilidadNeta?: { [mes: number]: number };
  flujoCaja?: { [mes: number]: number };
  capitalTrabajo?: { [mes: number]: number };
  flujoCajaLibre?: { [mes: number]: number };
  personal: { nombre: string; monto?: number; anio: number; mes: number }[];
}
  */
/*
interface FlujoMensual {
  mes: number;
  value: number;
}

interface PersonalMensual {
  mes: number;
  value: number;
}

interface PersonalData {
  nombre: string;
  anio: number;
  montosMensuales: PersonalMensual[];
}
/*
interface FlujoAnualResponse {
  anio: number;
  monto: FlujoMensual[];
  ingresos: FlujoMensual[];
  gastos: FlujoMensual[];
  personal: PersonalData[];
  utilidadOperativa: FlujoMensual[];
  impuestos: FlujoMensual[];
  utilidadNeta: FlujoMensual[];
  flujoCaja: FlujoMensual[];
  capitalTrabajo: FlujoMensual[];
  flujoCajaLibre: FlujoMensual[];
  ingresosPorDivisas: FlujoMensual[];
  gastosBancarios: FlujoMensual[];
}
*/
export const registerFlujoAndPersonal = async (req: Request, res: Response) => {
  try {

    const ultimoFlujo = await prisma.flujo.findFirst({
      orderBy: {
        createdAt: 'desc'
      }
    })

    const result = await prisma.$transaction(async (tx) => {
      // Crear el registro de Flujo
      const flujoData = req.body.flujo;

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
          tipoFlujo: "PRESUPUESTO" as TipoFlujo,
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
};

export const editFlujoAndPersonal = async (req: Request, res: Response): Promise<any | undefined> => {
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
          tipoFlujo: "PRESUPUESTO" as TipoFlujo,
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
};

export const obtenerUnFlujo = async (req: Request, res: Response): Promise<any | undefined> => {

  const id = req.params.id
  try {
    const flujo = await prisma.flujo.findUnique({
      where: {
        id: Number(id)
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
  }
}

export const getFlujoAndPersonal = async (req: Request, res: Response): Promise<any | undefined> => {

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
        tipoFlujo: "PRESUPUESTO" as TipoFlujo
      },
      orderBy: [
        { mes: 'asc' },
        { dia: 'asc' },
      ],
      include: {
        personal: true
      },
      omit: {
        tipoFlujo: true
      }
    });

    console.log(flujos)

    if (!flujos || flujos.length === 0) {
      return res.status(200).json({
        message: 'No se encontraron flujos para el año especificado',
        data: { rows: [], dates: Array(13).fill('0-Fecha') },
      });
    }

    const monthlyData: { [month: number]: any } = {};
    const personalDataByMonth: { [month: number]: { [nombre: string]: { monto: number; id: string } } } = {};
    const uniqueDatesSet = new Set<string>();
    const allPersonalNames = new Set<string>();

    for (let i = 1; i <= 12; i++) {
      monthlyData[i] = {};
      personalDataByMonth[i] = {};
    }

    flujos.forEach(flujo => {
      const mes = flujo.mes as number;

      monthlyData[mes].monto = { value: (monthlyData[mes].monto?.value || 0) + (flujo.monto || 0), id: flujo.id };
      monthlyData[mes].tc = { value: flujo.tc, id: flujo.id };
      monthlyData[mes].ingresos = { value: (monthlyData[mes].ingresos?.value || 0) + (flujo.ingresos || 0), id: flujo.id };
      monthlyData[mes].ingresosPorDivisas = { value: (monthlyData[mes].ingresosPorDivisas?.value || 0) + (flujo.ingresosPorDivisas || 0), id: flujo.id };
      monthlyData[mes].ingresosPorPrestamos = { value: (monthlyData[mes].ingresosPorPrestamos?.value || 0) + (flujo.ingresosPorPrestamos || 0), id: flujo.id };
      monthlyData[mes].ingresosPorLeasing = { value: (monthlyData[mes].ingresosPorLeasing?.value || 0) + (flujo.ingresosPorLeasing || 0), id: flujo.id };
      monthlyData[mes].interesesPorInversion = { value: (monthlyData[mes].interesesPorInversion?.value || 0) + (flujo.interesesPorInversion || 0), id: flujo.id };
      monthlyData[mes].consultoria = { value: (monthlyData[mes].consultoria?.value || 0) + (flujo.consultoria || 0), id: flujo.id };
      monthlyData[mes].gastos = { value: (monthlyData[mes].gastos?.value || 0) + (flujo.gastos || 0), id: flujo.id };

      monthlyData[mes].personalTotal = { value: (monthlyData[mes].personalTotal?.value || 0) + (flujo.personalTotal || 0), id: flujo.id };

      flujo.personal.forEach(p => {
        personalDataByMonth[mes][p.nombre] = {
          monto: (personalDataByMonth[mes][p.nombre]?.monto || 0) + p.monto,
          id: String(flujo.id) // Asignamos el id al que pertenece este registro de personal
        };
        allPersonalNames.add(p.nombre);
      });
      

      monthlyData[mes].cts = { value: (monthlyData[mes].cts?.value || 0) + (flujo.cts || 0), id: flujo.id };
      monthlyData[mes].eps = { value: (monthlyData[mes].eps?.value || 0) + (flujo.eps || 0), id: flujo.id };
      monthlyData[mes].serviciosOperativos = { value: (monthlyData[mes].serviciosOperativos?.value || 0) + (flujo.serviciosOperativos || 0), id: flujo.id };
      monthlyData[mes].internet = { value: (monthlyData[mes].internet?.value || 0) + (flujo.internet || 0), id: flujo.id };
      monthlyData[mes].oficina = { value: (monthlyData[mes].oficina?.value || 0) + (flujo.oficina || 0), id: flujo.id };
      monthlyData[mes].celular = { value: (monthlyData[mes].celular?.value || 0) + (flujo.celular || 0), id: flujo.id };
      monthlyData[mes].factElectronica = { value: (monthlyData[mes].factElectronica?.value || 0) + (flujo.factElectronica || 0), id: flujo.id };
      monthlyData[mes].contabilidad = { value: (monthlyData[mes].contabilidad?.value || 0) + (flujo.contabilidad || 0), id: flujo.id };
      monthlyData[mes].gestionRiesgo = { value: (monthlyData[mes].gestionRiesgo?.value || 0) + (flujo.gestionRiesgo || 0), id: flujo.id };
      monthlyData[mes].marketingComercial = { value: (monthlyData[mes].marketingComercial?.value || 0) + (flujo.marketingComercial || 0), id: flujo.id };
      monthlyData[mes].servciosStaff = { value: (monthlyData[mes].servciosStaff?.value || 0) + (flujo.servciosStaff || 0), id: flujo.id };
      monthlyData[mes].combustible = { value: (monthlyData[mes].combustible?.value || 0) + (flujo.combustible || 0), id: flujo.id };
      monthlyData[mes].alquilerVehiculos = { value: (monthlyData[mes].alquilerVehiculos?.value || 0) + (flujo.alquilerVehiculos || 0), id: flujo.id };
      monthlyData[mes].gastosExtras = { value: (monthlyData[mes].gastosExtras?.value || 0) + (flujo.gastosExtras || 0), id: flujo.id };
      monthlyData[mes].viajesEventosOtros = { value: (monthlyData[mes].viajesEventosOtros?.value || 0) + (flujo.viajesEventosOtros || 0), id: flujo.id };
      monthlyData[mes].gastosBancarios = { value: (monthlyData[mes].gastosBancarios?.value || 0) + (flujo.gastosBancarios || 0), id: flujo.id };
      monthlyData[mes].itfSoles = { value: (monthlyData[mes].itfSoles?.value || 0) + (flujo.itfSoles || 0), id: flujo.id };
      monthlyData[mes].itfDolares = { value: (monthlyData[mes].itfDolares?.value || 0) + (flujo.itfDolares || 0), id: flujo.id };
      monthlyData[mes].mantSoles = { value: (monthlyData[mes].mantSoles?.value || 0) + (flujo.mantSoles || 0), id: flujo.id };
      monthlyData[mes].mantDolares = { value: (monthlyData[mes].mantDolares?.value || 0) + (flujo.mantDolares || 0), id: flujo.id };
      monthlyData[mes].interbancarioSoles = { value: (monthlyData[mes].interbancarioSoles?.value || 0) + (flujo.interbancarioSoles || 0), id: flujo.id };
      monthlyData[mes].interbancariosDolares = { value: (monthlyData[mes].interbancariosDolares?.value || 0) + (flujo.interbancariosDolares || 0), id: flujo.id };
      monthlyData[mes].serviciosFondos = { value: (monthlyData[mes].serviciosFondos?.value || 0) + (flujo.serviciosFondos || 0), id: flujo.id };
      monthlyData[mes].interesFondosSoles = { value: (monthlyData[mes].interesFondosSoles?.value || 0) + (flujo.interesFondosSoles || 0), id: flujo.id };
      monthlyData[mes].interesFondosDolares = { value: (monthlyData[mes].interesFondosDolares?.value || 0) + (flujo.interesFondosDolares || 0), id: flujo.id };
      monthlyData[mes].otrosGastosTotal = { value: (monthlyData[mes].otrosGastosTotal?.value || 0) + (flujo.otrosGastosTotal || 0), id: flujo.id };
      monthlyData[mes].impuestosDetracciones = { value: (monthlyData[mes].impuestosDetracciones?.value || 0) + (flujo.impuestosDetracciones || 0), id: flujo.id };
      monthlyData[mes].otrosGastos = { value: (monthlyData[mes].otrosGastos?.value || 0) + (flujo.otrosGastos || 0), id: flujo.id };
      monthlyData[mes].utilidadOperativa = { value: (monthlyData[mes].utilidadOperativa?.value || 0) + (flujo.utilidadOperativa || 0), id: flujo.id };
      monthlyData[mes].impuestos = { value: (monthlyData[mes].impuestos?.value || 0) + (flujo.impuestos || 0), id: flujo.id };
      monthlyData[mes].utilidadNeta = { value: (monthlyData[mes].utilidadNeta?.value || 0) + (flujo.utilidadNeta || 0), id: flujo.id };
      monthlyData[mes].flujoCaja = { value: (monthlyData[mes].flujoCaja?.value || 0) + (flujo.flujoCaja || 0), id: flujo.id };
      monthlyData[mes].capitalTrabajo = { value: (monthlyData[mes].capitalTrabajo?.value || 0) + (flujo.capitalTrabajo || 0), id: flujo.id };
      monthlyData[mes].flujoCajaLibre = { value: (monthlyData[mes].flujoCajaLibre?.value || 0) + (flujo.flujoCajaLibre || 0), id: flujo.id };


      const formattedDate = `${monthNames[mes]}-${String(flujo.dia).padStart(2, '0')}`;
      uniqueDatesSet.add(formattedDate);
    });

    const rows: any[] = [];
    const allColumns = Object.keys(prisma.flujo.fields);
    const excludedColumns = ['dia', 'mes', 'anio', 'createdAt', 'updatedAt', 'personal', 'id'];
    const dataColumns = allColumns.filter(col => !excludedColumns.includes(col));

    /*
    const processColumn = (columnName: string, getData: (month: number) => any) => {
      const columnData = [{ value: columnName }];
      for (let i = 1; i <= 12; i++) {
        columnData.push(getData(i) || { value: 0, id: null }); // Aseguramos que haya un objeto incluso si no hay datos
      }
      rows.push(columnData);
    };
    */

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
    allPersonalNames.forEach(name => {
      const personalColumnData: any[] = [{ value: name, isHeader: true }];
      for (let i = 1; i <= 12; i++) {
        personalColumnData.push(personalDataByMonth[i][name] ? { value: personalDataByMonth[i][name].monto } : { value: 0 });
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

};

export const exportarExcelFlujo = async (req: Request, res: Response): Promise<any | undefined> => {
  const monthNames = [
    "", "ene", "feb", "mar", "abr", "may", "jun",
    "jul", "ago", "sep", "oct", "nov", "dic"
  ];

  try {
    const anio = parseInt(req.body.anio as string) || new Date().getFullYear();

    const flujos = await prisma.flujo.findMany({
      where: {
        anio: anio,
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
      res.status(404).json({
        message: 'No se encontraron flujos para el año especificado',
        data: { rows: [], dates: Array(13).fill('0-Fecha') },
      });
      return;
    }

    const monthlyData: { [month: number]: any } = {};
    const personalDataByMonth: { [month: number]: { [nombre: string]: { monto: number; id: string } } } = {};
    const uniqueDatesSet = new Set<string>();
    const allPersonalNames = new Set<string>();

    for (let i = 1; i <= 12; i++) {
      monthlyData[i] = {};
      personalDataByMonth[i] = {};
    }

    flujos.forEach(flujo => {
      const mes = flujo.mes as number;

      monthlyData[mes].monto = { value: (monthlyData[mes].monto?.value || 0) + (flujo.monto || 0), id: flujo.id };
      monthlyData[mes].tc = { value: flujo.tc, id: flujo.id };
      monthlyData[mes].ingresos = { value: (monthlyData[mes].ingresos?.value || 0) + (flujo.ingresos || 0), id: flujo.id };
      monthlyData[mes].ingresosPorDivisas = { value: (monthlyData[mes].ingresosPorDivisas?.value || 0) + (flujo.ingresosPorDivisas || 0), id: flujo.id };
      monthlyData[mes].ingresosPorPrestamos = { value: (monthlyData[mes].ingresosPorPrestamos?.value || 0) + (flujo.ingresosPorPrestamos || 0), id: flujo.id };
      monthlyData[mes].ingresosPorLeasing = { value: (monthlyData[mes].ingresosPorLeasing?.value || 0) + (flujo.ingresosPorLeasing || 0), id: flujo.id };
      monthlyData[mes].interesesPorInversion = { value: (monthlyData[mes].interesesPorInversion?.value || 0) + (flujo.interesesPorInversion || 0), id: flujo.id };
      monthlyData[mes].consultoria = { value: (monthlyData[mes].consultoria?.value || 0) + (flujo.consultoria || 0), id: flujo.id };
      monthlyData[mes].gastos = { value: (monthlyData[mes].gastos?.value || 0) + (flujo.gastos || 0), id: flujo.id };


      monthlyData[mes].cts = { value: (monthlyData[mes].cts?.value || 0) + (flujo.cts || 0), id: flujo.id };
      monthlyData[mes].eps = { value: (monthlyData[mes].eps?.value || 0) + (flujo.eps || 0), id: flujo.id };
      monthlyData[mes].serviciosOperativos = { value: (monthlyData[mes].serviciosOperativos?.value || 0) + (flujo.serviciosOperativos || 0), id: flujo.id };
      monthlyData[mes].internet = { value: (monthlyData[mes].internet?.value || 0) + (flujo.internet || 0), id: flujo.id };
      monthlyData[mes].oficina = { value: (monthlyData[mes].oficina?.value || 0) + (flujo.oficina || 0), id: flujo.id };
      monthlyData[mes].celular = { value: (monthlyData[mes].celular?.value || 0) + (flujo.celular || 0), id: flujo.id };
      monthlyData[mes].factElectronica = { value: (monthlyData[mes].factElectronica?.value || 0) + (flujo.factElectronica || 0), id: flujo.id };
      monthlyData[mes].contabilidad = { value: (monthlyData[mes].contabilidad?.value || 0) + (flujo.contabilidad || 0), id: flujo.id };
      monthlyData[mes].gestionRiesgo = { value: (monthlyData[mes].gestionRiesgo?.value || 0) + (flujo.gestionRiesgo || 0), id: flujo.id };
      monthlyData[mes].marketingComercial = { value: (monthlyData[mes].marketingComercial?.value || 0) + (flujo.marketingComercial || 0), id: flujo.id };
      monthlyData[mes].servciosStaff = { value: (monthlyData[mes].servciosStaff?.value || 0) + (flujo.servciosStaff || 0), id: flujo.id };
      monthlyData[mes].combustible = { value: (monthlyData[mes].combustible?.value || 0) + (flujo.combustible || 0), id: flujo.id };
      monthlyData[mes].alquilerVehiculos = { value: (monthlyData[mes].alquilerVehiculos?.value || 0) + (flujo.alquilerVehiculos || 0), id: flujo.id };
      monthlyData[mes].gastosExtras = { value: (monthlyData[mes].gastosExtras?.value || 0) + (flujo.gastosExtras || 0), id: flujo.id };
      monthlyData[mes].viajesEventosOtros = { value: (monthlyData[mes].viajesEventosOtros?.value || 0) + (flujo.viajesEventosOtros || 0), id: flujo.id };
      monthlyData[mes].gastosBancarios = { value: (monthlyData[mes].gastosBancarios?.value || 0) + (flujo.gastosBancarios || 0), id: flujo.id };
      monthlyData[mes].itfSoles = { value: (monthlyData[mes].itfSoles?.value || 0) + (flujo.itfSoles || 0), id: flujo.id };
      monthlyData[mes].itfDolares = { value: (monthlyData[mes].itfDolares?.value || 0) + (flujo.itfDolares || 0), id: flujo.id };
      monthlyData[mes].mantSoles = { value: (monthlyData[mes].mantSoles?.value || 0) + (flujo.mantSoles || 0), id: flujo.id };
      monthlyData[mes].mantDolares = { value: (monthlyData[mes].mantDolares?.value || 0) + (flujo.mantDolares || 0), id: flujo.id };
      monthlyData[mes].interbancarioSoles = { value: (monthlyData[mes].interbancarioSoles?.value || 0) + (flujo.interbancarioSoles || 0), id: flujo.id };
      monthlyData[mes].interbancariosDolares = { value: (monthlyData[mes].interbancariosDolares?.value || 0) + (flujo.interbancariosDolares || 0), id: flujo.id };
      monthlyData[mes].serviciosFondos = { value: (monthlyData[mes].serviciosFondos?.value || 0) + (flujo.serviciosFondos || 0), id: flujo.id };
      monthlyData[mes].interesFondosSoles = { value: (monthlyData[mes].interesFondosSoles?.value || 0) + (flujo.interesFondosSoles || 0), id: flujo.id };
      monthlyData[mes].interesFondosDolares = { value: (monthlyData[mes].interesFondosDolares?.value || 0) + (flujo.interesFondosDolares || 0), id: flujo.id };
      monthlyData[mes].otrosGastosTotal = { value: (monthlyData[mes].otrosGastosTotal?.value || 0) + (flujo.otrosGastosTotal || 0), id: flujo.id };
      monthlyData[mes].impuestosDetracciones = { value: (monthlyData[mes].impuestosDetracciones?.value || 0) + (flujo.impuestosDetracciones || 0), id: flujo.id };
      monthlyData[mes].otrosGastos = { value: (monthlyData[mes].otrosGastos?.value || 0) + (flujo.otrosGastos || 0), id: flujo.id };
      monthlyData[mes].utilidadOperativa = { value: (monthlyData[mes].utilidadOperativa?.value || 0) + (flujo.utilidadOperativa || 0), id: flujo.id };
      monthlyData[mes].impuestos = { value: (monthlyData[mes].impuestos?.value || 0) + (flujo.impuestos || 0), id: flujo.id };
      monthlyData[mes].utilidadNeta = { value: (monthlyData[mes].utilidadNeta?.value || 0) + (flujo.utilidadNeta || 0), id: flujo.id };
      monthlyData[mes].flujoCaja = { value: (monthlyData[mes].flujoCaja?.value || 0) + (flujo.flujoCaja || 0), id: flujo.id };
      monthlyData[mes].capitalTrabajo = { value: (monthlyData[mes].capitalTrabajo?.value || 0) + (flujo.capitalTrabajo || 0), id: flujo.id };
      monthlyData[mes].flujoCajaLibre = { value: (monthlyData[mes].flujoCajaLibre?.value || 0) + (flujo.flujoCajaLibre || 0), id: flujo.id };

      flujo.personal.forEach(p => {
        personalDataByMonth[mes][p.nombre] = {
          monto: (personalDataByMonth[mes][p.nombre]?.monto || 0) + p.monto,
          id: String(flujo.id)
        };
        allPersonalNames.add(p.nombre);
      });

      const formattedDate = `${monthNames[mes]}-${String(flujo.dia).padStart(2, '0')}`;
      uniqueDatesSet.add(formattedDate);
    });

    const rows: any[] = [];
    const allColumns = Object.keys(prisma.flujo.fields);
    const excludedColumns = ['dia', 'mes', 'anio', 'createdAt', 'updatedAt', 'personal', 'id'];
    const dataColumns = allColumns.filter(col => !excludedColumns.includes(col));

    const processColumn = (columnName: string, getData: (month: number) => any) => {
      const columnData = [{ value: columnName }];
      for (let i = 1; i <= 12; i++) {
        columnData.push(getData(i) || { value: 0, id: null });
      }
      rows.push(columnData);
    };

    dataColumns.forEach(column => {
      processColumn(column, (month) => monthlyData[month]?.[column]);
    });

    allPersonalNames.forEach(name => {
      const personalColumnData: any[] = [{ value: name, isHeader: true }];
      for (let i = 1; i <= 12; i++) {
        personalColumnData.push(personalDataByMonth[i][name] ? { value: personalDataByMonth[i][name].monto } : { value: 0 });
      }
      rows.push(personalColumnData);
    });

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
      datesArray[index] = date;
    });

    const workbook = XLSX.utils.book_new();
    const worksheetData: any[][] = [];

    const dateHeaders = ['Descripción', ...datesArray];
    worksheetData.push(dateHeaders);

    rows.forEach((row: any[]) => {
      worksheetData.push(row.map(cell => cell?.value !== undefined ? cell.value : ''));
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, `Flujo de Caja ${anio}`);

    // Convertir el libro de trabajo a un buffer
    const excelBuffer: Buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // Enviar el archivo Excel como respuesta
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=flujo_de_caja_${anio}.xlsx`);

    // Crear un stream legible desde el buffer y pipearlo a la respuesta
    const excelStream = Readable.from(excelBuffer);
    await pipeline(excelStream, res);

  } catch (error: any) {
    console.error('Error al generar el archivo Excel:', error);
    res.status(500).json({
      error: 'Error al generar el archivo Excel',
      message: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
}

interface GraficaResultado {
  mes: string;
  gastos: number;
  ingresos: number
}

export async function graficaConsultoria(req: Request, res: Response): Promise<any | undefined> {
  const anio = parseInt(req.query.anio as string) || 2025;
  try {

    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
    ]

    const flujoPresupuesto = await prisma.flujo.findMany({
      where: {
        anio: Number(anio),
        tipoFlujo: "PRESUPUESTO" as TipoFlujo
      },
      orderBy: {
        mes: 'asc'
      }
    })

    const resultados: GraficaResultado[] = [];

    meses.forEach((mes, index) => {
      const addConsultoria: GraficaResultado = {
        mes: mes,
        gastos: Number(flujoPresupuesto[index]?.consultoria || 0),
        ingresos: Number(flujoPresupuesto[index]?.ingresos || 0)
      }
      resultados.push(addConsultoria)
    })

    return res.status(200).json(resultados);

  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Error en la base de datos' })
  }
}