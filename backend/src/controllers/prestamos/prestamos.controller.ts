import { EstatusPrestamo, Moneda, Prisma } from "@prisma/client";
import { calcularDetraccion } from "../../logic/prestamos/calcularDetraccion";
import { Request, Response } from "express";
import { endOfMonth, startOfMonth } from "date-fns";
import { MonthlyTotal } from "../../interfaces/prestamo.interface";
import * as XLSX from "xlsx";
import prisma from "../../config/database";

//Actualizaremos la data que tiene 0.0 de detraccion.
// export async function recalcularDetracciones(req: Request, res: Response): Promise<any> {
//   try {
//     const prestamos = await prisma.prestamoOperacion.findMany();

//     for (const prestamo of prestamos) {
//       const nuevoValor = calcularDetraccion(Number(prestamo.potencial), prestamo.tipo);

//       await prisma.prestamoOperacion.update({
//         where: { id: prestamo.id },
//         data: { detraccion: nuevoValor },
//       });
//     }
//     return res.status(200).json({
//       message: "Detracciones recalculadas correctamente.",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       error: "Hubo un error al recalcular detracciones",
//     });
//   }
// }

//Actualizaremos la data que tiene 0.0 de detraccion. - SOLO PARA MF-287
export async function recalcularDetracciones(req: Request, res: Response): Promise<any> {
  try {
    // Buscamos solo el préstamo con numero_prestamo "MF-287"
    const prestamo = await prisma.prestamoOperacion.findFirst({
      where: { numero_prestamo: "MF-287" },
    });

    if (!prestamo) {
      return res.status(404).json({ error: "Préstamo no encontrado" });
    }

    const nuevoValor = calcularDetraccion(Number(prestamo.potencial), prestamo.tipo);

    await prisma.prestamoOperacion.update({
      where: { id: prestamo.id }, // Aquí usamos el id, que sí es único
      data: { detraccion: nuevoValor },
    });

    return res.status(200).json({
      message: "Detracción recalculada correctamente para MF-287.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Hubo un error al recalcular la detracción",
    });
  }
}

