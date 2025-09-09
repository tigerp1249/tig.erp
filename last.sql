 CREATE PROCEDURE `GetFaculty`(IN param_type VARCHAR(20), IN param_value VARCHAR(255))
    -> BEGIN
    ->     -- Ensure only one parameter is provided
    ->     IF param_type NOT IN ('ID', 'EMAIL', 'PHONE') THEN
    ->         SIGNAL SQLSTATE '45000'
    ->         SET MESSAGE_TEXT = 'Invalid parameter type. Use only ID, EMAIL, or PHONE.';
    ->     END IF;
    ->
    ->     SET @param_type = param_type;
    ->     SET @param_value = param_value;
    ->
    ->     SET @query = '
    '>         SELECT
    '>             FM.ID AS FacultyMasterId,
    '>             FM.EID,
    '>             CONCAT_WS('' '', FM.Salutation, FM.FirstName, FM.MiddleName, FM.LastName) AS `Name`,
    '>             FM.MobileNumber,
    '>             FM.EmailAddress,
    '>             FM.PANNumber,
    '>             FM.AadharNumber,
    '>             FM.DateOfBirth,         -- <-- ADDED
    '>             FM.WhatsappNumber,      -- <-- ADDED
    '>             FM.PasswordHash,
    '>             FC.Designation,
    '>             FC.AppointmentType,     -- <-- ADDED
    '>             FC.ContractType,        -- <-- ADDED
    '>             FC.DateOfJoining,       -- <-- ADDED
    '>             FC.MANAGER_EMPLOYEE_ID AS ManagerEmployeeID, -- <-- ADDED
    '>             FC.COLLEGE_MASTER_ID AS CollegeMasterId,
    '>             FC.STREAM_MASTER_ID AS StreamMasterId,
    '>             FC.EmailAddress AS InstituteEmail,
    '>             CM.FullName AS CollegeName,
    '>             CM.Name AS CollegeAbbreviation,
    '>             ST.Name AS StreamName,
    '>             POL.ID AS PolicyId,
    '>             POL.Accepted AS PolicyAccepted,
    '>             POL.DateTimestamp AS PolicyDateTimestamp,
    '>             POL.AppVersion AS PolicyAppVersion,
    '>             POL.PolicyVersion AS PolicyVersion
    '>         FROM
    '>             EMPLOYEE_MASTER FM
    '>         JOIN EMPLOYEE_ASSOCIATION FC ON (FM.ID = FC.EMPLOYEE_MASTER_ID)
    '>         JOIN COLLEGE_MASTER CM ON FC.COLLEGE_MASTER_ID = CM.ID
    '>         LEFT JOIN STREAM_MASTER ST ON FC.STREAM_MASTER_ID = ST.ID
    '>         LEFT JOIN POLICY_ACCEPTANCE POL ON FM.ID = POL.EMPLOYEE_MASTER_ID
    '>         WHERE ';
    ->
    ->     IF param_type = 'EMAIL' THEN
    ->         select `EMPLOYEE_MASTER_ID` into @param_value from `EMPLOYEE_ASSOCIATION` where `EmailAddress` = param_value limit 1;
    ->         SET @param_type = 'ID';
    ->         if @param_value IS NULL or @param_value = '' or @param_value = param_value then
    ->             SET @param_type = param_type;
    ->             SET @param_value = param_value;
    ->         end if;
    ->     END IF;
    ->
    ->     IF @param_type = 'ID' THEN
    ->         SET @query = CONCAT(@query, ' FM.ID = @param_value');
    ->     ELSEIF @param_type = 'EMAIL' THEN
    ->         SET @query = CONCAT(@query, ' FM.EmailAddress = @param_value OR FC.EmailAddress = @param_value');
    ->     ELSEIF @param_type = 'PHONE' THEN
    ->         SET @query = CONCAT(@query, ' FM.MobileNumber = @param_value');
    ->     END IF;
    ->
    ->     PREPARE stmt FROM @query;
    ->     EXECUTE stmt;
    ->     DEALLOCATE PREPARE stmt;
    -> END$$



    DROP PROCEDURE IF EXISTS `sp_SearchStaff`;

DELIMITER $$

CREATE PROCEDURE `sp_SearchStaff`(
    IN p_Id INT,
    IN p_Email VARCHAR(255),
    IN p_Phone VARCHAR(20),
    IN p_Name VARCHAR(255)
)
BEGIN
    SELECT 
        FM.ID AS FacultyMasterId,
        FM.EID,
        FM.Salutation,
        FM.FirstName,
        FM.MiddleName,
        FM.LastName,
        FM.MobileNumber,
        FM.EmailAddress,
        FM.PANNumber,
        FM.AadharNumber,
        FM.DateOfBirth,
        FM.WhatsappNumber,
        FC.Designation,
        FC.AppointmentType,
        FC.ContractType,
        FC.DateOfJoining,
        FC.MANAGER_EMPLOYEE_ID AS ManagerEmployeeID,
        FC.COLLEGE_MASTER_ID AS CollegeMasterId,
        FC.STREAM_MASTER_ID AS StreamMasterId,
        FC.EmailAddress AS InstituteEmail,
        CM.FullName AS CollegeName
    FROM 
        EMPLOYEE_MASTER FM
    JOIN EMPLOYEE_ASSOCIATION FC ON (FM.ID = FC.EMPLOYEE_MASTER_ID)
    JOIN COLLEGE_MASTER CM ON FC.COLLEGE_MASTER_ID = CM.ID
    WHERE
        -- Each condition only applies if the corresponding parameter is provided
        (p_Id IS NULL OR FM.ID = p_Id)
        AND (p_Email IS NULL OR FM.EmailAddress = p_Email OR FC.EmailAddress = p_Email)
        AND (p_Phone IS NULL OR FM.MobileNumber = p_Phone)
        -- The LIKE operator allows for partial name matches
        AND (p_Name IS NULL OR CONCAT_WS(' ', FM.FirstName, FM.MiddleName, FM.LastName) LIKE CONCAT('%', p_Name, '%'));
END$$

DELIMITER ;