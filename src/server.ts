import "dotenv/config";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { ZodError } from "zod";
import { authRouter } from "./features/auth/auth.routes";
import { usersRouter } from "./features/users/users.routes";
import { swaggerSpec } from "./shared/config/swagger";
import { connectDatabase } from "./shared/infra/database";
import { errorHandler, HttpError } from "./shared/middleware/errorHandler";

const PORT = process.env.PORT ?? 4002;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";

const app = express();

app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "estudamais-ms-users" });
});

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

app.use((err: unknown, req: Parameters<typeof errorHandler>[1], res: Parameters<typeof errorHandler>[2], next: Parameters<typeof errorHandler>[3]) => {
  if (err instanceof ZodError) {
    return errorHandler(new HttpError(400, err.errors.map((issue) => issue.message).join(", ")), req, res, next);
  }
  return errorHandler(err, req, res, next);
});

async function bootstrap(): Promise<void> {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`estudamais-ms-users rodando na porta ${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Falha ao iniciar o servico:", error);
  process.exit(1);
});
