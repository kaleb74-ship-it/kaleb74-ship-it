import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Search, Shield, Globe, Zap, Network, Lock } from 'lucide-react';
import { FirewallPolicy } from '../types';
import { useStore } from '../store';

interface PolicyEditorModalProps {
  policy: FirewallPolicy | null;
  onClose: () => void;
  onSave: (policy: FirewallPolicy) => void;
}

const internetServices = ['Microsoft 365', 'Google Workspace', 'AWS', 'Azure', 'Salesforce', 'Zoom', 'GitHub', 'Slack'];

export const PolicyEditorModal: React.FC<PolicyEditorModalProps> = ({ policy, onClose, onSave }) => {
  const store = useStore();
  const [formData, setFormData] = useState<FirewallPolicy>(
    policy || {
      id: Math.random().toString(36).substr(2, 9),
      priority: 999,
      name: 'Nova Política',
      source: ['Any'],
      destination: ['Any'],
      service: ['Any'],
      action: 'Deny',
      schedule: 'Always',
      log: true,
      enabled: true,
      securityProfiles: {}
    }
  );

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  // Helper to render array fields
  const renderTags = (items: string | string[], field: 'source' | 'destination' | 'service') => {
    const arr = Array.isArray(items) ? items : [items];
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {arr.map((item, idx) => (
          <span key={idx} className="px-2 py-1 bg-white/10 border border-white/20 rounded-md text-xs text-gray-300 flex items-center gap-1">
            {item}
            <button 
              onClick={() => {
                const newArr = arr.filter((_, i) => i !== idx);
                setFormData({ ...formData, [field]: newArr.length ? newArr : ['Any'] });
              }}
              className="hover:text-red-400 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-violet-400" />
            {policy ? 'Editar Política' : 'Nova Política'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-white/10">
          
          {/* General Settings */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nome da Política</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors"
                placeholder="Ex: Allow Corporate VPN"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ação</label>
              <select 
                value={formData.action}
                onChange={e => setFormData({...formData, action: e.target.value as any})}
                className="w-full px-4 py-2 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors"
              >
                <option value="Allow">Permitir (Allow)</option>
                <option value="Deny">Bloquear (Deny)</option>
                <option value="Inspect">Inspecionar (Inspect)</option>
              </select>
            </div>
          </div>

          {/* Traffic Matching */}
          <div className="grid grid-cols-3 gap-6">
            {/* Source */}
            <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Origem</label>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <select 
                  className="w-full pl-9 pr-4 py-2 bg-[#0a0a0f] border border-white/10 rounded-lg text-xs text-white appearance-none focus:outline-none focus:border-violet-500/50"
                  onChange={e => {
                    if (e.target.value) {
                      const current = Array.isArray(formData.source) ? formData.source : [formData.source];
                      setFormData({...formData, source: [...current.filter(i => i !== 'Any'), e.target.value]});
                      e.target.value = '';
                    }
                  }}
                >
                  <option value="">Adicionar Objeto / Usuário...</option>
                  <option value="Any">Any</option>
                  <option value="Remote Users">Remote Users</option>
                  <option value="Guest Network">Guest Network</option>
                  {store.objects.map(o => <option key={o.id} value={o.name}>{o.name} ({o.value})</option>)}
                </select>
              </div>
              {renderTags(formData.source, 'source')}
            </div>

            {/* Destination */}
            <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Destino</label>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <select 
                  className="w-full pl-9 pr-4 py-2 bg-[#0a0a0f] border border-white/10 rounded-lg text-xs text-white appearance-none focus:outline-none focus:border-violet-500/50"
                  onChange={e => {
                    if (e.target.value) {
                      const current = Array.isArray(formData.destination) ? formData.destination : [formData.destination];
                      setFormData({...formData, destination: [...current.filter(i => i !== 'Any'), e.target.value]});
                      e.target.value = '';
                    }
                  }}
                >
                  <option value="">Adicionar Objeto / Internet Service...</option>
                  <option value="Any">Any</option>
                  <option value="Internet">Internet</option>
                  <option value="Internal Network">Internal Network</option>
                  <optgroup label="Objetos">
                    {store.objects.map(o => <option key={o.id} value={o.name}>{o.name} ({o.value})</option>)}
                  </optgroup>
                  <optgroup label="Internet Services">
                    {internetServices.map(s => <option key={s} value={s}>{s}</option>)}
                  </optgroup>
                </select>
              </div>
              {renderTags(formData.destination, 'destination')}
            </div>

            {/* Service */}
            <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Serviço</label>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <select 
                  className="w-full pl-9 pr-4 py-2 bg-[#0a0a0f] border border-white/10 rounded-lg text-xs text-white appearance-none focus:outline-none focus:border-violet-500/50"
                  onChange={e => {
                    if (e.target.value) {
                      const current = Array.isArray(formData.service) ? formData.service : [formData.service];
                      setFormData({...formData, service: [...current.filter(i => i !== 'Any'), e.target.value]});
                      e.target.value = '';
                    }
                  }}
                >
                  <option value="">Adicionar Serviço...</option>
                  <option value="Any">Any</option>
                  <option value="HTTP/HTTPS">HTTP/HTTPS</option>
                  <option value="UDP 4500">UDP 4500</option>
                  {store.services.map(s => <option key={s.id} value={s.name}>{s.name} ({s.protocol} {s.port})</option>)}
                </select>
              </div>
              {renderTags(formData.service, 'service')}
            </div>
          </div>

          {/* Security Profiles */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">Perfis de Segurança (L7)</h3>
            <div className="grid grid-cols-2 gap-4">
              
              {/* Web Filter */}
              <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${formData.securityProfiles?.webFilter ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/5 border-white/5'}`}>
                <div className="flex items-center gap-3">
                  <Globe className={`w-5 h-5 ${formData.securityProfiles?.webFilter ? 'text-blue-400' : 'text-gray-500'}`} />
                  <div>
                    <p className={`text-sm font-bold ${formData.securityProfiles?.webFilter ? 'text-blue-400' : 'text-gray-400'}`}>Web Filter</p>
                    {formData.securityProfiles?.webFilter && (
                      <select 
                        className="mt-1 bg-[#0a0a0f] border border-white/10 rounded text-xs text-gray-300 py-1 px-2 outline-none focus:border-blue-500/50"
                        value={formData.securityProfiles?.webFilter || ''}
                        onChange={e => setFormData({
                          ...formData, 
                          securityProfiles: { ...formData.securityProfiles, webFilter: e.target.value }
                        })}
                      >
                        {store.webFilters.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                      </select>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => {
                    const current = formData.securityProfiles?.webFilter;
                    setFormData({
                      ...formData, 
                      securityProfiles: { ...formData.securityProfiles, webFilter: current ? undefined : store.webFilters[0]?.name }
                    });
                  }}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${formData.securityProfiles?.webFilter ? 'bg-blue-500' : 'bg-white/10'}`}
                >
                  <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${formData.securityProfiles?.webFilter ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Application Control */}
              <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${formData.securityProfiles?.appControl ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/5 border-white/5'}`}>
                <div className="flex items-center gap-3">
                  <Zap className={`w-5 h-5 ${formData.securityProfiles?.appControl ? 'text-amber-400' : 'text-gray-500'}`} />
                  <div>
                    <p className={`text-sm font-bold ${formData.securityProfiles?.appControl ? 'text-amber-400' : 'text-gray-400'}`}>Application Control</p>
                    {formData.securityProfiles?.appControl && (
                      <select 
                        className="mt-1 bg-[#0a0a0f] border border-white/10 rounded text-xs text-gray-300 py-1 px-2 outline-none focus:border-amber-500/50"
                        value={formData.securityProfiles?.appControl || ''}
                        onChange={e => setFormData({
                          ...formData, 
                          securityProfiles: { ...formData.securityProfiles, appControl: e.target.value }
                        })}
                      >
                        {store.appControls.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                      </select>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => {
                    const current = formData.securityProfiles?.appControl;
                    setFormData({
                      ...formData, 
                      securityProfiles: { ...formData.securityProfiles, appControl: current ? undefined : store.appControls[0]?.name }
                    });
                  }}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${formData.securityProfiles?.appControl ? 'bg-amber-500' : 'bg-white/10'}`}
                >
                  <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${formData.securityProfiles?.appControl ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* DNS Filtering */}
              <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${formData.securityProfiles?.dns ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/5'}`}>
                <div className="flex items-center gap-3">
                  <Network className={`w-5 h-5 ${formData.securityProfiles?.dns ? 'text-emerald-400' : 'text-gray-500'}`} />
                  <div>
                    <p className={`text-sm font-bold ${formData.securityProfiles?.dns ? 'text-emerald-400' : 'text-gray-400'}`}>DNS Filtering</p>
                    {formData.securityProfiles?.dns && (
                      <select 
                        className="mt-1 bg-[#0a0a0f] border border-white/10 rounded text-xs text-gray-300 py-1 px-2 outline-none focus:border-emerald-500/50"
                        value={formData.securityProfiles?.dns || ''}
                        onChange={e => setFormData({
                          ...formData, 
                          securityProfiles: { ...formData.securityProfiles, dns: e.target.value }
                        })}
                      >
                        {store.dnsFilters.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                      </select>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => {
                    const current = formData.securityProfiles?.dns;
                    setFormData({
                      ...formData, 
                      securityProfiles: { ...formData.securityProfiles, dns: current ? undefined : store.dnsFilters[0]?.name }
                    });
                  }}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${formData.securityProfiles?.dns ? 'bg-emerald-500' : 'bg-white/10'}`}
                >
                  <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${formData.securityProfiles?.dns ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* SSL Inspection */}
              <div className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${formData.securityProfiles?.sslInspection ? 'bg-violet-500/10 border-violet-500/30' : 'bg-white/5 border-white/5'}`}>
                <div className="flex items-center gap-3">
                  <Lock className={`w-5 h-5 ${formData.securityProfiles?.sslInspection ? 'text-violet-400' : 'text-gray-500'}`} />
                  <div>
                    <p className={`text-sm font-bold ${formData.securityProfiles?.sslInspection ? 'text-violet-400' : 'text-gray-400'}`}>Inspeção SSL/TLS</p>
                    {formData.securityProfiles?.sslInspection && (
                      <select 
                        className="mt-1 bg-[#0a0a0f] border border-white/10 rounded text-xs text-gray-300 py-1 px-2 outline-none focus:border-violet-500/50"
                        value={formData.securityProfiles?.sslInspection || ''}
                        onChange={e => setFormData({
                          ...formData, 
                          securityProfiles: { ...formData.securityProfiles, sslInspection: e.target.value }
                        })}
                      >
                        {store.sslProfiles.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                      </select>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => {
                    const current = formData.securityProfiles?.sslInspection;
                    setFormData({
                      ...formData, 
                      securityProfiles: { ...formData.securityProfiles, sslInspection: current ? undefined : store.sslProfiles[0]?.name }
                    });
                  }}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${formData.securityProfiles?.sslInspection ? 'bg-violet-500' : 'bg-white/10'}`}
                >
                  <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${formData.securityProfiles?.sslInspection ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-violet-600/20"
          >
            Salvar Política
          </button>
        </div>
      </motion.div>
    </div>
  );
};
