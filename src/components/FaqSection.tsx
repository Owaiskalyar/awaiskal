import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, MessageCircle } from 'lucide-react';
import { FAQ_LIST } from '../data/productData';

export const FaqSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'results' | 'process' | 'beginner' | 'guarantee'>('all');
  const [openFaq, setOpenFaq] = useState<string | null>('faq1');

  const filteredFaqs = activeCategory === 'all'
    ? FAQ_LIST
    : FAQ_LIST.filter(item => item.category === activeCategory);

  const toggleFaq = (id: string) => {
    setOpenFaq(prev => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-neutral-900/40 border-t border-neutral-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions? We Have Answers</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
            Everything you need to know about the system, implementation, and guarantees.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-emerald-400 text-neutral-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800'
              }`}
            >
              All Questions
            </button>
            <button
              onClick={() => setActiveCategory('results')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === 'results'
                  ? 'bg-emerald-400 text-neutral-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800'
              }`}
            >
              Speed & Results
            </button>
            <button
              onClick={() => setActiveCategory('beginner')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === 'beginner'
                  ? 'bg-emerald-400 text-neutral-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800'
              }`}
            >
              Beginners & 0 Reviews
            </button>
            <button
              onClick={() => setActiveCategory('process')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === 'process'
                  ? 'bg-emerald-400 text-neutral-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800'
              }`}
            >
              Connects & Strategy
            </button>
            <button
              onClick={() => setActiveCategory('guarantee')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === 'guarantee'
                  ? 'bg-emerald-400 text-neutral-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800'
              }`}
            >
              Guarantee & Access
            </button>
          </div>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-neutral-900 border-emerald-500/40 shadow-lg'
                    : 'bg-neutral-900/60 border-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="text-sm sm:text-base font-bold text-white tracking-tight">
                    {faq.question}
                  </span>
                  <div className="p-1.5 rounded-lg bg-neutral-950 text-neutral-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-neutral-800/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Callout */}
        <div className="mt-10 text-center text-xs text-neutral-400 flex items-center justify-center gap-2">
          <MessageCircle className="w-4 h-4 text-emerald-400" />
          <span>Have a specific question before buying? Email our team at <strong className="text-neutral-200">support@freelancemastery.io</strong></span>
        </div>
      </div>
    </section>
  );
};
