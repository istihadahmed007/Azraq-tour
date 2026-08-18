import { AutocompleteLocation } from '../types';
import { Airport, BANGLADESH_AIRPORTS, POPULAR_AIRPORTS } from '../data/flightsData';

const clientCache = new Map<string, AutocompleteLocation[]>();

// Fallback curated dataset for offline resilience
const FALLBACK_DIRECTORY: AutocompleteLocation[] = [
  ...BANGLADESH_AIRPORTS.map((a) => ({
    code: a.code,
    name: a.name,
    city: a.city,
    country: a.country,
    countryCode: 'BD',
    type: 'airport' as const,
    isBangladesh: true,
  })),
  ...POPULAR_AIRPORTS.filter((a) => !a.isBangladesh).map((a) => ({
    code: a.code,
    name: a.name,
    city: a.city,
    country: a.country,
    countryCode: '',
    type: 'airport' as const,
    isBangladesh: false,
  })),
];

/**
 * Searches global airports and cities via the server-side provider proxy.
 * Debounced, cancelable, and cached in memory.
 */
export async function searchAirportsAndCities(
  query: string,
  signal?: AbortSignal
): Promise<AutocompleteLocation[]> {
  const term = query.trim().toLowerCase();
  if (term.length < 2) {
    return [];
  }

  if (clientCache.has(term)) {
    return clientCache.get(term)!;
  }

  try {
    const res = await fetch(`/api/flights/autocomplete?term=${encodeURIComponent(term)}`, {
      signal,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    if (data.success && Array.isArray(data.results)) {
      clientCache.set(term, data.results);
      return data.results;
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw err;
    }
    console.warn('Autocomplete fetch fallback:', err);
  }

  // Fallback search in local directory
  const localMatches = FALLBACK_DIRECTORY.filter((item) => {
    const c = item.code.toLowerCase();
    const city = item.city.toLowerCase();
    const country = item.country.toLowerCase();
    const name = item.name.toLowerCase();
    return c.includes(term) || city.includes(term) || country.includes(term) || name.includes(term);
  });

  clientCache.set(term, localMatches);
  return localMatches;
}

/**
 * Normalizes an AutocompleteLocation into standard application Airport type.
 */
export function normalizeLocationToAirport(loc: AutocompleteLocation): Airport {
  return {
    code: loc.code.toUpperCase(),
    city: loc.city,
    name: loc.name,
    country: loc.country,
    isBangladesh: loc.isBangladesh ?? (loc.countryCode === 'BD' || ['DAC', 'CGP', 'ZYL', 'CXB', 'JSR', 'RJH', 'SPD', 'BZL'].includes(loc.code)),
  };
}
