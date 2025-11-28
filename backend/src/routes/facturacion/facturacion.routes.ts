import { Router } from "express";

import {
  exportarFacturacionExcel,
  obtenerFacturacion,
} from "../../controllers/facturacion/facturacion.controller";

const router = Router();

router.get("", obtenerFacturacion);
router.post("/exportar/tabla-excel", exportarFacturacionExcel);

export default router;
