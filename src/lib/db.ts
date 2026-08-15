import Dexie, { Table } from 'dexie';
import { EnRouteTrip, ItineraryItem, SafetyPin, SwipePlace, EnRouteVote, EnRouteReceipt } from '../types';

export interface OfflineAction {
  id?: number;
  type: 'vote' | 'pin_drop' | 'itinerary_update' | 'receipt_upload';
  payload: any;
  createdAt: string;
  synced: boolean;
}

export class EnRouteDexieDatabase extends Dexie {
  trips!: Table<EnRouteTrip, string>;
  itinerary!: Table<ItineraryItem, string>;
  safetyPins!: Table<SafetyPin, string>;
  places!: Table<SwipePlace, string>;
  votes!: Table<EnRouteVote, string>;
  receipts!: Table<EnRouteReceipt, string>;
  offlineActions!: Table<OfflineAction, number>;

  constructor() {
    super('EnRouteOfflineDB');
    this.version(1).stores({
      trips: 'tripId, adminId, destination',
      itinerary: 'itemId, tripId, startTime, type, status',
      safetyPins: 'pinId, tripId, category, expiresAt',
      places: 'placeId, category, priceLevel, rating',
      votes: 'voteId, tripId, placeId, userId',
      receipts: 'receiptId, tripId, date',
      offlineActions: '++id, type, synced, createdAt',
    });
  }
}

export const offlineDb = new EnRouteDexieDatabase();
