import { Destination } from '../src/types';

export interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  user: {
    name: string;
    username: string;
  };
}

export interface UnsplashSearchResult {
  total: number;
  total_pages: number;
  results: UnsplashPhoto[];
}

/**
 * Fetch high quality photo for a given destination search query with exponential backoff retry.
 */
export async function fetchUnsplashPhoto(
  query: string,
  apiKey: string = process.env.UNSPLASH_ACCESS_KEY || '',
  retries: number = 3
): Promise<{ imageUrl: string; thumbnailUrl: string } | null> {
  const cleanQuery = encodeURIComponent(query.trim());
  const url = `https://api.unsplash.com/search/photos?query=${cleanQuery}&per_page=1&orientation=landscape`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (!apiKey) {
        console.warn(`[Unsplash API] UNSPLASH_ACCESS_KEY not configured. Returning fallback for query: "${query}"`);
        return null;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Client-ID ${apiKey}`,
          'Accept-Version': 'v1',
        },
      });

      if (response.status === 429) {
        console.warn(`[Unsplash API] Rate limit hit (429) on attempt ${attempt}. Waiting exponential backoff...`);
        const backoffMs = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        continue;
      }

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status} ${response.statusText}`);
      }

      const data: UnsplashSearchResult = await response.json();

      if (data.results && data.results.length > 0) {
        const photo = data.results[0];
        return {
          imageUrl: `${photo.urls.regular}&auto=format&fit=crop&w=1200&q=80`,
          thumbnailUrl: `${photo.urls.small}&auto=format&fit=crop&w=400&q=60`,
        };
      }

      // No direct search results
      console.warn(`[Unsplash API] No results found for query: "${query}"`);
      return null;
    } catch (err) {
      console.error(`[Unsplash API] Error on attempt ${attempt} for "${query}":`, err);
      if (attempt === retries) return null;
      await new Promise((res) => setTimeout(res, 1000 * attempt));
    }
  }

  return null;
}
