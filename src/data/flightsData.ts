export interface Airport {
  code: string;
  city: string;
  country: string;
  name: string;
  flag?: string;
  popular?: boolean;
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

export const POPULAR_AIRPORTS: Airport[] = [
  { code: 'DAC', city: 'Dhaka', country: 'Bangladesh', name: 'Hazrat Shahjalal International Airport', flag: '🇧🇩', popular: true },
  { code: 'CGP', city: 'Chittagong', country: 'Bangladesh', name: 'Shah Amanat International Airport', flag: '🇧🇩', popular: true },
  { code: 'ZYL', city: 'Sylhet', country: 'Bangladesh', name: 'Osmani International Airport', flag: '🇧🇩', popular: true },
  { code: 'CXB', city: "Cox's Bazar", country: 'Bangladesh', name: "Cox's Bazar Airport", flag: '🇧🇩', popular: true },
  { code: 'BKK', city: 'Bangkok', country: 'Thailand', name: 'Suvarnabhumi Airport', flag: '🇹🇭', popular: true },
  { code: 'DMK', city: 'Bangkok (Don Mueang)', country: 'Thailand', name: 'Don Mueang International Airport', flag: '🇹🇭' },
  { code: 'KUL', city: 'Kuala Lumpur', country: 'Malaysia', name: 'Kuala Lumpur International Airport', flag: '🇲🇾', popular: true },
  { code: 'DXB', city: 'Dubai', country: 'United Arab Emirates', name: 'Dubai International Airport', flag: '🇦🇪', popular: true },
  { code: 'SHJ', city: 'Sharjah', country: 'United Arab Emirates', name: 'Sharjah International Airport', flag: '🇦🇪' },
  { code: 'SIN', city: 'Singapore', country: 'Singapore', name: 'Singapore Changi Airport', flag: '🇸🇬', popular: true },
  { code: 'KTM', city: 'Kathmandu', country: 'Nepal', name: 'Tribhuvan International Airport', flag: '🇳🇵', popular: true },
  { code: 'MLE', city: 'Malé', country: 'Maldives', name: 'Velana International Airport', flag: '🇲🇻', popular: true },
  { code: 'DPS', city: 'Bali (Denpasar)', country: 'Indonesia', name: 'I Gusti Ngurah Rai International Airport', flag: '🇮🇩', popular: true },
  { code: 'IST', city: 'Istanbul', country: 'Turkey', name: 'Istanbul Airport', flag: '🇹🇷', popular: true },
  { code: 'JED', city: 'Jeddah', country: 'Saudi Arabia', name: 'King Abdulaziz International Airport', flag: '🇸🇦', popular: true },
  { code: 'CCU', city: 'Kolkata', country: 'India', name: 'Netaji Subhash Chandra Bose International Airport', flag: '🇮🇳' },
  { code: 'DEL', city: 'New Delhi', country: 'India', name: 'Indira Gandhi International Airport', flag: '🇮🇳' },
  { code: 'LHR', city: 'London', country: 'United Kingdom', name: 'London Heathrow Airport', flag: '🇬🇧', popular: true },
];

export const AIRLINES: Airline[] = [
  { code: 'BG', name: 'Biman Bangladesh Airlines', logo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80', rating: 4.2 },
  { code: 'BS', name: 'US-Bangla Airlines', logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=120&q=80', rating: 4.3 },
  { code: 'TG', name: 'Thai Airways', logo: 'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=120&q=80', rating: 4.7 },
  { code: 'MH', name: 'Malaysia Airlines', logo: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=120&q=80', rating: 4.6 },
  { code: 'EK', name: 'Emirates', logo: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=120&q=80', rating: 4.9 },
  { code: 'FZ', name: 'Flydubai', logo: 'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=120&q=80', rating: 4.1 },
  { code: 'SQ', name: 'Singapore Airlines', logo: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=120&q=80', rating: 4.9 },
  { code: 'QR', name: 'Qatar Airways', logo: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=120&q=80', rating: 4.9 },
  { code: 'AK', name: 'AirAsia', logo: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=120&q=80', rating: 4.0 },
  { code: 'TK', name: 'Turkish Airlines', logo: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=120&q=80', rating: 4.8 },
  { code: 'SV', name: 'Saudia', logo: 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=120&q=80', rating: 4.4 },
];

export const POPULAR_FLIGHT_SHORTCUTS = [
  { origin: 'DAC', destination: 'BKK', name: 'Bangkok', country: 'Thailand', estPrice: 'BDT 26,500', time: '2h 30m', airlines: 'Biman / Thai Airways', tag: 'Most Popular' },
  { origin: 'DAC', destination: 'KUL', name: 'Kuala Lumpur', country: 'Malaysia', estPrice: 'BDT 32,000', time: '3h 45m', airlines: 'Malaysia Airlines / AirAsia', tag: 'Fast Booking' },
  { origin: 'DAC', destination: 'DXB', name: 'Dubai', country: 'UAE', estPrice: 'BDT 48,000', time: '4h 50m', airlines: 'Emirates / Flydubai', tag: 'Luxury Gateway' },
  { origin: 'DAC', destination: 'SIN', name: 'Singapore', country: 'Singapore', estPrice: 'BDT 39,500', time: '3h 55m', airlines: 'Singapore Airlines / US-Bangla', tag: 'Urban Transit' },
  { origin: 'DAC', destination: 'KTM', name: 'Kathmandu', country: 'Nepal', estPrice: 'BDT 21,500', time: '1h 20m', airlines: 'Biman Bangladesh', tag: 'Short Haul' },
  { origin: 'DAC', destination: 'MLE', name: 'Malé', country: 'Maldives', estPrice: 'BDT 43,000', time: '4h 15m', airlines: 'US-Bangla / Maldivian', tag: 'Island Honeymoon' },
];

/**
 * Generate realistic flight results for any searched route
 */
export function generateSampleFlights(
  fromCode: string = 'DAC',
  toCode: string = 'BKK',
  depDate: string = '2026-11-15',
  retDate?: string,
  tripType: 'round' | 'oneway' | 'multi' = 'round',
  cabin: 'Economy' | 'Premium Economy' | 'Business' | 'First' = 'Economy',
  paxCount: number = 1
): FlightOffer[] {
  const originAirport = POPULAR_AIRPORTS.find((a) => a.code === fromCode) || {
    code: fromCode,
    city: fromCode,
    country: 'International',
    name: `${fromCode} Airport`,
  };
  const destAirport = POPULAR_AIRPORTS.find((a) => a.code === toCode) || {
    code: toCode,
    city: toCode,
    country: 'International',
    name: `${toCode} Airport`,
  };

  // Realistic price multipliers based on route distance and cabin class
  const cabinMultiplier =
    cabin === 'Business' ? 3.4 : cabin === 'Premium Economy' ? 1.7 : cabin === 'First' ? 6.0 : 1.0;

  // Base route prices from Dhaka in BDT
  const routeBaseRates: Record<string, number> = {
    BKK: 26500,
    KUL: 32000,
    DXB: 48000,
    SIN: 39500,
    KTM: 21500,
    MLE: 43000,
    DPS: 49000,
    IST: 68000,
    JED: 62000,
    LHR: 94000,
    CCU: 11000,
    DEL: 18500,
  };

  const basePrice = (routeBaseRates[toCode] || 35000) * (tripType === 'round' ? 1.85 : 1.0);

  const offers: FlightOffer[] = [
    {
      id: `FL-${fromCode}-${toCode}-01`,
      airlineCode: toCode === 'BKK' ? 'TG' : toCode === 'DXB' ? 'EK' : toCode === 'SIN' ? 'SQ' : 'BG',
      airlineName: toCode === 'BKK' ? 'Thai Airways' : toCode === 'DXB' ? 'Emirates' : toCode === 'SIN' ? 'Singapore Airlines' : 'Biman Bangladesh',
      airlineLogo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80',
      flightNumber: toCode === 'BKK' ? 'TG 322' : toCode === 'DXB' ? 'EK 583' : toCode === 'SIN' ? 'SQ 447' : 'BG 088',
      aircraft: 'Boeing 787-9 Dreamliner',
      tripType,
      origin: originAirport,
      destination: destAirport,
      departureDate: depDate,
      returnDate: retDate,
      departureTime: '09:15',
      arrivalTime: '12:45',
      duration: '2h 30m',
      stops: 0,
      cabinClass: cabin,
      priceBDT: Math.round(basePrice * 1.08 * cabinMultiplier * paxCount),
      currency: 'BDT',
      refundable: true,
      baggageAllowance: { cabin: '7 kg', checked: cabin === 'Business' ? '40 kg' : '30 kg' },
      inFlightAmenities: ['Complimentary Halal Meal', 'In-Seat USB Power', 'Wi-Fi Available', 'Seatback Entertainment'],
      partnerName: 'Travelpayouts Partner',
      partnerDeepLink: `https://flights.travelpayouts.com/search?origin=${fromCode}&destination=${toCode}&marker=563001`,
      returnSegment:
        tripType === 'round' && retDate
          ? {
              flightNumber: toCode === 'BKK' ? 'TG 321' : 'BG 089',
              departureTime: '17:30',
              arrivalTime: '19:10',
              duration: '2h 40m',
              stops: 0,
              departureDate: retDate,
            }
          : undefined,
      isRecommended: true,
      isFastest: true,
      seatsRemaining: 4,
    },
    {
      id: `FL-${fromCode}-${toCode}-02`,
      airlineCode: 'BG',
      airlineName: 'Biman Bangladesh Airlines',
      airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=120&q=80',
      flightNumber: 'BG 188',
      aircraft: 'Boeing 737-800',
      tripType,
      origin: originAirport,
      destination: destAirport,
      departureDate: depDate,
      returnDate: retDate,
      departureTime: '14:20',
      arrivalTime: '17:55',
      duration: '2h 35m',
      stops: 0,
      cabinClass: cabin,
      priceBDT: Math.round(basePrice * 0.95 * cabinMultiplier * paxCount),
      currency: 'BDT',
      refundable: false,
      baggageAllowance: { cabin: '7 kg', checked: '25 kg' },
      inFlightAmenities: ['Hot Meal Included', 'Bengali Speaking Crew', 'Free Check-in Baggage'],
      partnerName: 'Travelpayouts Partner',
      partnerDeepLink: `https://flights.travelpayouts.com/search?origin=${fromCode}&destination=${toCode}&marker=563001`,
      returnSegment:
        tripType === 'round' && retDate
          ? {
              flightNumber: 'BG 189',
              departureTime: '19:00',
              arrivalTime: '20:45',
              duration: '2h 45m',
              stops: 0,
              departureDate: retDate,
            }
          : undefined,
      isBestValue: true,
      seatsRemaining: 7,
    },
    {
      id: `FL-${fromCode}-${toCode}-03`,
      airlineCode: 'BS',
      airlineName: 'US-Bangla Airlines',
      airlineLogo: 'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=120&q=80',
      flightNumber: 'BS 217',
      aircraft: 'Airbus A330-300',
      tripType,
      origin: originAirport,
      destination: destAirport,
      departureDate: depDate,
      returnDate: retDate,
      departureTime: '06:30',
      arrivalTime: '10:05',
      duration: '2h 35m',
      stops: 0,
      cabinClass: cabin,
      priceBDT: Math.round(basePrice * 0.98 * cabinMultiplier * paxCount),
      currency: 'BDT',
      refundable: true,
      baggageAllowance: { cabin: '7 kg', checked: '30 kg' },
      inFlightAmenities: ['Breakfast / Snack', 'Extra Legroom Available', 'Direct Gate Boarding'],
      partnerName: 'Travelpayouts Partner',
      partnerDeepLink: `https://flights.travelpayouts.com/search?origin=${fromCode}&destination=${toCode}&marker=563001`,
      returnSegment:
        tripType === 'round' && retDate
          ? {
              flightNumber: 'BS 218',
              departureTime: '11:20',
              arrivalTime: '13:00',
              duration: '2h 40m',
              stops: 0,
              departureDate: retDate,
            }
          : undefined,
      seatsRemaining: 9,
    },
    {
      id: `FL-${fromCode}-${toCode}-04`,
      airlineCode: toCode === 'DXB' ? 'FZ' : toCode === 'KUL' ? 'AK' : 'MH',
      airlineName: toCode === 'DXB' ? 'Flydubai' : toCode === 'KUL' ? 'AirAsia' : 'Malaysia Airlines',
      airlineLogo: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=120&q=80',
      flightNumber: toCode === 'DXB' ? 'FZ 584' : 'MH 197',
      aircraft: 'Boeing 737 MAX 8',
      tripType,
      origin: originAirport,
      destination: destAirport,
      departureDate: depDate,
      returnDate: retDate,
      departureTime: '23:15',
      arrivalTime: '05:30 (+1)',
      duration: '5h 15m',
      stops: 1,
      stopAirports: ['KUL'],
      layoverDuration: '1h 35m',
      cabinClass: cabin,
      priceBDT: Math.round(basePrice * 0.88 * cabinMultiplier * paxCount),
      currency: 'BDT',
      refundable: false,
      baggageAllowance: { cabin: '7 kg', checked: '20 kg' },
      inFlightAmenities: ['USB Charger', 'Beverages for Purchase', 'Online Check-in'],
      partnerName: 'Travelpayouts Partner',
      partnerDeepLink: `https://flights.travelpayouts.com/search?origin=${fromCode}&destination=${toCode}&marker=563001`,
      returnSegment:
        tripType === 'round' && retDate
          ? {
              flightNumber: 'MH 196',
              departureTime: '08:45',
              arrivalTime: '14:15',
              duration: '5h 30m',
              stops: 1,
              stopAirports: ['KUL'],
              departureDate: retDate,
            }
          : undefined,
      seatsRemaining: 12,
    },
    {
      id: `FL-${fromCode}-${toCode}-05`,
      airlineCode: 'QR',
      airlineName: 'Qatar Airways',
      airlineLogo: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=120&q=80',
      flightNumber: 'QR 641',
      aircraft: 'Airbus A350-1000',
      tripType,
      origin: originAirport,
      destination: destAirport,
      departureDate: depDate,
      returnDate: retDate,
      departureTime: '19:40',
      arrivalTime: '01:20 (+1)',
      duration: '4h 40m',
      stops: 1,
      stopAirports: ['DOH'],
      layoverDuration: '2h 10m',
      cabinClass: cabin,
      priceBDT: Math.round(basePrice * 1.25 * cabinMultiplier * paxCount),
      currency: 'BDT',
      refundable: true,
      baggageAllowance: { cabin: '10 kg', checked: '35 kg' },
      inFlightAmenities: ['Oryx One 4,000+ Movies', 'Gourmet Dining', 'Super Wi-Fi', 'World Class Service'],
      partnerName: 'Travelpayouts Partner',
      partnerDeepLink: `https://flights.travelpayouts.com/search?origin=${fromCode}&destination=${toCode}&marker=563001`,
      returnSegment:
        tripType === 'round' && retDate
          ? {
              flightNumber: 'QR 640',
              departureTime: '13:00',
              arrivalTime: '22:15',
              duration: '6h 15m',
              stops: 1,
              stopAirports: ['DOH'],
              departureDate: retDate,
            }
          : undefined,
      seatsRemaining: 5,
    },
  ];

  return offers;
}
