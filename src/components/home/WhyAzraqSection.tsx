import React from 'react';
import { Star, ShieldCheck, HeartHandshake, Award, Headphones, CheckCircle2 } from 'lucide-react';
import { getOptimizedUnsplashUrl } from '../../utils/imageOptimization';

export const WhyAzraqSection: React.FC = () => {
  const travelerGallery = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=500&q=80',
  ];

  const highlights = [
    {
      title: 'Dedicated Dhaka Concierge',
      desc: 'Get fast, real-time responses on WhatsApp for flight changes, visa queries, and emergency travel support.',
    },
    {
      title: 'Zero Hidden Markups',
      desc: 'Transparent pricing with all embassy fees, taxes, and luggage allowances clearly itemized before booking.',
    },
    {
      title: 'Tested Asian Itineraries',
      desc: 'Every tour package is tailored for Bangladeshi families, honeymooners, and solo adventurers.',
    },
    {
      title: 'Official Partner Transparency',
      desc: 'Direct partner flight search powered by licensed global reservation systems and major regional airlines.',
    },
  ];

  const testimonials = [
    {
      name: 'Farhan Rahman',
      destination: 'Family Holiday in Bangkok & Pattaya',
      review:
        'Azraq handled our 6-member family visas and flights flawlessly. Everything from the private airport transfer to the hotel accommodations was spot on.',
      rating: 5,
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Sadia Karim',
      destination: 'Couple Honeymoon in Maldives',
      review:
        'The water villa package booked through Azraq was unbelievable value. Transparent pricing with zero hidden fees, and our speed boat transfers were seamless.',
      rating: 5,
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Dr. Tariqul Islam',
      destination: 'Medical & Leisure in Singapore',
      review:
        'Fast e-visa processing and immediate flight assistance when our return schedule changed. True professional concierge service for Bangladeshi travelers.',
      rating: 5,
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    },
  ];

  return (
    <section className="w-full bg-slate-100/70 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Why Choose Azraq Highlights */}
        <div className="space-y-4">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0D6EFD] font-mono">
              The Azraq Difference
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#071A33] tracking-tight font-poppins">
              Built for Bangladeshi Travelers
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              We bridge the gap between complex international travel systems and friendly local service.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {highlights.map((h, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0D6EFD] flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <h3 className="text-sm font-bold text-[#071A33] font-poppins">{h.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Traveler Gallery & Customer Reviews */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-[#071A33] font-poppins">Traveler Memories & Feedback</h3>
              <p className="text-xs text-slate-500">Real feedback from clients who booked their holiday with Azraq</p>
            </div>
            <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.9 / 5 Average Rating</span>
            </div>
          </div>

          {/* Gallery grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {travelerGallery.map((imgUrl, idx) => (
              <div
                key={idx}
                className="h-32 sm:h-40 rounded-2xl overflow-hidden shadow-xs bg-slate-900 border border-slate-200"
              >
                <img
                  src={getOptimizedUnsplashUrl(imgUrl, 450, 75)}
                  alt={`Traveler photo ${idx + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item, i) => (
              <div
                key={i}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(item.rating)].map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    "{item.review}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#071A33] font-poppins">{item.name}</h4>
                    <p className="text-[11px] text-slate-500">{item.destination}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
