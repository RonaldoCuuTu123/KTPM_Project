import sequelize from '../config/dbsetup.js';
import { QueryTypes } from 'sequelize';
import Household from '../models/Household.js';
import Resident from '../models/Resident.js';
import FeeDetail from '../models/FeeDetail.js';

// Dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        // Total households
        const totalHouseholds = await Household.count();

        // Total residents
        const totalResidents = await Resident.count({
            where: { ResidencyStatus: ['Thường trú', 'Tạm trú'] }
        });

        // Total collected fees
        const totalCollected = await FeeDetail.sum('Amount', {
            where: { PaymentStatus: 'Đã đóng' }
        });

        // Households paid
        const householdsPaid = await sequelize.query(
            `SELECT COUNT(DISTINCT HouseholdID) as count FROM FeeDetails WHERE PaymentStatus = 'Đã đóng'`,
            { type: QueryTypes.SELECT }
        );

        res.status(200).json({
            error: false,
            stats: {
                totalHouseholds,
                totalResidents,
                totalCollected: totalCollected || 0,
                householdsPaid: householdsPaid[0].count || 0
            }
        });
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        res.status(500).json({ error: true, message: 'Error getting statistics', details: error.message });
    }
};

// Thống kê nhân khẩu theo giới tính
export const getResidentsByGender = async (req, res) => {
    try {
        const stats = await sequelize.query(
            `SELECT Sex, COUNT(*) as count 
       FROM Residents 
       WHERE ResidencyStatus IN ('Thường trú', 'Tạm trú')
       GROUP BY Sex`,
            { type: QueryTypes.SELECT }
        );
        res.status(200).json({ error: false, stats });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Error getting statistics', detail: error.message });
    }
};

// Thống kê nhân khẩu theo độ tuổi
export const getResidentsByAgeGroup = async (req, res) => {
    try {
        const stats = await sequelize.query(
            `SELECT 
        CASE 
          WHEN TIMESTAMPDIFF(YEAR, DateOfBirth, CURDATE()) < 6 THEN 'Mầm non'
          WHEN TIMESTAMPDIFF(YEAR, DateOfBirth, CURDATE()) BETWEEN 6 AND 10 THEN 'Cấp 1'
          WHEN TIMESTAMPDIFF(YEAR, DateOfBirth, CURDATE()) BETWEEN 11 AND 14 THEN 'Cấp 2'
          WHEN TIMESTAMPDIFF(YEAR, DateOfBirth, CURDATE()) BETWEEN 15 AND 17 THEN 'Cấp 3'
          WHEN TIMESTAMPDIFF(YEAR, DateOfBirth, CURDATE()) BETWEEN 18 AND 60 THEN 'Độ tuổi lao động'
          ELSE 'Nghỉ hưu'
        END as AgeGroup,
        COUNT(*) as count
       FROM Residents
       WHERE ResidencyStatus IN ('Thường trú', 'Tạm trú') AND DateOfBirth IS NOT NULL
       GROUP BY AgeGroup`,
            { type: QueryTypes.SELECT }
        );
        res.status(200).json({ error: false, stats });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Error getting statistics', detail: error.message });
    }
};

// Thống kê tạm vắng/tạm trú
export const getTemporaryStats = async (req, res) => {
    try {
        const absenceCount = await sequelize.query(
            `SELECT COUNT(*) as count FROM TemporaryAbsence WHERE Status = 'Đang vắng'`,
            { type: QueryTypes.SELECT }
        );

        const residenceCount = await sequelize.query(
            `SELECT COUNT(*) as count FROM TemporaryResidence WHERE Status = 'Đang tạm trú'`,
            { type: QueryTypes.SELECT }
        );

        res.status(200).json({
            error: false,
            stats: {
                currentlyAbsent: absenceCount[0].count,
                currentlyResiding: residenceCount[0].count
            }
        });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Error getting statistics', detail: error.message });
    }
};

// Thống kê theo khoảng thời gian (số nhân khẩu đăng ký trong khoảng thời gian)
export const getResidentsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ error: true, message: 'startDate and endDate are required' });
        }

        const stats = await sequelize.query(
            `SELECT COUNT(*) as count 
       FROM Residents 
       WHERE RegistrationDate BETWEEN :startDate AND :endDate`,
            {
                replacements: { startDate, endDate },
                type: QueryTypes.SELECT
            }
        );

        res.status(200).json({ error: false, count: stats[0].count });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Error getting statistics', detail: error.message });
    }
};