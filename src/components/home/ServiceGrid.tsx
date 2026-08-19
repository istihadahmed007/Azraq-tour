import React from 'react';
import { Plane, Package, FileCheck2, Sparkles, ArrowRight } from 'lucide-react';

interface ServiceGridProps {
  onNavigateToView?: (view: string) => void;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({ onNavigateToView }) => {
  const services = [
    {
      id: 'flights',
      icon: <Plane className="w-6 h-6 text-blue-600" />,
      title: 'Flight Comparison & Ticketing',
      desc: 'Real-time airfares from Dhaka to Thailand, Malaysia, Singapore, UAE, Maldives, and beyond.',
      cta: 'Search Flights',
      bg: 'bg-blue-50/70',
      border: 'hover:border-blue-300',
    },
    {
      id: 'packages',
      icon: <Package className="w-6 h-6 text-emerald-600" />,
      title: 'Curated Holiday Packages',
      desc: 'All-inclusive itineraries with 4-star & 5-star hotels, private airport transfers, and excursions.',
      cta: 'Explore Packages',
      bg: 'bg-emerald-50/70',
      border: 'hover:border-emerald-300',
    },
    {
      id: 'visa',
      icon: <FileCheck2 className="w-6 h-6 text-amber-600" />,
      title: 'Visa Documentation Assistance',
      desc: 'Step-by-step document checklists, embassy appointment support, and eVisa processing guidance.',
      cta: 'Check Visa Rules',
      bg: 'bg-amber-50/70',
      border: 'hover:border-amber-300',
    },
    {
      id: 'planner',
      icon: <Sparkles className="w-6 h-6 text-purple-600" />,
      title: 'AI Itinerary & Voice Planner',
      desc: 'Custom day-by-day travel plans customized to your budget, halal dietary needs, and vacation vibe.',
      cta: 'Plan with AI',
      bg: 'bg-purple-50/70',
      border: 'hover:border-purple-300',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0D6EFD] font-mono">
          Comprehensive Services
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#071A33] tracking-tight font-poppins">
          Everything You Need for a Seamless Journey
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {services.map((srv) => (
          <div
            key={srv.id}
            onClick={() => onNavigateToView && onNavigateToView(srv.id)}
            className={`p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer group ${srv.border}`}
          >
            <div className="space-y-4">
              <div className={`w-12 h-12 rounded-xl ${srv.bg} flex items-center justify-center`}>
                {srv.icon}
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[#071A33] group-hover:text-[#0D6EFD] transition-colors font-poppins">
                  {srv.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{srv.desc}</p>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0D6EFD] group-hover:underline">
              <span>{srv.cta}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
