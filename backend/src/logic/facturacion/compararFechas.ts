// export function compararFechas(fechaTexto: string, fechaOperacionStr: string): string {
//   const [dia, mes, anio] = fechaTexto.split("/").map(Number);
//   console.log(dia, mes, anio);
//   // const fechaInput = new Date(anio, mes, dia);

//   const fechaOperacion = new Date(fechaOperacionStr);
//   console.log("FECHA Operacion", fechaOperacion.getUTCMonth() + 1, fechaOperacion.getUTCDate());
//   console.log("FECHA INPUT", fechaInput.getUTCMonth(), fechaInput.getUTCDate());
//   console.log(
//     fechaInput.getUTCMonth() === fechaOperacion.getUTCMonth() + 1 &&
//       fechaInput.getUTCDate() === fechaOperacion.getUTCDate()
//   );
//   if (
//     fechaInput.getUTCMonth() === fechaOperacion.getUTCMonth() + 1 &&
//     fechaInput.getUTCDate() === fechaOperacion.getUTCDate()
//   ) {
//     return "FECHA OK";
//   }
//   return "ERROR";
// }

export function compararFechas(fechaTexto: string, fechaOperacion: Date): string {
  // fechaTexto en formato dd/mm/yyyy
  const [dia, mes, anio] = fechaTexto.split("/").map(Number);
  if (isNaN(dia) || isNaN(mes) || isNaN(anio)) return "ERROR";

  // Crear string YYYY-MM-DD para comparar
  const fechaInputStr = `${anio.toString().padStart(4, "0")}-${mes
    .toString()
    .padStart(2, "0")}-${dia.toString().padStart(2, "0")}`;

  const fechaOperacionStr = fechaOperacion.toISOString().split("T")[0];

  console.log("FECHA INPUT", fechaInputStr);
  console.log("FECHA Operacion", fechaOperacionStr);

  return fechaInputStr === fechaOperacionStr ? "FECHA OK" : "ERROR";
}
