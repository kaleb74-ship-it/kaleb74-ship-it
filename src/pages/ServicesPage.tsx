import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, FileText, X, Server } from 'lucide-react';
import { useStore, NetworkService } from '../store';

export const ServicesPage: React.FC = () => {
  const { services, setServices } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<NetworkService | null>(null);
  const [formData, setFormData] = useState<NetworkService>({ id: '', name: '', protocol: 'TCP', port: '' });

  const handleOpenModal = (svc?: NetworkService) => {
    if (svc) {
      setEditingService(svc);
      setFormData(svc);
    } else {
      setEditingService(null);
      setFormData({ id: Math.random().toString(36).substr(2, 9), name: '', protocol: 'TCP', port: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingService) {
      setServices(services.map(s => s.id === formData.id ? formData : s));
    } else {
      setServices([...services, formData]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Server className="w-6 h-6 text-violet-400" />
            Serviços de Rede
          </h2>
          <p className="text-gray-400 text-sm mt-1">Gerencie portas e protocolos para uso em políticas.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-violet-600/20"
        >
          <Plus className="w-4 h-4" />
          Novo Serviço
        </button>
      </div>

      <div className="bg-[#12121a] border border-white/5 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_100px_2fr_100px] gap-4 px-6 py-4 border-b border-white/5 bg-white/2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          <div>Nome</div>
          <div>Protocolo</div>
          <div>Porta(s)</div>
          <div className="text-right">Ações</div>
        </div>

        <div className="divide-y divide-white/5">
          {services.map((svc) => (
            <div key={svc.id} className="grid grid-cols-[1fr_100px_2fr_100px] gap-4 px-6 py-4 items-center hover:bg-white/2 transition-colors group">
              <div className="text-sm font-semibold text-white">{svc.name}</div>
              <div className="text-sm text-gray-400">{svc.protocol}</div>
              <div className="text-sm text-gray-400 font-mono">{svc.port}</div>
              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleOpenModal(svc)}
                  className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors" 
                  title="Editar"
                >
                  <FileText className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(svc.id)}
                  className="p-2 hover:bg-red-400/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors" 
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {services.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">Nenhum serviço encontrado.</div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <h2 className="text-lg font-bold text-white">
                  {editingService ? 'Editar Serviço' : 'Novo Serviço'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
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
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Protocolo</label>
                  <select 
                    value={formData.protocol}
                    onChange={e => setFormData({...formData, protocol: e.target.value as any})}
                    className="w-full px-4 py-2 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50"
                  >
                    <option value="TCP">TCP</option>
                    <option value="UDP">UDP</option>
                    <option value="ICMP">ICMP</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Porta(s)</label>
                  <input 
                    type="text" 
                    value={formData.port}
                    onChange={e => setFormData({...formData, port: e.target.value})}
                    placeholder="Ex: 80, 443, 8000-8080"
                    className="w-full px-4 py-2 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50 font-mono"
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  className="px-6 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-violet-600/20"
                >
                  Salvar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
