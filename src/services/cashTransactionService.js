const API_BASE_URL = 'http://localhost:3000/api'; // Thay đổi theo địa chỉ backend của bạn

// Helper function để build query string
const buildQueryString = (params) => {
  const query = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      query.append(key, params[key]);
    }
  });
  return query.toString();
};

// Fetch transactions với filters
export const fetchTransactions = async (filters = {}) => {
  try {
    const queryString = buildQueryString(filters);
    const response = await fetch(`${API_BASE_URL}/cash-transactions?${queryString}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return { error: true, message: 'Lỗi khi tải danh sách giao dịch' };
  }
};

// Fetch summary statistics
export const fetchSummary = async (filters = {}) => {
  try {
    const queryString = buildQueryString(filters);
    const response = await fetch(`${API_BASE_URL}/cash-transactions/summary?${queryString}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching summary:', error);
    return { error: true, message: 'Lỗi khi tải thống kê' };
  }
};

// Fetch single transaction
export const fetchTransactionById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cash-transactions/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return { error: true, message: 'Lỗi khi tải giao dịch' };
  }
};

// Create transaction
export const createTransaction = async (transactionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cash-transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating transaction:', error);
    return { error: true, message: 'Lỗi khi tạo giao dịch' };
  }
};

// Update transaction
export const updateTransaction = async (id, transactionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cash-transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating transaction:', error);
    return { error: true, message: 'Lỗi khi cập nhật giao dịch' };
  }
};

// Delete transaction
export const deleteTransaction = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cash-transactions/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return { error: true, message: 'Lỗi khi xóa giao dịch' };
  }
};

