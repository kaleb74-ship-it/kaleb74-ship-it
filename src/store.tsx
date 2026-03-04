import React, { createContext, useContext, useState } from 'react';

export interface NetworkObject { id: string; name: string; type: 'IP' | 'FQDN'; value: string; }
export interface NetworkService { id: string; name: string; protocol: 'TCP' | 'UDP' | 'ICMP'; port: string; }
export interface SecurityProfile {
  id: string;
  name: string;
  description: string;
  isDefault?: boolean;
  categories?: {
    enabled: boolean;
    name: string;
    action: 'Allow' | 'Block' | 'Monitor';
  }[];
  signatures?: {
    id: string;
    name: string;
    cve: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    action: 'Allow' | 'Block' | 'Monitor';
  }[];
  geoRules?: {
    id: string;
    country: string;
    countryCode: string;
    action: 'Allow' | 'Block' | 'Monitor';
  }[];
  severityActions?: {
    low: 'Allow' | 'Block' | 'Monitor';
    medium: 'Allow' | 'Block' | 'Monitor';
    high: 'Allow' | 'Block' | 'Monitor';
    critical: 'Allow' | 'Block' | 'Monitor';
  };
}

export interface AgentUser {
  username: string;
  domain?: string;
  isAD: boolean;
  lastLogin: string;
}

export interface Agent {
  id: string;
  hostname: string;
  mac: string;
  ip: string;
  os: string;
  version: string;
  status: 'Online' | 'Offline';
  lastSeen: string;
  registeredAt: string;
  currentUser?: AgentUser;
}

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
  const [appControls, setAppControls] = useState<SecurityProfile[]>([{ 
    id: 'default', 
    name: 'Default App Control', 
    description: 'Controle de aplicações por tipo e risco', 
    isDefault: true,
    categories: [
      { name: 'E-mail (Outlook, Gmail)', enabled: true, action: 'Monitor' },
      { name: 'Mensageria (Slack, Teams, WhatsApp)', enabled: true, action: 'Monitor' },
      { name: 'Vídeo (YouTube, Netflix)', enabled: true, action: 'Monitor' },
      { name: 'Música (Spotify, SoundCloud)', enabled: true, action: 'Monitor' },
      { name: 'Redes Sociais (FB, IG, TikTok)', enabled: true, action: 'Block' },
      { name: 'CRM, ERP, VPN', enabled: true, action: 'Allow' },
      { name: 'Torrents / P2P', enabled: true, action: 'Block' },
      { name: 'Hacking Tools / Exploit Kits', enabled: true, action: 'Block' },
      { name: 'Jogos Online', enabled: true, action: 'Block' },
    ]
  }]);
  const [webFilters, setWebFilters] = useState<SecurityProfile[]>([{ 
    id: 'default', 
    name: 'Default Web Filter', 
    description: 'Filtragem de URLs e conteúdo', 
    isDefault: true,
    categories: [
      { name: 'Malware / Phishing', enabled: true, action: 'Block' },
      { name: 'Botnets / Command & Control', enabled: true, action: 'Block' },
      { name: 'Exploits / Vulnerabilidades', enabled: true, action: 'Block' },
      { name: 'Adulto', enabled: true, action: 'Block' },
      { name: 'Jogos / Gambling', enabled: true, action: 'Block' },
      { name: 'Redes Sociais', enabled: true, action: 'Monitor' },
      { name: 'Streaming / Vídeo', enabled: true, action: 'Monitor' },
      { name: 'Compras / E-commerce', enabled: true, action: 'Monitor' },
      { name: 'Ferramentas Corporativas', enabled: true, action: 'Allow' },
      { name: 'Notícias', enabled: true, action: 'Allow' },
      { name: 'Educação / Pesquisa', enabled: true, action: 'Allow' },
      { name: 'Proxy Anônimo / VPNs', enabled: true, action: 'Block' },
      { name: 'Downloads / Torrents', enabled: true, action: 'Block' },
    ]
  }]);
  const [dnsFilters, setDnsFilters] = useState<SecurityProfile[]>([{ 
    id: 'default', 
    name: 'Default DNS Filter', 
    description: 'Filtragem por resolução de nomes', 
    isDefault: true,
    categories: [
      { name: 'Malware / C2 Domains', enabled: true, action: 'Block' },
      { name: 'Phishing / Scam', enabled: true, action: 'Block' },
      { name: 'Malicious IPs / Botnets', enabled: true, action: 'Block' },
      { name: 'Adulto / Conteúdo Impróprio', enabled: true, action: 'Block' },
      { name: 'Anonimização / VPN', enabled: true, action: 'Block' },
      { name: 'Publicidade / Tracking', enabled: true, action: 'Monitor' },
      { name: 'Segurança Corporativa', enabled: true, action: 'Allow' },
    ]
  }]);
  const [geoIps, setGeoIps] = useState<SecurityProfile[]>([{ 
    id: 'default', 
    name: 'Default GeoIP', 
    description: 'Bloqueio de países sancionados ou com alto índice de IPs maliciosos', 
    isDefault: true,
    geoRules: [
      { id: '1', country: 'Rússia', countryCode: 'RU', action: 'Block' },
      { id: '2', country: 'China', countryCode: 'CN', action: 'Monitor' },
      { id: '3', country: 'Coreia do Norte', countryCode: 'KP', action: 'Block' },
      { id: '4', country: 'Irã', countryCode: 'IR', action: 'Block' },
      { id: '5', country: 'Ucrânia', countryCode: 'UA', action: 'Monitor' },
    ]
  }]);
  const [idsIps, setIdsIps] = useState<SecurityProfile[]>([{ 
    id: 'default', 
    name: 'Default IDS/IPS', 
    description: 'Proteção balanceada contra intrusões', 
    isDefault: true,
    signatures: [
      { id: '1', name: 'Log4j RCE Attempt', cve: 'CVE-2021-44228', severity: 'Critical', action: 'Block' },
      { id: '2', name: 'Spring4Shell Exploit', cve: 'CVE-2022-22965', severity: 'Critical', action: 'Block' },
      { id: '3', name: 'Follina MSDT Bug', cve: 'CVE-2022-30190', severity: 'High', action: 'Block' },
      { id: '4', name: 'ProxyLogon Exchange', cve: 'CVE-2021-26855', severity: 'Critical', action: 'Block' },
      { id: '5', name: 'Apache Struts RCE', cve: 'CVE-2017-5638', severity: 'High', action: 'Block' },
    ],
    severityActions: {
      low: 'Monitor',
      medium: 'Monitor',
      high: 'Block',
      critical: 'Block'
    }
  }]);
  const [sslProfiles, setSslProfiles] = useState<SecurityProfile[]>([{ 
    id: 'default', 
    name: 'Default SSL Inspection', 
    description: 'Inspeção profunda de pacotes criptografados', 
    isDefault: true,
    categories: [
      { name: 'Inspeção HTTPS', enabled: true, action: 'Monitor' },
      { name: 'Inspeção SMTPS', enabled: true, action: 'Monitor' },
      { name: 'Inspeção IMAPS', enabled: true, action: 'Monitor' },
      { name: 'Inspeção POP3S', enabled: true, action: 'Monitor' },
      { name: 'Excluir Bancos / Finanças', enabled: true, action: 'Allow' },
      { name: 'Excluir Saúde / Medicina', enabled: true, action: 'Allow' },
      { name: 'Verificação de Certificados', enabled: true, action: 'Block' },
    ]
  }]);

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
