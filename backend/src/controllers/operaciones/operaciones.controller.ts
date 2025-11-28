import {
  subDays,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  format,
  startOfYear,
  endOfYear,
} from "date-fns";
import { es } from "date-fns/locale";
import * as XLSX from "xlsx";
import multer from "multer";

import { Request, Response } from "express";
import { MonthlyTotalOperacion } from "../../interfaces/operacion.interface";
import prisma from "../../config/database";
import { formatearNumeroDecimal } from "../../logic/formatearNumeroDecimal";
import { guardarError } from "../../logic/guardarErrores";

// const redondear = (valor: number) => parseFloat(valor.toFixed(10));

export function redondearComoExcel(num: number, decimales: number) {
  /*
  const factor = Math.pow(10, decimales);
  return Math.round(num * factor) / factor;
  */
  const factor = Math.pow(10, decimales);
  const adjustedNum = num + (num > 0 ? Number.EPSILON : -Number.EPSILON);

  const roundedValue = Math.round(adjustedNum * factor) / factor;
  return parseFloat(roundedValue.toFixed(decimales));
  /*
   const roundedString = num.toFixed(decimales);
   return parseFloat(roundedString);
   */
}

const calcularUSD = (
  tipo: "promedio" | "estricto" | "potencial",
  promedio: number,
  compra: number,
  venta: number,
  montoUSD: number
) => {
  const tProm = Number(promedio);
  const tCompra = Number(compra);
  const tVenta = Number(venta);

  switch (tipo) {
    case "promedio":
      return montoUSD * tProm;
    case "estricto":
      return montoUSD * (montoUSD >= 0 ? tCompra : tVenta);
    case "potencial":
      return montoUSD * (montoUSD >= 0 ? tVenta : tCompra);
  }
};

