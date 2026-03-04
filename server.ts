import express from "express";
import { createServer as createViteServer } from "vite";
import { LogEntry } from "./src/types";

// In-memory database for our prototype
const agents: any[] = [];
const logs: LogEntry[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---

  // 1. Register an Agent
  app.post("/api/agents/register", (req, res) => {
    const { hostname, mac, ip, os } = req.body;
    
    // Check if agent already exists
    const existing = agents.find(a => a.mac === mac);
    if (existing) {
      existing.lastSeen = new Date().toISOString();
      existing.status = 'Online';
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
      registeredAt: new Date().toISOString()
    };
    
    agents.push(newAgent);
    res.status(201).json({ message: "Agent registered", agent: newAgent });
  });

  // 2. Receive Logs from Agent
  app.post("/api/logs", (req, res) => {
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
