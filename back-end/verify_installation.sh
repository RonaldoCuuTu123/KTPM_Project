#!/bin/bash

# Verification Script for KTPM Backend Implementation
# This script checks if all required changes have been made

echo "========================================"
echo "KTPM Backend Verification Script"
echo "========================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for checks
PASSED=0
FAILED=0

# Helper function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} Found: $1"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} Missing: $1"
        ((FAILED++))
        return 1
    fi
}

# Helper function to check if content exists in file
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} Found '$2' in $1"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} Missing '$2' in $1"
        ((FAILED++))
        return 1
    fi
}

echo -e "${YELLOW}Checking File Structure...${NC}"
echo ""

# Check new files
check_file "src/routes/PaymentRoutes.js"
check_file "src/controllers/PaymentController.js"
check_file "API_INTEGRATION_GUIDE.md"
check_file "IMPLEMENTATION_SUMMARY.md"
check_file "QUICK_REFERENCE.md"
check_file "test_api.sh"
check_file "database/migration_01_add_payment_fields.sql"

echo ""
echo -e "${YELLOW}Checking Modified Files...${NC}"
echo ""

# Check modified files
check_file "index.js"
check_file "src/controllers/HouseholdController.js"
check_file "src/controllers/ResidentController.js"
check_file "src/controllers/FeeCollectionController.js"
check_file "src/controllers/StatisticsController.js"
check_file "src/models/FeeCollection.js"
check_file "src/models/FeeDetail.js"

echo ""
echo -e "${YELLOW}Checking Code Changes...${NC}"
echo ""

# Check if Payment routes imported in index.js
check_content "index.js" "import PaymentRoutes"

# Check if Payment routes registered
check_content "index.js" 'app.use("/api/payment", PaymentRoutes)'

# Check household mapping
check_content "src/controllers/HouseholdController.js" "include.*Resident"

# Check resident mapping function
check_content "src/controllers/ResidentController.js" "mapResidentToFE"

# Check fee collection mapping function
check_content "src/controllers/FeeCollectionController.js" "mapFeeCollectionToFE"

# Check dashboard stats
check_content "src/controllers/StatisticsController.js" "getDashboardStats"

# Check dashboard route
check_content "src/routes/StatisticsRoutes.js" "/dashboard"

# Check AmountPerMonth in model
check_content "src/models/FeeCollection.js" "AmountPerMonth"

# Check CollectorName in model
check_content "src/models/FeeDetail.js" "CollectorName"

echo ""
echo "========================================"
echo -e "${GREEN}Passed:${NC} $PASSED"
echo -e "${RED}Failed:${NC} $FAILED"
echo "========================================"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Backend is ready.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Run database migration:"
    echo "   mysql -u root -p admin < database/migration_01_add_payment_fields.sql"
    echo ""
    echo "2. Start backend server:"
    echo "   npm run dev"
    echo ""
    echo "3. Test endpoints:"
    echo "   bash test_api.sh"
    echo ""
    echo "4. View API docs:"
    echo "   http://localhost:3000/api-docs"
    exit 0
else
    echo -e "${RED}❌ Some checks failed. Please review the errors above.${NC}"
    exit 1
fi
