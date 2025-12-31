import { DataTypes } from "sequelize";
import sequelize from "../config/dbsetup.js";

const Household = sequelize.define("Household", {
  HouseholdID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  HouseholdNumber: {  // ✅ ĐỔI TỪ RoomNumber
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    comment: 'Số nhà/hộ khẩu'
  },
  Street: {
    type: DataTypes.STRING(100),
    comment: 'Đường phố/Ấp'
  },
  Ward: {
    type: DataTypes.STRING(50),
    comment: 'Phường/Xã/Thị trấn'
  },
  District: {
    type: DataTypes.STRING(50),
    comment: 'Quận/Huyện'
  },
  HouseholdHead: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Họ tên chủ hộ'
  },
  Members: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Số thành viên'
  },
  HasVehicle: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Có phương tiện hay không'
  },
  Notes: {
    type: DataTypes.TEXT,
    comment: 'Ghi chú'
  }
}, {
  tableName: "Households",
  timestamps: false
});

export default Household;