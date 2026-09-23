import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Lock, 
  Zap, 
  Sparkles, 
  CreditCard, 
  Download, 
  ExternalLink, 
  ArrowRight,
  CheckCircle2,
  FileText,
  Copy
} from 'lucide-react';
import { PRICING_TIERS } from '../data/productData';

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
  const [tierId, setTierId] = useState<string>(selectedTierId || 'complete');
  const [includeBump, setIncludeBump] = useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [niche, setNiche] = useState<string>('Web & Mobile Dev');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'gpay'>('card');
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  useEffect(() => {
    if (selectedTierId) {
      setTierId(selectedTierId);
    }
  }, [selectedTierId]);

  if (!isOpen) return null;

  const currentTier = PRICING_TIERS.find(t => t.id === tierId) || PRICING_TIERS[1];
  const bumpPrice = 17;
  const totalPrice = currentTier.price + (includeBump ? bumpPrice : 0);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1200);
  };

  const copyLicense = () => {
    navigator.clipboard.writeText('UPW-SYSTEM-2026-VIP-4829X');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Top Header */}
        <div className="bg-neutral-950 px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              ⚡
            </div>
            <div>
              <span className="text-sm font-bold text-white">Instant Checkout</span>
              <span className="text-xs text-neutral-400 block sm:inline sm:ml-2">
                • 256-Bit SSL Encrypted
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          /* SUCCESS SCREEN */
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">Welcome to the System!</h3>
              <p className="text-sm text-neutral-300 max-w-md mx-auto">
                Your order is confirmed and receipt sent to <strong className="text-emerald-400">{email || 'your email'}</strong>. Your digital download vault is ready below.
              </p>
            </div>

            {/* Generated License Token */}
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-left space-y-2 max-w-md mx-auto">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Your Master License Key:</span>
                <span className="text-emerald-400 font-bold">LIFETIME ACCESS</span>
              </div>
              <div className="flex items-center justify-between bg-neutral-900 p-2.5 rounded-lg border border-neutral-800 font-mono text-xs text-white">
                <span>UPW-SYSTEM-2026-VIP-4829X</span>
                <button
                  onClick={copyLicense}
                  className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedKey ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Instant Download Links */}
            <div className="space-y-3 max-w-md mx-auto text-left">
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Instant Access Downloads:
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    📁
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">The Client Acquisition Notion Workspace</div>
                    <div className="text-[10px] text-neutral-400">Templates, Scripts, Playbook, Checklist</div>
                  </div>
                </div>
                <a
                  href="#notion"
                  onClick={(e) => { e.preventDefault(); alert("Simulated: Notion Workspace duplicate template opened! (Included in live product package)"); }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-400 text-neutral-950 text-xs font-bold hover:bg-emerald-300 transition-colors flex items-center gap-1"
                >
                  <span>Duplicate</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-800 text-neutral-300 flex items-center justify-center font-bold text-xs">
                    📄
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">15 Copy-Paste Proposal Swipe Files (PDF)</div>
                    <div className="text-[10px] text-neutral-400">All niches • High-ticket closing formats</div>
                  </div>
                </div>
                <button
                  onClick={() => alert("Simulated: Downloading 15-winning-proposals-swipe-vault.pdf (14.2 MB)")}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 text-white text-xs font-semibold hover:bg-neutral-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>

              {includeBump && (
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
                      🛡️
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Contract Protection & Dispute Kit</div>
                      <div className="text-[10px] text-neutral-400">Order Bump bonus package</div>
                    </div>
                  </div>
                  <button
                    onClick={() => alert("Simulated: Downloading contract-protection-kit.pdf")}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 text-white text-xs font-semibold hover:bg-neutral-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full max-w-md py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-sm transition-colors cursor-pointer"
              >
                Done • Back to Landing Page
              </button>
            </div>
          </div>
        ) : (
          /* CHECKOUT FORM */
          <form onSubmit={handlePay} className="p-6 sm:p-8 space-y-6">
            {/* Step 1: Tier Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Select Your Package:
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

            {/* Step 2: Customer Details */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-1">
                    Your Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-1">
                    Your Email (For Instant Delivery):
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-1">
                  Your Primary Freelancing Niche:
                </label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-neutral-300 focus:outline-none"
                >
                  <option value="Web & Mobile Dev">Web & Mobile Development (React, Fullstack, Mobile)</option>
                  <option value="UI/UX & Product Design">UI/UX & Graphic Design (Figma, Branding)</option>
                  <option value="Copywriting & Marketing">Copywriting & Content Strategy</option>
                  <option value="Video & Motion">Video Editing & Motion Graphics</option>
                  <option value="AI & Automation">AI Automation & Python Specialist</option>
                  <option value="Virtual Assistance">Executive Virtual Assistance & Project Management</option>
                </select>
              </div>
            </div>

            {/* ORDER BUMP (Crucial for Digital Product Average Order Value) */}
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
                      ⚡ EXCLUSIVE 1-TIME OFFER: SAVE 78%
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white">
                    Add The Upwork Contract Dispute & Scope Creep Protection Kit for only ${bumpPrice}
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Protect your JSS and avoid free revisions. Includes the exact client milestone contract addendum, dispute response scripts, and refund mitigation protocols. (Regularly $77).
                  </p>
                </div>
              </label>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="font-bold uppercase tracking-wider text-neutral-300">Payment Simulation</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <Lock className="w-3 h-3" /> Secure SSL
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-neutral-800 border-emerald-400 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'paypal'
                      ? 'bg-neutral-800 border-emerald-400 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                  }`}
                >
                  <span>PayPal</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('gpay')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'gpay'
                      ? 'bg-neutral-800 border-emerald-400 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                  }`}
                >
                  <span>GPay / Apple</span>
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="pt-1">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-neutral-300 focus:outline-none focus:border-emerald-400"
                    placeholder="Card Number"
                  />
                </div>
              )}
            </div>

            {/* Total Summary */}
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>{currentTier.name}:</span>
                <span className="font-mono text-white">${currentTier.price}.00</span>
              </div>
              {includeBump && (
                <div className="flex justify-between text-neutral-400">
                  <span>Scope Creep Protection Kit:</span>
                  <span className="font-mono text-amber-400">${bumpPrice}.00</span>
                </div>
              )}
              <div className="border-t border-neutral-800 pt-2 flex justify-between text-sm font-bold text-white">
                <span>Total Due Today:</span>
                <span className="text-emerald-400 font-mono text-base">${totalPrice}.00</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-xl font-extrabold text-neutral-950 bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 hover:from-emerald-300 hover:to-emerald-200 transition-all shadow-xl shadow-emerald-500/25 text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isProcessing ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                  <span>Securing Order & Generating Downloads...</span>
                </span>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-neutral-950" />
                  <span>Complete Purchase & Get Instant Access (${totalPrice})</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Footer Trust Note */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Covered by our 30-Day 100% Money-Back Guarantee. No risk.</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
