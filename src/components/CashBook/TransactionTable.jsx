import { useState } from 'react';
import { deleteTransaction } from '../../services/cashTransactionService';
import './CashBook.css';

function TransactionTable({ transactions, loading, onEdit, onDelete, pagination, onPageChange }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(Math.abs(amount));
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) {
      try {
        const result = await deleteTransaction(id);
        if (!result.error) {
          onDelete();
        } else {
          alert('Lỗi khi xóa giao dịch: ' + result.message);
        }
      } catch (error) {
        alert('Lỗi khi xóa giao dịch');
      }
    }
  };

  if (loading) {
    return <div className="table-loading">Đang tải...</div>;
  }

  return (
    <div className="transaction-table-container">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Mã phiếu</th>
            <th>Thời gian</th>
            <th>Loại thu chi</th>
            <th>Tài khoản</th>
            <th>Người nộp/nhận</th>
            <th>Giá trị</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="7" className="empty-message">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            transactions.map((transaction) => (
              <tr key={transaction.TransactionID} className="table-row">
                <td>
                  <span className="row-indicator">▶</span>
                  {transaction.VoucherCode}
                </td>
                <td>{formatDateTime(transaction.TransactionTime)}</td>
                <td>{transaction.TransactionTypeName || '-'}</td>
                <td>{transaction.Account || '-'}</td>
                <td>{transaction.PayerRecipient || '-'}</td>
                <td className={transaction.Amount >= 0 ? 'amount-positive' : 'amount-negative'}>
                  {transaction.Amount >= 0 ? '+' : '-'}
                  {formatCurrency(transaction.Amount)}
                </td>
                <td>
                  <button 
                    className="btn-edit"
                    onClick={() => onEdit(transaction)}
                  >
                    Sửa
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(transaction.TransactionID)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={pagination.page === 1}
            onClick={() => onPageChange(pagination.page - 1)}
          >
            Trước
          </button>
          <span className="pagination-info">
            Trang {pagination.page} / {pagination.totalPages}
          </span>
          <button
            className="pagination-btn"
            disabled={pagination.page === pagination.totalPages}
            onClick={() => onPageChange(pagination.page + 1)}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}

export default TransactionTable;

