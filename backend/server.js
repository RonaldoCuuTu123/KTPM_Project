const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const db = new Database('tdp7.db');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Tạo các bảng
const initDB = () => {
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      fullName TEXT NOT NULL,
      role TEXT NOT NULL,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS households (
      id TEXT PRIMARY KEY,
      householdNumber TEXT UNIQUE NOT NULL,
      headName TEXT NOT NULL,
      address TEXT NOT NULL,
      street TEXT NOT NULL,
      ward TEXT NOT NULL,
      district TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS residents (
      id TEXT PRIMARY KEY,
      fullName TEXT NOT NULL,
      alias TEXT,
      dob TEXT NOT NULL,
      gender TEXT NOT NULL,
      birthPlace TEXT NOT NULL,
      origin TEXT NOT NULL,
      ethnicity TEXT NOT NULL,
      job TEXT,
      workPlace TEXT,
      idCardNumber TEXT,
      idCardDate TEXT,
      idCardPlace TEXT,
      registrationDate TEXT NOT NULL,
      previousAddress TEXT,
      relationToHead TEXT NOT NULL,
      status TEXT NOT NULL,
      notes TEXT,
      moveDate TEXT,
      moveDestination TEXT,
      householdId TEXT NOT NULL,
      FOREIGN KEY (householdId) REFERENCES households(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS household_history (
      id TEXT PRIMARY KEY,
      householdId TEXT NOT NULL,
      date TEXT NOT NULL,
      content TEXT NOT NULL,
      FOREIGN KEY (householdId) REFERENCES households(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS fees (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      amountPerMonthPerPerson INTEGER,
      startDate TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      householdId TEXT NOT NULL,
      campaignId TEXT NOT NULL,
      amount REAL NOT NULL,
      paymentDate TEXT NOT NULL,
      collectorName TEXT NOT NULL,
      FOREIGN KEY (householdId) REFERENCES households(id) ON DELETE CASCADE,
      FOREIGN KEY (campaignId) REFERENCES fees(id) ON DELETE CASCADE
    );
  `);

    // Thêm dữ liệu mẫu nếu chưa có
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
    if (userCount.count === 0) {
        const insertUser = db.prepare('INSERT INTO users VALUES (?, ?, ?, ?, ?)');
        insertUser.run('U1', 'admin', 'Nguyễn Văn Cường', 'ADMIN', '123');
        insertUser.run('U2', 'ketoan', 'Lê Thị Mai', 'ACCOUNTANT', '123');
        insertUser.run('U3', 'canbo', 'Trần Văn Hùng', 'STAFF', '123');

        // Thêm phí mẫu
        const insertFee = db.prepare('INSERT INTO fees VALUES (?, ?, ?, ?, ?, ?)');
        insertFee.run('F1', 'Phí vệ sinh 2024', 'Bắt buộc', 6000, '2024-01-01', 'Thu hàng năm cho công tác vệ sinh');
        insertFee.run('F2', 'Quỹ Vì người nghèo', 'Đóng góp', null, '2024-05-19', 'Ủng hộ người nghèo');

        // Thêm hộ khẩu mẫu
        const insertHousehold = db.prepare('INSERT INTO households VALUES (?, ?, ?, ?, ?, ?, ?)');
        insertHousehold.run('HH001', 'HK-2024-001', 'Nguyễn Văn An', 'Số 12A', 'Lê Trọng Tấn', 'La Khê', 'Hà Đông');
        insertHousehold.run('HH002', 'HK-2024-002', 'Phạm Minh Đức', 'Số 45', 'Phan Đình Giót', 'La Khê', 'Hà Đông');

        // Thêm nhân khẩu mẫu
        const insertResident = db.prepare(`
      INSERT INTO residents (id, fullName, dob, gender, birthPlace, origin, ethnicity, job, idCardNumber, registrationDate, relationToHead, status, householdId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        insertResident.run('R1', 'Nguyễn Văn An', '1975-05-15', 'Nam', 'Hà Nội', 'Nam Định', 'Kinh', 'Kỹ sư', '001075001234', '2024-01-10', 'Chủ hộ', 'Thường trú', 'HH001');
        insertResident.run('R2', 'Trần Thị Bình', '1978-08-20', 'Nữ', 'Thái Bình', 'Thái Bình', 'Kinh', 'Giáo viên', '001078005678', '2024-01-10', 'Vợ', 'Thường trú', 'HH001');

        console.log('✓ Đã khởi tạo dữ liệu mẫu');
    }
};

// === AUTH ENDPOINTS ===
app.post('/api/auth/login', (req, res) => {
    try {
        const { username, password } = req.body;
        const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);

        if (user) {
            const { password, ...userWithoutPassword } = user;
            res.json({ success: true, user: userWithoutPassword });
        } else {
            res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// === HOUSEHOLDS ENDPOINTS ===
app.get('/api/households', (req, res) => {
    try {
        const households = db.prepare('SELECT * FROM households').all();
        const result = households.map(hh => {
            const members = db.prepare('SELECT * FROM residents WHERE householdId = ?').all(hh.id);
            const history = db.prepare('SELECT * FROM household_history WHERE householdId = ? ORDER BY date DESC').all(hh.id);
            return { ...hh, members, history };
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/households', (req, res) => {
    try {
        const { householdNumber, headName, address, street, ward, district, members, history } = req.body;
        const id = `HH${Date.now()}`;

        const insert = db.prepare('INSERT INTO households VALUES (?, ?, ?, ?, ?, ?, ?)');
        insert.run(id, householdNumber, headName, address, street, ward, district);

        if (members && members.length > 0) {
            const insertMember = db.prepare(`
        INSERT INTO residents (id, fullName, alias, dob, gender, birthPlace, origin, ethnicity, job, workPlace, 
          idCardNumber, idCardDate, idCardPlace, registrationDate, previousAddress, relationToHead, status, notes, 
          moveDate, moveDestination, householdId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

            members.forEach(m => {
                const memberId = m.id || `R${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                insertMember.run(
                    memberId, m.fullName, m.alias, m.dob, m.gender, m.birthPlace, m.origin, m.ethnicity,
                    m.job, m.workPlace, m.idCardNumber, m.idCardDate, m.idCardPlace, m.registrationDate,
                    m.previousAddress, m.relationToHead, m.status, m.notes, m.moveDate, m.moveDestination, id
                );
            });
        }

        const newHousehold = db.prepare('SELECT * FROM households WHERE id = ?').get(id);
        const hhMembers = db.prepare('SELECT * FROM residents WHERE householdId = ?').all(id);
        const hhHistory = db.prepare('SELECT * FROM household_history WHERE householdId = ?').all(id);

        res.status(201).json({ ...newHousehold, members: hhMembers, history: hhHistory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/households/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { householdNumber, headName, address, street, ward, district, members } = req.body;

        const update = db.prepare(`
      UPDATE households 
      SET householdNumber = ?, headName = ?, address = ?, street = ?, ward = ?, district = ?
      WHERE id = ?
    `);
        update.run(householdNumber, headName, address, street, ward, district, id);

        // Xóa và thêm lại members
        db.prepare('DELETE FROM residents WHERE householdId = ?').run(id);

        if (members && members.length > 0) {
            const insertMember = db.prepare(`
        INSERT INTO residents (id, fullName, alias, dob, gender, birthPlace, origin, ethnicity, job, workPlace,
          idCardNumber, idCardDate, idCardPlace, registrationDate, previousAddress, relationToHead, status, notes,
          moveDate, moveDestination, householdId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

            members.forEach(m => {
                insertMember.run(
                    m.id, m.fullName, m.alias, m.dob, m.gender, m.birthPlace, m.origin, m.ethnicity,
                    m.job, m.workPlace, m.idCardNumber, m.idCardDate, m.idCardPlace, m.registrationDate,
                    m.previousAddress, m.relationToHead, m.status, m.notes, m.moveDate, m.moveDestination, id
                );
            });
        }

        const updated = db.prepare('SELECT * FROM households WHERE id = ?').get(id);
        const hhMembers = db.prepare('SELECT * FROM residents WHERE householdId = ?').all(id);
        const hhHistory = db.prepare('SELECT * FROM household_history WHERE householdId = ?').all(id);

        res.json({ ...updated, members: hhMembers, history: hhHistory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/households/:id', (req, res) => {
    try {
        const { id } = req.params;
        db.prepare('DELETE FROM households WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// === FEES ENDPOINTS ===
app.get('/api/fees', (req, res) => {
    try {
        const fees = db.prepare('SELECT * FROM fees ORDER BY startDate DESC').all();
        res.json(fees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/fees', (req, res) => {
    try {
        const { name, type, amountPerMonthPerPerson, startDate, description } = req.body;
        const id = `F${Date.now()}`;

        const insert = db.prepare('INSERT INTO fees VALUES (?, ?, ?, ?, ?, ?)');
        insert.run(id, name, type, amountPerMonthPerPerson, startDate, description);

        const newFee = db.prepare('SELECT * FROM fees WHERE id = ?').get(id);
        res.status(201).json(newFee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/fees/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, amountPerMonthPerPerson, startDate, description } = req.body;

        const update = db.prepare(`
      UPDATE fees 
      SET name = ?, type = ?, amountPerMonthPerPerson = ?, startDate = ?, description = ?
      WHERE id = ?
    `);
        update.run(name, type, amountPerMonthPerPerson, startDate, description, id);

        const updated = db.prepare('SELECT * FROM fees WHERE id = ?').get(id);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// === PAYMENTS ENDPOINTS ===
app.get('/api/payments', (req, res) => {
    try {
        const payments = db.prepare('SELECT * FROM payments ORDER BY paymentDate DESC').all();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/payments', (req, res) => {
    try {
        const { householdId, campaignId, amount, paymentDate, collectorName } = req.body;
        const id = `P${Date.now()}`;

        const insert = db.prepare('INSERT INTO payments VALUES (?, ?, ?, ?, ?, ?)');
        insert.run(id, householdId, campaignId, amount, paymentDate, collectorName);

        const newPayment = db.prepare('SELECT * FROM payments WHERE id = ?').get(id);
        res.status(201).json(newPayment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/payments/:id', (req, res) => {
    try {
        const { id } = req.params;
        db.prepare('DELETE FROM payments WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// === HEALTH CHECK ===
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: 'sqlite', timestamp: new Date().toISOString() });
});

// Khởi động server
initDB();

app.listen(PORT, '0.0.0.0', () => {
    console.log('═══════════════════════════════════════════════');
    console.log('  🚀 Backend TDP7 đang chạy với SQLite!');
    console.log('═══════════════════════════════════════════════');
    console.log(`  📍 Port: ${PORT}`);
    console.log(`  🌐 Local: http://localhost:${PORT}`);
    console.log(`  🔗 Network: http://192.168.1.188:${PORT}`);
    console.log(`  💾 Database: tdp7.db (SQLite)`);
    console.log('═══════════════════════════════════════════════');
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close();
    process.exit(0);
});