import { Router } from "express";
import { pool } from "../../shared/infra/database";
import { PgUserRepository } from "../users/users.repository";
import { loginSchema, registerSchema } from "./auth.schema";
import { AuthService } from "./auth.service";

export const authRouter = Router();

const authService = new AuthService(new PgUserRepository(pool));

authRouter.post("/register", async (req, res, next) => {
  try {
    const input = registerSchema.parse(req.body);
    const result = await authService.register(input);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const result = await authService.login(input);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
