import * as XLSX from "xlsx";
import { Request, Response } from "express";
import prisma from "../../config/database";
import { guardarError } from "../../logic/guardarErrores";

function parseDateFromDDMMYYYY(dateStr: string): Date {
  // const [day, month, year] = dateStr.split('/').map(Number);
  // return new Date(year, month - 1, day);

  // Caso 1: Si viene como string tipo "DD/MM/YYYY"
  if (typeof dateStr === "string" && dateStr.includes("/")) {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  }

  // Caso 2: Si viene como número tipo Excel
  if (!isNaN(Number(dateStr))) {
    const excelBaseDate = new Date(Date.UTC(1899, 11, 30));
    const fechaReal = new Date(excelBaseDate.getTime() + Number(dateStr) * 86400 * 1000);
    return fechaReal;
  }

  throw new Error("Formato de fecha no reconocido");
}

export const registrarGasto = async (req: any, res: any) => {
  try {
    const {
      fecha,
      descripcion,
      monto,
      referencia,
      tipoMoneda,
      clase,
      concepto,
      tipoGasto,
      isRecopilado,
    } = req.body;

    const fechaRegistro = new Date(fecha);
    const mesRegistro = fechaRegistro.getMonth() + 1; // Los meses en JavaScript son 0-indexados
    const anioRegistro = fechaRegistro.getFullYear();

    const nuevoGasto = await prisma.gasto.create({
      data: {
        fecha: parseDateFromDDMMYYYY(fecha),
        descripcion,
        monto: parseFloat(monto),
        referencia,
        tipoMoneda,
        clase: clase || null,
        concepto: concepto || null,
        tipoGasto,
        isRecopilado: Boolean(isRecopilado),
      },
    });

    if (Boolean(isRecopilado)) {
      console.log("SE CREA EL RECOPILADO");
      const recopilado = await prisma.recopiladoGastos.create({
        data: {
          nombre: String(concepto),
          precio: parseFloat(monto),
          mes: mesRegistro,
          anio: anioRegistro,
          gasto: {
            connect: {
              id: nuevoGasto.id,
            },
          },
          tipo_gasto: tipoGasto,
        },
      });
      res.status(201).json({ nuevoGasto, recopilado });
    } else {
      res.status(201).json(nuevoGasto);
    }
  } catch (error: any) {
    console.error("Error al registrar gasto:", error);

    // Manejo específico de errores de Prisma
    if (error.code) {
      switch (error.code) {
        case "P2002": // Unique constraint failed
          return res.status(400).json({
            message: "Ya existe un gasto con esa referencia. No se permiten duplicados.",
          });
        case "P2003": // Foreign key constraint failed
          return res.status(400).json({
            message:
              "Error de referencia: uno de los campos relacionados no existe en la base de datos.",
          });
        case "P2025": // Record not found
          return res.status(404).json({
            message: "No se encontró el registro necesario para completar esta operación.",
          });
        case "P2011": // Null constraint violation
          return res.status(400).json({
            message: "Datos incompletos: falta información obligatoria para registrar el gasto.",
          });
        default:
          // Para otros errores de Prisma
          return res.status(500).json({
            message: `Error en la base de datos: ${
              error.message || "Error al procesar la solicitud"
            }`,
          });
      }
    }

    // Para errores de validación
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Datos inválidos: por favor verifique la información proporcionada.",
        detalles: error.message,
      });
    }

    // Para errores de fecha
    if (error.message && error.message.includes("Invalid Date")) {
      return res.status(400).json({
        message: "Formato de fecha inválido. Utilice el formato DD/MM/YYYY.",
      });
    }

    // Error genérico como último recurso
    res.status(500).json({
      message: "Error interno al registrar el gasto. Por favor, inténtelo de nuevo más tarde.",
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const editarGasto = async (req: any, res: any) => {
  const { id } = req.params;
  const {
    fecha,
    descripcion,
    monto,
    referencia,
    tipoMoneda,
    clase,
    concepto,
    tipoGasto,
    isRecopilado,
  } = req.body;

  try {
    const gastoExistente = await prisma.gasto.findUnique({
      where: { id: parseInt(id) },
    });

    if (!gastoExistente) {
      return res.status(404).json({ message: "Gasto no encontrado" });
    }

    const gastoActualizado = await prisma.gasto.update({
      where: { id: parseInt(id) },
      data: {
        fecha: parseDateFromDDMMYYYY(fecha) ? parseDateFromDDMMYYYY(fecha) : gastoExistente.fecha,
        descripcion: descripcion ?? gastoExistente.descripcion,
        monto: monto !== undefined ? parseFloat(monto) : gastoExistente.monto,
        referencia: referencia ?? gastoExistente.referencia,
        tipoMoneda: tipoMoneda ?? gastoExistente.tipoMoneda,
        clase: clase !== undefined ? clase : gastoExistente.clase,
        concepto: concepto !== undefined ? concepto : gastoExistente.concepto,
        tipoGasto: tipoGasto ?? gastoExistente.tipoGasto,
        isRecopilado,
      },
    });
    console.log("RECOPILADO", isRecopilado);
    console.log("ANTERIOR", gastoExistente.isRecopilado);

    if (Boolean(isRecopilado) !== Boolean(gastoExistente.isRecopilado)) {
      const [day, month, year] = fecha.split("/").map(Number);
      console.log(day, month, year);
      if (isRecopilado) {
        console.log("CREANDO RECOPILADO GASTO");
        const recopilado = await prisma.recopiladoGastos.create({
          data: {
            nombre: String(concepto),
            precio: parseFloat(monto),
            mes: month,
            anio: year,
            gasto: {
              connect: {
                id: gastoActualizado.id,
              },
            },
            tipo_gasto: tipoGasto,
          },
        });
        console.log(recopilado);
      } else {
        console.log("BORRANDO RECOPILADO GASTO");

        const reco = await prisma.recopiladoGastos.findMany({
          where: {
            gastoId: gastoActualizado.id,
          },
        });

        if (!reco) {
          return res.status(404).json({ error: "No se encontró el gasto recopilado para borrar" });
        }

        const recopiladoBorrado = await prisma.recopiladoGastos.delete({
          where: {
            gastoId: gastoActualizado.id,
          },
        });
        console.log("BORRADO", recopiladoBorrado);
      }
    }

    res.json(gastoActualizado);
  } catch (error) {
    console.error("Error al editar gasto:", error);
    res.status(500).json({ message: "Error interno al editar el gasto." });
  }
};

export const obtenerGastos = async (req: any, res: any) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  console.log("QUERYS: ", req.query);

  const search = (req.query.search as string)?.trim() || "";
  const tipoGasto = (req.query.tipoGasto as string)?.trim() || "";
  const tipoMoneda = (req.query.tipoMoneda as string)?.trim() || "";

  const skip = (page - 1) * limit;
  const searchLower = search.toLowerCase();

  const whereConditions: any = {
    OR: [
      { referencia: { contains: searchLower } },
      { descripcion: { contains: searchLower } },
      { clase: { contains: searchLower } },
      { concepto: { contains: searchLower } },
    ],
  };

  if (tipoGasto) {
    whereConditions.tipoGasto = {
      equals: tipoGasto.toUpperCase(),
    };
  }

  if (tipoMoneda) {
    whereConditions.tipoMoneda = {
      equals: tipoMoneda,
    };
  }

  try {
    const [gastos, total] = await Promise.all([
      prisma.gasto.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy: {
          fecha: "desc",
        },
      }),

      prisma.gasto.count({ where: whereConditions }),
    ]);

    res.json({
      data: gastos,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: `Error al obtener gastos. ${error}` });
  }
};

