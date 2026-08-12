import React, { useState } from 'react';
import { BrandTheme, Destination, FeedPost, Itinerary, NavView, Spot, isWebsiteOwner } from './types';
import {
  INITIAL_DESTINATIONS,
  INITIAL_FEED_POSTS,
  INITIAL_KYOTO_ITINERARY,
  TRENDING_HASHTAGS,
} from './data/mockData';

import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { Toast } from './components/Toast';
import { Navigation } from './components/Navigation';
import { DiscoverView } from './components/DiscoverView';
import { PlannerView } from './components/PlannerView';
import { FeedView } from './components/FeedView';
import { MapView } from './components/MapView';
import { ProfileView } from './components/ProfileView';
import { DestinationModal } from './components/DestinationModal';
import { AdminDashboard } from './components/AdminDashboard';

function AppContent() {
  const { user, loginWithEmail } = useAuth();
  const [currentView, setCurrentView] = useState<NavView>('discover');
  const [brandTheme, setBrandTheme] = useState<BrandTheme>('azraq');

  // Application State
  const [destinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(INITIAL_FEED_POSTS);
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

  // Add new post from Feed
  const handleAddPost = (newPost: FeedPost) => {
    setFeedPosts([newPost, ...feedPosts]);
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
  const bookmarkedPosts = feedPosts.filter((p) => p.isBookmarked);

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
            posts={feedPosts}
            trendingHashtags={TRENDING_HASHTAGS}
            onAddPost={handleAddPost}
            onSelectDestinationByName={handleSelectDestinationByName}
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
            bookmarkedPosts={bookmarkedPosts}
            onSelectItinerary={(itinerary) => {
              setCurrentItinerary(itinerary);
              setCurrentView('planner');
            }}
            onRemoveItinerary={handleRemoveSavedItinerary}
          />
        )}

        {currentView === 'admin' && (
          isWebsiteOwner(user) ? (
            <AdminDashboard onClose={() => setCurrentView('discover')} />
          ) : (
            <div className="w-full max-w-2xl mx-auto px-4 pt-28 pb-20 text-center flex flex-col items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-4xl shadow-2xl">
                🛡️
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold font-serif-display text-white">
                  Website Owner Access Only
                </h2>
                <p className="text-sm text-sky-200/80 max-w-md mx-auto leading-relaxed">
                  The Quotation Management Admin Portal is strictly reserved for the website owner and authorized agency administrators to manage customer flight and visa quotes.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
                <button
                  onClick={async () => {
                    await loginWithEmail('alex@globetrotter.ai', 'pass1234');
                  }}
                  className="px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all shadow-xl flex items-center gap-2 active:scale-95"
                >
                  <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                  <span>Sign In as Website Owner</span>
                </button>
                <button
                  onClick={() => setCurrentView('discover')}
                  className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all border border-white/15"
                >
                  Back to Explorer
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Destination Inspector Modal */}
      <DestinationModal
        destination={modalDestination}
        onClose={() => setModalDestination(null)}
        onGenerateItinerary={handleQuickGenerateItinerary}
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
      <AppContent />
    </AuthProvider>
  );
}

export default App;
