// FINAL, WORKING VERSION - src/api/auth/auth.service.ts

import { PrismaClient } from '@prisma/client';
import { randomInt } from 'crypto';

const prisma = new PrismaClient();

export async function generateAndSaveOtp(identifier: string): Promise<string | null> {
  const otp = randomInt(100000, 999999).toString();
  const expiryMinutes = 10;
  
  const result = await prisma.$queryRaw<any[]>`
    CALL sp_RequestLoginOtp(${identifier}, ${otp}, ${expiryMinutes});
  `;

  if (result && result.length > 0) {
    return otp;
  }
  return null;
}

export async function verifyOtp(identifier: string, otp: string): Promise<any | null> {
  try {
    const employeeId = await prisma.$transaction(async (tx) => {
      const otpRecord = await tx.otpStore.findFirst({
        where: {
          OtpCode: otp,
          IsUsed: false,
          ExpiresAt: {
            gt: new Date(),
          },
          EMPLOYEE_MASTER: {
            OR: [
              { EmailAddress: identifier },
              { MobileNumber: identifier },
              {
                EMPLOYEE_ASSOCIATION: {
                  some: { EmailAddress: identifier },
                },
              },
            ],
          },
        },
      });

      if (!otpRecord) {
        throw new Error('Invalid or expired OTP.');
      }

      await tx.otpStore.update({
        where: { ID: otpRecord.ID },
        data: { IsUsed: true },
      });

      return otpRecord.EMPLOYEE_MASTER_ID;
    });

    // If the transaction was successful and we have an employee ID...
    if (employeeId) {
      //  Fetch the profile using a native Prisma query.
      const userProfile = await prisma.eMPLOYEE_MASTER.findUnique({
        where: { ID: employeeId },
        include: {
          EMPLOYEE_ASSOCIATION: true, // Include related association data
        },
      });

      if (!userProfile) return null;

      const latestAssociation = userProfile.EMPLOYEE_ASSOCIATION[0] || {};
      return {
        FacultyMasterId: userProfile.ID,
        EID: userProfile.EID,
        Name: [userProfile.Salutation, userProfile.FirstName, userProfile.MiddleName, userProfile.LastName].filter(Boolean).join(' '),
        MobileNumber: userProfile.MobileNumber,
        PersonalEmail: userProfile.EmailAddress,
        PANNumber: userProfile.PANNumber,
        AadharNumber: userProfile.AadharNumber?.toString(),
        DateOfBirth: userProfile.DateOfBirth,
        WhatsappNumber: userProfile.WhatsappNumber,
        Designation: latestAssociation.Designation,
        ProfessionalEmail: latestAssociation.EmailAddress,
      };
    }
    
    return null;

  } catch (error) {
    console.error('OTP verification failed:', (error as Error).message);
    return null;
  }
}