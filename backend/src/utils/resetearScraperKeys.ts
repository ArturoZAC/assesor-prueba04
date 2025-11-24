import fs from "fs";
import path from "path";

const KEYS_PATH = path.join(__dirname, "scraperKeys.json");

export const resetearScraperKeys = () => {
  const data = fs.readFileSync(KEYS_PATH, "utf-8");
  const keys = JSON.parse(data);

  const resetKeys = keys.map((keyObj: any) => ({
    key: keyObj.key,
    uso: 0,
  }));

  fs.writeFileSync(KEYS_PATH, JSON.stringify(resetKeys, null, 2));
  console.log("✅ scraperKeys.json reseteado correctamente");
};
