export interface FlightAmenity {
  iconName: 'wifi' | 'meal' | 'seat' | 'entertainment' | 'power' | 'baggage';
  label: string;
  detail: string;
}

export interface ItinerarySegment {
  id: string;
  segmentNumber: number;
  flightNumber: string;
  airlineCode: string;
  airlineName: string;
  airlineLogo: string;
  aircraft: string;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First';
  
  // Origin
  originCode: string;
  originCity: string;
  originCountry: string;
  originAirportName: string;
  originTerminal: string;
  departureTimeLocal: string; // e.g., "19:30"
  departureDate: string; // e.g., "2026-09-15"
  departureUtcOffset: number; // e.g., +6
  
  // Destination
  destinationCode: string;
  destinationCity: string;
  destinationCountry: string;
  destinationAirportName: string;
  destinationTerminal: string;
  arrivalTimeLocal: string; // e.g., "23:05"
  arrivalDate: string;
  arrivalUtcOffset: number;
  daysDifference: number; // 0 = same day, 1 = next day (+1)
  
  // Duration & Distance
  durationMinutes: number; // e.g., 275
  durationFormatted: string; // e.g., "4h 35m"
  distanceKm: number;
  
  // Details
  baggageAllowance: {
    cabin: string;
    checked: string;
  };
  amenities: FlightAmenity[];
  seatPitch: string;
  mealType: string;
  carbonEmissionKg: number;
}

export interface LayoverInfo {
  airportCode: string;
  airportName: string;
  city: string;
  country: string;
  durationMinutes: number; // e.g., 195
  durationFormatted: string; // e.g., "3h 15m"
  arrivalTerminal: string;
  departureTerminal: string;
  isTerminalChange: boolean;
  status: 'tight' | 'optimal' | 'long';
  transitVisaRequiredBD: boolean;
  transitVisaNote: string;
  baggageAutoTransfer: boolean;
  airportHighlights: string[];
  freeTransitHotelEligible: boolean;
  loungeAvailable: boolean;
}

export interface FullFlightItinerary {
  id: string;
  routeTitle: string;
  originCode: string;
  originCity: string;
  destinationCode: string;
  destinationCity: string;
  tripType: 'oneway' | 'round';
  stopsCount: number; // 0 = non-stop, 1 = 1 stop, 2 = 2 stops
  totalJourneyMinutes: number;
  totalJourneyFormatted: string;
  totalFlightTimeFormatted: string;
  totalLayoverTimeFormatted?: string;
  
  outboundSegments: ItinerarySegment[];
  outboundLayovers: LayoverInfo[];
  
  returnSegments?: ItinerarySegment[];
  returnLayovers?: LayoverInfo[];
  returnTotalJourneyFormatted?: string;
  
  primaryAirlineName: string;
  primaryAirlineLogo: string;
  primaryAirlineCode: string;
  fareClass: string;
  ticketType: 'Standard' | 'Flexible' | 'Non-refundable';
  samplePriceBDT: number;
  aviasalesDeepLink: string;
  tags: string[];
}

