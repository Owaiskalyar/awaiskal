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

interface ProductMeta {
  filename: string;
  originalName: string;
  fileSize: string;
  uploadedAt: string;
  downloadUrl: string;
}

const DATA_DIR = path.resolve(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");
const BANK_FILE = path.join(DATA_DIR, "bank.json");
const PRODUCT_FILE = path.join(DATA_DIR, "product.json");
const PUBLIC_DOWNLOADS_DIR = path.resolve(process.cwd(), "public", "downloads");
const ACTIVE_PDF_PATH = path.join(PUBLIC_DOWNLOADS_DIR, "active-product.pdf");

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(PUBLIC_DOWNLOADS_DIR)) {
    fs.mkdirSync(PUBLIC_DOWNLOADS_DIR, { recursive: true });
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
  if (!fs.existsSync(PRODUCT_FILE)) {
    const defaultProduct: ProductMeta = {
      filename: "active-product.pdf",
      originalName: "Upwork-Client-Acquisition-Master-System.pdf",
      fileSize: "14.2 MB",
      uploadedAt: new Date().toISOString(),
      downloadUrl: "/api/download-product"
    };
    fs.writeFileSync(PRODUCT_FILE, JSON.stringify(defaultProduct, null, 2));
  }
}

async function startServer() {
  ensureDataFiles();
  const app = express();
  
  // Allow up to 50MB for uploading product PDFs via base64
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

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
    } catch {
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

  // Product File Metadata API
  app.get("/api/product-file", (_req, res) => {
    try {
      const data = fs.readFileSync(PRODUCT_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch {
      res.json({
        filename: "active-product.pdf",
        originalName: "Upwork-Client-Acquisition-Master-System.pdf",
        fileSize: "14.2 MB",
        uploadedAt: new Date().toISOString(),
        downloadUrl: "/api/download-product"
      });
    }
  });

  // Upload Product File (PDF) API
  app.post("/api/upload-product", (req, res) => {
    try {
      const { filename, originalName, fileSize, base64Data } = req.body;
      if (!base64Data) {
        return res.status(400).json({ error: "Missing file data" });
      }

      // Strip data url prefix if present (e.g. data:application/pdf;base64,...)
      const cleanedBase64 = base64Data.replace(/^data:application\/pdf;base64,/, "").replace(/^data:.*?;base64,/, "");
      const buffer = Buffer.from(cleanedBase64, "base64");

      // Write to public/downloads/active-product.pdf
      fs.writeFileSync(ACTIVE_PDF_PATH, buffer);

      // If dist/downloads exists (in production build), copy it there as well
      const distDownloadsDir = path.resolve(process.cwd(), "dist", "downloads");
      if (fs.existsSync(distDownloadsDir)) {
        fs.writeFileSync(path.join(distDownloadsDir, "active-product.pdf"), buffer);
      }

      const productMeta: ProductMeta = {
        filename: "active-product.pdf",
        originalName: originalName || filename || "Upwork-Master-Product.pdf",
        fileSize: fileSize || `${(buffer.length / (1024 * 1024)).toFixed(2)} MB`,
        uploadedAt: new Date().toISOString(),
        downloadUrl: "/api/download-product"
      };

      fs.writeFileSync(PRODUCT_FILE, JSON.stringify(productMeta, null, 2));
      res.json({ success: true, product: productMeta });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(500).json({ error: "Failed to upload file", details: message });
    }
  });

  // Download Product File endpoint
  app.get("/api/download-product", (_req, res) => {
    try {
      let meta: ProductMeta = {
        filename: "active-product.pdf",
        originalName: "Upwork-Client-Acquisition-Master-System.pdf",
        fileSize: "14.2 MB",
        uploadedAt: new Date().toISOString(),
        downloadUrl: "/api/download-product"
      };

      if (fs.existsSync(PRODUCT_FILE)) {
        try {
          meta = JSON.parse(fs.readFileSync(PRODUCT_FILE, "utf-8"));
        } catch {
          // use default
        }
      }

      if (fs.existsSync(ACTIVE_PDF_PATH)) {
        return res.download(ACTIVE_PDF_PATH, meta.originalName || "Upwork-Client-Acquisition-System.pdf");
      }

      // Check dist fallback
      const distFallback = path.resolve(process.cwd(), "dist", "downloads", "active-product.pdf");
      if (fs.existsSync(distFallback)) {
        return res.download(distFallback, meta.originalName || "Upwork-Client-Acquisition-System.pdf");
      }

      res.status(404).json({ error: "Product file not found. Please upload it in Merchant CRM." });
    } catch {
      res.status(500).json({ error: "Error downloading product file" });
    }
  });

  // Serve static downloads directly if requested
  app.use("/downloads", express.static(PUBLIC_DOWNLOADS_DIR));

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
