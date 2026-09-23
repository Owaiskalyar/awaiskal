import React, { useState } from 'react';
import { Calculator, DollarSign, TrendingUp, Sparkles, Check, ArrowRight } from 'lucide-react';

interface RoiCalculatorProps {
  onOpenCheckout: (tierId?: string) => void;
}

export const RoiCalculator: React.FC<RoiCalculatorProps> = ({ onOpenCheckout }) => {
  const [proposalsPerMonth, setProposalsPerMonth] = useState<number>(25);
  const [avgProjectValue, setAvgProjectValue] = useState<number>(2500);
  const [currentReplyRate, setCurrentReplyRate] = useState<number>(5);

  // System benchmark reply rate is 32%
  const systemReplyRate = 32;

  // Let's assume standard closing rate of replies is ~30%
  const closingRateOfReplies = 0.30;

  // Current calculations
  const currentInterviews = (proposalsPerMonth * (currentReplyRate / 100));
  const currentClients = Math.max(0.2, currentInterviews * closingRateOfReplies);
  const currentMonthlyRevenue = Math.round(currentClients * avgProjectValue);

  // System calculations (using Job Vetting Radar to send fewer, higher-conviction proposals or the same with 32% reply rate)
  const systemInterviews = (proposalsPerMonth * (systemReplyRate / 100));
  const systemClients = Math.max(1, systemInterviews * closingRateOfReplies);
  const systemMonthlyRevenue = Math.round(systemClients * avgProjectValue);

  const extraMonthlyIncome = Math.max(0, systemMonthlyRevenue - currentMonthlyRevenue);
  const extraAnnualIncome = extraMonthlyIncome * 12;

  // Connects saved by vetting (approx $2.10 per proposal avoided on bad clients)
  const connectsSavedMonthly = Math.round(proposalsPerMonth * 0.4 * 14); // 40% bad jobs skipped, 14 connects avg
  const connectsMoneySaved = Math.round(connectsSavedMonthly * 0.15); // $0.15 per connect

  const roiMultiplier = Math.round((extraMonthlyIncome / 47));

  return (
    <section id="calculator" className="py-16 sm:py-24 bg-neutral-900/60 border-t border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive ROI & Connects Calculator</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Calculate Your Return on Investment
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
            Adjust the sliders below to see how boosting your proposal reply rate from the industry average (4–6%) to our system benchmark (30%+) impacts your take-home revenue.
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="max-w-4xl mx-auto bg-neutral-950 rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Controls */}
            <div className="lg:col-span-6 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Your Current Freelancing Baseline</span>
              </h3>

              {/* Slider 1: Proposals */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-neutral-300 font-medium">Proposals sent per month:</span>
                  <span className="font-mono font-bold text-emerald-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    {proposalsPerMonth} proposals
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  step="5"
                  value={proposalsPerMonth}
                  onChange={(e) => setProposalsPerMonth(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer h-2 bg-neutral-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-neutral-500">
                  <span>5 (Selective)</span>
                  <span>40 (Active)</span>
                  <span>80 (High Volume)</span>
                </div>
              </div>

              {/* Slider 2: Project Value */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-neutral-300 font-medium">Average project or contract value:</span>
                  <span className="font-mono font-bold text-emerald-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    ${avgProjectValue.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="250"
                  value={avgProjectValue}
                  onChange={(e) => setAvgProjectValue(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer h-2 bg-neutral-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-neutral-500">
                  <span>$500 (Small gig)</span>
                  <span>$3,000 (Medium milestone)</span>
                  <span>$10,000+ (Retainer)</span>
                </div>
              </div>

              {/* Slider 3: Reply Rate */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-neutral-300 font-medium">Your current interview/reply rate:</span>
                  <span className="font-mono font-bold text-rose-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    {currentReplyRate}% (Amateur avg)
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="15"
                  step="1"
                  value={currentReplyRate}
                  onChange={(e) => setCurrentReplyRate(Number(e.target.value))}
                  className="w-full accent-rose-400 cursor-pointer h-2 bg-neutral-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-neutral-500">
                  <span>2% (Ignored)</span>
                  <span>6% (Average)</span>
                  <span>15% (Above average)</span>
                </div>
              </div>

              {/* Connects Savings Pill */}
              <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold">Connects Saved by Job Vetting:</div>
                  <div className="text-neutral-400 text-[11px]">Weed out ghost jobs & low-budget posts</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-bold font-mono">~{connectsSavedMonthly} connects</div>
                  <div className="text-[10px] text-emerald-300">($ {connectsMoneySaved}/mo saved)</div>
                </div>
              </div>
            </div>

            {/* Right Output Card */}
            <div className="lg:col-span-6 bg-gradient-to-br from-neutral-900 via-neutral-900 to-emerald-950/60 p-6 sm:p-7 rounded-2xl border border-emerald-500/30 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Projected Financial Impact
                  </span>
                  <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                    {systemReplyRate}% Benchmark
                  </span>
                </div>

                {/* Big Metric: Extra Monthly Income */}
                <div>
                  <div className="text-xs text-neutral-400 mb-1">Estimated Additional Monthly Revenue:</div>
                  <div className="text-3xl sm:text-4xl font-black text-white flex items-baseline gap-1 font-mono">
                    <span className="text-emerald-400">+${extraMonthlyIncome.toLocaleString()}</span>
                    <span className="text-xs text-neutral-400 font-normal">/ month</span>
                  </div>
                </div>

                {/* Annualized */}
                <div className="p-3 rounded-lg bg-neutral-950/80 border border-neutral-800 flex items-center justify-between text-xs">
                  <span className="text-neutral-300">Extra Annualized Freelance Income:</span>
                  <span className="text-emerald-300 font-bold font-mono text-sm">+${extraAnnualIncome.toLocaleString()}/yr</span>
                </div>

                {/* ROI on $47 */}
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                  <span className="text-emerald-200">ROI on this $47 investment:</span>
                  <span className="text-emerald-300 font-black font-mono text-base">{roiMultiplier}x Return</span>
                </div>
              </div>

              {/* Call to Action */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => onOpenCheckout('complete')}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/25 cursor-pointer text-sm"
                >
                  <span>Unlock The 32% Reply Rate System ($47)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-center text-neutral-400">
                  Backed by our 30-Day "Double Your Investment" 100% Money-Back Guarantee.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
