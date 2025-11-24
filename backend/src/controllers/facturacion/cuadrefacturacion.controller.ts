import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { compararFechas } from "../../logic/facturacion/compararFechas";
import { endOfMonth, startOfMonth } from "date-fns";
import prisma from "../../config/database";
import * as XLSX from "xlsx";

export const corregirFechasOctubre = async (req: Request, res: Response): Promise<any> => {
  try {
    // Filtro por fecha en string (dd/mm/yyyy)
    const fechaFiltro = "31/10/2025";

    // Obtener todos los registros de cuadreFacturacion para esa fecha
    const cuadres = await prisma.cuadreFacturacion.findMany({
      where: {
        fechaCuadre: fechaFiltro, // asumiendo que fechaCuadre es string "dd/mm/yyyy"
      },
    });

    let filasActualizadas = 0;

    for (const cuadre of cuadres) {
      const facturacion = await prisma.facturacionOperacion.findUnique({
        where: { id: cuadre.facturacionId },
      });

      if (!facturacion || !facturacion.fecha) continue;

      const fechaCuadreStr = cuadre.fechaCuadre; // "dd/mm/yyyy"
      const fechaOperacionDate = facturacion.fecha; // Date desde DB

      // Comparar fecha ignorando horas y zona horaria
      const nuevaDifFecha = compararFechas(fechaCuadreStr, fechaOperacionDate);

      // console.log(
      //   `ID: ${
      //     cuadre.id
      //   } | DifFecha: ${nuevaDifFecha} | Cuadre: ${fechaCuadreStr} | Operacion: ${fechaOperacionDate.toISOString()}`
      // );

      // Actualizar la diferencia de fecha en la tabla
      await prisma.cuadreFacturacion.update({
        where: { id: cuadre.id },
        data: { difFecha: nuevaDifFecha },
      });

      filasActualizadas++;
    }

    return res.status(200).json({
      mensaje: `Fechas del 31/10/2025 recalculadas correctamente`,
      filasActualizadas,
    });
  } catch (error) {
    console.error("Error al corregir fechas:", error);
    return res.status(500).json({
      mensaje: "Error al corregir fechas",
      error,
    });
  }
};

export const registrarCuadreFacturacion = async (
  req: Request,
  res: Response
): Promise<any | undefined> => {
  try {
    const {
      facturacionId,
      fechaCuadre,
      docCuadre,
      clienteCuadre,
      rucCuadre,
      subtotalCuadre,
      igvCuadre,
      totalCuadre,
      numeroCuadre,
    } = req.body;
    let difFecha = "";
    let difMonto = "";
    let difDocumento = "";

    const facturacion = await prisma.facturacionOperacion.findUnique({
      where: {
        id: facturacionId,
      },
      include: {
        operacion: true,
      },
    });

    if (facturacion?.tipo === "COMPRA") {
      if (Number(subtotalCuadre) === Number(facturacion.recibe)) {
        difMonto = "MONTO OK";
      } else {
        difMonto = "ERROR";
      }
    } else {
      if (Number(subtotalCuadre) === Number(facturacion?.entrega)) {
        difMonto = "MONTO OK";
      } else {
        difMonto = "ERROR";
      }
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: String(facturacion?.usuarioId),
      },
    });
    console.log("USUARIO ", usuario?.documento);
    console.log("RUC", rucCuadre);
    if (String(usuario?.documento).trim() === String(rucCuadre).trim()) {
      difDocumento = "CLIENTE OK";
    } else {
      difDocumento = "ERROR";
    }
    console.log(fechaCuadre);
    // difFecha = compararFechas(fechaCuadre, String(facturacion?.fecha));
    difFecha = compararFechas(fechaCuadre, facturacion?.fecha!);

    const nuevoCuadre = await prisma.cuadreFacturacion.create({
      data: {
        difFecha,
        difMonto,
        difDocumento,
        fechaCuadre,
        docCuadre,
        numeroCuadre,
        clienteCuadre,
        rucCuadre: rucCuadre || null,
        subtotalCuadre: parseFloat(subtotalCuadre),
        totalCuadre,
        igvCuadre,
        facturacion: {
          connect: {
            id: Number(facturacionId),
          },
        },
      },
    });

    return res
      .status(201)
      .json({ mensaje: "Cuadre de facturación registrado exitosamente", data: nuevoCuadre });
  } catch (error) {
    console.error("Error al registrar el cuadre de facturación:", error);
    return res
      .status(500)
      .json({ mensaje: "Error al registrar el cuadre de facturación", error: error });
  }
};

