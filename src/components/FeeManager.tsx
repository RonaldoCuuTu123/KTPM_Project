
import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Search, CheckCircle2, AlertCircle, Calendar, Wallet, Download } from 'lucide-react';
import { Household, FeeCampaign, Payment, FeeType } from '@/types';
import { api } from '@/services/api';

interface FeeManagerProps {
  households: Household[];
  fees: FeeCampaign[];
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  setFees: React.Dispatch<React.SetStateAction<FeeCampaign[]>>;
}

const FeeManager: React.FC<FeeManagerProps> = ({ households, fees, payments, setPayments, setFees }) => {
  const [selectedCampaign, setSelectedCampaign] = useState<FeeCampaign | null>(fees[0] || null);
  const [isCollecting, setIsCollecting] = useState(false);
  const [selectedHouseholdId, setSelectedHouseholdId] = useState('');
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const campaignPayments = payments.filter(p => p.campaignId === selectedCampaign?.id);
  const paidHouseholdIds = new Set(campaignPayments.map(p => p.householdId));
  const totalAmountCollected = campaignPayments.reduce((acc, p) => acc + p.amount, 0);

  const handleCollect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign || !selectedHouseholdId) return;

    try {
      setIsLoading(true);
      setError(null);

      const paymentData = {
        householdId: selectedHouseholdId,
        campaignId: selectedCampaign.id,
        amount: amount,
        paymentDate: new Date().toISOString().split('T')[0],
        collectorName: 'Nguyễn Văn Cường'
      };

      // Gọi API tạo thanh toán
      await api.createPayment(paymentData);

      // Refresh lại danh sách thanh toán
      const updatedPayments = await api.getPayments();
      setPayments(updatedPayments);

      setIsCollecting(false);
      setSelectedHouseholdId('');
      setAmount(0);
      alert('Thu phí thành công!');
    } catch (err) {
      console.error('Lỗi thu phí:', err);
      setError('Có lỗi xảy ra khi thu phí. Vui lòng thử lại.');
      alert('Lỗi: Có lỗi xảy ra khi thu phí.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMandatoryFee = (hId: string) => {
    if (!selectedCampaign || selectedCampaign.type !== FeeType.MANDATORY) return 0;
    const h = households.find(x => x.id === hId);
    if (!h) return 0;
    return (selectedCampaign.amountPerMonthPerPerson || 0) * 12 * (h.members?.length || 0);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
                  <span className="text-xs text-slate-400">{f.startDate}</span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm">{f.name}</h4>
              </button>
            ))}
          </div>
          <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all font-semibold text-sm">
            <Plus className="w-4 h-4" />
            Tạo đợt thu mới
          </button>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {selectedCampaign && (
            <>
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

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h4 className="font-bold text-slate-700">Chi tiết các hộ</h4>
                  <div className="flex gap-2">
                    <button className="text-xs font-semibold px-3 py-1 bg-white border border-slate-200 rounded-lg">Tất cả</button>
                    <button className="text-xs font-semibold px-3 py-1 text-slate-400">Chưa nộp</button>
                    <button className="text-xs font-semibold px-3 py-1 text-slate-400">Đã nộp</button>
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
                      {households.map(h => {
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
                              {payment ? payment.paymentDate : '-'}
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

      {/* Collect Money Modal */}
      {isCollecting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Thu phí: {selectedCampaign?.name}</h3>
              <button onClick={() => setIsCollecting(false)} className="p-2 hover:bg-slate-200 rounded-lg">
                <Plus className="w-5 h-5 text-slate-500 rotate-45" />
              </button>
            </div>
            <form onSubmit={handleCollect} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hộ gia đình nộp</label>
                <select
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20"
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
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 font-bold text-lg"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  readOnly={selectedCampaign?.type === FeeType.MANDATORY}
                />
                {selectedCampaign?.type === FeeType.MANDATORY && (
                  <p className="text-[10px] text-blue-600 font-medium">Số tiền tính tự động theo nhân khẩu: 6.000 x 12 tháng x số người</p>
                )}
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
    </div>
  );
};

export default FeeManager;
