import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Compass,
  User,
  Inbox,
  BookOpen,
  Search,
  Filter,
  ShieldCheck,
  Users,
  Sparkles,
  RefreshCw,
  Plus,
  Lock,
  ArrowRight,
} from 'lucide-react';
import {
  TravelBuddyProfile,
  TravelBuddyRequest,
  MatchedTravelBuddy,
} from '../../types';
import {
  fetchBuddyProfiles,
  fetchMyBuddyProfile,
  saveBuddyProfile,
  fetchUserRequests,
  sendBuddyRequest,
  respondToBuddyRequest,
  cancelBuddyRequest,
  calculateBuddyMatch,
  filterBuddyProfiles,
  AVAILABLE_DESTINATIONS,
  AVAILABLE_TRAVEL_STYLES,
  DEMO_BUDDY_PROFILES,
} from '../../lib/travelBuddyQueries';
import { useAuth } from '../../context/AuthContext';
import { TravelBuddyCard } from './TravelBuddyCard';
import { TravelBuddyConnectModal } from './TravelBuddyConnectModal';
import { TravelBuddyProfileEditor } from './TravelBuddyProfileEditor';
import { TravelBuddyRequests } from './TravelBuddyRequests';
import { TravelBuddiesFeed } from './TravelBuddiesFeed';

export type BuddyTabType = 'find' | 'profile' | 'requests' | 'stories';

interface TravelBuddiesHubProps {
  initialTab?: BuddyTabType;
  onSelectDestinationByName?: (name: string) => void;
  onNavigateToProfile?: () => void;
}