export async function registrarPrestamo(req: Request, res: Response): Promise<any | undefined> {
  const {
    capital_soles,
    capital_dolares,
    dias,
    moneda,
    devolucion,
    fechaInicial,
    tasa,
    tc,
    tipo,
    factura,
    usuarioId,
    codigoFacturaBoleta,
    numero_prestamo,
    esAntiguo,
  } = req.body;

  const interes =
    (((Number(capital_dolares ?? 0) + Number(capital_soles ?? 0)) * tasa) / 100 / 30) * dias;
  const potencial = interes * Number(moneda === "USD" ? Number(tc ?? 0) : 1);
  const rendimiento = potencial / 1.18;
  const resultadoIGV = rendimiento * 0.18;
  const cobroTotal = parseFloat((capital_dolares ?? 0) + (capital_soles ?? 0) + interes);
  const detraccion = calcularDetraccion(potencial, tipo);

  try {
    /** Generación de un nuevo ID para el prestamo */

    const ultimoPrestamo = await prisma.prestamoOperacion.findFirst({
      orderBy: {
        numero_operacion: "desc",
      },
    });

    if (esAntiguo) {
      if (!numero_prestamo) {
        return res.status(500).json({
          error: "Su prestamo es antiguo pero no hay número de préstamo",
        });
      }
      const numeroFormateado = numero_prestamo;

      const prestamo = await prisma.prestamoOperacion.create({
        data: {
          numero_prestamo: numeroFormateado,
          numero_operacion: ultimoPrestamo?.numero_operacion,
          igv: resultadoIGV,
          tasa: tasa,
          devolucion: new Date(devolucion),
          capital_dolares: Number(capital_dolares) ?? null,
          capital_soles: Number(capital_soles) ?? null,
          usuarioId,
          fechaInicial: new Date(fechaInicial),
          esAntiguo: Boolean(esAntiguo),
          moneda,
          dias,
          cobroTotal: cobroTotal,
          detraccion,
          interes,
          potencial,
          rendimiento,
          tc: Number(tc ?? 0),
          tipo,
          codigoFacturaBoleta,
          factura,
        },
      });
      return res.status(201).json({
        message: "Prestamo registrado correctamente",
        prestamo,
      });
    } else {
      let nuevoId = 227;
      if (ultimoPrestamo?.id) {
        console.log("Ultimo Prestamo", ultimoPrestamo.numero_operacion);
        nuevoId = ultimoPrestamo.numero_operacion + 227;
      }
      const numeroFormateado = `MF-${nuevoId.toString().padStart(3, "0")}`;

      // const codigoFacturaBoleta = calcularFacturaBoleta(nuevoId, tipo)

      /** ------------------------------------------------- */

      const prestamo = await prisma.prestamoOperacion.create({
        data: {
          numero_prestamo: numeroFormateado,
          igv: resultadoIGV,
          tasa: tasa,
          numero_operacion: Number(ultimoPrestamo?.numero_operacion ?? 0) + 1,
          devolucion: new Date(devolucion),
          capital_dolares: Number(capital_dolares) ?? null,
          capital_soles: Number(capital_soles) ?? null,
          usuarioId,
          fechaInicial: new Date(fechaInicial),
          moneda,
          esAntiguo: Boolean(esAntiguo),
          dias,
          cobroTotal: cobroTotal,
          detraccion,
          interes,
          potencial,
          rendimiento,
          tc: Number(tc ?? 0),
          tipo,
          codigoFacturaBoleta,
          factura,
        },
      });
      return res.status(201).json({
        message: "Prestamo registrado correctamente",
        prestamo,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar prestamo" });
  }
}

export async function obtenerPrestamos(req: any, res: any) {
  // console.log("Hola desde aqui.");
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const search = (req.query.search as string)?.trim() || "";
    const fecha = (req.query.fecha as string)?.trim() || "";
    const estadoParam = (req.query.estado as string)?.trim();
    const moneda = (req.query.moneda as string)?.trim() || "";

    const whereConditions: Prisma.PrestamoOperacionWhereInput = {};
    whereConditions.usuario = {
      nombres: {
        contains: search.toLowerCase(),
      },
      rol_id: 3,
    };
    if (fecha) {
      const mesesMap: { [key: string]: number } = {
        enero: 0,
        febrero: 1,
        marzo: 2,
        abril: 3,
        mayo: 4,
        junio: 5,
        julio: 6,
        agosto: 7,
        septiembre: 8,
        octubre: 9,
        noviembre: 10,
        diciembre: 11,
      };

      const mesNumero = mesesMap[fecha.toLowerCase()];
      if (mesNumero !== undefined) {
        const now = new Date();
        const year = now.getFullYear(); // podrías hacerlo dinámico si lo necesitás
        const fechaReferencia = new Date(year, mesNumero, 1);

        const startDate = startOfMonth(fechaReferencia);
        const endDate = endOfMonth(fechaReferencia);

        whereConditions.fechaInicial = {
          gte: startDate,
          lte: endDate,
        };
      }
    }
    if (estadoParam) {
      const estadoValido = Object.values(EstatusPrestamo).includes(estadoParam as EstatusPrestamo);
      if (estadoValido) {
        whereConditions.estatus = {
          equals: estadoParam as EstatusPrestamo,
        };
      }
    }
    if (moneda) {
      const estadoValido = Object.values(Moneda).includes(moneda as Moneda);
      if (estadoValido) {
        whereConditions.moneda = {
          equals: moneda as Moneda,
        };
      }
    }

    const [prestamos, total] = await prisma.$transaction([
      prisma.prestamoOperacion.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: whereConditions,
        include: {
          usuario: true,
          PrestamoAnulados: true,
        },
        orderBy: {
          fechaInicial: "desc",
        },
      }),
      prisma.prestamoOperacion.count(),
    ]);

    res.status(200).json({
      data: prestamos,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener prestamos" });
  }
}

export async function editarPrestamo(req: Request, res: Response): Promise<any | undefined> {
  const {
    capital_soles,
    capital_dolares,
    dias,
    moneda,
    devolucion,
    fechaInicial,
    tasa,
    tc,
    tipo,
    estatus,
    documento,
    factura,
    numero_prestamo,
    codigoFacturaBoleta,
    codigoFacturaBoletaAnulado,
  } = req.body;
  console.log(req.body);
  const interes =
    (((Number(capital_dolares) + Number(capital_soles)) * Number(tasa)) / 100 / 30) * Number(dias);
  const potencial = Number(interes) * Number(moneda === "USD" ? Number(tc ?? 0) : 1);
  const rendimiento = Number(potencial) / 1.18;
  const resultadoIGV = Number(rendimiento) * 0.18;
  const cobroTotal = parseFloat(
    String(Number(capital_dolares ?? 0) + Number(capital_soles ?? 0) + Number(interes))
  );
  const detraccion = calcularDetraccion(potencial, tipo);

  try {
    const usuario = await prisma.usuario.findFirst({
      where: {
        documento: documento,
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const prestamoBuscado = await prisma.prestamoOperacion.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!prestamoBuscado) {
      return res.status(404).json({ message: "Prestamo no encontrado" });
    }
    /** Generación de un nuevo ID para el prestamo */
    /*
    let codigoFacturaBoleta = ''
    let cambiodeTipo = false
    
    if (tipo !== prestamoBuscado.tipo) {
      console.log('cambio de tipo')
      cambiodeTipo = true
      codigoFacturaBoleta = calcularFacturaBoleta(prestamoBuscado ? prestamoBuscado.id + 227 : 1, tipo)
    }
    */

    if (factura === "ANULADO" || factura === "NOTA DE CREDITO") {
      const prestamo = await prisma.prestamoOperacion.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          numero_prestamo: numero_prestamo ? numero_prestamo : prestamoBuscado.numero_prestamo,
          igv: resultadoIGV,
          tasa: tasa,
          devolucion: new Date(devolucion),
          fechaInicial: new Date(fechaInicial),
          capital_dolares: Number(capital_dolares) ?? null,
          capital_soles: Number(capital_soles) ?? null,
          usuarioId: usuario.id,
          moneda,
          codigoFacturaBoleta,
          dias,
          cobroTotal: cobroTotal,
          detraccion,
          interes,
          potencial,
          rendimiento,
          tc: Number(tc ?? 0),
          estatus: estatus,
          ganancia: String(estatus).toUpperCase() === "PAGADO" ? rendimiento : 0,
          factura: "",
        },
      });

      const prestamoAnulados = await prisma.prestamoAnulados.create({
        data: {
          codigoFacturaBoleta: codigoFacturaBoletaAnulado,
          factura,
          prestamo: {
            connect: {
              id: Number(prestamo.id),
            },
          },
        },
      });

      return res.status(200).json({
        message: "Prestamo editado correctamente",
        prestamo,
        prestamoAnulados,
      });
    }

    const prestamo = await prisma.prestamoOperacion.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        numero_prestamo: numero_prestamo ? numero_prestamo : prestamoBuscado.numero_prestamo,
        igv: resultadoIGV,
        tasa: tasa,
        devolucion: new Date(devolucion),
        fechaInicial: new Date(fechaInicial),
        capital_dolares: Number(capital_dolares) ?? null,
        capital_soles: Number(capital_soles) ?? null,
        usuarioId: usuario.id,
        moneda,
        codigoFacturaBoleta,
        dias,
        cobroTotal: cobroTotal,
        detraccion,
        interes,
        potencial,
        rendimiento,
        tc: Number(tc ?? 0),
        estatus: estatus,
        ganancia: String(estatus).toUpperCase() === "PAGADO" ? rendimiento : 0,
        factura,
      },
    });

    return res.status(200).json({
      message: "Prestamo editado correctamente",
      prestamo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar prestamo" });
  }
}

