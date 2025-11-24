import path from "path";
import fs from "fs";


export function guardarError(mensaje: string) {
  const rutaArchivo = path.join(__dirname, '../../errores.txt');
  const fecha = new Date().toISOString();
  const texto = `[${fecha}] ${mensaje}\n`;

  fs.appendFile(rutaArchivo, texto, (err) => {
    if (err) {
      console.error('Error al guardar en errores.txt:', err);
    }
  });
}