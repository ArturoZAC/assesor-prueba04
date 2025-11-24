import { authRequired } from "../middlewares/validateToken";
import { getDecodedUser, obtenerCliente, profile } from "../controllers/user.controller";
import { Router } from "express";
import { verifyAdmin, verifyUser } from "../middlewares/JWTMiddleware";

const router = Router();

router.get("", verifyUser, getDecodedUser);
router.get("/perfil/:userId", authRequired, profile);
router.get("/yo", verifyAdmin, getDecodedUser);
router.get("/cliente/:id", obtenerCliente);

export default router;
