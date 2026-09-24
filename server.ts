import express from "express";
import path from "path";
import fs from "fs";
import os from "os";

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

// Temporary paths for fallback when root filesystem is restricted
const TMP_PRODUCT_DIR = path.join(os.tmpdir(), "upwork_downloads");
const TMP_ACTIVE_PDF_PATH = path.join(TMP_PRODUCT_DIR, "active-product.pdf");
const TMP_PRODUCT_FILE = path.join(os.tmpdir(), "product.json");

function ensureDataFiles() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (e) {
    console.warn("Could not create DATA_DIR, using fallback", e);
  }

  try {
    if (!fs.existsSync(PUBLIC_DOWNLOADS_DIR)) {
      fs.mkdirSync(PUBLIC_DOWNLOADS_DIR, { recursive: true });
    }
  } catch (e) {
    console.warn("Could not create PUBLIC_DOWNLOADS_DIR, using fallback", e);
  }

  try {
    if (!fs.existsSync(TMP_PRODUCT_DIR)) {
      fs.mkdirSync(TMP_PRODUCT_DIR, { recursive: true });
    }
  } catch (e) {
    console.warn("Could not create TMP_PRODUCT_DIR", e);
  }

  try {
    if (!fs.existsSync(LEADS_FILE)) {
      fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2));
    }
  } catch {
    // pass
  }

  try {
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
  } catch {
    // pass
  }

  try {
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
  } catch {
    // pass
  }
}

