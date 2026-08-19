import React from 'react';
import { TourPackage } from '../types';
import { getVisaFeeForDestination } from '../data/visaRequirementsData';
import {
  Calendar,
  MapPin,
  FileText,
  CheckCircle2,
  FileCheck,
  Star,
  Heart,
  ArrowRight,
  Eye
} from 'lucide-react';
import { getOptimizedUnsplashUrl, getUnsplashSrcSet } from '../utils/imageOptimization';
import { usePackages } from '../context/PackageContext';

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
  const packageContext = usePackages();
  const isPackageSaved = packageContext?.isPackageSaved;
  const toggleSavePackage = packageContext?.toggleSavePackage;
  const isSaved = typeof isPackageSaved === 'function' ? isPackageSaved(pkg.id) : false;

  const displayImage =
    pkg.images && pkg.images.length > 0
      ? pkg.images[0]
      : 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=75';

  return (
    <div className="group bg-slate-900/95 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-700/70 shadow-lg hover:shadow-2xl hover:border-sky-500/50 transition-all duration-300 flex flex-col h-full">
      {/* Hero Image & Badges */}
      <div className="relative h-56 sm:h-60 overflow-hidden bg-slate-950">
        <img
          src={getOptimizedUnsplashUrl(displayImage, 800, 75)}
          srcSet={getUnsplashSrcSet(displayImage, [400, 800, 1000], 75)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
          alt={pkg.package_name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Destination & Country Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-600/95 text-white backdrop-blur-md shadow-md flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-sky-200" />
            {pkg.destination_name}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-950/80 text-sky-300 backdrop-blur-md border border-slate-700/60">
            {pkg.country}
          </span>
        </div>

        {/* Wishlist Button (min 48x48px tap target) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (typeof toggleSavePackage === 'function') {
              toggleSavePackage(pkg.id);
            }
          }}
          type="button"
          aria-label={isSaved ? 'Remove from saved trips' : 'Save trip to wishlist'}
          className="absolute top-2.5 right-2.5 z-20 min-h-[48px] min-w-[48px] p-2.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-700/70 text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer"
        >
          <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
        </button>

        {/* Rating & Verified Tag */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 bg-slate-950/85 backdrop-blur-md border border-amber-400/40 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-300">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>4.9 (Verified)</span>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 right-3 z-10 bg-slate-950/90 backdrop-blur-md border border-emerald-500/40 rounded-xl px-3 py-1.5 shadow-lg text-right">
          <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">From</p>
          <p className="text-base sm:text-lg font-extrabold text-emerald-300 font-mono">
            {pkg.currency === 'BDT' ? '৳' : pkg.currency || '৳'}{' '}
            {pkg.price.toLocaleString()}
            <span className="text-[11px] font-normal text-slate-300"> / pax</span>
          </p>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Package Title */}
          <h3
            onClick={() => onViewDetails(pkg)}
            className="text-base sm:text-lg font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-2 cursor-pointer"
          >
            {pkg.package_name}
          </h3>

          {/* Meta Bar */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs font-semibold text-sky-200/90">
            <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/50">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              {pkg.duration}
            </span>
            <span className="flex items-center gap-1 bg-teal-950/80 text-teal-300 px-2.5 py-1 rounded-lg border border-teal-500/30 font-bold">
              <FileCheck className="w-3.5 h-3.5 text-teal-400" />
              Visa: {pkg.visa_fee || getVisaFeeForDestination(pkg.country || pkg.destination_name)}
            </span>
          </div>

          {/* Description */}
          <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2">
            {pkg.description}
          </p>

          {/* Highlights */}
          {pkg.highlights && pkg.highlights.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-slate-800/80 space-y-1.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-sky-400">Included Highlights</p>
              <div className="space-y-1">
                {pkg.highlights.slice(0, 2).map((hl, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="truncate">{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons (All min 48px tap targets) */}
        <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewDetails(pkg)}
            type="button"
            className="w-full min-h-[48px] py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white font-bold text-xs sm:text-sm border border-sky-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Eye className="w-4 h-4" />
            <span>Itinerary</span>
          </button>

          <button
            onClick={() => onRequestQuote(pkg)}
            type="button"
            className="w-full min-h-[48px] py-3 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <span>Book / Quote</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
