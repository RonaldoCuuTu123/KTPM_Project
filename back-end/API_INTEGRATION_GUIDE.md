# KTPM Project - Backend API Documentation

## 🎯 Overview
This backend API is designed to work with the KTPM (Quản lý tổ dân phố) Frontend application. It provides endpoints for managing households, residents, and fee collection.

## 📋 Completed Enhancements

### 1. ✅ Payment API Endpoint
**Files Created:**
- `src/routes/PaymentRoutes.js` - Payment routes
- `src/controllers/PaymentController.js` - Payment controller

**Endpoints:**
```
GET    /api/payment/get-all-payment          - Get all payments
GET    /api/payment/get-payment-by-id/:id    - Get payment by ID
POST   /api/payment/create-payment           - Create payment
PUT    /api/payment/update-payment/:id       - Update payment
DELETE /api/payment/delete-payment/:id       - Delete payment
```

**Note:** Payments are stored in the `FeeDetails` table but exposed via the Payment API for FE compatibility.

### 2. ✅ Household Endpoints Enhancement
**Updated:** `src/controllers/HouseholdController.js`

**Improvements:**
- Added relations with Residents
- Automatic field mapping (PascalCase ↔ camelCase)
- Returns formatted data with residents array
- All endpoints support both naming conventions

**Endpoints:**
```
GET    /api/households/get-all-households           - Get all households with residents
GET    /api/households/get-household-by-id/:id      - Get household details
POST   /api/households/create-household             - Create new household
PUT    /api/households/update-household/:id         - Update household
DELETE /api/households/delete-household/:id         - Delete household
```

### 3. ✅ Resident Endpoints Enhancement
**Updated:** `src/controllers/ResidentController.js`

**Improvements:**
- Added `mapResidentToFE()` function for automatic field mapping
- Supports both PascalCase (DB) and camelCase (FE) field names
- Proper error handling and status codes

**Field Mapping:**
```javascript
{
  // DB Format (PascalCase)          // FE Format (camelCase)
  ResidentID                      →  id
  FullName                        →  fullName
  DateOfBirth                     →  dob
  Sex                             →  gender
  PlaceOfBirth                    →  birthPlace
  Hometown                        →  origin
  Ethnicity                       →  ethnicity (default: 'Kinh')
  Occupation                      →  job
  IDCardNumber                    →  idCardNumber
  Relationship                    →  relationToHead
  RegistrationDate                →  registrationDate
  ResidencyStatus                 →  status
  HouseholdID                     →  householdId
}
```

**Endpoints:**
```
GET    /api/residents/get-all-residents        - Get all residents
GET    /api/residents/get-resident-by-id/:id   - Get resident details
POST   /api/residents/create-resident          - Create resident
PUT    /api/residents/update-resident/:id      - Update resident
DELETE /api/residents/delete-resident/:id      - Delete resident
```

### 4. ✅ Fee Collection Endpoints Enhancement
**Updated:** `src/controllers/FeeCollectionController.js`

**Model Updates:**
- Added `AmountPerMonth` field to FeeCollection model
- Supports per-person monthly fee calculations

**Field Mapping:**
```javascript
{
  // DB Format (PascalCase)          // FE Format (camelCase)
  CollectionID                    →  id
  CollectionName                  →  name
  StartDate                       →  startDate
  EndDate                         →  endDate
  TotalAmount                     →  amount
  AmountPerMonth                  →  amountPerMonthPerPerson
  Status                          →  status
  Notes                           →  description
}
```

**Endpoints:**
```
GET    /api/fee-collection/get-all-collection        - Get all fee campaigns
GET    /api/fee-collection/get-collection-by-id/:id  - Get fee campaign details
POST   /api/fee-collection/create-collection         - Create fee campaign
PUT    /api/fee-collection/update-collection/:id     - Update fee campaign
DELETE /api/fee-collection/delete-collection/:id     - Delete fee campaign
```

### 5. ✅ Statistics/Dashboard Endpoints
**Updated:** `src/controllers/StatisticsController.js`

**New Endpoint:**
```
GET /api/statistics/dashboard
```

**Response:**
```json
{
  "error": false,
  "stats": {
    "totalHouseholds": 10,
    "totalResidents": 45,
    "totalCollected": 5000000,
    "householdsPaid": 8
  }
}
```

## 📝 API Request/Response Examples

### Create Household
**Request:**
```bash
POST /api/households/create-household
Content-Type: application/json

{
  "householdNumber": "101",
  "headName": "Nguyễn Văn A",
  "street": "Đường La Khê",
  "ward": "La Khê",
  "district": "Hà Đông",
  "members": 4
}
```

**Response:**
```json
{
  "id": 1,
  "HouseholdID": 1,
  "householdNumber": "101",
  "HouseholdNumber": "101",
  "headName": "Nguyễn Văn A",
  "HouseholdHead": "Nguyễn Văn A",
  "address": "Đường La Khê, La Khê, Hà Đông",
  "members": [],
  "street": "Đường La Khê",
  "ward": "La Khê",
  "district": "Hà Đông"
}
```

