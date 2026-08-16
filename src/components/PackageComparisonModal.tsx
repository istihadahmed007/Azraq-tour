import React, { useState } from 'react';
import { TourPackage } from '../types';
import { getVisaFeeForDestination } from '../data/visaRequirementsData';
import {
  X,
  Check,
  Ban,
  Calendar,
  DollarSign,
  Hotel,
  Plane,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';

interface PackageComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  packages: TourPackage[];
  onRequestQuote: (pkg: TourPackage) => void;
}

export const PackageComparisonModal: React.FC<PackageComparisonModalProps> = ({
  isOpen,
  onClose,
  packages,
  onRequestQuote,
}) => {
  if (!isOpen || packages.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-sky-400/30 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-100">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-sky-950 via-slate-900 to-slate-900 border-b border-sky-500/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-xl shadow-inner">
              ⚖️
            </div>
            <div>
              <h2 className="text-xl font-serif-display font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Side-by-Side Package Comparison</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {packages.length} Packages
                </span>
              </h2>
              <p className="text-xs text-sky-200/80">
                Compare official agency inclusions, hotel standards, cancellation rules, and BDT pricing per person
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Comparison Table */}
        <div className="p-6 overflow-x-auto overflow-y-auto hide-scrollbar space-y-6">
          <div className="min-w-[750px] grid grid-cols-4 gap-4">
            {/* Row 1: Parameter Labels Column */}
            <div className="col-span-1 space-y-4 font-bold text-xs text-sky-300 uppercase tracking-wider">
              <div className="h-44 flex items-end pb-3 text-slate-400">Package Details</div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">Official Price / Person</div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">Duration & Flights</div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">Hotel Standard</div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">Visa Processing Fee</div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">Key Inclusions</div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">Exclusions</div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">Cancellation & Refund</div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">Availability & Action</div>
            </div>

            {/* Package Columns */}
            {packages.slice(0, 3).map((pkg) => {
              const displayImage =
                pkg.images && pkg.images.length > 0
                  ? pkg.images[0]
                  : 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=75';

              return (
                <div
                  key={pkg.id}
                  className="col-span-1 bg-slate-950/80 rounded-2xl border border-sky-400/25 p-4 flex flex-col justify-between gap-4 shadow-xl relative"
                >
                  {/* Package Card Top Header */}
                  <div className="h-44 flex flex-col justify-between">
                    <div className="relative h-24 rounded-xl overflow-hidden mb-2">
                      <img src={displayImage} alt={pkg.package_name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-950/80 text-white border border-white/20">
                        {pkg.country}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-2">{pkg.package_name}</h4>
                      <p className="text-[11px] text-sky-300 font-medium">{pkg.destination_name}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-emerald-500/30 text-center">
                    <span className="text-[10px] text-emerald-400 block font-bold uppercase">Starting From (Est.)</span>
                    <span className="text-base font-extrabold text-emerald-300 font-mono">
                      ৳ {pkg.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block">per person (twin share)</span>
                  </div>

                  {/* Duration & Flights */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-center space-y-1">
                    <span className="font-bold text-white block">{pkg.duration}</span>
                    <span className="text-[11px] text-sky-200 block">Flight quote customized on booking</span>
                  </div>

                  {/* Hotel Standard */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-center space-y-1">
                    <span className="font-bold text-amber-300 flex items-center justify-center gap-1">
                      <Hotel className="w-3.5 h-3.5" /> 4-Star Verified
                    </span>
                    <span className="text-[10px] text-slate-400 block">Daily Buffet Breakfast Included</span>
                  </div>

                  {/* Visa Fee */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-teal-500/30 text-xs text-center text-teal-300 font-bold">
                    {pkg.visa_fee || getVisaFeeForDestination(pkg.country || pkg.destination_name)}
                  </div>

                  {/* Inclusions */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1.5 min-h-[90px]">
                    <div className="flex items-center gap-1 text-emerald-300 text-[11px]">
                      <Check className="w-3.5 h-3.5 shrink-0" /> AC Airport Transfers
                    </div>
                    <div className="flex items-center gap-1 text-emerald-300 text-[11px]">
                      <Check className="w-3.5 h-3.5 shrink-0" /> Guided City & Island Tours
                    </div>
                    <div className="flex items-center gap-1 text-emerald-300 text-[11px]">
                      <Check className="w-3.5 h-3.5 shrink-0" /> All Entrance & Park Tickets
                    </div>
                  </div>

                  {/* Exclusions */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1.5 min-h-[70px]">
                    <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <Ban className="w-3.5 h-3.5 text-rose-400 shrink-0" /> Personal expenses & tipping
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <Ban className="w-3.5 h-3.5 text-rose-400 shrink-0" /> International Airfare (quoted on request)
                    </div>
                  </div>

                  {/* Cancellation Policy */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-300 text-center">
                    <span className="text-emerald-400 font-bold block">Free Cancellation</span>
                    <span>Up to 14 days before departure (less visa cost)</span>
                  </div>

                  {/* Availability & Action */}
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Live Agency Allocation
                    </span>

                    <button
                      onClick={() => {
                        onClose();
                        onRequestQuote(pkg);
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-300 hover:to-emerald-300 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Select & Request Quote</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
