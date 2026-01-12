import * as residentServices from '../services/ResidentServices.js';
import Resident from '../models/Resident.js';

// Map Resident từ DB sang FE format
const mapResidentToFE = (resident) => {
  if (!resident) return null;

  return {
    id: resident.ResidentID,
    ResidentID: resident.ResidentID,
    fullName: resident.FullName,
    FullName: resident.FullName,
    dob: resident.DateOfBirth,
    DateOfBirth: resident.DateOfBirth,
    gender: resident.Sex === 'Nam' ? 'Nam' : 'Nữ',
    Sex: resident.Sex,
    birthPlace: resident.PlaceOfBirth,
    PlaceOfBirth: resident.PlaceOfBirth,
    origin: resident.Hometown,
    Hometown: resident.Hometown,
    ethnicity: resident.Ethnicity,
    Ethnicity: resident.Ethnicity,
    job: resident.Occupation,
    Occupation: resident.Occupation,
    idCardNumber: resident.IDCardNumber,
    IDCardNumber: resident.IDCardNumber,
    relationToHead: resident.Relationship,
    Relationship: resident.Relationship,
    registrationDate: resident.RegistrationDate,
    RegistrationDate: resident.RegistrationDate,
    status: resident.ResidencyStatus,
    ResidencyStatus: resident.ResidencyStatus,
    householdId: resident.HouseholdID,
    HouseholdID: resident.HouseholdID,
    phoneNumber: resident.PhoneNumber,
    educationLevel: resident.EducationLevel,
    workplace: resident.Workplace
  };
};

// Lấy tất cả cư dân
export const getAllResidents = async (req, res) => {
  try {
    const residents = await Resident.findAll();
    const formattedResidents = residents.map(mapResidentToFE);
    res.status(200).json(formattedResidents);
  } catch (error) {
    console.error('Error retrieving residents:', error);
    res.status(500).json({ error: true, message: 'Error retrieving residents', details: error.message });
  }
};

// Lấy cư dân theo ID
export const getResidentById = async (req, res) => {
  try {
    const resident = await Resident.findByPk(req.params.id);
    if (!resident) return res.status(404).json({ error: true, message: 'Resident not found' });
    res.status(200).json(mapResidentToFE(resident));
  } catch (error) {
    console.error('Error retrieving resident:', error);
    res.status(500).json({ error: true, message: 'Error retrieving resident', details: error.message });
  }
};

// Thêm cư dân mới
export const createResident = async (req, res) => {
  try {
    const {
      HouseholdID,
      householdId,
      FullName,
      fullName,
      Sex,
      gender,
      DateOfBirth,
      dob,
      PlaceOfBirth,
      birthPlace,
      Hometown,
      origin,
      Ethnicity,
      ethnicity,
      Occupation,
      job,
      IDCardNumber,
      idCardNumber,
      Relationship,
      relationToHead,
      RegistrationDate,
      registrationDate,
      PhoneNumber,
      phoneNumber,
      EducationLevel,
      educationLevel,
      Workplace,
      workplace,
      ResidencyStatus,
      status
    } = req.body;

    const householdID = HouseholdID || householdId;
    const fullname = FullName || fullName;
    const sex = Sex || (gender === 'Nam' ? 'Nam' : 'Nữ');
    const dateOfBirth = DateOfBirth || dob;
    const placeOfBirth = PlaceOfBirth || birthPlace || '';
    const hometown = Hometown || origin || '';
    const eth = Ethnicity || ethnicity || 'Kinh';
    const occupation = Occupation || job || '';
    const idcard = IDCardNumber || idCardNumber || '';
    const relationship = Relationship || relationToHead || 'Thành viên';
    const regDate = RegistrationDate || registrationDate || new Date().toISOString().split('T')[0];

    if (!householdID || !fullname || !sex || !relationship) {
      return res.status(400).json({
        error: true,
        message: 'HouseholdID, FullName, Sex và Relationship là bắt buộc'
      });
    }

    const newResident = await Resident.create({
      HouseholdID: householdID,
      FullName: fullname,
      Sex: sex,
      DateOfBirth: dateOfBirth || null,
      PlaceOfBirth: placeOfBirth,
      Hometown: hometown,
      Ethnicity: eth,
      Occupation: occupation,
      IDCardNumber: idcard,
      Relationship: relationship,
      RegistrationDate: regDate,
      PhoneNumber: phoneNumber || '',
      EducationLevel: educationLevel || '',
      Workplace: workplace || '',
      ResidencyStatus: status || 'Thường trú'
    });

    res.status(201).json(mapResidentToFE(newResident));
  } catch (error) {
    console.error('Error creating resident:', error);
    res.status(500).json({
      error: true,
      message: 'Error creating resident',
      details: error.message
    });
  }
};

// Cập nhật cư dân
export const updateResident = async (req, res) => {
  try {
    const { id } = req.params;
    const resident = await Resident.findByPk(id);

    if (!resident) return res.status(404).json({ error: true, message: 'Resident not found' });

    // Map và update fields
    const updates = {
      FullName: req.body.FullName || req.body.fullName,
      Sex: req.body.Sex || req.body.gender,
      DateOfBirth: req.body.DateOfBirth || req.body.dob,
      PlaceOfBirth: req.body.PlaceOfBirth || req.body.birthPlace,
      Hometown: req.body.Hometown || req.body.origin,
      Ethnicity: req.body.Ethnicity || req.body.ethnicity,
      Occupation: req.body.Occupation || req.body.job,
      IDCardNumber: req.body.IDCardNumber || req.body.idCardNumber,
      Relationship: req.body.Relationship || req.body.relationToHead,
      ResidencyStatus: req.body.ResidencyStatus || req.body.status,
      PhoneNumber: req.body.PhoneNumber || req.body.phoneNumber,
      EducationLevel: req.body.EducationLevel || req.body.educationLevel,
      Workplace: req.body.Workplace || req.body.workplace
    };

    // Remove undefined values
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    await resident.update(updates);
    const updated = await Resident.findByPk(id);
    res.status(200).json(mapResidentToFE(updated));
  } catch (error) {
    console.error('Error updating resident:', error);
    res.status(500).json({
      error: true,
      message: 'Error updating resident',
      details: error.message
    });
  }
};

// Xóa cư dân
export const deleteResident = async (req, res) => {
  try {
    const { id } = req.params;
    const resident = await Resident.findByPk(id);

    if (!resident) return res.status(404).json({ error: true, message: 'Resident not found' });

    await resident.destroy();
    res.status(200).json({ error: false, message: 'Resident deleted successfully' });
  } catch (error) {
    console.error('Error deleting resident:', error);
    res.status(500).json({
      error: true,
      message: 'Error deleting resident',
      details: error.message
    });
  }
};
