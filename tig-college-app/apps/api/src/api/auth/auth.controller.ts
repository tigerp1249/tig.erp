import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";

const credsSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

export async function login(req: Request, res: Response) {
  const parse = credsSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: "Invalid payload" });
  const { email } = parse.data;

  // TODO: validate user from DB (Prisma) and compare password hash
  const accessToken = jwt.sign({ sub: email, role: "STUDENT" }, process.env.JWT_SECRET || "dev", { expiresIn: "20m" });
  const refreshToken = jwt.sign({ sub: email, type: "refresh" }, process.env.JWT_REFRESH_SECRET || "dev", { expiresIn: "30d" });

  res.json({ accessToken, refreshToken });
}

export async function refresh(_req: Request, res: Response) {
  // TODO: implement token rotation and revocation checks
  return res.status(501).json({ error: "Not implemented" });
}

export async function me(_req: Request, res: Response) {
  // TODO: read user from DB by req.user.sub (after auth middleware)
  res.json({ id: "demo", email: "demo@example.com", role: "STUDENT" });
}