export const obtenerTotalCapitalPorMes = async (req: Request, res: Response) => {
  try {
    const totalesPorMesDB = await prisma.$queryRaw<
      { month: number; year: number; totalSoles: number | null; totalDolares: number | null }[]
    >`
      SELECT
        MONTH(createdAt) AS month,
        YEAR(createdAt) AS year,
        SUM(capital_soles) AS totalSoles,
        SUM(capital_dolares) AS totalDolares
      FROM prestamo
      GROUP BY YEAR(createdAt), MONTH(createdAt)
      ORDER BY year, month;
    `;

    const currentYear = new Date().getFullYear();
    const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);

    const formattedData = allMonths.map((month) => {
      const dataForMonth = totalesPorMesDB.find((item) => item.month === month);
      const monthName = new Date(currentYear, month - 1, 1).toLocaleString("en-US", {
        month: "long",
      });

      return {
        month: monthName,
        soles: dataForMonth?.totalSoles ? parseFloat(dataForMonth.totalSoles.toFixed(2)) : 0,
        dolares: dataForMonth?.totalDolares ? parseFloat(dataForMonth.totalDolares.toFixed(2)) : 0,
      };
    });

    // Ensure all 12 months are present, filling in missing months with 0s
    const finalData = allMonths.map((monthNumber) => {
      const monthName = new Date(currentYear, monthNumber - 1, 1).toLocaleString("en-US", {
        month: "long",
      });
      const existingMonthData = formattedData.find((m) => m.month === monthName);
      if (existingMonthData) {
        return existingMonthData;
      } else {
        return {
          month: monthName,
          soles: 0,
          dolares: 0,
        };
      }
    });

    res.status(200).json(finalData);
  } catch (error) {
    console.error("Error al obtener el total del capital por mes:", error);
    res.status(500).json({ error: "Error al obtener el total del capital por mes" });
  }
  /*
  try {
    const totalesPorMes = await prisma.$queryRaw<
      { month: number; year: number; totalSoles: number | null; totalDolares: number | null }[]
    >`
      SELECT
        MONTH(createdAt) AS month,
        YEAR(createdAt) AS year,
        SUM(capital_soles) AS totalSoles,
        SUM(capital_dolares) AS totalDolares
      FROM op_prestamo
      GROUP BY YEAR(createdAt), MONTH(createdAt)
      ORDER BY year, month;
    `;

    // Formatear los resultados para que coincidan con tu estructura de `chartData`
    const formattedData = totalesPorMes.map(item => ({
      month: new Date(item.year, item.month - 1, 1).toLocaleString('en-US', { month: 'long' }),
      soles: item.totalSoles ? parseFloat(item.totalSoles.toFixed(2)) : 0,
      dolares: item.totalDolares ? parseFloat(item.totalDolares.toFixed(2)) : 0,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error al obtener el total del capital por mes:', error);
    res.status(500).json({ error: 'Error al obtener el total del capital por mes' });
  }
    */
};

