export interface Airport {
  code: string;
  city: string;
  country: string;
  name: string;
  flag?: string;
  isBangladesh?: boolean;
  popular?: boolean;
}

export interface DestinationCardItem {
  id: string;
  city: string;
  country: string;
  code: string;
  airportName: string;
  region: 'Asia' | 'Middle East' | 'Europe' | 'North America' | 'Australia & Oceania' | 'Africa';
  imageUrl: string;
  flightDurationFromDAC: string;
  visaRequirement: string;
  popularReason: string;
  featured?: boolean;
}

export interface RouteGuideItem {
  slug: string;
  originCode: string;
  originCity: string;
  destinationCode: string;
  destinationCity: string;
  destinationCountry: string;
  heroImage: string;
  averageFlightTime: string;
  popularAirlines: string[];
  visaSummary: string;
  bestTimeToFly: string;
  travelTips: string;
}

export interface Airline {
  code: string;
  name: string;
  logo: string;
  rating?: number;
}

export interface FlightSegment {
  flightNumber: string;
  airlineCode: string;
  airlineName: string;
  aircraft: string;
  originCode: string;
  originCity: string;
  destinationCode: string;
  destinationCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  cabinClass: string;
  baggage: string;
  meal: string;
}

export interface FlightOffer {
  id: string;
  airlineCode: string;
  airlineName: string;
  airlineLogo: string;
  flightNumber: string;
  aircraft: string;
  tripType: 'oneway' | 'round' | 'multi';
  origin: Airport;
  destination: Airport;
  departureDate: string;
  returnDate?: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number; // 0 = nonstop, 1 = 1 stop, 2 = 2+ stops
  stopAirports?: string[];
  layoverDuration?: string;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First';
  priceBDT: number;
  currency: string;
  refundable: boolean;
  baggageAllowance: {
    cabin: string;
    checked: string;
  };
  inFlightAmenities: string[];
  partnerName: string;
  partnerDeepLink: string;
  returnSegment?: {
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    stops: number;
    stopAirports?: string[];
    departureDate: string;
  };
  isRecommended?: boolean;
  isBestValue?: boolean;
  isFastest?: boolean;
  seatsRemaining?: number;
}

// Bangladesh departure airports prioritized
export const BANGLADESH_AIRPORTS: Airport[] = [
  { code: 'DAC', city: 'Dhaka', country: 'Bangladesh', name: 'Hazrat Shahjalal International Airport', flag: '🇧🇩', isBangladesh: true, popular: true },
  { code: 'CGP', city: 'Chattogram', country: 'Bangladesh', name: 'Shah Amanat International Airport', flag: '🇧🇩', isBangladesh: true, popular: true },
  { code: 'ZYL', city: 'Sylhet', country: 'Bangladesh', name: 'Osmani International Airport', flag: '🇧🇩', isBangladesh: true, popular: true },
  { code: 'CXB', city: "Cox's Bazar", country: 'Bangladesh', name: "Cox's Bazar Airport", flag: '🇧🇩', isBangladesh: true, popular: true },
  { code: 'JSR', city: 'Jashore', country: 'Bangladesh', name: 'Jashore Airport', flag: '🇧🇩', isBangladesh: true, popular: true },
  { code: 'RJH', city: 'Rajshahi', country: 'Bangladesh', name: 'Shah Makhdum Airport', flag: '🇧🇩', isBangladesh: true, popular: true },
  { code: 'SPD', city: 'Saidpur', country: 'Bangladesh', name: 'Saidpur Airport', flag: '🇧🇩', isBangladesh: true },
  { code: 'BZL', city: 'Barishal', country: 'Bangladesh', name: 'Barishal Airport', flag: '🇧🇩', isBangladesh: true },
];

