import { PrismaClient } from '@prisma/client';
import * as xlsx from 'xlsx';

const prisma = new PrismaClient();

// This mapping function is now updated to match the ~20 fields from the get_faculty.sql procedure.
// staff.service.ts

function mapRawStaffToFormattedProfile(rawUser: any) {
  if (!rawUser) {
    return null;
  }
  // This mapping has been corrected to match the apparent column order 
  // from the `GetFaculty` stored procedure.
  return {
    // Columns f0-f4 seem to be in the correct order.
    FacultyMasterId: rawUser.f0,
    EID: rawUser.f1,
    Name: rawUser.f2,
    MobileNumber: rawUser.f3,
    PersonalEmail: rawUser.f4,

    // The subsequent columns were mismatched. Here is the corrected order.
    Designation: rawUser.f5,
    CollegeMasterId: rawUser.f6,
    StreamMasterId: rawUser.f7,
    ProfessionalEmail: rawUser.f8,
    CollegeName: rawUser.f9,
    CollegeAbbreviation: rawUser.f10,
    StreamName: rawUser.f11,
    
    // The following fields appear to be missing from the `GetFaculty` procedure's results.
    // They were being incorrectly filled with data from other columns.
    // It's best to check your SQL procedure if you need these fields.
    PANNumber: rawUser.f12 || null,
    AadharNumber: rawUser.f13 || null,
    DateOfBirth: rawUser.f14 || null,
    WhatsappNumber: rawUser.f15 || null,
    AppointmentType: rawUser.f16 || null,
    ContractType: rawUser.f17 || null,
    DateOfJoining: rawUser.f18 || null,
    ManagerEmployeeID: rawUser.f19 || null,
  };
}

// The OnboardStaffInput interface remains complete, as it's needed for creating new users.
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
  Gender?: string;
  MaritalStatus?: string;
  PermanentAddress?: string;
  CurrentAddress?: string;
  BloodGroup?: string;
  FatherName?: string;
  MotherName?: string;
  SpouseName?: string;
  DateOfConfirmation?: Date;
  ProbationPeriodInMonths?: number;
  EmployeeGrade?: string;
  EmployeeBand?: string;
  PFNumber?: string;
  UANNumber?: string;
  ESINumber?: string;
  BankAccountNumber?: string;
  BankName?: string;
  BankBranch?: string;
  IFSCCode?: string;
}

interface StaffSearchCriteria {
  id?: number;
  email?: string;
  phone?: string;
  name?: string;
}

// The rest of the service functions will now use the new, shorter mapping
// and return the more concise user profile.

// in staff.service.ts

export async function onboardStaff(data: OnboardStaffInput) {
  const result = await prisma.$queryRaw<[{ NewEmployeeID: number }]>`
    CALL sp_OnboardStaff(
      ${data.Salutation}, ${data.FirstName}, ${data.MiddleName}, ${data.LastName}, 
      ${data.MobileNumber}, ${data.PersonalEmail}, ${data.DateOfBirth}, ${data.AadharNumber}, 
      ${data.PANNumber}, ${data.WhatsappNumber}, ${data.CollegeMasterID}, 
      ${data.DepartmentMasterID}, ${data.StreamMasterID}, ${data.AppointmentType}, 
      ${data.ContractType}, ${data.Designation}, ${data.DateOfJoining}, 
      ${data.ProfessionalEmail}, ${data.ManagerEmployeeID}, 'api-onboarding',
      ${data.Gender}, ${data.MaritalStatus}, ${data.PermanentAddress}, ${data.CurrentAddress},
      ${data.BloodGroup}, ${data.FatherName}, ${data.MotherName}, ${data.SpouseName},
      ${data.DateOfConfirmation}, ${data.ProbationPeriodInMonths}, ${data.EmployeeGrade}, ${data.EmployeeBand},
      ${data.PFNumber}, ${data.UANNumber}, ${data.ESINumber}, ${data.BankAccountNumber},
      ${data.BankName}, ${data.BankBranch}, ${data.IFSCCode}
    );
  `;
    console.log('Raw result from sp_OnboardStaff:', result);
// After
const newStaffId = result[0].f0;
  // Return an object containing only the new ID
  return { 
    message: "User successfully created",
    newStaffId: newStaffId 
  };
}
export async function updateStaff(employeeId: number, data: any) {
    await prisma.$executeRaw`
    CALL sp_UpdateStaffProfile(
      ${employeeId}, 
      ${data.UpdatedBy || 'api-update'},
      ${data.Salutation || null}, 
      ${data.FirstName || null}, 
      ${data.MiddleName || null},
      ${data.LastName || null}, 
      ${data.Gender || null},
      ${data.MaritalStatus || null},
      ${data.MobileNumber || null}, 
      ${data.PersonalEmail || null},
      ${data.DateOfBirth || null},
      ${data.AadharNumber || null},
      ${data.PANNumber || null},
      ${data.WhatsappNumber || null},
      ${data.PermanentAddress || null},
      ${data.CurrentAddress || null},
      ${data.BloodGroup || null},
      ${data.FatherName || null},
      ${data.MotherName || null},
      ${data.SpouseName || null},
      ${data.PFNumber || null},
      ${data.UANNumber || null},
      ${data.ESINumber || null},
      ${data.BankAccountNumber || null},
      ${data.BankName || null},
      ${data.BankBranch || null},
      ${data.IFSCCode || null},
      ${data.Designation || null},
      ${data.AppointmentType || null},
      ${data.ContractType || null},
      ${data.DateOfJoining || null},
      ${data.DateOfConfirmation || null},
      ${data.ProbationPeriodInMonths || null},
      ${data.EmployeeGrade || null},
      ${data.EmployeeBand || null},
      ${data.ProfessionalEmail || null},
      ${data.ManagerEmployeeID || null}
    );
  `;
  return { message: "Update request submitted for approval." };
}

