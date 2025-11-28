import {
  corregirFechasOctubre,
  editarCuadreFacturacion,
  eliminarCuadreFacturacion,
  exportarExcelCuadreFacturacion,
  obtenerCuadreFacturacionPorId,
  obtenerTodosCuadreFacturacion,
  registrarCuadreFacturacion,
} from "../../controllers/facturacion/cuadrefacturacion.controller";
import { Router } from "express";

const router = Router();

//nuevo controlador para setear los 31 de octubre ya que en el metodo el js de mes empieza usando 0 - enero
router.get("/set-octubre", corregirFechasOctubre);
router.get("", obtenerTodosCuadreFacturacion);
router.get("/:id", obtenerCuadreFacturacionPorId);
router.post("", registrarCuadreFacturacion);
router.post("/:id", editarCuadreFacturacion);
router.post("/borrar/:id", eliminarCuadreFacturacion);
router.post("/exportar/tabla-excel", exportarExcelCuadreFacturacion);

export default router;
