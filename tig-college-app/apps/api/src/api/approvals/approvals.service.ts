import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Retrieves a list of all pending approval requests by calling the stored procedure.
 */
export async function findPendingApprovals() {
  const result: any = await prisma.$queryRaw<any[]>`CALL sp_GetPendingApprovals()`;

  // Handle both cases: result is [[rows], metadata] OR just [rows]
  const rows = Array.isArray(result)
    ? (Array.isArray(result[0]) ? result[0] : result)
    : [];

  return rows.map((r: any) => ({
    ApprovalID: r.f0,
    EmployeeID: r.f1,
    FieldName: r.f2,
    OldValue: r.f3,
    NewValue: r.f4,
    RequestedAt: r.f5
  }));
}

/**
 * Approves a specific request by its ID by calling the stored procedure.
 */
export async function approveRequest(approvalId: number) {
  return prisma.$executeRaw`CALL sp_ApproveRequest(${approvalId}, 'api-admin')`;
}

/**
 * Rejects a specific request by its ID by calling the stored procedure.
 */
export async function rejectRequest(approvalId: number, reason: string) {
  return prisma.$executeRaw`CALL sp_RejectRequest(${approvalId}, ${reason}, 'api-admin')`;
}
