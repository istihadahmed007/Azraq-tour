import React from 'react';
import { useEnRoute } from '../../context/EnRouteContext';
import { SentinelMap } from './SentinelMap';
import { TimelineStrip } from './TimelineStrip';
import { DetourBanner } from './DetourBanner';
import { SwipeModal } from './SwipeModal';
import { BillSplitModal } from './BillSplitModal';
import { GroupActivityDrawer } from './GroupActivityDrawer';
import { RipcordFAB } from './RipcordFAB';
import {
  Compass,
  MapPin,
  Flame,
  Receipt,
  MessageSquare,
  Clock,
  Sparkles,
  AlertTriangle,
  Radio,
  CloudRain,
  ShieldCheck,
} from 'lucide-react';

export const EnRouteCommandCenter: React.FC = () => {
  const {
    trip,
    members,
    activeDashboardTab,
    setActiveDashboardTab,
    isGoldenPathRunning,
    runGoldenPathDemo,
    weatherAlert,
    trafficAlert,
    applyTrafficDelayToTimeline,
    dismissTrafficAlert,
  } = useEnRoute();

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 overflow-hidden font-sans select-none relative">
      {/* Top Mobile App Header */}
      <header className="flex-shrink-0 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-950">
            <Compass className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm tracking-tight text-white">EnRoute</h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                PWA
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              {trip.destination} • {members.length} Members
            </p>
          </div>
        </div>

        {/* 1-Tap Golden Path Demo Runner */}
        <button
          onClick={runGoldenPathDemo}
          disabled={isGoldenPathRunning}
          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-95 text-slate-950 text-xs font-black px-3 py-1.5 rounded-full shadow-lg shadow-amber-950/50 transition-all border border-amber-300/40"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isGoldenPathRunning ? 'Simulating MVP...' : 'Golden Path Demo'}</span>
        </button>
      </header>

      {/* Detour Banner (Rule A Active Trigger) */}
      <DetourBanner />

      {/* Traffic Alert Trigger */}
      {trafficAlert && (
        <div className="bg-amber-950/90 border-b border-amber-700/80 px-4 py-2 text-xs text-amber-200 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <span>⚠️ Traffic Gridlock on route to "{trafficAlert.anchorName}" (+{trafficAlert.delayMins}m).</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={applyTrafficDelayToTimeline}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-1 rounded-lg font-bold text-[11px]"
            >
              Delay Anchor +30m
            </button>
            <button onClick={dismissTrafficAlert} className="text-slate-400 text-xs hover:text-white">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Weather Trigger Banner */}
      {weatherAlert && (
        <div className="bg-sky-950/90 border-b border-sky-800 px-4 py-2 text-xs text-sky-200 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-sky-400 animate-bounce" />
            <span>{weatherAlert.message}</span>
          </div>
          <span className="text-[10px] bg-sky-800 text-white px-2 py-0.5 rounded font-bold">Auto-Swapped</span>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col min-h-0">
        {activeDashboardTab === 'command' && (
          <div className="w-full h-full flex flex-col min-h-0">
            {/* Top Area: Sentinel Map */}
            <div className="flex-1 min-h-[220px] w-full relative z-0 isolate overflow-hidden">
              <SentinelMap />
            </div>

            {/* Bottom Area: Horizontally Scrollable Timeline Strip */}
            <div className="h-44 sm:h-52 w-full flex-shrink-0 relative z-10 border-t border-slate-800/80">
              <TimelineStrip />
            </div>
          </div>
        )}

        {activeDashboardTab === 'swipe' && <SwipeModal />}
        {activeDashboardTab === 'bills' && <BillSplitModal />}
        {activeDashboardTab === 'chat' && <GroupActivityDrawer />}
      </main>

      {/* The Ripcord FAB (Bottom-Right Persistent) */}
      <RipcordFAB />

      {/* Bottom Navigation Bar */}
      <nav className="flex-shrink-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex items-center justify-around z-30">
        <button
          onClick={() => setActiveDashboardTab('command')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeDashboardTab === 'command'
              ? 'text-sky-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Command</span>
        </button>

        <button
          onClick={() => setActiveDashboardTab('swipe')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeDashboardTab === 'swipe'
              ? 'text-orange-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-5 h-5" />
          <span className="text-[10px]">Group Swipe</span>
        </button>

        <button
          onClick={() => setActiveDashboardTab('bills')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeDashboardTab === 'bills'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Receipt className="w-5 h-5" />
          <span className="text-[10px]">Bill Split</span>
        </button>

        <button
          onClick={() => setActiveDashboardTab('chat')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeDashboardTab === 'chat'
              ? 'text-indigo-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px]">Live Sync</span>
        </button>
      </nav>
    </div>
  );
};
