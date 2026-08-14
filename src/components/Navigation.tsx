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

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange,
  brandTheme,
  onToggleBrand,
  onNewTripClick,
  savedTripsCount,
}) => {
  const { user, isGuest, openAuthModal, logout } = useAuth();
  const isAzraq = true;

  const brandTitle = 'Azraq Tours & Travels';
  const brandSub = 'Luxury AI Concierge';
  const logoUrl = BRAND_LOGOS.azraq;

  return (
    <>
      {/* Top Navigation Bar */}
      <nav
        aria-label="Main Navigation"
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isAzraq
            ? 'bg-sky-900/60 backdrop-blur-xl border-b border-sky-300/30 shadow-lg'
            : 'bg-slate-900/50 backdrop-blur-2xl border-b border-white/20 shadow-xl'
        }`}
      >
        <div className="flex justify-between items-center px-4 md:px-8 py-3 w-full max-w-7xl mx-auto">
          {/* Logo & Brand Name */}
          <div
            onClick={() => onViewChange('discover')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src={logoUrl}
              alt={brandTitle}
              className="h-9 w-9 rounded-full object-cover border border-white/20 shadow-md group-hover:scale-105 transition-transform"
            />
            <div>
              <span
                className={`font-serif-display text-xl md:text-2xl tracking-tight font-bold ${
                  isAzraq ? 'text-blue-900 dark:text-[#adc7ff]' : 'text-[#adc7ff]'
                }`}
              >
                {brandTitle}
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                AI
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 dark:bg-white/5 p-1 rounded-full border border-white/10">
            <button
              onClick={() => onViewChange('discover')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                currentView === 'discover'
                  ? 'bg-primary text-on-primary shadow-md font-semibold'
                  : 'text-on-surface-variant hover:text-white hover:bg-white/10'
              }`}
            >
              Discover
            </button>
            <button
              onClick={() => onViewChange('packages')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentView === 'packages'
                  ? 'bg-primary text-on-primary shadow-md font-semibold'
                  : 'text-on-surface-variant hover:text-white hover:bg-white/10'
              }`}
            >
              Tour Packages
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>
            <button
              onClick={() => onViewChange('planner')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentView === 'planner'
                  ? 'bg-primary text-on-primary shadow-md font-semibold'
                  : 'text-on-surface-variant hover:text-white hover:bg-white/10'
              }`}
            >
              Planner
              {savedTripsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              )}
            </button>
            <button
              onClick={() => onViewChange('feed')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                currentView === 'feed'
                  ? 'bg-primary text-on-primary shadow-md font-semibold'
                  : 'text-on-surface-variant hover:text-white hover:bg-white/10'
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => onViewChange('map')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                currentView === 'map'
                  ? 'bg-primary text-on-primary shadow-md font-semibold'
                  : 'text-on-surface-variant hover:text-white hover:bg-white/10'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => onViewChange('profile')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                currentView === 'profile'
                  ? 'bg-primary text-on-primary shadow-md font-semibold'
                  : 'text-on-surface-variant hover:text-white hover:bg-white/10'
              }`}
            >
              Profile
            </button>
            {isWebsiteOwner(user) && (
              <button
                onClick={() => onViewChange('admin')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                  currentView === 'admin'
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                    : 'text-sky-300 hover:text-white hover:bg-sky-500/20'
                }`}
                title="Travel Agency Quotation Staff Portal (Website Owner)"
              >
                <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                <span>Quotes Admin</span>
              </button>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Quick Notifications Button */}
            <button
              onClick={() => onViewChange('feed')}
              className="p-2 rounded-full hover:bg-white/10 text-on-surface-variant hover:text-primary transition-colors relative"
              title="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-tertiary rounded-full"></span>
            </button>

            {/* Quick Map Button */}
            <button
              onClick={() => onViewChange('map')}
              className="p-2 rounded-full hover:bg-white/10 text-on-surface-variant hover:text-primary transition-colors"
              title="Explore Map"
            >
              <span className="material-symbols-outlined">explore</span>
            </button>

            {/* User Profile / Auth State Controls */}
            {isGuest ? (
              <div className="flex items-center gap-2 ml-1">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-sky-100 hover:text-white bg-transparent hover:bg-white/10 transition-all border border-sky-300/40 hover:border-sky-300 flex items-center gap-1.5 shadow-sm active:scale-95 min-h-[40px] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">login</span>
                  <span>Log In</span>
                </button>

                <button
                  onClick={() => openAuthModal('register')}
                  className="px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 active:scale-95 flex items-center gap-1.5 min-h-[40px] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">person_add</span>
                  <span>Sign Up</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <div
                  onClick={() => onViewChange('profile')}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-white/10 cursor-pointer transition-all border border-amber-400/40 bg-slate-900/60 shadow-sm"
                  title={`${user?.fullName} (${user?.email}) - Go to My Dashboard`}
                >
                  <img
                    src={
                      user?.photoURL ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                        user?.fullName || user?.email || 'traveler'
                      )}`
                    }
                    alt={user?.fullName || 'Traveler'}
                    className="w-8 h-8 rounded-full object-cover border border-amber-400/60 shadow-sm"
                  />
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-bold text-white max-w-[110px] truncate leading-tight">
                      {user?.fullName?.split(' ')[0] || 'Traveler'}
                    </span>
                    <span className="text-[10px] text-amber-300 font-medium">Dashboard</span>
                  </div>
                  {!user?.emailVerified && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        openAuthModal('email_verification');
                      }}
                      className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"
                      title="Email unverified - click to verify"
                    />
                  )}
                </div>

                <button
                  onClick={logout}
                  title="Log Out"
                  className="p-2 rounded-xl hover:bg-rose-500/20 text-sky-200 hover:text-rose-300 transition-colors cursor-pointer min-h-[38px] flex items-center justify-center border border-white/10"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Desktop Side Navigation Bar */}
      <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 z-40 bg-slate-950/40 backdrop-blur-2xl border-r border-white/20 shadow-2xl pt-24 pb-6 px-4 gap-2">
        <div className="px-3 mb-2">
          <h2 className="font-serif-display text-lg text-primary font-semibold">{brandTitle}</h2>
          <p className="text-xs text-outline font-medium">{brandSub}</p>
        </div>

        <nav className="flex flex-col gap-1.5 flex-1">
          <button
            onClick={() => onViewChange('discover')}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all font-medium text-sm text-left ${
              currentView === 'discover'
                ? 'bg-primary-container/30 text-primary border border-primary/30 shadow-md'
                : 'text-on-surface-variant hover:bg-white/5 hover:text-white hover:translate-x-1'
            }`}
          >
            <span className="material-symbols-outlined text-xl">travel_explore</span>
            <span>Discover</span>
          </button>

          <button
            onClick={() => onViewChange('packages')}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all font-medium text-sm text-left ${
              currentView === 'packages'
                ? 'bg-primary-container/30 text-primary border border-primary/30 shadow-md'
                : 'text-on-surface-variant hover:bg-white/5 hover:text-white hover:translate-x-1'
            }`}
          >
            <span className="material-symbols-outlined text-xl">card_travel</span>
            <span>Tour Packages</span>
          </button>

          <button
            onClick={() => onViewChange('planner')}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all font-medium text-sm text-left ${
              currentView === 'planner'
                ? 'bg-primary-container/30 text-primary border border-primary/30 shadow-md'
                : 'text-on-surface-variant hover:bg-white/5 hover:text-white hover:translate-x-1'
            }`}
          >
            <span className="material-symbols-outlined text-xl">event_note</span>
            <span>Planner</span>
          </button>

          <button
            onClick={() => onViewChange('feed')}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all font-medium text-sm text-left ${
              currentView === 'feed'
                ? 'bg-primary-container/30 text-primary border border-primary/30 shadow-md'
                : 'text-on-surface-variant hover:bg-white/5 hover:text-white hover:translate-x-1'
            }`}
          >
            <span className="material-symbols-outlined text-xl">auto_awesome_motion</span>
            <span>Feed</span>
          </button>

          <button
            onClick={() => onViewChange('map')}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all font-medium text-sm text-left ${
              currentView === 'map'
                ? 'bg-primary-container/30 text-primary border border-primary/30 shadow-md'
                : 'text-on-surface-variant hover:bg-white/5 hover:text-white hover:translate-x-1'
            }`}
          >
            <span className="material-symbols-outlined text-xl">map</span>
            <span>Map</span>
          </button>

          <button
            onClick={() => onViewChange('profile')}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all font-medium text-sm text-left ${
              currentView === 'profile'
                ? 'bg-primary-container/30 text-primary border border-primary/30 shadow-md'
                : 'text-on-surface-variant hover:bg-white/5 hover:text-white hover:translate-x-1'
            }`}
          >
            <span className="material-symbols-outlined text-xl">account_circle</span>
            <span>Profile</span>
          </button>

          {isWebsiteOwner(user) && (
            <button
              onClick={() => onViewChange('admin')}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all font-medium text-sm text-left ${
                currentView === 'admin'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30 shadow-md'
                  : 'text-sky-300 hover:bg-white/5 hover:text-white hover:translate-x-1'
              }`}
            >
              <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
              <span>Quotes Admin</span>
            </button>
          )}
        </nav>

        {/* Quick Contact & Hotline Box */}
        <div className="p-3 rounded-2xl bg-sky-950/60 border border-sky-400/25 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-sky-300 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              24/7 Travel Desk
            </span>
            <span className="text-[10px] text-slate-400">Azraq</span>
          </div>

          <a
            href="https://wa.me/8801851172032?text=Hello%20Azraq%20Tours%20%26%20Travels!%20I%20would%20like%20assistance%20with%20travel%20packages%20and%20quotations."
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 transition-all text-xs font-semibold group"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base group-hover:scale-110 transition-transform">chat</span>
              <span className="font-mono text-[11px] font-bold">01851172032</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-tight">WhatsApp ↗</span>
          </a>

          <a
            href="tel:+8801851172032"
            className="flex items-center justify-center gap-1 text-[11px] font-medium text-slate-300 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-xs text-sky-400">call</span>
            <span>Direct Call: +880 1851-172032</span>
          </a>
        </div>

        {/* New Trip Action Button */}
        <div className="pt-2">
          <button
            onClick={onNewTripClick}
            className="w-full bg-primary text-on-primary rounded-xl py-3 px-4 font-semibold text-sm hover:bg-primary-fixed transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[0.98] active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span>New Trip</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-sky-950/90 backdrop-blur-2xl border-t border-white/20 px-2 py-2 flex justify-around items-center shadow-2xl">
        <button
          onClick={() => onViewChange('discover')}
          className={`flex flex-col items-center gap-1 min-h-[48px] px-2 py-1 rounded-xl transition-colors ${
            currentView === 'discover' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">travel_explore</span>
          <span className="text-[14px] font-medium tracking-tight">Discover</span>
        </button>

        <button
          onClick={() => onViewChange('packages')}
          className={`flex flex-col items-center gap-1 min-h-[48px] px-2 py-1 rounded-xl transition-colors ${
            currentView === 'packages' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">card_travel</span>
          <span className="text-[14px] font-medium tracking-tight">Packages</span>
        </button>

        <button
          onClick={() => onViewChange('planner')}
          className={`flex flex-col items-center gap-1 min-h-[48px] px-2 py-1 rounded-xl transition-colors relative ${
            currentView === 'planner' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-white'
          }`}
        >
          {currentView === 'planner' && (
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full"></div>
          )}
          <span className="material-symbols-outlined text-2xl">event_note</span>
          <span className="text-[14px] font-medium tracking-tight">Planner</span>
        </button>

        <button
          onClick={() => onViewChange('feed')}
          className={`flex flex-col items-center gap-1 min-h-[48px] px-2 py-1 rounded-xl transition-colors ${
            currentView === 'feed' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">auto_awesome_motion</span>
          <span className="text-[14px] font-medium tracking-tight">Feed</span>
        </button>

        <button
          onClick={() => onViewChange('map')}
          className={`flex flex-col items-center gap-1 min-h-[48px] px-2 py-1 rounded-xl transition-colors ${
            currentView === 'map' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">map</span>
          <span className="text-[14px] font-medium tracking-tight">Map</span>
        </button>

        <button
          onClick={() => onViewChange('profile')}
          className={`flex flex-col items-center gap-1 min-h-[48px] px-2 py-1 rounded-xl transition-colors ${
            currentView === 'profile' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">account_circle</span>
          <span className="text-[14px] font-medium tracking-tight">Profile</span>
        </button>
      </nav>
    </>
  );
};
