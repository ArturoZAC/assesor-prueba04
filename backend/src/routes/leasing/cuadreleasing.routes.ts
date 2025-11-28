import { borrarCuadreLeasing, editarCuadreLeasing, exportarTablaExcel, obtenerCuadreLeasings, obtenerCuadreLeasingsPorId, registrarCuadreLeasing } from "../../controllers/leasing/cuadre-leasing.controller";
import { Router } from "express";

const router = Router()

router.get("", obtenerCuadreLeasings)
router.post("", registrarCuadreLeasing)
router.get("/:id", obtenerCuadreLeasingsPorId)
router.post("/:id", editarCuadreLeasing)
router.post("/borrar/:id/:leasingId", borrarCuadreLeasing)
router.post("/exportar/tabla-excel", exportarTablaExcel)

export default router