export const registrarOperacion = async (req: any, res: any) => {
  try {
    const {
      fecha,
      usuarioId,
      tipo,
      dolares,
      compra,
      venta,
      spread,
      promedio,
      montoUSD,
      montoPEN,
      movimiento_compraUSD,
      movimiento_ventaUSD,
      t,
    } = req.body;

    // Los registros de FlujoFondos y Movimiento se crearán usando nested create en la operación

    const ultimoRegistro = await prisma.operacion.findFirst({
      orderBy: {
        numero: "desc",
      },
      include: {
        flujoFondos: true,
        movimiento: true,
        rendimiento: true,
        resultado: true,
        saldoFinal: true,
        tipoCambio: true,
      },
    });

    // Calcular valores para los registros relacionados
    const saldoFinalMontoUSD = (ultimoRegistro?.saldoFinal?.montoUSD ?? 0) + montoUSD;
    const saldoFinalMontoPEN = (ultimoRegistro?.saldoFinal?.montoPEN ?? 0) + montoPEN;

    const resultadoSimple = Number(
      calcularUSD("promedio", promedio, compra, venta, saldoFinalMontoUSD) + saldoFinalMontoPEN
    );

    const resultadoEstricto = Number(
      calcularUSD("estricto", promedio, compra, venta, saldoFinalMontoUSD) + saldoFinalMontoPEN
    );

    const resultadoPotencial = Number(
      calcularUSD("potencial", promedio, compra, venta, saldoFinalMontoUSD) + saldoFinalMontoPEN
    );

    const rendimientoForzado = Number(
      resultadoEstricto - (ultimoRegistro?.resultado?.estricto ?? 0)
    );

    const rendimientoMedio = Number(
      resultadoSimple - (Number(ultimoRegistro?.resultado?.simple) ?? 0)
    );

    const rendimientoEsperado = Number(
      resultadoPotencial - (ultimoRegistro?.resultado?.potencial ?? 0)
    );

    const ultimaOperacion = await prisma.operacion.findFirst({
      orderBy: { numero: "desc" },
    });

    const nuevoNumero = (ultimaOperacion?.numero ?? 11999) + 1;
    console.log(nuevoNumero);

    // Usar transacción para crear todos los registros en el orden correcto
    const operacion = await prisma.$transaction(async (tx) => {
      // Crear registros relacionados primero
      const tipoCambio = await tx.tipoCambioOperacion.create({
        data: {
          compra: Number(compra),
          venta: Number(venta),
          spread: Number(spread),
          promedio: Number(promedio),
        },
      });

      const flujoFondos = await tx.flujoFondosOperacion.create({
        data: {
          montoPEN: Number(montoPEN),
          montoUSD: Number(montoUSD),
        },
      });

      const movimiento = await tx.movimientoFondosOperacion.create({
        data: {
          compraUSD: Number(movimiento_compraUSD),
          ventaUSD: Number(movimiento_ventaUSD),
        },
      });

      const saldoFinal = await tx.saldoFinalOperacion.create({
        data: {
          montoUSD: saldoFinalMontoUSD,
          montoPEN: saldoFinalMontoPEN,
        },
      });

      const resultado = await tx.resultadoOperacion.create({
        data: {
          simple: resultadoSimple,
          estricto: resultadoEstricto,
          potencial: resultadoPotencial,
        },
      });

      const rendimiento = await tx.rendimientoOperacion.create({
        data: {
          forzado: rendimientoForzado,
          medio: rendimientoMedio,
          esperado: rendimientoEsperado,
        },
      });

      // Crear la operación principal conectando todos los registros
      return await tx.operacion.create({
        data: {
          t: String(t),
          fecha: new Date(fecha),
          numero: nuevoNumero,
          usuario: {
            connect: {
              id: usuarioId,
            },
          },
          tipo,
          dolares,
          tipoCambio: { connect: { id: tipoCambio.id } },
          flujoFondos: { connect: { id: flujoFondos.id } },
          movimiento: { connect: { id: movimiento.id } },
          saldoFinal: { connect: { id: saldoFinal.id } },
          resultado: { connect: { id: resultado.id } },
          rendimiento: { connect: { id: rendimiento.id } },
        },
      });
    });

    /************************** CREAR FACTURACION **************************/

    const glosa = ` OP-${operacion.numero} - ASSESOR ${
      tipo === "COMPRA" ? "COMPRA" : "VENDE"
    } ${Number(Math.abs(montoUSD)).toFixed(2)} USD. TIPO DE CAMBIO: ${
      tipo === "COMPRA" ? compra : venta
    }. CLIENTE ENVIA: ${
      tipo === "COMPRA"
        ? Number(Math.abs(montoUSD)).toFixed(2)
        : Number(Math.abs(montoPEN)).toFixed(2)
    } ${tipo === "COMPRA" ? "USD" : "PEN"}. CLIENTE RECIBE: ${
      tipo === "COMPRA"
        ? Number(Math.abs(dolares) * Math.abs(compra)).toFixed(2)
        : Number(Math.abs(dolares)).toFixed(2)
    } ${tipo === "COMPRA" ? "PEN" : "USD"}.`;

    const facturacion = await prisma.facturacionOperacion.create({
      data: {
        unit: Number(Number(montoPEN).toFixed(2)),
        glosa,
        op: operacion.numero,
        tipo,
        accion: tipo === "COMPRA" ? "COMPRA" : "VENDE",
        entrega: tipo === "COMPRA" ? montoUSD : montoPEN,
        m1: tipo === "COMPRA" ? "USD" : "PEN",
        m2: tipo === "COMPRA" ? "PEN" : "USD",
        recibe: tipo === "COMPRA" ? dolares * compra : dolares,
        monto: dolares,
        tc: tipo === "COMPRA" ? compra : venta,
        fecha: new Date(fecha),
        operacion: {
          connect: {
            id: operacion.id,
          },
        },
        usuario: {
          connect: {
            id: usuarioId,
          },
        },
      },
    });

    res.status(201).json({
      message: "Operación registrada correctamente",
      operacion,
      facturacion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar la operación" });
  } finally {
    prisma.$disconnect();
  }
};

export const editarOperacion = async (req: any, res: any) => {
  try {
    let { id } = req.params;
    id = Number(id);
    const {
      fecha,
      numero,
      usuarioId,
      tipo,
      dolares,
      compra,
      venta,
      spread,
      promedio,
      montoUSD,
      montoPEN,
      movimiento_compraUSD,
      movimiento_ventaUSD,
      t,
    } = req.body;
    const operacionExistente = id
      ? await prisma.operacion.findUnique({
          where: { id },
          include: {
            tipoCambio: true,
            flujoFondos: true,
            movimiento: true,
            saldoFinal: true,
            resultado: true,
            rendimiento: true,
          },
        })
      : null;
    console.log("OPERACION: ", operacionExistente);
    const ultimoRegistro = await prisma.operacion.findFirst({
      where: {
        numero: Number(operacionExistente?.numero ?? 1) - 1,
      },
      orderBy: { numero: "desc" },
      include: {
        tipoCambio: true,
        flujoFondos: true,
        movimiento: true,
        saldoFinal: true,
        resultado: true,
        rendimiento: true,
      },
    });
    console.log("ULTIMO REGISTRO: ", ultimoRegistro);

    if (!ultimoRegistro) {
      return res.status(404).json({
        error: `La operación ${
          Number(operacionExistente?.numero) - 1
        } no existe, ingrese su operación faltante por importación masiva para evitar problemas y edite denuevo`,
      });
    }
    const ventaRedon = Number(venta);
    const compraRedon = Number(compra);
    const promedioRedon = Number(promedio);
    const spreadRedon = Number(spread);

    const montoPenRedon = Number(montoPEN);
    const montoUSDRedon = Number(montoUSD);

    const movimiento_compraUSDRedon = Number(movimiento_compraUSD);
    const movimiento_ventaUSDRedon = Number(movimiento_ventaUSD);

    // --- Crear o actualizar Tipo de Cambio ---
    const tipoCambio = operacionExistente?.tipoCambio
      ? await prisma.tipoCambioOperacion.update({
          where: { id: operacionExistente.tipoCambio.id },
          data: {
            compra: compraRedon,
            venta: ventaRedon,
            spread: spreadRedon,
            promedio: promedioRedon,
          },
        })
      : await prisma.tipoCambioOperacion.create({
          data: {
            compra: compraRedon,
            venta: ventaRedon,
            spread: ventaRedon,
            promedio: promedioRedon,
          },
        });

    // --- Crear o actualizar Flujo de Fondos ---
    const flujoFondos = operacionExistente?.flujoFondos
      ? await prisma.flujoFondosOperacion.update({
          where: { id: operacionExistente.flujoFondos.id },
          data: { montoPEN: montoPenRedon, montoUSD: montoUSDRedon },
        })
      : await prisma.flujoFondosOperacion.create({
          data: { montoPEN: montoPenRedon, montoUSD: montoUSDRedon },
        });

    // --- Crear o actualizar Movimiento de Fondos ---
    const movimiento = operacionExistente?.movimiento
      ? await prisma.movimientoFondosOperacion.update({
          where: { id: operacionExistente.movimiento.id },
          data: {
            compraUSD: movimiento_compraUSDRedon,
            ventaUSD: movimiento_ventaUSDRedon,
          },
        })
      : await prisma.movimientoFondosOperacion.create({
          data: {
            compraUSD: movimiento_compraUSDRedon,
            ventaUSD: movimiento_ventaUSDRedon,
          },
        });

    const saldoFinal = operacionExistente?.saldoFinal
      ? await prisma.saldoFinalOperacion.update({
          where: { id: operacionExistente.saldoFinal.id },
          data: {
            montoUSD: (ultimoRegistro?.saldoFinal?.montoUSD ?? 0) + montoUSD,
            montoPEN: (ultimoRegistro?.saldoFinal?.montoPEN ?? 0) + montoPEN,
          },
        })
      : await prisma.saldoFinalOperacion.create({
          data: {
            montoUSD: (ultimoRegistro?.saldoFinal?.montoUSD ?? 0) + montoUSD,
            montoPEN: (ultimoRegistro?.saldoFinal?.montoPEN ?? 0) + montoPEN,
          },
        });

    console.log(
      "RESULTADO OPERACION SIMPLE :",
      calcularUSD("promedio", promedio, compra, venta, saldoFinal.montoUSD),
      saldoFinal.montoPEN
    );
    console.log(
      "RESULTADO RESULTADO DE LA OPERACION :",
      calcularUSD("promedio", promedio, compra, venta, saldoFinal.montoUSD) + saldoFinal.montoPEN
    );
    const resultado = operacionExistente?.resultado
      ? await prisma.resultadoOperacion.update({
          where: { id: operacionExistente.resultado.id },
          data: {
            simple: Number(
              calcularUSD("promedio", promedio, compra, venta, saldoFinal.montoUSD) +
                saldoFinal.montoPEN
            ),
            estricto: Number(
              calcularUSD("estricto", promedio, compra, venta, saldoFinal.montoUSD) +
                saldoFinal.montoPEN
            ),
            potencial: Number(
              calcularUSD("potencial", promedio, compra, venta, saldoFinal.montoUSD) +
                saldoFinal.montoPEN
            ),
          },
        })
      : await prisma.resultadoOperacion.create({
          data: {
            simple: Number(
              calcularUSD("promedio", promedio, compra, venta, saldoFinal.montoUSD) +
                saldoFinal.montoPEN
            ),
            estricto: Number(
              calcularUSD("estricto", promedio, compra, venta, saldoFinal.montoUSD) +
                saldoFinal.montoPEN
            ),
            potencial: Number(
              calcularUSD("potencial", promedio, compra, venta, saldoFinal.montoUSD) +
                saldoFinal.montoPEN
            ),
          },
        });

    const rendimiento = operacionExistente?.rendimiento
      ? await prisma.rendimientoOperacion.update({
          where: { id: operacionExistente.rendimiento.id },
          data: {
            forzado: Number(resultado.estricto - Number(ultimoRegistro?.resultado?.estricto)),
            medio: Number(resultado.simple - Number(ultimoRegistro?.resultado?.simple)),
            esperado: Number(resultado.potencial - Number(ultimoRegistro?.resultado?.potencial)),
          },
        })
      : await prisma.rendimientoOperacion.create({
          data: {
            forzado: Number(resultado.estricto - (ultimoRegistro?.resultado?.estricto ?? 0)),
            medio: Number(resultado.simple - (ultimoRegistro?.resultado?.simple ?? 0)),
            esperado: Number(resultado.potencial - (ultimoRegistro?.resultado?.potencial ?? 0)),
          },
        });

    // --- Crear o actualizar operación principal ---
    const operacion = id
      ? await prisma.operacion.update({
          where: { id },
          data: {
            fecha: new Date(fecha),
            numero,
            t: String(t),
            tipo,
            dolares: Number(dolares),
            usuario: { connect: { id: usuarioId } },
            tipoCambio: { connect: { id: tipoCambio.id } },
            flujoFondos: { connect: { id: flujoFondos.id } },
            movimiento: { connect: { id: movimiento.id } },
            saldoFinal: { connect: { id: saldoFinal.id } },
            resultado: { connect: { id: resultado.id } },
            rendimiento: { connect: { id: rendimiento.id } },
          },
          include: {
            tipoCambio: true,
            flujoFondos: true,
            rendimiento: true,
            movimiento: true,
            saldoFinal: true,
            resultado: true,
          },
        })
      : await prisma.operacion.create({
          data: {
            fecha: new Date(fecha),
            numero,
            tipo,
            t: String(t),
            dolares,
            usuario: { connect: { id: usuarioId } },
            tipoCambio: { connect: { id: tipoCambio.id } },
            flujoFondos: { connect: { id: flujoFondos.id } },
            movimiento: { connect: { id: movimiento.id } },
            saldoFinal: { connect: { id: saldoFinal.id } },
            resultado: { connect: { id: resultado.id } },
            rendimiento: { connect: { id: rendimiento.id } },
          },
          include: {
            tipoCambio: true,
            flujoFondos: true,
            rendimiento: true,
            movimiento: true,
            saldoFinal: true,
            resultado: true,
          },
        });
    console.log("OPERACION ACTUALIZADA: ", operacion);
    /** EDITAR FACTURACIÓN  */
    const facturacion = await prisma.facturacionOperacion.findFirst({
      where: {
        operacionId: operacion.id,
      },
    });

    const glosa = ` OP-${operacion.numero} - ASSESOR ${
      tipo === "COMPRA" ? "COMPRA" : "VENDE"
    } ${Math.abs(montoUSD)} USD. TIPO DE CAMBIO: ${
      tipo === "COMPRA" ? Math.abs(compra) : Math.abs(venta)
    }. CLIENTE ENVIA: ${tipo === "COMPRA" ? Math.abs(montoUSD) : Math.abs(montoPEN)} ${
      tipo === "COMPRA" ? "USD" : "PEN"
    }. CLIENTE RECIBE: ${
      tipo === "COMPRA" ? Math.abs(dolares) * Math.abs(compra) : Math.abs(dolares)
    } ${tipo === "COMPRA" ? "PEN" : "USD"}.`;

    if (facturacion) {
      await prisma.facturacionOperacion.update({
        where: {
          id: facturacion.id,
        },
        data: {
          glosa,
          fecha: new Date(fecha),
          op: operacion.numero,
          tipo,
          unit: Number(Number(flujoFondos.montoPEN).toFixed(2)),
          accion: tipo === "COMPRA" ? "COMPRA" : "VENTA",
          entrega: tipo === "COMPRA" ? flujoFondos.montoUSD : flujoFondos.montoPEN,
          m1: tipo === "COMPRA" ? "USD" : "PEN",
          m2: tipo === "COMPRA" ? "PEN" : "USD",
          recibe: tipo === "COMPRA" ? dolares * tipoCambio.compra : dolares,
          monto: dolares,
          tc: tipo === "COMPRA" ? tipoCambio.compra : tipoCambio.venta,
          operacion: {
            connect: {
              id: operacion.id,
            },
          },
          usuario: {
            connect: {
              id: usuarioId,
            },
          },
        },
      });
    } else {
      await prisma.facturacionOperacion.create({
        data: {
          unit: Number(Number(flujoFondos.montoPEN).toFixed(2)),
          fecha: new Date(fecha),
          glosa,
          op: operacion.numero,
          tipo,
          accion: tipo === "COMPRA" ? "COMPRA" : "VENTA",
          entrega: tipo === "COMPRA" ? flujoFondos.montoUSD : flujoFondos.montoPEN,
          m1: tipo === "COMPRA" ? "USD" : "PEN",
          m2: tipo === "COMPRA" ? "PEN" : "USD",
          recibe: tipo === "COMPRA" ? dolares * tipoCambio.compra : dolares,
          monto: dolares,
          tc: tipo === "COMPRA" ? tipoCambio.compra : tipoCambio.venta,
          operacion: {
            connect: {
              id: operacion.id,
            },
          },
          usuario: {
            connect: {
              id: usuarioId,
            },
          },
        },
      });
    }

    res.status(200).json({
      message: id ? "Operación actualizada correctamente" : "Operación registrada correctamente",
      operacion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al procesar la operación" });
  } finally {
    prisma.$disconnect();
  }
};

export const obtenerOperaciones = async (req: any, res: any) => {
  const page = parseInt(req.query.page || 1);
  const limit = parseInt(req.query.limit || 10);

  const search = (req.query.search as string)?.trim() || "";
  const tipo_cliente = (req.query.tipoCliente as string)?.trim() || "";
  const tipo = (req.query.tipo as string)?.trim() || "";
  const fecha = (req.query.fecha as string)?.trim() || "";

  const skip = (page - 1) * limit;
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

  // 📅 Filtro por fecha
  if (fecha) {
    const now = new Date();
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    switch (fecha) {
      case "hoy":
        startDate = startOfDay(now);
        endDate = endOfDay(now);
        break;
      case "ayer":
        const ayer = subDays(now, 1);
        startDate = startOfDay(ayer);
        endDate = endOfDay(ayer);
        break;
      case "ultimos_7_dias":
        startDate = subDays(now, 7);
        endDate = endOfDay(now);
        break;
      case "este_mes":
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case "mes_pasado":
        const inicioMesPasado = startOfMonth(subDays(startOfMonth(now), 1));
        const finMesPasado = endOfMonth(inicioMesPasado);
        startDate = inicioMesPasado;
        endDate = finMesPasado;
        break;
      default:
        break;
    }

    if (startDate && endDate) {
      whereConditions.created_at = {
        gte: startDate,
        lte: endDate,
      };
    }
  }

  try {
    const [operaciones, total] = await Promise.all([
      prisma.operacion.findMany({
        skip,
        take: limit,
        orderBy: {
          // fecha: 'desc'
          numero: "desc",
        },
        include: {
          flujoFondos: { omit: { id: true } },
          movimiento: { omit: { id: true } },
          rendimiento: { omit: { id: true } },
          resultado: { omit: { id: true } },
          saldoFinal: { omit: { id: true } },
          tipoCambio: { omit: { id: true } },
          cuadreOperacion: {
            omit: { id: true },
            include: {
              CuadreOperacionDolares: true,
              CuadreOperacionSoles: true,
            },
          },
          usuario: {
            select: {
              apellido_paterno: true,
              apellido_materno: true,
              nombres: true,
              documento: true,
              tipo_documento: true,
            },
          },
        },
        where: whereConditions,
      }),

      prisma.operacion.count({ where: whereConditions }),
    ]);

    res.json({
      data: operaciones,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: `Error al obtener operaciones. ${error}` });
  } finally {
    prisma.$disconnect();
  }
};

export const obtenerUltimaOperacion = async (req: any, res: any) => {
  try {
    const ultimaOperacion = await prisma.operacion.findFirst({
      orderBy: {
        id: "desc",
      },
      include: {
        tipoCambio: true,
      },
    });

    res.status(201).json({ ultimaOperacion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la ultima operación" });
  } finally {
    prisma.$disconnect();
  }
};

export const eliminarOperacionSoles = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const operacion = await prisma.cuadreOperacionSoles.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!operacion) {
      return res.status(404).json({ error: "No se encontró la operación" });
    }

    const operacionBorrada = await prisma.cuadreOperacionSoles.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({ operacionBorrada });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al eliminar la operación" });
  } finally {
    prisma.$disconnect();
  }
};

export const eliminarOperacionDolares = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const operacion = await prisma.cuadreOperacionDolares.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!operacion) {
      return res.status(404).json({ error: "No se encontró la operación" });
    }

    const operacionBorrada = await prisma.cuadreOperacionDolares.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({ operacionBorrada });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al eliminar la operación" });
  } finally {
    prisma.$disconnect();
  }
};

