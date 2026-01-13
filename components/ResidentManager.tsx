
import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  Filter, 
  MapPin, 
  Briefcase, 
  Calendar, 
  ChevronRight, 
  X, 
  Info, 
  Fingerprint, 
  Link2,
  User
} from 'lucide-react';
import { Household, Resident, Gender, ResidentStatus } from '../types';

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
    const status = formData.get('status') as ResidentStatus;
    
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
      status: status,
      notes: formData.get('notes') as string,
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
            content: `Khai báo ${status.toLowerCase()}: ${newResident.fullName}`
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
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-sm bg-white">
            <Filter className="w-5 h-5" />
          </button>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          Khai báo mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredResidents.map(r => (
          <div 
            key={r.id} 
            className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedResident(r)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-inner ${r.gender === Gender.MALE ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
                  {r.fullName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{r.fullName}</h4>
                  <p className="text-sm text-slate-500 font-medium">{r.relationToHead}</p>
                </div>
              </div>
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg border shadow-sm ${
                r.status === ResidentStatus.ACTIVE 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                  : r.status === ResidentStatus.TEMPORARY_RESIDENT
                  ? 'bg-blue-50 text-blue-700 border-blue-100'
                  : 'bg-amber-50 text-amber-700 border-amber-100'
              }`}>
                {r.status}
              </span>
            </div>
            
            <div className="space-y-3 mb-5">
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="font-medium">{r.dob}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="truncate">Quê quán: {r.origin}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span className="truncate">{r.job || 'Chưa cập nhật nghề nghiệp'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-400">
              <div className="flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5" />
                Hộ: {households.find(h => h.id === r.householdId)?.householdNumber}
              </div>
              <span className="flex items-center gap-1 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
                Chi tiết <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modernized Add Resident Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-300">
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <div>
                <h3 className="font-extrabold text-slate-900 text-2xl tracking-tight">Khai báo Cư trú</h3>
                <p className="text-slate-500 text-sm mt-1">Vui lòng điền đầy đủ các thông tin nhân khẩu dưới đây.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleAddResident} className="flex-1 overflow-y-auto max-h-[75vh]">
              <div className="p-8 space-y-8">
                
                {/* Section 1: Household Context */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <Link2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">Thông tin định danh hộ khẩu</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 ml-1">Thuộc hộ gia đình <span className="text-rose-500">*</span></label>
                      <select name="householdId" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium">
                        <option value="">-- Chọn hộ khẩu --</option>
                        {households.map(h => (
                          <option key={h.id} value={h.id}>{h.householdNumber} - {h.headName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 ml-1">Loại hình cư trú <span className="text-rose-500">*</span></label>
                      <select name="status" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium">
                        <option value={ResidentStatus.ACTIVE}>Thường trú</option>
                        <option value={ResidentStatus.TEMPORARY_RESIDENT}>Tạm trú</option>
                        <option value={ResidentStatus.TEMPORARY_ABSENT}>Tạm vắng</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100"></div>

                {/* Section 2: Personal Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">Thông tin cá nhân</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 ml-1">Họ và tên <span className="text-rose-500">*</span></label>
                      <input name="fullName" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" placeholder="Ví dụ: Nguyễn Văn A" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 ml-1">Ngày sinh <span className="text-rose-500">*</span></label>
                        <input name="dob" type="date" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 ml-1">Giới tính <span className="text-rose-500">*</span></label>
                        <select name="gender" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium">
                          <option value={Gender.MALE}>Nam</option>
                          <option value={Gender.FEMALE}>Nữ</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 ml-1">Quan hệ với chủ hộ <span className="text-rose-500">*</span></label>
                      <input name="relationToHead" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" placeholder="Con, Vợ, Chồng..." />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 ml-1">Dân tộc</label>
                      <input name="ethnicity" defaultValue="Kinh" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100"></div>

                {/* Section 3: Identity & Background */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <Fingerprint className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">Định danh & Nghề nghiệp</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 ml-1">Số CCCD/CMND</label>
                      <input name="idCardNumber" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" placeholder="001..." />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 ml-1">Nghề nghiệp</label>
                      <input name="job" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" placeholder="Kỹ sư, Sinh viên..." />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 ml-1">Nguyên quán</label>
                      <input name="origin" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" placeholder="Xã, Huyện, Tỉnh" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 ml-1">Nơi sinh</label>
                      <input name="birthPlace" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" placeholder="Bệnh viện Phụ sản..." />
                    </div>
                  </div>
                </div>

                {/* Section 4: Notes */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <Info className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">Ghi chú bổ sung</span>
                  </div>
                  <textarea name="notes" rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none" placeholder="Lý do tạm vắng/tạm trú, thời hạn dự kiến..."></textarea>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-6 py-3.5 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-white hover:border-slate-300 transition-all">
                  Hủy bỏ
                </button>
                <button type="submit" className="flex-[2] px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98]">
                  Hoàn tất Khai báo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidentManager;
