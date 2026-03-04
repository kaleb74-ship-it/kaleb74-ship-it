import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Globe, Laptop, Search, RefreshCw, UserCheck, UserX } from 'lucide-react';

interface AgentUser {
  username: string;
  domain?: string;
  isAD: boolean;
  lastLogin: string;
  hostname: string;
  agentId: string;
}

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<AgentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.domain && u.domain.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-violet-400" />
            Usuários Ativos
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Visualize usuários locais e de domínio (AD) identificados pelos agentes Bird Sase.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Pesquisar usuários..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50 w-64"
            />
          </div>
          <button 
            onClick={fetchUsers}
            className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total de Usuários</p>
          <p className="text-3xl font-bold text-white">{users.length}</p>
        </div>
        <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Usuários AD</p>
          <p className="text-3xl font-bold text-cyan-400">{users.filter(u => u.isAD).length}</p>
        </div>
        <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Usuários Locais</p>
          <p className="text-3xl font-bold text-violet-400">{users.filter(u => !u.isAD).length}</p>
        </div>
      </div>

      <div className="bg-[#12121a] border border-white/5 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 border-b border-white/5 bg-white/2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          <div>Usuário</div>
          <div>Tipo de Conta</div>
          <div>Estação de Trabalho</div>
          <div>Domínio</div>
          <div>Último Login</div>
        </div>

        <div className="divide-y divide-white/5">
          {filteredUsers.length > 0 ? filteredUsers.map((user, idx) => (
            <motion.div 
              key={`${user.agentId}-${idx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 items-center hover:bg-white/2 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${user.isAD ? 'bg-cyan-500/10' : 'bg-violet-500/10'}`}>
                  <Users className={`w-4 h-4 ${user.isAD ? 'text-cyan-400' : 'text-violet-400'}`} />
                </div>
                <span className="text-sm font-bold text-white">{user.username}</span>
              </div>
              <div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                  user.isAD ? 'bg-cyan-500/10 text-cyan-400' : 'bg-violet-500/10 text-violet-400'
                }`}>
                  {user.isAD ? 'Active Directory' : 'Local User'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Laptop className="w-4 h-4 text-gray-500" />
                {user.hostname}
              </div>
              <div className="text-sm text-gray-500 font-mono">
                {user.domain || 'N/A'}
              </div>
              <div className="text-xs text-gray-400">
                {new Date(user.lastLogin).toLocaleString()}
              </div>
            </motion.div>
          )) : (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-sm italic">Nenhum usuário identificado nos agentes ativos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
