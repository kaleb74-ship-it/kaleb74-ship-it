import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Server, Mail, Shield, Plus, Trash2, Edit2, Save } from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'Leitura' | 'Edição' | 'Super Admin';
}

export const SettingsPage: React.FC = () => {
  const [hostname, setHostname] = useState('frault-edge-01.local');
  const [samlServer, setSamlServer] = useState('https://sso.frault.io/saml2');
  const [smtpServer, setSmtpServer] = useState('smtp.frault.io');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpEmail, setSmtpEmail] = useState('alerts@frault.io');

  const [admins, setAdmins] = useState<AdminUser[]>([
    { id: '1', name: 'Administrator', username: 'admin', email: 'admin@frault.io', role: 'Super Admin' },
    { id: '2', name: 'Security Analyst', username: 'soc_analyst', email: 'soc@frault.io', role: 'Leitura' },
  ]);

  const [newAdmin, setNewAdmin] = useState<Partial<AdminUser & { password?: string }>>({ role: 'Leitura' });
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);

  const handleAddAdmin = () => {
    if (newAdmin.name && newAdmin.email && newAdmin.username) {
      setAdmins([...admins, { ...newAdmin, id: Math.random().toString(36).substr(2, 9) } as AdminUser]);
      setNewAdmin({ role: 'Leitura' });
      setIsAddingAdmin(false);
    }
  };

  const handleDeleteAdmin = (id: string) => {
    setAdmins(admins.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-violet-400" />
            Configurações Globais
          </h2>
          <p className="text-gray-400 text-sm mt-1">Ajustes do sistema, integrações e controle de acesso (RBAC).</p>
        </div>
        <button className="px-6 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-violet-600/20">
          <Save className="w-4 h-4" />
          Salvar Alterações
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Settings */}
        <div className="space-y-6">
          <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Server className="w-5 h-5 text-cyan-400" />
              Identidade do Sistema
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hostname (FQDN)</label>
                <input 
                  type="text" 
                  value={hostname}
                  onChange={e => setHostname(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-400" />
              Notificações (SAML & SMTP)
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">SAML Server URL</label>
                <input 
                  type="text" 
                  value={samlServer}
                  onChange={e => setSamlServer(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50"
                  placeholder="https://sso.exemplo.com/saml2"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">SMTP Server</label>
                  <input 
                    type="text" 
                    value={smtpServer}
                    onChange={e => setSmtpServer(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Porta</label>
                  <input 
                    type="text" 
                    value={smtpPort}
                    onChange={e => setSmtpPort(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email de Envio</label>
                <input 
                  type="email" 
                  value={smtpEmail}
                  onChange={e => setSmtpEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Admin Users (RBAC) */}
        <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-violet-400" />
              Administradores (RBAC)
            </h3>
            <button 
              onClick={() => setIsAddingAdmin(!isAddingAdmin)}
              className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-xs font-bold transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {isAddingAdmin && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nome Completo</label>
                  <input 
                    type="text" 
                    value={newAdmin.name || ''}
                    onChange={e => setNewAdmin({...newAdmin, name: e.target.value})}
                    className="w-full px-3 py-1.5 bg-[#0a0a0f] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-violet-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Usuário (Login)</label>
                  <input 
                    type="text" 
                    value={newAdmin.username || ''}
                    onChange={e => setNewAdmin({...newAdmin, username: e.target.value})}
                    className="w-full px-3 py-1.5 bg-[#0a0a0f] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-violet-500/50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</label>
                  <input 
                    type="email" 
                    value={newAdmin.email || ''}
                    onChange={e => setNewAdmin({...newAdmin, email: e.target.value})}
                    className="w-full px-3 py-1.5 bg-[#0a0a0f] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-violet-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Senha</label>
                  <input 
                    type="password" 
                    value={newAdmin.password || ''}
                    onChange={e => setNewAdmin({...newAdmin, password: e.target.value})}
                    className="w-full px-3 py-1.5 bg-[#0a0a0f] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-violet-500/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Permissão</label>
                <select 
                  value={newAdmin.role}
                  onChange={e => setNewAdmin({...newAdmin, role: e.target.value as any})}
                  className="w-full px-3 py-1.5 bg-[#0a0a0f] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-violet-500/50"
                >
                  <option value="Leitura">Leitura (Read-Only)</option>
                  <option value="Edição">Edição (Read/Write)</option>
                  <option value="Super Admin">Super Admin (Full Access)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setIsAddingAdmin(false)}
                  className="px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleAddAdmin}
                  className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </motion.div>
          )}

          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-white/10">
            {admins.map(admin => (
              <div key={admin.id} className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between group hover:bg-white/10 transition-colors">
                <div>
                  <p className="text-sm font-bold text-white">{admin.name} <span className="text-violet-400 font-mono text-[10px] ml-2">@{admin.username}</span></p>
                  <p className="text-xs text-gray-400">{admin.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    admin.role === 'Super Admin' ? 'bg-red-500/10 text-red-400' :
                    admin.role === 'Edição' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {admin.role}
                  </span>
                  <button 
                    onClick={() => handleDeleteAdmin(admin.id)}
                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
