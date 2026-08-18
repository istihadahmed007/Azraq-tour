/**
 * Comprehensive Airline Directory and Logo Resolver for Azraq Travel.
 * Provides high-resolution official logos, airline metadata, and reliable fallback CDNs
 * for Bangladeshi domestic carriers and all major international airlines.
 */

export interface AirlineMeta {
  code: string;
  name: string;
  country: string;
  hub: string;
  brandColor: string;
  logoUrl: string;
}

export const AIRLINE_DIRECTORY: Record<string, AirlineMeta> = {
  // --- BANGLADESH DOMESTIC & FLAG CARRIERS ---
  BG: {
    code: 'BG',
    name: 'Biman Bangladesh Airlines',
    country: 'Bangladesh',
    hub: 'DAC',
    brandColor: '#006A4E',
    logoUrl: 'https://pics.avs.io/al_square/64/64/BG.png',
  },
  BS: {
    code: 'BS',
    name: 'US-Bangla Airlines',
    country: 'Bangladesh',
    hub: 'DAC',
    brandColor: '#00539B',
    logoUrl: 'https://pics.avs.io/al_square/64/64/BS.png',
  },
  VQ: {
    code: 'VQ',
    name: 'Novoair',
    country: 'Bangladesh',
    hub: 'DAC',
    brandColor: '#D9232D',
    logoUrl: 'https://pics.avs.io/al_square/64/64/VQ.png',
  },
  '2A': {
    code: '2A',
    name: 'Air Astra',
    country: 'Bangladesh',
    hub: 'DAC',
    brandColor: '#003366',
    logoUrl: 'https://pics.avs.io/al_square/64/64/2A.png',
  },

  // --- MIDDLE EAST CARRIERS ---
  EK: {
    code: 'EK',
    name: 'Emirates',
    country: 'United Arab Emirates',
    hub: 'DXB',
    brandColor: '#D71921',
    logoUrl: 'https://pics.avs.io/al_square/64/64/EK.png',
  },
  QR: {
    code: 'QR',
    name: 'Qatar Airways',
    country: 'Qatar',
    hub: 'DOH',
    brandColor: '#5C0632',
    logoUrl: 'https://pics.avs.io/al_square/64/64/QR.png',
  },
  SV: {
    code: 'SV',
    name: 'Saudia',
    country: 'Saudi Arabia',
    hub: 'JED',
    brandColor: '#0B4D3C',
    logoUrl: 'https://pics.avs.io/al_square/64/64/SV.png',
  },
  FZ: {
    code: 'FZ',
    name: 'Flydubai',
    country: 'United Arab Emirates',
    hub: 'DXB',
    brandColor: '#F58220',
    logoUrl: 'https://pics.avs.io/al_square/64/64/FZ.png',
  },
  G9: {
    code: 'G9',
    name: 'Air Arabia',
    country: 'United Arab Emirates',
    hub: 'SHJ',
    brandColor: '#E21A22',
    logoUrl: 'https://pics.avs.io/al_square/64/64/G9.png',
  },
  EY: {
    code: 'EY',
    name: 'Etihad Airways',
    country: 'United Arab Emirates',
    hub: 'AUH',
    brandColor: '#BD8B31',
    logoUrl: 'https://pics.avs.io/al_square/64/64/EY.png',
  },
  GF: {
    code: 'GF',
    name: 'Gulf Air',
    country: 'Bahrain',
    hub: 'BAH',
    brandColor: '#9C7A3C',
    logoUrl: 'https://pics.avs.io/al_square/64/64/GF.png',
  },
  KU: {
    code: 'KU',
    name: 'Kuwait Airways',
    country: 'Kuwait',
    hub: 'KWI',
    brandColor: '#004B87',
    logoUrl: 'https://pics.avs.io/al_square/64/64/KU.png',
  },
  WY: {
    code: 'WY',
    name: 'Oman Air',
    country: 'Oman',
    hub: 'MCT',
    brandColor: '#A6192E',
    logoUrl: 'https://pics.avs.io/al_square/64/64/WY.png',
  },
  J9: {
    code: 'J9',
    name: 'Jazeera Airways',
    country: 'Kuwait',
    hub: 'KWI',
    brandColor: '#0083CA',
    logoUrl: 'https://pics.avs.io/al_square/64/64/J9.png',
  },
  XY: {
    code: 'XY',
    name: 'Flynas',
    country: 'Saudi Arabia',
    hub: 'RUH',
    brandColor: '#70BF44',
    logoUrl: 'https://pics.avs.io/al_square/64/64/XY.png',
  },

  // --- SOUTHEAST & EAST ASIA ---
  SQ: {
    code: 'SQ',
    name: 'Singapore Airlines',
    country: 'Singapore',
    hub: 'SIN',
    brandColor: '#00266B',
    logoUrl: 'https://pics.avs.io/al_square/64/64/SQ.png',
  },
  TG: {
    code: 'TG',
    name: 'Thai Airways',
    country: 'Thailand',
    hub: 'BKK',
    brandColor: '#49176D',
    logoUrl: 'https://pics.avs.io/al_square/64/64/TG.png',
  },
  MH: {
    code: 'MH',
    name: 'Malaysia Airlines',
    country: 'Malaysia',
    hub: 'KUL',
    brandColor: '#0C2340',
    logoUrl: 'https://pics.avs.io/al_square/64/64/MH.png',
  },
  AK: {
    code: 'AK',
    name: 'AirAsia',
    country: 'Malaysia',
    hub: 'KUL',
    brandColor: '#FF0000',
    logoUrl: 'https://pics.avs.io/al_square/64/64/AK.png',
  },
  FD: {
    code: 'FD',
    name: 'Thai AirAsia',
    country: 'Thailand',
    hub: 'DMK',
    brandColor: '#FF0000',
    logoUrl: 'https://pics.avs.io/al_square/64/64/FD.png',
  },
  OD: {
    code: 'OD',
    name: 'Batik Air Malaysia',
    country: 'Malaysia',
    hub: 'KUL',
    brandColor: '#B31B1B',
    logoUrl: 'https://pics.avs.io/al_square/64/64/OD.png',
  },
  SL: {
    code: 'SL',
    name: 'Thai Lion Air',
    country: 'Thailand',
    hub: 'DMK',
    brandColor: '#E61E28',
    logoUrl: 'https://pics.avs.io/al_square/64/64/SL.png',
  },
  CX: {
    code: 'CX',
    name: 'Cathay Pacific',
    country: 'Hong Kong',
    hub: 'HKG',
    brandColor: '#006564',
    logoUrl: 'https://pics.avs.io/al_square/64/64/CX.png',
  },
  H1: {
    code: 'H1',
    name: 'Hahn Air',
    country: 'Germany',
    hub: 'FRA',
    brandColor: '#003366',
    logoUrl: 'https://pics.avs.io/al_square/64/64/H1.png',
  },
  JL: {
    code: 'JL',
    name: 'Japan Airlines',
    country: 'Japan',
    hub: 'HND',
    brandColor: '#CC0000',
    logoUrl: 'https://pics.avs.io/al_square/64/64/JL.png',
  },
  NH: {
    code: 'NH',
    name: 'All Nippon Airways (ANA)',
    country: 'Japan',
    hub: 'HND',
    brandColor: '#002E6D',
    logoUrl: 'https://pics.avs.io/al_square/64/64/NH.png',
  },
  KE: {
    code: 'KE',
    name: 'Korean Air',
    country: 'South Korea',
    hub: 'ICN',
    brandColor: '#006699',
    logoUrl: 'https://pics.avs.io/al_square/64/64/KE.png',
  },
  OZ: {
    code: 'OZ',
    name: 'Asiana Airlines',
    country: 'South Korea',
    hub: 'ICN',
    brandColor: '#E60012',
    logoUrl: 'https://pics.avs.io/al_square/64/64/OZ.png',
  },
  CZ: {
    code: 'CZ',
    name: 'China Southern Airlines',
    country: 'China',
    hub: 'CAN',
    brandColor: '#003876',
    logoUrl: 'https://pics.avs.io/al_square/64/64/CZ.png',
  },
  MU: {
    code: 'MU',
    name: 'China Eastern Airlines',
    country: 'China',
    hub: 'PVG',
    brandColor: '#003399',
    logoUrl: 'https://pics.avs.io/al_square/64/64/MU.png',
  },
  CA: {
    code: 'CA',
    name: 'Air China',
    country: 'China',
    hub: 'PEK',
    brandColor: '#E60012',
    logoUrl: 'https://pics.avs.io/al_square/64/64/CA.png',
  },

  // --- INDIA & SOUTH ASIA ---
  '6E': {
    code: '6E',
    name: 'IndiGo',
    country: 'India',
    hub: 'DEL',
    brandColor: '#001D6E',
    logoUrl: 'https://pics.avs.io/al_square/64/64/6E.png',
  },
  AI: {
    code: 'AI',
    name: 'Air India',
    country: 'India',
    hub: 'DEL',
    brandColor: '#D91C24',
    logoUrl: 'https://pics.avs.io/al_square/64/64/AI.png',
  },
  UK: {
    code: 'UK',
    name: 'Vistara',
    country: 'India',
    hub: 'DEL',
    brandColor: '#4F1D38',
    logoUrl: 'https://pics.avs.io/al_square/64/64/UK.png',
  },
  SG: {
    code: 'SG',
    name: 'SpiceJet',
    country: 'India',
    hub: 'DEL',
    brandColor: '#ED1C24',
    logoUrl: 'https://pics.avs.io/al_square/64/64/SG.png',
  },
  UL: {
    code: 'UL',
    name: 'SriLankan Airlines',
    country: 'Sri Lanka',
    hub: 'CMB',
    brandColor: '#007A3D',
    logoUrl: 'https://pics.avs.io/al_square/64/64/UL.png',
  },
  RA: {
    code: 'RA',
    name: 'Nepal Airlines',
    country: 'Nepal',
    hub: 'KTM',
    brandColor: '#DC143C',
    logoUrl: 'https://pics.avs.io/al_square/64/64/RA.png',
  },
  KB: {
    code: 'KB',
    name: 'Drukair',
    country: 'Bhutan',
    hub: 'PBH',
    brandColor: '#FF6600',
    logoUrl: 'https://pics.avs.io/al_square/64/64/KB.png',
  },

  // --- EUROPE & TURKEY ---
  TK: {
    code: 'TK',
    name: 'Turkish Airlines',
    country: 'Turkey',
    hub: 'IST',
    brandColor: '#E81932',
    logoUrl: 'https://pics.avs.io/al_square/64/64/TK.png',
  },
  BA: {
    code: 'BA',
    name: 'British Airways',
    country: 'United Kingdom',
    hub: 'LHR',
    brandColor: '#075AAA',
    logoUrl: 'https://pics.avs.io/al_square/64/64/BA.png',
  },
  LH: {
    code: 'LH',
    name: 'Lufthansa',
    country: 'Germany',
    hub: 'FRA',
    brandColor: '#05164D',
    logoUrl: 'https://pics.avs.io/al_square/64/64/LH.png',
  },
  AF: {
    code: 'AF',
    name: 'Air France',
    country: 'France',
    hub: 'CDG',
    brandColor: '#002157',
    logoUrl: 'https://pics.avs.io/al_square/64/64/AF.png',
  },
  KL: {
    code: 'KL',
    name: 'KLM Royal Dutch Airlines',
    country: 'Netherlands',
    hub: 'AMS',
    brandColor: '#00A1DE',
    logoUrl: 'https://pics.avs.io/al_square/64/64/KL.png',
  },
  VS: {
    code: 'VS',
    name: 'Virgin Atlantic',
    country: 'United Kingdom',
    hub: 'LHR',
    brandColor: '#D6001C',
    logoUrl: 'https://pics.avs.io/al_square/64/64/VS.png',
  },

  // --- AMERICAS & OCEANIA ---
  AA: {
    code: 'AA',
    name: 'American Airlines',
    country: 'United States',
    hub: 'DFW',
    brandColor: '#0078D2',
    logoUrl: 'https://pics.avs.io/al_square/64/64/AA.png',
  },
  UA: {
    code: 'UA',
    name: 'United Airlines',
    country: 'United States',
    hub: 'ORD',
    brandColor: '#005DAA',
    logoUrl: 'https://pics.avs.io/al_square/64/64/UA.png',
  },
  DL: {
    code: 'DL',
    name: 'Delta Air Lines',
    country: 'United States',
    hub: 'ATL',
    brandColor: '#002244',
    logoUrl: 'https://pics.avs.io/al_square/64/64/DL.png',
  },
  AC: {
    code: 'AC',
    name: 'Air Canada',
    country: 'Canada',
    hub: 'YYZ',
    brandColor: '#F01428',
    logoUrl: 'https://pics.avs.io/al_square/64/64/AC.png',
  },
  QF: {
    code: 'QF',
    name: 'Qantas',
    country: 'Australia',
    hub: 'SYD',
    brandColor: '#E0001A',
    logoUrl: 'https://pics.avs.io/al_square/64/64/QF.png',
  },

  // --- AFRICA ---
  MS: {
    code: 'MS',
    name: 'EgyptAir',
    country: 'Egypt',
    hub: 'CAI',
    brandColor: '#002B49',
    logoUrl: 'https://pics.avs.io/al_square/64/64/MS.png',
  },
  ET: {
    code: 'ET',
    name: 'Ethiopian Airlines',
    country: 'Ethiopia',
    hub: 'ADD',
    brandColor: '#007D43',
    logoUrl: 'https://pics.avs.io/al_square/64/64/ET.png',
  },
};

