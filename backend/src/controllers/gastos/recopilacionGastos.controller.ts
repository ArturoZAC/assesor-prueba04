import { Prisma, PrismaClient, TipoGasto } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
// import { getMonth, getYear } from "date-fns";
import * as XLSX from "xlsx";
import { Request, Response } from "express";

const prisma = new PrismaClient();

interface FinancialDataItem {
  concept: string;
  january: Decimal | null | number;
  february: Decimal | null | number;
  march: Decimal | null | number;
  april: Decimal | null | number;
  may: Decimal | null | number;
  june: Decimal | null | number;
  july: Decimal | null | number;
  august: Decimal | null | number;
  september: Decimal | null | number;
  october: Decimal | null | number;
  november: Decimal | null | number;
  december: Decimal | null | number;
  [key: string]: Decimal | null | number | string;
}

/*
interface FinancialDataItem__GASTOS {
  concept: string;
  january: Decimal | null;
  february: Decimal | null;
  march: Decimal | null;
  april: Decimal | null;
  may: Decimal | null;
  june: Decimal | null;
  july: Decimal | null;
  august: Decimal | null;
  september: Decimal | null;
  october: Decimal | null;
  november: Decimal | null;
  december: Decimal | null;
  tipo_gasto: string;
}
*/

export function getNombreFormateado(nombre: string) {
  if (nombre === "COMBUSTIBLE") {
    return "Combustible";
  } else if (nombre === "ALQUILER") {
    return "Alquiler Autos";
  } else if (nombre === "INTERNET") {
    return "Internet";
  } else if (nombre === "CUMPLIMIENTO") {
    return "Cumplimiento";
  } else if (nombre === "CELULARES") {
    return "Celulares";
  } else if (nombre === "TI") {
    return "TI - Facturación";
  } else if (nombre === "CONTABILIDAD") {
    return "Contabilidad";
  } else if (nombre === "OFICINA") {
    return "Oficina";
  } else if (nombre === "RISK") {
    return "Cumplimiento";
  } else if (nombre === "MARKETING/COMERCIAL") {
    return "Marketing/Comercial";
  } else if (nombre === "FACTURACIÓN ELÉCTRICA") {
    return "Facturación Eléctrica";
  } else if (nombre === "SEGURO VEHICULO") {
    return "Seguro Vehicular";
  }

  return nombre;
}

