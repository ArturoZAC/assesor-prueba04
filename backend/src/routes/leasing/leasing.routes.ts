import { editarLeasing, exportarLeasingExcel, obtenerLeasingAnulados, obtenerLeasingCaclulo, obtenerLeasings, registrarLeasing } from "../../controllers/leasing/leasing.controller";
import { Router } from "express";

const router = Router()

router.get("", obtenerLeasings)
router.post("", registrarLeasing)
router.post("/:id", editarLeasing)
router.get("/total-cuadro", obtenerLeasingCaclulo)
router.post("/exportar/tabla-excel", exportarLeasingExcel)
router.get("/leasing-anulados/:id", obtenerLeasingAnulados)

export default router