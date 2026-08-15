import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  EnRouteTrip,
  EnRouteUser,
  ItineraryItem,
  SwipePlace,
  SafetyPin,
  SafetyPinCategory,
  EnRouteReceipt,
  GroupActivityMessage,
  DetourProposal,
  CompromiseFilters,
} from '../types';
import {
  CURRENT_USER,
  GROUP_MEMBERS,
  INITIAL_TRIP,
  INITIAL_ITINERARY,
  NEARBY_SWIPE_PLACES,
  INITIAL_SAFETY_PINS,
  INITIAL_RECEIPT,
  INITIAL_ACTIVITY_MESSAGES,
} from '../data/enRouteMockData';
import { offlineDb } from '../lib/db';
import confetti from 'canvas-confetti';

interface EnRouteContextType {
  // Current user & trip
  currentUser: EnRouteUser;
  trip: EnRouteTrip;
  members: EnRouteUser[];
  itinerary: ItineraryItem[];
  places: SwipePlace[];
  safetyPins: SafetyPin[];
  receipts: EnRouteReceipt[];
  activeReceipt: EnRouteReceipt;
  activityMessages: GroupActivityMessage[];
  
  // Rule A: Detour Proposal State
  activeDetourProposal: DetourProposal | null;
  approveDetourProposal: () => void;
  rejectDetourProposal: () => void;

  // Rule B: Voting & Consensus State
  activePlaceIndex: number;
  compromiseFilters: CompromiseFilters;
  setCompromiseFilters: React.Dispatch<React.SetStateAction<CompromiseFilters>>;
  handleSwipe: (direction: 'like' | 'pass' | 'superlike') => void;
  runVotingConsensusCheck: (placeId: string) => boolean;

  // Rule C: Receipt OCR & Bill Splitting
  isReceiptModalOpen: boolean;
  setIsReceiptModalOpen: (open: boolean) => void;
  updateReceiptItemClaims: (itemId: string, userId: string) => void;
  settleActiveReceipt: () => void;
  addNewReceipt: (receipt: EnRouteReceipt) => void;

  // Sentinel Safety & Map
  dropSafetyPin: (category: SafetyPinCategory, description: string, latLng: { lat: number; lng: number }) => void;
  upvoteSafetyPin: (pinId: string) => void;
  guardianAlert: string | null;
  dismissGuardianAlert: () => void;

  // Reactive Triggers (Weather & Traffic)
  weatherAlert: { isRaining: boolean; message: string; indoorAlternative?: string } | null;
  triggerWeatherRainSimulation: () => void;
  trafficAlert: { delayMins: number; anchorName: string } | null;
  triggerTrafficDelaySimulation: () => void;
  applyTrafficDelayToTimeline: () => void;
  dismissTrafficAlert: () => void;

  // Ripcord Emergency
  isRipcordModalOpen: boolean;
  setIsRipcordModalOpen: (open: boolean) => void;
  emergencyActive: boolean;
  declareEmergency: () => void;
  abortItinerary: () => void;

  // Golden Path automated tester
  isGoldenPathRunning: boolean;
  runGoldenPathDemo: () => Promise<void>;

  // Chat / Updates
  sendChatMessage: (text: string) => void;

  // Active View Navigation
  activeDashboardTab: 'command' | 'swipe' | 'timeline' | 'safety' | 'bills' | 'chat';
  setActiveDashboardTab: (tab: 'command' | 'swipe' | 'timeline' | 'safety' | 'bills' | 'chat') => void;
}

const EnRouteContext = createContext<EnRouteContextType | undefined>(undefined);

