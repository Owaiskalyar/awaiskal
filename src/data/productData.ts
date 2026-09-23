import { PricingTier, Testimonial, CurriculumModule, BonusItem, FaqItem } from '../types';

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter Toolkit',
    badge: 'Essential',
    price: 47,
    originalPrice: 197,
    tagline: 'For freelancers ready to immediately stop losing connects and win their first $1k+ contract.',
    description: 'The core battle-tested framework, proposal swipe file, and profile architecture.',
    popular: false,
    features: [
      'The Core Client Acquisition Master Playbook (PDF & Notion)',
      '15 Battle-Tested Copy-Paste Proposal Templates (40%+ Reply Rate)',
      'The 1-Hour Upwork Profile Optimization Checklist',
      'The 3-Sentence Hook Framework to Beat 50+ AI Competitors',
      'Connects Economy Strategy Guide (Stop Burning $1.50/bid)',
      'Standard Email Support & Lifetime Digital Updates'
    ],
    ctaText: 'Get Starter Toolkit ($47)',
    guaranteeText: '30-Day 100% Money-Back Guarantee'
  },
  {
    id: 'complete',
    name: 'The Complete System',
    badge: 'Most Popular • 84% Choose This',
    price: 97,
    originalPrice: 397,
    tagline: 'The complete end-to-end client conversion engine, video breakdowns, and negotiation vault.',
    description: 'Everything you need to scale from inconsistent $20/hr gigs to steady $3k-$10k+ retainers.',
    popular: true,
    features: [
      'Everything in Starter Toolkit, PLUS:',
      'Full Video Walkthrough Suite (Step-by-step screen audits)',
      'High-Ticket Discovery Call Script ($3k–$10k Closing Blueprint)',
      'Rate Anchoring & Price Escalation Protocol ($35/hr → $120/hr)',
      'The "Job Vetting Radar" (Instantly spot red-flag clients & tire-kickers)',
      '15 Industry-Specific Video Proposal Audits (Dev, Design, Copy, AI)',
      'Upwork AI Proposal Prompt Matrix (Custom Claude/ChatGPT prompts)',
      'Private Community Access & Monthly Live Q&A Recordings',
      'Priority Support with 24h Response Window'
    ],
    ctaText: 'Get The Complete System ($97)',
    guaranteeText: 'Double-Your-Investment Guarantee'
  },
  {
    id: 'audit',
    name: 'System + 1:1 Video Audit',
    badge: 'VIP Limited • 7 Slots Left',
    price: 197,
    originalPrice: 697,
    tagline: 'Everything in The Complete System plus a private personal 15-minute Loom teardown.',
    description: 'A tailored, bespoke video audit of your exact profile, portfolio, and last 3 proposals.',
    popular: false,
    features: [
      'Everything in The Complete System, PLUS:',
      'Personal 15-Minute 1-on-1 Loom Video Profile & Proposal Audit',
      'Direct line-by-line rewrite suggestions for your top niche',
      'Customized connect bidding strategy tailored to your exact skills',
      'Dedicated private Slack/Email access for 30 days direct review',
      'Exclusive invitation to quarterly High-Ticket Mastermind calls'
    ],
    ctaText: 'Claim VIP Audit Edition ($197)',
    guaranteeText: 'Guaranteed 1-on-1 Turnaround within 72 Hours'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Alexandre Mercer',
    role: 'Full-Stack React & Next.js Developer',
    niche: 'dev',
    location: 'Berlin, Germany',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    beforeMetric: 'Sent 42 proposals, 1 reply',
    afterMetric: '4 replies on next 7 proposals',
    contractWon: '$6,400 SaaS MVP Build',
    timeframe: 'Day 5 after implementing',
    quote: 'I had completely given up on Upwork because connects felt like a scam. Every job had 50+ applicants in 15 minutes. The 3-Sentence Hook framework completely changed the game. Within 4 days of rewriting my profile and first proposal, a client in California hired me at $85/hr for a $6,400 contract.',
    rating: 5,
    verified: true,
    highlight: '$6,400 contract on Day 5'
  },
  {
    id: '2',
    name: 'Elena Rostova',
    role: 'UI/UX & Product Designer',
    niche: 'design',
    location: 'Madrid, Spain',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    beforeMetric: 'Stuck at $35/hr bidding wars',
    afterMetric: 'Closed $4,200 fixed retainer',
    contractWon: '$4,200 Monthly Retainer',
    timeframe: '10 days after applying',
    quote: 'The Price Anchoring scripts alone paid for this 40 times over. Clients used to haggle with me over $30/hr. Using the Discovery Call audio scripts from Module 4, I closed a Fintech startup on a $4,200/month recurring design retainer without any pushback.',
    rating: 5,
    verified: true,
    highlight: 'Escaped $35/hr bidding wars'
  },
  {
    id: '3',
    name: 'Marcus Vance',
    role: 'B2B Copywriter & Content Strategist',
    niche: 'copywriting',
    location: 'Austin, TX, USA',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    beforeMetric: '4% proposal view rate',
    afterMetric: '41% proposal view & 33% hire rate',
    contractWon: '$3,800 Email Launch Series',
    timeframe: 'Week 2',
    quote: 'Before this system, my proposals looked like everybody else’s: "Hi, I have 6 years of experience...". When you see how the client dashboard actually truncates the first two lines, you realize why 95% of freelancers get skipped immediately. The Hook formula gets you read every single time.',
    rating: 5,
    verified: true,
    highlight: '41% view rate & $3,800 win'
  },
  {
    id: '4',
    name: 'Priya Sharma',
    role: 'AI Automation & Python Specialist',
    niche: 'dev',
    location: 'Bangalore, India',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    beforeMetric: 'Competed with 100+ low-ballers',
    afterMetric: 'Won 2 Enterprise US contracts',
    contractWon: '$9,200 Total Contracts',
    timeframe: '3 weeks',
    quote: 'As an offshore developer, I felt trapped in the low-rate stereotype. The Profile Architecture module showed me how to reposition as a strategic AI consultant rather than just an hourly code monkey. Won two US enterprise gigs worth $9.2k combined.',
    rating: 5,
    verified: true,
    highlight: 'Shifted from offshore hourly to $9.2k consultant'
  },
  {
    id: '5',
    name: 'David Lindqvist',
    role: 'Motion Graphics & Video Editor',
    niche: 'video',
    location: 'Stockholm, Sweden',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    beforeMetric: 'Spent 150 connects/month with zero hires',
    afterMetric: 'Top Rated Plus badge in 60 days',
    contractWon: '$12,500 Long-Term Channel Deal',
    timeframe: '6 weeks',
    quote: 'The Job Vetting Radar is the most underrated part. I used to waste hours crafting custom video samples for clients who only had a $100 budget. Learning how to filter the client’s hire rate, previous spend, and average hourly paid saved my sanity and 80% of my connects.',
    rating: 5,
    verified: true,
    highlight: '12,500 channel contract in 6 weeks'
  },
  {
    id: '6',
    name: 'Chloe Bennett',
    role: 'Paid Acquisition & Meta Ads Manager',
    niche: 'marketing',
    location: 'Melbourne, Australia',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    beforeMetric: 'Ignored on 9 out of 10 pitches',
    afterMetric: '4 continuous client retainers',
    contractWon: '$7,500/mo Total Recurring',
    timeframe: 'Month 1',
    quote: 'I literally made back 80x my investment within 14 days. The proposal templates are not lazy generic snippets; they are deeply psychological frameworks that force the client to envision working with you immediately.',
    rating: 5,
    verified: true,
    highlight: 'Made back 80x investment in 14 days'
  }
];