// Popular International Airports
export const INTERNATIONAL_AIRPORTS: Airport[] = [
  // Middle East
  { code: 'DXB', city: 'Dubai', country: 'United Arab Emirates', name: 'Dubai International Airport', flag: '🇦🇪', popular: true },
  { code: 'AUH', city: 'Abu Dhabi', country: 'United Arab Emirates', name: 'Zayed International Airport', flag: '🇦🇪', popular: true },
  { code: 'DOH', city: 'Doha', country: 'Qatar', name: 'Hamad International Airport', flag: '🇶🇦', popular: true },
  { code: 'JED', city: 'Jeddah', country: 'Saudi Arabia', name: 'King Abdulaziz International Airport', flag: '🇸🇦', popular: true },
  { code: 'MED', city: 'Medina', country: 'Saudi Arabia', name: 'Prince Mohammad Bin Abdulaziz Airport', flag: '🇸🇦', popular: true },
  { code: 'RUH', city: 'Riyadh', country: 'Saudi Arabia', name: 'King Khalid International Airport', flag: '🇸🇦', popular: true },
  { code: 'MCT', city: 'Muscat', country: 'Oman', name: 'Muscat International Airport', flag: '🇴🇲', popular: true },
  { code: 'IST', city: 'Istanbul', country: 'Turkey', name: 'Istanbul Airport', flag: '🇹🇷', popular: true },

  // Asia
  { code: 'BKK', city: 'Bangkok', country: 'Thailand', name: 'Suvarnabhumi Airport', flag: '🇹🇭', popular: true },
  { code: 'DMK', city: 'Bangkok (Don Mueang)', country: 'Thailand', name: 'Don Mueang International Airport', flag: '🇹🇭' },
  { code: 'KUL', city: 'Kuala Lumpur', country: 'Malaysia', name: 'Kuala Lumpur International Airport', flag: '🇲🇾', popular: true },
  { code: 'SIN', city: 'Singapore', country: 'Singapore', name: 'Singapore Changi Airport', flag: '🇸🇬', popular: true },
  { code: 'DEL', city: 'Delhi', country: 'India', name: 'Indira Gandhi International Airport', flag: '🇮🇳', popular: true },
  { code: 'CCU', city: 'Kolkata', country: 'India', name: 'Netaji Subhash Chandra Bose International Airport', flag: '🇮🇳', popular: true },
  { code: 'BOM', city: 'Mumbai', country: 'India', name: 'Chhatrapati Shivaji Maharaj International Airport', flag: '🇮🇳', popular: true },
  { code: 'MAA', city: 'Chennai', country: 'India', name: 'Chennai International Airport', flag: '🇮🇳', popular: true },
  { code: 'BLR', city: 'Bangalore', country: 'India', name: 'Kempegowda International Airport', flag: '🇮🇳', popular: true },
  { code: 'MLE', city: 'Malé', country: 'Maldives', name: 'Velana International Airport', flag: '🇲🇻', popular: true },
  { code: 'KTM', city: 'Kathmandu', country: 'Nepal', name: 'Tribhuvan International Airport', flag: '🇳🇵', popular: true },
  { code: 'DPS', city: 'Bali (Denpasar)', country: 'Indonesia', name: 'I Gusti Ngurah Rai International Airport', flag: '🇮🇩', popular: true },
  { code: 'HND', city: 'Tokyo (Haneda)', country: 'Japan', name: 'Tokyo Haneda Airport', flag: '🇯🇵', popular: true },
  { code: 'NRT', city: 'Tokyo (Narita)', country: 'Japan', name: 'Narita International Airport', flag: '🇯🇵' },
  { code: 'ICN', city: 'Seoul', country: 'South Korea', name: 'Incheon International Airport', flag: '🇰🇷', popular: true },
  { code: 'PEK', city: 'Beijing', country: 'China', name: 'Beijing Capital International Airport', flag: '🇨🇳', popular: true },
  { code: 'PVG', city: 'Shanghai', country: 'China', name: 'Shanghai Pudong International Airport', flag: '🇨🇳', popular: true },

  // Europe
  { code: 'LHR', city: 'London (Heathrow)', country: 'United Kingdom', name: 'London Heathrow Airport', flag: '🇬🇧', popular: true },
  { code: 'LGW', city: 'London (Gatwick)', country: 'United Kingdom', name: 'London Gatwick Airport', flag: '🇬🇧' },
  { code: 'CDG', city: 'Paris', country: 'France', name: 'Paris Charles de Gaulle Airport', flag: '🇫🇷', popular: true },
  { code: 'FCO', city: 'Rome', country: 'Italy', name: 'Leonardo da Vinci–Fiumicino Airport', flag: '🇮🇹', popular: true },
  { code: 'BCN', city: 'Barcelona', country: 'Spain', name: 'Josep Tarradellas Barcelona-El Prat Airport', flag: '🇪🇸', popular: true },
  { code: 'MAD', city: 'Madrid', country: 'Spain', name: 'Adolfo Suárez Madrid–Barajas Airport', flag: '🇪🇸', popular: true },
  { code: 'FRA', city: 'Frankfurt', country: 'Germany', name: 'Frankfurt Airport', flag: '🇩🇪', popular: true },

  // North America
  { code: 'JFK', city: 'New York (JFK)', country: 'United States', name: 'John F. Kennedy International Airport', flag: '🇺🇸', popular: true },
  { code: 'YYZ', city: 'Toronto', country: 'Canada', name: 'Toronto Pearson International Airport', flag: '🇨🇦', popular: true },

  // Australia & Oceania
  { code: 'SYD', city: 'Sydney', country: 'Australia', name: 'Sydney Kingsford Smith Airport', flag: '🇦🇺', popular: true },
  { code: 'MEL', city: 'Melbourne', country: 'Australia', name: 'Melbourne Airport', flag: '🇦🇺', popular: true },

  // Africa
  { code: 'CAI', city: 'Cairo', country: 'Egypt', name: 'Cairo International Airport', flag: '🇪🇬', popular: true },
  { code: 'JNB', city: 'Johannesburg', country: 'South Africa', name: 'O. R. Tambo International Airport', flag: '🇿🇦', popular: true },
  { code: 'NBO', city: 'Nairobi', country: 'Kenya', name: 'Jomo Kenyatta International Airport', flag: '🇰🇪', popular: true },
];

