import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Search, Filter, Clock, Play, Pause, Download, ShieldAlert, CheckCircle2, Ban } from 'lucide-react';
import { LogEntry } from '../types';

const generateMockLog = (): LogEntry => {
  const actions: ('Allow' | 'Deny' | 'Inspect')[] = ['Allow', 'Deny', 'Inspect'];
  const threats: ('Low' | 'Medium' | 'High' | 'Critical')[] = ['Low', 'Medium', 'High', 'Critical'];
  const users = ['admin', 'jdoe', 'msmith', 'soc_analyst'];
  const workstations = ['WS-01', 'WS-02', 'LAPTOP-CEO', 'SRV-DB'];
  const apps = ['HTTPS', 'DNS', 'SSH', 'RDP', 'Office 365', 'Slack'];
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    user: users[Math.floor(Math.random() * users.length)],
    workstation: workstations[Math.floor(Math.random() * workstations.length)],
    sourceIp: `192.168.1.${Math.floor(Math.random() * 255)}`,
    mac: `00:1A:2B:3C:4D:${Math.floor(Math.random() * 99).toString().padStart(2, '0')}`,
    destIp: `10.0.0.${Math.floor(Math.random() * 255)}`,
    application: apps[Math.floor(Math.random() * apps.length)],
    action: actions[Math.floor(Math.random() * actions.length)],
    threatLevel: threats[Math.floor(Math.random() * threats.length)],
  };
};

export const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRealTime, setIsRealTime] = useState(true);
  const [timeRange, setTimeRange] = useState<'realtime' | '24h'>('realtime');
  
  const [filters, setFilters] = useState({
    user: '',
    workstation: '',
    ip: '',
    mac: ''
  });

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/logs');
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  };

  useEffect(() => {
    fetchLogs(); // Initial fetch
    
    let interval: NodeJS.Timeout;
    if (isRealTime && timeRange === 'realtime') {
      interval = setInterval(() => {
        fetchLogs();
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isRealTime, timeRange]);

  const filteredLogs = logs.filter(log => {
    return (
      log.user.toLowerCase().includes(filters.user.toLowerCase()) &&
      log.workstation.toLowerCase().includes(filters.workstation.toLowerCase()) &&
      (log.sourceIp.includes(filters.ip) || log.destIp.includes(filters.ip)) &&
      log.mac.toLowerCase().includes(filters.mac.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-violet-400" />
            Logs em Tempo Real
          </h2>
          <p className="text-gray-400 text-sm mt-1">Monitoramento de tráfego, agentes e eventos de segurança.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
            <button 
              onClick={() => { setTimeRange('realtime'); setIsRealTime(true); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${timeRange === 'realtime' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'text-gray-400 hover:text-white'}`}
            >
              Real-Time
            </button>
            <button 
              onClick={() => { setTimeRange('24h'); setIsRealTime(false); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${timeRange === '24h' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'text-gray-400 hover:text-white'}`}
            >
              Últimas 24h
            </button>
          </div>
          
          {timeRange === 'realtime' && (
            <button 
              onClick={() => setIsRealTime(!isRealTime)}
              className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all border ${
                isRealTime 
                  ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' 
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
              }`}
            >
              {isRealTime ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRealTime ? 'Pausar' : 'Retomar'}
            </button>
          )}

          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-4 gap-4 bg-[#12121a] p-4 rounded-2xl border border-white/5 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Filtrar por Usuário..." 
            value={filters.user}
            onChange={e => setFilters({...filters, user: e.target.value})}
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50"
          />
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Filtrar por Estação..." 
            value={filters.workstation}
            onChange={e => setFilters({...filters, workstation: e.target.value})}
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50"
          />
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Filtrar por IP (Origem/Destino)..." 
            value={filters.ip}
            onChange={e => setFilters({...filters, ip: e.target.value})}
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50"
          />
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Filtrar por MAC..." 
            value={filters.mac}
            onChange={e => setFilters({...filters, mac: e.target.value})}
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 font-mono"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="flex-1 bg-[#12121a] border border-white/5 rounded-2xl overflow-hidden flex flex-col min-h-0">
        <div className="grid grid-cols-[140px_100px_120px_120px_120px_120px_100px_100px_100px] gap-4 px-6 py-4 border-b border-white/5 bg-white/2 text-[10px] font-bold text-gray-500 uppercase tracking-widest shrink-0">
          <div>Timestamp</div>
          <div>Usuário</div>
          <div>Estação</div>
          <div>MAC Address</div>
          <div>IP Origem</div>
          <div>IP Destino</div>
          <div>Aplicação</div>
          <div>Ação</div>
          <div>Ameaça</div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 divide-y divide-white/5">
          <AnimatePresence initial={false}>
            {filteredLogs.map((log) => (
              <motion.div 
                key={log.id}
                initial={{ opacity: 0, y: -10, backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
                animate={{ opacity: 1, y: 0, backgroundColor: 'transparent' }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-[140px_100px_120px_120px_120px_120px_100px_100px_100px] gap-4 px-6 py-3 items-center hover:bg-white/2 transition-colors text-xs"
              >
                <div className="text-gray-400 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</div>
                <div className="font-bold text-white truncate" title={log.user}>{log.user}</div>
                <div className="text-gray-300 truncate" title={log.workstation}>{log.workstation}</div>
                <div className="text-gray-500 font-mono">{log.mac}</div>
                <div className="text-gray-400 font-mono">{log.sourceIp}</div>
                <div className="text-gray-400 font-mono">{log.destIp}</div>
                <div className="text-gray-300">{log.application}</div>
                <div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    log.action === 'Allow' ? 'bg-emerald-500/10 text-emerald-400' :
                    log.action === 'Deny' ? 'bg-red-500/10 text-red-400' :
                    'bg-cyan-500/10 text-cyan-400'
                  }`}>
                    {log.action}
                  </span>
                </div>
                <div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    log.threatLevel === 'Critical' ? 'bg-red-500 text-white' :
                    log.threatLevel === 'High' ? 'bg-amber-500/20 text-amber-400' :
                    log.threatLevel === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                    'text-gray-500'
                  }`}>
                    {log.threatLevel}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredLogs.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">Nenhum log encontrado para os filtros atuais.</div>
          )}
        </div>
      </div>
    </div>
  );
};
