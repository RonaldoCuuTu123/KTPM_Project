#!/bin/bash

# KTPM Backend API Testing Script
# This script tests all the key endpoints to verify FE integration

BASE_URL="http://localhost:3000/api"

echo "========================================"
echo "KTPM Backend API Testing"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Get all households
echo -e "${YELLOW}Test 1: Get all households${NC}"
curl -X GET "$BASE_URL/households/get-all-households" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 2: Create a household
echo -e "${YELLOW}Test 2: Create a household${NC}"
HOUSEHOLD_RESPONSE=$(curl -s -X POST "$BASE_URL/households/create-household" \
  -H "Content-Type: application/json" \
  -d '{
    "householdNumber": "101",
    "headName": "Nguyễn Văn A",
    "street": "Đường La Khê",
    "ward": "La Khê",
    "district": "Hà Đông",
    "members": 4
  }')
echo "$HOUSEHOLD_RESPONSE" | jq .

# Extract household ID (assuming response is JSON)
HOUSEHOLD_ID=$(echo "$HOUSEHOLD_RESPONSE" | jq '.id // .HouseholdID' 2>/dev/null || echo "1")
echo "Created Household ID: $HOUSEHOLD_ID"
echo ""

# Test 3: Get all residents
echo -e "${YELLOW}Test 3: Get all residents${NC}"
curl -X GET "$BASE_URL/residents/get-all-residents" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 4: Create a resident
echo -e "${YELLOW}Test 4: Create a resident${NC}"
RESIDENT_RESPONSE=$(curl -s -X POST "$BASE_URL/residents/create-resident" \
  -H "Content-Type: application/json" \
  -d "{
    \"householdId\": $HOUSEHOLD_ID,
    \"fullName\": \"Nguyễn Văn B\",
    \"dob\": \"1995-05-15\",
    \"gender\": \"Nam\",
    \"birthPlace\": \"Hà Nội\",
    \"origin\": \"Hà Nội\",
    \"ethnicity\": \"Kinh\",
    \"job\": \"Kỹ sư\",
    \"idCardNumber\": \"123456789\",
    \"relationToHead\": \"Con\"
  }")
echo "$RESIDENT_RESPONSE" | jq .
echo ""

# Test 5: Get all fee collections
echo -e "${YELLOW}Test 5: Get all fee collections${NC}"
curl -X GET "$BASE_URL/fee-collection/get-all-collection" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 6: Create a fee collection
echo -e "${YELLOW}Test 6: Create a fee collection${NC}"
FEE_RESPONSE=$(curl -s -X POST "$BASE_URL/fee-collection/create-collection" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Thu phí vệ sinh 2024",
    "type": "Bắt buộc",
    "amountPerMonthPerPerson": 50000,
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "description": "Thu phí vệ sinh chung cốc 12 tháng"
  }')
echo "$FEE_RESPONSE" | jq .

FEE_ID=$(echo "$FEE_RESPONSE" | jq '.id // .CollectionID' 2>/dev/null || echo "1")
echo "Created Fee Collection ID: $FEE_ID"
echo ""

# Test 7: Get all payments
echo -e "${YELLOW}Test 7: Get all payments${NC}"
curl -X GET "$BASE_URL/payment/get-all-payment" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 8: Create a payment
echo -e "${YELLOW}Test 8: Create a payment${NC}"
curl -s -X POST "$BASE_URL/payment/create-payment" \
  -H "Content-Type: application/json" \
  -d "{
    \"householdId\": $HOUSEHOLD_ID,
    \"campaignId\": $FEE_ID,
    \"amount\": 600000,
    \"paymentDate\": \"2024-01-12\",
    \"collectorName\": \"Nguyễn Văn Cường\"
  }" | jq .
echo ""

# Test 9: Get dashboard statistics
echo -e "${YELLOW}Test 9: Get dashboard statistics${NC}"
curl -s -X GET "$BASE_URL/statistics/dashboard" \
  -H "Content-Type: application/json" | jq .
echo ""

# Test 10: Update household
echo -e "${YELLOW}Test 10: Update household${NC}"
curl -s -X PUT "$BASE_URL/households/update-household/$HOUSEHOLD_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "members": 5,
    "hasVehicle": true
  }' | jq .
echo ""

echo -e "${YELLOW}Test 11: Update resident${NC}"
# First get a resident ID (assuming it's 1)
RESIDENT_ID=1
curl -s -X PUT "$BASE_URL/residents/update-resident/$RESIDENT_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "job": "Phó Giáo sư",
    "phoneNumber": "0912345678"
  }' | jq .
echo ""

# Test 12: Delete a resident (optional - comment out if you want to keep test data)
# echo -e "${YELLOW}Test 12: Delete resident${NC}"
# curl -X DELETE "$BASE_URL/residents/delete-resident/$RESIDENT_ID" \
#   -H "Content-Type: application/json" \
#   -w "\nStatus: %{http_code}\n\n"

echo -e "${GREEN}========================================"
echo "Testing Complete!"
echo "========================================${NC}"
echo ""
echo -e "${YELLOW}Notes:${NC}"
echo "- Ensure backend is running on http://localhost:3000"
echo "- IDs in responses may differ based on your database state"
echo "- Check Swagger docs at http://localhost:3000/api-docs"
