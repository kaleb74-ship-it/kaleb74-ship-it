import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Laptop, Monitor, ShieldCheck, Search, Filter } from 'lucide-react';

export const DevicesPage: React.FC = () => {
  const [devices, setDevices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDevices = async () => {
    try {
      const response = await fetch('/api/agents');
      if (response.ok) {
        const data = await response.json();
        setDevices(data);
      }
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    }
  };

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredDevices = devices.filter(d => 
    d.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.os.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.ip.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Laptop className="w-6 h-6 text-violet-400" />
            Dispositivos
          </h2>
          <p className="text-gray-400 text-sm mt-1">Inventário de máquinas e sistemas operacionais monitorados pelo agente.</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Buscar dispositivo..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevices.map((device) => (
          <motion.div 
            key={device.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#12121a] border border-white/5 rounded-2xl p-6 hover:border-violet-500/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-violet-600/10 rounded-xl group-hover:bg-violet-600/20 transition-colors">
                <Monitor className="w-6 h-6 text-violet-400" />
              </div>
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                device.status === 'Online' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
              }`}>
                {device.status}
              </span>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white truncate">{device.hostname}</h3>
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <Laptop className="w-3 h-3" />
                {device.os}
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">IP Address</p>
                <p className="text-xs text-gray-300 font-mono">{device.ip}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">MAC Address</p>
                <p className="text-xs text-gray-300 font-mono">{device.mac}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-500">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>Agent {device.version} • Protegido</span>
            </div>
          </motion.div>
        ))}
        {filteredDevices.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white/2 border border-dashed border-white/10 rounded-2xl">
            <p className="text-gray-500">Nenhum dispositivo encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};
