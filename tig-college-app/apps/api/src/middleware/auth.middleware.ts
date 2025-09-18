// in src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Add a custom property 'user' to the Request interface
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export function protect(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated: No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev');
    req.user = decoded; // Attach user payload (id, roles, etc.) to the request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Not authenticated: Invalid token.' });
  }
}