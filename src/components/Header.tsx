import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap, ArrowRight, Menu, X, Users } from 'lucide-react';

interface HeaderProps {
  onOpenCheckout: (tierId?: string) => void;
  onOpenCrm: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCheckout, onOpenCrm }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 3, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatNum = (n: number) => n.toString().padStart(2, '0');

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-neutral-950/85 border-b border-neutral-800/80">
      {/* Urgency Alert Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-neutral-900 to-emerald-950 border-b border-emerald-500/20 py-2 px-4 text-xs text-neutral-300">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-emerald-400 uppercase tracking-wider text-[11px]">Special 2026 Edition:</span>
            <span className="hidden sm:inline">Save 75% + Get 4 Bonus Swipe Files. Offer expires in:</span>
            <span className="sm:hidden">75% Off ends in:</span>
            <span className="inline-flex items-center gap-1 font-mono font-bold bg-neutral-900/90 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
              {formatNum(timeLeft.hours)}:{formatNum(timeLeft.minutes)}:{formatNum(timeLeft.seconds)}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-neutral-400 text-xs">
            <button
              onClick={onOpenCrm}
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 transition-colors cursor-pointer"
              title="Open Merchant CRM & Retargeting Lead Vault"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Merchant CRM & Leads</span>
            </button>
            <span className="text-neutral-600">•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 30-Day Guarantee
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
        {/* Brand */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-neutral-950 font-black text-lg">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                Upwork Client Acquisition
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-wide">
                v4.2
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 tracking-wide hidden sm:block">
              High-Ticket Freelancer Playbook & Swipe Files
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-300">
          <button onClick={() => scrollTo('breakdown')} className="hover:text-white transition-colors cursor-pointer">
            The System
          </button>
          <button onClick={() => scrollTo('proposal-audit')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">
            <span>Proposal Teardown</span>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-1 py-0.2 rounded font-semibold">Live</span>
          </button>
          <button onClick={() => scrollTo('curriculum')} className="hover:text-white transition-colors cursor-pointer">
            What's Inside
          </button>
          <button onClick={() => scrollTo('calculator')} className="hover:text-white transition-colors cursor-pointer">
            ROI Calculator
          </button>
          <button onClick={() => scrollTo('reviews')} className="hover:text-white transition-colors cursor-pointer">
            Proof (420+)
          </button>
          <button onClick={() => scrollTo('pricing')} className="hover:text-white transition-colors cursor-pointer">
            Pricing
          </button>
          <button 
            onClick={onOpenCrm} 
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-neutral-900 border border-emerald-500/30 px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>CRM & Leads</span>
          </button>
        </nav>

        {/* Header Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => onOpenCheckout('complete')}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-neutral-950 bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 hover:from-emerald-300 hover:to-emerald-200 transition-all duration-200 shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Get Instant Access</span>
            <span className="font-extrabold text-neutral-950/80 line-through text-xs">$197</span>
            <span className="bg-neutral-950/15 px-1.5 py-0.5 rounded text-neutral-950 font-black text-xs">$47</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-neutral-400 hover:text-white focus:outline-none"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-6 border-t border-neutral-800 bg-neutral-950/98 space-y-3">
          <div className="flex flex-col space-y-2 text-sm font-medium text-neutral-300">
            <button onClick={() => scrollTo('breakdown')} className="text-left py-2 px-2 hover:bg-neutral-900 rounded">
              The System
            </button>
            <button onClick={() => scrollTo('proposal-audit')} className="text-left py-2 px-2 hover:bg-neutral-900 rounded flex items-center justify-between">
              <span>Proposal Teardown</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">Breakdown</span>
            </button>
            <button onClick={() => scrollTo('curriculum')} className="text-left py-2 px-2 hover:bg-neutral-900 rounded">
              Modules & Bonuses
            </button>
            <button onClick={() => scrollTo('calculator')} className="text-left py-2 px-2 hover:bg-neutral-900 rounded">
              Connects & ROI Calculator
            </button>
            <button onClick={() => scrollTo('reviews')} className="text-left py-2 px-2 hover:bg-neutral-900 rounded">
              Verified Case Studies
            </button>
            <button onClick={() => scrollTo('pricing')} className="text-left py-2 px-2 hover:bg-neutral-900 rounded">
              Pricing & Packages
            </button>
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCrm();
              }} 
              className="text-left py-2 px-2 bg-emerald-500/10 text-emerald-400 rounded font-semibold flex items-center justify-between"
            >
              <span>Merchant CRM & Retargeting Leads</span>
              <span className="text-[10px] bg-emerald-400 text-neutral-950 font-bold px-1.5 py-0.5 rounded">Admin</span>
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCheckout('complete');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/25"
            >
              <Zap className="w-4 h-4 fill-neutral-950" />
              <span>Claim Instant Access — Only $47</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
