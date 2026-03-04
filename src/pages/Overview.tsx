import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Shield, 
  Globe, 
  Zap, 
  Users, 
  Laptop,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export const Overview: React.FC = () => {
  const [stats, setStats] = useState({
    onlineAgents: 0,
    totalThreats: 0,
    activeUsers: 0,
    topApps: [] as any[]
  });

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const data = [
    { time: '00:00', traffic: 0, threats: 0 },
    { time: '04:00', traffic: 0, threats: 0 },
    { time: '08:00', traffic: 0, threats: 0 },
    { time: '12:00', traffic: 0, threats: 0 },
    { time: '16:00', traffic: 0, threats: 0 },
    { time: '20:00', traffic: 0, threats: 0 },
    { time: '23:59', traffic: 0, threats: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
          <p className="text-gray-400 text-sm">Monitoramento em tempo real do tráfego e ameaças.</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${stats.onlineAgents > 0 ? 'bg-emerald-500' : 'bg-gray-500'}`} />
            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">
              Edge Nodes: {stats.onlineAgents > 0 ? 'Online' : 'Aguardando Conexão'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tráfego Total', value: '0 B', icon: Activity, color: 'text-cyan-400', trend: '0%', up: true },
          { label: 'Ameaças Bloqueadas', value: stats.totalThreats.toString(), icon: Shield, color: 'text-red-400', trend: '0%', up: false },
          { label: 'Usuários Ativos', value: stats.activeUsers.toString(), icon: Users, color: 'text-violet-400', trend: '0', up: true },
          { label: 'Dispositivos Edge', value: stats.onlineAgents.toString(), icon: Laptop, color: 'text-emerald-400', trend: '0', up: true },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#12121a] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">{stat.label}</h3>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#12121a] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-violet-400" />
              Tráfego vs Ameaças
            </h3>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-gray-300 outline-none">
              <option>Últimas 24 horas</option>
              <option>Últimos 7 dias</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="time" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a26', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="traffic" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorTraffic)" strokeWidth={2} />
                <Area type="monotone" dataKey="threats" stroke="#f43f5e" fillOpacity={1} fill="url(#colorThreats)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            Top Aplicações
          </h3>
          <div className="space-y-4">
            {stats.topApps.length > 0 ? stats.topApps.map((app) => (
              <div key={app.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300 font-medium">{app.name}</span>
                  <span className="text-white font-bold">{app.value}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${app.value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: app.color }}
                  />
                </div>
              </div>
            )) : (
              <div className="py-8 text-center text-gray-500 text-xs italic">Aguardando dados...</div>
            )}
          </div>
          <button className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-gray-400 transition-all uppercase tracking-widest">
            Ver Relatório Completo
          </button>
        </div>
      </div>
    </div>
  );
};
