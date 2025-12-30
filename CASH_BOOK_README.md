# Hướng dẫn sử dụng giao diện Quản lý Thu Chi (Cash Book)

## Cấu trúc Component

Giao diện được tạo với các component chính:

1. **CashBook.jsx** - Component chính quản lý state và layout
2. **Sidebar.jsx** - Sidebar bên trái chứa các bộ lọc
3. **TransactionTable.jsx** - Bảng hiển thị danh sách giao dịch
4. **SummaryStats.jsx** - Thống kê tổng hợp (Tổng thu, Tổng chi, Tồn quỹ)
5. **TransactionForm.jsx** - Form modal để tạo/sửa giao dịch

## Cài đặt và Chạy

1. Cài đặt dependencies (nếu chưa có):
```bash
cd front-end
npm install
```

2. Cấu hình API Base URL:
   - Mở file `src/services/cashTransactionService.js`
   - Thay đổi `API_BASE_URL` theo địa chỉ backend của bạn:
   ```javascript
   const API_BASE_URL = 'http://localhost:3000/api';
   ```

3. Chạy ứng dụng:
```bash
npm run dev
```

## Tính năng

### 1. Sidebar Filters

- **Tab TIỀN MẶT / NGÂN HÀNG**: Chuyển đổi giữa hai phương thức thanh toán
- **Tìm kiếm**: Tìm kiếm theo mã phiếu, loại thu chi, người nộp/nhận
- **Lọc theo chi nhánh**: Lọc theo chi nhánh (cần load từ API)
- **Loại thu chi**: Lọc theo loại thu chi (cần load từ API)
- **Loại chứng từ**: Radio buttons để chọn Phiếu thu, Phiếu chi, hoặc Tất cả
- **Kết quả Kinh Doanh**: Radio buttons để chọn Đưa vào hạch toán, Không hạch toán, hoặc Tất cả
- **Lọc thời gian**: Chọn khoảng thời gian (Toàn thời gian, Hôm nay, Tuần này, Tháng này, Năm nay, hoặc Custom range)

### 2. Main Content Area

- **Header**: Tiêu đề "Sổ quỹ tiền mặt" và 2 nút tạo phiếu thu/chi
- **Summary Statistics**: 
  - Tổng thu (màu đỏ)
  - Tổng chi (màu xanh)
  - Tồn quỹ (màu xanh lá)
- **Transaction Table**: Bảng hiển thị danh sách giao dịch với các cột:
  - Mã phiếu
  - Thời gian
  - Loại thu chi
  - Tài khoản
  - Người nộp/nhận
  - Giá trị (màu xanh lá cho thu, màu đỏ cho chi)
  - Thao tác (Sửa, Xóa)

### 3. Form Tạo/Sửa Giao dịch

Modal form cho phép:
- Tạo phiếu thu/chi mới
- Sửa thông tin giao dịch
- Các trường:
  - Loại chứng từ (required)
  - Loại thu chi
  - Tài khoản
  - Người nộp/nhận
  - Số tiền (required)
  - Phương thức thanh toán
  - Thời gian giao dịch
  - Đưa vào hạch toán (checkbox)
  - Ghi chú

## API Integration

Component sử dụng service `cashTransactionService.js` để gọi các API:

- `GET /api/cash-transactions` - Lấy danh sách giao dịch
- `GET /api/cash-transactions/summary` - Lấy thống kê
- `GET /api/cash-transactions/:id` - Lấy chi tiết giao dịch
- `POST /api/cash-transactions` - Tạo giao dịch mới
- `PUT /api/cash-transactions/:id` - Cập nhật giao dịch
- `DELETE /api/cash-transactions/:id` - Xóa giao dịch

## Styling

Giao diện sử dụng CSS modules với:
- Màu chủ đạo: Xanh (#2196f3) cho buttons và interactive elements
- Background: Trắng
- Layout: Sidebar (280px) + Main content (flex: 1)
- Responsive design cơ bản

## Lưu ý

1. Backend API cần được implement theo specification trong `PROMPT_SO_QUY_TIEN_MAT.md`
2. Các filter như chi nhánh và loại thu chi cần load options từ API (hiện tại đang để trống)
3. Format tiền tệ sử dụng `Intl.NumberFormat('vi-VN')` để hiển thị số tiền theo định dạng Việt Nam
4. Format datetime sử dụng `toLocaleString('vi-VN')` để hiển thị ngày giờ theo định dạng Việt Nam

