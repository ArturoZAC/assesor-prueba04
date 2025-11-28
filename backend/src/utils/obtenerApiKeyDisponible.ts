import fs from "fs";
import path from "path";
import axios from "axios";

const KEYS_PATH = path.join(__dirname, "scraperKeys.json");
const BACKUP_PATH = path.join(__dirname, "scraperKeys.backup.json");

interface ScraperKey {
  key: string;
  uso: number;
  ultimoReset: string;
  ultimaValidacion?: string;
  creditosReales?: number;
  activa: boolean;
  erroresConsecutivos: number;
}

// ============================================
// 🔧 GESTIÓN MEJORADA DE KEYS
// ============================================

export const obtenerApiKeyDisponible = (): string => {
  const keys = cargarKeys();

  // Buscar key con menos uso y activa
  const keyDisponible = keys
    .filter((k) => k.activa && k.uso < 950) // Margen de seguridad
    .sort((a, b) => a.uso - b.uso)[0];

  if (!keyDisponible) {
    // Intentar recuperar keys con errores
    const keyConErrores = keys
      .filter((k) => k.erroresConsecutivos > 0 && k.erroresConsecutivos < 5)
      .sort((a, b) => a.uso - b.uso)[0];

    if (keyConErrores) {
      console.warn("⚠️ Usando key con errores previos:", keyConErrores.key.slice(0, 8));
      keyConErrores.erroresConsecutivos = 0;
      guardarKeys(keys);
      return keyConErrores.key;
    }

    throw new Error(
      "❌ CRÍTICO: No hay API keys disponibles. Revisa ScraperAPI dashboard."
    );
  }

  // Incrementar uso
  keyDisponible.uso += 1;
  guardarKeys(keys);

  console.log(
    `✅ Key seleccionada: ${keyDisponible.key.slice(0, 8)}... (Uso: ${keyDisponible.uso}/1000)`
  );

  return keyDisponible.key;
};

// ============================================
// 🔄 ROTACIÓN INTELIGENTE
// ============================================

export const rotarKey = (keyActual: string, error: boolean = false): string => {
  const keys = cargarKeys();
  const indexActual = keys.findIndex((k) => k.key === keyActual);

  if (error && indexActual !== -1) {
    keys[indexActual].erroresConsecutivos += 1;

    // Desactivar si hay muchos errores consecutivos
    if (keys[indexActual].erroresConsecutivos >= 5) {
      keys[indexActual].activa = false;
      console.error(
        `🚫 Key desactivada por errores: ${keyActual.slice(0, 8)}...`
      );
    }

    guardarKeys(keys);
  }

  // Obtener siguiente key disponible
  return obtenerApiKeyDisponible();
};

// ============================================
// 🔍 VALIDACIÓN REAL CON SCRAPERAPI
// ============================================

export const validarCreditosReales = async (
  apiKey: string
): Promise<number> => {
  try {
    // ScraperAPI tiene un endpoint para ver cuenta
    const response = await axios.get(
      `https://api.scraperapi.com/account?api_key=${apiKey}`
    );

    const creditosRestantes = response.data.requestLimit - response.data.requestCount;
    
    console.log(`💳 Créditos reales para ${apiKey.slice(0, 8)}...: ${creditosRestantes}`);
    
    return creditosRestantes;
  } catch (error: any) {
    console.error(`❌ Error validando key ${apiKey.slice(0, 8)}:`, error.message);
    return -1; // Indica error
  }
};

// ============================================
// 🔄 RESET INTELIGENTE (Ejecutar 1ro de mes)
// ============================================

export const resetearScraperKeys = async (): Promise<void> => {
  console.log("🔄 Iniciando reset mensual...");

  const keys = cargarKeys();
  
  // Backup antes de resetear
  fs.writeFileSync(BACKUP_PATH, JSON.stringify(keys, null, 2));

  // Validar cada key con ScraperAPI
  for (const key of keys) {
    const creditosReales = await validarCreditosReales(key.key);

    key.uso = creditosReales === -1 ? key.uso : Math.max(0, 1000 - creditosReales);
    key.ultimoReset = new Date().toISOString();
    key.ultimaValidacion = new Date().toISOString();
    key.creditosReales = creditosReales;
    key.activa = creditosReales > 50; // Reactivar si tiene créditos
    key.erroresConsecutivos = 0;

    console.log(
      `✅ Key ${key.key.slice(0, 8)}... reseteada. Créditos reales: ${creditosReales}`
    );

    // Esperar 1 segundo entre validaciones
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  guardarKeys(keys);
  console.log("✅ Reset mensual completado.");
};

// ============================================
// 🛡️ VALIDACIÓN SEMANAL (Recomendado)
// ============================================

export const sincronizarConScraperAPI = async (): Promise<void> => {
  console.log("🔄 Sincronizando con ScraperAPI...");

  const keys = cargarKeys();

  for (const key of keys) {
    const creditosReales = await validarCreditosReales(key.key);

    if (creditosReales !== -1) {
      key.uso = 1000 - creditosReales;
      key.ultimaValidacion = new Date().toISOString();
      key.creditosReales = creditosReales;
      key.activa = creditosReales > 10;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  guardarKeys(keys);
  console.log("✅ Sincronización completada.");
};

// ============================================
// 📊 REPORTES Y MONITOREO
// ============================================

export const obtenerEstadoKeys = (): any => {
  const keys = cargarKeys();

  const total = keys.length;
  const activas = keys.filter((k) => k.activa).length;
  const usoTotal = keys.reduce((sum, k) => sum + k.uso, 0);
  const creditosDisponibles = total * 1000 - usoTotal;

  return {
    total,
    activas,
    usoTotal,
    creditosDisponibles,
    porcentajeUso: ((usoTotal / (total * 1000)) * 100).toFixed(2) + "%",
    keys: keys.map((k) => ({
      key: k.key.slice(0, 8) + "...",
      uso: k.uso,
      activa: k.activa,
      creditosReales: k.creditosReales,
      ultimaValidacion: k.ultimaValidacion,
    })),
  };
};

// ============================================
// 📁 UTILIDADES INTERNAS
// ============================================

const cargarKeys = (): ScraperKey[] => {
  if (!fs.existsSync(KEYS_PATH)) {
    throw new Error(`❌ Archivo ${KEYS_PATH} no encontrado`);
  }

  const data = fs.readFileSync(KEYS_PATH, "utf-8");
  const keys = JSON.parse(data);

  // Migrar formato antiguo si es necesario
  return keys.map((k: any) => ({
    key: k.key,
    uso: k.uso || 0,
    ultimoReset: k.ultimoReset || new Date().toISOString(),
    ultimaValidacion: k.ultimaValidacion,
    creditosReales: k.creditosReales,
    activa: k.activa !== undefined ? k.activa : true,
    erroresConsecutivos: k.erroresConsecutivos || 0,
  }));
};

const guardarKeys = (keys: ScraperKey[]): void => {
  fs.writeFileSync(KEYS_PATH, JSON.stringify(keys, null, 2));
};