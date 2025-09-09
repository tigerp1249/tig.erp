import { Router } from 'express';
import { 
  getPendingApprovalsHandler,
  approveRequestHandler,
  rejectRequestHandler // New
} from './approvals.controller';

const router = Router();

// GET /api/v1/approvals/pending
router.get('/pending', getPendingApprovalsHandler);

// POST /api/v1/approvals/:approvalId/approve
router.post('/:approvalId/approve', approveRequestHandler);

// NEW: POST /api/v1/approvals/:approvalId/reject
router.post('/:approvalId/reject', rejectRequestHandler);

export { router };