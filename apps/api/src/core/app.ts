import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { router as authRoutes } from "../api/auth/auth.routes";

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors({ credentials: true, origin: true }));
  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser());
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/v1/auth", authRoutes);

  // 404
  app.use((_req, res) => res.status(404).json({ error: "Not found" }));

  return app;
};
