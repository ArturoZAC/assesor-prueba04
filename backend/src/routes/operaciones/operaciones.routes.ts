import {
  editarOperacion,
  eliminarOperacionDolares,
  eliminarOperacionSoles,
  exportarExcelTablaAño,
  exportarOperacionesExcel,
  getOperacionesPorMes,
  importarCuadresHandler,
  importarOperacionesHandler,
  obtenerGraficaGeneracionCaja,
  obtenerOperaciones,
  obtenerTotalOperacionCaclulo,
  obtenerTotalTablaAño,
  obtenerUltimaOperacion,
  obtenerUltimaOperacionEditar,
  registrarOperacion,
  sacarGraficaClientesAtendidos,
  sacarGraficaMontosCambiados,
  sacarGraficaPromedio,
  sacarGraficaRendimientosMensuales,
  sacarGraficaSpread,
  sacarGraficaTicketPromedio,
} from "../../controllers/operaciones/operaciones.controller";
import { Router } from "express";
import { validateSchema } from "../../middlewares/validatorSchemas.middleware";
import {
  agregarOperacionSchema,
  editarOperacionSchema,
} from "../../schemas/operaciones/operaciones.schema";
import {
  editarCuadreOperacionDolar,
  editarCuadreOperacionSoles,
  exportarCuadreOperacionesExcel,
  obtenerCuadreOperaciones,
  registrarCuadreOperacionDolar,
  registrarCuadreOperacionSoles,
  seteandoValoresErroneosFaltantes,
  traerCuadresPorId,
} from "../../controllers/operaciones/cuadreoperaciones.controller";
import {
  agregarCuadreOperacionDolarSchema,
  agregarCuadreOperacionSolesSchema,
} from "../../schemas/operaciones/cuadreoperaciones.schema";

const router = Router();

router.get("/", obtenerOperaciones);
router.get("/ultimaOperacion", obtenerUltimaOperacion);
router.get("/ultimaOperacion/:id", obtenerUltimaOperacionEditar);
router.post("/eliminarCuadreOperacionDolares/:id", eliminarOperacionDolares);
router.post("/eliminarCuadreOperacionSoles/:id", eliminarOperacionSoles);

router.post("/agregar", validateSchema(agregarOperacionSchema), registrarOperacion);

router.post("/editar/:id", validateSchema(editarOperacionSchema), editarOperacion);

/*------------------ RUTAS PARA LOS GRÁFICOS */
router.get("/operaciones-por-mes", getOperacionesPorMes);
router.get("/spread-todos", sacarGraficaSpread);
router.get("/promedio-grafica-todos", sacarGraficaPromedio);

/* CUADRE OPERACIONES */
router.get("/traerCuadres/:id", traerCuadresPorId);
router.get("/obtenerCuadreOperaciones", obtenerCuadreOperaciones);

router.post(
  "/agregarCuadreOpDolar",
  validateSchema(agregarCuadreOperacionDolarSchema),
  registrarCuadreOperacionDolar
);

router.post(
  "/agregarCuadreOpSoles",
  validateSchema(agregarCuadreOperacionSolesSchema),
  registrarCuadreOperacionSoles
);

router.get("/total-cuadro", obtenerTotalOperacionCaclulo);

router.post(
  "/editarCuadreOpDolar/:id",
  validateSchema(agregarCuadreOperacionDolarSchema),
  editarCuadreOperacionDolar
);

router.post(
  "/agregarCuadreOpSoles",
  validateSchema(agregarCuadreOperacionSolesSchema),
  registrarCuadreOperacionSoles
);

router.post(
  "/editarCuadreOpSoles/:id",
  validateSchema(agregarCuadreOperacionSolesSchema),
  editarCuadreOperacionSoles
);

/**
 * 
 * Buenos días estimados, se ha subido el sistema a producción, las credenciales siguen siendo las mismas la url es
https://assessorperu.com/

también se estará eliminando en 3 días la otra web que estaba de prueba, gracias
 */

router.get("/exportarTablaOperaciones/:tipo", exportarOperacionesExcel);

router.get("/grafico-generacion-caja", obtenerGraficaGeneracionCaja);
router.get("/grafico-montos-cambiados", sacarGraficaMontosCambiados);
router.get("/grafico-cantidad-clientes-atendidos", sacarGraficaClientesAtendidos);
router.get("/grafico-rendimiento-mensuales", sacarGraficaRendimientosMensuales);
router.get("/grafico-ticket-promedio", sacarGraficaTicketPromedio);

router.get("/tabla-total-anio/cuadro/total", obtenerTotalTablaAño);

router.get("/exportarTablaCuadreOperaciones/:tipo", exportarCuadreOperacionesExcel);
router.post("/excel/exportarTablaResumen", exportarExcelTablaAño);
router.post("/importar-cuadres", importarCuadresHandler);

// router.post(
//   "/editarCuadreOperacion/:id",
//   validateSchema(editarCuadreOperacionSchema),
//   editarCuadreOperacion
// );

router.post("/importar-operaciones", importarOperacionesHandler);

router.get("/set-values-cuadres", seteandoValoresErroneosFaltantes);

export default router;
