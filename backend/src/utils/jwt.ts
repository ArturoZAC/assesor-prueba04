import { ENV } from "../config/config";
import jwt from "jsonwebtoken";

export interface JWTPayload {
  id: number | string;
}

export default function createAccessToken(payload: JWTPayload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      ENV.TOKEN_SECRET,
      {
        expiresIn: "1d",
      },
      (err: any, token: any) => {
        if (err) reject();
        resolve(token);
      }
    );
  });
}
