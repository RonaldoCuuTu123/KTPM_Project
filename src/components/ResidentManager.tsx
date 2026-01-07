
import React, { useState } from 'react';
import { Search, UserPlus, Filter, MoreVertical, MapPin, Briefcase, Calendar, ChevronRight, X } from 'lucide-react';
import { Household, Resident, Gender, ResidentStatus } from '@/types';

interface ResidentManagerProps {
  households: Household[];
  setHouseholds: React.Dispatch<React.SetStateAction<Household[]>>;
}

const ResidentManager: React.FC<ResidentManagerProps> = ({ households, setHouseholds }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);

  const allResidents = households.flatMap(h => h.members);
  
  const filteredResidents = allResidents.filter(r => 
    r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.idCardNumber?.includes(searchTerm)
  );

  const handleAddResident = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const householdId = formData.get('householdId') as string;
    
    const newResident: Resident = {
      id: `R${Date.now()}`,
      fullName: formData.get('fullName') as string,
      dob: formData.get('dob') as string,
      gender: formData.get('gender') as Gender,
      birthPlace: formData.get('birthPlace') as string,
      origin: formData.get('origin') as string,
      ethnicity: formData.get('ethnicity') as string,
      job: formData.get('job') as string,
      idCardNumber: formData.get('idCardNumber') as string,
      registrationDate: new Date().toISOString().split('T')[0],
      relationToHead: formData.get('relationToHead') as string,
      status: ResidentStatus.ACTIVE,
      householdId: householdId
    };

    setHouseholds(prev => prev.map(h => {
      if (h.id === householdId) {
        return {
          ...h,
          members: [...h.members, newResident],
          history: [...h.history, {
            id: `HIST${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            content: `Thêm nhân khẩu mới: ${newResident.fullName}`
          }]
        };
      }
      return h;
    }));

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex flex-1 w-full gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Tìm theo tên, số CCCD..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600">
            <Filter className="w-5 h-5" />
          </button>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold shadow-lg shadow-blue-600/20"
        >
          <UserPlus className="w-5 h-5" />
          Khai báo nhân khẩu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredResidents.map(r => (
          <div 
            key={r.id} 
            className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedResident(r)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${r.gender === Gender.MALE ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                  {r.fullName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{r.fullName}</h4>
                  <p className="text-sm text-slate-500">{r.relationToHead}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border ${
                r.status === ResidentStatus.ACTIVE ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'
              }`}>
                {r.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{r.dob}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>Quê quán: {r.origin}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span>{r.job || 'Chưa có nghề nghiệp'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-semibold text-slate-400">
              <span>Hộ: {households.find(h => h.id === r.householdId)?.householdNumber}</span>
              <span className="flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                Chi tiết <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Resident Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">Khai báo Nhân khẩu mới</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleAddResident} className="p-6 overflow-y-auto max-h-[80vh]">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Hộ gia đình</label>
                  <select name="householdId" required className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20">
                    <option value="">Chọn hộ khẩu...</option>
                    {households.map(h => (
                      <option key={h.id} value={h.id}>{h.householdNumber} - Chủ hộ: {h.headName}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Họ và tên</label>
                  <input name="fullName" required className="w-full px-3 py-2 border border-slate-200 rounded-xl" placeholder="Nguyễn Văn A" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Ngày sinh</label>
                  <input name="dob" type="date" required className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Giới tính</label>
                  <select name="gender" required className="w-full px-3 py-2 border border-slate-200 rounded-xl">
                    <option value={Gender.MALE}>Nam</option>
                    <option value={Gender.FEMALE}>Nữ</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Quan hệ với chủ hộ</label>
                  <input name="relationToHead" required className="w-full px-3 py-2 border border-slate-200 rounded-xl" placeholder="Con, Vợ, Chồng..." />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Nguyên quán</label>
                  <input name="origin" required className="w-full px-3 py-2 border border-slate-200 rounded-xl" placeholder="Xã, Huyện, Tỉnh" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Số CCCD (nếu có)</label>
                  <input name="idCardNumber" className="w-full px-3 py-2 border border-slate-200 rounded-xl" placeholder="001..." />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Nghề nghiệp</label>
                  <input name="job" className="w-full px-3 py-2 border border-slate-200 rounded-xl" placeholder="Kỹ sư..." />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50">Hủy</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20">Xác nhận</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidentManager;
