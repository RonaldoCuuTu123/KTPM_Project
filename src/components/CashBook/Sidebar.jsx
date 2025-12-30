import { useState } from 'react';
import './CashBook.css';

function Sidebar({ filters, onFilterChange }) {
  const [collapsedSections, setCollapsedSections] = useState({
    search: true,
    branch: true,
    transactionType: true,
    documentType: true,
    accounting: true,
    time: true
  });

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  return (
    <div className="cash-book-sidebar">
      <div className="sidebar-tabs">
        <button 
          className={`tab-button ${filters.paymentMethod === 'Tiền mặt' ? 'active' : ''}`}
          onClick={() => handleInputChange('paymentMethod', 'Tiền mặt')}
        >
          TIỀN MẶT
        </button>
        <button 
          className={`tab-button ${filters.paymentMethod === 'Ngân hàng' ? 'active' : ''}`}
          onClick={() => handleInputChange('paymentMethod', 'Ngân hàng')}
        >
          NGÂN HÀNG
        </button>
      </div>

      <div className="sidebar-content">
        <div className="search-section">
          <button 
            className="filter-toggle-btn"
            onClick={() => toggleSection('search')}
          >
            Tìm kiếm <span className="arrow">▼</span>
          </button>
          {!collapsedSections.search && (
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm"
              value={filters.search}
              onChange={(e) => handleInputChange('search', e.target.value)}
            />
          )}
        </div>

        <div className="filter-section">
          <button 
            className="filter-toggle-btn"
            onClick={() => toggleSection('branch')}
          >
            Lọc theo chi nhánh <span className="arrow">▼</span>
          </button>
          {!collapsedSections.branch && (
            <div className="filter-content">
              <select 
                className="filter-select"
                value={filters.branchId}
                onChange={(e) => handleInputChange('branchId', e.target.value)}
              >
                <option value="">Tất cả chi nhánh</option>
                {/* Options sẽ được load từ API */}
              </select>
            </div>
          )}
        </div>

        <div className="filter-section">
          <button 
            className="filter-toggle-btn"
            onClick={() => toggleSection('transactionType')}
          >
            Loại thu chi <span className="arrow">▼</span>
          </button>
          {!collapsedSections.transactionType && (
            <div className="filter-content">
              <select 
                className="filter-select"
                value={filters.transactionTypeId}
                onChange={(e) => handleInputChange('transactionTypeId', e.target.value)}
              >
                <option value="">Tất cả loại thu chi</option>
                {/* Options sẽ được load từ API */}
              </select>
            </div>
          )}
        </div>

        <div className="filter-section">
          <button 
            className="filter-toggle-btn"
            onClick={() => toggleSection('documentType')}
          >
            Loại chứng từ <span className="arrow">▼</span>
          </button>
          {!collapsedSections.documentType && (
            <div className="filter-content">
              <label className="radio-label">
                <input
                  type="radio"
                  name="documentType"
                  value="Phiếu thu"
                  checked={filters.documentType === 'Phiếu thu'}
                  onChange={(e) => handleInputChange('documentType', e.target.value)}
                />
                <span>Phiếu thu</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="documentType"
                  value="Phiếu chi"
                  checked={filters.documentType === 'Phiếu chi'}
                  onChange={(e) => handleInputChange('documentType', e.target.value)}
                />
                <span>Phiếu chi</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="documentType"
                  value=""
                  checked={!filters.documentType || filters.documentType === ''}
                  onChange={(e) => handleInputChange('documentType', '')}
                />
                <span>Tất cả</span>
              </label>
            </div>
          )}
        </div>

        <div className="filter-section">
          <button 
            className="filter-toggle-btn"
            onClick={() => toggleSection('accounting')}
          >
            Kết quả Kinh Doanh <span className="arrow">▼</span>
          </button>
          {!collapsedSections.accounting && (
            <div className="filter-content">
              <label className="radio-label">
                <input
                  type="radio"
                  name="isAccounting"
                  value="true"
                  checked={filters.isAccounting === 'true'}
                  onChange={(e) => handleInputChange('isAccounting', e.target.value)}
                />
                <span>Đưa vào hạch toán</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="isAccounting"
                  value="false"
                  checked={filters.isAccounting === 'false'}
                  onChange={(e) => handleInputChange('isAccounting', e.target.value)}
                />
                <span>Không hạch toán</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="isAccounting"
                  value="all"
                  checked={filters.isAccounting === 'all' || !filters.isAccounting}
                  onChange={(e) => handleInputChange('isAccounting', e.target.value)}
                />
                <span>Tất cả</span>
              </label>
            </div>
          )}
        </div>

        <div className="filter-section">
          <button 
            className="filter-toggle-btn"
            onClick={() => toggleSection('time')}
          >
            Lọc thời gian <span className="arrow">▼</span>
          </button>
          {!collapsedSections.time && (
            <div className="filter-content">
              <label className="radio-label">
                <input
                  type="radio"
                  name="timeFilter"
                  value="all"
                  checked={filters.timeFilter === 'all' || !filters.timeFilter}
                  onChange={(e) => handleInputChange('timeFilter', e.target.value)}
                />
                <span>Toàn thời gian</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="timeFilter"
                  value="today"
                  checked={filters.timeFilter === 'today'}
                  onChange={(e) => handleInputChange('timeFilter', e.target.value)}
                />
                <span>Hôm nay</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="timeFilter"
                  value="thisWeek"
                  checked={filters.timeFilter === 'thisWeek'}
                  onChange={(e) => handleInputChange('timeFilter', e.target.value)}
                />
                <span>Tuần này</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="timeFilter"
                  value="thisMonth"
                  checked={filters.timeFilter === 'thisMonth'}
                  onChange={(e) => handleInputChange('timeFilter', e.target.value)}
                />
                <span>Tháng này</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="timeFilter"
                  value="thisYear"
                  checked={filters.timeFilter === 'thisYear'}
                  onChange={(e) => handleInputChange('timeFilter', e.target.value)}
                />
                <span>Năm nay</span>
              </label>
              <div className="date-range">
                <label>Khoảng thời gian tùy chỉnh:</label>
                <input
                  type="date"
                  className="date-input"
                  value={filters.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  placeholder="Từ ngày"
                />
                <input
                  type="date"
                  className="date-input"
                  value={filters.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  placeholder="Đến ngày"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

