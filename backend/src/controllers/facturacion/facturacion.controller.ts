import { Prisma } from "@prisma/client";
import { endOfMonth, startOfMonth } from "date-fns";
import { Response, Request } from "express";
import { formatearTablaFecha } from "../../logic/formatearTablaFecha";
import * as XLSX from "xlsx";
import prisma from "../../config/database";

export async function obtenerFacturacion(req: any, res: Response): Promise<any | undefined> {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const [facturacion, total] = await prisma.$transaction([
      prisma.facturacionOperacion.findMany({
        skip,
        take: limit,
        orderBy: {
          op: "desc",
        },
        include: {
          operacion: true,
          usuario: true,
        },
      }),
      prisma.facturacionOperacion.count(),
    ]);

    return res
      .status(200)
      .json({
        data: facturacion,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error al obtener facturacion" });
  }
}

export async function exportarFacturacionExcel(
  req: Request,
  res: Response
): Promise<any | undefined> {
  try {
    const { nombre, fecha, tipo } = req.body;

    const whereConditions: Prisma.FacturacionOperacionWhereInput = {};

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
        const year = now.getUTCFullYear(); // podrías hacerlo dinámico si lo necesitás
        const fechaReferencia = new Date(year, mesNumero, 1);

        const startDate = startOfMonth(fechaReferencia);
        const endDate = endOfMonth(fechaReferencia);

        whereConditions.fecha = {
          gte: startDate,
          lte: endDate,
        };
      }
    }

    if (tipo) {
      whereConditions.tipo = {
        equals: tipo,
      };
    }

    const facturaciones = await prisma.facturacionOperacion.findMany({
      where: whereConditions,
      include: {
        usuario: true,
        operacion: true,
      },
    });

    // Define las cabeceras de las columnas del archivo Excel.
    const headers = [
      "Fecha",
      "Nombre",
      "Documento",
      "Unit",
      "Glosa",
      "Op",
      "Tipo",
      "Acción",
      "Monto",
      "TC",
      "Entrega",
      "M1",
      "Recibe",
      "M2",
    ];

    // Mapea los datos de las operaciones de facturación al formato de array de arrays para Excel.
    const rows = facturaciones.map((facturacion) => [
      `${formatearTablaFecha(String(facturacion.fecha))}`,
      `${facturacion.usuario.nombres} ${facturacion.usuario.apellido_paterno} ${facturacion.usuario.apellido_materno}`,
      facturacion.usuario.documento,
      facturacion.unit.toNumber(),
      facturacion.glosa,
      facturacion.op,
      facturacion.tipo,
      facturacion.accion,
      facturacion.monto.toNumber(),
      facturacion.tc.toNumber(),
      facturacion.entrega.toNumber(),
      facturacion.m1,
      facturacion.recibe.toNumber(),
      facturacion.m2,
    ]);

    // Crea la hoja de cálculo y el libro de Excel.
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FacturacionOperaciones");

    // Convierte el libro a un buffer para la respuesta.
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Establece las cabeceras de la respuesta HTTP para la descarga del archivo.
    res.setHeader("Content-Disposition", "attachment; filename=facturacion_operaciones.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // Envía el archivo Excel como respuesta.
    res.send(buffer);
  } catch (error) {
    console.error("Error al exportar facturación a Excel:", error);
    res.status(500).json({ message: "Error al exportar facturación a Excel" });
  }
}
