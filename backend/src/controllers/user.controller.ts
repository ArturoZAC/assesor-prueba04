import * as bcrypt from "bcryptjs";
import prisma from "../config/database";
import { Request, Response } from "express";


export const profile = async (req: any, res: any) => {
  const { userId } = req.body;

  try {
    const user = await prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!user) return res.status(400).json({ message: "El usuario no existe" });

    return res.status(201).json({
      message: "Solicitud exitosa",
      usuario: {
        id: user.id,
        nombres: user.nombres,
        apellidos: user.apellido_paterno,
        email: user.email,
        telefono: user.telefono,
      },
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error interno del servidor.", error: error.message });
  }
};

export const yo = async (req: any, res: any) => {
  const userId = req.user?.id;

  try {
    const userEncontrado = await prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!userEncontrado)
      return res.status(400).json({ message: "El usuario no existe" });

    return res.status(201).json({
      message: "Solicitud exitosa",
      usuario: {
        id: userEncontrado.id,
        nombres: userEncontrado.nombres,
        apellidos: userEncontrado.apellido_paterno,
        email: userEncontrado.email,
        telefono: userEncontrado.telefono,
      },
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error interno del servidor.", error: error.message });
  }
};

export const cambiarContrasenaPerfil = async (req: any, res: any) => {
  const { newPassword } = req.body;
  const userId = req.user?.id;

  try {
    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.usuario.update({
      where: { id: userId },
      data: { password: hashed },
    });

    res.json({ message: "Contraseña actualizada con éxito" });
  } catch (error: any) {
    console.error("Error al actualizar perfil:", error.message);
    res.status(500).json({ error: error.message });
  } finally {
    prisma.$disconnect()
  }
};

export const getDecodedUser = async (req: Request, res: Response): Promise<any | undefined> => {
  try {
    const user = (req as any).user;

    if (!user) {
      return res
        .status(404)
        .json({ message: "Usuario no encontrado en la solicitud." });
    }
    return res.status(200).json(user);
  } catch (error: any) {
    console.error("Error al obtener usuario decodificado:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor.", error: error.message });
  } finally {
    prisma.$disconnect();
  }
};

export async function obtenerCliente(req: Request, res: Response): Promise<any | undefined> {
  const { id } = req.params

  try {
    const usuario = await prisma.usuario.findUnique({
      where: {
        id: String(id)
      }
    })

    return res.status(200).json({
      usuario
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'Error al traer el usuario'
    })
  } finally {
    prisma.$disconnect()
  }
}