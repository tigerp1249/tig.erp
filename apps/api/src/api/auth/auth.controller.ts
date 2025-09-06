import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendLoginOtp, verifyLoginOtp } from "./auth.service"; 

export interface AuthenticatedRequest extends Request {
  user?: {
    sub: number;
    email: string;
    role: string;
  };
}


//* Middleware to verify JWT token from the Authorization header.
 
export function protect(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided." });
  }

  const token = bearer.split(" ")[1];

  try {
    const user = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-default-jwt-secret"
    );
    req.user = user as AuthenticatedRequest["user"];
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token." });
  }
}

/** 
 * Middleware factory to restrict access to specific roles.
 * Example usage: authorize('Admin', 'HOD')
 */
export function authorize(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res
        .status(403)
        .json({ message: "Forbidden: User role not found." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: You do not have the required role. Required: ${roles.join(
          " or "
        )}.`,
      });
    }

    next();
  };
}

// ================== Controller Handlers ==================

/**
 * Handles sending OTP to user email
 */
export async function sendOtpHandler(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }
    const result = await sendLoginOtp(email); // ✅ from service
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
}

/**
 * Handles verifying OTP and issuing JWT
 */
export async function verifyOtpHandler(req: Request, res: Response) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res
        .status(400)
        .json({ message: "Email and OTP are required." });
    }
    const result = await verifyLoginOtp(email, otp); // ✅ from service
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(401).json({ message: error.message });
  }
}
