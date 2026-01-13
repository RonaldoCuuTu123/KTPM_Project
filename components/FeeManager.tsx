import React, { useState } from 'react';
import { CreditCard, Plus, Search, CheckCircle2, AlertCircle, Calendar, Wallet, Download, X } from 'lucide-react';
import { Household, FeeCampaign, Payment, FeeType } from '../types';

interface FeeManagerProps {
  households: Household[];
  fees: FeeCampaign[];
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  setFees: React.Dispatch<React.SetStateAction<FeeCampaign[]>>;
  apiRequest?: (endpoint: string, options?: RequestInit) => Promise<any>;
  reloadData?: () => Promise<void>;
  isOnline?: boolean;
}

const FeeManager: React.FC<FeeManagerProps> = ({
  households,
  fees,
  payments,
  setPayments,
  setFees,
  apiRequest,
  reloadData,
  isOnline = false
}) => {
  const [selectedCampaign, setSelectedCampaign] = useState<FeeCampaign | null>(fees[0]);
  const [isCollecting, setIsCollecting] = useState(false);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [selectedHouseholdId, setSelectedHouseholdId] = useState('');
  const [amount, setAmount] = useState(0);
  const [collectorName, setCollectorName] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'unpaid'>('all');

  const [campaignForm, setCampaignForm] = useState({
    name: '',
    type: FeeType.MANDATORY,
    amountPerMonthPerPerson: 0,
    startDate: new Date().toISOString().split('T')[0],
    description: ''
  });

  const campaignPayments = payments.filter(p => p.campaignId === selectedCampaign?.id);
  const paidHouseholdIds = new Set(campaignPayments.map(p => p.householdId));
  const totalAmountCollected = campaignPayments.reduce((acc, p) => acc + p.amount, 0);

  const handleCollect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign || !selectedHouseholdId) return;

    try {
      const paymentData = {
        householdId: selectedHouseholdId,
        campaignId: selectedCampaign.id,
        amount: amount,
        paymentDate: new Date().toISOString().split('T')[0],
        collectorName: collectorName || 'Nguyễn Văn Cường'
      };

      if (isOnline && apiRequest) {
        await apiRequest('/payments', {
          method: 'POST',
          body: JSON.stringify(paymentData)
        });
        if (reloadData) await reloadData();
        alert('✅ Đã lưu khoản thu vào database!');
      } else {
        const newPayment: Payment = {
          ...paymentData,
          id: `P${Date.now()}`
        };
        setPayments([...payments, newPayment]);
        alert('⚠️ Chế độ offline: Dữ liệu chỉ lưu tạm thời!');
      }

      setIsCollecting(false);
      setSelectedHouseholdId('');
      setAmount(0);
      setCollectorName('');
    } catch (error) {
      console.error('Error saving payment:', error);
      alert('❌ Lỗi khi lưu: ' + (error as Error).message);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!campaignForm.name || !campaignForm.description) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
      }

      if (isOnline && apiRequest) {
        await apiRequest('/fees', {
          method: 'POST',
          body: JSON.stringify(campaignForm)
        });
        if (reloadData) await reloadData();
        alert('✅ Đã tạo đợt thu vào database!');
      } else {
        const newCampaign: FeeCampaign = {
          ...campaignForm,
          id: `F${Date.now()}`
        };
        setFees([...fees, newCampaign]);
        setSelectedCampaign(newCampaign);
        alert('⚠️ Chế độ offline: Dữ liệu chỉ lưu tạm thời!');
      }

      setIsCreatingCampaign(false);
      setCampaignForm({
        name: '',
        type: FeeType.MANDATORY,
        amountPerMonthPerPerson: 0,
        startDate: new Date().toISOString().split('T')[0],
        description: ''
      });
    } catch (error) {
      console.error('Error saving campaign:', error);
      alert('❌ Lỗi khi lưu: ' + (error as Error).message);
    }
  };

  const calculateMandatoryFee = (hId: string) => {
    if (!selectedCampaign || selectedCampaign.type !== FeeType.MANDATORY) return 0;
    const h = households.find(x => x.id === hId);
    if (!h) return 0;
    return (selectedCampaign.amountPerMonthPerPerson || 0) * 12 * h.members.length;
  };

  const filteredHouseholds = households.filter(h => {
    if (filterStatus === 'paid') return paidHouseholdIds.has(h.id);
    if (filterStatus === 'unpaid') return !paidHouseholdIds.has(h.id);
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Danh sách đợt thu */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Đợt vận động
          </h3>
          <div className="space-y-2">
            {fees.map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedCampaign(f)}
                className={`w-full p-4 rounded-xl text-left border transition-all duration-200 ${selectedCampaign?.id === f.id
                  ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/10'
                  : 'bg-white border-slate-200 hover:border-blue-200'
                  }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${f.type === FeeType.MANDATORY ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                    }`}>
                    {f.type}
                  </span>
                  <span className="text-xs text-slate-400">{new Date(f.startDate).toLocaleDateString('vi-VN')}</span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm">{f.name}</h4>
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsCreatingCampaign(true)}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all font-semibold text-sm"
          >
            <Plus className="w-4 h-4" />
            Tạo đợt thu mới
          </button>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {selectedCampaign && (
            <>
              {/* Header Card */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-3xl text-white shadow-xl shadow-blue-600/20 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedCampaign.name}</h2>
                    <p className="text-blue-100 mb-6 max-w-md">{selectedCampaign.description}</p>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-xs text-blue-200 uppercase font-bold tracking-wider mb-1">Đã thu</p>
                        <p className="text-3xl font-bold">{totalAmountCollected.toLocaleString()} đ</p>
                      </div>
                      <div className="w-px h-12 bg-white/20"></div>
                      <div>
                        <p className="text-xs text-blue-200 uppercase font-bold tracking-wider mb-1">Hộ đã nộp</p>
                        <p className="text-3xl font-bold">{paidHouseholdIds.size} / {households.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsCollecting(true)}
                      className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg"
                    >
                      Ghi nhận nộp tiền
                    </button>
                    <button className="p-3 bg-blue-700 hover:bg-blue-600 rounded-xl transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Wallet className="w-48 h-48" />
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h4 className="font-bold text-slate-700">Chi tiết các hộ</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilterStatus('all')}
                      className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${filterStatus === 'all' ? 'bg-white border border-slate-200' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                      Tất cả
                    </button>
                    <button
                      onClick={() => setFilterStatus('unpaid')}
                      className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${filterStatus === 'unpaid' ? 'bg-white border border-slate-200' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                      Chưa nộp
                    </button>
                    <button
                      onClick={() => setFilterStatus('paid')}
                      className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${filterStatus === 'paid' ? 'bg-white border border-slate-200' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                      Đã nộp
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left bg-slate-50/50">
                        <th className="px-6 py-4 font-semibold text-slate-500">Chủ hộ</th>
                        <th className="px-6 py-4 font-semibold text-slate-500">Địa chỉ</th>
                        <th className="px-6 py-4 font-semibold text-slate-500">Trạng thái</th>
                        <th className="px-6 py-4 font-semibold text-slate-500">Số tiền</th>
                        <th className="px-6 py-4 font-semibold text-slate-500">Ngày nộp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredHouseholds.map(h => {
                        const payment = campaignPayments.find(p => p.householdId === h.id);
                        return (
                          <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-800">{h.headName}</td>
                            <td className="px-6 py-4 text-slate-500">{h.address}, {h.street}</td>
                            <td className="px-6 py-4">
                              {payment ? (
                                <span className="flex items-center gap-1.5 text-green-600 font-semibold">
                                  <CheckCircle2 className="w-4 h-4" /> Đã nộp
                                </span>
                              ) : (
                                <span className="flex items-center gap-1.5 text-slate-400">
                                  <AlertCircle className="w-4 h-4" /> Chưa nộp
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 font-mono font-bold text-slate-700">
                              {payment ? payment.amount.toLocaleString() : '0'} đ
                            </td>
                            <td className="px-6 py-4 text-slate-500">
                              {payment ? new Date(payment.paymentDate).toLocaleDateString('vi-VN') : '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal Thu tiền */}
      {isCollecting && selectedCampaign && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Thu phí: {selectedCampaign.name}</h3>
              <button onClick={() => setIsCollecting(false)} className="p-2 hover:bg-slate-200 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleCollect} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hộ gia đình nộp</label>
                <select
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  value={selectedHouseholdId}
                  onChange={(e) => {
                    const hId = e.target.value;
                    setSelectedHouseholdId(hId);
                    if (selectedCampaign?.type === FeeType.MANDATORY) {
                      setAmount(calculateMandatoryFee(hId));
                    }
                  }}
                >
                  <option value="">Chọn hộ...</option>
                  {households.filter(h => !paidHouseholdIds.has(h.id)).map(h => (
                    <option key={h.id} value={h.id}>{h.headName} - {h.address}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Số tiền (VNĐ)</label>
                <input
                  type="number"
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-bold text-lg"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  readOnly={selectedCampaign?.type === FeeType.MANDATORY}
                />
                {selectedCampaign?.type === FeeType.MANDATORY && selectedCampaign.amountPerMonthPerPerson && (
                  <p className="text-[10px] text-blue-600 font-medium">
                    Số tiền tính tự động: {selectedCampaign.amountPerMonthPerPerson.toLocaleString()}đ x 12 tháng x số người
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Người thu</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  value={collectorName}
                  onChange={(e) => setCollectorName(e.target.value)}
                  placeholder="Nguyễn Văn Cường"
                />
              </div>
              <div className="pt-4 space-y-3">
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
                  Xác nhận thu tiền
                </button>
                <button type="button" onClick={() => setIsCollecting(false)} className="w-full bg-slate-50 text-slate-500 py-3 rounded-xl font-bold border border-slate-200 hover:bg-slate-100 transition-all">
                  Đóng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tạo đợt thu */}
      {isCreatingCampaign && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Tạo đợt thu mới</h3>
              <button onClick={() => setIsCreatingCampaign(false)} className="p-2 hover:bg-slate-200 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleCreateCampaign} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tên đợt thu</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  value={campaignForm.name}
                  onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                  placeholder="Phí vệ sinh 2024"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Loại</label>
                <select
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  value={campaignForm.type}
                  onChange={(e) => setCampaignForm({ ...campaignForm, type: e.target.value as FeeType })}
                >
                  <option value={FeeType.MANDATORY}>Bắt buộc</option>
                  <option value={FeeType.VOLUNTARY}>Đóng góp</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mức thu (đ/người/tháng)</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  value={campaignForm.amountPerMonthPerPerson}
                  onChange={(e) => setCampaignForm({ ...campaignForm, amountPerMonthPerPerson: Number(e.target.value) })}
                  placeholder="6000"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngày bắt đầu</label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  value={campaignForm.startDate}
                  onChange={(e) => setCampaignForm({ ...campaignForm, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mô tả</label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  value={campaignForm.description}
                  onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
                  placeholder="Mô tả về đợt thu này..."
                />
              </div>
              <div className="pt-4 space-y-3">
                <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all">
                  Tạo đợt thu
                </button>
                <button type="button" onClick={() => setIsCreatingCampaign(false)} className="w-full bg-slate-50 text-slate-500 py-3 rounded-xl font-bold border border-slate-200 hover:bg-slate-100 transition-all">
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeManager;