import { Router } from 'express';
import { sendOtpHandler, verifyOtpHandler } from './auth.controller';

const router = Router();

// Route to request an OTP be sent to the user's email
router.post('/send-otp', sendOtpHandler);

// Route to verify the OTP and get a session token
router.post('/verify-otp', verifyOtpHandler);

export { router };