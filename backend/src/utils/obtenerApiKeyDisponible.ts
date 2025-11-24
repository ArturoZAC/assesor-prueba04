import fs from "fs";
import path from "path";

const KEYS_PATH = path.join(__dirname, "scraperKeys.json");

export const obtenerApiKeyDisponible = (): string => {
  const data = fs.readFileSync(KEYS_PATH, "utf-8");
  const keys = JSON.parse(data);

  const keyDisponible = keys.find((k: any) => k.uso < 1000);

  if (!keyDisponible) {
    throw new Error(
      "No hay API keys disponibles, todas han alcanzado el límite."
    );
  }

  keyDisponible.uso += 1;
  fs.writeFileSync(KEYS_PATH, JSON.stringify(keys, null, 2));

  return keyDisponible.key;
};
