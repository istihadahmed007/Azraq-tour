import { describe, it, expect } from 'vitest';
import {
  validateFlightSearchParams,
  normalizeFlightSearch,
  serializeFlightSearchParamsToUrl,
  parseFlightSearchParamsFromUrl,
  generateMatchingFlightItinerary,
  buildDynamicFlightWhatsAppUrl,
  buildDynamicFlightShareText,
  NormalizedFlightSearch,
} from './flightSearchEngine';
import { BANGLADESH_AIRPORTS, POPULAR_AIRPORTS } from '../data/flightsData';

describe('flightSearchEngine', () => {
  const dacAirport = BANGLADESH_AIRPORTS.find((a) => a.code === 'DAC') || BANGLADESH_AIRPORTS[0];
  const jsrAirport = BANGLADESH_AIRPORTS.find((a) => a.code === 'JSR') || {
    code: 'JSR',
    city: 'Jashore',
    country: 'Bangladesh',
    name: 'Jashore Airport',
  };
  const bkkAirport = POPULAR_AIRPORTS.find((a) => a.code === 'BKK') || POPULAR_AIRPORTS[1];

  describe('validateFlightSearchParams', () => {
    it('validates a correct round trip search', () => {
      const result = validateFlightSearchParams({
        origin: dacAirport,
        destination: jsrAirport,
        departureDate: '2026-08-31',
        returnDate: '2026-09-07',
        tripType: 'round',
        adults: 1,
        children: 0,
        infants: 0,
        cabinClass: 'Economy',
      });
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('rejects identical origin and destination', () => {
      const result = validateFlightSearchParams({
        origin: dacAirport,
        destination: dacAirport,
        departureDate: '2026-08-31',
        returnDate: '2026-09-07',
        tripType: 'round',
        adults: 1,
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Origin and destination airport cannot be the same');
    });

    it('rejects return date earlier than departure date for round trips', () => {
      const result = validateFlightSearchParams({
        origin: dacAirport,
        destination: jsrAirport,
        departureDate: '2026-09-10',
        returnDate: '2026-09-05',
        tripType: 'round',
        adults: 1,
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Return date cannot be earlier than departure date');
    });

    it('rejects zero adult travelers', () => {
      const result = validateFlightSearchParams({
        origin: dacAirport,
        destination: jsrAirport,
        departureDate: '2026-08-31',
        tripType: 'oneway',
        adults: 0,
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('At least 1 adult traveler is required');
    });
  });

  describe('normalizeFlightSearch', () => {
    it('provides safe fallbacks and clamps values', () => {
      const normalized = normalizeFlightSearch({
        adults: -5,
        children: 12,
        infants: 8,
      });
      expect(normalized.adults).toBe(1);
      expect(normalized.children).toBe(9);
      expect(normalized.infants).toBe(1); // capped to adults
      expect(normalized.origin.code).toBeDefined();
      expect(normalized.destination.code).toBeDefined();
      expect(normalized.departureDate).toBeDefined();
    });
  });

  describe('URL serialization & parsing', () => {
    it('serializes and deserializes search params faithfully', () => {
      const original: NormalizedFlightSearch = {
        origin: dacAirport,
        destination: jsrAirport,
        departureDate: '2026-08-31',
        returnDate: '2026-09-07',
        tripType: 'round',
        adults: 2,
        children: 1,
        infants: 0,
        cabinClass: 'Business',
      };

      const queryString = serializeFlightSearchParamsToUrl(original);
      expect(queryString).toContain('origin=DAC');
      expect(queryString).toContain('destination=JSR');
      expect(queryString).toContain('departDate=2026-08-31');
      expect(queryString).toContain('returnDate=2026-09-07');
      expect(queryString).toContain('tripType=round');
      expect(queryString).toContain('adults=2');
      expect(queryString).toContain('cabin=Business');

      const parsed = parseFlightSearchParamsFromUrl(`?${queryString}`);
      expect(parsed.origin?.code).toBe('DAC');
      expect(parsed.destination?.code).toBe('JSR');
      expect(parsed.departureDate).toBe('2026-08-31');
      expect(parsed.returnDate).toBe('2026-09-07');
      expect(parsed.tripType).toBe('round');
      expect(parsed.adults).toBe(2);
      expect(parsed.children).toBe(1);
      expect(parsed.cabinClass).toBe('Business');
    });
  });

  describe('generateMatchingFlightItinerary', () => {
    it('creates an itinerary strictly matching Dhaka to Jashore search without hardcoded London data', () => {
      const search: NormalizedFlightSearch = {
        origin: dacAirport,
        destination: jsrAirport,
        departureDate: '2026-08-31',
        returnDate: '2026-09-07',
        tripType: 'round',
        adults: 1,
        children: 0,
        infants: 0,
        cabinClass: 'Economy',
        currency: 'BDT',
      };

      const itinerary = generateMatchingFlightItinerary(search);
      expect(itinerary.originCode).toBe('DAC');
      expect(itinerary.destinationCode).toBe('JSR');
      expect(itinerary.routeTitle).toContain('Dhaka (DAC) ➔ Jashore (JSR)');
      expect(itinerary.outboundSegments[0].originCode).toBe('DAC');
      expect(itinerary.outboundSegments[itinerary.outboundSegments.length - 1].destinationCode).toBe('JSR');
      expect(itinerary.outboundSegments[0].departureDate).toBe('2026-08-31');
      expect(itinerary.returnSegments).toBeDefined();
      expect(itinerary.returnSegments![0].departureDate).toBe('2026-09-07');
    });

    it('creates international itineraries with layover hubs', () => {
      const search: NormalizedFlightSearch = {
        origin: dacAirport,
        destination: bkkAirport,
        departureDate: '2026-09-15',
        tripType: 'oneway',
        adults: 2,
        children: 0,
        infants: 0,
        cabinClass: 'Economy',
      };

      const itinerary = generateMatchingFlightItinerary(search);
      expect(itinerary.originCode).toBe('DAC');
      expect(itinerary.destinationCode).toBe('BKK');
      expect(itinerary.returnSegments).toBeUndefined();
    });
  });

  describe('buildDynamicFlightWhatsAppUrl & buildDynamicFlightShareText', () => {
    it('generates accurate WhatsApp inquiry URL with route details', () => {
      const search: NormalizedFlightSearch = {
        origin: dacAirport,
        destination: jsrAirport,
        departureDate: '2026-08-31',
        returnDate: '2026-09-07',
        tripType: 'round',
        adults: 1,
        children: 0,
        infants: 0,
        cabinClass: 'Economy',
      };

      const url = buildDynamicFlightWhatsAppUrl(search, 8500);
      expect(url).toContain('wa.me');
      expect(url).toContain('DAC');
      expect(url).toContain('JSR');
      expect(url).toContain('2026-08-31');
      expect(url).toContain('8%2C500'); // encoded 8,500
    });

    it('generates clean share text for clipboard and messaging', () => {
      const search: NormalizedFlightSearch = {
        origin: dacAirport,
        destination: jsrAirport,
        departureDate: '2026-08-31',
        tripType: 'oneway',
        adults: 1,
        children: 0,
        infants: 0,
        cabinClass: 'Economy',
      };

      const shareText = buildDynamicFlightShareText(search, 4200);
      expect(shareText).toContain('Dhaka (DAC) ➔ Jashore (JSR)');
      expect(shareText).toContain('2026-08-31');
      expect(shareText).toContain('4,200');
    });
  });
});
