import { exportarFlujoDivisasExcel, obtenerGraficaFlujoDivisas, obtenerTotalFlujoPorDivisas } from "../../controllers/flujo/flujo-real-divisas.controller";
import { Router } from "express";

const router = Router();

router.get("", obtenerTotalFlujoPorDivisas)
router.get("/grafica-divisas", obtenerGraficaFlujoDivisas)
router.post("/exportar/tabla-excel", exportarFlujoDivisasExcel)

export default router