import { useState, useEffect } from 'react';
import Sidebar from './CashBook/Sidebar';
import TransactionTable from './CashBook/TransactionTable';
import SummaryStats from './CashBook/SummaryStats';
import TransactionForm from './CashBook/TransactionForm';
import { fetchTransactions, fetchSummary } from '../services/cashTransactionService';
import './CashBook/CashBook.css';

function CashBook() {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 1
  });
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    cashBalance: 0,
    totalTransactions: 0
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    paymentMethod: 'Tiền mặt',
    documentType: '',
    isAccounting: 'all',
    timeFilter: 'all',
    startDate: '',
    endDate: '',
    branchId: '',
    transactionTypeId: '',
    page: 1,
    limit: 50
  });
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState(''); // 'Phiếu thu' or 'Phiếu chi'
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [transactionsData, summaryData] = await Promise.all([
        fetchTransactions(filters),
        fetchSummary(filters)
      ]);
      
      if (!transactionsData.error) {
        setTransactions(transactionsData.data?.transactions || []);
        if (transactionsData.data?.pagination) {
          setPagination(transactionsData.data.pagination);
        }
      }
      
      if (!summaryData.error) {
        setSummary(summaryData.data || summary);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleCreateTransaction = (type) => {
    setFormType(type);
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setFormType(transaction.DocumentType);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTransaction(null);
    setFormType('');
  };

  const handleFormSuccess = () => {
    handleFormClose();
    loadData();
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return (
    <div className="cash-book-container">
      <div className="cash-book-layout">
        <Sidebar 
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        
        <div className="cash-book-main">
          <div className="cash-book-header">
            <h1 className="cash-book-title">Sổ quỹ tiền mặt</h1>
            <div className="cash-book-actions">
              <button 
                className="btn-create-receipt"
                onClick={() => handleCreateTransaction('Phiếu thu')}
              >
                + Lập phiếu thu
              </button>
              <button 
                className="btn-create-payment"
                onClick={() => handleCreateTransaction('Phiếu chi')}
              >
                + Lập phiếu chi
              </button>
            </div>
          </div>

          <SummaryStats summary={summary} />

          <TransactionTable 
            transactions={transactions}
            loading={loading}
            onEdit={handleEditTransaction}
            onDelete={loadData}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {showForm && (
        <TransactionForm
          type={formType}
          transaction={editingTransaction}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

export default CashBook;

