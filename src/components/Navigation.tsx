import React, { useState } from 'react';
import { NavView } from '../types';
import { BRAND_LOGOS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Package,
  FileCheck2,
  Plane,
  Users,
  MapPin,
  Sparkles,
  Menu,
  X,
  User,
  LogOut,
  HelpCircle,
  Heart,
  Send,
} from 'lucide-react';

interface NavigationProps {
  currentView: NavView;
  onViewChange: (view: NavView) => void;
  brandTheme?: string;
  onToggleBrand?: () => void;
  onNewTripClick: () => void;
  savedTripsCount: number;
  onOpenQuote?: () => void;
}

export const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
  (
    {
      currentView,
      onViewChange,
      onNewTripClick,
      savedTripsCount,
      onOpenQuote,
    },
    ref
  ) => {
    const { user, isGuest, openAuthModal, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Primary travel category navigation items matching the bright blue travel design
    const navItems: { id: NavView; label: string; icon: React.ReactNode }[] = [
      { id: 'discover', label: 'Explore', icon: <Compass className="w-4 h-4" /> },
      { id: 'packages', label: 'Packages', icon: <Package className="w-4 h-4" /> },
      { id: 'destinations', label: 'Destinations', icon: <MapPin className="w-4 h-4" /> },
      { id: 'flights', label: 'Flights', icon: <Plane className="w-4 h-4" /> },
      { id: 'visa', label: 'Visa Assistance', icon: <FileCheck2 className="w-4 h-4" /> },
      { id: 'planner', label: 'AI Planner', icon: <Sparkles className="w-4 h-4" /> },
      { id: 'feed', label: 'Travel Buddies', icon: <Users className="w-4 h-4" /> },
    ];

    const handleNavigate = (view: NavView) => {
      onViewChange(view);
      setMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
      <header
        ref={ref}
        id="main-navigation-header"
        className="sticky top-0 left-0 right-0 w-full z-50 bg-[#0759B8] text-white border-b border-[#003B80] shadow-sm transition-all duration-200 backdrop-blur-md"
      >
        {/* Row 1: Top Navigation Bar (Logo, Nav Links on Desktop, Actions & Account on Right) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo with Paper Airplane Motif */}
          <button
            onClick={() => handleNavigate('discover')}
            className="flex items-center gap-2.5 cursor-pointer text-left group shrink-0 focus:outline-none"
            aria-label="Azraq Travel"
          >
            <div className="w-9 h-9 rounded-xl bg-white shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden relative border border-white/40">
              <img
                src={BRAND_LOGOS.azraq}
                alt="Azraq"
                className="w-full h-full object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#1389E8] rounded-full flex items-center justify-center">
                <Send className="w-2.5 h-2.5 text-white transform -rotate-45" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-xl font-extrabold text-white tracking-tight leading-none font-poppins">
                  AZRAQ
                </span>
                <span className="text-xs font-bold text-[#5BC7F4] uppercase tracking-wider px-1 py-0.5 rounded bg-white/10">
                  TOUR
                </span>
              </div>
              <span className="text-[10px] text-sky-200 font-medium tracking-wide">
                Bangladesh Travel Concierge
              </span>
            </div>
          </button>

          {/* Desktop Nav Links (Central alignment) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#0759B8] shadow-xs font-bold'
                      : 'text-white/90 hover:text-white hover:bg-white/15'
                  }`}
                >
                  <span className={isActive ? 'text-[#1389E8]' : 'text-sky-200'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Utilities (Saved Trips, Help, Plan My Trip CTA, Auth/Profile) */}
          <div className="hidden sm:flex items-center gap-2.5 text-xs">
            {/* Currency & Region Pill */}
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/10 text-white/90 font-medium text-[11px] border border-white/15">
              <span>🇧🇩</span>
              <span>BDT (৳)</span>
            </span>

            {/* Saved Trips */}
            <button
              type="button"
              onClick={() => handleNavigate('profile')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all cursor-pointer ${
                currentView === 'profile'
                  ? 'bg-white/20 text-white'
                  : 'hover:bg-white/10 text-white/90 hover:text-white'
              }`}
              title="Saved Trips"
            >
              <Heart className="w-3.5 h-3.5 text-[#5BC7F4]" />
              <span className="font-semibold text-xs">{savedTripsCount}</span>
            </button>

            {/* Primary Action CTA: Plan My Trip */}
            <button
              type="button"
              onClick={() => {
                if (onNewTripClick) onNewTripClick();
                else handleNavigate('planner');
              }}
              className="px-3.5 py-1.5 rounded-full bg-[#1389E8] hover:bg-[#0E7FE3] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border border-sky-300/30"
            >
              <Send className="w-3 h-3 transform -rotate-45" />
              <span>Plan My Trip</span>
            </button>

            {/* Auth / Login / Profile */}
            {isGuest ? (
              <div className="flex items-center gap-1.5 pl-1 border-l border-white/20">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-1.5 rounded-full text-xs font-bold text-white hover:bg-white/15 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-3 py-1.5 rounded-full text-xs font-bold text-[#0759B8] bg-white hover:bg-slate-100 transition-colors cursor-pointer shadow-xs"
                >
                  Register
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-1 border-l border-white/20">
                <button
                  onClick={() => handleNavigate('profile')}
                  className={`flex items-center gap-2 px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                    currentView === 'profile'
                      ? 'bg-white text-[#0759B8] border-white font-bold'
                      : 'border-white/30 hover:bg-white/10 text-white'
                  }`}
                  title="My Dashboard"
                >
                  <img
                    src={
                      user?.photoURL ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                        user?.fullName || user?.email || 'traveler'
                      )}`
                    }
                    alt={user?.fullName || 'Traveler'}
                    className="w-5 h-5 rounded-full object-cover border border-white/50"
                  />
                  <span className="text-xs font-semibold max-w-[80px] truncate">
                    {user?.fullName?.split(' ')[0] || 'Account'}
                  </span>
                </button>

                <button
                  onClick={logout}
                  title="Log Out"
                  className="p-1.5 text-sky-200 hover:text-rose-200 hover:bg-rose-500/20 rounded-full transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Actions & Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => {
                if (onNewTripClick) onNewTripClick();
                else handleNavigate('planner');
              }}
              className="px-3 py-1 rounded-full bg-[#1389E8] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
            >
              <Send className="w-3 h-3 transform -rotate-45" />
              <span>Plan</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Row 2 on Tablets/Desktops < lg: Horizontal category bar */}
        <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 pb-2.5 overflow-x-auto no-scrollbar border-t border-white/10 pt-2">
          <nav className="flex items-center gap-1.5 min-w-max">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-white text-[#0759B8] font-bold shadow-xs'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className={isActive ? 'text-[#1389E8]' : 'text-sky-200'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#003B80] bg-[#0759B8] px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-fadeIn">
            <nav className="flex flex-col gap-1">
              {navItems.map((link) => {
                const isActive = currentView === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavigate(link.id)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer text-left ${
                      isActive
                        ? 'text-[#0759B8] bg-white font-bold shadow-xs'
                        : 'text-white/90 hover:bg-white/10'
                    }`}
                  >
                    <span className={isActive ? 'text-[#1389E8]' : 'text-sky-200'}>
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-white/15 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs text-sky-100 px-1">
                <span>Currency: <strong>BDT (৳)</strong></span>
                <span>Region: <strong>🇧🇩 Bangladesh</strong></span>
              </div>

              {isGuest ? (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      openAuthModal('login');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2.5 rounded-xl bg-white text-[#0759B8] font-bold text-xs shadow-xs text-center cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      openAuthModal('register');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2.5 rounded-xl bg-[#1389E8] text-white font-bold text-xs text-center cursor-pointer border border-sky-300/30"
                  >
                    Register
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 border border-white/10">
                    <img
                      src={
                        user?.photoURL ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                          user?.fullName || user?.email || 'traveler'
                        )}`
                      }
                      alt={user?.fullName || 'Traveler'}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white/40 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {user?.fullName || 'VIP Traveler'}
                      </p>
                      <p className="text-[11px] text-sky-200 truncate">{user?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        handleNavigate('profile');
                        setMobileMenuOpen(false);
                      }}
                      className="py-2.5 rounded-xl bg-white text-[#0759B8] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="py-2.5 rounded-xl bg-rose-500/20 text-rose-100 border border-rose-300/30 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    );
  }
);

Navigation.displayName = 'Navigation';


