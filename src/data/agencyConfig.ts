export interface AgencyConfig {
  agencyName: string;
  tagline: string;
  subTagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  phone: string;
  phoneDisplay: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  email: string;
  officeAddress: string;
  officeCity: string;
  officeCountry: string;
  workingHours: string;
  operatingDays: string;
  travelpayoutsPartnerId?: string;
  currencies: { code: string; symbol: string; rateAgainstBDT: number }[];
  partnerDisclaimer: string;
  affiliateDisclosureText: string;
}

export const AZRAQ_AGENCY_CONFIG: AgencyConfig = {
  agencyName: 'Azraq',
  tagline: 'Luxury Travel Concierge',
  subTagline: 'Your Gateway to Curated Asian Escapes',
  heroHeadline: 'Your Gateway to Curated Asian Escapes',
  heroSubheadline: 'Compare routes, discover better fares, and let Azraq arrange the rest of your journey.',
  phone: '+8801851172032',
  phoneDisplay: '+880 1851-172032',
  whatsappNumber: '8801851172032',
  whatsappDisplay: '+880 1851-172032',
  email: 'istihadahmed1163@gmail.com',
  officeAddress: 'Level 4, Road 11, Block D, Gulshan-2',
  officeCity: 'Dhaka',
  officeCountry: 'Bangladesh',
  workingHours: '10:00 AM – 8:00 PM',
  operatingDays: 'Saturday – Thursday (24/7 WhatsApp concierge)',
  travelpayoutsPartnerId: '563001',
  currencies: [
    { code: 'BDT', symbol: '৳', rateAgainstBDT: 1 },
    { code: 'USD', symbol: '$', rateAgainstBDT: 0.0083 },
    { code: 'AED', symbol: 'AED ', rateAgainstBDT: 0.0305 },
    { code: 'EUR', symbol: '€', rateAgainstBDT: 0.0078 },
    { code: 'GBP', symbol: '£', rateAgainstBDT: 0.0066 },
  ],
  partnerDisclaimer:
    'Flight search results, prices, availability, booking conditions, payment, ticket issuance, changes, and refunds may be handled by the selected travel partner. Azraq provides travel guidance and concierge assistance according to the applicable service terms.',
  affiliateDisclosureText:
    'Azraq collaborates with licensed global travel distribution partners and Travelpayouts to provide comprehensive flight and lodging rate comparisons. When you search or book through partner links, Azraq may earn an affiliate commission at no additional cost to you. Direct airline and visa concierge services are serviced by our Dhaka travel desk.',
};
