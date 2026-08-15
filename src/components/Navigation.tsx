import React from 'react';
import { BrandTheme, NavView, isWebsiteOwner } from '../types';
import { BRAND_LOGOS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

interface NavigationProps {
  currentView: NavView;
  onViewChange: (view: NavView) => void;
  brandTheme: BrandTheme;
  onToggleBrand: () => void;
  onNewTripClick: () => void;
  savedTripsCount: number;
}

export const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
  (
    {
      currentView,
      onViewChange,
      brandTheme,
      onToggleBrand,
      onNewTripClick,
      savedTripsCount,
    },
    ref
  ) => {
    const { user, isGuest, openAuthModal, logout } = useAuth();

    const isAzraq = brandTheme === 'azraq';
    const brandTitle = isAzraq ? 'Azraq Tours & Travels' : 'GlobeTrotter AI';
    const brandSub = isAzraq ? 'Luxury AI Concierge' : 'Smart Itineraries';
    const logoUrl = isAzraq ? BRAND_LOGOS.azraq : BRAND_LOGOS.globetrotter;

    return (
      <>
        {/* Top Navbar */}
        <nav
          ref={ref}
          aria-label="Main Navigation"
          className="fixed top-0 w-full z-50 transition-all duration-300 bg-gradient-to-r from-[#072244]/98 via-[#0c3866]/98 to-[#072244]/98 backdrop-blur-2xl border-b border-sky-400/35 shadow-2xl shadow-sky-950/50"
        >
          <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-3.5 md:py-4 w-full mx-auto">
            {/* Brand Logo */}
            <div
              onClick={() => onViewChange('discover')}
              className="flex items-center gap-3.5 cursor-pointer group shrink-0"
            >
              <img
                src={logoUrl}
                alt={brandTitle}
                className="h-11 w-11 sm:h-12 sm:w-12 rounded-full object-cover border-2 border-sky-400/70 shadow-lg group-hover:scale-105 transition-transform"
              />
              <div className="flex items-center gap-2.5">
                <span className="font-extrabold text-lg sm:text-xl md:text-2xl tracking-tight text-white group-hover:text-sky-300 transition-colors">
                  {brandTitle}
                </span>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-sky-500/30 text-sky-200 border border-sky-400/60 shadow-sm">
                  AI
                </span>
              </div>
            </div>

            {/* Desktop Capsule Navigation Links */}
            <div className="hidden lg:flex items-center gap-2 bg-[#061c36]/90 px-4 py-2 rounded-full border border-sky-400/35 shadow-inner">
              <button
                onClick={() => onViewChange('enroute')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                  currentView === 'enroute'
                    ? 'bg-[#103056] text-cyan-300 border border-cyan-400/60 shadow-sm'
                    : 'text-[#38bdf8] hover:text-cyan-200'
                }`}
              >
                EnRoute PWA
              </button>

              <button
                onClick={() => onViewChange('discover')}
                className={`px-4.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                  currentView === 'discover'
                    ? 'bg-[#103056] text-white border border-sky-400/60 shadow-md'
                    : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                Discover
              </button>

              <button
                onClick={() => onViewChange('feed')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all relative flex items-center gap-1.5 cursor-pointer ${
                  currentView === 'feed'
                    ? 'bg-[#103056] text-[#f472b6] border border-pink-400/60 shadow-sm'
                    : 'text-[#f472b6] hover:text-pink-200'
                }`}
              >
                <span>Travel Buddies</span>
                <span className="w-2 h-2 rounded-full bg-[#facc15] shadow-xs"></span>
              </button>

              <button
                onClick={() => onViewChange('packages')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all relative flex items-center gap-1.5 cursor-pointer ${
                  currentView === 'packages'
                    ? 'bg-[#103056] text-white border border-emerald-400/60 shadow-sm'
                    : 'text-white hover:text-slate-200'
                }`}
              >
                <span>Tour Packages</span>
                <span className="w-2 h-2 rounded-full bg-[#4ade80] shadow-xs"></span>
              </button>

              <button
                onClick={() => onViewChange('planner')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  currentView === 'planner'
                    ? 'bg-[#103056] text-white border border-sky-400/60 shadow-sm'
                    : 'text-white hover:text-slate-200'
                }`}
              >
                <span>Planner</span>
              </button>

              <button
                onClick={() => onViewChange('map')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  currentView === 'map'
                    ? 'bg-[#103056] text-white border border-sky-400/60 shadow-sm'
                    : 'text-white hover:text-slate-200'
                }`}
              >
                Map
              </button>

              <button
                onClick={() => onViewChange('profile')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  currentView === 'profile'
                    ? 'bg-[#103056] text-white border border-sky-400/60 shadow-sm'
                    : 'text-white hover:text-slate-200'
                }`}
              >
                Profile
              </button>

              {/* Bell & Compass Icons */}
              <div className="flex items-center gap-2 pl-2.5 border-l border-sky-400/20">
                <button
                  onClick={() => onViewChange('planner')}
                  className="p-1.5 text-slate-200 hover:text-white relative cursor-pointer transition-colors"
                  title="Notifications"
                >
                  <span className="material-symbols-outlined text-lg">notifications</span>
                  <span className="w-2 h-2 rounded-full bg-[#facc15] absolute top-1 right-1"></span>
                </button>

                <button
                  onClick={() => onViewChange('discover')}
                  className="p-1.5 text-slate-200 hover:text-white cursor-pointer transition-colors"
                  title="Explore"
                >
                  <span className="material-symbols-outlined text-lg">explore</span>
                </button>
              </div>
            </div>

            {/* Right Controls: Log In & Sign Up */}
            <div className="flex items-center gap-3">
              {isGuest ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-4.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-[#0A223E] hover:bg-[#11355e] transition-all border border-sky-400/40 flex items-center gap-2 min-h-[42px] cursor-pointer shadow-md"
                  >
                    <span className="material-symbols-outlined text-lg text-sky-400">login</span>
                    <span>Log In</span>
                  </button>

                  <button
                    onClick={() => openAuthModal('register')}
                    className="px-5.5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold text-slate-950 bg-gradient-to-r from-sky-300 via-cyan-300 to-sky-400 hover:from-sky-200 hover:to-cyan-200 transition-all shadow-lg shadow-sky-500/30 flex items-center gap-2 min-h-[42px] cursor-pointer active:scale-95 border border-sky-200/50"
                  >
                    <span className="material-symbols-outlined text-lg text-slate-950 font-bold">person_add</span>
                    <span>Sign Up</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <div
                    onClick={() => onViewChange('profile')}
                    className="flex items-center gap-2.5 p-1.5 pr-4 rounded-full hover:bg-sky-500/20 cursor-pointer transition-all border border-sky-400/50 bg-[#072448]/90 shadow-md"
                    title={`${user?.fullName} - Go to My Dashboard`}
                  >
                    <img
                      src={
                        user?.photoURL ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                          user?.fullName || user?.email || 'traveler'
                        )}`
                      }
                      alt={user?.fullName || 'Traveler'}
                      className="w-8 h-8 rounded-full object-cover border border-[#00d2ff]/80 shadow-sm"
                    />
                    <span className="text-xs sm:text-sm font-bold text-white max-w-[120px] truncate leading-tight">
                      {user?.fullName?.split(' ')[0] || 'Traveler'}
                    </span>
                  </div>

                  <button
                    onClick={logout}
                    title="Log Out"
                    className="p-2 rounded-xl hover:bg-rose-500/20 text-sky-200 hover:text-rose-300 transition-colors cursor-pointer min-h-[38px] flex items-center justify-center border border-sky-400/20"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Desktop Sidebar Navigation */}
        <aside
          style={{ paddingTop: 'calc(var(--navbar-height, 80px) + 20px)' }}
          className="hidden md:flex flex-col h-screen w-72 fixed left-0 top-0 z-40 bg-gradient-to-b from-[#072244]/98 via-[#092d56]/98 to-[#061c36]/98 backdrop-blur-2xl border-r border-sky-400/35 shadow-2xl shadow-sky-950/60 pb-8 px-5 gap-5"
        >
          <div className="px-3 pt-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Azraq Tours<br />& Travels
            </h2>
            <p className="text-xs sm:text-sm text-sky-300 mt-1.5 font-medium tracking-wide">Luxury AI Concierge</p>
          </div>

          <nav className="flex flex-col gap-2.5 flex-1 overflow-y-auto hide-scrollbar pt-2">
            {/* Discover - Exactly framed with cyan outline in active state */}
            <button
              onClick={() => onViewChange('discover')}
              className={`flex items-center gap-4 px-4.5 py-3.5 rounded-2xl transition-all font-bold text-sm text-left cursor-pointer ${
                currentView === 'discover'
                  ? 'border-2 border-sky-400 text-white bg-sky-500/20 shadow-lg shadow-sky-500/25'
                  : 'text-slate-200 hover:bg-sky-500/10 hover:text-white border border-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-2xl text-sky-300">travel_explore</span>
              <span className="text-[15px]">Discover</span>
            </button>

            {/* Tour Packages */}
            <button
              onClick={() => onViewChange('packages')}
              className={`flex items-center gap-4 px-4.5 py-3.5 rounded-2xl transition-all font-bold text-sm text-left cursor-pointer ${
                currentView === 'packages'
                  ? 'border-2 border-sky-400 text-white bg-sky-500/20 shadow-lg shadow-sky-500/25'
                  : 'text-slate-200 hover:bg-sky-500/10 hover:text-white border border-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-2xl text-sky-300">business_center</span>
              <span className="text-[15px]">Tour Packages</span>
            </button>

            {/* Planner */}
            <button
              onClick={() => onViewChange('planner')}
              className={`flex items-center gap-4 px-4.5 py-3.5 rounded-2xl transition-all font-bold text-sm text-left cursor-pointer ${
                currentView === 'planner'
                  ? 'border-2 border-sky-400 text-white bg-sky-500/20 shadow-lg shadow-sky-500/25'
                  : 'text-slate-200 hover:bg-sky-500/10 hover:text-white border border-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-2xl text-sky-300">event_note</span>
              <span className="text-[15px]">Planner</span>
            </button>

            {/* Travel Buddies */}
            <button
              onClick={() => onViewChange('feed')}
              className={`flex items-center justify-between px-4.5 py-3.5 rounded-2xl transition-all font-bold text-sm text-left cursor-pointer ${
                currentView === 'feed'
                  ? 'border-2 border-pink-400 text-white bg-pink-500/20 shadow-lg shadow-pink-500/25'
                  : 'text-slate-200 hover:bg-sky-500/10 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-2xl text-[#f472b6]">group</span>
                <span className="text-[15px] text-white">Travel Buddies</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#831843]/90 text-[#f472b6] font-extrabold border border-pink-400/40">
                Social
              </span>
            </button>

            {/* Map */}
            <button
              onClick={() => onViewChange('map')}
              className={`flex items-center gap-4 px-4.5 py-3.5 rounded-2xl transition-all font-bold text-sm text-left cursor-pointer ${
                currentView === 'map'
                  ? 'border-2 border-sky-400 text-white bg-sky-500/20 shadow-lg shadow-sky-500/25'
                  : 'text-slate-200 hover:bg-sky-500/10 hover:text-white border border-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-2xl text-sky-300">map</span>
              <span className="text-[15px]">Map</span>
            </button>

            {/* Profile */}
            <button
              onClick={() => onViewChange('profile')}
              className={`flex items-center gap-4 px-4.5 py-3.5 rounded-2xl transition-all font-bold text-sm text-left cursor-pointer ${
                currentView === 'profile'
                  ? 'border-2 border-sky-400 text-white bg-sky-500/20 shadow-lg shadow-sky-500/25'
                  : 'text-slate-200 hover:bg-sky-500/10 hover:text-white border border-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-2xl text-sky-300">account_circle</span>
              <span className="text-[15px]">Profile</span>
            </button>
          </nav>

          {/* Bottom Travel Desk Card */}
          <div className="p-3.5 rounded-2xl bg-[#061c36]/90 border border-sky-400/30 space-y-2.5 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider text-sky-300 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                24/7 TRAVEL DESK
              </span>
              <span className="text-xs text-sky-200 font-semibold">Azraq</span>
            </div>

            <a
              href="https://wa.me/8801851172032?text=Hello%20Azraq%20Tours%20%26%20Travels!%20I%20would%20like%20assistance%20planning%20my%20trip."
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-200 hover:text-white transition-all text-xs font-bold group"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-emerald-400">chat</span>
                <span className="font-mono text-xs font-bold">01851172032</span>
              </div>
              <span className="text-[10px] text-sky-300 font-bold uppercase">WhatsApp ↗</span>
            </a>
          </div>
        </aside>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#072244]/98 backdrop-blur-2xl border-t border-sky-400/30 px-3 py-2.5 flex justify-around items-center shadow-2xl">
          <button
            onClick={() => onViewChange('discover')}
            className={`flex flex-col items-center gap-1 min-h-[48px] px-2 py-1 rounded-xl transition-colors ${
              currentView === 'discover' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">travel_explore</span>
            <span className="text-[12px] font-medium tracking-tight">Discover</span>
          </button>

          <button
            onClick={() => onViewChange('packages')}
            className={`flex flex-col items-center gap-1 min-h-[48px] px-2 py-1 rounded-xl transition-colors ${
              currentView === 'packages' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">business_center</span>
            <span className="text-[12px] font-medium tracking-tight">Packages</span>
          </button>

          <button
            onClick={() => onViewChange('planner')}
            className={`flex flex-col items-center gap-1 min-h-[48px] px-2 py-1 rounded-xl transition-colors relative ${
              currentView === 'planner' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">event_note</span>
            <span className="text-[12px] font-medium tracking-tight">Planner</span>
          </button>

          <button
            onClick={() => onViewChange('feed')}
            className={`flex flex-col items-center gap-1 min-h-[48px] px-2 py-1 rounded-xl transition-colors relative ${
              currentView === 'feed' ? 'text-pink-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">group</span>
            <span className="text-[12px] font-medium tracking-tight">Buddies</span>
          </button>

          <button
            onClick={() => onViewChange('profile')}
            className={`flex flex-col items-center gap-1 min-h-[48px] px-2 py-1 rounded-xl transition-colors ${
              currentView === 'profile' ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">account_circle</span>
            <span className="text-[12px] font-medium tracking-tight">Profile</span>
          </button>
        </nav>
      </>
    );
  }
);

Navigation.displayName = 'Navigation';
