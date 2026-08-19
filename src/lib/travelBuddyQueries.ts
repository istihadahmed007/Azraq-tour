import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import {
  TravelBuddyProfile,
  TravelBuddyRequest,
  MatchedTravelBuddy,
  BuddyRequestStatus,
} from '../types';

// Storage keys for offline resilience and local dev caching
const LOCAL_PROFILES_KEY = 'azraq_travel_buddy_profiles_cache';
const LOCAL_REQUESTS_KEY = 'azraq_travel_buddy_requests_cache';

// Clearly labeled demo profiles for Bangladeshi travelers
export const DEMO_BUDDY_PROFILES: TravelBuddyProfile[] = [
  {
    id: 'demo-tanvir-hossain',
    displayName: 'Tanvir Hossain',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    homeLocation: 'Dhaka, Bangladesh',
    bio: 'Food enthusiast & urban photographer. Planning street food crawls, night markets, and temple exploration.',
    destinations: ['Bangkok', 'Pattaya', 'Phuket'],
    travelStyles: ['Food & Culture', 'Photography', 'Backpacking / Budget'],
    languages: ['Bangla', 'English'],
    travelStart: '2026-11-12',
    travelEnd: '2026-11-18',
    groupSize: 2,
    contactPreference: 'WhatsApp',
    visibility: 'public',
    isActive: true,
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z',
    isDemo: true,
  },
  {
    id: 'demo-nusrat-jahan',
    displayName: 'Nusrat Jahan',
    avatarUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    homeLocation: 'Chattogram, Bangladesh',
    bio: 'Family trip planner looking for fellow travelers to share chartered transfers and island hopping in Malaysia.',
    destinations: ['Kuala Lumpur', 'Langkawi', 'Penang'],
    travelStyles: ['Family', 'Beach & Relaxation', 'Shopping'],
    languages: ['Bangla', 'English'],
    travelStart: '2026-12-02',
    travelEnd: '2026-12-08',
    groupSize: 4,
    contactPreference: 'In-app only',
    visibility: 'public',
    isActive: true,
    createdAt: '2026-08-05T12:00:00.000Z',
    updatedAt: '2026-08-05T12:00:00.000Z',
    isDemo: true,
  },
  {
    id: 'demo-rahat-chowdhury',
    displayName: 'Rahat Chowdhury',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    homeLocation: 'Dhaka, Bangladesh',
    bio: 'Tech entrepreneur on luxury weekend escapes. Interested in desert safaris, fine dining, and overwater villas.',
    destinations: ['Dubai', 'Maldives', 'Abu Dhabi'],
    travelStyles: ['Luxury', 'Adventure & Nature', 'Beach & Relaxation'],
    languages: ['Bangla', 'English', 'Arabic'],
    travelStart: '2026-11-20',
    travelEnd: '2026-11-27',
    groupSize: 1,
    contactPreference: 'WhatsApp',
    visibility: 'public',
    isActive: true,
    createdAt: '2026-08-10T14:00:00.000Z',
    updatedAt: '2026-08-10T14:00:00.000Z',
    isDemo: true,
  },
  {
    id: 'demo-samira-ahmed',
    displayName: 'Samira Ahmed',
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    homeLocation: 'Sylhet, Bangladesh',
    bio: 'Solo traveler seeking female travel companions for cafe hopping, yoga retreats, and museum tours in Bali & Singapore.',
    destinations: ['Bali', 'Singapore', 'Bangkok'],
    travelStyles: ['Solo Travel', 'Food & Culture', 'Photography'],
    languages: ['Bangla', 'English'],
    travelStart: '2026-12-15',
    travelEnd: '2026-12-22',
    groupSize: 1,
    contactPreference: 'In-app only',
    visibility: 'public',
    isActive: true,
    createdAt: '2026-08-12T16:00:00.000Z',
    updatedAt: '2026-08-12T16:00:00.000Z',
    isDemo: true,
  },
];

export const AVAILABLE_DESTINATIONS = [
  'Bangkok',
  'Phuket',
  'Pattaya',
  'Dubai',
  'Abu Dhabi',
  'Kuala Lumpur',
  'Langkawi',
  'Penang',
  'Maldives',
  'Bali',
  'Singapore',
  "Cox's Bazar",
  'Sajek Valley',
  'Sylhet & Sreemangal',
  'Kathmandu & Pokhara',
  'Istanbul',
];

