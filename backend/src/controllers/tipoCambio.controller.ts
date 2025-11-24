import fs from "fs";
import path from "path";

import * as cheerio from "cheerio";
import puppeteer from "puppeteer";
import { Prisma } from "@prisma/client";

import { Response, Request } from "express";
import prisma from "../config/database";
import { obtenerApiKeyDisponible } from "../utils/obtenerApiKeyDisponible";

const estadoPath = path.join(__dirname, "../estado-metodo.json");

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
];

export const obtenerTipoCambioConPuppeteer = async () => {
  console.log("Traer con   puppeteer");
  const browser = await puppeteer.launch({ headless: "shell" });
  const page = await browser.newPage();

  await page.setUserAgent(randomUserAgent());
  await page.goto(
    "https://www.bloomberg.com/quote/USDPEN:CUR?embedded-checkout=true",
    {
      waitUntil: "networkidle2",
    }
  );

  // Aquí replicamos tu lógica para encontrar el `sized-price` con clase "extraLarge"
  const price = await page.$$eval(
    '[data-component="sized-price"]',
    (elements) => {
      for (const el of elements) {
        const className = el.getAttribute("class") || "";
        if (className.includes("extraLarge")) {
          return el.textContent?.trim() || null;
        }
      }
      return null;
    }
  );

  await browser.close();

  if (!price) throw new Error("No se pudo obtener el precio");

  const parsed = parseFloat(price);
  console.log("PRECIO: ", parsed);
  return {
    fecha: new Date().toISOString(),
    precioCompra: parsed,
    precioVenta: parsed,
    moneda: "USD/PEN",
  };
};

// const proxies = [
//     { host: "128.199.202.122", port: 8080 },
//     { host: "77.246.102.182", port: 1080 },
//     { host: "43.153.109.22", port: 13001 },
//     { host: "47.251.87.74", port: 1000 },
//     { host: "51.89.21.99", port: 61693 },
//   ];

// function getRandomProxy() {
//   return proxies[Math.floor(Math.random() * proxies.length)];
// }

const randomUserAgent = () =>
  userAgents[Math.floor(Math.random() * userAgents.length)];

export const obtenerTipoCambio = async () => {
  const url =
    "https://www.bloomberg.com/quote/USDPEN:CUR?embedded-checkout=true";

    const apiKey = obtenerApiKeyDisponible();

  try {
    console.log("🔁 Enviando solicitud a ScraperAPI...");

    const scraperUrl = `https://api.scraperapi.com/?api_key=${apiKey}&url=${encodeURIComponent(
      url
    )}`;

    // Realiza la solicitud a ScraperAPI
    const response = await fetch(scraperUrl);
    const body = await response.text();

    if (!response.ok) {
      throw new Error("Error al obtener los datos de ScraperAPI");
    }

    // Si todo va bien, ahora procesamos el HTML usando cheerio
    const $ = cheerio.load(body);
    const priceElements = $('[data-component="sized-price"]');

    let price: string | null = null;

    priceElements.each((_, el): any => {
      const className = $(el).attr("class") || "";
      if (className.includes("extraLarge")) {
        price = $(el).text().trim();
        return false;
      }
    });

    if (!price) {
      throw new Error(
        "Precio no encontrado. Puede que Bloomberg cargue con JS."
      );
    }

    const parsedPrice = parseFloat(price);
    console.log("PRECIO: ", parsedPrice);
    return {
      fecha: new Date().toISOString(),
      precioCompra: parsedPrice,
      precioVenta: parsedPrice,
      moneda: "USD/PEN",
    };
  } catch (error: any) {
    console.warn(`⚠️ Error: ${error.message}`);
    throw new Error(`Error scraping Bloomberg: ${error.message}`);
  }
};

export const traerTipoCambio = async (req: Request, res: Response) => {
  try {
    console.log("Consultando tipo de cambio en tiempo real...");
    const tipoCambio = await obtenerTipoCambio();
    res.json({ tipoCambio });
  } catch (error: any) {
    console.error("Error al obtener tipo de cambio:", error.message);
    res.status(500).json({ error: "Error al obtener tipo de cambio" });
  }
};

export const traerIntervalos = async (req: any, res: any) => {
  try {
    const intervalos = await prisma.tipoCambio.findMany();
    res.json({
      intervalos: {
        intervaloVenta: intervalos[0]?.intervaloVenta,
        intervaloCompra: intervalos[0]?.intervaloCompra,
        updatedAt: intervalos[0]?.updatedAt,
        ultimoPrecio: intervalos[0]?.middlePrice,
      },
    });
  } catch (error: any) {
    console.error("Error al traer Intervalos:", error.message);
    res.status(500).json({ error: "Error al traer Intervalos" });
  }
};

export const traerPrecios = async (req: any, res: any) => {
  try {
    const precios = await prisma.tipoCambio.findMany();
    res.json({
      precios: {
        precioCompra: precios[0].precioCompra,
        precioVenta: precios[0].precioVenta,
      },
    });
  } catch (error: any) {
    console.error("Error al traer precios:", error.message);
    res.status(500).json({ error: "Error al traer Intervalos" });
  }
};

