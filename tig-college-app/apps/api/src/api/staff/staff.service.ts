import { PrismaClient } from '@prisma/client';
import * as xlsx from 'xlsx';

const prisma = new PrismaClient();

// This is our single source of truth for mapping staff data.
function mapStaffProfile(staffMember: any) {
  if (!staffMember) {
    return null;
  }
  
  // This function  maps every available field
  return {
    // --- Key Identifiers ---
    FacultyMasterId: staffMember.ID,
    EID: staffMember.EID,
    TIGID: staffMember.TIGID,

    // --- Name and Personal Details ---
    Name: [staffMember.Salutation, staffMember.FirstName, staffMember.MiddleName, staffMember.LastName].filter(Boolean).join(' '),
    Salutation: staffMember.Salutation,
    FirstName: staffMember.FirstName,
    MiddleName: staffMember.MiddleName,
    LastName: staffMember.LastName,
    DateOfBirth: staffMember.DateOfBirth,
    Gender: staffMember.Gender,
    MaritalStatus: staffMember.MaritalStatus,
    BloodGroup: staffMember.BloodGroup,

    // --- Contact and ID Numbers ---
    MobileNumber: staffMember.MobileNumber,
    PersonalEmail: staffMember.EmailAddress,
    WhatsappNumber: staffMember.WhatsappNumber,
    AadharNumber: staffMember.AadharNumber?.toString(),
    PANNumber: staffMember.PANNumber,

    // --- Address Details ---
    PermanentAddress: staffMember.PermanentAddress,
    CurrentAddress: staffMember.CurrentAddress,
    AddressDescription: staffMember.AddressDescription,
    ADDRESS_MASTER_ID: staffMember.ADDRESS_MASTER_ID,

    // --- Family Details ---
    FatherName: staffMember.FatherName,
    MotherName: staffMember.MotherName,
    SpouseName: staffMember.SpouseName,

    // --- Financial & Statutory Details ---
    PFNumber: staffMember.PFNumber,
    UANNumber: staffMember.UANNumber,
    ESINumber: staffMember.ESINumber,
    BankAccountNumber: staffMember.BankAccountNumber,
    BankName: staffMember.BankName,
    BankBranch: staffMember.BankBranch,
    IFSCCode: staffMember.IFSCCode,

    // --- Professional Details from Association ---
    Designation: staffMember.Designation,
    ProfessionalEmail: staffMember.ProfessionalEmail,
    AppointmentType: staffMember.AppointmentType,
    ContractType: staffMember.ContractType,
    DateOfJoining: staffMember.DateOfJoining,
    DateOfConfirmation: staffMember.DateOfConfirmation,
    DateOfRelease: staffMember.DateOfRelease,
    ProbationPeriodInMonths: staffMember.ProbationPeriodInMonths,
    EmployeeGrade: staffMember.EmployeeGrade,
    EmployeeBand: staffMember.EmployeeBand,
    MANAGER_EMPLOYEE_ID: staffMember.MANAGER_EMPLOYEE_ID,
    COLLEGE_MASTER_ID: staffMember.COLLEGE_MASTER_ID,
    DEPARTMENT_MASTER_ID: staffMember.DEPARTMENT_MASTER_ID,
    STREAM_MASTER_ID: staffMember.STREAM_MASTER_ID,
  };
}
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

