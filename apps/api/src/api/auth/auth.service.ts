import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const generateOtp = () => '123456'; 

/**
 * 
 * @param email 
 */
export async function sendLoginOtp(email: string) {
    const userResult = await prisma.$queryRaw<any[]>`CALL GetUserDetails(${email})`;

    if (!userResult.length || !userResult[0][0]) {
        throw new Error('User not found with that email address.');
    }
    
    const user = userResult[0][0];
    const otp = generateOtp();

    await prisma.$executeRaw`CALL UpdateLoginMaster(${user.EmployeeMasterID}, ${otp}, NOW() + INTERVAL 10 MINUTE, 0)`;

    console.log(`OTP for user ${user.EmployeeMasterID} is: ${otp}`); // For testing purposes

    return { message: `OTP sent successfully to ${email}.` };
}

/**
 * Step 2 of Login: Verifies the OTP and returns a JWT session token.
 * @param email The user's email address.
 * @param otp The 6-digit OTP the user entered.
 */
export async function verifyLoginOtp(email: string, otp: string) {
    const userResult = await prisma.$queryRaw<any[]>`CALL GetUserDetails(${email})`;

     if (!userResult.length || !userResult[0][0]) {
        throw new Error('User not found.');
    }
    const user = userResult[0][0];

    // Use existing procedure to get OTP data
    const otpDataResult = await prisma.$queryRaw<any[]>`CALL GetLoginMaster(${user.EmployeeMasterID})`;
    
    if (!otpDataResult.length) {
        throw new Error('No OTP found for this user. Please request one first.');
    }

    const storedOtp = otpDataResult[0];
    const isExpired = new Date(storedOtp.Expiry) < new Date();

    if (storedOtp.OTP !== otp || isExpired || storedOtp.Verified) {
        throw new Error('The OTP is invalid, has expired, or has already been used.');
    }

    // Mark OTP as verified so it can't be used again
    await prisma.$executeRaw`CALL UpdateLoginMaster(${user.EmployeeMasterID}, ${otp}, ${storedOtp.Expiry}, 1)`;
    
    // Fetch role details for the JWT
    const roleResult = await prisma.$queryRaw<any[]>`CALL GetUserDetails(${email})`;
    const roles = roleResult[2] || []; // Roles are in the third result set
    const userRole = roles.length ? roles[0].RoleName : 'Staff'; // Default role

    // Create a JWT token containing user info
    const accessToken = jwt.sign(
        { 
            sub: user.EmployeeMasterID, 
            email: user.EmailAddress,
            role: userRole 
        }, 
        process.env.JWT_SECRET || 'your-default-jwt-secret', 
        { expiresIn: '1h' }
    );

    return { accessToken, userDetails: user };
}

