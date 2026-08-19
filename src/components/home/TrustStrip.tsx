import React from 'react';
import { Tag, ShieldCheck, Headphones, Compass } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const trustItems = [
    {
      icon: <Tag className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50',
      title: '100% Genuine Rates',
      desc: 'Zero hidden booking markups',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
      title: 'Visa Assistance',
      desc: 'Full documentation guidance',
    },
    {
      icon: <Compass className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50',
      title: 'Curated Asian Trips',
      desc: 'Tested routes & stays',
    },
    {
      icon: <Headphones className="w-5 h-5 text-sky-600" />,
      bg: 'bg-sky-50',
      title: 'Dhaka Travel Desk',
      desc: 'Direct WhatsApp support',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 py-2">
        {trustItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow"
          >
            <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
              {item.icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#071A33] font-poppins">{item.title}</h3>
              <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
