import {
  depurando,
  exportarFlujoTotalExcel,
  getFlujoREALTOTAL,
  graficaDivisas,
} from "../../controllers/flujo/flujo-real-total.controller";
import { Router } from "express";

const router = Router();

router.get("", getFlujoREALTOTAL);
router.get("/grafica-divisas", graficaDivisas);
router.post("/exportar/tabla-excel", exportarFlujoTotalExcel);

router.get("/depurando", depurando);

export default router;
