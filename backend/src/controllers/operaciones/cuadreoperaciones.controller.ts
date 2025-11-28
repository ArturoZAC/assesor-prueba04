import prisma from "../../config/database";
import { startOfMonth, endOfMonth } from "date-fns";
import * as XLSX from "xlsx";

function parseDateFromDDMMYYYY(dateStr: string): Date {
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
}

export const obtenerCuadreOperaciones = async (req: any, res: any) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const search = (req.query.search as string)?.trim() || "";
  const tipo_cliente = (req.query.tipoCliente as string)?.trim() || "";
  const tipo = (req.query.tipo as string)?.trim() || "";
  const fecha = (req.query.fecha as string)?.trim() || "";

  const searchLower = search.toLowerCase();

  const whereConditions: any = {
    usuario: {
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
    },
  };

  if (tipo_cliente) {
    whereConditions.usuario.tipo_cliente = {
      contains: tipo_cliente,
    };
  }

  if (tipo) {
    whereConditions.tipo = {
      equals: tipo,
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

      whereConditions.fecha = {
        gte: startDate,
        lte: endDate,
      };
    }
  }

  try {
    const total = await prisma.operacion.count();

    const operaciones = await prisma.operacion.findMany({
      skip,
      take: limit,

      include: {
        tipoCambio: {
          omit: {
            id: true,
          },
        },
        flujoFondos: {
          omit: {
            id: true,
          },
        },
        usuario: {
          select: {
            apellido_materno: true,
            apellido_paterno: true,
            nombres: true,
          },
        },
        cuadreOperacion: {
          include: {
            CuadreOperacionDolares: true,
            CuadreOperacionSoles: true,
          },
        },
      },
      orderBy: {
        fecha: "desc",
      },

      where: whereConditions,
    });

    const resultado = await Promise.all(
      operaciones.map(async (op) => {
        if (!op.cuadreOperacion?.id) {
          return {
            ...op,
            cuadreIncompleto: true,
            cuadreCompleto: { cuadre_soles: false, cuadre_dolares: false },
          };
        }

        const sumaUsd =
          op.cuadreOperacion?.CuadreOperacionDolares?.reduce(
            (acc, val) => acc + val.monto_usd,
            0
          ) ?? 1;

        if (op.cuadreOperacion?.CuadreOperacionDolares ?? 0 > 0) {
          const cuadreDolares = op.cuadreOperacion?.CuadreOperacionDolares[0];
          if (cuadreDolares) {
            cuadreDolares.monto_usd = Number(sumaUsd.toFixed(2));
          }
        }

        const sumaPen =
          op.cuadreOperacion?.CuadreOperacionSoles?.reduce((acc, val) => acc + val.monto_pen, 0) ??
          1;

        if (op.cuadreOperacion?.CuadreOperacionSoles ?? 0 > 0) {
          const cuadreSoles = op.cuadreOperacion?.CuadreOperacionSoles[0];
          if (cuadreSoles) {
            cuadreSoles.monto_pen = Number(sumaPen.toFixed(2));
          }
        }

        const [cuadreDolares, cuadreSoles] = await Promise.all([
          prisma.cuadreOperacionDolares.findFirst({
            where: { cuadreOperacionId: op.cuadreOperacion.id },
          }),
          prisma.cuadreOperacionSoles.findFirst({
            where: { cuadreOperacionId: op.cuadreOperacion.id },
          }),
        ]);

        const [cuadreDolaresAll, cuadreSolesAll] = await Promise.all([
          prisma.cuadreOperacionDolares.findMany({
            where: { cuadreOperacionId: op.cuadreOperacion.id },
          }),
          prisma.cuadreOperacionSoles.findMany({
            where: { cuadreOperacionId: op.cuadreOperacion.id },
          }),
        ]);

        const cuadreCompleto = {
          cuadre_soles: Boolean(cuadreSoles),
          cuadre_dolares: Boolean(cuadreDolares),
        };
        const cuadreIncompleto = !(cuadreDolares || cuadreSoles);

        return {
          ...op,
          cuadreIncompleto,
          cuadreCompleto,
          cuadreDolaresAll,
          cuadreSolesAll,
        };
      })
    );

    res.json({
      data: resultado,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error al obtener operaciones:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

export const registrarCuadreOperacionDolar = async (req: any, res: any) => {
  try {
    const {
      operacionId,
      fecha_usd,
      descripcion_op_usd,
      monto_usd,
      referencia_usd,
      diferencia_usd,
    } = req.body;

    let cuadreOperacionExistente = await prisma.cuadreOperacion.findUnique({
      where: { operacionId },
    });

    if (!cuadreOperacionExistente) {
      cuadreOperacionExistente = await prisma.cuadreOperacion.create({
        data: {
          operacion: {
            connect: { id: operacionId },
          },
        },
      });
    }

    const nuevoCuadreDolar = await prisma.cuadreOperacionDolares.create({
      data: {
        cuadreOperacion: {
          connect: { id: cuadreOperacionExistente.id },
        },
        fecha_usd: parseDateFromDDMMYYYY(fecha_usd),
        descripcion_op_usd,
        monto_usd,
        referencia_usd,
        diferencia_usd,
      },
    });

    return res.status(201).json(nuevoCuadreDolar);
  } catch (error) {
    console.error("Error registrando CuadreOperacionDolar:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const editarCuadreOperacionDolar = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { fecha_usd, descripcion_op_usd, monto_usd, referencia_usd, diferencia_usd } = req.body;

    const cuadreDolarExistente = await prisma.cuadreOperacionDolares.findUnique({
      where: { id: Number(id) },
    });

    if (!cuadreDolarExistente) {
      return res.status(404).json({ error: "CuadreOperacionDolar no encontrado" });
    }

    const cuadreOperacionActualizada = await prisma.cuadreOperacionDolares.update({
      where: { id: Number(id) },
      data: {
        fecha_usd: parseDateFromDDMMYYYY(fecha_usd),
        descripcion_op_usd,
        monto_usd,
        referencia_usd,
        diferencia_usd,
      },
    });

    res.status(200).json(cuadreOperacionActualizada);
  } catch (error) {
    console.error("Error editando CuadreOperacionDolar:", error);
    res.status(500).json({ error: `Error interno del servidor, ${error}` });
  }
};

export const registrarCuadreOperacionSoles = async (req: any, res: any) => {
  try {
    const {
      operacionId,
      fecha_pen,
      descripcion_op_pen,
      monto_pen,
      referencia_pen,
      diferencia_pen,
    } = req.body;

    let cuadreOperacionExistente = await prisma.cuadreOperacion.findUnique({
      where: { operacionId },
    });

    if (!cuadreOperacionExistente) {
      cuadreOperacionExistente = await prisma.cuadreOperacion.create({
        data: {
          operacion: {
            connect: { id: operacionId },
          },
        },
      });
    }

    const nuevoCuadreSoles = await prisma.cuadreOperacionSoles.create({
      data: {
        cuadreOperacion: {
          connect: { id: cuadreOperacionExistente.id },
        },
        fecha_pen: parseDateFromDDMMYYYY(fecha_pen),
        descripcion_op_pen,
        monto_pen,
        referencia_pen,
        diferencia_pen,
      },
    });

    res.status(201).json(nuevoCuadreSoles);
  } catch (error) {
    console.error("Error registrando CuadreOperacionSoles:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const editarCuadreOperacionSoles = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { fecha_pen, descripcion_op_pen, monto_pen, referencia_pen, diferencia_pen } = req.body;

    const cuadreSolesExistente = await prisma.cuadreOperacionSoles.findUnique({
      where: { id: Number(id) },
    });

    if (!cuadreSolesExistente) {
      return res.status(404).json({ error: "CuadreOperacionSoles no encontrado" });
    }

    const cuadreOperacionActualizada = await prisma.cuadreOperacionSoles.update({
      where: { id: Number(id) },
      data: {
        fecha_pen: parseDateFromDDMMYYYY(fecha_pen),
        descripcion_op_pen,
        monto_pen,
        referencia_pen,
        diferencia_pen,
      },
    });

    res.status(200).json(cuadreOperacionActualizada);
  } catch (error) {
    console.error("Error editando CuadreOperacionSolesr:", error);
    res.status(500).json({ error: `Error interno del servidor, ${error}` });
  }
};

export const traerCuadresPorId = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const cuadreOperacion = await prisma.cuadreOperacion.findUnique({
      where: {
        operacionId: parseInt(id),
      },
      select: {
        id: true,
        created_at: true,
        updated_at: true,
        CuadreOperacionDolares: true,
        CuadreOperacionSoles: true,
      },
    });

    if (!cuadreOperacion) {
      return res.status(404).json({ error: "Cuadre no encontrado" });
    }

    res.json({ cuadreOperacion });
  } catch (error) {
    console.error("Error al obtener el cuadre:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// export const editarCuadreOperacion = async (req: any, res: any) => {
//   try {
//     const { id } = req.params;
//     const {
//       fecha_usd,
//       descripcion_op_usd,
//       monto_usd,
//       referencia_usd,
//       diferencia_usd,
//       fecha_pen,
//       descripcion_op_pen,
//       monto_pen,
//       referencia_pen,
//       diferencia_pen,
//     } = req.body;

//     const cuadreExistente = await prisma.cuadreOperacion.findUnique({
//       where: { id: Number(id) },
//     });

//     if (!cuadreExistente) {
//       return res
//         .status(404)
//         .json({ error: "Cuadre de operación no encontrado" });
//     }

//     const cuadreActualizado = await prisma.cuadreOperacion.update({
//       where: { id: Number(id) },
//       data: {
//         fecha_usd: new Date(fecha_usd),
//         descripcion_op_usd,
//         monto_usd,
//         referencia_usd,
//         diferencia_usd,
//         fecha_pen: new Date(fecha_pen),
//         descripcion_op_pen,
//         monto_pen,
//         referencia_pen,
//         diferencia_pen,
//       },
//     });

//     res.status(200).json({
//       data: cuadreActualizado,
//       message: "Cuadre de operación actualizado",
//     });
//   } catch (error) {
//     console.error("Error editando CuadreOperacion:", error);
//     res.status(500).json({ error: "Error interno del servidor" });
//   }
// };

// const operacionesConSuma = operaciones.map((op) => {
//     const sumaUsd =
//       op.cuadreOperacion?.CuadreOperacionDolares?.reduce(
//         (acc, val) => acc + val.monto_usd,
//         0
//       ) ?? 1;

//     // Modificar el monto_usd en CuadreOperacionDolares, si existe
//     if (op.cuadreOperacion?.CuadreOperacionDolares ?? 0 > 0) {
//       // Cambiar el monto_usd del primer registro
//       const cuadreDolares = op.cuadreOperacion?.CuadreOperacionDolares[0];
//       if (cuadreDolares) {
//         cuadreDolares.monto_usd = sumaUsd; // Cambiar a un valor deseado
//       }
//     }

//     return {
//       ...op,
//       suma_diferencia_usd: sumaUsd,
//     };
//   });

// export const exportarCuadreOperacionesExcel = async (req: any, res: any) => {
//   const { tipo } = req.params;
//   const whereCondition: any = tipo.toLowerCase() === "todos" ? {} : { tipo: tipo.toUpperCase() };

//   // 📆 Rango para enero 2025
//   // const fechaInicio = new Date("2025-02-01 00:00:00");
//   // const fechaFin = new Date("2025-02-28 23:59:59");

//   // ✅ Agregamos las fechas al filtro
//   // whereCondition.fecha = {
//   //   gte: fechaInicio,
//   //   lte: fechaFin,
//   // };

//   try {
//     // const totalOperaciones = await prisma.operacion.count({
//     //   where: whereCondition,
//     // });

//     // console.log(`📊 Total de operaciones en enero (${tipo}):`, totalOperaciones);
//     const operaciones = await prisma.operacion.findMany({
//       include: {
//         cuadreOperacion: {
//           include: {
//             CuadreOperacionDolares: true,
//             CuadreOperacionSoles: true,
//             operacion: {
//               include: {
//                 usuario: true,
//               },
//             },
//           },
//         },
//         flujoFondos: true,
//       },
//       where: whereCondition,
//     });

//     // if (operaciones.length === 0) {
//     //   return res.status(404).json({ message: "No hay operaciones en enero para exportar." });
//     // }

//     const fechaInicioEnero = new Date("2025-01-01 00:00:00");
//     const fechaFinEnero = new Date("2025-01-31 23:59:59");

//     const operacionesEnero = operaciones.filter((op) => {
//       const fechaOp = new Date(op.fecha);
//       return fechaOp >= fechaInicioEnero && fechaOp <= fechaFinEnero;
//     });

//     console.log(`📊 Total de operaciones de ENERO 2025: ${operacionesEnero.length}`);

//     // 🔍 Console.log para la operación con ID 273
//     const operacionCuadre273 = operaciones.find((op) => op.cuadreOperacion?.id === 273);

//     if (operacionCuadre273) {
//       console.log("🎯 Operación con cuadreOperacionId 273:");
//       console.log(JSON.stringify(operacionCuadre273, null, 2));
//     } else {
//       console.log("⚠️ No se encontró operación con cuadreOperacionId 273");
//     }

//     const headers = [
//       // Datos de la operación
//       "Fecha Operación",
//       "Número",
//       "Cliente/Titular",
//       "Tipo",
//       "Dólares",
//       "Soles",
//       // Cuadre en USD
//       "Fecha USD",
//       "Descripción USD",
//       "Monto USD",
//       "Referencia USD",
//       "Diferencia USD",
//       // Cuadre en PEN
//       "Fecha PEN",
//       "Descripción PEN",
//       "Monto PEN",
//       "Referencia PEN",
//       "Diferencia PEN",
//     ];

//     const rows: any[] = [];

//     //*Primer codigo antes de implementar la correccion del excel
//     operaciones.forEach((op) => {
//       const usdCuadres = op.cuadreOperacion?.CuadreOperacionDolares || [null];
//       const penCuadres = op.cuadreOperacion?.CuadreOperacionSoles || [null];

//       // Obtener la cantidad máxima para combinar todos los cuadres
//       const maxCuadres = Math.max(usdCuadres.length, penCuadres.length);

//       for (let i = 0; i < maxCuadres; i++) {
//         const usd: any = usdCuadres[i] || {};
//         const pen: any = penCuadres[i] || {};
//         let diferenciaUsd = 0;
//         let diferenciaPEN = 0;

//         if (op.cuadreOperacion) {
//           //*monto total -2000
//           let montoTotal =
//             op.tipo === "VENTA" ? Number(-op.dolares) : Math.abs(Number(op.dolares || 0));
//           //*montotoalsoles 7546
//           let montoTotalSoles = Number(op.flujoFondos.montoPEN || 0);

//           op.cuadreOperacion.CuadreOperacionDolares.forEach((cuadreDolares) => {
//             // console.log(montoTotal, cuadreDolares.monto_usd);
//             //* sale 0 ya que seria -2000 + -2000
//             montoTotal = Number(montoTotal) - Number(cuadreDolares.monto_usd || 0);
//           });
//           op.cuadreOperacion.CuadreOperacionSoles.forEach((cuadreSoles) => {
//             // console.log(montoTotalSoles, cuadreSoles.monto_pen);
//             //* 7546 - 7544 = 2
//             montoTotalSoles = Number(montoTotalSoles) - Number(cuadreSoles.monto_pen || 0);
//           });

//           diferenciaPEN = Number(Number(montoTotalSoles).toFixed(2));

//           diferenciaUsd = Number(Number(montoTotal).toFixed(2));

//           op.cuadreOperacion;
//         } else {
//           diferenciaPEN = Number(Number(op.flujoFondos.montoPEN).toFixed(2)) * -1;
//           diferenciaUsd = Number(Number(op.dolares).toFixed(2)) * -1;
//         }

//         rows.push([
//           // Datos de la operación
//           op.fecha.toISOString().split("T")[0],
//           op.numero,
//           op.cuadreOperacion?.operacion.usuario.cliente,
//           op.tipo,
//           op.tipo === "COMPRA" ? op.dolares : -op.dolares,
//           op.flujoFondos.montoPEN,
//           // Cuadre USD
//           usd.fecha_usd ? usd.fecha_usd.toISOString().split("T")[0] : "",
//           usd.descripcion_op_usd ?? "",
//           usd.monto_usd ?? "",
//           usd.referencia_usd ?? "",
//           diferenciaUsd,
//           // Cuadre PEN
//           pen.fecha_pen ? pen.fecha_pen.toISOString().split("T")[0] : "",
//           pen.descripcion_op_pen ?? "",
//           pen.monto_pen ?? "",
//           pen.referencia_pen ?? "",
//           diferenciaPEN,
//         ]);
//       }
//     });    // operaciones.forEach((op) => {
//     //   const usdCuadres = op.cuadreOperacion?.CuadreOperacionDolares || [null];
//     //   const penCuadres = op.cuadreOperacion?.CuadreOperacionSoles || [null];

//     //   const maxCuadres = Math.max(usdCuadres.length, penCuadres.length);

//     //   for (let i = 0; i < maxCuadres; i++) {
//     //     const usd: any = usdCuadres[i] || {};
//     //     const pen: any = penCuadres[i] || {};

//     //     // ✅ Usar las diferencias directamente de la BD
//     //     const diferenciaUsd = usd.diferencia_usd ?? 0;
//     //     const diferenciaPEN = pen.diferencia_pen ?? 0;

//     //     rows.push([
//     //       op.fecha.toISOString().split("T")[0],
//     //       op.numero,
//     //       op.cuadreOperacion?.operacion.usuario.cliente,
//     //       op.tipo,
//     //       op.tipo === "COMPRA" ? op.dolares : -op.dolares,
//     //       op.flujoFondos.montoPEN,
//     //       usd.fecha_usd ? usd.fecha_usd.toISOString().split("T")[0] : "",
//     //       usd.descripcion_op_usd ?? "",
//     //       usd.monto_usd ?? "",
//     //       usd.referencia_usd ?? "",
//     //       diferenciaUsd,
//     //       pen.fecha_pen ? pen.fecha_pen.toISOString().split("T")[0] : "",
//     //       pen.descripcion_op_pen ?? "",
//     //       pen.monto_pen ?? "",
//     //       pen.referencia_pen ?? "",
//     //       diferenciaPEN,
//     //     ]);
//     //   }
//     // });

//     // 👇 Agrega esto antes de crear el Excel
//     // console.log("🔹 Total filas exportadas (rows):", rows.length);

//     // Contar operaciones duplicadas por número
//     // const conteoPorNumero: Record<string, number> = {};

//     // operaciones.forEach((op) => {
//     //   const num = op.numero;
//     //   conteoPorNumero[num] = (conteoPorNumero[num] || 0) + 1;
//     // });

//     // const duplicadas = Object.entries(conteoPorNumero).filter(([_, count]) => count > 1);

//     // if (duplicadas.length > 0) {
//     //   console.log("⚠️ Operaciones duplicadas detectadas:");
//     //   duplicadas.forEach(([numero, veces]) => console.log(` - ${numero}: ${veces} veces`));
//     // } else {
//     //   console.log("✅ No hay operaciones duplicadas por número.");
//     // }

//     // 👆 Hasta aquí lo nuevo

//     const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Cuadre Operaciones");

//     const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

//     res.setHeader("Content-Disposition", "attachment; filename=cuadre-operaciones.xlsx");
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );

//     res.send(buffer);
//   } catch (error) {
//     console.error("Error exportando cuadre operaciones:", error);
//     res.status(500).json({ message: "Error exportando cuadre operaciones" });
//   }
// };

//*Prueba para exportar cuadre operaciones excel
// export const exportarCuadreOperacionesExcel = async (req: any, res: any) => {
//   const { tipo } = req.params;
//   const whereCondition: any = tipo.toLowerCase() === "todos" ? {} : { tipo: tipo.toUpperCase() };

//   try {
//     const operaciones = await prisma.operacion.findMany({
//       include: {
//         cuadreOperacion: {
//           include: {
//             CuadreOperacionDolares: true,
//             CuadreOperacionSoles: true,
//             operacion: {
//               include: {
//                 usuario: true,
//               },
//             },
//           },
//         },
//         flujoFondos: true,
//       },
//       where: whereCondition,
//     });

//     const fechaInicioEnero = new Date("2025-01-01 00:00:00");
//     const fechaFinEnero = new Date("2025-01-31 23:59:59");

//     const operacionesEnero = operaciones.filter((op) => {
//       const fechaOp = new Date(op.fecha);
//       return fechaOp >= fechaInicioEnero && fechaOp <= fechaFinEnero;
//     });

//     console.log(`📊 Total de operaciones de ENERO 2025: ${operacionesEnero.length}`);

//     const operacionCuadre273 = operaciones.find((op) => op.cuadreOperacion?.id === 273);

//     if (operacionCuadre273) {
//       console.log("🎯 Operación con cuadreOperacionId 273:");
//       console.log(JSON.stringify(operacionCuadre273, null, 2));
//     } else {
//       console.log("⚠️ No se encontró operación con cuadreOperacionId 273");
//     }

//     const headers = [
//       "Fecha Operación",
//       "Número",
//       "Cliente/Titular",
//       "Tipo",
//       "Dólares",
//       "Soles",
//       "Fecha USD",
//       "Descripción USD",
//       "Monto USD",
//       "Referencia USD",
//       "Diferencia USD",
//       "Fecha PEN",
//       "Descripción PEN",
//       "Monto PEN",
//       "Referencia PEN",
//       "Diferencia PEN",
//     ];

//     const rows: any[] = [];

//     operaciones.forEach((op) => {
//       const usdCuadres = op.cuadreOperacion?.CuadreOperacionDolares || [null];
//       const penCuadres = op.cuadreOperacion?.CuadreOperacionSoles || [null];

//       const maxCuadres = Math.max(usdCuadres.length, penCuadres.length);

//       // ✅ Inicializar montos FUERA del for
//       let montoRestanteUSD = 0;
//       let montoRestantePEN = 0;

//       if (op.cuadreOperacion) {
//         montoRestanteUSD =
//           op.tipo === "VENTA" ? Number(-op.dolares) : Math.abs(Number(op.dolares || 0));
//         montoRestantePEN = Number(op.flujoFondos.montoPEN || 0);
//       } else {
//         montoRestanteUSD = Number(op.dolares || 0);
//         montoRestantePEN = Number(op.flujoFondos.montoPEN || 0);
//       }

//       // ✅ Iterar y calcular diferencia PROGRESIVA
//       for (let i = 0; i < maxCuadres; i++) {
//         const usd: any = usdCuadres[i] || {};
//         const pen: any = penCuadres[i] || {};

//         // Restar el cuadre ACTUAL (si existe)
//         if (usd.monto_usd !== undefined) {
//           montoRestanteUSD = Number(montoRestanteUSD) - Number(usd.monto_usd || 0);
//         }
//         if (pen.monto_pen !== undefined) {
//           montoRestantePEN = Number(montoRestantePEN) - Number(pen.monto_pen || 0);
//         }

//         const diferenciaUsd = Number(montoRestanteUSD.toFixed(2));
//         const diferenciaPEN = Number(montoRestantePEN.toFixed(2));

//         rows.push([
//           op.fecha.toISOString().split("T")[0],
//           op.numero,
//           op.cuadreOperacion?.operacion.usuario.cliente,
//           op.tipo,
//           op.tipo === "COMPRA" ? op.dolares : -op.dolares,
//           op.flujoFondos.montoPEN,
//           usd.fecha_usd ? usd.fecha_usd.toISOString().split("T")[0] : "",
//           usd.descripcion_op_usd ?? "",
//           usd.monto_usd ?? "",
//           usd.referencia_usd ?? "",
//           diferenciaUsd,
//           pen.fecha_pen ? pen.fecha_pen.toISOString().split("T")[0] : "",
//           pen.descripcion_op_pen ?? "",
//           pen.monto_pen ?? "",
//           pen.referencia_pen ?? "",
//           diferenciaPEN,
//         ]);
//       }
//     });

//     const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Cuadre Operaciones");

//     const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

//     res.setHeader("Content-Disposition", "attachment; filename=cuadre-operaciones.xlsx");
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );

//     res.send(buffer);
//   } catch (error) {
//     console.error("Error exportando cuadre operaciones:", error);
//     res.status(500).json({ message: "Error exportando cuadre operaciones" });
//   }
// };

//*Prueba test01
// export const exportarCuadreOperacionesExcel = async (req: any, res: any) => {
//   const { tipo } = req.params;
//   const whereCondition: any = tipo.toLowerCase() === "todos" ? {} : { tipo: tipo.toUpperCase() };

//   try {
//     const operaciones = await prisma.operacion.findMany({
//       include: {
//         cuadreOperacion: {
//           include: {
//             CuadreOperacionDolares: true,
//             CuadreOperacionSoles: true,
//             operacion: {
//               include: {
//                 usuario: true,
//               },
//             },
//           },
//         },
//         flujoFondos: true,
//       },
//       where: whereCondition,
//     });

//     const fechaInicioEnero = new Date("2025-01-01 00:00:00");
//     const fechaFinEnero = new Date("2025-01-31 23:59:59");

//     const operacionesEnero = operaciones.filter((op) => {
//       const fechaOp = new Date(op.fecha);
//       return fechaOp >= fechaInicioEnero && fechaOp <= fechaFinEnero;
//     });

//     console.log(`📊 Total de operaciones de ENERO 2025: ${operacionesEnero.length}`);

//     const operacionCuadre273 = operaciones.find((op) => op.cuadreOperacion?.id === 273);

//     if (operacionCuadre273) {
//       console.log("🎯 Operación con cuadreOperacionId 273:");
//       console.log(JSON.stringify(operacionCuadre273, null, 2));
//     } else {
//       console.log("⚠️ No se encontró operación con cuadreOperacionId 273");
//     }

//     const headers = [
//       "Fecha Operación",
//       "Número",
//       "Cliente/Titular",
//       "Tipo",
//       "Dólares",
//       "Soles",
//       "Fecha USD",
//       "Descripción USD",
//       "Monto USD",
//       "Referencia USD",
//       "Diferencia USD",
//       "Fecha PEN",
//       "Descripción PEN",
//       "Monto PEN",
//       "Referencia PEN",
//       "Diferencia PEN",
//     ];

//     const rows: any[] = [];

//     operaciones.forEach((op) => {
//       const usdCuadres = op.cuadreOperacion?.CuadreOperacionDolares || [null];
//       const penCuadres = op.cuadreOperacion?.CuadreOperacionSoles || [null];

//       const maxCuadres = Math.max(usdCuadres.length, penCuadres.length);

//       // Inicializar montos
//       let montoRestanteUSD = 0;
//       let montoRestantePEN = 0;

//       if (op.cuadreOperacion) {
//         montoRestanteUSD =
//           op.tipo === "VENTA" ? Number(-op.dolares) : Math.abs(Number(op.dolares || 0));
//         montoRestantePEN = Number(op.flujoFondos.montoPEN || 0);
//       } else {
//         montoRestanteUSD = Number(op.dolares || 0);
//         montoRestantePEN = Number(op.flujoFondos.montoPEN || 0);
//       }

//       // ✅ NUEVO: Verificar si el primer cuadre PEN cubre todo o más
//       const montoEsperadoPEN = Number(op.flujoFondos.montoPEN || 0);
//       const primerCuadrePEN = penCuadres[0];
//       let primerCuadreCubreTodo = false;

//       if (primerCuadrePEN && primerCuadrePEN.monto_pen !== undefined) {
//         const montoPrimerCuadre = Number(primerCuadrePEN.monto_pen || 0);

//         // Para COMPRA: esperado es negativo, primer cuadre debe ser <= esperado
//         // Para VENTA: esperado es positivo, primer cuadre debe ser >= esperado
//         if (op.tipo === "COMPRA") {
//           primerCuadreCubreTodo = montoPrimerCuadre <= montoEsperadoPEN;
//         } else {
//           primerCuadreCubreTodo = montoPrimerCuadre >= montoEsperadoPEN;
//         }
//       }

//       // Iterar y calcular diferencia
//       for (let i = 0; i < maxCuadres; i++) {
//         const usd: any = usdCuadres[i] || {};
//         const pen: any = penCuadres[i] || {};

//         // ✅ SI el primer cuadre PEN cubre todo Y hay múltiples cuadres USD
//         if (primerCuadreCubreTodo && usdCuadres.length > 1 && penCuadres.length === 1) {
//           // Para el primer registro: aplicar lógica normal
//           if (i === 0) {
//             if (usd.monto_usd !== undefined) {
//               montoRestanteUSD = Number(montoRestanteUSD) - Number(usd.monto_usd || 0);
//             }
//             if (pen.monto_pen !== undefined) {
//               montoRestantePEN = Number(montoRestantePEN) - Number(pen.monto_pen || 0);
//             }
//           } else {
//             // Para registros siguientes: solo restar USD, mantener PEN igual al esperado
//             if (usd.monto_usd !== undefined) {
//               montoRestanteUSD = Number(montoRestanteUSD) - Number(usd.monto_usd || 0);
//             }
//             // NO restar PEN, mantenerlo igual al esperado
//             montoRestantePEN = montoEsperadoPEN;
//           }
//         } else {
//           // ✅ ELSE: Aplicar lógica progresiva normal (la que ya tenías)
//           if (usd.monto_usd !== undefined) {
//             montoRestanteUSD = Number(montoRestanteUSD) - Number(usd.monto_usd || 0);
//           }
//           if (pen.monto_pen !== undefined) {
//             montoRestantePEN = Number(montoRestantePEN) - Number(pen.monto_pen || 0);
//           }
//         }

//         const diferenciaUsd = Number(montoRestanteUSD.toFixed(2));
//         const diferenciaPEN = Number(montoRestantePEN.toFixed(2));

//         rows.push([
//           op.fecha.toISOString().split("T")[0],
//           op.numero,
//           op.cuadreOperacion?.operacion.usuario.cliente,
//           op.tipo,
//           op.tipo === "COMPRA" ? op.dolares : -op.dolares,
//           op.flujoFondos.montoPEN,
//           usd.fecha_usd ? usd.fecha_usd.toISOString().split("T")[0] : "",
//           usd.descripcion_op_usd ?? "",
//           usd.monto_usd ?? "",
//           usd.referencia_usd ?? "",
//           diferenciaUsd,
//           pen.fecha_pen ? pen.fecha_pen.toISOString().split("T")[0] : "",
//           pen.descripcion_op_pen ?? "",
//           pen.monto_pen ?? "",
//           pen.referencia_pen ?? "",
//           diferenciaPEN,
//         ]);
//       }
//     });

//     const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Cuadre Operaciones");

//     const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

//     res.setHeader("Content-Disposition", "attachment; filename=cuadre-operaciones.xlsx");
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );

//     res.send(buffer);
//   } catch (error) {
//     console.error("Error exportando cuadre operaciones:", error);
//     res.status(500).json({ message: "Error exportando cuadre operaciones" });
//   }
// };

//*Prueba test02
// export const exportarCuadreOperacionesExcel = async (req: any, res: any) => {
//   const { tipo } = req.params;
//   const whereCondition: any = tipo.toLowerCase() === "todos" ? {} : { tipo: tipo.toUpperCase() };

//   try {
//     const operaciones = await prisma.operacion.findMany({
//       include: {
//         cuadreOperacion: {
//           include: {
//             CuadreOperacionDolares: true,
//             CuadreOperacionSoles: true,
//             operacion: {
//               include: {
//                 usuario: true,
//               },
//             },
//           },
//         },
//         flujoFondos: true,
//       },
//       where: whereCondition,
//     });

//     const fechaInicioEnero = new Date("2025-01-01 00:00:00");
//     const fechaFinEnero = new Date("2025-01-31 23:59:59");

//     const operacionesEnero = operaciones.filter((op) => {
//       const fechaOp = new Date(op.fecha);
//       return fechaOp >= fechaInicioEnero && fechaOp <= fechaFinEnero;
//     });

//     console.log(`📊 Total de operaciones de ENERO 2025: ${operacionesEnero.length}`);

//     const operacionCuadre273 = operaciones.find((op) => op.cuadreOperacion?.id === 273);

//     if (operacionCuadre273) {
//       console.log("🎯 Operación con cuadreOperacionId 273:");
//       console.log(JSON.stringify(operacionCuadre273, null, 2));
//     } else {
//       console.log("⚠️ No se encontró operación con cuadreOperacionId 273");
//     }

//     const headers = [
//       "Fecha Operación",
//       "Número",
//       "Cliente/Titular",
//       "Tipo",
//       "Dólares",
//       "Soles",
//       "Fecha USD",
//       "Descripción USD",
//       "Monto USD",
//       "Referencia USD",
//       "Diferencia USD",
//       "Fecha PEN",
//       "Descripción PEN",
//       "Monto PEN",
//       "Referencia PEN",
//       "Diferencia PEN",
//     ];

//     const rows: any[] = [];

//     operaciones.forEach((op) => {
//       const usdCuadres = op.cuadreOperacion?.CuadreOperacionDolares || [null];
//       const penCuadres = op.cuadreOperacion?.CuadreOperacionSoles || [null];

//       const maxCuadres = Math.max(usdCuadres.length, penCuadres.length);

//       // Inicializar montos
//       let montoRestanteUSD = 0;
//       let montoRestantePEN = 0;

//       if (op.cuadreOperacion) {
//         montoRestanteUSD =
//           op.tipo === "VENTA" ? Number(-op.dolares) : Math.abs(Number(op.dolares || 0));
//         montoRestantePEN = Number(op.flujoFondos.montoPEN || 0);
//       } else {
//         montoRestanteUSD = Number(op.dolares || 0);
//         montoRestantePEN = Number(op.flujoFondos.montoPEN || 0);
//       }

//       // ✅ NUEVO: Verificar si el primer cuadre PEN cubre todo o más
//       const montoEsperadoPEN = Number(op.flujoFondos.montoPEN || 0);
//       const primerCuadrePEN = penCuadres[0];
//       let primerCuadreCubreTodo = false;

//       if (primerCuadrePEN && primerCuadrePEN.monto_pen !== undefined) {
//         const montoPrimerCuadre = Number(primerCuadrePEN.monto_pen || 0);

//         // Para COMPRA: esperado es negativo, primer cuadre debe ser <= esperado
//         // Para VENTA: esperado es positivo, primer cuadre debe ser >= esperado
//         if (op.tipo === "COMPRA") {
//           primerCuadreCubreTodo = montoPrimerCuadre <= montoEsperadoPEN;
//         } else {
//           primerCuadreCubreTodo = montoPrimerCuadre >= montoEsperadoPEN;
//         }
//       }

//       // Iterar y calcular diferencia
//       for (let i = 0; i < maxCuadres; i++) {
//         const usd: any = usdCuadres[i] || {};
//         const pen: any = penCuadres[i] || {};

//         // ✅ SI el primer cuadre PEN cubre todo Y hay múltiples cuadres USD
//         if (primerCuadreCubreTodo && usdCuadres.length > 1 && penCuadres.length === 1) {
//           // Para el primer registro: aplicar lógica normal
//           if (i === 0) {
//             if (usd.monto_usd !== undefined) {
//               montoRestanteUSD = Number(montoRestanteUSD) - Number(usd.monto_usd || 0);
//             }
//             if (pen.monto_pen !== undefined) {
//               montoRestantePEN = Number(montoRestantePEN) - Number(pen.monto_pen || 0);
//             }
//           } else {
//             // Para registros siguientes: solo restar USD, mantener PEN igual al esperado
//             if (usd.monto_usd !== undefined) {
//               montoRestanteUSD = Number(montoRestanteUSD) - Number(usd.monto_usd || 0);
//             }
//             // NO restar PEN, mantenerlo igual al esperado
//             montoRestantePEN = montoEsperadoPEN;
//           }
//         } else {
//           // ✅ ELSE: Aplicar lógica progresiva normal (la que ya tenías)
//           if (usd.monto_usd !== undefined) {
//             montoRestanteUSD = Number(montoRestanteUSD) - Number(usd.monto_usd || 0);
//           }
//           if (pen.monto_pen !== undefined) {
//             montoRestantePEN = Number(montoRestantePEN) - Number(pen.monto_pen || 0);
//           }
//         }

//         const diferenciaUsd = Number(montoRestanteUSD.toFixed(2));

//         // ✅ Determinar qué mostrar en Monto PEN
//         let montoPENMostrar = pen.monto_pen ?? "";
//         let diferenciaPEN = Number(montoRestantePEN.toFixed(2));

//         // Si aplica la lógica especial Y es un registro siguiente (i > 0) Y no hay cuadre PEN
//         if (primerCuadreCubreTodo && usdCuadres.length > 1 && penCuadres.length === 1 && i > 0) {
//           montoPENMostrar = montoEsperadoPEN;
//           // ✅ Calcular diferencia: montoEsperadoPEN - montoPENMostrar
//           diferenciaPEN = Number((montoEsperadoPEN - montoPENMostrar).toFixed(2));
//         }

//         rows.push([
//           op.fecha.toISOString().split("T")[0],
//           op.numero,
//           op.cuadreOperacion?.operacion.usuario.cliente,
//           op.tipo,
//           op.tipo === "COMPRA" ? op.dolares : -op.dolares,
//           op.flujoFondos.montoPEN,
//           usd.fecha_usd ? usd.fecha_usd.toISOString().split("T")[0] : "",
//           usd.descripcion_op_usd ?? "",
//           usd.monto_usd ?? "",
//           usd.referencia_usd ?? "",
//           diferenciaUsd,
//           pen.fecha_pen ? pen.fecha_pen.toISOString().split("T")[0] : "",
//           pen.descripcion_op_pen ?? "",
//           montoPENMostrar,
//           pen.referencia_pen ?? "",
//           diferenciaPEN,
//         ]);
//       }
//     });

//     const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Cuadre Operaciones");

//     const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

//     res.setHeader("Content-Disposition", "attachment; filename=cuadre-operaciones.xlsx");
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );

//     res.send(buffer);
//   } catch (error) {
//     console.error("Error exportando cuadre operaciones:", error);
//     res.status(500).json({ message: "Error exportando cuadre operaciones" });
//   }
// };

//*Prueba test03
// export const exportarCuadreOperacionesExcel = async (req: any, res: any) => {
//   const { tipo } = req.params;
//   const whereCondition: any = tipo.toLowerCase() === "todos" ? {} : { tipo: tipo.toUpperCase() };

//   try {
//     const operaciones = await prisma.operacion.findMany({
//       include: {
//         cuadreOperacion: {
//           include: {
//             CuadreOperacionDolares: true,
//             CuadreOperacionSoles: true,
//             operacion: {
//               include: {
//                 usuario: true,
//               },
//             },
//           },
//         },
//         flujoFondos: true,
//       },
//       where: whereCondition,
//     });

//     const fechaInicioEnero = new Date("2025-01-01 00:00:00");
//     const fechaFinEnero = new Date("2025-01-31 23:59:59");

//     const operacionesEnero = operaciones.filter((op) => {
//       const fechaOp = new Date(op.fecha);
//       return fechaOp >= fechaInicioEnero && fechaOp <= fechaFinEnero;
//     });

//     console.log(`📊 Total de operaciones de ENERO 2025: ${operacionesEnero.length}`);

//     const operacionCuadre273 = operaciones.find((op) => op.cuadreOperacion?.id === 273);

//     if (operacionCuadre273) {
//       console.log("🎯 Operación con cuadreOperacionId 273:");
//       console.log(JSON.stringify(operacionCuadre273, null, 2));
//     } else {
//       console.log("⚠️ No se encontró operación con cuadreOperacionId 273");
//     }

//     const headers = [
//       "Fecha Operación",
//       "Número",
//       "Cliente/Titular",
//       "Tipo",
//       "Dólares",
//       "Soles",
//       "Fecha USD",
//       "Descripción USD",
//       "Monto USD",
//       "Referencia USD",
//       "Diferencia USD",
//       "Fecha PEN",
//       "Descripción PEN",
//       "Monto PEN",
//       "Referencia PEN",
//       "Diferencia PEN",
//     ];

//     const rows: any[] = [];

//     operaciones.forEach((op) => {
//       const usdCuadres = op.cuadreOperacion?.CuadreOperacionDolares || [null];
//       const penCuadres = op.cuadreOperacion?.CuadreOperacionSoles || [null];

//       const maxCuadres = Math.max(usdCuadres.length, penCuadres.length);

//       // Inicializar montos
//       let montoRestanteUSD = 0;
//       let montoRestantePEN = 0;

//       if (op.cuadreOperacion) {
//         montoRestanteUSD =
//           op.tipo === "VENTA" ? Number(-op.dolares) : Math.abs(Number(op.dolares || 0));
//         montoRestantePEN = Number(op.flujoFondos.montoPEN || 0);
//       } else {
//         montoRestanteUSD = Number(op.dolares || 0);
//         montoRestantePEN = Number(op.flujoFondos.montoPEN || 0);
//       }

//       // ✅ NUEVO: Verificar si el primer cuadre PEN cubre todo o más
//       const montoEsperadoPEN = Number(op.flujoFondos.montoPEN || 0);
//       const primerCuadrePEN = penCuadres[0];
//       let primerCuadreCubreTodo = false;

//       if (primerCuadrePEN && primerCuadrePEN.monto_pen !== undefined) {
//         const montoPrimerCuadre = Number(primerCuadrePEN.monto_pen || 0);

//         // Para COMPRA: esperado es negativo, primer cuadre debe ser <= esperado
//         // Para VENTA: esperado es positivo, primer cuadre debe ser >= esperado
//         if (op.tipo === "COMPRA") {
//           primerCuadreCubreTodo = montoPrimerCuadre <= montoEsperadoPEN;
//         } else {
//           primerCuadreCubreTodo = montoPrimerCuadre >= montoEsperadoPEN;
//         }
//       }

//       // Iterar y calcular diferencia
//       for (let i = 0; i < maxCuadres; i++) {
//         const usd: any = usdCuadres[i] || {};
//         const pen: any = penCuadres[i] || {};

//         // ✅ SI el primer cuadre PEN cubre todo Y hay múltiples cuadres USD
//         if (primerCuadreCubreTodo && usdCuadres.length > 1 && penCuadres.length === 1) {
//           // Para el primer registro: aplicar lógica normal
//           if (i === 0) {
//             if (usd.monto_usd !== undefined) {
//               montoRestanteUSD = Number(montoRestanteUSD) - Number(usd.monto_usd || 0);
//             }
//             if (pen.monto_pen !== undefined) {
//               montoRestantePEN = Number(montoRestantePEN) - Number(pen.monto_pen || 0);
//             }
//           } else {
//             // Para registros siguientes: solo restar USD, mantener PEN igual al esperado
//             if (usd.monto_usd !== undefined) {
//               montoRestanteUSD = Number(montoRestanteUSD) - Number(usd.monto_usd || 0);
//             }
//             // NO restar PEN, mantenerlo igual al esperado
//             montoRestantePEN = montoEsperadoPEN;
//           }
//         } else {
//           // ✅ ELSE: Aplicar lógica progresiva normal (la que ya tenías)
//           if (usd.monto_usd !== undefined) {
//             montoRestanteUSD = Number(montoRestanteUSD) - Number(usd.monto_usd || 0);
//           }
//           if (pen.monto_pen !== undefined) {
//             montoRestantePEN = Number(montoRestantePEN) - Number(pen.monto_pen || 0);
//           }
//         }

//         const diferenciaUsd = Number(montoRestanteUSD.toFixed(2));

//         // ✅ Determinar qué mostrar en Monto PEN y Soles
//         let montoPENMostrar = pen.monto_pen ?? "";
//         let montoSolesMostrar = op.flujoFondos.montoPEN;
//         let diferenciaPEN = Number(montoRestantePEN.toFixed(2));

//         // Si aplica la lógica especial Y es un registro siguiente (i > 0) Y no hay cuadre PEN
//         if (primerCuadreCubreTodo && usdCuadres.length > 1 && penCuadres.length === 1 && i > 0) {
//           montoPENMostrar = montoEsperadoPEN;
//           montoSolesMostrar = 0; // ✅ Mostrar 0 en columna Soles
//           // ✅ Calcular diferencia: montoEsperadoPEN - montoPENMostrar
//           diferenciaPEN = Number((montoEsperadoPEN - montoPENMostrar).toFixed(2));
//         }

//         rows.push([
//           op.fecha.toISOString().split("T")[0],
//           op.numero,
//           op.cuadreOperacion?.operacion.usuario.cliente,
//           op.tipo,
//           op.tipo === "COMPRA" ? op.dolares : -op.dolares,
//           montoSolesMostrar,
//           usd.fecha_usd ? usd.fecha_usd.toISOString().split("T")[0] : "",
//           usd.descripcion_op_usd ?? "",
//           usd.monto_usd ?? "",
//           usd.referencia_usd ?? "",
//           diferenciaUsd,
//           pen.fecha_pen ? pen.fecha_pen.toISOString().split("T")[0] : "",
//           pen.descripcion_op_pen ?? "",
//           montoPENMostrar,
//           pen.referencia_pen ?? "",
//           diferenciaPEN,
//         ]);
//       }
//     });

//     const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Cuadre Operaciones");

//     const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

//     res.setHeader("Content-Disposition", "attachment; filename=cuadre-operaciones.xlsx");
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );

//     res.send(buffer);
//   } catch (error) {
//     console.error("Error exportando cuadre operaciones:", error);
//     res.status(500).json({ message: "Error exportando cuadre operaciones" });
//   }
// };

//*Prueba test04
// export const exportarCuadreOperacionesExcel = async (req: any, res: any) => {
//   const { tipo } = req.params;
//   const whereCondition: any = tipo.toLowerCase() === "todos" ? {} : { tipo: tipo.toUpperCase() };
//   const fechaInicioEnero = new Date("2025-01-01T00:00:00.000Z");
//   const fechaFinEnero = new Date("2025-02-01T00:00:00.000Z");

//   // whereCondition.fecha = {
//   //   gte: fechaInicioEnero,
//   //   lt: fechaFinEnero,
//   // };

//   try {
//     const operaciones = await prisma.operacion.findMany({
//       include: {
//         cuadreOperacion: {
//           include: {
//             CuadreOperacionDolares: true,
//             CuadreOperacionSoles: true,
//             operacion: {
//               include: {
//                 usuario: true,
//               },
//             },
//           },
//         },
//         flujoFondos: true,
//       },
//       where: whereCondition,
//       // orderBy: {
//       //   fecha: "asc",
//       //   numero: "asc",
//       // },
//       orderBy: [{ fecha: "asc" }, { numero: "asc" }],
//     });

//     // const fechaInicioEnero = new Date("2025-01-01 00:00:00");
//     // const fechaFinEnero = new Date("2025-01-31 23:59:59");

//     // const todosOperaciones = await prisma.operacion.findMany({
//     //   where: {
//     //     fecha: {
//     //       gte: fechaInicioEnero,
//     //       lte: fechaFinEnero,
//     //     },
//     //   },
//     // });

//     // const operacionesEnero = operaciones.filter((op) => {
//     //   const fechaOp = new Date(op.fecha);
//     //   return fechaOp >= fechaInicioEnero && fechaOp <= fechaFinEnero;
//     // });

//     // console.log("Total de operacionesEnero " + operacionesEnero.length);
//     // console.log("Totales " + todosOperaciones.length);

//     const todosOperaciones = await prisma.operacion.findMany({
//       where: {
//         fecha: {
//           gte: fechaInicioEnero,
//           lt: fechaFinEnero, // como en el SQL
//         },
//       },
//     });

//     // NO necesitarías filtrar otra vez, pero si lo quieres:
//     const operacionesEnero = todosOperaciones.filter((op) => {
//       const fechaOp = new Date(op.fecha);
//       return fechaOp >= fechaInicioEnero && fechaOp < fechaFinEnero;
//     });

//     console.log("Total de operacionesEnero " + operacionesEnero.length);
//     console.log("Totales en BD (todosOperaciones) " + todosOperaciones.length);

//     const headers = [
//       "Fecha Operación",
//       "Número",
//       "Cliente/Titular",
//       "Tipo",
//       "Dólares",
//       "Soles",
//       "Fecha USD",
//       "Descripción USD",
//       "Monto USD",
//       "Referencia USD",
//       "Diferencia USD",
//       "Fecha PEN",
//       "Descripción PEN",
//       "Monto PEN",
//       "Referencia PEN",
//       "Diferencia PEN",
//     ];

//     const rows: any[] = [];

//     operaciones.forEach((op) => {
//       const usdCuadres = op.cuadreOperacion?.CuadreOperacionDolares || [null];
//       const penCuadres = op.cuadreOperacion?.CuadreOperacionSoles || [null];

//       const maxCuadres = Math.max(usdCuadres.length, penCuadres.length);

//       // Montos originales
//       const montoOriginalUSD =
//         op.tipo === "VENTA" ? Number(-op.dolares) : Math.abs(Number(op.dolares || 0));
//       const montoOriginalPEN = Number(op.flujoFondos.montoPEN || 0);

//       // ✅ VERIFICAR CASO 1: Un cuadre PEN cubre todo y hay múltiples USD
//       const primerCuadrePEN = penCuadres[0];
//       let penCubreTodoConMultiplesUSD = false;

//       if (
//         usdCuadres.length > 1 &&
//         penCuadres.length === 1 &&
//         primerCuadrePEN?.monto_pen !== undefined
//       ) {
//         const montoPrimerCuadrePEN = Number(primerCuadrePEN.monto_pen || 0);

//         if (op.tipo === "COMPRA") {
//           penCubreTodoConMultiplesUSD = montoPrimerCuadrePEN <= montoOriginalPEN;
//         } else {
//           penCubreTodoConMultiplesUSD = montoPrimerCuadrePEN >= montoOriginalPEN;
//         }
//       }

//       // ✅ VERIFICAR CASO 2: Un cuadre USD cubre todo y hay múltiples PEN
//       const primerCuadreUSD = usdCuadres[0];
//       let usdCubreTodoConMultiplesPEN = false;

//       if (
//         penCuadres.length > 1 &&
//         usdCuadres.length === 1 &&
//         primerCuadreUSD?.monto_usd !== undefined
//       ) {
//         const montoPrimerCuadreUSD = Number(primerCuadreUSD.monto_usd || 0);

//         // Para COMPRA: USD esperado es positivo, cuadre debe ser >= esperado
//         // Para VENTA: USD esperado es negativo, cuadre debe ser <= esperado
//         if (op.tipo === "COMPRA") {
//           usdCubreTodoConMultiplesPEN = montoPrimerCuadreUSD >= montoOriginalUSD;
//         } else {
//           usdCubreTodoConMultiplesPEN = montoPrimerCuadreUSD <= montoOriginalUSD;
//         }
//       }

//       // Iterar sobre los cuadres
//       for (let i = 0; i < maxCuadres; i++) {
//         const usd: any = usdCuadres[i] || {};
//         const pen: any = penCuadres[i] || {};

//         let diferenciaUsd: number;
//         let diferenciaPEN: number;
//         let montoUSDMostrar = usd.monto_usd ?? "";
//         let montoPENMostrar = pen.monto_pen ?? "";

//         if (i === 0) {
//           // ✅ PRIMERA FILA: Diferencia = Original - Cuadre
//           diferenciaUsd =
//             usd.monto_usd !== undefined
//               ? Number((montoOriginalUSD - Number(usd.monto_usd || 0)).toFixed(2))
//               : Number(montoOriginalUSD.toFixed(2));

//           diferenciaPEN =
//             pen.monto_pen !== undefined
//               ? Number((montoOriginalPEN - Number(pen.monto_pen || 0)).toFixed(2))
//               : Number(montoOriginalPEN.toFixed(2));
//         } else {
//           // ✅ FILAS SIGUIENTES: Aplicar lógica según el caso

//           // --- CASO USD ---
//           if (penCubreTodoConMultiplesUSD) {
//             // Hay 1 PEN que cubre todo y múltiples USD
//             // USD: Normal (0 - cuadre)
//             diferenciaUsd =
//               usd.monto_usd !== undefined ? Number((0 - Number(usd.monto_usd || 0)).toFixed(2)) : 0;

//             // PEN: Mostrar 0 (visual) y diferencia 0
//             montoPENMostrar = 0;
//             diferenciaPEN = 0;
//           } else if (usdCubreTodoConMultiplesPEN) {
//             // Hay 1 USD que cubre todo y múltiples PEN
//             // USD: Mostrar 0 (visual) y diferencia 0
//             montoUSDMostrar = 0;
//             diferenciaUsd = 0;

//             // PEN: Normal (0 - cuadre)
//             diferenciaPEN =
//               pen.monto_pen !== undefined ? Number((0 - Number(pen.monto_pen || 0)).toFixed(2)) : 0;
//           } else {
//             // Caso normal: ambos con lógica estándar (0 - cuadre)
//             diferenciaUsd =
//               usd.monto_usd !== undefined ? Number((0 - Number(usd.monto_usd || 0)).toFixed(2)) : 0;

//             diferenciaPEN =
//               pen.monto_pen !== undefined ? Number((0 - Number(pen.monto_pen || 0)).toFixed(2)) : 0;
//           }
//         }

//         rows.push([
//           op.fecha.toISOString().split("T")[0],
//           op.numero,
//           op.cuadreOperacion?.operacion.usuario.cliente,
//           op.tipo,
//           op.tipo === "COMPRA" ? op.dolares : -op.dolares,
//           op.flujoFondos.montoPEN,
//           usd.fecha_usd ? usd.fecha_usd.toISOString().split("T")[0] : "",
//           usd.descripcion_op_usd ?? "",
//           montoUSDMostrar,
//           usd.referencia_usd ?? "",
//           diferenciaUsd,
//           pen.fecha_pen ? pen.fecha_pen.toISOString().split("T")[0] : "",
//           pen.descripcion_op_pen ?? "",
//           montoPENMostrar,
//           pen.referencia_pen ?? "",
//           diferenciaPEN,
//         ]);
//       }
//     });

//     const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Cuadre Operaciones");

//     const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

//     res.setHeader("Content-Disposition", "attachment; filename=cuadre-operaciones.xlsx");
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );

