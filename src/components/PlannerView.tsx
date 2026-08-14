import React, { useState } from 'react';
import { ChatMessage, Itinerary, Spot } from '../types';
import { BudgetTracker } from './BudgetTracker';

interface PlannerViewProps {
  currentItinerary: Itinerary;
  onUpdateItinerary: (itinerary: Itinerary) => void;
  onSaveItinerary: (itinerary: Itinerary) => void;
  onViewOnMap: (spot?: Spot) => void;
  isSaved: boolean;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  currentItinerary,
  onUpdateItinerary,
  onSaveItinerary,
  onViewOnMap,
  isSaved,
}) => {
  // Tab state (Itinerary timeline vs Budget & Expense tracker)
  const [activeTab, setActiveTab] = useState<'itinerary' | 'budget'>('itinerary');

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'I can help you plan a trip, find family-friendly spots in Europe, calculate estimated travel budgets, or suggest packing lists.',
      timestamp: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Parameters state
  const [destinationInput, setDestinationInput] = useState(currentItinerary.destination || 'Kyoto, Japan');
  const [startDate, setStartDate] = useState('2026-10-12');
  const [endDate, setEndDate] = useState('2026-10-18');
  const [selectedVibes, setSelectedVibes] = useState<string[]>(['Culture', 'Food', 'Nature']);
  const [customVibeInput, setCustomVibeInput] = useState('');
  const [showAddVibe, setShowAddVibe] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Packing list state
  const [isPackingOpen, setIsPackingOpen] = useState(true);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Expanded days state
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 1: true, 2: true });

  const toggleVibe = (vibe: string) => {
    if (selectedVibes.includes(vibe)) {
      setSelectedVibes(selectedVibes.filter((v) => v !== vibe));
    } else {
      setSelectedVibes([...selectedVibes, vibe]);
    }
  };

  const handleAddCustomVibe = () => {
    if (customVibeInput.trim() && !selectedVibes.includes(customVibeInput.trim())) {
      setSelectedVibes([...selectedVibes, customVibeInput.trim()]);
      setCustomVibeInput('');
      setShowAddVibe(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const textToSend = chatInput;
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });
      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.response || 'I am happy to assist you with your travel plans!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Sorry, I had trouble reaching the concierge server. Please check your network and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleGenerateItinerary = async () => {
    if (!destinationInput.trim() || isGenerating) return;
    setIsGenerating(true);

    try {
      const response = await fetch('/api/ai/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: destinationInput.trim(),
          startDate,
          endDate,
          vibes: selectedVibes,
        }),
      });

      const data = await response.json();
      if (data && data.title) {
        const newItinerary: Itinerary = {
          id: Date.now().toString(),
          title: data.title,
          destination: data.destination || destinationInput,
          durationDays: data.durationDays || 5,
          weatherSummary: data.weatherSummary || '18°C Mild Weather',
          aiSummary: data.aiSummary || 'Generated custom AI itinerary.',
          days: data.days || [],
          packingList: data.packingList || [],
          budget: data.budget || undefined,
          savedAt: new Date().toISOString(),
        };

        onUpdateItinerary(newItinerary);

        // Auto expand all days
        const expanded: Record<number, boolean> = {};
        newItinerary.days.forEach((d) => {
          expanded[d.dayNumber] = true;
        });
        setExpandedDays(expanded);
      }
    } catch (err) {
      console.error('Itinerary generation error:', err);
      alert('Failed to generate itinerary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePackingCheck = (itemKey: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

  const toggleDayExpand = (dayNum: number) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayNum]: !prev[dayNum],
    }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-20 md:pt-10 pb-24 flex flex-col md:flex-row gap-8 h-full min-h-screen">
      {/* Left Panel: Planner Controls & AI Chat */}
      <section className="w-full md:w-5/12 lg:w-4/12 flex flex-col gap-6">
        {/* Title */}
        <div>
          <h2 className="font-serif-display text-2xl md:text-3xl ai-gradient-text font-bold">
            Where to next?
          </h2>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1 font-normal">
            I'm your AI travel concierge. Let's build your perfect itinerary.
          </p>
        </div>

        {/* AI Chat Box */}
        <div className="glass-panel rounded-2xl p-4 flex flex-col gap-3 shadow-xl border border-white/10">
          <div className="max-h-52 overflow-y-auto hide-scrollbar flex flex-col gap-3 pr-1">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 items-start ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3 rounded-xl text-xs md:text-sm font-normal leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-primary text-on-primary rounded-tr-none'
                      : 'bg-surface-container/60 text-on-surface border border-white/10 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex gap-2 items-center text-xs text-primary animate-pulse">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                <span>Generating advice...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSendChat} className="relative mt-1">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="e.g., Best family-friendly destinations in Europe"
              className="w-full glass-input text-xs md:text-sm text-on-surface py-2.5 pl-3 pr-10 rounded-xl focus:ring-0"
            />
            <button
              type="submit"
              disabled={isChatLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-secondary transition-colors p-1"
            >
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </form>
        </div>

        {/* Parameters Widget */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col gap-4 shadow-xl border border-white/10">
          <h3 className="font-serif-display text-lg text-primary flex items-center gap-2 font-semibold">
            <span className="material-symbols-outlined text-lg">tune</span> Parameters
          </h3>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-on-surface-variant font-medium">Destination</label>
            <input
              type="text"
              value={destinationInput}
              onChange={(e) => setDestinationInput(e.target.value)}
              placeholder="Enter city or country"
              className="glass-input p-2.5 text-xs md:text-sm text-on-surface rounded-xl w-full bg-transparent border border-white/15 focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-on-surface-variant font-medium">Dates</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="glass-input p-2 text-xs text-on-surface rounded-xl bg-transparent border border-white/15"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="glass-input p-2 text-xs text-on-surface rounded-xl bg-transparent border border-white/15"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-on-surface-variant font-medium">Vibe / Interests</label>
            <div className="flex flex-wrap gap-1.5">
              {['Culture', 'Food', 'Nature', 'Luxury', 'Adventure', 'Nightlife'].map((vibe) => {
                const active = selectedVibes.includes(vibe);
                return (
                  <button
                    key={vibe}
                    type="button"
                    onClick={() => toggleVibe(vibe)}
                    className={`text-xs px-3 py-1 rounded-full border transition-all ${
                      active
                        ? 'bg-tertiary/20 text-tertiary-fixed border-tertiary-fixed/40 font-semibold'
                        : 'bg-white/5 text-on-surface-variant border-white/15 hover:bg-white/10'
                    }`}
                  >
                    {vibe}
                  </button>
                );
              })}

              {!showAddVibe ? (
                <button
                  type="button"
                  onClick={() => setShowAddVibe(true)}
                  className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-on-surface-variant border border-white/15 hover:bg-white/10"
                >
                  + Add
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={customVibeInput}
                    onChange={(e) => setCustomVibeInput(e.target.value)}
                    placeholder="Custom vibe"
                    className="glass-input text-xs px-2 py-0.5 rounded-lg w-24 text-on-surface"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomVibe}
                    className="text-xs px-2 py-0.5 rounded-lg bg-primary text-on-primary font-medium"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleGenerateItinerary}
            disabled={isGenerating}
            className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 mt-2 shadow-lg hover:scale-[0.99] active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                <span>Generating Itinerary...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">auto_awesome</span>
                <span>Generate Itinerary</span>
              </>
            )}
          </button>
        </div>

        {/* Smart Packing List Accordion */}
        <div className="glass-panel rounded-2xl p-4 flex flex-col gap-3 shadow-xl border border-white/10">
          <div
            onClick={() => setIsPackingOpen(!isPackingOpen)}
            className="flex justify-between items-center cursor-pointer select-none"
          >
            <h3 className="font-serif-display text-base text-primary flex items-center gap-2 font-semibold">
              <span className="material-symbols-outlined text-lg">luggage</span> Smart Packing
            </h3>
            <span className="material-symbols-outlined text-on-surface-variant text-sm">
              {isPackingOpen ? 'expand_less' : 'expand_more'}
            </span>
          </div>

          <p className="text-xs text-on-surface-variant">
            Auto-generated based on weather ({currentItinerary.weatherSummary}).
          </p>

          {isPackingOpen && (
            <div className="flex flex-col gap-3 pt-2 border-t border-white/10">
              {currentItinerary.packingList?.map((catGroup, cIdx) => (
                <div key={cIdx} className="flex flex-col gap-1.5">
                  <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider">
                    {catGroup.category}
                  </h4>
                  <div className="flex flex-col gap-1">
                    {catGroup.items.map((item, iIdx) => {
                      const itemKey = `${cIdx}-${iIdx}`;
                      const isChecked = checkedItems[itemKey] || false;
                      return (
                        <label
                          key={iIdx}
                          className="flex items-center gap-2 text-xs text-on-surface cursor-pointer hover:text-white"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => togglePackingCheck(itemKey)}
                            className="rounded border-white/20 bg-white/5 text-primary focus:ring-0"
                          />
                          <span className={isChecked ? 'line-through text-outline' : ''}>
                            {item}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Budget & Expenses Navigation Teaser */}
        <div
          onClick={() => setActiveTab('budget')}
          className="glass-panel rounded-2xl p-4 flex items-center justify-between shadow-xl border border-sky-400/20 hover:border-primary/50 cursor-pointer transition-all group bg-gradient-to-r from-sky-950/40 to-slate-900/40"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-primary transition-colors flex items-center gap-1.5">
                Trip Budget & Expenses
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold">Active</span>
              </h4>
              <p className="text-[11px] text-sky-200/70">
                Track flights, hotels & spot costs
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-sm text-outline group-hover:text-primary group-hover:translate-x-0.5 transition-all">
            chevron_right
          </span>
        </div>
      </section>

      {/* Right Panel: Immersive Itinerary & Budget View */}
      <section className="w-full md:w-7/12 lg:w-8/12 flex flex-col gap-6 relative">
        <div className="glass-panel rounded-2xl p-6 md:p-8 min-h-full border border-white/15 shadow-2xl relative">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/10 pb-6">
            <div>
              <span className="text-xs text-secondary font-semibold uppercase tracking-widest">
                {currentItinerary.destination}
              </span>
              <h2 className="font-serif-display text-2xl md:text-4xl text-white font-bold mt-1">
                {currentItinerary.title}
              </h2>
              <p className="text-xs md:text-sm text-on-surface-variant flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  {startDate} - {endDate}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-tertiary">
                  <span className="material-symbols-outlined text-sm">wb_sunny</span>
                  {currentItinerary.weatherSummary}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Trip itinerary link copied to clipboard!');
                }}
                className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-on-surface hover:text-primary transition-colors border border-white/20 cursor-pointer"
                title="Share Itinerary"
              >
                <span className="material-symbols-outlined text-lg">share</span>
              </button>

              <button
                onClick={() => onSaveItinerary(currentItinerary)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border cursor-pointer ${
                  isSaved
                    ? 'bg-primary text-on-primary border-primary shadow-lg'
                    : 'bg-white/10 text-white border-white/20 hover:bg-primary/20'
                }`}
                title={isSaved ? 'Saved to Profile' : 'Save Itinerary'}
              >
                <span className="material-symbols-outlined text-lg">
                  {isSaved ? 'bookmark_added' : 'bookmark'}
                </span>
              </button>
            </div>
          </div>

          {/* Tab Switcher: Itinerary Timeline vs Budget & Expenses */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/5 border border-white/10 mb-6 w-full sm:w-fit">
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'itinerary'
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'text-on-surface-variant hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-sm">calendar_month</span>
              <span>Itinerary Timeline</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'itinerary' ? 'bg-black/20 text-white' : 'bg-white/10 text-outline'
              }`}>
                {currentItinerary.days?.length || 0} Days
              </span>
            </button>

            <button
              onClick={() => setActiveTab('budget')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'budget'
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'text-on-surface-variant hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-sm">attach_money</span>
              <span>Budget & Expenses</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === 'budget' ? 'bg-black/20 text-white' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                Tracker
              </span>
            </button>
          </div>

          {/* Conditional Tab Rendering */}
          {activeTab === 'budget' ? (
            <BudgetTracker
              itinerary={currentItinerary}
              onUpdateItinerary={onUpdateItinerary}
            />
          ) : (
            <>
              {/* AI Overview Summary */}
              {currentItinerary.aiSummary && (
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-8 flex gap-3 items-start">
                  <span className="material-symbols-outlined text-primary text-xl shrink-0 mt-0.5">
                    auto_awesome
                  </span>
                  <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                    {currentItinerary.aiSummary}
                  </p>
                </div>
              )}

              {/* Daily Timeline */}
              <div className="relative pl-6 border-l-2 border-white/20 ml-2 space-y-10">
                {currentItinerary.days?.map((day) => {
                  const isExpanded = expandedDays[day.dayNumber] !== false;

                  return (
                    <div key={day.dayNumber} className="relative group">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-secondary border-[3px] border-[#111316] group-hover:scale-125 transition-transform"></div>

                      {/* Day Title & Toggle */}
                      <div
                        onClick={() => toggleDayExpand(day.dayNumber)}
                        className="flex items-center justify-between cursor-pointer select-none mb-3"
                      >
                        <h4 className="font-serif-display text-lg md:text-xl text-secondary font-semibold hover:text-primary transition-colors">
                          {day.title}
                        </h4>

                        <span className="text-xs text-outline font-medium hover:text-white flex items-center gap-1">
                          {isExpanded ? 'Collapse' : 'Expand'}
                          <span className="material-symbols-outlined text-sm">
                            {isExpanded ? 'expand_less' : 'expand_more'}
                          </span>
                        </span>
                      </div>

                      {isExpanded ? (
                        <div className="flex flex-col gap-4">
                          {day.summary && (
                            <p className="text-xs text-on-surface-variant font-normal">
                              {day.summary}
                            </p>
                          )}

                          {/* Spots */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {day.spots?.map((spot, sIdx) => (
                              <div
                                key={sIdx}
                                onClick={() => onViewOnMap(spot)}
                                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all group/card cursor-pointer shadow-lg"
                              >
                                {spot.imageUrl && (
                                  <div className="h-32 w-full relative overflow-hidden bg-surface-container-low">
                                    <img
                                      src={spot.imageUrl}
                                      alt={spot.name}
                                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-tertiary font-semibold flex items-center gap-1">
                                      <span className="material-symbols-outlined text-xs">schedule</span>
                                      {spot.timeSlot}
                                    </div>
                                  </div>
                                )}

                                <div className="p-3.5 flex flex-col gap-1.5">
                                  {!spot.imageUrl && (
                                    <div className="text-[10px] text-tertiary font-semibold flex items-center gap-1">
                                      <span className="material-symbols-outlined text-xs">schedule</span>
                                      {spot.timeSlot}
                                    </div>
                                  )}

                                  <h5 className="font-serif-display text-sm md:text-base text-white font-semibold group-hover/card:text-primary transition-colors">
                                    {spot.name}
                                  </h5>

                                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                                    {spot.description}
                                  </p>

                                  {spot.aiTip && (
                                    <div className="mt-1 pt-2 border-t border-white/10 text-[11px] text-primary flex items-start gap-1">
                                      <span className="material-symbols-outlined text-xs shrink-0 mt-0.5">lightbulb</span>
                                      <span>{spot.aiTip}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}

                            {/* AI Insight Box */}
                            {day.aiInsight && (
                              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex flex-col justify-center gap-2 relative overflow-hidden">
                                <div className="flex items-center gap-1.5 text-primary font-semibold text-xs">
                                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                  <span>AI Insight</span>
                                </div>
                                <p className="text-xs text-on-surface-variant leading-relaxed">
                                  {day.aiInsight}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => toggleDayExpand(day.dayNumber)}
                          className="glass-panel p-3 text-center text-xs text-on-surface-variant rounded-xl border border-dashed border-white/20 hover:border-primary/50 cursor-pointer"
                        >
                          Click to expand Day {day.dayNumber} itinerary ({day.spots?.length || 0} spots)
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Floating Map Button Overlay */}
              <button
                onClick={() => onViewOnMap()}
                className="fixed md:absolute bottom-6 right-6 md:bottom-8 md:right-8 bg-primary text-on-primary hover:bg-primary-fixed font-semibold text-xs md:text-sm px-5 py-3 rounded-full flex items-center gap-2 shadow-2xl border border-white/30 hover:scale-105 active:scale-95 z-30 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">map</span>
                <span>View on Map</span>
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
};
