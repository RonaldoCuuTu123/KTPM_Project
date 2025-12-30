import { useState, useEffect } from 'react';
import { createTransaction, updateTransaction } from '../../services/cashTransactionService';
import './CashBook.css';

function TransactionForm({ type, transaction, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    DocumentType: type || '',
    TransactionTypeName: '',
    Account: '',
    PayerRecipient: '',
    Amount: '',
    BranchID: null,
    BranchName: '',
    IsAccounting: true,
    PaymentMethod: 'Tiền mặt',
    Notes: '',
    TransactionTime: new Date().toISOString().slice(0, 16)
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (transaction) {
      setFormData({
        DocumentType: transaction.DocumentType || type || '',
        TransactionTypeName: transaction.TransactionTypeName || '',
        Account: transaction.Account || '',
        PayerRecipient: transaction.PayerRecipient || '',
        Amount: Math.abs(transaction.Amount || 0),
        BranchID: transaction.BranchID || null,
        BranchName: transaction.BranchName || '',
        IsAccounting: transaction.IsAccounting !== undefined ? transaction.IsAccounting : true,
        PaymentMethod: transaction.PaymentMethod || 'Tiền mặt',
        Notes: transaction.Notes || '',
        TransactionTime: transaction.TransactionTime 
          ? new Date(transaction.TransactionTime).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16)
      });
    }
  }, [transaction, type]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate
      if (!formData.DocumentType) {
        setError('Vui lòng chọn loại chứng từ');
        setLoading(false);
        return;
      }

      if (!formData.Amount || parseFloat(formData.Amount) <= 0) {
        setError('Vui lòng nhập số tiền hợp lệ');
        setLoading(false);
        return;
      }

      const payload = {
        ...formData,
        Amount: parseFloat(formData.Amount),
        TransactionTime: formData.TransactionTime 
          ? new Date(formData.TransactionTime).toISOString()
          : new Date().toISOString()
      };

      let result;
      if (transaction) {
        result = await updateTransaction(transaction.TransactionID, payload);
      } else {
        result = await createTransaction(payload);
      }

      if (!result.error) {
        onSuccess();
      } else {
        setError(result.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi lưu giao dịch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{transaction ? 'Sửa giao dịch' : type === 'Phiếu thu' ? 'Lập phiếu thu' : 'Lập phiếu chi'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="transaction-form">
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label>Loại chứng từ *</label>
            <select
              name="DocumentType"
              value={formData.DocumentType}
              onChange={handleChange}
              required
              disabled={!!transaction}
            >
              <option value="">Chọn loại chứng từ</option>
              <option value="Phiếu thu">Phiếu thu</option>
              <option value="Phiếu chi">Phiếu chi</option>
            </select>
          </div>

          <div className="form-group">
            <label>Loại thu chi</label>
            <input
              type="text"
              name="TransactionTypeName"
              value={formData.TransactionTypeName}
              onChange={handleChange}
              placeholder="Ví dụ: Thu Khách mua buôn trả tiền hàng"
            />
          </div>

          <div className="form-group">
            <label>Tài khoản</label>
            <input
              type="text"
              name="Account"
              value={formData.Account}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Người nộp/nhận</label>
            <input
              type="text"
              name="PayerRecipient"
              value={formData.PayerRecipient}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Số tiền *</label>
            <input
              type="number"
              name="Amount"
              value={formData.Amount}
              onChange={handleChange}
              required
              min="1"
              step="1000"
            />
          </div>

          <div className="form-group">
            <label>Phương thức thanh toán</label>
            <select
              name="PaymentMethod"
              value={formData.PaymentMethod}
              onChange={handleChange}
            >
              <option value="Tiền mặt">Tiền mặt</option>
              <option value="Ngân hàng">Ngân hàng</option>
            </select>
          </div>

          <div className="form-group">
            <label>Thời gian giao dịch</label>
            <input
              type="datetime-local"
              name="TransactionTime"
              value={formData.TransactionTime}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="IsAccounting"
                checked={formData.IsAccounting}
                onChange={handleChange}
              />
              Đưa vào hạch toán
            </label>
          </div>

          <div className="form-group">
            <label>Ghi chú</label>
            <textarea
              name="Notes"
              value={formData.Notes}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionForm;

