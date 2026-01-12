import * as feeCollectionServices from '../services/FeeCollectionServices.js';
import FeeCollection from '../models/FeeCollection.js';
import FeeType from '../models/FeeType.js';

// Map FeeCollection từ DB sang FE format
const mapFeeCollectionToFE = (feeCollection) => {
  if (!feeCollection) return null;

  return {
    id: feeCollection.CollectionID,
    CollectionID: feeCollection.CollectionID,
    name: feeCollection.CollectionName,
    CollectionName: feeCollection.CollectionName,
    type: feeCollection.FeeType?.TypeName === 'Bắt buộc' ? 'Bắt buộc' : 'Tự nguyện',
    feeTypeId: feeCollection.FeeTypeID,
    FeeTypeID: feeCollection.FeeTypeID,
    amount: feeCollection.TotalAmount || 0,
    TotalAmount: feeCollection.TotalAmount || 0,
    amountPerMonthPerPerson: feeCollection.AmountPerMonth || 0,
    AmountPerMonth: feeCollection.AmountPerMonth || 0,
    startDate: feeCollection.StartDate,
    StartDate: feeCollection.StartDate,
    endDate: feeCollection.EndDate,
    EndDate: feeCollection.EndDate,
    description: feeCollection.Notes || '',
    Notes: feeCollection.Notes || '',
    status: feeCollection.Status || 'Đang thu',
    Status: feeCollection.Status || 'Đang thu'
  };
};

// Lấy tất cả đợt thu phí
export const getAllFeeCollections = async (req, res) => {
  try {
    const feeCollections = await FeeCollection.findAll({
      include: [{ model: FeeType, attributes: ['FeeTypeID', 'TypeName'] }]
    });

    const formattedCollections = feeCollections.map(mapFeeCollectionToFE);
    res.status(200).json(formattedCollections);
  } catch (error) {
    console.error('Error retrieving fee collections:', error);
    res.status(500).json({ error: true, message: 'Error retrieving fee collections', details: error.message });
  }
};

// Lấy đợt thu phí theo ID
export const getFeeCollectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const feeCollection = await FeeCollection.findByPk(id, {
      include: [{ model: FeeType, attributes: ['FeeTypeID', 'TypeName'] }]
    });

    if (!feeCollection) {
      return res.status(404).json({ error: true, message: 'FeeCollection not found' });
    }

    res.status(200).json(mapFeeCollectionToFE(feeCollection));
  } catch (error) {
    console.error('Error retrieving fee collection:', error);
    res.status(500).json({ error: true, message: 'Error retrieving fee collection', details: error.message });
  }
};

// Thêm đợt thu phí mới
export const createFeeCollection = async (req, res) => {
  try {
    const {
      FeeTypeID,
      feeTypeId,
      CollectionName,
      name,
      StartDate,
      startDate,
      EndDate,
      endDate,
      Amount,
      amount,
      AmountPerMonth,
      amountPerMonth,
      TotalAmount,
      Description,
      description,
      Notes,
      Status,
      status
    } = req.body;

    const feeTypeID = FeeTypeID || feeTypeId || 1;
    const collectionName = CollectionName || name;
    const sDate = StartDate || startDate;
    const eDate = EndDate || endDate;
    const totalAmount = Amount || amount || TotalAmount || 0;
    const monthlyAmount = AmountPerMonth || amountPerMonth || 0;
    const notes = Description || description || Notes || '';
    const stat = Status || status || 'Đang thu';

    if (!collectionName || !sDate) {
      return res.status(400).json({ error: true, message: 'CollectionName and StartDate are required' });
    }

    const newFeeCollection = await FeeCollection.create({
      FeeTypeID: feeTypeID,
      CollectionName: collectionName,
      StartDate: sDate,
      EndDate: eDate || null,
      TotalAmount: totalAmount,
      AmountPerMonth: monthlyAmount,
      Status: stat,
      Notes: notes
    });

    // Fetch with relations
    const created = await FeeCollection.findByPk(newFeeCollection.CollectionID, {
      include: [{ model: FeeType, attributes: ['FeeTypeID', 'TypeName'] }]
    });

    res.status(201).json(mapFeeCollectionToFE(created));
  } catch (error) {
    console.error('Error creating fee collection:', error);
    res.status(500).json({ error: true, message: 'Error creating fee collection', details: error.message });
  }
};

// Cập nhật đợt thu phí
export const updateFeeCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const feeCollection = await FeeCollection.findByPk(id);

    if (!feeCollection) return res.status(404).json({ error: true, message: 'FeeCollection not found' });

    // Map and update fields
    const updates = {
      CollectionName: req.body.CollectionName || req.body.name,
      StartDate: req.body.StartDate || req.body.startDate,
      EndDate: req.body.EndDate || req.body.endDate,
      TotalAmount: req.body.TotalAmount || req.body.amount,
      AmountPerMonth: req.body.AmountPerMonth || req.body.amountPerMonth,
      Status: req.body.Status || req.body.status,
      Notes: req.body.Notes || req.body.description
    };

    // Remove undefined values
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    await feeCollection.update(updates);
    const updated = await FeeCollection.findByPk(id, {
      include: [{ model: FeeType, attributes: ['FeeTypeID', 'TypeName'] }]
    });

    res.status(200).json(mapFeeCollectionToFE(updated));
  } catch (error) {
    console.error('Error updating fee collection:', error);
    res.status(500).json({ error: true, message: 'Error updating fee collection', details: error.message });
  }
};

// Xóa đợt thu phí
export const deleteFeeCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const feeCollection = await FeeCollection.findByPk(id);

    if (!feeCollection) return res.status(404).json({ error: true, message: 'FeeCollection not found' });

    await feeCollection.destroy();
    res.status(200).json({ error: false, message: 'FeeCollection deleted successfully' });
  } catch (error) {
    console.error('Error deleting fee collection:', error);
    res.status(500).json({ error: true, message: 'Error deleting fee collection', details: error.message });
  }
};
