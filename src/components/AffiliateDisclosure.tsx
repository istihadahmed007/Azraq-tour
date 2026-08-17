import React from 'react';
import { ShieldCheck, Info, MessageCircle, ExternalLink } from 'lucide-react';
import { AZRAQ_AGENCY_CONFIG } from '../data/agencyConfig';

interface AffiliateDisclosureProps {
  variant?: 'inline' | 'compact' | 'card';
  className?: string;
}

export const AffiliateDisclosure: React.FC<AffiliateDisclosureProps> = ({
  variant = 'inline',
  className = '',
}) => {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 text-xs text-slate-500 ${className}`}>
        <Info className="w-3.5 h-3.5 text-sky-600 shrink-0" />
        <p className="leading-tight">
          Flight search and booking services are provided through our travel partners. We may earn a commission when you complete a booking through our affiliate links.
        </p>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs ${className}`}>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5 border border-sky-100">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Official Travel Partner & Affiliate Disclosure
              </h4>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Official Partner
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {AZRAQ_AGENCY_CONFIG.officialAffiliateDisclosure}
            </p>
            <p className="text-[11px] text-slate-500 pt-1 flex items-center gap-2">
              <span>Need visa assistance or offline group flight bookings?</span>
              <a
                href={`https://wa.me/${AZRAQ_AGENCY_CONFIG.whatsappNumber}?text=${encodeURIComponent(
                  'Hello Azraq Concierge! I need assistance with flights and visa from Dhaka.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-emerald-600 font-bold hover:underline"
              >
                <MessageCircle className="w-3 h-3" />
                <span>Chat with Dhaka Desk</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`px-3.5 py-2.5 rounded-xl bg-sky-50/70 border border-sky-100/90 text-xs text-slate-600 flex items-center justify-between gap-3 flex-wrap ${className}`}
    >
      <div className="flex items-center gap-2 flex-1 min-w-[240px]">
        <Info className="w-3.5 h-3.5 text-sky-600 shrink-0" />
        <p className="leading-snug">
          {AZRAQ_AGENCY_CONFIG.officialAffiliateDisclosure}
        </p>
      </div>
      <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 shrink-0">
        <span>Powered by Aviasales / Travelpayouts</span>
        <a
          href="https://aviasales.tp.st/72ntufDx"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-600 hover:text-sky-800 flex items-center gap-0.5"
        >
          <span>Partner Gateway</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