export const obtenerTodosCuadreFacturacion = async (
  req: any,
  res: any
): Promise<any | undefined> => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = (req.query.search as string)?.trim() || "";
  const tipoBoleta = (req.query.boleta as string).toUpperCase() || "";
  const searchLower = search.toLowerCase() ?? "";
  const fecha = (req.query.fecha as string)?.trim() || "";

  const whereConditions: Prisma.FacturacionOperacionWhereInput = {};

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

  if (searchLower) {
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

  if (tipoBoleta) {
    whereConditions.cuadreFacturacion = {
      every: {
        docCuadre: tipoBoleta,
      },
    };
  }

  try {
    const [todosCuadre, total] = await prisma.$transaction([
      prisma.facturacionOperacion.findMany({
        include: {
          usuario: true,
          cuadreFacturacion: true,
          operacion: true,
        },
        take: limit,
        skip,
        where: whereConditions,
        orderBy: {
          op: "desc",
        },
      }),
      prisma.facturacionOperacion.count({
        where: whereConditions,
      }),
    ]);
    return res.status(200).json({
      data: todosCuadre,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Error al obtener los cuadres de facturación:", error);
    return res
      .status(500)
      .json({ mensaje: "Error al obtener los cuadres de facturación", error: error });
  }
};

export const editarCuadreFacturacion = async (
  req: Request,
  res: Response
): Promise<any | undefined> => {
  try {
    const { id } = req.params;
    const {
      facturacionId,
      fechaCuadre,
      docCuadre,
      clienteCuadre,
      rucCuadre,
      subtotalCuadre,
      igvCuadre,
      totalCuadre,
      numeroCuadre,
    } = req.body;

    let difFecha = "";
    let difMonto = "";
    let difDocumento = "";

    const facturacion = await prisma.facturacionOperacion.findUnique({
      where: {
        id: facturacionId,
      },
      include: {
        operacion: true,
      },
    });
    console.log(facturacion?.tipo);

    if (facturacion?.tipo === "COMPRA") {
      if (Number(totalCuadre) === Number(facturacion.recibe)) {
        difMonto = "MONTO OK";
      } else {
        difMonto = "ERROR";
      }
    } else {
      if (Number(subtotalCuadre) === Number(facturacion?.entrega)) {
        difMonto = "MONTO OK";
      } else {
        difMonto = "ERROR";
      }
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: String(facturacion?.usuarioId),
      },
    });
    console.log("USUARIO ", usuario?.documento);
    console.log("RUC", rucCuadre);
    if (String(usuario?.documento).trim() === String(rucCuadre).trim()) {
      difDocumento = "CLIENTE OK";
    } else {
      difDocumento = "ERROR";
    }

    // difFecha = compararFechas(fechaCuadre, String(facturacion?.fecha));
    difFecha = compararFechas(fechaCuadre, facturacion?.fecha!);

    const cuadreActualizado = await prisma.cuadreFacturacion.update({
      where: {
        id: parseInt(id),
      },
      data: {
        difFecha,
        difMonto,
        difDocumento,
        fechaCuadre,
        docCuadre,
        clienteCuadre,
        rucCuadre: rucCuadre || null,
        subtotalCuadre: parseFloat(subtotalCuadre),
        igvCuadre,
        totalCuadre: totalCuadre,
        numeroCuadre,
      },
    });

    return res
      .status(200)
      .json({ mensaje: "Cuadre de facturación actualizado exitosamente", data: cuadreActualizado });
  } catch (error) {
    console.error("Error al editar el cuadre de facturación:", error);
    return res
      .status(500)
      .json({ mensaje: "Error al editar el cuadre de facturación", error: error });
  }
};

export const obtenerCuadreFacturacionPorId = async (
  req: Request,
  res: Response
): Promise<any | undefined> => {
  try {
    const { id } = req.params;
    const cuadreFacturacion = await prisma.cuadreFacturacion.findMany({
      where: {
        facturacionId: Number(id),
      },
      include: {
        facturacion: true,
      },
    });

    if (!cuadreFacturacion) {
      return res.status(404).json({ error: "Cuadre facturación no encontrado" });
    }

    return res.status(200).json({ cuadreFacturacion });
  } catch (error) {
    console.error("Error al obtener el cuadre facturación:", error);
    return res.status(500).json({ error: "Error al obtener el cuadre facturación" });
  }
};

