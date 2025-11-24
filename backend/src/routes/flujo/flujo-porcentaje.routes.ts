import { registrarPorcentajeFlujo } from "../../controllers/flujo/fujo-porcentajes.controller";
import { Router } from "express";


const router = Router();

router.post("", registrarPorcentajeFlujo)


export default router
