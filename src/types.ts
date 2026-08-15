export type NavView = 'enroute' | 'discover' | 'packages' | 'planner' | 'feed' | 'map' | 'profile' | 'admin';

export type QuoteStatus =
  | 'New'
  | 'Pending'
  | 'Processing'
  | 'Reviewing'
  | 'Quotation Prepared'
  | 'Quoted'
  | 'Quoted via WhatsApp'
  | 'Quoted via Email'
  | 'Sent'
  | 'Customer Confirmed'
  | 'Booked'
  | 'Lost'
  | 'Expired'
  | 'Closed'
  | 'Archived';

export type AdminRole = 'super_admin' | 'support_agent';

export interface InternalNote {
  id: string;
  authorName: string;
  authorRole: string;
  text: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  quoteId: string;
  action: string;
  performedBy: string;
  details?: string;
  timestamp: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  quoteId?: string;
  type: 'quote_new' | 'status_change' | 'sla_warning' | 'staff_assigned';
  isRead: boolean;
  createdAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar: string;
  specialty: string;
}

export interface FlightQuoteRequest {
  id: string; // e.g. FLQ-849201 or AZR-1024
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
  preferredContactMethod?: 'WhatsApp' | 'Email' | 'Phone Call';
  status: QuoteStatus;
  createdAt: string;
  updatedAt?: string;
  staffNote?: string;
  internalNotes?: InternalNote[];
  quotedPrice?: string;
  flightOptions?: string;
  assignedStaff?: string;
  assignedStaffId?: string;
  isArchived?: boolean;
  acknowledgmentSent?: boolean;
}

export interface VisaQuoteRequest {
  id: string; // e.g. VSQ-930214 or AZR-2048
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
  preferredContactMethod?: 'WhatsApp' | 'Email' | 'Phone Call';
  status: QuoteStatus;
  createdAt: string;
  updatedAt?: string;
  staffNote?: string;
  internalNotes?: InternalNote[];
  quotedPrice?: string;
  visaFee?: string;
  assignedStaff?: string;
  assignedStaffId?: string;
  isArchived?: boolean;
  acknowledgmentSent?: boolean;
}

export type QuoteRequest = FlightQuoteRequest | VisaQuoteRequest;

export type TimelineDotColor = 'yellow' | 'green' | 'red' | 'blue';

export interface UserFeedItem {
  id: string;
  feedType: 'personal' | 'announcement';
  title: string;
  message: string;
  timestamp: string;
  quoteId?: string;
  quoteType?: 'flight' | 'visa';
  routeOrDestination?: string;
  status?: QuoteStatus | string;
  dotColor: TimelineDotColor;
  isRead?: boolean;
  category?: 'Quote Status' | 'Trip Milestone' | 'Visa Notice' | 'System Alert' | 'Action Required';
  actionUrl?: string;
  actionLabel?: string;
  quotedPrice?: string;
  agentName?: string;
  iconType?: 'mail' | 'phone' | 'message' | 'check' | 'plane' | 'alert' | 'info' | 'bell';
}

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

export type ExpenseCategory =
  | 'Flights'
  | 'Accommodation'
  | 'Activities'
  | 'Food & Dining'
  | 'Transport'
  | 'Shopping'
  | 'Visa & Insurance'
  | 'Miscellaneous';

export interface BudgetItem {
  id: string;
  name: string;
  category: ExpenseCategory;
  estimatedCost: number;
  actualCost?: number;
  isPaid?: boolean;
  dayNumber?: number;
  spotName?: string;
  notes?: string;
}

export interface ItineraryBudget {
  currency: string;
  totalBudget: number;
  items: BudgetItem[];
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
  budget?: ItineraryBudget;
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
  authorId?: string;
  authorEmail?: string;
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
  likedBy?: string[];
  bookmarkedBy?: string[];
  createdAt?: string | any;
}

export interface PricingTier {
  pax: number;
  price: number;
}

export interface PackageItineraryDay {
  day: number | string;
  title: string;
  activities: string[];
  meals?: string;
  overnight?: string;
}

export interface DestinationRecord {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  active: boolean;
  packageCount?: number;
}

