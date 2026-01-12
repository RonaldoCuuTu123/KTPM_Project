-- Database Migration Script for KTPM Project
-- This script adds new fields required for FE integration

-- 1. Add AmountPerMonth field to FeeCollections table
ALTER TABLE `FeeCollections`
ADD COLUMN `AmountPerMonth` DECIMAL(15, 2) COMMENT 'Số tiền mỗi tháng (dùng cho phí bắt buộc tính theo người)' AFTER `TotalAmount`;

-- 2. Add CollectorName field to FeeDetails table
ALTER TABLE `FeeDetails`
ADD COLUMN `CollectorName` VARCHAR(100) COMMENT 'Tên người thu phí' AFTER `PaymentStatus`;

-- Verify the changes
SELECT
    TABLE_NAME,
    COLUMN_NAME,
    COLUMN_TYPE,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE
    TABLE_NAME IN (
        'FeeCollections',
        'FeeDetails'
    )
    AND TABLE_SCHEMA = 'Quan_ly_thu_phi'
ORDER BY TABLE_NAME, ORDINAL_POSITION;

-- Update existing records with default collector name (optional)
UPDATE `FeeDetails`
SET
    `CollectorName` = 'Nguyễn Văn Cường'
WHERE
    `CollectorName` IS NULL;