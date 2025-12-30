import './CashBook.css';

function SummaryStats({ summary }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  return (
    <div className="summary-stats">
      <div className="stat-item stat-income">
        <div className="stat-label">Tổng thu</div>
        <div className="stat-value income-value">
          {formatCurrency(summary.totalIncome || 0)}
        </div>
      </div>
      <div className="stat-item stat-expense">
        <div className="stat-label">Tổng chi</div>
        <div className="stat-value expense-value">
          {formatCurrency(Math.abs(summary.totalExpense || 0))}
        </div>
      </div>
      <div className="stat-item stat-balance">
        <div className="stat-label">Tồn quỹ</div>
        <div className="stat-value balance-value">
          {formatCurrency(summary.cashBalance || 0)}
        </div>
      </div>
    </div>
  );
}

export default SummaryStats;

