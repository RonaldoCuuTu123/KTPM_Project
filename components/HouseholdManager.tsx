import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Save, Search, Home } from 'lucide-react';
import { Household, Resident, Gender, ResidentStatus } from '../types';

interface HouseholdManagerProps {
  households: Household[];
  setHouseholds: (households: Household[]) => void;
  apiRequest?: (endpoint: string, options?: RequestInit) => Promise<any>;
  reloadData?: () => Promise<void>;
  isOnline?: boolean;
}

const HouseholdManager: React.FC<HouseholdManagerProps> = ({
  households,
  setHouseholds,
  apiRequest,
  reloadData,
  isOnline = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHousehold, setEditingHousehold] = useState<Household | null>(null);
  const [formData, setFormData] = useState<Partial<Household>>({
    householdNumber: '',
    headName: '',
    address: '',
    street: '',
    ward: 'La Khê',
    district: 'Hà Đông',
    members: [],
    history: []
  });

  const handleSave = async () => {
    try {
      if (!isOnline || !apiRequest) {
        // Offline mode - local only
        if (editingHousehold) {
          setHouseholds(households.map(h => h.id === editingHousehold.id ? { ...formData, id: h.id } as Household : h));
        } else {
          const newHousehold: Household = {
            ...formData as Household,
            id: `HH${Date.now()}`,
            members: formData.members || [],
            history: formData.history || []
          };
          setHouseholds([...households, newHousehold]);
        }
        alert('⚠️ Chế độ offline: Dữ liệu chỉ lưu tạm thời!');
      } else {
        // Online mode - save to backend
        if (editingHousehold) {
          await apiRequest(`/households/${editingHousehold.id}`, {
            method: 'PUT',
            body: JSON.stringify(formData)
          });
        } else {
          await apiRequest('/households', {
            method: 'POST',
            body: JSON.stringify(formData)
          });
        }

        // Reload data from server
        if (reloadData) await reloadData();
        alert('✅ Đã lưu thành công vào database!');
      }

      setIsModalOpen(false);
      setEditingHousehold(null);
      setFormData({
        householdNumber: '',
        headName: '',
        address: '',
        street: '',
        ward: 'La Khê',
        district: 'Hà Đông',
        members: [],
        history: []
      });
    } catch (error) {
      console.error('Error saving household:', error);
      alert('❌ Lỗi khi lưu dữ liệu: ' + (error as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa hộ khẩu này?')) return;

    try {
      if (isOnline && apiRequest) {
        await apiRequest(`/households/${id}`, { method: 'DELETE' });
        if (reloadData) await reloadData();
        alert('✅ Đã xóa khỏi database!');
      } else {
        setHouseholds(households.filter(h => h.id !== id));
        alert('⚠️ Chế độ offline: Dữ liệu chỉ xóa tạm thời!');
      }
    } catch (error) {
      console.error('Error deleting household:', error);
      alert('❌ Lỗi khi xóa: ' + (error as Error).message);
    }
  };

  const handleEdit = (household: Household) => {
    setEditingHousehold(household);
    setFormData(household);
    setIsModalOpen(true);
  };

  const filteredHouseholds = households.filter(h =>
    h.headName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.householdNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản lý Hộ khẩu</h2>
          <p className="text-slate-500">Tổng số: {households.length} hộ</p>
        </div>
        <button
          onClick={() => {
            setEditingHousehold(null);
            setFormData({
              householdNumber: '',
              headName: '',
              address: '',
              street: '',
              ward: 'La Khê',
              district: 'Hà Đông',
              members: [],
              history: []
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
        >
          <Plus className="w-5 h-5" />
          Thêm hộ mới
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên chủ hộ, số hộ khẩu, địa chỉ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {filteredHouseholds.map((household) => (
          <div key={household.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Home className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{household.headName}</h3>
                    <p className="text-sm text-slate-500">Số HK: {household.householdNumber}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-2 mt-3">
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Địa chỉ:</span> {household.address}, {household.street}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Số nhân khẩu:</span> {household.members?.length || 0} người
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(household)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(household.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">
                {editingHousehold ? 'Chỉnh sửa hộ khẩu' : 'Thêm hộ khẩu mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Số hộ khẩu</label>
                  <input
                    type="text"
                    value={formData.householdNumber}
                    onChange={(e) => setFormData({ ...formData, householdNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="HK-2024-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tên chủ hộ</label>
                  <input
                    type="text"
                    value={formData.headName}
                    onChange={(e) => setFormData({ ...formData, headName: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Số nhà</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Số 12A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Đường</label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Lê Trọng Tấn"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseholdManager;