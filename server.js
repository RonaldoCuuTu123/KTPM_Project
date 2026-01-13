
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
// Trong môi trường hosting, port sẽ do hệ thống cấp, mặc định là 5000 cho dev
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'db.json');

// Middleware
app.use(cors()); // Cho phép mọi nguồn truy cập (CORS)
app.use(bodyParser.json());

// Helper: Đọc/Ghi "Database" file JSON
const readDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    return { households: [], fees: [], payments: [], users: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) {
    return { households: [], fees: [], payments: [], users: [] };
  }
};

const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
};

// --- API ENDPOINTS ---

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.username === username && u.password === password);
  
  if (user) {
    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } else {
    res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' });
  }
});

app.get('/api/households', (req, res) => {
  const db = readDB();
  res.json(db.households || []);
});

app.post('/api/households', (req, res) => {
  const db = readDB();
  const newHousehold = { ...req.body, id: `HH${Date.now()}` };
  if (!db.households) db.households = [];
  db.households.push(newHousehold);
  writeDB(db);
  res.status(201).json(newHousehold);
});

app.get('/api/fees', (req, res) => {
  const db = readDB();
  res.json(db.fees || []);
});

app.get('/api/payments', (req, res) => {
  const db = readDB();
  res.json(db.payments || []);
});

app.post('/api/payments', (req, res) => {
  const db = readDB();
  const newPayment = { ...req.body, id: `P${Date.now()}` };
  if (!db.payments) db.payments = [];
  db.payments.push(newPayment);
  writeDB(db);
  res.status(201).json(newPayment);
});

// Khởi tạo dữ liệu mẫu nếu file trống
const initDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    writeDB({
      users: [
        { id: 'U1', username: 'admin', fullName: 'Nguyễn Văn Cường', role: 'ADMIN', password: '123' },
        { id: 'U2', username: 'ketoan', fullName: 'Lê Thị Mai', role: 'ACCOUNTANT', password: '123' }
      ],
      households: [],
      fees: [
        { id: 'F1', name: 'Phí vệ sinh 2024', type: 'Bắt buộc', amountPerMonthPerPerson: 6000, startDate: '2024-01-01', description: 'Thu hàng năm' }
      ],
      payments: []
    });
  }
};

// Quan trọng: Lắng nghe trên '0.0.0.0' thay vì mặc định 'localhost' để chấp nhận kết nối từ mạng ngoài
app.listen(PORT, '0.0.0.0', () => {
  initDB();
  console.log(`-------------------------------------------`);
  console.log(`Back-end TDP7 đang chạy!`);
  console.log(`Cổng: ${PORT}`);
  console.log(`Truy cập nội bộ: http://localhost:${PORT}`);
  console.log(`-------------------------------------------`);
});
