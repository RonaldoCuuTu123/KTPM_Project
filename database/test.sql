-- CHỌN DATABASE
USE Quan_ly_thu_phi;

-- 1. DỮ LIỆU NGƯỜI DÙNG (USERS)
-- Mật khẩu giả định đã được hash nếu hệ thống yêu cầu
INSERT INTO
    Users (
        Username,
        Password,
        FullName,
        Email,
        PhoneNumber,
        Role,
        Status
    )
VALUES (
        'admin_truong',
        'pass123',
        'Nguyễn Văn Trưởng',
        'truong@chungcu.com',
        '0912345678',
        'Tổ trưởng',
        'Đang hoạt động'
    ),
    (
        'pho_minh',
        'pass123',
        'Lê Văn Phó',
        'minh@chungcu.com',
        '0912345679',
        'Tổ phó',
        'Đang hoạt động'
    ),
    (
        'thuquy_lan',
        'pass123',
        'Trần Thị Lan',
        'lan@chungcu.com',
        '0912345680',
        'Thủ quỹ',
        'Đang hoạt động'
    );

-- 2. DỮ LIỆU HỘ GIA ĐÌNH (HOUSEHOLDS)
INSERT INTO
    Households (
        RoomNumber,
        Type,
        HouseholdHead,
        Members,
        HasVehicle,
        Notes
    )
VALUES (
        'P101',
        'Đơn',
        'Nguyễn Văn A',
        3,
        TRUE,
        'Hộ gia đình mẫu tầng 1'
    ),
    (
        'P102',
        'Đôi',
        'Trần Thị B',
        4,
        TRUE,
        'Căn hộ diện tích lớn'
    ),
    (
        'P201',
        'Đơn',
        'Lê Văn C',
        2,
        TRUE,
        'Có người già neo đơn'
    ),
    (
        'P202',
        'Đơn',
        'Phạm Thị D',
        1,
        FALSE,
        'Sinh viên thuê trọ'
    ),
    (
        'P301',
        'Đôi',
        'Hoàng Văn E',
        5,
        TRUE,
        'Gia đình tam đại đồng đường'
    ),
    (
        'P302',
        'Đơn',
        'Ngô Văn F',
        2,
        FALSE,
        'Chủ hộ thường xuyên đi vắng'
    );

-- 3. DỮ LIỆU CƯ DÂN (RESIDENTS)
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
VALUES (
        1,
        'Nguyễn Văn A',
        '1980-01-01',
        'Nam',
        'Chủ hộ',
        '0981111111',
        'Kỹ sư',
        'Thường trú',
        '2023-01-01'
    ),
    (
        1,
        'Nguyễn Thị Vợ',
        '1985-05-05',
        'Nữ',
        'Vợ',
        '0981111112',
        'Giáo viên',
        'Thường trú',
        '2023-01-01'
    ),
    (
        1,
        'Nguyễn Văn Con',
        '2010-10-10',
        'Nam',
        'Con',
        NULL,
        'Học sinh',
        'Thường trú',
        '2023-01-01'
    ),
    (
        2,
        'Trần Thị B',
        '1970-02-02',
        'Nữ',
        'Chủ hộ',
        '0982222222',
        'Kinh doanh',
        'Thường trú',
        '2023-01-01'
    ),
    (
        3,
        'Lê Văn C',
        '1990-03-03',
        'Nam',
        'Chủ hộ',
        '0983333333',
        'Bác sĩ',
        'Tạm trú',
        '2023-11-01'
    ),
    (
        4,
        'Phạm Thị D',
        '2002-04-04',
        'Nữ',
        'Chủ hộ',
        '0984444444',
        'Sinh viên',
        'Tạm trú',
        '2024-01-15'
    ),
    (
        5,
        'Hoàng Văn E',
        '1960-06-06',
        'Nam',
        'Chủ hộ',
        '0985555555',
        'Hưu trí',
        'Thường trú',
        '2023-01-01'
    ),
    (
        6,
        'Ngô Văn F',
        '1995-07-07',
        'Nam',
        'Chủ hộ',
        '0986666666',
        'Lập trình viên',
        'Tạm vắng',
        '2023-05-10'
    );

