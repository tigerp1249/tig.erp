import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Retrieves a list of all pending approval requests by calling the stored procedure.
 */
export async function findPendingApprovals() {
  return prisma.$queryRaw<any[]>`CALL sp_GetPendingApprovals()`;
}

/**
 * Approves a specific request by its ID by calling the stored procedure.
 * The stored procedure handles the transaction and updates the relevant tables.
 * @param approvalId The ID of the approval request to approve.
 */
export async function approveRequest(approvalId: number) {
  // The user processing the request is hardcoded as 'api-admin' for now.
  // In the future, this would come from the logged-in user's token.
  return prisma.$executeRaw`CALL sp_ApproveRequest(${approvalId}, 'api-admin')`;
}

/**
 * Rejects a specific request by its ID by calling the stored procedure.
 * @param approvalId The ID of the approval request to reject.
 * @param reason The reason for the rejection, provided by the manager.
 */
export async function rejectRequest(approvalId: number, reason: string) {
  // The user processing the request is hardcoded as 'api-admin' for now.
  return prisma.$executeRaw`CALL sp_RejectRequest(${approvalId}, ${reason}, 'api-admin')`;
}