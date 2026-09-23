export type LeadStatus = 'paid' | 'pending_bank_transfer' | 'abandoned_lead' | 'waitlist';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  niche: string;
  tierId: string;
  tierName: string;
  amount: number;
  paymentMethod: string;
  status: LeadStatus;
  createdAt: string;
  referenceId: string;
  bankTransactionRef?: string;
  notes?: string;
}

export interface BankAccountDetails {
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  swiftCode: string;
  branchCity: string;
  instructions: string;
}
