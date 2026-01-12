# 🏢 KTPM Project - Hệ Thống Quản Lý Chung Cư

**Giải pháp quản lý chung cư toàn diện với tính năng quản lý hộ khẩu, cư dân, phương tiện, và thu phí.**

---

## 📌 Thông Tin Dự Án

- **Tên Project:** KTPM Project
- **Phiên Bản:** 2.0.0
- **Trạng Thái:** ✅ Production Ready
- **Ngày Cập Nhật:** 12/01/2026
- **Repository:** https://github.com/RonaldoCuuTu123/KTPM_Project

---

## 🏗️ Cấu Trúc Project

```
KTPM_Project/
├── back-end/                 # API Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/      # Business logic
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Service layer
│   │   └── utils/           # Helper utilities
│   ├── index.js             # Entry point
│   └── package.json         # Dependencies
├── database/                 # Database scripts
│   ├── finalDB1.sql         # Database schema
│   └── migration_*.sql      # Migration scripts
└── README.md                # This file
```

---

## 🎯 Các Tính Năng Chính

### 👥 Quản Lý Cư Dân
- Quản lý hộ khẩu (Household)
- Quản lý cư dân (Resident)
- Lịch sử hộ khẩu (History tracking)
- Nhân khẩu tạm vắng/tạm trú (Temporary Status)

### 🚗 Quản Lý Phương Tiện
- Đăng ký phương tiện
- Theo dõi thông tin phương tiện
- Liên kết phương tiện với hộ khẩu

### 💰 Quản Lý Thu Phí
- Định nghĩa loại phí (Fee Type)
- Quản lý chi tiết phí (Fee Detail)
- Quản lý bộ sưu tập phí (Fee Collection)
- Quản lý thanh toán (Payment)

### 📊 Thống Kê & Báo Cáo
- Dashboard thống kê
- Phân loại theo giới tính
- Phân loại theo độ tuổi
- Thống kê tạm vắng/tạm trú

---

## 🚀 Cài Đặt & Chạy

### Yêu Cầu
- Node.js v16+ 
- MySQL 8.0+
- npm v8+

### Bước 1: Clone Repository
```bash
git clone https://github.com/RonaldoCuuTu123/KTPM_Project.git
cd KTPM_Project
```

### Bước 2: Setup Database
```bash
# Tạo database
mysql -u root -p < database/finalDB1.sql

# Apply migrations
mysql -u root -p Quan_ly_thu_phi < database/migration_01_add_payment_fields.sql
```

### Bước 3: Setup Backend
```bash
cd back-end
npm install
```

### Bước 4: Cấu Hình Environment
Tạo file `.env` trong `back-end/`:
```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=admin
DB_NAME=Quan_ly_thu_phi
```

### Bước 5: Chạy Server
```bash
npm run dev
# Server chạy tại: http://localhost:3001
# Swagger UI: http://localhost:3001/api-docs
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Main Endpoints

| Chức Năng | Endpoint | Method |
|-----------|----------|--------|
| **Hộ khẩu** | `/households` | GET/POST/PUT/DELETE |
| **Cư dân** | `/residents` | GET/POST/PUT/DELETE |
| **Phương tiện** | `/vehicle` | GET/POST/PUT/DELETE |
| **Loại phí** | `/fee-type` | GET/POST/PUT/DELETE |
| **Chi tiết phí** | `/fee-detail` | GET/POST/PUT/DELETE |
| **Bộ sưu tập phí** | `/fee-collection` | GET/POST/PUT/DELETE |
| **Thanh toán** | `/payment` | GET/POST/PUT/DELETE |
| **Thống kê** | `/statistics` | GET |

### Xem Chi Tiết API
```
Truy cập Swagger UI: http://localhost:3001/api-docs
```

---

## 🛠️ Công Nghệ Sử Dụng

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL + Sequelize ORM
- **Authentication:** JWT
- **Hashing:** bcrypt
- **Documentation:** Swagger/OpenAPI
- **Server:** Nodemon (dev), PM2 (production)

### Utilities
- **CORS:** Enable all origins
- **Helmet:** Security headers
- **Morgan:** HTTP request logger

---

## 📝 Các File Tài Liệu

| File | Mô Tả |
|------|-------|
| [QUICK_REFERENCE.md](back-end/QUICK_REFERENCE.md) | Hướng dẫn nhanh 5 phút |
| [API_INTEGRATION_GUIDE.md](back-end/API_INTEGRATION_GUIDE.md) | Tài liệu API chi tiết |
| [IMPLEMENTATION_SUMMARY.md](back-end/IMPLEMENTATION_SUMMARY.md) | Tóm tắt các thay đổi kỹ thuật |

---

## 👤 Tài Khoản Mặc Định

| Tài Khoản | Mật Khẩu | Vai Trò |
|-----------|----------|---------|
| admin | admin123 | Administrator |
| canbo | canbo123 | Staff |
| ketoan | ketoan123 | Finance |

---

## ✅ Checklist Triển Khai

- [x] Database schema
- [x] Controllers & Services
- [x] Models & Relationships
- [x] Routes & Endpoints
- [x] Authentication (JWT)
- [x] Payment API
- [x] Statistics Dashboard
- [x] Swagger Documentation
- [x] Database Migrations
- [x] Error Handling

---

## 🔗 Links Quan Trọng

- **GitHub Repository:** https://github.com/RonaldoCuuTu123/KTPM_Project
- **Main Branch:** main
- **Development Branch:** BE_12/1
- **API Server:** http://localhost:3001
- **API Docs:** http://localhost:3001/api-docs

---

## 📞 Support & Contact

Nếu có bất kỳ vấn đề gì, vui lòng liên hệ hoặc tạo issue trên GitHub.

---

**Made with ❤️ for KTPM Project**