export const actualizarTipoCambio = async (req: any, res: any) => {
  try {
    const { intervaloCompra, intervaloVenta, precioCompra, precioVenta } =
      req.body;

    const tipoCambio = await prisma.tipoCambio.update({
      where: { id: 1 },
      data: {
        precioCompra: new Prisma.Decimal(precioCompra),
        precioVenta: new Prisma.Decimal(precioVenta),
        intervaloCompra: new Prisma.Decimal(intervaloCompra),
        intervaloVenta: new Prisma.Decimal(intervaloVenta),
      },
    });

    res.json({ message: "Tipo de cambio actualizado", tipoCambio });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al actualizar el tipo de cambio" });
  }
};

export const obtenerUltimaActualizacion = async (req: any, res: any) => {
  try {
    const tipoCambio = await prisma.tipoCambio.findMany({
      select: {
        updatedAt: true,
      },
    });

    res.json(tipoCambio);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener última actualización" });
  }
};

/******** BACKEND */
export const traerTipoCambioBackend = async () => {
  try {
    console.log("Consultando tipo de cambio en tiempo real...");
    const tipoCambio = await obtenerTipoCambio(); // Obtener tipo de cambio
    return tipoCambio; // Retorna los valores para el siguiente paso
  } catch (error: any) {
    console.error("Error al obtener tipo de cambio:", error.message);
    throw new Error("Error al obtener tipo de cambio");
  }
};

export const actualizarMiddlePriceBackend = async ({
  middlePrice,
}: {
  middlePrice: any;
}) => {
  try {
    const tipoCambio = await prisma.tipoCambio.update({
      where: { id: 1 },
      data: {
        middlePrice: middlePrice,
      },
    });
    console.log("middlePrice actualizado: ", tipoCambio);
    return tipoCambio;
  } catch (error: any) {
    console.error("Error al actualizar el tipo de cambio:", error.message);
    throw new Error("Error al actualizar tipo de cambio");
  }
};

export const actualizarTipoCambioBackend = async ({
  precioCompraAjustado,
  precioVentaAjustado,
}: {
  precioCompraAjustado: any;
  precioVentaAjustado: any;
}) => {
  try {
    console.log("Actualizando tipo de cambio en base de datos...");
    const tipoCambio = await prisma.tipoCambio.update({
      where: { id: 1 },
      data: {
        precioCompra: new Prisma.Decimal(precioCompraAjustado),
        precioVenta: new Prisma.Decimal(precioVentaAjustado),
      },
    });
    console.log("Tipo de cambio actualizado:", tipoCambio);
    return tipoCambio;
  } catch (error: any) {
    console.error("Error al actualizar el tipo de cambio:", error.message);
    throw new Error("Error al actualizar tipo de cambio");
  }
};

export const traerIntervalosBackend = async () => {
  try {
    const intervalos = await prisma.tipoCambio.findMany();

    // Retornar los intervalos directamente en lugar de usar `res`
    return {
      intervaloVenta: intervalos[0]?.intervaloVenta,
      intervaloCompra: intervalos[0]?.intervaloCompra,
    };
  } catch (error: any) {
    console.error("Error al traer Intervalos:", error.message);
    throw new Error("Error al traer Intervalos");
  }
};

const leerMetodoActual = (): "axios" | "puppeteer" => {
  try {
    const contenido = fs.readFileSync(estadoPath, "utf-8");
    const data = JSON.parse(contenido);
    return data.ultimoMetodo === "axios" ? "axios" : "puppeteer";
  } catch {
    return "axios"; // Por defecto, empieza con Axios
  }
};

const guardarMetodo = (metodo: "axios" | "puppeteer") => {
  fs.writeFileSync(
    estadoPath,
    JSON.stringify({ ultimoMetodo: metodo }),
    "utf-8"
  );
};

export const obtenerTipoCambioAlternado = async () => {
  const metodo = leerMetodoActual();
  let resultado;

  console.log(`🔁 Ejecutando método: ${metodo.toUpperCase()}`);

  try {
    if (metodo === "axios") {
      resultado = await obtenerTipoCambio();
    } else {
      resultado = await obtenerTipoCambioConPuppeteer();
    }

    // Alterna para el próximo intento
    guardarMetodo(metodo === "axios" ? "puppeteer" : "axios");

    return resultado;
  } catch (err) {
    console.error(`❌ Error con ${metodo.toUpperCase()}:`, err);

    // Intenta el otro como respaldo
    const fallbackMetodo = metodo === "axios" ? "puppeteer" : "axios";
    console.log(
      `🔄 Intentando con método alternativo: ${fallbackMetodo.toUpperCase()}`
    );

    try {
      const fallbackResultado =
        fallbackMetodo === "axios"
          ? await obtenerTipoCambio()
          : await obtenerTipoCambioConPuppeteer();

      // Si funcionó, también alternamos para el próximo intento
      guardarMetodo(fallbackMetodo);

      return fallbackResultado;
    } catch (fallbackErr) {
      console.error(`❌ Ambos métodos fallaron:`, fallbackErr);
      throw new Error("No se pudo obtener el tipo de cambio desde Bloomberg");
    }
  }
};