export async function findAllStaff() {
  const results = await prisma.$queryRaw<any[]>`CALL sp_GetAllFaculty();`;
  return results.map(mapRawStaffToFormattedProfile);
}

export async function findStaffById(id: number) {
  const results = await prisma.$queryRaw<any[]>`CALL GetFaculty('ID', ${id});`;
  return mapRawStaffToFormattedProfile(results[0]);
}

export async function searchStaff(criteria: StaffSearchCriteria) {
  const results = await prisma.$queryRaw<any[]>`
    CALL sp_SearchStaff(
      ${criteria.id || null}, ${criteria.email || null}, 
      ${criteria.phone || null}, ${criteria.name || null}
    );
  `;
  return results.map(mapRawStaffToFormattedProfile);
}

export async function deactivateStaff(employeeId: number) {
  await prisma.$executeRaw`CALL sp_DeactivateStaff(${employeeId}, 'api-deactivate');`;
}

export async function reactivateStaff(employeeId: number) {
  await prisma.$executeRaw`CALL sp_ReactivateStaff(${employeeId}, 'api-reactivate');`;
  return findStaffById(employeeId);
}

export async function addExperience(employeeId: number, data: any) {
  return prisma.$executeRaw`
    CALL sp_AddEmployeeExperience(
      ${employeeId}, ${data.OrganizationName}, ${data.Designation}, 
      ${new Date(data.StartDate)}, ${data.EndDate ? new Date(data.EndDate) : null}, 'api-add-experience'
    );
  `;
}
  
export async function addEducation(employeeId: number, data: any) {
  return prisma.$executeRaw`
    CALL sp_AddEmployeeEducation(
      ${employeeId}, ${data.CertificateName}, ${data.InstituteName}, 
      ${data.BoardName}, ${data.YearOfPassing}, ${data.MarksObtained}, 
      'api-add-education'
    );
  `;
}
  
export async function addAccolade(employeeId: number, data: any) {
  return prisma.$executeRaw`
    CALL sp_AddEmployeeAccolade(
      ${employeeId}, ${data.AccoladeName}, ${data.AccoladeBy}, 
      ${new Date(data.AccoladeDate)}, 'api-add-accolade'
    );
  `;
}
  
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
      if (staffData.MobileNumber) {
        staffData.MobileNumber = String(staffData.MobileNumber);
      }
      if (staffData.WhatsappNumber) {
        staffData.WhatsappNumber = String(staffData.WhatsappNumber);
      }
      
      await onboardStaff(staffData);
      successfulCount++;
    } catch (error: any) {
      errors.push({
        row: i + 2, 
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

