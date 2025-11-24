import { Router } from "express";
import { validateSchema } from "../middlewares/validatorSchemas.middleware";
import {
  loginSchema,
} from "../schemas/auth.schema";
import {
  login,
  logout,
} from "../controllers/auth.controller";
import { enviarLibroReclamacionMail } from '../controllers/mail.controller';


const router = Router();

// Auth
router.post("/login", validateSchema(loginSchema), login);

router.post('/libro-reclamaciones', enviarLibroReclamacionMail);


router.post("/logout", logout);
export default router;
