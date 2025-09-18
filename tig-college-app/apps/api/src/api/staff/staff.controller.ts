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
  bulkOnboardStaff,
  searchStaff,
  findInactiveStaff
} from './staff.service';

/**
 * Handles the creation of a new staff member.
 * Authorization: Admin/HOD only.
 */
export async function onboardStaffHandler(req: Request, res: Response) {
  try {
    const userRoles = req.user.roles as string[];
    if (!userRoles.includes('Admin') && !userRoles.includes('HOD')) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action.' });
    }

    const newStaffProfile = await onboardStaff(req.body);
    return res.status(201).json(newStaffProfile);
  } catch (error: any) {
    console.error('Onboarding failed:', error);
    return res.status(500).json({ message: 'Failed to onboard staff', error: error.message });
  }
}

/**
 * Handles fetching a list of all active staff members.
 * Authorization: Admin/HOD only.
 */
export async function getAllStaffHandler(req: Request, res: Response) {
  try {
    const userRoles = req.user.roles as string[];
    if (!userRoles.includes('Admin') && !userRoles.includes('HOD')) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action.' });
    }

    const staffList = await findAllStaff();
    return res.status(200).json(staffList);
  } catch (error: any) {
    console.error('Failed to get staff list:', error);
    return res.status(500).json({ message: 'Failed to retrieve staff list', error: error.message });
  }
}

/**
 * Handles fetching a single staff member by their ID.
 * Authorization: Admin/HOD only.
 */
export async function getStaffByIdHandler(req: Request, res: Response) {
  try {
    const userRoles = req.user.roles as string[];
    if (!userRoles.includes('Admin') && !userRoles.includes('HOD')) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action.' });
    }

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
 * Handles fetching the currently logged-in user's own profile.
 * Authorization: Any logged-in user.
 */
export async function getSelfProfileHandler(req: Request, res: Response) {
  try {
    const staffId = req.user.sub;
    const staffMember = await findStaffById(staffId); 

    if (!staffMember) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    return res.status(200).json(staffMember);
  } catch (error: any) {
    console.error('Failed to get self profile:', error);
    return res.status(500).json({ message: 'Failed to retrieve profile', error: error.message });
  }
}

/**
 * Handles searching for staff based on various query parameters.
 * Authorization: Admin/HOD only.
 */
export async function searchStaffHandler(req: Request, res: Response) {
  try {
    const userRoles = req.user.roles as string[];
    if (!userRoles.includes('Admin') && !userRoles.includes('HOD')) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action.' });
    }

    const { id, email, phone, name } = req.query;
    if (!id && !email && !phone && !name) {
      return res.status(400).json({ message: 'At least one search parameter (id, email, phone, or name) is required.' });
    }

    const criteria = {
      id: id ? parseInt(id as string, 10) : undefined,
      email: email as string | undefined,
      phone: phone as string | undefined,
      name: name as string | undefined,
    };

    const results = await searchStaff(criteria);
    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'No staff members found matching your criteria.' });
    }
    return res.status(200).json(results);
  } catch (error: any) {
    console.error(`Failed to search staff:`, error);
    return res.status(500).json({ message: 'Failed to retrieve staff', error: error.message });
  }
}

/**
 * Handles updating a staff member's profile.
 * Authorization: Admin/HOD only.
 */
export async function updateStaffHandler(req: Request, res: Response) {
  try {
    const userRoles = req.user.roles as string[];
    if (!userRoles.includes('Admin') && !userRoles.includes('HOD')) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action.' });
    }

    const staffId = parseInt(req.params.staffId, 10);
    if (isNaN(staffId)) {
      return res.status(400).json({ message: 'Invalid staff ID.' });
    }
    const updatedStaff = await updateStaff(staffId, req.body);
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
 * Authorization: Admin/HOD only.
 */
export async function softDeleteStaffHandler(req: Request, res: Response) {
  try {
    const userRoles = req.user.roles as string[];
    if (!userRoles.includes('Admin') && !userRoles.includes('HOD')) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action.' });
    }

    const staffId = parseInt(req.params.staffId, 10);
    if (isNaN(staffId)) {
      return res.status(400).json({ message: 'Invalid staff ID.' });
    }
    await deactivateStaff(staffId);
    return res.status(200).json({ message: 'Staff member deactivated successfully.' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to deactivate staff member', error: error.message });
  }
}

/**
 * Handles reactivating a previously deactivated staff member.
 * Authorization: Admin/HOD only.
 */
export async function reactivateStaffHandler(req: Request, res: Response) {
  try {
    const userRoles = req.user.roles as string[];
    if (!userRoles.includes('Admin') && !userRoles.includes('HOD')) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action.' });
    }

    const staffId = parseInt(req.params.staffId, 10);
    if (isNaN(staffId)) {
      return res.status(400).json({ message: 'Invalid staff ID.' });
    }
    const reactivatedStaff = await reactivateStaff(staffId);
    return res.status(200).json(reactivatedStaff);
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to reactivate staff member', error: error.message });
  }
}

/**
 * Handles the bulk onboarding file upload.
 * Authorization: Admin/HOD only.
 */
export async function bulkOnboardStaffHandler(req: Request, res: Response) {
    try {
      const userRoles = req.user.roles as string[];
      if (!userRoles.includes('Admin') && !userRoles.includes('HOD')) {
        return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action.' });
      }

      if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded.' });
      }
      const result = await bulkOnboardStaff(req.file.buffer);
      return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ message: 'Failed to process the file.', error: error.message });
    }
}

/**
 * Handles fetching a list of all inactive staff members.
 * Authorization: Admin/HOD only.
 */
export async function getInactiveStaffHandler(req: Request, res: Response) {
  try {
    const userRoles = req.user.roles as string[];
    if (!userRoles.includes('Admin') && !userRoles.includes('HOD')) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action.' });
    }

    const staffList = await findInactiveStaff();
    return res.status(200).json(staffList);
  } catch (error: any) {
    console.error('Failed to get inactive staff list:', error);
    return res.status(500).json({ message: 'Failed to retrieve inactive staff list', error: error.message });
  }
}

//This are not authorized by admin as staff can also add their work experience
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