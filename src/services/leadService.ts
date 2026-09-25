import { Lead, BankAccountDetails, ProductFileInfo } from '../types/crm';
import { DEFAULT_BANK_DETAILS } from '../data/bankDetails';

const LEADS_STORAGE_KEY = 'upwork_acquisition_leads_v1';
const BANK_STORAGE_KEY = 'upwork_bank_details_v1';
const PRODUCT_STORAGE_KEY = 'upwork_product_file_v1';

const DEFAULT_PRODUCT_FILE: ProductFileInfo = {
  id: 'prod_quick_start_guide',
  filename: 'Start-Here-Quick-Start-Guide.pdf',
  originalName: 'Start-Here-Quick-Start-Guide.pdf',
  fileSize: '8.0 KB',
  fileSizeBytes: 8016,
  fileType: 'application/pdf',
  uploadedAt: new Date().toISOString(),
  downloadUrl: '/api/download-product?id=prod_quick_start_guide'
};

const INITIAL_DEMO_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Hamza Tariq',
    email: 'hamza.tariq@gmail.com',
    phone: '+92 300 8472910',
    niche: 'Web & Mobile Dev',
    tierId: 'complete',
    tierName: 'The Complete System',
    amount: 114,
    paymentMethod: 'bank_transfer',
    status: 'pending_bank_transfer',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    referenceId: 'UPW-84920',
    bankTransactionRef: 'TRX-94827104',
    notes: 'Sent payment via online banking. Awaiting admin review.'
  },
  {
    id: 'lead-2',
    name: 'Sarah Jenkins',
    email: 'sarah.j.design@gmail.com',
    phone: '+1 (512) 892-4410',
    niche: 'UI/UX & Product Design',
    tierId: 'complete',
    tierName: 'The Complete System',
    amount: 114,
    paymentMethod: 'card',
    status: 'paid',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    referenceId: 'UPW-31849',
    notes: 'Completed card checkout with order bump.'
  },
  {
    id: 'lead-3',
    name: 'Zubair Malik',
    email: 'zubair.tech22@yahoo.com',
    phone: '+92 321 4492019',
    niche: 'AI & Automation',
    tierId: 'starter',
    tierName: 'Starter Toolkit',
    amount: 47,
    paymentMethod: 'none',
    status: 'abandoned_lead',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    referenceId: 'UPW-66291',
    notes: 'Left at payment step. Ready for WhatsApp/Email retargeting.'
  },
  {
    id: 'lead-4',
    name: 'Marcus Vance',
    email: 'marcus.copywriter@outlook.com',
    phone: '+1 (415) 609-3329',
    niche: 'Copywriting & Marketing',
    tierId: 'audit',
    tierName: 'VIP 1:1 Video Audit',
    amount: 214,
    paymentMethod: 'none',
    status: 'abandoned_lead',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    referenceId: 'UPW-77103',
    notes: 'Viewed VIP tier. High intent lead.'
  }
];

// IndexedDB Vault for zero-fail local file storage
const IDB_NAME = 'upwork_crm_vault_db';
const IDB_STORE = 'product_files';
const PRODUCTS_LIST_STORAGE_KEY = 'upwork_products_list_v1';

function openIndexedDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported'));
    }
    const req = indexedDB.open(IDB_NAME, 2);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveProductToVault(file: File | Blob, filename: string, fileId?: string): Promise<void> {
  try {
    const db = await openIndexedDb();
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    const key = fileId ? `file_${fileId}` : 'active_product_file';
    const nameKey = fileId ? `name_${fileId}` : 'active_product_filename';
    store.put(file, key);
    store.put(filename, nameKey);
    // Also save as latest active product
    store.put(file, 'active_product_file');
    store.put(filename, 'active_product_filename');
    store.put(new Date().toISOString(), 'active_product_timestamp');
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
  } catch (err) {
    console.warn('Could not store in IndexedDB vault:', err);
  }
}

