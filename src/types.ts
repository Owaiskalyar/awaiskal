export interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  price: number;
  originalPrice: number;
  tagline: string;
  description: string;
  popular?: boolean;
  features: string[];
  ctaText: string;
  guaranteeText: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  niche: 'dev' | 'design' | 'copywriting' | 'video' | 'marketing';
  location: string;
  avatar: string;
  beforeMetric: string;
  afterMetric: string;
  contractWon: string;
  timeframe: string;
  quote: string;
  rating: number;
  verified: boolean;
  highlight: string;
}

export interface CurriculumModule {
  id: string;
  number: string;
  title: string;
  duration: string;
  lessonsCount: number;
  summary: string;
  takeaways: string[];
  toolsIncluded: string[];
  icon: string;
}

export interface BonusItem {
  id: string;
  title: string;
  value: number;
  description: string;
  badge: string;
  format: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'results' | 'process' | 'beginner' | 'guarantee';
}

export interface OrderDetails {
  tierId: string;
  tierName: string;
  price: number;
  includeBump: boolean;
  bumpPrice: number;
  customerName: string;
  customerEmail: string;
  freelancerNiche: string;
}
