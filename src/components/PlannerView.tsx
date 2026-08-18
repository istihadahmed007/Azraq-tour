import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, Destination, Itinerary, Spot } from '../types';
import { BudgetTracker } from './BudgetTracker';
import { InteractiveAsiaMap } from './InteractiveAsiaMap';
import {
  MapPin,
  Calendar,
  Sparkles,
  DollarSign,
  Compass,
  Luggage,
  Share2,
  Bookmark,
  BookmarkCheck,
  Send,
  Sliders,
  ChevronRight,
  Sun,
  Lightbulb,
  Clock,
  ChevronDown,
  ChevronUp,
  RotateCw,
  FileCheck2,
  Plane,
} from 'lucide-react';

interface PlannerViewProps {
  currentItinerary: Itinerary;
  onUpdateItinerary: (itinerary: Itinerary) => void;
  onSaveItinerary: (itinerary: Itinerary) => void;
  onViewOnMap?: (spot?: Spot) => void;
  isSaved: boolean;
  destinations?: Destination[];
  onSelectDestination?: (destination: Destination) => void;
  onQuickGenerateItinerary?: (destName: string) => void;
  onOpenVisaQuote?: (country?: string) => void;
  onOpenFlightQuote?: (dest?: string) => void;
  initialTab?: 'itinerary' | 'map' | 'budget';
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  currentItinerary,
  onUpdateItinerary,
  onSaveItinerary,
  onViewOnMap,
  isSaved,
  destinations = [],
  onSelectDestination,
  onQuickGenerateItinerary,
  onOpenVisaQuote,
  onOpenFlightQuote,
  initialTab = 'itinerary',
}) => {
  // Tab state (Itinerary timeline vs Interactive Route Map vs Budget & Expense tracker)
  const [activeTab, setActiveTab] = useState<'itinerary' | 'map' | 'budget'>(initialTab);

  // Sync initialTab when it changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'I can help you plan a trip, find family-friendly spots across Asia, calculate estimated travel budgets, or suggest packing lists.',
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

  // Update destinationInput when currentItinerary changes
  useEffect(() => {
    if (currentItinerary.destination) {
      setDestinationInput(currentItinerary.destination);
    }
  }, [currentItinerary.destination]);

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

  const handleGenerateItinerary = async (targetDest?: string) => {
    const dest = (targetDest || destinationInput).trim();
    if (!dest || isGenerating) return;
    setIsGenerating(true);

    try {
      const response = await fetch('/api/ai/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: dest,
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
          destination: data.destination || dest,
          durationDays: data.durationDays || 5,
          weatherSummary: data.weatherSummary || '18°C Mild Weather',
          aiSummary: data.aiSummary || 'Generated custom AI itinerary.',
          days: data.days || [],
          packingList: data.packingList || [],
          budget: data.budget || undefined,
          savedAt: new Date().toISOString(),
        };

        onUpdateItinerary(newItinerary);
        setActiveTab('itinerary');

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

  const handleMapQuickGenerate = (destName: string) => {
    setDestinationInput(destName);
    if (onQuickGenerateItinerary) {
      onQuickGenerateItinerary(destName);
    } else {
      handleGenerateItinerary(destName);
    }
  };

  const handleSpotViewOnMap = (spot?: Spot) => {
    if (onViewOnMap) {
      onViewOnMap(spot);
    }
    setActiveTab('map');
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
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-4 pb-24 flex flex-col md:flex-row gap-8 h-full min-h-screen">
      {/* Left Panel: Planner Controls & AI Chat */}
      <section className="w-full md:w-5/12 lg:w-4/12 flex flex-col gap-6">
        {/* Title */}
        <div>
          <h2 className="font-serif-display text-2xl md:text-3xl text-white font-bold flex items-center gap-2.5">
            <span>Where to next?</span>
            <Sparkles className="w-5 h-5 text-sky-400" />
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1 font-normal">
            Your personalized AI travel planner with interactive Asia maps & quotes.
          </p>
        </div>

        {/* AI Chat Box */}
        <div className="bg-slate-900/90 rounded-2xl p-4 flex flex-col gap-3 shadow-xl border border-slate-700/80 backdrop-blur-md">
          <div className="max-h-52 overflow-y-auto hide-scrollbar flex flex-col gap-3 pr-1">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 items-start ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center shrink-0 mt-0.5 text-sky-300">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3 rounded-xl text-xs md:text-sm font-normal leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#0D6EFD] text-white rounded-tr-none'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex gap-2 items-center text-xs text-sky-400 animate-pulse">
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generating advice...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSendChat} className="relative mt-1">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="e.g., Best family-friendly spots in Bali or Dubai"
              className="w-full bg-slate-800/80 text-xs md:text-sm text-white py-2.5 pl-3 pr-10 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={isChatLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sky-400 hover:text-sky-300 transition-colors p-1 cursor-pointer disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Parameters Widget */}
        <div className="bg-slate-900/90 rounded-2xl p-5 flex flex-col gap-4 shadow-xl border border-slate-700/80 backdrop-blur-md">
          <h3 className="text-base text-sky-400 flex items-center gap-2 font-bold font-sans">
            <Sliders className="w-4 h-4" />
            <span>Trip Parameters</span>
          </h3>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-300 font-medium">Destination</label>
            <div className="relative">
              <input
                type="text"
                value={destinationInput}
                onChange={(e) => setDestinationInput(e.target.value)}
                placeholder="Enter city or country (e.g. Maldives, Bangkok, Dubai)"
                className="p-2.5 text-xs md:text-sm text-white rounded-xl w-full bg-slate-800/80 border border-slate-700 focus:outline-none focus:border-blue-500 pl-8"
              />
              <MapPin className="w-4 h-4 text-sky-400 absolute left-2.5 top-3" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-300 font-medium">Dates</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-2 text-xs text-white rounded-xl bg-slate-800/80 border border-slate-700 focus:outline-none focus:border-blue-500"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-2 text-xs text-white rounded-xl bg-slate-800/80 border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-300 font-medium">Vibe / Interests</label>
            <div className="flex flex-wrap gap-1.5">
              {['Culture', 'Food', 'Nature', 'Luxury', 'Adventure', 'Shopping'].map((vibe) => {
                const active = selectedVibes.includes(vibe);
                return (
                  <button
                    key={vibe}
                    type="button"
                    onClick={() => toggleVibe(vibe)}
                    className={`text-xs px-3 py-1 rounded-full border transition-all cursor-pointer ${
                      active
                        ? 'bg-blue-600/30 text-sky-300 border-sky-400/50 font-semibold'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
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
                  className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 hover:text-white cursor-pointer"
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
                    className="text-xs px-2 py-0.5 rounded-lg w-24 text-white bg-slate-800 border border-slate-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomVibe}
                    className="text-xs px-2 py-0.5 rounded-lg bg-[#0D6EFD] text-white font-medium cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => handleGenerateItinerary()}
            disabled={isGenerating}
            className="w-full bg-[#0D6EFD] hover:bg-blue-600 text-white py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-500/25 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Generating Itinerary...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-sky-200" />
                <span>Generate AI Itinerary</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Map Tab Switcher Teaser in Left Panel */}
        <div
          onClick={() => setActiveTab('map')}
          className={`rounded-2xl p-4 flex items-center justify-between shadow-xl border transition-all group cursor-pointer ${
            activeTab === 'map'
              ? 'bg-blue-900/40 border-sky-400 ring-1 ring-sky-400'
              : 'bg-slate-900/90 border-slate-700/80 hover:border-sky-400/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors flex items-center gap-1.5">
                <span>Interactive Asia Map</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-500/20 text-sky-300 font-semibold">
                  Live Map
                </span>
              </h4>
              <p className="text-[11px] text-slate-300">
                Dhaka flight corridors, visas & pins
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-300 group-hover:translate-x-0.5 transition-all" />
        </div>

        {/* Quick Budget & Expenses Navigation Teaser */}
        <div
          onClick={() => setActiveTab('budget')}
          className={`rounded-2xl p-4 flex items-center justify-between shadow-xl border transition-all group cursor-pointer ${
            activeTab === 'budget'
              ? 'bg-emerald-950/40 border-emerald-400 ring-1 ring-emerald-400'
              : 'bg-slate-900/90 border-slate-700/80 hover:border-emerald-400/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                <span>Trip Budget & Expenses</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold">
                  Active
                </span>
              </h4>
              <p className="text-[11px] text-slate-300">
                Track flights, hotels & spot costs
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-300 group-hover:translate-x-0.5 transition-all" />
        </div>

        {/* Smart Packing List Accordion */}
        <div className="bg-slate-900/90 rounded-2xl p-4 flex flex-col gap-3 shadow-xl border border-slate-700/80">
          <div
            onClick={() => setIsPackingOpen(!isPackingOpen)}
            className="flex justify-between items-center cursor-pointer select-none"
          >
            <h3 className="text-sm font-bold text-sky-400 flex items-center gap-2 font-sans">
              <Luggage className="w-4 h-4" />
              <span>Smart Packing List</span>
            </h3>
            {isPackingOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>

          <p className="text-xs text-slate-400">
            Auto-generated for {currentItinerary.destination} ({currentItinerary.weatherSummary}).
          </p>

          {isPackingOpen && (
            <div className="flex flex-col gap-3 pt-2 border-t border-slate-800">
              {currentItinerary.packingList?.map((catGroup, cIdx) => (
                <div key={cIdx} className="flex flex-col gap-1.5">
                  <h4 className="text-[11px] font-bold text-sky-300 uppercase tracking-wider">
                    {catGroup.category}
                  </h4>
                  <div className="flex flex-col gap-1">
                    {catGroup.items.map((item, iIdx) => {
                      const itemKey = `${cIdx}-${iIdx}`;
                      const isChecked = checkedItems[itemKey] || false;
                      return (
                        <label
                          key={iIdx}
                          className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => togglePackingCheck(itemKey)}
                            className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0"
                          />
                          <span className={isChecked ? 'line-through text-slate-500' : ''}>
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
      </section>

      {/* Right Panel: Immersive Itinerary, Interactive Map, & Budget Views */}
      <section className="w-full md:w-7/12 lg:w-8/12 flex flex-col gap-6 relative">
        <div className="bg-slate-900/90 rounded-2xl p-6 md:p-8 min-h-full border border-slate-700/80 shadow-2xl relative flex flex-col">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs text-sky-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{currentItinerary.destination}</span>
              </span>
              <h2 className="text-2xl md:text-3xl text-white font-extrabold mt-1 tracking-tight font-sans">
                {currentItinerary.title}
              </h2>
              <p className="text-xs md:text-sm text-slate-300 flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{startDate} - {endDate}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-300">
                  <Sun className="w-3.5 h-3.5" />
                  <span>{currentItinerary.weatherSummary}</span>
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Trip itinerary link copied to clipboard!');
                }}
                className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700 cursor-pointer"
                title="Share Itinerary"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSaveItinerary(currentItinerary)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border cursor-pointer ${
                  isSaved
                    ? 'bg-[#0D6EFD] text-white border-blue-500 shadow-lg'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
                title={isSaved ? 'Saved to Profile' : 'Save Itinerary'}
              >
                {isSaved ? (
                  <BookmarkCheck className="w-4 h-4 text-white" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* 3-Tab Switcher: Itinerary Timeline vs Interactive Asia Map vs Budget */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800 mb-6 w-full">
            {/* Tab 1: Itinerary Timeline */}
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'itinerary'
                  ? 'bg-[#0D6EFD] text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Itinerary Timeline</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  activeTab === 'itinerary'
                    ? 'bg-black/20 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {currentItinerary.days?.length || 0} Days
              </span>
            </button>

            {/* Tab 2: Interactive Asia & Route Map */}
            <button
              onClick={() => setActiveTab('map')}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-[#0D6EFD] text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Compass className="w-4 h-4 text-sky-300" />
              <span>Interactive Map</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  activeTab === 'map'
                    ? 'bg-black/20 text-white'
                    : 'bg-sky-500/20 text-sky-300'
                }`}
              >
                Live Map
              </span>
            </button>

            {/* Tab 3: Budget & Expenses */}
            <button
              onClick={() => setActiveTab('budget')}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'budget'
                  ? 'bg-[#0D6EFD] text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <DollarSign className="w-4 h-4 text-emerald-300" />
              <span>Budget & Expenses</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                  activeTab === 'budget'
                    ? 'bg-black/20 text-white'
                    : 'bg-emerald-500/20 text-emerald-300'
                }`}
              >
                Tracker
              </span>
            </button>
          </div>

          {/* Conditional Content Rendering */}
          {activeTab === 'map' ? (
            /* TAB 2: INTERACTIVE ASIA & ROUTE MAP VIEW */
            <div className="flex flex-col gap-5 flex-1">
              {/* Map Info Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      Corridor Map: {currentItinerary.destination || 'Asian Escapes'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Explore flight paths from Dhaka HQ, visa classifications, and tourist spots.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {onOpenVisaQuote && (
                    <button
                      onClick={() => onOpenVisaQuote(currentItinerary.destination)}
                      className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Visa Quote</span>
                    </button>
                  )}
                  {onOpenFlightQuote && (
                    <button
                      onClick={() => onOpenFlightQuote(currentItinerary.destination)}
                      className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Plane className="w-3.5 h-3.5" />
                      <span>Flight Quote</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Leaflet Interactive Asia Map */}
              <div className="w-full rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
                <InteractiveAsiaMap
                  destinations={destinations}
                  onSelectDestination={(dest) => {
                    if (onSelectDestination) {
                      onSelectDestination(dest);
                    } else {
                      setDestinationInput(dest.name);
                    }
                  }}
                  onOpenQuotation={(name) => {
                    if (onOpenVisaQuote) onOpenVisaQuote(name);
                  }}
                  onQuickGenerateItinerary={(name) => {
                    handleMapQuickGenerate(name);
                  }}
                />
              </div>
            </div>
          ) : activeTab === 'budget' ? (
            /* TAB 3: BUDGET TRACKER VIEW */
            <BudgetTracker
              itinerary={currentItinerary}
              onUpdateItinerary={onUpdateItinerary}
            />
          ) : (
            /* TAB 1: ITINERARY TIMELINE VIEW */
            <>
              {/* AI Overview Summary */}
              {currentItinerary.aiSummary && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="bg-blue-950/40 border border-blue-800/40 rounded-xl p-4 mb-8 flex gap-3 items-start"
                >
                  <Sparkles className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    {currentItinerary.aiSummary}
                  </p>
                </motion.div>
              )}

              {/* Daily Timeline */}
              <div className="relative pl-6 border-l-2 border-slate-800 ml-2 space-y-10">
                {currentItinerary.days?.map((day, dayIndex) => {
                  const isExpanded = expandedDays[day.dayNumber] !== false;

                  return (
                    <motion.div
                      key={day.dayNumber}
                      initial={{ opacity: 0, y: 28, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.45,
                        delay: Math.min(dayIndex * 0.08, 0.6),
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="relative group"
                    >
                      {/* Timeline Dot */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: Math.min(dayIndex * 0.08, 0.6) + 0.1 }}
                        className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#0D6EFD] border-[3px] border-[#071A33] group-hover:scale-125 transition-transform"
                      />

                      {/* Day Title & Toggle */}
                      <div
                        onClick={() => toggleDayExpand(day.dayNumber)}
                        className="flex items-center justify-between cursor-pointer select-none mb-3"
                      >
                        <h4 className="text-lg md:text-xl text-white font-bold hover:text-sky-300 transition-colors font-sans">
                          {day.title}
                        </h4>

                        <span className="text-xs text-slate-400 font-medium hover:text-white flex items-center gap-1">
                          {isExpanded ? 'Collapse' : 'Expand'}
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </span>
                      </div>

                      <AnimatePresence initial={false} mode="wait">
                        {isExpanded ? (
                          <motion.div
                            key={`expanded-${day.dayNumber}`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden flex flex-col gap-4"
                          >
                            {day.summary && (
                              <p className="text-xs text-slate-300 font-normal">
                                {day.summary}
                              </p>
                            )}

                            {/* Spots */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {day.spots?.map((spot, sIdx) => (
                                <motion.div
                                  key={sIdx}
                                  initial={{ opacity: 0, y: 14, scale: 0.97 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  whileHover={{ y: -3 }}
                                  transition={{
                                    duration: 0.35,
                                    delay: sIdx * 0.06,
                                    ease: 'easeOut',
                                  }}
                                  onClick={() => handleSpotViewOnMap(spot)}
                                  className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden hover:bg-slate-800 hover:border-sky-500/50 transition-colors group/card cursor-pointer shadow-lg"
                                >
                                  {spot.imageUrl && (
                                    <div className="h-32 w-full relative overflow-hidden bg-slate-900">
                                      <img
                                        src={spot.imageUrl}
                                        alt={spot.name}
                                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                                      />
                                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-sky-300 font-semibold flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{spot.timeSlot}</span>
                                      </div>
                                      <div className="absolute top-2 right-2 bg-blue-600/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-white font-semibold flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                        <Compass className="w-3 h-3" />
                                        <span>View on Map</span>
                                      </div>
                                    </div>
                                  )}

                                  <div className="p-3.5 flex flex-col gap-1.5">
                                    {!spot.imageUrl && (
                                      <div className="text-[10px] text-sky-300 font-semibold flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{spot.timeSlot}</span>
                                      </div>
                                    )}

                                    <h5 className="text-sm md:text-base text-white font-bold group-hover/card:text-sky-300 transition-colors font-sans">
                                      {spot.name}
                                    </h5>

                                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                                      {spot.description}
                                    </p>

                                    {spot.aiTip && (
                                      <div className="mt-1 pt-2 border-t border-slate-700 text-[11px] text-sky-300 flex items-start gap-1">
                                        <Lightbulb className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                                        <span>{spot.aiTip}</span>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              ))}

                              {/* AI Insight Box */}
                              {day.aiInsight && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.96 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.35, delay: (day.spots?.length || 0) * 0.06 }}
                                  className="bg-blue-950/30 border border-blue-800/40 rounded-xl p-4 flex flex-col justify-center gap-2 relative overflow-hidden"
                                >
                                  <div className="flex items-center gap-1.5 text-sky-300 font-semibold text-xs">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>AI Insight</span>
                                  </div>
                                  <p className="text-xs text-slate-300 leading-relaxed">
                                    {day.aiInsight}
                                  </p>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key={`collapsed-${day.dayNumber}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => toggleDayExpand(day.dayNumber)}
                            className="bg-slate-800/50 p-3 text-center text-xs text-slate-400 rounded-xl border border-dashed border-slate-700 hover:border-sky-400/50 cursor-pointer"
                          >
                            Click to expand Day {day.dayNumber} itinerary ({day.spots?.length || 0} spots)
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {/* Floating Map Button to switch to Map tab */}
              <button
                onClick={() => setActiveTab('map')}
                className="fixed md:absolute bottom-6 right-6 md:bottom-8 md:right-8 bg-[#0D6EFD] text-white hover:bg-blue-600 font-bold text-xs md:text-sm px-5 py-3 rounded-full flex items-center gap-2 shadow-2xl border border-white/20 hover:scale-105 active:scale-95 z-30 cursor-pointer transition-all"
              >
                <Compass className="w-4 h-4 text-sky-200" />
                <span>View on Map</span>
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

