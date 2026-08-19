import React from 'react';
import { Mic, ArrowRight, Sparkles } from 'lucide-react';

interface VoicePlannerBannerProps {
  onOpenVoiceModal: (initialTranscript?: string) => void;
  onNavigateToPlanner?: () => void;
}

export const VoicePlannerBanner: React.FC<VoicePlannerBannerProps> = ({
  onOpenVoiceModal,
  onNavigateToPlanner,
}) => {
  const samplePrompts = [
    '5-day family escape in Bangkok & Phuket',
    '7-day Maldives overwater luxury honeymoon',
    '4-day Dubai shopping & Burj Khalifa getaway',
  ];

  return (
    <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#003580] via-[#0A2540] to-[#071A33] text-white p-6 sm:p-8 shadow-xl border border-blue-900/40">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-400/20 text-sky-200 border border-sky-300/30 text-xs font-bold tracking-wide uppercase font-mono">
              <Mic className="w-3.5 h-3.5 text-sky-300 animate-pulse" />
              <span>Web Speech AI Concierge</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight font-poppins">
              Plan your holiday simply by speaking
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              Speak your dream destination, travel dates, party size, and travel style. Our voice engine parses your preferences and crafts a custom day-by-day plan instantly.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-sky-300">Try speaking:</span>
              {samplePrompts.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onOpenVoiceModal(sample)}
                  className="min-h-[32px] px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-sky-100 border border-white/15 text-xs font-medium transition-colors cursor-pointer"
                >
                  "{sample}"
                </button>
              ))}
            </div>
          </div>

          <div className="shrink-0 w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenVoiceModal()}
              className="min-h-[48px] px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-400 to-[#0D6EFD] hover:from-sky-300 hover:to-blue-600 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-97"
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
                <Mic className="w-3.5 h-3.5 text-white" />
              </div>
              <span>Start Speaking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
