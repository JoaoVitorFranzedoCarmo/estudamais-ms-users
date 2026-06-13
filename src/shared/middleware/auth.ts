import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "./errorHandler";

const JWT_SECRET = process.env.JWT_SECRET ?? "changeme";

export interface AuthRequest extends Request {
  userId?: string;
}

export interface JwtPayload {
  sub: string;
}

export function requireAuth(req: AuthRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new HttpError(401, "Token nao informado");
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.userId = payload.sub;
    next();
  } catch {
    throw new HttpError(401, "Token invalido ou expirado");
  }
}
