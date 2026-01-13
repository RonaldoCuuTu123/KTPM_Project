
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Home, 
  CreditCard, 
  BarChart3, 
  LogOut, 
  Menu, 
  X, 
  FileText,
  Wifi,
  WifiOff,
  Smartphone,
  Globe
} from 'lucide-react';
import { 
  AppView, 
  Household, 
  FeeCampaign, 
  Payment, 
  User, 
  Role 
} from './types';
import { INITIAL_HOUSEHOLDS, INITIAL_FEES, INITIAL_USERS, INITIAL_PAYMENTS } from './constants';
import HouseholdManager from './components/HouseholdManager';
import ResidentManager from './components/ResidentManager';
import FeeManager from './components/FeeManager';
import Statistics from './components/Statistics';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';

const getApiUrl = () => {
  const hostname = window.location.hostname;
  // Nếu truy cập qua localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  // Nếu truy cập qua IP mạng nội bộ (như 192.168.1.188)
  return `http://${hostname}:5000/api`;
};

const API_URL = getApiUrl();

const App: React.FC = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [showNetworkInfo, setShowNetworkInfo] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tdp7_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [view, setView] = useState<AppView>('DASHBOARD');
  const [households, setHouseholds] = useState<Household[]>(INITIAL_HOUSEHOLDS);
  const [fees, setFees] = useState<FeeCampaign[]>(INITIAL_FEES);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch(`${API_URL}/fees`, { signal: AbortSignal.timeout(3000) });
        if (res.ok) {
          setIsOnline(true);
          const [hh, f, p] = await Promise.all([
            fetch(`${API_URL}/households`).then(r => r.json()),
            fetch(`${API_URL}/fees`).then(r => r.json()),
            fetch(`${API_URL}/payments`).then(r => r.json())
          ]);
          setHouseholds(hh);
          setFees(f);
          setPayments(p);
        }
      } catch (e) {
        setIsOnline(false);
        const savedHH = localStorage.getItem('tdp7_households');
        if (savedHH) setHouseholds(JSON.parse(savedHH));
      }
    };
    checkServer();
  }, []);

  useEffect(() => {
    localStorage.setItem('tdp7_households', JSON.stringify(households));
    localStorage.setItem('tdp7_fees', JSON.stringify(fees));
    localStorage.setItem('tdp7_payments', JSON.stringify(payments));
    if (currentUser) {
      localStorage.setItem('tdp7_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('tdp7_current_user');
    }
  }, [households, fees, payments, currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView('DASHBOARD');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} users={users} setUsers={setUsers} />;
  }

  const navItems = [
    { id: 'DASHBOARD', icon: Home, label: 'Bảng điều khiển', roles: [Role.ADMIN, Role.ACCOUNTANT, Role.STAFF] },
    { id: 'HOUSEHOLDS', icon: FileText, label: 'Quản lý Hộ khẩu', roles: [Role.ADMIN, Role.STAFF] },
    { id: 'RESIDENTS', icon: Users, label: 'Quản lý Nhân khẩu', roles: [Role.ADMIN, Role.STAFF] },
    { id: 'FEES', icon: CreditCard, label: 'Thu phí & Đóng góp', roles: [Role.ADMIN, Role.ACCOUNTANT] },
    { id: 'STATS', icon: BarChart3, label: 'Thống kê báo cáo', roles: [Role.ADMIN, Role.ACCOUNTANT, Role.STAFF] },
  ].filter(item => item.roles.includes(currentUser.role));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col z-50`}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
            <Users className="w-6 h-6 text-white" />
          </div>
          {isSidebarOpen && <h1 className="font-bold text-white text-lg tracking-tight">TDP 7 La Khê</h1>}
        </div>

        <nav className="flex-1 mt-6 px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as AppView)}
              className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 mb-2 ${
                view === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 min-w-[20px]" />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button 
            onClick={() => setShowNetworkInfo(true)}
            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-slate-800 transition-colors text-blue-400"
          >
            <Smartphone className="w-5 h-5 min-w-[20px]" />
            {isSidebarOpen && <span className="font-medium">Kết nối di động</span>}
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors group"
          >
            <LogOut className="w-5 h-5 min-w-[20px] group-hover:rotate-12 transition-transform" />
            {isSidebarOpen && <span className="font-medium">Đăng xuất</span>}
          </button>
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
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {navItems.find(i => i.id === view)?.label}
              </h2>
              <div className="flex items-center gap-2">
                <p className="text-sm text-slate-500">TDP 7 Phường La Khê</p>
                <div className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col items-end mr-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Địa chỉ máy chủ</span>
              <span className="text-xs font-mono text-slate-600">{window.location.hostname}</span>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800">{currentUser.fullName}</p>
              <p className="text-xs font-semibold text-blue-600">
                {currentUser.role === Role.ADMIN ? 'Tổ trưởng / Tổ phó' : 
                 currentUser.role === Role.ACCOUNTANT ? 'Kế toán' : 'Cán bộ'}
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
              {currentUser.fullName.charAt(0)}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
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

      {/* Network Info Modal */}
      {showNetworkInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                  <Smartphone className="w-6 h-6" />
                </div>
                <button onClick={() => setShowNetworkInfo(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Kết nối từ thiết bị khác</h3>
              <p className="text-slate-500 text-sm mb-6">Đảm bảo điện thoại của bạn đang dùng chung WiFi với máy tính này.</p>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bước 1: Truy cập địa chỉ</p>
                  <p className="text-lg font-mono font-bold text-blue-600 break-all">
                    http://192.168.1.188:{window.location.port || '3000'}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bước 2: Máy chủ dữ liệu (API)</p>
                  <p className="text-sm font-mono text-slate-600">
                    http://192.168.1.188:5000/api
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 text-sm">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <p className="font-medium">Hệ thống đã sẵn sàng nhận kết nối từ IP nội bộ của bạn.</p>
              </div>

              <button 
                onClick={() => setShowNetworkInfo(false)}
                className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
