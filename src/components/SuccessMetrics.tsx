import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { 
  TrendingUp, 
  BarChart3, 
  DollarSign, 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Target, 
  Award,
  Layers
} from 'lucide-react';

interface SuccessMetricsProps {
  onOpenCheckout: (tierId?: string) => void;
}

interface HorizonDataPoint {
  horizon: string;
  shortLabel: string;
  baseline: number;
  framework: number;
  description: string;
  multiplier: string;
}

type ExperienceTier = 'starter' | 'growth' | 'pro';

export const SuccessMetrics: React.FC<SuccessMetricsProps> = ({ onOpenCheckout }) => {
  const [selectedTier, setSelectedTier] = useState<ExperienceTier>('growth');
  const [activeMetricTab, setActiveMetricTab] = useState<'cumulative' | 'monthly'>('cumulative');
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);
  
  const chartRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Experience level baseline models
  const tierConfig: Record<ExperienceTier, {
    title: string;
    baselineMonthly: number;
    frameworkMonthly: number;
    avgProjectBefore: number;
    avgProjectAfter: number;
    replyRateBefore: number;
    replyRateAfter: number;
  }> = {
    starter: {
      title: 'Emerging Freelancer (< $1k/mo)',
      baselineMonthly: 950,
      frameworkMonthly: 3800,
      avgProjectBefore: 350,
      avgProjectAfter: 1900,
      replyRateBefore: 4,
      replyRateAfter: 32
    },
    growth: {
      title: 'Full-Time Freelancer ($2k–$4k/mo)',
      baselineMonthly: 2800,
      frameworkMonthly: 8400,
      avgProjectBefore: 850,
      avgProjectAfter: 3500,
      replyRateBefore: 6,
      replyRateAfter: 38
    },
    pro: {
      title: 'Established Specialist ($5k+/mo)',
      baselineMonthly: 5200,
      frameworkMonthly: 14500,
      avgProjectBefore: 1800,
      avgProjectAfter: 6500,
      replyRateBefore: 9,
      replyRateAfter: 44
    }
  };

  const currentConfig = tierConfig[selectedTier];

  // Compute 1M, 3M, 6M, 12M data
  const data: HorizonDataPoint[] = [
    {
      horizon: 'Month 1',
      shortLabel: 'M1',
      baseline: activeMetricTab === 'cumulative' 
        ? currentConfig.baselineMonthly 
        : currentConfig.baselineMonthly,
      framework: activeMetricTab === 'cumulative'
        ? Math.round(currentConfig.frameworkMonthly * 0.75) // initial momentum ramp
        : Math.round(currentConfig.frameworkMonthly * 0.75),
      description: 'Profile restructured as an inbound magnet & first 1–2 high-conviction client wins.',
      multiplier: '2.9x'
    },
    {
      horizon: 'Month 3 (Quarter 1)',
      shortLabel: 'M3',
      baseline: activeMetricTab === 'cumulative'
        ? currentConfig.baselineMonthly * 3
        : currentConfig.baselineMonthly,
      framework: activeMetricTab === 'cumulative'
        ? Math.round(currentConfig.frameworkMonthly * 0.75 + currentConfig.frameworkMonthly * 0.9 + currentConfig.frameworkMonthly)
        : currentConfig.frameworkMonthly,
      description: 'Hook proposal templates dialed in, eliminating zero-hire bidding fatigue.',
      multiplier: '3.1x'
    },
    {
      horizon: 'Month 6 (Mid-Year)',
      shortLabel: 'M6',
      baseline: activeMetricTab === 'cumulative'
        ? currentConfig.baselineMonthly * 6
        : currentConfig.baselineMonthly,
      framework: activeMetricTab === 'cumulative'
        ? Math.round(currentConfig.frameworkMonthly * 0.75 + currentConfig.frameworkMonthly * 0.9 + currentConfig.frameworkMonthly * 4.4)
        : Math.round(currentConfig.frameworkMonthly * 1.15),
      description: 'Price anchoring & high-ticket scope escalation; recurring monthly retainers locked.',
      multiplier: '3.4x'
    },
    {
      horizon: 'Month 12 (Full Year)',
      shortLabel: 'M12',
      baseline: activeMetricTab === 'cumulative'
        ? currentConfig.baselineMonthly * 12
        : currentConfig.baselineMonthly,
      framework: activeMetricTab === 'cumulative'
        ? Math.round(currentConfig.frameworkMonthly * 0.75 + currentConfig.frameworkMonthly * 0.9 + currentConfig.frameworkMonthly * 4.4 + currentConfig.frameworkMonthly * 1.25 * 6)
        : Math.round(currentConfig.frameworkMonthly * 1.3),
      description: '5-Star flywheel and top-rated referral ecosystem generating passive inbound invitations.',
      multiplier: '3.6x'
    }
  ];

  // D3 Chart Render Effect
  useEffect(() => {
    if (!chartRef.current || !containerRef.current) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const containerWidth = containerRef.current.clientWidth || 700;
    const height = Math.min(380, Math.max(280, containerWidth * 0.45));
    const margin = { 
      top: 40, 
      right: containerWidth < 500 ? 15 : 30, 
      bottom: 50, 
      left: containerWidth < 500 ? 45 : 65 
    };

    const width = containerWidth - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr('viewBox', `0 0 ${containerWidth} ${height}`)
      .attr('width', '100%')
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale (Horizons)
    const x0 = d3.scaleBand()
      .domain(data.map(d => d.horizon))
      .rangeRound([0, width])
      .paddingInner(0.28)
      .paddingOuter(0.15);

    // Group Sub-scale (Baseline vs Framework)
    const keys = ['baseline', 'framework'] as const;
    const x1 = d3.scaleBand()
      .domain(keys)
      .rangeRound([0, x0.bandwidth()])
      .padding(0.08);

    // Y Scale (Earnings)
    const maxVal = d3.max(data, d => Math.max(d.baseline, d.framework)) || 10000;
    const y = d3.scaleLinear()
      .domain([0, maxVal * 1.15])
      .nice()
      .rangeRound([innerHeight, 0]);

    // Color definitions and gradients
    const defs = svg.append('defs');

    // Emerald gradient for Framework
    const frameworkGrad = defs.append('linearGradient')
      .attr('id', 'framework-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    frameworkGrad.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#34d399');
    frameworkGrad.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#059669');

    // Subtle dark gradient for Baseline
    const baselineGrad = defs.append('linearGradient')
      .attr('id', 'baseline-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    baselineGrad.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#52525b');
    baselineGrad.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#27272a');

    // Horizontal Grid Lines
    g.append('g')
      .attr('class', 'grid')
      .call(
        d3.axisLeft(y)
          .ticks(5)
          .tickSize(-width)
          .tickFormat(() => '')
      )
      .call(gridG => {
        gridG.select('.domain').remove();
        gridG.selectAll('.tick line')
          .attr('stroke', '#262626')
          .attr('stroke-dasharray', '3,3');
      });

    // Render Groups
    const horizonGroups = g.selectAll('.horizon-group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'horizon-group')
      .attr('transform', d => `translate(${x0(d.horizon)},0)`)
      .style('cursor', 'pointer')
      .on('mouseenter', (_, d) => {
        const idx = data.findIndex(item => item.horizon === d.horizon);
        setActiveBarIndex(idx);
      });

    // 1. Baseline Bars
    horizonGroups.append('rect')
      .attr('class', 'bar-baseline')
      .attr('x', x1('baseline') || 0)
      .attr('y', innerHeight)
      .attr('width', x1.bandwidth())
      .attr('height', 0)
      .attr('rx', 4)
      .attr('fill', 'url(#baseline-gradient)')
      .attr('stroke', '#3f3f46')
      .attr('stroke-width', 1)
      .transition()
      .duration(700)
      .delay((_, i) => i * 80)
      .ease(d3.easeCubicOut)
      .attr('y', d => y(d.baseline))
      .attr('height', d => innerHeight - y(d.baseline));

    // 2. Framework Bars
    horizonGroups.append('rect')
      .attr('class', 'bar-framework')
      .attr('x', x1('framework') || 0)
      .attr('y', innerHeight)
      .attr('width', x1.bandwidth())
      .attr('height', 0)
      .attr('rx', 4)
      .attr('fill', 'url(#framework-gradient)')
      .attr('stroke', '#6ee7b7')
      .attr('stroke-width', 1.2)
      .style('filter', 'drop-shadow(0 4px 12px rgba(16, 185, 129, 0.25))')
      .transition()
      .duration(850)
      .delay((_, i) => i * 80 + 100)
      .ease(d3.easeCubicOut)
      .attr('y', d => y(d.framework))
      .attr('height', d => innerHeight - y(d.framework));

    // Value Labels on Top of Framework Bars
    horizonGroups.append('text')
      .attr('class', 'value-label')
      .attr('x', (x1('framework') || 0) + x1.bandwidth() / 2)
      .attr('y', innerHeight)
      .attr('text-anchor', 'middle')
      .attr('fill', '#34d399')
      .attr('font-size', containerWidth < 500 ? '9px' : '11px')
      .attr('font-weight', '700')
      .attr('font-family', 'ui-monospace, monospace')
      .text(d => `$${d3.format(',.0f')(d.framework)}`)
      .transition()
      .duration(850)
      .delay((_, i) => i * 80 + 150)
      .attr('y', d => y(d.framework) - 8);

    // Multiplier Badge above bars
    horizonGroups.append('text')
      .attr('class', 'multiplier-label')
      .attr('x', (x1('framework') || 0) + x1.bandwidth() / 2)
      .attr('y', innerHeight)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fde047')
      .attr('font-size', '10px')
      .attr('font-weight', '800')
      .text(d => `+${d.multiplier}`)
      .transition()
      .duration(900)
      .delay((_, i) => i * 80 + 200)
      .attr('y', d => y(d.framework) - 22);

    // X Axis
    const xAxis = d3.axisBottom(x0)
      .tickSize(0);

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .call(axisG => {
        axisG.select('.domain').attr('stroke', '#3f3f46');
        axisG.selectAll('.tick text')
          .attr('fill', '#a1a1aa')
          .attr('font-size', containerWidth < 500 ? '10px' : '12px')
          .attr('font-weight', '600')
          .attr('dy', '14px');
      });

    // Y Axis
    const yAxis = d3.axisLeft(y)
      .ticks(5)
      .tickFormat(d => `$${d3.format('~s')(d)}`);

    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .call(axisG => {
        axisG.select('.domain').remove();
        axisG.selectAll('.tick text')
          .attr('fill', '#71717a')
          .attr('font-size', '11px')
          .attr('font-family', 'ui-monospace, monospace');
      });

  }, [selectedTier, activeMetricTab, currentConfig]);

  // Window resize observer
  useEffect(() => {
    const handleResize = () => {
      // Re-trigger render
      setSelectedTier(prev => prev);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const annualBaseline = currentConfig.baselineMonthly * 12;
  const annualFramework = (activeMetricTab === 'cumulative' ? data[3].framework : currentConfig.frameworkMonthly * 12);
  const annualDelta = annualFramework - annualBaseline;
  const roiMultiplier = Math.round(annualDelta / 47);

  const activeDataPoint = activeBarIndex !== null ? data[activeBarIndex] : data[3];

  return (
    <section id="metrics" className="py-16 sm:py-24 bg-neutral-950 border-t border-neutral-800 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>D3 Quantified ROI Analysis</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Success Metrics: Current Baseline vs. The Framework
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
            Direct visual comparison of freelance earnings trajectory with and without the Upwork Client Acquisition System across 1, 3, 6, and 12-month execution timelines.
          </p>
        </div>

        {/* Experience Level & View Switchers */}
        <div className="max-w-4xl mx-auto mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Experience Level Tier Picker */}
          <div className="flex items-center bg-neutral-900/90 p-1 rounded-2xl border border-neutral-800 w-full md:w-auto">
            {(['starter', 'growth', 'pro'] as ExperienceTier[]).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setSelectedTier(tier)}
                className={`flex-1 md:flex-none px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedTier === tier
                    ? 'bg-emerald-400 text-neutral-950 shadow-md shadow-emerald-500/20'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                {tier === 'starter' && '🌱 Beginner ($1k/mo)'}
                {tier === 'growth' && '🚀 Mid-Tier ($3k/mo)'}
                {tier === 'pro' && '💎 Senior ($5k+/mo)'}
              </button>
            ))}
          </div>

          {/* Metric Mode Toggle (Cumulative vs Monthly Run-Rate) */}
          <div className="flex items-center bg-neutral-900/90 p-1 rounded-2xl border border-neutral-800 shrink-0">
            <button
              type="button"
              onClick={() => setActiveMetricTab('cumulative')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeMetricTab === 'cumulative'
                  ? 'bg-neutral-800 text-white font-bold border border-neutral-700 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Cumulative Take-Home
            </button>
            <button
              type="button"
              onClick={() => setActiveMetricTab('monthly')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeMetricTab === 'monthly'
                  ? 'bg-neutral-800 text-white font-bold border border-neutral-700 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Monthly Run-Rate
            </button>
          </div>
        </div>

        {/* Interactive Chart Container */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-neutral-900/70 border border-neutral-800 p-5 sm:p-8 shadow-2xl backdrop-blur-sm">
          {/* Chart Header & Legend */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800/80 mb-4">
            <div>
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                {currentConfig.title}
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2 mt-0.5">
                <span>{activeMetricTab === 'cumulative' ? 'Cumulative Revenue Growth Over Time' : 'Monthly Income Trajectory'}</span>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  +{roiMultiplier}x ROI on $47
                </span>
              </h3>
            </div>

            {/* Chart Legend */}
            <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-gradient-to-b from-neutral-600 to-neutral-800 border border-neutral-600" />
                <span className="text-neutral-400">Current Baseline</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-gradient-to-b from-emerald-400 to-emerald-600 border border-emerald-300 shadow-sm shadow-emerald-500/40" />
                <span className="text-emerald-400 font-bold">With Framework</span>
              </div>
            </div>
          </div>

          {/* D3 SVG Canvas */}
          <div ref={containerRef} className="w-full relative min-h-[300px]">
            <svg ref={chartRef} className="w-full overflow-visible" />
          </div>

          {/* Dynamic Insight Ribbon for Selected Horizon */}
          <div className="mt-4 p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white uppercase tracking-wider text-[11px] bg-neutral-800 px-2 py-0.5 rounded">
                  {activeDataPoint.horizon} Horizon
                </span>
                <span className="text-emerald-400 font-mono font-bold">
                  Baseline: ${activeDataPoint.baseline.toLocaleString()} vs. Framework: ${activeDataPoint.framework.toLocaleString()}
                </span>
                <span className="text-amber-400 font-bold">
                  (+${(activeDataPoint.framework - activeDataPoint.baseline).toLocaleString()} extra)
                </span>
              </div>
              <p className="text-neutral-400">
                {activeDataPoint.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
              <span className="text-[11px] text-neutral-400">Target Multiplier:</span>
              <span className="text-sm font-black text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                {activeDataPoint.multiplier}
              </span>
            </div>
          </div>

          {/* 4 Quantified Key Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
            {/* Card 1: Reply Rate */}
            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-1">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                Proposal Reply Rate
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-neutral-500 line-through">{currentConfig.replyRateBefore}%</span>
                <span className="text-lg sm:text-xl font-extrabold text-emerald-400 font-mono">
                  {currentConfig.replyRateAfter}%
                </span>
              </div>
              <p className="text-[10px] text-neutral-500">
                Hook-first opening lines defeat AI bidding flood.
              </p>
            </div>

            {/* Card 2: Average Contract Size */}
            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-1">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                Avg. Contract Size
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-neutral-500 line-through">${currentConfig.avgProjectBefore.toLocaleString()}</span>
                <span className="text-lg sm:text-xl font-extrabold text-emerald-400 font-mono">
                  ${currentConfig.avgProjectAfter.toLocaleString()}
                </span>
              </div>
              <p className="text-[10px] text-neutral-500">
                Tiered pricing anchors close $3k–$10k without discounts.
              </p>
            </div>

            {/* Card 3: Connects Efficiency */}
            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-1">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                Connects Per Client
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-neutral-500 line-through">140+</span>
                <span className="text-lg sm:text-xl font-extrabold text-emerald-400 font-mono">
                  18–26
                </span>
              </div>
              <p className="text-[10px] text-neutral-500">
                Job Vetting Radar skips 0% hire rate listings.
              </p>
            </div>

            {/* Card 4: Net Annual Gain */}
            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-emerald-500/30 space-y-1 shadow-lg shadow-emerald-500/5">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                12-Month Extra Gain
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-black text-white font-mono">
                  +${d3.format(',.0f')(annualDelta)}
                </span>
              </div>
              <p className="text-[10px] text-emerald-300/80">
                Calculated return on your $47 investment today.
              </p>
            </div>
          </div>

          {/* Bottom Action Strip */}
          <div className="mt-8 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-neutral-300 text-center sm:text-left">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">Backed by the 10x ROI Guarantee</span>
                <span className="text-neutral-400 text-[11px]">Win at least one $1,500+ contract within 30 days or get a 100% immediate refund.</span>
              </div>
            </div>

            <button
              onClick={() => onOpenCheckout('complete')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 text-xs sm:text-sm font-extrabold transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Zap className="w-4 h-4 fill-neutral-950" />
              <span>Unlock the Framework ($47)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
