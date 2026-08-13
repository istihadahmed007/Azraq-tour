import React from 'react';
import { TourPackage } from '../types';
import { Calendar, Users, MapPin, ArrowRight, FileText, CheckCircle2, DollarSign } from 'lucide-react';

interface PackageCardProps {
  pkg: TourPackage;
  onViewDetails: (pkg: TourPackage) => void;
  onRequestQuote: (pkg: TourPackage) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  pkg,
  onViewDetails,
  onRequestQuote,
}) => {
  const displayImage =
    pkg.images && pkg.images.length > 0
      ? pkg.images[0]
      : 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="group bg-slate-900/90 rounded-2xl overflow-hidden border border-sky-500/20 shadow-xl hover:shadow-2xl hover:border-sky-400/50 transition-all duration-300 flex flex-col h-full">
      {/* Hero Image & Badges */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={displayImage}
          alt={pkg.package_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        {/* Destination & Country Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-600/90 text-white backdrop-blur-md shadow-md border border-sky-400/30 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-sky-200" />
            {pkg.destination_name}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-950/80 text-sky-300 backdrop-blur-md border border-slate-700/50">
            {pkg.country}
          </span>
        </div>

        {/* Source PDF Tag */}
        {pkg.source_pdf && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 backdrop-blur-md flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              Verified PDF
            </span>
          </div>
        )}

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 right-3 z-10 bg-slate-950/90 backdrop-blur-md border border-emerald-500/40 rounded-xl px-3.5 py-1.5 shadow-lg text-right">
          <p className="text-xs uppercase font-bold tracking-wider text-emerald-400">Starting From</p>
          <p className="text-lg font-extrabold text-emerald-300 font-mono">
            {pkg.currency === 'BDT' ? '৳' : pkg.currency || '৳'}{' '}
            {pkg.price.toLocaleString()}
            <span className="text-xs font-normal text-slate-300"> / pax</span>
          </p>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Package Title */}
          <h3 className="card-title text-lg sm:text-xl font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-2">
            {pkg.package_name}
          </h3>

          {/* Meta Bar */}
          <div className="mt-2.5 flex items-center gap-3 text-xs sm:text-sm font-semibold text-sky-200/90">
            <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/50">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              {pkg.duration}
            </span>
            {pkg.number_of_travelers && (
              <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/50">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                {pkg.number_of_travelers}
              </span>
            )}
          </div>

          {/* Description - Minimum 14px on mobile */}
          <p className="mt-3 text-sm text-slate-200 leading-relaxed line-clamp-2">
            {pkg.description}
          </p>

          {/* Highlights */}
          {pkg.highlights && pkg.highlights.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-slate-800/80 space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wider text-sky-400">Package Highlights</p>
              <div className="space-y-1">
                {pkg.highlights.slice(0, 3).map((hl, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="truncate">{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-1.5">
          <button
            onClick={() => onViewDetails(pkg)}
            className="w-full min-h-[44px] py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white font-bold text-xs border border-sky-500/30 transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Details</span>
          </button>

          <button
            onClick={() => onRequestQuote(pkg)}
            className="w-full min-h-[44px] py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-white font-bold text-xs border border-emerald-500/30 transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Quote</span>
          </button>

          <button
            onClick={() => onRequestQuote(pkg)}
            className="w-full min-h-[44px] py-2.5 px-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Book Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
