import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Monitor, 
  ShieldCheck, 
  RefreshCw, 
  Zap, 
  CheckCircle2, 
  Clock,
  History,
  Terminal
} from 'lucide-react';

export const Agents: React.FC = () => {
  const [agents, setAgents] = useState<any[]>([]);

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents');
      if (response.ok) {
        const data = await response.json();
        setAgents(data);
      }
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    }
  };

  useEffect(() => {
    fetchAgents();
    const interval = setInterval(fetchAgents, 5000);
    return () => clearInterval(interval);
  }, []);

  const onlineCount = agents.filter(a => a.status === 'Online').length;
  const offlineCount = agents.filter(a => a.status === 'Offline').length;
  const outdatedCount = agents.filter(a => a.version !== 'v2.4.1').length;

  const handleDownload = () => {
    const content = `@echo off
title FRAULT SASE Agent Installer
color 0B
echo ===================================================
echo        FRAULT SASE Agent Installer (Windows 11)
echo ===================================================
echo.
echo Initializing setup...
timeout /t 2 /nobreak >nul
echo Checking system requirements...
timeout /t 1 /nobreak >nul
echo [OK] Windows 11 detected.
echo [OK] Network adapters verified.
echo.
echo Installing FRAULT Edge Node Services...
timeout /t 2 /nobreak >nul
echo [##########          ] 50%
timeout /t 2 /nobreak >nul
echo [####################] 100%
echo.
echo Registering agent with FRAULT Control Plane...
timeout /t 2 /nobreak >nul
echo.
echo ===================================================
echo  SUCCESS: FRAULT Agent installed successfully!
echo  Your device is now protected by Zero Trust policies.
echo ===================================================
echo.
pause`;
    
    const blob = new Blob([content], { type: 'application/x-bat' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'frault-agent-win11-installer.bat';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestão de Agentes</h2>
          <p className="text-gray-400 text-sm">Gerencie a implantação e o status dos agentes FRAULT em endpoints.</p>
        </div>
        <button 
          onClick={handleDownload}
          className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-violet-600/20"
        >
          <Download className="w-5 h-5" />
          Baixar Agente (Windows 11)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Info Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Monitor className="w-5 h-5 text-violet-400" />
              Status da Frota
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/2 rounded-xl p-4 border border-white/5">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Online</p>
                <p className="text-2xl font-bold text-emerald-400">0</p>
              </div>
              <div className="bg-white/2 rounded-xl p-4 border border-white/5">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Offline</p>
                <p className="text-2xl font-bold text-gray-500">0</p>
              </div>
              <div className="bg-white/2 rounded-xl p-4 border border-white/5">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Desatualizados</p>
                <p className="text-2xl font-bold text-amber-400">0</p>
              </div>
            </div>
          </div>

          <div className="bg-[#12121a] border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Versões Disponíveis</h3>
              <span className="px-2 py-1 bg-violet-600/20 text-violet-400 text-[10px] font-bold rounded uppercase tracking-wider">Auto-update Ativo</span>
            </div>
            <div className="divide-y divide-white/5">
              {[
                { version: 'v2.4.1 (Stable)', date: '2024-03-01', type: 'Produção', status: 'Recomendado' },
                { version: 'v2.5.0-beta', date: '2024-03-02', type: 'Preview', status: 'Testes' },
              ].map((v) => (
                <div key={v.version} className="px-6 py-4 flex items-center justify-between hover:bg-white/2 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <Terminal className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{v.version}</p>
                      <p className="text-xs text-gray-500">Lançado em {v.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-medium text-gray-400">{v.type}</span>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      v.status === 'Recomendado' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {v.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Card */}
        <div className="bg-gradient-to-b from-[#1a1a26] to-[#12121a] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <ShieldCheck className="w-32 h-32 text-violet-400" />
          </div>
          
          <h3 className="text-lg font-bold text-white mb-6">Recursos do Agente</h3>
          <div className="space-y-6 relative z-10">
            {[
              { icon: Zap, title: 'Túnel Seguro', desc: 'Criptografia E2E automática para todos os Edge Nodes.' },
              { icon: RefreshCw, title: 'Failover Automático', desc: 'Conexão resiliente com troca instantânea de gateway.' },
              { icon: ShieldCheck, title: 'Zero Trust Enforcement', desc: 'Verificação contínua de identidade e postura.' },
              { icon: History, title: 'Logs Imutáveis', desc: 'Registro local e remoto de todas as tentativas de acesso.' },
            ].map((feature) => (
              <div key={feature.title} className="flex gap-4">
                <div className="p-2 bg-violet-600/20 rounded-lg h-fit">
                  <feature.icon className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{feature.title}</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Pronto para Implantação</span>
          </div>
        </div>
      </div>
    </div>
  );
};
