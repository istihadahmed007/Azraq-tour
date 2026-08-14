import React, { useState } from 'react';
import { BrandTheme, Destination, Itinerary, NavView, Spot } from './types';
import { INITIAL_DESTINATIONS, INITIAL_KYOTO_ITINERARY } from './data/mockData';

import { AuthProvider } from './context/AuthContext';
import { PackageProvider } from './context/PackageContext';
import { FeedProvider } from './context/FeedContext';
import { BlogProvider } from './context/BlogContext';
import { AuthModal } from './components/AuthModal';
import { Toast } from './components/Toast';
import { Navigation } from './components/Navigation';
import { DiscoverView } from './components/DiscoverView';
import { PackagesView } from './components/PackagesView';
import { PlannerView } from './components/PlannerView';
import { FeedView } from './components/FeedView';
import { BlogView } from './components/BlogView';
import { SocialProofTicker } from './components/SocialProofTicker';
import { MapView } from './components/MapView';
import { ProfileView } from './components/ProfileView';
import { DestinationModal } from './components/DestinationModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { FlightQuoteModal } from './components/FlightQuoteModal';
import { VisaQuoteModal } from './components/VisaQuoteModal';
import AuthCallback from './pages/AuthCallback';

function AppContent() {
  const [currentView, setCurrentView] = useState<NavView>('discover');
  const [brandTheme, setBrandTheme] = useState<BrandTheme>('azraq');
  const [isFooterVisaModalOpen, setIsFooterVisaModalOpen] = useState(false);
  const [isFooterFlightModalOpen, setIsFooterFlightModalOpen] = useState(false);

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

  // Toggle brand theme (GlobeTrotter AI vs Azraq Tours & Travels)
  const handleToggleBrand = () => {
    setBrandTheme((prev) => (prev === 'globetrotter' ? 'azraq' : 'globetrotter'));
  };

  // Quick prompt handler from Discover Search Bar
  const handlePlanTripPrompt = async (promptText: string) => {
    setCurrentView('planner');
    // Try generating itinerary for that prompt
    try {
      const response = await fetch('/api/ai/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: promptText,
          startDate: '2026-11-01',
          endDate: '2026-11-07',
          vibes: ['Culture', 'Local Cuisine', 'Sightseeing'],
        }),
      });
      const data = await response.json();
      if (data && data.title) {
        const generatedItinerary: Itinerary = {
          id: Date.now().toString(),
          title: data.title,
          destination: data.destination || promptText,
          durationDays: data.durationDays || 5,
          weatherSummary: data.weatherSummary || '20°C Mild & Pleasant',
          aiSummary: data.aiSummary || 'AI curated itinerary based on your search.',
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
    setCurrentView('map');
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

  const isCurrentItinerarySaved = savedItineraries.some((i) => i.id === currentItinerary.id);

  return (
    <div className={`min-h-screen text-[#f0f9ff] sky-natural-bg font-sans selection:bg-[#0284c7] selection:text-white ${brandTheme === 'azraq' ? 'azraq-mode' : ''}`}>
      {/* Top and Side Navigation */}
      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
        brandTheme={brandTheme}
        onToggleBrand={handleToggleBrand}
        onNewTripClick={() => setCurrentView('planner')}
        savedTripsCount={savedItineraries.length}
      />

      {/* Main View Area */}
      <main className="md:ml-64 transition-all duration-300">
        {currentView === 'discover' && (
          <DiscoverView
            destinations={destinations}
            onSelectDestination={setModalDestination}
            onPlanTripPrompt={handlePlanTripPrompt}
            onQuickGenerateItinerary={handleQuickGenerateItinerary}
          />
        )}

        {currentView === 'packages' && <PackagesView />}

        {currentView === 'planner' && (
          <PlannerView
            currentItinerary={currentItinerary}
            onUpdateItinerary={setCurrentItinerary}
            onSaveItinerary={handleSaveItinerary}
            onViewOnMap={handleViewOnMap}
            isSaved={isCurrentItinerarySaved}
          />
        )}

        {currentView === 'feed' && (
          <FeedView
            onSelectDestinationByName={handleSelectDestinationByName}
            onNavigateToProfile={() => setCurrentView('profile')}
          />
        )}

        {currentView === 'blog' && (
          <BlogView
            onNavigateToView={(v) => setCurrentView(v as NavView)}
            onOpenFlightQuote={() => setIsFooterFlightModalOpen(true)}
            onOpenVisaQuote={() => setIsFooterVisaModalOpen(true)}
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
              setCurrentView('planner');
            }}
            onRemoveItinerary={handleRemoveSavedItinerary}
            onNavigateToFeed={() => setCurrentView('feed')}
            onSelectDestination={setModalDestination}
            onOpenFlightQuote={() => setIsFooterFlightModalOpen(true)}
            onOpenVisaQuote={() => setIsFooterVisaModalOpen(true)}
            onNavigate={(view) => setCurrentView(view as NavView)}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard onClose={() => setCurrentView('discover')} />
        )}

        {/* Global Travel Agency Footer */}
        <Footer
          onNavigate={(view) => setCurrentView(view as NavView)}
          onOpenVisaQuote={() => setIsFooterVisaModalOpen(true)}
          onOpenFlightQuote={() => setIsFooterFlightModalOpen(true)}
        />
      </main>

      {/* Floating Live Social Proof Toast (Option 2 - High Conversion Proof) */}
      <SocialProofTicker variant="toast" />

      {/* Destination Inspector Modal */}
      <DestinationModal
        destination={modalDestination}
        onClose={() => setModalDestination(null)}
        onGenerateItinerary={handleQuickGenerateItinerary}
      />

      {/* Footer Quotation Modals */}
      <VisaQuoteModal
        isOpen={isFooterVisaModalOpen}
        onClose={() => setIsFooterVisaModalOpen(false)}
      />

      <FlightQuoteModal
        isOpen={isFooterFlightModalOpen}
        onClose={() => setIsFooterFlightModalOpen(false)}
      />

      {/* Persistent Floating WhatsApp Chat Widget */}
      <FloatingWhatsAppButton
        phoneNumber="8801851172032"
        defaultMessage="Hello Azraq Tours & Travels! I would like to inquire about a Flight / Visa Quotation."
      />

      {/* Auth Modal & Toast Notifications */}
      <AuthModal brandTitle="Azraq Tours & Travels" />
      <Toast />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <PackageProvider>
        <FeedProvider>
          <BlogProvider>
            <AppContent />
          </BlogProvider>
        </FeedProvider>
      </PackageProvider>
    </AuthProvider>
  );
}

export default App;
