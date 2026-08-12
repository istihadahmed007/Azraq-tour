import fs from 'fs';
import path from 'path';
import { Destination } from '../src/types';

const CACHE_FILE_PATH = path.join(process.cwd(), 'data', 'destinations.json');

// In-memory cache store
let memoryCache: Destination[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour TTL

export function getCachedDestinations(): Destination[] | null {
  const now = Date.now();
  if (memoryCache && now - lastCacheTime < CACHE_TTL_MS) {
    return memoryCache;
  }

  try {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const fileContent = fs.readFileSync(CACHE_FILE_PATH, 'utf-8');
      const data: Destination[] = JSON.parse(fileContent);
      memoryCache = data;
      lastCacheTime = now;
      return data;
    }
  } catch (err) {
    console.error('[Destinations Cache] Error reading cache file:', err);
  }

  return null;
}

export function setCachedDestinations(destinations: Destination[]): boolean {
  try {
    const dir = path.dirname(CACHE_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(destinations, null, 2), 'utf-8');
    memoryCache = destinations;
    lastCacheTime = Date.now();
    return true;
  } catch (err) {
    console.error('[Destinations Cache] Error writing cache file:', err);
    return false;
  }
}