// Helper distance calculation (Haversine formula in meters)
function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export const EnRouteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser] = useState<EnRouteUser>(CURRENT_USER);
  const [trip, setTrip] = useState<EnRouteTrip>(INITIAL_TRIP);
  const [members, setMembers] = useState<EnRouteUser[]>(GROUP_MEMBERS);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(INITIAL_ITINERARY);
  const [places, setPlaces] = useState<SwipePlace[]>(NEARBY_SWIPE_PLACES);
  const [safetyPins, setSafetyPins] = useState<SafetyPin[]>(INITIAL_SAFETY_PINS);
  const [receipts, setReceipts] = useState<EnRouteReceipt[]>([INITIAL_RECEIPT]);
  const [activeReceipt, setActiveReceipt] = useState<EnRouteReceipt>(INITIAL_RECEIPT);
  const [activityMessages, setActivityMessages] = useState<GroupActivityMessage[]>(INITIAL_ACTIVITY_MESSAGES);

  const [activeDashboardTab, setActiveDashboardTab] = useState<'command' | 'swipe' | 'timeline' | 'safety' | 'bills' | 'chat'>('command');
  const [activePlaceIndex, setActivePlaceIndex] = useState<number>(0);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isRipcordModalOpen, setIsRipcordModalOpen] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);

  const [activeDetourProposal, setActiveDetourProposal] = useState<DetourProposal | null>(null);
  const [guardianAlert, setGuardianAlert] = useState<string | null>(null);
  const [weatherAlert, setWeatherAlert] = useState<{ isRaining: boolean; message: string; indoorAlternative?: string } | null>(null);
  const [trafficAlert, setTrafficAlert] = useState<{ delayMins: number; anchorName: string } | null>(null);
  const [isGoldenPathRunning, setIsGoldenPathRunning] = useState(false);

  const [compromiseFilters, setCompromiseFilters] = useState<CompromiseFilters>({
    maxPriceLevel: 3,
    maxWalkingMins: 15,
    indoorOnly: false,
    cuisine: 'All',
  });

  // Background Pin Expiry Check (2-Hour TTL)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      setSafetyPins((prev) =>
        prev.filter((pin) => new Date(pin.expiresAt).getTime() > now)
      );
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Save to Dexie for offline persistence
  useEffect(() => {
    async function syncToOfflineDb() {
      try {
        await offlineDb.trips.put(trip);
        await offlineDb.itinerary.bulkPut(itinerary);
        await offlineDb.safetyPins.bulkPut(safetyPins);
        await offlineDb.places.bulkPut(places);
      } catch (err) {
        console.warn('Offline DB sync notice:', err);
      }
    }
    syncToOfflineDb();
  }, [trip, itinerary, safetyPins, places]);

  // Send activity chat message
  const sendChatMessage = useCallback(
    (text: string, type: GroupActivityMessage['type'] = 'chat', payload?: any) => {
      const newMsg: GroupActivityMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        tripId: trip.tripId,
        senderId: currentUser.userId,
        senderName: currentUser.displayName,
        senderAvatar: currentUser.avatar,
        type,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        payload,
      };
      setActivityMessages((prev) => [...prev, newMsg]);
    },
    [currentUser, trip.tripId]
  );

  // -------------------------------------------------------------
  // RULE A: SAFETY INFORMS SCHEDULING (200m Detour Generation)
  // -------------------------------------------------------------
  const checkRuleADetourTrigger = useCallback(
    (newPin: SafetyPin) => {
      // Find the next active or confirmed anchor event
      const nextAnchor = itinerary.find(
        (item) => item.type === 'Anchor' && (item.status === 'Confirmed' || item.status === 'Active')
      );

      if (!nextAnchor) return;

      const distToAnchor = getDistanceMeters(
        newPin.latLng.lat,
        newPin.latLng.lng,
        nextAnchor.location.lat,
        nextAnchor.location.lng
      );

      // Also check if pin is near the current active route (e.g. Las Ramblas)
      const isCautionType = ['Caution', 'Pickpockets', 'Suspicious Activity', 'Heavy Crowds'].includes(newPin.category);

      // Rule A Threshold: within 200m of next Anchor OR on active walking path
      if (isCautionType && (distToAnchor <= 200 || newPin.category === 'Pickpockets')) {
        // Auto-generate Detour Proposal
        const detour: DetourProposal = {
          id: `detour_${Date.now()}`,
          cautionPinId: newPin.pinId,
          cautionCategory: newPin.category,
          anchorEventId: nextAnchor.itemId,
          anchorVenueName: nextAnchor.venueName,
          distanceToAnchorMeters: Math.round(distToAnchor),
          reason: `Caution Pin "${newPin.category}" dropped ${Math.round(distToAnchor)}m from walking route near Las Ramblas.`,
          originalRoute: {
            name: 'Las Ramblas Promenade (Direct)',
            durationMins: 14,
            polyline: [
              [41.3879, 2.1699],
              [41.3845, 2.1738],
              [41.3832, 2.1752],
              [41.3860, 2.1824],
            ],
          },
          proposedRoute: {
            name: 'Scenic Gothic Quarter Alleys Detour',
            detourName: 'Via Plaça Sant Jaume & Carrer de la Princesa (+6 mins)',
            durationMins: 20,
            additionalMins: 6,
            polyline: [
              [41.3879, 2.1699],
              [41.3862, 2.1758], // Gothic Quarter bypass
              [41.3845, 2.1772], // Plaça Sant Jaume
              [41.3855, 2.1812], // Carrer de la Princesa
              [41.3860, 2.1824], // El Xampanyet
            ],
          },
          status: 'pending',
          createdAt: new Date().toISOString(),
        };

        setActiveDetourProposal(detour);
        sendChatMessage(
          `🛡️ SAFETY RULE A TRIGGERED: Caution pin detected near walking path! Proposed Detour via Gothic Quarter generated (+6m). Tap to Approve.`,
          'detour_proposal',
          detour
        );

        // Haptic feedback
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([150, 100, 150]);
        }
      }
    },
    [itinerary, sendChatMessage]
  );

  const approveDetourProposal = useCallback(() => {
    if (!activeDetourProposal) return;

    // Update the trip active route
    setTrip((prev) => ({
      ...prev,
      activeRoute: {
        name: activeDetourProposal.proposedRoute.name,
        durationMins: activeDetourProposal.proposedRoute.durationMins,
        distanceKm: 1.4,
        coordinates: activeDetourProposal.proposedRoute.polyline,
      },
    }));

    sendChatMessage(
      `✅ DETOUR APPROVED: Group walking route shifted to Gothic Quarter alleys (<300ms WebSocket sync). All member maps rerouted!`,
      'system'
    );

    confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    setActiveDetourProposal(null);
  }, [activeDetourProposal, sendChatMessage]);

  const rejectDetourProposal = useCallback(() => {
    sendChatMessage(`Detour proposal dismissed by Admin. Continuing on current route.`, 'system');
    setActiveDetourProposal(null);
  }, [sendChatMessage]);

  // Drop Safety Pin on Map
  const dropSafetyPin = useCallback(
    (category: SafetyPinCategory, description: string, latLng: { lat: number; lng: number }) => {
      const newPin: SafetyPin = {
        pinId: `pin_${Date.now()}`,
        tripId: trip.tripId,
        userId: currentUser.userId,
        userName: currentUser.displayName,
        userAvatar: currentUser.avatar,
        latLng,
        category,
        description,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 2 * 3600000).toISOString(), // 2hr TTL
        upvotes: 1,
      };

      setSafetyPins((prev) => [newPin, ...prev]);
      sendChatMessage(
        `📍 ${currentUser.displayName} dropped a "${category}" pin: "${description}"`,
        'safety_alert',
        newPin
      );

      // Test Rule A Trigger
      checkRuleADetourTrigger(newPin);
    },
    [currentUser, trip.tripId, sendChatMessage, checkRuleADetourTrigger]
  );

  const upvoteSafetyPin = useCallback((pinId: string) => {
    setSafetyPins((prev) =>
      prev.map((p) => (p.pinId === pinId ? { ...p, upvotes: p.upvotes + 1 } : p))
    );
  }, []);

  // -------------------------------------------------------------
  // RULE B: VOTING LOCKS THE TIMELINE (60% Consensus Requirement)
  // -------------------------------------------------------------
  const runVotingConsensusCheck = useCallback(
    (placeId: string): boolean => {
      const place = places.find((p) => p.placeId === placeId);
      if (!place) return false;

      const totalGroupMembers = members.length || 4;
      const consensusRate = (place.yesVotes / totalGroupMembers) * 100;

      // RULE B THRESHOLD: >= 60% consensus
      if (consensusRate >= 60) {
        // Auto-lock into the Itinerary as confirmed Dinner Anchor
        setItinerary((prev) => {
          return prev.map((item) => {
            if (item.category === 'food' && item.startTime.startsWith('20')) {
              return {
                ...item,
                venueName: `${place.name} Tapas Feast`,
                placeId: place.placeId,
                status: 'Confirmed',
                location: {
                  lat: place.latLng.lat,
                  lng: place.latLng.lng,
                  address: place.address,
                },
                imageUrl: place.imageUrl,
                notes: `Voted Winner with ${Math.round(consensusRate)}% Group Consensus! (${place.yesVotes}/${totalGroupMembers} Likes)`,
                voteStats: {
                  totalVotes: place.voteCount,
                  yesVotes: place.yesVotes,
                  consensusPercent: Math.round(consensusRate),
                  requiredConsensus: 60,
                },
              };
            }
            return item;
          });
        });

        sendChatMessage(
          `🎉 RULE B LOCKED: "${place.name}" reached ${Math.round(consensusRate)}% consensus (≥60% threshold). Auto-scheduled as 8:00 PM Dinner Anchor!`,
          'vote_update'
        );

        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        return true;
      } else {
        sendChatMessage(
          `⚠️ Group undecided on backup venue (${Math.round(consensusRate)}% < 60% threshold). Sticking to original plan per Rule B.`,
          'system'
        );
        return false;
      }
    },
    [places, members.length, sendChatMessage]
  );

  const handleSwipe = useCallback(
    (direction: 'like' | 'pass' | 'superlike') => {
      const currentPlace = places[activePlaceIndex];
      if (!currentPlace) return;

      const isLike = direction === 'like' || direction === 'superlike';

      // Update place vote stats
      setPlaces((prev) =>
        prev.map((p, idx) => {
          if (idx === activePlaceIndex) {
            const newYesVotes = p.yesVotes + (isLike ? 1 : 0);
            const newVoteCount = p.voteCount + 1;
            const newConsensus = Math.round((newYesVotes / (members.length || 4)) * 100);
            return {
              ...p,
              userVoted: isLike ? 'like' : 'pass',
              yesVotes: newYesVotes,
              voteCount: newVoteCount,
              consensusPercent: newConsensus,
            };
          }
          return p;
        })
      );

      sendChatMessage(
        `${currentUser.displayName} swiped ${isLike ? 'LIKE ❤️' : 'PASS ❌'} on "${currentPlace.name}" (${currentPlace.category})`,
        'vote_update'
      );

      // Advance card
      if (activePlaceIndex < places.length - 1) {
        setActivePlaceIndex((prev) => prev + 1);
      } else {
        // Deck finished -> calculate winner
        runVotingConsensusCheck(currentPlace.placeId);
      }
    },
    [places, activePlaceIndex, members.length, currentUser.displayName, sendChatMessage, runVotingConsensusCheck]
  );

  // -------------------------------------------------------------
  // RULE C: RECEIPTS SETTLE THE DAY (Itinerary Pre-Fill + Split)
  // -------------------------------------------------------------
  const updateReceiptItemClaims = useCallback(
    (itemId: string, userId: string) => {
      setActiveReceipt((prev) => {
        const updatedItems = prev.parsedItems.map((item) => {
          if (item.id === itemId) {
            const alreadyClaimed = item.claimedBy.includes(userId);
            const newClaimed = alreadyClaimed
              ? item.claimedBy.filter((id) => id !== userId)
              : [...item.claimedBy, userId];
            return { ...item, claimedBy: newClaimed };
          }
          return item;
        });

        // Recalculate settlement balances per user
        const newSettlements: Record<string, number> = {};
        members.forEach((m) => {
          newSettlements[m.userId] = 0;
        });

        let totalItemSum = 0;
        updatedItems.forEach((item) => {
          totalItemSum += item.price;
          if (item.claimedBy.length > 0) {
            const splitPrice = item.price / item.claimedBy.length;
            item.claimedBy.forEach((uId) => {
              newSettlements[uId] = (newSettlements[uId] || 0) + splitPrice;
            });
          }
        });

        // Add proportional tax and tip
        const taxAndTipRatio = prev.subtotal > 0 ? (prev.tax + prev.tip) / prev.subtotal : 0.15;
        Object.keys(newSettlements).forEach((uId) => {
          newSettlements[uId] = Number((newSettlements[uId] * (1 + taxAndTipRatio)).toFixed(2));
        });

        return {
          ...prev,
          parsedItems: updatedItems,
          settlements: newSettlements,
        };
      });
    },
    [members]
  );

  const settleActiveReceipt = useCallback(() => {
    setActiveReceipt((prev) => ({ ...prev, status: 'settled' }));
    sendChatMessage(
      `🧾 RULE C SETTLED: "${activeReceipt.venueName}" bill of ${activeReceipt.total} ${activeReceipt.currency} settled! Venues pre-filled from Itinerary.`,
      'bill_settled'
    );
    confetti({ particleCount: 60, spread: 80, origin: { y: 0.5 } });
  }, [activeReceipt, sendChatMessage]);

  const addNewReceipt = useCallback((receipt: EnRouteReceipt) => {
    setReceipts((prev) => [receipt, ...prev]);
    setActiveReceipt(receipt);
  }, []);

  // -------------------------------------------------------------
  // REACTIVE TRIGGERS: WEATHER & TRAFFIC
  // -------------------------------------------------------------
  const triggerWeatherRainSimulation = useCallback(() => {
    const indoorAlternative = 'Santa Caterina Covered Market & Jamón Bar';
    setWeatherAlert({
      isRaining: true,
      message: '🌧️ Rain forecast in 20 mins! Auto-swapping outdoor stroll with pre-liked indoor refuge.',
      indoorAlternative,
    });

    // Auto-swap outdoor bubble with indoor venue
    setItinerary((prev) =>
      prev.map((item) => {
        if (item.type === 'Bubble' && item.weatherSensitive) {
          return {
            ...item,
            venueName: indoorAlternative,
            indoor: true,
            notes: '🌧️ Weather Auto-Swap: Swapped to covered indoor market due to rainfall radar trigger.',
            imageUrl: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80',
          };
        }
        return item;
      })
    );

    sendChatMessage(
      `🌧️ WEATHER TRIGGER: Rain radar detected showers in 20m. Outdoor bubble auto-swapped to "${indoorAlternative}".`,
      'itinerary_reshuffle'
    );
  }, [sendChatMessage]);

  const triggerTrafficDelaySimulation = useCallback(() => {
    setTrafficAlert({
      delayMins: 25,
      anchorName: 'Picasso Museum Tour',
    });
    sendChatMessage(
      `🚗 TRAFFIC TRIGGER: Heavy gridlock on Via Laietana (+25 min delay). Buffer bubble exceeded. Admin notified.`,
      'system'
    );
  }, [sendChatMessage]);

  const applyTrafficDelayToTimeline = useCallback(() => {
    if (!trafficAlert) return;
    setItinerary((prev) =>
      prev.map((item) => {
        if (item.status !== 'Completed') {
          const [h, m] = item.startTime.split(':').map(Number);
          const newM = (m + 30) % 60;
          const newH = h + Math.floor((m + 30) / 60);
          const formatted = `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
          return { ...item, startTime: formatted };
        }
        return item;
      })
    );
    sendChatMessage(`⏱️ TIMELINE ADJUSTED: Anchor schedule delayed by 30 mins to absorb traffic.`, 'itinerary_reshuffle');
    setTrafficAlert(null);
  }, [trafficAlert, sendChatMessage]);

  const dismissTrafficAlert = useCallback(() => setTrafficAlert(null), []);
  const dismissGuardianAlert = useCallback(() => setGuardianAlert(null), []);

  // -------------------------------------------------------------
  // RIPCORD EMERGENCY SYSTEM
  // -------------------------------------------------------------
  const declareEmergency = useCallback(() => {
    setEmergencyActive(true);
    sendChatMessage(
      `🚨 EMERGENCY RIPCORD PULLED: SOS Beacon broadcasted! Local Emergency 112 & Embassy alerted. Location locked to Gothic Quarter.`,
      'safety_alert'
    );
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([300, 100, 300, 100, 300]);
    }
  }, [sendChatMessage]);

  const abortItinerary = useCallback(() => {
    setItinerary((prev) =>
      prev.map((item) => {
        if (item.status !== 'Completed') {
          return { ...item, status: 'Rejected', notes: '⛔ Itinerary aborted by Group Admin. 2 Hours Free Time declared.' };
        }
        return item;
      })
    );
    sendChatMessage(
      `🛑 ITINERARY ABORTED: Remaining anchors cleared. 2 Hours Free Exploration declared. Rally point: Plaça Catalunya.`,
      'itinerary_reshuffle'
    );
    setIsRipcordModalOpen(false);
  }, [sendChatMessage]);

  // -------------------------------------------------------------
  // GOLDEN PATH END-TO-END AUTOMATED MVP TESTER
  // -------------------------------------------------------------
  const runGoldenPathDemo = useCallback(async () => {
    setIsGoldenPathRunning(true);
    setActiveDashboardTab('command');

    // Step 1: Swipe voting
    sendChatMessage(`▶️ STEP 1 (Group Compass): Group voting on 10 tapas bars...`, 'system');
    await new Promise((r) => setTimeout(r, 1200));

    // Force "El Xampanyet" consensus
    setPlaces((prev) =>
      prev.map((p) =>
        p.placeId === 'place_el_xampanyet'
          ? { ...p, yesVotes: 3, voteCount: 4, consensusPercent: 75, userVoted: 'like' }
          : p
      )
    );
    runVotingConsensusCheck('place_el_xampanyet');

    // Step 2: Drop Caution Pin on Las Ramblas
    await new Promise((r) => setTimeout(r, 2000));
    sendChatMessage(`▶️ STEP 2 (The Sentinel): User drops Pickpocket caution pin on Las Ramblas...`, 'system');
    dropSafetyPin('Pickpockets', 'Clipboard distraction scammers reported near Liceu Metro exit', {
      lat: 41.3836,
      lng: 2.1745,
    });

    // Step 3 & 4: Detour proposal generated -> Admin Approves
    await new Promise((r) => setTimeout(r, 2500));
    sendChatMessage(`▶️ STEP 3 & 4 (Detour & Vote): Admin approves Proposed Detour via Gothic Quarter...`, 'system');
    approveDetourProposal();

    // Step 5: Settle the Receipt
    await new Promise((r) => setTimeout(r, 2000));
    sendChatMessage(`▶️ STEP 5 (Receipts Settle): €120 bill pre-filled from Itinerary and settled!`, 'system');
    setIsReceiptModalOpen(true);
    setActiveDashboardTab('bills');

    setIsGoldenPathRunning(false);
  }, [sendChatMessage, runVotingConsensusCheck, dropSafetyPin, approveDetourProposal]);

  return (
    <EnRouteContext.Provider
      value={{
        currentUser,
        trip,
        members,
        itinerary,
        places,
        safetyPins,
        receipts,
        activeReceipt,
        activityMessages,
        activeDetourProposal,
        approveDetourProposal,
        rejectDetourProposal,
        activePlaceIndex,
        compromiseFilters,
        setCompromiseFilters,
        handleSwipe,
        runVotingConsensusCheck,
        isReceiptModalOpen,
        setIsReceiptModalOpen,
        updateReceiptItemClaims,
        settleActiveReceipt,
        addNewReceipt,
        dropSafetyPin,
        upvoteSafetyPin,
        guardianAlert,
        dismissGuardianAlert,
        weatherAlert,
        triggerWeatherRainSimulation,
        trafficAlert,
        triggerTrafficDelaySimulation,
        applyTrafficDelayToTimeline,
        dismissTrafficAlert,
        isRipcordModalOpen,
        setIsRipcordModalOpen,
        emergencyActive,
        declareEmergency,
        abortItinerary,
        isGoldenPathRunning,
        runGoldenPathDemo,
        sendChatMessage,
        activeDashboardTab,
        setActiveDashboardTab,
      }}
    >
      {children}
    </EnRouteContext.Provider>
  );
};

export const useEnRoute = () => {
  const context = useContext(EnRouteContext);
  if (!context) {
    throw new Error('useEnRoute must be used within an EnRouteProvider');
  }
  return context;
};