### Create Resident
**Request:**
```bash
POST /api/residents/create-resident
Content-Type: application/json

{
  "householdId": 1,
  "fullName": "Nguyễn Văn B",
  "dob": "1995-05-15",
  "gender": "Nam",
  "birthPlace": "Hà Nội",
  "origin": "Hà Nội",
  "ethnicity": "Kinh",
  "job": "Kỹ sư",
  "idCardNumber": "123456789",
  "relationToHead": "Con"
}
```

**Response:**
```json
{
  "id": 1,
  "ResidentID": 1,
  "fullName": "Nguyễn Văn B",
  "FullName": "Nguyễn Văn B",
  "dob": "1995-05-15",
  "gender": "Nam",
  "Sex": "Nam",
  "birthPlace": "Hà Nội",
  "origin": "Hà Nội",
  "ethnicity": "Kinh",
  "job": "Kỹ sư",
  "idCardNumber": "123456789",
  "relationToHead": "Con",
  "registrationDate": "2024-01-12",
  "status": "Thường trú",
  "householdId": 1
}
```

### Create Payment
**Request:**
```bash
POST /api/payment/create-payment
Content-Type: application/json

{
  "householdId": 1,
  "campaignId": 1,
  "amount": 600000,
  "paymentDate": "2024-01-12",
  "collectorName": "Nguyễn Văn Cường"
}
```

**Response:**
```json
{
  "id": 1,
  "paymentId": 1,
  "householdId": 1,
  "campaignId": 1,
  "amount": 600000,
  "paymentDate": "2024-01-12",
  "paymentMethod": "Tiền mặt",
  "collectorName": "Nguyễn Văn Cường",
  "status": "Hoàn thành"
}
```

### Create Fee Campaign
**Request:**
```bash
POST /api/fee-collection/create-collection
Content-Type: application/json

{
  "name": "Thu phí vệ sinh 2024",
  "type": "Bắt buộc",
  "amountPerMonthPerPerson": 50000,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "description": "Thu phí vệ sinh chung cốc 12 tháng"
}
```

**Response:**
```json
{
  "id": 1,
  "CollectionID": 1,
  "name": "Thu phí vệ sinh 2024",
  "type": "Bắt buộc",
  "amountPerMonthPerPerson": 50000,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "description": "Thu phí vệ sinh chung cốc 12 tháng",
  "status": "Đang thu"
}
```

## 🔄 Field Name Convention

The API supports **both** naming conventions for flexibility:

| Feature | PascalCase (DB) | camelCase (FE) |
|---------|-----------------|----------------|
| Household | `HouseholdNumber`, `HouseholdHead` | `householdNumber`, `headName` |
| Resident | `FullName`, `DateOfBirth`, `Sex` | `fullName`, `dob`, `gender` |
| Fee | `CollectionName`, `StartDate` | `name`, `startDate` |
| Payment | `HouseholdID`, `CollectionID` | `householdId`, `campaignId` |

**Example:** Both of these work:
```javascript
// Option 1 - PascalCase
{ "HouseholdNumber": "101", "HouseholdHead": "Nguyễn Văn A" }

// Option 2 - camelCase
{ "householdNumber": "101", "headName": "Nguyễn Văn A" }
```

## 🗄️ Database Schema Updates

### New Fields Added:

1. **FeeCollection** - Added `AmountPerMonth` field:
   ```sql
   AmountPerMonth DECIMAL(15, 2) COMMENT 'Số tiền mỗi tháng'
   ```

2. **FeeDetail** - Added `CollectorName` field:
   ```sql
   CollectorName VARCHAR(100) COMMENT 'Tên người thu phí'
   ```

## ✅ Compatibility Check

### Frontend Endpoints Used:
- ✅ `GET /api/households/get-all-households`
- ✅ `POST /api/households/create-household`
- ✅ `PUT /api/households/update-household/:id`
- ✅ `DELETE /api/households/delete-household/:id`
- ✅ `GET /api/residents/get-all-residents`
- ✅ `POST /api/residents/create-resident`
- ✅ `PUT /api/residents/update-resident/:id`
- ✅ `DELETE /api/residents/delete-resident/:id`
- ✅ `GET /api/fee-collection/get-all-collection`
- ✅ `POST /api/fee-collection/create-collection`
- ✅ `GET /api/payment/get-all-payment`
- ✅ `POST /api/payment/create-payment`
- ✅ `GET /api/statistics/dashboard`

## 🚀 Running the Backend

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# Server runs on http://localhost:3000
# Swagger docs: http://localhost:3000/api-docs
```

## 🔗 Integration Notes

1. **CORS is enabled** - FE can make requests from any origin
2. **All responses** include proper HTTP status codes and error messages
3. **Database synchronization** - Ensure all new fields are migrated to your database
4. **Field mapping** - The controllers automatically handle both naming conventions

## 📖 Additional Resources

- Swagger Documentation: `http://localhost:3000/api-docs`
- Backend Index: `back-end/index.js`
- Controllers: `back-end/src/controllers/`
- Models: `back-end/src/models/`
- Routes: `back-end/src/routes/`

---

**Last Updated:** January 12, 2026
**Status:** ✅ Ready for FE Integration
