import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ExternalLink, Sparkles, Users } from 'lucide-react';

interface FooterProps {
  onOpenCrm: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCrm }) => {
  const [modalContent, setModalContent] = useState<{ title: string; text: string } | null>(null);

  const openPolicy = (type: 'terms' | 'privacy' | 'refund') => {
    if (type === 'refund') {
      setModalContent({
        title: '30-Day Money-Back Refund Policy',
        text: 'We stand 100% behind the quality of the Client Acquisition System on Upwork. If you test our profile optimization frameworks and 3-Sentence Hook proposal templates and do not see an improvement in your interview response rates, simply contact us at support@freelancemastery.io within 30 days of purchase for a prompt, full refund.'
      });
    } else if (type === 'terms') {
      setModalContent({
        title: 'Terms of Use & Product Licensing',
        text: 'Purchasing this product grants the buyer a single-user, non-transferable, perpetual license to access and duplicate the training materials, Notion workspace, templates, and swipe files. Public redistribution, reselling, or unauthorized sharing of the templates and proprietary materials is strictly prohibited.'
      });
    } else {
      setModalContent({
        title: 'Privacy Policy',
        text: 'Your privacy is paramount. We collect your email address exclusively to deliver your digital access key, download links, and relevant product updates. We do not sell, rent, or distribute your personal information to third parties.'
      });
    }
  };

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-400 text-xs py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-800/80 text-center md:text-left">
          {/* Brand info */}
          <div className="space-y-2 max-w-md">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                ⚡
              </div>
              <span className="font-extrabold text-sm text-white tracking-tight">
                Client Acquisition System on Upwork
              </span>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed">
              The premier battle-tested playbook and proposal toolkit helping modern freelancers command high-ticket contracts and build recurring client retainers.
            </p>
          </div>

          {/* Policy & Admin Links */}
          <div className="flex flex-wrap items-center justify-center gap-5 text-neutral-400">
            <button
              onClick={() => openPolicy('refund')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Refund Policy (30-Day)
            </button>
            <button
              onClick={() => openPolicy('terms')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Terms of Use
            </button>
            <button
              onClick={() => openPolicy('privacy')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <a
              href="mailto:support@freelancemastery.io"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Support</span>
            </a>
            <button
              onClick={onOpenCrm}
              className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 font-semibold cursor-pointer border border-emerald-500/30 px-2.5 py-1 rounded-lg bg-emerald-500/10"
              title="Merchant CRM & Retargeting Lead Vault"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Merchant CRM</span>
            </button>
          </div>
        </div>

        {/* Disclaimer & Legal */}
        <div className="space-y-4 text-[11px] text-neutral-400 leading-relaxed max-w-4xl mx-auto text-center md:text-left">
          <p>
            <strong>Trademark Disclaimer:</strong> UPWORK is a registered trademark of Upwork Global Inc. 
            The Client Acquisition System on Upwork is an independent training program, digital playbook, and template library published by Freelance Mastery Systems. 
            This training is not endorsed, sponsored, affiliated with, or vetted by Upwork Global Inc.
          </p>

          <p>
            <strong>Earnings & Results Disclaimer:</strong> Any freelance revenue numbers, contract sizes, or reply percentages referenced on this landing page are from real student experiences and case studies. Results may vary depending on individual work ethic, portfolio quality, and client responsiveness. No training can legally guarantee income without execution.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-neutral-400 text-xs border-t border-neutral-800/80">
            <div>
              © {new Date().getFullYear()} Freelance Mastery Systems LLC. All rights reserved.
            </div>
            <div className="flex items-center gap-2 mt-2 sm:mt-0 text-emerald-400/80">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Secure 256-Bit SSL Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h4 className="text-base font-bold text-white">{modalContent.title}</h4>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {modalContent.text}
            </p>
            <div className="text-right pt-2">
              <button
                onClick={() => setModalContent(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
