import path from "path";
import fs from "fs";

const logFilePath = path.join(__dirname, "../..", "src", "error.log");
export const registrarError = (message: string) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logFilePath, logMessage, "utf8");
};
