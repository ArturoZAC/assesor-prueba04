import { validateSchema } from "../middlewares/validatorSchemas.middleware";
import {
  editarGasto,
  eliminarGasto,
  exportarGastosExcel,
  getCuadreGastos,
  obtenerGastos,
  registrarGasto,
} from "../controllers/gastos/gastos.controller";
import { Router } from "express";
import { agregarGastoSchema } from "../schemas/gastos/gastoSchema";
import {
  editarTipoCambio,
  exportarRecopilacionAnio,
  recopilarGastosAnio,
  registrarGastoAnio,
  registrarTipoCambio,
} from "../controllers/gastos/recopilacionGastos.controller";

const router = Router();

router.get("", obtenerGastos);
router.post("/agregar", validateSchema(agregarGastoSchema), registrarGasto);
router.put("/editar/:id", validateSchema(agregarGastoSchema), editarGasto);
router.post("/eliminar/:id", eliminarGasto);
router.post("/tipo/agregar", registrarTipoCambio);
router.post("/tipo/editar/:id", editarTipoCambio);

router.get("/exportarTablaGastos/:tipo", exportarGastosExcel);
router.get("/dataTotalGastos", getCuadreGastos);

router.get("/recopilacion-anio", recopilarGastosAnio);
router.post("/recopilacion-anio/registro", registrarGastoAnio);
router.post("/recopilacion-anio/exportar-excel", exportarRecopilacionAnio);
export default router;
