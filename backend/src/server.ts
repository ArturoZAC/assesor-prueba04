import express, { Application } from "express";
import cors from "cors";
import path from "path";

// import cron from "node-cron";
// import {
//   actualizarMiddlePriceBackend,
//   actualizarTipoCambioBackend,
//   traerIntervalosBackend,
//   traerTipoCambioBackend,
// } from "./controllers/tipoCambio.controller";
// import { resetearScraperKeys } from "./utils/resetearScraperKeys";
// import { obtenerEstadoKeys, sincronizarConScraperAPI } from "./utils/obtenerApiKeyDisponible";

const app: Application = express();

app.use(
  cors({
    origin: [
      "https://assessorperu.com",
      "https://administrador.assessorperu.com",
      "https://sistema.assessorperu.com",
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use("/public", express.static(path.resolve("public")));

// ============================================
// 🧪 CRON DE DEBUG - CADA MINUTO (TEMPORAL)
// ============================================

// cron.schedule("* * * * *", () => {
//   const ahora = new Date();
//   console.log(
//     `🧪 [HEARTBEAT] ${ahora.toLocaleString('es-PE', { timeZone: 'America/Lima' })} | ` +
//     `Día: ${['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie'][ahora.getDay()]} | ` +
//     `Hora: ${ahora.getHours()}:${ahora.getMinutes().toString().padStart(2, '0')}`
//   );
// });

// // ============================================
// // 📊 CRON PRINCIPAL: Actualizar Tipo de Cambio
// // ============================================

// cron.schedule("*/4 7-13 * * 1-5", async () => {
//   try {
//     console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
//     console.log("🕐 Iniciando cron job de tipo de cambio...");

//     const tipoCambio = await traerTipoCambioBackend();
//     const intervalos = await traerIntervalosBackend();

//     const { precioCompra, precioVenta } = tipoCambio;
//     const { intervaloCompra, intervaloVenta } = intervalos;

//     const precioCompraFinal = Number(precioCompra) - Number(intervaloCompra);
//     const precioVentaFinal = Number(precioVenta) + Number(intervaloVenta);

//     await actualizarMiddlePriceBackend({
//       middlePrice: precioCompra,
//     });

//     await actualizarTipoCambioBackend({
//       precioCompraAjustado: precioCompraFinal,
//       precioVentaAjustado: precioVentaFinal,
//     });

//     console.log("✅ Tipo de cambio actualizado correctamente.");
//     console.log(`   💰 Compra: ${precioCompraFinal.toFixed(4)}`);
//     console.log(`   💰 Venta: ${precioVentaFinal.toFixed(4)}`);
//     console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
//   } catch (error: any) {
//     console.error("❌ ERROR CRÍTICO en cron job:", error.message);
//   }
// });

// // ============================================
// // 🔄 RESET MENSUAL (1ro de cada mes a medianoche)
// // ============================================

// cron.schedule("0 0 1 * *", async () => {
//   try {
//     console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
//     console.log("🗓️  RESET MENSUAL DE SCRAPER KEYS");
//     console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

//     await resetearScraperKeys();

//     const estado = obtenerEstadoKeys();
//     console.log("\n📊 Estado después del reset:");
//     console.log(JSON.stringify(estado, null, 2));

//     console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
//   } catch (error: any) {
//     console.error("❌ Error al resetear scraperKeys:", error.message);
//   }
// });

// // ============================================
// // 🔍 SINCRONIZACIÓN SEMANAL (Lunes 2am)
// // ============================================

// cron.schedule("0 2 * * 1", async () => {
//   try {
//     console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
//     console.log("🔄 SINCRONIZACIÓN SEMANAL CON SCRAPERAPI");
//     console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

//     await sincronizarConScraperAPI();

//     const estado = obtenerEstadoKeys();
//     console.log("\n📊 Estado actualizado:");
//     console.log(JSON.stringify(estado, null, 2));

//     console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
//   } catch (error: any) {
//     console.error("❌ Error en sincronización:", error.message);
//   }
// });

// // ============================================
// // 📊 REPORTE DIARIO (Lunes-Viernes 6pm)
// // ============================================

// cron.schedule("0 18 * * 1-5", () => {
//   try {
//     console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
//     console.log("📊 REPORTE DIARIO DE SCRAPER KEYS");
//     console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

//     const estado = obtenerEstadoKeys();
//     console.log(JSON.stringify(estado, null, 2));

//     const porcentajeUsado = parseFloat(estado.porcentajeUso);
//     if (porcentajeUsado > 70) {
//       console.warn(
//         `⚠️  ALERTA: Uso de créditos al ${estado.porcentajeUso}. Considera agregar más keys.`
//       );
//     }

//     console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
//   } catch (error: any) {
//     console.error("❌ Error en reporte diario:", error.message);
//   }
// });

// // ============================================
// // 🚀 INICIALIZACIÓN
// // ============================================

// const ahora = new Date();
// console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
// console.log("🚀 Sistema de Cron Jobs Iniciado");
// console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
// console.log(`🕐 Hora actual servidor: ${ahora.toISOString()}`);
// console.log(`🌎 Hora Lima: ${ahora.toLocaleString('es-PE', { timeZone: 'America/Lima' })}`);
// console.log(`📅 Día: ${['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'][ahora.getDay()]}`);
// console.log(`⏰ Hora local: ${ahora.getHours()}:${ahora.getMinutes().toString().padStart(2, '0')}`);
// console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
// console.log("📅 Cron de Tipo de Cambio: */4 7-13 * * 1-5");
// console.log("   (Cada 4min de 7am-1pm, Lun-Vie)");
// console.log("🔄 Reset Mensual: 0 0 1 * *");
// console.log("🔍 Sincronización Semanal: 0 2 * * 1");
// console.log("📊 Reporte Diario: 0 18 * * 1-5");
// console.log("🧪 Debug Heartbeat: * * * * * (cada minuto)");
// console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

// // Calcular próxima ejecución del cron principal
// const diaActual = ahora.getDay();
// const horaActual = ahora.getHours();
// const minutoActual = ahora.getMinutes();

// if (diaActual >= 1 && diaActual <= 6) {
//   if (horaActual >= 7 && horaActual <= 13) {
//     const proximoMultiploDe4 = Math.ceil((minutoActual + 1) / 4) * 4;
//     const minutosParaEjecucion = (proximoMultiploDe4 > 60) 
//       ? (60 - minutoActual) 
//       : (proximoMultiploDe4 - minutoActual);
    
//     console.log(`✅ Cron principal ACTIVO`);
//     console.log(`⏰ Próxima ejecución en ~${minutosParaEjecucion} minuto(s)`);
//   } else {
//     const horaProxima = horaActual < 7 ? 7 : "7am del próximo día hábil";
//     console.log(`⏸️  Cron principal PAUSADO (fuera de horario 7am-1pm)`);
//     console.log(`⏰ Se activará a las ${horaProxima}`);
//   }
// } else {
//   console.log(`⏸️  Cron principal PAUSADO (hoy es ${['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'][diaActual]})`);
//   console.log(`⏰ Se activará el Lunes a las 7am`);
// }

// console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

// // Mostrar estado inicial de keys
// try {
//   const estadoInicial = obtenerEstadoKeys();
//   console.log("📊 Estado Inicial de Scraper Keys:");
//   console.log(JSON.stringify(estadoInicial, null, 2));
// } catch (error: any) {
//   console.error("❌ Error al cargar estado inicial:", error.message);
// }

// console.log("\n🎯 Esperando ejecuciones...\n");

app.use(express.json());

export default app;