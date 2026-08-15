import React from 'react';
import { useEnRoute } from '../../context/EnRouteContext';
import { ItineraryItem } from '../../types';
import { Clock, MapPin, Sparkles, CloudRain, ShieldCheck, CheckCircle2, ChevronRight, Lock } from 'lucide-react';

export const TimelineStrip: React.FC = () => {
  const { itinerary, triggerWeatherRainSimulation, triggerTrafficDelaySimulation, setActiveDashboardTab } = useEnRoute();

  return (
    <div className="w-full bg-slate-900 border-t border-slate-800 p-3.5 flex flex-col justify-between">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Adaptive Timeline <span className="text-[10px] text-slate-500 font-normal">(Rule B Locked)</span>
          </h3>
        </div>

        {/* Quick Simulation Triggers for real-time reactivity */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={triggerWeatherRainSimulation}
            title="Simulate Rain Forecast in 20m"
            className="flex items-center gap-1 text-[10px] font-semibold bg-sky-950/80 text-sky-400 border border-sky-800/60 px-2 py-1 rounded-lg hover:bg-sky-900 transition-colors"
          >
            <CloudRain className="w-3 h-3" />
            <span>Rain Radar</span>
          </button>
          <button
            onClick={triggerTrafficDelaySimulation}
            title="Simulate Traffic Delay on Anchor"
            className="flex items-center gap-1 text-[10px] font-semibold bg-amber-950/80 text-amber-400 border border-amber-800/60 px-2 py-1 rounded-lg hover:bg-amber-900 transition-colors"
          >
            <span>⏱️ +25m Delay</span>
          </button>
        </div>
      </div>

      {/* Horizontally Scrollable Timeline Strip */}
      <div className="flex items-stretch gap-3 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
        {itinerary.map((item, index) => {
          const isAnchor = item.type === 'Anchor';
          const isCompleted = item.status === 'Completed';
          const isActive = item.status === 'Active';
          const isConfirmed = item.status === 'Confirmed';

          // Color coding specified in UX requirements:
          // Green = Completed, Orange = Active, Grey = Upcoming, Blue/Purple = Flexible Bubble
          const statusBadgeColor = isCompleted
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
            : isActive
            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse'
            : isAnchor
            ? 'bg-slate-800 text-slate-300 border-slate-700'
            : 'bg-sky-950/60 text-sky-300 border-sky-700/50';

          const cardBorderColor = isCompleted
            ? 'border-emerald-500/40 bg-slate-900/90'
            : isActive
            ? 'border-amber-500/60 bg-amber-950/20 shadow-lg shadow-amber-950/50'
            : isAnchor
            ? 'border-slate-800 bg-slate-800/60'
            : 'border-sky-800/40 bg-sky-950/20';

          return (
            <div
              key={item.itemId}
              className={`flex-shrink-0 w-64 rounded-2xl border ${cardBorderColor} p-3 flex flex-col justify-between transition-all hover:scale-[1.02] cursor-pointer`}
              onClick={() => {
                if (item.category === 'food') {
                  setActiveDashboardTab('swipe');
                }
              }}
            >
              <div>
                {/* Time & Type Tag */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-white tracking-wide">
                      {item.startTime} - {item.endTime}
                    </span>
                    {isAnchor && (
                      <span className="flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                        <Lock className="w-2.5 h-2.5 text-amber-400" />
                        Anchor
                      </span>
                    )}
                    {!isAnchor && (
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-sky-900/60 text-sky-300 px-1.5 py-0.5 rounded border border-sky-700/50">
                        45m Bubble
                      </span>
                    )}
                  </div>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusBadgeColor}`}>
                    {item.status}
                  </span>
                </div>

                {/* Venue Name */}
                <h4 className="font-bold text-xs text-slate-100 line-clamp-1 flex items-center gap-1.5">
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                  <span>{item.venueName}</span>
                </h4>

                {/* Subtitle / Notes */}
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                  {item.notes || item.location.address}
                </p>
              </div>

              {/* Bottom footer in card */}
              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span className="truncate max-w-[110px]">{item.location.address.split(',')[0]}</span>
                </div>

                {item.voteStats && (
                  <span className="font-semibold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {item.voteStats.consensusPercent}% Consensus
                  </span>
                )}
                {!item.voteStats && item.weatherSensitive && (
                  <span className="text-sky-400 flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" /> Outdoor
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
