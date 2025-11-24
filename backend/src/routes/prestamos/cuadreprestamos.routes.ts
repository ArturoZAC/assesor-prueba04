
import { borrarDevolucionesPrestamo, borrarSalidasPrestamo, editarCuadreDevolucion, editarCuadrePrestamo, exportarExcelPrestamos, obtenerCuadrePrestamos, obtenerCuadrePrestamosPorId, registrarCuadrePrestamo, registrarCuadrePrestamoDevolucion, registrarCuadrePrestamoSalida } from "../../controllers/prestamos/cuadre-prestamos.controller"
import { Router } from "express"

const router = Router()

router.get("", obtenerCuadrePrestamos)
router.get("/:id", obtenerCuadrePrestamosPorId)
router.post("/salida/editar/:id", editarCuadrePrestamo)
router.post("/devolucion/editar/:id", editarCuadreDevolucion)
router.post("", registrarCuadrePrestamo)
router.post("/salida/:id", registrarCuadrePrestamoSalida)
router.post("/devolucion/:id", registrarCuadrePrestamoDevolucion)
router.post("/exportar/tabla-excel", exportarExcelPrestamos)
router.post("/salida/borrar/:id", borrarSalidasPrestamo)
router.post("/devolucion/borrar/:id", borrarDevolucionesPrestamo)

export default router