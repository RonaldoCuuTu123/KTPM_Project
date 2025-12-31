-- ============================================
-- CẬP NHẬT DATABASE CHO ĐẦY ĐỦ YÊU CẦU ĐỀ BÀI
-- ============================================
use Quan_ly_thu_phi;
-- 1. BỔ SUNG CỘT CHO BẢNG HOUSEHOLDS
ALTER TABLE Households 
ADD COLUMN Street VARCHAR(100) AFTER RoomNumber,
ADD COLUMN Ward VARCHAR(50) AFTER Street,
ADD COLUMN District VARCHAR(50) AFTER Ward;

-- 2. BỔ SUNG CỘT CHO BẢNG RESIDENTS
ALTER TABLE Residents 
ADD COLUMN Nickname VARCHAR(50) AFTER FullName,
ADD COLUMN PlaceOfBirth VARCHAR(100) AFTER DateOfBirth,
ADD COLUMN Hometown VARCHAR(100) AFTER PlaceOfBirth,
ADD COLUMN Ethnicity VARCHAR(50) AFTER Hometown,
ADD COLUMN Workplace VARCHAR(200) AFTER Occupation,
ADD COLUMN IDCardNumber VARCHAR(20) AFTER Workplace,
ADD COLUMN IDCardIssueDate DATE AFTER IDCardNumber,
ADD COLUMN IDCardIssuePlace VARCHAR(100) AFTER IDCardIssueDate,
ADD COLUMN PreviousAddress TEXT AFTER ResidencyStatus;

