import { Request, Response } from 'express';
import {
  onboardStaff,
  findAllStaff,
  findStaffById,
  updateStaff,
  deactivateStaff,
  reactivateStaff,
  addExperience,
  addEducation,
  addAccolade,
  bulkOnboardStaff
} from './staff.service';

/**
 * Handles the creation of a new staff member profile.
 */
export async function onboardStaffHandler(req: Request, res: Response) {
  try {
    const staffData = req.body;
    const newStaffProfile = await onboardStaff(staffData);
    return res.status(201).json(newStaffProfile);
  } catch (error: any) {
    console.error('Onboarding failed:', error);
    return res.status(500).json({ message: 'Failed to onboard staff', error: error.message });
  }
}

/**
 * Handles fetching a list of all active staff members.
 */
export async function getAllStaffHandler(_req: Request, res: Response) {
  try {
    const staffList = await findAllStaff();
    return res.status(200).json(staffList);
  } catch (error: any) {
    console.error('Failed to get staff list:', error);
    return res.status(500).json({ message: 'Failed to retrieve staff list', error: error.message });
  }
}

/**
 * Handles fetching a single staff member by their ID.
 */
export async function getStaffByIdHandler(req: Request, res: Response) {
  try {
    const staffId = parseInt(req.params.staffId, 10);
    if (isNaN(staffId)) {
      return res.status(400).json({ message: 'Invalid staff ID.' });
    }

    const staffMember = await findStaffById(staffId);
    if (!staffMember) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    return res.status(200).json(staffMember);
  } catch (error: any) {
    console.error(`Failed to get staff by ID ${req.params.staffId}:`, error);
    return res.status(500).json({ message: 'Failed to retrieve staff member', error: error.message });
  }
}

/**
 * Handles updating a staff member's profile.
 */
export async function updateStaffHandler(req: Request, res: Response) {
  try {
    const staffId = parseInt(req.params.staffId, 10);
    if (isNaN(staffId)) {
      return res.status(400).json({ message: 'Invalid staff ID.' });
    }

    const updateData = req.body;
    const updatedStaff = await updateStaff(staffId, updateData);
    return res.status(200).json(updatedStaff);
  } catch (error: any) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: 'Staff member not found to update.' });
    }
    console.error(`Failed to update staff ${req.params.staffId}:`, error);
    return res.status(500).json({ message: 'Failed to update staff member', error: error.message });
  }
  
}

/**
 * Handles deactivating (soft deleting) a staff member.
 */
export async function softDeleteStaffHandler(req: Request, res: Response) {
  try {
    const staffId = parseInt(req.params.staffId, 10);
    if (isNaN(staffId)) {
      return res.status(400).json({ message: 'Invalid staff ID.' });
    }
    await deactivateStaff(staffId);
    return res.status(200).json({ message: 'Staff member deactivated successfully.' });
  } catch (error: any) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Failed to deactivate staff member', error: error.message });
  }
}

/**
 * Handles reactivating a previously deactivated staff member.
 */
export async function reactivateStaffHandler(req: Request, res: Response) {
  try {
    const staffId = parseInt(req.params.staffId, 10);
    if (isNaN(staffId)) {
      return res.status(400).json({ message: 'Invalid staff ID.' });
    }
    const reactivatedStaff = await reactivateStaff(staffId);
    return res.status(200).json(reactivatedStaff);
  } catch (error: any) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Failed to reactivate staff member', error: error.message });
  }
}

/**
 * Handles adding a work experience record to a staff member's profile.
 */
export async function addExperienceHandler(req: Request, res: Response) {
    try {
        const employeeId = parseInt(req.params.staffId, 10);
        if (isNaN(employeeId)) {
            return res.status(400).json({ message: 'Invalid employee ID.' });
        }
        await addExperience(employeeId, req.body);
        return res.status(201).json({ message: 'Experience added successfully.' });
    } catch (error: any) {
        return res.status(500).json({ message: 'Failed to add experience record.', error: error.message });
    }
}

/**
 * Handles adding an education record to a staff member's profile.
 */
export async function addEducationHandler(req: Request, res: Response) {
    try {
        const employeeId = parseInt(req.params.staffId, 10);
        if (isNaN(employeeId)) {
            return res.status(400).json({ message: 'Invalid employee ID.' });
        }
        await addEducation(employeeId, req.body);
        return res.status(201).json({ message: 'Education added successfully.' });
    } catch (error: any) {
        return res.status(500).json({ message: 'Failed to add education record.', error: error.message });
    }
}

/**
 * Handles adding an accolade record to a staff member's profile.
 */
export async function addAccoladeHandler(req: Request, res: Response) {
    try {
        const employeeId = parseInt(req.params.staffId, 10);
        if (isNaN(employeeId)) {
            return res.status(400).json({ message: 'Invalid employee ID.' });
        }
        await addAccolade(employeeId, req.body);
        return res.status(201).json({ message: 'Accolade added successfully.' });
    } catch (error: any) {
        return res.status(500).json({ message: 'Failed to add accolade record.', error: error.message });
    }
}

/**
 * Handles the bulk onboarding file upload.
 */
export async function bulkOnboardStaffHandler(req: Request, res: Response) {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    try {
        const result = await bulkOnboardStaff(req.file.buffer);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ message: 'Failed to process the file.', error: error.message });
    }
}
