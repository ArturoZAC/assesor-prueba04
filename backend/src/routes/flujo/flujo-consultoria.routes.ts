import { editarConsultoriaFlujo, obtenerConsultoriaFlujo, obtenerIdConsultoriaFlujo, registrarConsultoriaFlujo } from "../../controllers/flujo/flujo-consultoria.controller";
import { Router } from "express";

const router = Router();

router.get("", obtenerConsultoriaFlujo)
router.post("", registrarConsultoriaFlujo)
router.post("/:id", editarConsultoriaFlujo)
router.post("/exportar/tabla-excel")
router.get("/:id", obtenerIdConsultoriaFlujo)

export default router;