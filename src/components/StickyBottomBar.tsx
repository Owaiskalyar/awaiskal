import React, { useState, useEffect } from 'react';
import { Zap, ArrowRight, ShieldCheck } from 'lucide-react';

interface StickyBottomBarProps {
  onOpenCheckout: (tierId?: string) => void;
}

export const StickyBottomBar: React.FC<StickyBottomBarProps> = ({ onOpenCheckout }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <aside aria-label="Quick order bar" className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 border-t border-emerald-500/30 backdrop-blur-lg px-4 py-2.5 sm:py-3 shadow-2xl transition-all duration-300">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Left Info */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 items-center justify-center font-bold text-sm shrink-0">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                Client Acquisition System on Upwork
              </span>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded uppercase">
                75% OFF
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-neutral-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> 30-Day Money-Back Guarantee
              </span>
              <span>•</span>
              <span>15 Templates + Video Audits</span>
            </div>
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-neutral-400 uppercase font-semibold hidden xs:block">Total Today</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-xl font-black text-white font-mono">$47</span>
              <span className="text-xs text-neutral-500 line-through font-mono hidden sm:inline">$197</span>
            </div>
          </div>

          <button
            onClick={() => onOpenCheckout('complete')}
            className="group inline-flex items-center gap-1.5 px-4 sm:px-6 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm text-neutral-950 bg-gradient-to-r from-emerald-400 to-emerald-300 hover:from-emerald-300 hover:to-emerald-200 transition-all shadow-md shadow-emerald-500/20 cursor-pointer shrink-0"
          >
            <span>Claim System</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </aside>
  );
};
