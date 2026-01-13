import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Save, Search, Users, Filter } from 'lucide-react';
import { Household, Resident, Gender, ResidentStatus } from '../types';

interface ResidentManagerProps {
  households: Household[];
  setHouseholds: (households: Household[]) => void;
  apiRequest?: (endpoint: string, options?: RequestInit) => Promise<any>;
  reloadData?: () => Promise<void>;
  isOnline?: boolean;
}

const ResidentManager: React.FC<ResidentManagerProps> = ({
  households,
  setHouseholds,
  apiRequest,
  reloadData,
  isOnline = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<ResidentStatus | 'ALL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [selectedHouseholdId, setSelectedHouseholdId] = useState('');

  const [formData, setFormData] = useState<Partial<Resident>>({
    fullName: '',
    dob: '',
    gender: Gender.MALE,
    birthPlace: '',
    origin: '',
    ethnicity: 'Kinh',
    job: '',
    workPlace: '',
    idCardNumber: '',
    idCardDate: '',
    idCardPlace: '',
    registrationDate: new Date().toISOString().split('T')[0],
    relationToHead: '',
    status: ResidentStatus.ACTIVE,
    notes: ''
  });

  // Lấy tất cả nhân khẩu từ các hộ
  const allResidents = households.flatMap(h =>
    (h.members || []).map(m => ({
      ...m,
      householdId: h.id,
      householdNumber: h.householdNumber,
      headName: h.headName,
      address: `${h.address}, ${h.street}`
    }))
  );

  // Lọc nhân khẩu
  const filteredResidents = allResidents.filter(r => {
    const matchSearch = r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.idCardNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.householdNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleSave = async () => {
    try {
      if (!formData.fullName || !formData.dob || !selectedHouseholdId) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
      }

      const targetHousehold = households.find(h => h.id === selectedHouseholdId);
      if (!targetHousehold) {
        alert('Không tìm thấy hộ khẩu!');
        return;
      }

      let updatedHousehold: Household;

      if (editingResident) {
        // Cập nhật nhân khẩu
        updatedHousehold = {
          ...targetHousehold,
          members: targetHousehold.members.map(m =>
            m.id === editingResident.id ? { ...formData, id: m.id, householdId: selectedHouseholdId } as Resident : m
          )
        };
      } else {
        // Thêm nhân khẩu mới
        const newResident: Resident = {
          ...formData as Resident,
          id: `R${Date.now()}`,
          householdId: selectedHouseholdId
        };
        updatedHousehold = {
          ...targetHousehold,
          members: [...(targetHousehold.members || []), newResident]
        };
      }

      if (isOnline && apiRequest) {
        // Gọi API cập nhật hộ khẩu
        await apiRequest(`/households/${selectedHouseholdId}`, {
          method: 'PUT',
          body: JSON.stringify(updatedHousehold)
        });

        if (reloadData) await reloadData();
        alert('✅ Đã lưu nhân khẩu vào database!');
      } else {
        // Offline mode
        setHouseholds(households.map(h => h.id === selectedHouseholdId ? updatedHousehold : h));
        alert('⚠️ Chế độ offline: Dữ liệu chỉ lưu tạm thời!');
      }

      closeModal();
    } catch (error) {
      console.error('Error saving resident:', error);
      alert('❌ Lỗi khi lưu: ' + (error as Error).message);
    }
  };

  const handleDelete = async (resident: any) => {
    if (!confirm(`Bạn có chắc muốn xóa nhân khẩu "${resident.fullName}"?`)) return;

    try {
      const targetHousehold = households.find(h => h.id === resident.householdId);
      if (!targetHousehold) return;

      const updatedHousehold = {
        ...targetHousehold,
        members: targetHousehold.members.filter(m => m.id !== resident.id)
      };

      if (isOnline && apiRequest) {
        await apiRequest(`/households/${resident.householdId}`, {
          method: 'PUT',
          body: JSON.stringify(updatedHousehold)
        });

        if (reloadData) await reloadData();
        alert('✅ Đã xóa khỏi database!');
      } else {
        setHouseholds(households.map(h => h.id === resident.householdId ? updatedHousehold : h));
        alert('⚠️ Chế độ offline: Dữ liệu chỉ xóa tạm thời!');
      }
    } catch (error) {
      console.error('Error deleting resident:', error);
      alert('❌ Lỗi khi xóa: ' + (error as Error).message);
    }
  };

  const handleEdit = (resident: any) => {
    setEditingResident(resident);
    setSelectedHouseholdId(resident.householdId);
    setFormData({
      fullName: resident.fullName,
      alias: resident.alias,
      dob: resident.dob,
      gender: resident.gender,
      birthPlace: resident.birthPlace,
      origin: resident.origin,
      ethnicity: resident.ethnicity,
      job: resident.job,
      workPlace: resident.workPlace,
      idCardNumber: resident.idCardNumber,
      idCardDate: resident.idCardDate,
      idCardPlace: resident.idCardPlace,
      registrationDate: resident.registrationDate,
      previousAddress: resident.previousAddress,
      relationToHead: resident.relationToHead,
      status: resident.status,
      notes: resident.notes,
      moveDate: resident.moveDate,
      moveDestination: resident.moveDestination
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingResident(null);
    setSelectedHouseholdId('');
    setFormData({
      fullName: '',
      dob: '',
      gender: Gender.MALE,
      birthPlace: '',
      origin: '',
      ethnicity: 'Kinh',
      job: '',
      workPlace: '',
      idCardNumber: '',
      idCardDate: '',
      idCardPlace: '',
      registrationDate: new Date().toISOString().split('T')[0],
      relationToHead: '',
      status: ResidentStatus.ACTIVE,
      notes: ''
    });
  };

  const getStatusColor = (status: ResidentStatus) => {
    switch (status) {
      case ResidentStatus.ACTIVE:
        return 'bg-green-100 text-green-700 border-green-200';
      case ResidentStatus.TEMPORARY_RESIDENT:
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case ResidentStatus.TEMPORARY_ABSENT:
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case ResidentStatus.MOVED:
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case ResidentStatus.DECEASED:
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản lý Nhân khẩu</h2>
          <p className="text-slate-500">Tổng số: {allResidents.length} người</p>
        </div>
        <button
          onClick={() => {
            setEditingResident(null);
            setSelectedHouseholdId('');
            setFormData({
              fullName: '',
              dob: '',
              gender: Gender.MALE,
              birthPlace: '',
              origin: '',
              ethnicity: 'Kinh',
              job: '',
              workPlace: '',
              idCardNumber: '',
              idCardDate: '',
              idCardPlace: '',
              registrationDate: new Date().toISOString().split('T')[0],
              relationToHead: '',
              status: ResidentStatus.ACTIVE,
              notes: ''
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
        >
          <Plus className="w-5 h-5" />
          Thêm nhân khẩu
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, CMND, số hộ khẩu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Filter className="w-5 h-5 text-slate-400" />
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
          >
            Tất cả ({allResidents.length})
          </button>
          <button
            onClick={() => setFilterStatus(ResidentStatus.ACTIVE)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === ResidentStatus.ACTIVE ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
          >
            Thường trú ({allResidents.filter(r => r.status === ResidentStatus.ACTIVE).length})
          </button>
          <button
            onClick={() => setFilterStatus(ResidentStatus.TEMPORARY_RESIDENT)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === ResidentStatus.TEMPORARY_RESIDENT ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
          >
            Tạm trú ({allResidents.filter(r => r.status === ResidentStatus.TEMPORARY_RESIDENT).length})
          </button>
          <button
            onClick={() => setFilterStatus(ResidentStatus.TEMPORARY_ABSENT)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === ResidentStatus.TEMPORARY_ABSENT ? 'bg-orange-600 text-white' : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
              }`}
          >
            Tạm vắng ({allResidents.filter(r => r.status === ResidentStatus.TEMPORARY_ABSENT).length})
          </button>
        </div>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {filteredResidents.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Không tìm thấy nhân khẩu nào</p>
          </div>
        ) : (
          filteredResidents.map((resident) => (
            <div key={resident.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-lg font-bold text-blue-600">
                      {resident.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{resident.fullName}</h3>
                      <p className="text-sm text-slate-500">{resident.relationToHead}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(resident.status)}`}>
                      {resident.status}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-slate-500">Hộ khẩu:</span>
                      <p className="font-medium text-slate-800">{resident.headName} ({resident.householdNumber})</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Ngày sinh:</span>
                      <p className="font-medium text-slate-800">{new Date(resident.dob).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Giới tính:</span>
                      <p className="font-medium text-slate-800">{resident.gender}</p>
                    </div>
                    {resident.idCardNumber && (
                      <div>
                        <span className="text-slate-500">CMND/CCCD:</span>
                        <p className="font-medium text-slate-800">{resident.idCardNumber}</p>
                      </div>
                    )}
                    {resident.job && (
                      <div>
                        <span className="text-slate-500">Nghề nghiệp:</span>
                        <p className="font-medium text-slate-800">{resident.job}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-500">Địa chỉ:</span>
                      <p className="font-medium text-slate-800">{resident.address}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(resident)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(resident)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full my-8">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">
                {editingResident ? 'Chỉnh sửa nhân khẩu' : 'Thêm nhân khẩu mới'}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Chọn hộ khẩu */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Hộ khẩu <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedHouseholdId}
                  onChange={(e) => setSelectedHouseholdId(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!!editingResident}
                >
                  <option value="">Chọn hộ khẩu</option>
                  {households.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.headName} - {h.householdNumber} ({h.address}, {h.street})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Thông tin cơ bản */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tên khác (Bí danh)</label>
                  <input
                    type="text"
                    value={formData.alias || ''}
                    onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ngày sinh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Giới tính</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={Gender.MALE}>Nam</option>
                    <option value={Gender.FEMALE}>Nữ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nơi sinh</label>
                  <input
                    type="text"
                    value={formData.birthPlace}
                    onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Hà Nội"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nguyên quán</label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nam Định"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Dân tộc</label>
                  <input
                    type="text"
                    value={formData.ethnicity}
                    onChange={(e) => setFormData({ ...formData, ethnicity: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Kinh"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nghề nghiệp</label>
                  <input
                    type="text"
                    value={formData.job || ''}
                    onChange={(e) => setFormData({ ...formData, job: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Kỹ sư"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nơi làm việc</label>
                  <input
                    type="text"
                    value={formData.workPlace || ''}
                    onChange={(e) => setFormData({ ...formData, workPlace: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Công ty ABC"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Số CMND/CCCD</label>
                  <input
                    type="text"
                    value={formData.idCardNumber || ''}
                    onChange={(e) => setFormData({ ...formData, idCardNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="001234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Ngày cấp</label>
                  <input
                    type="date"
                    value={formData.idCardDate || ''}
                    onChange={(e) => setFormData({ ...formData, idCardDate: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nơi cấp</label>
                  <input
                    type="text"
                    value={formData.idCardPlace || ''}
                    onChange={(e) => setFormData({ ...formData, idCardPlace: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Ngày đăng ký</label>
                  <input
                    type="date"
                    value={formData.registrationDate}
                    onChange={(e) => setFormData({ ...formData, registrationDate: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Quan hệ với chủ hộ</label>
                  <input
                    type="text"
                    value={formData.relationToHead}
                    onChange={(e) => setFormData({ ...formData, relationToHead: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Con"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ResidentStatus })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={ResidentStatus.ACTIVE}>Thường trú</option>
                    <option value={ResidentStatus.TEMPORARY_RESIDENT}>Tạm trú</option>
                    <option value={ResidentStatus.TEMPORARY_ABSENT}>Tạm vắng</option>
                    <option value={ResidentStatus.MOVED}>Đã chuyển đi</option>
                    <option value={ResidentStatus.DECEASED}>Đã qua đời</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Ghi chú</label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Ghi chú thêm..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={closeModal}
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

export default ResidentManager;