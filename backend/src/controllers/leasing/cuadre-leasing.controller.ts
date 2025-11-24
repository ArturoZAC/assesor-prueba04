import { Prisma } from "@prisma/client";
import prisma from "../../config/database";

import * as XLSX from "xlsx";

function parseDateFromDDMMYYYY(dateStr: string): Date {
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
}

export async function obtenerCuadreLeasings(req: any, res: any): Promise<any | undefined> {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = (req.query.search as string)?.trim() || "";

  const whereConditions: any = {};
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

  try {
    const total = await prisma.leasingOperacion.count({
      where: whereConditions,
    });

    const operacionesLeasing = await prisma.leasingOperacion.findMany({
      skip,
      take: limit,
      where: whereConditions,
      orderBy: {
        fecha_final: "desc",
      },
      include: {
        cuadreLeasing: {
          include: {
            pagosRealizados: {
              include: {
                detraccion: true,
                pagoLeasing: true,
              },
            },
          },
        },
        usuario: true,
      },
    });
    console.log(operacionesLeasing);
    return res.status(200).json({
      data: operacionesLeasing,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error al obtener cuadre leasing" });
  }
}

export async function registrarCuadreLeasing(req: any, res: any): Promise<any | undefined> {
  try {
    const {
      leasingId,
      deposito,
      depositoDet,
      pagadoDet,
      pagado,
      tcDet,
      tc,
      referencia,
      diferencia,
      diferenciaDet,
      fecha,
    } = req.body;

    console.log(req.body);

    let cuadreLeasingExistente = await prisma.cuadreLeasing.findUnique({
      where: {
        leasingId,
      },
    });

    if (!cuadreLeasingExistente) {
      cuadreLeasingExistente = await prisma.cuadreLeasing.create({
        data: {
          fecha: parseDateFromDDMMYYYY(fecha),
          leasing: {
            connect: { id: Number(leasingId) },
          },
        },
      });
    }
    const nuevoPagoRealizado = await prisma.pagoRealizadoLeasing.create({
      data: {
        cuadreLeasingId: cuadreLeasingExistente.id,
      },
    });

    const nuevoCuadrePago = await prisma.pagoLeasing.create({
      data: {
        CuadreLeasing: {
          connect: { id: nuevoPagoRealizado.id },
        },
        pagado: pagado,
        tc: tc ?? 0,
        fecha: parseDateFromDDMMYYYY(fecha),
        montoFinal: pagado,
        referencia: referencia ?? 0,
        deposito,
        diferencia: diferencia,
      },
    });

    const nuevoCuadreDetraccion = await prisma.detraccionLeasing.create({
      data: {
        CuadreLeasing: {
          connect: { id: nuevoPagoRealizado.id },
        },
        pagado: pagadoDet,
        tc: tcDet ?? 0,
        fecha: parseDateFromDDMMYYYY(fecha),
        montoFinal: pagadoDet,
        referencia: referencia,
        deposito: depositoDet,
        diferencia: diferenciaDet,
      },
    });

    return res.status(201).json({
      cuadreDetraccion: nuevoCuadreDetraccion,
      pagoRealizado: nuevoCuadrePago,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error al realizar la acción",
    });
  }
}

export async function borrarCuadreLeasing(req: any, res: any): Promise<any | undefined> {
  try {
    const { id, leasingId } = req.params;

    console.log(leasingId);

    const cuadreLeasingReal = await prisma.pagoRealizadoLeasing.findUnique({
      where: {
        id: Number(id),
      },
    });

    const cuadreLeasing = await prisma.pagoLeasing.findUnique({
      where: {
        cuadreLeasingRealizadoId: Number(cuadreLeasingReal?.id),
      },
    });

    const detraccion = await prisma.detraccionLeasing.findUnique({
      where: {
        cuadreLeasingRealizadoId: Number(cuadreLeasingReal?.id),
      },
    });

    if (cuadreLeasing) {
      const cuadreBorrada = await prisma.pagoLeasing.delete({
        where: {
          id: Number(cuadreLeasing.id),
        },
      });
      console.log(cuadreBorrada);
    }

    if (detraccion) {
      const detraccionBorrada = await prisma.detraccionLeasing.delete({
        where: {
          id: Number(detraccion.id),
        },
      });
      console.log(detraccionBorrada);
    }

    if (cuadreLeasingReal) {
      const cuadreLeasingRealBorrada = await prisma.pagoRealizadoLeasing.delete({
        where: {
          id: Number(cuadreLeasingReal.id),
        },
      });
      console.log(cuadreLeasingRealBorrada);
    }

    return res.status(200).json({ message: "Eliminado" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al borrar la operación" });
  } finally {
    prisma.$disconnect();
  }
}

export async function obtenerCuadreLeasingsPorId(req: any, res: any): Promise<any | undefined> {
  try {
    const { id } = req.params;
    const cuadreLeasing = await prisma.cuadreLeasing.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        pagosRealizados: {
          include: {
            detraccion: true,
            pagoLeasing: true,
          },
        },
      },
    });

    if (!cuadreLeasing) {
      return res.status(404).json({ error: "Cuadre leasing no encontrado" });
    }

    return res.status(200).json({ cuadreLeasing });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener cuadre leasing" });
  }
}

export async function editarCuadreLeasing(req: any, res: any): Promise<any | undefined> {
  const { id } = req.params;

  try {
    const {
      deposito,
      depositoDet,
      pagadoDet,
      pagado,
      tcDet,
      tc,
      referencia,
      referenciaDet,
      diferencia,
      diferenciaDet,
      fecha,
    } = req.body;

    let cuadreLeasingExistente = await prisma.pagoRealizadoLeasing.findUnique({
      where: {
        id: Number(id),
      },
    });

    let pagoLeasingExistente = await prisma.pagoLeasing.findUnique({
      where: {
        cuadreLeasingRealizadoId: cuadreLeasingExistente?.id ?? 0,
      },
    });

    let detraccionLeasingExistente = await prisma.detraccionLeasing.findUnique({
      where: {
        cuadreLeasingRealizadoId: cuadreLeasingExistente?.id ?? 0,
      },
    });

    const nuevoDetraccion = await prisma.detraccionLeasing.update({
      where: {
        id: detraccionLeasingExistente?.id,
      },
      data: {
        pagado: pagadoDet,
        tc: tcDet ?? 0,
        montoFinal: pagadoDet,
        referencia: referenciaDet ?? 0,
        deposito: depositoDet,
        diferencia: diferenciaDet,
        fecha: parseDateFromDDMMYYYY(fecha),
      },
    });

    const nuevoPago = await prisma.pagoLeasing.update({
      where: {
        id: pagoLeasingExistente?.id,
      },
      data: {
        pagado: pagado,
        tc: tc ?? 0,
        montoFinal: pagado,
        referencia: referencia ?? 0,
        deposito,
        diferencia: diferencia,
        fecha: parseDateFromDDMMYYYY(fecha),
      },
    });

    return res.status(200).json({
      cuadreDetraccion: nuevoDetraccion,
      pagoRealizado: nuevoPago,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error al realizar la acción",
    });
  }
}

export async function exportarTablaExcel(req: any, res: any): Promise<any | undefined> {
  try {
    const { nombre, anio } = req.body;

    // Construir filtros dinámicos
    const whereConditions: Prisma.LeasingOperacionWhereInput = {};

    // Filtro por año en fecha_inicial
    if (anio) {
      const startOfYear = new Date(anio, 0, 1); // 1 de enero del año
      const endOfYear = new Date(anio, 11, 31, 23, 59, 59); // 31 de diciembre del año
      whereConditions.fecha_inicial = {
        gte: startOfYear,
        lte: endOfYear,
      };
    }

    // Filtro por nombre del cliente
    if (nombre && nombre.trim() !== "") {
      whereConditions.usuario = {
        OR: [
          {
            nombres: {
              contains: nombre.trim(),
            },
          },
          {
            apellido_paterno: {
              contains: nombre.trim(),
            },
          },
          {
            apellido_materno: {
              contains: nombre.trim(),
            },
          },
        ],
      };
    }

    // Obtener datos de leasing con todas las relaciones necesarias
    const leasingData = await prisma.leasingOperacion.findMany({
      where: whereConditions,
      include: {
        usuario: true,
        cuadreLeasing: {
          include: {
            pagosRealizados: {
              include: {
                pagoLeasing: true,
                detraccion: true,
              },
            },
          },
        },
      },
    });

    // Adaptar los datos para Excel - crear una fila por cada pago realizado
    const adaptedData: any[] = [];

    leasingData.forEach((item) => {
      let diferencia_det = Number(item.cobroTotal);
      item.cuadreLeasing?.pagosRealizados?.forEach((cuadre) => {
        diferencia_det =
          Math.abs(diferencia_det) -
          Math.abs(
            Number(cuadre.pagoLeasing?.montoFinal) + Math.abs(Number(cuadre.detraccion?.pagado))
          );
      });

      // Si no hay pagos realizados, crear una fila con datos básicos
      if (!item.cuadreLeasing?.pagosRealizados || item.cuadreLeasing.pagosRealizados.length === 0) {
        adaptedData.push({
          fecha: item.fecha_inicial,
          cliente: `${item.usuario.apellido_paterno} ${item.usuario.apellido_materno}, ${item.usuario.nombres}`,
          documento: item.usuario.documento,
          monto: item.cobroTotal,
          monto_total: item.cobroTotal,
          fecha_pag: null,
          deposito_pag: null,
          pagado_pag: null,
          tc_pag: null,
          monto_final_pag: null,
          referencia_pag: null,
          diferencia_pag: null,
          deposito_det: null,
          pagado_det: null,
          tc_det: null,
          monto_final_det: null,
          referencia_det: null,
          diferencia_det: Number((-diferencia_det).toFixed(2)),
        });
      } else {
        // Crear una fila por cada pago realizado
        item.cuadreLeasing.pagosRealizados.forEach((pagoRealizado, index) => {
          adaptedData.push({
            fecha: item.fecha_inicial,
            cliente: `${item.usuario.apellido_paterno} ${item.usuario.apellido_materno}, ${item.usuario.nombres}`,
            documento: item.usuario.documento,
            monto: Number(item.cobroTotal),
            monto_total: Number(item.cobroTotal),
            fecha_pag: pagoRealizado.pagoLeasing?.fecha || null,
            deposito_pag: pagoRealizado.pagoLeasing?.deposito || null,
            pagado_pag: Number(pagoRealizado.pagoLeasing?.pagado) || null,
            tc_pag: Number(pagoRealizado.pagoLeasing?.tc) || null,
            monto_final_pag: Number(pagoRealizado.pagoLeasing?.montoFinal) || null,
            referencia_pag: Number(pagoRealizado.pagoLeasing?.referencia) || null,
            diferencia_pag: Number(pagoRealizado.pagoLeasing?.diferencia) || null,
            deposito_det: pagoRealizado.detraccion?.deposito || null,
            pagado_det: Number(pagoRealizado.detraccion?.pagado) || null,
            tc_det: Number(pagoRealizado.detraccion?.tc) || null,
            monto_final_det: Number(pagoRealizado.detraccion?.montoFinal) || null,
            referencia_det: Number(pagoRealizado.detraccion?.referencia) || null,
            diferencia_det: index === 0 ? Number((-diferencia_det).toFixed(2)) : null, // Solo mostrar diferencia en la primera fila
          });
        });
      }
    });

    // Definir las cabeceras del Excel
    const headers = [
      "Fecha",
      "Cliente",
      "Documento",
      "Monto",
      "Monto Total",
      "Fecha Pago",
      "Depósito Pago",
      "Pagado Pago",
      "TC Pago",
      "Monto Final Pago",
      "Referencia Pago",
      "Diferencia Pago",
      "Depósito Detracción",
      "Pagado Detracción",
      "TC Detracción",
      "Monto Final Detracción",
      "Referencia Detracción",
      "Diferencia Detracción",
    ];

    // Crear el workbook y worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(adaptedData, {
      header: Object.keys(adaptedData[0] || {}),
    });

    // Agregar las cabeceras personalizadas
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

    // Agregar el worksheet al workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cuadre Leasing");

    // Generar el buffer del archivo Excel
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    // Configurar headers de respuesta
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=cuadre-leasing.xlsx");

    return res.send(excelBuffer);
  } catch (error) {
    console.error("Error al exportar tabla Excel:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

/*
export async function exportarExcelLeasings(req: Request, res: Response): Promise<any> {
  try {
    const { anio, nombreCliente } = req.body;

    if (!anio) {
      return res.status(400).json({ message: 'El campo "anio" es requerido en el body.' });
    }

    const anioNumber = parseInt(anio, 10);
    if (isNaN(anioNumber)) {
      return res.status(400).json({ message: 'El campo "anio" debe ser un número válido.' });
    }

    const where: Prisma.CuadreLeasingWhereInput = {
      leasing: {
        createdAt: {
          gte: new Date(anioNumber, 0, 1),
          lt: new Date(anioNumber + 1, 0, 1),
        },
      },
    };

    if (nombreCliente) {
      const nombreLower = nombreCliente.toLowerCase();
      where.leasing = {
        usuario: {
          OR: [
            { apellido_paterno: { contains: nombreLower } },
            { apellido_materno: { contains: nombreLower } },
            { apellido_paterno_apo: { contains: nombreLower } },
            { apellido_materno_apo: { contains: nombreLower } },
            { nombres: { contains: nombreLower } },
            { cliente: { contains: nombreLower } },
            { cliente_2: { contains: nombreLower } },
          ],
        },
      };
    }

    const registros = await prisma.cuadreLeasing.findMany({
      where,
      include: {
        
        leasing: {
          include: {
            usuario: true,
          },
        },
      },
    });

    const headers = [
      'Año', 'Cuadre ID', 'Leasing ID', 'Cliente',
      'Fecha Creación Cuadre', 'Fecha Actualización Cuadre',
      'Salida ID', 'Descripción Salida', 'Monto Salida', 'Diferencia Salida',
      'Fecha Creación Salida', 'Fecha Actualización Salida',
      'Devolución ID', 'Depósito', 'Pagado', 'TC', 'Monto Final',
      'Referencia', 'Diferencia Devolución',
      'Fecha Creación Devolución', 'Fecha Actualización Devolución',
    ];

    const rows = registros.flatMap(reg => {
      const anioLeasing = reg.leasing?.createdAt?.getFullYear() || anioNumber;
      const cliente = `${reg.leasing?.usuario?.nombres ?? ''} ${reg.leasing?.usuario?.apellido_paterno ?? ''}`.trim();

      const salidaRows = reg.salidasLeasing.map(salida => [
        anioLeasing, reg.id, reg.leasingId, cliente,
        reg.createdAt?.toISOString() ?? '', reg.updatedAt?.toISOString() ?? '',
        salida.id, salida.descripcion, salida.moonto?.toNumber() ?? '', salida.diferencia?.toNumber() ?? '',
        salida.createdAt?.toISOString() ?? '', salida.updatedAt?.toISOString() ?? '',
        '', '', '', '', '', '', '', ''
      ]);

      const devolucionRows = reg.devolucionesLeasing.map(devolucion => [
        anioLeasing, reg.id, reg.leasingId, cliente,
        reg.createdAt?.toISOString() ?? '', reg.updatedAt?.toISOString() ?? '',
        '', '', '', '', '', '',
        devolucion.id, devolucion.deposito, devolucion.pagado?.toNumber() ?? '', devolucion.tc ?? '',
        devolucion.montoFinal?.toNumber() ?? '', devolucion.referencia ?? '', devolucion.diferencia?.toNumber() ?? '',
        devolucion.createdAt?.toISOString() ?? '', devolucion.updatedAt?.toISOString() ?? ''
      ]);

      return [...salidaRows, ...devolucionRows];
    });

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Cuadre Leasings Detalle ${anioNumber}`);
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', `attachment; filename=cuadre_leasings_detalle_${anioNumber}.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error('Error al exportar detalle de cuadre leasing:', error);
    res.status(500).json({ message: 'Error al exportar detalle de cuadre leasing' });
  } finally {
    await prisma.$disconnect();
  }
}
  */
