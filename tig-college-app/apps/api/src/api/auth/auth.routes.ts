import { Router } from "express";
import { login, refresh, me } from "./auth.controller";
export const router = Router();

router.post("/login", login);
router.post("/refresh", refresh);
router.get("/me", me);
