-- Stored Procedure to Onboard a new Employee
-- This handles creating records in both EMPLOYEE_MASTER and EMPLOYEE_ASSOCIATION
DELIMITER $$
CREATE PROCEDURE OnboardEmployee(
    IN p_Salutation VARCHAR(10),
    IN p_FirstName VARCHAR(255),
    IN p_MiddleName VARCHAR(255),
    IN p_LastName VARCHAR(255),
    IN p_MobileNumber CHAR(10),
    IN p_EmailAddress VARCHAR(255),
    IN p_DateOfBirth DATE,
    IN p_AadharNumber BIGINT,
    IN p_PANNumber VARCHAR(20),
    IN p_WhatsappNumber CHAR(10),
    IN p_COLLEGE_MASTER_ID INT,
    IN p_DEPARTMENT_MASTER_ID INT,
    IN p_STREAM_MASTER_ID INT,
    IN p_AppointmentType VARCHAR(10),
    IN p_ContractType VARCHAR(50),
    IN p_Designation VARCHAR(100),
    IN p_DateOfJoining DATE,
    IN p_ProfessionalEmail VARCHAR(255),
    IN p_MANAGER_EMPLOYEE_ID INT
)
BEGIN
    DECLARE new_employee_id INT;

    -- Insert into the master table first
    INSERT INTO EMPLOYEE_MASTER (
        Salutation, FirstName, MiddleName, LastName, MobileNumber, EmailAddress,
        DateOfBirth, AadharNumber, PANNumber, WhatsappNumber,
        LastUpdatedBy, LastUpdatedAt
    ) VALUES (
        p_Salutation, p_FirstName, p_MiddleName, p_LastName, p_MobileNumber, p_EmailAddress,
        p_DateOfBirth, p_AadharNumber, p_PANNumber, p_WhatsappNumber,
        'admin-onboarding', NOW()
    );

    SET new_employee_id = LAST_INSERT_ID();

    -- Insert into the association table
    INSERT INTO EMPLOYEE_ASSOCIATION (
        EMPLOYEE_MASTER_ID, COLLEGE_MASTER_ID, DEPARTMENT_MASTER_ID, STREAM_MASTER_ID,
        AppointmentType, ContractType, Designation, DateOfJoining, EmailAddress,
        MANAGER_EMPLOYEE_ID, LastUpdatedBy, LastUpdatedAt
    ) VALUES (
        new_employee_id, p_COLLEGE_MASTER_ID, p_DEPARTMENT_MASTER_ID, p_STREAM_MASTER_ID,
        p_AppointmentType, p_ContractType, p_Designation, p_DateOfJoining, p_ProfessionalEmail,
        p_MANAGER_EMPLOYEE_ID, 'admin-onboarding', NOW()
    );

    -- Return the new employee's ID so we can fetch their full profile
    SELECT new_employee_id AS ID;
END$$
DELIMITER ;


-- Stored Procedure to Add Work Experience
DELIMITER $$
CREATE PROCEDURE AddEmployeeExperience(
    IN p_EMPLOYEE_MASTER_ID INT,
    IN p_OrganizationName VARCHAR(500),
    IN p_StartDate DATE,
    IN p_EndDate DATE,
    IN p_Designation VARCHAR(255)
)
BEGIN
    INSERT INTO EMPLOYEE_EXPERIENCE (
        EMPLOYEE_MASTER_ID, OrganizationName, StartDate, EndDate, Designation,
        LastUpdatedBy, LastUpdatedAt
    ) VALUES (
        p_EMPLOYEE_MASTER_ID, p_OrganizationName, p_StartDate, p_EndDate, p_Designation,
        'employee-self-service', NOW()
    );
    SELECT LAST_INSERT_ID() AS ID;
END$$
DELIMITER ;


-- Stored Procedure to Add Education
DELIMITER $$
CREATE PROCEDURE AddEmployeeEducation(
    IN p_EMPLOYEE_MASTER_ID INT,
    IN p_CertificateName VARCHAR(500),
    IN p_InstituteName VARCHAR(500),
    IN p_BoardName VARCHAR(500),
    IN p_YearOfPassing YEAR,
    IN p_MarksObtained DECIMAL(10, 2)
)
BEGIN
    INSERT INTO EMPLOYEE_EDUCATION (
        EMPLOYEE_MASTER_ID, CertificateName, InstituteName, BoardName,
        YearOfPassing, MarksObtained, LastUpdatedBy, LastUpdatedAt
    ) VALUES (
        p_EMPLOYEE_MASTER_ID, p_CertificateName, p_InstituteName, p_BoardName,
        p_YearOfPassing, p_MarksObtained, 'employee-self-service', NOW()
    );
    SELECT LAST_INSERT_ID() AS ID;
END$$
DELIMITER ;


-- Stored Procedure to Add Accolades
DELIMITER $$
CREATE PROCEDURE AddEmployeeAccolade(
    IN p_EMPLOYEE_MASTER_ID INT,
    IN p_AccoladeName VARCHAR(500),
    IN p_AccoladeBy VARCHAR(500),
    IN p_AccoladeDate DATE
)
BEGIN
    INSERT INTO EMPLOYEE_ACCOLADE (
        EMPLOYEE_MASTER_ID, AccoladeName, AccoladeBy, AccoladeDate,
        LastUpdatedBy, LastUpdatedAt
    ) VALUES (
        p_EMPLOYEE_MASTER_ID, p_AccoladeName, p_AccoladeBy, p_AccoladeDate,
        'employee-self-service', NOW()
    );
END$$
DELIMITER ;