//     res.send(buffer);
//   } catch (error) {
//     console.error("Error exportando cuadre operaciones:", error);
//     res.status(500).json({ message: "Error exportando cuadre operaciones" });
//   }
// };

//*Prueba test05
export const exportarCuadreOperacionesExcel = async (req: any, res: any) => {
  const { tipo } = req.params;
  const whereCondition: any = tipo.toLowerCase() === "todos" ? {} : { tipo: tipo.toUpperCase() };

  try {
    const operaciones = await prisma.operacion.findMany({
      include: {
        cuadreOperacion: {
          include: {
            CuadreOperacionDolares: true,
            CuadreOperacionSoles: true,
            operacion: {
              include: {
                usuario: true,
              },
            },
          },
        },
        flujoFondos: true,
      },
      where: whereCondition,
      orderBy: [{ fecha: "asc" }, { numero: "asc" }],
    });

    const headers = [
      "Fecha Operación",
      "Número",
      "Cliente/Titular",
      "Tipo",
      "Dólares",
      "Soles",
      "Fecha USD",
      "Descripción USD",
      "Monto USD",
      "Referencia USD",
      "Diferencia USD",
      "Fecha PEN",
      "Descripción PEN",
      "Monto PEN",
      "Referencia PEN",
      "Diferencia PEN",
    ];

    const rows: any[] = [];

    operaciones.forEach((op) => {
      const usdCuadres = op.cuadreOperacion?.CuadreOperacionDolares || [null];
      const penCuadres = op.cuadreOperacion?.CuadreOperacionSoles || [null];

      const maxCuadres = Math.max(usdCuadres.length, penCuadres.length);

      // Montos originales
      const montoOriginalUSD =
        op.tipo === "VENTA" ? Number(-op.dolares) : Math.abs(Number(op.dolares || 0));
      const montoOriginalPEN = Number(op.flujoFondos.montoPEN || 0);

      // ✅ VERIFICAR CASO 1: Un cuadre PEN cubre todo y hay múltiples USD
      const primerCuadrePEN = penCuadres[0];
      let penCubreTodoConMultiplesUSD = false;

      if (
        usdCuadres.length > 1 &&
        penCuadres.length === 1 &&
        primerCuadrePEN?.monto_pen !== undefined
      ) {
        const montoPrimerCuadrePEN = Number(primerCuadrePEN.monto_pen || 0);

        if (op.tipo === "COMPRA") {
          penCubreTodoConMultiplesUSD = montoPrimerCuadrePEN <= montoOriginalPEN;
        } else {
          penCubreTodoConMultiplesUSD = montoPrimerCuadrePEN >= montoOriginalPEN;
        }
      }

      // ✅ VERIFICAR CASO 2: Un cuadre USD cubre todo y hay múltiples PEN
      const primerCuadreUSD = usdCuadres[0];
      let usdCubreTodoConMultiplesPEN = false;

      if (
        penCuadres.length > 1 &&
        usdCuadres.length === 1 &&
        primerCuadreUSD?.monto_usd !== undefined
      ) {
        const montoPrimerCuadreUSD = Number(primerCuadreUSD.monto_usd || 0);

        // Para COMPRA: USD esperado es positivo, cuadre debe ser >= esperado
        // Para VENTA: USD esperado es negativo, cuadre debe ser <= esperado
        if (op.tipo === "COMPRA") {
          usdCubreTodoConMultiplesPEN = montoPrimerCuadreUSD >= montoOriginalUSD;
        } else {
          usdCubreTodoConMultiplesPEN = montoPrimerCuadreUSD <= montoOriginalUSD;
        }
      }

      // Iterar sobre los cuadres
      for (let i = 0; i < maxCuadres; i++) {
        const usd: any = usdCuadres[i] || {};
        const pen: any = penCuadres[i] || {};

        let diferenciaUsd: number;
        let diferenciaPEN: number;
        let montoUSDMostrar: any;
        let montoPENMostrar: any;

        // ✅ Si no existe cuadre en esta posición, mostrar 0 en lugar de vacío
        if (!usd.monto_usd && usd.monto_usd !== 0) {
          montoUSDMostrar = 0;
        } else {
          montoUSDMostrar = usd.monto_usd;
        }

        if (!pen.monto_pen && pen.monto_pen !== 0) {
          montoPENMostrar = 0;
        } else {
          montoPENMostrar = pen.monto_pen;
        }

        if (i === 0) {
          // ✅ PRIMERA FILA: Diferencia = Original - Cuadre
          diferenciaUsd =
            usd.monto_usd !== undefined
              ? Number((montoOriginalUSD - Number(usd.monto_usd || 0)).toFixed(2))
              : Number(montoOriginalUSD.toFixed(2));

          diferenciaPEN =
            pen.monto_pen !== undefined
              ? Number((montoOriginalPEN - Number(pen.monto_pen || 0)).toFixed(2))
              : Number(montoOriginalPEN.toFixed(2));
        } else {
          // ✅ FILAS SIGUIENTES: Aplicar lógica según el caso

          // --- CASO USD ---
          if (penCubreTodoConMultiplesUSD) {
            // Hay 1 PEN que cubre todo y múltiples USD
            // USD: Normal (0 - cuadre)
            diferenciaUsd =
              usd.monto_usd !== undefined ? Number((0 - Number(usd.monto_usd || 0)).toFixed(2)) : 0;

            // PEN: Mostrar 0 (visual) y diferencia 0
            montoPENMostrar = 0;
            diferenciaPEN = 0;
          } else if (usdCubreTodoConMultiplesPEN) {
            // Hay 1 USD que cubre todo y múltiples PEN
            // USD: Mostrar 0 (visual) y diferencia 0
            montoUSDMostrar = 0;
            diferenciaUsd = 0;

            // PEN: Normal (0 - cuadre)
            diferenciaPEN =
              pen.monto_pen !== undefined ? Number((0 - Number(pen.monto_pen || 0)).toFixed(2)) : 0;
          } else {
            // Caso normal: ambos con lógica estándar (0 - cuadre)
            diferenciaUsd =
              usd.monto_usd !== undefined ? Number((0 - Number(usd.monto_usd || 0)).toFixed(2)) : 0;

            diferenciaPEN =
              pen.monto_pen !== undefined ? Number((0 - Number(pen.monto_pen || 0)).toFixed(2)) : 0;
          }
        }

        // ✅ Determinar qué mostrar en las columnas "Dólares" y "Soles" esperados
        const dolaresEsperado = i === 0 ? (op.tipo === "COMPRA" ? op.dolares : -op.dolares) : 0;

        const solesEsperado = i === 0 ? op.flujoFondos.montoPEN : 0;

        rows.push([
          op.fecha.toISOString().split("T")[0],
          op.numero,
          op.cuadreOperacion?.operacion.usuario.cliente,
          op.tipo,
          dolaresEsperado,
          solesEsperado,
          usd.fecha_usd ? usd.fecha_usd.toISOString().split("T")[0] : "",
          usd.descripcion_op_usd ?? "",
          montoUSDMostrar,
          usd.referencia_usd ?? "",
          diferenciaUsd,
          pen.fecha_pen ? pen.fecha_pen.toISOString().split("T")[0] : "",
          pen.descripcion_op_pen ?? "",
          montoPENMostrar,
          pen.referencia_pen ?? "",
          diferenciaPEN,
        ]);
      }
    });

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cuadre Operaciones");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=cuadre-operaciones.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (error) {
    console.error("Error exportando cuadre operaciones:", error);
    res.status(500).json({ message: "Error exportando cuadre operaciones" });
  }
};

