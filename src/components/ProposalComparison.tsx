import React, { useState } from 'react';
import { CheckCircle2, XCircle, Eye, HelpCircle, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';

export const ProposalComparison: React.FC = () => {
  const [activeAnnotation, setActiveAnnotation] = useState<number | null>(1);

  const annotations = [
    {
      id: 1,
      name: 'The 180-Character Preview Hook',
      whyLoses: 'Starts with generic polite filler ("Dear Sir, I hope this finds you well. I am a seasoned engineer with 7 years..."). The client sees nothing useful in their truncated inbox feed and instantly clicks Archive.',
      whyWins: 'Directly addresses the exact technical or strategic problem mentioned in the client’s brief within the first 12 words. Creates an immediate mental reflex: "This person actually read my spec."',
      stat: '+340% View Rate'
    },
    {
      id: 2,
      name: 'The Diagnosis vs Resume Dump',
      whyLoses: 'Dumps a bulleted list of 18 skills, GitHub repositories, and past degrees. Clients don’t have time to review your life story; they have a deadline to meet.',
      whyWins: 'Pinpoints the single biggest hurdle in their project and provides a high-level 2-step diagnosis. Proves seniority without bragging.',
      stat: 'Builds Instant Authority'
    },
    {
      id: 3,
      name: 'Curated Proof Stacking',
      whyLoses: 'Sends 6 generic portfolio links with zero context, forcing the client to hunt for relevance.',
      whyWins: 'Shares exactly ONE hyper-relevant case study with a tangible business outcome (e.g. "helped a similar SaaS cut API latency by 60%").',
      stat: 'Eliminates Doubts'
    },
    {
      id: 4,
      name: 'The Low-Friction Micro-Commitment',
      whyLoses: 'Demands an aggressive 45-minute Zoom call or asks "When can we start?". Clients avoid committing to calls with strangers.',
      whyWins: 'Ends with a zero-friction, 1-click question (e.g. "Are you hosting this on AWS ECS or standard Vercel?"). It takes 5 seconds for them to reply, starting the chat.',
      stat: '5x Reply Velocity'
    }
  ];

  return (
    <section id="proposal-audit" className="py-16 sm:py-24 bg-neutral-900/40 border-t border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Proposal Teardown</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            See the Exact Anatomy of a{' '}
            <span className="text-emerald-400">Winning Proposal</span>
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
            Click on any psychological trigger below to see how our students consistently out-convert 50+ applicants on the same job post.
          </p>

          {/* Trigger Pills Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            {annotations.map((ann) => (
              <button
                key={ann.id}
                onClick={() => setActiveAnnotation(ann.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeAnnotation === ann.id
                    ? 'bg-emerald-400 text-neutral-950 shadow-md shadow-emerald-500/20'
                    : 'bg-neutral-800/80 text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <span>Trigger #{ann.id}: {ann.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Side-by-Side Proposal Windows */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* LOSING PROPOSAL */}
          <div className="rounded-2xl bg-neutral-950 border border-rose-500/30 overflow-hidden shadow-lg">
            <div className="bg-rose-950/40 border-b border-rose-900/40 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                  The Amateur / AI Template (Ignored & Archived)
                </span>
              </div>
              <span className="text-[11px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                Reply Rate: 2.1%
              </span>
            </div>

            <div className="p-5 font-mono text-xs text-neutral-400 space-y-3 leading-relaxed">
              <div className={`p-2.5 rounded transition-colors ${activeAnnotation === 1 ? 'bg-rose-500/15 text-rose-200 border border-rose-500/30' : ''}`}>
                <span className="text-neutral-500 block text-[10px] uppercase font-bold mb-1">Trigger #1: The Fatal Greeting</span>
                Dear Hiring Manager,<br />
                I hope you are having a wonderful day. I read your job description with great interest and I am writing to express my enthusiastic interest in your esteemed project...
              </div>

              <div className={`p-2.5 rounded transition-colors ${activeAnnotation === 2 ? 'bg-rose-500/15 text-rose-200 border border-rose-500/30' : ''}`}>
                <span className="text-neutral-500 block text-[10px] uppercase font-bold mb-1">Trigger #2: Self-Centered Resume Dump</span>
                I have 8+ years of comprehensive experience in JavaScript, React, Next.js, Node, Python, AWS, Docker, HTML, CSS, Tailwind, MongoDB, PostgreSQL, Git, Figma, and Agile management. I have graduated with honors...
              </div>

              <div className={`p-2.5 rounded transition-colors ${activeAnnotation === 3 ? 'bg-rose-500/15 text-rose-200 border border-rose-500/30' : ''}`}>
                <span className="text-neutral-500 block text-[10px] uppercase font-bold mb-1">Trigger #3: Lazy Link Spam</span>
                Here are my links:<br />
                - myportfolio.example.com<br />
                - github.com/randomdev<br />
                - dribbble.com/example<br />
                Please review all of them to judge my abilities.
              </div>

              <div className={`p-2.5 rounded transition-colors ${activeAnnotation === 4 ? 'bg-rose-500/15 text-rose-200 border border-rose-500/30' : ''}`}>
                <span className="text-neutral-500 block text-[10px] uppercase font-bold mb-1">Trigger #4: High-Friction Ask</span>
                Please let me know when you are available for a 45-minute video interview on Zoom so we can discuss terms and start immediately!
              </div>
            </div>

            <div className="bg-rose-950/20 px-4 py-3 border-t border-rose-900/30 text-[11px] text-rose-300">
              <strong>Client Verdict:</strong> "Looks like generic bot spam. Skipped in 3 seconds."
            </div>
          </div>

          {/* WINNING PROPOSAL */}
          <div className="rounded-2xl bg-neutral-950 border-2 border-emerald-500/50 overflow-hidden shadow-2xl shadow-emerald-500/10">
            <div className="bg-emerald-950/60 border-b border-emerald-500/30 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  The Client Acquisition System Formula
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
                Reply Rate: 41.8%
              </span>
            </div>

            <div className="p-5 font-mono text-xs text-neutral-300 space-y-3 leading-relaxed">
              <div className={`p-2.5 rounded transition-colors ${activeAnnotation === 1 ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/40 font-medium' : ''}`}>
                <span className="text-emerald-400 block text-[10px] uppercase font-bold mb-1">Trigger #1: The 180-Character Hook</span>
                Hey Michael — I reviewed your job post and noticed your Supabase auth tokens are expiring unexpectedly during user checkout. I resolved this exact issue two weeks ago for a Next.js subscription platform.
              </div>

              <div className={`p-2.5 rounded transition-colors ${activeAnnotation === 2 ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/40 font-medium' : ''}`}>
                <span className="text-emerald-400 block text-[10px] uppercase font-bold mb-1">Trigger #2: The 2-Step Diagnosis</span>
                Usually this happens because the middleware refresh cycle misses the cookie header on cold lambdas. We can patch this by stabilizing the session handler in your root layout without touching your live database schema.
              </div>

              <div className={`p-2.5 rounded transition-colors ${activeAnnotation === 3 ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/40 font-medium' : ''}`}>
                <span className="text-emerald-400 block text-[10px] uppercase font-bold mb-1">Trigger #3: Proof Stacking (One Single Proof Point)</span>
                Here is a 45-second screen recording showing the exact token middleware fix in action on a production staging repo: [Private Loom Link].
              </div>

              <div className={`p-2.5 rounded transition-colors ${activeAnnotation === 4 ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/40 font-medium' : ''}`}>
                <span className="text-emerald-400 block text-[10px] uppercase font-bold mb-1">Trigger #4: Zero-Friction Question</span>
                Are you currently deploying on Vercel Pro or AWS Amplify? Happy to share the code snippet right here in Upwork chat either way.
              </div>
            </div>

            <div className="bg-emerald-950/40 px-4 py-3 border-t border-emerald-500/30 text-[11px] text-emerald-300 flex items-center justify-between">
              <div>
                <strong>Client Verdict:</strong> "Hired within 20 minutes at $95/hr without price haggling."
              </div>
              <span className="text-emerald-400 font-bold text-xs">$3,800 Milestone</span>
            </div>
          </div>
        </div>

        {/* Detailed Explanation Drawer of Active Annotation */}
        {activeAnnotation && (
          <div className="mt-8 bg-neutral-900 border border-neutral-800 p-5 sm:p-6 rounded-2xl shadow-xl">
            {(() => {
              const ann = annotations.find(a => a.id === activeAnnotation);
              if (!ann) return null;
              return (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-8 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        Psychological Breakdown • Trigger #{ann.id}
                      </span>
                      <span className="text-xs font-bold text-white bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                        {ann.stat}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{ann.name}</h3>
                    <p className="text-sm text-neutral-300">
                      <strong className="text-emerald-300">Why it converts:</strong> {ann.whyWins}
                    </p>
                    <p className="text-xs text-rose-300/80">
                      <strong>The common trap:</strong> {ann.whyLoses}
                    </p>
                  </div>

                  <div className="md:col-span-4 bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-center space-y-2">
                    <div className="text-xs text-neutral-400">Ready to copy all 15 winning templates?</div>
                    <div className="text-sm font-bold text-white">Included in both Starter & Complete System</div>
                    <div className="text-[11px] text-emerald-400 font-semibold">Dev • Design • Copy • AI • Video • Marketing</div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </section>
  );
};
