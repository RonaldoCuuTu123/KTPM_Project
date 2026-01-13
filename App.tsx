import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import {
  Users, Home, CreditCard, BarChart3, LogOut, Menu, X, FileText,
  Wifi, WifiOff
} from 'lucide-react';
import { Household, FeeCampaign, Payment, User, Role } from './types';
import { INITIAL_USERS } from './constants';
import HouseholdManager from './components/HouseholdManager';
import ResidentManager from './components/ResidentManager';
import FeeManager from './components/FeeManager';
import Statistics from './components/Statistics';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';

const getApiUrl = () => {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  return `http://${hostname}:5000/api`;
};

const API_URL = getApiUrl();

// Component chính với Router
const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tdp7_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [fees, setFees] = useState<FeeCampaign[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Kiểm tra kết nối và load dữ liệu
  useEffect(() => {
    const loadData = async () => {
      try {
        const healthRes = await fetch(`${API_URL}/health`, {
          signal: AbortSignal.timeout(3000)
        });

        if (healthRes.ok) {
          setIsOnline(true);

          const [hhRes, fRes, pRes] = await Promise.all([
            fetch(`${API_URL}/households`),
            fetch(`${API_URL}/fees`),
            fetch(`${API_URL}/payments`)
          ]);

          const [hhData, fData, pData] = await Promise.all([
            hhRes.json(),
            fRes.json(),
            pRes.json()
          ]);

          setHouseholds(hhData);
          setFees(fData);
          setPayments(pData);

          console.log('✓ Đã tải dữ liệu từ server');
        }
      } catch (e) {
        setIsOnline(false);
        console.log('⚠ Không kết nối được server, chạy offline mode');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(2000) });
        setIsOnline(res.ok);
      } catch {
        setIsOnline(false);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  };

  const reloadData = async () => {
    if (!isOnline) return;

    try {
      const [hhData, fData, pData] = await Promise.all([
        apiRequest('/households'),
        apiRequest('/fees'),
        apiRequest('/payments')
      ]);

      setHouseholds(hhData);
      setFees(fData);
      setPayments(pData);
      console.log('✓ Đã reload dữ liệu:', {
        households: hhData.length,
        fees: fData.length,
        payments: pData.length
      });
    } catch (error) {
      console.error('Lỗi reload dữ liệu:', error);
    }
  };

  // Auto reload khi vào Dashboard
  useEffect(() => {
    if (location.pathname === '/dashboard' && isOnline) {
      reloadData();
    }
  }, [location.pathname, isOnline]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('tdp7_current_user', JSON.stringify(user));
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tdp7_current_user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Auth onLogin={handleLogin} users={users} setUsers={setUsers} apiRequest={apiRequest} />;
  }

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Bảng điều khiển', roles: [Role.ADMIN, Role.ACCOUNTANT, Role.STAFF] },
    { path: '/households', icon: FileText, label: 'Quản lý Hộ khẩu', roles: [Role.ADMIN, Role.STAFF] },
    { path: '/residents', icon: Users, label: 'Quản lý Nhân khẩu', roles: [Role.ADMIN, Role.STAFF] },
    { path: '/fees', icon: CreditCard, label: 'Thu phí & Đóng góp', roles: [Role.ADMIN, Role.ACCOUNTANT] },
    { path: '/statistics', icon: BarChart3, label: 'Thống kê báo cáo', roles: [Role.ADMIN, Role.ACCOUNTANT, Role.STAFF] },
  ].filter(item => item.roles.includes(currentUser.role));

  const currentPage = navItems.find(item => location.pathname === item.path);

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
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 mb-2 ${location.pathname === item.path
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
                {currentPage?.label || 'TDP 7 La Khê'}
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
              <span className="text-[10px] font-bold text-slate-400 uppercase">Server</span>
              <span className="text-xs font-mono text-slate-600">{window.location.hostname}:5000</span>
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
          <Routes>
            <Route path="/dashboard" element={
              <Dashboard
                households={households}
                payments={payments}
                setView={(view) => {
                  const pathMap: Record<string, string> = {
                    'HOUSEHOLDS': '/households',
                    'RESIDENTS': '/residents',
                    'FEES': '/fees',
                    'STATS': '/statistics'
                  };
                  navigate(pathMap[view] || '/dashboard');
                }}
                reloadData={reloadData}
                isOnline={isOnline}
              />
            } />
            <Route path="/households" element={
              <HouseholdManager
                households={households}
                setHouseholds={setHouseholds}
                apiRequest={apiRequest}
                reloadData={reloadData}
                isOnline={isOnline}
              />
            } />
            <Route path="/residents" element={
              <ResidentManager
                households={households}
                setHouseholds={setHouseholds}
                apiRequest={apiRequest}
                reloadData={reloadData}
                isOnline={isOnline}
              />
            } />
            <Route path="/fees" element={
              <FeeManager
                households={households}
                fees={fees}
                payments={payments}
                setPayments={setPayments}
                setFees={setFees}
                apiRequest={apiRequest}
                reloadData={reloadData}
                isOnline={isOnline}
              />
            } />
            <Route path="/statistics" element={
              <Statistics
                households={households}
                payments={payments}
                fees={fees}
              />
            } />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

// App wrapper với BrowserRouter
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AppContent />} />
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;