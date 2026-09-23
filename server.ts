import express from "express";
import path from "path";
import fs from "fs";

interface LeadRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  niche: string;
  tierId: string;
  tierName: string;
  amount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  referenceId: string;
  bankTransactionRef?: string;
  notes?: string;
}

const DATA_DIR = path.resolve(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");
const BANK_FILE = path.join(DATA_DIR, "bank.json");

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(BANK_FILE)) {
    const defaultBank = {
      bankName: 'Standard Chartered / Meezan Bank',
      accountTitle: 'Awais Ahmad',
      accountNumber: '01234567890123',
      iban: 'PK36MEZN0001234567890123',
      swiftCode: 'MEZNPKKA',
      branchCity: 'Lahore, Pakistan',
      instructions: 'Please transfer the exact amount and mention your Reference ID in the transfer remarks. Once completed, enter your Transaction ID or upload your receipt.'
    };
    fs.writeFileSync(BANK_FILE, JSON.stringify(defaultBank, null, 2));
  }
}

async function startServer() {
  ensureDataFiles();
  const app = express();
  app.use(express.json());
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Leads CRM API
  app.get("/api/leads", (_req, res) => {
    try {
      const data = fs.readFileSync(LEADS_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch {
      res.json([]);
    }
  });

  app.post("/api/leads", (req, res) => {
    try {
      const newLead = req.body as LeadRecord;
      let leads: LeadRecord[] = [];
      try {
        leads = JSON.parse(fs.readFileSync(LEADS_FILE, "utf-8"));
      } catch {
        leads = [];
      }

      const existingIndex = leads.findIndex(l => l.id === newLead.id || (newLead.email && l.email?.toLowerCase() === newLead.email?.toLowerCase() && l.status === 'abandoned_lead'));
      if (existingIndex >= 0) {
        leads[existingIndex] = { ...leads[existingIndex], ...newLead };
      } else {
        leads.unshift(newLead);
      }

      fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
      res.json({ success: true, lead: newLead });
    } catch (e) {
      res.status(500).json({ error: "Failed to save lead" });
    }
  });

  app.patch("/api/leads/:id/status", (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      let leads: LeadRecord[] = [];
      try {
        leads = JSON.parse(fs.readFileSync(LEADS_FILE, "utf-8"));
      } catch {
        leads = [];
      }
      leads = leads.map(l => l.id === id ? { ...l, status } : l);
      fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "Failed to update status" });
    }
  });

  // Bank Details API
  app.get("/api/bank-details", (_req, res) => {
    try {
      const data = fs.readFileSync(BANK_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch {
      res.json({});
    }
  });

  app.post("/api/bank-details", (req, res) => {
    try {
      fs.writeFileSync(BANK_FILE, JSON.stringify(req.body, null, 2));
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "Failed to save bank details" });
    }
  });

  const distPath = path.resolve(process.cwd(), "dist");
  const isProduction = process.env.NODE_ENV === "production" || fs.existsSync(path.join(distPath, "index.html"));

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
