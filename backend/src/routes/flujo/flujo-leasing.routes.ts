import { obtenerTotalFlujoLeasing } from "../../controllers/flujo/flujo-leasing.controller";
import { Router } from "express";

const router = Router();

router.get("", obtenerTotalFlujoLeasing)

export default router