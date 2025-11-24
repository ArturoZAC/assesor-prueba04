import { exportarFlujoPrestamosExcel, graficaAcumuladosPrestamos, obtenerTotalFlujoPorPrestamos } from "../../controllers/flujo/flujo-prestamos.controller";
import { Router } from "express";

const router = Router();

router.get("", obtenerTotalFlujoPorPrestamos)
router.get("/grafica-acumulados", graficaAcumuladosPrestamos)
router.post("/exportar/tabla-excel", exportarFlujoPrestamosExcel)

export default router