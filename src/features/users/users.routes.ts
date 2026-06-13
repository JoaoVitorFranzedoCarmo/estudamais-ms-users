import { Router } from "express";
import { pool } from "../../shared/infra/database";
import { AuthRequest, requireAuth } from "../../shared/middleware/auth";
import { PgUserRepository } from "./users.repository";
import { updateUserSchema } from "./users.schema";
import { UserService } from "./users.service";

export const usersRouter = Router();

const userService = new UserService(new PgUserRepository(pool));

usersRouter.get("/me", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const user = await userService.getUserById(req.userId as string);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

usersRouter.patch("/me", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const input = updateUserSchema.parse(req.body);
    const user = await userService.updateUser(req.userId as string, input);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/me", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    await userService.deleteUser(req.userId as string);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});
