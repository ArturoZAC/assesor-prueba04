
import { LoginRequest } from "../interfaces/auth.interface";
import { Response, Request } from "express";
import * as bcrypt from "bcryptjs";
import crypto from "crypto";
import createAccessToken from "../utils/jwt";
import { sendEmail } from "./mail.controller";
import { ENV } from "../config/config";
import prisma from "../config/database";


export const login = async (
  req: Request<{}, {}, LoginRequest>,
  res: Response
): Promise<any | undefined> => {
  const { email, password, mantenerConexion } = req.body;
  try {
    const usuarioExiste = await prisma.usuario.findFirst({
      where: { email },
    });

    if (!usuarioExiste)
      return res.status(400).json({ message: "El usuario no existe" });

    const isMatch = await bcrypt.compare(password, usuarioExiste.password);

    if (!isMatch)
      return res.status(400).json({ message: "Contraseña incorrecta" });

    const token = await createAccessToken({ id: usuarioExiste.id });

    res.cookie("token", token, {
      sameSite: "none", // "lax" funciona bien localmente
      secure: true, // false porque en localhost normalmente usas http
      httpOnly: true,
      domain: ENV.COOKIE_DOMAIN, // o simplemente omítelo en entorno local
      maxAge: mantenerConexion ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
    });

    const primerNombre = usuarioExiste.nombres.split(" ");

    res.json({
      message: `Bienvenido ${primerNombre[0]}`,
      usuario: {
        id: usuarioExiste.id,
        nombres: usuarioExiste.nombres,
        apellido_paterno: usuarioExiste.apellido_paterno,
        apellido_materno: usuarioExiste.apellido_materno,
        telefono: usuarioExiste.telefono,
        email: usuarioExiste.email,
        rol_id: usuarioExiste.rol_id,
      },
      status: 200,
      token: token,
    });
  } catch (error: any) {
    console.error("Error al iniciar sesión", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const recuperarContrasena = async (req: any, res: any) => {
  const { email } = req.body;

  const user = await prisma.usuario.findFirst({ where: { email } });
  if (!user) return res.status(404).json({ message: "Correo no registrado" });

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 30);

  await prisma.passwordResetToken.create({
    data: {
      token,
      expiresAt: expires,
      userId: user.id,
    },
  });

  const resetLink = `http://localhost:3000/restablecer?token=${token}`;

  await sendEmail(
    user.email,
    "Recuperar contraseña",
    `RecuperarContrasena.html`,
    {
      enlace: resetLink,
      nombre: user.nombres.split(" ")[0],
    }
  );

  res.json({
    message: "Te hemos enviado un enlace para restablecer tu contraseña.",
  });
};

export const cambiarContrasena = async (req: any, res: any) => {
  const { token, newPassword } = req.body;

  const registro = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!registro || registro.expiresAt < new Date()) {
    return res.status(400).json({ message: "Token inválido o expirado" });
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.usuario.update({
    where: { id: registro.userId },
    data: { password: hashed },
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  res.json({ message: "Contraseña actualizada con éxito" });
};

export const logout = (req: any, res: any) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  return res.sendStatus(200);
};

// const obtenerTipoCambio = async () => {
//   try {
//     const apiKey = ENV.TWELVE_DATA_API_KEY;

//     const response = await axios.get("https://api.twelvedata.com/time_series", {
//       params: {
//         symbol: "USD/PEN",
//         interval: "1min", // Actualización en tiempo real
//         outputsize: 1, // Solo el último dato disponible
//         apikey: apiKey,
//       },
//     });

//     const data = response.data;

//     if (data.status !== "ok" || !data.values || data.values.length === 0) {
//       throw new Error(data.message || "Error al obtener datos de la API");
//     }

//     const tipoCambio = data.values[0];

//     return {
//       fecha: tipoCambio.datetime,
//       precioCompra: parseFloat(tipoCambio.low), // Precio de compra (low)
//       precioVenta: parseFloat(tipoCambio.high), // Precio de venta (high)
//       moneda: "USD/PEN",
//     };
//   } catch (error: any) {
//     console.error("Error al obtener el tipo de cambio:", error.message);
//     throw new Error("Error al obtener el tipo de cambio");
//   }
// };

// Retraso aleatorio para simular usuario humano
// function randomDelay(min = 1500, max = 4000) {
//   return new Promise((resolve) =>
//     setTimeout(resolve, Math.random() * (max - min) + min)
//   );
// }
