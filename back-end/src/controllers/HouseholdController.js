import * as householdService from '../services/HouseholdServices.js';
import sequelize from '../config/dbsetup.js';
import Household from '../models/Household.js';
import Resident from '../models/Resident.js';
import HouseholdHistory from '../models/HouseholdHistory.js';

// Lấy tất cả hộ gia đình
export const getAllHouseholds = async (req, res) => {
  try {
    const households = await Household.findAll({
      include: [
        {
          model: Resident,
          attributes: ['ResidentID', 'FullName', 'Sex', 'DateOfBirth', 'Relationship', 'ResidencyStatus']
        }
      ]
    });

    // Map dữ liệu để FE dễ sử dụng
    const formattedHouseholds = households.map(h => ({
      HouseholdID: h.HouseholdID,
      id: h.HouseholdID,
      HouseholdNumber: h.HouseholdNumber,
      householdNumber: h.HouseholdNumber,
      HouseholdHead: h.HouseholdHead,
      headName: h.HouseholdHead,
      Street: h.Street,
      street: h.Street,
      Ward: h.Ward,
      ward: h.Ward,
      District: h.District,
      district: h.District,
      address: `${h.Street}, ${h.Ward}, ${h.District}`,
      Members: h.Members,
      members: (h.Residents || []).map(r => ({
        id: r.ResidentID,
        ResidentID: r.ResidentID,
        fullName: r.FullName,
        gender: r.Sex === 'Nam' ? 'Nam' : 'Nữ',
        dob: r.DateOfBirth,
        relationToHead: r.Relationship,
        status: r.ResidencyStatus
      })),
      HasVehicle: h.HasVehicle,
      Notes: h.Notes
    }));

    res.status(200).json(formattedHouseholds);
  } catch (error) {
    console.error('Error retrieving households:', error);
    res.status(500).json({ error: true, message: 'Error retrieving households', details: error.message });
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
    const {
      HouseholdNumber,
      householdNumber,
      Street,
      street,
      Ward,
      ward,
      District,
      district,
      HouseholdHead,
      headName,
      Members,
      members,
      Notes
    } = req.body;

    // Map camelCase từ FE sang PascalCase cho BE
    const number = HouseholdNumber || householdNumber;
    const head = HouseholdHead || headName;
    const st = Street || street;
    const wa = Ward || ward;
    const di = District || district;
    const mem = Members || members || 0;

    if (!number || !head) {
      return res.status(400).json({
        error: true,
        message: 'HouseholdNumber và HouseholdHead là bắt buộc'
      });
    }

    const newHousehold = await Household.create({
      HouseholdNumber: number,
      Street: st || '',
      Ward: wa || 'La Khê',
      District: di || 'Hà Đông',
      HouseholdHead: head,
      Members: mem,
      Notes: Notes || ''
    });

    // Fetch với relations
    const createdHousehold = await Household.findByPk(newHousehold.HouseholdID, {
      include: [
        {
          model: Resident,
          attributes: ['ResidentID', 'FullName', 'Sex', 'DateOfBirth', 'Relationship', 'ResidencyStatus']
        }
      ]
    });

    const formatted = {
      HouseholdID: createdHousehold.HouseholdID,
      id: createdHousehold.HouseholdID,
      HouseholdNumber: createdHousehold.HouseholdNumber,
      householdNumber: createdHousehold.HouseholdNumber,
      HouseholdHead: createdHousehold.HouseholdHead,
      headName: createdHousehold.HouseholdHead,
      Street: createdHousehold.Street,
      street: createdHousehold.Street,
      Ward: createdHousehold.Ward,
      ward: createdHousehold.Ward,
      District: createdHousehold.District,
      district: createdHousehold.District,
      address: `${createdHousehold.Street}, ${createdHousehold.Ward}, ${createdHousehold.District}`,
      Members: createdHousehold.Members,
      members: [],
      HasVehicle: createdHousehold.HasVehicle,
      Notes: createdHousehold.Notes
    };

    res.status(201).json(formatted);
  } catch (error) {
    console.error('Error creating household:', error);
    res.status(500).json({ error: true, message: 'Error creating household', details: error.message });
  }
};

