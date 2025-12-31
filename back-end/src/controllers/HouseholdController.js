import * as householdService from '../services/HouseholdServices.js';
import sequelize from '../config/dbsetup.js';          // ← THÊM
import Household from '../models/Household.js';        // ← THÊM
import Resident from '../models/Resident.js';          // ← THÊM  
import HouseholdHistory from '../models/HouseholdHistory.js'; // ← THÊM


// Lấy tất cả hộ gia đình
export const getAllHouseholds = async (req, res) => {
  try {
    const households = await householdService.getAllHouseholds();
    res.status(200).json({ error: false, households });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error retrieving households', error });
  }
};

// Lấy hộ gia đình theo ID
export const getHouseholdById = async (req, res) => {
  try {
    const household = await householdService.getHouseholdById(req.params.id);
    if (!household) return res.status(404).json({ error: true, message: 'Household not found' });
    res.status(200).json(household);
  } catch (error) {
    res.status(500).json({ error: false, message: 'Error retrieving household', error });
  }
};

// Thêm hộ gia đình mới
export const createHousehold = async (req, res) => {
  try {
    const { RoomNumber, Type, HouseholdHead, Members, Notes } = req.body;
    if (!RoomNumber || !Type || !Members || !HouseholdHead) {
      return res.status(400).json({ message: 'RoomNumber, Type, HousehouseHead and Members are required' });
    }

    const newHousehold = await householdService.createHousehold({ RoomNumber, Type, HouseholdHead, Members, Notes });
    res.status(201).json({ error: false, newHousehold });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error creating household', error });
  }
};

// Cập nhật thông tin hộ gia đình
export const updateHousehold = async (req, res) => {
  try {
    const updatedHousehold = await householdService.updateHousehold(req.params.id, req.body);
    if (!updatedHousehold) return res.status(404).json({ error: true, message: 'Household not found' });
    res.status(200).json({ error: false, message: "Update successfully", updatedHousehold });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error updating household', error });
  }
};

// Xóa hộ gia đình
export const deleteHousehold = async (req, res) => {
  try {
    const result = await householdService.deleteHousehold(req.params.id);
    if (!result) return res.status(404).json({ message: 'Household not found' });
    res.status(200).json({ error: false, message: 'Household deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error deleting household', error });
  }
};

// Tìm hộ gia đình theo số phòng
export const findHouseholdByRoomNumber = async (req, res) => {
  try {
    const roomNumber = req.body.roomNumber || req.query.roomNumber;
    if (!roomNumber) {
      return res.status(400).json({ error: true, message: 'roomNumber is required' });
    }
    const household = await householdService.findHouseholdByRoomNumber(roomNumber);
    if (!household)
      return res.status(404).json({ error: true, message: 'Household not found' });
    res.status(200).json(household);
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error finding household', error });
  }
};

export const splitHousehold = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { originalHouseholdId, newRoomNumber, newHouseholdHead, residentIds, Notes } = req.body;

    if (!originalHouseholdId || !newRoomNumber || !newHouseholdHead || !residentIds || residentIds.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: 'Thiếu thông tin: originalHouseholdId, newRoomNumber, newHouseholdHead và residentIds'
      });
    }

    // Lấy thông tin hộ gốc
    const originalHousehold = await Household.findByPk(originalHouseholdId);
    if (!originalHousehold) {
      await transaction.rollback();
      return res.status(404).json({ error: true, message: 'Không tìm thấy hộ gốc' });
    }

    // Tạo hộ mới
    const newHousehold = await Household.create({
      RoomNumber: newRoomNumber,
      Street: originalHousehold.Street,
      Ward: originalHousehold.Ward,
      District: originalHousehold.District,
      Type: originalHousehold.Type,
      HouseholdHead: newHouseholdHead,
      Members: residentIds.length,
      Notes: Notes || `Tách từ hộ ${originalHousehold.RoomNumber}`
    }, { transaction });

    // Chuyển các cư dân sang hộ mới
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
      ChangeContent: `Tách hộ thành hộ mới ${newRoomNumber}`,
      ChangeDate: new Date(),
      Notes: `${residentIds.length} thành viên được chuyển sang hộ mới`
    }, { transaction });

    await transaction.commit();

    res.status(201).json({
      error: false,
      message: 'Tách hộ thành công',
      newHousehold,
      movedResidents: residentIds.length
    });

  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({
      error: true,
      message: 'Lỗi khi tách hộ',
      detail: error.message
    });
  }
};
