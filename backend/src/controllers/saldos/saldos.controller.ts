
import prisma from "../../config/database";
import { Request, Response } from "express";


export async function obtenerSaldosPorMes (req: Request, res: Response): Promise<any | undefined> {
  const anio = Number(req.query.anio || new Date().getFullYear());
  const mes = Number(req.query.mes || new Date().getMonth() + 1);
  console.log(mes, anio)
  const start = new Date(anio, mes - 1, 1);
  const end = new Date(anio, mes, 0);

  const empieza = start.toISOString().split("T")[0];
  const fin = end.toISOString().split("T")[0];
  console.log(empieza, fin)
  const operaciones = await prisma.operacion.findMany({
    where: {
      fecha: {
        gte: `${empieza}T00:00:00.000Z`,
        lte: `${fin}T23:59:59.999Z`,
      },
      rendimiento: {
        isNot: null,
      },
    },
    select: {
      fecha: true,
      rendimiento: {
        select: {
          medio: true,
        },
      },
    },
  });

  const sumaPorDia: Record<number, number> = {};

  operaciones.forEach((op) => {
    const diaDelMes = op.fecha.getDate(); // Día como número (1–31)
    const medio = op.rendimiento?.medio ?? 0;

    if (!sumaPorDia[diaDelMes]) {
      sumaPorDia[diaDelMes] = 0;
    }

    sumaPorDia[diaDelMes] += Number(medio);
  });
  console.log(sumaPorDia)

  const resultado = Object.entries(sumaPorDia).map(([key, utilidad]) => ({
    key: Number(key),
    utilidad,
  }));

  return res.status(200).json(resultado);
}