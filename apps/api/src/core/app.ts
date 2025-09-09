import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { staffRouter as staffRoutes } from "../api/staff/staff.routes";
import { router as approvalRoutes } from "../api/approvals/approvals.routes";
// REMOVED: No longer need to import experienceRoutes

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors({ credentials: true, origin: true }));
  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser());
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  // API Routes
  app.use("/api/v1/staff", staffRoutes);
  app.use("/api/v1/approvals", approvalRoutes);
  // REMOVED: No longer need to use experienceRoutes

  // 404
  app.use((_req, res) => res.status(404).json({ error: "Not found" }));

  return app;
};