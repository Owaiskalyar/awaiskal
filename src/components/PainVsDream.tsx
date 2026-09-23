import React from 'react';
import { XCircle, CheckCircle2, AlertTriangle, Flame, ArrowRight, TrendingUp } from 'lucide-react';

interface PainVsDreamProps {
  onOpenCheckout: (tierId?: string) => void;
}

export const PainVsDream: React.FC<PainVsDreamProps> = ({ onOpenCheckout }) => {
  return (
    <section id="breakdown" className="py-16 sm:py-24 border-t border-neutral-800/80 bg-neutral-950 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>The Brutal Reality of Upwork in 2026</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why 95% of Freelancers Are Burning Out on the{' '}
            <span className="text-rose-400 underline decoration-rose-500/30 decoration-wavy">
              Upwork Treadmill
            </span>
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
            Connects are more expensive than ever. Every job posting gets flooded with 50+ robotic ChatGPT proposals within minutes. If you’re using the old playbook, you’re literally paying Upwork to ignore you.
          </p>
        </div>

        {/* Side-by-Side Comparison Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* The Broken Way (Amateur Trap) */}
          <div className="rounded-2xl bg-neutral-900/60 border border-rose-500/30 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400">The Amateur Trap</span>
                  <h3 className="text-xl font-bold text-white mt-1">The "Connects Burner" Way</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <Flame className="w-5 h-5" />
                </div>
              </div>

              <ul className="space-y-4 text-sm text-neutral-300">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Generic "Dear Hiring Manager" Proposals:</strong> Copy-pasting long lists of skills that clients instantly skim and archive without reading.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Wasting Expensive Connects on Ghost Jobs:</strong> Bidding 16 connects on listings where the client has a 12% hire rate and hasn't logged in for 3 days.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">The $20/hr Bidding War:</strong> Slashing your prices to compete with offshore low-ballers, attracting micromanager clients who leave 4-star reviews.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Resume-Style Profile Bio:</strong> Talking endlessly about yourself, your degrees, and years of experience instead of solving the client’s urgent business bottlenecks.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Feast or Famine Anxiety:</strong> Living in constant panic when a one-off gig ends, having to start from scratch bidding on job boards again.
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-800 text-xs text-rose-300/80 bg-rose-950/20 p-3 rounded-lg border border-rose-900/30">
              <strong>Typical Result:</strong> 40+ proposals sent, $65 in connects lost, 1 low-rate response, constant stress.
            </div>
          </div>

          {/* The Systematic Way (Client Acquisition System) */}
          <div className="rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border-2 border-emerald-500/40 p-6 sm:p-8 flex flex-col justify-between relative shadow-xl shadow-emerald-500/10">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">The Modern System</span>
                  <h3 className="text-xl font-bold text-white mt-1">The High-Ticket Acquisition System</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              <ul className="space-y-4 text-sm text-neutral-200">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">The 3-Sentence Hook:</strong> The first 180 characters diagnose the client’s exact pain point, creating an irresistible curiosity gap that gets opened every time.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">The 5-Point Job Vetting Radar:</strong> Filter out tire-kickers in 60 seconds. You only bid on verified clients with deep budgets, saving 70% of your connects.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">High-Ticket Price Anchoring:</strong> Reposition yourself as a strategic consultant commanding $75–$150/hr or $3k–$10k fixed-price milestones with eager clients.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Sales-Letter Profile Architecture:</strong> Your profile converts inbound search traffic into pre-qualified interview invites while you sleep.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Retainer Conversion Protocol:</strong> Transform simple one-off jobs into stable $2,500–$5,000/month recurring contracts that provide predictable income.
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-800 text-xs text-emerald-300 bg-emerald-950/40 p-3 rounded-lg border border-emerald-500/30 flex items-center justify-between">
              <div>
                <strong>Predictable Result:</strong> 35%+ reply rate, commanding top rates, building lasting retainers.
              </div>
            </div>
          </div>
        </div>

        {/* Mid-Section Callout */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-4 sm:p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-xl max-w-2xl mx-auto">
            <div className="text-left text-xs sm:text-sm text-neutral-300">
              <span className="font-bold text-white">Ready to exit the bidding wars forever?</span>{' '}
              Get the entire swipe file and step-by-step video system for just $47 today.
            </div>
            <button
              onClick={() => onOpenCheckout('complete')}
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <span>Get The System</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
