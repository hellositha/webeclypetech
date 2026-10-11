'use client';

import React, { useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { DivisionsMatrix } from '@/components/DivisionsMatrix';
import { ServicesShowcase } from '@/components/ServicesShowcase';
import { UPSFeaturedBanner } from '@/components/UPSFeaturedBanner';
import { SolutionMatcher } from '@/components/SolutionMatcher';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { CostEstimatorWidget } from '@/components/CostEstimatorWidget';
import { CaseStudiesSection } from '@/components/CaseStudiesSection';
import { FaqSection } from '@/components/FaqSection';
import { InquiryModal } from '@/components/InquiryModal';

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>();
  const [selectedDivision, setSelectedDivision] = useState<string | undefined>();

  const handleOpenInquiry = (serviceId?: string, divisionId?: string) => {
    setSelectedService(serviceId);
    setSelectedDivision(divisionId);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection onOpenInquiry={handleOpenInquiry} />

      {/* 2. Four Core Divisions (Interactive Explorer + Matrix Table) */}
      <DivisionsMatrix onOpenInquiry={handleOpenInquiry} />

      {/* 3. 10 Core Services Catalog */}
      <ServicesShowcase onOpenInquiry={handleOpenInquiry} />

      {/* 4. Specialized UPS Systems, Thermal & Containerised DC Suite */}
      <UPSFeaturedBanner />

      {/* 5. Interactive Solution Matcher & IT Configurator */}
      <SolutionMatcher onOpenInquiry={handleOpenInquiry} />

      {/* 5. Why Choose ECLYPE Technology (6 Core Pillars) */}
      <WhyChooseUs />

      {/* 6. Live Cost & Scope Estimator */}
      <CostEstimatorWidget />

      {/* 7. Enterprise Case Studies */}
      <CaseStudiesSection />

      {/* 8. Frequently Asked Questions */}
      <FaqSection />

      {/* Modal for Service Inquiries */}
      <InquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        preselectedService={selectedService}
        preselectedDivision={selectedDivision}
      />
    </div>
  );
}
