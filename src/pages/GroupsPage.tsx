import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UsersRound, Plus, Search, Trash2, Shield, Settings, Server, Lock, ChevronRight, Globe, X, RefreshCw } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  memberCount: number;
  type: 'Local' | 'LDAP' | 'SAML';
  description: string;
  externalId?: string; // LDAP DN or SAML Group ID
}

export const GroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([
    { id: '1', name: 'Administradores', memberCount: 5, type: 'Local', description: 'Acesso total ao sistema' },
    { id: '2', name: 'Desenvolvedores', memberCount: 12, type: 'LDAP', description: 'Integrado via Active Directory', externalId: 'cn=developers,dc=birdsase,dc=local' },
    { id: '3', name: 'Financeiro', memberCount: 8, type: 'SAML', description: 'Autenticação via Okta', externalId: 'okta_group_fin_001' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'groups' | 'integration'>('groups');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert('Sincronização concluída com sucesso!');
    }, 2000);
  };
  
  const [newGroup, setNewGroup] = useState<Partial<Group>>({
    type: 'Local',
    name: '',
    description: '',
    externalId: ''
  });

  const handleCreateGroup = () => {
    if (!newGroup.name) return;
    
    const group: Group = {
      id: Math.random().toString(36).substr(2, 9),
      name: newGroup.name!,
      description: newGroup.description || '',
      type: newGroup.type as any,
      memberCount: 0,
      externalId: newGroup.externalId
    };

    setGroups([...groups, group]);
    setIsModalOpen(false);
    setNewGroup({ type: 'Local', name: '', description: '', externalId: '' });
  };

  return (
    <div className="space-y-6">
      {/* Modal Criar Grupo */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <h2 className="text-lg font-bold text-white">Criar Novo Grupo</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nome do Grupo</label>
                  <input 
                    type="text" 
                    value={newGroup.name}
                    onChange={e => setNewGroup({...newGroup, name: e.target.value})}
                    placeholder="Ex: Engenharia"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tipo de Grupo</label>
                  <select 
                    value={newGroup.type}
                    onChange={e => setNewGroup({...newGroup, type: e.target.value as any, externalId: ''})}
                    className="w-full px-4 py-2 bg-[#1a1a26] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50"
                  >
                    <option value="Local">Local (Manual)</option>
                    <option value="LDAP">LDAP / Active Directory</option>
                    <option value="SAML">SAML 2.0 / SSO</option>
                  </select>
                </div>

                {newGroup.type === 'LDAP' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">LDAP Distinguished Name (DN)</label>
                    <input 
                      type="text" 
                      value={newGroup.externalId}
                      onChange={e => setNewGroup({...newGroup, externalId: e.target.value})}
                      placeholder="cn=users,dc=birdsase,dc=local"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50" 
                    />
                  </div>
                )}

                {newGroup.type === 'SAML' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">SAML Group ID / Attribute Value</label>
                    <input 
                      type="text" 
                      value={newGroup.externalId}
                      onChange={e => setNewGroup({...newGroup, externalId: e.target.value})}
                      placeholder="okta_group_id_123"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50" 
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Descrição</label>
                  <textarea 
                    value={newGroup.description}
                    onChange={e => setNewGroup({...newGroup, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50 resize-none"
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleCreateGroup}
                  className="px-6 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-violet-600/20"
                >
                  Criar Grupo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <UsersRound className="w-6 h-6 text-violet-400" />
            Gestão de Grupos
          </h2>
          <p className="text-gray-400 text-sm mt-1">Gerencie grupos de usuários locais ou integre com provedores externos.</p>
        </div>
        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
          <button 
            onClick={() => setActiveTab('groups')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'groups' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'text-gray-400 hover:text-white'}`}
          >
            Grupos
          </button>
          <button 
            onClick={() => setActiveTab('integration')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'integration' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'text-gray-400 hover:text-white'}`}
          >
            Integrações (LDAP/SAML)
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'groups' ? (
          <motion.div 
            key="groups"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <div className="flex justify-end gap-3">
              <button 
                onClick={handleSync}
                disabled={isSyncing}
                className={`px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-violet-600/20"
              >
                <Plus className="w-4 h-4" />
                Criar Novo Grupo
              </button>
            </div>

            <div className="bg-[#12121a] border border-white/5 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-[1fr_100px_100px_100px] gap-4 px-6 py-4 border-b border-white/5 bg-white/2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <div>Nome do Grupo</div>
                <div>Membros</div>
                <div>Tipo</div>
                <div className="text-right">Ações</div>
              </div>
              <div className="divide-y divide-white/5">
                {groups.map((group) => (
                  <div key={group.id} className="grid grid-cols-[1fr_100px_100px_100px] gap-4 px-6 py-4 items-center hover:bg-white/2 transition-colors group">
                    <div>
                      <p className="text-sm font-bold text-white">{group.name}</p>
                      <p className="text-xs text-gray-500">{group.description}</p>
                      {group.externalId && (
                        <p className="text-[10px] text-violet-400 font-mono mt-1 truncate max-w-xs" title={group.externalId}>
                          ID: {group.externalId}
                        </p>
                      )}
                    </div>
                    <div className="text-sm text-gray-400">{group.memberCount}</div>
                    <div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        group.type === 'Local' ? 'bg-blue-500/10 text-blue-400' :
                        group.type === 'LDAP' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-violet-500/10 text-violet-400'
                      }`}>
                        {group.type}
                      </span>
                    </div>
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-red-400/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="integration"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* LDAP Card */}
            <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-500/10 rounded-xl">
                    <Server className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Active Directory / LDAP</h3>
                    <p className="text-xs text-gray-500">Sincronize usuários e grupos locais.</p>
                  </div>
                </div>
                <div className="w-10 h-5 bg-emerald-500/20 rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-emerald-500 rounded-full" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Servidor LDAP</label>
                  <input type="text" defaultValue="ldap://10.0.0.50:389" className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Base DN</label>
                  <input type="text" defaultValue="dc=birdsase,dc=local" className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50" />
                </div>
                <button 
                  onClick={handleSync}
                  disabled={isSyncing}
                  className={`w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
                </button>
              </div>
            </div>

            {/* SAML Card */}
            <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-violet-500/10 rounded-xl">
                    <Lock className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">SAML 2.0 (SSO)</h3>
                    <p className="text-xs text-gray-500">Okta, Azure AD, Google Workspace.</p>
                  </div>
                </div>
                <div className="w-10 h-5 bg-gray-600/20 rounded-full relative">
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-gray-500 rounded-full" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Entity ID</label>
                  <input type="text" placeholder="https://birdsase.io/saml/metadata" className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">SSO URL</label>
                  <input type="text" placeholder="https://okta.com/app/birdsase/sso" className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50" />
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleSync}
                    disabled={isSyncing}
                    className={`flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    Sync
                  </button>
                  <button className="flex-[2] py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20">
                    <Globe className="w-4 h-4" />
                    Configurar SSO
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
