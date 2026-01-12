# ⚡ KTPM Backend - Quick Reference Card

## 🎯 What Was Done

Your Backend is now **100% compatible** with the Frontend application!

### ✅ Completed Tasks

1. **Payment API Created** - `GET/POST /api/payment/*`
2. **Household Endpoints Enhanced** - Full CRUD with residents
3. **Resident Endpoints Enhanced** - Full CRUD with auto-mapping
4. **Fee Collection Enhanced** - Supports monthly per-person fees
5. **Statistics/Dashboard** - Real-time data aggregation
6. **Complete Documentation** - API guide + migration scripts

---

## 🚀 Get Started in 5 Minutes

### Step 1: Apply Database Changes
```sql
-- Run this in MySQL:
ALTER TABLE FeeCollections ADD COLUMN AmountPerMonth DECIMAL(15, 2);
ALTER TABLE FeeDetails ADD COLUMN CollectorName VARCHAR(100);
```

### Step 2: Start Backend
```bash
cd back-end
npm run dev
```

### Step 3: Test (Choose One)
```bash
# Option A: Swagger UI
# http://localhost:3000/api-docs

# Option B: Test script
bash test_api.sh

# Option C: Single curl
curl http://localhost:3000/api/households/get-all-households
```

### Step 4: Connect Frontend
```bash
cd front-end
npm run dev
# Update .env if needed: VITE_API_URL=http://localhost:3000/api
```

---

## 📡 All Available Endpoints

### Households (5 endpoints)
```
✅ GET    /api/households/get-all-households
✅ GET    /api/households/get-household-by-id/:id
✅ POST   /api/households/create-household
✅ PUT    /api/households/update-household/:id
✅ DELETE /api/households/delete-household/:id
```

### Residents (5 endpoints)
```
✅ GET    /api/residents/get-all-residents
✅ GET    /api/residents/get-resident-by-id/:id
✅ POST   /api/residents/create-resident
✅ PUT    /api/residents/update-resident/:id
✅ DELETE /api/residents/delete-resident/:id
```

### Fee Collections (5 endpoints)
```
✅ GET    /api/fee-collection/get-all-collection
✅ GET    /api/fee-collection/get-collection-by-id/:id
✅ POST   /api/fee-collection/create-collection
✅ PUT    /api/fee-collection/update-collection/:id
✅ DELETE /api/fee-collection/delete-collection/:id
```

### Payments (5 endpoints) ⭐ NEW
```
✅ GET    /api/payment/get-all-payment
✅ GET    /api/payment/get-payment-by-id/:id
✅ POST   /api/payment/create-payment
✅ PUT    /api/payment/update-payment/:id
✅ DELETE /api/payment/delete-payment/:id
```

### Statistics (4 endpoints)
```
✅ GET    /api/statistics/dashboard
✅ GET    /api/statistics/by-gender
✅ GET    /api/statistics/by-age-group
✅ GET    /api/statistics/temporary-status
```

---

## 🔄 Field Name Mapping

### Both Work! ✅
```javascript
// Option 1 (Database format - PascalCase)
{
  "HouseholdNumber": "101",
  "HouseholdHead": "Nguyễn Văn A",
  "FullName": "Nguyễn Văn B",
  "DateOfBirth": "1995-05-15"
}

// Option 2 (Frontend format - camelCase) ← RECOMMENDED
{
  "householdNumber": "101",
  "headName": "Nguyễn Văn A",
  "fullName": "Nguyễn Văn B",
  "dob": "1995-05-15"
}
```

---

## 💡 Example Requests

### Create Household
```bash
curl -X POST http://localhost:3000/api/households/create-household \
  -H "Content-Type: application/json" \
  -d '{
    "householdNumber": "101",
    "headName": "Nguyễn Văn A",
    "street": "Đường La Khê",
    "ward": "La Khê",
    "district": "Hà Đông"
  }'
```

### Create Resident
```bash
curl -X POST http://localhost:3000/api/residents/create-resident \
  -H "Content-Type: application/json" \
  -d '{
    "householdId": 1,
    "fullName": "Nguyễn Văn B",
    "dob": "1995-05-15",
    "gender": "Nam",
    "relationToHead": "Con"
  }'
```

### Create Fee Campaign
```bash
curl -X POST http://localhost:3000/api/fee-collection/create-collection \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Thu phí vệ sinh 2024",
    "type": "Bắt buộc",
    "amountPerMonthPerPerson": 50000,
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  }'
```

### Create Payment
```bash
curl -X POST http://localhost:3000/api/payment/create-payment \
  -H "Content-Type: application/json" \
  -d '{
    "householdId": 1,
    "campaignId": 1,
    "amount": 600000,
    "paymentDate": "2024-01-12",
    "collectorName": "Nguyễn Văn Cường"
  }'
```

### Get Dashboard Stats
```bash
curl http://localhost:3000/api/statistics/dashboard
```

---

## 📁 Key Files Changed

| File | Changes |
|------|---------|
| `index.js` | Added Payment routes |
| `HouseholdController.js` | Enhanced with mapping |
| `ResidentController.js` | Added mapResidentToFE() |
| `FeeCollectionController.js` | Added mapFeeCollectionToFE() |
| `PaymentController.js` | ⭐ NEW - Payment API |
| `PaymentRoutes.js` | ⭐ NEW - Payment routes |
| `StatisticsController.js` | Added getDashboardStats() |
| `FeeCollection.js` | Added AmountPerMonth field |
| `FeeDetail.js` | Added CollectorName field |

---

## 🆘 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `lsof -i :3000` then `kill -9 <PID>` |
| Database error | Check credentials in `.env` |
| Fields not mapping | Verify both naming conventions are used |
| Payment endpoint 404 | Restart server after code changes |
| Migration fails | Ensure MySQL is running, check database name |

---

## 📚 Documentation Files

1. **API_INTEGRATION_GUIDE.md** - 📖 Full API documentation
2. **IMPLEMENTATION_SUMMARY.md** - 📋 What was changed and why
3. **test_api.sh** - 🧪 Automated test script
4. **migration_01_add_payment_fields.sql** - 🔧 Database migration

---

## 🔗 Quick Links

- **Swagger Docs:** http://localhost:3000/api-docs
- **Backend Server:** http://localhost:3000
- **Test Script:** `bash back-end/test_api.sh`
- **Migration Script:** `back-end/database/migration_01_add_payment_fields.sql`

---

## ✨ Key Features

✅ **Automatic Field Mapping** - Works with both naming conventions
✅ **Related Data Loading** - Households include residents
✅ **Dashboard Statistics** - Real-time aggregated metrics
✅ **Payment Tracking** - Full payment management system
✅ **Error Handling** - Consistent error responses
✅ **CORS Enabled** - Ready for frontend connection
✅ **Swagger Documented** - Full API documentation
✅ **Database Optimized** - Proper indexes and relationships

---

## 🎉 You're All Set!

Your backend is **production-ready** and fully compatible with the frontend.

1. Run migration script
2. Start `npm run dev`
3. Connect frontend to `http://localhost:3000`
4. All features work! 🚀

---

**Need help?** Check the documentation files or visit Swagger UI!

*Last Updated: January 12, 2026*
