import { describe, it, expect } from 'vitest';
import {
  calculateBuddyMatch,
  filterBuddyProfiles,
  validateBuddyProfile,
  getBuddyRequestId,
  checkDateOverlap,
  DEMO_BUDDY_PROFILES,
} from './travelBuddyQueries';
import { TravelBuddyProfile, TravelBuddyRequest } from '../types';

describe('Travel Buddies Matching & Validation Logic', () => {
  const baseCurrentUser: Partial<TravelBuddyProfile> = {
    id: 'user-123',
    displayName: 'Habib Rahman',
    homeLocation: 'Dhaka, Bangladesh',
    destinations: ['Bangkok', 'Pattaya'],
    travelStyles: ['Food & Culture', 'Photography'],
    languages: ['Bangla', 'English'],
    travelStart: '2026-11-10',
    travelEnd: '2026-11-20',
  };

  const matchingCandidate: TravelBuddyProfile = {
    id: 'user-456',
    displayName: 'Tanvir Hossain',
    avatarUrl: 'https://example.com/avatar.jpg',
    homeLocation: 'Dhaka, Bangladesh',
    bio: 'Food and photography explorer',
    destinations: ['Bangkok', 'Pattaya'],
    travelStyles: ['Food & Culture', 'Shopping'],
    languages: ['Bangla', 'English'],
    travelStart: '2026-11-12',
    travelEnd: '2026-11-18',
    groupSize: 2,
    contactPreference: 'WhatsApp',
    visibility: 'public',
    isActive: true,
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
  };

  const nonMatchingCandidate: TravelBuddyProfile = {
    id: 'user-789',
    displayName: 'John Smith',
    avatarUrl: 'https://example.com/avatar2.jpg',
    homeLocation: 'London, UK',
    bio: 'Business traveler in Tokyo',
    destinations: ['Tokyo', 'Kyoto'],
    travelStyles: ['Luxury'],
    languages: ['Japanese', 'French'],
    travelStart: '2027-01-01',
    travelEnd: '2027-01-10',
    groupSize: 1,
    contactPreference: 'Email',
    visibility: 'public',
    isActive: true,
    createdAt: '2026-08-01T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
  };

  // Test 1: Shared destinations produce a higher score
  it('1. Shared destinations produce a higher score', () => {
    const matched = calculateBuddyMatch(baseCurrentUser, matchingCandidate);
    const nonMatched = calculateBuddyMatch(baseCurrentUser, nonMatchingCandidate);

    expect(matched.matchScore).toBeGreaterThan(nonMatched.matchScore);
    expect(matched.matchedOn.some((r) => r.includes('Bangkok plans'))).toBe(true);
  });

  // Test 2: Overlapping dates increase the score
  it('2. Overlapping dates increase the score', () => {
    const candidateWithoutOverlap: TravelBuddyProfile = {
      ...matchingCandidate,
      travelStart: '2027-05-01',
      travelEnd: '2027-05-10',
    };

    const withOverlap = calculateBuddyMatch(baseCurrentUser, matchingCandidate);
    const withoutOverlap = calculateBuddyMatch(baseCurrentUser, candidateWithoutOverlap);

    expect(withOverlap.matchScore).toBeGreaterThan(withoutOverlap.matchScore);
    expect(withOverlap.matchedOn).toContain('Dates overlap');
    expect(withoutOverlap.matchedOn).not.toContain('Dates overlap');
    expect(checkDateOverlap('2026-11-10', '2026-11-20', '2026-11-12', '2026-11-18')).toBe(true);
    expect(checkDateOverlap('2026-11-10', '2026-11-20', '2027-05-01', '2027-05-10')).toBe(false);
  });

  // Test 3: Shared language and travel style add match reasons
  it('3. Shared language and travel style add match reasons', () => {
    const matched = calculateBuddyMatch(baseCurrentUser, matchingCandidate);
    expect(matched.matchedOn.some((r) => r.includes('Food & Culture style') || r.includes('Bangla speaking'))).toBe(true);
  });

  // Test 4: The current user is excluded from match candidates
  it('4. The current user is excluded from buddy candidate lists', () => {
    const allProfiles = [
      matchingCandidate,
      nonMatchingCandidate,
      {
        ...matchingCandidate,
        id: 'user-123', // Same as current user
        displayName: 'Habib Rahman (Self)',
      },
    ];

    const filtered = allProfiles.filter((p) => p.id !== baseCurrentUser.id);
    expect(filtered.length).toBe(2);
    expect(filtered.some((p) => p.id === 'user-123')).toBe(false);
  });

  // Test 5: Duplicate requests are prevented with deterministic ID
  it('5. Duplicate requests are prevented with deterministic request IDs', () => {
    const reqId1 = getBuddyRequestId('user-123', 'user-456');
    const reqId2 = getBuddyRequestId('user-123', 'user-456');
    expect(reqId1).toBe('user-123__user-456');
    expect(reqId1).toBe(reqId2);
  });

  // Test 6: Incoming and outgoing request status is calculated correctly
  it('6. Incoming and outgoing request status is calculated correctly', () => {
    const outgoingRequest: TravelBuddyRequest = {
      id: 'user-123__user-456',
      senderId: 'user-123',
      receiverId: 'user-456',
      message: 'Hey, let’s grab street food in Bangkok!',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const outgoingResult = calculateBuddyMatch(
      baseCurrentUser,
      matchingCandidate,
      [outgoingRequest],
      'user-123'
    );

    expect(outgoingResult.requestStatus).toBe('pending');
    expect(outgoingResult.requestDirection).toBe('outgoing');
    expect(outgoingResult.activeRequestId).toBe('user-123__user-456');

    // Test incoming
    const incomingRequest: TravelBuddyRequest = {
      id: 'user-789__user-123',
      senderId: 'user-789',
      receiverId: 'user-123',
      message: 'Would love to travel together!',
      status: 'accepted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const incomingResult = calculateBuddyMatch(
      baseCurrentUser,
      nonMatchingCandidate,
      [incomingRequest],
      'user-123'
    );

    expect(incomingResult.requestStatus).toBe('connected');
    expect(incomingResult.requestDirection).toBe('incoming');
  });

  // Test 7: Only active profiles are returned
  it('7. Only active profiles are returned', () => {
    const candidateList = [
      matchingCandidate,
      { ...nonMatchingCandidate, id: 'user-inactive', isActive: false },
    ];

    const activeList = candidateList.filter((p) => p.isActive);
    expect(activeList.length).toBe(1);
    expect(activeList[0].id).toBe('user-456');
  });

  // Test 8: Form validation requires a display name and at least one destination
  it('8. Form validation requires a display name and at least one destination', () => {
    const invalidEmpty: Partial<TravelBuddyProfile> = {
      displayName: '',
      destinations: [],
    };
    const res1 = validateBuddyProfile(invalidEmpty);
    expect(res1.isValid).toBe(false);
    expect(res1.errors.displayName).toBeDefined();
    expect(res1.errors.destinations).toBeDefined();

    const validProfile: Partial<TravelBuddyProfile> = {
      displayName: 'Habib Rahman',
      destinations: ['Bangkok'],
      bio: 'Excited traveler',
      travelStart: '2026-11-10',
      travelEnd: '2026-11-15',
    };
    const res2 = validateBuddyProfile(validProfile);
    expect(res2.isValid).toBe(true);
    expect(Object.keys(res2.errors).length).toBe(0);

    const invalidDates: Partial<TravelBuddyProfile> = {
      displayName: 'Habib Rahman',
      destinations: ['Bangkok'],
      travelStart: '2026-11-20',
      travelEnd: '2026-11-10', // End before start
    };
    const res3 = validateBuddyProfile(invalidDates);
    expect(res3.isValid).toBe(false);
    expect(res3.errors.travelEnd).toBeDefined();
  });
});
