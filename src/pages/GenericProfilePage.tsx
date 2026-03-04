import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, FileText, X, Shield, Globe } from 'lucide-react';
import { SecurityProfile } from '../store';

interface Props {
  title: string;
  description: string;
  profiles: SecurityProfile[];
  setProfiles: React.Dispatch<React.SetStateAction<SecurityProfile[]>>;
  icon: React.FC<any>;
}

const COUNTRIES = [
  { name: 'Afeganistão', code: 'AF' },
  { name: 'Albânia', code: 'AL' },
  { name: 'Alemanha', code: 'DE' },
  { name: 'Andorra', code: 'AD' },
  { name: 'Angola', code: 'AO' },
  { name: 'Argentina', code: 'AR' },
  { name: 'Austrália', code: 'AU' },
  { name: 'Áustria', code: 'AT' },
  { name: 'Bahamas', code: 'BS' },
  { name: 'Bahrein', code: 'BH' },
  { name: 'Bangladesh', code: 'BD' },
  { name: 'Bélgica', code: 'BE' },
  { name: 'Bolívia', code: 'BO' },
  { name: 'Brasil', code: 'BR' },
  { name: 'Bulgária', code: 'BG' },
  { name: 'Camboja', code: 'KH' },
  { name: 'Camarões', code: 'CM' },
  { name: 'Canadá', code: 'CA' },
  { name: 'Catar', code: 'QA' },
  { name: 'Chile', code: 'CL' },
  { name: 'China', code: 'CN' },
  { name: 'Colômbia', code: 'CO' },
  { name: 'Coreia do Norte', code: 'KP' },
  { name: 'Coreia do Sul', code: 'KR' },
  { name: 'Costa Rica', code: 'CR' },
  { name: 'Croácia', code: 'HR' },
  { name: 'Cuba', code: 'CU' },
  { name: 'Dinamarca', code: 'DK' },
  { name: 'Egito', code: 'EG' },
  { name: 'Emirados Árabes Unidos', code: 'AE' },
  { name: 'Equador', code: 'EC' },
  { name: 'Eslováquia', code: 'SK' },
  { name: 'Eslovênia', code: 'SI' },
  { name: 'Espanha', code: 'ES' },
  { name: 'Estados Unidos', code: 'US' },
  { name: 'Estônia', code: 'EE' },
  { name: 'Etiópia', code: 'ET' },
  { name: 'Filipinas', code: 'PH' },
  { name: 'Finlândia', code: 'FI' },
  { name: 'França', code: 'FR' },
  { name: 'Grécia', code: 'GR' },
  { name: 'Guatemala', code: 'GT' },
  { name: 'Haiti', code: 'HT' },
  { name: 'Honduras', code: 'HN' },
  { name: 'Hong Kong', code: 'HK' },
  { name: 'Hungria', code: 'HU' },
  { name: 'Índia', code: 'IN' },
  { name: 'Indonésia', code: 'ID' },
  { name: 'Irã', code: 'IR' },
  { name: 'Iraque', code: 'IQ' },
  { name: 'Irlanda', code: 'IE' },
  { name: 'Islândia', code: 'IS' },
  { name: 'Israel', code: 'IL' },
  { name: 'Itália', code: 'IT' },
  { name: 'Jamaica', code: 'JM' },
  { name: 'Japão', code: 'JP' },
  { name: 'Jordânia', code: 'JO' },
  { name: 'Kuwait', code: 'KW' },
  { name: 'Líbano', code: 'LB' },
  { name: 'Líbia', code: 'LY' },
  { name: 'Luxemburgo', code: 'LU' },
  { name: 'Malásia', code: 'MY' },
  { name: 'Malta', code: 'MT' },
  { name: 'Marrocos', code: 'MA' },
  { name: 'México', code: 'MX' },
  { name: 'Mônaco', code: 'MC' },
  { name: 'Mongólia', code: 'MN' },
  { name: 'Nepal', code: 'NP' },
  { name: 'Nicarágua', code: 'NI' },
  { name: 'Nigéria', code: 'NG' },
  { name: 'Noruega', code: 'NO' },
  { name: 'Nova Zelândia', code: 'NZ' },
  { name: 'Omã', code: 'OM' },
  { name: 'Países Baixos', code: 'NL' },
  { name: 'Panamá', code: 'PA' },
  { name: 'Paquistão', code: 'PK' },
  { name: 'Paraguai', code: 'PY' },
  { name: 'Peru', code: 'PE' },
  { name: 'Polônia', code: 'PL' },
  { name: 'Portugal', code: 'PT' },
  { name: 'Quênia', code: 'KE' },
  { name: 'Reino Unido', code: 'GB' },
  { name: 'República Checa', code: 'CZ' },
  { name: 'República Dominicana', code: 'DO' },
  { name: 'Romênia', code: 'RO' },
  { name: 'Rússia', code: 'RU' },
  { name: 'Senegal', code: 'SN' },
  { name: 'Sérvia', code: 'RS' },
  { name: 'Singapura', code: 'SG' },
  { name: 'Síria', code: 'SY' },
  { name: 'Somália', code: 'SO' },
  { name: 'Sri Lanka', code: 'LK' },
  { name: 'Suécia', code: 'SE' },
  { name: 'Suíça', code: 'CH' },
  { name: 'Tailândia', code: 'TH' },
  { name: 'Taiwan', code: 'TW' },
  { name: 'Tanzânia', code: 'TZ' },
  { name: 'Tunísia', code: 'TN' },
  { name: 'Turquia', code: 'TR' },
  { name: 'Ucrânia', code: 'UA' },
  { name: 'Uruguai', code: 'UY' },
  { name: 'Uzbequistão', code: 'UZ' },
  { name: 'Venezuela', code: 'VE' },
  { name: 'Vietnã', code: 'VN' },
];

