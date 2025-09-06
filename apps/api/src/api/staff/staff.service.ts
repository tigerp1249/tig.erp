import { PrismaClient } from '@prisma/client';
import * as xlsx from 'xlsx';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Interface for onboarding data, also used by the Excel parser
interface OnboardStaffInput {
  Salutation?: string;
  FirstName: string;
  MiddleName?: string;
  LastName?: string;
  MobileNumber?: string;
  PersonalEmail?: string;
  DateOfBirth?: Date;
  AadharNumber?: bigint;
  PANNumber?: string;
  WhatsappNumber?: string;
  CollegeMasterID: number;
  DepartmentMasterID: number;
  StreamMasterID?: number;
  AppointmentType?: string;
  ContractType?: string;
  Designation?: string;
  DateOfJoining?: Date;
  ProfessionalEmail?: string;
  ManagerEmployeeID?: number;
  CreatedBy?: string;
}

/**
 * Onboards a new staff member by calling the sp_OnboardStaff stored procedure.
 * It then fetches the newly created profile to return it.
 */
export async function onboardStaff(data: OnboardStaffInput) {
  const result = await prisma.$queryRaw<[{ NewEmployeeID: number }]>`
    CALL sp_OnboardStaff(
      ${data.Salutation}, ${data.FirstName}, ${data.MiddleName}, ${data.LastName}, 
      ${data.MobileNumber}, ${data.PersonalEmail}, ${data.DateOfBirth}, ${data.AadharNumber}, 
      ${data.PANNumber}, ${data.WhatsappNumber}, ${data.CollegeMasterID}, 
      ${data.DepartmentMasterID}, ${data.StreamMasterID}, ${data.AppointmentType}, 
      ${data.ContractType}, ${data.Designation}, ${data.DateOfJoining}, 
      ${data.ProfessionalEmail}, ${data.ManagerEmployeeID}, 'api-onboarding'
    );
  `;
  const newStaffId = result[0].NewEmployeeID;
  return findStaffById(newStaffId);
}

/**
 * Updates a staff member's profile by calling the sp_UpdateStaffProfile stored procedure.
 */
export async function updateStaff(employeeId: number, data: any) {
  await prisma.$executeRaw`
    CALL sp_UpdateStaffProfile(
      ${employeeId},
      ${data.UpdatedBy || 'api-update'},
      ${data.Salutation || null},
      ${data.FirstName || null},
      ${data.LastName || null},
      ${data.MobileNumber || null},
      ${data.PersonalEmail || null},
      ${data.PANNumber || null},
      ${data.Designation || null}
    );
  `;
  return findStaffById(employeeId);
}

/**
 * Retrieves a list of all active faculty members using the sp_GetAllFaculty procedure.
 */
// in staff.service.ts
export async function findAllStaff() {
  // This is the correct version that calls your new procedure.
  return prisma.$queryRaw<any[]>`CALL sp_GetAllFaculty();`;
}
/**
 * Retrieves a single staff member by their ID using the sp_GetFacultyById procedure.
 */
export async function findStaffById(id: number) {
  // CORRECT: Calls the existing procedure with the required parameters.
  const staff = await prisma.$queryRaw<any[]>`CALL GetFaculty('ID', ${id});`;
  return staff[0] || null;
}
/**
 * Deactivates a staff member by calling the update procedure with a release date.
 */
export async function deactivateStaff(employeeId: number) {
  await prisma.$executeRaw`
    CALL sp_DeactivateStaff(${employeeId}, 'api-deactivate');
  `;
}
/**
 * Reactivates a staff member by calling the update procedure with a null release date.
 */
export async function reactivateStaff(employeeId: number) {
  await prisma.$executeRaw`
    CALL sp_ReactivateStaff(${employeeId}, 'api-reactivate');
  `;
  // After reactivating, fetch the updated profile.
  return findStaffById(employeeId);
}

/**
 * Adds a work experience record for a specific employee.
 */
export async function addExperience(employeeId: number, data: any) {
  return prisma.$executeRaw`
    CALL sp_AddEmployeeExperience(
      ${employeeId}, ${data.OrganizationName}, ${data.Designation}, 
      ${new Date(data.StartDate)}, ${data.EndDate ? new Date(data.EndDate) : null}, 'employee-self-service'
    );
  `;
}

/**
 * Adds an education record for a specific employee.
 */
export async function addEducation(employeeId: number, data: any) {
  return prisma.$executeRaw`
    CALL sp_AddEmployeeEducation(
      ${employeeId}, ${data.CertificateName}, ${data.InstituteName}, 
      ${data.BoardName}, ${data.YearOfPassing}, ${data.MarksObtained}, 
      'employee-self-service'
    );
  `;
}

/**
 * Adds an accolade record for a specific employee.
 */
export async function addAccolade(employeeId: number, data: any) {
  return prisma.$executeRaw`
    CALL sp_AddEmployeeAccolade(
      ${employeeId}, ${data.AccoladeName}, ${data.AccoladeBy}, 
      ${new Date(data.AccoladeDate)}, 'employee-self-service'
    );
  `;
}

/**
 * Processes a file buffer from an uploaded Excel sheet for bulk onboarding.
 */
export async function bulkOnboardStaff(fileBuffer: Buffer) {
  const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  const staffDataArray = xlsx.utils.sheet_to_json(worksheet) as OnboardStaffInput[];

  let successfulCount = 0;
  const errors: { row: number; error: string }[] = [];

  for (let i = 0; i < staffDataArray.length; i++) {
    const staffData = staffDataArray[i];
    try {
      // Convert numeric phone numbers from Excel to strings
      if (staffData.MobileNumber) {
        staffData.MobileNumber = String(staffData.MobileNumber);
      }
      if (staffData.WhatsappNumber) {
        staffData.WhatsappNumber = String(staffData.WhatsappNumber);
      }
      
      // Call the single-user onboarding function for each row
      await onboardStaff(staffData);
      successfulCount++;
    } catch (error: any) {
      errors.push({
        row: i + 2, // Excel rows are 1-based, plus header
        error: error.message,
      });
    }
  }

  return {
    totalRows: staffDataArray.length,
    successfulCount,
    errors,
  };
}

