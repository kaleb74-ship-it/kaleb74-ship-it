import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { LogEntry } from "./src/types";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
const model = "gemini-3-flash-preview";

// In-memory database for our prototype
const agents: any[] = [];
const logs: LogEntry[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- API ROUTES ---

  // 1. Register an Agent
  app.post("/api/agents/register", (req, res) => {
    console.log("POST /api/agents/register", req.body);
    const { hostname, mac, ip, os, currentUser } = req.body;
    
    // Check if agent already exists
    const existing = agents.find(a => a.mac === mac);
    if (existing) {
      existing.lastSeen = new Date().toISOString();
      existing.status = 'Online';
      if (currentUser) existing.currentUser = currentUser;
      console.log("Agent updated:", mac);
      return res.json({ message: "Agent updated", agent: existing });
    }

    const newAgent = {
      id: Math.random().toString(36).substr(2, 9),
      hostname: hostname || "Unknown",
      mac: mac || "00:00:00:00:00:00",
      ip: ip || req.ip,
      os: os || "Windows",
      version: "v2.4.1",
      status: "Online",
      lastSeen: new Date().toISOString(),
      registeredAt: new Date().toISOString(),
      currentUser: currentUser || {
        username: "local_user",
        isAD: false,
        lastLogin: new Date().toISOString()
      }
    };
    
    agents.push(newAgent);
    console.log("New agent registered:", newAgent.id);
    res.status(201).json({ message: "Agent registered", agent: newAgent });
  });

  // 1.1 Get Users from Agents
  app.get("/api/users", (req, res) => {
    const users = agents.map(a => ({
      agentId: a.id,
      hostname: a.hostname,
      ...a.currentUser
    })).filter(u => u.username);
    res.json(users);
  });

  // 2. Receive Logs from Agent
  app.post("/api/logs", (req, res) => {
    console.log("POST /api/logs", req.body);
    const { user, workstation, sourceIp, mac, destIp, application, action, threatLevel } = req.body;
    
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      user: user || "system",
      workstation: workstation || "Unknown",
      sourceIp: sourceIp || req.ip,
      mac: mac || "00:00:00:00:00:00",
      destIp: destIp || "0.0.0.0",
      application: application || "Unknown",
      action: action || "Inspect",
      threatLevel: threatLevel || "Low"
    };

    // Keep only the last 500 logs in memory
    logs.unshift(newLog);
    if (logs.length > 500) logs.pop();

    // Update agent lastSeen if MAC matches
    const agent = agents.find(a => a.mac === mac);
    if (agent) {
      agent.lastSeen = new Date().toISOString();
      agent.status = 'Online';
    }

    console.log("Log received from:", mac);
    res.status(201).json({ message: "Log received", logId: newLog.id });
  });

  // 3. Get Agents (for the Dashboard)
  app.get("/api/agents", (req, res) => {
    // Mark agents as offline if not seen in 30 seconds
    const now = new Date().getTime();
    agents.forEach(a => {
      const lastSeen = new Date(a.lastSeen).getTime();
      if (now - lastSeen > 30000) {
        a.status = 'Offline';
      }
    });
    res.json(agents);
  });

  // 4. Get Logs (for the Dashboard)
  app.get("/api/logs", (req, res) => {
    res.json(logs);
  });

  // 5. Get Dashboard Stats
  app.get("/api/stats", (req, res) => {
    const onlineAgents = agents.filter(a => a.status === 'Online').length;
    const totalThreats = logs.filter(l => l.threatLevel === 'High' || l.threatLevel === 'Critical').length;
    const activeUsers = new Set(logs.map(l => l.user)).size;
    
    // Calculate top apps
    const appCounts: Record<string, number> = {};
    logs.forEach(l => {
      appCounts[l.application] = (appCounts[l.application] || 0) + 1;
    });
    
    const topApps = Object.entries(appCounts)
      .map(([name, count]) => ({ 
        name, 
        value: Math.round((count / logs.length) * 100) || 0,
        color: name === 'HTTPS' ? '#8b5cf6' : name === 'DNS' ? '#06b6d4' : '#10b981'
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    res.json({
      onlineAgents,
      totalThreats,
      activeUsers,
      topApps: topApps.length > 0 ? topApps : [
        { name: 'Nenhuma', value: 0, color: '#8b5cf6' }
      ]
    });
  });

  // 6. Generate AI Report
  app.post("/api/reports/generate", async (req, res) => {
    try {
      const { logs: reportLogs } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API Key not configured" });
      }

      const prompt = `
        Analise os seguintes logs de segurança do Bird Sase (SASE Control Plane) e gere um relatório executivo em Português do Brasil.
        O relatório deve incluir:
        1. Resumo de atividades (Total de logs, usuários ativos, aplicações mais usadas).
        2. Análise de ameaças (Quantas ameaças de nível Alto/Crítico foram detectadas).
        3. Recomendações de segurança baseadas nos padrões observados.
        4. Conclusão sobre a postura de segurança atual.

        Logs:
        ${JSON.stringify(reportLogs.slice(0, 20), null, 2)}
      `;

      const result = await ai.models.generateContent({
        model: model,
        contents: [{ parts: [{ text: prompt }] }]
      });

      res.json({ report: result.text });
    } catch (error: any) {
      console.error("Failed to generate report:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // 7. Download IDS/IPS Signatures (Mock)
  app.get("/api/ids-ips/signatures", (req, res) => {
    const signatures = [
      { id: '1', name: 'Log4j RCE Attempt', cve: 'CVE-2021-44228', severity: 'Critical', action: 'Block' },
      { id: '2', name: 'Spring4Shell Exploit', cve: 'CVE-2022-22965', severity: 'Critical', action: 'Block' },
      { id: '3', name: 'Follina MSDT Bug', cve: 'CVE-2022-30190', severity: 'High', action: 'Block' },
      { id: '4', name: 'ProxyLogon Exchange', cve: 'CVE-2021-26855', severity: 'Critical', action: 'Block' },
      { id: '5', name: 'Apache Struts RCE', cve: 'CVE-2017-5638', severity: 'High', action: 'Block' },
      { id: '6', name: 'SQL Injection Pattern', cve: 'N/A', severity: 'Medium', action: 'Monitor' },
      { id: '7', name: 'Cross-Site Scripting (XSS)', cve: 'N/A', severity: 'Medium', action: 'Monitor' },
      { id: '8', name: 'Brute Force Attempt', cve: 'N/A', severity: 'Low', action: 'Monitor' },
    ];
    res.json(signatures);
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
