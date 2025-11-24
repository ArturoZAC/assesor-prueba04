import { EstatusPrestamo, Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { endOfMonth, startOfMonth } from "date-fns";
import { calcularDetraccionLeasing } from "../../logic/leasing/calcularDetraccionLeasing";
// import { calcularLeasingFacturaBoleta } from "../../logic/leasing/calcularLeasingFacturaBoleta";
import { MonthlyTotal } from "interfaces/leasing.interface";
import * as XLSX from "xlsx";
import prisma from "../../config/database";

export async function registrarLeasing(req: Request, res: Response): Promise<any | undefined> {
  const {
    codSer,
    numero,
    precio,
    fecha_inicial,
    fecha_final,
    dias,
    cobroTotal,
    usuarioId,
    tc,
    factura,
    tipo,
    codigoFacturaBoleta,
  } = req.body;

  const potencial = cobroTotal * tc;
  const rendimiento = potencial / 1.18;
  const resultadoIGV = rendimiento * 0.18;
  const detraccion = calcularDetraccionLeasing(potencial, tipo);

  try {
    const ultimoLeasing = await prisma.leasingOperacion.findFirst({
      orderBy: {
        numero_actual: "desc",
      },
    });

    let nuevoId = 253;
    if (ultimoLeasing?.numero_actual) {
      console.log("Ultimo Leasing", ultimoLeasing.numero_actual);
      nuevoId = ultimoLeasing.numero_actual + 253;
    }
    const numeroFormateado = `LPA-${nuevoId.toString().padStart(3, "0")}`;

    // const codigoFacturaBoleta = calcularLeasingFacturaBoleta(nuevoId, tipo)

    /** ------------------------------------------------- */

    const leasing = await prisma.leasingOperacion.create({
      data: {
        codSer,
        fecha_final: new Date(fecha_final),
        fecha_inicial: new Date(fecha_inicial),
        igv: resultadoIGV,
        usuarioId,
        dias,
        cobroTotal: cobroTotal,
        detraccion,
        potencial,
        rendimiento,
        numero,
        tc,
        numero_actual: Number(ultimoLeasing?.numero_actual ?? 0) + 1,
        codigoFacturaBoleta,
        factura,
        numero_leasing: numeroFormateado,
        precio: Number(precio),
        tipo,
      },
    });

    return res.status(201).json({
      message: "Operación registrado correctamente",
      leasing,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar leasing" });
  }
}

export async function obtenerLeasings(req: any, res: any): Promise<any | undefined> {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const search = (req.query.search as string)?.trim() || "";
    const fecha = (req.query.fecha as string)?.trim() || "";
    const estadoParam = (req.query.estado as string)?.trim();

    const whereConditions: Prisma.LeasingOperacionWhereInput = {};
    whereConditions.usuario = {
      rol_id: 3,
    };

    if (search) {
      const searchLower = search.toLowerCase();
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

        whereConditions.fecha_inicial = {
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

    const [prestamos, total] = await prisma.$transaction([
      prisma.leasingOperacion.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: whereConditions,
        include: {
          usuario: true,
          leasingAnulados: true,
        },
        orderBy: {
          fecha_final: "desc",
        },
      }),
      prisma.leasingOperacion.count(),
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

export async function obtenerLeasingAnulados(req: any, res: any) {
  try {
    const id = req.params.id;

    const prestamoAnulados = await prisma.leasingAnulados.findMany({
      where: {
        leasingId: Number(id),
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

export async function editarLeasing(req: Request, res: Response): Promise<any | undefined> {
  const { id } = req.params;
  const {
    codSer,
    numero,
    precio,
    fecha_inicial,
    fecha_final,
    dias,
    cobroTotal,
    usuarioId,
    tc,
    factura,
    tipo,
    documento,
    estatus,
    codigoFacturaBoleta,
    codigoFacturaBoletaAnulado,
  } = req.body;

  const potencial = cobroTotal * tc;
  const rendimiento = potencial / 1.18;
  const resultadoIGV = rendimiento * 0.18;
  const detraccion = calcularDetraccionLeasing(potencial, tipo);

  try {
    const usuario = await prisma.usuario.findFirst({
      where: {
        documento: documento,
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const leasingBuscado = await prisma.leasingOperacion.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!leasingBuscado) {
      return res.status(404).json({ error: "Leasing no encontrado" });
    }

    if (factura === "ANULADO" || factura === "NOTA DE CREDITO") {
      const leasing = await prisma.leasingOperacion.update({
        where: {
          id: Number(id),
        },
        data: {
          codSer,
          fecha_final: new Date(fecha_final),
          fecha_inicial: new Date(fecha_inicial),
          igv: resultadoIGV,
          usuarioId,
          dias,
          cobroTotal: cobroTotal,
          detraccion,
          potencial,
          rendimiento,
          numero,
          tc,
          factura: "",
          precio: Number(precio),
          tipo,
          estatus,
          codigoFacturaBoleta,
        },
      });

      const prestamoAnulados = await prisma.leasingAnulados.create({
        data: {
          codigoFacturaBoleta: codigoFacturaBoletaAnulado,
          factura,
          leasing: {
            connect: {
              id: Number(leasingBuscado.id),
            },
          },
        },
      });

      return res.status(200).json({
        message: "Leasing editado correctamente",
        leasing,
        prestamoAnulados,
      });
    }

    const leasing = await prisma.leasingOperacion.update({
      where: {
        id: Number(id),
      },
      data: {
        codSer,
        fecha_final: new Date(fecha_final),
        fecha_inicial: new Date(fecha_inicial),
        igv: resultadoIGV,
        usuarioId,
        dias,
        cobroTotal: cobroTotal,
        detraccion,
        potencial,
        rendimiento,
        numero,
        tc,
        factura,
        precio: Number(precio),
        tipo,
        estatus,
        codigoFacturaBoleta,
      },
    });
    /*
    let codigoFacturaBoleta = ''
    if (tipo !== leasingBuscado.tipo) {
      console.log('cambio de tipo')
      codigoFacturaBoleta = calcularLeasingFacturaBoleta(leasingBuscado ? leasingBuscado.id + 253  : 1, tipo)
      prisma.leasingOperacion.update({
        where: {
          id: Number(id)
        },
        data: {
          codigoFacturaBoleta
        }
      })
    }
    */
    return res.status(200).json({
      message: "Se ha editado correctamente",
      leasing,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Ha ocurrido un error en su registro",
    });
  }
}

// export async function obtenerLeasingCaclulo(req: Request, res: Response): Promise<any | undefined> {
//   // console.log(new Date("2025-09-01 00:00:00"));
//   let year: number;
//   const yearParam = req.query.year;

//   if (yearParam && typeof yearParam === "string" && !isNaN(parseInt(yearParam, 10))) {
//     year = parseInt(yearParam, 10);
//   } else {
//     year = new Date().getFullYear();
//   }

//   try {
//     const monthlyTotals: MonthlyTotal[] = [];
//     let accumulatedCobroTotal = 0;
//     let accumulatedTc = 0;
//     let accumulatedPotencial = 0;
//     let accumulatedIgv = 0;
//     let accumulatedRendimiento = 0;
//     let accumulatedGanancia = 0;

//     for (let month = 1; month <= 12; month++) {
//       // const startDate = new Date(year, month - 1, 1);
//       // const endDate = new Date(year, month, 0, 23, 59, 59, 999);

//       // const leasingOperaciones = await prisma.leasingOperacion.findMany({
//       //   where: {
//       //     fecha_inicial: {
//       //       gte: startDate,
//       //       lte: endDate,
//       //     },
//       //   },
//       // });

//       //Problema con la zona horaria UTC-5 Perú

//       const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
//       const endDate = new Date(Date.UTC(year, month, 1, 0, 0, 0));

//       const leasingOperaciones = await prisma.leasingOperacion.findMany({
//         where: {
//           fecha_inicial: {
//             gte: startDate,
//             lte: endDate,
//             lt: endDate,
//           },
//         },
//       });

//       // if (month === 9) {
//       //   console.log("Mes - Enero");
//       //   leasingOperaciones.forEach((leasing) => {
//       //     console.log(leasing);
//       //   });
//       // }

//       let cobroTotal = 0;
//       let tc = 0;
//       let potencial = 0;
//       let igv = 0;
//       let rendimiento = 0;
//       let ganancia = 0;
//       let hasNonZeroTotal = false;

//       leasingOperaciones.forEach((operacion) => {
//         const gananciaCalculada = operacion.rendimiento.toNumber() - operacion.igv.toNumber();

//         cobroTotal += operacion.cobroTotal.toNumber();
//         tc += operacion.tc.toNumber();
//         potencial += operacion.potencial.toNumber();
//         igv += operacion.igv.toNumber();
//         rendimiento += operacion.rendimiento.toNumber();
//         ganancia += gananciaCalculada;

//         if (
//           cobroTotal !== 0 ||
//           tc !== 0 ||
//           potencial !== 0 ||
//           igv !== 0 ||
//           rendimiento !== 0 ||
//           ganancia !== 0
//         ) {
//           hasNonZeroTotal = true;
//         }
//       });

//       // const monthName = new Intl.DateTimeFormat("es-PE", { month: "long" }).format(startDate);
//       const displayDate = new Date(year, month - 1, 1);
//       const monthName = new Intl.DateTimeFormat("es-PE", { month: "long" }).format(displayDate);

//       if (hasNonZeroTotal) {
//         monthlyTotals.push({
//           fecha: `${monthName} ${year}`,
//           cobroTotal,
//           tc,
//           potencial,
//           igv,
//           rendimiento,
//           ganancia,
//         });
//       }

//       accumulatedCobroTotal += cobroTotal;
//       accumulatedTc += tc;
//       accumulatedPotencial += potencial;
//       accumulatedIgv += igv;
//       accumulatedRendimiento += rendimiento;
//       accumulatedGanancia += ganancia;
//     }

//     const accumulatedObject = {
//       fecha: `Acumulado ${year}`,
//       cobroTotal: accumulatedCobroTotal,
//       tc: accumulatedTc,
//       potencial: accumulatedPotencial,
//       igv: accumulatedIgv,
//       rendimiento: accumulatedRendimiento,
//       ganancia: accumulatedGanancia,
//     };

//     // console.log({
//     //   data: [...monthlyTotals, accumulatedObject],
//     // });

//     res.status(200).json([...monthlyTotals, accumulatedObject]);
//   } catch (error) {
//     console.error(`Error fetching leasing totals for year ${year} with accumulated:`, error);
//     res.status(500).json({
//       error: `Failed to fetch leasing totals for year ${year} with accumulated`,
//     });
//   } finally {
//     await prisma.$disconnect();
//   }
// }

//*Metodo implementando la correcion del TC 23-11-2025
export async function obtenerLeasingCaclulo(req: Request, res: Response): Promise<any | undefined> {
  let year: number;
  const yearParam = req.query.year;

  if (yearParam && typeof yearParam === "string" && !isNaN(parseInt(yearParam, 10))) {
    year = parseInt(yearParam, 10);
  } else {
    year = new Date().getFullYear();
  }

  try {
    const monthlyTotals: MonthlyTotal[] = [];

    let accumulatedCobroTotal = 0;
    let accumulatedPotencial = 0;
    let accumulatedIgv = 0;
    let accumulatedRendimiento = 0;
    let accumulatedGanancia = 0;

    let accumulatedSumaTcNoCero = 0;
    let accumulatedCantidadTcNoCero = 0;

    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
      const endDate = new Date(Date.UTC(year, month, 1, 0, 0, 0));

      const leasingOperaciones = await prisma.leasingOperacion.findMany({
        where: {
          fecha_inicial: {
            gte: startDate,
            lt: endDate,
          },
        },
      });

      let cobroTotal = 0;
      let potencial = 0;
      let igv = 0;
      let rendimiento = 0;
      let ganancia = 0;
      let hasNonZeroTotal = false;

      let sumaTcNoCero = 0;
      let cantidadTcNoCero = 0;

      leasingOperaciones.forEach((operacion) => {
        const cobro = operacion.cobroTotal.toNumber();
        const tcValor = operacion.tc.toNumber();
        const potencialValor = operacion.potencial.toNumber();
        const igvValor = operacion.igv.toNumber();
        const rendimientoValor = operacion.rendimiento.toNumber();
        const gananciaCalculada = rendimientoValor - igvValor;

        if (tcValor !== 0) {
          sumaTcNoCero += tcValor;
          cantidadTcNoCero++;
        }

        cobroTotal += cobro;
        potencial += potencialValor;
        igv += igvValor;
        rendimiento += rendimientoValor;
        ganancia += gananciaCalculada;

        if (
          cobro !== 0 ||
          tcValor !== 0 ||
          potencialValor !== 0 ||
          igvValor !== 0 ||
          rendimientoValor !== 0 ||
          gananciaCalculada !== 0
        ) {
          hasNonZeroTotal = true;
        }
      });

      const displayDate = new Date(year, month - 1, 1);
      const monthName = new Intl.DateTimeFormat("es-PE", { month: "long" }).format(displayDate);

      const promedioTc = cantidadTcNoCero > 0 ? sumaTcNoCero / cantidadTcNoCero : 0;

      if (hasNonZeroTotal) {
        monthlyTotals.push({
          fecha: `${monthName} ${year}`,
          cobroTotal,
          tc: promedioTc,
          potencial,
          igv,
          rendimiento,
          ganancia,
        });
      }

      if (cantidadTcNoCero > 0) {
        accumulatedSumaTcNoCero += sumaTcNoCero;
        accumulatedCantidadTcNoCero += cantidadTcNoCero;
      }

      accumulatedCobroTotal += cobroTotal;
      accumulatedPotencial += potencial;
      accumulatedIgv += igv;
      accumulatedRendimiento += rendimiento;
      accumulatedGanancia += ganancia;
    }

    const accumulatedTc =
      accumulatedCantidadTcNoCero > 0 ? accumulatedSumaTcNoCero / accumulatedCantidadTcNoCero : 0;

    const accumulatedObject = {
      fecha: `Acumulado ${year}`,
      cobroTotal: accumulatedCobroTotal,
      tc: accumulatedTc, // TC acumulado real
      potencial: accumulatedPotencial,
      igv: accumulatedIgv,
      rendimiento: accumulatedRendimiento,
      ganancia: accumulatedGanancia,
    };

    return res.status(200).json([...monthlyTotals, accumulatedObject]);
  } catch (error) {
    console.error(`Error fetching leasing totals for year ${year} with accumulated:`, error);
    return res.status(500).json({
      error: `Failed to fetch leasing totals for year ${year} with accumulated`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

export const exportarLeasingExcel = async (req: Request, res: Response) => {
  try {
    const { nombre, fecha, estado } = req.body;

    const whereConditions: Prisma.LeasingOperacionWhereInput = {};

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

        whereConditions.createdAt = {
          gte: startDate,
          lte: endDate,
        };
      }
    }

    if (estado) {
      const estadoValido = Object.values(EstatusPrestamo).includes(estado as EstatusPrestamo);
      if (estadoValido) {
        whereConditions.estatus = {
          equals: estado as EstatusPrestamo,
        };
      }
    }

    // Obtiene las operaciones de leasing de la base de datos, incluyendo la información relacionada del usuario.
    const operacionesLeasing = await prisma.leasingOperacion.findMany({
      where: whereConditions,
      include: {
        usuario: true, // Incluye la información del usuario que realizó la operación de leasing.
      },
    });

    // Define las cabeceras de las columnas del archivo Excel. Estos son los nombres de las columnas.
    const headers = [
      "ID",
      "Número Leasing",
      "Cliente/Titular",
      "Tipo Documento",
      "Documento",
      "CodSer",
      "Número",
      "Precio",
      "Fecha Inicial",
      "Fecha Final",
      "Días",
      "Tipo",
      "Estatus",
      "Cobro Total",
      "TC",
      "Potencial",
      "IGV",
      "Rendimiento",
      "Detracción",
      "Código Factura/Boleta",
      "Descripción",
      "Factura",
      "Fecha de Creación",
      "Fecha de Actualización",
    ];

    // Mapea los datos de las operaciones de leasing obtenidos de la base de datos a un formato de array de arrays,
    // donde cada inner array representa una fila en el archivo Excel.
    const rows = operacionesLeasing.map((operacion) => [
      operacion.id,
      operacion.numero_leasing ?? "",
      `${operacion.usuario.nombres} ${operacion.usuario.apellido_paterno} ${operacion.usuario.apellido_materno}`,
      operacion.usuario.tipo_documento,
      operacion.usuario.documento,
      operacion.codSer,
      operacion.numero,
      operacion.precio.toNumber(),
      operacion.fecha_inicial,
      operacion.fecha_final,
      operacion.dias,
      operacion.tipo,
      operacion.estatus,
      operacion.cobroTotal.toNumber(),
      operacion.tc.toNumber(),
      operacion.potencial.toNumber(),
      operacion.igv.toNumber(),
      operacion.rendimiento.toNumber(),
      operacion.detraccion.toNumber(),
      operacion.codigoFacturaBoleta ?? "",
      operacion.descripcion ?? "",
      operacion.factura ?? "",
      operacion.createdAt.toISOString(),
      operacion.updatedAt.toISOString(),
    ]);

    // Crea una nueva hoja de cálculo de Excel a partir de los headers y las filas de datos.
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    // Crea un nuevo libro de Excel y añade la hoja de cálculo.
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LeasingOperaciones");

    // Convierte el libro de Excel a un buffer (datos binarios).
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Establece las cabeceras de la respuesta HTTP para indicar que se está enviando un archivo Excel.
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=leasing_operaciones.xlsx" // Nombre del archivo que se descargará.
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // Tipo MIME para archivos Excel.
    );

    // Envía el buffer con los datos del Excel como respuesta.
    res.send(buffer);
  } catch (error) {
    // Captura cualquier error que ocurra durante el proceso y envía una respuesta de error al cliente.
    console.error("Error al exportar a Excel:", error);
    res.status(500).json({ message: "Error al exportar a Excel" });
  }
};

/*************************************** EXPORTAR DATA  PARA FLUJO */

export async function obtenerLeasingCacluloFLUJO(yearParam: string): Promise<any | undefined> {
  let year: number;

  if (yearParam && typeof yearParam === "string" && !isNaN(parseInt(yearParam, 10))) {
    year = parseInt(yearParam, 10);
  } else {
    year = new Date().getFullYear();
  }

  try {
    const monthlyTotals: MonthlyTotal[] = [];
    let accumulatedCobroTotal = 0;
    let accumulatedTc = 0;
    let accumulatedPotencial = 0;
    let accumulatedIgv = 0;
    let accumulatedRendimiento = 0;
    let accumulatedGanancia = 0;

    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      endDate.setHours(23, 59, 59, 999);

      const leasingOperaciones = await prisma.leasingOperacion.findMany({
        where: {
          fecha_final: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      let cobroTotal = 0;
      let tc = 0;
      let potencial = 0;
      let igv = 0;
      let rendimiento = 0;
      let ganancia = 0;

      leasingOperaciones.forEach((operacion) => {
        const gananciaCalculada = operacion.rendimiento.toNumber() - operacion.igv.toNumber();

        cobroTotal += operacion.cobroTotal.toNumber();
        tc += operacion.tc.toNumber();
        potencial += operacion.potencial.toNumber();
        igv += operacion.igv.toNumber();
        rendimiento += operacion.rendimiento.toNumber();
        ganancia += gananciaCalculada;
      });

      const monthName = new Intl.DateTimeFormat("es-PE", { month: "long" }).format(startDate);

      monthlyTotals.push({
        fecha: `${monthName} ${year}`,
        cobroTotal,
        tc,
        potencial,
        igv,
        rendimiento,
        ganancia,
      });

      accumulatedCobroTotal += cobroTotal;
      accumulatedTc += tc;
      accumulatedPotencial += potencial;
      accumulatedIgv += igv;
      accumulatedRendimiento += rendimiento;
      accumulatedGanancia += ganancia;
    }

    const accumulatedObject = {
      fecha: `Acumulado ${year}`,
      cobroTotal: accumulatedCobroTotal,
      tc: accumulatedTc,
      potencial: accumulatedPotencial,
      igv: accumulatedIgv,
      rendimiento: accumulatedRendimiento,
      ganancia: accumulatedGanancia,
    };

    return [...monthlyTotals, accumulatedObject];
  } catch (error) {
    console.error(`Error fetching leasing totals for year ${year} with accumulated:`, error);
  } finally {
    await prisma.$disconnect();
  }
}