/**
 * Maps known airline name fragments to their 2-letter IATA code.
 */
const AIRLINE_NAME_TO_CODE: Record<string, string> = {
  biman: 'BG',
  bangladesh: 'BG',
  'us-bangla': 'BS',
  usbangla: 'BS',
  novoair: 'VQ',
  novo: 'VQ',
  'air astra': '2A',
  astra: '2A',
  emirates: 'EK',
  qatar: 'QR',
  singapore: 'SQ',
  thai: 'TG',
  malaysia: 'MH',
  saudia: 'SV',
  saudi: 'SV',
  flydubai: 'FZ',
  'air arabia': 'G9',
  arabia: 'G9',
  etihad: 'EY',
  gulf: 'GF',
  kuwait: 'KU',
  oman: 'WY',
  jazeera: 'J9',
  flynas: 'XY',
  indigo: '6E',
  'air india': 'AI',
  vistara: 'UK',
  spicejet: 'SG',
  srilankan: 'UL',
  nepal: 'RA',
  drukair: 'KB',
  turkish: 'TK',
  british: 'BA',
  lufthansa: 'LH',
  'air france': 'AF',
  klm: 'KL',
  virgin: 'VS',
  cathay: 'CX',
  airasia: 'AK',
  batik: 'OD',
  malindo: 'OD',
  'lion air': 'SL',
  qantas: 'QF',
  american: 'AA',
  united: 'UA',
  delta: 'DL',
  canada: 'AC',
  egyptair: 'MS',
  ethiopian: 'ET',
};

