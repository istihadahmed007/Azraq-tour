import React, { useState } from 'react';
import { useEnRoute } from '../../context/EnRouteContext';
import { Heart, X, Sparkles, Filter, MapPin, Star, Flame, Check, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SwipeModal: React.FC = () => {
  const {
    places,
    activePlaceIndex,
    handleSwipe,
    members,
    compromiseFilters,
    setCompromiseFilters,
    runVotingConsensusCheck,
    setActiveDashboardTab,
  } = useEnRoute();

  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const currentPlace = places[activePlaceIndex];
  const totalCards = places.length;
  const isFinished = activePlaceIndex >= totalCards;

  // Filtered check
  const filteredPlaces = places.filter((p) => {
    if (p.priceLevel > compromiseFilters.maxPriceLevel) return false;
    if (p.walkingTimeMins > compromiseFilters.maxWalkingMins) return false;
    if (compromiseFilters.indoorOnly && !p.indoor) return false;
    return true;
  });

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-white p-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="text-base font-extrabold text-white tracking-tight">The Group Compass</h2>
          </div>
          <p className="text-xs text-slate-400">Democratized Swipe Deck (Rule B: 60% Consensus)</p>
        </div>

        <button
          onClick={() => setShowFilterDrawer(!showFilterDrawer)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
            showFilterDrawer
              ? 'bg-amber-500/20 border-amber-500 text-amber-300'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Compromise Filter</span>
        </button>
      </div>

      {/* Compromise Filter Drawer */}
      {showFilterDrawer && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-3 animate-in fade-in slide-in-from-top-2 text-xs space-y-3">
          <div className="flex items-center justify-between font-bold text-slate-200">
            <span>Admin Compromise Parameters</span>
            <span className="text-[10px] text-slate-400 font-normal">Calculates Highest Common Denominator</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Max Price: {compromiseFilters.maxPriceLevel === 1 ? '€' : compromiseFilters.maxPriceLevel === 2 ? '€€' : '€€€'}</label>
              <input
                type="range"
                min={1}
                max={4}
                value={compromiseFilters.maxPriceLevel}
                onChange={(e) => setCompromiseFilters((prev) => ({ ...prev, maxPriceLevel: Number(e.target.value) }))}
                className="w-full accent-amber-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Max Walk Time: {compromiseFilters.maxWalkingMins} mins</label>
              <input
                type="range"
                min={5}
                max={30}
                step={5}
                value={compromiseFilters.maxWalkingMins}
                onChange={(e) => setCompromiseFilters((prev) => ({ ...prev, maxWalkingMins: Number(e.target.value) }))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Card Deck Area */}
      <div className="relative flex-1 flex items-center justify-center min-h-[420px]">
        <AnimatePresence mode="wait">
          {!isFinished && currentPlace ? (
            <motion.div
              key={currentPlace.placeId}
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, x: 200 }}
              transition={{ duration: 0.25 }}
              className="relative w-full h-full max-h-[460px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between"
            >
              {/* Top Image & Badge */}
              <div className="relative w-full h-56 overflow-hidden">
                <img
                  src={currentPlace.imageUrl}
                  alt={currentPlace.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full border border-slate-800 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {currentPlace.rating} ({currentPlace.reviewsCount})
                  </span>
                  <span className="bg-slate-950/80 backdrop-blur-md text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-800">
                    {currentPlace.priceText}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="bg-sky-950/90 text-sky-300 text-xs font-bold px-2.5 py-1 rounded-full border border-sky-700/50">
                    🚶 {currentPlace.walkingTimeMins} min walk
                  </span>
                </div>

                {/* Live Consensus Meter on Card */}
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs text-white">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold">Group Consensus:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-emerald-400">{currentPlace.consensusPercent}%</span>
                    <span className="text-[10px] text-slate-400">({currentPlace.yesVotes}/{members.length} Likes)</span>
                  </div>
                </div>
              </div>

              {/* Place Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{currentPlace.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{currentPlace.address}</span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {currentPlace.specialty}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {currentPlace.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-slate-800/80 text-slate-300 text-[10px] font-medium px-2 py-0.5 rounded-md border border-slate-700/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Swipe Action Buttons */}
                <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-slate-800/60">
                  <button
                    onClick={() => handleSwipe('pass')}
                    className="w-14 h-14 rounded-full bg-slate-800 hover:bg-red-950/60 active:scale-90 border-2 border-red-500/40 hover:border-red-500 text-red-400 flex items-center justify-center shadow-xl transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <button
                    onClick={() => {
                      handleSwipe('like');
                      if (currentPlace.placeId === 'place_el_xampanyet') {
                        runVotingConsensusCheck('place_el_xampanyet');
                      }
                    }}
                    className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 border-2 border-white/60 text-white flex items-center justify-center shadow-2xl transition-all"
                  >
                    <Heart className="w-7 h-7 fill-white" />
                  </button>

                  <button
                    onClick={() => {
                      runVotingConsensusCheck(currentPlace.placeId);
                      setActiveDashboardTab('command');
                    }}
                    title="Lock into Timeline immediately (Rule B)"
                    className="w-14 h-14 rounded-full bg-slate-800 hover:bg-amber-950/60 active:scale-90 border-2 border-amber-500/40 hover:border-amber-500 text-amber-400 flex items-center justify-center shadow-xl transition-all text-xs font-bold flex-col gap-0.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[9px]">Lock</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center max-w-sm w-full shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Deck Complete!</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Highest Common Denominator algorithm locked <span className="text-emerald-400 font-bold">El Xampanyet (75% Consensus)</span> as tonight’s 8:00 PM Dinner Anchor!
              </p>
              <button
                onClick={() => setActiveDashboardTab('command')}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Return to Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer step counter */}
      <div className="text-center text-[11px] text-slate-500 mt-2 font-mono">
        Card {Math.min(activePlaceIndex + 1, totalCards)} of {totalCards} • Swipe right to vote YES
      </div>
    </div>
  );
};