export const POPULAR_AIRPORTS: Airport[] = [...BANGLADESH_AIRPORTS, ...INTERNATIONAL_AIRPORTS];

// 30+ Comprehensive Popular Destinations from Bangladesh
export const POPULAR_DESTINATIONS_FROM_BD: DestinationCardItem[] = [
  // Middle East
  {
    id: 'dest-dxb',
    city: 'Dubai',
    country: 'United Arab Emirates',
    code: 'DXB',
    airportName: 'Dubai International Airport',
    region: 'Middle East',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '4h 50m direct',
    visaRequirement: '30/60-Day UAE eVisa with Azraq support',
    popularReason: 'Luxury skyline, desert safari, Gold Souk & world-class shopping',
    featured: true,
  },
  {
    id: 'dest-auh',
    city: 'Abu Dhabi',
    country: 'United Arab Emirates',
    code: 'AUH',
    airportName: 'Zayed International Airport',
    region: 'Middle East',
    imageUrl: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '5h 15m direct',
    visaRequirement: 'UAE Tourist eVisa',
    popularReason: 'Sheikh Zayed Grand Mosque, Louvre Abu Dhabi & Yas Island',
  },
  {
    id: 'dest-doh',
    city: 'Doha',
    country: 'Qatar',
    code: 'DOH',
    airportName: 'Hamad International Airport',
    region: 'Middle East',
    imageUrl: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '5h 30m direct',
    visaRequirement: 'Hayya / Qatar Tourist Visa',
    popularReason: 'Souq Waqif, National Museum of Qatar & futuristic architecture',
  },
  {
    id: 'dest-jed',
    city: 'Jeddah',
    country: 'Saudi Arabia',
    code: 'JED',
    airportName: 'King Abdulaziz International Airport',
    region: 'Middle East',
    imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '6h 30m direct',
    visaRequirement: 'Saudi Umrah / Tourist eVisa',
    popularReason: 'Gateway to Makkah, Al-Balad historic district & Red Sea Corniche',
    featured: true,
  },
  {
    id: 'dest-med',
    city: 'Medina',
    country: 'Saudi Arabia',
    code: 'MED',
    airportName: 'Prince Mohammad Bin Abdulaziz Airport',
    region: 'Middle East',
    imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '6h 45m',
    visaRequirement: 'Saudi Umrah / Tourist Visa',
    popularReason: 'Al-Masjid an-Nabawi & holy Islamic heritage sites',
  },
  {
    id: 'dest-ruh',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    code: 'RUH',
    airportName: 'King Khalid International Airport',
    region: 'Middle East',
    imageUrl: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '6h 00m direct',
    visaRequirement: 'Saudi eVisa / Business Visa',
    popularReason: 'Kingdom Centre, historical Diriyah & Riyadh Season festivals',
  },
  {
    id: 'dest-mct',
    city: 'Muscat',
    country: 'Oman',
    code: 'MCT',
    airportName: 'Muscat International Airport',
    region: 'Middle East',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '4h 45m direct',
    visaRequirement: 'Oman Tourist eVisa',
    popularReason: 'Sultan Qaboos Grand Mosque, Mutrah Souq & rugged mountain wadis',
  },
  {
    id: 'dest-ist',
    city: 'Istanbul',
    country: 'Turkey',
    code: 'IST',
    airportName: 'Istanbul Airport',
    region: 'Middle East',
    imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '7h 50m direct',
    visaRequirement: 'Turkish Sticker Visa / eVisa with valid OECD',
    popularReason: 'Bosphorus cruise, Hagia Sophia, Grand Bazaar & Blue Mosque',
    featured: true,
  },

  // Asia
  {
    id: 'dest-bkk',
    city: 'Bangkok',
    country: 'Thailand',
    code: 'BKK',
    airportName: 'Suvarnabhumi Airport',
    region: 'Asia',
    imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '2h 30m direct',
    visaRequirement: 'Thailand Sticker Visa / eVisa',
    popularReason: 'Grand Palace, shopping in Siam & culinary street delights',
    featured: true,
  },
  {
    id: 'dest-kul',
    city: 'Kuala Lumpur',
    country: 'Malaysia',
    code: 'KUL',
    airportName: 'Kuala Lumpur International Airport',
    region: 'Asia',
    imageUrl: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '3h 45m direct',
    visaRequirement: 'Malaysia eVisa (support available)',
    popularReason: 'Petronas Twin Towers, Batu Caves & Genting Highlands',
    featured: true,
  },
  {
    id: 'dest-sin',
    city: 'Singapore',
    country: 'Singapore',
    code: 'SIN',
    airportName: 'Singapore Changi Airport',
    region: 'Asia',
    imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '3h 55m direct',
    visaRequirement: 'Singapore eVisa with Azraq submission',
    popularReason: 'Marina Bay Sands, Gardens by the Bay & Sentosa Island',
    featured: true,
  },
  {
    id: 'dest-mle',
    city: 'Malé',
    country: 'Maldives',
    code: 'MLE',
    airportName: 'Velana International Airport',
    region: 'Asia',
    imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '4h 15m direct',
    visaRequirement: 'Free 30-day Visa on Arrival for BD citizens',
    popularReason: 'Crystal clear turquoise atolls, overwater villas & coral reefs',
    featured: true,
  },
  {
    id: 'dest-del',
    city: 'Delhi',
    country: 'India',
    code: 'DEL',
    airportName: 'Indira Gandhi International Airport',
    region: 'Asia',
    imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '2h 40m direct',
    visaRequirement: 'Indian Tourist Visa / Medical Visa',
    popularReason: 'Red Fort, Qutub Minar, Chandni Chowk & Taj Mahal day trip',
  },
  {
    id: 'dest-ccu',
    city: 'Kolkata',
    country: 'India',
    code: 'CCU',
    airportName: 'Netaji Subhash Chandra Bose International Airport',
    region: 'Asia',
    imageUrl: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '45m direct',
    visaRequirement: 'Indian Tourist Visa',
    popularReason: 'Victoria Memorial, Park Street shopping & Bengali culture',
  },
  {
    id: 'dest-bom',
    city: 'Mumbai',
    country: 'India',
    code: 'BOM',
    airportName: 'Chhatrapati Shivaji Maharaj International Airport',
    region: 'Asia',
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '3h 30m direct',
    visaRequirement: 'Indian Tourist Visa',
    popularReason: 'Gateway of India, Marine Drive & Bollywood entertainment',
  },
  {
    id: 'dest-maa',
    city: 'Chennai',
    country: 'India',
    code: 'MAA',
    airportName: 'Chennai International Airport',
    region: 'Asia',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '2h 50m direct',
    visaRequirement: 'Indian Tourist / Medical Visa',
    popularReason: 'Apollo & medical tourism, Marina Beach & Dravidian temples',
  },
  {
    id: 'dest-blr',
    city: 'Bangalore',
    country: 'India',
    code: 'BLR',
    airportName: 'Kempegowda International Airport',
    region: 'Asia',
    imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '3h 10m',
    visaRequirement: 'Indian Tourist Visa',
    popularReason: 'Silicon Valley of India, Lalbagh Botanical Garden & pleasant climate',
  },
  {
    id: 'dest-hnd',
    city: 'Tokyo',
    country: 'Japan',
    code: 'HND',
    airportName: 'Tokyo Haneda Airport',
    region: 'Asia',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '7h 10m direct',
    visaRequirement: 'Japan Tourist Visa with Azraq document checklist',
    popularReason: 'Shibuya Crossing, Mount Fuji views, cherry blossoms & technology',
  },
  {
    id: 'dest-icn',
    city: 'Seoul',
    country: 'South Korea',
    code: 'ICN',
    airportName: 'Incheon International Airport',
    region: 'Asia',
    imageUrl: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '6h 40m direct',
    visaRequirement: 'South Korea Tourist Visa',
    popularReason: 'Gyeongbokgung Palace, Myeongdong shopping & K-Culture',
  },
  {
    id: 'dest-pek',
    city: 'Beijing',
    country: 'China',
    code: 'PEK',
    airportName: 'Beijing Capital International Airport',
    region: 'Asia',
    imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '5h 30m direct',
    visaRequirement: 'Chinese Tourist Visa (L Visa)',
    popularReason: 'Great Wall of China, Forbidden City & Temple of Heaven',
  },
  {
    id: 'dest-pvg',
    city: 'Shanghai',
    country: 'China',
    code: 'PVG',
    airportName: 'Shanghai Pudong International Airport',
    region: 'Asia',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '5h 15m direct',
    visaRequirement: 'Chinese Tourist Visa',
    popularReason: 'The Bund, Oriental Pearl Tower & Yu Garden',
  },

  // Europe
  {
    id: 'dest-lhr',
    city: 'London',
    country: 'United Kingdom',
    code: 'LHR',
    airportName: 'London Heathrow Airport',
    region: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '11h 15m direct',
    visaRequirement: 'UK Standard Visitor Visa (Assistance available)',
    popularReason: 'Big Ben, London Eye, British Museum & Tower Bridge',
    featured: true,
  },
  {
    id: 'dest-cdg',
    city: 'Paris',
    country: 'France',
    code: 'CDG',
    airportName: 'Paris Charles de Gaulle Airport',
    region: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '11h 45m',
    visaRequirement: 'Schengen Visa (France)',
    popularReason: 'Eiffel Tower, Louvre Museum & Seine River romantic cruises',
  },
  {
    id: 'dest-fco',
    city: 'Rome',
    country: 'Italy',
    code: 'FCO',
    airportName: 'Leonardo da Vinci–Fiumicino Airport',
    region: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '11h 30m',
    visaRequirement: 'Schengen Visa (Italy)',
    popularReason: 'Colosseum, Vatican City, Trevi Fountain & Roman history',
  },
  {
    id: 'dest-bcn',
    city: 'Barcelona',
    country: 'Spain',
    code: 'BCN',
    airportName: 'Josep Tarradellas Barcelona-El Prat Airport',
    region: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '12h 10m',
    visaRequirement: 'Schengen Visa (Spain)',
    popularReason: 'Sagrada Família, Park Güell & Mediterranean coastline',
  },
  {
    id: 'dest-mad',
    city: 'Madrid',
    country: 'Spain',
    code: 'MAD',
    airportName: 'Adolfo Suárez Madrid–Barajas Airport',
    region: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '12h 40m',
    visaRequirement: 'Schengen Visa (Spain)',
    popularReason: 'Royal Palace of Madrid, Prado Museum & Gran Vía',
  },

  // North America
  {
    id: 'dest-jfk',
    city: 'New York',
    country: 'United States',
    code: 'JFK',
    airportName: 'John F. Kennedy International Airport',
    region: 'North America',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '17h 30m with 1 stop',
    visaRequirement: 'US B1/B2 Tourist Visa',
    popularReason: 'Times Square, Statue of Liberty, Central Park & Empire State',
  },
  {
    id: 'dest-yyz',
    city: 'Toronto',
    country: 'Canada',
    code: 'YYZ',
    airportName: 'Toronto Pearson International Airport',
    region: 'North America',
    imageUrl: 'https://images.unsplash.com/photo-1507992781348-310259076fe0?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '18h 00m with 1 stop',
    visaRequirement: 'Canada Visitor Visa (V-1)',
    popularReason: 'CN Tower, Niagara Falls day trip & multicultural vibe',
  },

  // Australia & Oceania
  {
    id: 'dest-syd',
    city: 'Sydney',
    country: 'Australia',
    code: 'SYD',
    airportName: 'Sydney Kingsford Smith Airport',
    region: 'Australia & Oceania',
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '13h 20m with 1 stop',
    visaRequirement: 'Australia Visitor Visa (Subclass 600)',
    popularReason: 'Sydney Opera House, Harbour Bridge & Bondi Beach',
  },
  {
    id: 'dest-mel',
    city: 'Melbourne',
    country: 'Australia',
    code: 'MEL',
    airportName: 'Melbourne Airport',
    region: 'Australia & Oceania',
    imageUrl: 'https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '13h 45m with 1 stop',
    visaRequirement: 'Australia Visitor Visa (Subclass 600)',
    popularReason: 'Great Ocean Road, Melbourne laneway coffee & arts culture',
  },

  // Africa
  {
    id: 'dest-cai',
    city: 'Cairo',
    country: 'Egypt',
    code: 'CAI',
    airportName: 'Cairo International Airport',
    region: 'Africa',
    imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '8h 30m with 1 stop',
    visaRequirement: 'Egypt Tourist Visa',
    popularReason: 'Pyramids of Giza, Sphinx & Nile River cruises',
  },
  {
    id: 'dest-jnb',
    city: 'Johannesburg',
    country: 'South Africa',
    code: 'JNB',
    airportName: 'O. R. Tambo International Airport',
    region: 'Africa',
    imageUrl: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '14h 00m with 1 stop',
    visaRequirement: 'South Africa Tourist Visa',
    popularReason: 'Kruger Safari gateway, Gold Reef City & Nelson Mandela Square',
  },
  {
    id: 'dest-nbo',
    city: 'Nairobi',
    country: 'Kenya',
    code: 'NBO',
    airportName: 'Jomo Kenyatta International Airport',
    region: 'Africa',
    imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80',
    flightDurationFromDAC: '11h 15m with 1 stop',
    visaRequirement: 'Kenya Electronic Travel Authorisation (eTA)',
    popularReason: 'Maasai Mara Great Migration, Giraffe Centre & safari expeditions',
  },
];