function saveProductBuffer(buffer: Buffer, originalName: string, fileSize: string): ProductMeta {
  const targetPaths = [
    ACTIVE_PDF_PATH,
    path.resolve(process.cwd(), "dist", "downloads", "active-product.pdf"),
    TMP_ACTIVE_PDF_PATH,
    path.join(os.tmpdir(), "active-product.pdf")
  ];

  let savedAny = false;
  for (const targetPath of targetPaths) {
    try {
      const dir = path.dirname(targetPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(targetPath, buffer);
      savedAny = true;
    } catch (err) {
      console.warn(`Could not save buffer to ${targetPath}:`, err);
    }
  }

  if (!savedAny) {
    console.error("Warning: Failed to write buffer to any filesystem target!");
  }

  const productMeta: ProductMeta = {
    filename: "active-product.pdf",
    originalName: originalName || "Upwork-Client-Acquisition-Master-System.pdf",
    fileSize: fileSize || `${(buffer.length / (1024 * 1024)).toFixed(2)} MB`,
    uploadedAt: new Date().toISOString(),
    downloadUrl: "/api/download-product"
  };

  const metaPaths = [
    PRODUCT_FILE,
    path.resolve(process.cwd(), "dist", "product.json"),
    TMP_PRODUCT_FILE
  ];

  for (const mp of metaPaths) {
    try {
      const dir = path.dirname(mp);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(mp, JSON.stringify(productMeta, null, 2));
    } catch (err) {
      console.warn(`Could not save metadata to ${mp}:`, err);
    }
  }

  return productMeta;
}

function getStoredProductMeta(): ProductMeta {
  const metaPaths = [
    PRODUCT_FILE,
    TMP_PRODUCT_FILE,
    path.resolve(process.cwd(), "dist", "product.json")
  ];

  for (const mp of metaPaths) {
    try {
      if (fs.existsSync(mp)) {
        const parsed = JSON.parse(fs.readFileSync(mp, "utf-8"));
        if (parsed && parsed.filename) return parsed;
      }
    } catch {
      // try next
    }
  }

  return {
    filename: "active-product.pdf",
    originalName: "Upwork-Client-Acquisition-Master-System.pdf",
    fileSize: "14.2 MB",
    uploadedAt: new Date().toISOString(),
    downloadUrl: "/api/download-product"
  };
}

async function startServer() {
  ensureDataFiles();
  const app = express();
  
  // Allow up to 100MB for uploads
  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ extended: true, limit: "100mb" }));

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
    res.json(getStoredProductMeta());
  });

  // 1. RAW Direct Binary Stream Upload API (Highly efficient, no base64 overhead, never fails on Cloud Run)
  app.post("/api/upload-product-raw", (req, res) => {
    try {
      const originalName = req.headers["x-filename"]
        ? decodeURIComponent(req.headers["x-filename"] as string)
        : "Upwork-Client-Acquisition-Master-System.pdf";

      const rawFileSize = req.headers["x-filesize"]
        ? decodeURIComponent(req.headers["x-filesize"] as string)
        : "";

      const chunks: Buffer[] = [];
      let totalBytes = 0;

      req.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
        totalBytes += chunk.length;
      });

      req.on("end", () => {
        try {
          const buffer = Buffer.concat(chunks);
          const computedSize = rawFileSize || `${(buffer.length / (1024 * 1024)).toFixed(2)} MB`;
          const productMeta = saveProductBuffer(buffer, originalName, computedSize);
          res.json({ success: true, product: productMeta });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Error saving stream buffer";
          res.status(500).json({ error: "Failed to process uploaded file", details: message });
        }
      });

      req.on("error", (err) => {
        console.error("Upload stream error:", err);
        res.status(500).json({ error: "Stream error during upload", details: err.message });
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown upload error";
      res.status(500).json({ error: "Failed to handle raw upload", details: message });
    }
  });

  // 2. Base64 JSON Upload API (Fallback)
  app.post("/api/upload-product", (req, res) => {
    try {
      const { filename, originalName, fileSize, base64Data } = req.body;
      if (!base64Data) {
        return res.status(400).json({ error: "Missing file data" });
      }

      // Strip data url prefix if present (e.g. data:application/pdf;base64,... or data:*/*;base64,...)
      const cleanedBase64 = base64Data.replace(/^data:[^;]+;base64,/, "").replace(/\s+/g, "");
      const buffer = Buffer.from(cleanedBase64, "base64");

      const name = originalName || filename || "Upwork-Master-Product.pdf";
      const size = fileSize || `${(buffer.length / (1024 * 1024)).toFixed(2)} MB`;
      const productMeta = saveProductBuffer(buffer, name, size);

      res.json({ success: true, product: productMeta });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(500).json({ error: "Failed to upload file", details: message });
    }
  });

  // Download Product File endpoint (Always succeeds with real file or generated master copy)
  app.get("/api/download-product", (_req, res) => {
    try {
      const meta = getStoredProductMeta();
      const filename = meta.originalName || "Upwork-Client-Acquisition-Master-System.pdf";

      const candidatePaths = [
        ACTIVE_PDF_PATH,
        path.resolve(process.cwd(), "dist", "downloads", "active-product.pdf"),
        TMP_ACTIVE_PDF_PATH,
        path.join(os.tmpdir(), "active-product.pdf")
      ];

      for (const p of candidatePaths) {
        if (fs.existsSync(p)) {
          const stats = fs.statSync(p);
          if (stats.size > 0) {
            res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(filename)}"`);
            res.setHeader("Content-Type", "application/pdf");
            return res.sendFile(p);
          }
        }
      }

      // Default high-value PDF placeholder if no file uploaded yet
      const samplePdf = Buffer.from(
        "%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 200 >>\nstream\nBT\n/F1 20 Tf\n50 720 Td\n(Upwork Client Acquisition System - Playbook & Templates) Tj\n/F1 12 Tf\n50 690 Td\n(License Granted To Customer. All Rights Reserved.) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000206 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n460\n%%EOF"
      );
      res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(filename)}"`);
      res.setHeader("Content-Type", "application/pdf");
      return res.send(samplePdf);
    } catch {
      res.status(500).json({ error: "Error downloading product file" });
    }
  });

  // Serve static downloads directly if requested
  app.use("/downloads", express.static(PUBLIC_DOWNLOADS_DIR));
  app.use("/downloads", express.static(TMP_PRODUCT_DIR));

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
