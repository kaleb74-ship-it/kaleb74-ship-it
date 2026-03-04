export interface User {
  id: string;
  username: string;
  email: string;
  group: string;
  status: 'online' | 'offline';
  lastSeen: string;
}

export interface Device {
  id: string;
  name: string;
  os: string;
  ip: string;
  agentVersion: string;
  status: 'online' | 'offline';
  lastSync: string;
}

export interface SecurityProfile {
  id: string;
  name: string;
  type: 'Standard' | 'Restrictive' | 'Corporate' | 'Custom';
  description: string;
  dnsFiltering: boolean;
  webFiltering: boolean;
  appControl: boolean;
  sslInspection: boolean;
}

export interface FirewallPolicy {
  id: string;
  priority: number;
  name: string;
  source: string | string[];
  destination: string | string[];
  service: string | string[];
  action: 'Allow' | 'Deny' | 'Inspect';
  schedule: string;
  log: boolean;
  enabled: boolean;
  securityProfiles?: {
    webFilter?: string;
    appControl?: string;
    dns?: string;
    sslInspection?: string;
  };
}

export interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  workstation: string;
  sourceIp: string;
  mac: string;
  destIp: string;
  application: string;
  action: 'Allow' | 'Deny' | 'Inspect';
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}
