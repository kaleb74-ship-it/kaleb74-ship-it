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
  Terminal,
  Server,
  Globe,
  Settings,
  Code2,
  FileCode2,
  Cpu
} from 'lucide-react';

export const Agents: React.FC = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [serverAddress, setServerAddress] = useState('10.0.0.100');
  const [telemetryPort, setTelemetryPort] = useState('443');
  const [isSaving, setIsSaving] = useState(false);

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
title Bird Sase Agent Installer
color 0B
echo ===================================================
echo        Bird Sase Agent Installer (Windows 11)
echo ===================================================
echo.
echo Servidor de Conexao: ${serverAddress}
echo Porta de Telemetria: ${telemetryPort}
echo.
echo Initializing setup...
timeout /t 2 /nobreak >nul
echo Checking system requirements...
timeout /t 1 /nobreak >nul
echo [OK] Windows 11 detected.
echo [OK] Network adapters verified.
echo.
echo Configurando endpoint de telemetria...
echo Endpoint: ${serverAddress}:${telemetryPort} > birdsase_config.ini
echo.
echo Installing Bird Sase Edge Node Services...
timeout /t 2 /nobreak >nul
echo [##########          ] 50%
timeout /t 2 /nobreak >nul
echo [####################] 100%
echo.
echo Registering agent with Bird Sase Control Plane...
echo Tentando conectar em ${serverAddress}...
timeout /t 2 /nobreak >nul
echo [OK] Conectado ao Servidor de Controle.
echo.
echo ===================================================
echo  SUCCESS: Bird Sase Agent installed successfully!
echo  Your device is now protected by Zero Trust policies.
echo ===================================================
echo.
pause`;
    
    const blob = new Blob([content], { type: 'application/x-bat' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'birdsase-agent-win11-installer.bat';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPythonAgent = () => {
    const content = `import requests
import socket
import platform
import time
import json
import uuid

# CONFIGURACOES DO SERVIDOR (Ajuste para o IP da sua maquina rodando o servidor)
SERVER_URL = "http://${serverAddress}:5000"

def get_agent_data():
    return {
        "hostname": socket.gethostname(),
        "mac": ':'.join(['{:02x}'.format((uuid.getnode() >> ele) & 0xff) for ele in range(0,8*6,8)][::-1]),
        "ip": socket.gethostbyname(socket.gethostname()),
        "os": f"{platform.system()} {platform.release()}",
        "version": "v2.4.1-py",
        "status": "Online"
    }

def register():
    print(f"[*] Tentando registrar agente em {SERVER_URL}...")
    try:
        data = get_agent_data()
        response = requests.post(f"{SERVER_URL}/api/agents/register", json=data, timeout=5)
        if response.status_code == 200:
            print("[+] Agente registrado com sucesso!")
            return True
    except Exception as e:
        print(f"[-] Erro ao registrar: {e}")
    return False

def send_telemetry():
    print("[*] Enviando telemetria...")
    try:
        data = get_agent_data()
        log = {
            "user": platform.node(),
            "workstation": data['hostname'],
            "sourceIp": data['ip'],
            "mac": data['mac'],
            "destIp": "8.8.8.8",
            "application": "Python-Telemetry",
            "action": "Allow",
            "threatLevel": "Low"
        }
        requests.post(f"{SERVER_URL}/api/logs", json=log, timeout=5)
    except Exception as e:
        print(f"[-] Erro na telemetria: {e}")

if __name__ == "__main__":
    print("=== Bird Sase Python Agent ===")
    if register():
        while True:
            send_telemetry()
            time.sleep(10)
`;
    const blob = new Blob([content], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'birdsase_agent.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPythonServer = () => {
    const content = `from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)

# Banco de dados em memoria
agents = {}
logs = []

@app.route('/api/agents/register', methods=['POST'])
def register_agent():
    data = request.json
    agent_id = data.get('mac')
    agents[agent_id] = {
        **data,
        "id": agent_id,
        "lastSeen": datetime.datetime.now().isoformat()
    }
    print(f"[+] Agente registrado: {data.get('hostname')}")
    return jsonify({"status": "success"}), 200

@app.route('/api/logs', methods=['POST'])
def receive_logs():
    data = request.json
    logs.append({
        **data,
        "timestamp": datetime.datetime.now().isoformat()
    })
    print(f"[LOG] {data.get('action')} - {data.get('sourceIp')} -> {data.get('destIp')}")
    return jsonify({"status": "success"}), 200

@app.route('/api/agents', methods=['GET'])
def get_agents():
    return jsonify(list(agents.values())), 200

if __name__ == '__main__':
    print("=== Bird Sase Local Control Plane (Server) ===")
    print("[*] Servidor rodando em http://0.0.0.0:5000")
    app.run(host='0.0.0.0', port=5000)
`;
    const blob = new Blob([content], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'birdsase_server.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const simulateAgent = async () => {
    const users = [
      { username: 'kaleb.admin', domain: 'BIRDSASE.LOCAL', isAD: true },
      { username: 'maria.silva', domain: 'BIRDSASE.LOCAL', isAD: true },
      { username: 'joao.dev', domain: '', isAD: false },
      { username: 'guest_user', domain: '', isAD: false },
    ];
    const randomUser = users[Math.floor(Math.random() * users.length)];

    const testAgent = {
      hostname: `TEST-NODE-${Math.floor(Math.random() * 1000)}`,
      mac: `52:54:00:${Math.floor(Math.random() * 255).toString(16).padStart(2, '0')}:${Math.floor(Math.random() * 255).toString(16).padStart(2, '0')}:${Math.floor(Math.random() * 255).toString(16).padStart(2, '0')}`,
      ip: `10.10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      os: "Windows 11",
      currentUser: {
        ...randomUser,
        lastLogin: new Date().toISOString()
      }
    };

    try {
      const res = await fetch('/api/agents/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testAgent)
      });
      if (res.ok) {
        fetchAgents();
        // Also send a test log
        await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: 'test.user',
            workstation: testAgent.hostname,
            sourceIp: testAgent.ip,
            mac: testAgent.mac,
            destIp: '8.8.8.8',
            application: 'DNS',
            action: 'Allow',
            threatLevel: 'Low'
          })
        });
      }
    } catch (err) {
      console.error("Simulation failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestão de Agentes</h2>
          <p className="text-gray-400 text-sm">Gerencie a implantação e o status dos agentes Bird Sase em endpoints.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={simulateAgent}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
          >
            <Zap className="w-5 h-5 text-amber-400" />
            Simular Novo Agente
          </button>
          <button 
            onClick={handleDownload}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-violet-600/20"
          >
            <Download className="w-5 h-5" />
            Baixar Agente (Windows 11)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connection Config Card */}
        <div className="lg:col-span-3">
          <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-cyan-400" />
                Configuração de Conexão do Servidor (Telemetria)
              </h3>
              <button 
                onClick={() => {
                  setIsSaving(true);
                  setTimeout(() => setIsSaving(false), 1500);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isSaving ? 'bg-emerald-500/20 text-emerald-400' : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20'
                }`}
              >
                {isSaving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Settings className="w-3 h-3" />}
                {isSaving ? 'Salvando...' : 'Salvar Configuração'}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Endereço do Servidor (IP ou DNS)</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    value={serverAddress}
                    onChange={e => setServerAddress(e.target.value)}
                    placeholder="Ex: 192.168.1.100 ou sase.empresa.com"
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Porta de Telemetria</label>
                <input 
                  type="text" 
                  value={telemetryPort}
                  onChange={e => setTelemetryPort(e.target.value)}
                  placeholder="Ex: 443"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all"
                />
              </div>
              <div className="flex items-end">
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl w-full">
                  <p className="text-[10px] text-cyan-400 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" />
                    Modo de Conexão Direta Ativo
                  </p>
                  <p className="text-[9px] text-gray-500 mt-1">Os agentes usarão este endereço para reportar telemetria e receber políticas.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Info Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Local Deployment Section */}
          <div className="bg-gradient-to-r from-violet-900/20 to-cyan-900/20 border border-violet-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-500/20 rounded-lg">
                  <Code2 className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Implantação Local (Dev/Offline)</h3>
                  <p className="text-xs text-gray-400">Rode o ecossistema Bird Sase diretamente no seu VS Code ou rede local.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-[9px] font-bold rounded border border-amber-500/20 uppercase tracking-wider">Python 3.x Required</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={downloadPythonServer}
                className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Server className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold text-white">Servidor SASE (Control Plane)</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Gera o arquivo <code className="text-cyan-400">birdsase_server.py</code>. 
                  Rode este script primeiro para centralizar os logs e agentes da sua rede.
                </p>
                <div className="mt-3 flex items-center gap-2 text-[9px] font-bold text-cyan-400 uppercase">
                  <FileCode2 className="w-3 h-3" />
                  Baixar Script Servidor
                </div>
              </button>

              <button 
                onClick={downloadPythonAgent}
                className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Cpu className="w-5 h-5 text-violet-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold text-white">Agente SASE (Python)</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Gera o arquivo <code className="text-violet-400">birdsase_agent.py</code>. 
                  Distribua este script nas máquinas da rede para conectá-las ao seu servidor local.
                </p>
                <div className="mt-3 flex items-center gap-2 text-[9px] font-bold text-violet-400 uppercase">
                  <FileCode2 className="w-3 h-3" />
                  Baixar Script Agente
                </div>
              </button>
            </div>
          </div>

          <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Monitor className="w-5 h-5 text-violet-400" />
              Status da Frota
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/2 rounded-xl p-4 border border-white/5">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Online</p>
                <p className="text-2xl font-bold text-emerald-400">{onlineCount}</p>
              </div>
              <div className="bg-white/2 rounded-xl p-4 border border-white/5">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Offline</p>
                <p className="text-2xl font-bold text-gray-500">{offlineCount}</p>
              </div>
              <div className="bg-white/2 rounded-xl p-4 border border-white/5">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Desatualizados</p>
                <p className="text-2xl font-bold text-amber-400">{outdatedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#12121a] border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Agentes Conectados</h3>
              <span className="px-2 py-1 bg-violet-600/20 text-violet-400 text-[10px] font-bold rounded uppercase tracking-wider">{agents.length} Total</span>
            </div>
            <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
              {agents.length > 0 ? (
                agents.map((agent) => (
                  <div key={agent.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/2 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${agent.status === 'Online' ? 'bg-emerald-500/10' : 'bg-gray-500/10'}`}>
                        <Monitor className={`w-5 h-5 ${agent.status === 'Online' ? 'text-emerald-400' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{agent.hostname}</p>
                        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">{agent.mac} • {agent.ip}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Versão</p>
                        <p className="text-xs text-gray-300">{agent.version}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Status</p>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          agent.status === 'Online' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {agent.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 text-sm italic">
                  Nenhum agente registrado ainda. Use o comando curl para registrar um agente.
                </div>
              )}
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
