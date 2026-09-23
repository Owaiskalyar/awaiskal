import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  FileText, 
  Zap, 
  Star, 
  Lock, 
  Users,
  Eye,
  Award,
  Clock
} from 'lucide-react';

interface HeroProps {
  onOpenCheckout: (tierId?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenCheckout }) => {
  const [activeTab, setActiveTab] = useState<'playbook' | 'proposal' | 'profile' | 'vetting'>('proposal');
  const [recentNotification, setRecentNotification] = useState<{ name: string; location: string; time: string; tier: string } | null>(null);

  useEffect(() => {
    const buyers = [
      { name: 'Liam K.', location: 'Toronto, Canada', time: '3 mins ago', tier: 'The Complete System' },
      { name: 'Sofia M.', location: 'Milan, Italy', time: '7 mins ago', tier: 'The Complete System' },
      { name: 'Rohan P.', location: 'Bangalore, India', time: '11 mins ago', tier: 'Starter Toolkit' },
      { name: 'Jessica T.', location: 'Austin, TX', time: '15 mins ago', tier: 'VIP 1:1 Audit Edition' },
      { name: 'Klaus B.', location: 'Berlin, Germany', time: '2 mins ago', tier: 'The Complete System' },
    ];
    let index = 0;
    setRecentNotification(buyers[0]);

    const interval = setInterval(() => {
      index = (index + 1) % buyers.length;
      setRecentNotification(buyers[index]);
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-8 pb-16 sm:pt-14 sm:pb-24 overflow-hidden">
      {/* Background Ambience Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-600/5 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Eyebrow / Tag */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>UPDATED FOR 2026: UPWORK CONNECTS ECONOMY & AI SEARCH</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/60 border border-neutral-800 text-neutral-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>428+ Verified Reviews</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
            Stop Burning Connects on Ghost Proposals.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
              Land $3,000–$10,000+ Upwork Clients
            </span>{' '}
            on Demand.
          </h1>

          <p className="text-base sm:text-xl text-neutral-300 leading-relaxed max-w-3xl mx-auto font-normal pt-2">
            The battle-tested conversion system that turns average freelancer profiles into client magnets, 
            slashes proposal rejections by <strong className="text-white font-semibold">80%</strong>, and commands 
            top-of-market hourly and fixed-price contracts—<span className="text-emerald-400 font-semibold">even if you have zero reviews</span> or 
            compete in saturated niches.
          </p>
        </div>

        {/* Primary CTA & Social Proof Block */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => onOpenCheckout('complete')}
              className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base sm:text-lg font-extrabold text-neutral-950 bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 hover:from-emerald-300 hover:to-emerald-200 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-neutral-950" />
              <span>Get Instant Access Today</span>
              <span className="text-sm font-bold text-neutral-900/75 line-through ml-1">$197</span>
              <span className="bg-neutral-950/20 px-2 py-0.5 rounded text-neutral-950 font-black text-sm">$47</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => scrollTo('proposal-audit')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm sm:text-base font-semibold text-neutral-200 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 hover:border-neutral-600 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Inspect Before vs After Proposal</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-5 text-xs text-neutral-400 pt-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <strong className="text-neutral-200">100% Risk-Free</strong> 30-Day Money-Back Guarantee
            </span>
            <span className="hidden sm:inline text-neutral-700">•</span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-neutral-400" />
              Instant Digital Download (Notion + PDF + Videos)
            </span>
            <span className="hidden sm:inline text-neutral-700">•</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Lifetime Free Updates Included
            </span>
          </div>

          {/* Social Proof Avatars */}
          <div className="flex items-center gap-3 mt-3 bg-neutral-900/50 px-4 py-2 rounded-full border border-neutral-800/80">
            <div className="flex -space-x-2">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" 
                alt="Freelancer student" 
                className="w-8 h-8 rounded-full border-2 border-neutral-950 object-cover" 
              />
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" 
                alt="Freelancer student" 
                className="w-8 h-8 rounded-full border-2 border-neutral-950 object-cover" 
              />
              <img 
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=80&q=80" 
                alt="Freelancer student" 
                className="w-8 h-8 rounded-full border-2 border-neutral-950 object-cover" 
              />
              <img 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" 
                alt="Freelancer student" 
                className="w-8 h-8 rounded-full border-2 border-neutral-950 object-cover" 
              />
            </div>
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs text-neutral-300 font-medium">
              <strong className="text-white">4.94 / 5</strong> rating by 1,420+ freelancers
            </span>
          </div>
        </div>

        {/* Hero Interactive Showcase / Product Mockup */}
        <div className="mt-12 sm:mt-16">
          <div className="relative rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-2xl overflow-hidden backdrop-blur-xl">
            {/* Window Top Bar */}
            <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-neutral-950/80 border-b border-neutral-800 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-neutral-400 hidden sm:inline">
                  ClientAcquisitionSystem_v4.2/Interactive_Vault
                </span>
              </div>

              {/* Mockup Interactive Selector Tabs */}
              <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800 text-xs font-medium">
                <button
                  onClick={() => setActiveTab('proposal')}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                    activeTab === 'proposal'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  ⚡ Proposal Engine
                </button>
                <button
                  onClick={() => setActiveTab('playbook')}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                    activeTab === 'playbook'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  📖 5-Part Playbook
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  👤 Profile Optimizer
                </button>
                <button
                  onClick={() => setActiveTab('vetting')}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                    activeTab === 'vetting'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  🎯 Vetting Radar
                </button>
              </div>

              <div className="hidden md:flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                <Award className="w-3.5 h-3.5" /> High-Ticket Verified
              </div>
            </div>

            {/* Mockup Tab Content */}
            <div className="p-4 sm:p-6 lg:p-8">
              {activeTab === 'proposal' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span>THE 3-SENTENCE HOOK FORMULA</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      The Exact 180 Characters That Stop Clients From Skipping You
                    </h3>
                    <p className="text-sm text-neutral-300 leading-relaxed">
                      On the Upwork client dashboard, only the first <strong className="text-white">two lines</strong> are visible before clicking 'Read more'. If your opening line starts with <em>"Hi, I saw your post and I am a professional..."</em>, 98% of clients instantly click Archive.
                    </p>

                    <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3 font-mono text-xs">
                      <div className="flex items-center justify-between text-neutral-400 pb-2 border-b border-neutral-900">
                        <span className="text-emerald-400 font-bold">CLIENT PREVIEW WINDOW (First 180 chars)</span>
                        <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">42% Reply Rate</span>
                      </div>
                      <div className="text-neutral-200 leading-relaxed">
                        <span className="bg-emerald-500/20 text-emerald-200 px-1 py-0.5 rounded font-bold">
                          "I just reviewed your Stripe webhook architecture and spotted the exact race condition causing the duplicate charges you mentioned in line 3."
                        </span>
                        <span className="text-neutral-400 block mt-2 text-[11px]">
                          [Client mentally stops: 'Wait, this person actually diagnosed my problem. I must read the rest.']
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      <div className="flex items-center gap-2 text-xs text-neutral-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>15 Industry-Specific Templates</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Anti-AI Human Psychology</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Low-Friction Closing Ask</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-neutral-950 p-5 rounded-xl border border-neutral-800/90 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Client Response Simulation</span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                        <Clock className="w-3 h-3" /> Responded in 9m
                      </span>
                    </div>

                    <div className="p-3.5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                          JD
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">John Davis (Hiring Manager)</div>
                          <div className="text-[10px] text-neutral-400">Total Spend: $140k+ • 5.0 (34 reviews)</div>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-200 italic">
                        "Finally someone who actually read the description. Yes, that race condition is driving our users crazy. Are you free for a 10-minute call today to discuss the fix and milestone budget?"
                      </p>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg flex items-center justify-between text-xs">
                      <div>
                        <div className="text-emerald-400 font-bold">Contract Won</div>
                        <div className="text-white font-black text-sm">$4,800 Fixed-Price Escrow</div>
                      </div>
                      <div className="text-right">
                        <div className="text-neutral-400 text-[10px]">Connects Spent</div>
                        <div className="text-emerald-300 font-bold">Only 12 connects</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'playbook' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      01-02
                    </div>
                    <h4 className="font-bold text-white text-sm">Profile & Proposal Architecture</h4>
                    <p className="text-xs text-neutral-400">
                      Complete blueprint to restructure your title, portfolio, and opening hook to rank #1 in Upwork client searches.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      03-04
                    </div>
                    <h4 className="font-bold text-white text-sm">Vetting & Price Anchoring</h4>
                    <p className="text-xs text-neutral-400">
                      Spot high-budget clients, filter tire-kickers, and command $3k-$10k milestones using value-based pricing scripts.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      05+
                    </div>
                    <h4 className="font-bold text-white text-sm">5-Star Reviews & Inbound Engine</h4>
                    <p className="text-xs text-neutral-400">
                      The automated review loop that keeps your JSS at 100% and triggers organic inbound client invitations while you sleep.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800 space-y-4">
                  <h4 className="text-base font-bold text-white">The 1-Hour Profile Optimizer Scorecard</h4>
                  <p className="text-xs text-neutral-300">
                    Most freelancer profiles are written like boring CVs. We show you how to rewrite your bio as an authoritative sales page with 4 specific psychological blocks.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded bg-neutral-900 border border-neutral-800 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">The Client-First Headline:</strong> Replace "Full Stack Web Developer" with "I Help B2B SaaS Founders Cut Churn via Next.js Web Apps".
                      </div>
                    </div>
                    <div className="p-3 rounded bg-neutral-900 border border-neutral-800 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Proof Stacking Block:</strong> Frame external portfolio items to establish authority without needing 10 Upwork reviews.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'vetting' && (
                <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800 space-y-3">
                  <h4 className="text-base font-bold text-white">The Job Vetting Radar: Stop Wasting $1.50/Bid</h4>
                  <p className="text-xs text-neutral-300">
                    With connects now costing up to 16 connects ($2.40) per proposal, you cannot afford to bid on clients who never hire or only pay $5/hr.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded bg-neutral-900 border border-neutral-800">
                      <div className="text-rose-400 font-bold mb-1">❌ Skip Immediately</div>
                      <div className="text-neutral-300">Hire rate &lt; 35%, 0 reviews on 12 jobs posted, vague 1-sentence prompt.</div>
                    </div>
                    <div className="p-3 rounded bg-neutral-900 border border-neutral-800">
                      <div className="text-amber-400 font-bold mb-1">⚠️ Proceed With Caution</div>
                      <div className="text-neutral-300">Unverified payment method, but detailed technical brief and verified email.</div>
                    </div>
                    <div className="p-3 rounded bg-neutral-900 border border-neutral-800">
                      <div className="text-emerald-400 font-bold mb-1">✅ Golden Opportunity</div>
                      <div className="text-neutral-300">$50k+ spend, average hourly paid &gt; $65/hr, detailed scope, posted &lt; 25m ago.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Proof Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-neutral-800 bg-neutral-950/60 border-t border-neutral-800 py-3 text-center">
              <div className="p-2 sm:p-3">
                <div className="text-lg sm:text-2xl font-black text-emerald-400">38.4%</div>
                <div className="text-[11px] text-neutral-400 font-medium">Average Reply Rate</div>
              </div>
              <div className="p-2 sm:p-3">
                <div className="text-lg sm:text-2xl font-black text-white">$4.2M+</div>
                <div className="text-[11px] text-neutral-400 font-medium">Student Contract Value</div>
              </div>
              <div className="p-2 sm:p-3">
                <div className="text-lg sm:text-2xl font-black text-emerald-400">1,420+</div>
                <div className="text-[11px] text-neutral-400 font-medium">Freelancers Scaled</div>
              </div>
              <div className="p-2 sm:p-3">
                <div className="text-lg sm:text-2xl font-black text-white">4.94 / 5</div>
                <div className="text-[11px] text-neutral-400 font-medium">Verified Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Social Proof Notification Floating Toast */}
        {recentNotification && (
          <div className="fixed bottom-20 left-4 z-30 hidden md:flex items-center gap-3 bg-neutral-900/95 border border-emerald-500/30 p-3 rounded-xl shadow-2xl backdrop-blur-md max-w-sm animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
              ⚡
            </div>
            <div className="text-xs">
              <div className="text-white font-semibold flex items-center gap-1.5">
                <span>{recentNotification.name}</span>
                <span className="text-[10px] text-neutral-400">({recentNotification.location})</span>
              </div>
              <div className="text-neutral-400 text-[11px]">
                Enrolled in <span className="text-emerald-300 font-medium">{recentNotification.tier}</span> • {recentNotification.time}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
