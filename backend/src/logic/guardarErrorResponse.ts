import fs from "fs";

export function guardarErrorEnArchivo(mensaje: string, ruta: string) {
  console.log("Escribiendo error:", mensaje);
  const texto = `${mensaje}\n`;
  fs.appendFileSync(ruta, texto, {
    encoding: "utf8",
  });
}