export interface TourPackage {
  id: string;
  destination_id: string;
  destination_name: string;
  country: string;
  package_name: string;
  duration: string;
  price: number; // Starting price
  currency: string;
  pricing_tiers: PricingTier[];
  description: string;
  itinerary: PackageItineraryDay[];
  hotel: string;
  meals: string;
  transportation: string;
  inclusions: string[];
  exclusions: string[];
  visa_information: string;
  required_documents: string[];
  important_notes: string[];
  terms_conditions: string[];
  source_pdf: string;
  status: 'published' | 'draft' | 'archived';
  created_at: string;
  updated_at: string;
  images: string[];
  highlights: string[];
  departure_info?: string;
  number_of_travelers?: string;
  contact_info?: string;
  visa_fee?: string;
}

export interface PackageQuoteRequest {
  id: string;
  type: 'package';
  customerName: string;
  email: string;
  phone: string;
  destination: string;
  package_id: string;
  package_name: string;
  travelDate: string;
  adults: number;
  children: number;
  specialRequirements?: string;
  message?: string;
  status: QuoteStatus;
  createdAt: string;
  staffNote?: string;
  quotedPrice?: string;
  visaFee?: string;
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
  visaFee?: string;
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
  savedDestinationIds?: string[];
  isProfileComplete?: boolean;
  isAdmin?: boolean;
  role?: 'admin' | 'user' | 'owner';
}

export function isWebsiteOwner(user: User | null): boolean {
  if (!user) return false;
  if (user.isAdmin || user.role === 'admin' || user.role === 'owner') return true;
  const ownerEmails = [
    'istihadahmed1163@gmail.com',
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
  | 'onboarding'
  | 'google_prompt';

export interface PendingAction {
  type:
    | 'like_post'
    | 'bookmark_post'
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

export type BlogCategory =
  | 'Destination Guide'
  | 'Visa Update'
  | 'Client Spotlight'
  | 'Travel Tips'
  | 'Photo Dump'
  | 'Reel'
  | 'Testimonial'
  | 'Travel Tip'
  | 'Poll'
  | 'Client Win';

export type PostMediaType =
  | 'photo_dump'
  | 'reel'
  | 'testimonial'
  | 'travel_tip'
  | 'poll'
  | 'client_win'
  | 'article';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PostComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timeAgo: string;
  likes?: number;
}

export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
  handle?: string;
  verified?: boolean;
  bio?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: BlogCategory;
  mediaType?: PostMediaType;
  excerpt: string;
  content: string;
  coverImage: string;
  images?: string[];
  videoUrl?: string;
  videoPoster?: string;
  headlineOverlay?: string;
  location?: string;
  author: BlogAuthor;
  publishedAt: string;
  readTime: string;
  tags: string[];
  seoDescription: string;
  viewsCount?: number;
  likesCount?: number;
  commentsCount?: number;
  commentsList?: PostComment[];
  isLiked?: boolean;
  isBookmarked?: boolean;
  featured?: boolean;
  pollData?: {
    question: string;
    options: PollOption[];
    totalVotes: number;
    userVotedOptionId?: string;
  };
  testimonialMeta?: {
    clientName: string;
    trip: string;
    rating: number;
    destination: string;
  };
  ctaText?: string;
  ctaType?: 'whatsapp' | 'quote_flight' | 'quote_visa' | 'inquire';
}

export interface StorySlide {
  id: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  headline: string;
  caption: string;
  location?: string;
  badge?: string;
  ctaText?: string;
  ctaType?: 'whatsapp' | 'quote_flight' | 'quote_visa' | 'explore';
  ctaDestination?: string;
  dateAgo?: string;
}

export interface StoryHighlight {
  id: string;
  title: string;
  emoji: string;
  coverImage: string;
  category: string;
  unread?: boolean;
  slides: StorySlide[];
}

export interface SocialProofActivity {
  id: string;
  type: 'flight_quote' | 'visa_quote' | 'package_booking' | 'visa_approval';
  actorAnonymized: string;
  actionText: string;
  destination: string;
  timeAgo: string;
  iconType: 'plane' | 'visa' | 'hotel' | 'check' | 'sparkles';
  timestamp: string;
}

export interface UserTripTimelineEvent {
  id: string;
  quoteId: string;
  status: QuoteStatus;
  stepTitle: string;
  description: string;
  timestamp: string;
  dotColor: 'yellow' | 'blue' | 'green' | 'purple' | 'gray';
  agentName?: string;
  actionType?: string;
}

// ==========================================
// ENROUTE PWA GROUP TRAVEL ARCHITECTURE
// ==========================================

export interface EnRouteUser {
  userId: string;
  displayName: string;
  email: string;
  avatar: string;
  currentLatLng: { lat: number; lng: number };
  role: 'admin' | 'member';
  batteryLevel?: number;
  lastSeen?: string;
  isOnline?: boolean;
  color?: string;
}

export type ItineraryItemType = 'Anchor' | 'Bubble';
export type ItineraryItemStatus = 'Confirmed' | 'Proposed' | 'Rejected' | 'Active' | 'Completed';

export interface ItineraryItem {
  itemId: string;
  tripId: string;
  venueName: string;
  placeId: string;
  category: 'food' | 'culture' | 'activity' | 'transit' | 'hotel';
  startTime: string; // "15:00"
  endTime: string;   // "16:30"
  type: ItineraryItemType;
  status: ItineraryItemStatus;
  location: { lat: number; lng: number; address: string };
  cost: number;
  indoor: boolean;
  imageUrl: string;
  rating?: number;
  notes?: string;
  originalPlan?: string;
  bufferMinutes?: number;
  weatherSensitive?: boolean;
  voteStats?: {
    totalVotes: number;
    yesVotes: number;
    consensusPercent: number;
    requiredConsensus: number;
  };
}

export interface EnRouteVote {
  voteId: string;
  tripId: string;
  userId: string;
  placeId: string;
  swipe: boolean; // true = like, false = pass
  timestamp: string;
}

export type SafetyPinCategory =
  | 'Caution'
  | 'Pickpockets'
  | 'Suspicious Activity'
  | 'Heavy Crowds'
  | 'Peaceful Demo'
  | 'Beautiful Vibe'
  | 'Scam Alert';

export interface SafetyPin {
  pinId: string;
  tripId?: string | null;
  userId: string;
  userName: string;
  userAvatar: string;
  latLng: { lat: number; lng: number };
  category: SafetyPinCategory;
  description: string;
  createdAt: string;
  expiresAt: string; // 2 hour TTL
  upvotes: number;
  isExpired?: boolean;
}

export interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  claimedBy: string[]; // userIds
}

