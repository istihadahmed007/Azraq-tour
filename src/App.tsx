import React, { useState } from 'react';
import { BrandTheme, Destination, Itinerary, NavView, Spot } from './types';
import { INITIAL_DESTINATIONS, INITIAL_KYOTO_ITINERARY } from './data/mockData';

import { AuthProvider } from './context/AuthContext';
import { PackageProvider } from './context/PackageContext';
import { FeedProvider } from './context/FeedContext';
import { AuthModal } from './components/AuthModal';
import { Toast } from './components/Toast';
import { Navigation } from './components/Navigation';
import { ClientLayout } from './components/ClientLayout';
import { DiscoverView } from './components/DiscoverView';
import { DestinationsView } from './components/DestinationsView';
import { FlightsView } from './components/FlightsView';
import { VisaView } from './components/VisaView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { PackagesView } from './components/PackagesView';
import { PlannerView } from './components/PlannerView';
import { FeedView } from './components/FeedView';
import { MapView } from './components/MapView';
import { ProfileView } from './components/ProfileView';
import { DestinationModal } from './components/DestinationModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { VisaQuoteModal } from './components/VisaQuoteModal';
import { FlightSearchParams } from './components/AzraqTripFinder';
import AuthCallback from './pages/AuthCallback';
import { AZRAQ_AGENCY_CONFIG } from './data/agencyConfig';

