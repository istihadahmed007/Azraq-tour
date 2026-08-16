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
  Info,
  Calendar,
  Menu,
  X,
  User,
  LogOut,
  MapPin,
  Sparkles,
  Phone,
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

    const navLinks: { id: NavView; label: string; icon: React.ReactNode; badge?: string }[] = [
      { id: 'flights', label: 'Flights', icon: <Plane className="w-4 h-4" /> },
      { id: 'destinations', label: 'Destinations', icon: <Compass className="w-4 h-4" /> },
      { id: 'packages', label: 'Tour Packages', icon: <Package className="w-4 h-4" /> },
      { id: 'visa', label: 'Visa Assistance', icon: <FileCheck2 className="w-4 h-4" /> },
      { id: 'planner', label: 'Travel Planner', icon: <Sparkles className="w-4 h-4" /> },
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
        className="sticky top-0 left-0 right-0 w-full z-50 bg-[#071A33] text-white border-b border-slate-800 shadow-md transition-all duration-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavigate('discover')}
            className="flex items-center gap-3 cursor-pointer text-left group shrink-0 focus:outline-none"
            aria-label="Azraq Home"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden shadow-xs border border-white/20 bg-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <img
                src={BRAND_LOGOS.azraq}
                alt="Azraq"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold text-white tracking-tight block group-hover:text-sky-300 transition-colors leading-tight font-sans">
                Azraq
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-4">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavigate(link.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Items: Log in & Request a Quote */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Auth / Login Button */}
            {isGuest ? (
              <button
                onClick={() => openAuthModal('login')}
                className="px-5 py-2 rounded-full text-sm font-medium text-white border border-slate-400/80 hover:border-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                Log in
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavigate('profile')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    currentView === 'profile'
                      ? 'bg-blue-600/30 border-sky-400 text-sky-300'
                      : 'border-slate-600 hover:bg-white/10 text-white'
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
                    className="w-6 h-6 rounded-full object-cover border border-slate-400"
                  />
                  <span className="text-xs font-semibold max-w-[90px] truncate">
                    {user?.fullName?.split(' ')[0] || 'Account'}
                  </span>
                </button>

                <button
                  onClick={logout}
                  title="Log Out"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Request a Quote CTA */}
            <button
              onClick={() => {
                if (onOpenQuote) onOpenQuote();
                else handleNavigate('packages');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#0D6EFD] hover:bg-blue-600 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Request a Quote</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => {
                if (onOpenQuote) onOpenQuote();
                else handleNavigate('packages');
              }}
              className="px-3 py-1.5 rounded-lg bg-[#0D6EFD] text-white text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <span>Quote</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-[#071A33] px-4 pt-3 pb-6 space-y-3 shadow-xl animate-fadeIn">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = currentView === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavigate(link.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-colors cursor-pointer text-left ${
                      isActive
                        ? 'text-sky-300 bg-blue-900/40 font-bold'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span className={isActive ? 'text-sky-300' : 'text-slate-400'}>
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  if (onOpenQuote) onOpenQuote();
                  else handleNavigate('packages');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-[#0D6EFD] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Request a Quote</span>
              </button>

              {isGuest ? (
                <button
                  onClick={() => {
                    openAuthModal('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl border border-slate-500 text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-300" />
                  <span>Log in</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleNavigate('profile');
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
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
