import { describe, it, expect } from 'vitest';
import {
  normalizeLocationToAirport,
} from '../services/flightAutocompleteService';
import {
  validateFlightSearchParams,
  normalizeFlightSearch,
  getAviasalesSearchKey,
} from '../utils/flightSearchEngine';
import {
  buildAviasalesSearchUrl,
  Airport,
} from '../data/flightsData';
import { AutocompleteLocation } from '../types';

describe('Flight Autocomplete & Location Normalization', () => {
  it('normalizes an airport AutocompleteLocation correctly', () => {
    const loc: AutocompleteLocation = {
      code: 'lhr',
      name: 'Heathrow Airport',
      city: 'London',
      country: 'United Kingdom',
      countryCode: 'GB',
      type: 'airport',
      isBangladesh: false,
    };

    const normalized = normalizeLocationToAirport(loc);
    expect(normalized.code).toBe('LHR');
    expect(normalized.city).toBe('London');
    expect(normalized.name).toBe('Heathrow Airport');
    expect(normalized.country).toBe('United Kingdom');
    expect(normalized.isBangladesh).toBe(false);
  });

  it('correctly tags Bangladesh airports as isBangladesh', () => {
    const dacLoc: AutocompleteLocation = {
      code: 'DAC',
      name: 'Hazrat Shahjalal International Airport',
      city: 'Dhaka',
      country: 'Bangladesh',
      countryCode: 'BD',
      type: 'airport',
      isBangladesh: true,
    };

    const normalized = normalizeLocationToAirport(dacLoc);
    expect(normalized.code).toBe('DAC');
    expect(normalized.isBangladesh).toBe(true);
  });

  it('normalizes city metro codes properly', () => {
    const cityLoc: AutocompleteLocation = {
      code: 'PAR',
      name: 'All Airports',
      city: 'Paris',
      country: 'France',
      countryCode: 'FR',
      type: 'city',
    };

    const normalized = normalizeLocationToAirport(cityLoc);
    expect(normalized.code).toBe('PAR');
    expect(normalized.city).toBe('Paris');
  });
});

describe('Flight Search Parameter Validation', () => {
  const dacAirport: Airport = {
    code: 'DAC',
    city: 'Dhaka',
    country: 'Bangladesh',
    name: 'Hazrat Shahjalal International Airport',
  };

  const bkkAirport: Airport = {
    code: 'BKK',
    city: 'Bangkok',
    country: 'Thailand',
    name: 'Suvarnabhumi Airport',
  };

  it('rejects searches with identical origin and destination', () => {
    const res = validateFlightSearchParams({
      origin: dacAirport,
      destination: dacAirport,
      departureDate: '2026-09-01',
      adults: 1,
    });

    expect(res.isValid).toBe(false);
    expect(res.error).toMatch(/cannot be the same/i);
  });

  it('rejects searches with 0 adults', () => {
    const res = validateFlightSearchParams({
      origin: dacAirport,
      destination: bkkAirport,
      departureDate: '2026-09-01',
      adults: 0,
    });

    expect(res.isValid).toBe(false);
    expect(res.error).toMatch(/adult/i);
  });

  it('rejects return dates before departure date for round trips', () => {
    const res = validateFlightSearchParams({
      origin: dacAirport,
      destination: bkkAirport,
      tripType: 'round',
      departureDate: '2026-09-10',
      returnDate: '2026-09-05',
      adults: 1,
    });

    expect(res.isValid).toBe(false);
    expect(res.error).toMatch(/earlier than departure/i);
  });

  it('passes validation for valid round-trip search', () => {
    const res = validateFlightSearchParams({
      origin: dacAirport,
      destination: bkkAirport,
      tripType: 'round',
      departureDate: '2026-09-10',
      returnDate: '2026-09-20',
      adults: 2,
    });

    expect(res.isValid).toBe(true);
    expect(res.error).toBeUndefined();
  });
});

describe('Flight Search Normalization', () => {
  it('supplies defaults when given an empty search object', () => {
    const normalized = normalizeFlightSearch(null);
    expect(normalized.origin.code).toBe('DAC');
    expect(normalized.destination.code).toBeDefined();
    expect(normalized.origin.code).not.toBe(normalized.destination.code);
    expect(normalized.adults).toBeGreaterThanOrEqual(1);
    expect(normalized.departureDate).toBeDefined();
  });

  it('prevents same airport during normalization', () => {
    const dac: Airport = { code: 'DAC', city: 'Dhaka', country: 'Bangladesh', name: 'Dhaka Airport' };
    const normalized = normalizeFlightSearch({
      origin: dac,
      destination: dac,
    });

    expect(normalized.origin.code).not.toBe(normalized.destination.code);
  });
});

describe('Aviasales Affiliate Search Key & URL', () => {
  it('constructs standard search key correctly', () => {
    const key = getAviasalesSearchKey({
      origin: 'DAC',
      destination: 'BKK',
      departDate: '2026-08-31',
      adults: 1,
    });

    expect(key).toBe('DAC3108BKK1');
  });

  it('includes affiliate marker 563001 in URL', () => {
    const url = buildAviasalesSearchUrl({
      origin: 'DAC',
      destination: 'DXB',
      departDate: '2026-08-31',
      adults: 1,
    });

    expect(url).toContain('https://www.aviasales.com/search/');
    expect(url).toContain('marker=563001');
    expect(url).toContain('DAC3108DXB1');
  });
});
