import Household from "../models/Household.js";
import sequelize from "../config/dbsetup.js";
import HouseholdHistory from "../models/HouseholdHistory.js";
import Resident from "../models/Resident.js";

// CRUD household
export const getAllHouseholds = async () => {
  return await Household.findAll();
};

export const getHouseholdById = async (id) => {
  return await Household.findByPk(id);
};

export const createHousehold = async (householdData) => {
  return await Household.create(householdData);
};

export const updateHousehold = async (id, updateData) => {
  const household = await Household.findByPk(id);
  if (!household) return null;
  await household.update(updateData);
  return household;
};

export const deleteHousehold = async (id) => {
  const household = await Household.findByPk(id);
  if (!household) return null;
  await household.destroy();
  return true;
};

// ✅ ĐỔI TỪ findHouseholdByRoomNumber → findHouseholdByNumber
export const findHouseholdByNumber = async (householdNumber) => {
  return await Household.findOne({
    where: { HouseholdNumber: householdNumber }
  });
};

// Tách hộ khẩu
export const splitHousehold = async (originalHouseholdId, newHouseholdNumber, newHouseholdHead, residentIds, Notes) => {
  const transaction = await sequelize.transaction();

  try {
    const originalHousehold = await Household.findByPk(originalHouseholdId);
    if (!originalHousehold) {
      throw new Error('Không tìm thấy hộ gốc');
    }

    // Tạo hộ mới
    const newHousehold = await Household.create({
      HouseholdNumber: newHouseholdNumber,
      Street: originalHousehold.Street,
      Ward: originalHousehold.Ward,
      District: originalHousehold.District,
      HouseholdHead: newHouseholdHead,
      Members: residentIds.length,
      Notes: Notes || `Tách từ hộ số ${originalHousehold.HouseholdNumber}`
    }, { transaction });

    // Chuyển cư dân
    await Resident.update(
      { HouseholdID: newHousehold.HouseholdID },
      {
        where: { ResidentID: residentIds },
        transaction
      }
    );

    // Cập nhật số thành viên hộ gốc
    const remainingMembers = await Resident.count({
      where: { HouseholdID: originalHouseholdId }
    });

    await originalHousehold.update(
      { Members: remainingMembers },
      { transaction }
    );

    // Ghi lịch sử
    await HouseholdHistory.create({
      HouseholdID: originalHouseholdId,
      ChangeType: 'Thay đổi thông tin khác',
      ChangeContent: `Tách hộ thành hộ mới số ${newHouseholdNumber}`,
      ChangeDate: new Date(),
      Notes: `${residentIds.length} thành viên được chuyển sang hộ mới`
    }, { transaction });

    await transaction.commit();
    return newHousehold;

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};