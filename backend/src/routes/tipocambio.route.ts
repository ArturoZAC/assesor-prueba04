import {
  actualizarTipoCambio,
  obtenerUltimaActualizacion,
  traerIntervalos,
  traerPrecios,
  traerTipoCambio,
} from "../controllers/tipoCambio.controller";
import { Router } from "express";


const router = Router();

router.get("/traerTipoCambio", traerTipoCambio);
router.get("/traerPrecios", traerPrecios);
router.get("/ultimaActualizacion", obtenerUltimaActualizacion);
router.get("/traerIntervalos", traerIntervalos);
router.put("/actualizarTipoCambio", actualizarTipoCambio);

export default router;
