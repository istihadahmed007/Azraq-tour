import React from 'react';
import { ShieldCheck, MapPin, Users, Phone, Mail, Award, Clock, HeartHandshake, ArrowRight } from 'lucide-react';
import { BRAND_LOGOS } from '../data/mockData';

interface AboutViewProps {
  onNavigateToContact?: () => void;
  onOpenTripPlanner?: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigateToContact, onOpenTripPlanner }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12 animate-fadeIn">
      {/* Hero Intro */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#0D6EFD] text-xs font-bold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5" />
          <span>About Azraq</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#071A33] tracking-tight leading-tight">
          Curating Exceptional Journeys Across Asia
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          Founded with a mission to eliminate travel stress, Azraq provides bespoke itineraries, authorized visa documentation, and curated holiday experiences for travelers exploring Asia and beyond.
        </p>
      </div>

      {/* 4 Pillars of Credibility */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0D6EFD] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#071A33]">Trusted Support</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Personalized guidance from licensed travel consultants throughout your entire journey.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#071A33]">Personalized Service</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Trips engineered specifically around your individual preferences, pace, and budget.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#071A33]">Visa Guidance</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Exacting documentation checks for high approval rates across Asian and Middle Eastern embassies.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#071A33]">Local Expertise</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Direct ground partnerships in Thailand, Malaysia, Singapore, Dubai, and Maldives.
          </p>
        </div>
      </div>

      {/* Office & Operations Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Dhaka Head Office</span>
          <h2 className="text-2xl sm:text-3xl font-bold">Visit or Contact Our Travel Desk</h2>
          <p className="text-sm text-slate-300">
            Our experienced concierge and visa desk is located in Dhaka, ready to assist with custom quotes, group packages, or individual getaways.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
              <MapPin className="w-4 h-4" />
              <span>Location</span>
            </div>
            <p className="text-sm text-slate-200">
              Dhaka, Bangladesh
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
              <Phone className="w-4 h-4" />
              <span>Direct Hotline</span>
            </div>
            <p className="text-sm text-slate-200 font-mono">
              +880 1851-172032
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
              <Mail className="w-4 h-4" />
              <span>Inquiries</span>
            </div>
            <a
              href="mailto:istihadahmed1163@gmail.com"
              className="text-sm text-slate-200 hover:text-sky-400 transition-colors block"
            >
              istihadahmed1163@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
