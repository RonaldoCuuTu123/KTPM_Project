
import React, { useState, useEffect } from 'react';
import {
  Users,
  Home,
  CreditCard,
  BarChart3,
  LogOut,
  Menu,
  X,
  Search,
  Plus,
  ChevronRight,
  ArrowLeftRight,
  FileText,
  Trash2,
  Calendar,
  MapPin,
  TrendingUp,
  UserPlus
} from 'lucide-react';
import {
  AppView,
  Household,
  Resident,
  FeeCampaign,
  Payment,
  Gender,
  ResidentStatus,
  FeeType,
  AgeGroup
} from '@/types';
import { api } from '@/services/api';
import HouseholdManager from '@/components/HouseholdManager';
import ResidentManager from '@/components/ResidentManager';
import FeeManager from '@/components/FeeManager';
import Statistics from '@/components/Statistics';
import Dashboard from '@/components/Dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('DASHBOARD');
  const [households, setHouseholds] = useState<Household[]>([]);
  const [fees, setFees] = useState<FeeCampaign[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dữ liệu từ API khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [householdsData, feesData, paymentsData] = await Promise.all([
          api.getHouseholds(),
          api.getFeeCampaigns(),
          api.getPayments()
        ]);
        setHouseholds(householdsData);
        setFees(feesData);
        setPayments(paymentsData);
        setError(null);
      } catch (err) {
        console.error('Lỗi tải dữ liệu:', err);
        setError('Không thể tải dữ liệu từ server. Vui lòng kiểm tra kết nối Backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const navItems = [
    { id: 'DASHBOARD', icon: Home, label: 'Bảng điều khiển' },
    { id: 'HOUSEHOLDS', icon: FileText, label: 'Quản lý Hộ khẩu' },
    { id: 'RESIDENTS', icon: Users, label: 'Quản lý Nhân khẩu' },
    { id: 'FEES', icon: CreditCard, label: 'Thu phí & Đóng góp' },
    { id: 'STATS', icon: BarChart3, label: 'Thống kê báo cáo' },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col z-50`}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          {isSidebarOpen && <h1 className="font-bold text-white text-lg tracking-tight">TDP 7 La Khê</h1>}
        </div>

        <nav className="flex-1 mt-6 px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as AppView)}
              className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 mb-2 ${view === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'hover:bg-slate-800 hover:text-white'
                }`}
            >
              <item.icon className="w-5 h-5 min-w-[20px]" />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-slate-800 transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            {isSidebarOpen && <span className="font-medium">Thu gọn</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {navItems.find(i => i.id === view)?.label}
            </h2>
            <p className="text-sm text-slate-500">Chào mừng trở lại, Ban quản lý TDP 7</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">Nguyễn Văn Cường</p>
              <p className="text-xs text-slate-500">Tổ trưởng</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-200">
              C
            </div>
          </div>
        </header>

        {error && (
          <div className="p-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              <p className="font-semibold">Lỗi kết nối</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="p-8">
          {view === 'DASHBOARD' && (
            <Dashboard
              households={households}
              payments={payments}
              setView={setView}
            />
          )}
          {view === 'HOUSEHOLDS' && (
            <HouseholdManager
              households={households}
              setHouseholds={setHouseholds}
            />
          )}
          {view === 'RESIDENTS' && (
            <ResidentManager
              households={households}
              setHouseholds={setHouseholds}
            />
          )}
          {view === 'FEES' && (
            <FeeManager
              households={households}
              fees={fees}
              payments={payments}
              setPayments={setPayments}
              setFees={setFees}
            />
          )}
          {view === 'STATS' && (
            <Statistics
              households={households}
              payments={payments}
              fees={fees}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
