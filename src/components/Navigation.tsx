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
  Bed,
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

    // Booking.com style service category items
    const bookingNavItems: { id: NavView; label: string; icon: React.ReactNode }[] = [
      { id: 'discover', label: 'Explore', icon: <Compass className="w-4 h-4" /> },
      { id: 'flights', label: 'Flights', icon: <Plane className="w-4 h-4" /> },
      { id: 'packages', label: 'Tour Packages', icon: <Package className="w-4 h-4" /> },
      { id: 'visa', label: 'Visa Assistance', icon: <FileCheck2 className="w-4 h-4" /> },
      { id: 'planner', label: 'AI Planner', icon: <Sparkles className="w-4 h-4" /> },
      { id: 'destinations', label: 'Destinations', icon: <MapPin className="w-4 h-4" /> },
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
        className="sticky top-0 left-0 right-0 w-full z-50 bg-[#003580] text-white border-b border-[#00224f] shadow-md transition-all duration-200"
      >
        {/* Row 1: Top Header Bar (Logo on left, Utilities & Auth on right) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavigate('discover')}
            className="flex items-center gap-2.5 cursor-pointer text-left group shrink-0 focus:outline-none"
            aria-label="Azraq.com"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden shadow-xs border border-white/30 bg-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <img
                src={BRAND_LOGOS.azraq}
                alt="Azraq"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white tracking-tight block transition-colors leading-tight font-sans">
                Azraq<span className="text-sky-400 font-extrabold">.com</span>
              </span>
            </div>
          </button>

          {/* Top Right Utilities (Currency, Flag, Support, Saved, Account) */}
          <div className="hidden md:flex items-center gap-3 text-xs">
            {/* Currency Pill */}
            <span className="px-2.5 py-1.5 rounded-md hover:bg-white/10 text-white font-semibold transition-colors cursor-pointer">
              BDT (৳)
            </span>

            {/* Country Flag */}
            <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-white/10 text-white font-medium transition-colors cursor-pointer">
              <span className="text-sm">🇧🇩</span>
              <span className="font-semibold">BD</span>
            </span>

            {/* Customer Support */}
            <button
              type="button"
              onClick={() => {
                if (onOpenQuote) onOpenQuote();
                else handleNavigate('packages');
              }}
              className="p-1.5 rounded-md hover:bg-white/10 text-white transition-colors cursor-pointer"
              title="Customer Support & Help"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Saved Trips */}
            <button
              type="button"
              onClick={() => handleNavigate('profile')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-white/10 text-white font-medium transition-colors cursor-pointer"
              title="Saved Trips"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Saved ({savedTripsCount})</span>
            </button>

            {/* Auth / Login Buttons */}
            {isGuest ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-3.5 py-1.5 rounded-md text-xs font-bold text-[#003580] bg-white hover:bg-slate-100 transition-colors cursor-pointer shadow-xs"
                >
                  Register
                </button>
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-1.5 rounded-md text-xs font-bold text-[#003580] bg-white hover:bg-slate-100 transition-colors cursor-pointer shadow-xs"
                >
                  Sign in
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavigate('profile')}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all cursor-pointer ${
                    currentView === 'profile'
                      ? 'bg-blue-600/40 border-sky-400 text-sky-200'
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
                  <span className="text-xs font-semibold max-w-[90px] truncate">
                    {user?.fullName?.split(' ')[0] || 'Account'}
                  </span>
                </button>

                <button
                  onClick={logout}
                  title="Log Out"
                  className="p-1.5 text-slate-300 hover:text-rose-300 hover:bg-rose-500/20 rounded-md transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Actions & Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => {
                if (onOpenQuote) onOpenQuote();
                else handleNavigate('packages');
              }}
              className="px-2.5 py-1 rounded-md bg-white text-[#003580] text-xs font-bold shadow-xs cursor-pointer"
            >
              Help
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Row 2: Booking.com Style Category Tabs (Pills with icons, single line, horizontal scrolling) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 pt-0 overflow-x-auto no-scrollbar">
          <nav className="flex items-center gap-2 min-w-max flex-nowrap">
            {bookingNavItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    isActive
                      ? 'border border-white bg-white/10 text-white font-bold shadow-xs'
                      : 'text-white/90 hover:bg-white/10 hover:text-white border border-transparent'
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#00224f] bg-[#003580] px-4 pt-3 pb-6 space-y-3 shadow-xl animate-fadeIn">
            <nav className="flex flex-col gap-1">
              {bookingNavItems.map((link) => {
                const isActive = currentView === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavigate(link.id)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer text-left ${
                      isActive
                        ? 'text-white bg-white/20 font-bold border border-white/40'
                        : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-white/20 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-white/80 px-1">
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
                    className="py-2 rounded-lg bg-white text-[#003580] font-bold text-xs shadow-xs text-center cursor-pointer"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => {
                      openAuthModal('register');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 rounded-lg border border-white text-white font-bold text-xs text-center cursor-pointer"
                  >
                    Register
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    handleNavigate('profile');
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>My Profile & Bookings</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    );
  }
);

Navigation.displayName = 'Navigation';

