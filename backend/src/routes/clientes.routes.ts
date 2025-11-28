import {
  buscarCliente,
  editarCliente,
  exportarUsuariosExcel,
  importarUsuariosHandler,
  obtenerClientes,
  registrarCliente,
  uploadCliente,
} from "../controllers/clientes.controller";
import { Router } from "express";
import { validateSchema } from "../middlewares/validatorSchemas.middleware";
import { AgregarClienteSchema } from "../schemas/clientes.schema";

const router = Router();

router.get("/", obtenerClientes);
router.get("/buscarClientes/:search", buscarCliente);
router.post("/agregar", validateSchema(AgregarClienteSchema), registrarCliente);

router.post('/importar-usuarios',uploadCliente.single("file") , importarUsuariosHandler);
router.post("/editar/:id", validateSchema(AgregarClienteSchema), editarCliente);

router.get("/exportarTabla/:tipo", exportarUsuariosExcel);

export default router;
