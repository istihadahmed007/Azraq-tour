import React, { useState } from 'react';
import { TourPackage } from '../types';
import { getVisaFeeForDestination } from '../data/visaRequirementsData';
import {
  X,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle2,
  XCircle,
  Building2,
  Bus,
  Utensils,
  FileCheck,
  ShieldAlert,
  FileText,
  Send,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles
} from 'lucide-react';

interface PackageDetailModalProps {
  pkg: TourPackage | null;
  onClose: () => void;
  onRequestQuote: (pkg: TourPackage) => void;
}

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({
  pkg,
  onClose,
  onRequestQuote,
}) => {
  if (!pkg) return null;

  const [expandedDay, setExpandedDay] = useState<number | string | null>(1);

  const toggleDay = (dayNum: number | string) => {
    setExpandedDay(expandedDay === dayNum ? null : dayNum);
  };

  const heroImage =
    pkg.images && pkg.images.length > 0
      ? pkg.images[0]
      : 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello GlobeTrotter AI! I would like more information and a quote for: ${pkg.package_name} (${pkg.country}) - Duration: ${pkg.duration}`
    );
    window.open(`https://wa.me/8801700000000?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-sky-500/30 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Header / Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/80 hover:bg-slate-800 text-white border border-slate-700/60 transition-all shadow-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {/* Hero Banner */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden">
            <img src={heroImage} alt={pkg.package_name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-sky-500 text-white shadow-md flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {pkg.destination_name}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-950/80 text-sky-300 border border-slate-700/60">
                  {pkg.country}
                </span>
                {pkg.source_pdf && (
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    Source: {pkg.source_pdf}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{pkg.package_name}</h1>

              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-sky-200">
                <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-700">
                  <Clock className="w-4 h-4 text-sky-400" />
                  {pkg.duration}
                </span>
                <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-700 text-emerald-400 font-extrabold font-mono text-sm">
                  From {pkg.currency === 'BDT' ? '৳' : pkg.currency} {pkg.price.toLocaleString()} / person
                </span>
                <span className="flex items-center gap-1.5 bg-teal-950/90 px-3 py-1 rounded-lg border border-teal-500/40 text-teal-300 font-bold text-xs">
                  <FileCheck className="w-4 h-4 text-teal-400" />
                  Visa Fee: <span className="text-white font-extrabold">{pkg.visa_fee || getVisaFeeForDestination(pkg.country || pkg.destination_name)}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Main Content Body */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Package Overview */}
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                Package Overview
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed">{pkg.description}</p>
            </div>

            {/* Pricing Tiers Table */}
            {pkg.pricing_tiers && pkg.pricing_tiers.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Price Tier breakdown (Per Person)
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-slate-700/80 bg-slate-800/30">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-800/80 text-sky-300 font-bold border-b border-slate-700/80">
                      <tr>
                        <th className="py-3 px-4">Pax Quantity</th>
                        <th className="py-3 px-4">Price Per Person</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-200">
                      {pkg.pricing_tiers.map((tier, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                          <td className="py-3 px-4 font-semibold">{tier.pax} Person(s)</td>
                          <td className="py-3 px-4 font-mono font-extrabold text-emerald-400">
                            {pkg.currency === 'BDT' ? '৳' : pkg.currency} {tier.price.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-400">All Taxes Included</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Day by Day Itinerary */}
            {pkg.itinerary && pkg.itinerary.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-400" />
                  Day-by-Day Tour Itinerary
                </h3>
                <div className="space-y-3">
                  {pkg.itinerary.map((dayItem) => {
                    const isExpanded = expandedDay === dayItem.day;
                    return (
                      <div
                        key={dayItem.day}
                        className="bg-slate-800/40 rounded-2xl border border-slate-700/60 overflow-hidden"
                      >
                        <button
                          onClick={() => toggleDay(dayItem.day)}
                          className="w-full p-4 text-left flex items-center justify-between bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-xl bg-sky-600/90 text-white font-extrabold text-xs shadow-sm">
                              Day {dayItem.day}
                            </span>
                            <span className="font-bold text-sm text-white">{dayItem.title}</span>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-sky-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="p-4 space-y-3 bg-slate-900/40 border-t border-slate-800">
                            <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                              {dayItem.activities && dayItem.activities.map((act, actIdx) => (
                                <li key={actIdx} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0" />
                                  <span>{act}</span>
                                </li>
                              ))}
                            </ul>
                            {(dayItem.meals || dayItem.overnight) && (
                              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-4 text-xs font-semibold text-sky-200">
                                {dayItem.meals && <span>🍽️ Meals: {dayItem.meals}</span>}
                                {dayItem.overnight && <span>🏨 Overnight: {dayItem.overnight}</span>}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Hotel, Meals, Transportation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 space-y-2">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
                  <Building2 className="w-4 h-4" />
                  Hotel Details
                </div>
                <p className="text-xs text-slate-200 font-semibold">{pkg.hotel || 'Information not provided in the package document.'}</p>
              </div>

              <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <Utensils className="w-4 h-4" />
                  Meal Plan
                </div>
                <p className="text-xs text-slate-200 font-semibold">{pkg.meals || 'Information not provided in the package document.'}</p>
              </div>

              <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Bus className="w-4 h-4" />
                  Transportation
                </div>
                <p className="text-xs text-slate-200 font-semibold">{pkg.transportation || 'Information not provided in the package document.'}</p>
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inclusions */}
              <div className="bg-emerald-950/20 border border-emerald-500/30 p-5 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Package Inclusions
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                  {pkg.inclusions && pkg.inclusions.length > 0 ? (
                    pkg.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">Information not provided in the package document.</p>
                  )}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="bg-rose-950/20 border border-rose-500/30 p-5 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Package Exclusions
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                  {pkg.exclusions && pkg.exclusions.length > 0 ? (
                    pkg.exclusions.map((exc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{exc}</span>
                      </li>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">Information not provided in the package document.</p>
                  )}
                </ul>
              </div>
            </div>

            {/* Visa & Document Requirements */}
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                  <FileCheck className="w-4 h-4" />
                  Visa & Required Documents
                </h4>
                <div className="px-3 py-1 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold flex items-center gap-1.5">
                  <span>🛂 Visa Fee:</span>
                  <span className="text-white font-extrabold">{pkg.visa_fee || getVisaFeeForDestination(pkg.country || pkg.destination_name)}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-teal-500/20 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-slate-400 text-xs block">Estimated Visa Processing Cost for {pkg.country}:</span>
                  <span className="text-teal-300 font-extrabold text-sm">{pkg.visa_fee || getVisaFeeForDestination(pkg.country || pkg.destination_name)}</span>
                </div>
                <span className="text-[11px] text-teal-400/80 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20">
                  Official Embassy & Processing Charge Included
                </span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-200">
                <p>
                  <strong className="text-sky-300">Visa Info:</strong> {pkg.visa_information || 'Information not provided in the package document.'}
                </p>
                {pkg.required_documents && pkg.required_documents.length > 0 && (
                  <div className="pt-2">
                    <p className="font-bold text-slate-300 mb-1.5">Required Documents Checklist:</p>
                    <ul className="space-y-1.5 pl-4 list-disc text-slate-300">
                      {pkg.required_documents.map((doc, i) => (
                        <li key={i}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Important Notes & Terms */}
            {(pkg.important_notes?.length > 0 || pkg.terms_conditions?.length > 0) && (
              <div className="bg-amber-950/20 p-5 rounded-2xl border border-amber-500/30 space-y-3 text-xs sm:text-sm">
                <h4 className="font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  Important Information & Terms
                </h4>
                {pkg.important_notes?.map((note, i) => (
                  <p key={i} className="text-amber-200/90">
                    • {note}
                  </p>
                ))}
                {pkg.terms_conditions?.map((term, i) => (
                  <p key={i} className="text-amber-200/80">
                    • {term}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 font-semibold">
            <span>Direct PDF Source of Truth Package</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleWhatsApp}
              className="px-4 py-2.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Inquiry</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onRequestQuote(pkg);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Request Quotation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
