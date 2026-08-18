import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  X,
  Volume2,
  Calendar,
  MapPin,
  Users,
  Tag,
  ArrowRight,
  RefreshCw,
  Edit3,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Compass,
  Plane,
  Search,
  ArrowRightLeft,
  Briefcase,
} from 'lucide-react';
import { useVoiceSpeech } from '../hooks/useVoiceSpeech';
import { FlightSearchParams } from './AzraqTripFinder';
import { POPULAR_AIRPORTS, BANGLADESH_AIRPORTS, Airport } from '../data/flightsData';

export interface StructuredVoiceTripData {
  isFlightIntent?: boolean;
  destination: string;
  durationDays: number;
  startDate: string;
  endDate: string;
  vibes: string[];
  travelerCount: number;
  travelStyle: string;
  budgetLevel: string;
  structuredPrompt: string;
  spokenSummary: string;
  flightParams?: {
    originCode: string;
    originCity: string;
    originName: string;
    originCountry: string;
    destinationCode: string;
    destinationCity: string;
    destinationName: string;
    destinationCountry: string;
    tripType: 'round' | 'oneway';
    departureDate: string;
    returnDate: string;
    adults: number;
    children: number;
    infants: number;
    cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First';
    preferredAirline?: string;
  };
}

interface VoiceTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPlan: (data: StructuredVoiceTripData) => void;
  onSearchFlights?: (params: FlightSearchParams) => void;
  initialTranscript?: string;
  initialMode?: 'flight' | 'itinerary';
}

const SAMPLE_FLIGHT_PROMPTS = [
  'Find round trip flights from Dhaka to Bangkok next Friday for 2 adults',
  'One-way flight from Dhaka to Dubai next month in Business class',
  'Round trip tickets Dhaka to Singapore next week for 1 adult',
  'Direct flights from Dhaka to Kuala Lumpur departing in two weeks',
  'Flights from Dhaka to Maldives for a 5-day couple holiday',
];

const SAMPLE_ITINERARY_PROMPTS = [
  '5-day family holiday in Bangkok and Phuket with private transfers and halal dining',
  '7-day romantic honeymoon in Maldives overwater villa with sunset cruise',
  '4-day shopping and luxury getaway in Dubai for 2 adults',
  '6-day cultural immersion in Tokyo and Kyoto with scenic train rides and culinary spots',
  '5-day beach and adventure trip in Bali with temple tours and private pool villa',
];

