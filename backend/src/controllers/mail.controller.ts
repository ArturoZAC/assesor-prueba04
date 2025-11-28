import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
import { ENV } from "../config/config";

// Usar process.cwd() para obtener la raíz del proyecto
const rootDir = process.cwd();
const uploadDir = path.join(rootDir, "src/mail");
const logFilePath = path.join(rootDir, "src", "error.log");

// Función para escribir en el log
const writeLog = (message: string) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logFilePath, logMessage, "utf8");
};

export const transporter = nodemailer.createTransport({
  //@ts-ignore
  host: ENV.EMAIL_HOST,
  port: ENV.EMAIL_PORT,
  secure: ENV.EMAIL_SECURE,
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendEmail = async (
  to: string | string[],
  subject: string,
  templateName: string,
  replacements: any
) => {
  try {
    const templatePath = path.join(uploadDir, templateName);
    console.log(`Ruta de la plantilla de correo: ${templatePath}`);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`La plantilla de correo no existe en: ${templatePath}`);
    }

    const source = fs.readFileSync(templatePath, "utf-8").toString();
    const template = Handlebars.compile(source);
    const htmlToSend = template(replacements);

    if (Array.isArray(to)) {
      to = to.join(", ");
    }

    await transporter.sendMail({
      from: ENV.EMAIL_USER,
      to,
      subject,
      html: htmlToSend,
    });

    writeLog(`Correo enviado a: ${to} | Asunto: ${subject}`);
    return true;
  } catch (error: any) {
    writeLog(
      `Error al enviar correo a: ${to} | Asunto: ${subject} | Detalle: ${error.message}`
    );
    console.error("Error enviando correo:", error);
    return false;
  }
};

export const enviarLibroReclamacionMail = async (req: any, res: any) => {
  const data = req.body;
  console.log("data: ", data);
  try {
    const soporteEmail = await transporter.sendMail({
      from: `"Nuevo Reclamo" <notificaciones@cencapperu.com>`,
      to: process.env.EMAIL_USER,
      subject: "Nuevo Reclamo Registrado",
      html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #f9f9f9;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
              <h2 style="color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px;">📄 Libro de Reclamaciones</h2>
              <p><strong>Nombre:</strong> ${data.nombre} ${
        data.apellidoPaterno
      } ${data.apellidoMaterno}</p>
              <p><strong>Correo:</strong> ${data.correo}</p>
              <p><strong>Teléfono:</strong> ${data.telefono}</p>
              <p><strong>Dirección:</strong> ${data.direccion}, ${
        data.distrito
      }, ${data.provincia}, ${data.departamento}</p>
              <p><strong>Monto reclamado:</strong> S/. ${data.monto}</p>
              <p><strong>Descripción:</strong> ${
                data.descripcion || "(Sin descripción)"
              }</p>
              <p><strong>Detalle del reclamo:</strong></p>
              <p style="white-space: pre-line;">${data.detalleReclamo}</p>
            </div>
          </div>
        `,
    });

    // Si el envío fue exitoso, envía el segundo correo al cliente
    if (soporteEmail.accepted.length > 0) {
      await sendEmail(
        data.correo,
        "Reclamo enviado",
        `/reclamaciones/ReclamoEnviado.html`,
        {
          nombre: data.nombre,
        }
      );
    }

    res.status(200).json({ message: "Reclamación enviada correctamente" });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    res.status(500).json({ message: "Error al enviar correo", error });
  }
};
