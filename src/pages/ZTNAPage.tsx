import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, UserCheck, Laptop, Activity, Plus, Trash2, Search, Zap, ShieldAlert } from 'lucide-react';

interface ZTNAPolicy {
  id: string;
  name: string;
  description: string;
  trustScore: number;
  action: 'Allow' | 'Deny' | 'MFA';
  enabled: boolean;
  trustedHost?: string;
  allowedOS?: 'Windows' | 'Linux' | 'macOS' | 'Android' | 'iOS' | 'Any';
  conditions?: {
    firewallActive: boolean;
    antivirusInstalled: boolean;
    certificateInstalled: boolean;
    certificateName?: string;
  };
  categories: {
    name: string;
    options: string[];
    selected: string;
  }[];
}

export const ZTNAPage: React.FC = () => {
  const defaultCategories = [
    { name: 'Sensibilidade de Aplicação', options: ['Alta', 'Média', 'Baixa'], selected: 'Média' },
    { name: 'Tipo de Acesso', options: ['Leitura', 'Escrita', 'Administração'], selected: 'Leitura' },
    { name: 'Dispositivo / Local', options: ['Corporativo', 'BYOD', 'Localização Permitida'], selected: 'Corporativo' },
    { name: 'Autenticação', options: ['MFA Obrigatória', 'SSO Integrado'], selected: 'MFA Obrigatória' },
  ];

  const [policies, setPolicies] = useState<ZTNAPolicy[]>([
    { 
      id: '1', 
      name: 'Acesso Administrativo', 
      description: 'Acesso a servidores críticos', 
      trustScore: 90, 
      action: 'Allow', 
      enabled: true, 
      trustedHost: '192.168.1.100',
      allowedOS: 'Windows',
      conditions: { firewallActive: true, antivirusInstalled: true, certificateInstalled: true, certificateName: 'BirdSase-Root-CA' },
      categories: defaultCategories 
    },
    { 
      id: '2', 
      name: 'Acesso Externo', 
      description: 'Acesso de usuários remotos', 
      trustScore: 70, 
      action: 'MFA', 
      enabled: true, 
      allowedOS: 'Any',
      conditions: { firewallActive: true, antivirusInstalled: true, certificateInstalled: false },
      categories: defaultCategories 
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ZTNAPolicy>({ 
    id: '', 
    name: '', 
    description: '', 
    trustScore: 80, 
    action: 'Allow', 
    enabled: true,
    trustedHost: '',
    allowedOS: 'Any',
    conditions: {
      firewallActive: false,
      antivirusInstalled: false,
      certificateInstalled: false,
      certificateName: ''
    },
    categories: defaultCategories
  });

  const handleSave = async () => {
    const newPolicy = { ...formData, id: Math.random().toString(36).substr(2, 9) };
    setPolicies([...policies, newPolicy]);
    setIsModalOpen(false);

    // Generate log for policy creation
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: 'admin',
          workstation: 'CONTROL-PLANE',
          application: 'ZTNA-CONFIG',
          action: 'Inspect',
          threatLevel: 'Low',
          destIp: '0.0.0.0',
          mac: '00:00:00:00:00:00',
          sourceIp: '127.0.0.1'
        })
      });
    } catch (err) {
      console.error('Failed to log policy creation');
    }
  };

  const handleCategoryChange = (catIdx: number, value: string) => {
    const newCats = [...formData.categories];
    newCats[catIdx].selected = value;
    setFormData({ ...formData, categories: newCats });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-violet-400" />
            Zero Trust Network Access (ZTNA)
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Gerencie políticas de acesso baseadas em confiança e postura do dispositivo.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-violet-600/20"
        >
          <Plus className="w-4 h-4" />
          Nova Política ZTNA
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#12121a] border border-white/5 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_80px] gap-4 px-6 py-4 border-b border-white/5 bg-white/2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              <div>Nome da Política</div>
              <div>Confiança Mínima</div>
              <div>Ação</div>
              <div>Status</div>
              <div className="text-right">Ações</div>
            </div>

            <div className="divide-y divide-white/5">
              {policies.map((policy) => (
                <div key={policy.id} className="grid grid-cols-[1.5fr_1fr_1fr_1fr_80px] gap-4 px-6 py-4 items-center hover:bg-white/2 transition-colors group">
                  <div>
                    <p className="text-sm font-bold text-white">{policy.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        policy.categories[0].selected === 'Alta' ? 'bg-red-500/20 text-red-400' :
                        policy.categories[0].selected === 'Média' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {policy.categories[0].selected}
                      </span>
                      <p className="text-xs text-gray-500 truncate">{policy.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden w-24">
                      <div 
                        className={`h-full rounded-full ${policy.trustScore >= 80 ? 'bg-emerald-500' : policy.trustScore >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${policy.trustScore}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-300">{policy.trustScore}%</span>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      policy.action === 'Allow' ? 'bg-emerald-500/10 text-emerald-400' :
                      policy.action === 'Deny' ? 'bg-red-500/10 text-red-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>
                      {policy.action}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${policy.enabled ? 'bg-emerald-500' : 'bg-gray-600'}`} />
                      <span className="text-xs text-gray-400">{policy.enabled ? 'Ativa' : 'Inativa'}</span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className="p-2 hover:bg-red-400/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-b from-[#1a1a26] to-[#12121a] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Métricas de Confiança</h3>
            <div className="space-y-6">
              {[
                { icon: UserCheck, title: 'Identidade', desc: 'Verificação de MFA e localização.' },
                { icon: Laptop, title: 'Postura do Dispositivo', desc: 'Verificação de Antivírus e Firewall local.' },
                { icon: ShieldAlert, title: 'Comportamento', desc: 'Análise de anomalias no tráfego.' },
                { icon: Activity, title: 'Contexto', desc: 'Horário e rede de origem.' },
              ].map((metric) => (
                <div key={metric.title} className="flex gap-4">
                  <div className="p-2 bg-violet-600/20 rounded-lg h-fit">
                    <metric.icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{metric.title}</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{metric.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <h2 className="text-lg font-bold text-white">Nova Política ZTNA</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nome</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Confiança Mínima (%)</label>
                <input 
                  type="range" 
                  min="0" max="100"
                  value={formData.trustScore}
                  onChange={e => setFormData({...formData, trustScore: parseInt(e.target.value)})}
                  className="w-full accent-violet-500"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-bold">
                  <span>0% (Baixa)</span>
                  <span className="text-violet-400">{formData.trustScore}%</span>
                  <span>100% (Alta)</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ação</label>
                <select 
                  value={formData.action}
                  onChange={e => setFormData({...formData, action: e.target.value as any})}
                  className="w-full px-4 py-2 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50"
                >
                  <option value="Allow">Permitir</option>
                  <option value="Deny">Bloquear</option>
                  <option value="MFA">Exigir MFA</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Trusted Host (IP/CIDR)</label>
                  <input 
                    type="text" 
                    placeholder="Ex: 192.168.1.0/24"
                    value={formData.trustedHost}
                    onChange={e => setFormData({...formData, trustedHost: e.target.value})}
                    className="w-full px-4 py-2 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Allowed OS</label>
                  <select 
                    value={formData.allowedOS}
                    onChange={e => setFormData({...formData, allowedOS: e.target.value as any})}
                    className="w-full px-4 py-2 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50"
                  >
                    <option value="Any">Qualquer</option>
                    <option value="Windows">Windows</option>
                    <option value="Linux">Linux</option>
                    <option value="macOS">macOS</option>
                    <option value="Android">Android</option>
                    <option value="iOS">iOS</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Condições de Acesso (Allow If)</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={formData.conditions?.firewallActive}
                      onChange={e => setFormData({...formData, conditions: { ...formData.conditions!, firewallActive: e.target.checked }})}
                      className="w-4 h-4 accent-violet-500"
                    />
                    <span className="text-xs text-gray-300">Firewall Ativo</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={formData.conditions?.antivirusInstalled}
                      onChange={e => setFormData({...formData, conditions: { ...formData.conditions!, antivirusInstalled: e.target.checked }})}
                      className="w-4 h-4 accent-violet-500"
                    />
                    <span className="text-xs text-gray-300">Antivírus Instalado</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors col-span-2">
                    <input 
                      type="checkbox" 
                      checked={formData.conditions?.certificateInstalled}
                      onChange={e => setFormData({...formData, conditions: { ...formData.conditions!, certificateInstalled: e.target.checked }})}
                      className="w-4 h-4 accent-violet-500"
                    />
                    <span className="text-xs text-gray-300">Certificado Instalado</span>
                  </label>
                </div>

                {formData.conditions?.certificateInstalled && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nome do Certificado</label>
                    <input 
                      type="text" 
                      placeholder="Ex: BirdSase-Client-Cert"
                      value={formData.conditions.certificateName}
                      onChange={e => setFormData({...formData, conditions: { ...formData.conditions!, certificateName: e.target.value }})}
                      className="w-full px-4 py-2 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50"
                    />
                  </motion.div>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ajustes de Confiança</label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                  {formData.categories.map((cat, idx) => (
                    <div key={cat.name} className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{cat.name}</p>
                      <div className="flex flex-wrap gap-2">
                        {cat.options.map(opt => (
                          <button
                            key={opt}
                            onClick={() => handleCategoryChange(idx, opt)}
                            className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                              cat.selected === opt 
                                ? 'bg-violet-600 text-white' 
                                : 'bg-white/5 text-gray-500 hover:bg-white/10'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-400">Cancelar</button>
              <button onClick={handleSave} className="px-6 py-2 bg-violet-600 text-white rounded-xl text-sm font-bold">Criar Política</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
