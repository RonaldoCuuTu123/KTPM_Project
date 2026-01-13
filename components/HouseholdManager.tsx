
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Eye, 
  Split, 
  X, 
  Users, 
  FileText, 
  MapPin, 
  History, 
  UserCircle,
  ArrowRightLeft,
  Check
} from 'lucide-react';
import { Household, Resident, Gender, ResidentStatus } from '../types';

interface HouseholdManagerProps {
  households: Household[];
  setHouseholds: React.Dispatch<React.SetStateAction<Household[]>>;
}

const HouseholdManager: React.FC<HouseholdManagerProps> = ({ households, setHouseholds }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  
  // State for Split Household feature
  const [selectedMembersForSplit, setSelectedMembersForSplit] = useState<string[]>([]);
  const [newHouseholdNumber, setNewHouseholdNumber] = useState('');

  const filteredHouseholds = households.filter(h => 
    h.headName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.householdNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddHousehold = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newHousehold: Household = {
      id: `HH${Date.now()}`,
      householdNumber: formData.get('number') as string,
      headName: formData.get('headName') as string,
      address: formData.get('address') as string,
      street: formData.get('street') as string,
      ward: 'La Khê',
      district: 'Hà Đông',
      history: [{
        id: `HIST${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        content: 'Tạo mới hộ khẩu (Đăng ký thường trú)'
      }],
      members: []
    };

    setHouseholds([...households, newHousehold]);
    setIsAddModalOpen(false);
  };

  const handleSplitHousehold = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHousehold || selectedMembersForSplit.length === 0) return;

    const membersToMove = selectedHousehold.members.filter(m => selectedMembersForSplit.includes(m.id));
    const remainingMembers = selectedHousehold.members.filter(m => !selectedMembersForSplit.includes(m.id));

    // 1. Create new household
    const newId = `HH${Date.now()}`;
    const newHousehold: Household = {
      id: newId,
      householdNumber: newHouseholdNumber,
      headName: membersToMove[0].fullName, // Temporary head
      address: selectedHousehold.address,
      street: selectedHousehold.street,
      ward: selectedHousehold.ward,
      district: selectedHousehold.district,
      history: [{
        id: `H${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        content: `Tách hộ từ hộ ${selectedHousehold.householdNumber}`
      }],
      members: membersToMove.map(m => ({ ...m, householdId: newId, relationToHead: m.id === membersToMove[0].id ? 'Chủ hộ' : m.relationToHead }))
    };

    // 2. Update existing household
    const updatedHouseholds = households.map(h => {
      if (h.id === selectedHousehold.id) {
        return {
          ...h,
          members: remainingMembers,
          history: [...h.history, {
            id: `H${Date.now() + 1}`,
            date: new Date().toISOString().split('T')[0],
            content: `Tách ${membersToMove.length} nhân khẩu sang hộ mới ${newHouseholdNumber}`
          }]
        };
      }
      return h;
    });

    setHouseholds([...updatedHouseholds, newHousehold]);
    setIsSplitModalOpen(false);
    setSelectedHousehold(null);
    setSelectedMembersForSplit([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Tìm kiếm chủ hộ, số hộ khẩu, địa chỉ..." 
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Đăng ký Hộ khẩu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredHouseholds.map(h => (
          <div 
            key={h.id} 
            className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group overflow-hidden"
          >
            {/* "Book Cover" style header */}
            <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-blue-600 uppercase tracking-[0.2em]">Sổ hộ khẩu</p>
                  <p className="font-mono font-bold text-slate-800">{h.householdNumber}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => setSelectedHousehold(h)}
                  className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 transition-all shadow-sm"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => { setSelectedHousehold(h); setIsSplitModalOpen(true); }}
                  className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-amber-600 transition-all shadow-sm"
                >
                  <Split className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chủ hộ</label>
                <p className="text-lg font-bold text-slate-800 tracking-tight">{h.headName}</p>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  {h.address}, {h.street}, Phường {h.ward}, {h.district}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                <div className="flex -space-x-2">
                  {h.members.slice(0, 3).map((m, idx) => (
                    <div key={m.id} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                      {m.fullName.charAt(0)}
                    </div>
                  ))}
                  {h.members.length > 3 && (
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-600">
                      +{h.members.length - 3}
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {h.members.length} nhân khẩu
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal (The "Real" Sổ Hộ Khẩu View) */}
      {selectedHousehold && !isSplitModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            {/* Header / Cover Side */}
            <div className="grid grid-cols-1 md:grid-cols-3 h-full">
              {/* Left Sidebar Info */}
              <div className="bg-slate-900 text-white p-10 flex flex-col">
                <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-600/40">
                  <FileText className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-extrabold mb-2 tracking-tight">Sổ Hộ Khẩu</h3>
                <p className="text-slate-400 font-mono text-lg mb-8">{selectedHousehold.householdNumber}</p>
                
                <div className="space-y-6 flex-1">
                  <div>
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Chủ hộ</p>
                    <p className="text-xl font-bold">{selectedHousehold.headName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Địa chỉ cư trú</p>
                    <p className="text-slate-300 leading-relaxed font-medium">
                      {selectedHousehold.address}, {selectedHousehold.street}<br/>
                      Phường {selectedHousehold.ward}, Quận {selectedHousehold.district}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedHousehold(null)}
                  className="mt-8 flex items-center justify-center gap-2 py-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all font-bold"
                >
                  <X className="w-5 h-5" /> Đóng cửa sổ
                </button>
              </div>

              {/* Main Content Area */}
              <div className="md:col-span-2 flex flex-col bg-white overflow-hidden">
                <div className="p-10 overflow-y-auto">
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
                      <Users className="w-6 h-6 text-blue-600" />
                      Chi tiết Nhân khẩu
                    </h4>
                    <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold border border-blue-100">
                      {selectedHousehold.members.length} Thành viên
                    </span>
                  </div>

                  <div className="space-y-4">
                    {selectedHousehold.members.map((m) => (
                      <div key={m.id} className="group flex items-center justify-between p-5 rounded-3xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                        <div className="flex items-center gap-5">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm ${m.relationToHead === 'Chủ hộ' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                            {m.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{m.fullName}</p>
                            <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                              <span>{m.dob}</span>
                              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                              <span className={m.relationToHead === 'Chủ hộ' ? 'text-blue-600 font-bold' : ''}>{m.relationToHead}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-tighter">Số CCCD</p>
                          <p className="font-mono text-slate-700 font-medium">{m.idCardNumber || 'Chưa cấp'}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12">
                    <h4 className="text-xl font-extrabold text-slate-900 flex items-center gap-3 mb-6">
                      <History className="w-6 h-6 text-amber-600" />
                      Lịch sử biến động
                    </h4>
                    <div className="space-y-6 relative ml-3">
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-100"></div>
                      {selectedHousehold.history.map((item, idx) => (
                        <div key={item.id} className="relative pl-8">
                          <div className={`absolute left-[-4px] top-1.5 w-2 h-2 rounded-full border-2 border-white ${idx === 0 ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-slate-300'}`}></div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{item.date}</p>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-700 font-medium">
                            {item.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Split Household Modal */}
      {isSplitModalOpen && selectedHousehold && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
            <div className="p-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">Tách hộ khẩu</h3>
                  <p className="text-slate-500 font-medium">Chọn các thành viên để chuyển sang sổ hộ khẩu mới.</p>
                </div>
                <button onClick={() => setIsSplitModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSplitHousehold} className="space-y-8">
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700 ml-1">Số hộ khẩu mới <span className="text-rose-500">*</span></label>
                  <input 
                    required 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-mono font-bold"
                    placeholder="HK-2024-..."
                    value={newHouseholdNumber}
                    onChange={(e) => setNewHouseholdNumber(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700 ml-1">Chọn nhân khẩu di chuyển ({selectedMembersForSplit.length})</label>
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {selectedHousehold.members.map(m => (
                      <div 
                        key={m.id}
                        onClick={() => {
                          if (selectedMembersForSplit.includes(m.id)) {
                            setSelectedMembersForSplit(prev => prev.filter(id => id !== m.id));
                          } else {
                            setSelectedMembersForSplit(prev => [...prev, m.id]);
                          }
                        }}
                        className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                          selectedMembersForSplit.includes(m.id) 
                            ? 'bg-blue-50 border-blue-400 shadow-sm' 
                            : 'bg-white border-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${selectedMembersForSplit.includes(m.id) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                            {m.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{m.fullName}</p>
                            <p className="text-xs text-slate-500 font-medium">{m.relationToHead}</p>
                          </div>
                        </div>
                        {selectedMembersForSplit.includes(m.id) && (
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsSplitModalOpen(false)} className="flex-1 py-4 px-6 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
                    Hủy bỏ
                  </button>
                  <button 
                    type="submit" 
                    disabled={selectedMembersForSplit.length === 0 || !newHouseholdNumber}
                    className="flex-[2] py-4 px-6 bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold shadow-xl shadow-amber-600/20 hover:bg-amber-700 transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowRightLeft className="w-5 h-5" />
                    Xác nhận Tách hộ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="font-extrabold text-slate-900 text-xl tracking-tight">Đăng ký Hộ khẩu mới</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleAddHousehold} className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Số hộ khẩu <span className="text-rose-500">*</span></label>
                <input name="number" required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-mono font-bold" placeholder="HK-2024-..." />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Họ tên chủ hộ <span className="text-rose-500">*</span></label>
                <input name="headName" required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold" placeholder="Nguyễn Văn A" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Số nhà <span className="text-rose-500">*</span></label>
                  <input name="address" required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" placeholder="Số 12A" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Đường/Ấp <span className="text-rose-500">*</span></label>
                  <input name="street" required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" placeholder="Lê Trọng Tấn" />
                </div>
              </div>
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all">Hủy</button>
                <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all">Xác nhận đăng ký</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseholdManager;