export async function recopilarGastosAnio(req: Request, res: Response): Promise<any | undefined> {
  try {
    let year: number;
    const yearParam = req.query.year;

    if (yearParam && typeof yearParam === "string" && !isNaN(parseInt(yearParam, 10))) {
      year = parseInt(yearParam, 10);
    } else {
      year = new Date().getFullYear();
    }
    const mesesNumericos = Array.from({ length: 12 }, (_, i) => i + 1);
    const meses = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
    // console.log("MESES ", meses);
    const tipoGastos = ["OVERNIGHT_BCP", "ITF", "MANTENIMIENTO"];
    const monedas = ["PEN", "USD"];

    const resultado: FinancialDataItem[] = [];
    const gastosPersonalesPorMesIndividual: { [concepto: string]: { [mes: number]: Decimal } } = {};

    const gastosPersonalesTotalPorMes: { [mes: number]: Decimal } = {};

    mesesNumericos.forEach((mes) => {
      gastosPersonalesTotalPorMes[mes] = new Decimal(0);
    });

    const tcPorMes: {
      [mes: number]: number;
    } = {};

    const tc = await prisma.tipoCambioMes.findMany({
      where: {
        anio: Number(year),
      },
      orderBy: {
        mes: "asc",
      },
    });

    tc.forEach((tcItem) => {
      tcPorMes[tcItem.mes] = tcItem.valor;
    });

    const totalTC: FinancialDataItem = {
      concept: "TC",
      january: tcPorMes[1] || null,
      february: tcPorMes[2] || null,
      march: tcPorMes[3] || null,
      april: tcPorMes[4] || null,
      may: tcPorMes[5] || null,
      june: tcPorMes[6] || null,
      july: tcPorMes[7] || null,
      august: tcPorMes[8] || null,
      september: tcPorMes[9] || null,
      october: tcPorMes[10] || null,
      november: tcPorMes[11] || null,
      december: tcPorMes[12] || null,
    };

    resultado.push(totalTC);

    const tipoGastoPersonal = ["PERSONAL_PERSONAS", "PERSONAL"];

    const conceptosAExcluir = ["EPS", "AFP", "CTS"];

    const gastosPersonalesRecopilados = await prisma.gasto.findMany({
      where: {
        tipoGasto: {
          in: tipoGastoPersonal as TipoGasto[],
        },
        fecha: {
          gte: new Date(`${year}-01-01T00:00:00.000Z`),
          lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
        },
      },
    });

    gastosPersonalesRecopilados.forEach((gasto) => {
      mesesNumericos.forEach((mes) => {
        if (gasto.concepto) {
          if (!gastosPersonalesPorMesIndividual[gasto.concepto]) {
            gastosPersonalesPorMesIndividual[gasto.concepto] = {};
          }
          gastosPersonalesPorMesIndividual[gasto.concepto][mes] = new Decimal(0);
        }
      });
    });

    gastosPersonalesRecopilados.forEach((gasto) => {
      if (gasto.fecha && gasto.concepto !== null) {
        const mesF = gasto.fecha.getUTCMonth() + 1;

        if (gastosPersonalesPorMesIndividual[gasto.concepto] !== undefined) {
          gastosPersonalesPorMesIndividual[gasto.concepto][mesF] = (
            gastosPersonalesPorMesIndividual[gasto.concepto][mesF] || new Decimal(0)
          ).plus(Math.abs(Number(gasto.monto)) || 0);

          if (!conceptosAExcluir.includes(gasto.concepto)) {
            gastosPersonalesTotalPorMes[mesF] = gastosPersonalesTotalPorMes[mesF].plus(
              Math.abs(Number(gasto.monto)) || 0
            );
          }
        }
        /*
        mesesNumericos.forEach((mes) => {
          if (mesF === mes) {
            gastosPersonalesPorMesIndividual[gasto.concepto || ''][mes] = (
              gastosPersonalesPorMesIndividual[gasto.concepto || ''][mes] ||
              new Decimal(0)
            ).plus(Math.abs(Number(gasto.monto)) || 0);
            console.log('GASTOS: ', gastosPersonalesPorMesIndividual)
            gastosPersonalesTotalPorMes[mes] = gastosPersonalesTotalPorMes[mes].plus(Math.abs(Number(gasto.monto)) || 0);
          }
        })
        */
      }
    });

    /** NO CAMBIES EL as Decimal || null, va a dar ERROR  */
    const totalGastosPersonalesItem: FinancialDataItem = {
      concept: "GASTOS DE PERSONAL",
      january: null,
      february: null,
      march: null,
      april: null,
      may: null,
      june: null,
      july: null,
      august: null,
      september: null,
      october: null,
      november: null,
      december: null,
    };

    const currentYear = new Date().getUTCFullYear();
    const startOfYear = new Date(currentYear, 0, 1, 0, 0, 0, 0);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);
    const leasingData = await prisma.leasingOperacion.findMany({
      where: {
        fecha_final: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
    });

    const monthlyRendimientosLeasing: { [month: number]: Decimal } = {};

    leasingData.forEach((item) => {
      const fechaInicial = new Date(item.fecha_inicial);
      const itemMonth = fechaInicial.getUTCMonth();
      monthlyRendimientosLeasing[itemMonth] = (
        monthlyRendimientosLeasing[itemMonth] || new Decimal(0)
      ).plus(item.rendimiento);
    });

    const leasingResult: FinancialDataItem = {
      concept: "Leasing",
      january: null,
      february: null,
      march: null,
      april: null,
      may: null,
      june: null,
      july: null,
      august: null,
      september: null,
      october: null,
      november: null,
      december: null,
    };

    Object.entries(monthlyRendimientosLeasing).forEach(([month, rendimiento]) => {
      const monthIndex = parseInt(month, 10);
      const monthName = new Intl.DateTimeFormat("en-US", { month: "long" })
        .format(new Date(year, monthIndex, 1))
        .toLowerCase() as keyof FinancialDataItem;
      leasingResult[monthName] = (rendimiento.toNumber() as string & Decimal & number) || null;
    });

    /** MUY NECESARIO, NO BORRAR */
    resultado.push({
      concept: "Ingresos",
      january: null,
      february: null,
      march: null,
      april: null,
      may: null,
      june: null,
      july: null,
      august: null,
      september: null,
      october: null,
      november: null,
      december: null,
    });
    resultado.push(leasingResult);

    // Crear objetos para cada tipo de gasto y moneda
    tipoGastos.forEach((tipo) => {
      monedas.forEach((moneda) => {
        const concepto = `${tipo}_${moneda === "PEN" ? "SOLES" : "DOLARES"}`;
        let conceptName = "";
        conceptName = concepto === "OVERNIGHT_BCP_SOLES" ? "Interes x Inversión S/." : conceptName;
        conceptName = concepto === "OVERNIGHT_BCP_DOLARES" ? "Interes x Inversión $" : conceptName;
        conceptName = concepto === "ITF_SOLES" ? "ITF S/." : conceptName;
        conceptName = concepto === "ITF_DOLARES" ? "ITF $" : conceptName;
        conceptName = concepto === "MANTENIMIENTO_SOLES" ? "Mantto S/." : conceptName;
        conceptName = concepto === "MANTENIMIENTO_DOLARES" ? "Mantto $" : conceptName;
        if (concepto === "ITF_SOLES") {
          resultado.push({
            concept: "EGRESOS",
            january: null,
            february: null,
            march: null,
            april: null,
            may: null,
            june: null,
            july: null,
            august: null,
            september: null,
            october: null,
            november: null,
            december: null,
          });
        }

        resultado.push({
          concept: conceptName ? conceptName : concepto,
          january: null,
          february: null,
          march: null,
          april: null,
          may: null,
          june: null,
          july: null,
          august: null,
          september: null,
          october: null,
          november: null,
          december: null,
        });
      });
    });

    const cuadreOperacionesResult: FinancialDataItem = {
      concept: "Interbancarios S/.",
      january: null,
      february: null,
      march: null,
      april: null,
      may: null,
      june: null,
      july: null,
      august: null,
      september: null,
      october: null,
      november: null,
      december: null,
    };
    let hasCuadreData = false;

    const cuadreOperacionesDolaresResult: FinancialDataItem = {
      concept: "Interbancarios $",
      january: null,
      february: null,
      march: null,
      april: null,
      may: null,
      june: null,
      july: null,
      august: null,
      september: null,
      october: null,
      november: null,
      december: null,
    };
    let hasCuadreDolaresData = false;

    for (const mesFecha of meses) {
      // const mes = mesFecha.getMonth();
      const mes = mesFecha.getUTCMonth();
      const startDate = new Date(year, mes, 1);
      const endDate = new Date(year, mes + 1, 0);

      //* Probando sin hora local cuantos registros me trae en marzo
      // const startDate = new Date(Date.UTC(year, mes, 1, 0, 0, 0, 0));
      // const endDate = new Date(Date.UTC(year, mes + 1, 0, 23, 59, 59, 999));

      // Agregar este log para verificar:
      if (mes === 0) {
        console.log("📅 Fechas corregidas a UTC:");
        console.log(`Start: ${startDate.toISOString()}`);
        console.log(`End: ${endDate.toISOString()}`);
      }

      const gastos = await prisma.gasto.findMany({
        where: {
          fecha: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      // Obtener y procesar datos de cuadre de operaciones en soles para el mes actual
      const cuadreOperacionesSolesData = await prisma.operacion.findMany({
        where: {
          fecha: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          fecha: "asc",
        },
        include: {
          cuadreOperacion: {
            include: {
              CuadreOperacionSoles: true,
            },
          },
          flujoFondos: true,
        },
      });
      const monthName = new Intl.DateTimeFormat("en-US", { month: "long" })
        .format(startDate)
        .toLowerCase() as keyof FinancialDataItem;
      // Sumar las diferencias de cuadre de operaciones en soles para el mes actual

      if (mes === 0) {
        // Marzo es el mes 2 (0-indexed)
        console.log("=================================================");
        console.log("🔍 ANÁLISIS DETALLADO DE INTERBANCARIOS SOLES - ENERO");
        console.log("=================================================");
        console.log(`Rango de fechas: ${startDate.toISOString()} a ${endDate.toISOString()}`);
        console.log(`Total de operaciones encontradas: ${cuadreOperacionesSolesData.length}`);
        console.log("=================================================\n");
      }

      let totalDiferenciaPen = 0;

      cuadreOperacionesSolesData.forEach((operacion) => {
        let totalSoles = Number(operacion.flujoFondos.montoPEN || 0);

        if (operacion.cuadreOperacion) {
          operacion.cuadreOperacion.CuadreOperacionSoles.map((cuadreSoles) => {
            totalSoles = Number(totalSoles || 0) - Number(cuadreSoles.monto_pen || 0);
          });
        }
        totalDiferenciaPen += totalSoles;
      });

      if (mes === 0) {
        console.log("\n🎯 ===== RESULTADO FINAL ENERO =====");
        console.log(`Total Diferencia PEN (antes de abs): ${totalDiferenciaPen}`);
        console.log(`Total Diferencia PEN (después de abs): ${Math.abs(totalDiferenciaPen)}`);
        console.log(
          `Valor que se guardará en cuadreOperacionesResult[enero]: ${Math.abs(
            Number(totalDiferenciaPen)
          )}`
        );
        console.log("====================================\n");
      }

      if (totalDiferenciaPen !== 0) {
        hasCuadreData = true;
        cuadreOperacionesResult[monthName] = Math.abs(
          Number((totalDiferenciaPen as string & Decimal & number) || null)
        );
      }

      const cuadreOperacionesDolaresData = await prisma.operacion.findMany({
        where: {
          fecha: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          fecha: "asc",
        },
        include: {
          flujoFondos: true,
          cuadreOperacion: {
            include: {
              CuadreOperacionDolares: true,
            },
          },
        },
      });

      let totalDiferenciaUsd = 0;

      cuadreOperacionesDolaresData.forEach((operacion) => {
        let totalDolares = Number(operacion.flujoFondos.montoUSD || 0);
        // console.log("TOTAL INICIAL: ", totalDolares);

        if (operacion.cuadreOperacion) {
          operacion.cuadreOperacion.CuadreOperacionDolares.map((cuadreDolares) => {
            totalDolares = Number(totalDolares || 0) - Number(cuadreDolares.monto_usd || 0);
            // console.log(totalDolares, cuadreDolares.monto_usd);
          });
          // console.log("DIFERENCIA USD: ", totalDolares, operacion.fecha);
        }

        totalDiferenciaUsd += Number(totalDolares || 0);
        // console.log("TOTAL DIFERENCIA USD", totalDiferenciaUsd);
      });

      if (mes === 0) {
        console.log("\n🎯 ===== RESULTADO FINAL ENERO =====");
        console.log(`Total Diferencia DOL (antes de abs): ${totalDiferenciaUsd}`);
        console.log(`Total Diferencia DOL (después de abs): ${Math.abs(totalDiferenciaUsd)}`);
        console.log(
          `Valor que se guardará en cuadreOperacionesResult[march]: ${Math.abs(
            Number(totalDiferenciaUsd)
          )}`
        );
        console.log("====================================\n");
      }

      if (totalDiferenciaUsd !== 0) {
        hasCuadreDolaresData = true;
        cuadreOperacionesDolaresResult[monthName] =
          Math.abs(Number(totalDiferenciaUsd as string & Decimal & number)) || null;
      }

      tipoGastos.forEach((tipo) => {
        monedas.forEach((moneda) => {
          const concepto = `${tipo}_${moneda === "PEN" ? "SOLES" : "DOLARES"}`;
          let total = gastos
            .filter((g) => g.tipoGasto === tipo && g.tipoMoneda === moneda)
            .reduce((acc, g) => acc + parseFloat(g.monto.toString()), 0);

          const mesIndex = meses.indexOf(mesFecha);

          if (mesIndex !== -1) {
            resultado.forEach((item) => {
              let conceptName = "";
              conceptName =
                concepto === "OVERNIGHT_BCP_SOLES" ? "Interes x Inversión S/." : conceptName;
              conceptName =
                concepto === "OVERNIGHT_BCP_DOLARES" ? "Interes x Inversión $" : conceptName;
              conceptName =
                concepto === "INTERESES_RENTA_SEGUNDA_SOLES" ? "Interés x Fondo S/." : conceptName;
              conceptName =
                concepto === "INTERESES_RENTA_SEGUNDA_DOLARES" ? "Interés x Fondo $" : conceptName;
              conceptName = concepto === "ITF_SOLES" ? "ITF S/." : conceptName;
              conceptName = concepto === "ITF_DOLARES" ? "ITF $" : conceptName;
              conceptName = concepto === "MANTENIMIENTO_SOLES" ? "Mantto S/." : conceptName;
              conceptName = concepto === "MANTENIMIENTO_DOLARES" ? "Mantto $" : conceptName;
              if (item.concept === conceptName) {
                const mesKey = monthName;
                item[mesKey] = (-total as string & Decimal & number) || null;
              }
            });
          }
        });
      });
    }
    if (hasCuadreData) {
      console.log("No hay curadres");
      resultado.push(cuadreOperacionesResult);
    }

    if (hasCuadreDolaresData) {
      resultado.push(cuadreOperacionesDolaresResult);
    }

    const tipoGastos3 = ["MANTENIMIENTO", "FUNCIONAMIENTO", "DIVERSOS_OPERATIVOS"];

    const conceptosABuscar: string[] = [
      "CELULARES",
      "TI",
      "CONTABILIDAD",
      "COMBUSTIBLE",
      "ALQUILER",
      "CUMPLIMIENTO",
      "Coworking",
      "SEGURO VEHICULO",
      /*
      'INTERNET',
      'OFICINA',
      'MARKETING/COMERCIAL',
      'FACTURACIÓN ELÉCTRICA',
      */
    ];

    const monthlyTotalsByConcept: { [concept: string]: { [month: number]: number } } = {};

    conceptosABuscar.forEach((concept) => {
      monthlyTotalsByConcept[concept] = {};
      for (let i = 1; i <= 12; i++) {
        monthlyTotalsByConcept[concept][i] = 0;
      }
    });

    for (const tipo of tipoGastos3) {
      const recopilados = await prisma.gasto.findMany({
        where: {
          tipoGasto: tipo as TipoGasto,
          fecha: {
            gte: new Date(`${year}-01-01T00:00:00.000Z`),
            lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
          },
          clase: {
            in: conceptosABuscar,
          },
        },
      });

      recopilados.forEach((gasto) => {
        const mes = gasto.fecha.getUTCMonth() + 1;
        const conceptName = gasto.clase || "";

        if (monthlyTotalsByConcept[conceptName] !== undefined) {
          monthlyTotalsByConcept[conceptName][mes] =
            Number(monthlyTotalsByConcept[conceptName][mes] || 0) +
            Math.abs(gasto.monto.toNumber() || 0);
          /*
          if (gasto.tipoMoneda === "USD") {
            monthlyTotalsByConcept[conceptName][mes] = Number(monthlyTotalsByConcept[conceptName][mes] || 0) + Math.abs(gasto.monto.toNumber() || 0) * Number(tcPorMes[mes] || 1) 
          }
          else {
            monthlyTotalsByConcept[conceptName][mes] = Number(monthlyTotalsByConcept[conceptName][mes] || 0) + Math.abs(gasto.monto.toNumber() || 0)
          }
          */
        }
      });
    }

    conceptosABuscar.forEach((nombre) => {
      const monthlyData = monthlyTotalsByConcept[nombre];

      const financialDataItem: FinancialDataItem = {
        concept: getNombreFormateado(nombre),
        january: monthlyData[1] === 0 ? null : monthlyData[1],
        february: monthlyData[2] === 0 ? null : monthlyData[2],
        march: monthlyData[3] === 0 ? null : monthlyData[3],
        april: monthlyData[4] === 0 ? null : monthlyData[4],
        may: monthlyData[5] === 0 ? null : monthlyData[5],
        june: monthlyData[6] === 0 ? null : monthlyData[6],
        july: monthlyData[7] === 0 ? null : monthlyData[7],
        august: monthlyData[8] === 0 ? null : monthlyData[8],
        september: monthlyData[9] === 0 ? null : monthlyData[9],
        october: monthlyData[10] === 0 ? null : monthlyData[10],
        november: monthlyData[11] === 0 ? null : monthlyData[11],
        december: monthlyData[12] === 0 ? null : monthlyData[12],
      };

      if (resultado.findIndex((item) => item.concept === financialDataItem.concept) === -1) {
        resultado.push(financialDataItem);
      }
    });

    /** GASTOS PERSONALES PERSONAS O ASISTENTES  */
    resultado.push(totalGastosPersonalesItem);

    for (const nombre in gastosPersonalesPorMesIndividual) {
      const gastosPorMes = gastosPersonalesPorMesIndividual[nombre];

      /** NO CAMBIES EL as Decimal || null, va a dar ERROR  */
      const financialDataItem: FinancialDataItem = {
        concept: nombre,
        january: Math.abs(Number(gastosPorMes[1] as Decimal)) || null,
        february: (gastosPorMes[2] as Decimal) || null,
        march: (gastosPorMes[3] as Decimal) || null,
        april: (gastosPorMes[4] as Decimal) || null,
        may: (gastosPorMes[5] as Decimal) || null,
        june: (gastosPorMes[6] as Decimal) || null,
        july: (gastosPorMes[7] as Decimal) || null,
        august: (gastosPorMes[8] as Decimal) || null,
        september: (gastosPorMes[9] as Decimal) || null,
        october: (gastosPorMes[10] as Decimal) || null,
        november: (gastosPorMes[11] as Decimal) || null,
        december: (gastosPorMes[12] as Decimal) || null,
      };

      resultado.push(financialDataItem); // Colocar los gastos personales individuales después del total
    }

    /**
     * 
     * const tipoGastos4 = ["PERSONAL"];

    for (const tipo of tipoGastos4) {
      const recopilados = await prisma.recopiladoGastos.findMany({
        where: {
          tipo_gasto: tipo as TipoGasto,
          anio: year,
        },
      });

      const gastosPorNombre: { [nombre: string]: { [mes: number]: Decimal } } =
        {};

      recopilados.forEach((recopilado) => {
        if (recopilado.mes) {
          if (!gastosPorNombre[recopilado.nombre]) {
            gastosPorNombre[recopilado.nombre] = {};
          }
          gastosPorNombre[recopilado.nombre][recopilado.mes] = (
            gastosPorNombre[recopilado.nombre][recopilado.mes] || new Decimal(0)
          ).plus(recopilado.precio);
        }
      });

      for (const nombre in gastosPorNombre) {
        const gastosMes = gastosPorNombre[nombre];
    const financialDataItem: FinancialDataItem = {
      concept: `${nombre}`,
      january: (gastosMes[1] as Decimal) || null,
      february: (gastosMes[2] as Decimal) || null,
      march: (gastosMes[3] as Decimal) || null,
      april: (gastosMes[4] as Decimal) || null,
      may: (gastosMes[5] as Decimal) || null,
      june: (gastosMes[6] as Decimal) || null,
      july: (gastosMes[7] as Decimal) || null,
      august: (gastosMes[8] as Decimal) || null,
      september: (gastosMes[9] as Decimal) || null,
      october: (gastosMes[10] as Decimal) || null,
      november: (gastosMes[11] as Decimal) || null,
      december: (gastosMes[12] as Decimal) || null,
    };
    resultado.push(financialDataItem);
  }
    }
     */

    const interesesRentaSegundaSoles: { [mes: number]: Decimal } = {};
    const interesesRentaSegundaDolares: { [mes: number]: Decimal } = {};

    const interesesRentaSegundaGastos = await prisma.gasto.findMany({
      where: {
        tipoGasto: "INTERESES_RENTA_SEGUNDA",
        fecha: {
          gte: new Date(year, 0, 1),
          lte: new Date(year, 11, 31, 23, 59, 59, 999),
        },
      },
    });

    interesesRentaSegundaGastos.forEach((gasto) => {
      const mes = gasto.fecha.getMonth() + 1;

      if (gasto.tipoMoneda === "PEN") {
        interesesRentaSegundaSoles[mes] = (interesesRentaSegundaSoles[mes] || new Decimal(0)).plus(
          Math.abs(Number(gasto.monto))
        );
      } else if (gasto.tipoMoneda === "USD") {
        interesesRentaSegundaDolares[mes] = (
          interesesRentaSegundaDolares[mes] || new Decimal(0)
        ).plus(Math.abs(Number(gasto.monto)));
      }
    });

    /** NO CAMBIES EL as Decimal || null, va a dar ERROR  */
    const interesesRentaSegundaSolesItem: FinancialDataItem = {
      concept: "Interes x Fondo S/. ",
      january: (interesesRentaSegundaSoles[1] as Decimal) || null,
      february: (interesesRentaSegundaSoles[2] as Decimal) || null,
      march: (interesesRentaSegundaSoles[3] as Decimal) || null,
      april: (interesesRentaSegundaSoles[4] as Decimal) || null,
      may: (interesesRentaSegundaSoles[5] as Decimal) || null,
      june: (interesesRentaSegundaSoles[6] as Decimal) || null,
      july: (interesesRentaSegundaSoles[7] as Decimal) || null,
      august: (interesesRentaSegundaSoles[8] as Decimal) || null,
      september: (interesesRentaSegundaSoles[9] as Decimal) || null,
      october: (interesesRentaSegundaSoles[10] as Decimal) || null,
      november: (interesesRentaSegundaSoles[11] as Decimal) || null,
      december: (interesesRentaSegundaSoles[12] as Decimal) || null,
    };

    /** NO CAMBIES EL as Decimal || null, va a dar ERROR  */
    const interesesRentaSegundaDolaresItem: FinancialDataItem = {
      concept: "Interes x Fondo $ ",
      january: Number((interesesRentaSegundaDolares[1] as Decimal) || 0) || null,
      february: Number((interesesRentaSegundaDolares[2] as Decimal) || 0) || null,
      march: Number((interesesRentaSegundaDolares[3] as Decimal) || 0) || null,
      april: Number(interesesRentaSegundaDolares[4] as Decimal) || null,
      may: Number((interesesRentaSegundaDolares[5] as Decimal) || 0) || null,
      june: Number((interesesRentaSegundaDolares[6] as Decimal) || 0) || null,
      july: Number((interesesRentaSegundaDolares[7] as Decimal) || 0) || null,
      august: Number((interesesRentaSegundaDolares[8] as Decimal) || 0) || null,
      september: Number((interesesRentaSegundaDolares[9] as Decimal) || 0) || null,
      october: Number((interesesRentaSegundaDolares[10] as Decimal) || 0) || null,
      november: Number((interesesRentaSegundaDolares[11] as Decimal) || 0) || null,
      december: Number((interesesRentaSegundaDolares[12] as Decimal) || 0) || null,
    };

    resultado.push(interesesRentaSegundaSolesItem);
    resultado.push(interesesRentaSegundaDolaresItem);

    const impuestosPenPorMes: { [mes: number]: Decimal } = {};
    const impuestosGastos = await prisma.gasto.findMany({
      where: {
        tipoGasto: "IMPUESTOS",
        tipoMoneda: "PEN",
        fecha: {
          gte: new Date(year, 0, 1),
          lte: new Date(year, 11, 31, 23, 59, 59, 999),
        },
      },
    });

    impuestosGastos.forEach((gasto) => {
      const mes = gasto.fecha.getMonth() + 1;
      impuestosPenPorMes[mes] = (impuestosPenPorMes[mes] || new Decimal(0)).plus(
        Math.abs(Number(gasto.monto))
      );
    });

    // Crear el objeto FinancialDataItem para los impuestos PEN
    const impuestosPenItem: FinancialDataItem = {
      concept: "Impuestos y Detracción",
      january: impuestosPenPorMes[1] || null,
      february: impuestosPenPorMes[2] || null,
      march: impuestosPenPorMes[3] || null,
      april: impuestosPenPorMes[4] || null,
      may: impuestosPenPorMes[5] || null,
      june: impuestosPenPorMes[6] || null,
      july: impuestosPenPorMes[7] || null,
      august: impuestosPenPorMes[8] || null,
      september: impuestosPenPorMes[9] || null,
      october: impuestosPenPorMes[10] || null,
      november: impuestosPenPorMes[11] || null,
      december: impuestosPenPorMes[12] || null,
    };

    resultado.push(impuestosPenItem);
    const mesesNombre = [
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
    const totalGastosItem: FinancialDataItem = {
      concept: "Total Gastos",
      january: 0,
      february: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      august: 0,
      september: 0,
      october: 0,
      november: 0,
      december: 0,
    };

    mesesNombre.forEach((mes, index) => {
      resultado.forEach((resultado) => {
        if (
          resultado.concept === "ITF S/." ||
          resultado.concept === "Mantto S/." ||
          resultado.concept === "Interbancarios S/." ||
          resultado.concept === "Celulares" ||
          resultado.concept === "TI - Facturación" ||
          resultado.concept === "Contabilidad" ||
          resultado.concept === "Combustible" ||
          resultado.concept === "Alquiler Autos" ||
          resultado.concept === "Cumplimiento" ||
          resultado.concept === "GASTOS DE PERSONAL" ||
          resultado.concept === "EPS" ||
          resultado.concept === "AFP" ||
          resultado.concept === "Interes x Fondo S/. " ||
          resultado.concept === "Impuestos y Detracción"
        ) {
          totalGastosItem[mes] =
            Math.abs(Number(totalGastosItem[mes])) + Math.abs(Number(resultado[mes] || 0));
        } else if (
          resultado.concept === "Interbancarios $" ||
          resultado.concept === "ITF $" ||
          resultado.concept === "Mantto $" ||
          resultado.concept === "Interes x Fondo $ "
        ) {
          totalGastosItem[mes] =
            Math.abs(Number(totalGastosItem[mes])) +
            Math.abs(Number(resultado[mes] || 0)) * Number(totalTC[mes] || 1);
        }
      });

      totalGastosItem[mes] =
        Math.abs(Number(totalGastosItem[mes])) +
        Number(gastosPersonalesTotalPorMes[index + 1] || 0);
    });

    resultado.push(totalGastosItem);

    // console.log({ resultado });

    return res.status(200).json({ data: resultado });
  } catch (error) {
    console.error("Error fetching and processing gastos data:", error);
    return res.status(500).json({ error: "Failed to fetch and process gastos data" });
  } finally {
    await prisma.$disconnect();
  }
}

export async function registrarGastoAnio(req: Request, res: Response): Promise<any | undefined> {
  const { nombre, precio, mes, anio, tipo_gasto, gastoId } = req.body;

  // 2. Validaciones de campos requeridos
  const requiredFields: { [key: string]: any } = {
    nombre,
    precio,
    mes,
    anio,
    tipo_gasto,
  };
  for (const field in requiredFields) {
    if (
      requiredFields[field] === undefined ||
      requiredFields[field] === null ||
      String(requiredFields[field]).trim() === ""
    ) {
      res.status(400).json({ error: `El campo "${field}" es requerido.` });
      return;
    }
  }

  if (!(tipo_gasto in TipoGasto)) {
    res.status(400).json({
      error: `El valor proporcionado para "tipo_gasto" (${tipo_gasto}) no es válido.`,
      validValues: Object.keys(TipoGasto),
    });
    return;
  }
  // Casting explícito después de la validación
  const tipoGastoValidado = tipo_gasto as TipoGasto;

  // Validar precio
  let precioDecimal: Decimal;
  try {
    precioDecimal = new Decimal(precio);
    if (precioDecimal.isNaN() || !precioDecimal.isFinite()) {
      throw new Error("Formato numérico inválido para precio.");
    }
    // Opcional: Validar precisión y escala (10, 2)
    if (precioDecimal.decimalPlaces() > 2) {
      return res.status(400).json({
        error: 'El campo "precio" no puede tener más de 2 decimales.',
      });
    }
    // Podrías añadir validación para el número total de dígitos si es crucial
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'El campo "precio" debe ser un número decimal válido.' });
  }

  // Validar mes
  const mesNum = parseInt(mes, 10);
  if (isNaN(mesNum) || mesNum < 1 || mesNum > 12) {
    res.status(400).json({
      error: 'El campo "mes" debe ser un número entero entre 1 y 12.',
    });
    return;
  }

  // Validar anio
  const anioNum = parseInt(anio, 10);
  const currentYear = new Date().getFullYear();
  if (isNaN(anioNum) || anioNum < currentYear - 10 || anioNum > currentYear + 5) {
    // Rango más ajustado
    res.status(400).json({
      error: `El campo "anio" debe ser un número de año válido (ej. entre ${currentYear - 10} y ${
        currentYear + 5
      }).`,
    });
    return;
  }

  // Validar gastoId (si se proporciona)
  let gastoIdNum: number | undefined = undefined;
  if (gastoId !== undefined && gastoId !== null && String(gastoId).trim() !== "") {
    gastoIdNum = parseInt(gastoId, 10);
    if (isNaN(gastoIdNum)) {
      res.status(400).json({
        error: 'El campo "gastoId" debe ser un número entero válido si se proporciona.',
      });
      return;
    }
  }

  // 4. Preparar los datos base para la creación
  const dataToCreate: Prisma.RecopiladoGastosCreateInput = {
    nombre: String(nombre).trim(),
    precio: precioDecimal,
    mes: mesNum,
    anio: anioNum,
    tipo_gasto: tipoGastoValidado, // Usar el valor validado del enum
  };

  // 5. Lógica de creación y actualización (usando transacción si hay gastoId)
  try {
    let nuevoGastoRecopilado;

    if (gastoIdNum !== undefined) {
      // --- Con gastoId: Usar transacción ---
      // Verificar primero si el Gasto existe y no está ya recopilado
      const gastoExistente = await prisma.gasto.findUnique({
        where: { id: gastoIdNum },
        select: { id: true, isRecopilado: true }, // Solo seleccionar campos necesarios
      });

      if (!gastoExistente) {
        res.status(404).json({ error: `El Gasto con id ${gastoIdNum} no fue encontrado.` });
        return;
      }
      // Descomentar si quieres prevenir vincular un gasto ya recopilado
      // if (gastoExistente.isRecopilado) {
      //     res.status(409).json({ error: `El Gasto con id ${gastoIdNum} ya ha sido recopilado.` });
      //     return;
      // }

      // Conectar la relación en los datos a crear
      dataToCreate.gasto = { connect: { id: gastoIdNum } };

      // Ejecutar la creación y actualización en una transacción
      const resultadoTransaccion = await prisma.$transaction(async (tx) => {
        // a) Crear RecopiladoGastos
        const creado = await tx.recopiladoGastos.create({
          data: dataToCreate,
          include: { gasto: true }, // Incluir el gasto relacionado en el resultado
        });

        // b) Actualizar Gasto.isRecopilado
        await tx.gasto.update({
          where: { id: gastoIdNum },
          data: { isRecopilado: true },
        });

        return creado; // Devolver el RecopiladoGastos creado
      });
      nuevoGastoRecopilado = resultadoTransaccion;
    } else {
      // --- Sin gastoId: Crear directamente ---
      nuevoGastoRecopilado = await prisma.recopiladoGastos.create({
        data: dataToCreate,
        // No incluimos 'gasto' aquí porque no hay uno para relacionar
      });
    }

    // 6. Enviar respuesta de éxito (201 Created)
    res.status(201).json({
      message: "Gasto recopilado registrado exitosamente.",
      data: nuevoGastoRecopilado,
    });
  } catch (error: unknown) {
    console.error("Error al registrar gasto recopilado:", error);

    // 7. Manejo de errores específicos de Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Error de restricción única (gastoId ya existe)
      if (error.code === "P2002") {
        const target = (error.meta?.target as string[])?.join(", ") ?? "campo único";
        // Verificar si el error es específicamente por gastoId
        if (target.includes("gastoId")) {
          res.status(409).json({
            error: `Conflicto: El Gasto con id ${gastoIdNum} ya está asociado a otro Gasto Recopilado.`,
          });
        } else {
          res.status(409).json({
            error: `Conflicto: Ya existe un registro con el mismo valor en ${target}.`,
          });
        }
        return;
      }
      // Error de clave foránea o registro relacionado no encontrado al conectar
      if (error.code === "P2025") {
        // Este error puede ocurrir dentro de la transacción si el gasto se elimina entre la verificación inicial y la conexión.
        res.status(404).json({
          error: `No se pudo crear la relación: El Gasto con id ${gastoIdNum} no fue encontrado.`,
        });
        return;
      }
    }

    // 8. Error genérico del servidor
    res.status(500).json({
      error: "Ocurrió un error interno al intentar registrar el gasto recopilado.",
    });
  }
}

export async function registrarTipoCambio(req: Request, res: Response): Promise<any | undefined> {
  const { mes, anio, valor } = req.body;

  if (!mes) {
    return res.status(400).json({
      error: "Falta el mes",
    });
  }
  if (!anio) {
    return res.status(400).json({
      error: "Falta el año",
    });
  }
  if (!valor) {
    return res.status(400).json({
      error: "Falta el valor",
    });
  }

  try {
    const tc = await prisma.tipoCambioMes.create({
      data: {
        anio: Number(anio),
        mes: Number(mes),
        valor: parseFloat(valor),
      },
    });

    return res.status(201).json({
      tc,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Error interna en el servidor",
    });
  }
}

export async function editarTipoCambio(req: Request, res: Response): Promise<any | undefined> {
  const { mes, anio, valor } = req.body;
  const { id } = req.params;

  if (!mes) {
    return res.status(400).json({
      error: "Falta el mes",
    });
  }
  if (!anio) {
    return res.status(400).json({
      error: "Falta el año",
    });
  }
  if (!valor) {
    return res.status(400).json({
      error: "Falta el valor",
    });
  }

  try {
    const tc = await prisma.tipoCambioMes.update({
      where: {
        id: Number(id),
      },
      data: {
        anio: Number(anio),
        mes: Number(mes),
        valor: parseFloat(valor),
      },
    });

    return res.status(200).json({
      tc,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Error interna en el servidor",
    });
  }
}

/************************** CALCULO TOTAL GASTO PARA FLUJO */

export async function recopilarGastosAnioFLUJO(yearParam: string): Promise<any | undefined> {
  try {
    const mesesNumericos = Array.from({ length: 12 }, (_, i) => i + 1);
    const meses = Array.from({ length: 12 }, (_, i) => new Date(Number(yearParam), i, 1));
    const tipoGastos = ["OVERNIGHT_BCP", "ITF", "MANTENIMIENTO"];
    const monedas = ["PEN", "USD"];

    const resultado: FinancialDataItem[] = [];
    const gastosPersonalesPorMesIndividual: {
      [nombre: string]: { [mes: number]: Decimal };
    } = {};
    const gastosPersonalesTotalPorMes: { [mes: number]: Decimal } = {};

    mesesNumericos.forEach((mes) => {
      gastosPersonalesTotalPorMes[mes] = new Decimal(0);
    });

    const tcPorMes: {
      [mes: number]: number;
    } = {};

    const tc = await prisma.tipoCambioMes.findMany({
      where: {
        anio: Number(yearParam ?? 2025),
      },
      orderBy: {
        mes: "asc",
      },
    });

    tc.forEach((tcItem) => {
      tcPorMes[tcItem.mes] = tcItem.valor;
    });

    console.log("Tipo de cambio por mes:", tcPorMes);

    const totalTC: FinancialDataItem = {
      concept: "TC",
      january: tcPorMes[1] || null,
      february: tcPorMes[2] || null,
      march: tcPorMes[3] || null,
      april: tcPorMes[4] || null,
      may: tcPorMes[5] || null,
      june: tcPorMes[6] || null,
      july: tcPorMes[7] || null,
      august: tcPorMes[8] || null,
      september: tcPorMes[9] || null,
      october: tcPorMes[10] || null,
      november: tcPorMes[11] || null,
      december: tcPorMes[12] || null,
    };

    resultado.push(totalTC);

    const tipoGastoPersonal = ["PERSONAL_PERSONAS", "PERSONAL"];

    const gastosPersonalesRecopilados = await prisma.gasto.findMany({
      where: {
        tipoGasto: {
          in: tipoGastoPersonal as TipoGasto[],
        },
        fecha: {
          gte: new Date(`${Number(yearParam)}-01-01T00:00:00.000Z`),
          lt: new Date(`${Number(yearParam) + 1}-01-01T00:00:00.000Z`),
        },
      },
    });
    console.log("Gastos personales recopilados:", gastosPersonalesRecopilados.length);

    gastosPersonalesRecopilados.forEach((gasto) => {
      mesesNumericos.forEach((mes) => {
        if (gasto.concepto) {
          if (!gastosPersonalesPorMesIndividual[gasto.concepto]) {
            gastosPersonalesPorMesIndividual[gasto.concepto] = {};
          }
          gastosPersonalesPorMesIndividual[gasto.concepto][mes] = new Decimal(0);
        }
      });
    });

    gastosPersonalesRecopilados.forEach((gasto) => {
      if (gasto.fecha && gasto.concepto !== null) {
        const mesF = gasto.fecha.getUTCMonth() + 1;

        if (gastosPersonalesPorMesIndividual[gasto.concepto || ""] !== undefined) {
          gastosPersonalesPorMesIndividual[gasto.concepto || ""][mesF] = (
            gastosPersonalesPorMesIndividual[gasto.concepto || ""][mesF] || new Decimal(0)
          ).plus(Math.abs(Number(gasto.monto)) || 0);

          gastosPersonalesTotalPorMes[mesF] = gastosPersonalesTotalPorMes[mesF].plus(
            Math.abs(Number(gasto.monto)) || 0
          );
        }
        /*
        mesesNumericos.forEach((mes) => {
          if (mesF === mes) {
            gastosPersonalesPorMesIndividual[gasto.concepto || ''][mes] = (
              gastosPersonalesPorMesIndividual[gasto.concepto || ''][mes] ||
              new Decimal(0)
            ).plus(Math.abs(Number(gasto.monto)) || 0);
            console.log('GASTOS: ', gastosPersonalesPorMesIndividual)
            gastosPersonalesTotalPorMes[mes] = gastosPersonalesTotalPorMes[mes].plus(Math.abs(Number(gasto.monto)) || 0);
          }
        })
        */
      }
    });

    /** NO CAMBIES EL as Decimal || null, va a dar ERROR  */
    const totalGastosPersonalesItem: FinancialDataItem = {
      concept: "GASTOS DE PERSONAL",
      january: (gastosPersonalesTotalPorMes[1] as Decimal) || null,
      february: (gastosPersonalesTotalPorMes[2] as Decimal) || null,
      march: (gastosPersonalesTotalPorMes[3] as Decimal) || null,
      april: (gastosPersonalesTotalPorMes[4] as Decimal) || null,
      may: (gastosPersonalesTotalPorMes[5] as Decimal) || null,
      june: (gastosPersonalesTotalPorMes[6] as Decimal) || null,
      july: (gastosPersonalesTotalPorMes[7] as Decimal) || null,
      august: (gastosPersonalesTotalPorMes[8] as Decimal) || null,
      september: (gastosPersonalesTotalPorMes[9] as Decimal) || null,
      october: (gastosPersonalesTotalPorMes[10] as Decimal) || null,
      november: (gastosPersonalesTotalPorMes[11] as Decimal) || null,
      december: (gastosPersonalesTotalPorMes[12] as Decimal) || null,
    };

    const currentYear = new Date().getFullYear();

    // Inicio del año actual (1 de enero a las 00:00:00.000)
    const startOfYear = new Date(currentYear, 0, 1, 0, 0, 0, 0);

    // Fin del año actual (31 de diciembre a las 23:59:59.999)
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);
    const leasingData = await prisma.leasingOperacion.findMany({
      where: {
        fecha_final: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
    });

    const monthlyRendimientosLeasing: { [month: number]: Decimal } = {};

    leasingData.forEach((item) => {
      const fechaInicial = new Date(item.fecha_inicial);
      const itemMonth = fechaInicial.getUTCMonth();
      monthlyRendimientosLeasing[itemMonth] = (
        monthlyRendimientosLeasing[itemMonth] || new Decimal(0)
      ).plus(item.rendimiento);
    });

    const leasingResult: FinancialDataItem = {
      concept: "Leasing",
      january: null,
      february: null,
      march: null,
      april: null,
      may: null,
      june: null,
      july: null,
      august: null,
      september: null,
      october: null,
      november: null,
      december: null,
    };

    Object.entries(monthlyRendimientosLeasing).forEach(([month, rendimiento]) => {
      const monthIndex = parseInt(month, 10);
      const monthName = new Intl.DateTimeFormat("en-US", { month: "long" })
        .format(new Date(Number(yearParam), monthIndex, 1))
        .toLowerCase() as keyof FinancialDataItem;
      leasingResult[monthName] = (rendimiento.toNumber() as string & Decimal & number) || null;
    });

    /** MUY NECESARIO, NO BORRAR */
    resultado.push({
      concept: "Ingresos",
      january: null,
      february: null,
      march: null,
      april: null,
      may: null,
      june: null,
      july: null,
      august: null,
      september: null,
      october: null,
      november: null,
      december: null,
    });
    resultado.push(leasingResult);

    // Crear objetos para cada tipo de gasto y moneda
    tipoGastos.forEach((tipo) => {
      monedas.forEach((moneda) => {
        const concepto = `${tipo}_${moneda === "PEN" ? "SOLES" : "DOLARES"}`;
        let conceptName = "";
        conceptName = concepto === "OVERNIGHT_BCP_SOLES" ? "Interes x Inversión S/." : conceptName;
        conceptName = concepto === "OVERNIGHT_BCP_DOLARES" ? "Interes x Inversión $" : conceptName;
        conceptName = concepto === "ITF_SOLES" ? "ITF S/." : conceptName;
        conceptName = concepto === "ITF_DOLARES" ? "ITF $" : conceptName;
        conceptName = concepto === "MANTENIMIENTO_SOLES" ? "Mantto S/." : conceptName;
        conceptName = concepto === "MANTENIMIENTO_DOLARES" ? "Mantto $" : conceptName;
        if (concepto === "ITF_SOLES") {
          resultado.push({
            concept: "EGRESOS",
            january: null,
            february: null,
            march: null,
            april: null,
            may: null,
            june: null,
            july: null,
            august: null,
            september: null,
            october: null,
            november: null,
            december: null,
          });
        }
        resultado.push({
          concept: conceptName ? conceptName : concepto,
          january: null,
          february: null,
          march: null,
          april: null,
          may: null,
          june: null,
          july: null,
          august: null,
          september: null,
          october: null,
          november: null,
          december: null,
        });
      });
    });

    // Procesar datos de cuadre de operaciones soles
    const cuadreOperacionesResult: FinancialDataItem = {
      concept: "Interbancarios S/.",
      january: null,
      february: null,
      march: null,
      april: null,
      may: null,
      june: null,
      july: null,
      august: null,
      september: null,
      october: null,
      november: null,
      december: null,
    };
    let hasCuadreData = false;

    const cuadreOperacionesDolaresResult: FinancialDataItem = {
      concept: "Interbancarios $", // Concepto solicitado
      january: null,
      february: null,
      march: null,
      april: null,
      may: null,
      june: null,
      july: null,
      august: null,
      september: null,
      october: null,
      november: null,
      december: null,
    };
    let hasCuadreDolaresData = false;

    for (const mesFecha of meses) {
      const mes = mesFecha.getMonth();

      //*17-11 Depurando las fechas
      // const startDate = new Date(Number(yearParam), mes, 1);
      // const endDate = new Date(Number(yearParam), mes + 1, 0);
      // const empieza = startDate.toISOString().split("T")[0];
      // const fin = endDate.toISOString().split("T")[0];

      const startDate = new Date(Number(yearParam), mes, 1);
      const endDate = new Date(Number(yearParam), mes + 1, 1);

      const monthName = new Intl.DateTimeFormat("en-US", { month: "long" })
        .format(startDate)
        .toLowerCase() as keyof FinancialDataItem;

      const gastos = await prisma.gasto.findMany({
        where: {
          // fecha: {
          //   gte: `${empieza}T00:00:00.000Z`,
          //   lte: `${fin}T23:59:59.999Z`,
          // },
          //*17-11 set dates
          fecha: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const cuadreOperacionesSolesData = await prisma.operacion.findMany({
        where: {
          // fecha: {
          //   gte: `${empieza}T00:00:00.000Z`,
          //   lte: `${fin}T23:59:59.999Z`,
          // },

          //*17-11 set dates
          fecha: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          fecha: "asc",
        },
        include: {
          cuadreOperacion: {
            include: {
              CuadreOperacionSoles: true,
            },
          },
          flujoFondos: true,
        },
      });
      let totalDiferenciaPen = 0;
      // cuadreOperacionesSolesData.forEach((operacion) => {
      //   let totalSoles = Number(operacion.flujoFondos.montoPEN || 0);

      //   if (!operacion.cuadreOperacion?.CuadreOperacionSoles) {
      //     totalSoles = Number(totalSoles);
      //   } else {
      //     operacion.cuadreOperacion.CuadreOperacionSoles.forEach((cuadreSoles) => {
      //       totalSoles =
      //         Math.abs(Number(totalSoles || 0)) -
      //         (operacion.tipo === "COMPRA"
      //           ? Math.abs(Number(cuadreSoles.monto_pen || 0))
      //           : Number(cuadreSoles.monto_pen || 0));
      //     });
      //   }

      //   totalDiferenciaPen += totalSoles;
      // });

      //*17-11, aplicando nueva logica
      cuadreOperacionesSolesData.forEach((operacion) => {
        let totalSoles = Number(operacion.flujoFondos.montoPEN || 0);

        if (operacion.cuadreOperacion) {
          operacion.cuadreOperacion.CuadreOperacionSoles.forEach((cuadreSoles) => {
            // ✅ CORRECCIÓN: Resta simple, sin Math.abs, sin condiciones
            totalSoles = Number(totalSoles || 0) - Number(cuadreSoles.monto_pen || 0);
          });
        }

        totalDiferenciaPen += totalSoles;
      });

      if (mes === 0) {
        // enero = mes 0
        console.log("Gastos personales enero por concepto:", gastosPersonalesPorMesIndividual);
        console.log("Total gastos personales enero:", gastosPersonalesTotalPorMes[1].toString());
      }

      if (mes === 0) {
        console.log("\n🎯 ===== RESULTADO ENERO SOLES =====");
        console.log(`Total Diferencia PEN: ${totalDiferenciaPen}`);
        console.log(`Valor absoluto: ${Math.abs(totalDiferenciaPen)}`);
        console.log(`Esperado: 155.01`);
        console.log(
          `¿Coincide?: ${Math.abs(totalDiferenciaPen).toFixed(2) === "155.01" ? "✅ SÍ" : "❌ NO"}`
        );
        console.log("====================================\n");
      }

      if (totalDiferenciaPen !== 0) {
        hasCuadreData = true;
        cuadreOperacionesResult[monthName] =
          Math.abs(Number(totalDiferenciaPen as string & Decimal & number) || 0) || null;
      }

      const cuadreOperacionesDolaresData = await prisma.operacion.findMany({
        where: {
          fecha: {
            // Usar fecha_usd según tu modelo
            gte: startDate,
            lte: endDate,
          },
        },
        //*17-11
        orderBy: {
          fecha: "asc",
        },
        include: {
          cuadreOperacion: {
            include: {
              CuadreOperacionDolares: true,
            },
          },
          //*17-11
          flujoFondos: true,
        },
      });

      let totalDiferenciaUsd = 0;
      // cuadreOperacionesDolaresData.forEach((operacion) => {
      //   let totalDolares = Number(operacion.dolares || 0);

      //   if (!operacion.cuadreOperacion?.CuadreOperacionDolares) {
      //     totalDolares = Number(totalDolares);
      //   } else {
      //     operacion.cuadreOperacion.CuadreOperacionDolares.forEach((cuadreDolares) => {
      //       const valorAnterior = totalDolares;
      //       totalDolares =
      //         Math.abs(Number(totalDolares || 0)) -
      //         (operacion.tipo === "VENTA"
      //           ? Math.abs(Number(cuadreDolares.monto_usd || 0))
      //           : Number(cuadreDolares.monto_usd || 0));

      //       if (monthName === "march") {
      //         console.log("TIPO DE OPERACION: ", operacion.tipo);
      //         console.log(
      //           "RESTA:",
      //           valorAnterior,
      //           "-",
      //           operacion.tipo === "VENTA"
      //             ? Math.abs(Number(cuadreDolares.monto_usd || 0))
      //             : Number(cuadreDolares.monto_usd || 0),
      //           "=",
      //           totalDolares
      //         );
      //       }
      //     });
      //   }
      //   totalDiferenciaUsd = Number(totalDiferenciaUsd) + Number(totalDolares || 0);
      // });

      cuadreOperacionesDolaresData.forEach((operacion) => {
        // ✅ CORRECCIÓN: Usar flujoFondos.montoUSD en lugar de operacion.dolares
        let totalDolares = Number(operacion.flujoFondos.montoUSD || 0);

        if (operacion.cuadreOperacion) {
          operacion.cuadreOperacion.CuadreOperacionDolares.forEach((cuadreDolares) => {
            // ✅ CORRECCIÓN: Resta simple, sin Math.abs, sin condiciones
            totalDolares = Number(totalDolares || 0) - Number(cuadreDolares.monto_usd || 0);
          });
        }

        totalDiferenciaUsd += Number(totalDolares || 0);
      });

      // Log de verificación (solo enero)
      if (mes === 0) {
        console.log("\n🎯 ===== RESULTADO ENERO DÓLARES =====");
        console.log(`Total Diferencia USD: ${totalDiferenciaUsd}`);
        console.log(`Valor absoluto: ${Math.abs(totalDiferenciaUsd)}`);
        console.log(`Esperado: 49.00`);
        console.log(
          `¿Coincide?: ${Math.abs(totalDiferenciaUsd).toFixed(2) === "49.00" ? "✅ SÍ" : "❌ NO"}`
        );
        console.log("======================================\n");
      }

      if (totalDiferenciaUsd !== 0) {
        hasCuadreDolaresData = true;

        cuadreOperacionesDolaresResult[monthName] =
          Math.abs(Number(totalDiferenciaUsd as string & Decimal & number)) || null;
      } else {
        cuadreOperacionesDolaresResult[monthName] = 0;
      }

      tipoGastos.forEach((tipo) => {
        monedas.forEach((moneda) => {
          const concepto = `${tipo}_${moneda === "PEN" ? "SOLES" : "DOLARES"}`;
          let total = gastos
            .filter((g) => g.tipoGasto === tipo && g.tipoMoneda === moneda)
            .reduce((acc, g) => acc + parseFloat(g.monto.toString()), 0);

          const mesIndex = meses.indexOf(mesFecha);

          if (mesIndex !== -1) {
            resultado.forEach((item) => {
              let conceptName = "";
              conceptName =
                concepto === "OVERNIGHT_BCP_SOLES" ? "Interes x Inversión S/." : conceptName;
              conceptName =
                concepto === "OVERNIGHT_BCP_DOLARES" ? "Interes x Inversión $" : conceptName;
              conceptName = concepto === "ITF_SOLES" ? "ITF S/." : conceptName;
              conceptName = concepto === "ITF_DOLARES" ? "ITF $" : conceptName;
              conceptName = concepto === "MANTENIMIENTO_SOLES" ? "Mantto S/." : conceptName;
              conceptName = concepto === "MANTENIMIENTO_DOLARES" ? "Mantto $" : conceptName;
              if (item.concept === conceptName) {
                const mesKey = monthName;
                item[mesKey] = (-total as string & Decimal & number) || null;
              }
            });
          }
        });
      });
    }
    if (hasCuadreData) {
      console.log("No hay curadres");
      resultado.push(cuadreOperacionesResult);
    }

    if (hasCuadreDolaresData) {
      resultado.push(cuadreOperacionesDolaresResult);
    }

    const tipoGastos3 = ["MANTENIMIENTO", "FUNCIONAMIENTO", "DIVERSOS_OPERATIVOS", "OVERNIGHT_BCP"];

    const conceptosABuscar: string[] = [
      "CELULARES",
      "TI",
      "CONTABILIDAD",
      "COMBUSTIBLE",
      "ALQUILER",
      "INTERNET",
      "CUMPLIMIENTO",
      "OFICINA",
      "MARKETING/COMERCIAL",
      "FACTURACIÓN ELÉCTRICA",
    ];

    const monthlyTotalsByConcept: { [concept: string]: { [month: number]: number } } = {};
    const conceptosUnicosABuscar = [...new Set(conceptosABuscar)];
    conceptosUnicosABuscar.forEach((concept) => {
      monthlyTotalsByConcept[concept] = {};
      for (let i = 1; i <= 12; i++) {
        monthlyTotalsByConcept[concept][i] = 0;
      }
    });

    for (const tipo of tipoGastos3) {
      const recopilados = await prisma.gasto.findMany({
        where: {
          tipoGasto: tipo as TipoGasto,
          fecha: {
            gte: new Date(`${Number(yearParam)}-01-01T00:00:00.000Z`),
            lt: new Date(`${Number(yearParam) + 1}-01-01T00:00:00.000Z`),
          },
          clase: {
            in: conceptosABuscar,
          },
        },
      });

      recopilados.forEach((gasto) => {
        const mes = gasto.fecha.getUTCMonth() + 1;
        const conceptName = gasto.clase || "";

        if (monthlyTotalsByConcept[conceptName] !== undefined) {
          if (gasto.tipoMoneda === "USD") {
            monthlyTotalsByConcept[conceptName][mes] =
              Number(monthlyTotalsByConcept[conceptName][mes] || 0) +
              Math.abs(gasto.monto.toNumber() || 0) * Number(tcPorMes[mes] || 1);
          } else {
            monthlyTotalsByConcept[conceptName][mes] =
              Number(monthlyTotalsByConcept[conceptName][mes] || 0) +
              Math.abs(gasto.monto.toNumber() || 0);
          }
        }
      });
    }

    conceptosUnicosABuscar.forEach((nombre) => {
      const monthlyData = monthlyTotalsByConcept[nombre];
      const financialDataItem: FinancialDataItem = {
        concept: getNombreFormateado(nombre),
        january: monthlyData[1] === 0 ? null : monthlyData[1],
        february: monthlyData[2] === 0 ? null : monthlyData[2],
        march: monthlyData[3] === 0 ? null : monthlyData[3],
        april: monthlyData[4] === 0 ? null : monthlyData[4],
        may: monthlyData[5] === 0 ? null : monthlyData[5],
        june: monthlyData[6] === 0 ? null : monthlyData[6],
        july: monthlyData[7] === 0 ? null : monthlyData[7],
        august: monthlyData[8] === 0 ? null : monthlyData[8],
        september: monthlyData[9] === 0 ? null : monthlyData[9],
        october: monthlyData[10] === 0 ? null : monthlyData[10],
        november: monthlyData[11] === 0 ? null : monthlyData[11],
        december: monthlyData[12] === 0 ? null : monthlyData[12],
      };

      if (resultado.findIndex((item) => item.concept === financialDataItem.concept) === -1) {
        resultado.push(financialDataItem);
      }
    });

    /** GASTOS PERSONALES PERSONAS O ASISTENTES  */
    resultado.push(totalGastosPersonalesItem);

    for (const nombre in gastosPersonalesPorMesIndividual) {
      const gastosPorMes = gastosPersonalesPorMesIndividual[nombre];

      /** NO CAMBIES EL as Decimal || null, va a dar ERROR  */
      const financialDataItem: FinancialDataItem = {
        concept: nombre,
        january: (gastosPorMes[1] as Decimal) || null,
        february: (gastosPorMes[2] as Decimal) || null,
        march: (gastosPorMes[3] as Decimal) || null,
        april: (gastosPorMes[4] as Decimal) || null,
        may: (gastosPorMes[5] as Decimal) || null,
        june: (gastosPorMes[6] as Decimal) || null,
        july: (gastosPorMes[7] as Decimal) || null,
        august: (gastosPorMes[8] as Decimal) || null,
        september: (gastosPorMes[9] as Decimal) || null,
        october: (gastosPorMes[10] as Decimal) || null,
        november: (gastosPorMes[11] as Decimal) || null,
        december: (gastosPorMes[12] as Decimal) || null,
      };
      resultado.push(financialDataItem); // Colocar los gastos personales individuales después del total
    }

    /**
     * 
     * const tipoGastos4 = ["PERSONAL"];

    for (const tipo of tipoGastos4) {
      const recopilados = await prisma.recopiladoGastos.findMany({
        where: {
          tipo_gasto: tipo as TipoGasto,
          anio: year,
        },
      });

      const gastosPorNombre: { [nombre: string]: { [mes: number]: Decimal } } =
        {};

      recopilados.forEach((recopilado) => {
        if (recopilado.mes) {
          if (!gastosPorNombre[recopilado.nombre]) {
            gastosPorNombre[recopilado.nombre] = {};
          }
          gastosPorNombre[recopilado.nombre][recopilado.mes] = (
            gastosPorNombre[recopilado.nombre][recopilado.mes] || new Decimal(0)
          ).plus(recopilado.precio);
        }
      });

      for (const nombre in gastosPorNombre) {
        const gastosMes = gastosPorNombre[nombre];
    const financialDataItem: FinancialDataItem = {
      concept: `${nombre}`,
      january: (gastosMes[1] as Decimal) || null,
      february: (gastosMes[2] as Decimal) || null,
      march: (gastosMes[3] as Decimal) || null,
      april: (gastosMes[4] as Decimal) || null,
      may: (gastosMes[5] as Decimal) || null,
      june: (gastosMes[6] as Decimal) || null,
      july: (gastosMes[7] as Decimal) || null,
      august: (gastosMes[8] as Decimal) || null,
      september: (gastosMes[9] as Decimal) || null,
      october: (gastosMes[10] as Decimal) || null,
      november: (gastosMes[11] as Decimal) || null,
      december: (gastosMes[12] as Decimal) || null,
    };
    resultado.push(financialDataItem);
  }
    }
     */

    const interesesRentaSegundaSoles: { [mes: number]: Decimal } = {};
    const interesesRentaSegundaDolares: { [mes: number]: Decimal } = {};

    const interesesRentaSegundaGastos = await prisma.gasto.findMany({
      where: {
        tipoGasto: "INTERESES_RENTA_SEGUNDA",
        fecha: {
          gte: new Date(Number(yearParam), 0, 1),
          lte: new Date(Number(yearParam), 11, 31, 23, 59, 59, 999),
        },
      },
    });

    interesesRentaSegundaGastos.forEach((gasto) => {
      const mes = gasto.fecha.getMonth() + 1;
      if (gasto.tipoMoneda === "PEN") {
        interesesRentaSegundaSoles[mes] = (interesesRentaSegundaSoles[mes] || new Decimal(0)).plus(
          Math.abs(Number(gasto.monto || 0))
        );
      } else if (gasto.tipoMoneda === "USD") {
        interesesRentaSegundaDolares[mes] = (
          interesesRentaSegundaDolares[mes] || new Decimal(0)
        ).plus(Math.abs(Number(gasto.monto || 0)));
      }
    });

    /** NO CAMBIES EL as Decimal || null, va a dar ERROR  */
    const interesesRentaSegundaSolesItem: FinancialDataItem = {
      concept: "Interes x Fondo S/. ",
      january: (interesesRentaSegundaSoles[1] as Decimal) || null,
      february: (interesesRentaSegundaSoles[2] as Decimal) || null,
      march: (interesesRentaSegundaSoles[3] as Decimal) || null,
      april: (interesesRentaSegundaSoles[4] as Decimal) || null,
      may: (interesesRentaSegundaSoles[5] as Decimal) || null,
      june: (interesesRentaSegundaSoles[6] as Decimal) || null,
      july: (interesesRentaSegundaSoles[7] as Decimal) || null,
      august: (interesesRentaSegundaSoles[8] as Decimal) || null,
      september: (interesesRentaSegundaSoles[9] as Decimal) || null,
      october: (interesesRentaSegundaSoles[10] as Decimal) || null,
      november: (interesesRentaSegundaSoles[11] as Decimal) || null,
      december: (interesesRentaSegundaSoles[12] as Decimal) || null,
    };

    /** NO CAMBIES EL as Decimal || null, va a dar ERROR  */
    const interesesRentaSegundaDolaresItem: FinancialDataItem = {
      concept: "Interes x Fondo $ ",
      january: Number((interesesRentaSegundaDolares[1] as Decimal) || 0) || null,
      february: Number((interesesRentaSegundaDolares[2] as Decimal) || 0) || null,
      march: Number((interesesRentaSegundaDolares[3] as Decimal) || 0) || null,
      april: Number(interesesRentaSegundaDolares[4] as Decimal) || null,
      may: Number((interesesRentaSegundaDolares[5] as Decimal) || 0) || null,
      june: Number((interesesRentaSegundaDolares[6] as Decimal) || 0) || null,
      july: Number((interesesRentaSegundaDolares[7] as Decimal) || 0) || null,
      august: Number((interesesRentaSegundaDolares[8] as Decimal) || 0) || null,
      september: Number((interesesRentaSegundaDolares[9] as Decimal) || 0) || null,
      october: Number((interesesRentaSegundaDolares[10] as Decimal) || 0) || null,
      november: Number((interesesRentaSegundaDolares[11] as Decimal) || 0) || null,
      december: Number((interesesRentaSegundaDolares[12] as Decimal) || 0) || null,
    };

    resultado.push(interesesRentaSegundaSolesItem);
    resultado.push(interesesRentaSegundaDolaresItem);

    const impuestosPenPorMes: { [mes: number]: Decimal } = {};
    const impuestosGastos = await prisma.gasto.findMany({
      where: {
        tipoGasto: "IMPUESTOS",
        tipoMoneda: "PEN",
        fecha: {
          gte: new Date(Number(yearParam), 0, 1),
          lte: new Date(Number(yearParam), 11, 31, 23, 59, 59, 999),
        },
      },
    });

    impuestosGastos.forEach((gasto) => {
      const mes = gasto.fecha.getMonth() + 1;
      impuestosPenPorMes[mes] = (impuestosPenPorMes[mes] || new Decimal(0)).plus(
        Math.abs(Number(gasto.monto || 0))
      );
    });

    // Crear el objeto FinancialDataItem para los impuestos PEN
    const impuestosPenItem: FinancialDataItem = {
      concept: "Impuestos y Detracción",
      january: impuestosPenPorMes[1] || null,
      february: impuestosPenPorMes[2] || null,
      march: impuestosPenPorMes[3] || null,
      april: impuestosPenPorMes[4] || null,
      may: impuestosPenPorMes[5] || null,
      june: impuestosPenPorMes[6] || null,
      july: impuestosPenPorMes[7] || null,
      august: impuestosPenPorMes[8] || null,
      september: impuestosPenPorMes[9] || null,
      october: impuestosPenPorMes[10] || null,
      november: impuestosPenPorMes[11] || null,
      december: impuestosPenPorMes[12] || null,
    };

    resultado.push(impuestosPenItem);

    console.log("=== RESULTADO FINANCIERO ===");
    resultado.forEach((item) => {
      console.log(item.concept, "Enero:", item.january?.toString() || item.january);
    });

    return { data: resultado };
  } catch (error) {
    console.error("Error fetching and processing gastos data:", error);
  }
}

export async function exportarRecopilacionAnio(
  req: Request,
  res: Response
): Promise<any | undefined> {
  try {
    let year: number;
    const yearParam = req.query.year;

    if (yearParam && typeof yearParam === "string" && !isNaN(parseInt(yearParam, 10))) {
      year = parseInt(yearParam, 10);
    } else {
      year = new Date().getFullYear();
    }
    const mesesNumericos = Array.from({ length: 12 }, (_, i) => i + 1);
    const meses = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
    const tipoGastos = ["OVERNIGHT_BCP", "ITF", "MANTENIMIENTO"];
    const monedas = ["PEN", "USD"];

    const resultado: FinancialDataItem[] = [];
    const gastosPersonalesPorMesIndividual: { [concepto: string]: { [mes: number]: Decimal } } = {};

    const gastosPersonalesTotalPorMes: { [mes: number]: Decimal } = {};

    mesesNumericos.forEach((mes) => {
      gastosPersonalesTotalPorMes[mes] = new Decimal(0);
    });

    const tcPorMes: {
      [mes: number]: number;
    } = {};

    const tc = await prisma.tipoCambioMes.findMany({
      where: {
        anio: Number(year),
      },
      orderBy: {
        mes: "asc",
      },
    });

    tc.forEach((tcItem) => {
      tcPorMes[tcItem.mes] = tcItem.valor;
    });

    const totalTC: FinancialDataItem = {
      concept: "TC",
      january: tcPorMes[1] || null,
      february: tcPorMes[2] || null,
      march: tcPorMes[3] || null,
      april: tcPorMes[4] || null,
      may: tcPorMes[5] || null,
      june: tcPorMes[6] || null,
      july: tcPorMes[7] || null,
      august: tcPorMes[8] || null,
      september: tcPorMes[9] || null,
      october: tcPorMes[10] || null,
      november: tcPorMes[11] || null,
      december: tcPorMes[12] || null,
    };

    resultado.push(totalTC);

    const tipoGastoPersonal = ["PERSONAL_PERSONAS", "PERSONAL"];

    const gastosPersonalesRecopilados = await prisma.gasto.findMany({
      where: {
        tipoGasto: {
          in: tipoGastoPersonal as TipoGasto[],
        },
        fecha: {
          gte: new Date(`${year}-01-01T00:00:00.000Z`),
          lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
        },
      },
    });

    gastosPersonalesRecopilados.forEach((gasto) => {
      mesesNumericos.forEach((mes) => {
        if (gasto.concepto) {
          if (!gastosPersonalesPorMesIndividual[gasto.concepto]) {
            gastosPersonalesPorMesIndividual[gasto.concepto] = {};
          }
          gastosPersonalesPorMesIndividual[gasto.concepto][mes] = new Decimal(0);
        }
      });
    });

    gastosPersonalesRecopilados.forEach((gasto) => {
      if (gasto.fecha && gasto.concepto !== null) {
        const mesF = gasto.fecha.getUTCMonth() + 1;

        if (gastosPersonalesPorMesIndividual[gasto.concepto || ""] !== undefined) {
          gastosPersonalesPorMesIndividual[gasto.concepto || ""][mesF] = (
            gastosPersonalesPorMesIndividual[gasto.concepto || ""][mesF] || new Decimal(0)
          ).plus(Math.abs(Number(gasto.monto)) || 0);

          gastosPersonalesTotalPorMes[mesF] = gastosPersonalesTotalPorMes[mesF].plus(
            Math.abs(Number(gasto.monto)) || 0
          );
        }
      }
    });

    console.log("Gastos personales totales por mes:", gastosPersonalesTotalPorMes);
    console.log("Gastos personales por concepto:", gastosPersonalesPorMesIndividual);

    /** NO CAMBIES EL as Decimal || null, va a dar ERROR  */
    const totalGastosPersonalesItem: FinancialDataItem = {
      concept: "GASTOS DE PERSONAL",
      january: null,
      february: null,
      march: null,
      april: null,
      may: null,
      june: null,
      july: null,
      august: null,
      september: null,
      october: null,
      november: null,
      december: null,
    };

    const currentYear = new Date().getUTCFullYear();
    const startOfYear = new Date(currentYear, 0, 1, 0, 0, 0, 0);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);
    const leasingData = await prisma.leasingOperacion.findMany({
      where: {
        fecha_final: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
    });

    const monthlyRendimientosLeasing: { [month: number]: Decimal } = {};

    leasingData.forEach((item) => {
      const fechaInicial = new Date(item.fecha_inicial);
      const itemMonth = fechaInicial.getUTCMonth();
      monthlyRendimientosLeasing[itemMonth] = (
        monthlyRendimientosLeasing[itemMonth] || new Decimal(0)
      ).plus(item.rendimiento);
    });

    console.log("Rendimientos leasing por mes:", monthlyRendimientosLeasing);

    const leasingResult: FinancialDataItem = {
      concept: "Leasing",
      january: null,
      february: null,
      march: null,
      april: null,
      may: null,
      june: null,
      july: null,
      august: null,
      september: null,
      october: null,
      november: null,
      december: null,
    };

    Object.entries(monthlyRendimientosLeasing).forEach(([month, rendimiento]) => {
      const monthIndex = parseInt(month, 10);
      const monthName = new Intl.DateTimeFormat("en-US", { month: "long" })
        .format(new Date(year, monthIndex, 1))
        .toLowerCase() as keyof FinancialDataItem;
      leasingResult[monthName] = (rendimiento.toNumber() as string & Decimal & number) || null;
    });

    /** MUY NECESARIO, NO BORRAR */
    resultado.push({
      concept: "Ingresos",
      january: null,
      february: null,
      march: null,
      april: null,
      may: null,
      june: null,
      july: null,
      august: null,
      september: null,
      october: null,
      november: null,
      december: null,
    });
    resultado.push(leasingResult);

    // Crear objetos para cada tipo de gasto y moneda
    tipoGastos.forEach((tipo) => {
      monedas.forEach((moneda) => {
        const concepto = `${tipo}_${moneda === "PEN" ? "SOLES" : "DOLARES"}`;
        let conceptName = "";
        conceptName = concepto === "OVERNIGHT_BCP_SOLES" ? "Interes x Inversión S/." : conceptName;
        conceptName = concepto === "OVERNIGHT_BCP_DOLARES" ? "Interes x Inversión $" : conceptName;
        conceptName = concepto === "ITF_SOLES" ? "ITF S/." : conceptName;
        conceptName = concepto === "ITF_DOLARES" ? "ITF $" : conceptName;
        conceptName = concepto === "MANTENIMIENTO_SOLES" ? "Mantto S/." : conceptName;
        conceptName = concepto === "MANTENIMIENTO_DOLARES" ? "Mantto $" : conceptName;
        if (concepto === "ITF_SOLES") {
          resultado.push({
            concept: "EGRESOS",
            january: null,
            february: null,
            march: null,
            april: null,
            may: null,
            june: null,
            july: null,
            august: null,
            september: null,
            october: null,
            november: null,
            december: null,
          });
        }
        resultado.push({
          concept: conceptName ? conceptName : concepto,
          january: null,
          february: null,
          march: null,
          april: null,
          may: null,
          june: null,
          july: null,
          august: null,
          september: null,
          october: null,
          november: null,
          december: null,
        });
      });
    });

    // Procesar datos de cuadre de operaciones soles
    const cuadreOperacionesResult: FinancialDataItem = {
      concept: "Interbancarios S/.",
      january: null,
      february: null,
      march: null,
      april: null,
      may: null,
      june: null,
      july: null,
      august: null,
      september: null,
      october: null,
      november: null,
      december: null,
    };
    let hasCuadreData = false;

    const cuadreOperacionesDolaresResult: FinancialDataItem = {
      concept: "Interbancarios $", // Concepto solicitado
      january: null,
      february: null,
      march: null,
      april: null,
      may: null,
      june: null,
      july: null,
      august: null,
      september: null,
      october: null,
      november: null,
      december: null,
    };
    let hasCuadreDolaresData = false;

    for (const mesFecha of meses) {
      const mes = mesFecha.getMonth();
      const startDate = new Date(year, mes, 1);
      const endDate = new Date(year, mes + 1, 0, 23, 59, 59, 999);

      const gastos = await prisma.gasto.findMany({
        where: {
          fecha: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      // Obtener y procesar datos de cuadre de operaciones en soles para el mes actual
      const cuadreOperacionesSolesData = await prisma.operacion.findMany({
        where: {
          fecha: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          cuadreOperacion: {
            include: {
              CuadreOperacionSoles: true,
            },
          },
          flujoFondos: true,
        },
      });

      const monthName = new Intl.DateTimeFormat("en-US", { month: "long" })
        .format(startDate)
        .toLowerCase() as keyof FinancialDataItem;
      // Sumar las diferencias de cuadre de operaciones en soles para el mes actual

      console.log("Operaciones S/ mes:", monthName, "cantidad:", cuadreOperacionesSolesData.length);
      let totalDiferenciaPen = 0;
      cuadreOperacionesSolesData.forEach((operacion) => {
        let totalSoles = Number(operacion.flujoFondos.montoPEN || 0);

        operacion.cuadreOperacion?.CuadreOperacionSoles.map((cuadreSoles) => {
          totalSoles = Number(totalSoles || 0) - Number(cuadreSoles.monto_pen || 0);
        });
        totalDiferenciaPen += totalSoles;
      });

      if (totalDiferenciaPen !== 0) {
        hasCuadreData = true;
        cuadreOperacionesResult[monthName] =
          (totalDiferenciaPen as string & Decimal & number) || null;
      }

      const cuadreOperacionesDolaresData = await prisma.operacion.findMany({
        where: {
          fecha: {
            // Usar fecha_usd según tu modelo
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          cuadreOperacion: {
            include: {
              CuadreOperacionDolares: true,
            },
          },
        },
      });

      let totalDiferenciaUsd = 0;
      cuadreOperacionesDolaresData.forEach((operacion) => {
        let totalDolares = Math.abs(operacion.dolares);
        operacion.cuadreOperacion?.CuadreOperacionDolares.map((cuadreDolares) => {
          totalDolares = Math.abs(totalDolares) - Math.abs(cuadreDolares.monto_usd);
        });
        totalDiferenciaUsd += Math.abs(totalDolares);
      });

      if (totalDiferenciaUsd !== 0) {
        hasCuadreDolaresData = true;
        cuadreOperacionesDolaresResult[monthName] =
          (totalDiferenciaUsd as string & Decimal & number) || null;
      }

      tipoGastos.forEach((tipo) => {
        monedas.forEach((moneda) => {
          const concepto = `${tipo}_${moneda === "PEN" ? "SOLES" : "DOLARES"}`;
          let total = gastos
            .filter((g) => g.tipoGasto === tipo && g.tipoMoneda === moneda)
            .reduce((acc, g) => acc + parseFloat(g.monto.toString()), 0);

          const mesIndex = meses.indexOf(mesFecha);

          if (mesIndex !== -1) {
            resultado.forEach((item) => {
              let conceptName = "";
              conceptName =
                concepto === "OVERNIGHT_BCP_SOLES" ? "Interes x Inversión S/." : conceptName;
              conceptName =
                concepto === "OVERNIGHT_BCP_DOLARES" ? "Interes x Inversión $" : conceptName;
              conceptName =
                concepto === "INTERESES_RENTA_SEGUNDA_SOLES" ? "Interés x Fondo S/." : conceptName;
              conceptName =
                concepto === "INTERESES_RENTA_SEGUNDA_DOLARES" ? "Interés x Fondo $" : conceptName;
              conceptName = concepto === "ITF_SOLES" ? "ITF S/." : conceptName;
              conceptName = concepto === "ITF_DOLARES" ? "ITF $" : conceptName;
              conceptName = concepto === "MANTENIMIENTO_SOLES" ? "Mantto S/." : conceptName;
              conceptName = concepto === "MANTENIMIENTO_DOLARES" ? "Mantto $" : conceptName;
              if (item.concept === conceptName) {
                const mesKey = monthName;
                item[mesKey] = (-total as string & Decimal & number) || null;
              }
            });
          }
        });
      });
    }
    if (hasCuadreData) {
      console.log("No hay curadres"); // Esta línea quizás deba ser revisada o eliminada si no es un log de error
      resultado.push(cuadreOperacionesResult);
    }

    if (hasCuadreDolaresData) {
      resultado.push(cuadreOperacionesDolaresResult);
    }

    const tipoGastos3 = ["MANTENIMIENTO", "FUNCIONAMIENTO", "DIVERSOS_OPERATIVOS"];

    const conceptosABuscar: string[] = [
      "CELULARES",
      "TI",
      "CONTABILIDAD",
      "COMBUSTIBLE",
      "ALQUILER",
      "CUMPLIMIENTO",
    ];

    const monthlyTotalsByConcept: { [concept: string]: { [month: number]: number } } = {};

    conceptosABuscar.forEach((concept) => {
      monthlyTotalsByConcept[concept] = {};
      for (let i = 1; i <= 12; i++) {
        monthlyTotalsByConcept[concept][i] = 0;
      }
    });

    for (const tipo of tipoGastos3) {
      const recopilados = await prisma.gasto.findMany({
        where: {
          tipoGasto: tipo as TipoGasto,
          fecha: {
            gte: new Date(`${year}-01-01T00:00:00.000Z`),
            lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
          },
          clase: {
            in: conceptosABuscar,
          },
        },
      });

      recopilados.forEach((gasto) => {
        const mes = gasto.fecha.getUTCMonth() + 1;
        const conceptName = gasto.clase || "";

        console.log(conceptName, mes, gasto.monto, monthlyTotalsByConcept[conceptName]);
        if (monthlyTotalsByConcept[conceptName] !== undefined) {
          monthlyTotalsByConcept[conceptName][mes] =
            Number(monthlyTotalsByConcept[conceptName][mes] || 0) +
            Math.abs(gasto.monto.toNumber() || 0);
        }
        console.log("RESULTADO: ", monthlyTotalsByConcept[conceptName]);
      });
    }

    conceptosABuscar.forEach((nombre) => {
      const monthlyData = monthlyTotalsByConcept[nombre];
      console.log("MOTHLY DATA: ", nombre, monthlyData);
      const financialDataItem: FinancialDataItem = {
        concept: getNombreFormateado(nombre),
        january: monthlyData[1] === 0 ? null : monthlyData[1],
        february: monthlyData[2] === 0 ? null : monthlyData[2],
        march: monthlyData[3] === 0 ? null : monthlyData[3],
        april: monthlyData[4] === 0 ? null : monthlyData[4],
        may: monthlyData[5] === 0 ? null : monthlyData[5],
        june: monthlyData[6] === 0 ? null : monthlyData[6],
        july: monthlyData[7] === 0 ? null : monthlyData[7],
        august: monthlyData[8] === 0 ? null : monthlyData[8],
        september: monthlyData[9] === 0 ? null : monthlyData[9],
        october: monthlyData[10] === 0 ? null : monthlyData[10],
        november: monthlyData[11] === 0 ? null : monthlyData[11],
        december: monthlyData[12] === 0 ? null : monthlyData[12],
      };

      if (resultado.findIndex((item) => item.concept === financialDataItem.concept) === -1) {
        resultado.push(financialDataItem);
      }
    });

    /** GASTOS PERSONALES PERSONAS O ASISTENTES  */
    resultado.push(totalGastosPersonalesItem);

    for (const nombre in gastosPersonalesPorMesIndividual) {
      const gastosPorMes = gastosPersonalesPorMesIndividual[nombre];

      /** NO CAMBIES EL as Decimal || null, va a dar ERROR  */
      const financialDataItem: FinancialDataItem = {
        concept: nombre,
        january: Math.abs(Number(gastosPorMes[1] as Decimal)) || null,
        february: (gastosPorMes[2] as Decimal) || null,
        march: (gastosPorMes[3] as Decimal) || null,
        april: (gastosPorMes[4] as Decimal) || null,
        may: (gastosPorMes[5] as Decimal) || null,
        june: (gastosPorMes[6] as Decimal) || null,
        july: (gastosPorMes[7] as Decimal) || null,
        august: (gastosPorMes[8] as Decimal) || null,
        september: (gastosPorMes[9] as Decimal) || null,
        october: (gastosPorMes[10] as Decimal) || null,
        november: (gastosPorMes[11] as Decimal) || null,
        december: (gastosPorMes[12] as Decimal) || null,
      };
      console.log(` GASTOS ${nombre} `, gastosPorMes);
      console.log(` ${nombre} `, financialDataItem);
      resultado.push(financialDataItem); // Colocar los gastos personales individuales después del total
    }

    const interesesRentaSegundaSoles: { [mes: number]: Decimal } = {};
    const interesesRentaSegundaDolares: { [mes: number]: Decimal } = {};

    const interesesRentaSegundaGastos = await prisma.gasto.findMany({
      where: {
        tipoGasto: "INTERESES_RENTA_SEGUNDA",
        fecha: {
          gte: new Date(year, 0, 1),
          lte: new Date(year, 11, 31, 23, 59, 59, 999),
        },
      },
    });

    interesesRentaSegundaGastos.forEach((gasto) => {
      const mes = gasto.fecha.getMonth() + 1;
      if (gasto.tipoMoneda === "PEN") {
        interesesRentaSegundaSoles[mes] = (interesesRentaSegundaSoles[mes] || new Decimal(0)).plus(
          Math.abs(Number(gasto.monto))
        );
      } else if (gasto.tipoMoneda === "USD") {
        interesesRentaSegundaDolares[mes] = (
          interesesRentaSegundaDolares[mes] || new Decimal(0)
        ).plus(Math.abs(Number(gasto.monto)));
      }
    });

    /** NO CAMBIES EL as Decimal || null, va a dar ERROR  */
    const interesesRentaSegundaSolesItem: FinancialDataItem = {
      concept: "Interes x Fondo S/. ",
      january: (interesesRentaSegundaSoles[1] as Decimal) || null,
      february: (interesesRentaSegundaSoles[2] as Decimal) || null,
      march: (interesesRentaSegundaSoles[3] as Decimal) || null,
      april: (interesesRentaSegundaSoles[4] as Decimal) || null,
      may: (interesesRentaSegundaSoles[5] as Decimal) || null,
      june: (interesesRentaSegundaSoles[6] as Decimal) || null,
      july: (interesesRentaSegundaSoles[7] as Decimal) || null,
      august: (interesesRentaSegundaSoles[8] as Decimal) || null,
      september: (interesesRentaSegundaSoles[9] as Decimal) || null,
      october: (interesesRentaSegundaSoles[10] as Decimal) || null,
      november: (interesesRentaSegundaSoles[11] as Decimal) || null,
      december: (interesesRentaSegundaSoles[12] as Decimal) || null,
    };

    /** NO CAMBIES EL as Decimal || null, va a dar ERROR  */
    const interesesRentaSegundaDolaresItem: FinancialDataItem = {
      concept: "Interes x Fondo $ ",
      january: (interesesRentaSegundaDolares[1] as Decimal) || null,
      february: (interesesRentaSegundaDolares[2] as Decimal) || null,
      march: (interesesRentaSegundaDolares[3] as Decimal) || null,
      april: (interesesRentaSegundaDolares[4] as Decimal) || null,
      may: (interesesRentaSegundaDolares[5] as Decimal) || null,
      june: (interesesRentaSegundaDolares[6] as Decimal) || null,
      july: (interesesRentaSegundaDolares[7] as Decimal) || null,
      august: (interesesRentaSegundaDolares[8] as Decimal) || null,
      september: (interesesRentaSegundaDolares[9] as Decimal) || null,
      october: (interesesRentaSegundaDolares[10] as Decimal) || null,
      november: (interesesRentaSegundaDolares[11] as Decimal) || null,
      december: (interesesRentaSegundaDolares[12] as Decimal) || null,
    };

    resultado.push(interesesRentaSegundaSolesItem);
    resultado.push(interesesRentaSegundaDolaresItem);

    const impuestosPenPorMes: { [mes: number]: Decimal } = {};
    const impuestosGastos = await prisma.gasto.findMany({
      where: {
        tipoGasto: "IMPUESTOS",
        tipoMoneda: "PEN",
        fecha: {
          gte: new Date(year, 0, 1),
          lte: new Date(year, 11, 31, 23, 59, 59, 999),
        },
      },
    });

    impuestosGastos.forEach((gasto) => {
      const mes = gasto.fecha.getMonth() + 1;
      impuestosPenPorMes[mes] = (impuestosPenPorMes[mes] || new Decimal(0)).plus(
        Math.abs(Number(gasto.monto))
      );
    });

    // Crear el objeto FinancialDataItem para los impuestos PEN
    const impuestosPenItem: FinancialDataItem = {
      concept: "Impuestos y Detracción",
      january: impuestosPenPorMes[1] || null,
      february: impuestosPenPorMes[2] || null,
      march: impuestosPenPorMes[3] || null,
      april: impuestosPenPorMes[4] || null,
      may: impuestosPenPorMes[5] || null,
      june: impuestosPenPorMes[6] || null,
      july: impuestosPenPorMes[7] || null,
      august: impuestosPenPorMes[8] || null,
      september: impuestosPenPorMes[9] || null,
      october: impuestosPenPorMes[10] || null,
      november: impuestosPenPorMes[11] || null,
      december: impuestosPenPorMes[12] || null,
    };

    resultado.push(impuestosPenItem);

    // --- Lógica de exportación a Excel con xlsx ---

    // 1. Preparar los datos para el worksheet
    const dataForExcel = resultado.map((item) => {
      const row: { [key: string]: string | number | null } = {
        Concepto: item.concept,
      };
      const months = [
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
      const monthNamesSpanish = [
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

      months.forEach((monthKey, index) => {
        const value = item[monthKey as keyof FinancialDataItem];
        // Convertir Decimal a número si es necesario, o manejar directamente en la hoja
        row[monthNamesSpanish[index]] = value instanceof Decimal ? value.toNumber() : value;
      });
      return row;
    });

    // 2. Crear un nuevo libro de trabajo y una hoja
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dataForExcel);

    // 3. Añadir la hoja al libro de trabajo
    XLSX.utils.book_append_sheet(wb, ws, `Gastos_${year}`);

    // 4. Escribir el buffer del archivo Excel
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

    // 5. Configurar los headers de la respuesta para la descarga del archivo
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename=gastos_${year}.xlsx`);

    // 6. Enviar el archivo como respuesta
    res.status(200).send(excelBuffer);
  } catch (error) {
    console.error("Error fetching and processing gastos data:", error);
    res.status(500).json({ error: "Failed to fetch and process gastos data" });
  } finally {
    await prisma.$disconnect();
  }
}