export const GenericProfilePage: React.FC<Props> = ({ title, description, profiles, setProfiles, icon: Icon }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<SecurityProfile | null>(null);
  const [formData, setFormData] = useState<SecurityProfile>({ 
    id: '', 
    name: '', 
    description: '',
    categories: [
      { name: 'Web Filtering', enabled: true, action: 'Block' },
      { name: 'Antivirus', enabled: true, action: 'Block' },
      { name: 'IPS/IDS', enabled: true, action: 'Block' },
      { name: 'App Control', enabled: true, action: 'Monitor' },
      { name: 'SSL Inspection', enabled: false, action: 'Monitor' },
    ]
  });

  const handleOpenModal = (profile?: SecurityProfile) => {
    if (profile) {
      setEditingProfile(profile);
      setFormData({
        ...profile,
        categories: profile.categories || [
          { name: 'Web Filtering', enabled: true, action: 'Block' },
          { name: 'Antivirus', enabled: true, action: 'Block' },
          { name: 'IPS/IDS', enabled: true, action: 'Block' },
          { name: 'App Control', enabled: true, action: 'Monitor' },
          { name: 'SSL Inspection', enabled: false, action: 'Monitor' },
        ],
        signatures: profile.signatures || [],
        geoRules: profile.geoRules || [],
        severityActions: profile.severityActions || {
          low: 'Monitor',
          medium: 'Monitor',
          high: 'Block',
          critical: 'Block'
        }
      });
    } else {
      setEditingProfile(null);
      setFormData({ 
        id: Math.random().toString(36).substr(2, 9), 
        name: '', 
        description: '',
        categories: [
          { name: 'Web Filtering', enabled: true, action: 'Block' },
          { name: 'Antivirus', enabled: true, action: 'Block' },
          { name: 'IPS/IDS', enabled: true, action: 'Block' },
          { name: 'App Control', enabled: true, action: 'Monitor' },
          { name: 'SSL Inspection', enabled: false, action: 'Monitor' },
        ],
        signatures: [],
        geoRules: [],
        severityActions: {
          low: 'Monitor',
          medium: 'Monitor',
          high: 'Block',
          critical: 'Block'
        }
      });
    }
    setIsModalOpen(true);
  };

  const handleToggleCategory = (index: number) => {
    const newCategories = [...(formData.categories || [])];
    newCategories[index].enabled = !newCategories[index].enabled;
    setFormData({ ...formData, categories: newCategories });
  };

  const handleActionChange = (index: number, action: any) => {
    const newCategories = [...(formData.categories || [])];
    newCategories[index].action = action;
    setFormData({ ...formData, categories: newCategories });
  };

  const handleSave = async () => {
    if (editingProfile) {
      setProfiles(profiles.map(p => p.id === formData.id ? formData : p));
    } else {
      setProfiles([...profiles, formData]);
    }
    setIsModalOpen(false);

    // Generate log for profile update/creation
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: 'admin',
          workstation: 'CONTROL-PLANE',
          application: `${title}-CONFIG`,
          action: 'Inspect',
          threatLevel: 'Low',
          destIp: '0.0.0.0',
          mac: '00:00:00:00:00:00',
          sourceIp: '127.0.0.1'
        })
      });
    } catch (err) {
      console.error('Failed to log profile change');
    }
  };

  const handleSeverityActionChange = (severity: 'low' | 'medium' | 'high' | 'critical', action: any) => {
    setFormData({
      ...formData,
      severityActions: {
        ...(formData.severityActions || { low: 'Monitor', medium: 'Monitor', high: 'Block', critical: 'Block' }),
        [severity]: action
      }
    });
  };

  const handleSignatureActionChange = (sigIdx: number, action: any) => {
    const newSigs = [...(formData.signatures || [])];
    newSigs[sigIdx].action = action;
    setFormData({ ...formData, signatures: newSigs });
  };

  const handleGeoRuleActionChange = (ruleIdx: number, action: any) => {
    const newRules = [...(formData.geoRules || [])];
    newRules[ruleIdx].action = action;
    setFormData({ ...formData, geoRules: newRules });
  };

  const handleAddGeoRule = () => {
    const newRule = {
      id: Math.random().toString(36).substr(2, 9),
      country: COUNTRIES[0].name,
      countryCode: COUNTRIES[0].code,
      action: 'Block' as const
    };
    setFormData({ ...formData, geoRules: [...(formData.geoRules || []), newRule] });
  };

  const handleRemoveGeoRule = (id: string) => {
    setFormData({ ...formData, geoRules: (formData.geoRules || []).filter(r => r.id !== id) });
  };

  const handleGeoCountryChange = (ruleIdx: number, countryName: string) => {
    const country = COUNTRIES.find(c => c.name === countryName);
    if (country) {
      const newRules = [...(formData.geoRules || [])];
      newRules[ruleIdx].country = country.name;
      newRules[ruleIdx].countryCode = country.code;
      setFormData({ ...formData, geoRules: newRules });
    }
  };

  const downloadMaliciousIps = async () => {
    try {
      // Mocking a download of malicious IP rules for countries
      const maliciousRules = [
        { id: 'm1', country: 'Rússia', countryCode: 'RU', action: 'Block' as const },
        { id: 'm2', country: 'China', countryCode: 'CN', action: 'Block' as const },
        { id: 'm3', country: 'Coreia do Norte', countryCode: 'KP', action: 'Block' as const },
        { id: 'm4', country: 'Irã', countryCode: 'IR', action: 'Block' as const },
        { id: 'm5', country: 'Vietnã', countryCode: 'VN', action: 'Block' as const },
        { id: 'm6', country: 'Nigéria', countryCode: 'NG', action: 'Block' as const },
      ];
      setFormData({ ...formData, geoRules: [...(formData.geoRules || []), ...maliciousRules] });
    } catch (error) {
      console.error('Failed to download malicious IP data');
    }
  };

  const downloadSignatures = async () => {
    try {
      const response = await fetch('/api/ids-ips/signatures');
      if (response.ok) {
        const data = await response.json();
        setFormData({ ...formData, signatures: data });
      }
    } catch (error) {
      console.error('Failed to download signatures:', error);
    }
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
                    className="w-full px-4 py-2 bg-[#0a0a0f] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500/50 resize-none h-20"
                  />
                </div>

                {title.includes('GeoIP') && (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Regras por País</label>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={downloadMaliciousIps}
                          className="text-[10px] font-bold text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
                        >
                          <Shield className="w-3 h-3" />
                          Baixar IPs Maliciosos
                        </button>
                        <button 
                          onClick={handleAddGeoRule}
                          className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Adicionar País
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                      {formData.geoRules?.map((rule, idx) => (
                        <div key={rule.id} className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                          <div className="flex-1 grid grid-cols-2 gap-3">
                            <select 
                              value={rule.country}
                              onChange={(e) => handleGeoCountryChange(idx, e.target.value)}
                              className="bg-[#0a0a0f] border border-white/10 rounded-lg text-xs text-white px-2 py-1 focus:outline-none focus:border-violet-500/50"
                            >
                              {COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                            </select>
                            <select 
                              value={rule.action}
                              onChange={(e) => handleGeoRuleActionChange(idx, e.target.value)}
                              className="bg-[#0a0a0f] border border-white/10 rounded-lg text-xs text-white px-2 py-1 focus:outline-none focus:border-violet-500/50"
                            >
                              <option value="Allow">Allow</option>
                              <option value="Block">Block</option>
                              <option value="Monitor">Monitor</option>
                            </select>
                          </div>
                          <button 
                            onClick={() => handleRemoveGeoRule(rule.id)}
                            className="p-1.5 hover:bg-red-400/10 rounded-lg text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {(!formData.geoRules || formData.geoRules.length === 0) && (
                        <div className="text-center py-6 border border-dashed border-white/10 rounded-xl">
                          <p className="text-xs text-gray-500">Nenhuma regra de país definida.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {title === 'IDS/IPS' && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ações por Severidade</label>
                      <div className="grid grid-cols-2 gap-3">
                        {(['low', 'medium', 'high', 'critical'] as const).map((sev) => (
                          <div key={sev} className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{sev}</span>
                            <select 
                              value={formData.severityActions?.[sev] || 'Monitor'}
                              onChange={(e) => handleSeverityActionChange(sev, e.target.value)}
                              className="bg-transparent text-[10px] font-bold text-violet-400 uppercase tracking-wider focus:outline-none"
                            >
                              <option value="Allow">Allow</option>
                              <option value="Block">Block</option>
                              <option value="Monitor">Monitor</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assinaturas Maliciosas</label>
                        <button 
                          onClick={downloadSignatures}
                          className="text-[10px] font-bold text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Baixar Assinaturas
                        </button>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                        {formData.signatures?.map((sig, idx) => (
                          <div key={sig.id} className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs font-bold text-white">{sig.name}</p>
                                <p className="text-[10px] text-gray-500 font-mono">{sig.cve}</p>
                              </div>
                              <select 
                                value={sig.action}
                                onChange={(e) => handleSignatureActionChange(idx, e.target.value)}
                                className="bg-transparent text-[10px] font-bold text-violet-400 uppercase tracking-wider focus:outline-none"
                              >
                                <option value="Allow">Allow</option>
                                <option value="Block">Block</option>
                                <option value="Monitor">Monitor</option>
                              </select>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                                sig.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                                sig.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                                sig.severity === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                                'bg-emerald-500/20 text-emerald-400'
                              }`}>
                                {sig.severity}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {title !== 'IDS/IPS' && !title.includes('GeoIP') && (
                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categorias de Segurança</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                      {formData.categories?.map((cat, idx) => (
                        <div key={cat.name} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleToggleCategory(idx)}
                              className={`w-8 h-4 rounded-full transition-colors relative ${cat.enabled ? 'bg-violet-600' : 'bg-gray-600'}`}
                            >
                              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${cat.enabled ? 'left-4.5' : 'left-0.5'}`} />
                            </button>
                            <span className={`text-xs font-bold ${cat.enabled ? 'text-white' : 'text-gray-500'}`}>{cat.name}</span>
                          </div>
                          {cat.enabled && (
                            <select 
                              value={cat.action}
                              onChange={(e) => handleActionChange(idx, e.target.value)}
                              className="bg-transparent text-[10px] font-bold text-violet-400 uppercase tracking-wider focus:outline-none"
                            >
                              <option value="Allow">Allow</option>
                              <option value="Block">Block</option>
                              <option value="Monitor">Monitor</option>
                            </select>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
