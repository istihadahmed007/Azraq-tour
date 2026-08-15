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
          className="fixed top-0 w-full z-50 transition-all duration-300 bg-[#071626]/95 backdrop-blur-xl border-b border-sky-500/20 shadow-2xl"
        >
          <div className="flex justify-between items-center px-4 md:px-6 py-2.5 w-full mx-auto">
            {/* Brand Logo */}
            <div
              onClick={() => onViewChange('discover')}
              className="flex items-center gap-3 cursor-pointer group shrink-0"
            >
              <img
                src={logoUrl}
                alt={brandTitle}
                className="h-10 w-10 rounded-full object-cover border border-sky-400/60 shadow-md group-hover:scale-105 transition-transform"
              />
              <div className="flex items-center gap-2">
                <span className="font-bold text-base md:text-xl tracking-tight text-[#38bdf8] group-hover:text-white transition-colors">
                  {brandTitle}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-200 border border-sky-400/40">
                  AI
                </span>
              </div>
            </div>

            {/* Desktop Capsule Navigation Links */}
            <div className="hidden lg:flex items-center gap-1.5 bg-[#0B1522]/90 px-3.5 py-1.5 rounded-full border border-sky-400/25 shadow-inner">
              <button
                onClick={() => onViewChange('enroute')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  currentView === 'enroute'
                    ? 'bg-[#132032] text-cyan-300 border border-cyan-400/40 shadow-sm'
                    : 'text-[#00d2ff] hover:text-cyan-200'
                }`}
              >
                EnRoute PWA
              </button>

              <button
                onClick={() => onViewChange('discover')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  currentView === 'discover'
                    ? 'bg-[#132032] text-white border border-sky-400/40 shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Discover
              </button>

              <button
                onClick={() => onViewChange('feed')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all relative flex items-center gap-1 cursor-pointer ${
                  currentView === 'feed'
                    ? 'bg-[#132032] text-[#f472b6] border border-pink-400/40 shadow-sm'
                    : 'text-[#f472b6] hover:text-pink-200'
                }`}
              >
                <span>Travel Buddies</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#facc15]"></span>
              </button>

              <button
                onClick={() => onViewChange('packages')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all relative flex items-center gap-1 cursor-pointer ${
                  currentView === 'packages'
                    ? 'bg-[#132032] text-white font-bold border border-emerald-400/40 shadow-sm'
                    : 'text-white hover:text-slate-200'
                }`}
              >
                <span>Tour Packages</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]"></span>
              </button>

              <button
                onClick={() => onViewChange('planner')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'planner'
                    ? 'bg-[#132032] text-white font-bold border border-sky-400/40 shadow-sm'
                    : 'text-white hover:text-slate-200'
                }`}
              >
                <span>Planner</span>
              </button>

              <button
                onClick={() => onViewChange('map')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'map'
                    ? 'bg-[#132032] text-white font-bold border border-sky-400/40 shadow-sm'
                    : 'text-white hover:text-slate-200'
                }`}
              >
                Map
              </button>

              <button
                onClick={() => onViewChange('profile')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'profile'
                    ? 'bg-[#132032] text-white font-bold border border-sky-400/40 shadow-sm'
                    : 'text-white hover:text-slate-200'
                }`}
              >
                Profile
              </button>

              {/* Bell & Compass Icons */}
              <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
                <button
                  onClick={() => onViewChange('planner')}
                  className="p-1 text-slate-200 hover:text-white relative cursor-pointer transition-colors"
                  title="Notifications"
                >
                  <span className="material-symbols-outlined text-base">notifications</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#facc15] absolute top-1 right-1"></span>
                </button>

                <button
                  onClick={() => onViewChange('discover')}
                  className="p-1 text-slate-200 hover:text-white cursor-pointer transition-colors"
                  title="Explore"
                >
                  <span className="material-symbols-outlined text-base">explore</span>
                </button>
              </div>
            </div>

            {/* Right Controls: Log In & Sign Up */}
            <div className="flex items-center gap-3">
              {isGuest ? (
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-4 py-2 rounded-2xl text-xs font-bold text-white bg-[#0C1E32] hover:bg-[#122b46] transition-all border border-sky-400/30 flex items-center gap-1.5 min-h-[40px] cursor-pointer shadow-sm"
                  >
                    <span className="material-symbols-outlined text-base text-white">login</span>
                    <span>Log In</span>
                  </button>

                  <button
                    onClick={() => openAuthModal('register')}
                    className="px-5 py-2 rounded-2xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-400 hover:from-sky-300 hover:to-cyan-200 transition-all shadow-lg shadow-sky-500/25 flex items-center gap-1.5 min-h-[40px] cursor-pointer active:scale-95 border border-sky-200/40"
                  >
                    <span className="material-symbols-outlined text-base text-slate-950 font-bold">person_add</span>
                    <span>Sign Up</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div
                    onClick={() => onViewChange('profile')}
                    className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-white/10 cursor-pointer transition-all border border-sky-400/40 bg-[#0F172A]/80 shadow-sm"
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
                      className="w-7 h-7 rounded-full object-cover border border-[#00d2ff]/60 shadow-sm"
                    />
                    <span className="text-xs font-bold text-white max-w-[100px] truncate leading-tight">
                      {user?.fullName?.split(' ')[0] || 'Traveler'}
                    </span>
                  </div>

                  <button
                    onClick={logout}
                    title="Log Out"
                    className="p-1.5 rounded-xl hover:bg-rose-500/20 text-sky-200 hover:text-rose-300 transition-colors cursor-pointer min-h-[34px] flex items-center justify-center border border-white/10"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Desktop Sidebar Navigation */}
        <aside
          style={{ paddingTop: 'calc(var(--navbar-height, 70px) + 16px)' }}
          className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 z-40 bg-[#071626]/95 backdrop-blur-2xl border-r border-[#0369A1]/30 shadow-2xl pb-6 px-4 gap-4"
        >
          <div className="px-3 pt-1">
            <h2 className="text-2xl font-extrabold text-white tracking-tight leading-tight">
              Azraq Tours<br />& Travels
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">Luxury AI Concierge</p>
          </div>

          <nav className="flex flex-col gap-2 flex-1 overflow-y-auto hide-scrollbar pt-2">
            {/* Discover - Exactly framed with cyan outline in active state */}
            <button
              onClick={() => onViewChange('discover')}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all font-bold text-sm text-left cursor-pointer ${
                currentView === 'discover'
                  ? 'border border-cyan-400 text-white bg-[#0B1D2F] shadow-lg shadow-cyan-900/20'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-xl text-cyan-400">travel_explore</span>
              <span>Discover</span>
            </button>

            {/* Tour Packages */}
            <button
              onClick={() => onViewChange('packages')}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all font-semibold text-sm text-left cursor-pointer ${
                currentView === 'packages'
                  ? 'border border-cyan-400 text-white bg-[#0B1D2F] shadow-lg shadow-cyan-900/20'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-xl text-slate-300">business_center</span>
              <span>Tour Packages</span>
            </button>

            {/* Planner */}
            <button
              onClick={() => onViewChange('planner')}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all font-semibold text-sm text-left cursor-pointer ${
                currentView === 'planner'
                  ? 'border border-cyan-400 text-white bg-[#0B1D2F] shadow-lg shadow-cyan-900/20'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-xl text-slate-300">event_note</span>
              <span>Planner</span>
            </button>

            {/* Travel Buddies */}
            <button
              onClick={() => onViewChange('feed')}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all font-semibold text-sm text-left cursor-pointer ${
                currentView === 'feed'
                  ? 'border border-pink-400 text-white bg-[#0B1D2F] shadow-lg shadow-pink-900/20'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className="material-symbols-outlined text-xl text-[#f472b6]">group</span>
                <span className="text-white">Travel Buddies</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#831843]/80 text-[#f472b6] font-bold border border-pink-500/40">
                Social
              </span>
            </button>

            {/* Map */}
            <button
              onClick={() => onViewChange('map')}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all font-semibold text-sm text-left cursor-pointer ${
                currentView === 'map'
                  ? 'border border-cyan-400 text-white bg-[#0B1D2F] shadow-lg shadow-cyan-900/20'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-xl text-slate-300">map</span>
              <span>Map</span>
            </button>

            {/* Profile */}
            <button
              onClick={() => onViewChange('profile')}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all font-semibold text-sm text-left cursor-pointer ${
                currentView === 'profile'
                  ? 'border border-cyan-400 text-white bg-[#0B1D2F] shadow-lg shadow-cyan-900/20'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-xl text-slate-300">account_circle</span>
              <span>Profile</span>
            </button>
          </nav>

          {/* Bottom Travel Desk Card */}
          <div className="p-3 rounded-2xl bg-[#0B1724] border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                24/7 TRAVEL DESK
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Azraq</span>
            </div>

            <a
              href="https://wa.me/8801851172032?text=Hello%20Azraq%20Tours%20%26%20Travels!%20I%20would%20like%20assistance%20planning%20my%20trip."
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 transition-all text-xs font-semibold group"
            >
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-emerald-400">chat</span>
                <span className="font-mono text-[11px] font-bold">01851172032</span>
              </div>
              <span className="text-[9px] text-emerald-400 font-bold uppercase">WhatsApp ↗</span>
            </a>
          </div>
        </aside>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#071626]/95 backdrop-blur-2xl border-t border-sky-500/20 px-2 py-2 flex justify-around items-center shadow-2xl">
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
