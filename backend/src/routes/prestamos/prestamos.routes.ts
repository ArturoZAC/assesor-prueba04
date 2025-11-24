import { Router } from "express";
import { validateSchema } from "../../middlewares/validatorSchemas.middleware";
import { PrestamoOperacionSchema } from "../../schemas/prestamos/prestamo.schema";
import {
  editarPrestamo,
  exportarExcelPrestamos,
  getTotal,
  obtenerPrestamos,
  obtenerPrestamosAnulados,
  obtenerTotalCapitalPorMes,
  registrarPrestamo,
  //Nuevo metodo para el formateo de la detraccion
  recalcularDetracciones,
} from "../../controllers/prestamos/prestamos.controller";

const router = Router();

router.get("/reset-detraccion", recalcularDetracciones);
router.post("", validateSchema(PrestamoOperacionSchema), registrarPrestamo);
router.get("", obtenerPrestamos);
router.post("/:id", editarPrestamo);

/** Excel */
router.post("/exportar/tabla-excel", exportarExcelPrestamos);

/** Graficas */
router.get("/total-capital-por-mes", obtenerTotalCapitalPorMes);

/** Calculo CUADRO TOTAL  */
router.get("/total-cuadro", getTotal);
router.get("/prestamos-anulados/:id", obtenerPrestamosAnulados);
export default router;
