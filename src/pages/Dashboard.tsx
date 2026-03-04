import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '../components/Sidebar';
import { Overview } from './Overview';
import { Policies } from './Policies';
import { Agents } from './Agents';
import { ObjectsPage } from './ObjectsPage';
import { ServicesPage } from './ServicesPage';
import { GenericProfilePage } from './GenericProfilePage';
import { SettingsPage } from './SettingsPage';
import { LogsPage } from './LogsPage';
import { UsersPage } from './UsersPage';
import { GroupsPage } from './GroupsPage';
import { DevicesPage } from './DevicesPage';
import { ZTNAPage } from './ZTNAPage';
import { useStore } from '../store';
import { 
  Bell, 
  Search, 
  HelpCircle, 
  ChevronDown,
  Globe,
  ShieldCheck,
  Cpu,
  Zap,
  Network,
  ShieldAlert,
  Lock,
  Shield
} from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const store = useStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Overview />;
      case 'policies': return <Policies />;
      case 'agents': return <Agents />;
      case 'devices': return <DevicesPage />;
      case 'users': return <UsersPage />;
      case 'groups': return <GroupsPage />;
      case 'ztna': return <ZTNAPage />;
      case 'objects': return <ObjectsPage />;
      case 'services': return <ServicesPage />;
      case 'apps': return <GenericProfilePage title="Controle de Aplicações" description="Gerencie perfis de bloqueio e monitoramento de aplicações (Layer 7)." profiles={store.appControls} setProfiles={store.setAppControls} icon={Zap} />;
      case 'dns': return <GenericProfilePage title="DNS Filtering" description="Filtre resoluções de DNS maliciosas e indesejadas." profiles={store.dnsFilters} setProfiles={store.setDnsFilters} icon={Network} />;
      case 'web': return <GenericProfilePage title="Web Filtering" description="Filtre o tráfego web baseado em categorias e URLs." profiles={store.webFilters} setProfiles={store.setWebFilters} icon={Globe} />;
      case 'geoip': return <GenericProfilePage title="GeoIP Blocking" description="Bloqueie tráfego baseado na localização geográfica." profiles={store.geoIps} setProfiles={store.setGeoIps} icon={Globe} />;
      case 'ids': return <GenericProfilePage title="IDS/IPS" description="Sistema de prevenção e detecção de intrusões." profiles={store.idsIps} setProfiles={store.setIdsIps} icon={ShieldAlert} />;
      case 'ssl': return <GenericProfilePage title="Inspeção SSL/TLS" description="Perfis de inspeção profunda de pacotes criptografados." profiles={store.sslProfiles} setProfiles={store.setSslProfiles} icon={Lock} />;
      case 'settings': return <SettingsPage />;
      case 'logs': return <LogsPage />;
      default: return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-4">
            <Cpu className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-white">Módulo em Desenvolvimento</h3>
          <p className="text-gray-500 mt-2 max-w-sm">
            O módulo <span className="text-violet-400 font-mono">"{activeTab}"</span> está sendo estruturado para a próxima release do Bird Sase.
          </p>
        </div>
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0f] text-gray-300">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
      
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-50 px-8 flex items-center justify-between">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Pesquisar em toda a plataforma..." 
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Global Edge: Healthy</span>
            </div>

            <div className="h-8 w-px bg-white/5 mx-2" />

            <button className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-violet-500 rounded-full border-2 border-[#0a0a0f]" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
            
            <button className="flex items-center gap-2 pl-2 pr-1 py-1 hover:bg-white/5 rounded-xl transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                AD
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        <footer className="mt-auto p-8 pt-0 flex items-center justify-between text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3 h-3" />
              Region: US-East-1
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" />
              Compliance: SOC2 / GDPR
            </span>
          </div>
          <div>
            Bird Sase v2.4.1-STABLE &copy; 2024
          </div>
        </footer>
      </main>
    </div>
  );
};