export const TravelBuddiesHub: React.FC<TravelBuddiesHubProps> = ({
  initialTab = 'find',
  onSelectDestinationByName,
  onNavigateToProfile,
}) => {
  const { user, isGuest, openAuthModal, showToast } = useAuth();

  const [activeTab, setActiveTab] = useState<BuddyTabType>(initialTab);
  const [profiles, setProfiles] = useState<TravelBuddyProfile[]>([]);
  const [myProfile, setMyProfile] = useState<TravelBuddyProfile | null>(null);
  const [requests, setRequests] = useState<TravelBuddyRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [selectedStyle, setSelectedStyle] = useState('All');

  // Modal State
  const [selectedCandidate, setSelectedCandidate] =
    useState<MatchedTravelBuddy | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  // Load all profiles, user profile, and user requests
  const loadData = useCallback(async () => {
    try {
      const [fetchedProfiles, fetchedMyProfile, fetchedRequests] =
        await Promise.all([
          fetchBuddyProfiles(),
          user ? fetchMyBuddyProfile(user.uid) : Promise.resolve(null),
          user ? fetchUserRequests(user.uid) : Promise.resolve([]),
        ]);

      setProfiles(
        fetchedProfiles.length > 0 ? fetchedProfiles : DEMO_BUDDY_PROFILES
      );
      setMyProfile(fetchedMyProfile);
      setRequests(fetchedRequests);
    } catch {
      setProfiles(DEMO_BUDDY_PROFILES);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Compute matched candidate list with match scores
  const matchedBuddies: MatchedTravelBuddy[] = useMemo(() => {
    // 1. Filter out inactive profiles & current user
    const candidateProfiles = profiles.filter((p) => {
      if (!p.isActive) return false;
      if (user && p.id === user.uid) return false;
      return true;
    });

    // 2. Score each candidate against current user's profile and requests
    const list = candidateProfiles.map((candidate) =>
      calculateBuddyMatch(
        myProfile,
        candidate,
        requests,
        user?.uid
      )
    );

    // 3. Sort by highest match score first
    list.sort((a, b) => b.matchScore - a.matchScore);

    return list;
  }, [profiles, myProfile, requests, user]);

  // Filter matched candidates by search input, destination, and travel style
  const filteredBuddies = useMemo(() => {
    return filterBuddyProfiles(
      matchedBuddies,
      searchQuery,
      selectedDestination,
      selectedStyle
    );
  }, [matchedBuddies, searchQuery, selectedDestination, selectedStyle]);

  // Pending incoming requests count
  const pendingIncomingCount = useMemo(() => {
    if (!user) return 0;
    return requests.filter(
      (r) => r.receiverId === user.uid && r.status === 'pending'
    ).length;
  }, [requests, user]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    showToast('Travel buddy list refreshed.', 'info');
  };

  const handleOpenConnectModal = (buddy: MatchedTravelBuddy) => {
    if (isGuest || !user) {
      openAuthModal();
      showToast('Please sign in to connect with fellow travelers.', 'info');
      return;
    }
    setSelectedCandidate(buddy);
    setIsConnectModalOpen(true);
  };

  const handleSendRequest = async (receiverId: string, message: string) => {
    if (!user) {
      openAuthModal();
      return { success: false, error: 'Authentication required' };
    }

    const candidate = profiles.find((p) => p.id === receiverId);
    const result = await sendBuddyRequest(
      user.uid,
      receiverId,
      message,
      myProfile || {
        displayName: user.fullName || 'Azraq Traveler',
        avatarUrl: user.photoURL,
        homeLocation: user.homeLocation || 'Bangladesh',
      },
      candidate
        ? {
            displayName: candidate.displayName,
            avatarUrl: candidate.avatarUrl,
            homeLocation: candidate.homeLocation,
            destinations: candidate.destinations,
          }
        : undefined
    );

    if (result.success) {
      showToast('Connection request sent!', 'success');
      // Refresh requests list
      const updatedRequests = await fetchUserRequests(user.uid);
      setRequests(updatedRequests);
    }
    return result;
  };

  const handleAcceptRequest = async (requestId: string) => {
    if (!user) return;
    const res = await respondToBuddyRequest(requestId, 'accepted', user.uid);
    if (res.success) {
      showToast('Connection accepted!', 'success');
      const updatedRequests = await fetchUserRequests(user.uid);
      setRequests(updatedRequests);
    } else {
      showToast('Failed to accept connection.', 'error');
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    if (!user) return;
    const res = await respondToBuddyRequest(requestId, 'declined', user.uid);
    if (res.success) {
      showToast('Request declined.', 'info');
      const updatedRequests = await fetchUserRequests(user.uid);
      setRequests(updatedRequests);
    } else {
      showToast('Failed to decline request.', 'error');
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    if (!user) return;
    const res = await cancelBuddyRequest(requestId, user.uid);
    if (res.success) {
      showToast('Request cancelled.', 'info');
      const updatedRequests = await fetchUserRequests(user.uid);
      setRequests(updatedRequests);
    } else {
      showToast('Failed to cancel request.', 'error');
    }
  };

  const handleSaveProfile = async (profile: TravelBuddyProfile) => {
    const res = await saveBuddyProfile(profile);
    if (res.success) {
      setMyProfile(profile);
      await loadData();
    }
    return res;
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDestination('All');
    setSelectedStyle('All');
  };

  return (
    <div id="azraq-travel-buddies-hub" className="min-h-screen bg-slate-50/50 pb-20 dark:bg-slate-950">
      {/* Hero Header */}
      <div className="border-b border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200 dark:border-sky-800 mb-3">
                <Users className="h-3.5 w-3.5" />
                Azraq Travel Buddies
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Find someone going your way.
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Match with fellow Bangladeshi and international travelers by destination, overlapping dates, language, and travel style. Contact information stays completely private until both travelers accept.
              </p>
            </div>

            {/* Quick Action / Status Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                id="btn-refresh-buddies"
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 min-h-[44px]"
                title="Refresh listings"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              {!myProfile && (
                <button
                  id="btn-create-my-buddy-profile"
                  type="button"
                  onClick={() => {
                    if (isGuest || !user) {
                      openAuthModal();
                      showToast('Please sign in to set up your Travel Buddy profile.', 'info');
                    } else {
                      setActiveTab('profile');
                    }
                  }}
                  className="flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-sky-500 min-h-[44px]"
                >
                  <Plus className="h-4 w-4" />
                  <span>Set Up Your Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Privacy & Safety Statement Banner */}
          <div className="mt-6 flex items-center gap-3 rounded-xl bg-slate-100/90 px-4 py-3 text-xs text-slate-600 dark:bg-slate-800/80 dark:text-slate-300">
            <Lock className="h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />
            <div className="flex-1">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Privacy Guarantee:
              </span>{' '}
              Personal contact details remain hidden until you both connect. Never share passports or payment documents.
            </div>
          </div>

          {/* 4 Main Tabs Navigation */}
          <div className="mt-8 flex overflow-x-auto border-b border-slate-200 no-scrollbar dark:border-slate-800">
            <button
              id="tab-find-buddies"
              type="button"
              onClick={() => setActiveTab('find')}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-5 py-3.5 text-xs font-bold transition-all min-h-[44px] ${
                activeTab === 'find'
                  ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
                  : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Compass className="h-4 w-4" />
              <span>Find Buddies</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {filteredBuddies.length}
              </span>
            </button>

            <button
              id="tab-my-profile"
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-5 py-3.5 text-xs font-bold transition-all min-h-[44px] ${
                activeTab === 'profile'
                  ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
                  : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <User className="h-4 w-4" />
              <span>My Profile</span>
              {myProfile && (
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              )}
            </button>

            <button
              id="tab-requests"
              type="button"
              onClick={() => setActiveTab('requests')}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-5 py-3.5 text-xs font-bold transition-all min-h-[44px] ${
                activeTab === 'requests'
                  ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
                  : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Inbox className="h-4 w-4" />
              <span>Requests</span>
              {pendingIncomingCount > 0 && (
                <span className="rounded-full bg-sky-600 px-2 py-0.5 text-[10px] font-bold text-white">
                  {pendingIncomingCount}
                </span>
              )}
            </button>

            <button
              id="tab-community-stories"
              type="button"
              onClick={() => setActiveTab('stories')}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-5 py-3.5 text-xs font-bold transition-all min-h-[44px] ${
                activeTab === 'stories'
                  ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
                  : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Community Stories</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Views */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: FIND BUDDIES */}
        {activeTab === 'find' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                {/* Search Input */}
                <div className="sm:col-span-6 relative">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    id="input-search-buddies"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, city, destination, or interests..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white min-h-[44px]"
                  />
                </div>

                {/* Destination Filter */}
                <div className="sm:col-span-3">
                  <select
                    id="select-filter-destination"
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white min-h-[44px]"
                  >
                    <option value="All">All Destinations</option>
                    {AVAILABLE_DESTINATIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Travel Style Filter */}
                <div className="sm:col-span-3">
                  <select
                    id="select-filter-style"
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white min-h-[44px]"
                  >
                    <option value="All">All Travel Styles</option>
                    {AVAILABLE_TRAVEL_STYLES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Filter Chips & Clear Option */}
              {(searchQuery ||
                selectedDestination !== 'All' ||
                selectedStyle !== 'All') && (
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-slate-500">Filtered by:</span>
                    {searchQuery && (
                      <span className="rounded-md bg-sky-50 px-2 py-0.5 font-medium text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                        Query: "{searchQuery}"
                      </span>
                    )}
                    {selectedDestination !== 'All' && (
                      <span className="rounded-md bg-sky-50 px-2 py-0.5 font-medium text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                        {selectedDestination}
                      </span>
                    )}
                    {selectedStyle !== 'All' && (
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                        {selectedStyle}
                      </span>
                    )}
                  </div>
                  <button
                    id="btn-reset-filters"
                    type="button"
                    onClick={handleResetFilters}
                    className="font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* Travel Buddy Cards Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                  />
                ))}
              </div>
            ) : filteredBuddies.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 mb-3">
                  <Search className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  No Travel Buddies Found
                </h3>
                <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                  Try adjusting your destination or travel style filters to view more travel companions.
                </p>
                <button
                  id="btn-clear-empty-filters"
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-5 rounded-xl bg-sky-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-sky-500 min-h-[44px]"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredBuddies.map((buddy) => (
                  <TravelBuddyCard
                    key={buddy.id}
                    buddy={buddy}
                    isCurrentUser={user ? buddy.id === user.uid : false}
                    onConnectClick={handleOpenConnectModal}
                    onEditProfileClick={() => setActiveTab('profile')}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY PROFILE */}
        {activeTab === 'profile' && (
          <TravelBuddyProfileEditor
            existingProfile={myProfile}
            onSave={handleSaveProfile}
            onViewBuddiesTab={() => setActiveTab('find')}
          />
        )}

        {/* TAB 3: REQUESTS */}
        {activeTab === 'requests' && (
          <TravelBuddyRequests
            requests={requests}
            currentUserId={user?.uid || ''}
            onAccept={handleAcceptRequest}
            onDecline={handleDeclineRequest}
            onCancel={handleCancelRequest}
            onNavigateToFindBuddies={() => setActiveTab('find')}
          />
        )}

        {/* TAB 4: COMMUNITY STORIES */}
        {activeTab === 'stories' && (
          <div className="space-y-6">
            <TravelBuddiesFeed
              onSelectDestinationByName={onSelectDestinationByName}
              onNavigateToProfile={onNavigateToProfile}
            />
          </div>
        )}
      </div>

      {/* Connect Request Modal */}
      <TravelBuddyConnectModal
        isOpen={isConnectModalOpen}
        buddy={selectedCandidate}
        onClose={() => setIsConnectModalOpen(false)}
        onSendRequest={handleSendRequest}
        onAcceptIncoming={handleAcceptRequest}
        onDeclineIncoming={handleDeclineRequest}
      />
    </div>
  );
};