export async function getProductFromVault(fileId?: string): Promise<{ file: Blob; filename: string } | null> {
  try {
    const db = await openIndexedDb();
    const tx = db.transaction(IDB_STORE, 'readonly');
    const store = tx.objectStore(IDB_STORE);
    const fileKey = fileId ? `file_${fileId}` : 'active_product_file';
    const nameKey = fileId ? `name_${fileId}` : 'active_product_filename';
    const fileReq = store.get(fileKey);
    const nameReq = store.get(nameKey);

    return new Promise((resolve) => {
      tx.oncomplete = () => {
        if (fileReq.result) {
          resolve({
            file: fileReq.result as Blob,
            filename: (nameReq.result as string) || 'Product-File.pdf'
          });
        } else {
          // If specific fileId not found, fallback to active_product_file
          const fallbackReq = store.get('active_product_file');
          const fallbackNameReq = store.get('active_product_filename');
          fallbackReq.onsuccess = () => {
            if (fallbackReq.result) {
              resolve({
                file: fallbackReq.result as Blob,
                filename: (fallbackNameReq.result as string) || 'Upwork-Client-Acquisition-Master-System.pdf'
              });
            } else {
              resolve(null);
            }
          };
          fallbackReq.onerror = () => resolve(null);
        }
      };
      tx.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export const leadService = {
  getLeads: async (): Promise<Lead[]> => {
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(data));
          return data;
        }
      }
    } catch {
      // fallback to localStorage
    }

    const local = localStorage.getItem(LEADS_STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // pass
      }
    }

    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_LEADS));
    return INITIAL_DEMO_LEADS;
  },

  saveLead: async (lead: Lead): Promise<Lead> => {
    let currentLeads: Lead[] = [];
    try {
      const local = localStorage.getItem(LEADS_STORAGE_KEY);
      currentLeads = local ? JSON.parse(local) : INITIAL_DEMO_LEADS;
    } catch {
      currentLeads = INITIAL_DEMO_LEADS;
    }

    const existingIndex = currentLeads.findIndex(l => l.id === lead.id || (lead.email && l.email.toLowerCase() === lead.email.toLowerCase() && l.status === 'abandoned_lead'));
    if (existingIndex >= 0) {
      currentLeads[existingIndex] = { ...currentLeads[existingIndex], ...lead };
    } else {
      currentLeads.unshift(lead);
    }

    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(currentLeads));

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead)
      });
    } catch {
      // ignore
    }

    return lead;
  },

  updateLeadStatus: async (leadId: string, status: Lead['status']): Promise<void> => {
    let currentLeads: Lead[] = [];
    try {
      const local = localStorage.getItem(LEADS_STORAGE_KEY);
      currentLeads = local ? JSON.parse(local) : [];
    } catch {
      currentLeads = [];
    }

    const updated = currentLeads.map(l => l.id === leadId ? { ...l, status } : l);
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));

    try {
      await fetch(`/api/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch {
      // ignore
    }
  },

  getBankDetails: async (): Promise<BankAccountDetails> => {
    try {
      const res = await fetch('/api/bank-details');
      if (res.ok) {
        const data = await res.json();
        if (data && data.bankName) {
          localStorage.setItem(BANK_STORAGE_KEY, JSON.stringify(data));
          return data;
        }
      }
    } catch {
      // fallback
    }

    const local = localStorage.getItem(BANK_STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // pass
      }
    }

    return DEFAULT_BANK_DETAILS;
  },

  saveBankDetails: async (details: BankAccountDetails): Promise<void> => {
    localStorage.setItem(BANK_STORAGE_KEY, JSON.stringify(details));
    try {
      await fetch('/api/bank-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      });
    } catch {
      // ignore
    }
  },

  getProductFile: async (): Promise<ProductFileInfo> => {
    try {
      const res = await fetch('/api/product-file', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && data.filename) {
          localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(data));
          return data;
        }
      }
    } catch {
      // fallback
    }

    const local = localStorage.getItem(PRODUCT_STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // pass
      }
    }

    return DEFAULT_PRODUCT_FILE;
  },

  getAllProducts: async (): Promise<ProductFileInfo[]> => {
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list)) {
          localStorage.setItem(PRODUCTS_LIST_STORAGE_KEY, JSON.stringify(list));
          return list;
        }
      }
    } catch {
      // fallback to localStorage
    }

    const local = localStorage.getItem(PRODUCTS_LIST_STORAGE_KEY);
    if (local !== null) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // pass
      }
    }

    const single = await leadService.getProductFile();
    return [single];
  },

  // Zero-Fail Download Trigger: checks IndexedDB first, falls back to server URL
  triggerProductDownload: async (
    fallbackUrl = '/api/download-product',
    filenameHint = 'Upwork-Client-Acquisition-Master-System.pdf',
    fileId?: string
  ): Promise<void> => {
    try {
      const vaulted = await getProductFromVault(fileId);
      if (vaulted && vaulted.file && vaulted.file.size > 0) {
        const blobUrl = URL.createObjectURL(vaulted.file);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = vaulted.filename || filenameHint;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);
        }, 3000);
        return;
      }
    } catch {
      // fallback to network
    }

    // Direct network download
    const url = fileId && !fallbackUrl.includes('?id=') 
      ? `${fallbackUrl}?id=${encodeURIComponent(fileId)}` 
      : fallbackUrl;

    const a = document.createElement('a');
    a.href = url;
    a.download = filenameHint;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
    }, 2000);
  },

  // Download all files sequentially so browser doesn't block multi-file downloads
  downloadAllFiles: async (products: ProductFileInfo[]): Promise<void> => {
    if (!products || products.length === 0) return;
    for (let i = 0; i < products.length; i++) {
      const prod = products[i];
      await leadService.triggerProductDownload(prod.downloadUrl, prod.originalName, prod.id);
      if (i < products.length - 1) {
        await new Promise(r => setTimeout(r, 650));
      }
    }
  },

  // Bulletproof Upload with Dual Pipeline: IndexedDB + Raw Streaming + Base64 fallback (supports atomic replacement)
  uploadProductFile: async (file: File, replaceTargetId?: string): Promise<ProductFileInfo> => {
    const fileId = `file_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const fileSizeFormatted = file.size < 1024 * 1024 
      ? `${(file.size / 1024).toFixed(1)} KB` 
      : `${sizeInMB} MB`;

    // If replaceTargetId is not provided, check if the test placeholder exists in local storage
    let targetToReplace = replaceTargetId;
    if (!targetToReplace) {
      try {
        const cached = localStorage.getItem(PRODUCTS_LIST_STORAGE_KEY);
        if (cached) {
          const list = JSON.parse(cached);
          if (Array.isArray(list)) {
            const testProd = list.find((p: ProductFileInfo) =>
              p.id === 'prod_master_pdf' ||
              p.filename === 'active-product.pdf' ||
              p.originalName.toLowerCase().includes('acquisition-master')
            );
            if (testProd && testProd.id) {
              targetToReplace = testProd.id;
            }
          }
        }
      } catch {}
    }

    // 1. Immediately guarantee local storage in IndexedDB vault
    await saveProductToVault(file, file.name, fileId);

    // Clean up replaced target key and default test keys in IndexedDB
    try {
      const db = await openIndexedDb();
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      if (targetToReplace) {
        store.delete(`file_${targetToReplace}`);
        store.delete(`name_${targetToReplace}`);
      }
      store.delete('file_prod_master_pdf');
      store.delete('name_prod_master_pdf');
    } catch {}

    const fallbackMeta: ProductFileInfo = {
      id: fileId,
      filename: `product-${fileId}.pdf`,
      originalName: file.name,
      fileSize: fileSizeFormatted,
      fileSizeBytes: file.size,
      fileType: file.type || 'application/pdf',
      uploadedAt: new Date().toISOString(),
      downloadUrl: `/api/download-product?id=${fileId}`
    };

    // 2. Primary Upload: Raw Binary Stream (Zero base64 overhead, streams directly to server)
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/octet-stream',
        'x-filename': encodeURIComponent(file.name),
        'x-filesize': encodeURIComponent(fileSizeFormatted),
        'x-file-id': encodeURIComponent(fileId),
        'x-filetype': encodeURIComponent(file.type || 'application/octet-stream')
      };
      if (targetToReplace) {
        headers['x-replace-target-id'] = encodeURIComponent(targetToReplace);
      }

      const rawRes = await fetch('/api/upload-product-raw', {
        method: 'POST',
        headers,
        body: file
      });

      if (rawRes.ok) {
        const data = await rawRes.json();
        if (data.product) {
          localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(data.product));
          if (Array.isArray(data.allProducts)) {
            localStorage.setItem(PRODUCTS_LIST_STORAGE_KEY, JSON.stringify(data.allProducts));
          }
          return data.product;
        }
      }
    } catch (rawErr) {
      console.warn('Raw streaming upload encountered notice, attempting secondary sync:', rawErr);
    }

    // 3. Secondary Upload (if file is < 25MB): Base64 JSON fallback
    if (file.size < 25 * 1024 * 1024) {
      try {
        const base64Data = await new Promise<string>((res, rej) => {
          const reader = new FileReader();
          reader.onload = () => res(reader.result as string);
          reader.onerror = () => rej(reader.error);
          reader.readAsDataURL(file);
        });

        const jsonRes = await fetch('/api/upload-product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: fileId,
            filename: file.name,
            originalName: file.name,
            fileSize: fileSizeFormatted,
            fileType: file.type,
            replaceTargetId: targetToReplace,
            base64Data
          })
        });

        if (jsonRes.ok) {
          const data = await jsonRes.json();
          if (data.product) {
            localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(data.product));
            if (Array.isArray(data.allProducts)) {
              localStorage.setItem(PRODUCTS_LIST_STORAGE_KEY, JSON.stringify(data.allProducts));
            }
            return data.product;
          }
        }
      } catch (jsonErr) {
        console.warn('Secondary JSON upload notice:', jsonErr);
      }
    }

    // 4. Update local storage list with fallback item
    const currentList = await leadService.getAllProducts();
    let updated: ProductFileInfo[];
    if (targetToReplace) {
      const idx = currentList.findIndex(p => p.id === targetToReplace);
      if (idx >= 0) {
        updated = [...currentList];
        updated[idx] = fallbackMeta;
      } else {
        updated = [fallbackMeta, ...currentList.filter(p => p.id !== 'prod_master_pdf' && !p.originalName.toLowerCase().includes('acquisition-master'))];
      }
    } else {
      updated = [fallbackMeta, ...currentList.filter(p => p.originalName !== file.name && p.id !== 'prod_master_pdf')];
    }

    localStorage.setItem(PRODUCTS_LIST_STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(fallbackMeta));

    return fallbackMeta;
  },

  // Atomic replace a specific product file (like the test product) with a new file
  replaceProductFile: async (targetId: string, file: File): Promise<{ product: ProductFileInfo; allProducts: ProductFileInfo[] }> => {
    const product = await leadService.uploadProductFile(file, targetId);
    const allProducts = await leadService.getAllProducts();
    return { product, allProducts };
  },

  // Upload multiple files in parallel/sequence with detailed progress
  uploadMultipleFiles: async (
    files: File[],
    onProgress?: (completed: number, total: number, currentName: string) => void
  ): Promise<{ successful: ProductFileInfo[]; failed: { name: string; error: string }[] }> => {
    const successful: ProductFileInfo[] = [];
    const failed: { name: string; error: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (onProgress) {
        onProgress(i, files.length, file.name);
      }

      try {
        const uploaded = await leadService.uploadProductFile(file);
        successful.push(uploaded);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Upload failed';
        failed.push({ name: file.name, error: msg });
      }
    }

    if (onProgress) {
      onProgress(files.length, files.length, 'Complete');
    }

    return { successful, failed };
  },

  // Delete product file
  deleteProduct: async (id: string): Promise<ProductFileInfo[]> => {
    // 1. Remove from local IndexedDB vault if stored
    try {
      const db = await openIndexedDb();
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      store.delete(`file_${id}`);
      store.delete(`name_${id}`);
      await new Promise((resolve) => {
        tx.oncomplete = resolve;
        tx.onerror = resolve;
      });
    } catch {}

    // 2. Delete on server
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.allProducts)) {
          localStorage.setItem(PRODUCTS_LIST_STORAGE_KEY, JSON.stringify(data.allProducts));
          if (data.allProducts.length > 0) {
            localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(data.allProducts[0]));
          } else {
            localStorage.removeItem(PRODUCT_STORAGE_KEY);
          }
          return data.allProducts;
        }
      }
    } catch {
      // ignore
    }

    const current = await leadService.getAllProducts();
    const remaining = current.filter(p => p.id !== id);
    localStorage.setItem(PRODUCTS_LIST_STORAGE_KEY, JSON.stringify(remaining));
    if (remaining.length > 0) {
      localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(remaining[0]));
    } else {
      localStorage.removeItem(PRODUCT_STORAGE_KEY);
    }
    return remaining;
  },

  // Reset or re-add default test product
  resetDefaultProduct: async (): Promise<ProductFileInfo[]> => {
    try {
      const res = await fetch('/api/products/reset-default', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.allProducts)) {
          localStorage.setItem(PRODUCTS_LIST_STORAGE_KEY, JSON.stringify(data.allProducts));
          if (data.allProducts.length > 0) {
            localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(data.allProducts[0]));
          }
          return data.allProducts;
        }
      }
    } catch {}

    const list = [DEFAULT_PRODUCT_FILE];
    localStorage.setItem(PRODUCTS_LIST_STORAGE_KEY, JSON.stringify(list));
    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCT_FILE));
    return list;
  }
};