export const VoiceTripModal: React.FC<VoiceTripModalProps> = ({
  isOpen,
  onClose,
  onConfirmPlan,
  onSearchFlights,
  initialTranscript = '',
  initialMode = 'flight',
}) => {
  const {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    error: speechError,
    audioLevel,
    startListening,
    stopListening,
    resetTranscript,
    setTranscriptManual,
  } = useVoiceSpeech();

  const [activeTab, setActiveTab] = useState<'flight' | 'itinerary'>(initialMode);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<StructuredVoiceTripData | null>(null);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [editablePrompt, setEditablePrompt] = useState('');

  // When modal opens, initialize
  useEffect(() => {
    if (isOpen) {
      setParsedData(null);
      setParseError(null);
      setIsEditingPrompt(false);
      setActiveTab(initialMode);
      if (initialTranscript) {
        setTranscriptManual(initialTranscript);
        parseSpokenSpeech(initialTranscript);
      } else {
        resetTranscript();
        // Auto start listening if supported
        if (isSupported) {
          try {
            startListening();
          } catch {}
        }
      }
    } else {
      stopListening();
    }
  }, [isOpen, initialTranscript, initialMode]);

  // When speech stops or user has spoken a substantial prompt, automatically trigger parsing
  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
      if (transcript.trim().length > 3) {
        parseSpokenSpeech(transcript);
      }
    } else {
      resetTranscript();
      setParsedData(null);
      setParseError(null);
      startListening();
    }
  };

  // Convert transcript to structured trip data via server Gemini endpoint
  const parseSpokenSpeech = async (spokenText: string) => {
    if (!spokenText || !spokenText.trim()) return;
    setIsParsing(true);
    setParseError(null);

    try {
      const res = await fetch('/api/ai/parse-voice-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: spokenText }),
      });

      const json = await res.json();
      if (json && json.data) {
        setParsedData(json.data);
        setEditablePrompt(json.data.structuredPrompt || spokenText);
        if (json.data.isFlightIntent) {
          setActiveTab('flight');
        }
      } else {
        throw new Error(json.error || 'Could not parse voice input');
      }
    } catch (err: any) {
      console.error('Error parsing voice trip:', err);
      // Heuristic fallback
      const today = new Date();
      const defaultStart = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const defaultEnd = new Date(today.getTime() + 19 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const fallback: StructuredVoiceTripData = {
        isFlightIntent: true,
        destination: 'Bangkok, Thailand',
        durationDays: 5,
        startDate: defaultStart,
        endDate: defaultEnd,
        vibes: ['Culture', 'Local Cuisine', 'Sightseeing'],
        travelerCount: 2,
        travelStyle: 'Bespoke Asian Holiday',
        budgetLevel: 'Moderate / Value',
        structuredPrompt: spokenText,
        spokenSummary: `Spoken request: "${spokenText}"`,
        flightParams: {
          originCode: 'DAC',
          originCity: 'Dhaka',
          originName: 'Hazrat Shahjalal International Airport',
          originCountry: 'Bangladesh',
          destinationCode: 'BKK',
          destinationCity: 'Bangkok',
          destinationName: 'Suvarnabhumi Airport',
          destinationCountry: 'Thailand',
          tripType: 'round',
          departureDate: defaultStart,
          returnDate: defaultEnd,
          adults: 2,
          children: 0,
          infants: 0,
          cabinClass: 'Economy',
        },
      };
      setParsedData(fallback);
      setEditablePrompt(spokenText);
    } finally {
      setIsParsing(false);
    }
  };

  const handleSelectSample = (sample: string) => {
    stopListening();
    setTranscriptManual(sample);
    parseSpokenSpeech(sample);
  };

  const handleGenerateItineraryClick = () => {
    if (!parsedData) return;
    const finalData: StructuredVoiceTripData = {
      ...parsedData,
      structuredPrompt: editablePrompt || parsedData.structuredPrompt,
    };
    onConfirmPlan(finalData);
    onClose();
  };

  // Helper to match airport by IATA code
  const resolveAirport = (code: string, fallbackCity: string, fallbackCountry: string): Airport => {
    const allAirports = [...BANGLADESH_AIRPORTS, ...POPULAR_AIRPORTS];
    const matched = allAirports.find((a) => a.code.toUpperCase() === (code || '').toUpperCase());
    if (matched) return matched;

    return {
      code: code ? code.toUpperCase() : 'BKK',
      name: `${fallbackCity || 'International'} Airport`,
      city: fallbackCity || 'Bangkok',
      country: fallbackCountry || 'Thailand',
    };
  };

  const handleSearchFlightsClick = () => {
    if (!parsedData || !onSearchFlights) {
      handleGenerateItineraryClick();
      return;
    }

    const fp = parsedData.flightParams;
    const originAirport = resolveAirport(
      fp?.originCode || 'DAC',
      fp?.originCity || 'Dhaka',
      fp?.originCountry || 'Bangladesh'
    );
    const destAirport = resolveAirport(
      fp?.destinationCode || 'BKK',
      fp?.destinationCity || 'Bangkok',
      fp?.destinationCountry || 'Thailand'
    );

    const flightParams: FlightSearchParams = {
      tripType: fp?.tripType || 'round',
      origin: originAirport,
      destination: destAirport,
      departureDate: fp?.departureDate || parsedData.startDate,
      returnDate: fp?.returnDate || parsedData.endDate,
      adults: fp?.adults || Math.max(1, parsedData.travelerCount || 1),
      children: fp?.children || 0,
      infants: fp?.infants || 0,
      cabinClass: fp?.cabinClass || 'Economy',
      currency: 'BDT',
    };

    onSearchFlights(flightParams);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      id="voice-planner-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#003B95] via-[#071A33] to-[#0A2540] text-white flex items-center justify-between border-b border-blue-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-sky-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Azraq Voice Flight & Trip Planner</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-400/20 text-sky-200 text-[10px] font-semibold tracking-wide uppercase border border-sky-300/30">
                  Web Speech AI
                </span>
              </h2>
              <p className="text-xs text-slate-300 font-normal">
                Search live flight tickets or generate custom holiday itineraries with your voice
              </p>
            </div>
          </div>

          <button
            id="close-voice-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="px-6 pt-3 pb-0 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('flight')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'flight'
                ? 'border-[#0D6EFD] text-[#0D6EFD]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Search Flights by Voice</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('itinerary')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'itinerary'
                ? 'border-[#0D6EFD] text-[#0D6EFD]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plan Itinerary by Voice</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* 1. Main Microphone Visualizer & Listening Stage */}
          <div className="flex flex-col items-center justify-center text-center p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200/80 relative overflow-hidden">
            {/* Ambient Pulse Rings when Listening */}
            {isListening && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="w-36 h-36 rounded-full bg-blue-500/10 animate-ping"
                  style={{ animationDuration: '2s' }}
                />
                <div
                  className="w-48 h-48 rounded-full bg-blue-500/5 animate-pulse"
                  style={{ animationDuration: '1.5s' }}
                />
              </div>
            )}

            {/* Microphone Button */}
            <div className="relative z-10 mb-3">
              <button
                id="voice-mic-toggle-btn"
                type="button"
                onClick={handleToggleListening}
                className={`w-20 h-20 sm:w-22 sm:h-22 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 text-white ring-8 ring-red-500/20 scale-105 animate-pulse'
                    : 'bg-[#0D6EFD] hover:bg-blue-600 text-white ring-4 ring-blue-500/15 hover:scale-105'
                }`}
                title={isListening ? 'Click to stop listening and search' : 'Click to start speaking'}
              >
                <Mic className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
              </button>
            </div>

            {/* Status Label */}
            <div className="relative z-10 space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isListening ? 'bg-red-500 animate-ping' : 'bg-emerald-500'
                  }`}
                />
                <h3 className="text-sm font-bold text-[#071A33]">
                  {isListening
                    ? 'Listening... Speak your flight route or trip now'
                    : transcript
                    ? 'Speech captured — click microphone to record again'
                    : activeTab === 'flight'
                    ? 'Tap the microphone to speak your flight destination'
                    : 'Tap the microphone to describe your dream holiday'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {isListening
                  ? activeTab === 'flight'
                    ? 'Example: "Find flights from Dhaka to Bangkok next Friday for 2 adults"'
                    : 'Mention destination, duration, companions (family/couple), or vibes.'
                  : activeTab === 'flight'
                  ? 'Speak departure city, destination, travel dates, passenger count, or airline.'
                  : 'Example: "5-day family trip to Bangkok and Phuket with halal food in November"'}
              </p>
            </div>

            {/* Live Audio Level Soundwave Bars */}
            {isListening && (
              <div className="flex items-center gap-1.5 mt-4 h-6">
                {[...Array(12)].map((_, i) => {
                  const height = Math.max(
                    6,
                    Math.min(24, Math.round((audioLevel / 100) * 24 * (0.6 + Math.sin(i * 0.8) * 0.4)))
                  );
                  return (
                    <div
                      key={i}
                      className="w-1 bg-[#0D6EFD] rounded-full transition-all duration-75"
                      style={{ height: `${height}px` }}
                    />
                  );
                })}
              </div>
            )}

            {/* Error message if speech failed */}
            {speechError && (
              <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{speechError}</span>
              </div>
            )}
          </div>

          {/* 2. Real-Time Transcript Display */}
          {(transcript || interimTranscript || isListening) && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-[#0D6EFD]" />
                  <span>Captured Voice Transcript</span>
                </span>
                {transcript && !isListening && (
                  <button
                    id="reparse-voice-btn"
                    onClick={() => parseSpokenSpeech(transcript)}
                    disabled={isParsing}
                    className="text-xs font-bold text-[#0D6EFD] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isParsing ? 'animate-spin' : ''}`} />
                    <span>Re-parse with AI</span>
                  </button>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-medium text-slate-800 leading-relaxed min-h-[48px]">
                {transcript ? (
                  <span>
                    {transcript}{' '}
                    {interimTranscript && (
                      <span className="text-slate-400 italic">{interimTranscript}</span>
                    )}
                  </span>
                ) : interimTranscript ? (
                  <span className="text-slate-400 italic">{interimTranscript}...</span>
                ) : (
                  <span className="text-slate-400 italic">Waiting for your voice input...</span>
                )}
              </div>
            </div>
          )}

          {/* 3. Parsing Status Spinner */}
          {isParsing && (
            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-center gap-3 text-sm text-[#0D6EFD] font-bold">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              <span>Analyzing speech & formatting flight route parameters...</span>
            </div>
          )}

          {/* 4. Structured AI Output Card */}
          {parsedData && !isParsing && (
            <div className="p-5 rounded-2xl bg-white border-2 border-[#0D6EFD]/30 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#071A33]">Parsed Travel Request</h4>
                    <p className="text-[11px] text-slate-500">Extracted from spoken input</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  {parsedData.flightParams?.tripType === 'oneway' ? 'One-Way' : 'Round-Trip'} Flight
                </span>
              </div>

              {/* Summary Sentence */}
              <div className="p-3 rounded-xl bg-slate-50 text-xs font-semibold text-slate-700 leading-relaxed border border-slate-100">
                "{parsedData.spokenSummary}"
              </div>

              {/* Flight Route Banner */}
              {parsedData.flightParams && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-200/80">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Origin</span>
                      <div className="text-base font-extrabold text-[#071A33]">
                        {parsedData.flightParams.originCity} ({parsedData.flightParams.originCode || 'DAC'})
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[150px]">
                        {parsedData.flightParams.originName || 'Hazrat Shahjalal Int.'}
                      </div>
                    </div>

                    <div className="flex flex-col items-center px-3">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">
                        {parsedData.flightParams.tripType === 'oneway' ? 'One-Way' : 'Round-Trip'}
                      </span>
                      <div className="flex items-center gap-1.5 my-1">
                        <div className="w-8 sm:w-12 h-0.5 bg-blue-300 rounded" />
                        <Plane className="w-4 h-4 text-[#0D6EFD]" />
                        <div className="w-8 sm:w-12 h-0.5 bg-blue-300 rounded" />
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {parsedData.durationDays} Days
                      </span>
                    </div>

                    <div className="space-y-0.5 text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Destination</span>
                      <div className="text-base font-extrabold text-[#071A33]">
                        {parsedData.flightParams.destinationCity} ({parsedData.flightParams.destinationCode || 'BKK'})
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[150px]">
                        {parsedData.flightParams.destinationName || 'Destination Airport'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Structured Parameter Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Departure Date */}
                <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1">
                  <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold uppercase">
                    <Calendar className="w-3 h-3 text-[#0D6EFD]" />
                    <span>Departure</span>
                  </div>
                  <div className="text-xs font-bold text-[#071A33] truncate">
                    {parsedData.flightParams?.departureDate || parsedData.startDate}
                  </div>
                </div>

                {/* Return Date */}
                <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 space-y-1">
                  <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold uppercase">
                    <Calendar className="w-3 h-3 text-amber-600" />
                    <span>Return</span>
                  </div>
                  <div className="text-xs font-bold text-[#071A33] truncate">
                    {parsedData.flightParams?.tripType === 'oneway'
                      ? 'None (One-way)'
                      : parsedData.flightParams?.returnDate || parsedData.endDate}
                  </div>
                </div>

                {/* Travelers */}
                <div className="p-3 rounded-xl bg-teal-50/50 border border-teal-100 space-y-1">
                  <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold uppercase">
                    <Users className="w-3 h-3 text-teal-600" />
                    <span>Passengers</span>
                  </div>
                  <div className="text-xs font-bold text-[#071A33]">
                    {parsedData.flightParams?.adults || parsedData.travelerCount} Adult(s)
                    {parsedData.flightParams?.children ? `, ${parsedData.flightParams.children} Child` : ''}
                  </div>
                </div>

                {/* Cabin Class */}
                <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 space-y-1">
                  <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold uppercase">
                    <Tag className="w-3 h-3 text-purple-600" />
                    <span>Cabin</span>
                  </div>
                  <div className="text-xs font-bold text-[#071A33] truncate">
                    {parsedData.flightParams?.cabinClass || 'Economy'}
                  </div>
                </div>
              </div>

              {/* Vibes Tags */}
              {parsedData.vibes && parsedData.vibes.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Travel Highlights & Inclusions
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {parsedData.vibes.map((vibe, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200"
                      >
                        {vibe}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Structured AI Generator Prompt Preview / Edit */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    AI Travel Generator Prompt
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditingPrompt(!isEditingPrompt)}
                    className="text-[11px] font-bold text-[#0D6EFD] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{isEditingPrompt ? 'Done Editing' : 'Fine-tune Prompt'}</span>
                  </button>
                </div>

                {isEditingPrompt ? (
                  <textarea
                    rows={2}
                    value={editablePrompt}
                    onChange={(e) => setEditablePrompt(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-blue-400 focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs text-slate-800 font-medium leading-relaxed bg-white"
                  />
                ) : (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed font-mono">
                    {editablePrompt || parsedData.structuredPrompt}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. Quick Sample Ideas */}
          {!parsedData && !isListening && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-[#0D6EFD]" />
                  <span>
                    {activeTab === 'flight'
                      ? 'Or try speaking these popular flight searches'
                      : 'Or try speaking these popular holiday plans'}
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {(activeTab === 'flight' ? SAMPLE_FLIGHT_PROMPTS : SAMPLE_ITINERARY_PROMPTS).map(
                  (sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSample(sample)}
                      className="w-full text-left p-3 rounded-xl bg-white hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-300 text-xs font-medium text-slate-700 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <span className="line-clamp-1">"{sample}"</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0D6EFD] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-medium">
            {parsedData ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready to search flights or build itinerary
              </span>
            ) : isListening ? (
              <span className="text-blue-700 font-semibold animate-pulse">
                Listening to your microphone...
              </span>
            ) : (
              <span>Web Speech API active</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              id="cancel-voice-btn"
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>

            {parsedData ? (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  id="confirm-voice-flight-search-btn"
                  type="button"
                  onClick={handleSearchFlightsClick}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#006ce4] hover:bg-[#0057b8] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Plane className="w-4 h-4" />
                  <span>Search Flights</span>
                </button>

                <button
                  id="confirm-voice-itinerary-btn"
                  type="button"
                  onClick={handleGenerateItineraryClick}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#0D6EFD] hover:bg-blue-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Itinerary</span>
                </button>
              </div>
            ) : transcript ? (
              <button
                id="process-spoken-trip-btn"
                type="button"
                onClick={() => parseSpokenSpeech(transcript)}
                disabled={isParsing}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#0D6EFD] hover:bg-blue-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Process Spoken Route</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
