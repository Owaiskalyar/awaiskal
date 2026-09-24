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
  ArrowRight,
  Check,
  Flag,
  TrendingUp,
  Compass,
  Award
} from 'lucide-react';
import { CURRICULUM_MODULES, BONUSES } from '../data/productData';

interface CurriculumOverviewProps {
  onOpenCheckout: (tierId?: string) => void;
}

export const CurriculumOverview: React.FC<CurriculumOverviewProps> = ({ onOpenCheckout }) => {
  const [expandedModule, setExpandedModule] = useState<string | null>('m1');
  const [completedModules, setCompletedModules] = useState<string[]>(['m1']);

  const toggleModule = (id: string) => {
    setExpandedModule(prev => (prev === id ? null : id));
  };

  const handleSelectModuleFromJourney = (id: string) => {
    setExpandedModule(id);
    if (!completedModules.includes(id)) {
      setCompletedModules(prev => [...prev, id]);
    }
    const el = document.getElementById(`module-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const toggleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  // Calculate current journey progress based on active module and completed count
  const currentIndex = CURRICULUM_MODULES.findIndex(m => m.id === (expandedModule || 'm1'));
  const currentStep = currentIndex >= 0 ? currentIndex + 1 : 1;
  const progressPercent = Math.round((currentStep / CURRICULUM_MODULES.length) * 100);
  const completedPercent = Math.round((completedModules.length / CURRICULUM_MODULES.length) * 100);
  const activeModule = CURRICULUM_MODULES[currentIndex] || CURRICULUM_MODULES[0];

  const milestonePhases = [
    { id: 'm1', phase: 'Phase 1', label: 'Profile Architecture', role: 'Foundation', outcome: 'Turn profile into high-converting inbound magnet' },
    { id: 'm2', phase: 'Phase 2', label: 'Hook Proposal Engine', role: 'Outreach', outcome: '40%+ reply rate beating 50+ AI competitors' },
    { id: 'm3', phase: 'Phase 3', label: 'Job Vetting Radar', role: 'Strategy', outcome: 'Zero wasted connects on 0% hire rate jobs' },
    { id: 'm4', phase: 'Phase 4', label: 'Price Anchoring', role: 'Closing', outcome: 'Close $3k–$10k contracts without discounts' },
    { id: 'm5', phase: 'Phase 5', label: '5-Star Flywheel', role: 'Scale', outcome: 'Turn single gigs into recurring monthly retainers' }
  ];

  return (
    <section id="curriculum" className="py-16 sm:py-24 bg-neutral-950 border-t border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
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

        {/* Framework Journey Progress Bar Indicator */}
        <div className="max-w-4xl mx-auto mb-10 p-5 sm:p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-2xl relative overflow-hidden backdrop-blur-sm">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          {/* Top Progress Bar Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Framework Journey Roadmap</span>
                </span>
                <span className="text-[10px] font-mono bg-neutral-800 text-neutral-300 border border-neutral-700 px-2 py-0.5 rounded-full">
                  Stage {currentStep} of {CURRICULUM_MODULES.length}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Phase {activeModule.number}: {activeModule.title}</span>
              </h3>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
              <div className="text-right">
                <div className="text-xs font-bold text-white">
                  {progressPercent}% Complete
                </div>
                <div className="text-[10px] text-neutral-400">
                  {completedModules.length} of {CURRICULUM_MODULES.length} Phases Mastered
                </div>
              </div>

              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                {progressPercent === 100 ? (
                  <Award className="w-5 h-5 text-emerald-300" />
                ) : (
                  <span>{progressPercent}%</span>
                )}
              </div>
            </div>
          </div>

          {/* Visual Progress Bar Track */}
          <div className="relative mb-6">
            <div className="w-full bg-neutral-950/80 rounded-full h-3 border border-neutral-800 overflow-hidden p-0.5">
              <div 
                className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/50"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Connecting Milestone Indicators */}
            <div className="grid grid-cols-5 gap-1 sm:gap-2 mt-3 text-center">
              {milestonePhases.map((phase, idx) => {
                const isCurrent = expandedModule === phase.id;
                const isPassed = (idx + 1) <= currentStep;
                const isCompleted = completedModules.includes(phase.id);

                return (
                  <button
                    key={phase.id}
                    type="button"
                    onClick={() => handleSelectModuleFromJourney(phase.id)}
                    className="flex flex-col items-center group cursor-pointer text-left focus:outline-none transition-transform hover:-translate-y-0.5"
                    title={`Jump to ${phase.label}`}
                  >
                    <div 
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs font-mono font-bold transition-all ${
                        isCurrent 
                          ? 'bg-emerald-400 text-neutral-950 ring-4 ring-emerald-500/30 shadow-lg shadow-emerald-500/30' 
                          : isCompleted 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                            : isPassed 
                              ? 'bg-neutral-800 text-neutral-200 border border-neutral-700' 
                              : 'bg-neutral-950 text-neutral-500 border border-neutral-800'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <span>0{idx + 1}</span>
                      )}
                    </div>

                    <span className={`text-[10px] sm:text-xs font-bold mt-1.5 truncate max-w-full text-center transition-colors ${
                      isCurrent 
                        ? 'text-emerald-400' 
                        : isCompleted 
                          ? 'text-neutral-300' 
                          : 'text-neutral-500 group-hover:text-neutral-300'
                    }`}>
                      {phase.role}
                    </span>

                    <span className="hidden sm:inline text-[9px] text-neutral-500 font-mono mt-0.5">
                      {phase.phase}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Stage Transformation Callout */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-950 border border-neutral-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start sm:items-center gap-2.5">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold shrink-0 text-[10px] uppercase tracking-wider">
                Transformation
              </span>
              <span className="text-neutral-300">
                {milestonePhases[currentIndex]?.outcome}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto text-[11px] text-neutral-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" />
                {activeModule.duration}
              </span>
              <span>•</span>
              <span className="text-neutral-300 font-semibold">
                {activeModule.lessonsCount} Lessons
              </span>
            </div>
          </div>
        </div>

        {/* Modules Accordion / List */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {CURRICULUM_MODULES.map((module, idx) => {
            const isExpanded = expandedModule === module.id;
            const isCompleted = completedModules.includes(module.id);

            return (
              <div
                key={module.id}
                id={`module-${module.id}`}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'bg-neutral-900 border-emerald-500/40 shadow-xl shadow-emerald-500/5 ring-1 ring-emerald-500/20'
                    : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {/* Header */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleModule(module.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleModule(module.id);
                    }
                  }}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none select-none"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl border flex items-center justify-center font-mono font-black text-sm sm:text-base shrink-0 transition-colors ${
                      isExpanded 
                        ? 'bg-emerald-400 text-neutral-950 border-emerald-300 shadow-md shadow-emerald-500/20' 
                        : isCompleted
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-neutral-950 border-neutral-800 text-emerald-400'
                    }`}>
                      {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : module.number}
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
                        {isCompleted && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold">
                            Completed
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {module.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => toggleComplete(module.id, e)}
                      className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-neutral-950/60 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
                      }`}
                      title={isCompleted ? 'Mark as incomplete' : 'Mark as mastered'}
                    >
                      <Check className="w-3 h-3" />
                      <span>{isCompleted ? 'Mastered' : 'Mark Done'}</span>
                    </button>

                    <div className="p-2 rounded-lg bg-neutral-950/80 border border-neutral-800 text-neutral-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-emerald-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
                    </div>
                  </div>
                </div>

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