export const CURRICULUM_MODULES: CurriculumModule[] = [
  {
    id: 'm1',
    number: '01',
    title: 'The High-Ticket Profile Architecture',
    duration: '45 Mins',
    lessonsCount: 6,
    summary: 'Turn your profile from an ignored online resume into a high-converting sales page that lands inbound interview invites.',
    takeaways: [
      'The "Above-The-Fold" headline formula that ranks in Upwork’s internal search algorithm',
      'The 4-part Bio Structure that eliminates client hesitation in 30 seconds',
      'Structuring your Project Catalog to generate passive, pre-paid contracts',
      'How to display social proof and case studies even if you have zero Upwork reviews'
    ],
    toolsIncluded: ['Profile Audit Checklist', 'Keyword Density Matrix', 'Title Generator Sheet'],
    icon: 'UserCheck'
  },
  {
    id: 'm2',
    number: '02',
    title: 'The "3-Sentence Hook" Proposal Engine',
    duration: '60 Mins',
    lessonsCount: 8,
    summary: 'The psychological proposal anatomy that forces clients to stop scrolling, expand your cover letter, and message you back within minutes.',
    takeaways: [
      'The exact first 180 characters that appear in the client dashboard preview before opening',
      'The Pain-Diagnosis mechanism: How to pinpoint what the client is terrified of',
      'The "Zero-Risk Micro-Call to Action" that makes replying a no-brainer',
      '15 copy-paste templates tailored for dev, design, copywriting, virtual assistance, and marketing'
    ],
    toolsIncluded: ['15 Swipe-File Proposals', 'The 180-Character Preview Simulator', 'Hook Formula Bank'],
    icon: 'Send'
  },
  {
    id: 'm3',
    number: '03',
    title: 'The Connects Economy & Job Vetting Radar',
    duration: '40 Mins',
    lessonsCount: 5,
    summary: 'Stop wasting expensive connects on fake jobs, tire-kickers, and clients with 0% hire rates. Bid only on high-yield opportunities.',
    takeaways: [
      'The 5-Point Client Audit: Hire rate, average hourly paid, escrow history, and review velocity',
      'The Truth About Boosted Proposals: When to bid 20 connects and when it’s burning cash',
      'The Golden 20-Minute Window: When to submit to guarantee the client reads your proposal first',
      'How to spot hidden high-budget enterprise clients hiding behind unverified payment methods'
    ],
    toolsIncluded: ['Client Vetting Spreadsheet', 'Connects Allocation Calculator', 'Red Flag Checklist'],
    icon: 'Radar'
  },
  {
    id: 'm4',
    number: '04',
    title: 'Price Anchoring & Discovery Call Closer',
    duration: '55 Mins',
    lessonsCount: 7,
    summary: 'Transition seamlessly from Upwork chat to closing high-ticket milestones and recurring monthly retainers without price pushback.',
    takeaways: [
      'The Word-for-Word Discovery Call Script that turns a $500 job into a $4,000 project',
      'How to handle the dreaded "What is your hourly rate?" with value-based anchor pricing',
      'Handling objections: "You are more expensive than other freelancers"',
      'Upwork-compliant off-platform boundaries and milestone structuring for 100% escrow safety'
    ],
    toolsIncluded: ['Discovery Call Audio Breakdown', 'Objection Handling Playbook', 'Scope Template'],
    icon: 'DollarSign'
  },
  {
    id: 'm5',
    number: '05',
    title: 'The 5-Star Flywheel & Inbound Client Magnet',
    duration: '35 Mins',
    lessonsCount: 5,
    summary: 'Automate pristine 5.0 feedback, trigger Upwork’s internal recommendation algorithm, and generate repeat client retainers on autopilot.',
    takeaways: [
      'The Post-Project Handoff script that guarantees 5-star private feedback (protecting JSS)',
      'How to reach Top Rated and Top Rated Plus status in the minimum mathematical timeframe',
      'Turning one-off gig clients into $2,000–$5,000/month recurring retainers',
      'The Inbound Invite Formula: Waking up to private interview requests from clients with real budgets'
    ],
    toolsIncluded: ['5-Star Review Request Scripts', 'Retainer Proposal Agreement', 'JSS Protection Guide'],
    icon: 'TrendingUp'
  }
];

