import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodError, ZodSchema } from "zod";
export const validateSchema =
  (schema: ZodSchema): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      console.log(req.body);
      schema.parse(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        console.error(error.errors);
        res.status(400).json({
          message: "Error de validación",
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
        return;
      }
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
