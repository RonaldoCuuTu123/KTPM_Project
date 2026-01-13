# Hệ thống Quản lý Tổ dân phố 7 - La Khê

Ứng dụng quản lý hộ khẩu, nhân khẩu và thu phí cho Tổ dân phố 7, Phường La Khê, Quận Hà Đông, Hà Nội.

## 📋 Tổng quan

Hệ thống được xây dựng để hỗ trợ công tác quản lý dân cư tại Tổ dân phố, bao gồm:
- Quản lý hộ khẩu và nhân khẩu
- Quản lý thu phí và đóng góp
- Theo dõi lịch sử biến động dân cư
- Thống kê và báo cáo

## ✨ Tính năng chính

### 1. Quản lý Hộ khẩu
- Đăng ký, cập nhật, xóa thông tin hộ khẩu
- Theo dõi lịch sử biến động của từng hộ
- Tìm kiếm và lọc hộ khẩu theo nhiều tiêu chí

### 2. Quản lý Nhân khẩu
- Quản lý thông tin chi tiết của từng nhân khẩu
- Theo dõi trạng thái: Thường trú, Tạm vắng, Tạm trú, Đã chuyển đi, Đã qua đời
- Cập nhật thông tin CMND/CCCD

### 3. Thu phí & Đóng góp
- Tạo và quản lý các đợt thu phí (bắt buộc/tự nguyện)
- Ghi nhận thanh toán theo hộ
- Tính toán tự động số tiền phải đóng (đối với phí bắt buộc)

### 4. Thống kê & Báo cáo
- Biểu đồ phân bổ dân số theo độ tuổi
- Thống kê tình hình thu phí
- Báo cáo tổng hợp theo nhiều tiêu chí

### 5. Phân quyền người dùng
- **Tổ trưởng/Tổ phó (ADMIN)**: Toàn quyền quản lý
- **Kế toán (ACCOUNTANT)**: Quản lý thu phí, xem thống kê
- **Cán bộ (STAFF)**: Quản lý hộ khẩu, nhân khẩu

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 19** - Thư viện UI
- **TypeScript** - Ngôn ngữ lập trình
- **React Router DOM** - Điều hướng
- **Tailwind CSS** - Styling
- **Recharts** - Biểu đồ thống kê
- **Lucide React** - Icons
- **Vite** - Build tool

### Backend
- **SQLite3** - Database (lưu trữ local)
- **Node.js** - Runtime môi trường

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js >= 18.0.0
- npm >= 8.0.0

### Các bước cài đặt

1. **Clone repository**
```bash
git clone <repository-url>
cd tdp7-la-khe
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Cấu hình môi trường** (tùy chọn)
```bash
cp .env.local.example .env.local
# Chỉnh sửa file .env.local nếu cần
```

4. **Chạy ứng dụng**
```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:3000`

## 🚀 Sử dụng

### Tài khoản mặc định

| Tên đăng nhập | Mật khẩu | Vai trò |
|---------------|----------|---------|
| admin | 123 | Tổ trưởng/Tổ phó |
| ketoan | 123 | Kế toán |
| canbo | 123 | Cán bộ |

### Truy cập từ thiết bị khác trong cùng mạng LAN

1. Tìm địa chỉ IP của máy chủ:
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig` hoặc `ip addr`

2. Trên thiết bị khác, truy cập:
   ```
   http://<địa-chỉ-ip>:3000
   ```

3. Ví dụ: `http://192.168.1.100:3000`

## 📂 Cấu trúc thư mục

```
tdp7-la-khe/
├── components/          # Các React components
│   ├── Auth.tsx        # Đăng nhập
│   ├── Dashboard.tsx   # Trang chủ
│   ├── HouseholdManager.tsx
│   ├── ResidentManager.tsx
│   ├── FeeManager.tsx
│   └── Statistics.tsx
├── types.ts            # TypeScript types/interfaces
├── constants.ts        # Dữ liệu mẫu
├── App.tsx            # Component chính
├── index.tsx          # Entry point
└── tdp7.db            # SQLite database (tự động tạo)
```

## 🔧 Scripts

```bash
# Chạy development server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

## 💾 Database

Ứng dụng sử dụng SQLite để lưu trữ dữ liệu local. Database được tự động tạo tại `tdp7.db` khi chạy lần đầu.

### Backup dữ liệu
Để sao lưu dữ liệu, chỉ cần copy file `tdp7.db`

### Reset dữ liệu
Xóa file `tdp7.db` để reset về dữ liệu mặc định

## 🌐 Chế độ Online/Offline

- **Online Mode**: Kết nối với backend API server (port 5000)
- **Offline Mode**: Sử dụng dữ liệu local khi không kết nối được server

Ứng dụng tự động phát hiện và chuyển đổi giữa 2 chế độ.

## 🔐 Bảo mật

- Mật khẩu được lưu trữ dưới dạng plain text (chỉ phù hợp cho môi trường nội bộ)
- Không sử dụng cho môi trường production công cộng
- Cần cải thiện: Hash password, HTTPS, JWT authentication

## 🐛 Troubleshooting

### Lỗi cài đặt sqlite3
```bash
npm install --build-from-source
# hoặc
npm install sqlite3 --save --build-from-source
```

### Port 3000 đã được sử dụng
Chỉnh sửa trong `vite.config.ts`:
```typescript
server: {
  port: 3001, // Đổi sang port khác
}
```

## 📝 Ghi chú phát triển

- Dữ liệu mẫu được định nghĩa trong `constants.ts`
- Routing sử dụng React Router v7
- UI components không dùng thư viện bên thứ 3, tự code với Tailwind CSS

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng:
1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết

## 👥 Tác giả

Hệ thống Quản lý Tổ dân phố 7 - La Khê

## 📞 Liên hệ

Nếu có thắc mắc hoặc cần hỗ trợ, vui lòng liên hệ qua:
- Email: [email liên hệ]
- Phone: [số điện thoại]

---

**Lưu ý**: Đây là phiên bản dành cho sử dụng nội bộ, không nên deploy lên môi trường production công cộng mà không có các biện pháp bảo mật phù hợp.