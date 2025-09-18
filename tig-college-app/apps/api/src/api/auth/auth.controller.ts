// FINAL VERSION - src/api/auth/auth.controller.ts

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { generateAndSaveOtp, verifyOtp } from './auth.service';

const prisma = new PrismaClient();

const requestOtpSchema = z.object({
  identifier: z.string().min(1),
});

const verifyOtpSchema = z.object({
  identifier: z.string().min(1),
  otp: z.string().length(6),
});

export async function requestOtp(req: Request, res: Response) {
  const parseResult = requestOtpSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'A valid identifier (email or phone) is required.' });
  }

  try {
    const { identifier } = parseResult.data;
    const otp = await generateAndSaveOtp(identifier);

    if (!otp) {
      return res.status(200).json({ message: 'If a user with this identifier exists, an OTP has been sent.' });
    }

    console.log(`OTP for ${identifier} is: ${otp}`);
    return res.status(200).json({ message: 'An OTP has been sent.' });

  } catch (error) {
    console.error('Error requesting OTP:', error);
    return res.status(500).json({ error: 'An internal server error occurred.' });
  }
}

// A "debugging" version of the verifyOtpAndLogin function
export async function verifyOtpAndLogin(req: Request, res: Response) {
  const parseResult = verifyOtpSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'A valid identifier and a 6-digit OTP are required.' });
  }

  try {
    const { identifier, otp } = parseResult.data;
    const user = await verifyOtp(identifier, otp);

    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired OTP.' });
    }
    
    const userId = user.FacultyMasterId;
    const userName = user.Name;

    const roles = ['Faculty'];
    
    const hodCheck = await prisma.$queryRaw<any[]>`SELECT * FROM HOD_MASTER WHERE EMPLOYEE_MASTER_ID = ${userId}`;
    if (hodCheck.length > 0) {
      roles.push('HOD');
    }

    const adminCheck = await prisma.$queryRaw<any[]>`SELECT * FROM ADMIN_MASTER WHERE EMPLOYEE_MASTER_ID = ${userId}`;
    if (adminCheck.length > 0) {
      roles.push('Admin');
    }

    // --- Start of Debugging Block ---
    console.log('\n--- DEBUG: DATA BEFORE JWT CREATION ---');
    console.log('User object received from service:', JSON.stringify(user, null, 2));
    
    const jwtPayload = { sub: userId, name: userName, roles };
    
    console.log('Payload being used for JWT:', JSON.stringify(jwtPayload, null, 2));
    console.log('---------------------------------------\n');
    // --- End of Debugging Block ---

    const accessToken = jwt.sign(jwtPayload, process.env.JWT_SECRET || 'dev', { expiresIn: '30m' });
    
    return res.status(200).json({ accessToken });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ error: 'An internal server error occurred.' });
  }
}