export const AVAILABLE_TRAVEL_STYLES = [
  'Food & Culture',
  'Luxury',
  'Backpacking / Budget',
  'Family',
  'Adventure & Nature',
  'Beach & Relaxation',
  'Photography',
  'Shopping',
  'Solo Travel',
];

export const AVAILABLE_LANGUAGES = [
  'Bangla',
  'English',
  'Hindi',
  'Arabic',
  'Malay',
  'Thai',
];

/**
 * Generate a deterministic request ID between two users
 */
export function getBuddyRequestId(senderId: string, receiverId: string): string {
  return `${senderId}__${receiverId}`;
}

/**
 * Validates travel buddy profile form fields
 */
export function validateBuddyProfile(data: Partial<TravelBuddyProfile>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.displayName || !data.displayName.trim()) {
    errors.displayName = 'Display name is required.';
  } else if (data.displayName.trim().length > 60) {
    errors.displayName = 'Display name cannot exceed 60 characters.';
  }

  if (!data.destinations || data.destinations.length === 0) {
    errors.destinations = 'Please select at least one destination.';
  }

  if (data.bio && data.bio.length > 350) {
    errors.bio = 'Biography cannot exceed 350 characters.';
  }

  if (data.travelStart && data.travelEnd) {
    if (new Date(data.travelStart) > new Date(data.travelEnd)) {
      errors.travelEnd = 'Return date must be on or after departure date.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Check if two date ranges overlap
 */
export function checkDateOverlap(
  startA?: string,
  endA?: string,
  startB?: string,
  endB?: string
): boolean {
  if (!startA || !endA || !startB || !endB) return false;
  const a1 = new Date(startA).getTime();
  const a2 = new Date(endA).getTime();
  const b1 = new Date(startB).getTime();
  const b2 = new Date(endB).getTime();
  if (isNaN(a1) || isNaN(a2) || isNaN(b1) || isNaN(b2)) return false;
  return a1 <= b2 && b1 <= a2;
}

/**
 * Pure matching function that calculates match score, match reasons, and request relationship
 */
export function calculateBuddyMatch(
  currentUserProfile: Partial<TravelBuddyProfile> | null,
  candidate: TravelBuddyProfile,
  existingRequests: TravelBuddyRequest[] = [],
  currentUserId?: string | null
): MatchedTravelBuddy {
  const matchedOn: string[] = [];
  let score = 25; // Baseline compatibility when user profile is active

  if (currentUserProfile) {
    // 1. Shared Destinations (Highest weight: up to +35 points)
    const userDestinations = currentUserProfile.destinations || [];
    const sharedDestinations = candidate.destinations.filter((d) =>
      userDestinations.some((ud) => ud.toLowerCase() === d.toLowerCase())
    );
    if (sharedDestinations.length > 0) {
      score += Math.min(35, sharedDestinations.length * 20);
      matchedOn.push(`${sharedDestinations[0]} plans`);
    }

    // 2. Overlapping Travel Dates (+25 points)
    const datesOverlap = checkDateOverlap(
      currentUserProfile.travelStart,
      currentUserProfile.travelEnd,
      candidate.travelStart,
      candidate.travelEnd
    );
    if (datesOverlap) {
      score += 25;
      matchedOn.push('Dates overlap');
    }

    // 3. Shared Travel Styles (+15 points)
    const userStyles = currentUserProfile.travelStyles || [];
    const sharedStyles = candidate.travelStyles.filter((s) =>
      userStyles.some((us) => us.toLowerCase() === s.toLowerCase())
    );
    if (sharedStyles.length > 0) {
      score += Math.min(15, sharedStyles.length * 8);
      matchedOn.push(`${sharedStyles[0]} style`);
    }

    // 4. Shared Languages (+10 points)
    const userLangs = currentUserProfile.languages || ['Bangla', 'English'];
    const sharedLangs = candidate.languages.filter((l) =>
      userLangs.some((ul) => ul.toLowerCase() === l.toLowerCase())
    );
    if (sharedLangs.length > 0) {
      score += Math.min(10, sharedLangs.length * 5);
      if (sharedLangs.includes('Bangla')) {
        matchedOn.push('Bangla speaking');
      } else {
        matchedOn.push(`${sharedLangs[0]} speaking`);
      }
    }

    // 5. Same Home City (+10 points)
    if (
      currentUserProfile.homeLocation &&
      candidate.homeLocation &&
      currentUserProfile.homeLocation.toLowerCase().split(',')[0].trim() ===
        candidate.homeLocation.toLowerCase().split(',')[0].trim()
    ) {
      score += 10;
      const city = candidate.homeLocation.split(',')[0].trim();
      matchedOn.push(`Same city (${city})`);
    }
  } else {
    // Default score & reasons when browsing as guest
    score = 65;
    if (candidate.destinations.length > 0) {
      matchedOn.push(`${candidate.destinations[0]} trip`);
    }
    if (candidate.travelStyles.length > 0) {
      matchedOn.push(candidate.travelStyles[0]);
    }
    if (candidate.languages.includes('Bangla')) {
      matchedOn.push('Bangla speaking');
    }
  }

  // Ensure score is capped between 35 and 99
  const matchScore = Math.min(99, Math.max(35, Math.round(score)));

  // Trim to max 3 match reasons
  const displayReasons = matchedOn.slice(0, 3);
  if (displayReasons.length === 0) {
    displayReasons.push('Verified explorer');
  }

  // Check request status
  let requestStatus: BuddyRequestStatus | 'connected' | undefined = undefined;
  let requestDirection: 'incoming' | 'outgoing' | undefined = undefined;
  let activeRequestId: string | undefined = undefined;
  let existingRequest: TravelBuddyRequest | undefined = undefined;

  if (currentUserId) {
    const outgoing = existingRequests.find(
      (r) => r.senderId === currentUserId && r.receiverId === candidate.id
    );
    const incoming = existingRequests.find(
      (r) => r.senderId === candidate.id && r.receiverId === currentUserId
    );

    if (outgoing) {
      requestStatus = outgoing.status === 'accepted' ? 'connected' : outgoing.status;
      requestDirection = 'outgoing';
      activeRequestId = outgoing.id;
      existingRequest = outgoing;
    } else if (incoming) {
      requestStatus = incoming.status === 'accepted' ? 'connected' : incoming.status;
      requestDirection = 'incoming';
      activeRequestId = incoming.id;
      existingRequest = incoming;
    }
  }

  return {
    ...candidate,
    matchScore,
    matchedOn: displayReasons,
    requestStatus,
    requestDirection,
    activeRequestId,
    existingRequest,
  };
}

/**
 * Filter buddy candidates based on search terms, destination, and travel style
 */
export function filterBuddyProfiles(
  candidates: MatchedTravelBuddy[],
  search: string,
  destination: string,
  style: string
): MatchedTravelBuddy[] {
  return candidates.filter((b) => {
    // Search filter (name, city, destination, bio)
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchName = b.displayName.toLowerCase().includes(q);
      const matchCity = b.homeLocation.toLowerCase().includes(q);
      const matchBio = b.bio.toLowerCase().includes(q);
      const matchDest = b.destinations.some((d) => d.toLowerCase().includes(q));
      if (!matchName && !matchCity && !matchBio && !matchDest) {
        return false;
      }
    }

    // Destination filter
    if (destination && destination !== 'All') {
      const matchDest = b.destinations.some(
        (d) => d.toLowerCase() === destination.toLowerCase()
      );
      if (!matchDest) return false;
    }

    // Travel style filter
    if (style && style !== 'All') {
      const matchStyle = b.travelStyles.some(
        (s) => s.toLowerCase() === style.toLowerCase()
      );
      if (!matchStyle) return false;
    }

    return true;
  });
}

// ----------------------------------------------------
// FIRESTORE & PERSISTENCE API FUNCTIONS
// ----------------------------------------------------

/**
 * Fetch all active public buddy profiles from Firestore with local caching and demo fallback
 */
export async function fetchBuddyProfiles(): Promise<TravelBuddyProfile[]> {
  try {
    const profilesRef = collection(db, 'buddy_profiles');
    const q = query(profilesRef, where('isActive', '==', true));
    const snapshot = await getDocs(q);

    const remoteProfiles: TravelBuddyProfile[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as TravelBuddyProfile;
      remoteProfiles.push({
        ...data,
        id: docSnap.id,
      });
    });

    if (remoteProfiles.length > 0) {
      try {
        localStorage.setItem(LOCAL_PROFILES_KEY, JSON.stringify(remoteProfiles));
      } catch {
        // Ignore storage errors
      }
      return remoteProfiles;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'buddy_profiles');
  }

  // Fallback to local storage or demo profiles
  try {
    const cached = localStorage.getItem(LOCAL_PROFILES_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore parse errors
  }

  return DEMO_BUDDY_PROFILES;
}

/**
 * Fetch current user's travel buddy profile
 */
export async function fetchMyBuddyProfile(
  userId: string
): Promise<TravelBuddyProfile | null> {
  if (!userId) return null;

  try {
    const docRef = doc(db, 'buddy_profiles', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as TravelBuddyProfile;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `buddy_profiles/${userId}`);
  }

  // Check local storage fallback
  try {
    const myCached = localStorage.getItem(`azraq_my_buddy_profile_${userId}`);
    if (myCached) {
      return JSON.parse(myCached) as TravelBuddyProfile;
    }
  } catch {
    // Ignore parse errors
  }

  return null;
}

/**
 * Create or update travel buddy profile
 */
export async function saveBuddyProfile(
  profile: TravelBuddyProfile
): Promise<{ success: boolean; error?: string }> {
  try {
    const now = new Date().toISOString();
    const cleanProfile: TravelBuddyProfile = {
      ...profile,
      updatedAt: now,
      createdAt: profile.createdAt || now,
      isActive: profile.isActive ?? true,
    };

    // Save to Firestore
    const docRef = doc(db, 'buddy_profiles', profile.id);
    await setDoc(docRef, cleanProfile, { merge: true });

    // Cache locally
    try {
      localStorage.setItem(
        `azraq_my_buddy_profile_${profile.id}`,
        JSON.stringify(cleanProfile)
      );
    } catch {
      // Ignore
    }

    return { success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `buddy_profiles/${profile.id}`);
    
    // Save to local cache as graceful fallback
    try {
      localStorage.setItem(
        `azraq_my_buddy_profile_${profile.id}`,
        JSON.stringify(profile)
      );
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to save profile offline.' };
    }
  }
}

/**
 * Fetch all incoming & outgoing buddy requests for a user
 */
export async function fetchUserRequests(
  userId: string
): Promise<TravelBuddyRequest[]> {
  if (!userId) return [];

  const requests: TravelBuddyRequest[] = [];

  try {
    const reqRef = collection(db, 'buddy_requests');
    // Fetch where user is sender
    const qSender = query(reqRef, where('senderId', '==', userId));
    const senderSnap = await getDocs(qSender);
    senderSnap.forEach((d) => {
      requests.push(d.data() as TravelBuddyRequest);
    });

    // Fetch where user is receiver
    const qReceiver = query(reqRef, where('receiverId', '==', userId));
    const receiverSnap = await getDocs(qReceiver);
    receiverSnap.forEach((d) => {
      const data = d.data() as TravelBuddyRequest;
      if (!requests.some((r) => r.id === data.id)) {
        requests.push(data);
      }
    });

    if (requests.length > 0) {
      try {
        localStorage.setItem(
          `${LOCAL_REQUESTS_KEY}_${userId}`,
          JSON.stringify(requests)
        );
      } catch {
        // Ignore
      }
      return requests;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'buddy_requests');
  }

  // Local fallback
  try {
    const cached = localStorage.getItem(`${LOCAL_REQUESTS_KEY}_${userId}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignore
  }

  return [];
}

/**
 * Send a private connection request with deterministic ID
 */
export async function sendBuddyRequest(
  senderId: string,
  receiverId: string,
  message: string,
  senderProfile?: Partial<TravelBuddyProfile>,
  receiverProfile?: Partial<TravelBuddyProfile>
): Promise<{ success: boolean; request?: TravelBuddyRequest; error?: string }> {
  if (!senderId || !receiverId) {
    return { success: false, error: 'Invalid sender or receiver ID.' };
  }
  if (senderId === receiverId) {
    return { success: false, error: 'Cannot send connection request to yourself.' };
  }

  const requestId = getBuddyRequestId(senderId, receiverId);
  const now = new Date().toISOString();

  const newRequest: TravelBuddyRequest = {
    id: requestId,
    senderId,
    receiverId,
    message: message?.trim() || '',
    senderProfile: senderProfile
      ? {
          displayName: senderProfile.displayName,
          avatarUrl: senderProfile.avatarUrl,
          homeLocation: senderProfile.homeLocation,
          destinations: senderProfile.destinations,
          travelStart: senderProfile.travelStart,
          travelEnd: senderProfile.travelEnd,
        }
      : undefined,
    receiverProfile: receiverProfile
      ? {
          displayName: receiverProfile.displayName,
          avatarUrl: receiverProfile.avatarUrl,
          homeLocation: receiverProfile.homeLocation,
          destinations: receiverProfile.destinations,
          travelStart: receiverProfile.travelStart,
          travelEnd: receiverProfile.travelEnd,
        }
      : undefined,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  try {
    const docRef = doc(db, 'buddy_requests', requestId);
    await setDoc(docRef, newRequest);

    // Save to local cache
    try {
      const cached = localStorage.getItem(`${LOCAL_REQUESTS_KEY}_${senderId}`);
      const list: TravelBuddyRequest[] = cached ? JSON.parse(cached) : [];
      const updatedList = [newRequest, ...list.filter((r) => r.id !== requestId)];
      localStorage.setItem(
        `${LOCAL_REQUESTS_KEY}_${senderId}`,
        JSON.stringify(updatedList)
      );
    } catch {
      // Ignore
    }

    return { success: true, request: newRequest };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `buddy_requests/${requestId}`);

    // Offline / Local save
    try {
      const cached = localStorage.getItem(`${LOCAL_REQUESTS_KEY}_${senderId}`);
      const list: TravelBuddyRequest[] = cached ? JSON.parse(cached) : [];
      const updatedList = [newRequest, ...list.filter((r) => r.id !== requestId)];
      localStorage.setItem(
        `${LOCAL_REQUESTS_KEY}_${senderId}`,
        JSON.stringify(updatedList)
      );
      return { success: true, request: newRequest };
    } catch {
      return { success: false, error: 'Failed to record connection request.' };
    }
  }
}

/**
 * Respond to an incoming buddy request (accept or decline)
 */
export async function respondToBuddyRequest(
  requestId: string,
  status: 'accepted' | 'declined',
  currentUserId: string
): Promise<{ success: boolean; error?: string }> {
  const now = new Date().toISOString();
  try {
    const docRef = doc(db, 'buddy_requests', requestId);
    await updateDoc(docRef, {
      status,
      updatedAt: now,
    });

    // Update local cache
    try {
      const cached = localStorage.getItem(`${LOCAL_REQUESTS_KEY}_${currentUserId}`);
      if (cached) {
        const list: TravelBuddyRequest[] = JSON.parse(cached);
        const updated = list.map((r) =>
          r.id === requestId ? { ...r, status, updatedAt: now } : r
        );
        localStorage.setItem(
          `${LOCAL_REQUESTS_KEY}_${currentUserId}`,
          JSON.stringify(updated)
        );
      }
    } catch {
      // Ignore
    }

    return { success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `buddy_requests/${requestId}`);

    // Local fallback update
    try {
      const cached = localStorage.getItem(`${LOCAL_REQUESTS_KEY}_${currentUserId}`);
      if (cached) {
        const list: TravelBuddyRequest[] = JSON.parse(cached);
        const updated = list.map((r) =>
          r.id === requestId ? { ...r, status, updatedAt: now } : r
        );
        localStorage.setItem(
          `${LOCAL_REQUESTS_KEY}_${currentUserId}`,
          JSON.stringify(updated)
        );
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to update request status.' };
    }
  }
}

/**
 * Cancel a pending outgoing buddy request
 */
export async function cancelBuddyRequest(
  requestId: string,
  currentUserId: string
): Promise<{ success: boolean; error?: string }> {
  const now = new Date().toISOString();
  try {
    const docRef = doc(db, 'buddy_requests', requestId);
    await updateDoc(docRef, {
      status: 'cancelled',
      updatedAt: now,
    });

    // Update local cache
    try {
      const cached = localStorage.getItem(`${LOCAL_REQUESTS_KEY}_${currentUserId}`);
      if (cached) {
        const list: TravelBuddyRequest[] = JSON.parse(cached);
        const updated = list.map((r) =>
          r.id === requestId ? { ...r, status: 'cancelled' as BuddyRequestStatus, updatedAt: now } : r
        );
        localStorage.setItem(
          `${LOCAL_REQUESTS_KEY}_${currentUserId}`,
          JSON.stringify(updated)
        );
      }
    } catch {
      // Ignore
    }

    return { success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `buddy_requests/${requestId}`);

    // Local fallback update
    try {
      const cached = localStorage.getItem(`${LOCAL_REQUESTS_KEY}_${currentUserId}`);
      if (cached) {
        const list: TravelBuddyRequest[] = JSON.parse(cached);
        const updated = list.map((r) =>
          r.id === requestId ? { ...r, status: 'cancelled' as BuddyRequestStatus, updatedAt: now } : r
        );
        localStorage.setItem(
          `${LOCAL_REQUESTS_KEY}_${currentUserId}`,
          JSON.stringify(updated)
        );
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to cancel request.' };
    }
  }
}
