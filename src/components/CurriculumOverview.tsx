import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Video, 
  Layers, 
  Gift, 
  Sparkles, 
  Download, 
  Clock, 
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { CURRICULUM_MODULES, BONUSES } from '../data/productData';

interface CurriculumOverviewProps {
  onOpenCheckout: (tierId?: string) => void;
}

export const CurriculumOverview: React.FC<CurriculumOverviewProps> = ({ onOpenCheckout }) => {
  const [expandedModule, setExpandedModule] = useState<string | null>('m1');

  const toggleModule = (id: string) => {
    setExpandedModule(prev => (prev === id ? null : id));
  };

  return (
    <section id="curriculum" className="py-16 sm:py-24 bg-neutral-950 border-t border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>The Comprehensive Curriculum</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Everything Inside the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Client Acquisition System
            </span>
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
            Not fluff. Not generic theory. You get an exact step-by-step operating system with downloadable swipe files, video audits, and checklists.
          </p>
        </div>

        {/* Modules Accordion / List */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {CURRICULUM_MODULES.map((module) => {
            const isExpanded = expandedModule === module.id;
            return (
              <div
                key={module.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'bg-neutral-900 border-emerald-500/40 shadow-xl shadow-emerald-500/5'
                    : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {/* Header */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-emerald-400 font-mono font-black text-sm sm:text-base shrink-0">
                      {module.number}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                          Module {module.number}
                        </span>
                        <span className="text-neutral-500 text-xs">•</span>
                        <span className="text-xs text-neutral-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {module.duration}
                        </span>
                        <span className="text-neutral-500 text-xs">•</span>
                        <span className="text-xs text-neutral-400">
                          {module.lessonsCount} Core Lessons
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {module.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-neutral-950/80 border border-neutral-800 text-neutral-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-emerald-400" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-neutral-800/80 space-y-4">
                    <p className="text-sm text-neutral-300 leading-relaxed font-normal">
                      {module.summary}
                    </p>

                    {/* Key Takeaways */}
                    <div className="space-y-2 pt-2">
                      <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                        What you'll master in this module:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {module.takeaways.map((takeaway, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-300 bg-neutral-950/60 p-2.5 rounded-lg border border-neutral-800/60">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{takeaway}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tools Included in this module */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <span className="text-xs text-neutral-400 font-medium">Included assets:</span>
                      {module.toolsIncluded.map((tool, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-semibold"
                        >
                          <FileText className="w-3 h-3" />
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* High-Value Bonuses Showcase */}
        <div className="mt-16 sm:mt-24 max-w-4xl mx-auto">
          <div className="text-center space-y-2 mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Gift className="w-3.5 h-3.5" />
              <span>Included Free With Your Access Today</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              The $568 High-Ticket Bonus Vault
            </h3>
            <p className="text-sm text-neutral-400">
              When you enroll today, you unlock these 4 plug-and-play tactical resources at zero extra cost.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BONUSES.map((bonus) => (
              <div
                key={bonus.id}
                className="rounded-2xl bg-neutral-900 border border-neutral-800 p-5 sm:p-6 space-y-3 relative group hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                    {bonus.badge}
                  </span>
                  <div className="text-xs font-mono">
                    <span className="text-neutral-500 line-through">${bonus.value} Value</span>
                    <span className="text-emerald-400 font-bold ml-1.5">FREE</span>
                  </div>
                </div>

                <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {bonus.title}
                </h4>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {bonus.description}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-800">
                  <span className="font-mono text-[11px] text-neutral-500">{bonus.format}</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" /> Instant Access
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Module CTA */}
          <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-emerald-950 border border-emerald-500/30 text-center space-y-4 shadow-xl">
            <h4 className="text-lg sm:text-xl font-bold text-white">
              Get All 5 Modules + All 4 Bonuses for Just $47
            </h4>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto">
              One single $1,500 contract won will yield a 30x return on this investment in your very first week.
            </p>
            <div>
              <button
                onClick={() => onOpenCheckout('complete')}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-extrabold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-500/25 cursor-pointer text-sm sm:text-base"
              >
                <Zap className="w-4 h-4 fill-neutral-950" />
                <span>Claim All Modules & Bonuses ($47)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
