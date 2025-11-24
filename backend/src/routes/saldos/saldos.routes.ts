import { obtenerSaldosPorMes } from "../../controllers/saldos/saldos.controller";
import { Router } from "express";

const router = Router();

router.get("/grafica-saldos", obtenerSaldosPorMes)

export default router;