export async function exportarExcelPrestamos(
  req: Request,
  res: Response
): Promise<any | undefined> {
  try {
    const { nombre, moneda, estado } = req.body;

    const whereConditions: Prisma.PrestamoOperacionWhereInput = {};

    if (nombre) {
      const searchLower = nombre.toLowerCase();
      whereConditions.usuario = {
        OR: [
          { apellido_paterno: { contains: searchLower } },
          { apellido_materno: { contains: searchLower } },
          { apellido_paterno_apo: { contains: searchLower } },
          { apellido_materno_apo: { contains: searchLower } },
          { nombres: { contains: searchLower } },
          { cliente: { contains: searchLower } },
          { cliente_2: { contains: searchLower } },
          { email: { contains: searchLower } },
          { documento: { contains: searchLower } },
          { documento_2: { contains: searchLower } },
          { documento_tercero: { contains: searchLower } },
        ],
      };
    }

    if (moneda) {
      whereConditions.moneda = {
        equals: moneda,
      };
    }

    if (estado) {
      whereConditions.estatus = {
        equals: estado,
      };
    }

    const prestamos = await prisma.prestamoOperacion.findMany({
      where: whereConditions,
      include: {
        usuario: true, // Incluye la información del usuario que realizó el préstamo.
      },
    });

    // Define las cabeceras de las columnas del archivo Excel.  Estos son los nombres de las columnas.
    const headers = [
      "Fecha",
      "Número de Préstamo",
      "Cliente/Titular",
      "Tipo Doc.",
      "Documento",
      "Capital en Soles",
      "Capital en Dólares",
      "Moneda",
      "Tasa",
      "Devolución",
      "Días",
      "Estatus",
      "Interés",
      "Cobro Total",
      "Tipo de Cambio",
      "Potencial",
      "IGV",
      "Rendimiento",
      "Ganancia",
      "Cuadre",
      "Detracción",
      "Factura/Boleta",
      "Usuario",
      "Código Factura/Boleta",
      "Tipo",
    ];

    // Mapea los datos de los préstamos obtenidos de la base de datos a un formato de array de arrays,
    // donde cada inner array representa una fila en el archivo Excel.
    const rows = prestamos.map((prestamo) => [
      prestamo.fechaInicial.toISOString().split("T")[0],
      prestamo.numero_prestamo ?? "",
      `${prestamo.usuario.nombres} ${prestamo.usuario.apellido_paterno} ${prestamo.usuario.apellido_materno}`,
      prestamo.usuario.tipo_documento,
      prestamo.usuario.documento,
      prestamo.capital_soles?.toNumber() ?? "", // Usa '' si es nulo y convierte Decimal a number
      prestamo.capital_dolares?.toNumber() ?? "",
      prestamo.moneda,
      prestamo.tasa,
      prestamo.devolucion,
      prestamo.dias,
      prestamo.estatus,
      prestamo.interes.toNumber(),
      prestamo.cobroTotal.toNumber(),
      prestamo.tc.toNumber(),
      prestamo.potencial.toNumber(),
      prestamo.igv.toNumber(),
      prestamo.rendimiento.toNumber(),
      prestamo.ganancia.toNumber(),
      prestamo.cuadre?.toNumber() ?? "",
      prestamo.detraccion.toNumber(),
      prestamo.factura ?? "",
      `${prestamo.usuario.nombres} ${prestamo.usuario.apellido_paterno} ${prestamo.usuario.apellido_materno}`,
      prestamo.codigoFacturaBoleta ?? "",
      prestamo.tipo,
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Préstamos");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=prestamos.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (error) {
    console.error("Error al exportar préstamos a Excel:", error);
    res.status(500).json({ message: "Error al exportar préstamos a Excel" });
  } finally {
    prisma.$disconnect();
  }
}

export async function getTotal(req: Request, res: Response): Promise<any | undefined> {
  let year: number;

  const yearParam = req.query.year;

  if (yearParam && typeof yearParam === "string" && !isNaN(parseInt(yearParam, 10))) {
    year = parseInt(yearParam, 10);
  } else {
    year = new Date().getFullYear();
  }

  try {
    const monthlyTotals: MonthlyTotal[] = [];

    let accumulatedTotalCapitalSoles = 0;
    let accumulatedTotalCapitalDolares = 0;
    let accumulatedTotalInteres = 0;
    let accumulatedTotalCobroTotal = 0;
    // let accumulatedTotalTc = 0;
    let accumulatedTotalPotencial = 0;
    let accumulatedTotalIgv = 0;
    let accumulatedTotalRendimiento = 0;
    let accumulatedTotalGanancia = 0;
    let accumulatedTotalDetraccion = 0;
    let totalDaysAccumulated = 0;
    let totalRateAccumulated = 0;
    let totalPrestamosAccumulated = 0;

    let accumulatedSumaTcNoCero = 0;
    let accumulatedCantidadTcNoCero = 0;

    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      const prestamos = await prisma.prestamoOperacion.findMany({
        //No deberia de agarrar desde la fecha de creacion, fix: 05-11
        where: {
          // createdAt: {
          //   gte: startDate,
          //   lte: endDate,
          // },
          fechaInicial: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      // if (month === 1) {
      //   console.log("Mes - Enero");

      //   let cantidadDeValorHayados = 0;
      //   let sumaTotalDeTc = 0;

      //   prestamos.forEach((prestamo) => {
      //     const tc = prestamo.tc.toNumber();

      //     if (tc !== 0) {
      //       cantidadDeValorHayados++;
      //       sumaTotalDeTc += tc;
      //     }
      //   });

      //   console.log({ cantidadDeValorHayados });
      //   console.log({ sumaTotalDeTc });

      //   const promedio = cantidadDeValorHayados > 0 ? sumaTotalDeTc / cantidadDeValorHayados : 0;

      //   console.log({ promedio: promedio.toFixed(2) });
      // }

      let totalCapitalSoles = 0;
      let totalCapitalDolares = 0;
      let totalInteres = 0;
      let totalCobroTotal = 0;
      // let totalTc = 0;
      let totalPotencial = 0;
      let totalIgv = 0;
      let totalRendimiento = 0;
      let totalGanancia = 0;
      let totalDetraccion = 0;
      let sumOfDays = 0;
      let sumOfRates = 0;
      let hasNonZeroTotal = false;

      let sumaTcNoCero = 0;
      let cantidadTcNoCero = 0;

      prestamos.forEach((prestamo) => {
        const capitalSoles = prestamo.capital_soles?.toNumber() || 0;
        const capitalDolares = prestamo.capital_dolares?.toNumber() || 0;
        const interes = prestamo.interes.toNumber();
        const cobroTotal = prestamo.cobroTotal.toNumber();
        const tc = prestamo.tc.toNumber();
        const potencial = prestamo.potencial.toNumber();
        const igv = prestamo.igv.toNumber();
        const rendimiento = prestamo.rendimiento.toNumber();
        const ganancia = prestamo.ganancia.toNumber();
        const detraccion = prestamo.detraccion.toNumber();

        if (tc !== 0) {
          sumaTcNoCero += tc;
          cantidadTcNoCero++;
        }

        totalCapitalSoles += capitalSoles;
        totalCapitalDolares += capitalDolares;
        totalInteres += interes;
        totalCobroTotal += cobroTotal;
        // totalTc += tc;
        totalPotencial += potencial;
        totalIgv += igv;
        totalRendimiento += rendimiento;
        totalGanancia += ganancia;
        totalDetraccion += detraccion;
        sumOfDays += prestamo.dias;
        sumOfRates += prestamo.tasa;

        if (
          capitalSoles !== 0 ||
          capitalDolares !== 0 ||
          interes !== 0 ||
          cobroTotal !== 0 ||
          tc !== 0 ||
          potencial !== 0 ||
          igv !== 0 ||
          rendimiento !== 0 ||
          ganancia !== 0 ||
          detraccion !== 0
        ) {
          hasNonZeroTotal = true;
        }
      });

      const promedioTc = cantidadTcNoCero > 0 ? sumaTcNoCero / cantidadTcNoCero : 0;

      const monthName = new Intl.DateTimeFormat("es-PE", { month: "long" }).format(startDate);

      if (cantidadTcNoCero > 0) {
        accumulatedSumaTcNoCero += sumaTcNoCero;
        accumulatedCantidadTcNoCero += cantidadTcNoCero;
      }

      if (hasNonZeroTotal) {
        monthlyTotals.push({
          fecha: `${monthName} ${year}`,
          totalCapitalSoles,
          totalCapitalDolares,
          totalInteres,
          totalCobroTotal,
          totalTc: promedioTc,
          totalPotencial,
          totalIgv,
          totalRendimiento,
          totalGanancia,
          totalDetraccion,
          promedioDias: null,
          promedioTasa: null,
        });
      }

      accumulatedTotalCapitalSoles += totalCapitalSoles;
      accumulatedTotalCapitalDolares += totalCapitalDolares;
      accumulatedTotalInteres += totalInteres;
      accumulatedTotalCobroTotal += totalCobroTotal;
      // accumulatedTotalTc += totalTc;
      accumulatedTotalPotencial += totalPotencial;
      accumulatedTotalIgv += totalIgv;
      accumulatedTotalRendimiento += totalRendimiento;
      accumulatedTotalGanancia += totalGanancia;
      accumulatedTotalDetraccion += totalDetraccion;
      totalDaysAccumulated += sumOfDays;
      totalRateAccumulated += sumOfRates;
      totalPrestamosAccumulated += prestamos.length;
    }
    //*Para resolver el problema de tc 23-11
    const accumulatedTotalTc =
      accumulatedCantidadTcNoCero > 0 ? accumulatedSumaTcNoCero / accumulatedCantidadTcNoCero : 0;
    //*
    const accumulatedPromedioDias =
      totalPrestamosAccumulated > 0 ? totalDaysAccumulated / totalPrestamosAccumulated : null;
    const accumulatedPromedioTasa =
      totalPrestamosAccumulated > 0 ? totalRateAccumulated / totalPrestamosAccumulated : null;

    const accumulatedObject = {
      fecha: `Acumulado ${year}`,
      totalCapitalSoles: accumulatedTotalCapitalSoles,
      totalCapitalDolares: accumulatedTotalCapitalDolares,
      totalInteres: accumulatedTotalInteres,
      totalCobroTotal: accumulatedTotalCobroTotal,
      totalTc: accumulatedTotalTc,
      totalPotencial: accumulatedTotalPotencial,
      totalIgv: accumulatedTotalIgv,
      totalRendimiento: accumulatedTotalRendimiento,
      totalGanancia: accumulatedTotalGanancia,
      totalDetraccion: accumulatedTotalDetraccion,
      promedioDias:
        accumulatedPromedioDias !== null ? parseFloat(accumulatedPromedioDias.toFixed(2)) : null,
      promedioTasa:
        accumulatedPromedioTasa !== null ? parseFloat(accumulatedPromedioTasa.toFixed(4)) : null,
    };

    res.status(200).json([...monthlyTotals, accumulatedObject]);
  } catch (error) {
    console.error(`Error fetching monthly totals for year ${year} with accumulated:`, error);
    res
      .status(500)
      .json({ error: `Failed to fetch monthly totals for year ${year} with accumulated` });
  } finally {
    await prisma.$disconnect();
  }
}

export async function getTotalPrestamosFLUJO(yearParam: string): Promise<any | undefined> {
  let year: number;

  if (yearParam && typeof yearParam === "string" && !isNaN(parseInt(yearParam, 10))) {
    year = parseInt(yearParam, 10);
  } else {
    year = new Date().getFullYear();
  }

  try {
    const monthlyTotals: MonthlyTotal[] = [];

    let accumulatedTotalCapitalSoles = 0;
    let accumulatedTotalCapitalDolares = 0;
    let accumulatedTotalInteres = 0;
    let accumulatedTotalCobroTotal = 0;
    let accumulatedTotalTc = 0;
    let accumulatedTotalPotencial = 0;
    let accumulatedTotalIgv = 0;
    let accumulatedTotalRendimiento = 0;
    let accumulatedTotalGanancia = 0;
    let accumulatedTotalDetraccion = 0;
    let totalDaysAccumulated = 0;
    let totalRateAccumulated = 0;
    let totalPrestamosAccumulated = 0;

    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      const prestamos = await prisma.prestamoOperacion.findMany({
        where: {
          devolucion: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      let totalCapitalSoles = 0;
      let totalCapitalDolares = 0;
      let totalInteres = 0;
      let totalCobroTotal = 0;
      let totalTc = 0;
      let totalPotencial = 0;
      let totalIgv = 0;
      let totalRendimiento = 0;
      let totalGanancia = 0;
      let totalDetraccion = 0;
      let sumOfDays = 0;
      let sumOfRates = 0;

      prestamos.forEach((prestamo) => {
        const capitalSoles = prestamo.capital_soles?.toNumber() || 0;
        const capitalDolares = prestamo.capital_dolares?.toNumber() || 0;
        const interes = prestamo.interes.toNumber();
        const cobroTotal = prestamo.cobroTotal.toNumber();
        const tc = prestamo.tc.toNumber();
        const potencial = prestamo.potencial.toNumber();
        const igv = prestamo.igv.toNumber();
        const rendimiento = prestamo.rendimiento.toNumber();
        const ganancia = prestamo.ganancia.toNumber();
        const detraccion = prestamo.detraccion.toNumber();

        totalCapitalSoles += capitalSoles;
        totalCapitalDolares += capitalDolares;
        totalInteres += interes;
        totalCobroTotal += cobroTotal;
        totalTc += tc;
        totalPotencial += potencial;
        totalIgv += igv;
        totalRendimiento += rendimiento;
        totalGanancia += ganancia;
        totalDetraccion += detraccion;
        sumOfDays += prestamo.dias;
        sumOfRates += prestamo.tasa;
      });

      const monthName = new Intl.DateTimeFormat("es-PE", { month: "long" }).format(startDate);

      monthlyTotals.push({
        fecha: `${monthName} ${year}`,
        totalCapitalSoles,
        totalCapitalDolares,
        totalInteres,
        totalCobroTotal,
        totalTc,
        totalPotencial,
        totalIgv,
        totalRendimiento,
        totalGanancia,
        totalDetraccion,
        promedioDias: null,
        promedioTasa: null,
      });

      accumulatedTotalCapitalSoles += totalCapitalSoles;
      accumulatedTotalCapitalDolares += totalCapitalDolares;
      accumulatedTotalInteres += totalInteres;
      accumulatedTotalCobroTotal += totalCobroTotal;
      accumulatedTotalTc += totalTc;
      accumulatedTotalPotencial += totalPotencial;
      accumulatedTotalIgv += totalIgv;
      accumulatedTotalRendimiento += totalRendimiento;
      accumulatedTotalGanancia += totalGanancia;
      accumulatedTotalDetraccion += totalDetraccion;
      totalDaysAccumulated += sumOfDays;
      totalRateAccumulated += sumOfRates;
      totalPrestamosAccumulated += prestamos.length;
    }

    const accumulatedPromedioDias =
      totalPrestamosAccumulated > 0 ? totalDaysAccumulated / totalPrestamosAccumulated : null;
    const accumulatedPromedioTasa =
      totalPrestamosAccumulated > 0 ? totalRateAccumulated / totalPrestamosAccumulated : null;

    const accumulatedObject = {
      fecha: `Acumulado ${year}`,
      totalCapitalSoles: accumulatedTotalCapitalSoles,
      totalCapitalDolares: accumulatedTotalCapitalDolares,
      totalInteres: accumulatedTotalInteres,
      totalCobroTotal: accumulatedTotalCobroTotal,
      totalTc: accumulatedTotalTc,
      totalPotencial: accumulatedTotalPotencial,
      totalIgv: accumulatedTotalIgv,
      totalRendimiento: accumulatedTotalRendimiento,
      totalGanancia: accumulatedTotalGanancia,
      totalDetraccion: accumulatedTotalDetraccion,
      promedioDias:
        accumulatedPromedioDias !== null ? parseFloat(accumulatedPromedioDias.toFixed(2)) : null,
      promedioTasa:
        accumulatedPromedioTasa !== null ? parseFloat(accumulatedPromedioTasa.toFixed(4)) : null,
    };

    return [...monthlyTotals, accumulatedObject];
  } catch (error) {
    console.error(`Error fetching monthly totals for year ${year} with accumulated:`, error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function obtenerPrestamosAnulados(req: any, res: any) {
  try {
    const id = req.params.id;

    const prestamoAnulados = await prisma.prestamoAnulados.findMany({
      where: {
        prestamoId: Number(id),
      },
    });

    return res.status(200).json(prestamoAnulados);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener prestamos anulados" });
  } finally {
    await prisma.$disconnect();
  }
}
