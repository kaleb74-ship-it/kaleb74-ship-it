import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Laptop, 
  Users, 
  UsersRound, 
  ShieldCheck, 
  FileText, 
  Globe, 
  ShieldAlert, 
  Activity, 
  Download, 
  Settings, 
  Briefcase,
  Search,
  Lock,
  Zap,
  Network,
  LogOut,
  Box,
  Server
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'devices', label: 'Dispositivos', icon: Laptop },
  { id: 'users', label: 'Usuários', icon: Users },
  { id: 'groups', label: 'Grupos', icon: UsersRound },
  { id: 'objects', label: 'Objetos', icon: Box },
  { id: 'services', label: 'Serviços', icon: Server },
  { id: 'policies', label: 'Políticas de Firewall', icon: FileText },
  { id: 'apps', label: 'Controle de Aplicações', icon: Zap },
  { id: 'dns', label: 'DNS Filtering', icon: Network },
  { id: 'web', label: 'Web Filtering', icon: Globe },
  { id: 'geoip', label: 'GeoIP Blocking', icon: Globe },
  { id: 'ids', label: 'IDS/IPS', icon: ShieldAlert },
  { id: 'ssl', label: 'Inspeção SSL/TLS', icon: Lock },
  { id: 'logs', label: 'Logs em tempo real', icon: Activity },
  { id: 'agents', label: 'Gestão de Agentes', icon: Download },
  { id: 'ztna', label: 'ZTNA (Zero Trust)', icon: ShieldCheck },
  { id: 'settings', label: 'Configurações Globais', icon: Settings },
  { id: 'tenants', label: 'Multi-tenant', icon: Briefcase },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  return (
    <div className="w-72 bg-[#0d0d14] border-r border-white/5 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
          <ShieldCheck className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Bird Sase</h1>
          <p className="text-[10px] text-violet-400 font-bold uppercase tracking-widest">SASE Control Plane</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 scrollbar-thin scrollbar-thumb-white/10">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20' 
                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-violet-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
            <span className="text-sm font-medium">{item.label}</span>
            {activeTab === item.id && (
              <motion.div 
                layoutId="active-pill"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.6)]"
              />
            )}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-white/5">
        <div className="bg-white/5 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs font-bold text-white">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Administrator</p>
              <p className="text-[10px] text-gray-500 truncate">admin@frault.io</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-3 h-3" />
            Sair do Sistema
          </button>
        </div>
      </div>
    </div>
  );
};