export const BONUSES: BonusItem[] = [
  {
    id: 'b1',
    title: '15 High-Ticket Copy-Paste Proposal Swipe Files',
    value: 147,
    description: 'Actual winning proposals that closed $2,500 to $12,000 contracts across Tech, Design, Copy, Marketing, and Operations. Fully customizable for your niche.',
    badge: 'Instant Download',
    format: 'Notion & PDF Swipe Vault'
  },
  {
    id: 'b2',
    title: 'The Upwork AI Proposal Prompt Matrix',
    value: 97,
    description: 'Custom fine-tuned prompts for Claude 3.5 & ChatGPT that digest a client job post and draft a human, bespoke, un-robotized 3-Sentence Hook in 30 seconds.',
    badge: 'AI Toolkit',
    format: 'Prompt Playbook'
  },
  {
    id: 'b3',
    title: 'The 1-Hour Profile Optimizer Checklist & Video Audit',
    value: 127,
    description: 'A line-by-line inspection scorecard to fix headline leaks, re-structure portfolio cards, and tune keyword tags before you send your next proposal.',
    badge: 'Checklist & Video',
    format: 'Interactive Scorecard'
  },
  {
    id: 'b4',
    title: 'Rate Escalation & Client Negotiation Audio Teardown',
    value: 197,
    description: 'Real recorded negotiation recordings demonstrating how to navigate high-ticket price resistance and transition clients onto recurring weekly retainers.',
    badge: 'Audio Masterclass',
    format: 'Audio & Transcript'
  }
];

