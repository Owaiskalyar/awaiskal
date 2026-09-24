import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Lock, 
  Zap, 
  CreditCard, 
  Download, 
  ExternalLink, 
  ArrowRight,
  ArrowLeft,
  Copy,
  Building2,
  Phone,
  Mail,
  User,
  FileText
} from 'lucide-react';
import { PRICING_TIERS } from '../data/productData';
import { leadService } from '../services/leadService';
import { BankAccountDetails, Lead, ProductFileInfo } from '../types/crm';
import { DEFAULT_BANK_DETAILS } from '../data/bankDetails';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTierId: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedTierId
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [tierId, setTierId] = useState<string>(selectedTierId || 'complete');
  const [includeBump, setIncludeBump] = useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [niche, setNiche] = useState<string>('Web & Mobile Dev');
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'card' | 'paypal' | 'gpay'>('bank');
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [bankTxRef, setBankTxRef] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [currentLeadId, setCurrentLeadId] = useState<string>('');
  const [orderReference, setOrderReference] = useState<string>('');
  const [bankDetails, setBankDetails] = useState<BankAccountDetails>(DEFAULT_BANK_DETAILS);
  const [productInfo, setProductInfo] = useState<ProductFileInfo>({
    filename: 'active-product.pdf',
    originalName: 'Upwork-Client-Acquisition-Master-System.pdf',
    fileSize: '14.2 MB',
    uploadedAt: new Date().toISOString(),
    downloadUrl: '/api/download-product'
  });
  const [productsList, setProductsList] = useState<ProductFileInfo[]>([]);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  useEffect(() => {
    if (selectedTierId) {
      setTierId(selectedTierId);
    }
  }, [selectedTierId]);

  useEffect(() => {
    if (isOpen) {
      leadService.getBankDetails().then(setBankDetails);
      leadService.getProductFile().then(setProductInfo);
      leadService.getAllProducts().then(list => {
        setProductsList(list);
        if (list.length > 0) setProductInfo(list[0]);
      });
      const ref = `UPW-${Math.floor(10000 + Math.random() * 90000)}`;
      setOrderReference(ref);
      setCurrentLeadId(`lead-${Date.now()}`);
      setStep('details');
      setBankTxRef('');
    }
  }, [isOpen]);

  // Support pressing Escape to close and return to the main page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentTier = PRICING_TIERS.find(t => t.id === tierId) || PRICING_TIERS[1];
  const bumpPrice = 17;
  const totalPrice = currentTier.price + (includeBump ? bumpPrice : 0);

  // Step 1: Proceed to Payment and capture lead immediately in CRM
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    const leadData: Lead = {
      id: currentLeadId,
      name,
      email,
      phone: phone || 'Not provided',
      niche,
      tierId,
      tierName: currentTier.name,
      amount: totalPrice,
      paymentMethod,
      status: 'abandoned_lead',
      createdAt: new Date().toISOString(),
      referenceId: orderReference,
      notes: 'Customer entered details and reached payment selection page.'
    };

    leadService.saveLead(leadData);
    setStep('payment');
  };

  // Step 2: Finalize Payment
  const handleFinalizePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const isBank = paymentMethod === 'bank';
    const status: Lead['status'] = isBank ? 'pending_bank_transfer' : 'paid';

    const updatedLead: Lead = {
      id: currentLeadId,
      name,
      email,
      phone: phone || 'Not provided',
      niche,
      tierId,
      tierName: currentTier.name,
      amount: totalPrice,
      paymentMethod,
      status,
      createdAt: new Date().toISOString(),
      referenceId: orderReference,
      bankTransactionRef: isBank ? bankTxRef : undefined,
      notes: isBank 
        ? `Pending Bank Transfer. Tx Ref: ${bankTxRef || 'Not entered yet'}` 
        : 'Payment successfully processed.'
    };

    leadService.saveLead(updatedLead);

    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
    }, 1000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={(e) => {
        // If clicking outside the modal container, close and return to main page
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Clickable backdrop overlay to ensure outside clicks dismiss modal */}
      <div 
        className="fixed inset-0 -z-10" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div 
        className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header with Step indicator and Cross Close button */}
        <div className="bg-neutral-950 px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step === 'payment' && (
              <button
                type="button"
                onClick={() => setStep('details')}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-neutral-900 px-2.5 py-1.5 rounded-lg border border-neutral-800 transition-colors cursor-pointer"
                title="Return to details"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              ⚡
            </div>
            <div>
              <span className="text-sm font-bold text-white">
                {step === 'details' && 'Step 1: Your Details & Package'}
                {step === 'payment' && 'Step 2: Choose Payment Method'}
                {step === 'success' && 'Order Confirmed & Instant Access'}
              </span>
              <span className="text-xs text-neutral-400 block sm:inline sm:ml-2">
                • Ref: {orderReference}
              </span>
            </div>
          </div>

          {/* Prominent Cross Icon to return to main page */}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 bg-neutral-900/60 border border-neutral-800 transition-all cursor-pointer group"
            aria-label="Close and return to main page"
            title="Return to main page (Esc)"
          >
            <span className="text-[11px] font-semibold text-neutral-400 group-hover:text-white">Exit</span>
            <X className="w-4 h-4 text-neutral-400 group-hover:text-white" />
          </button>
        </div>

        {/* STEP 3: SUCCESS SCREEN */}
        {step === 'success' && (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">
                {paymentMethod === 'bank' ? 'Bank Transfer Details Submitted!' : 'Welcome to the System!'}
              </h3>
              <p className="text-sm text-neutral-300 max-w-md mx-auto">
                {paymentMethod === 'bank' ? (
                  <>
                    Thank you, <strong className="text-white">{name}</strong>! Your order reference <strong className="text-emerald-400">{orderReference}</strong> has been logged in our CRM. Download your digital product PDF package below.
                  </>
                ) : (
                  <>
                    Your order is confirmed and instant access links have been registered for <strong className="text-emerald-400">{email}</strong>. Download your files below.
                  </>
                )}
              </p>
            </div>

            {/* Generated License Token */}
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-left space-y-2 max-w-md mx-auto">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Your Master License Key:</span>
                <span className="text-emerald-400 font-bold font-mono">{orderReference}</span>
              </div>
              <div className="flex items-center justify-between bg-neutral-900 p-2.5 rounded-lg border border-neutral-800 font-mono text-xs text-white">
                <span>UPW-SYSTEM-2026-{orderReference.replace('UPW-', '')}X</span>
                <button
                  onClick={() => copyToClipboard(`UPW-SYSTEM-2026-${orderReference.replace('UPW-', '')}X`, 'license')}
                  className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedKey === 'license' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Downloads Vault - Directly links to uploaded PDF and multi-file bundle */}
            <div className="space-y-3 max-w-md mx-auto text-left">
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                <span>Your Digital Product Package:</span>
                <span className="text-[10px] text-emerald-400 font-medium">Ready for Download</span>
              </div>

              {/* If multiple product files exist, show bundle download button */}
              {productsList.length > 1 && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>📦 Complete Product Bundle</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.5 rounded">
                        {productsList.length} Files
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">
                      Download all playbooks, guides, and swipe files
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isDownloadingAll}
                    onClick={async () => {
                      try {
                        setIsDownloadingAll(true);
                        await leadService.downloadAllFiles(productsList);
                      } finally {
                        setIsDownloadingAll(false);
                      }
                    }}
                    className="px-3.5 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-neutral-950 text-xs font-extrabold transition-all flex items-center gap-1.5 shrink-0 shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isDownloadingAll ? 'Downloading...' : 'Download All Files'}</span>
                  </button>
                </div>
              )}

              {/* Render each product file in the vault */}
              {productsList.length > 0 ? (
                productsList.map((prod, idx) => {
                  const ext = (prod.originalName.split('.').pop() || 'PDF').toUpperCase();
                  return (
                    <div key={prod.id || `prod-${idx}`} className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-emerald-500/40 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-3 truncate mr-2">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex flex-col items-center justify-center font-bold text-xs shrink-0">
                          <FileText className="w-4 h-4" />
                          <span className="text-[8px] font-mono mt-0.5">{ext.slice(0, 4)}</span>
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold text-white truncate" title={prod.originalName}>
                            {prod.originalName || "Upwork-Client-Acquisition-Master-System.pdf"}
                          </div>
                          <div className="text-[10px] text-neutral-400">
                            {ext} • {prod.fileSize || "14.2 MB"} • Included
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => leadService.triggerProductDownload(prod.downloadUrl, prod.originalName, prod.id)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-emerald-400 hover:text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border border-emerald-500/30 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    </div>
                  );
                })
              ) : productInfo.originalName ? (
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-emerald-500/40 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3 truncate mr-2">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex flex-col items-center justify-center font-bold text-xs shrink-0">
                      <FileText className="w-4 h-4" />
                      <span className="text-[8px] font-mono mt-0.5">PDF</span>
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-white truncate" title={productInfo.originalName}>
                        {productInfo.originalName}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        {productInfo.fileSize || "14.2 MB"} • Included
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => leadService.triggerProductDownload(productInfo.downloadUrl, productInfo.originalName, productInfo.id)}
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-emerald-400 hover:text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border border-emerald-500/30 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 text-xs text-center">
                  Digital product files have been dispatched to your email address.
                </div>
              )}

              {/* Notion Workspace */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-neutral-800 text-neutral-300 flex items-center justify-center font-bold text-xs shrink-0">
                    📁
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">The Notion Acquisition Workspace</div>
                    <div className="text-[10px] text-neutral-400">Interactive Templates, Scripts, Playbook</div>
                  </div>
                </div>
                <button
                  onClick={() => alert("Notion Workspace: Template duplicate link opened in new tab.")}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>Access</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {includeBump && (
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-amber-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                      🛡️
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Contract Protection & Dispute Kit</div>
                      <div className="text-[10px] text-neutral-400">Order Bump bonus package included</div>
                    </div>
                  </div>
                  <a
                    href="/api/download-product"
                    download="Contract-Dispute-Kit.pdf"
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </a>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setStep('payment')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                ← Return to Payment Options
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Done • Return to Main Page
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: CUSTOMER DETAILS & PACKAGE */}
        {step === 'details' && (
          <form onSubmit={handleProceedToPayment} className="p-6 sm:p-8 space-y-6">
            {/* Package Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                1. Select Package:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {PRICING_TIERS.map((tier) => (
                  <button
                    type="button"
                    key={tier.id}
                    onClick={() => setTierId(tier.id)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      tierId === tier.id
                        ? 'bg-neutral-950 border-emerald-400 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-400'
                        : 'bg-neutral-950/50 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-white truncate">{tier.name}</div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-lg font-black text-emerald-400 font-mono">${tier.price}</span>
                      <span className="text-[10px] text-neutral-500 line-through font-mono">${tier.originalPrice}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Contact Details */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                2. Contact Information:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-1">
                    Your Full Name: <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Awais Ahmad"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-1">
                    Email Address: <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-1">
                    Phone / WhatsApp Number: <span className="text-neutral-500 text-[10px]">(For instant support/updates)</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                    <input
                      type="tel"
                      placeholder="+92 300 1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-1">
                    Your Freelancing Niche:
                  </label>
                  <select
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-neutral-300 focus:outline-none"
                  >
                    <option value="Web & Mobile Dev">Web & Mobile Development (React, Fullstack)</option>
                    <option value="UI/UX & Product Design">UI/UX & Graphic Design</option>
                    <option value="Copywriting & Marketing">Copywriting & Content Strategy</option>
                    <option value="Video & Motion">Video Editing & Motion Graphics</option>
                    <option value="AI & Automation">AI Automation & Python Specialist</option>
                    <option value="Virtual Assistance">Executive Virtual Assistance</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Order Bump */}
            <div className="rounded-2xl bg-neutral-950 border border-amber-500/40 p-4 relative group">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeBump}
                  onChange={(e) => setIncludeBump(e.target.checked)}
                  className="w-4 h-4 mt-1 accent-amber-400 rounded cursor-pointer"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                      ⚡ SPECIAL 1-TIME ADDON: SAVE 78%
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white">
                    Add The Upwork Contract Dispute & Scope Creep Protection Kit for only ${bumpPrice}
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Protect your JSS and eliminate unpaid scope creep. Includes escrow addendums and client dispute scripts.
                  </p>
                </div>
              </label>
            </div>

            {/* Price Preview & Action Buttons */}
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-neutral-400">Total Investment:</span>
                <div className="text-2xl font-black text-emerald-400 font-mono">${totalPrice}.00</div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 sm:w-auto px-4 py-3 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900 text-neutral-400 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Return to Page
                </button>

                <button
                  type="submit"
                  className="w-1/2 sm:w-auto py-3 px-6 rounded-xl font-extrabold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        )}

        {/* STEP 2: CHOOSE PAYMENT METHOD & BANK DETAILS */}
        {step === 'payment' && (
          <form onSubmit={handleFinalizePayment} className="p-6 sm:p-8 space-y-6">
            {/* Return / Back Button bar */}
            <div className="flex items-center justify-between bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="inline-flex items-center gap-1.5 font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Package / Details</span>
              </button>
              
              <button
                type="button"
                onClick={onClose}
                className="text-neutral-400 hover:text-white font-semibold transition-colors cursor-pointer flex items-center gap-1"
                title="Cancel and return to main page"
              >
                <X className="w-3.5 h-3.5" />
                <span>Return to Main Page</span>
              </button>
            </div>

            {/* Payment Method Switcher Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Select Your Payment Method:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`py-3 px-3 rounded-xl text-xs font-bold border flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'bank'
                      ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300 ring-1 ring-emerald-400'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Bank Wire</span>
                  <span className="text-[10px] font-normal text-emerald-400 bg-emerald-500/20 px-1 rounded">Direct</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-3 px-3 rounded-xl text-xs font-bold border flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300 ring-1 ring-emerald-400'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Credit Card</span>
                  <span className="text-[10px] font-normal text-neutral-400">Instant</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`py-3 px-3 rounded-xl text-xs font-bold border flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'paypal'
                      ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300 ring-1 ring-emerald-400'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="font-bold">PayPal</span>
                  <span className="text-[10px] font-normal text-neutral-400">Global</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('gpay')}
                  className={`py-3 px-3 rounded-xl text-xs font-bold border flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    paymentMethod === 'gpay'
                      ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300 ring-1 ring-emerald-400'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="font-bold">GPay / Apple</span>
                  <span className="text-[10px] font-normal text-neutral-400">1-Click</span>
                </button>
              </div>
            </div>

            {/* BANK TRANSFER DETAILS ACCORDION/CARD */}
            {paymentMethod === 'bank' && (
              <div className="bg-neutral-950 border-2 border-emerald-500/40 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Direct Bank Transfer Details</h4>
                      <p className="text-[11px] text-neutral-400">Transfer funds directly to the official merchant account.</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Amount: ${totalPrice}.00 USD
                    </span>
                  </div>
                </div>

                {/* Account Details Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
                    <span className="text-neutral-400 text-[10px] uppercase font-bold block">Bank Name</span>
                    <div className="flex items-center justify-between text-white font-semibold">
                      <span>{bankDetails.bankName}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(bankDetails.bankName, 'bank')}
                        className="text-emerald-400 hover:text-emerald-300 cursor-pointer"
                        title="Copy Bank Name"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
                    <span className="text-neutral-400 text-[10px] uppercase font-bold block">Account Title</span>
                    <div className="flex items-center justify-between text-white font-semibold">
                      <span>{bankDetails.accountTitle}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(bankDetails.accountTitle, 'title')}
                        className="text-emerald-400 hover:text-emerald-300 cursor-pointer"
                        title="Copy Account Title"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
                    <span className="text-neutral-400 text-[10px] uppercase font-bold block">Account / IBAN Number</span>
                    <div className="flex items-center justify-between text-white font-mono font-bold text-xs truncate">
                      <span className="truncate mr-2">{bankDetails.iban || bankDetails.accountNumber}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(bankDetails.iban || bankDetails.accountNumber, 'iban')}
                        className="text-emerald-400 hover:text-emerald-300 cursor-pointer shrink-0"
                        title="Copy IBAN / Account Number"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
                    <span className="text-neutral-400 text-[10px] uppercase font-bold block">SWIFT / BIC Code</span>
                    <div className="flex items-center justify-between text-white font-mono font-semibold">
                      <span>{bankDetails.swiftCode}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(bankDetails.swiftCode, 'swift')}
                        className="text-emerald-400 hover:text-emerald-300 cursor-pointer"
                        title="Copy SWIFT"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {copiedKey && (
                  <div className="text-center text-xs font-bold text-emerald-400 animate-fade-in">
                    ✓ Copied {copiedKey.toUpperCase()} to clipboard!
                  </div>
                )}

                {/* Reference Code & Transfer Confirmation Input */}
                <div className="bg-emerald-950/30 border border-emerald-500/20 p-3.5 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-300 font-medium">Your Order Reference Code (Required in transfer remarks):</span>
                    <span className="font-mono font-bold text-emerald-300 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                      {orderReference}
                    </span>
                  </div>

                  <div className="pt-2">
                    <label className="text-neutral-300 block mb-1 text-xs">
                      Enter Transaction ID / Reference (or write "Transferred"):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TRX-8492018 or bank transfer slip ID"
                      value={bankTxRef}
                      onChange={(e) => setBankTxRef(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CARD OPTION */}
            {paymentMethod === 'card' && (
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 space-y-3">
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Card Details (Encrypted):</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-normal text-[11px]">
                    <Lock className="w-3 h-3" /> 256-Bit SSL
                  </span>
                </div>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-neutral-300 focus:outline-none focus:border-emerald-400"
                  placeholder="Card Number"
                />
              </div>
            )}

            {/* PAYPAL OR GPAY */}
            {(paymentMethod === 'paypal' || paymentMethod === 'gpay') && (
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 text-xs text-neutral-300 text-center space-y-2">
                <div>You will be securely redirected to {paymentMethod === 'paypal' ? 'PayPal' : 'Google/Apple Pay'} to complete your ${totalPrice} payment.</div>
              </div>
            )}

            {/* Summary */}
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-neutral-400">{currentTier.name} {includeBump && '+ Scope Protection'}:</span>
                <div className="text-white font-bold text-sm">${totalPrice}.00 USD</div>
              </div>
              <button
                type="button"
                onClick={() => setStep('details')}
                className="text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer"
              >
                Edit Order
              </button>
            </div>

            {/* Action Buttons: Return to Main Page, Return to Details, & Submit */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-3.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-950 text-neutral-400 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Exit to Main Page</span>
              </button>

              <button
                type="button"
                onClick={() => setStep('details')}
                className="w-full sm:w-auto px-4 py-3.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Details</span>
              </button>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full flex-1 py-3.5 px-6 rounded-xl font-extrabold text-neutral-950 bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 hover:from-emerald-300 hover:to-emerald-200 transition-all shadow-xl shadow-emerald-500/25 text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isProcessing ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-neutral-950" />
                    <span>
                      {paymentMethod === 'bank'
                        ? `I Have Transferred $${totalPrice} (Submit)`
                        : `Pay $${totalPrice} & Claim Instant Access`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Trust note */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Backed by our 30-Day Money-Back Guarantee. Reference: {orderReference}</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
