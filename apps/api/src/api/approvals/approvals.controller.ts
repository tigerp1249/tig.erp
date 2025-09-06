import { Request, Response } from "express";
import {
  findPendingApprovals,
  approveRequest,
  rejectRequest,
} from "./approvals.service";

// ================== Approval Handlers ==================

// Handler to get all pending approval requests
export async function getPendingApprovalsHandler(_req: Request, res: Response) {
  try {
    const pendingApprovals = await findPendingApprovals();
    return res.status(200).json(pendingApprovals);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

// Handler to approve a request
export async function approveRequestHandler(req: Request, res: Response) {
  try {
    const approvalId = parseInt(req.params.approvalId, 10);
    if (isNaN(approvalId)) {
      return res.status(400).json({ message: "Invalid approval ID." });
    }

    await approveRequest(approvalId);
    return res.status(200).json({ message: "Request approved successfully." });
  } catch (error: any) {
    if (error.message.includes("not found")) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
}

// Handler to reject a request
export async function rejectRequestHandler(req: Request, res: Response) {
  try {
    const approvalId = parseInt(req.params.approvalId, 10);
    if (isNaN(approvalId)) {
      return res.status(400).json({ message: "Invalid approval ID." });
    }

    // A reason for rejection is expected in the request body
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ message: "Rejection reason is required." });
    }

    await rejectRequest(approvalId, reason);
    return res.status(200).json({ message: "Request rejected successfully." });
  } catch (error: any) {
    if (error.message.includes("not found")) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
}