// Cập nhật thông tin hộ gia đình
export const updateHousehold = async (req, res) => {
  try {
    const { id } = req.params;
    const household = await Household.findByPk(id);

    if (!household) return res.status(404).json({ error: true, message: 'Household not found' });

    // Map and update fields
    const updates = {
      HouseholdNumber: req.body.HouseholdNumber || req.body.householdNumber,
      HouseholdHead: req.body.HouseholdHead || req.body.headName,
      Street: req.body.Street || req.body.street,
      Ward: req.body.Ward || req.body.ward,
      District: req.body.District || req.body.district,
      Members: req.body.Members || req.body.members,
      HasVehicle: req.body.HasVehicle !== undefined ? req.body.HasVehicle : req.body.hasVehicle,
      Notes: req.body.Notes
    };

    // Remove undefined values
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    await household.update(updates);
    const updated = await Household.findByPk(id, {
      include: [
        {
          model: Resident,
          attributes: ['ResidentID', 'FullName', 'Sex', 'DateOfBirth', 'Relationship', 'ResidencyStatus']
        }
      ]
    });

    const formatted = {
      HouseholdID: updated.HouseholdID,
      id: updated.HouseholdID,
      HouseholdNumber: updated.HouseholdNumber,
      householdNumber: updated.HouseholdNumber,
      HouseholdHead: updated.HouseholdHead,
      headName: updated.HouseholdHead,
      Street: updated.Street,
      street: updated.Street,
      Ward: updated.Ward,
      ward: updated.Ward,
      District: updated.District,
      district: updated.District,
      address: `${updated.Street}, ${updated.Ward}, ${updated.District}`,
      Members: updated.Members,
      members: (updated.Residents || []).map(r => ({
        id: r.ResidentID,
        ResidentID: r.ResidentID,
        fullName: r.FullName,
        gender: r.Sex === 'Nam' ? 'Nam' : 'Nữ',
        dob: r.DateOfBirth,
        relationToHead: r.Relationship,
        status: r.ResidencyStatus
      })),
      HasVehicle: updated.HasVehicle,
      Notes: updated.Notes
    };

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error updating household:', error);
    res.status(500).json({ error: true, message: 'Error updating household', details: error.message });
  }
};

// Xóa hộ gia đình
export const deleteHousehold = async (req, res) => {
  try {
    const { id } = req.params;
    const household = await Household.findByPk(id);

    if (!household) return res.status(404).json({ error: true, message: 'Household not found' });

    await household.destroy();
    res.status(200).json({ error: false, message: 'Household deleted successfully' });
  } catch (error) {
    console.error('Error deleting household:', error);
    res.status(500).json({ error: true, message: 'Error deleting household', details: error.message });
  }
};

// ✅ TÌM HỘ THEO SỐ NHÀ (ĐỔI TỪ RoomNumber)
export const findHouseholdByNumber = async (req, res) => {
  try {
    const householdNumber = req.body.householdNumber || req.query.householdNumber;
    if (!householdNumber) {
      return res.status(400).json({ error: true, message: 'householdNumber (số nhà) là bắt buộc' });
    }
    const household = await householdService.findHouseholdByNumber(householdNumber);
    if (!household)
      return res.status(404).json({ error: true, message: 'Không tìm thấy hộ gia đình' });
    res.status(200).json(household);
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error finding household', error });
  }
};

// Tách hộ khẩu
export const splitHousehold = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { originalHouseholdId, newHouseholdNumber, newHouseholdHead, residentIds, Notes } = req.body;

    if (!originalHouseholdId || !newHouseholdNumber || !newHouseholdHead || !residentIds || residentIds.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: 'Thiếu thông tin: originalHouseholdId, newHouseholdNumber (số nhà mới), newHouseholdHead và residentIds'
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
      HouseholdNumber: newHouseholdNumber,
      Street: originalHousehold.Street,
      Ward: originalHousehold.Ward,
      District: originalHousehold.District,
      HouseholdHead: newHouseholdHead,
      Members: residentIds.length,
      Notes: Notes || `Tách từ hộ số ${originalHousehold.HouseholdNumber}`
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
      ChangeContent: `Tách hộ thành hộ mới số ${newHouseholdNumber}`,
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