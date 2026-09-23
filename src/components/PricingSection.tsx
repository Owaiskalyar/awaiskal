import React from 'react';
import { Check, Zap, Sparkles, ShieldCheck, ArrowRight, Lock, Clock } from 'lucide-react';
import { PRICING_TIERS } from '../data/productData';

interface PricingSectionProps {
  onOpenCheckout: (tierId?: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenCheckout }) => {
  return (
    <section id="pricing" className="py-16 sm:py-24 bg-neutral-900/60 border-t border-neutral-800 relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Instant Digital Access • Zero Risk</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Choose Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
              Upwork Growth System
            </span>
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
            One single closed client pays for this 20x to 100x over. All packages include lifetime digital updates for the 2026 Upwork economy.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {PRICING_TIERS.map((tier) => {
            const isPopular = tier.popular;
            return (
              <div
                key={tier.id}
                className={`rounded-2xl flex flex-col justify-between transition-all duration-200 relative ${
                  isPopular
                    ? 'bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 border-2 border-emerald-400 shadow-2xl shadow-emerald-500/20 lg:-translate-y-3 p-6 sm:p-8'
                    : 'bg-neutral-950/90 border border-neutral-800 hover:border-neutral-700 p-6 sm:p-7'
                }`}
              >
                {/* Popular Pill */}
                {tier.badge && (
                  <div className="mb-4">
                    <span
                      className={`inline-block text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                        isPopular
                          ? 'bg-emerald-400 text-neutral-950 shadow-md shadow-emerald-500/30'
                          : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                      }`}
                    >
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">{tier.name}</h3>
                    <p className="text-xs text-neutral-400 mt-1">{tier.tagline}</p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 pt-2 border-b border-neutral-800 pb-4">
                    <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                      ${tier.price}
                    </span>
                    <span className="text-sm text-neutral-500 line-through font-mono">
                      ${tier.originalPrice}
                    </span>
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      75% OFF
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                      Included with this package:
                    </div>
                    <ul className="space-y-2.5 text-xs text-neutral-300">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-emerald-400' : 'text-neutral-400'}`} />
                          <span className={feature.includes('PLUS') ? 'font-bold text-emerald-300' : ''}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action & Guarantee */}
                <div className="mt-8 pt-4 border-t border-neutral-800/80 space-y-3">
                  <button
                    onClick={() => onOpenCheckout(tier.id)}
                    className={`w-full py-3.5 px-5 rounded-xl font-bold transition-all duration-200 cursor-pointer text-sm flex items-center justify-center gap-2 ${
                      isPopular
                        ? 'bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 hover:from-emerald-300 hover:to-emerald-200 text-neutral-950 shadow-lg shadow-emerald-500/30 font-extrabold hover:shadow-emerald-500/50'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
                    }`}
                  >
                    <span>{tier.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 text-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{tier.guaranteeText}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security badges below pricing */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400 text-center">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>256-Bit Encrypted SSL Checkout</span>
          </div>
          <span className="hidden sm:inline text-neutral-700">•</span>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Instant Digital Access to Notion & Downloads</span>
          </div>
          <span className="hidden sm:inline text-neutral-700">•</span>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Unconditional 30-Day Money-Back Guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
};