function AppContent() {
  const [currentView, setCurrentView] = useState<NavView>('discover');
  const [brandTheme, setBrandTheme] = useState<BrandTheme>('azraq');
  const [isVisaModalOpen, setIsVisaModalOpen] = useState(false);
  const [visaModalCountry, setVisaModalCountry] = useState<string | undefined>(undefined);
  const [activeFlightParams, setActiveFlightParams] = useState<FlightSearchParams | undefined>(undefined);

  // Handle Supabase Auth Callback URL if redirected here
  const isAuthCallbackRoute =
    typeof window !== 'undefined' &&
    (window.location.pathname.startsWith('/auth/callback') ||
      window.location.hash.includes('access_token=') ||
      window.location.search.includes('code='));

  if (isAuthCallbackRoute) {
    return <AuthCallback />;
  }

  // Application State
  const [destinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [currentItinerary, setCurrentItinerary] = useState<Itinerary>(INITIAL_KYOTO_ITINERARY);
  const [savedItineraries, setSavedItineraries] = useState<Itinerary[]>([INITIAL_KYOTO_ITINERARY]);
  const [modalDestination, setModalDestination] = useState<Destination | null>(null);
  const [mapSpot, setMapSpot] = useState<Spot | undefined>(undefined);

  // Toggle brand theme
  const handleToggleBrand = () => {
    setBrandTheme((prev) => (prev === 'globetrotter' ? 'azraq' : 'globetrotter'));
  };

  const handleNavigate = (view: NavView | string, extra?: any) => {
    if (extra?.params) {
      setActiveFlightParams(extra.params);
    }
    setCurrentView(view as NavView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchFlights = (params: FlightSearchParams) => {
    setActiveFlightParams(params);
    setCurrentView('flights');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick prompt handler from Discover Search Bar & Voice Trip Planner
  const handlePlanTripPrompt = async (
    input: string | {
      destination?: string;
      startDate?: string;
      endDate?: string;
      vibes?: string[];
      travelerCount?: number;
      structuredPrompt?: string;
      prompt?: string;
      durationDays?: number;
    }
  ) => {
    setCurrentView('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let destination = typeof input === 'string' ? input : input.destination || input.structuredPrompt || input.prompt || 'Bangkok, Thailand';
    let startDate = typeof input === 'object' && input.startDate ? input.startDate : '2026-11-01';
    let endDate = typeof input === 'object' && input.endDate ? input.endDate : '2026-11-07';
    let vibes = typeof input === 'object' && input.vibes ? input.vibes : ['Culture', 'Local Cuisine', 'Sightseeing'];
    let travelerCount = typeof input === 'object' && input.travelerCount ? input.travelerCount : 2;

    try {
      const response = await fetch('/api/ai/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          startDate,
          endDate,
          vibes,
          travelerCount,
        }),
      });
      const data = await response.json();
      if (data && data.title) {
        const generatedItinerary: Itinerary = {
          id: Date.now().toString(),
          title: data.title,
          destination: data.destination || destination,
          durationDays: data.durationDays || (typeof input === 'object' && input.durationDays ? input.durationDays : 5),
          weatherSummary: data.weatherSummary || '20°C Mild & Pleasant',
          aiSummary: data.aiSummary || 'AI curated itinerary based on your voice travel preferences.',
          days: data.days || [],
          packingList: data.packingList || [],
          savedAt: new Date().toISOString(),
        };
        setCurrentItinerary(generatedItinerary);
      }
    } catch (err) {
      console.error('Quick generation error:', err);
    }
  };

  // Quick generate itinerary for a specific destination
  const handleQuickGenerateItinerary = (destName: string) => {
    setCurrentView('planner');
    handlePlanTripPrompt(destName);
  };

  // Save or unsave itinerary
  const handleSaveItinerary = (itineraryToSave: Itinerary) => {
    const exists = savedItineraries.some((i) => i.id === itineraryToSave.id);
    if (exists) {
      setSavedItineraries(savedItineraries.filter((i) => i.id !== itineraryToSave.id));
    } else {
      setSavedItineraries([...savedItineraries, itineraryToSave]);
    }
  };

  // Remove saved itinerary
  const handleRemoveSavedItinerary = (id: string) => {
    setSavedItineraries(savedItineraries.filter((i) => i.id !== id));
  };

  // View spot on Map
  const handleViewOnMap = (spot?: Spot) => {
    setMapSpot(spot);
    setCurrentView('planner');
  };

  // Select destination by name (from hashtags or feed)
  const handleSelectDestinationByName = (name: string) => {
    const found = destinations.find(
      (d) =>
        d.name.toLowerCase().includes(name.toLowerCase()) ||
        d.country.toLowerCase().includes(name.toLowerCase())
    );
    if (found) {
      setModalDestination(found);
    } else {
      handleQuickGenerateItinerary(name);
    }
  };

  const handleOpenVisaQuote = (country?: string) => {
    setVisaModalCountry(country);
    setIsVisaModalOpen(true);
  };

  const isCurrentItinerarySaved = savedItineraries.some((i) => i.id === currentItinerary.id);

  return (
    <ClientLayout
      className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#0D6EFD] selection:text-white"
      mainClassName="w-full min-h-screen flex flex-col transition-all duration-300"
      navbar={(navRef) => (
        <Navigation
          ref={navRef as React.Ref<HTMLElement>}
          currentView={currentView}
          onViewChange={handleNavigate}
          brandTheme={brandTheme}
          onToggleBrand={handleToggleBrand}
          onNewTripClick={() => handleNavigate('planner')}
          savedTripsCount={savedItineraries.length}
          onOpenQuote={() => handleOpenVisaQuote()}
        />
      )}
    >
      <div className="flex-1 w-full">
        {/* Main Views */}
        {currentView === 'discover' && (
          <DiscoverView
            destinations={destinations}
            onSelectDestination={setModalDestination}
            onPlanTripPrompt={handlePlanTripPrompt}
            onQuickGenerateItinerary={handleQuickGenerateItinerary}
            onNavigateToView={handleNavigate}
            onSearchFlights={handleSearchFlights}
            onOpenVisaModal={handleOpenVisaQuote}
            onOpenQuote={() => handleOpenVisaQuote()}
          />
        )}

        {currentView === 'flights' && (
          <FlightsView
            initialParams={activeFlightParams}
            onOpenFlightModal={() => {}}
            onNavigateToView={handleNavigate}
            onOpenVisaQuote={handleOpenVisaQuote}
          />
        )}

        {currentView === 'destinations' && (
          <DestinationsView
            destinations={destinations}
            onSelectDestination={setModalDestination}
            onPlanTripPrompt={handlePlanTripPrompt}
          />
        )}

        {currentView === 'packages' && <PackagesView />}

        {currentView === 'visa' && (
          <VisaView onOpenVisaQuote={handleOpenVisaQuote} />
        )}

        {currentView === 'about' && (
          <AboutView
            onNavigateToContact={() => handleNavigate('contact')}
            onOpenTripPlanner={() => handleNavigate('planner')}
          />
        )}

        {currentView === 'contact' && <ContactView />}

        {currentView === 'planner' && (
          <PlannerView
            currentItinerary={currentItinerary}
            onUpdateItinerary={setCurrentItinerary}
            onSaveItinerary={handleSaveItinerary}
            onViewOnMap={handleViewOnMap}
            isSaved={isCurrentItinerarySaved}
            destinations={destinations}
            onSelectDestination={setModalDestination}
            onQuickGenerateItinerary={handleQuickGenerateItinerary}
            onOpenVisaQuote={handleOpenVisaQuote}
          />
        )}

        {currentView === 'feed' && (
          <FeedView
            onSelectDestinationByName={handleSelectDestinationByName}
            onNavigateToProfile={() => handleNavigate('profile')}
          />
        )}

        {currentView === 'map' && (
          <MapView
            destinations={destinations}
            onSelectDestination={setModalDestination}
            selectedSpot={mapSpot}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView
            savedItineraries={savedItineraries}
            onSelectItinerary={(itinerary) => {
              setCurrentItinerary(itinerary);
              handleNavigate('planner');
            }}
            onRemoveItinerary={handleRemoveSavedItinerary}
            onNavigateToFeed={() => handleNavigate('feed')}
            onSelectDestination={setModalDestination}
            onOpenVisaQuote={() => handleOpenVisaQuote()}
            onNavigate={(view) => handleNavigate(view)}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard onClose={() => handleNavigate('discover')} />
        )}
      </div>

      {/* Global Travel Agency Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenVisaQuote={() => handleOpenVisaQuote()}
      />

      {/* Destination Inspector Modal */}
      <DestinationModal
        destination={modalDestination}
        onClose={() => setModalDestination(null)}
        onGenerateItinerary={handleQuickGenerateItinerary}
      />

      {/* Quotation Modals */}
      <VisaQuoteModal
        isOpen={isVisaModalOpen}
        onClose={() => {
          setIsVisaModalOpen(false);
          setVisaModalCountry(undefined);
        }}
        initialCountry={visaModalCountry}
      />

      {/* Persistent Floating WhatsApp Chat Widget */}
      <FloatingWhatsAppButton
        phoneNumber={AZRAQ_AGENCY_CONFIG.whatsappNumber}
        defaultMessage="Hello Azraq! I would like to inquire about tour packages, flights, or visa assistance."
      />

      {/* Auth Modal & Toast Notifications */}
      <AuthModal brandTitle="Azraq" />
      <Toast />
    </ClientLayout>
  );
}

export function App() {
  return (
    <AuthProvider>
      <PackageProvider>
        <FeedProvider>
          <AppContent />
        </FeedProvider>
      </PackageProvider>
    </AuthProvider>
  );
}

export default App;
