import React, { useState, useEffect, useRef } from 'react';
import { StoryHighlight, StorySlide } from '../types';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Flame,
  Send,
  Volume2,
  VolumeX,
  Play,
  Pause,
  MapPin,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Plane,
  Stamp,
  CheckCircle2,
} from 'lucide-react';

interface StoryViewerModalProps {
  highlights: StoryHighlight[];
  initialHighlightId: string;
  initialSlideIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  onOpenFlightQuote?: (destination?: string) => void;
  onOpenVisaQuote?: (country?: string) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  highlights,
  initialHighlightId,
  initialSlideIndex = 0,
  isOpen,
  onClose,
  onOpenFlightQuote,
  onOpenVisaQuote,
}) => {
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [floatingReactions, setFloatingReactions] = useState<{ id: string; emoji: string; x: number }[]>([]);
  const [customReply, setCustomReply] = useState('');
  const [showSentToast, setShowSentToast] = useState(false);

  const SLIDE_DURATION_MS = 5000;
  const progressIntervalRef = useRef<any>(null);

  // Set initial highlight on open
  useEffect(() => {
    if (isOpen) {
      const idx = highlights.findIndex((h) => h.id === initialHighlightId);
      if (idx !== -1) {
        setCurrentHighlightIndex(idx);
        setCurrentSlideIndex(Math.min(initialSlideIndex, (highlights[idx]?.slides.length || 1) - 1));
      } else {
        setCurrentHighlightIndex(0);
        setCurrentSlideIndex(0);
      }
      setProgress(0);
      setIsPaused(false);
    }
  }, [isOpen, initialHighlightId, initialSlideIndex, highlights]);

  const currentHighlight = highlights[currentHighlightIndex] || highlights[0];
  const currentSlide: StorySlide | undefined = currentHighlight?.slides[currentSlideIndex];

  // Timer loop for active slide
  useEffect(() => {
    if (!isOpen || isPaused || !currentSlide) return;

    const intervalTime = 50;
    const increment = (intervalTime / SLIDE_DURATION_MS) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNextSlide();
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isOpen, isPaused, currentHighlightIndex, currentSlideIndex, currentSlide]);

  const handleNextSlide = () => {
    if (!currentHighlight) return;
    if (currentSlideIndex < currentHighlight.slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      // Advance to next highlight
      if (currentHighlightIndex < highlights.length - 1) {
        setCurrentHighlightIndex((prev) => prev + 1);
        setCurrentSlideIndex(0);
        setProgress(0);
      } else {
        // End of all stories
        onClose();
      }
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
      setProgress(0);
    } else {
      // Go to previous highlight's last slide
      if (currentHighlightIndex > 0) {
        const prevHIndex = currentHighlightIndex - 1;
        setCurrentHighlightIndex(prevHIndex);
        setCurrentSlideIndex(highlights[prevHIndex].slides.length - 1);
        setProgress(0);
      } else {
        setProgress(0);
      }
    }
  };

  const handleCtaClick = () => {
    if (!currentSlide) return;
    setIsPaused(true);

    if (currentSlide.ctaType === 'whatsapp') {
      const msg = `Hello Azraq Tours! I saw your Story about "${currentSlide.headline}" (${currentHighlight.title}). I want to inquire about packages & rates.`;
      window.open(`https://wa.me/8801851172032?text=${encodeURIComponent(msg)}`, '_blank');
    } else if (currentSlide.ctaType === 'quote_flight' && onOpenFlightQuote) {
      onClose();
      onOpenFlightQuote(currentSlide.ctaDestination || currentHighlight.title);
    } else if (currentSlide.ctaType === 'quote_visa' && onOpenVisaQuote) {
      onClose();
      onOpenVisaQuote(currentSlide.ctaDestination || currentHighlight.title);
    } else {
      const msg = `Hi Azraq Tours! I want more details on ${currentSlide.headline}`;
      window.open(`https://wa.me/8801851172032?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };

  const triggerReaction = (emoji: string) => {
    const id = `react_${Date.now()}_${Math.random()}`;
    const x = 30 + Math.random() * 40; // random horizontal percentage
    setFloatingReactions((prev) => [...prev, { id, emoji, x }]);

    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
    }, 1800);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customReply.trim()) return;
    triggerReaction('💬');
    setShowSentToast(true);
    setCustomReply('');
    setTimeout(() => setShowSentToast(false), 2500);
  };

  if (!isOpen || !currentHighlight || !currentSlide) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center select-none animate-fade-in p-0 sm:p-4">
      {/* Desktop Background Blur */}
      <div
        className="absolute inset-0 opacity-20 blur-3xl scale-125 pointer-events-none bg-cover bg-center"
        style={{ backgroundImage: `url(${currentSlide.mediaUrl})` }}
      />

      {/* Close Button Top Right */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-2.5 rounded-full bg-black/60 hover:bg-white/20 text-white/90 hover:text-white transition-all backdrop-blur-md cursor-pointer shadow-lg"
        title="Close Story (Esc)"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Desktop Left Navigation Arrow */}
      <button
        onClick={handlePrevSlide}
        className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md cursor-pointer hover:scale-110 active:scale-95"
        title="Previous Story"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Desktop Right Navigation Arrow */}
      <button
        onClick={handleNextSlide}
        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md cursor-pointer hover:scale-110 active:scale-95"
        title="Next Story"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Story Phone/Card Frame */}
      <div
        className="relative w-full h-full sm:h-[88vh] sm:max-h-[850px] sm:max-w-[420px] rounded-none sm:rounded-[32px] overflow-hidden shadow-2xl border-0 sm:border sm:border-white/20 bg-slate-950 flex flex-col justify-between"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Story Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentSlide.mediaUrl}
            alt={currentSlide.headline}
            className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
          />
          {/* Top and Bottom Vignette Overlays for Maximum Legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/90 pointer-events-none" />
        </div>

        {/* Tap Target Zones for Mobile Story Navigation */}
        <div className="absolute inset-0 z-10 flex">
          <div
            className="w-1/3 h-3/4 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevSlide();
            }}
            title="Tap left for previous"
          />
          <div
            className="w-2/3 h-3/4 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleNextSlide();
            }}
            title="Tap right for next"
          />
        </div>

        {/* TOP HEADER SECTION */}
        <div className="relative z-20 p-4 space-y-3">
          {/* Multi-Slide Progress Bars */}
          <div className="flex items-center gap-1.5 w-full">
            {currentHighlight.slides.map((slide, idx) => {
              let fillWidth = '0%';
              if (idx < currentSlideIndex) fillWidth = '100%';
              else if (idx === currentSlideIndex) fillWidth = `${progress}%`;

              return (
                <div
                  key={slide.id}
                  className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden backdrop-blur-sm"
                >
                  <div
                    className="h-full bg-white transition-all duration-75 ease-linear"
                    style={{ width: fillWidth }}
                  />
                </div>
              );
            })}
          </div>

          {/* Author Profile & Time Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-rose-500 to-sky-400 shadow-md">
                <img
                  src={currentHighlight.coverImage}
                  alt={currentHighlight.title}
                  className="w-full h-full rounded-full object-cover border border-slate-900"
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white tracking-tight font-serif-display">
                    azraq_tours
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
                  <span className="text-xs text-white/70">• {currentSlide.dateAgo || 'Today'}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-amber-300 font-medium">
                  <span>{currentHighlight.emoji}</span>
                  <span>{currentHighlight.title} Highlight</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaused(!isPaused);
                }}
                className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white/90 backdrop-blur-md cursor-pointer transition-colors"
                title={isPaused ? 'Resume Story' : 'Pause Story'}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white/90 backdrop-blur-md cursor-pointer transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* FLOATING REACTIONS OVERLAY */}
        <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
          {floatingReactions.map((r) => (
            <div
              key={r.id}
              className="absolute bottom-24 text-3xl animate-float-up opacity-90 transition-all"
              style={{ left: `${r.x}%` }}
            >
              {r.emoji}
            </div>
          ))}
        </div>

        {/* BOTTOM STORY CONTENT & CALL TO ACTION */}
        <div className="relative z-20 p-5 space-y-4">
          {/* Badge & Location Tag */}
          <div className="flex flex-wrap items-center gap-2">
            {currentSlide.badge && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-md">
                ✨ {currentSlide.badge}
              </span>
            )}

            {currentSlide.location && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/50 text-sky-200 border border-white/10 backdrop-blur-md flex items-center gap-1">
                <MapPin className="w-3 h-3 text-sky-400" />
                <span>{currentSlide.location}</span>
              </span>
            )}
          </div>

          {/* Headline & Micro-Caption */}
          <div className="space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-bold font-serif-display text-white tracking-tight leading-tight drop-shadow-md">
              {currentSlide.headline}
            </h3>
            <p className="text-xs sm:text-sm text-slate-100/90 leading-relaxed font-normal drop-shadow-sm">
              {currentSlide.caption}
            </p>
          </div>

          {/* PRIMARY CALL TO ACTION BUTTON (Instagram Stories "Swipe Up / Tap" CTA) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCtaClick();
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-extrabold text-sm transition-all transform active:scale-95 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{currentSlide.ctaText || '📲 Inquire on WhatsApp'}</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          {/* QUICK EMOJI REACTIONS & DIRECT MESSAGE BAR */}
          <div className="space-y-2 pt-1 border-t border-white/15">
            <div className="flex items-center justify-between gap-2">
              {/* Quick Emojis */}
              <div className="flex items-center gap-2">
                {['❤️', '🔥', '😍', '👏', '🏝️'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerReaction(emoji);
                    }}
                    className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 hover:scale-125 active:scale-95 transition-all flex items-center justify-center text-lg cursor-pointer backdrop-blur-sm shadow-md"
                    title={`React ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Share */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(window.location.href);
                  triggerReaction('✨');
                  setShowSentToast(true);
                  setTimeout(() => setShowSentToast(false), 2000);
                }}
                className="p-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white cursor-pointer transition-transform hover:scale-110"
                title="Share Story link"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Message Azraq Form */}
            <form onSubmit={handleSendReply} className="relative flex items-center">
              <input
                type="text"
                value={customReply}
                onChange={(e) => setCustomReply(e.target.value)}
                placeholder="Send message to Azraq Tours..."
                className="w-full bg-white/10 focus:bg-white/20 border border-white/20 rounded-full py-2.5 pl-4 pr-12 text-xs text-white placeholder:text-white/60 focus:outline-none backdrop-blur-md"
              />
              <button
                type="submit"
                className="absolute right-1.5 p-1.5 rounded-full bg-sky-500 text-slate-950 font-bold hover:bg-sky-400 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {showSentToast && (
              <p className="text-[11px] text-center text-emerald-300 font-bold animate-fade-in">
                ✨ Message & reaction sent to Azraq concierge!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