export const seteandoValoresErroneosFaltantes = async (req: any, res: any) => {
  try {
    // Números objetivo
    const numerosObjetivo = [13157, 13206, 13242, 13417, 13421, 13446, 13487, 13581, 14775, 14785];

    for (const numeroObjetivo of numerosObjetivo) {
      console.log("\n==============================================");
      console.log("Procesando operación:", numeroObjetivo);
      console.log("==============================================\n");

      // Buscar operación
      const op = await prisma.operacion.findFirst({
        where: { numero: numeroObjetivo },
        include: {
          cuadreOperacion: {
            include: {
              CuadreOperacionDolares: true,
              CuadreOperacionSoles: true,
            },
          },
          flujoFondos: true,
        },
      });

      if (!op) {
        console.log("❌ Operación no encontrada:", numeroObjetivo);
        continue;
      }

      // console.log("Operación encontrada:", {
      //   numero: op.numero,
      //   tipo: op.tipo,
      //   montoUSD: op.flujoFondos?.montoUSD,
      //   montoPEN: op.flujoFondos?.montoPEN,
      // });

      const esVenta = op.tipo === "VENTA";

      // Aseguramos que exista cuadreOperacion
      if (!op.cuadreOperacion) {
        // console.log("⚠ No existe cuadreOperacion, creando uno nuevo...");
        await prisma.cuadreOperacion.create({
          data: {
            operacionId: op.id,
          },
        });

        // Recargar la operación
        op.cuadreOperacion = await prisma.cuadreOperacion.findFirst({
          where: { operacionId: op.id },
          include: {
            CuadreOperacionDolares: true,
            CuadreOperacionSoles: true,
          },
        });
      }

      // console.log("\n---- DÓLARES EXISTENTES ----");
      // console.log(JSON.stringify(op.cuadreOperacion!.CuadreOperacionDolares, null, 2));

      // console.log("\n---- SOLES EXISTENTES ----");
      // console.log(JSON.stringify(op.cuadreOperacion!.CuadreOperacionSoles, null, 2));

      // ======================================================
      // 1) DÓLARES
      // ======================================================
      if (op.cuadreOperacion!.CuadreOperacionDolares.length === 0) {
        // console.log("\n⚠ No hay registro de DÓLARES, creando uno nuevo...");

        const montoUSDOriginal = op.flujoFondos?.montoUSD ?? 0;

        const montoUSD = esVenta ? -Math.abs(montoUSDOriginal) : Math.abs(montoUSDOriginal);

        // console.log("→ montoUSD ORIGINAL:", montoUSDOriginal);
        // console.log("→ montoUSD AJUSTADO:", montoUSD);

        await prisma.cuadreOperacionDolares.create({
          data: {
            cuadreOperacionId: op.cuadreOperacion!.id,
            fecha_usd: op.fecha,
            descripcion_op_usd: "GENERADO AUTOMÁTICAMENTE",
            monto_usd: montoUSD,
            referencia_usd: "",
            diferencia_usd: 0,
          },
        });
      } else {
        console.log("\nCorrigiendo los USD existentes...");

        for (const usd of op.cuadreOperacion!.CuadreOperacionDolares) {
          const montoNuevo = esVenta ? -Math.abs(usd.monto_usd) : Math.abs(usd.monto_usd);

          // console.log(`USD ${usd.id} → Antes: ${usd.monto_usd} | Después: ${montoNuevo}`);

          await prisma.cuadreOperacionDolares.update({
            where: { id: usd.id },
            data: { monto_usd: montoNuevo },
          });
        }
      }

      // ======================================================
      // 2) SOLES
      // ======================================================
      if (op.cuadreOperacion!.CuadreOperacionSoles.length === 0) {
        // console.log("\n⚠ No hay registro de SOLES, creando uno nuevo...");

        const montoPENOriginal = op.flujoFondos?.montoPEN ?? 0;

        const montoPEN = esVenta ? Math.abs(montoPENOriginal) : -Math.abs(montoPENOriginal);

        // console.log("→ montoPEN ORIGINAL:", montoPENOriginal);
        // console.log("→ montoPEN AJUSTADO:", montoPEN);

        await prisma.cuadreOperacionSoles.create({
          data: {
            cuadreOperacionId: op.cuadreOperacion!.id,
            fecha_pen: op.fecha,
            descripcion_op_pen: "GENERADO AUTOMÁTICAMENTE",
            monto_pen: montoPEN,
            referencia_pen: "",
            diferencia_pen: 0,
          },
        });
      } else {
        // console.log("\nCorrigiendo los PEN existentes...");

        for (const pen of op.cuadreOperacion!.CuadreOperacionSoles) {
          const montoNuevo = esVenta ? Math.abs(pen.monto_pen) : -Math.abs(pen.monto_pen);

          // console.log(`PEN ${pen.id} → Antes: ${pen.monto_pen} | Después: ${montoNuevo}`);

          await prisma.cuadreOperacionSoles.update({
            where: { id: pen.id },
            data: { monto_pen: montoNuevo },
          });
        }
      }

      // console.log("\n✔ Corrección finalizada para:", numeroObjetivo);
    }

    return res.json({
      message: "Montos corregidos para las operaciones",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error corrigiendo montos" });
  }
};
