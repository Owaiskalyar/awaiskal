/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PainVsDream } from './components/PainVsDream';
import { ProposalComparison } from './components/ProposalComparison';
import { CurriculumOverview } from './components/CurriculumOverview';
import { RoiCalculator } from './components/RoiCalculator';
import { TestimonialsSection } from './components/TestimonialsSection';
import { PricingSection } from './components/PricingSection';
import { GuaranteeSection } from './components/GuaranteeSection';
import { FaqSection } from './components/FaqSection';
import { StickyBottomBar } from './components/StickyBottomBar';
import { Footer } from './components/Footer';
import { CheckoutModal } from './components/CheckoutModal';
import { CrmDashboardModal } from './components/CrmDashboardModal';

export default function App() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCrmOpen, setIsCrmOpen] = useState(false);
  const [selectedTierId, setSelectedTierId] = useState('complete');

  const handleOpenCheckout = (tierId?: string) => {
    if (tierId) {
      setSelectedTierId(tierId);
    }
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-neutral-950">
      {/* Sticky Header with countdown and CRM shortcut */}
      <Header 
        onOpenCheckout={handleOpenCheckout} 
        onOpenCrm={() => setIsCrmOpen(true)} 
      />

      {/* Main Landing Sections */}
      <main className="flex-1">
        <Hero onOpenCheckout={handleOpenCheckout} />
        <PainVsDream onOpenCheckout={handleOpenCheckout} />
        <ProposalComparison />
        <CurriculumOverview onOpenCheckout={handleOpenCheckout} />
        <RoiCalculator onOpenCheckout={handleOpenCheckout} />
        <TestimonialsSection />
        <PricingSection onOpenCheckout={handleOpenCheckout} />
        <GuaranteeSection onOpenCheckout={handleOpenCheckout} />
        <FaqSection />
      </main>

      {/* Footer with policy & CRM links */}
      <Footer onOpenCrm={() => setIsCrmOpen(true)} />

      {/* Persistent floating action bar on scroll */}
      <StickyBottomBar onOpenCheckout={handleOpenCheckout} />

      {/* Conversion-optimized Checkout Modal with Return Navigation & Bank Transfer */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedTierId={selectedTierId}
      />

      {/* Merchant CRM & Retargeting Lead Vault */}
      <CrmDashboardModal
        isOpen={isCrmOpen}
        onClose={() => setIsCrmOpen(false)}
      />
    </div>
  );
}
