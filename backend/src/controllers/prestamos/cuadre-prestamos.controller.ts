import { Prisma } from "@prisma/client";

import * as XLSX from "xlsx";
import { Request, Response } from "express";
import prisma from "../../config/database";

function parseDateFromDDMMYYYY(dateStr: string): Date {
  console.log(dateStr);
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
}

export async function obtenerCuadrePrestamos(req: any, res: any): Promise<any | undefined> {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = (req.query.search as string)?.trim() || "";
  const whereConditions: Prisma.PrestamoOperacionWhereInput = {};
  whereConditions.usuario = {
    nombres: {
      contains: search.toLowerCase(),
    },
    rol_id: 3,
  };

  try {
    const [prestamos, total] = await prisma.$transaction([
      prisma.prestamoOperacion.findMany({
        skip,
        take: limit,
        where: whereConditions,
        include: {
          usuario: true,
          cuadrePrestamo: {
            include: {
              devolucionesPrestamo: true,
              salidasPrestamo: true,
            },
          },
        },
        orderBy: {
          fechaInicial: "desc",
        },
      }),
      prisma.prestamoOperacion.count(),
    ]);

    return res
      .status(200)
      .json({
        data: prestamos,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error al obtener cuadre prestamos" });
  }
}

export async function registrarCuadrePrestamo(req: any, res: any): Promise<any | undefined> {
  const {
    prestamoId,
    depositoDev,
    pagadoDev,
    tcDev,
    montoFinalDev,
    referenciaDev,
    diferenciaDev,
    descripcionSal,
    montoSal,
    diferenciaSal,
  } = req.body;

  try {
    let cuadrePrestamoExistente = await prisma.cuadrePrestamo.findUnique({
      where: {
        prestamoId,
      },
    });

    if (!cuadrePrestamoExistente) {
      cuadrePrestamoExistente = await prisma.cuadrePrestamo.create({
        data: {
          prestamo: {
            connect: { id: prestamoId },
          },
        },
      });
    }

    const nuevaDevolucion = await prisma.devolucionesPrestamo.create({
      data: {
        cuadrePrestamo: {
          connect: { id: cuadrePrestamoExistente.id },
        },
        deposito: depositoDev,
        pagado: pagadoDev,
        tc: tcDev ?? 0,
        montoFinal: montoFinalDev,
        referencia: referenciaDev ?? 0,
        diferencia: diferenciaDev,
      },
    });

    const nuevaSalida = await prisma.pagosPrestamo.create({
      data: {
        cuadrePrestamo: {
          connect: { id: cuadrePrestamoExistente.id },
        },
        descripcion: descripcionSal,
        moonto: montoSal,
        diferencia: diferenciaSal,
      },
    });

    return res.status(201).json({
      cuadrePrestamo: nuevaDevolucion,
      pagoRealizado: nuevaSalida,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error al registrar cuadre prestamos" });
  }
}

export async function obtenerCuadrePrestamosPorId(req: any, res: any): Promise<any | undefined> {
  try {
    const { id } = req.params;
    const cuadrePrestamo = await prisma.cuadrePrestamo.findUnique({
      where: {
        prestamoId: Number(id),
      },
      include: {
        devolucionesPrestamo: true,
        salidasPrestamo: true,
      },
    });

    if (!cuadrePrestamo) {
      return res.status(404).json({ error: "Cuadre prestamo no encontrado" });
    }

    return res.status(200).json({ cuadrePrestamo });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener cuadre prestamo" });
  }
}

export async function editarCuadrePrestamo(req: any, res: any): Promise<any | undefined> {
  try {
    const { id } = req.params;
    const { descripcion, monto, diferencia, fecha } = req.body;

    const nuevaSalida = await prisma.pagosPrestamo.update({
      where: {
        id: Number(id),
      },
      data: {
        descripcion: descripcion,
        moonto: monto,
        diferencia: diferencia,
        fecha: parseDateFromDDMMYYYY(fecha),
      },
    });

    return res.status(200).json({
      nuevaSalida: nuevaSalida,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error al realizar la acción",
    });
  }
}

export async function editarCuadreDevolucion(req: any, res: any): Promise<any | undefined> {
  try {
    const { id } = req.params;
    const { deposito, pagado, tc, montoFinal, referencia, diferencia, fecha } = req.body;

    const nuevaDevolucion = await prisma.devolucionesPrestamo.update({
      where: {
        id: Number(id),
      },
      data: {
        deposito: deposito,
        pagado: pagado,
        tc: Number(tc) ?? 0,
        montoFinal: montoFinal,
        referencia: Number(referencia) ?? 0,
        diferencia: diferencia,
        fecha: parseDateFromDDMMYYYY(fecha),
      },
    });

    return res.status(200).json({
      nuevaDevolucion: nuevaDevolucion,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error al realizar la acción",
    });
  }
}

export async function registrarCuadrePrestamoSalida(req: any, res: any): Promise<any | undefined> {
  const { id } = req.params;

  try {
    const { descripcion, monto, diferencia, fecha } = req.body;

    let cuadrePrestamo = null;

    cuadrePrestamo = await prisma.cuadrePrestamo.findUnique({
      where: {
        prestamoId: Number(id),
      },
    });

    if (!cuadrePrestamo) {
      cuadrePrestamo = await prisma.cuadrePrestamo.create({
        data: {
          prestamo: {
            connect: { id: Number(id) },
          },
        },
      });
      console.log("CUADRE PRESTAMO: ", cuadrePrestamo);
    }

    const nuevaSalida = await prisma.pagosPrestamo.create({
      data: {
        cuadrePrestamo: {
          connect: { id: cuadrePrestamo?.id },
        },
        fecha: parseDateFromDDMMYYYY(fecha),
        moonto: monto,
        descripcion: descripcion,
        diferencia: diferencia,
      },
    });

    return res.status(201).json({
      cuadrePrestamo: nuevaSalida,
      pagoRealizado: nuevaSalida,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error al realizar la acción",
    });
  }
}

export async function registrarCuadrePrestamoDevolucion(
  req: any,
  res: any
): Promise<any | undefined> {
  try {
    const { id } = req.params;
    const { deposito, pagado, tc, montoFinal, referencia, diferencia, fecha } = req.body;

    console.log("ID ", id);

    let cuadrePrestamo = null;

    cuadrePrestamo = await prisma.cuadrePrestamo.findUnique({
      where: {
        prestamoId: Number(id),
      },
    });

    if (!cuadrePrestamo) {
      cuadrePrestamo = await prisma.cuadrePrestamo.create({
        data: {
          prestamo: {
            connect: { id: Number(id) },
          },
        },
      });

      console.log("CUADRE PRESTAMO: ", cuadrePrestamo);
    }

    const nuevaDevolucion = await prisma.devolucionesPrestamo.create({
      data: {
        cuadrePrestamo: {
          connect: { id: cuadrePrestamo?.id },
        },
        deposito: deposito,
        pagado: pagado,
        tc: Number(tc) ?? 0,
        montoFinal: montoFinal,
        referencia: Number(referencia) ?? 0,
        diferencia: diferencia,
        fecha: parseDateFromDDMMYYYY(fecha),
      },
    });

    return res.status(201).json({
      nuevaDevolucion: nuevaDevolucion,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error al realizar la acción",
    });
  }
}

export async function exportarExcelPrestamos(
  req: Request,
  res: Response
): Promise<any | undefined> {
  try {
    const { anio, nombreCliente } = req.body;

    if (!anio) {
      return res.status(400).json({ message: 'El campo "anio" es requerido en el body.' });
    }

    const anioNumber = parseInt(anio, 10);

    if (isNaN(anioNumber)) {
      return res.status(400).json({ message: 'El campo "anio" debe ser un número válido.' });
    }

    const whereConditions: Prisma.PrestamoOperacionWhereInput = {
      fechaInicial: {
        gte: new Date(anioNumber, 0, 1), // Inicio del año
        lt: new Date(anioNumber + 1, 0, 1), // Inicio del siguiente año
      },
    };

    if (nombreCliente) {
      const searchLower = nombreCliente.toLowerCase();
      whereConditions.usuario = {
        OR: [
          { apellido_paterno: { contains: searchLower } },
          { apellido_materno: { contains: searchLower } },
          { apellido_paterno_apo: { contains: searchLower } },
          { apellido_materno_apo: { contains: searchLower } },
          { nombres: { contains: searchLower } },
          { cliente: { contains: searchLower } },
          { cliente_2: { contains: searchLower } },
        ],
      };
    }

    // Obtener las operaciones de préstamo con sus relaciones de usuario, cuadre, salidas y devoluciones.
    const prestamosOperacion = await prisma.prestamoOperacion.findMany({
      where: whereConditions,
      include: {
        usuario: true, // Incluir los datos del usuario asociado al préstamo
        cuadrePrestamo: {
          include: {
            devolucionesPrestamo: true,
            salidasPrestamo: true,
          },
        },
      },
      orderBy: {
        fechaInicial: "desc",
      },
    });

    // Define las cabeceras de las columnas del archivo Excel según la estructura deseada.
    const headers = [
      "Fecha",
      "No",
      "Cliente",
      "Documento",
      "Capital (Soles)",
      "Capital (Dólares)",
      "Interés",
      "Monto Total",
      "Fecha Salida",
      "Descripción Salida", // Renombrado para mayor claridad
      "Monto Salida",
      "Diferencia Salida",
      "Fecha Devolución",
      "Descripción Devolución",
      "Pagado Devolución",
      "TC Devolución",
      "Monto Final Devolución",
      "Referencia Devolución",
      "Diferencia Devolución",
    ];

    const rows = prestamosOperacion.flatMap((pres) => {
      const usuario = pres.usuario ?? null;

      // Aplanar todas las salidas y devoluciones de todos los cuadrePrestamo para este préstamo
      const allSalidas = pres.cuadrePrestamo.flatMap((cuadre) => cuadre.salidasPrestamo || []);
      const allDevoluciones = pres.cuadrePrestamo.flatMap(
        (cuadre) => cuadre.devolucionesPrestamo || []
      );

      // Calcular la diferencia total de salidas para este préstamo
      let currentSal = Number(pres.capital_dolares || 0) + Number(pres.capital_soles || 0);
      allSalidas.forEach((salida) => {
        currentSal = Math.abs(currentSal) - Math.abs(Number(salida.moonto));
      });
      const diferencia_sal_total = Number(-currentSal.toFixed(2));

      // Calcular la diferencia total de devoluciones para este préstamo
      let currentDev = Number(pres.cobroTotal);
      allDevoluciones.forEach((devolucion) => {
        currentDev = Math.abs(currentDev) - Math.abs(Number(devolucion.montoFinal));
      });
      const diferencia_dev_total = Number(-currentDev.toFixed(2));

      const rowsForThisPrestamo: any[] = [];
      const maxLength = Math.max(allSalidas.length, allDevoluciones.length);

      // Si no hay salidas ni devoluciones, crear una única fila con los datos del préstamo
      // y las diferencias totales (que podrían ser el capital/cobro total si no hay movimientos).
      if (maxLength === 0) {
        rowsForThisPrestamo.push([
          pres.fechaInicial ?? null,
          pres.numero_prestamo ?? null,
          usuario ? `${usuario.nombres ?? ""} ${usuario.apellido_paterno ?? ""}`.trim() : null,
          usuario?.documento ?? null,
          Number(pres.capital_soles) ?? null,
          Number(pres.capital_dolares) ?? null,
          Number(pres.interes) ?? null,
          Number(pres.cobroTotal) ?? null,
          null, // Descripción Salida
          null, // Fecha Salida
          null, // Monto Salida
          Number(diferencia_sal_total || 0), // Diferencia Salida (total)
          null, // Fecha Devolución
          null,
          null, // Pagado Devolución
          null, // TC Devolución
          null, // Monto Final Devolución
          null, // Referencia Devolución
          Number(diferencia_dev_total || 0), // Diferencia Devolución (total)
        ]);
      } else {
        // Iterar hasta la longitud máxima de salidas o devoluciones para alinear las filas
        for (let i = 0; i < maxLength; i++) {
          const salida = allSalidas[i] || null;
          const devolucion = allDevoluciones[i] || null;

          rowsForThisPrestamo.push([
            pres.fechaInicial ?? null,
            pres.numero_prestamo ?? null,
            usuario ? `${usuario.nombres ?? ""} ${usuario.apellido_paterno ?? ""}`.trim() : null,
            usuario?.documento ?? null,
            Number(pres.capital_soles) ?? null,
            Number(pres.capital_dolares) ?? null,
            Number(pres.interes) ?? null,
            Number(pres.cobroTotal) ?? null,
            salida?.fecha ?? null, // Fecha Salida
            salida?.descripcion ?? null, // Descripción Salida
            Number(salida?.moonto || 0) ?? null, // Monto Salida
            i === 0 ? Number(diferencia_sal_total || 0) : null, // Diferencia Salida (solo en la primera fila)
            devolucion?.fecha ?? null, // Fecha Devolución
            devolucion?.deposito ?? null, // Descripción Devolución
            Number(devolucion?.pagado || 0) ?? null, // Pagado Devolución
            Number(devolucion?.tc || 0) ?? null, // TC Devolución
            Number(devolucion?.montoFinal || 0) ?? null, // Monto Final Devolución
            Number(devolucion?.referencia || 0) ?? null, // Referencia Devolución
            i === 0 ? Number(diferencia_dev_total || 0) : null, // Diferencia Devolución (solo en la primera fila)
          ]);
        }
      }
      return rowsForThisPrestamo;
    });

    // Crea la hoja de cálculo y el libro de Excel.
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Prestamos Detalle ${anioNumber}`);
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Configura las cabeceras de la respuesta HTTP para la descarga del archivo.
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=prestamos_detalle_${anioNumber}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (error) {
    console.error("Error al exportar el detalle de préstamos:", error);
    res.status(500).json({ message: "Error al exportar el detalle de préstamos" });
  } finally {
    await prisma.$disconnect();
  }
}

export async function borrarDevolucionesPrestamo(
  req: Request,
  res: Response
): Promise<any | undefined> {
  try {
    const { id } = req.params;

    const cuadrePrestamo = await prisma.devolucionesPrestamo.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!cuadrePrestamo) {
      return res.status(404).json({ error: "Cuadre prestamo no encontrado" });
    }

    const cuadreBorrada = await prisma.devolucionesPrestamo.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({ cuadreBorrada });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al borrar la operación" });
  } finally {
    prisma.$disconnect();
  }
}

export async function borrarSalidasPrestamo(req: Request, res: Response): Promise<any | undefined> {
  try {
    const { id } = req.params;

    const cuadrePrestamo = await prisma.pagosPrestamo.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!cuadrePrestamo) {
      return res.status(404).json({ error: "Cuadre prestamo no encontrado" });
    }

    const cuadreBorrada = await prisma.pagosPrestamo.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({ cuadreBorrada });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al borrar la operación" });
  } finally {
    prisma.$disconnect();
  }
}
