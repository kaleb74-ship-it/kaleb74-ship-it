import React, { createContext, useContext, useState } from 'react';

export interface NetworkObject { id: string; name: string; type: 'IP' | 'FQDN'; value: string; }
export interface NetworkService { id: string; name: string; protocol: 'TCP' | 'UDP' | 'ICMP'; port: string; }
export interface SecurityProfile { id: string; name: string; description: string; isDefault?: boolean; }

interface StoreContextType {
  objects: NetworkObject[];
  setObjects: React.Dispatch<React.SetStateAction<NetworkObject[]>>;
  services: NetworkService[];
  setServices: React.Dispatch<React.SetStateAction<NetworkService[]>>;
  appControls: SecurityProfile[];
  setAppControls: React.Dispatch<React.SetStateAction<SecurityProfile[]>>;
  webFilters: SecurityProfile[];
  setWebFilters: React.Dispatch<React.SetStateAction<SecurityProfile[]>>;
  dnsFilters: SecurityProfile[];
  setDnsFilters: React.Dispatch<React.SetStateAction<SecurityProfile[]>>;
  geoIps: SecurityProfile[];
  setGeoIps: React.Dispatch<React.SetStateAction<SecurityProfile[]>>;
  idsIps: SecurityProfile[];
  setIdsIps: React.Dispatch<React.SetStateAction<SecurityProfile[]>>;
  sslProfiles: SecurityProfile[];
  setSslProfiles: React.Dispatch<React.SetStateAction<SecurityProfile[]>>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [objects, setObjects] = useState<NetworkObject[]>([]);
  const [services, setServices] = useState<NetworkService[]>([]);
  const [appControls, setAppControls] = useState<SecurityProfile[]>([{ id: 'default', name: 'Default App Control', description: 'Block high risk apps', isDefault: true }]);
  const [webFilters, setWebFilters] = useState<SecurityProfile[]>([{ id: 'default', name: 'Default Web Filter', description: 'Block malicious sites', isDefault: true }]);
  const [dnsFilters, setDnsFilters] = useState<SecurityProfile[]>([{ id: 'default', name: 'Default DNS Filter', description: 'Block malware domains', isDefault: true }]);
  const [geoIps, setGeoIps] = useState<SecurityProfile[]>([{ id: 'default', name: 'Default GeoIP', description: 'Block sanctioned countries', isDefault: true }]);
  const [idsIps, setIdsIps] = useState<SecurityProfile[]>([{ id: 'default', name: 'Default IDS/IPS', description: 'Balanced protection', isDefault: true }]);
  const [sslProfiles, setSslProfiles] = useState<SecurityProfile[]>([{ id: 'default', name: 'Default SSL Inspection', description: 'Deep inspection', isDefault: true }]);

  return (
    <StoreContext.Provider value={{
      objects, setObjects,
      services, setServices,
      appControls, setAppControls,
      webFilters, setWebFilters,
      dnsFilters, setDnsFilters,
      geoIps, setGeoIps,
      idsIps, setIdsIps,
      sslProfiles, setSslProfiles
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
