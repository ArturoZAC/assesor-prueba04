
import { graficoTotalRealPpto } from "../../controllers/flujo/flujo-prestamos.controller";
import { editFlujoAndPersonal, getFlujoAndPersonal, registerFlujoAndPersonal, obtenerUnFlujo, exportarExcelFlujo, graficaConsultoria } from "../../controllers/flujo/flujo-presupuesto.controller";
import { Router } from "express";

const router = Router();

router.post("", registerFlujoAndPersonal)
router.post("/:id", editFlujoAndPersonal)
router.get("", getFlujoAndPersonal)
router.get("/:id", obtenerUnFlujo)
router.post("/exportar/tabla-excel", exportarExcelFlujo)

/******************************* GRAFICAS ********************************** */
router.get("/grafica/total-real-ppto", graficoTotalRealPpto)
router.get("/grafica/consultoria", graficaConsultoria)

/********** REAL TOTAL */

export default router;