export interface EnRouteReceipt {
  receiptId: string;
  tripId: string;
  venueName: string;
  uploadedBy: string;
  imageUrl: string;
  date: string;
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  currency: string;
  parsedItems: ReceiptItem[];
  settlements: Record<string, number>; // userId: amountOwed
  status: 'draft' | 'settled';
}

export interface SwipePlace {
  placeId: string;
  name: string;
  category: 'Tapas Bar' | 'Restaurant' | 'Café' | 'Museum' | 'Scenic Lookout' | 'Nightlife';
  rating: number;
  reviewsCount: number;
  priceLevel: 1 | 2 | 3 | 4; // $ to $$
  priceText: string;
  distanceMeters: number;
  walkingTimeMins: number;
  latLng: { lat: number; lng: number };
  address: string;
  imageUrl: string;
  indoor: boolean;
  tags: string[];
  specialty: string;
  openingHours: string;
  voteCount: number;
  yesVotes: number;
  consensusPercent: number;
  userVoted?: 'like' | 'pass';
  memberVotes?: { userId: string; swipe: boolean }[];
}

export interface CompromiseFilters {
  maxPriceLevel: number;
  maxWalkingMins: number;
  indoorOnly: boolean;
  cuisine: string;
}

export interface DetourProposal {
  id: string;
  cautionPinId: string;
  cautionCategory: SafetyPinCategory;
  anchorEventId: string;
  anchorVenueName: string;
  distanceToAnchorMeters: number;
  reason: string;
  originalRoute: {
    name: string;
    durationMins: number;
    polyline: [number, number][];
  };
  proposedRoute: {
    name: string;
    detourName: string;
    durationMins: number;
    additionalMins: number;
    polyline: [number, number][];
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface EnRouteTrip {
  tripId: string;
  title: string;
  destination: string;
  adminId: string;
  startDate: string;
  endDate: string;
  dailyBudget: number;
  currency: string;
  centroidLatLng: { lat: number; lng: number };
  members: EnRouteUser[];
  activeRoute?: {
    name: string;
    durationMins: number;
    distanceKm: number;
    coordinates: [number, number][];
  };
}

export interface GroupActivityMessage {
  id: string;
  tripId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  type: 'chat' | 'system' | 'safety_alert' | 'vote_update' | 'detour_proposal' | 'itinerary_reshuffle' | 'bill_settled';
  text: string;
  timestamp: string;
  payload?: any;
}