/**
 * Normalizes airline input (code or name) into a valid 2-letter IATA code.
 */
export function resolveAirlineCode(airlineCode?: string, airlineName?: string): string {
  if (airlineCode && airlineCode.trim().length === 2) {
    return airlineCode.toUpperCase().trim();
  }

  if (airlineName) {
    const norm = airlineName.toLowerCase().trim();
    for (const [key, code] of Object.entries(AIRLINE_NAME_TO_CODE)) {
      if (norm.includes(key)) {
        return code;
      }
    }
  }

  if (airlineCode && airlineCode.trim().length > 0) {
    const raw = airlineCode.toUpperCase().trim();
    if (AIRLINE_DIRECTORY[raw]) return raw;
  }

  return 'FL';
}

/**
 * Returns primary and fallback logo URLs for any airline.
 */
export function getAirlineLogoUrls(airlineCode?: string, airlineName?: string, customLogoUrl?: string): {
  primary: string;
  fallback: string;
  backup: string;
  brandColor: string;
  name: string;
  code: string;
} {
  const code = resolveAirlineCode(airlineCode, airlineName);
  const meta = AIRLINE_DIRECTORY[code];

  const name = meta?.name || airlineName || `${code} Airlines`;
  const brandColor = meta?.brandColor || '#006CE4';

  // Check if customLogoUrl is a valid airline logo (exclude generic unsplash / placeholder images)
  const isCustomValid =
    customLogoUrl &&
    customLogoUrl.length > 5 &&
    !customLogoUrl.includes('photo-1544620347') &&
    !customLogoUrl.includes('placeholder');

  const primary = isCustomValid
    ? customLogoUrl
    : `https://pics.avs.io/al_square/64/64/${code}.png`;

  const fallback = `https://images.kiwi.com/airlines/64x64/${code}.png`;
  const backup = `https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${code}.svg`;

  return {
    primary,
    fallback,
    backup,
    brandColor,
    name,
    code,
  };
}

/**
 * Direct helper returning the most reliable primary logo URL.
 */
export function getAirlineLogoUrl(airlineCode?: string, airlineName?: string): string {
  const code = resolveAirlineCode(airlineCode, airlineName);
  return `https://pics.avs.io/al_square/64/64/${code}.png`;
}