-- 3. TẠO BẢNG LỊCH SỬ THAY ĐỔI HỘ KHẨU
CREATE TABLE HouseholdHistory (
  HistoryID INT PRIMARY KEY AUTO_INCREMENT,
  HouseholdID INT NOT NULL,
  ChangeType ENUM('Thay đổi chủ hộ', 'Thay đổi địa chỉ', 'Thay đổi thông tin khác') NOT NULL,
  ChangeContent TEXT NOT NULL,
  OldValue TEXT,
  NewValue TEXT,
  ChangeDate DATE NOT NULL,
  ChangedBy INT,
  Notes TEXT,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (HouseholdID) REFERENCES Households(HouseholdID),
  FOREIGN KEY (ChangedBy) REFERENCES Users(UserID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TẠO BẢNG LỊCH SỬ THAY ĐỔI NHÂN KHẨU
CREATE TABLE ResidentHistory (
  HistoryID INT PRIMARY KEY AUTO_INCREMENT,
  ResidentID INT NOT NULL,
  HouseholdID INT NOT NULL,
  ChangeType ENUM('Chuyển đi', 'Qua đời', 'Thay đổi thông tin', 'Thêm mới') NOT NULL,
  ChangeDate DATE NOT NULL,
  Destination VARCHAR(200),
  Reason TEXT,
  Notes TEXT,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ResidentID) REFERENCES Residents(ResidentID),
  FOREIGN KEY (HouseholdID) REFERENCES Households(HouseholdID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. TẠO BẢNG QUẢN LÝ TẠM VẮNG
CREATE TABLE TemporaryAbsence (
  AbsenceID INT PRIMARY KEY AUTO_INCREMENT,
  ResidentID INT NOT NULL,
  HouseholdID INT NOT NULL,
  StartDate DATE NOT NULL,
  EndDate DATE,
  Destination VARCHAR(200),
  Reason TEXT,
  Status ENUM('Đang vắng', 'Đã về') DEFAULT 'Đang vắng',
  ApprovedBy INT,
  ApprovalDate DATE,
  Notes TEXT,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ResidentID) REFERENCES Residents(ResidentID),
  FOREIGN KEY (HouseholdID) REFERENCES Households(HouseholdID),
  FOREIGN KEY (ApprovedBy) REFERENCES Users(UserID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. TẠO BẢNG QUẢN LÝ TẠM TRÚ
CREATE TABLE TemporaryResidence (
  ResidenceID INT PRIMARY KEY AUTO_INCREMENT,
  FullName VARCHAR(100) NOT NULL,
  DateOfBirth DATE,
  Sex ENUM('Nam', 'Nữ') NOT NULL,
  IDCardNumber VARCHAR(20),
  PhoneNumber VARCHAR(20),
  PermanentAddress TEXT NOT NULL,
  HouseholdID INT NOT NULL,
  StartDate DATE NOT NULL,
  EndDate DATE,
  Reason TEXT,
  Status ENUM('Đang tạm trú', 'Đã kết thúc') DEFAULT 'Đang tạm trú',
  ApprovedBy INT,
  ApprovalDate DATE,
  Notes TEXT,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (HouseholdID) REFERENCES Households(HouseholdID),
  FOREIGN KEY (ApprovedBy) REFERENCES Users(UserID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. CẬP NHẬT TRIGGER XÓA HOUSEHOLD
DROP TRIGGER IF EXISTS trg_delete_household;

DELIMITER $$
CREATE TRIGGER trg_delete_household
BEFORE DELETE ON Households
FOR EACH ROW
BEGIN
  DELETE FROM Residents WHERE HouseholdID = OLD.HouseholdID;
  DELETE FROM Vehicles WHERE HouseholdID = OLD.HouseholdID;
  DELETE FROM FeeDetails WHERE HouseholdID = OLD.HouseholdID;
  DELETE FROM HouseholdHistory WHERE HouseholdID = OLD.HouseholdID;
  DELETE FROM ResidentHistory WHERE HouseholdID = OLD.HouseholdID;
  DELETE FROM TemporaryAbsence WHERE HouseholdID = OLD.HouseholdID;
  DELETE FROM TemporaryResidence WHERE HouseholdID = OLD.HouseholdID;
END$$
DELIMITER ;

-- 8. TRIGGER TỰ ĐỘNG GHI LỊCH SỬ KHI THAY ĐỔI CHỦ HỘ
DELIMITER $$
CREATE TRIGGER trg_household_head_change
AFTER UPDATE ON Households
FOR EACH ROW
BEGIN
  IF NEW.HouseholdHead <> OLD.HouseholdHead THEN
    INSERT INTO HouseholdHistory (HouseholdID, ChangeType, ChangeContent, OldValue, NewValue, ChangeDate)
    VALUES (NEW.HouseholdID, 'Thay đổi chủ hộ', 
            CONCAT('Đổi chủ hộ từ "', OLD.HouseholdHead, '" sang "', NEW.HouseholdHead, '"'),
            OLD.HouseholdHead, NEW.HouseholdHead, CURDATE());
  END IF;
END$$
DELIMITER ;

-- 9. TRIGGER GHI LỊCH SỬ KHI RESIDENT THAY ĐỔI TRẠNG THÁI
DELIMITER $$
CREATE TRIGGER trg_resident_status_change
AFTER UPDATE ON Residents
FOR EACH ROW
BEGIN
  IF NEW.ResidencyStatus <> OLD.ResidencyStatus THEN
    INSERT INTO ResidentHistory (ResidentID, HouseholdID, ChangeType, ChangeDate, Notes)
    VALUES (NEW.ResidentID, NEW.HouseholdID, 'Thay đổi thông tin', CURDATE(),
            CONCAT('Đổi trạng thái từ "', OLD.ResidencyStatus, '" sang "', NEW.ResidencyStatus, '"'));
  END IF;
END$$
DELIMITER ;

-- 10. FUNCTION TÍNH PHÍ VỆ SINH (6000 VNĐ/THÁNG/NGƯỜI * 12 THÁNG)
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
DELIMITER ;

-- 11. INDEX ĐỂ TỐI ƯU TRUY VẤN
CREATE INDEX idx_resident_household ON Residents(HouseholdID);
CREATE INDEX idx_resident_status ON Residents(ResidencyStatus);
CREATE INDEX idx_feedetail_collection ON FeeDetails(CollectionID);
CREATE INDEX idx_feedetail_household ON FeeDetails(HouseholdID);
CREATE INDEX idx_feedetail_status ON FeeDetails(PaymentStatus);
CREATE INDEX idx_vehicle_household ON Vehicles(HouseholdID);
CREATE INDEX idx_temp_absence_resident ON TemporaryAbsence(ResidentID);
CREATE INDEX idx_temp_residence_household ON TemporaryResidence(HouseholdID);