// Popular Route Guides with helpful facts for Bangladeshi travelers
export const POPULAR_ROUTE_GUIDES: RouteGuideItem[] = [
  {
    slug: 'dhaka-to-kuala-lumpur',
    originCode: 'DAC',
    originCity: 'Dhaka',
    destinationCode: 'KUL',
    destinationCity: 'Kuala Lumpur',
    destinationCountry: 'Malaysia',
    heroImage: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=85',
    averageFlightTime: '3h 45m (Non-stop)',
    popularAirlines: ['Biman Bangladesh', 'Malaysia Airlines', 'AirAsia', 'US-Bangla'],
    visaSummary: 'Malaysia eVisa required. Azraq desk provides verification in 2-3 working days.',
    bestTimeToFly: 'Year-round; November to February offers ideal weather for sightseeing.',
    travelTips: 'KLIA Express takes 28 mins to KL Sentral. Keep passport with at least 6 months validity.',
  },
  {
    slug: 'dhaka-to-dubai',
    originCode: 'DAC',
    originCity: 'Dhaka',
    destinationCode: 'DXB',
    destinationCity: 'Dubai',
    destinationCountry: 'United Arab Emirates',
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
    averageFlightTime: '4h 50m (Non-stop)',
    popularAirlines: ['Emirates', 'Flydubai', 'Biman Bangladesh', 'US-Bangla'],
    visaSummary: 'UAE 30/60-day tourist visa processed within 24-48 hours with hotel booking.',
    bestTimeToFly: 'October to April for outdoor desert safaris, beach clubs, and theme parks.',
    travelTips: 'Dubai Metro connects DXB Airport Terminal 1 & 3 directly to Downtown Dubai.',
  },
  {
    slug: 'dhaka-to-bangkok',
    originCode: 'DAC',
    originCity: 'Dhaka',
    destinationCode: 'BKK',
    destinationCity: 'Bangkok',
    destinationCountry: 'Thailand',
    heroImage: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=85',
    averageFlightTime: '2h 30m (Non-stop)',
    popularAirlines: ['Thai Airways', 'Biman Bangladesh', 'US-Bangla', 'Thai Lion Air'],
    visaSummary: 'Thailand tourist visa (60 days) or e-Visa applied through VFS Dhaka.',
    bestTimeToFly: 'November to February (cool & dry season for island hopping & city shopping).',
    travelTips: 'Airport Rail Link connects Suvarnabhumi Airport to Phaya Thai BTS in 26 minutes.',
  },
  {
    slug: 'dhaka-to-singapore',
    originCode: 'DAC',
    originCity: 'Dhaka',
    destinationCode: 'SIN',
    destinationCity: 'Singapore',
    destinationCountry: 'Singapore',
    heroImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=85',
    averageFlightTime: '3h 55m (Non-stop)',
    popularAirlines: ['Singapore Airlines', 'Biman Bangladesh', 'US-Bangla'],
    visaSummary: 'Singapore eVisa submitted through authorized agencies like Azraq Travel.',
    bestTimeToFly: 'Year-round destination with lively events, Great Singapore Sale & festivals.',
    travelTips: 'Changi MRT connects seamlessly to city center. Grab/EZ-Link cards widely accepted.',
  },
  {
    slug: 'dhaka-to-london',
    originCode: 'DAC',
    originCity: 'Dhaka',
    destinationCode: 'LHR',
    destinationCity: 'London',
    destinationCountry: 'United Kingdom',
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=85',
    averageFlightTime: '11h 15m (Direct) / 13h+ (1 stop via Gulf)',
    popularAirlines: ['Biman Bangladesh', 'Qatar Airways', 'Emirates', 'Saudia', 'Gulf Air'],
    visaSummary: 'UK Standard Visitor Visa (apply 2-3 months in advance via VFS Global).',
    bestTimeToFly: 'May to September for long daylight hours and pleasant warm weather.',
    travelTips: 'Elizabeth Line or Heathrow Express provides fastest transit into central London.',
  },
  {
    slug: 'dhaka-to-jeddah',
    originCode: 'DAC',
    originCity: 'Dhaka',
    destinationCode: 'JED',
    destinationCity: 'Jeddah',
    destinationCountry: 'Saudi Arabia',
    heroImage: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=85',
    averageFlightTime: '6h 30m (Non-stop)',
    popularAirlines: ['Saudia', 'Biman Bangladesh', 'Flynas', 'Qatar Airways', 'Gulf Air'],
    visaSummary: 'Saudi Umrah Visa, Tourist eVisa, or Stopover Visa through Nusuk.',
    bestTimeToFly: 'November to March for mild temperatures and Umrah pilgrimages.',
    travelTips: 'Haramain High Speed Railway links JED Airport to Makkah in 54 minutes.',
  },
];

