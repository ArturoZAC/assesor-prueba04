import express, { Application } from "express";
import cors from "cors";
import path from "path";

import cron from "node-cron";
import {
  actualizarMiddlePriceBackend,
  actualizarTipoCambioBackend,
  traerIntervalosBackend,
  traerTipoCambioBackend,
} from "./controllers/tipoCambio.controller";
import { resetearScraperKeys } from "./utils/resetearScraperKeys";

const app: Application = express();

app.use(
  cors({
    origin: [
      // "http://192.168.0.100:3000",
      "https://assessorperu.com",
      "https://administrador.assessorperu.com",
      "https://sistema.assessorperu.com",
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

// Configurar el servidor para usar el directorio 'public' como directorio de archivos estáticos
app.use("/public", express.static(path.resolve("public")));

cron.schedule("*/4 7-13 * * 1-5", async () => {
  try {
    console.log("Iniciando cron job...");
    const tipoCambio = await traerTipoCambioBackend();
    const intervalos = await traerIntervalosBackend();

    const { precioCompra, precioVenta } = tipoCambio;
    const { intervaloCompra, intervaloVenta } = intervalos;

    const precioCompraFinal = Number(precioCompra) - Number(intervaloCompra);
    const precioVentaFinal = Number(precioVenta) + Number(intervaloVenta);

    await actualizarMiddlePriceBackend({
      middlePrice: precioCompra,
    });

    await actualizarTipoCambioBackend({
      precioCompraAjustado: precioCompraFinal,
      precioVentaAjustado: precioVentaFinal,
    });

    console.log("Cron job ejecutado correctamente.");
  } catch (error) {
    console.error("Error al ejecutar cron job:", error);
  }
});

console.log("Cron job iniciado...");

cron.schedule("0 0 1 * *", () => {
  try {
    console.log("🗓️ Ejecutando reset mensual de scraperKeys.json...");
    resetearScraperKeys();
  } catch (error) {
    console.error("❌ Error al resetear scraperKeys:", error);
  }
});

app.use(express.json());

export default app;
