import React from 'react';

interface WhyRequestQuoteSectionProps {
  onOpenVisaQuote: () => void;
  onOpenFlightQuote: () => void;
}

export const WhyRequestQuoteSection: React.FC<WhyRequestQuoteSectionProps> = ({
  onOpenVisaQuote,
  onOpenFlightQuote,
}) => {
  const features = [
    {
      id: 'pricing',
      title: 'Personalized Pricing',
      icon: 'account_balance_wallet',
      onClick: onOpenFlightQuote,
    },
    {
      id: 'visa',
      title: 'Visa Assistance',
      icon: 'assignment_turned_in',
      onClick: onOpenVisaQuote,
    },
    {
      id: 'airlines',
      title: 'Multiple Airline Options',
      icon: 'connecting_airports',
      onClick: onOpenFlightQuote,
    },
    {
      id: 'support',
      title: 'Expert Travel Support',
      icon: 'support_agent',
      onClick: () => {
        window.open('https://wa.me/8801851172032?text=Hello%20Azraq%20Tours!%20I%20would%20like%20expert%20travel%20support.', '_blank');
      },
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Assistance',
      icon: 'chat',
      onClick: () => {
        window.open('https://wa.me/8801851172032?text=Hello%20Azraq%20Tours!%20I%20would%20like%20assistance%20with%20my%20trip.', '_blank');
      },
    },
    {
      id: 'transparency',
      title: 'Transparent Service',
      icon: 'verified',
      onClick: onOpenVisaQuote,
    },
  ];

  return (
    <section className="w-full my-2" id="why-azraq-quote">
      <div className="relative overflow-hidden rounded-3xl bg-[#091523]/90 border border-sky-500/20 p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-2xl">
        {/* Section Header */}
        <div className="relative text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-wider uppercase font-sans">
            WHY REQUEST A QUOTE FROM AZRAQ TOURS?
          </h2>
        </div>

        {/* 6 Feature Cards in single horizontal grid matching Capture.PNG */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 relative z-10 w-full">
          {features.map((feature) => (
            <div
              key={feature.id}
              onClick={feature.onClick}
              className="group relative rounded-2xl bg-[#0F1D2E]/80 hover:bg-[#14263B] border border-cyan-500/15 hover:border-cyan-400/50 p-5 flex flex-col items-center justify-center text-center gap-3.5 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 min-h-[140px]"
            >
              <div className="text-cyan-400 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl md:text-4xl text-[#00d2ff]">
                  {feature.icon}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-white leading-tight">
                {feature.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
