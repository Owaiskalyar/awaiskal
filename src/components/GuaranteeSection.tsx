import React from 'react';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface GuaranteeSectionProps {
  onOpenCheckout: (tierId?: string) => void;
}

export const GuaranteeSection: React.FC<GuaranteeSectionProps> = ({ onOpenCheckout }) => {
  return (
    <section className="py-16 sm:py-20 bg-neutral-950 border-t border-neutral-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 border-2 border-emerald-500/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle Guarantee Seal Visual */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 flex flex-col items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/10">
              <ShieldCheck className="w-10 h-10 mb-1" />
              <span className="text-[10px] font-black uppercase tracking-wider font-mono">100% RISK-FREE</span>
            </div>

            <div className="space-y-4 text-center sm:text-left">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  The Ironclad 30-Day Guarantee
                </span>
                <h3 className="text-xl sm:text-3xl font-extrabold text-white mt-1">
                  Win a High-Ticket Client or Pay Absolutely Nothing.
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                We don’t want your money unless this system produces real, tangible financial returns in your freelance bank account. 
                Take a full 30 days to implement the 1-Hour Profile Optimizer, copy our 3-Sentence Hook templates, and use the Job Vetting Radar.
              </p>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                If you don’t cut your proposal rejection rate, win back your investment multiple times over, or if you simply decide this isn’t for you—just email our support desk. 
                We will refund 100% of your purchase immediately. No awkward interrogation, no jumping through hoops.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-800">
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Guaranteed by Freelance Mastery Systems</span>
                </div>

                <button
                  onClick={() => onOpenCheckout('complete')}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  <span>Start Risk-Free Today ($47)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
