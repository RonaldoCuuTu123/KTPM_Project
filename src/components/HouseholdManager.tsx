
import React, { useState, useEffect } from 'react';
/* Add Users to the lucide-react import list */
import { Plus, Search, Eye, Edit2, Split, Trash2, X, ChevronRight, Users } from 'lucide-react';
import { Household, Resident, Gender, ResidentStatus } from '@/types';
import { api } from '@/services/api';

interface HouseholdManagerProps {
  households: Household[];
  setHouseholds: React.Dispatch<React.SetStateAction<Household[]>>;
}

const HouseholdManager: React.FC<HouseholdManagerProps> = ({ households, setHouseholds }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredHouseholds = households.filter(h =>
    h.headName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.householdNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddHousehold = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      setIsLoading(true);
      setError(null);

      const newHouseholdData = {
        householdNumber: formData.get('number') as string,
        headName: formData.get('headName') as string,
        address: formData.get('address') as string,
        street: formData.get('street') as string,
        ward: 'La Khê',
        district: 'Hà Đông',
      };

      // Gọi API tạo mới hộ khẩu
      await api.createHousehold(newHouseholdData);

      // Refresh lại danh sách từ API
      const updatedHouseholds = await api.getHouseholds();
      setHouseholds(updatedHouseholds);

      setIsAddModalOpen(false);
      // Reset form
      (e.target as HTMLFormElement).reset();
      alert('Thêm hộ khẩu thành công!');
    } catch (err) {
      console.error('Lỗi thêm hộ khẩu:', err);
      setError('Có lỗi xảy ra khi thêm hộ khẩu. Vui lòng thử lại.');
      alert('Lỗi: Có lỗi xảy ra khi thêm hộ khẩu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm chủ hộ, số hộ khẩu, địa chỉ..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold shadow-lg shadow-blue-600/20 transition-all"
        >
          <Plus className="w-5 h-5" />
          Thêm hộ khẩu mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Số hộ khẩu</th>
                <th className="px-6 py-4">Chủ hộ</th>
                <th className="px-6 py-4">Địa chỉ</th>
                <th className="px-6 py-4">Nhân khẩu</th>
                <th className="px-6 py-4">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHouseholds.map(h => (
                <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-blue-600">{h.householdNumber}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{h.headName}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{h.address}, {h.street}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded">
                      {h.members.length}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedHousehold(h)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-amber-50 text-amber-600 rounded-lg transition-colors" title="Tách hộ">
                        <Split className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">Đăng ký Hộ khẩu mới</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleAddHousehold} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Số hộ khẩu</label>
                  <input name="number" required className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20" placeholder="HK-2024-..." />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Họ tên chủ hộ</label>
                  <input name="headName" required className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20" placeholder="Nguyễn Văn A" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Số nhà</label>
                <input name="address" required className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20" placeholder="Số 12A" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Đường/Ấp</label>
                <input name="street" required className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20" placeholder="Phố Lê Trọng Tấn" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50">Hủy</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20">Xác nhận</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedHousehold && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-800 text-xl">Sổ hộ khẩu: {selectedHousehold.householdNumber}</h3>
                <p className="text-sm text-slate-500">Chủ hộ: {selectedHousehold.headName}</p>
              </div>
              <button onClick={() => setSelectedHousehold(null)} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="mb-8 bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-6">
                <div className="w-24 h-24 bg-blue-200 rounded-xl flex items-center justify-center">
                  <FileText className="w-12 h-12 text-blue-600" />
                </div>
                <div className="grid grid-cols-2 flex-1 gap-y-2 text-sm">
                  <div className="text-slate-500">Địa chỉ:</div>
                  <div className="font-semibold text-slate-800">{selectedHousehold.address}, {selectedHousehold.street}</div>
                  <div className="text-slate-500">Phường/Xã:</div>
                  <div className="font-semibold text-slate-800">{selectedHousehold.ward}</div>
                  <div className="text-slate-500">Quận/Huyện:</div>
                  <div className="font-semibold text-slate-800">{selectedHousehold.district}</div>
                  <div className="text-slate-500">Ngày đăng ký:</div>
                  <div className="font-semibold text-slate-800">{selectedHousehold.history[0]?.date}</div>
                </div>
              </div>

              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Danh sách nhân khẩu ({selectedHousehold.members.length})
              </h4>
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr className="text-left">
                      <th className="px-4 py-3">Họ và tên</th>
                      <th className="px-4 py-3">Ngày sinh</th>
                      <th className="px-4 py-3">Quan hệ</th>
                      <th className="px-4 py-3">CMND/CCCD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedHousehold.members.length > 0 ? (
                      selectedHousehold.members.map(m => (
                        <tr key={m.id} className="border-t border-slate-100">
                          <td className="px-4 py-3 font-medium text-slate-800">{m.fullName}</td>
                          <td className="px-4 py-3 text-slate-600">{m.dob}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${m.relationToHead === 'Chủ hộ' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                              {m.relationToHead}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{m.idCardNumber || 'Chưa cập nhật'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-slate-400 italic">Chưa có nhân khẩu nào được đăng ký</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <h4 className="font-bold text-slate-800 mt-8 mb-4">Lịch sử thay đổi</h4>
              <div className="space-y-3">
                {selectedHousehold.history.map(item => (
                  <div key={item.id} className="flex gap-4 items-start">
                    <div className="text-xs font-bold text-slate-400 w-24 pt-1">{item.date}</div>
                    <div className="flex-1 p-3 bg-slate-50 rounded-lg text-sm text-slate-700 border border-slate-100">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FileText = ({ className }: any) => <FileTextIcon className={className} />;
const FileTextIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>;

export default HouseholdManager;
