-- ============================================
-- XÓA VÀ TẠO LẠI TOÀN BỘ DATABASE
-- QUẢN LÝ TỔ DÂN PHỐ 7 - PHƯỜNG LA KHÊ
-- ============================================

-- Xóa database cũ và tạo lại
DROP DATABASE IF EXISTS Quan_ly_thu_phi;

CREATE DATABASE Quan_ly_thu_phi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE Quan_ly_thu_phi;

-- ============================================
-- PHẦN 1: TẠO CÁC BẢNG
-- ============================================

-- 1. Bảng Users (Quản lý tài khoản ban quản lý)
CREATE TABLE Users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(100),
    PhoneNumber VARCHAR(20),
    Role ENUM(
        'Tổ trưởng',
        'Tổ phó',
        'Thủ quỹ',
        'Cán bộ hành chính',
        'Cán bộ y tế'
    ) NOT NULL,
    Status ENUM(
        'Đang hoạt động',
        'Đã nghỉ việc'
    ) DEFAULT 'Đang hoạt động',
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdateAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (Username),
    INDEX idx_status (Status)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 2. Bảng Households (Hộ khẩu)
CREATE TABLE Households (
    HouseholdID INT PRIMARY KEY AUTO_INCREMENT,
    HouseholdNumber VARCHAR(20) NOT NULL UNIQUE COMMENT 'Số hộ khẩu/Số nhà',
    Street VARCHAR(100) COMMENT 'Đường phố/Ấp',
    Ward VARCHAR(50) COMMENT 'Phường/Xã/Thị trấn',
    District VARCHAR(50) COMMENT 'Quận/Huyện',
    HouseholdHead VARCHAR(50) NOT NULL COMMENT 'Họ tên chủ hộ',
    Members INT DEFAULT 0 COMMENT 'Số thành viên',
    HasVehicle BOOLEAN DEFAULT FALSE COMMENT 'Có phương tiện không',
    Notes TEXT COMMENT 'Ghi chú',
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_household_number (HouseholdNumber),
    INDEX idx_household_head (HouseholdHead)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 3. Bảng Residents (Nhân khẩu)
CREATE TABLE Residents (
    ResidentID INT PRIMARY KEY AUTO_INCREMENT,
    HouseholdID INT NOT NULL,
    FullName VARCHAR(100) NOT NULL COMMENT 'Họ và tên',
    Nickname VARCHAR(50) COMMENT 'Bí danh',
    DateOfBirth DATE COMMENT 'Ngày sinh',
    PlaceOfBirth VARCHAR(100) COMMENT 'Nơi sinh',
    Hometown VARCHAR(100) COMMENT 'Nguyên quán',
    Ethnicity VARCHAR(50) DEFAULT 'Kinh' COMMENT 'Dân tộc',
    Sex ENUM('Nam', 'Nữ') NOT NULL COMMENT 'Giới tính',
    Relationship ENUM(
        'Chủ hộ',
        'Vợ',
        'Chồng',
        'Con',
        'Cha',
        'Mẹ',
        'Anh',
        'Chị',
        'Em',
        'Khác'
    ) NOT NULL COMMENT 'Quan hệ với chủ hộ',
    PhoneNumber VARCHAR(20) COMMENT 'Số điện thoại',
    EducationLevel VARCHAR(50) COMMENT 'Trình độ học vấn',
    Occupation VARCHAR(100) COMMENT 'Nghề nghiệp',
    Workplace VARCHAR(200) COMMENT 'Nơi làm việc',
    IDCardNumber VARCHAR(20) COMMENT 'Số CMND/CCCD',
    IDCardIssueDate DATE COMMENT 'Ngày cấp',
    IDCardIssuePlace VARCHAR(100) COMMENT 'Nơi cấp',
    ResidencyStatus ENUM(
        'Thường trú',
        'Tạm trú',
        'Tạm vắng',
        'Đã chuyển đi'
    ) NOT NULL DEFAULT 'Thường trú' COMMENT 'Trạng thái cư trú',
    RegistrationDate DATE COMMENT 'Ngày đăng ký thường trú',
    PreviousAddress TEXT COMMENT 'Địa chỉ nơi thường trú trước khi chuyển đến',
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (HouseholdID) REFERENCES Households (HouseholdID),
    INDEX idx_household (HouseholdID),
    INDEX idx_fullname (FullName),
    INDEX idx_status (ResidencyStatus),
    INDEX idx_dob (DateOfBirth)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 4. Bảng HouseholdHistory (Lịch sử thay đổi hộ khẩu)
CREATE TABLE HouseholdHistory (
    HistoryID INT PRIMARY KEY AUTO_INCREMENT,
    HouseholdID INT NOT NULL,
    ChangeType ENUM(
        'Thay đổi chủ hộ',
        'Thay đổi địa chỉ',
        'Tách hộ',
        'Thay đổi thông tin khác'
    ) NOT NULL,
    ChangeContent TEXT NOT NULL COMMENT 'Nội dung thay đổi',
    OldValue TEXT COMMENT 'Giá trị cũ',
    NewValue TEXT COMMENT 'Giá trị mới',
    ChangeDate DATE NOT NULL COMMENT 'Ngày thay đổi',
    ChangedBy INT COMMENT 'Người thực hiện thay đổi',
    Notes TEXT COMMENT 'Ghi chú',
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (HouseholdID) REFERENCES Households (HouseholdID),
    FOREIGN KEY (ChangedBy) REFERENCES Users (UserID),
    INDEX idx_household (HouseholdID),
    INDEX idx_change_date (ChangeDate)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 5. Bảng ResidentHistory (Lịch sử thay đổi nhân khẩu)
CREATE TABLE ResidentHistory (
    HistoryID INT PRIMARY KEY AUTO_INCREMENT,
    ResidentID INT NOT NULL,
    HouseholdID INT NOT NULL,
    ChangeType ENUM(
        'Thêm mới',
        'Chuyển đi',
        'Qua đời',
        'Thay đổi thông tin'
    ) NOT NULL,
    ChangeDate DATE NOT NULL,
    Destination VARCHAR(200) COMMENT 'Nơi chuyển đến (nếu chuyển đi)',
    Reason TEXT COMMENT 'Lý do',
    Notes TEXT COMMENT 'Ghi chú',
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ResidentID) REFERENCES Residents (ResidentID),
    FOREIGN KEY (HouseholdID) REFERENCES Households (HouseholdID),
    INDEX idx_resident (ResidentID),
    INDEX idx_household (HouseholdID),
    INDEX idx_change_date (ChangeDate)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 6. Bảng TemporaryAbsence (Giấy tạm vắng)
CREATE TABLE TemporaryAbsence (
    AbsenceID INT PRIMARY KEY AUTO_INCREMENT,
    ResidentID INT NOT NULL,
    HouseholdID INT NOT NULL,
    StartDate DATE NOT NULL COMMENT 'Ngày bắt đầu vắng',
    EndDate DATE COMMENT 'Ngày dự kiến về',
    Destination VARCHAR(200) COMMENT 'Nơi đến',
    Reason TEXT COMMENT 'Lý do đi vắng',
    Status ENUM('Đang vắng', 'Đã về') DEFAULT 'Đang vắng',
    ApprovedBy INT COMMENT 'Người phê duyệt',
    ApprovalDate DATE COMMENT 'Ngày phê duyệt',
    Notes TEXT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ResidentID) REFERENCES Residents (ResidentID),
    FOREIGN KEY (HouseholdID) REFERENCES Households (HouseholdID),
    FOREIGN KEY (ApprovedBy) REFERENCES Users (UserID),
    INDEX idx_resident (ResidentID),
    INDEX idx_household (HouseholdID),
    INDEX idx_status (Status),
    INDEX idx_dates (StartDate, EndDate)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 7. Bảng TemporaryResidence (Giấy tạm trú)
CREATE TABLE TemporaryResidence (
    ResidenceID INT PRIMARY KEY AUTO_INCREMENT,
    FullName VARCHAR(100) NOT NULL,
    DateOfBirth DATE,
    Sex ENUM('Nam', 'Nữ') NOT NULL,
    IDCardNumber VARCHAR(20),
    PhoneNumber VARCHAR(20),
    PermanentAddress TEXT NOT NULL COMMENT 'Địa chỉ thường trú',
    HouseholdID INT NOT NULL COMMENT 'Tạm trú tại hộ',
    StartDate DATE NOT NULL,
    EndDate DATE,
    Reason TEXT COMMENT 'Lý do tạm trú',
    Status ENUM('Đang tạm trú', 'Đã kết thúc') DEFAULT 'Đang tạm trú',
    ApprovedBy INT,
    ApprovalDate DATE,
    Notes TEXT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (HouseholdID) REFERENCES Households (HouseholdID),
    FOREIGN KEY (ApprovedBy) REFERENCES Users (UserID),
    INDEX idx_household (HouseholdID),
    INDEX idx_status (Status),
    INDEX idx_dates (StartDate, EndDate)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 8. Bảng FeeTypes (Loại phí)
CREATE TABLE FeeTypes (
    FeeTypeID INT PRIMARY KEY AUTO_INCREMENT,
    FeeTypeName VARCHAR(100) NOT NULL COMMENT 'Tên loại phí',
    Description TEXT COMMENT 'Mô tả',
    Category ENUM('Bắt buộc', 'Tự nguyện') NOT NULL COMMENT 'Phân loại',
    Scope ENUM('Chung', 'Riêng') NOT NULL COMMENT 'Phạm vi áp dụng',
    UnitPrice DECIMAL(10, 2) COMMENT 'Đơn giá (nếu có)',
    Unit VARCHAR(20) COMMENT 'Đơn vị tính',
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (Category),
    INDEX idx_scope (Scope)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 9. Bảng FeeCollections (Đợt thu phí)
CREATE TABLE FeeCollections (
    CollectionID INT PRIMARY KEY AUTO_INCREMENT,
    FeeTypeID INT NOT NULL,
    CollectionName VARCHAR(100) NOT NULL COMMENT 'Tên đợt thu',
    StartDate DATE NOT NULL COMMENT 'Ngày bắt đầu',
    EndDate DATE COMMENT 'Ngày kết thúc',
    TotalAmount DECIMAL(15, 2) COMMENT 'Tổng số tiền',
    Status ENUM(
        'Đang thu',
        'Hoàn thành',
        'Kết thúc'
    ) NOT NULL DEFAULT 'Đang thu',
    Notes TEXT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (FeeTypeID) REFERENCES FeeTypes (FeeTypeID),
    INDEX idx_status (Status),
    INDEX idx_dates (StartDate, EndDate)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 10. Bảng FeeDetails (Chi tiết thu phí từng hộ)
CREATE TABLE FeeDetails (
    FeeDetailID INT PRIMARY KEY AUTO_INCREMENT,
    CollectionID INT NOT NULL,
    HouseholdID INT NOT NULL,
    Amount DECIMAL(10, 2) COMMENT 'Số tiền phải đóng',
    PaymentDate DATE COMMENT 'Ngày đóng',
    PaymentMethod ENUM('Tiền mặt', 'Chuyển khoản') NOT NULL DEFAULT 'Tiền mặt',
    PaymentStatus ENUM('Chưa đóng', 'Đã đóng') NOT NULL DEFAULT 'Chưa đóng',
    Notes TEXT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (CollectionID) REFERENCES FeeCollections (CollectionID),
    FOREIGN KEY (HouseholdID) REFERENCES Households (HouseholdID),
    INDEX idx_collection (CollectionID),
    INDEX idx_household (HouseholdID),
    INDEX idx_status (PaymentStatus)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 11. Bảng Vehicles (Phương tiện - chỉ ghi nhận, không tính phí)
CREATE TABLE Vehicles (
    VehicleID INT PRIMARY KEY AUTO_INCREMENT,
    HouseholdID INT NOT NULL,
    VehicleType ENUM(
        'Xe máy',
        'Ô tô',
        'Xe đạp điện'
    ) NOT NULL,
    LicensePlate VARCHAR(20) NOT NULL COMMENT 'Biển số xe',
    Brand VARCHAR(50) COMMENT 'Hãng xe',
    Color VARCHAR(50) COMMENT 'Màu xe',
    RegistrationDate DATE NOT NULL COMMENT 'Ngày đăng ký',
    Status ENUM('Đang sử dụng', 'Đã thanh lý') DEFAULT 'Đang sử dụng',
    Notes TEXT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (HouseholdID) REFERENCES Households (HouseholdID),
    INDEX idx_household (HouseholdID),
    INDEX idx_license (LicensePlate)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ============================================
-- PHẦN 2: TẠO TRIGGERS
-- ============================================

-- Trigger 1: Tự động ghi lịch sử khi thay đổi chủ hộ
DELIMITER $$

CREATE TRIGGER trg_household_head_change
AFTER UPDATE ON Households
FOR EACH ROW
BEGIN
    IF NEW.HouseholdHead <> OLD.HouseholdHead THEN
        INSERT INTO HouseholdHistory (
            HouseholdID, ChangeType, ChangeContent, 
            OldValue, NewValue, ChangeDate
        )
        VALUES (
            NEW.HouseholdID, 
            'Thay đổi chủ hộ',
            CONCAT('Đổi chủ hộ từ "', OLD.HouseholdHead, '" sang "', NEW.HouseholdHead, '"'),
            OLD.HouseholdHead,
            NEW.HouseholdHead,
            CURDATE()
        );
    END IF;
END$$

DELIMITER;

-- Trigger 2: Ghi lịch sử khi resident thay đổi trạng thái
DELIMITER $$

CREATE TRIGGER trg_resident_status_change
AFTER UPDATE ON Residents
FOR EACH ROW
BEGIN
    IF NEW.ResidencyStatus <> OLD.ResidencyStatus THEN
        INSERT INTO ResidentHistory (
            ResidentID, HouseholdID, ChangeType, 
            ChangeDate, Notes
        )
        VALUES (
            NEW.ResidentID,
            NEW.HouseholdID,
            'Thay đổi thông tin',
            CURDATE(),
            CONCAT('Đổi trạng thái từ "', OLD.ResidencyStatus, '" sang "', NEW.ResidencyStatus, '"')
        );
    END IF;
END$$

DELIMITER;

-- Trigger 3: Tự động cập nhật HasVehicle khi thêm/xóa xe
DELIMITER $$

CREATE TRIGGER trg_vehicle_insert
AFTER INSERT ON Vehicles
FOR EACH ROW
BEGIN
    UPDATE Households 
    SET HasVehicle = TRUE 
    WHERE HouseholdID = NEW.HouseholdID;
END$$

DELIMITER;

DELIMITER $$

CREATE TRIGGER trg_vehicle_delete
AFTER DELETE ON Vehicles
FOR EACH ROW
BEGIN
    DECLARE vehicle_count INT;
    
    SELECT COUNT(*) INTO vehicle_count 
    FROM Vehicles 
    WHERE HouseholdID = OLD.HouseholdID;
    
    IF vehicle_count = 0 THEN
        UPDATE Households 
        SET HasVehicle = FALSE 
        WHERE HouseholdID = OLD.HouseholdID;
    END IF;
END$$

DELIMITER;

-- Trigger 4: Xóa cascade toàn bộ dữ liệu liên quan khi xóa household
DELIMITER $$

CREATE TRIGGER trg_delete_household
BEFORE DELETE ON Households
FOR EACH ROW
BEGIN
    -- Xóa các bản ghi liên quan
    DELETE FROM Residents WHERE HouseholdID = OLD.HouseholdID;
    DELETE FROM Vehicles WHERE HouseholdID = OLD.HouseholdID;
    DELETE FROM FeeDetails WHERE HouseholdID = OLD.HouseholdID;
    DELETE FROM HouseholdHistory WHERE HouseholdID = OLD.HouseholdID;
    DELETE FROM ResidentHistory WHERE HouseholdID = OLD.HouseholdID;
    DELETE FROM TemporaryAbsence WHERE HouseholdID = OLD.HouseholdID;
    DELETE FROM TemporaryResidence WHERE HouseholdID = OLD.HouseholdID;
END$$

DELIMITER;

-- ============================================
-- PHẦN 3: TẠO FUNCTIONS
-- ============================================

-- Function 1: Tính phí vệ sinh theo số thành viên
-- Công thức: số_thành_viên × 6000 VNĐ/tháng × 12 tháng
DELIMITER $$

CREATE FUNCTION calculate_sanitation_fee_by_household(hid INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE member_count INT;
    DECLARE fee DECIMAL(10,2);
    
    SELECT Members INTO member_count
    FROM Households
    WHERE HouseholdID = hid;
    
    SET fee = member_count * 6000 * 12;
    
    RETURN IFNULL(fee, 0);
END$$

DELIMITER;

-- Function 2: Đếm số cư dân theo độ tuổi
DELIMITER $$

CREATE FUNCTION count_residents_by_age_group(age_group VARCHAR(50))
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE total INT;
    
    SELECT COUNT(*) INTO total
    FROM Residents
    WHERE ResidencyStatus IN ('Thường trú', 'Tạm trú')
    AND CASE age_group
        WHEN 'Mầm non' THEN TIMESTAMPDIFF(YEAR, DateOfBirth, CURDATE()) < 6
        WHEN 'Cấp 1' THEN TIMESTAMPDIFF(YEAR, DateOfBirth, CURDATE()) BETWEEN 6 AND 10
        WHEN 'Cấp 2' THEN TIMESTAMPDIFF(YEAR, DateOfBirth, CURDATE()) BETWEEN 11 AND 14
        WHEN 'Cấp 3' THEN TIMESTAMPDIFF(YEAR, DateOfBirth, CURDATE()) BETWEEN 15 AND 17
        WHEN 'Độ tuổi lao động' THEN TIMESTAMPDIFF(YEAR, DateOfBirth, CURDATE()) BETWEEN 18 AND 60
        WHEN 'Nghỉ hưu' THEN TIMESTAMPDIFF(YEAR, DateOfBirth, CURDATE()) > 60
        ELSE FALSE
    END;
    
    RETURN IFNULL(total, 0);
END$$

DELIMITER;

-- Function 3: Tính tổng tiền đã thu trong một đợt
DELIMITER $$

CREATE FUNCTION get_total_collected_amount(collection_id INT)
RETURNS DECIMAL(15,2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE total DECIMAL(15,2);
    
    SELECT SUM(Amount) INTO total
    FROM FeeDetails
    WHERE CollectionID = collection_id
    AND PaymentStatus = 'Đã đóng';
    
    RETURN IFNULL(total, 0);
END$$

DELIMITER;

-- ============================================
-- PHẦN 4: TẠO STORED PROCEDURES
-- ============================================

-- Procedure 1: Tạo hóa đơn phí vệ sinh cho tất cả hộ
DELIMITER $$

CREATE PROCEDURE create_sanitation_fee_invoices(
    IN collection_id INT
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE hid INT;
    DECLARE fee_amount DECIMAL(10,2);
    
    DECLARE cur CURSOR FOR 
        SELECT HouseholdID 
        FROM Households;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    
    read_loop: LOOP
        FETCH cur INTO hid;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        SET fee_amount = calculate_sanitation_fee_by_household(hid);
        
        INSERT INTO FeeDetails (
            CollectionID, HouseholdID, Amount, 
            PaymentMethod, PaymentStatus
        )
        VALUES (
            collection_id, hid, fee_amount,
            'Tiền mặt', 'Chưa đóng'
        );
    END LOOP;
    
    CLOSE cur;
END$$

DELIMITER;

-- Procedure 2: Thống kê tổng quan thu phí
DELIMITER $$

CREATE PROCEDURE get_collection_summary(
    IN collection_id INT
)
BEGIN
    SELECT 
        COUNT(*) as total_households,
        SUM(CASE WHEN PaymentStatus = 'Đã đóng' THEN 1 ELSE 0 END) as paid_count,
        SUM(CASE WHEN PaymentStatus = 'Chưa đóng' THEN 1 ELSE 0 END) as unpaid_count,
        SUM(CASE WHEN PaymentStatus = 'Đã đóng' THEN Amount ELSE 0 END) as total_collected,
        SUM(CASE WHEN PaymentStatus = 'Chưa đóng' THEN Amount ELSE 0 END) as total_remaining,
        SUM(Amount) as total_amount
    FROM FeeDetails
    WHERE CollectionID = collection_id;
END$$

DELIMITER;

-- Procedure 3: Tách hộ khẩu
DELIMITER $$

CREATE PROCEDURE split_household(
    IN original_household_id INT,
    IN new_household_number VARCHAR(20),
    IN new_household_head VARCHAR(50),
    IN resident_ids TEXT,
    IN notes TEXT,
    OUT new_household_id INT
)
BEGIN
    DECLARE original_street VARCHAR(100);
    DECLARE original_ward VARCHAR(50);
    DECLARE original_district VARCHAR(50);
    DECLARE original_number VARCHAR(20);
    DECLARE moved_count INT;
    
    -- Lấy thông tin hộ gốc
    SELECT HouseholdNumber, Street, Ward, District
    INTO original_number, original_street, original_ward, original_district
    FROM Households
    WHERE HouseholdID = original_household_id;
    
    -- Tạo hộ mới
    INSERT INTO Households (
        HouseholdNumber, Street, Ward, District,
        HouseholdHead, Members, Notes
    )
    VALUES (
        new_household_number,
        original_street,
        original_ward,
        original_district,
        new_household_head,
        0,
        IFNULL(notes, CONCAT('Tách từ hộ số ', original_number))
    );
    
    SET new_household_id = LAST_INSERT_ID();
    
    -- Chuyển cư dân sang hộ mới
    UPDATE Residents
    SET HouseholdID = new_household_id
    WHERE FIND_IN_SET(ResidentID, resident_ids) > 0;
    
    SET moved_count = ROW_COUNT();
    
    -- Cập nhật số thành viên
    UPDATE Households
    SET Members = (SELECT COUNT(*) FROM Residents WHERE HouseholdID = new_household_id)
    WHERE HouseholdID = new_household_id;
    
    UPDATE Households
    SET Members = (SELECT COUNT(*) FROM Residents WHERE HouseholdID = original_household_id)
    WHERE HouseholdID = original_household_id;
    
    -- Ghi lịch sử
    INSERT INTO HouseholdHistory (
        HouseholdID, ChangeType, ChangeContent, ChangeDate, Notes
    )
    VALUES (
        original_household_id,
        'Tách hộ',
        CONCAT('Tách thành hộ mới số ', new_household_number),
        CURDATE(),
        CONCAT(moved_count, ' thành viên được chuyển sang hộ mới')
    );
END$$

DELIMITER;

-- ============================================
-- PHẦN 5: THÊM DỮ LIỆU MẪU
-- ============================================

-- 1. Dữ liệu Users
INSERT INTO
    Users (
        Username,
        Password,
        FullName,
        Email,
        PhoneNumber,
        Role
    )
VALUES (
        'admin1234',
        '$2b$10$zQ5hX8dZ0Y2vJ9kL3pW4XeH7fG6sR1tY8uI0oP5nA2mB3cD4eF5gH',
        'Nguyễn Bá Tú',
        'admin123@gmail.com',
        '0123456789',
        'Tổ trưởng'
    ),
    (
        'tropho01',
        '$2b$10$zQ5hX8dZ0Y2vJ9kL3pW4XeH7fG6sR1tY8uI0oP5nA2mB3cD4eF5gH',
        'Trần Văn Phó',
        'tropho@gmail.com',
        '0987654321',
        'Tổ phó'
    ),
    (
        'thuquy01',
        '$2b$10$zQ5hX8dZ0Y2vJ9kL3pW4XeH7fG6sR1tY8uI0oP5nA2mB3cD4eF5gH',
        'Lê Thị Lan',
        'thuquy@gmail.com',
        '0912345678',
        'Thủ quỹ'
    );

-- 2. Dữ liệu Households
INSERT INTO
    Households (
        HouseholdNumber,
        Street,
        Ward,
        District,
        HouseholdHead,
        Members,
        Notes
    )
VALUES (
        '101',
        'Đường La Khê',
        'La Khê',
        'Hà Đông',
        'Nguyễn Văn Minh',
        4,
        'Gia đình giáo viên'
    ),
    (
        '102',
        'Đường La Khê',
        'La Khê',
        'Hà Đông',
        'Trần Thị Hoa',
        3,
        'Kinh doanh tạp hóa'
    ),
    (
        '103',
        'Đường La Khê',
        'La Khê',
        'Hà Đông',
        'Phạm Văn Long',
        5,
        'Tam đại đồng đường'
    ),
    (
        '104',
        'Đường La Khê',
        'La Khê',
        'Hà Đông',
        'Lê Thị Mai',
        1,
        'Người già neo đơn'
    ),
    (
        '105',
        'Đường La Khê',
        'La Khê',
        'Hà Đông',
        'Hoàng Văn Tú',
        2,
        'Vợ chồng trẻ'
    ),
    (
        '201',
        'Ngõ 5',
        'La Khê',
        'Hà Đông',
        'Vũ Thị Lan',
        4,
        'Gia đình công nhân'
    ),
    (
        '202',
        'Ngõ 5',
        'La Khê',
        'Hà Đông',
        'Đỗ Văn Hùng',
        3,
        'Gia đình bác sĩ'
    ),
    (
        '203',
        'Ngõ 5',
        'La Khê',
        'Hà Đông',
        'Ngô Thị Nga',
        2,
        'Sinh viên thuê trọ'
    ),
    (
        '301',
        'Đường Quang Trung',
        'La Khê',
        'Hà Đông',
        'Bùi Văn Nam',
        4,
        'Gia đình kỹ sư'
    ),
    (
        '302',
        'Đường Quang Trung',
        'La Khê',
        'Hà Đông',
        'Đinh Thị Thảo',
        6,
        'Gia đình đông con'
    );

-- 3. Dữ liệu Residents (mẫu cho 3 hộ đầu)
INSERT INTO
    Residents (
        HouseholdID,
        FullName,
        DateOfBirth,
        Sex,
        Relationship,
        PhoneNumber,
        Occupation,
        ResidencyStatus,
        RegistrationDate
    )
VALUES
    -- Hộ 101
    (
        1,
        'Nguyễn Văn Minh',
        '1980-03-15',
        'Nam',
        'Chủ hộ',
        '0912345678',
        'Giáo viên',
        'Thường trú',
        '2018-01-01'
    ),
    (
        1,
        'Phạm Thị Lan',
        '1982-05-20',
        'Nữ',
        'Vợ',
        '0987654321',
        'Kế toán',
        'Thường trú',
        '2018-01-01'
    ),
    (
        1,
        'Nguyễn Văn An',
        '2010-08-10',
        'Nam',
        'Con',
        NULL,
        'Học sinh',
        'Thường trú',
        '2018-01-01'
    ),
    (
        1,
        'Nguyễn Thị Hà',
        '2015-12-25',
        'Nữ',
        'Con',
        NULL,
        'Học sinh',
        'Thường trú',
        '2018-01-01'
    ),
    -- Hộ 102
    (
        2,
        'Trần Thị Hoa',
        '1975-07-08',
        'Nữ',
        'Chủ hộ',
        '0901234567',
        'Kinh doanh',
        'Thường trú',
        '2017-06-15'
    ),
    (
        2,
        'Trần Văn Bình',
        '1970-11-12',
        'Nam',
        'Chồng',
        '0912345679',
        'Thợ xây',
        'Thường trú',
        '2017-06-15'
    ),
    (
        2,
        'Trần Văn Cường',
        '2005-04-18',
        'Nam',
        'Con',
        '0935678901',
        'Học sinh',
        'Thường trú',
        '2017-06-15'
    ),
    -- Hộ 104
    (
        4,
        'Lê Thị Mai',
        '1950-02-28',
        'Nữ',
        'Chủ hộ',
        '0976543210',
        'Hưu trí',
        'Thường trú',
        '2015-01-01'
    );

-- 4. Dữ liệu FeeTypes
INSERT INTO
    FeeTypes (
        FeeTypeName,
        Description,
        Category,
        Scope,
        UnitPrice,
        Unit
    )
VALUES (
        'Phí vệ sinh',
        'Phí vệ sinh môi trường - 6000đ/người/tháng',
        'Bắt buộc',
        'Chung',
        6000.00,
        'người/tháng'
    ),
    (
        'Ủng hộ ngày 27/7',
        'Ủng hộ thương binh liệt sỹ',
        'Tự nguyện',
        'Chung',
        NULL,
        'Tùy tâm'
    ),
    (
        'Ủng hộ Tết thiếu nhi',
        'Ủng hộ quà Tết cho trẻ em',
        'Tự nguyện',
        'Chung',
        NULL,
        'Tùy tâm'
    ),
    (
        'Ủng hộ vì người nghèo',
        'Quỹ vì người nghèo',
        'Tự nguyện',
        'Chung',
        NULL,
        'Tùy tâm'
    ),
    (
        'Ủng hộ bão lụt',
        'Hỗ trợ đồng bào thiên tai',
        'Tự nguyện',
        'Chung',
        NULL,
        'Tùy tâm'
    );

-- 5. Dữ liệu FeeCollections
INSERT INTO
    FeeCollections (
        FeeTypeID,
        CollectionName,
        StartDate,
        EndDate,
        Status,
        Notes
    )
VALUES (
        1,
        'Phí vệ sinh năm 2024',
        '2024-01-01',
        '2024-12-31',
        'Đang thu',
        'Thu phí vệ sinh cả năm 2024'
    ),
    (
        2,
        'Ủng hộ 27/7 năm 2024',
        '2024-07-01',
        '2024-07-27',
        'Hoàn thành',
        'Vận động ủng hộ thương binh liệt sỹ'
    ),
    (
        3,
        'Ủng hộ Tết thiếu nhi 2024',
        '2024-05-20',
        '2024-06-01',
        'Hoàn thành',
        'Mua quà cho trẻ em'
    );

-- 6. Dữ liệu FeeDetails (mẫu)
INSERT INTO
    FeeDetails (
        CollectionID,
        HouseholdID,
        Amount,
        PaymentDate,
        PaymentMethod,
        PaymentStatus
    )
VALUES
    -- Phí vệ sinh 2024
    (
        1,
        1,
        288000.00,
        '2024-01-10',
        'Chuyển khoản',
        'Đã đóng'
    ),
    (
        1,
        2,
        216000.00,
        '2024-01-15',
        'Tiền mặt',
        'Đã đóng'
    ),
    (
        1,
        3,
        360000.00,
        NULL,
        'Tiền mặt',
        'Chưa đóng'
    ),
    (
        1,
        4,
        72000.00,
        '2024-01-08',
        'Tiền mặt',
        'Đã đóng'
    ),
    -- Ủng hộ 27/7
    (
        2,
        1,
        200000.00,
        '2024-07-10',
        'Chuyển khoản',
        'Đã đóng'
    ),
    (
        2,
        2,
        100000.00,
        '2024-07-15',
        'Tiền mặt',
        'Đã đóng'
    );

-- 7. Dữ liệu Vehicles
INSERT INTO
    Vehicles (
        HouseholdID,
        VehicleType,
        LicensePlate,
        Brand,
        Color,
        RegistrationDate,
        Status
    )
VALUES (
        1,
        'Xe máy',
        '29A1-12345',
        'Honda Wave',
        'Đỏ',
        '2023-01-15',
        'Đang sử dụng'
    ),
    (
        1,
        'Xe máy',
        '29A1-54321',
        'Yamaha Sirius',
        'Xanh',
        '2023-03-20',
        'Đang sử dụng'
    ),
    (
        2,
        'Xe máy',
        '29B2-98765',
        'Honda Future',
        'Đen',
        '2023-05-10',
        'Đang sử dụng'
    ),
    (
        3,
        'Ô tô',
        '30H-999.99',
        'Toyota Vios',
        'Trắng',
        '2024-01-05',
        'Đang sử dụng'
    );

-- ============================================
-- PHẦN 6: KIỂM TRA KẾT QUẢ
-- ============================================

SELECT
    '✅ TẠO DATABASE THÀNH CÔNG!' as Status,
    (
        SELECT COUNT(*)
        FROM Households
    ) as TotalHouseholds,
    (
        SELECT COUNT(*)
        FROM Residents
    ) as TotalResidents,
    (
        SELECT COUNT(*)
        FROM FeeTypes
    ) as TotalFeeTypes,
    (
        SELECT COUNT(*)
        FROM FeeCollections
    ) as TotalCollections,
    (
        SELECT COUNT(*)
        FROM Users
    ) as TotalUsers;

-- Hiển thị danh sách các function
SELECT
    ROUTINE_NAME as FunctionName,
    ROUTINE_TYPE as Type
FROM information_schema.ROUTINES
WHERE
    ROUTINE_SCHEMA = 'Quan_ly_thu_phi'
    AND ROUTINE_TYPE = 'FUNCTION';

-- Hiển thị danh sách các procedure
SELECT
    ROUTINE_NAME as ProcedureName,
    ROUTINE_TYPE as Type
FROM information_schema.ROUTINES
WHERE
    ROUTINE_SCHEMA = 'Quan_ly_thu_phi'
    AND ROUTINE_TYPE = 'PROCEDURE';

-- Hiển thị danh sách triggers
SELECT
    TRIGGER_NAME as TriggerName,
    EVENT_MANIPULATION as Event,
    EVENT_OBJECT_TABLE as TableName
FROM information_schema.TRIGGERS
WHERE
    TRIGGER_SCHEMA = 'Quan_ly_thu_phi';

DELETE FROM Users WHERE Username = 'admin1234';