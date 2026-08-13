export type NavView = 'discover' | 'planner' | 'feed' | 'map' | 'profile' | 'admin';

export type QuoteStatus = 'New' | 'Reviewing' | 'Quotation Prepared' | 'Sent' | 'Customer Confirmed' | 'Closed';

export interface FlightQuoteRequest {
  id: string; // e.g. FLQ-849201
  type: 'flight';
  tripType: 'One Way' | 'Round Trip' | 'Multi-City';
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First';
  preferredAirline?: string;
  flexibleDate: 'Yes' | 'No';
  additionalRequirements?: string;
  customerName: string;
  email: string;
  phone: string;
  status: QuoteStatus;
  createdAt: string;
  updatedAt?: string;
  staffNote?: string;
  quotedPrice?: string;
  flightOptions?: string;
}

export interface VisaQuoteRequest {
  id: string; // e.g. VSQ-930214
  type: 'visa';
  destinationCountry: string;
  visaType: 'Tourist' | 'Business' | 'Student' | 'Transit' | 'Medical' | 'Other';
  intendedTravelDate: string;
  applicantsCount: number;
  applicantNationality: string;
  passportValidity: string;
  previousVisa: 'Yes' | 'No';
  previousRefusal: 'Yes' | 'No';
  currentResidence: string;
  requiredService: 'Visa Processing' | 'Consultation' | 'Document Assistance' | 'Full Package';
  additionalInfo?: string;
  customerName: string;
  email: string;
  phone: string;
  status: QuoteStatus;
  createdAt: string;
  updatedAt?: string;
  staffNote?: string;
  quotedPrice?: string;
}

export type QuoteRequest = FlightQuoteRequest | VisaQuoteRequest;

export type BrandTheme = 'globetrotter' | 'azraq';

export interface Spot {
  id?: string;
  name: string;
  description: string;
  timeSlot: string;
  category?: 'Sightseeing' | 'Food' | 'Nature' | 'Culture' | 'Nightlife' | string;
  imageUrl?: string;
  aiTip?: string;
  lat?: number;
  lng?: number;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  summary?: string;
  spots: Spot[];
  aiInsight?: string;
}

export interface PackingCategory {
  category: string;
  items: string[];
}

export interface Itinerary {
  id: string;
  title: string;
  destination: string;
  durationDays: number;
  weatherSummary: string;
  aiSummary: string;
  days: ItineraryDay[];
  packingList: PackingCategory[];
  savedAt?: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timeAgo: string;
}

export interface FeedPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  location: string;
  badgeLabel?: string;
  imageUrl: string;
  likes: number;
  commentsCount: number;
  caption: string;
  hashtags: string[];
  timeAgo: string;
  isLiked: boolean;
  isBookmarked: boolean;
  commentsList: Comment[];
  aiVerified?: boolean;
}

export interface Destination {
  id: string;
  name: string;
  cityRegion?: string;
  region?: string;
  country: string;
  flag?: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  fallbackImage?: string;
  category: 'Beach' | 'Culture' | 'Nature' | 'City' | 'Mountain' | 'Adventure' | 'Wildlife' | 'Luxury' | string;
  rating?: number;
  bestTimeToVisit?: string;
  recommendedDays?: string;
  estimatedBudget?: string;
  priceRange?: string;
  popularAttractions?: string[];
  activities?: string[];
  thingsToDo?: string[];
  localFood?: string[];
  currency?: string;
  visaInfo?: string;
  travelTips?: string[];
  lat?: number;
  lng?: number;
  coordinates?: { lat: number; lng: number };
  badge?: string;
  weather?: string;
  matchScore?: number;
  highlights?: string[];
  isPopular?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedPrompts?: string[];
}

export interface TrendingHashtag {
  tag: string;
  postsCount: string;
  isRising?: boolean;
}

export interface User {
  uid: string;
  fullName: string;
  email: string;
  phone?: string;
  country?: string;
  photoURL?: string;
  bio?: string;
  languages?: string[];
  emailVerified: boolean;
  phoneVerified?: boolean;
  isSuspended?: boolean;
  provider: 'email' | 'google' | 'apple' | 'facebook';
  createdAt: string;
  updatedAt?: string;
  homeLocation?: string;
  travelPreferences?: string[];
  isProfileComplete?: boolean;
  isAdmin?: boolean;
  role?: 'admin' | 'user' | 'owner';
}

export function isWebsiteOwner(user: User | null): boolean {
  if (!user) return false;
  if (user.isAdmin || user.role === 'admin' || user.role === 'owner') return true;
  const ownerEmails = [
    'istihadahmed1163@gmail.com',
    'alex@globetrotter.ai',
    'admin@globetrotter.ai',
    'owner@globetrotter.ai',
  ];
  const email = (user.email || '').toLowerCase();
  return ownerEmails.includes(email) || email.startsWith('admin') || email.startsWith('owner');
}

export type AuthModalView =
  | 'guest_prompt'
  | 'login'
  | 'register'
  | 'forgot_password'
  | 'email_verification'
  | 'phone_otp'
  | 'onboarding';

export interface PendingAction {
  type:
    | 'like_post'
    | 'comment_post'
    | 'follow_traveler'
    | 'save_destination'
    | 'create_post'
    | 'write_review'
    | 'send_message'
    | 'save_itinerary'
    | 'generate_itinerary';
  label: string;
  payload?: any;
  onExecute?: () => void;
}

export interface ToastNotification {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

