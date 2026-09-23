import { Lead, BankAccountDetails } from '../types/crm';
import { DEFAULT_BANK_DETAILS } from '../data/bankDetails';

const LEADS_STORAGE_KEY = 'upwork_acquisition_leads_v1';
const BANK_STORAGE_KEY = 'upwork_bank_details_v1';

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
    // Save to local storage first
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

    // Send to backend API
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead)
      });
    } catch {
      // Backend may be offline in dev/preview, localStorage holds state
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
  }
};