export const SAMPLE_FLIGHT_ITINERARIES: FullFlightItinerary[] = [
  {
    id: 'itin-dac-lhr-emirates',
    routeTitle: 'Dhaka (DAC) ➔ London (LHR) via Dubai (DXB)',
    originCode: 'DAC',
    originCity: 'Dhaka',
    destinationCode: 'LHR',
    destinationCity: 'London',
    tripType: 'round',
    stopsCount: 1,
    totalJourneyMinutes: 895, // 14h 55m
    totalJourneyFormatted: '14h 55m',
    totalFlightTimeFormatted: '11h 40m',
    totalLayoverTimeFormatted: '3h 15m',
    primaryAirlineName: 'Emirates',
    primaryAirlineCode: 'EK',
    primaryAirlineLogo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80',
    fareClass: 'Economy Saver',
    ticketType: 'Flexible',
    samplePriceBDT: 88500,
    aviasalesDeepLink: 'https://www.aviasales.com/search/DAC1509LHR2509100y?params=DAC1',
    tags: ['Best Seller', 'A380 Experience', 'Free Wi-Fi'],
    outboundSegments: [
      {
        id: 'seg-ek-585',
        segmentNumber: 1,
        flightNumber: 'EK 585',
        airlineCode: 'EK',
        airlineName: 'Emirates',
        airlineLogo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80',
        aircraft: 'Boeing 777-300ER',
        cabinClass: 'Economy',
        originCode: 'DAC',
        originCity: 'Dhaka',
        originCountry: 'Bangladesh',
        originAirportName: 'Hazrat Shahjalal International Airport',
        originTerminal: 'Terminal 1',
        departureTimeLocal: '19:30',
        departureDate: '2026-09-15',
        departureUtcOffset: 6,
        destinationCode: 'DXB',
        destinationCity: 'Dubai',
        destinationCountry: 'United Arab Emirates',
        destinationAirportName: 'Dubai International Airport',
        destinationTerminal: 'Terminal 3',
        arrivalTimeLocal: '22:45',
        arrivalDate: '2026-09-15',
        arrivalUtcOffset: 4,
        daysDifference: 0,
        durationMinutes: 315,
        durationFormatted: '5h 15m',
        distanceKm: 3540,
        baggageAllowance: {
          cabin: '7 kg (1 piece)',
          checked: '30 kg (2 pieces)',
        },
        amenities: [
          { iconName: 'meal', label: 'Hot Halal Meal', detail: 'Complimentary multi-course dinner with beverages' },
          { iconName: 'entertainment', label: 'ice Entertainment', detail: '6,500+ channels of movies, live TV & music' },
          { iconName: 'wifi', label: 'Onboard Wi-Fi', detail: 'Free text messaging for Emirates Skywards members' },
          { iconName: 'power', label: 'USB & AC Power', detail: 'In-seat power supply at every seat' },
        ],
        seatPitch: '32-34 inches (Recline: 6 in)',
        mealType: 'Dinner (Halal certified)',
        carbonEmissionKg: 380,
      },
      {
        id: 'seg-ek-001',
        segmentNumber: 2,
        flightNumber: 'EK 001',
        airlineCode: 'EK',
        airlineName: 'Emirates',
        airlineLogo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80',
        aircraft: 'Airbus A380-800 Superjumbo',
        cabinClass: 'Economy',
        originCode: 'DXB',
        originCity: 'Dubai',
        originCountry: 'United Arab Emirates',
        originAirportName: 'Dubai International Airport',
        originTerminal: 'Terminal 3 (Concourse A)',
        departureTimeLocal: '02:00',
        departureDate: '2026-09-16',
        departureUtcOffset: 4,
        destinationCode: 'LHR',
        destinationCity: 'London',
        destinationCountry: 'United Kingdom',
        destinationAirportName: 'Heathrow Airport',
        destinationTerminal: 'Terminal 3',
        arrivalTimeLocal: '06:25',
        arrivalDate: '2026-09-16',
        arrivalUtcOffset: 1,
        daysDifference: 1,
        durationMinutes: 445,
        durationFormatted: '7h 25m',
        distanceKm: 5500,
        baggageAllowance: {
          cabin: '7 kg (1 piece)',
          checked: '30 kg (2 pieces)',
        },
        amenities: [
          { iconName: 'meal', label: 'Full Breakfast & Refreshments', detail: 'Hot breakfast served prior to morning descent' },
          { iconName: 'entertainment', label: '13.3" HD Screen', detail: 'Full touch screen with noise-reduction headsets' },
          { iconName: 'wifi', label: 'High-speed Satellite Wi-Fi', detail: 'Full flight browsing packages available' },
          { iconName: 'power', label: 'Universal Power & USB-A/C', detail: 'Fast device charging' },
        ],
        seatPitch: '32-34 inches with adjustable headrest',
        mealType: 'Breakfast & Snack',
        carbonEmissionKg: 510,
      },
    ],
    outboundLayovers: [
      {
        airportCode: 'DXB',
        airportName: 'Dubai International Airport',
        city: 'Dubai',
        country: 'United Arab Emirates',
        durationMinutes: 195,
        durationFormatted: '3h 15m',
        arrivalTerminal: 'Terminal 3',
        departureTerminal: 'Terminal 3',
        isTerminalChange: false,
        status: 'optimal',
        transitVisaRequiredBD: false,
        transitVisaNote: 'No transit visa required for stays under 24 hours within the sterile international transit zone.',
        baggageAutoTransfer: true,
        airportHighlights: [
          '24/7 World-class Duty Free Shopping',
          'SnoozeCube Sleep Pods & Relaxation Lounges',
          'Dedicated Prayer Rooms (Musalla) in Concourse A & B',
          'Free Ultra-fast Wi-Fi & Charging Kiosks',
        ],
        freeTransitHotelEligible: false,
        loungeAvailable: true,
      },
    ],
    returnSegments: [
      {
        id: 'seg-ek-002-ret',
        segmentNumber: 1,
        flightNumber: 'EK 002',
        airlineCode: 'EK',
        airlineName: 'Emirates',
        airlineLogo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80',
        aircraft: 'Airbus A380-800',
        cabinClass: 'Economy',
        originCode: 'LHR',
        originCity: 'London',
        originCountry: 'United Kingdom',
        originAirportName: 'Heathrow Airport',
        originTerminal: 'Terminal 3',
        departureTimeLocal: '13:40',
        departureDate: '2026-09-25',
        departureUtcOffset: 1,
        destinationCode: 'DXB',
        destinationCity: 'Dubai',
        destinationCountry: 'United Arab Emirates',
        destinationAirportName: 'Dubai International Airport',
        destinationTerminal: 'Terminal 3',
        arrivalTimeLocal: '23:45',
        arrivalDate: '2026-09-25',
        arrivalUtcOffset: 4,
        daysDifference: 0,
        durationMinutes: 425,
        durationFormatted: '7h 05m',
        distanceKm: 5500,
        baggageAllowance: { cabin: '7 kg', checked: '30 kg' },
        amenities: [
          { iconName: 'meal', label: 'Lunch & Beverage Bar', detail: 'Halal multi-course lunch' },
          { iconName: 'entertainment', label: 'ice Inflight System', detail: 'HD Screen' },
        ],
        seatPitch: '32-34 inches',
        mealType: 'Lunch & Snack',
        carbonEmissionKg: 510,
      },
      {
        id: 'seg-ek-582-ret',
        segmentNumber: 2,
        flightNumber: 'EK 582',
        airlineCode: 'EK',
        airlineName: 'Emirates',
        airlineLogo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80',
        aircraft: 'Boeing 777-300ER',
        cabinClass: 'Economy',
        originCode: 'DXB',
        originCity: 'Dubai',
        originCountry: 'United Arab Emirates',
        originAirportName: 'Dubai International Airport',
        originTerminal: 'Terminal 3',
        departureTimeLocal: '02:40',
        departureDate: '2026-09-26',
        departureUtcOffset: 4,
        destinationCode: 'DAC',
        destinationCity: 'Dhaka',
        destinationCountry: 'Bangladesh',
        destinationAirportName: 'Hazrat Shahjalal International Airport',
        destinationTerminal: 'Terminal 1',
        arrivalTimeLocal: '09:05',
        arrivalDate: '2026-09-26',
        arrivalUtcOffset: 6,
        daysDifference: 1,
        durationMinutes: 265,
        durationFormatted: '4h 25m',
        distanceKm: 3540,
        baggageAllowance: { cabin: '7 kg', checked: '30 kg' },
        amenities: [
          { iconName: 'meal', label: 'Hot Breakfast', detail: 'Morning meal before Dhaka arrival' },
        ],
        seatPitch: '32 inches',
        mealType: 'Breakfast',
        carbonEmissionKg: 380,
      },
    ],
    returnLayovers: [
      {
        airportCode: 'DXB',
        airportName: 'Dubai International Airport',
        city: 'Dubai',
        country: 'United Arab Emirates',
        durationMinutes: 175,
        durationFormatted: '2h 55m',
        arrivalTerminal: 'Terminal 3',
        departureTerminal: 'Terminal 3',
        isTerminalChange: false,
        status: 'optimal',
        transitVisaRequiredBD: false,
        transitVisaNote: 'No transit visa required for airside layover.',
        baggageAutoTransfer: true,
        airportHighlights: ['Emirates Terminal 3 Concourse Lounges', 'Duty Free Shop'],
        freeTransitHotelEligible: false,
        loungeAvailable: true,
      },
    ],
    returnTotalJourneyFormatted: '14h 25m',
  },
  {
    id: 'itin-dac-bkk-thai',
    routeTitle: 'Dhaka (DAC) ➔ Bangkok (BKK) [Non-Stop]',
    originCode: 'DAC',
    originCity: 'Dhaka',
    destinationCode: 'BKK',
    destinationCity: 'Bangkok',
    tripType: 'oneway',
    stopsCount: 0,
    totalJourneyMinutes: 150, // 2h 30m
    totalJourneyFormatted: '2h 30m',
    totalFlightTimeFormatted: '2h 30m',
    primaryAirlineName: 'Thai Airways',
    primaryAirlineCode: 'TG',
    primaryAirlineLogo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80',
    fareClass: 'Economy Flex',
    ticketType: 'Flexible',
    samplePriceBDT: 26500,
    aviasalesDeepLink: 'https://www.aviasales.com/search/DAC2009BKK100y?params=DAC1',
    tags: ['Non-Stop Direct', 'Fastest Route', 'Full Service'],
    outboundSegments: [
      {
        id: 'seg-tg-322',
        segmentNumber: 1,
        flightNumber: 'TG 322',
        airlineCode: 'TG',
        airlineName: 'Thai Airways',
        airlineLogo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80',
        aircraft: 'Boeing 787-8 Dreamliner',
        cabinClass: 'Economy',
        originCode: 'DAC',
        originCity: 'Dhaka',
        originCountry: 'Bangladesh',
        originAirportName: 'Hazrat Shahjalal International Airport',
        originTerminal: 'Terminal 1',
        departureTimeLocal: '13:55',
        departureDate: '2026-09-20',
        departureUtcOffset: 6,
        destinationCode: 'BKK',
        destinationCity: 'Bangkok',
        destinationCountry: 'Thailand',
        destinationAirportName: 'Suvarnabhumi Airport',
        destinationTerminal: 'Main Terminal',
        arrivalTimeLocal: '17:25',
        arrivalDate: '2026-09-20',
        arrivalUtcOffset: 7,
        daysDifference: 0,
        durationMinutes: 150,
        durationFormatted: '2h 30m',
        distanceKm: 1570,
        baggageAllowance: {
          cabin: '7 kg',
          checked: '30 kg (20 kg base + 10 kg promo)',
        },
        amenities: [
          { iconName: 'meal', label: 'Authentic Thai & Halal Meals', detail: 'Warm meal with drink selections' },
          { iconName: 'entertainment', label: 'In-flight AVOD Screens', detail: 'Movies, TV series and flight tracking' },
          { iconName: 'seat', label: 'Dreamliner Cabin Pressure', detail: 'Higher humidity and smoother cabin air' },
          { iconName: 'power', label: 'USB Charging at Seat', detail: 'Charge smartphones and tablets' },
        ],
        seatPitch: '32 inches',
        mealType: 'Warm Lunch',
        carbonEmissionKg: 190,
      },
    ],
    outboundLayovers: [],
  },
  {
    id: 'itin-dac-syd-singapore',
    routeTitle: 'Dhaka (DAC) ➔ Sydney (SYD) via Singapore (SIN)',
    originCode: 'DAC',
    originCity: 'Dhaka',
    destinationCode: 'SYD',
    destinationCity: 'Sydney',
    tripType: 'oneway',
    stopsCount: 1,
    totalJourneyMinutes: 895, // 14h 55m
    totalJourneyFormatted: '14h 55m',
    totalFlightTimeFormatted: '12h 35m',
    totalLayoverTimeFormatted: '2h 20m',
    primaryAirlineName: 'Singapore Airlines',
    primaryAirlineCode: 'SQ',
    primaryAirlineLogo: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=120&q=80',
    fareClass: 'Economy Standard',
    ticketType: 'Standard',
    samplePriceBDT: 112000,
    aviasalesDeepLink: 'https://www.aviasales.com/search/DAC2209SYD100y?params=DAC1',
    tags: ['World Top Airline', 'Changi Transit', 'Free Wi-Fi'],
    outboundSegments: [
      {
        id: 'seg-sq-447',
        segmentNumber: 1,
        flightNumber: 'SQ 447',
        airlineCode: 'SQ',
        airlineName: 'Singapore Airlines',
        airlineLogo: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=120&q=80',
        aircraft: 'Airbus A350-900',
        cabinClass: 'Economy',
        originCode: 'DAC',
        originCity: 'Dhaka',
        originCountry: 'Bangladesh',
        originAirportName: 'Hazrat Shahjalal International Airport',
        originTerminal: 'Terminal 1',
        departureTimeLocal: '23:55',
        departureDate: '2026-09-22',
        departureUtcOffset: 6,
        destinationCode: 'SIN',
        destinationCity: 'Singapore',
        destinationCountry: 'Singapore',
        destinationAirportName: 'Changi Airport',
        destinationTerminal: 'Terminal 3',
        arrivalTimeLocal: '06:05',
        arrivalDate: '2026-09-23',
        arrivalUtcOffset: 8,
        daysDifference: 1,
        durationMinutes: 250,
        durationFormatted: '4h 10m',
        distanceKm: 2890,
        baggageAllowance: { cabin: '7 kg', checked: '30 kg' },
        amenities: [
          { iconName: 'meal', label: 'Supper & Drinks', detail: 'Halal certified gourmet supper' },
          { iconName: 'entertainment', label: 'KrisWorld System', detail: '1,800+ on-demand media choices' },
          { iconName: 'wifi', label: 'Complimentary Wi-Fi', detail: 'Unlimited for KrisFlyer members in all classes' },
        ],
        seatPitch: '32-34 inches',
        mealType: 'Hot Supper',
        carbonEmissionKg: 310,
      },
      {
        id: 'seg-sq-231',
        segmentNumber: 2,
        flightNumber: 'SQ 231',
        airlineCode: 'SQ',
        airlineName: 'Singapore Airlines',
        airlineLogo: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=120&q=80',
        aircraft: 'Boeing 777-300ER',
        cabinClass: 'Economy',
        originCode: 'SIN',
        originCity: 'Singapore',
        originCountry: 'Singapore',
        originAirportName: 'Changi Airport',
        originTerminal: 'Terminal 3',
        departureTimeLocal: '08:25',
        departureDate: '2026-09-23',
        departureUtcOffset: 8,
        destinationCode: 'SYD',
        destinationCity: 'Sydney',
        destinationCountry: 'Australia',
        destinationAirportName: 'Kingsford Smith Airport',
        destinationTerminal: 'Terminal 1 (International)',
        arrivalTimeLocal: '17:50',
        arrivalDate: '2026-09-23',
        arrivalUtcOffset: 10,
        daysDifference: 1,
        durationMinutes: 505,
        durationFormatted: '8h 25m',
        distanceKm: 6300,
        baggageAllowance: { cabin: '7 kg', checked: '30 kg' },
        amenities: [
          { iconName: 'meal', label: 'Breakfast & Full Lunch', detail: 'Two full hot meal services' },
          { iconName: 'entertainment', label: 'KrisWorld Touchscreen', detail: 'High-definition entertainment' },
          { iconName: 'power', label: 'AC & USB Power', detail: 'At seat' },
        ],
        seatPitch: '32-34 inches',
        mealType: 'Breakfast & Lunch',
        carbonEmissionKg: 580,
      },
    ],
    outboundLayovers: [
      {
        airportCode: 'SIN',
        airportName: 'Singapore Changi Airport',
        city: 'Singapore',
        country: 'Singapore',
        durationMinutes: 140,
        durationFormatted: '2h 20m',
        arrivalTerminal: 'Terminal 3',
        departureTerminal: 'Terminal 3',
        isTerminalChange: false,
        status: 'optimal',
        transitVisaRequiredBD: false,
        transitVisaNote: 'No transit visa required for Singapore Changi airside transfers under 24h.',
        baggageAutoTransfer: true,
        airportHighlights: [
          'Butterfly Garden & Sunflower Garden (Terminal 3 & 2)',
          'Jewel Changi Rain Vortex access (if time allows)',
          'Free Snooze Lounges with ergonomic rest chairs',
          'Singapore Food Street & prayer facilities',
        ],
        freeTransitHotelEligible: false,
        loungeAvailable: true,
      },
    ],
  },
  {
    id: 'itin-dac-jfk-qatar',
    routeTitle: 'Dhaka (DAC) ➔ New York (JFK) via Doha (DOH)',
    originCode: 'DAC',
    originCity: 'Dhaka',
    destinationCode: 'JFK',
    destinationCity: 'New York',
    tripType: 'oneway',
    stopsCount: 1,
    totalJourneyMinutes: 1260, // 21h 00m
    totalJourneyFormatted: '21h 00m',
    totalFlightTimeFormatted: '18h 15m',
    totalLayoverTimeFormatted: '2h 45m',
    primaryAirlineName: 'Qatar Airways',
    primaryAirlineCode: 'QR',
    primaryAirlineLogo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80',
    fareClass: 'Economy Classic',
    ticketType: 'Standard',
    samplePriceBDT: 125000,
    aviasalesDeepLink: 'https://www.aviasales.com/search/DAC2509JFK100y?params=DAC1',
    tags: ['World Best Airline 2025', 'Hamad Orchard', 'Generous Baggage (2x23kg)'],
    outboundSegments: [
      {
        id: 'seg-qr-639',
        segmentNumber: 1,
        flightNumber: 'QR 639',
        airlineCode: 'QR',
        airlineName: 'Qatar Airways',
        airlineLogo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80',
        aircraft: 'Boeing 777-300ER',
        cabinClass: 'Economy',
        originCode: 'DAC',
        originCity: 'Dhaka',
        originCountry: 'Bangladesh',
        originAirportName: 'Hazrat Shahjalal International Airport',
        originTerminal: 'Terminal 1',
        departureTimeLocal: '04:15',
        departureDate: '2026-09-25',
        departureUtcOffset: 6,
        destinationCode: 'DOH',
        destinationCity: 'Doha',
        destinationCountry: 'Qatar',
        destinationAirportName: 'Hamad International Airport',
        destinationTerminal: 'Main Terminal',
        arrivalTimeLocal: '06:55',
        arrivalDate: '2026-09-25',
        arrivalUtcOffset: 3,
        daysDifference: 0,
        durationMinutes: 340,
        durationFormatted: '5h 40m',
        distanceKm: 3920,
        baggageAllowance: { cabin: '7 kg', checked: '2 pieces (23 kg each)' },
        amenities: [
          { iconName: 'meal', label: 'Breakfast Platter', detail: 'Warm breakfast with juices and coffee' },
          { iconName: 'entertainment', label: 'Oryx One IFE', detail: '4,000+ movies, music, and podcasts' },
          { iconName: 'power', label: 'In-seat USB & AC', detail: 'Power ports at all seats' },
        ],
        seatPitch: '32 inches',
        mealType: 'Breakfast',
        carbonEmissionKg: 420,
      },
      {
        id: 'seg-qr-701',
        segmentNumber: 2,
        flightNumber: 'QR 701',
        airlineCode: 'QR',
        airlineName: 'Qatar Airways',
        airlineLogo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80',
        aircraft: 'Airbus A350-1000',
        cabinClass: 'Economy',
        originCode: 'DOH',
        originCity: 'Doha',
        originCountry: 'Qatar',
        originAirportName: 'Hamad International Airport',
        originTerminal: 'Main Terminal',
        departureTimeLocal: '09:40',
        departureDate: '2026-09-25',
        departureUtcOffset: 3,
        destinationCode: 'JFK',
        destinationCity: 'New York',
        destinationCountry: 'United States',
        destinationAirportName: 'John F. Kennedy International Airport',
        destinationTerminal: 'Terminal 8',
        arrivalTimeLocal: '16:15',
        arrivalDate: '2026-09-25',
        arrivalUtcOffset: -4,
        daysDifference: 0,
        durationMinutes: 755,
        durationFormatted: '12h 35m',
        distanceKm: 10800,
        baggageAllowance: { cabin: '7 kg', checked: '2 pieces (23 kg each)' },
        amenities: [
          { iconName: 'meal', label: 'Multi-course Lunch & Dinner', detail: 'Continuous snack and hot beverage service' },
          { iconName: 'entertainment', label: 'Oryx One HD screen', detail: 'Bose-compatible noise cancellation' },
          { iconName: 'wifi', label: 'Super Wi-Fi', detail: 'High-speed broadband connectivity available' },
        ],
        seatPitch: '32-33 inches with ergonomic headrest',
        mealType: 'Lunch, Snacks & Dinner',
        carbonEmissionKg: 910,
      },
    ],
    outboundLayovers: [
      {
        airportCode: 'DOH',
        airportName: 'Hamad International Airport',
        city: 'Doha',
        country: 'Qatar',
        durationMinutes: 165,
        durationFormatted: '2h 45m',
        arrivalTerminal: 'Main Terminal',
        departureTerminal: 'Main Terminal',
        isTerminalChange: false,
        status: 'optimal',
        transitVisaRequiredBD: false,
        transitVisaNote: 'No transit visa required for transfers under 24 hours.',
        baggageAutoTransfer: true,
        airportHighlights: [
          'The ORCHARD Indoor Tropical Garden (6,000 sq meters)',
          'Famous Giant Yellow Lamp Bear Art Installation',
          'Quiet Sleeping Pods and Family Activity Rooms',
          'Hamad Vitality Wellbeing & Fitness Centre with Pool',
        ],
        freeTransitHotelEligible: false,
        loungeAvailable: true,
      },
    ],
  },
  {
    id: 'itin-dac-jed-saudia',
    routeTitle: 'Dhaka (DAC) ➔ Jeddah (JED) [Direct Umrah / Hajj Route]',
    originCode: 'DAC',
    originCity: 'Dhaka',
    destinationCode: 'JED',
    destinationCity: 'Jeddah',
    tripType: 'oneway',
    stopsCount: 0,
    totalJourneyMinutes: 395, // 6h 35m
    totalJourneyFormatted: '6h 35m',
    totalFlightTimeFormatted: '6h 35m',
    primaryAirlineName: 'Saudia',
    primaryAirlineCode: 'SV',
    primaryAirlineLogo: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=120&q=80',
    fareClass: 'Guest Class (Economy)',
    ticketType: 'Standard',
    samplePriceBDT: 62000,
    aviasalesDeepLink: 'https://www.aviasales.com/search/DAC2809JED100y?params=DAC1',
    tags: ['Non-Stop Direct', 'Umrah Ready', '5L Zamzam Water Included', '2x23kg Checked Bags'],
    outboundSegments: [
      {
        id: 'seg-sv-805',
        segmentNumber: 1,
        flightNumber: 'SV 805',
        airlineCode: 'SV',
        airlineName: 'Saudia',
        airlineLogo: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=120&q=80',
        aircraft: 'Boeing 777-300ER',
        cabinClass: 'Economy',
        originCode: 'DAC',
        originCity: 'Dhaka',
        originCountry: 'Bangladesh',
        originAirportName: 'Hazrat Shahjalal International Airport',
        originTerminal: 'Terminal 1',
        departureTimeLocal: '08:30',
        departureDate: '2026-09-28',
        departureUtcOffset: 6,
        destinationCode: 'JED',
        destinationCity: 'Jeddah',
        destinationCountry: 'Saudi Arabia',
        destinationAirportName: 'King Abdulaziz International Airport',
        destinationTerminal: 'Terminal 1 (New Terminal)',
        arrivalTimeLocal: '13:05',
        arrivalDate: '2026-09-28',
        arrivalUtcOffset: 3,
        daysDifference: 0,
        durationMinutes: 395,
        durationFormatted: '6h 35m',
        distanceKm: 5210,
        baggageAllowance: {
          cabin: '7 kg',
          checked: '2 pieces (23 kg each) + 5L Zamzam on return',
        },
        amenities: [
          { iconName: 'meal', label: 'Full Halal Meal & Refreshment', detail: 'Choice of traditional Arabic & South Asian dishes' },
          { iconName: 'entertainment', label: 'Islamic Content & Movies', detail: 'Quran recitations, Dua broadcasts, and entertainment' },
          { iconName: 'seat', label: 'Dedicated Onboard Prayer Area', detail: 'Spacious prayer zone with Qibla indicator' },
          { iconName: 'power', label: 'USB Port at Seat', detail: 'Convenient charging' },
        ],
        seatPitch: '32-34 inches',
        mealType: 'Lunch & Snack',
        carbonEmissionKg: 520,
      },
    ],
    outboundLayovers: [],
  },
];
