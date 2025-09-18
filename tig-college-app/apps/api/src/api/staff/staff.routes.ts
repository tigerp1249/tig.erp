import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware'; // Import the middleware

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
  bulkOnboardStaffHandler,
  searchStaffHandler,
  getInactiveStaffHandler ,
  getSelfProfileHandler
  // 
} from './staff.controller';

const router = Router();

router.use(protect);


const upload = multer({ storage: multer.memoryStorage() });

// --- Core Staff Routes ---
router.get('/me', getSelfProfileHandler); //  route for a user to get their own profile
router.post('/', onboardStaffHandler);
router.get('/', getAllStaffHandler);
router.get('/search', searchStaffHandler); 
router.get('/status/inactive', getInactiveStaffHandler); //  route for inactive staff
router.get('/:staffId', getStaffByIdHandler);
router.put('/:staffId', updateStaffHandler);
router.delete('/:staffId', softDeleteStaffHandler);
router.post('/:staffId/reactivate', reactivateStaffHandler);

// --- Nested Profile Routes ---
router.post('/:staffId/experience', addExperienceHandler);
router.post('/:staffId/education', addEducationHandler);
router.post('/:staffId/accolade', addAccoladeHandler);

// --- Bulk Upload Route ---
router.post(
    '/bulk-onboard', 
    upload.single('staffFile'), 
    bulkOnboardStaffHandler
);

export { router as staffRouter };