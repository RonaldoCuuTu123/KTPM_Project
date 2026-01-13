
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { Household, Resident, Gender, ResidentStatus, Payment, FeeCampaign } from '../types';

interface StatisticsProps {
  households: Household[];
  payments: Payment[];
  fees: FeeCampaign[];
}

const COLORS = ['#3b82f6', '#ec4899', '#f59e0b', '#10b981', '#6366f1', '#8b5cf6'];

const Statistics: React.FC<StatisticsProps> = ({ households, payments, fees }) => {
  const residents = households.flatMap(h => h.members);

  const genderData = useMemo(() => {
    const male = residents.filter(r => r.gender === Gender.MALE).length;
    const female = residents.filter(r => r.gender === Gender.FEMALE).length;
    return [
      { name: 'Nam', value: male },
      { name: 'Nữ', value: female },
    ];
  }, [residents]);

  const ageData = useMemo(() => {
    const data = [
      { name: 'Mầm non (0-2)', value: 0 },
      { name: 'Mẫu giáo (3-5)', value: 0 },
      { name: 'Cấp 1 (6-10)', value: 0 },
      { name: 'Cấp 2 (11-14)', value: 0 },
      { name: 'Cấp 3 (15-17)', value: 0 },
      { name: 'Lao động (18-60)', value: 0 },
      { name: 'Nghỉ hưu (>60)', value: 0 },
    ];

    const currentYear = new Date().getFullYear();
    residents.forEach(r => {
      const age = currentYear - new Date(r.dob).getFullYear();
      if (age <= 2) data[0].value++;
      else if (age <= 5) data[1].value++;
      else if (age <= 10) data[2].value++;
      else if (age <= 14) data[3].value++;
      else if (age <= 17) data[4].value++;
      else if (age <= 60) data[5].value++;
      else data[6].value++;
    });

    return data;
  }, [residents]);

  const revenueData = useMemo(() => {
    return fees.map(f => {
      const total = payments
        .filter(p => p.campaignId === f.id)
        .reduce((acc, p) => acc + p.amount, 0);
      return {
        name: f.name.substring(0, 15) + '...',
        total: total
      };
    });
  }, [fees, payments]);

  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 uppercase tracking-wider text-xs font-semibold text-slate-400">Cơ cấu giới tính</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 uppercase tracking-wider text-xs font-semibold text-slate-400">Thống kê theo độ tuổi</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="xl:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 uppercase tracking-wider text-xs font-semibold text-slate-400">Doanh thu theo đợt vận động</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={150} axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip 
                  formatter={(value: number) => value.toLocaleString() + ' đ'}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="total" fill="#10b981" radius={[0, 4, 4, 0]} label={{ position: 'right', formatter: (v: any) => v.toLocaleString() + ' đ', fontSize: 11 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold mb-2">Xuất báo cáo định kỳ</h3>
          <p className="text-blue-100 opacity-80">Hệ thống tự động tổng hợp số liệu nhân khẩu & tài chính để phục vụ công tác báo cáo Phường.</p>
        </div>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold shadow-lg whitespace-nowrap hover:bg-blue-50 transition-colors">
          Tải PDF Báo cáo Quý 2/2024
        </button>
      </div>
    </div>
  );
};

export default Statistics;