-- 4. DỮ LIỆU PHƯƠNG TIỆN (VEHICLES)
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
        'Honda',
        'Đỏ',
        '2023-12-01',
        'Còn hạn đăng ký gửi'
    ),
    (
        1,
        'Xe máy',
        '29A1-54321',
        'Yamaha',
        'Xanh',
        '2023-12-01',
        'Còn hạn đăng ký gửi'
    ),
    (
        2,
        'Ô tô',
        '30H-999.99',
        'Toyota',
        'Đen',
        '2023-12-15',
        'Còn hạn đăng ký gửi'
    ),
    (
        3,
        'Xe máy',
        '34B2-88888',
        'Honda',
        'Trắng',
        '2024-01-01',
        'Còn hạn đăng ký gửi'
    ),
    (
        5,
        'Ô tô',
        '30K-111.11',
        'VinFast',
        'Xám',
        '2024-01-10',
        'Còn hạn đăng ký gửi'
    );

-- 5. DỮ LIỆU LOẠI PHÍ (FEE TYPES)
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
        'Phí dịch vụ chung cư',
        'Phí vận hành thang máy, điện hành lang',
        'Bắt buộc',
        'Chung',
        5000.00,
        'm2/tháng'
    ),
    (
        'Phí vệ sinh',
        'Thu gom rác thải sinh hoạt',
        'Bắt buộc',
        'Chung',
        6000.00,
        'Người/tháng'
    ),
    (
        'Phí gửi ô tô',
        'Phí trông giữ ô tô tại hầm',
        'Bắt buộc',
        'Riêng',
        1200000.00,
        'Xe/tháng'
    ),
    (
        'Phí gửi xe máy',
        'Phí trông giữ xe máy tại hầm',
        'Bắt buộc',
        'Riêng',
        70000.00,
        'Xe/tháng'
    ),
    (
        'Quỹ vì người nghèo',
        'Đóng góp ủng hộ người nghèo',
        'Tự nguyện',
        'Chung',
        NULL,
        'Tùy tâm'
    );

-- 6. DỮ LIỆU ĐỢT THU PHÍ (FEE COLLECTIONS)
INSERT INTO
    FeeCollections (
        FeeTypeID,
        CollectionName,
        StartDate,
        EndDate,
        TotalAmount,
        Status
    )
VALUES (
        1,
        'Dịch vụ tháng 01/2024',
        '2024-01-01',
        '2024-01-31',
        5000000.00,
        'Hoàn thành'
    ),
    (
        2,
        'Vệ sinh Quý 1/2024',
        '2024-01-01',
        '2024-03-31',
        1200000.00,
        'Đang thu'
    ),
    (
        3,
        'Trông xe ô tô tháng 01/2024',
        '2024-01-01',
        '2024-01-31',
        2400000.00,
        'Đang thu'
    ),
    (
        5,
        'Ủng hộ Tết Giáp Thìn',
        '2024-01-10',
        '2024-02-10',
        2000000.00,
        'Kết thúc'
    );

-- 7. DỮ LIỆU CHI TIẾT ĐÓNG PHÍ (FEE DETAILS)
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
    -- Đợt dịch vụ tháng 1 (P101 và P102 đã đóng)
    (
        1,
        1,
        350000.00,
        '2024-01-05',
        'Chuyển khoản',
        'Đã đóng'
    ),
    (
        1,
        2,
        500000.00,
        '2024-01-06',
        'Tiền mặt',
        'Đã đóng'
    ),
    -- Đợt vệ sinh Quý 1 (P101 đóng, P201 chưa đóng)
    (
        2,
        1,
        54000.00,
        '2024-01-05',
        'Chuyển khoản',
        'Đã đóng'
    ),
    (
        2,
        3,
        36000.00,
        NULL,
        'Tiền mặt',
        'Chưa đóng'
    ),
    -- Đợt gửi xe ô tô
    (
        3,
        2,
        1200000.00,
        '2024-01-06',
        'Tiền mặt',
        'Đã đóng'
    ),
    (
        3,
        5,
        1200000.00,
        NULL,
        'Chuyển khoản',
        'Chưa đóng'
    ),
    -- Quỹ tự nguyện
    (
        4,
        1,
        200000.00,
        '2024-01-15',
        'Tiền mặt',
        'Đã đóng'
    ),
    (
        4,
        5,
        500000.00,
        '2024-01-20',
        'Chuyển khoản',
        'Đã đóng'
    );