import React, { useState } from 'react';
import { Star, ShieldCheck, CheckCircle2, TrendingUp, Filter, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/productData';

export const TestimonialsSection: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'dev' | 'design' | 'copywriting' | 'video' | 'marketing'>('all');

  const filteredTestimonials = filter === 'all'
    ? TESTIMONIALS
    : TESTIMONIALS.filter(t => t.niche === filter);

  return (
    <section id="reviews" className="py-16 sm:py-24 bg-neutral-950 border-t border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Real Results • 100% Verified Freelancers</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Loved by 1,420+ Freelancers Worldwide
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
            See how developers, designers, copywriters, and video editors used the Client Acquisition System to escape low-rate bidding wars and close 4-to-5 figure contracts.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-emerald-400 text-neutral-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800'
              }`}
            >
              All Niches ({TESTIMONIALS.length})
            </button>
            <button
              onClick={() => setFilter('dev')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === 'dev'
                  ? 'bg-emerald-400 text-neutral-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800'
              }`}
            >
              Web & App Dev
            </button>
            <button
              onClick={() => setFilter('design')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === 'design'
                  ? 'bg-emerald-400 text-neutral-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800'
              }`}
            >
              UI/UX & Design
            </button>
            <button
              onClick={() => setFilter('copywriting')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === 'copywriting'
                  ? 'bg-emerald-400 text-neutral-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800'
              }`}
            >
              Copywriting
            </button>
            <button
              onClick={() => setFilter('video')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === 'video'
                  ? 'bg-emerald-400 text-neutral-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800'
              }`}
            >
              Video & Motion
            </button>
            <button
              onClick={() => setFilter('marketing')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === 'marketing'
                  ? 'bg-emerald-400 text-neutral-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800'
              }`}
            >
              Marketing & Ads
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-neutral-900/90 border border-neutral-800/80 p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all duration-200 hover:-translate-y-1 shadow-lg"
            >
              <div className="space-y-4">
                {/* Metric Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                    Won: {item.contractWon}
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Before vs After Metric Strip */}
                <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800/80 text-[11px] space-y-1">
                  <div className="text-rose-400/90 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span className="line-through">{item.beforeMetric}</span>
                  </div>
                  <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{item.afterMetric}</span>
                  </div>
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-neutral-800/80 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full border border-neutral-700 object-cover"
                />
                <div className="text-xs">
                  <div className="font-bold text-white flex items-center gap-1">
                    <span>{item.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-neutral-400 text-[11px]">{item.role}</div>
                  <div className="text-neutral-500 text-[10px]">{item.location} • {item.timeframe}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
