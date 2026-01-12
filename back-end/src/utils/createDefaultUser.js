import bcrypt from "bcrypt";
import User from "../models/User.js";

export const createDefaultUser = async () => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("123", saltRounds);

    const usersToCreate = [
      {
        Username: "admin",
        Password: hashedPassword,
        FullName: "Nguyễn Văn A (Tổ Trưởng)",
        Email: "admin@gmail.com",
        PhoneNumber: "0900000001",
        Role: "Tổ trưởng",
      },
      {
        Username: "canbo",
        Password: hashedPassword,
        FullName: "Trần Văn B (Cán Bộ)",
        Email: "canbo@gmail.com",
        PhoneNumber: "0900000002",
        Role: "Cán bộ hành chính", // Map với quyền quản lý hộ khẩu/nhân khẩu
      },
      {
        Username: "ketoan",
        Password: hashedPassword,
        FullName: "Lê Thị C (Kế Toán)",
        Email: "ketoan@gmail.com",
        PhoneNumber: "0900000003",
        Role: "Thủ quỹ", // Map với quyền thu phí
      }
    ];

    for (const u of usersToCreate) {
      const existingUser = await User.findOne({ where: { Username: u.Username } });
      if (!existingUser) {
        await User.create(u);
        console.log(`✅ Đã tạo tài khoản mặc định: ${u.Username}`);
      } else {
        // Nếu user đã tồn tại nhưng sai pass hoặc role, update lại
        await existingUser.update({
          Password: u.Password,
          Role: u.Role
        });
        console.log(`ℹ️ Tài khoản ${u.Username} đã tồn tại (đã cập nhật lại pass/role).`);
      }
    }
  } catch (error) {
    console.error("❌ Lỗi tạo người dùng mặc định:", error);
  }
};