export const obtenerUltimaOperacionEditar = async (
  req: Request,
  res: Response
): Promise<any | undefined> => {
  const { id } = req.params;
  console.log(Number(id) - 1);
  try {
    const ultimaOperacion = await prisma.operacion.findFirst({
      where: {
        numero: Number(id) - 1,
      },
      include: {
        tipoCambio: true,
      },
    });

    if (!ultimaOperacion) {
      return res
        .status(404)
        .json({ error: "No está el prestamo anterior a este, importe la operación" });
    }

    res.status(201).json({ ultimaOperacion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la ultima operación" });
  } finally {
    prisma.$disconnect();
  }
};

/************************** GENERACIÓN DE DATA PARA GRÁFICOS */
/*
interface OperacionPorMes {
  mes: string;
  totalOperaciones: number;
  totalDolares: number;
}
*/
export const getOperacionesPorMes = async (req: any, res: any) => {
  const anio = req.query.anio || new Date().getUTCFullYear();

  const mesesOrden = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  // const datosAgrupados: Record<string, { totalOperaciones: number; totalDolares: number }> = {};

  try {
    const operacionesPorMes = await Promise.all(
      mesesOrden.map(async (nombreMes, index) => {
        const start = new Date(Number(anio), index, 1);
        const end = new Date(Number(anio), index + 1, 0);

        const empieza = start.toISOString().split("T")[0];
        const fin = end.toISOString().split("T")[0];

        const operaciones = await prisma.operacion.findMany({
          where: {
            fecha: {
              gte: `${empieza}T00:00:00.000Z`,
              lte: `${fin}T23:59:59.999Z`,
            },
          },
          include: {
            rendimiento: true,
          },
        });

        const contadorOperaciones = await prisma.operacion.count({
          where: {
            fecha: {
              gte: `${empieza}T00:00:00.000Z`,
              lte: `${fin}T23:59:59.999Z`,
            },
          },
        });

        const dolares = operaciones.reduce((acum, operacion) => {
          return acum + (operacion.dolares || 0);
        }, 0);

        return {
          mes: nombreMes,
          totalOperaciones: contadorOperaciones,
          totalDolares: dolares,
        };
      })
    );
    /*
    const operaciones = await prisma.operacion.groupBy({
      by: ['fecha'],
      _count: { id: true },
      _sum: { dolares: true },
    });

    // Agrupar por mes/año manualmente
    const datosAgrupados: Record<string, { totalOperaciones: number; totalDolares: number }> = {};

    operaciones.forEach(op => {
      const fecha = new Date(op.fecha);
      const key = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`; // Ej: "2025-3"

      if (!datosAgrupados[key]) {
        datosAgrupados[key] = {
          totalOperaciones: 0,
          totalDolares: 0,
        };
      }

      datosAgrupados[key].totalOperaciones += op._count.id;
      datosAgrupados[key].totalDolares += Number(op._sum.dolares || 0);
    });

    // Formatear resultados para el frontend
    const result = Object.entries(datosAgrupados)
      .map(([key, value]) => {
        const [year, month] = key.split('-');
        const fecha = new Date(Number(year), Number(month) - 1);
        const mesNombre = fecha.toLocaleString('es-ES', { month: 'short' }); // ej: "mar"

        return {
          mes: mesNombre.charAt(0).toUpperCase() + mesNombre.slice(1), // "Mar"
          totalOperaciones: value.totalOperaciones,
          totalDolares: value.totalDolares,
        };
      })
      .sort((a, b) => {
        const mesesOrden = [
          'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
          'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
        ];
        return mesesOrden.indexOf(a.mes) - mesesOrden.indexOf(b.mes);
      });
    */
    res.status(200).json(operacionesPorMes);
  } catch (error) {
    console.error("Error al obtener las operaciones por mes:", error);
    res.status(500).json({ message: "Error al obtener las operaciones" });
  } finally {
    prisma.$disconnect();
  }
};

export async function obtenerGraficaGeneracionCaja(req: any, res: any): Promise<any | undefined> {
  try {
    const anio = req.query.anio || new Date().getUTCFullYear();

    const nombresMeses: string[] = [
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

    const operacionesPorMes = await Promise.all(
      nombresMeses.map(async (nombreMes, index) => {
        const start = new Date(Number(anio), index, 1);
        const end = new Date(Number(anio), index + 1, 0);

        const empieza = start.toISOString().split("T")[0];
        const fin = end.toISOString().split("T")[0];

        const operaciones = await prisma.operacion.findMany({
          where: {
            fecha: {
              gte: `${empieza}T00:00:00.000Z`,
              lte: `${fin}T23:59:59.999Z`,
            },
          },
          include: {
            rendimiento: true,
          },
        });

        const forzado = operaciones.reduce((acum, operacion) => {
          return acum + (operacion.rendimiento?.forzado || 0);
        }, 0);

        const esperado = operaciones.reduce((acum, operacion) => {
          return acum + (operacion.rendimiento?.esperado || 0);
        }, 0);

        const medio = operaciones.reduce((acum, operacion) => {
          return acum + (operacion.rendimiento?.medio || 0);
        }, 0);

        return {
          fecha: nombreMes,
          forzado: redondearComoExcel(forzado, 2),
          esperado: redondearComoExcel(esperado, 2),
          medio: redondearComoExcel(medio, 2),
        };
      })
    );

    return res.status(200).json({
      meses: nombresMeses,
      resultados: operacionesPorMes,
    });
  } catch (error) {
    console.error("Error al obtener el rendimiento mensual:", error);
    res.status(500).json({ message: "Error al obtener el rendimiento mensual" });
  } finally {
    prisma.$disconnect();
  }
}

/**************************** EXPORTACION DE DATOS EXCEL ************************/

export const exportarOperacionesExcel = async (req: any, res: any) => {
  try {
    const { tipo } = req.params;

    const whereCondition = tipo.toLowerCase() === "todos" ? {} : { tipo: tipo.toUpperCase() };

    const operaciones = await prisma.operacion.findMany({
      where: whereCondition,
      include: {
        usuario: true,
        tipoCambio: true,
        flujoFondos: true,
        rendimiento: true,
        movimiento: true,
        saldoFinal: true,
        resultado: true,
      },
    });

    const headers = [
      "Fecha",
      "T",
      "Número",
      "Cliente/Titular",
      "Documento",
      "Tipo",
      "Dólares",
      "TC Compra",
      "TC Venta",
      "TC Spread",
      "TC Promedio",
      "Flujo USD",
      "Flujo PEN",
      "Rendimiento Forzado",
      "Rendimiento Medio",
      "Rendimiento Esperado",
      "Compra USD",
      "Venta USD",
      "Saldo Final USD",
      "Saldo Final PEN",
      "Resultado Simple",
      "Resultado Estricto",
      "Resultado Potencial",
    ];

    const rows = operaciones.map((op) => [
      op.fecha.toISOString().split("T")[0],
      op.t,
      op.numero,
      op.usuario.nombres + " " + op.usuario.apellido_paterno + " " + op.usuario.apellido_materno,
      op.usuario.documento,
      op.tipo,
      redondearComoExcel(op.dolares, 2) ?? "",
      redondearComoExcel(op.tipoCambio?.compra, 3) ?? "",
      redondearComoExcel(op.tipoCambio?.venta, 3) ?? "",
      redondearComoExcel(op.tipoCambio?.spread, 3) ?? "",
      redondearComoExcel(op.tipoCambio?.promedio, 3) ?? "",
      redondearComoExcel(op.flujoFondos?.montoUSD, 2) ?? "",
      redondearComoExcel(op.flujoFondos?.montoPEN, 2) ?? "",
      redondearComoExcel(Number(op.rendimiento?.forzado || 0), 2) ?? "",
      redondearComoExcel(Number(op.rendimiento?.medio || 0), 2) ?? "",
      redondearComoExcel(Number(op.rendimiento?.esperado || 0), 2) ?? "",
      redondearComoExcel(op.movimiento?.compraUSD, 2) ?? "",
      redondearComoExcel(op.movimiento?.ventaUSD, 2) ?? "",
      redondearComoExcel(Number(op.saldoFinal?.montoUSD || 0), 2) ?? "",
      redondearComoExcel(Number(op.saldoFinal?.montoPEN || 0), 2) ?? "",
      redondearComoExcel(Number(op.resultado?.simple || 0), 2) ?? "",
      redondearComoExcel(Number(op.resultado?.estricto || 0), 2) ?? "",
      redondearComoExcel(Number(op.resultado?.potencial || 0), 2) ?? "",
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Operaciones");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=operaciones.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (error) {
    console.error("Error exportando operaciones:", error);
    res.status(500).json({ message: "Error exportando operaciones" });
  }
};

export async function sacarGraficaSpread(req: Request, res: Response): Promise<any | undefined> {
  try {
    const operaciones = await prisma.operacion.findMany({
      include: {
        tipoCambio: true,
      },
    });

    const resultado = operaciones.map((operacion) => {
      const fechaCreatedAt = new Date(operacion.created_at);
      const mes = fechaCreatedAt.toLocaleString("es-PE", { month: "long" });
      const dia = fechaCreatedAt.getDate();
      const fechaFormateada = `${dia} de ${mes}`;

      return {
        fecha: fechaFormateada,
        spread: operacion.tipoCambio.spread,
      };
    });

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al obtener las operaciones con fecha y spread:", error);
    return res.status(500).json({
      error: "No se pudo sacar la información",
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function sacarGraficaPromedio(req: Request, res: Response): Promise<any | undefined> {
  try {
    const operaciones = await prisma.operacion.findMany({
      include: {
        tipoCambio: true,
      },
    });

    const resultado = operaciones.map((operacion) => {
      const fechaCreatedAt = new Date(operacion.created_at);
      const mes = fechaCreatedAt.toLocaleString("es-PE", { month: "long" });
      const dia = fechaCreatedAt.getDate();
      const fechaFormateada = `${dia} de ${mes}`;

      return {
        fecha: fechaFormateada,
        promedio: operacion.tipoCambio?.promedio,
      };
    });

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al obtener las operaciones con fecha y promedio:", error);
    return res.status(500).json({
      error: "No se pudo sacar la información",
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function obtenerTotalOperacionCaclulo(
  req: Request,
  res: Response
): Promise<any | undefined> {
  let year: number;
  const yearParam = req.query.year;

  if (yearParam && typeof yearParam === "string" && !isNaN(parseInt(yearParam, 10))) {
    year = parseInt(yearParam, 10);
  } else {
    year = new Date().getFullYear();
  }

  try {
    const monthlyTotals: MonthlyTotalOperacion[] = [];
    let accumulatedDolares = 0;
    let accumulatedCompraUSD = 0;
    let accumulatedVentaUSD = 0;
    let accumulatedSimple = 0;
    let accumulatedEstricto = 0;
    let accumulatedPotencial = 0;
    let accumulatedCompra = 0;
    let accumulatedVenta = 0;
    let accumulatedSpread = 0;
    let accumulatedPromedio = 0;
    let accumulatedMontoUSDFlujo = 0;
    let accumulatedMontoPENFlujo = 0;
    let accumulatedForzado = 0;
    let accumulatedMedio = 0;
    let accumulatedEsperado = 0;
    let accumulatedCompraUSDMov = 0;
    let accumulatedVentaUSDMov = 0;
    let accumulatedMontoUSDSaldo = 0;
    let accumulatedMontoPENSaldo = 0;
    let totalOperaciones = 0; // Renombrado para mayor claridad

    const today = new Date();
    const todayString = today.toISOString().split("T")[0];
    console.log(todayString);

    const operacionesHoy = await prisma.operacion.findMany({
      where: {
        created_at: {
          gte: new Date(`${todayString}T00:00:00.000Z`),
          lt: new Date(`${todayString}T23:59:59.999Z`),
        },
      },
      include: {
        tipoCambio: true,
        flujoFondos: true,
        resultado: true,
        movimiento: true,
        rendimiento: true,
        saldoFinal: true,
      },
    });

    let dolaresHoy = 0;
    let compraUSDHoy = 0;
    let ventaUSDHoy = 0;
    let simpleHoy = 0;
    let estrictoHoy = 0;
    let potencialHoy = 0;
    let compraHoy = 0;
    let ventaHoy = 0;
    let spreadHoy = 0;
    let promedioHoy = 0;
    let montoUSDFlujoHoy = 0;
    let montoPENFlujoHoy = 0;
    let forzadoHoy = 0;
    let medioHoy = 0;
    let esperadoHoy = 0;
    let compraUSDMovHoy = 0;
    let ventaUSDMovHoy = 0;
    let montoUSDSaldoHoy = 0;
    let montoPENSaldoHoy = 0;

    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(year, month - 1, 1);
      const empieza = startDate.toISOString().split("T")[0];
      const endDate = new Date(year, month, 0);
      const fin = endDate.toISOString().split("T")[0];
      console.log("-----------------------------");
      console.log("EMPIEZA: ", empieza);
      console.log("TERMINA: ", fin);
      console.log("-----------------------------");

      const operaciones = await prisma.operacion.findMany({
        where: {
          fecha: {
            gte: new Date(`${empieza}T00:00:00.000Z`),
            lte: new Date(`${fin}T23:59:59.999Z`),
          },
        },
        include: {
          tipoCambio: true,
          flujoFondos: true,
          resultado: true,
          movimiento: true,
          rendimiento: true,
          saldoFinal: true,
        },
      });

      let dolares = 0;
      let compraUSD = 0;
      let ventaUSD = 0;
      let simple = 0;
      let estricto = 0;
      let potencial = 0;
      let compraSum = 0;
      let ventaSum = 0;
      let spreadSum = 0;
      let promedioSum = 0;
      let montoUSDFlujo = 0;
      let montoPENFlujo = 0;
      let forzado = 0;
      let medio = 0;
      let esperado = 0;
      let compraUSDMov = 0;
      let ventaUSDMov = 0;
      let montoUSDSaldo = 0;
      let montoPENSaldo = 0;
      let hasNonZeroTotal = false;
      let operacionesMes = 0;

      operaciones.forEach((operacion) => {
        dolares += operacion.dolares;
        compraUSD += operacion.movimiento?.compraUSD || 0;
        ventaUSD += operacion.movimiento?.ventaUSD || 0;
        simple += operacion.resultado?.simple || 0;
        estricto += operacion.resultado?.estricto || 0;
        potencial += operacion.resultado?.potencial || 0;
        compraSum += operacion.tipoCambio?.compra || 0;
        ventaSum += operacion.tipoCambio?.venta || 0;
        spreadSum += operacion.tipoCambio?.spread || 0;
        promedioSum += operacion.tipoCambio?.promedio || 0;
        montoUSDFlujo += operacion.flujoFondos?.montoUSD || 0;
        montoPENFlujo += operacion.flujoFondos?.montoPEN || 0;
        forzado += operacion.rendimiento?.forzado || 0;
        medio += operacion.rendimiento?.medio || 0;
        esperado += operacion.rendimiento?.esperado || 0;
        compraUSDMov += operacion.movimiento?.compraUSD || 0;
        ventaUSDMov += operacion.movimiento?.ventaUSD || 0;
        montoUSDSaldo += operacion.saldoFinal?.montoUSD || 0;
        montoPENSaldo += operacion.saldoFinal?.montoPEN || 0;
        operacionesMes++;

        if (
          dolares !== 0 ||
          compraUSD !== 0 ||
          ventaUSD !== 0 ||
          simple !== 0 ||
          estricto !== 0 ||
          potencial !== 0 ||
          compraSum !== 0 ||
          ventaSum !== 0 ||
          spreadSum !== 0 ||
          promedioSum !== 0 ||
          montoUSDFlujo !== 0 ||
          montoPENFlujo !== 0 ||
          forzado !== 0 ||
          medio !== 0 ||
          esperado !== 0 ||
          compraUSDMov !== 0 ||
          ventaUSDMov !== 0 ||
          montoUSDSaldo !== 0 ||
          montoPENSaldo !== 0
        ) {
          hasNonZeroTotal = true;
        }
      });
      totalOperaciones += operacionesMes; // Acumula el total de operaciones
      const monthName = new Intl.DateTimeFormat("es-PE", {
        month: "long",
      }).format(startDate);
      const compraPromedioMes = operacionesMes > 0 ? compraSum / operacionesMes : 0;
      const ventaPromedioMes = operacionesMes > 0 ? ventaSum / operacionesMes : 0;
      const spreadPromedioMes = operacionesMes > 0 ? spreadSum / operacionesMes : 0;
      const promedioMes = operacionesMes > 0 ? promedioSum / operacionesMes : 0;

      if (hasNonZeroTotal) {
        monthlyTotals.push({
          fecha: `${monthName} ${year}`,
          dolares: Number(dolares.toFixed(2)),
          compraUSD: Number(compraUSD.toFixed(2)),
          ventaUSD: Number(ventaUSD.toFixed(2)),
          simple: Number(simple.toFixed(2)),
          estricto: Number(estricto.toFixed(2)),
          potencial: Number(potencial.toFixed(2)),
          compra: Number(compraPromedioMes.toFixed(2)),
          venta: Number(ventaPromedioMes.toFixed(2)),
          spread: Number(spreadPromedioMes.toFixed(2)),
          promedio: Number(promedioMes.toFixed(2)),
          montoUSDFlujo: Number(montoUSDFlujo.toFixed(2)),
          montoPENFlujo: Number(montoPENFlujo.toFixed(2)),
          forzado: Number(forzado.toFixed(2)),
          medio: Number(medio.toFixed(2)),
          esperado: Number(esperado.toFixed(2)),
          compraUSDMov: Number(compraUSDMov.toFixed(2)),
          ventaUSDMov: Number(ventaUSDMov.toFixed(2)),
          montoUSDSaldo: Number(montoUSDSaldo.toFixed(2)),
          montoPENSaldo: Number(montoPENSaldo.toFixed(2)),
          operacionesMes: operacionesMes,
        });
      }

      accumulatedDolares += dolares;
      accumulatedCompraUSD += compraUSD;
      accumulatedVentaUSD += ventaUSD;
      accumulatedSimple += simple;
      accumulatedEstricto += estricto;
      accumulatedPotencial += potencial;
      accumulatedCompra += compraSum;
      accumulatedVenta += ventaSum;
      accumulatedSpread += spreadSum;
      accumulatedPromedio += promedioSum;
      accumulatedMontoUSDFlujo += montoUSDFlujo;
      accumulatedMontoPENFlujo += montoPENFlujo;
      accumulatedForzado += forzado;
      accumulatedMedio += medio;
      accumulatedEsperado += esperado;
      accumulatedCompraUSDMov += compraUSDMov;
      accumulatedVentaUSDMov += ventaUSDMov;
      accumulatedMontoUSDSaldo += montoUSDSaldo;
      accumulatedMontoPENSaldo += montoPENSaldo;
    }
    const accumulatedPromedioCompra =
      totalOperaciones > 0 ? accumulatedCompra / totalOperaciones : 0;
    const accumulatedPromedioVenta = totalOperaciones > 0 ? accumulatedVenta / totalOperaciones : 0;
    const accumulatedPromedioSpread =
      totalOperaciones > 0 ? accumulatedSpread / totalOperaciones : 0;
    const accumulatedPromedioPromedio =
      totalOperaciones > 0 ? accumulatedPromedio / totalOperaciones : 0;

    const accumulatedObject = {
      fecha: `Acumulado ${year}`,
      dolares: accumulatedDolares,
      compraUSD: accumulatedCompraUSD,
      ventaUSD: accumulatedVentaUSD,
      simple: accumulatedSimple,
      estricto: accumulatedEstricto,
      potencial: accumulatedPotencial,
      compra: Number(accumulatedPromedioCompra.toFixed(2)),
      venta: Number(accumulatedPromedioVenta.toFixed(2)),
      spread: Number(accumulatedPromedioSpread.toFixed(2)),
      promedio: Number(accumulatedPromedioPromedio.toFixed(2)),
      montoUSDFlujo: Number(accumulatedMontoUSDFlujo.toFixed(2)),
      montoPENFlujo: Number(accumulatedMontoPENFlujo.toFixed(2)),
      forzado: Number(accumulatedForzado.toFixed(2)),
      medio: Number(accumulatedMedio.toFixed(2)),
      esperado: Number(accumulatedEsperado.toFixed(2)),
      compraUSDMov: Number(accumulatedCompraUSDMov.toFixed(2)),
      ventaUSDMov: Number(accumulatedVentaUSDMov.toFixed(2)),
      montoUSDSaldo: Number(accumulatedMontoUSDSaldo.toFixed(2)),
      montoPENSaldo: Number(accumulatedMontoPENSaldo.toFixed(2)),
      operacionesMes: Number(totalOperaciones.toFixed(2)), // Agrega el total de operaciones al objeto acumulado
    };

    operacionesHoy.forEach((operacion) => {
      dolaresHoy += operacion.dolares;
      compraUSDHoy += operacion.movimiento?.compraUSD || 0;
      ventaUSDHoy += operacion.movimiento?.ventaUSD || 0;
      simpleHoy += operacion.resultado?.simple || 0;
      estrictoHoy += operacion.resultado?.estricto || 0;
      potencialHoy += operacion.resultado?.potencial || 0;
      compraHoy += operacion.tipoCambio?.compra || 0;
      ventaHoy += operacion.tipoCambio?.venta || 0;
      spreadHoy += operacion.tipoCambio?.spread || 0;
      promedioHoy += operacion.tipoCambio?.promedio || 0;
      montoUSDFlujoHoy += operacion.flujoFondos?.montoUSD || 0;
      montoPENFlujoHoy += operacion.flujoFondos?.montoPEN || 0;
      forzadoHoy += operacion.rendimiento?.forzado || 0;
      medioHoy += operacion.rendimiento?.medio || 0;
      esperadoHoy += operacion.rendimiento?.esperado || 0;
      compraUSDMovHoy += operacion.movimiento?.compraUSD || 0;
      ventaUSDMovHoy += operacion.movimiento?.ventaUSD || 0;
      montoUSDSaldoHoy += operacion.saldoFinal?.montoUSD || 0;
      montoPENSaldoHoy += operacion.saldoFinal?.montoPEN || 0;
    });

    const totalOperacionesHoy = operacionesHoy.length;
    const promedioCompraHoy = totalOperacionesHoy > 0 ? compraHoy / totalOperacionesHoy : 0;
    const promedioVentaHoy = totalOperacionesHoy > 0 ? ventaHoy / totalOperacionesHoy : 0;
    const promedioSpreadHoy = totalOperacionesHoy > 0 ? spreadHoy / totalOperacionesHoy : 0;
    const promedioPromedioHoy = totalOperacionesHoy > 0 ? promedioHoy / totalOperacionesHoy : 0;

    const hoyObject = {
      fecha: "Hoy",
      dolares: Number(dolaresHoy.toFixed(2)),
      compraUSD: Number(compraUSDHoy.toFixed(2)),
      ventaUSD: Number(ventaUSDHoy.toFixed(2)),
      simple: Number(simpleHoy.toFixed(2)),
      estricto: Number(estrictoHoy.toFixed(2)),
      potencial: Number(potencialHoy.toFixed(2)),
      compra: Number(promedioCompraHoy.toFixed(2)),
      venta: Number(promedioVentaHoy.toFixed(2)),
      spread: Number(promedioSpreadHoy.toFixed(2)),
      promedio: Number(promedioPromedioHoy.toFixed(2)),
      montoUSDFlujo: Number(montoUSDFlujoHoy.toFixed(2)),
      montoPENFlujo: Number(montoPENFlujoHoy.toFixed(2)),
      forzado: Number(forzadoHoy.toFixed(2)),
      medio: Number(medioHoy.toFixed(2)),
      esperado: Number(esperadoHoy.toFixed(2)),
      compraUSDMov: Number(compraUSDMovHoy.toFixed(2)),
      ventaUSDMov: Number(ventaUSDMovHoy.toFixed(2)),
      montoUSDSaldo: Number(montoUSDSaldoHoy.toFixed(2)),
      montoPENSaldo: Number(montoPENSaldoHoy.toFixed(2)),
      equilibrio: Number(Number(accumulatedCompraUSDMov) - Number(accumulatedVentaUSDMov)),
      operacionesMes: totalOperacionesHoy,
    };
    monthlyTotals.push(hoyObject);

    // console.log(monthlyTotals);
    // console.log([...monthlyTotals, accumulatedObject]);

    res.status(200).json([...monthlyTotals, accumulatedObject]);
  } catch (error) {
    console.error(`Error fetching Operacion totals for year ${year} with accumulated:`, error);
    res.status(500).json({
      error: `Failed to fetch Operacion totals for year ${year} with accumulated`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function sacarGraficaMontosCambiados(
  req: Request,
  res: Response
): Promise<any | undefined> {
  const anio = req.query.anio || new Date().getUTCFullYear();
  try {
    /*
    const resultados: { fecha: string, venta: number, compra: number }[] = []

    const totalesPorMes: {
      [mes: string]: { totalVenta: number; totalCompra: number };
    } = {};
    const nombresMeses: string[] = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const operacionesPorMes = nombresMeses.map(async (nombreMes, index) => {
      const start = new Date(Number(anio), index, 1);
      const end = new Date(Number(anio), index + 1, 0);

      if (!totalesPorMes[nombreMes]) {
        totalesPorMes[nombreMes] = { totalVenta: 0, totalCompra: 0 };
      }

      const empieza = start.toISOString().split("T")[0];
      const fin = end.toISOString().split("T")[0]

      const operaciones = await prisma.operacion.findMany({
        where: {
          fecha: {
            gte: `${empieza}T00:00:00.000Z`,
            lte: `${fin}T23:59:59.999Z`,
          },
        },
        include: {
          movimiento: true,
        },
      });

      const newResultado: { fecha: string, venta: number, compra: number } = {
        fecha: nombreMes,
        venta: operaciones.reduce((acum, operacion) => {
          return acum + operacion.movimiento.ventaUSD || 0;
        }, 0),
        compra: operaciones.reduce((acum, operacion) => {
          return acum + operacion.movimiento.compraUSD || 0;
        }, 0),
      }

      resultados.push(newResultado)
      console.log(resultados)
    })
    await Promise.all(operacionesPorMes);

    return res.status(200).json({
      meses: nombresMeses,
      resultados,
    });
    */
    const nombresMeses: string[] = [
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

    const operacionesPorMes = await Promise.all(
      nombresMeses.map(async (nombreMes, index) => {
        const start = new Date(Number(anio), index, 1);
        const end = new Date(Number(anio), index + 1, 0);

        const empieza = start.toISOString().split("T")[0];
        const fin = end.toISOString().split("T")[0];

        const operaciones = await prisma.operacion.findMany({
          where: {
            fecha: {
              gte: `${empieza}T00:00:00.000Z`,
              lte: `${fin}T23:59:59.999Z`,
            },
          },
          include: {
            movimiento: true,
          },
        });

        const venta = operaciones.reduce((acum, operacion) => {
          return acum + (operacion.movimiento?.ventaUSD || 0);
        }, 0);

        const compra = operaciones.reduce((acum, operacion) => {
          return acum + (operacion.movimiento?.compraUSD || 0);
        }, 0);

        return {
          fecha: nombreMes,
          venta: redondearComoExcel(venta / 1000, 2),
          compra: redondearComoExcel(compra / 1000, 2),
        };
      })
    );

    return res.status(200).json({
      meses: nombresMeses,
      resultados: operacionesPorMes,
    });
  } catch (error) {
    console.error("Error al obtener el rendimiento mensual:", error);
    return res.status(500).json({ message: "Error al obtener el rendimiento mensual" });
  } finally {
    await prisma.$disconnect();
  }
}

interface ClientesPorMes {
  fecha: string;
  clientes: number;
  empresa: number;
}

export async function sacarGraficaClientesAtendidos(
  req: Request,
  res: Response
): Promise<any | undefined> {
  const anio = req.query.anio || new Date().getUTCFullYear();
  const nombresMeses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  try {
    const resultadosClientes = await obtenerClientesAtendidos(String(anio));

    const OperacionPorMes: ClientesPorMes[] = [];

    nombresMeses.forEach((nombreMes, index) => {
      const totalClientes = resultadosClientes[index]?.clientes || 0;
      const totalEmpresas = resultadosClientes[index]?.empresa || 0;

      OperacionPorMes.push({
        fecha: nombreMes,
        clientes: totalClientes,
        empresa: totalEmpresas,
      });
    });

    res.status(200).json({ respuesta: OperacionPorMes });
  } catch (error) {
    console.error(
      "Error al obtener el número de operaciones por tipo de usuario por mes del año actual (con nombres únicos):",
      error
    );
    res.status(500).json({
      message:
        "Error al obtener el número de operaciones por tipo de usuario por mes del año actual (con nombres únicos)",
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function sacarGraficaRendimientosMensuales(
  req: Request,
  res: Response
): Promise<any | undefined> {
  try {
    const anio = req.query.anio || new Date().getUTCFullYear();
    /*
    const currentYear = new Date();
    const start = startOfYear(currentYear);
    const end = endOfYear(currentYear);

    const operaciones = await prisma.operacion.findMany({
      where: {
        fecha: {
          gte: start,
          lt: end,
        },
      },
      include: {
        rendimiento: true,
      },
    });
    */

    const resultadosPorMes: {
      [mes: string]: {
        totalDolares: number;
        totalForzado: number;
        totalMedio: number;
        totalEsperado: number;
      };
    } = {};

    const nombresMeses = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];
    nombresMeses.forEach((nombreMes) => {
      resultadosPorMes[nombreMes] = {
        totalDolares: 0,
        totalForzado: 0,
        totalMedio: 0,
        totalEsperado: 0,
      };
    });
    /*
    operaciones.forEach((operacion) => {
      const nombreMes = format(operacion.fecha, "MMMM", { locale: es });
      const dolares = operacion.dolares ?? 0;
      const forzado = operacion.rendimiento?.forzado ?? 0;
      const medio = operacion.rendimiento?.medio ?? 0;
      const esperado = operacion.rendimiento?.esperado ?? 0;

      if (resultadosPorMes[nombreMes]) {
        resultadosPorMes[nombreMes].totalDolares += dolares;
        resultadosPorMes[nombreMes].totalForzado += forzado;
        resultadosPorMes[nombreMes].totalMedio += medio;
        resultadosPorMes[nombreMes].totalEsperado += esperado;
      }
    });
    */

    await Promise.all(
      nombresMeses.map(async (nombreMes, index) => {
        const start = new Date(Number(anio), index, 1);
        const end = new Date(Number(anio), index + 1, 0);

        const empieza = start.toISOString().split("T")[0];
        const fin = end.toISOString().split("T")[0];
        console.log("-----------------------------");
        console.log("EMPIEZA: ", empieza);
        console.log("TERMINA: ", fin);
        console.log("-----------------------------");

        const operaciones = await prisma.operacion.findMany({
          where: {
            fecha: {
              gte: `${empieza}T00:00:00.000Z`,
              lte: `${fin}T23:59:59.999Z`,
            },
          },
          include: {
            rendimiento: true,
          },
        });

        const totalDolares = operaciones.reduce((acum, operacion) => {
          return acum + (operacion.dolares || 0);
        }, 0);

        const totalForzado = operaciones.reduce((acum, operacion) => {
          return acum + (operacion.rendimiento?.forzado || 0);
        }, 0);

        const totalMedio = operaciones.reduce((acum, operacion) => {
          return acum + (operacion.rendimiento?.medio || 0);
        }, 0);

        const totalEsperado = operaciones.reduce((acum, operacion) => {
          return acum + (operacion.rendimiento?.esperado || 0);
        }, 0);

        resultadosPorMes[nombreMes] = {
          totalDolares: redondearComoExcel(totalDolares / 1000, 2),
          totalForzado: redondearComoExcel(totalForzado, 2),
          totalMedio: redondearComoExcel(totalMedio, 2),
          totalEsperado: redondearComoExcel(totalEsperado, 2),
        };
      })
    );

    const respuesta = nombresMeses.map((nombreMes) => {
      const totalDolares = resultadosPorMes[nombreMes]?.totalDolares || 0;
      const forzadoRatio =
        totalDolares > 0 ? resultadosPorMes[nombreMes]?.totalForzado / totalDolares : 0;
      const medioRatio =
        totalDolares > 0 ? resultadosPorMes[nombreMes]?.totalMedio / totalDolares : 0;
      const esperadoRatio =
        totalDolares > 0 ? resultadosPorMes[nombreMes]?.totalEsperado / totalDolares : 0;

      const fechaCapitalizada = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);

      return {
        fecha: fechaCapitalizada,
        forzado: redondearComoExcel(forzadoRatio / 10, 2),
        medio: redondearComoExcel(medioRatio / 10, 2),
        esperado: redondearComoExcel(esperadoRatio / 10, 2),
      };
    });

    res.status(200).json(respuesta);
  } catch (error) {
    console.error("Error al calcular los ratios de rendimiento por mes:", error);
    res.status(500).json({
      message: "Error al calcular los ratios de rendimiento por mes",
    });
  } finally {
    await prisma.$disconnect();
  }
}

interface MesPromedio {
  fecha: string;
  mensual: number;
}

export async function sacarGraficaTicketPromedio(req: Request, res: Response) {
  try {
    const anioActual = new Date().getFullYear();
    const promediosMensuales: MesPromedio[] = [];
    const meses = [
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

    const montoCambiado = await obtenerTotalOperacionCacluloFLUJO(String(anioActual));

    meses.forEach((mes, index) => {
      promediosMensuales.push({
        fecha: mes,
        mensual: formatearNumeroDecimal(
          montoCambiado[index]?.dolares / 1000 / montoCambiado[index]?.operacionesMes
        ),
      });
    });
    /*
    // Obtener todas las operaciones del año actual
    const operaciones = await prisma.operacion.findMany({
      where: {
        fecha: {
          gte: new Date(anioActual, 0, 1),
          lt: new Date(anioActual + 1, 0, 1),
        },
      },
      select: {
        fecha: true,
        dolares: true,
      }
    });

    // Mapear las operaciones a un objeto donde las claves son los meses
    const operacionesPorMes: { [mes: number]: { totalDolares: number; cantidadOperaciones: number } } = {};

    for (const operacion of operaciones) {
      const mes = operacion.fecha.getMonth(); // 0-indexed
      if (!operacionesPorMes[mes]) {
        operacionesPorMes[mes] = { totalDolares: 0, cantidadOperaciones: 0 };
      }
      operacionesPorMes[mes].totalDolares += operacion.dolares;
      operacionesPorMes[mes].cantidadOperaciones++;
    }
    console.log(operacionesPorMes)
    // Crear el array de resultados
    const nombresMeses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const promediosMensuales: MesPromedio[] = [];
    for (let i = 0; i < 12; i++) {
      const mesData = operacionesPorMes[i];
      const totalDolares = mesData ? mesData.totalDolares : 0;
      const cantidadOperaciones = mesData ? mesData.cantidadOperaciones : 0;
      const promedio = cantidadOperaciones > 0 ? (totalDolares / 1000) / cantidadOperaciones : 0;

      promediosMensuales.push({
        fecha: nombresMeses[i],
        mensual: promedio,
      });
    }
    */
    // Enviar la respuesta JSON
    res.json(promediosMensuales);
  } catch (error) {
    console.error("Error al calcular el promedio mensual:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

const parseFlexible = (valor: any, campo: string, fila: number, errores: any[]): number => {
  if (valor === "" || valor === "-" || valor === undefined || valor === null) {
    return 0;
  }

  const valorString = String(valor)
    .trim()
    .replace(/\s/g, "") // quita espacios
    .replace(/,/g, ""); // elimina comas

  const num = parseFloat(valorString);

  if (isNaN(num)) {
    errores.push({
      fila,
      mensaje: `El campo "${campo}" no es un número válido: "${valor}"`,
    });
    throw new Error(`Campo ${campo} inválido en fila ${fila}`);
  }

  return num;
};

const limpiarClaves = (row: Record<string, any>): Record<string, any> => {
  const nuevoRow: Record<string, any> = {};
  for (const clave of Object.keys(row)) {
    const claveLimpia = clave
      .toLowerCase()
      .trim()
      .normalize("NFD") // elimina tildes
      .replace(/[\u0300-\u036f]/g, "");
    nuevoRow[claveLimpia] = row[clave];
  }
  return nuevoRow;
};
function convertirFecha(fechaCelda: any): Date | null {
  if (typeof fechaCelda === "number") {
    // Número de serie de Excel
    const parsed = XLSX.SSF.parse_date_code(fechaCelda);
    if (parsed) {
      return new Date(parsed.y, parsed.m - 1, parsed.d);
    }
  } else if (typeof fechaCelda === "string") {
    const fecha = new Date(fechaCelda);
    if (!isNaN(fecha.getTime())) {
      return fecha;
    }
  }
  return null;
}

/*********** SUBIDA MASIVA DE DATOS */
const upload = multer({ storage: multer.memoryStorage() });

export const importarOperacionesHandler = [
  upload.single("file"),

  async (req: Request, res: Response): Promise<any> => {
    const errores: any[] = [];

    try {
      const fileBuffer = req.file?.buffer;
      if (!fileBuffer) {
        console.log("Archivo no encontrado");

        return res.status(400).json({ error: "Archivo no encontrado" });
      }
      const workbook = XLSX.read(fileBuffer);
      const hoja = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<any>(hoja, { defval: "" });

      for (const rowOriginal of rows) {
        let tipoCambio = null;
        let flujoFondos = null;
        let rendimiento = null;
        let movimiento = null;
        let saldoFinal = null;
        let resultado = null;
        let operacionCreada = null;
        let facturacionCreada = null;

        // Limpiar claves del row
        const row = limpiarClaves(rowOriginal);

        const nroRaw = row["no."];
        const filaNum = Number(nroRaw);
        if (!nroRaw || isNaN(filaNum)) continue;

        try {
          const fecha = convertirFecha(row["fecha"]);
          if (!fecha) {
            console.log("NO HAY FECHA");
            errores.push({
              fila: filaNum,
              mensaje: `Fecha inválida: "${row["fecha"]}"`,
            });

            guardarError(`NO HAY FECHA en fila ${filaNum} en la operación ${filaNum}`);
            continue;
          }

          const clienteTitular = row["cliente/titular"];
          console.log(clienteTitular);
          const usuario = await prisma.usuario.findFirst({
            where: {
              OR: [
                {
                  cliente: {
                    equals: clienteTitular,
                  },
                },
                {
                  cliente_2: {
                    equals: clienteTitular,
                  },
                },
              ],
            },
          });
          if (!usuario) {
            console.log("NO HAY USUARIOS");
            errores.push({
              fila: filaNum,
              mensaje: `Usuario no encontrado para Cliente/Titular: "${clienteTitular}"`,
            });
            guardarError(
              `Usuario no encontrado para Cliente/Titular: "${clienteTitular}" en la operación ${filaNum}`
            );
            continue;
          }

          tipoCambio = await prisma.tipoCambioOperacion.create({
            data: {
              compra: parseFlexible(row["compra"], "Compra", filaNum, errores),
              venta: parseFlexible(row["venta"], "Venta", filaNum, errores),
              spread: parseFlexible(row["spread"], "Spread", filaNum, errores),
              promedio: parseFlexible(row["prom."], "Prom.", filaNum, errores),
            },
          });
          console.log("TIPO DE CAMBIO CREADO");

          flujoFondos = await prisma.flujoFondosOperacion.create({
            data: {
              montoUSD: parseFlexible(row["monto us$"], "Monto US$", filaNum, errores),
              montoPEN: parseFlexible(row["monto s/."], "Monto S/.", filaNum, errores),
            },
          });
          console.log("FLUJO FONDOS CREADO");

          rendimiento = await prisma.rendimientoOperacion.create({
            data: {
              forzado: parseFlexible(row["forzado"], "Forzado", filaNum, errores),
              medio: parseFlexible(row["medio"], "Medio", filaNum, errores),
              esperado: parseFlexible(row["esperado"], "Esperado", filaNum, errores),
            },
          });

          console.log("RENDIMIENTO CREADO");

          movimiento = await prisma.movimientoFondosOperacion.create({
            data: {
              compraUSD: parseFlexible(row["compra $"], "Compra $", filaNum, errores),
              ventaUSD: parseFlexible(row["venta $"], "Venta $", filaNum, errores),
            },
          });

          console.log("MOVIMIENTO CREADO");

          saldoFinal = await prisma.saldoFinalOperacion.create({
            data: {
              montoUSD: parseFlexible(row["us$"], "US$", filaNum, errores),
              montoPEN: parseFlexible(row["s/."], "S/.", filaNum, errores),
            },
          });

          console.log("SALDO FINAL CREADO");

          resultado = await prisma.resultadoOperacion.create({
            data: {
              simple: parseFlexible(row["simple"], "Simple", filaNum, errores),
              estricto: parseFlexible(row["estricto"], "Estricto", filaNum, errores),
              potencial: parseFlexible(row["potencial"], "Potencial", filaNum, errores),
            },
          });

          console.log("RESULTADO OPERACION CREADO");

          const dolares = parseFlexible(row["dolares"], "Dolares", filaNum, errores);

          const operacionBuscada = await prisma.operacion.findFirst({
            where: {
              numero: filaNum,
            },
            include: {
              usuario: true,
            },
          });

          if (operacionBuscada) {
            errores.push({
              fila: filaNum,
              mensaje: `La operación "${filaNum}" ya existe con el cliente ${operacionBuscada.usuario.cliente} | ${operacionBuscada.usuario.cliente_2}`,
            });

            throw new Error(
              `El número operación ${operacionBuscada.numero} ya existe con el cliente ${operacionBuscada.usuario.cliente} | ${operacionBuscada.usuario.cliente_2}`
            );
          }

          operacionCreada = await prisma.operacion.create({
            data: {
              fecha,
              t: String(parseFlexible(row["t"], "T", filaNum, errores) ?? ""),
              numero: filaNum,
              tipo: row["tipo"]?.toLowerCase() === "compra" ? "COMPRA" : "VENTA",
              dolares,
              usuarioId: usuario.id,
              tipoCambioId: tipoCambio.id,
              flujoFondosId: flujoFondos.id,
              rendimientoId: rendimiento.id,
              movimientoId: movimiento.id,
              saldoFinalId: saldoFinal.id,
              resultadoId: resultado.id,
            },
          });

          const glosa = ` OP-${operacionCreada.numero} - ASSESOR ${
            operacionCreada.tipo === "COMPRA" ? "COMPRA" : "VENDE"
          } ${flujoFondos.montoUSD} USD. TIPO DE CAMBIO: ${
            operacionCreada.tipo === "COMPRA" ? tipoCambio.compra : tipoCambio.venta
          }. CLIENTE ENVIA: ${
            operacionCreada.tipo === "COMPRA" ? flujoFondos.montoUSD : flujoFondos.montoPEN
          } ${operacionCreada.tipo === "COMPRA" ? "USD" : "PEN"}. CLIENTE RECIBE: ${
            operacionCreada.tipo === "COMPRA" ? dolares * tipoCambio.compra : dolares
          } ${operacionCreada.tipo === "COMPRA" ? "PEN" : "USD"}.`;

          facturacionCreada = await prisma.facturacionOperacion.create({
            data: {
              unit: dolares,
              fecha: new Date(fecha),
              glosa,
              op: operacionCreada.numero,
              tipo: operacionCreada.tipo,
              accion: operacionCreada.tipo === "COMPRA" ? "COMPRA" : "VENTA",
              entrega:
                operacionCreada.tipo === "COMPRA" ? flujoFondos.montoUSD : flujoFondos.montoPEN,
              m1: operacionCreada.tipo === "COMPRA" ? "USD" : "PEN",
              m2: operacionCreada.tipo === "COMPRA" ? "PEN" : "USD",
              recibe: operacionCreada.tipo === "COMPRA" ? dolares * tipoCambio.compra : dolares,
              monto: dolares,
              tc: operacionCreada.tipo === "COMPRA" ? tipoCambio.compra : tipoCambio.venta,
              operacion: {
                connect: {
                  id: operacionCreada.id,
                },
              },
              usuario: {
                connect: {
                  id: usuario.id,
                },
              },
            },
          });
          console.log("FACTURACION CREADA");
          console.log("OPERACION CREADO");
        } catch (e) {
          if (operacionCreada) {
            await prisma.operacion.delete({
              where: {
                id: operacionCreada.id,
              },
            });
          }
          if (facturacionCreada) {
            await prisma.facturacionOperacion.delete({
              where: {
                id: facturacionCreada.id,
              },
            });
          }
          if (!operacionCreada) {
            if (tipoCambio) {
              console.log("TIPO CAMBIO REVERTIDO");
              await prisma.tipoCambioOperacion.delete({
                where: {
                  id: tipoCambio.id,
                },
              });
            }
            if (flujoFondos) {
              console.log("FLUJO REVERTIDO");
              await prisma.flujoFondosOperacion.delete({
                where: {
                  id: flujoFondos.id,
                },
              });
            }
            if (rendimiento) {
              console.log("RENDIMIENTO REVERTIDO");
              await prisma.rendimientoOperacion.delete({
                where: {
                  id: rendimiento.id,
                },
              });
            }
            if (movimiento) {
              console.log("MOVIMIENTO REVERTIDO");
              await prisma.movimientoFondosOperacion.delete({
                where: {
                  id: movimiento.id,
                },
              });
            }
            if (saldoFinal) {
              console.log("SALDO FINAL REVERTIDO");
              await prisma.saldoFinalOperacion.delete({
                where: {
                  id: saldoFinal.id,
                },
              });
            }
            if (resultado) {
              console.log("RESULTADO REVERTIDO");
              await prisma.resultadoOperacion.delete({
                where: {
                  id: resultado.id,
                },
              });
            }
          }

          // El error ya fue agregado a `errores` si aplica

          guardarError(`No se creó la operación: ${e} en fila ${filaNum}`);
          console.log(e);
        }
      }
      console.log(errores.length);
      if (errores.length > 0) {
        console.log("ALGUNAS OPERACIONES NO PUDIERON IMPORTARSE");

        // Garantizar que el archivo esté cerrado

        return res.status(400).json({
          errores,
        });
      }

      return res.status(200).json({ mensaje: "Operaciones importadas correctamente." });
    } catch (err) {
      console.log("Error procesando importación:", err);
      guardarError(`Error al procesar el archivo: ${err}`);
      return res.status(500).json({ error: "Error al procesar el archivo." });
    } finally {
      await prisma.$disconnect();
    }
  },
];

export const importarCuadresHandler = [
  upload.single("file"),
  async (req: Request, res: Response): Promise<any> => {
    const errores: any[] = [];
    let lastOperacionId: number | null = null;

    try {
      const buffer = req.file?.buffer;
      if (!buffer) {
        return res.status(400).json({ error: "Archivo no encontrado" });
      }

      const workbook = XLSX.read(buffer);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<any>(sheet, { defval: "" });

      for (const raw of rows) {
        const row = limpiarClaves(raw);
        let currentCuadreId: number | null = null;

        // Determinar si esta fila define una operación nueva
        const hasOperacionFields = row["fecha"] && row["cliente"];
        if (hasOperacionFields) {
          // Datos de matching de la operación
          const fechaMatch = convertirFecha(row["fecha"]);
          const cliente = row["cliente"];
          const tipo = row["tipo"]?.toLowerCase() === "compra" ? "COMPRA" : "VENTA";
          const tcC = parseFlexible(row["tc c"], "TC C", raw._rowNum_ || 0, errores);
          const tcV = parseFlexible(row["tc v"], "TC V", raw._rowNum_ || 0, errores);
          const usd = parseFlexible(row["dolares"], "DOLARES", raw._rowNum_ || 0, errores);
          const pen = parseFlexible(row["soles"], "SOLES", raw._rowNum_ || 0, errores);

          if (!fechaMatch || !cliente) {
            errores.push({ fila: raw._rowNum_ || "?", mensaje: "Fecha o Cliente inválido" });
            continue;
          }

          // Buscar usuario
          const usuario = await prisma.usuario.findFirst({
            where: { OR: [{ cliente }, { cliente_2: cliente }] },
          });
          if (!usuario) {
            errores.push({
              fila: raw._rowNum_ || "?",
              mensaje: `Usuario no encontrado: ${cliente}`,
            });
            continue;
          }

          // Buscar operación existente
          const operacion = await prisma.operacion.findFirst({
            where: {
              fecha: fechaMatch,
              tipo,
              dolares: usd,
              usuarioId: usuario.id,
              tipoCambio: { compra: tcC, venta: tcV },
              flujoFondos: { montoUSD: usd, montoPEN: pen },
            },
            include: { tipoCambio: true, flujoFondos: true },
          });

          if (!operacion) {
            errores.push({
              fila: raw._rowNum_ || "?",
              mensaje: "Operación no encontrada para vincular cuadre",
            });
            continue;
          }

          // Nuevo cuadre para esta operación
          const cuadre = await prisma.cuadreOperacion.create({
            data: { operacionId: operacion.id },
          });
          lastOperacionId = operacion.id;
          currentCuadreId = cuadre.id;
        } else {
          // Fila de cuadre extra, usa el último cuadre creado
          if (!lastOperacionId) {
            errores.push({ fila: raw._rowNum_ || "?", mensaje: "Cuadre sin operación previa" });
            continue;
          }
          // Obtener el último cuadre para esa operación
          const lastCuadre = await prisma.cuadreOperacion.findFirst({
            where: { operacionId: lastOperacionId },
            orderBy: { created_at: "desc" },
          });
          if (!lastCuadre) {
            errores.push({
              fila: raw._rowNum_ || "?",
              mensaje: "No se encontró cuadre previo para operación",
            });
            continue;
          }
          currentCuadreId = lastCuadre.id;
        }

        // Insertar detalles de cuadre en dólares
        const fechaUsd = convertirFecha(row["fecha_1"] || row["fecha_usd"]);
        if (fechaUsd && currentCuadreId) {
          await prisma.cuadreOperacionDolares.create({
            data: {
              cuadreOperacionId: currentCuadreId,
              fecha_usd: fechaUsd,
              descripcion_op_usd:
                row["descripción operación_1"] || row["descripcion_operacion_usd"] || "",
              monto_usd: parseFlexible(
                row["monto dolares"],
                "Monto DOLARES",
                raw._rowNum_ || 0,
                errores
              ),
              referencia_usd: row["referencia2_1"] || row["referencia2_usd"] || "",
              diferencia_usd: parseFlexible(
                row["dif_1"],
                "Dif DOLARES",
                raw._rowNum_ || 0,
                errores
              ),
            },
          });
        }

        // Insertar detalles de cuadre en soles
        const fechaPen = convertirFecha(row["fecha_2"] || row["fecha_pen"]);
        if (fechaPen && currentCuadreId) {
          await prisma.cuadreOperacionSoles.create({
            data: {
              cuadreOperacionId: currentCuadreId,
              fecha_pen: fechaPen,
              descripcion_op_pen:
                row["descripción operación_2"] || row["descripcion_operacion_pen"] || "",
              monto_pen: parseFlexible(
                row["monto soles"],
                "Monto SOLES",
                raw._rowNum_ || 0,
                errores
              ),
              referencia_pen: row["referencia2_2"] || row["referencia2_pen"] || "",
              diferencia_pen: parseFlexible(row["dif_2"], "Dif SOLES", raw._rowNum_ || 0, errores),
            },
          });
        }
      }

      if (errores.length) {
        return res.status(400).json({ mensaje: "Algunos cuadres no se importaron", errores });
      }
      return res.status(200).json({ mensaje: "Cuadres importados correctamente" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Error procesando el archivo" });
    }
  },
];

/********************************** OPERACIONES BACKEND PARA FLUJO */
export async function obtenerTotalOperacionCacluloFLUJO(
  yearParam: string
): Promise<any | undefined> {
  let year: number;

  if (yearParam && typeof yearParam === "string" && !isNaN(parseInt(yearParam, 10))) {
    year = parseInt(yearParam, 10);
  } else {
    year = new Date().getFullYear();
  }

  try {
    const monthlyTotals: MonthlyTotalOperacion[] = [];
    let accumulatedDolares = 0;
    let accumulatedCompraUSD = 0;
    let accumulatedVentaUSD = 0;
    let accumulatedSimple = 0;
    let accumulatedEstricto = 0;
    let accumulatedPotencial = 0;
    let accumulatedCompra = 0;
    let accumulatedVenta = 0;
    let accumulatedSpread = 0;
    let accumulatedPromedio = 0;
    let accumulatedMontoUSDFlujo = 0;
    let accumulatedMontoPENFlujo = 0;
    let accumulatedForzado = 0;
    let accumulatedMedio = 0;
    let accumulatedEsperado = 0;
    let accumulatedCompraUSDMov = 0;
    let accumulatedVentaUSDMov = 0;
    let accumulatedMontoUSDSaldo = 0;
    let accumulatedMontoPENSaldo = 0;
    let totalOperaciones = 0; // Renombrado para mayor claridad

    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const empieza = startDate.toISOString().split("T")[0];
      const fin = endDate.toISOString().split("T")[0];
      console.log("-----------------------------");
      console.log("EMPIEZA: ", empieza);
      console.log("TERMINA: ", fin);
      console.log("-----------------------------");

      const operaciones = await prisma.operacion.findMany({
        where: {
          fecha: {
            gte: `${empieza}T00:00:00.000Z`,
            lte: `${fin}T23:59:59.999Z`,
          },
        },
        include: {
          tipoCambio: true,
          flujoFondos: true,
          resultado: true,
          movimiento: true,
          rendimiento: true,
          saldoFinal: true,
        },
      });

      let dolares = 0;
      let compraUSD = 0;
      let ventaUSD = 0;
      let simple = 0;
      let estricto = 0;
      let potencial = 0;
      let compraSum = 0;
      let ventaSum = 0;
      let spreadSum = 0;
      let promedioSum = 0;
      let montoUSDFlujo = 0;
      let montoPENFlujo = 0;
      let forzado = 0;
      let medio = 0;
      let esperado = 0;
      let compraUSDMov = 0;
      let ventaUSDMov = 0;
      let montoUSDSaldo = 0;
      let montoPENSaldo = 0;
      let operacionesMes = 0;

      operaciones.forEach((operacion) => {
        dolares += operacion.dolares;
        compraUSD += operacion.movimiento?.compraUSD || 0;
        ventaUSD += operacion.movimiento?.ventaUSD || 0;
        simple += operacion.resultado?.simple || 0;
        estricto += operacion.resultado?.estricto || 0;
        potencial += operacion.resultado?.potencial || 0;
        compraSum += operacion.tipoCambio?.compra || 0;
        ventaSum += operacion.tipoCambio?.venta || 0;
        spreadSum += operacion.tipoCambio?.spread || 0;
        promedioSum += operacion.tipoCambio?.promedio || 0;
        montoUSDFlujo += operacion.flujoFondos?.montoUSD || 0;
        montoPENFlujo += operacion.flujoFondos?.montoPEN || 0;
        forzado += operacion.rendimiento?.forzado || 0;
        medio += operacion.rendimiento?.medio || 0;
        esperado += operacion.rendimiento?.esperado || 0;
        compraUSDMov += operacion.movimiento?.compraUSD || 0;
        ventaUSDMov += operacion.movimiento?.ventaUSD || 0;
        montoUSDSaldo += operacion.saldoFinal?.montoUSD || 0;
        montoPENSaldo += operacion.saldoFinal?.montoPEN || 0;
        operacionesMes++;
      });
      totalOperaciones += operacionesMes; // Acumula el total de operaciones
      const monthName = new Intl.DateTimeFormat("es-PE", {
        month: "long",
      }).format(startDate);
      const compraPromedioMes = operacionesMes > 0 ? compraSum / operacionesMes : 0;
      const ventaPromedioMes = operacionesMes > 0 ? ventaSum / operacionesMes : 0;
      const spreadPromedioMes = operacionesMes > 0 ? spreadSum / operacionesMes : 0;
      const promedioMes = operacionesMes > 0 ? promedioSum / operacionesMes : 0;

      monthlyTotals.push({
        fecha: `${monthName} ${year}`,
        dolares: Number(dolares.toFixed(2)),
        compraUSD: Number(compraUSD.toFixed(2)),
        ventaUSD: Number(ventaUSD.toFixed(2)),
        simple: Number(simple.toFixed(2)),
        estricto: Number(estricto.toFixed(2)),
        potencial: Number(potencial.toFixed(2)),
        compra: Number(compraPromedioMes.toFixed(2)),
        venta: Number(ventaPromedioMes.toFixed(2)),
        spread: Number(spreadPromedioMes.toFixed(2)),
        promedio: Number(promedioMes.toFixed(2)),
        montoUSDFlujo: Number(montoUSDFlujo.toFixed(2)),
        montoPENFlujo: Number(montoPENFlujo.toFixed(2)),
        forzado: Number(forzado.toFixed(2)),
        medio: Number(medio.toFixed(2)),
        esperado: Number(esperado.toFixed(2)),
        compraUSDMov: Number(compraUSDMov.toFixed(2)),
        ventaUSDMov: Number(ventaUSDMov.toFixed(2)),
        montoUSDSaldo: Number(montoUSDSaldo.toFixed(2)),
        montoPENSaldo: Number(montoPENSaldo.toFixed(2)),
        operacionesMes: operacionesMes,
      });

      accumulatedDolares += dolares;
      accumulatedCompraUSD += compraUSD;
      accumulatedVentaUSD += ventaUSD;
      accumulatedSimple += simple;
      accumulatedEstricto += estricto;
      accumulatedPotencial += potencial;
      accumulatedCompra += compraSum;
      accumulatedVenta += ventaSum;
      accumulatedSpread += spreadSum;
      accumulatedPromedio += promedioSum;
      accumulatedMontoUSDFlujo += montoUSDFlujo;
      accumulatedMontoPENFlujo += montoPENFlujo;
      accumulatedForzado += forzado;
      accumulatedMedio += medio;
      accumulatedEsperado += esperado;
      accumulatedCompraUSDMov += compraUSDMov;
      accumulatedVentaUSDMov += ventaUSDMov;
      accumulatedMontoUSDSaldo += montoUSDSaldo;
      accumulatedMontoPENSaldo += montoPENSaldo;
    }
    const accumulatedPromedioCompra =
      totalOperaciones > 0 ? accumulatedCompra / totalOperaciones : 0;
    const accumulatedPromedioVenta = totalOperaciones > 0 ? accumulatedVenta / totalOperaciones : 0;
    const accumulatedPromedioSpread =
      totalOperaciones > 0 ? accumulatedSpread / totalOperaciones : 0;
    const accumulatedPromedioPromedio =
      totalOperaciones > 0 ? accumulatedPromedio / totalOperaciones : 0;

    const accumulatedObject = {
      fecha: `Acumulado ${year}`,
      dolares: accumulatedDolares,
      compraUSD: accumulatedCompraUSD,
      ventaUSD: accumulatedVentaUSD,
      simple: accumulatedSimple,
      estricto: accumulatedEstricto,
      potencial: accumulatedPotencial,
      compra: Number(accumulatedPromedioCompra.toFixed(2)),
      venta: Number(accumulatedPromedioVenta.toFixed(2)),
      spread: Number(accumulatedPromedioSpread.toFixed(2)),
      promedio: Number(accumulatedPromedioPromedio.toFixed(2)),
      montoUSDFlujo: Number(accumulatedMontoUSDFlujo.toFixed(2)),
      montoPENFlujo: Number(accumulatedMontoPENFlujo.toFixed(2)),
      forzado: Number(accumulatedForzado.toFixed(2)),
      medio: Number(accumulatedMedio.toFixed(2)),
      esperado: Number(accumulatedEsperado.toFixed(2)),
      compraUSDMov: Number(accumulatedCompraUSDMov.toFixed(2)),
      ventaUSDMov: Number(accumulatedVentaUSDMov.toFixed(2)),
      montoUSDSaldo: Number(accumulatedMontoUSDSaldo.toFixed(2)),
      montoPENSaldo: Number(accumulatedMontoPENSaldo.toFixed(2)),
      operacionesMes: Number(totalOperaciones.toFixed(2)), // Agrega el total de operaciones al objeto acumulado
    };

    return [...monthlyTotals, accumulatedObject];
  } catch (error) {
    console.error(`Error fetching Operacion totals for year ${year} with accumulated:`, error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function obtenerClientesAtendidos(anio: string) {
  const currentYear = new Date();
  const start = startOfYear(currentYear);
  const end = endOfYear(currentYear);

  const empieza = start.toISOString().split("T")[0];
  const fin = end.toISOString().split("T")[0];
  console.log("-----------------------------");
  console.log("EMPIEZA: ", empieza);
  console.log("TERMINA: ", fin);
  console.log(anio);
  console.log("-----------------------------");

  const operaciones = await prisma.operacion.findMany({
    where: {
      fecha: {
        gte: start,
        lt: end,
      },
    },
    orderBy: {
      fecha: "desc",
    },
    include: {
      usuario: true,
    },
  });

  const resultadosPorMes: {
    [mes: string]: {
      clientes: Set<string>;
      empresa: Set<string>;
      clientesTotal: number;
      empresasTotal: number;
    };
  } = {};

  const nombresMeses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  nombresMeses.forEach(async (nombreMes) => {
    resultadosPorMes[nombreMes] = {
      clientes: new Set<string>(),
      empresa: new Set<string>(),
      clientesTotal: 0,
      empresasTotal: 0,
    };
  });

  const operacionesPorMes = nombresMeses.map(async (nombreMes, index) => {
    // Calcular las fechas de inicio y fin para el mes actual
    const start = new Date(Number(anio), index, 1);
    // El día 0 del siguiente mes es el último día del mes actual
    const end = new Date(Number(anio), index + 1, 0);

    // Formatear las fechas a cadenas ISO para la consulta de Prisma
    const empieza1 = start.toISOString().split("T")[0];
    const fin1 = end.toISOString().split("T")[0];

    // Contar clientes con tipo_cliente "persona_natural" para el mes actual
    const clientesTotal = await prisma.operacion.count({
      where: {
        fecha: {
          gte: `${empieza1}T00:00:00.000Z`,
          lte: `${fin1}T23:59:59.999Z`,
        },
        usuario: {
          tipo_cliente: "persona_natural",
        },
      },
    });

    // Contar empresas con tipo_cliente "persona_juridica" para el mes actual
    // CORRECCIÓN: Usar 'empieza1' y 'fin1' en lugar de 'empieza' y 'fin'
    const empresasTotal = await prisma.operacion.count({
      where: {
        fecha: {
          gte: `${empieza1}T00:00:00.000Z`, // Corregido
          lte: `${fin1}T23:59:59.999Z`, // Corregido
        },
        usuario: {
          tipo_cliente: "persona_juridica",
        },
      },
    });

    // Imprimir los resultados para depuración
    console.log("-----------------------------");
    console.log("EMPIEZA: ", empieza1, anio);
    console.log("TERMINA: ", fin1, anio);
    console.log(anio);
    console.log("CLIENTES TOTAL: ", clientesTotal);
    console.log("EMPRESAS TOTAL: ", empresasTotal);
    console.log("-----------------------------");

    // Asignar los totales al objeto resultadosPorMes
    resultadosPorMes[nombreMes].clientesTotal = clientesTotal;
    resultadosPorMes[nombreMes].empresasTotal = empresasTotal;

    // Retornar algo si necesitas procesar los resultados después de Promise.all
    // En este caso, la asignación directa a resultadosPorMes es suficiente.
    return { nombreMes, clientesTotal, empresasTotal };
  });

  // Esperar a que todas las promesas se resuelvan
  await Promise.all(operacionesPorMes);

  operaciones.forEach((operacion) => {
    const nombreMes = format(operacion.fecha, "MMMM", { locale: es });

    const tipoCliente = operacion.usuario?.tipo_cliente;
    const nombreUsuario = `${operacion.usuario.nombres} ${operacion.usuario.apellido_paterno} ${operacion.usuario.apellido_materno}`;

    if (tipoCliente === "persona_natural") {
      // resultadosPorMes[nombreMes].clientesTotal = Number(resultadosPorMes[nombreMes].clientesTotal || 0) + 1;
      resultadosPorMes[nombreMes].clientes.add(nombreUsuario);
    } else if (tipoCliente === "persona_juridica") {
      // resultadosPorMes[nombreMes].empresasTotal = Number(resultadosPorMes[nombreMes].empresasTotal || 0) + 1;
      resultadosPorMes[nombreMes].empresa.add(nombreUsuario);
    }
  });

  // Formatear la respuesta como un array de 12 objetos, obteniendo el tamaño de los Sets
  const respuesta = nombresMeses.map((nombreMes) => ({
    fecha: nombreMes,
    clientes: resultadosPorMes[nombreMes]?.clientes.size || 0,
    empresa: resultadosPorMes[nombreMes]?.empresa.size || 0,
    clientesTotal: resultadosPorMes[nombreMes]?.clientesTotal || 0,
    empresasTotal: resultadosPorMes[nombreMes]?.empresasTotal || 0,
  }));

  return respuesta;
}

interface TablaMes {
  mes: string;
  totalClientes: number;
  totalEmpresas: number;
  totalOperaciones: number;
  primerPorcentaje: number;
  primerAcumulado: number;
  montos: number;
  segundoPorcentaje: number;
  segundoAcumulado: number;
  ticketPromedio: number;
  comprasTransferencias: number;
  ventasTransferencias: number;
  tipoCambioCompra: number;
  tipoCambioVenta: number;
  totalClientesAtendidos: number;
  totalEmpresasAtendidas: number;
  resaltarFila: { active: boolean };
}

export async function obtenerTotalTablaAño(req: Request, res: Response): Promise<any | undefined> {
  try {
    const meses = [
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
    const resultados: TablaMes[] = [];
    const anio = req.query.anio || new Date().getUTCFullYear();
    const montoCambiado = await obtenerTotalOperacionCacluloFLUJO(String(anio));

    const resultadosClientes = await obtenerClientesAtendidos(String(anio));

    meses.forEach((mes, index) => {
      if (index === 0) {
        const newResultados: TablaMes = {
          mes: mes,
          totalClientes: resultadosClientes[index]?.clientesTotal || 0,
          totalEmpresas: resultadosClientes[index]?.empresasTotal || 0,
          totalOperaciones:
            (resultadosClientes[index]?.empresasTotal || 0) +
            (resultadosClientes[index]?.clientesTotal || 0),
          montos: montoCambiado[index]?.dolares ? montoCambiado[index]?.dolares / 1000 : 0,
          comprasTransferencias: montoCambiado[index]?.compraUSD
            ? montoCambiado[index]?.compraUSD / 1000
            : 0,
          primerAcumulado: 0,
          primerPorcentaje: 100,
          segundoAcumulado: 0,
          segundoPorcentaje: 100,
          ticketPromedio: formatearNumeroDecimal(
            montoCambiado[index]?.dolares / 1000 / montoCambiado[index]?.operacionesMes
          ),
          tipoCambioCompra: montoCambiado[index]?.compra ? montoCambiado[index]?.compra : 0,
          tipoCambioVenta: montoCambiado[index]?.venta ? montoCambiado[index]?.venta : 0,
          totalClientesAtendidos: resultadosClientes[index]?.clientes || 0,
          totalEmpresasAtendidas: resultadosClientes[index]?.empresa || 0,
          ventasTransferencias: montoCambiado[index]?.ventaUSD
            ? montoCambiado[index]?.ventaUSD / 1000
            : 0,
          resaltarFila: {
            active: false,
          },
        };
        resultados.push(newResultados);
      } else {
        const newResultados: TablaMes = {
          mes: mes,
          totalClientes: resultadosClientes[index]?.clientesTotal || 0,
          totalEmpresas: resultadosClientes[index]?.empresasTotal || 0,
          totalOperaciones:
            (resultadosClientes[index]?.empresasTotal || 0) +
            (resultadosClientes[index]?.clientesTotal || 0),
          montos: montoCambiado[index]?.dolares
            ? formatearNumeroDecimal(montoCambiado[index]?.dolares / 1000)
            : 0,
          comprasTransferencias: montoCambiado[index]?.compraUSD
            ? formatearNumeroDecimal(montoCambiado[index]?.compraUSD / 1000)
            : 0,
          primerAcumulado: Math.round(
            (montoCambiado[index]?.operacionesMes / montoCambiado[0]?.operacionesMes - 1) * 100
          ),
          primerPorcentaje: Math.round(
            (montoCambiado[index]?.operacionesMes / montoCambiado[index - 1]?.operacionesMes - 1) *
              100
          ),
          segundoAcumulado: Math.round(
            (montoCambiado[index]?.dolares / 1000 / (montoCambiado[0]?.dolares / 1000) - 1) * 100
          ),
          segundoPorcentaje: Math.round(
            (montoCambiado[index]?.dolares / 1000 / (montoCambiado[index - 1]?.dolares / 1000) -
              1) *
              100
          ),
          ticketPromedio: formatearNumeroDecimal(
            montoCambiado[index]?.dolares / 1000 / montoCambiado[index]?.operacionesMes
          ),
          tipoCambioCompra: montoCambiado[index]?.compra ? montoCambiado[index]?.compra : 0,
          tipoCambioVenta: montoCambiado[index]?.venta ? montoCambiado[index]?.venta : 0,
          totalClientesAtendidos: resultadosClientes[index]?.clientes || 0,
          totalEmpresasAtendidas: resultadosClientes[index]?.empresa || 0,
          ventasTransferencias: montoCambiado[index]?.ventaUSD
            ? formatearNumeroDecimal(montoCambiado[index]?.ventaUSD / 1000)
            : 0,
          resaltarFila: {
            active: false,
          },
        };
        console.log(newResultados);
        resultados.push(newResultados);
      }
    });

    console.log("PRUEBA : ", resultados);
    return res.status(200).json(resultados);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error al obtener el total del año" });
  } finally {
    await prisma.$disconnect();
    return;
  }
}

export async function exportarExcelTablaAño(req: Request, res: Response): Promise<void> {
  try {
    const meses = [
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

    const anio = parseInt(req.query.anio as string) || 2025;
    const montoCambiado = await obtenerTotalOperacionCacluloFLUJO(String(anio));
    const resultadosClientes = await obtenerClientesAtendidos(String(anio));

    const datosExcel: any[] = [];

    meses.forEach((mes, index) => {
      const baseData = {
        Mes: mes,
        Personas: resultadosClientes[index]?.clientesTotal || "",
        Empresas: resultadosClientes[index]?.empresasTotal || "",
        Operaciones:
          (resultadosClientes[index]?.empresasTotal || 0) +
          (resultadosClientes[index]?.clientesTotal || 0),
        "+/- %":
          index !== 0
            ? `${
                Math.round(
                  (montoCambiado[index]?.operacionesMes / montoCambiado[index - 1]?.operacionesMes -
                    1) *
                    100
                ) || ""
              } %`
            : "100%",
        "Acum.":
          index !== 0
            ? `${
                Math.round(
                  (montoCambiado[index]?.operacionesMes / montoCambiado[0]?.operacionesMes - 1) *
                    100
                ) || ""
              } %`
            : "",
        "Montos ($000)": formatearNumeroDecimal(
          montoCambiado[index]?.dolares ? montoCambiado[index]?.dolares / 1000 : 0
        ),
        "+/- % ":
          index !== 0
            ? `${
                Math.round(
                  (montoCambiado[index]?.dolares /
                    1000 /
                    (montoCambiado[index - 1]?.dolares / 1000) -
                    1) *
                    100
                ) || ""
              } %`
            : "100%",
        "Acum. ":
          index !== 0
            ? `${
                Math.round(
                  (montoCambiado[index]?.dolares / 1000 / (montoCambiado[0]?.dolares / 1000) - 1) *
                    100
                ) || ""
              } %`
            : "",
        "Tick. Prom.":
          formatearNumeroDecimal(
            montoCambiado[index]?.dolares / 1000 / montoCambiado[index]?.operacionesMes
          ) || "",
        "Compras Transferencias": montoCambiado[index]?.compraUSD
          ? formatearNumeroDecimal(montoCambiado[index]?.compraUSD / 1000)
          : "",
        "Ventas Transferencias": montoCambiado[index]?.ventaUSD
          ? formatearNumeroDecimal(montoCambiado[index]?.ventaUSD / 1000)
          : "",
        "TC Compra": montoCambiado[index]?.compra || 0,
        "TC Venta": montoCambiado[index]?.venta || 0,
        "Personas ": resultadosClientes[index]?.clientes || 0,
        "Empresas ": resultadosClientes[index]?.empresa || 0,
      };

      datosExcel.push(baseData);
    });

    // Crear el workbook y worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datosExcel);

    // Agregar cabeceras personalizadas
    const headers = [
      "Mes",
      "Personas",
      "Empresas",
      "Operaciones",
      "+/- %",
      "Acum.",
      "Montos ($000)",
      "+/- %",
      "Acum.",
      "Tick. Prom.",
      "Compras Transferencias",
      "Ventas Transferencias",
      "TC Compra",
      "TC Venta",
      "Personas",
      "Empresas",
    ];

    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });
    XLSX.utils.book_append_sheet(wb, ws, "Totales");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", `attachment; filename=totales_${anio}.xlsx`);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al exportar el Excel" });
  }
}
