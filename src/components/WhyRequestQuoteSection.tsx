import React from 'react';

interface WhyRequestQuoteSectionProps {
  onOpenVisaQuote: () => void;
  onOpenFlightQuote: () => void;
}

export const WhyRequestQuoteSection: React.FC<WhyRequestQuoteSectionProps> = ({
  onOpenVisaQuote,
  onOpenFlightQuote,
}) => {
  const trustFeatures = [
    {
      id: 'response-time',
      title: '2-Hour Response Time',
      description: 'Quick custom quotation from experienced travel specialists in Dhaka.',
      icon: 'schedule',
      actionLabel: 'Get Fast Quote',
      onClick: onOpenFlightQuote,
      tag: 'Guaranteed',
    },
    {
      id: 'visa-support',
      title: '50+ Countries Visa Guide',
      description: 'End-to-end document audit, application forms & embassy fee clarity.',
      icon: 'verified_user',
      actionLabel: 'Check Visa Rules',
      onClick: onOpenVisaQuote,
      tag: 'Certified',
    },
    {
      id: 'biman-iata',
      title: 'Multiple Airline Fares',
      description: 'Compare Biman Bangladesh, Emirates, Singapore Airlines, US-Bangla & more.',
      icon: 'connecting_airports',
      actionLabel: 'Compare Flights',
      onClick: onOpenFlightQuote,
      tag: 'Best Routes',
    },
    {
      id: 'payments',
      title: 'Transparent BDT Pricing',
      description: 'Clear breakdown with no hidden fees. bKash, Nagad & Bank transfer accepted.',
      icon: 'payments',
      actionLabel: 'Payment Methods',
      onClick: onOpenFlightQuote,
      tag: 'Zero Markup',
    },
    {
      id: 'whatsapp-desk',
      title: 'Dedicated WhatsApp Desk',
      description: 'Instant updates, ticket delivery & itinerary modifications on your phone.',
      icon: 'chat',
      actionLabel: 'Chat +8801851172032',
      onClick: () => {
        window.open('https://wa.me/8801851172032?text=Hello%20Azraq%20Tours!%20I%20would%20like%20assistance%20with%20my%20trip.', '_blank');
      },
      tag: 'Live Desk',
    },
    {
      id: 'dhaka-office',
      title: 'Dhaka Travel Desk',
      description: 'Physical agency support based in Dhaka (Motijheel & Gulshan corridors).',
      icon: 'location_on',
      actionLabel: 'Visit / Contact',
      onClick: () => {
        window.open('https://wa.me/8801851172032?text=Hello%20Azraq%20Tours!%20Where%20is%20your%20Dhaka%20office%20located?', '_blank');
      },
      tag: 'Authorized',
    },
  ];

  return (
    <section className="w-full my-6" id="why-azraq-quote" aria-labelledby="why-azraq-heading">
      <div className="relative overflow-hidden rounded-3xl bg-[#091523]/95 border border-sky-500/25 p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-2xl">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Section Header */}
        <div className="relative text-center max-w-3xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm text-sky-400">verified</span>
            <span>Agency Guarantee & Trust Standards</span>
          </div>

          <h2 id="why-azraq-heading" className="text-2xl sm:text-3xl md:text-4xl font-serif-display font-extrabold text-white tracking-tight">
            Why Book Your Travel with Azraq Tours?
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            We bridge international flight corridors and consular visa procedures with personalized human care from Dhaka.
          </p>
        </div>

        {/* 6 Trust Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10 w-full">
          {trustFeatures.map((feature) => (
            <div
              key={feature.id}
              onClick={feature.onClick}
              className="group relative rounded-2xl bg-[#0F1D2E]/90 hover:bg-[#14263B] border border-cyan-500/20 hover:border-cyan-400/60 p-5 flex flex-col justify-between gap-3 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <span className="material-symbols-outlined text-2xl">
                    {feature.icon}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-sky-300 text-[10px] font-bold border border-sky-400/30 uppercase tracking-wider">
                  {feature.tag}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                <span>{feature.actionLabel}</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Evidence & Disclaimers Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 text-center md:text-left relative z-10">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="material-symbols-outlined text-sm text-emerald-400">check_circle</span>
              Dhaka Trade License & Civil Aviation Compliant
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="material-symbols-outlined text-sm text-sky-400">lock</span>
              Encrypted Data Privacy
            </span>
          </div>

          <p className="text-[11px] text-slate-400 max-w-md">
            *Visa fees, embassy processing times, and airline seat availability are subject to official authority verification at time of booking.
          </p>
        </div>
      </div>
    </section>
  );
};

