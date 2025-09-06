import { Router } from 'express';
import multer from 'multer';
import { 
  onboardStaffHandler,
  getAllStaffHandler,
  getStaffByIdHandler,
  updateStaffHandler,
  softDeleteStaffHandler,
  reactivateStaffHandler,
  addExperienceHandler,
  addEducationHandler,
  addAccoladeHandler,
  bulkOnboardStaffHandler
} from './staff.controller';

const router = Router();

// Configure Multer to handle file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

// --- Core Admin Routes ---
router.post('/', onboardStaffHandler);
router.get('/', getAllStaffHandler);
router.get('/:staffId', getStaffByIdHandler);
router.put('/:staffId', updateStaffHandler);
router.delete('/:staffId', softDeleteStaffHandler);
router.post('/:staffId/reactivate', reactivateStaffHandler);

// --- Employee Self-Service Routes ---
router.post('/:staffId/experience', addExperienceHandler);
router.post('/:staffId/education', addEducationHandler);
router.post('/:staffId/accolade', addAccoladeHandler);

// --- Bulk Upload Route ---
router.post(
    '/bulk-onboard', 
    upload.single('staffFile'), 
    bulkOnboardStaffHandler
);

export { router };