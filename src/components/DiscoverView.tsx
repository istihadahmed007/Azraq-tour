import React, { useState } from 'react';
import { Destination, TourPackage } from '../types';
import { useAuth } from '../context/AuthContext';
import { usePackages } from '../context/PackageContext';
import { FlightSearchParams } from './AzraqTripFinder';
import { VoiceTripModal, StructuredVoiceTripData } from './VoiceTripModal';

// Composed Home Section Components
import { HomeHero } from './home/HomeHero';
import { TrustStrip } from './home/TrustStrip';
import { VoicePlannerBanner } from './home/VoicePlannerBanner';
import { DestinationSection } from './home/DestinationSection';
import { FlightWorkflowSection } from './home/FlightWorkflowSection';
import { ServiceGrid } from './home/ServiceGrid';
import { FeaturedPackagesSection } from './home/FeaturedPackagesSection';
import { VisaAssistanceSection } from './home/VisaAssistanceSection';
import { TravelBuddiesPreview } from './home/TravelBuddiesPreview';
import { WhyAzraqSection } from './home/WhyAzraqSection';
import { FinalTravelCta } from './home/FinalTravelCta';

interface DiscoverViewProps {
  destinations: Destination[];
  onSelectDestination: (destination: Destination) => void;
  onPlanTripPrompt: (promptText: any) => void;
  onQuickGenerateItinerary: (destName: string) => void;
  onNavigateToView?: (view: string, extra?: any) => void;
  onSearchFlights?: (params: FlightSearchParams) => void;
  onOpenVisaModal?: (country?: string) => void;
  onOpenFlightModal?: (dest?: string) => void;
  onOpenQuote?: (pkg?: TourPackage) => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  destinations,
  onSelectDestination,
  onPlanTripPrompt,
  onQuickGenerateItinerary,
  onNavigateToView,
  onSearchFlights,
  onOpenVisaModal,
  onOpenFlightModal,
  onOpenQuote,
}) => {
  const { showToast } = useAuth();
  const { packages, setActivePackageModal } = usePackages();

  // Voice Trip Planning Modal State
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [voiceInitialTranscript, setVoiceInitialTranscript] = useState('');

  const handleOpenVoicePlanner = (initialTranscript?: string) => {
    setVoiceInitialTranscript(initialTranscript || '');
    setIsVoiceModalOpen(true);
  };

  const handleConfirmVoicePlan = (data: StructuredVoiceTripData) => {
    showToast(`Voice trip parsed! Generating itinerary for ${data.destination}...`, 'info');
    onPlanTripPrompt({
      destination: data.destination,
      startDate: data.startDate,
      endDate: data.endDate,
      vibes: data.vibes,
      travelerCount: data.travelerCount,
      durationDays: data.durationDays,
      structuredPrompt: data.structuredPrompt,
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#F4F8FA] flex flex-col space-y-12 sm:space-y-16 pb-16">
      {/* 1. Brand Hero & 5-Mode Trip Finder */}
      <HomeHero
        onSearchFlights={(params) => {
          if (onSearchFlights) {
            onSearchFlights(params);
          } else if (onNavigateToView) {
            onNavigateToView('flights', { searchParams: params });
          }
        }}
        onNavigateToView={onNavigateToView}
        onPlanTripPrompt={onPlanTripPrompt}
        onOpenVisaModal={onOpenVisaModal}
        onOpenQuote={onOpenQuote}
        onOpenVoiceModal={handleOpenVoicePlanner}
      />

      {/* 2. Trust Strip */}
      <TrustStrip />

      {/* 3. Voice Planning Interactive Banner */}
      <VoicePlannerBanner
        onOpenVoiceModal={handleOpenVoicePlanner}
        onNavigateToPlanner={() => onNavigateToView && onNavigateToView('planner')}
      />

      {/* 4. Curated Popular Destinations from Dhaka */}
      <DestinationSection
        destinations={destinations}
        onSelectDestination={onSelectDestination}
        onQuickGenerateItinerary={onQuickGenerateItinerary}
        onSearchFlights={onSearchFlights}
        onNavigateToDestinations={() => onNavigateToView && onNavigateToView('destinations')}
      />

      {/* 5. Flight Booking & Quotation Workflow */}
      <FlightWorkflowSection
        onNavigateToFlights={() => onNavigateToView && onNavigateToView('flights')}
      />

      {/* 6. Primary Service Grid */}
      <ServiceGrid onNavigateToView={onNavigateToView} />

      {/* 7. Featured Tour Packages */}
      <FeaturedPackagesSection
        packages={packages}
        onViewDetails={(pkg) => setActivePackageModal(pkg)}
        onRequestQuote={(pkg) => (onOpenQuote ? onOpenQuote(pkg) : setActivePackageModal(pkg))}
        onNavigateToPackages={() => onNavigateToView && onNavigateToView('packages')}
      />

      {/* 8. Visa Assistance & Checklists */}
      <VisaAssistanceSection
        onOpenVisaModal={onOpenVisaModal}
        onNavigateToVisa={() => onNavigateToView && onNavigateToView('visa')}
      />

      {/* 9. Travel Buddies Verified Preview */}
      <TravelBuddiesPreview
        onNavigateToBuddies={() => onNavigateToView && onNavigateToView('buddies')}
      />

      {/* 10. Built for Bangladeshi Travelers (Trust, Gallery & Reviews) */}
      <WhyAzraqSection />

      {/* 11. Final Focused Travel CTA */}
      <FinalTravelCta
        onPlanTrip={() => {
          if (onNavigateToView) onNavigateToView('planner');
          else onPlanTripPrompt('Plan a custom holiday from Dhaka');
        }}
        onNavigateToFlights={() => onNavigateToView && onNavigateToView('flights')}
        onNavigateToContact={() => onNavigateToView && onNavigateToView('contact')}
      />

      {/* Voice Trip Modal */}
      <VoiceTripModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onConfirmPlan={handleConfirmVoicePlan}
        initialTranscript={voiceInitialTranscript}
      />
    </div>
  );
};
