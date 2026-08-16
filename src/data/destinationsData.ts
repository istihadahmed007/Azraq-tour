import { Destination } from "../types";
import { POPULAR_BANGLADESHI_DESTINATIONS } from "./popularBangladeshiDestinations";
import { SOUTH_ASIA_DESTINATIONS } from "./destinations/southAsia";
import { SE_ASIA_DESTINATIONS } from "./destinations/seAsia";
import { EAST_ASIA_MIDDLE_EAST_DESTINATIONS } from "./destinations/eastAsiaAndMiddleEast";
import JSON_DESTINATIONS from "../../data/destinations.json";

const rawList: Destination[] = [
  ...POPULAR_BANGLADESHI_DESTINATIONS,
  ...(JSON_DESTINATIONS as Destination[]),
  ...SOUTH_ASIA_DESTINATIONS,
  ...SE_ASIA_DESTINATIONS,
  ...EAST_ASIA_MIDDLE_EAST_DESTINATIONS,
];

// Deduplicate by ID
const map = new Map<string, Destination>();
rawList.forEach((item) => {
  if (!map.has(item.id)) {
    map.set(item.id, {
      ...item,
      imageUrl: item.imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=75",
      thumbnailUrl: item.thumbnailUrl || item.imageUrl,
      fallbackImage: item.fallbackImage || "/images/fallback.jpg",
      priceRange: item.priceRange || item.estimatedBudget || "$250 - $750",
      activities: item.activities || item.thingsToDo || ["Sightseeing", "Local Tour"],
    });
  }
});

export const ALL_DESTINATIONS: Destination[] = Array.from(map.values());

// Helper to get unique countries
export const UNIQUE_COUNTRIES = Array.from(
  new Set(ALL_DESTINATIONS.map((d) => d.country))
).sort();

// Helper to get unique categories
export const UNIQUE_CATEGORIES = Array.from(
  new Set(ALL_DESTINATIONS.map((d) => d.category))
).sort();

console.log(`[Destinations Data] Total Loaded Destinations: ${ALL_DESTINATIONS.length}`);
