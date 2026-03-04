import React, { useState } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  GripVertical, 
  Shield, 
  Eye, 
  Ban, 
  CheckCircle2, 
  XCircle,
  Copy,
  Trash2,
  ArrowUp,
  Clock,
  FileText
} from 'lucide-react';
import { FirewallPolicy } from '../types';
import { PolicyEditorModal } from '../components/PolicyEditorModal';

const initialPolicies: FirewallPolicy[] = [
  { id: '1', priority: 1, name: 'Block Malicious IPs', source: ['Any'], destination: ['Threat Intelligence List'], service: ['Any'], action: 'Deny', schedule: 'Always', log: true, enabled: true },
  { id: '2', priority: 2, name: 'Allow Corporate VPN', source: ['Remote Users'], destination: ['Internal Network'], service: ['UDP 4500'], action: 'Allow', schedule: 'Always', log: true, enabled: true },
  { id: '3', priority: 3, name: 'Inspect Web Traffic', source: ['Guest Network'], destination: ['Internet'], service: ['HTTP/HTTPS'], action: 'Inspect', schedule: 'Business Hours', log: true, enabled: true },
  { id: '4', priority: 4, name: 'Default Deny', source: ['Any'], destination: ['Any'], service: ['Any'], action: 'Deny', schedule: 'Always', log: true, enabled: true },
];

export const Policies: React.FC = () => {
  const [policies, setPolicies] = useState(initialPolicies);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPolicy, setEditingPolicy] = useState<FirewallPolicy | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSavePolicy = (savedPolicy: FirewallPolicy) => {
    if (editingPolicy) {
      setPolicies(policies.map(p => p.id === savedPolicy.id ? savedPolicy : p));
    } else {
      setPolicies([...policies, { ...savedPolicy, priority: policies.length + 1 }]);
    }
  };

  const renderArrayField = (field: string | string[]) => {
    const arr = Array.isArray(field) ? field : [field];
    if (arr.length === 0) return '-';
    if (arr.length === 1) return arr[0];
    return `${arr[0]} (+${arr.length - 1})`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Políticas de Firewall</h2>
          <p className="text-gray-400 text-sm">Gerencie as regras de filtragem de tráfego L3/L4 e L7.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => { setEditingPolicy(null); setIsModalOpen(true); }}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-violet-600/20"
          >
            <Plus className="w-4 h-4" />
            Nova Política
          </button>
          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-xl text-sm font-bold transition-all">
            Aplicar Alterações
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-[#12121a] p-4 rounded-2xl border border-white/5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por nome, origem, destino..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-300 outline-none">
            <option>Todas as Ações</option>
            <option>Permitir</option>
            <option>Negar</option>
            <option>Inspecionar</option>
          </select>
          <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-300 outline-none">
            <option>Status: Todos</option>
            <option>Ativas</option>
            <option>Desativadas</option>
          </select>
        </div>
      </div>

      {/* Policies List */}
      <div className="bg-[#12121a] border border-white/5 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[40px_60px_1fr_1fr_1fr_1fr_120px_100px_100px] gap-4 px-6 py-4 border-bottom border-white/5 bg-white/2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          <div></div>
          <div>Prioridade</div>
          <div>Nome</div>
          <div>Origem</div>
          <div>Destino</div>
          <div>Serviço</div>
          <div>Ação</div>
          <div>Status</div>
          <div className="text-right">Ações</div>
        </div>

        <Reorder.Group axis="y" values={policies} onReorder={setPolicies} className="divide-y divide-white/5">
          {policies.map((policy) => (
            <Reorder.Item
              key={policy.id}
              value={policy}
              className="grid grid-cols-[40px_60px_1fr_1fr_1fr_1fr_120px_100px_100px] gap-4 px-6 py-4 items-center hover:bg-white/2 transition-colors group cursor-default"
            >
              <div className="cursor-grab active:cursor-grabbing text-gray-600 group-hover:text-gray-400">
                <GripVertical className="w-4 h-4" />
              </div>
              <div className="text-sm font-mono text-gray-500">#{policy.priority}</div>
              <div className="text-sm font-semibold text-white">{policy.name}</div>
              <div className="text-sm text-gray-400">{renderArrayField(policy.source)}</div>
              <div className="text-sm text-gray-400">{renderArrayField(policy.destination)}</div>
              <div className="text-sm text-gray-400">{renderArrayField(policy.service)}</div>
              <div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  policy.action === 'Allow' ? 'bg-emerald-500/10 text-emerald-400' :
                  policy.action === 'Deny' ? 'bg-red-500/10 text-red-400' :
                  'bg-cyan-500/10 text-cyan-400'
                }`}>
                  {policy.action === 'Allow' ? <CheckCircle2 className="w-3 h-3" /> :
                   policy.action === 'Deny' ? <Ban className="w-3 h-3" /> :
                   <Eye className="w-3 h-3" />}
                  {policy.action}
                </span>
              </div>
              <div>
                <button className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${policy.enabled ? 'bg-violet-600' : 'bg-white/10'}`}>
                  <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${policy.enabled ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors" title="Clonar">
                  <Copy className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { setEditingPolicy(policy); setIsModalOpen(true); }}
                  className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors" 
                  title="Editar"
                >
                  <FileText className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setPolicies(policies.filter(p => p.id !== policy.id))}
                  className="p-2 hover:bg-red-400/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors" 
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>

      {/* Policy Details / Create Modal (Simplified for UI) */}
      <div className="bg-violet-600/5 border border-violet-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-violet-600/10 rounded-xl">
            <Shield className="w-6 h-6 text-violet-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">Dica de Configuração</h3>
            <p className="text-gray-400 text-sm mt-1">
              As políticas são processadas de cima para baixo. Arraste as regras para reordenar a prioridade. 
              Sempre mantenha uma regra de "Default Deny" no final para garantir a segurança Zero Trust.
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <PolicyEditorModal 
            policy={editingPolicy} 
            onClose={() => setIsModalOpen(false)} 
            onSave={handleSavePolicy} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};