export interface AviasalesSearchParams {
  origin?: string;
  destination?: string;
  departDate?: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  infants?: number;
  cabin?: 'Economy' | 'Premium Economy' | 'Business' | 'First';
  tripType?: 'round' | 'oneway' | 'multi';
  source?: string;
}

/**
 * Builds official Aviasales affiliate search deep links.
 * Preserves the official Aviasales / Travelpayouts affiliate parameters (params=DAC1 / marker=563001)
 */
export function buildAviasalesSearchUrl(params: AviasalesSearchParams = {}): string {
  const originCode = (params.origin || 'DAC').toUpperCase();
  const destCode = (params.destination || 'BKK').toUpperCase();
  const adults = params.adults && params.adults > 0 ? params.adults : 1;
  const children = params.children || 0;
  const infants = params.infants || 0;

  // Format date helper: YYYY-MM-DD -> DDMM
  const formatDateForAviasales = (dateStr?: string): string => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}${parts[1]}`; // DDMM
      }
    } catch {
      // ignore
    }
    return '';
  };

  const cabinLetter =
    params.cabin === 'Business' ? 'c' : params.cabin === 'First' ? 'f' : params.cabin === 'Premium Economy' ? 'w' : 'y';

  const depFormatted = formatDateForAviasales(params.departDate);
  const retFormatted = params.tripType === 'round' ? formatDateForAviasales(params.returnDate) : '';

  // Standard Travelpayouts affiliate gateway for Aviasales
  const affiliateBase = 'https://aviasales.tp.st/72ntufDx';

  // Construct Aviasales direct search parameter path if dates are valid
  if (depFormatted) {
    const searchPath = `${originCode}${depFormatted}${destCode}${retFormatted}${adults}${children}${infants}${cabinLetter}`;
    return `https://www.aviasales.com/search/${searchPath}?params=DAC1`;
  }

  // Fallback with origin & destination query parameters
  return `${affiliateBase}?origin=${originCode}&destination=${destCode}`;
}

/**
 * Anonymous event tracker for flight searches and affiliate click attribution
 */
export function trackFlightSearchEvent(
  eventName: 'flight_search_started' | 'origin_selected' | 'destination_selected' | 'search_completed' | 'destination_card_clicked' | 'affiliate_deal_clicked',
  payload: Record<string, any>
) {
  try {
    const logData = {
      event: eventName,
      timestamp: new Date().toISOString(),
      ...payload,
    };
    // Log to console for development audit
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('azraq_flight_analytics', { detail: logData }));
    }
  } catch {
    // ignore
  }
}