export const eliminarCuadreFacturacion = async (
  req: Request,
  res: Response
): Promise<any | undefined> => {
  try {
    const { id } = req.params;

    const cuadreFacturacion = await prisma.cuadreFacturacion.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!cuadreFacturacion) {
      return res.status(404).json({ message: "Cuadre facturación no encontrado" });
    }

    const cuadreBorrada = await prisma.cuadreFacturacion.delete({
      where: {
        id: Number(id),
      },
    });

    return res
      .status(200)
      .json({ cuadreBorrada, message: "Cuadre facturación borrado exitosamente" });
  } catch (error) {
    console.error("Error al borrar el cuadre facturación:", error);
    return res.status(500).json({ message: "Error al borrar el cuadre facturación" });
  } finally {
    prisma.$disconnect();
  }
};

export const exportarExcelCuadreFacturacion = async (
  req: Request,
  res: Response
): Promise<any | undefined> => {
  const fecha = (req.body.fecha as string)?.trim() || "";
  const searchLower = (req.body.nombre as string)?.trim() || "";

  try {
    const whereConditions: Prisma.FacturacionOperacionWhereInput = {};

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

    if (searchLower) {
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

    // Obtener datos con relaciones
    const datos = await prisma.facturacionOperacion.findMany({
      include: {
        cuadreFacturacion: true,
        usuario: true,
      },
      where: whereConditions,
      orderBy: {
        op: "asc",
      },
    });

    const exportData: any[] = [];

    for (const item of datos) {
      // Si no tiene ningún cuadreFacturacion, aún queremos una fila
      if (item.cuadreFacturacion.length === 0) {
        exportData.push({
          "Fecha Op": item.fecha.toISOString().split("T")[0] ?? "",
          Cliente: `${item.usuario?.apellido_paterno} ${item.usuario?.apellido_materno}, ${item.usuario?.nombres}`,
          "Doc Cliente": item.usuario?.numero_documento ?? "",
          Monto: item.tipo === "COMPRA" ? item.recibe.toString() : item.entrega.toString(),
          Fecha: "",
          Doc: "",
          Numero: "",
          "Client Cuadre": "",
          Ruc: "",
          Subtotal: "",
          IGV: "",
          Total: "",
          M: "",
          "Diferencia Fecha": "",
          "Diferencia Monto": "",
          "Diferencia Documento": "",
        });
      } else {
        // Si hay varios cuadreFacturacion, crear una fila por cada uno
        for (const cuadre of item.cuadreFacturacion) {
          exportData.push({
            "Fecha Op": item.fecha.toISOString().split("T")[0] ?? "",
            Cliente: `${item.usuario?.apellido_paterno} ${item.usuario?.apellido_materno}, ${item.usuario?.nombres}`,
            "Doc Cliente": item.usuario?.numero_documento ?? "",
            Monto: item.tipo === "COMPRA" ? item.recibe.toString() : item.entrega.toString(),
            Fecha: cuadre.fechaCuadre ?? "",
            Doc: cuadre.docCuadre ?? "",
            Numero: cuadre.numeroCuadre ?? "",
            "Client Cuadre": cuadre.clienteCuadre ?? "",
            Ruc: cuadre.rucCuadre ?? "",
            Subtotal: cuadre.subtotalCuadre?.toString() ?? "",
            IGV: cuadre.igvCuadre?.toString() ?? "",
            Total: cuadre.totalCuadre?.toString() ?? "",
            M: "S",
            "Diferencia Fecha": cuadre.difFecha ?? "",
            "Diferencia Monto": cuadre.difMonto ?? "",
            "Diferencia Documento": cuadre.difDocumento ?? "",
          });
        }
      }
    }

    // Crear hoja y libro
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte Cuadre");

    // Buffer y envío
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    res.setHeader("Content-Disposition", "attachment; filename=cuadre_facturacion.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.end(buffer);
  } catch (error: any) {
    console.error("Error exportando Excel:", error);
    res.status(500).json({
      message: "Error al exportar el archivo Excel",
      error: error.message,
    });
  }
};
