import { ENV } from "../config/config";
import jwt from "jsonwebtoken";

export const authRequired = (req: any, res: any, next: any): void => {
  let token = req.cookies.token;

  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return res.status(400).json({ message: "Autorización denegada" });

  jwt.verify(token, ENV.TOKEN_SECRET, (err: any, user: any) => {
    if (err) return res.status(401).json({ message: "Token inválido" });
    req.user = user;
    next();
  });
};