export const eliminarGasto = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const gastoBuscado = await prisma.gasto.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!gastoBuscado) {
      return res.status(404).json({
        message: "No existe ese gasto actualmente",
      });
    }

    const gasto = await prisma.gasto.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      message: "Se ha eliminado correctamente el gasto",
      gasto,
    });
  } catch (err) {
    guardarError(err as string);
    console.log(err);
    return res.status(500).json({
      message: "Error interno en el servidor",
    });
  } finally {
    await prisma.$disconnect();
  }
};

/*************************** EXPORT A EXCEL */
export const exportarGastosExcel = async (req: any, res: any) => {
  try {
    const { tipo } = req.params;

    const whereCondition = tipo.toLowerCase() === "todos" ? {} : { tipoGasto: tipo.toUpperCase() };

    const gastos = await prisma.gasto.findMany({
      where: whereCondition,
    });

    const headers = [
      "Fecha",
      "Descripción",
      "Monto",
      "Referencia",
      "Tipo Moneda",
      "Clase",
      "Concepto",
      "Tipo de Gasto",
    ];

    const rows = gastos.map((g) => [
      g.fecha.toISOString().split("T")[0],
      g.descripcion,
      g.monto.toString(),
      g.referencia ?? "",
      g.tipoMoneda,
      g.clase ?? "",
      g.concepto ?? "",
      g.tipoGasto,
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Gastos");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=gastos.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (error) {
    console.error("Error exportando gastos:", error);
    res.status(500).json({ message: "Error exportando gastos" });
  }
};

/******* CUADRO GENERAL *********** */

export async function getCuadreGastos(req: Request, res: Response): Promise<any | undefined> {
  let year: number;
  const yearParam = req.query.year;

  if (yearParam && typeof yearParam === "string" && !isNaN(parseInt(yearParam, 10))) {
    year = parseInt(yearParam, 10);
  } else {
    year = new Date().getFullYear();
  }

  const meses = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
  const tipoGastos = [
    "MANTENIMIENTO",
    "FUNCIONAMIENTO",
    "PERSONAL",
    "DIVERSOS_OPERATIVOS",
    "IMPUESTOS",
    "INTERESES_RENTA_SEGUNDA",
    "OVERNIGHT_BCP",
    "ITF",
    "PRESTAMOS_SIN_INTERES",
  ];
  const monedas = ["PEN", "USD"];

  const acumulado: Record<string, number> = {};

  const resultado = [];

  for (const mesFecha of meses) {
    const mes = mesFecha.getMonth();
    const startDate = new Date(year, mes, 1);
    const endDate = new Date(year, mes + 1, 0, 23, 59, 59, 999);
    const nombreMes = new Intl.DateTimeFormat("es-PE", { month: "long" }).format(startDate);

    const gastos = await prisma.gasto.findMany({
      where: {
        fecha: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const resumenMes: Record<string, number | string> = {
      mes: `${nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)} ${year}`,
    };

    tipoGastos.forEach((tipo) => {
      monedas.forEach((moneda) => {
        const key = `${tipo}_${moneda === "PEN" ? "SOLES" : "DOLARES"}`;
        const total = gastos
          .filter((g) => g.tipoGasto === tipo && g.tipoMoneda === moneda)
          .reduce((acc, g) => acc + parseFloat(g.monto.toString()), 0);
        resumenMes[key] = -total;
        acumulado[key] = (acumulado[key] || 0) - total;
      });
    });

    resultado.push(resumenMes);
  }

  const acumuladoRow: Record<string, number | string> = { mes: `Acumulado ${year}` };
  tipoGastos.forEach((tipo) => {
    monedas.forEach((moneda) => {
      const key = `${tipo}_${moneda === "PEN" ? "SOLES" : "DOLARES"}`;
      acumuladoRow[key] = acumulado[key] || 0;
    });
  });

  resultado.push(acumuladoRow);

  res.status(200).json(resultado);
}

/*********** FUNCIONES PARA FLUJO ******************** */
export async function obtenerImpuestosAnualesSoles(
  anio: number
): Promise<{ [mes: string]: number }> {
  const impuestosMensuales: { [mes: string]: number } = {
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

  const gastosImpuestos = await prisma.gasto.findMany({
    where: {
      fecha: {
        gte: new Date(anio, 0, 1),
        lt: new Date(anio + 1, 0, 1),
      },
      tipoGasto: "IMPUESTOS",
      tipoMoneda: "PEN",
    },
  });

  gastosImpuestos.forEach((gasto) => {
    const mes = new Intl.DateTimeFormat("en-US", { month: "long" })
      .format(gasto.fecha)
      .toLowerCase();
    impuestosMensuales[mes] += gasto.monto.toNumber();
  });

  return impuestosMensuales;
}
