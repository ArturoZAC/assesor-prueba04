import { TipoFlujo } from "@prisma/client";
import prisma from "../../config/database";
import { Request, Response } from "express";


export async function registrarPorcentajeFlujo(req: Request, res: Response): Promise<any | undefined> {

  const {
    porcentajePersonal,
    porcentajeServicios,
    porcentajeGastosBancarios,
    porcentajeImpuestos,
    porcentajeOtrosGastos,
    porcentajeServiciosFondos,
    porcentajeServiciosStaff,
    tipoFlujo,
    anio
  } = req.body

  try {

    const flujoExistente = await prisma.porcentajeFlujo.findFirst({
      where: {
        anio: Number(anio),
        tipoFlujo: tipoFlujo as TipoFlujo
      }
    })

    if (flujoExistente) {
      const flujoBorrado = await prisma.porcentajeFlujo.delete({
        where: {
          id: flujoExistente.id
        }
      })

      const porcentaje = await prisma.porcentajeFlujo.create({
        data: {
          porcentajePersonal: Number(porcentajePersonal),
          porcentajeServicios: Number(porcentajeServicios),
          porcentajeGastosBancarios: Number(porcentajeGastosBancarios),
          porcentajeImpuestos: Number(porcentajeImpuestos),
          porcentajeOtrosGastos: Number(porcentajeOtrosGastos),
          porcentajeServiciosFondos: Number(porcentajeServiciosFondos),
          porcentajeServiciosStaff: Number(porcentajeServiciosStaff),
          anio: Number(anio),
          tipoFlujo: tipoFlujo as TipoFlujo
        }
      })

      return res.status(201).json({
        message: 'Porcentaje de flujo actualizado exitosamente',
        porcentaje,
        flujoBorrado
      })
    }

    const porcentaje = await prisma.porcentajeFlujo.create({
      data: {
        porcentajePersonal: Number(porcentajePersonal),
        porcentajeServicios: Number(porcentajeServicios),
        porcentajeGastosBancarios: Number(porcentajeGastosBancarios),
        porcentajeImpuestos: Number(porcentajeImpuestos),
        porcentajeOtrosGastos: Number(porcentajeOtrosGastos),
        porcentajeServiciosFondos: Number(porcentajeServiciosFondos),
        porcentajeServiciosStaff: Number(porcentajeServiciosStaff),
        anio: Number(anio),
        tipoFlujo: tipoFlujo as TipoFlujo
      }
    })

    return res.status(201).json({
      message: 'Porcentaje de flujo registrado exitosamente',
      porcentaje
    })

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al registrar porcentaje de flujo" });
  } finally {
    prisma.$disconnect()
  }
}