export async function onboardStaff(data: OnboardStaffInput) {
  const result = await prisma.$queryRaw<[{ f0: number }]>`
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
  const newStaffId = result[0].f0;
  return {
    message: "User successfully created",
    newStaffId: newStaffId,
  };
}

export async function updateStaff(employeeId: number, data: any) {
  await prisma.$executeRaw`
    CALL sp_UpdateStaffProfile(
      ${employeeId}, ${data.UpdatedBy || 'api-update'}, ${data.Salutation || null}, 
      ${data.FirstName || null}, ${data.MiddleName || null}, ${data.LastName || null}, 
      ${data.Gender || null}, ${data.MaritalStatus || null}, ${data.MobileNumber || null}, 
      ${data.PersonalEmail || null}, ${data.DateOfBirth || null}, ${data.AadharNumber || null},
      ${data.PANNumber || null}, ${data.WhatsappNumber || null}, ${data.PermanentAddress || null},
      ${data.CurrentAddress || null}, ${data.BloodGroup || null}, ${data.FatherName || null},
      ${data.MotherName || null}, ${data.SpouseName || null}, ${data.PFNumber || null},
      ${data.UANNumber || null}, ${data.ESINumber || null}, ${data.BankAccountNumber || null},
      ${data.BankName || null}, ${data.BankBranch || null}, ${data.IFSCCode || null},
      ${data.Designation || null}, ${data.AppointmentType || null}, ${data.ContractType || null},
      ${data.DateOfJoining || null}, ${data.DateOfConfirmation || null}, ${data.ProbationPeriodInMonths || null},
      ${data.EmployeeGrade || null}, ${data.EmployeeBand || null}, ${data.ProfessionalEmail || null},
      ${data.ManagerEmployeeID || null}
    );
  `;
  return { message: "Update request submitted for approval." };
}


export async function findAllStaff() {
  // 1. Fetch all users and their related data using a native Prisma query
  const allUserProfiles = await prisma.eMPLOYEE_MASTER.findMany({
    include: {
      EMPLOYEE_ASSOCIATION: true,
    },
  });

  if (!allUserProfiles) {
    return [];
  }

  const formattedStaffList = allUserProfiles.map(userProfile => {
    const latestAssociation = userProfile.EMPLOYEE_ASSOCIATION[0] || {};
    
  
    return {
      FacultyMasterId: userProfile.ID,
      EID: userProfile.EID,
      TIGID: userProfile.TIGID,
      Name: [userProfile.Salutation, userProfile.FirstName, userProfile.MiddleName, userProfile.LastName].filter(Boolean).join(' '),
      Salutation: userProfile.Salutation,
      FirstName: userProfile.FirstName,
      MiddleName: userProfile.MiddleName,
      LastName: userProfile.LastName,
      DateOfBirth: userProfile.DateOfBirth,
      Gender: userProfile.Gender,
      MaritalStatus: userProfile.MaritalStatus,
      BloodGroup: userProfile.BloodGroup,
      MobileNumber: userProfile.MobileNumber,
      PersonalEmail: userProfile.EmailAddress,
      WhatsappNumber: userProfile.WhatsappNumber,
      AadharNumber: userProfile.AadharNumber?.toString(),
      PANNumber: userProfile.PANNumber,
      PermanentAddress: userProfile.PermanentAddress,
      CurrentAddress: userProfile.CurrentAddress,
      AddressDescription: userProfile.AddressDescription,
      ADDRESS_MASTER_ID: userProfile.ADDRESS_MASTER_ID,
      FatherName: userProfile.FatherName,
      MotherName: userProfile.MotherName,
      SpouseName: userProfile.SpouseName,
      PFNumber: userProfile.PFNumber,
      UANNumber: userProfile.UANNumber,
      ESINumber: userProfile.ESINumber,
      BankAccountNumber: userProfile.BankAccountNumber,
      BankName: userProfile.BankName,
      BankBranch: userProfile.BankBranch,
      IFSCCode: userProfile.IFSCCode,
      Designation: latestAssociation.Designation,
      ProfessionalEmail: latestAssociation.EmailAddress,
      AppointmentType: latestAssociation.AppointmentType,
      ContractType: latestAssociation.ContractType,
      DateOfJoining: latestAssociation.DateOfJoining,
      DateOfConfirmation: latestAssociation.DateOfConfirmation,
      DateOfRelease: latestAssociation.DateOfRelease,
      ProbationPeriodInMonths: latestAssociation.ProbationPeriodInMonths,
      EmployeeGrade: latestAssociation.EmployeeGrade,
      EmployeeBand: latestAssociation.EmployeeBand,
      MANAGER_EMPLOYEE_ID: latestAssociation.MANAGER_EMPLOYEE_ID,
      COLLEGE_MASTER_ID: latestAssociation.COLLEGE_MASTER_ID,
      DEPARTMENT_MASTER_ID: latestAssociation.DEPARTMENT_MASTER_ID,
      STREAM_MASTER_ID: latestAssociation.STREAM_MASTER_ID,
    };
  });

  return formattedStaffList;
}


export async function findStaffById(id: number) {
  const userProfile = await prisma.eMPLOYEE_MASTER.findUnique({
    where: { ID: id },
    include: {
      EMPLOYEE_ASSOCIATION: true, // Include related association data
    },
  });

  if (!userProfile) {
    return null;
  }

  const latestAssociation = userProfile.EMPLOYEE_ASSOCIATION[0] || {};

  // Combine all fields from both models into one comprehensive object
  return {
    // --- Key Identifiers ---
    FacultyMasterId: userProfile.ID,
    EID: userProfile.EID,
    TIGID: userProfile.TIGID,

    // --- Name and Personal Details ---
    Name: [userProfile.Salutation, userProfile.FirstName, userProfile.MiddleName, userProfile.LastName].filter(Boolean).join(' '),
    Salutation: userProfile.Salutation,
    FirstName: userProfile.FirstName,
    MiddleName: userProfile.MiddleName,
    LastName: userProfile.LastName,
    DateOfBirth: userProfile.DateOfBirth,
    Gender: userProfile.Gender,
    MaritalStatus: userProfile.MaritalStatus,
    BloodGroup: userProfile.BloodGroup,

    // --- Contact and ID Numbers ---
    MobileNumber: userProfile.MobileNumber,
    PersonalEmail: userProfile.EmailAddress,
    WhatsappNumber: userProfile.WhatsappNumber,
    AadharNumber: userProfile.AadharNumber?.toString(),
    PANNumber: userProfile.PANNumber,

    // --- Address Details ---
    PermanentAddress: userProfile.PermanentAddress,
    CurrentAddress: userProfile.CurrentAddress,
    AddressDescription: userProfile.AddressDescription,
    ADDRESS_MASTER_ID: userProfile.ADDRESS_MASTER_ID,

    // --- Family Details ---
    FatherName: userProfile.FatherName,
    MotherName: userProfile.MotherName,
    SpouseName: userProfile.SpouseName,

    // --- Financial & Statutory Details ---
    PFNumber: userProfile.PFNumber,
    UANNumber: userProfile.UANNumber,
    ESINumber: userProfile.ESINumber,
    BankAccountNumber: userProfile.BankAccountNumber,
    BankName: userProfile.BankName,
    BankBranch: userProfile.BankBranch,
    IFSCCode: userProfile.IFSCCode,

    // --- Professional Details from Association ---
    Designation: latestAssociation.Designation,
    ProfessionalEmail: latestAssociation.EmailAddress,
    AppointmentType: latestAssociation.AppointmentType,
    ContractType: latestAssociation.ContractType,
    DateOfJoining: latestAssociation.DateOfJoining,
    DateOfConfirmation: latestAssociation.DateOfConfirmation,
    DateOfRelease: latestAssociation.DateOfRelease,
    ProbationPeriodInMonths: latestAssociation.ProbationPeriodInMonths,
    EmployeeGrade: latestAssociation.EmployeeGrade,
    EmployeeBand: latestAssociation.EmployeeBand,
    MANAGER_EMPLOYEE_ID: latestAssociation.MANAGER_EMPLOYEE_ID,
    COLLEGE_MASTER_ID: latestAssociation.COLLEGE_MASTER_ID,
    DEPARTMENT_MASTER_ID: latestAssociation.DEPARTMENT_MASTER_ID,
    STREAM_MASTER_ID: latestAssociation.STREAM_MASTER_ID,
  };
}

export async function searchStaff(criteria: StaffSearchCriteria) {
  const results = await prisma.$queryRaw<any[]>`
    CALL sp_SearchStaff(
      ${criteria.id || null}, ${criteria.email || null}, 
      ${criteria.phone || null}, ${criteria.name || null}
    );
  `;
  return results.map(mapStaffProfile);
}

// in src/api/staff/staff.service.ts

export async function findInactiveStaff() {
  const inactiveUsers = await prisma.eMPLOYEE_MASTER.findMany({
    where: {
      // Find users who have an association with a release date that is in the past
      EMPLOYEE_ASSOCIATION: {
        some: {
          DateOfRelease: {
            lte: new Date(), // 'lte' means less than or equal to today
          },
        },
      },
    },
    include: {
      EMPLOYEE_ASSOCIATION: true,
    },
  });

  if (!inactiveUsers) {
    return [];
  }

  const formattedStaffList = inactiveUsers.map(userProfile => {
    const latestAssociation = userProfile.EMPLOYEE_ASSOCIATION[0] || {};
    
    const combinedData = {
      ...userProfile,
      Designation: latestAssociation.Designation,
      AppointmentType: latestAssociation.AppointmentType,
      ContractType: latestAssociation.ContractType,
      DateOfJoining: latestAssociation.DateOfJoining,
      ProfessionalEmail: latestAssociation.EmailAddress,
      MANAGER_EMPLOYEE_ID: latestAssociation.MANAGER_EMPLOYEE_ID,
      COLLEGE_MASTER_ID: latestAssociation.COLLEGE_MASTER_ID,
      DEPARTMENT_MASTER_ID: latestAssociation.DEPARTMENT_MASTER_ID,
      STREAM_MASTER_ID: latestAssociation.STREAM_MASTER_ID,
      DateOfConfirmation: latestAssociation.DateOfConfirmation,
      DateOfRelease: latestAssociation.DateOfRelease,
      ProbationPeriodInMonths: latestAssociation.ProbationPeriodInMonths,
      EmployeeGrade: latestAssociation.EmployeeGrade,
      EmployeeBand: latestAssociation.EmployeeBand,
    };
    
    return mapStaffProfile(combinedData);
  });

  return formattedStaffList;
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
  // The error object will now include an optional 'missingColumns' array
  const errors: { row: number; error: string; missingColumns?: string[] }[] = [];
  
  // Define the columns that are absolutely required for a new user
  const requiredColumns = ['FirstName', 'CollegeMasterID', 'DepartmentMasterID'];

  for (let i = 0; i < staffDataArray.length; i++) {
    const staffData = staffDataArray[i];
    const rowNumber = i + 2; // Excel rows are 1-based, plus 1 for the header

    try {
      // --- VALIDATION STEP ---
      // Check for missing required columns before calling the database
      const missingColumns = requiredColumns.filter(col => !staffData[col]);

      if (missingColumns.length > 0) {
        errors.push({
          row: rowNumber,
          error: 'Missing required columns.',
          missingColumns: missingColumns, // Add the list of specific missing columns
        });
        continue; // Skip this row and move to the next one
      }
      // --- END VALIDATION ---
      
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
        row: rowNumber, 
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