export const FAQ_LIST: FaqItem[] = [
  {
    id: 'faq1',
    category: 'results',
    question: 'How fast can I realistically expect to win a client with this system?',
    answer: 'Most freelancers who implement the 1-Hour Profile Optimizer and apply the 3-Sentence Hook proposal framework receive their first interview invitation within 3 to 7 days. Because Upwork clients review proposals immediately after posting, changing the first two lines of your proposal yields immediate, measurable changes in your reply rate from Day 1.'
  },
  {
    id: 'faq2',
    category: 'beginner',
    question: 'Does this work if I have 0 reviews and a brand-new Upwork profile?',
    answer: 'Yes! In fact, Module 1 is specifically engineered to solve the "Zero Review Dilemma". We teach you the Proof-Stacking and Case-Study Positioning framework that leverages your past external work, portfolio samples, or spec projects so clients trust your expertise before you even have platform ratings.'
  },
  {
    id: 'faq3',
    category: 'process',
    question: 'Upwork connects are expensive now. How does this help me save connects?',
    answer: 'In 2025 and 2026, blindly spamming 50 proposals wastes $50–$100 in connects. This system teaches the "Job Vetting Radar"—a protocol that weeds out ghost jobs, unverified payment clients, and low-hire-rate postings. You will apply to fewer jobs (only 5–8 high-conviction listings per week) with a 30%+ interview rate, saving hundreds of dollars in connects while winning higher-ticket contracts.'
  },
  {
    id: 'faq4',
    category: 'process',
    question: 'Does this work for non-native English speakers or offshore freelancers?',
    answer: 'Absolutely. Over 45% of our successful students are non-native English speakers across Europe, Asia, Latin America, and Africa. Clients care about competence, clarity, and communication certainty far more than flowery prose. Our templates use clear, concise, high-impact phrasing that conveys elite professionalism.'
  },
  {
    id: 'faq5',
    category: 'guarantee',
    question: 'What is your 30-Day Money-Back Guarantee?',
    answer: 'We offer an unconditional 30-day 100% money-back guarantee. If you go through the materials, implement the profile adjustments, send proposals using our templates, and don’t feel this is the single most valuable freelancing investment you have ever made, simply email us and we will promptly refund every cent. No hassle, no hard feelings.'
  },
  {
    id: 'faq6',
    category: 'process',
    question: 'What format is the product and how do I access it?',
    answer: 'You receive instant digital access immediately after checkout. The system is hosted in a beautifully organized Notion Workspace, downloadable PDFs, video audit recordings, and copy-paste swipe files that you can access from desktop, tablet, or mobile with lifetime updates included.'
  },
  {
    id: 'faq7',
    category: 'beginner',
    question: 'What niches does this system work for?',
    answer: 'The core conversion psychology applies to all high-demand freelancing categories: Web & Mobile Development, UI/UX & Graphic Design, Copywriting & Content, Digital Marketing & Paid Ads, Video Editing & Motion, Data/AI & Automation, and Executive Virtual Assistance.'
  },
  {
    id: 'faq8',
    category: 'results',
    question: 'Why not just use ChatGPT to write proposals for free?',
    answer: 'Clients receive 40+ generic AI proposals on every job posting and can spot them in 2 seconds (e.g. "I am thrilled to submit my proposal for your esteemed project..."). Clients immediately reject and archive these. Our system teaches you the anti-AI human psychological framework—plus our AI Matrix shows you how to prompt AI to write like an elite $150/hr consultant instead of a generic bot.'
  }
];
