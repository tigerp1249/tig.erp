import { Router } from "express";
import { requestOtp, verifyOtpAndLogin } from "./auth.controller";

export const router = Router();

// 1. A new route for a user to request an OTP
router.post("/otp/request", requestOtp);

// 2. A new route for a user to submit the OTP and get their login tokens
router.post("/otp/verify", verifyOtpAndLogin);