import React from 'react';
import { Users, Home, Wallet, TrendingUp, UserPlus, FileCheck, RefreshCw } from 'lucide-react';
import { Household, Payment, AppView, ResidentStatus } from '../types';

interface DashboardProps {
  households: Household[];
  payments: Payment[];
  setView: (view: AppView) => void;
  reloadData?: () => Promise<void>;
  isOnline?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ households, payments, setView }) => {
  const totalResidents = households.reduce((acc, h) => acc + h.members.length, 0);
  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);

  // FIX: Đếm đúng số người Tạm trú và Tạm vắng
  const allResidents = households.flatMap(h => h.members || []);
  const temporaryResidents = allResidents.filter(r => r.status === ResidentStatus.TEMPORARY_RESIDENT).length;
  const temporaryAbsent = allResidents.filter(r => r.status === ResidentStatus.TEMPORARY_ABSENT).length;
  const totalTemporary = temporaryResidents + temporaryAbsent;

  const recentHouseholds = [...households].slice(-4).reverse();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Home className="w-6 h-6 text-blue-600" />}
          label="Tổng số hộ"
          value={households.length}
          subValue="+2 tháng này"
          color="bg-blue-50"
        />
        <StatCard
          icon={<Users className="w-6 h-6 text-green-600" />}
          label="Tổng nhân khẩu"
          value={totalResidents}
          subValue="+12 người mới"
          color="bg-green-50"
        />
        <StatCard
          icon={<Wallet className="w-6 h-6 text-amber-600" />}
          label="Phí đã thu"
          value={totalCollected.toLocaleString() + ' đ'}
          subValue="85% mục tiêu"
          color="bg-amber-50"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
          label="Tạm trú/Tạm vắng"
          value={totalTemporary}
          subValue={`${temporaryResidents} tạm trú, ${temporaryAbsent} tạm vắng`}
          color="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Hộ khẩu mới đăng ký</h3>
            <button
              onClick={() => setView('HOUSEHOLDS')}
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              Xem tất cả
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-4">Chủ hộ</th>
                  <th className="pb-4">Số hộ khẩu</th>
                  <th className="pb-4">Địa chỉ</th>
                  <th className="pb-4">Thành viên</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentHouseholds.map(h => (
                  <tr key={h.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                          {h.headName.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-800">{h.headName}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-sm text-slate-600">{h.householdNumber}</td>
                    <td className="py-4 pr-4 text-sm text-slate-600">{h.address}, {h.street}</td>
                    <td className="py-4 pr-4">
                      <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100">
                        {h.members.length} người
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Thao tác nhanh</h3>
          <div className="space-y-4">
            <QuickActionButton
              icon={<UserPlus className="w-5 h-5" />}
              label="Thêm nhân khẩu mới"
              onClick={() => setView('RESIDENTS')}
              color="text-blue-600 bg-blue-50"
            />
            <QuickActionButton
              icon={<FileCheck className="w-5 h-5" />}
              label="Khai báo tạm trú"
              onClick={() => setView('RESIDENTS')}
              color="text-green-600 bg-green-50"
            />
            <QuickActionButton
              icon={<Wallet className="w-5 h-5" />}
              label="Thu phí định kỳ"
              onClick={() => setView('FEES')}
              color="text-amber-600 bg-amber-50"
            />
          </div>

          <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Thông báo Ban quản lý</p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Nhắc nhở: Cần hoàn tất thu phí vệ sinh năm 2024 cho khu vực dãy nhà trọ trước ngày 30/06.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, subValue, color }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 transition-transform hover:-translate-y-1 duration-300">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
    <p className="text-xs font-medium text-green-600 mt-2">{subValue}</p>
  </div>
);

const QuickActionButton = ({ icon, label, onClick, color }: any) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 group text-left"
  >
    <div className={`p-2 rounded-lg ${color} group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <span className="font-semibold text-slate-700 text-sm">{label}</span>
  </button>
);

export default Dashboard;