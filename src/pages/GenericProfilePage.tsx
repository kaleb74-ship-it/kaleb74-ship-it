import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, FileText, X, Shield } from 'lucide-react';
import { SecurityProfile } from '../store';

interface Props {
  title: string;
  description: string;
  profiles: SecurityProfile[];
  setProfiles: React.Dispatch<React.SetStateAction<SecurityProfile[]>>;
  icon: React.FC<any>;
}

export const GenericProfilePage: React.FC<Props> = ({ title, description, profiles, setProfiles, icon: Icon }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<SecurityProfile | null>(null);
  const [formData, setFormData] = useState<SecurityProfile>({ id: '', name: '', description: '' });

  const handleOpenModal = (profile?: SecurityProfile) => {
    if (profile) {
      setEditingProfile(profile);
      setFormData(profile);
    } else {
      setEditingProfile(null);
      setFormData({ id: Math.random().toString(36).substr(2, 9), name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingProfile) {
      setProfiles(profiles.map(p => p.id === formData.id ? formData : p));
    } else {
      setProfiles([...profiles, formData]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setProfiles(profiles.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Icon className="w-6 h-6 text-violet-400" />
            {title}
          </h2>
          <p className="text-gray-400 text-sm mt-1">{description}</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-violet-600/20"
        >
          <Plus className="w-4 h-4" />
          Novo Perfil
        </button>
      </div>

      <div className="bg-[#12121a] border border-white/5 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_2fr_100px] gap-4 px-6 py-4 border-b border-white/5 bg-white/2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          <div>Nome</div>
          <div>Descrição</div>
          <div className="text-right">Ações</div>
        </div>

        <div className="divide-y divide-white/5">
          {profiles.map((profile) => (
            <div key={profile.id} className="grid grid-cols-[1fr_2fr_100px] gap-4 px-6 py-4 items-center hover:bg-white/2 transition-colors group">
              <div className="text-sm font-semibold text-white flex items-center gap-2">
                {profile.name}
                {profile.isDefault && (
                  <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-gray-400 uppercase tracking-wider">Default</span>
                )}
              </div>
              <div className="text-sm text-gray-400">{profile.description}</div>
              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleOpenModal(profile)}
                  className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors" 
                  title="Editar"
                >
                  <FileText className="w-4 h-4" />
                </button>
                {!profile.isDefault && (
                  <button 
                    onClick={() => handleDelete(profile.id)}
                    className="p-2 hover:bg-red-400/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors" 
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {profiles.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">Nenhum perfil encontrado.</div>
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
                  {editingProfile ? 'Editar Perfil' : 'Novo Perfil'}
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
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Descrição</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50 resize-none h-24"
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
