import * as feeDetailServices from '../services/FeeDetailServices.js';
import sequelize from '../config/dbsetup.js';
import FeeDetail from '../models/FeeDetail.js';
import FeeCollection from '../models/FeeCollection.js';
import Household from '../models/Household.js';

// Map từ FeeDetail sang Payment format (PascalCase to camelCase)
const mapFeeDetailToPayment = (feeDetail) => {
    if (!feeDetail) return null;

    return {
        id: feeDetail.FeeDetailID,
        paymentId: feeDetail.FeeDetailID,
        householdId: feeDetail.HouseholdID,
        campaignId: feeDetail.CollectionID,
        collectionId: feeDetail.CollectionID,
        amount: feeDetail.Amount || 0,
        paymentDate: feeDetail.PaymentDate,
        paymentMethod: feeDetail.PaymentMethod || 'Tiền mặt',
        paymentStatus: feeDetail.PaymentStatus || 'Đã đóng',
        collectorName: feeDetail.CollectorName || 'Nguyễn Văn Cường',
        status: feeDetail.PaymentStatus === 'Đã đóng' ? 'Hoàn thành' : 'Chưa đóng'
    };
};

// Lấy tất cả thanh toán
export const getAllPayments = async (req, res) => {
    try {
        const feeDetails = await FeeDetail.findAll({
            include: [
                { model: FeeCollection, attributes: ['CollectionID', 'CollectionName'] },
                { model: Household, attributes: ['HouseholdID', 'HouseholdNumber'] }
            ]
        });

        const payments = feeDetails.map(mapFeeDetailToPayment);
        res.status(200).json(payments);
    } catch (error) {
        console.error('Error retrieving payments:', error);
        res.status(500).json({ error: true, message: 'Error retrieving payments', details: error.message });
    }
};

// Lấy thanh toán theo ID
export const getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        const feeDetail = await FeeDetail.findByPk(id, {
            include: [
                { model: FeeCollection },
                { model: Household }
            ]
        });

        if (!feeDetail) {
            return res.status(404).json({ error: true, message: 'Payment not found' });
        }

        res.status(200).json(mapFeeDetailToPayment(feeDetail));
    } catch (error) {
        console.error('Error retrieving payment:', error);
        res.status(500).json({ error: true, message: 'Error retrieving payment', details: error.message });
    }
};

// Tạo thanh toán mới
export const createPayment = async (req, res) => {
    try {
        const {
            HouseholdID,
            householdId,
            CollectionID,
            campaignId,
            Amount,
            amount,
            PaymentDate,
            paymentDate,
            PaymentMethod,
            paymentMethod,
            CollectorName,
            collectorName
        } = req.body;

        // Map camelCase từ FE sang PascalCase cho BE
        const householdID = HouseholdID || householdId;
        const collectionID = CollectionID || campaignId;
        const paymentAmount = Amount || amount;
        const pDate = PaymentDate || paymentDate;
        const pMethod = PaymentMethod || paymentMethod || 'Tiền mặt';
        const collector = CollectorName || collectorName || 'Nguyễn Văn Cường';

        if (!householdID || !collectionID) {
            return res.status(400).json({ error: true, message: 'Missing required fields: HouseholdID and CollectionID' });
        }

        // Tạo FeeDetail (Payment)
        const newFeeDetail = await FeeDetail.create({
            CollectionID: collectionID,
            HouseholdID: householdID,
            Amount: paymentAmount || 0,
            PaymentDate: pDate || new Date().toISOString().split('T')[0],
            PaymentMethod: pMethod,
            PaymentStatus: 'Đã đóng',
            CollectorName: collector
        });

        // Fetch lại với relations
        const payment = await FeeDetail.findByPk(newFeeDetail.FeeDetailID, {
            include: [
                { model: FeeCollection },
                { model: Household }
            ]
        });

        res.status(201).json(mapFeeDetailToPayment(payment));
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ error: true, message: 'Error creating payment', details: error.message });
    }
};

// Cập nhật thanh toán
export const updatePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            Amount,
            amount,
            PaymentDate,
            paymentDate,
            PaymentMethod,
            paymentMethod,
            PaymentStatus,
            paymentStatus
        } = req.body;

        const feeDetail = await FeeDetail.findByPk(id);
        if (!feeDetail) {
            return res.status(404).json({ error: true, message: 'Payment not found' });
        }

        // Update fields
        if (Amount !== undefined || amount !== undefined) {
            feeDetail.Amount = Amount || amount;
        }
        if (PaymentDate || paymentDate) {
            feeDetail.PaymentDate = PaymentDate || paymentDate;
        }
        if (PaymentMethod || paymentMethod) {
            feeDetail.PaymentMethod = PaymentMethod || paymentMethod;
        }
        if (PaymentStatus || paymentStatus) {
            feeDetail.PaymentStatus = PaymentStatus || paymentStatus;
        }

        await feeDetail.save();

        const updatedPayment = await FeeDetail.findByPk(id, {
            include: [
                { model: FeeCollection },
                { model: Household }
            ]
        });

        res.status(200).json(mapFeeDetailToPayment(updatedPayment));
    } catch (error) {
        console.error('Error updating payment:', error);
        res.status(500).json({ error: true, message: 'Error updating payment', details: error.message });
    }
};

// Xóa thanh toán
export const deletePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const feeDetail = await FeeDetail.findByPk(id);

        if (!feeDetail) {
            return res.status(404).json({ error: true, message: 'Payment not found' });
        }

        await feeDetail.destroy();
        res.status(200).json({ error: false, message: 'Payment deleted successfully' });
    } catch (error) {
        console.error('Error deleting payment:', error);
        res.status(500).json({ error: true, message: 'Error deleting payment', details: error.message });
    }
};
