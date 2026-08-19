import React from 'react';
import { Search, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

interface FlightWorkflowSectionProps {
  onNavigateToFlights?: () => void;
}

export const FlightWorkflowSection: React.FC<FlightWorkflowSectionProps> = ({
  onNavigateToFlights,
}) => {
  const steps = [
    {
      step: '01',
      icon: <Search className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50',
      title: 'Compare Live Airfares',
      desc: 'Browse direct and 1-stop routes from Dhaka to across Asia and the Middle East with live pricing.',
    },
    {
      step: '02',
      icon: <FileText className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50',
      title: 'Request VIP Quote',
      desc: 'Lock in group rates, baggage allowances, and special requests with our Dhaka travel specialists.',
    },
    {
      step: '03',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
      title: 'Receive Instant E-Tickets',
      desc: 'Get your verified PNR and official ticket sent directly via WhatsApp and email with zero hidden fees.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0D6EFD] font-mono">
          How Azraq Works
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#071A33] tracking-tight font-poppins">
          Simple, Transparent Flight & Travel Booking
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          We combine real-time global inventory with dedicated local travel desk support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center`}>
                {s.icon}
              </div>
              <span className="text-2xl font-black text-slate-200 font-mono">{s.step}</span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-[#071A33] font-poppins">{s.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {onNavigateToFlights && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onNavigateToFlights}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0D6EFD] hover:text-blue-700 transition-colors cursor-pointer"
          >
            <span>Start flight search</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};
