import { Destination, FeedPost, Itinerary, TrendingHashtag } from "../types";
import { ALL_DESTINATIONS } from "./destinationsData";

export const BRAND_LOGOS = {
  globetrotter: "https://lh3.googleusercontent.com/aida-public/AB6AXuDueO4XryGUl6a6WmWX0EvWIDKx_Zu5FHQ49JBhgL8k9NZOkMjJu3Xr9z0w7qgLX7p7ctXVHms1BPNX9LQbELXZWUjouvvWHc2aLlYloz94DqzNNnDH6Gmu1q-OwC_kMG5BS0sDUQnKohe-rq44IcpooNz4LDQtko6F0gporrLADTlW8mFgb9X8JOqQyZMw7whC2ykcHxoWLBM93q2IYw0yAWLt-VE9q3__DYK4hKxFuZnds12hDZCBeqCZg4vwi--DdQ",
  azraq: "https://lh3.googleusercontent.com/aida-public/AB6AXuDueO4XryGUl6a6WmWX0EvWIDKx_Zu5FHQ49JBhgL8k9NZOkMjJu3Xr9z0w7qgLX7p7ctXVHms1BPNX9LQbELXZWUjouvvWHc2aLlYloz94DqzNNnDH6Gmu1q-OwC_kMG5BS0sDUQnKohe-rq44IcpooNz4LDQtko6F0gporrLADTlW8mFgb9X8JOqQyZMw7whC2ykcHxoWLBM93q2IYw0yAWLt-VE9q3__DYK4hKxFuZnds12hDZCBeqCZg4vwi--DdQ",
  userAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBT0Jpi4jcWzVICFjXaWc6S9_wz003aLtkBBHPk9HJSstTEBXkgpEklox53ddv26NHXkWFbdvFH0N6Hthfr0G1pYJYOCx8t3FBRFr4uxZ9jCMRajpdD530QlmBVs9WRU5J1RAqGpycee1OLBVnMnJUthyC5b9A0eOYh_TRPiN4knTC6SuM3nevoRTFEWaOIx1MHb5zPOPW602asXmNimVWCEXYqxxUZFzE3xyoA9A-JiA93cAPU_GeW"
};

export const INITIAL_DESTINATIONS: Destination[] = ALL_DESTINATIONS;

export const INITIAL_FEED_POSTS: FeedPost[] = [
  {
    id: 'post-1',
    authorName: 'Elena Rossi',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVA_Y-chzwXJuEeMA3v1P-9qjr0aHPuY-aycLZPVY8c0x7XoesyaJWmoFKN5KcEPhre8KW4x7BWOp7Ir1oApKoYSKgne8qJw97LZxgvFsgTvRc8L6-NB1NiD1fAlTtE_meqi1xB5h4cz0hDGQEWT1bTeoBS-KwChuog7jGI5gsQjqansvXo4TWvOtaHn9vqZZR9o0rVu6zM_nKUJZ5RO5Yd9syRkWD2qB_EeL74TmbW9KjLvTFkUy0',
    location: 'Dolomites, Italy',
    badgeLabel: 'AI Verified Route',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0aKun8M_UKkizSoQTYDKraK80K46sPwtetIHS1Q8T3NiXeEOioCD7I8qYCJbT3fM0I6wOCmYByIhlNlBKBc2oPwzFy9fIanrFRloP0q7_z3dcU2VXCq2mqLRwO7pyi0MBK8eqgiPMZXgn0PDIvBN3N1STzrmcJnpt2E7zJ6dVxbAXjCICWE9mwPXI-fybc0HgDIuL3xhYN611MTHa6MV2mUWVgy0DjkE0JtBgF_k3Uaj6wfARX886',
    likes: 2400,
    commentsCount: 184,
    caption: 'The morning light hitting the Tre Cime is something you never forget. Hiked up before dawn. Totally worth the cold.',
    hashtags: ['#Dolomites', '#AlpineSunrise', '#TreCime'],
    timeAgo: '2h ago',
    isLiked: false,
    isBookmarked: true,
    aiVerified: true,
    commentsList: [
      { id: 'c1', author: 'Liam Vance', avatar: BRAND_LOGOS.userAvatar, text: 'The framing on this sunrise is unbelievable! Which lens did you use?', timeAgo: '1h ago' },
      { id: 'c2', author: 'Sophia Meyer', avatar: BRAND_LOGOS.userAvatar, text: 'Added to my GlobeTrotter AI itinerary right now!', timeAgo: '30m ago' }
    ]
  },
  {
    id: 'post-2',
    authorName: 'Marcus Chen',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJEhiJzi3nX0bVk6FOV_giyi-UQKN8xiy2q47_U_dk17WNHISeg8fZvRZ8ZklaFF7-_l91LVhTij5C4CorM2POkvqmKSVBdBiO0Cw2fJWSAuOXvdFl-uWzEPgYdbV4UobUj7rXuFSY0Z6-e05vqK-iAXfwaUBn0S2Qwqgt-dDMcC2aL9YQogty2agftL9wHYwA4uLvqF6GN5xyuVfbHPnjMJvhqRhjX6Qru9XyAZsjsEGQw8Jo-Qxe',
    location: 'Tokyo, Japan',
    badgeLabel: 'Local Secret Spot',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWwjcNUShEsgDQjSe3nMLGqyRDwMc0hDp18yXND1vikACwbmGItfdor1wu9hqunh87ECOqds_W63ZPXkqq6P0Z1f_GkE4cci6jEqaoHAN6CNIXH8EpOawPHxAC6LRTJjY-_kXaIjDZw7ReJDAzPTMdinW4XvaRqwvMtoCvaIMk3vgQZ5c5OxuPCjTJdZ34B85u1PemYb72233XoO3SByxjR4hP-TgqxIdew5zN1nXIh-xOELpNOqFG',
    likes: 8100,
    commentsCount: 432,
    caption: 'Lost in the neon labyrinth. Found the best hidden ramen spot thanks to GlobeTrotter AI\'s local recommendations.',
    hashtags: ['#TokyoNights', '#StreetPhotography', '#Shinjuku'],
    timeAgo: '5h ago',
    isLiked: true,
    isBookmarked: false,
    aiVerified: true,
    commentsList: [
      { id: 'c3', author: 'Aria Takahashi', avatar: BRAND_LOGOS.userAvatar, text: 'Golden Gai ramen hits different in late night rain!', timeAgo: '2h ago' }
    ]
  }
];

export const TRENDING_HASHTAGS: TrendingHashtag[] = [
  { tag: '#AuroraBorealis', postsCount: '12.5k posts', isRising: true },
  { tag: '#KyotoAutumn', postsCount: '8.2k posts', isRising: true },
  { tag: '#DigitalNomadLife', postsCount: '45.1k posts', isRising: true },
  { tag: '#AmalfiViews', postsCount: '19.8k posts', isRising: false },
  { tag: '#DesertMagic', postsCount: '6.4k posts', isRising: true }
];

export const INITIAL_KYOTO_ITINERARY: Itinerary = {
  id: 'kyoto-immersion',
  title: 'Kyoto Cultural Immersion',
  destination: 'Kyoto, Japan',
  durationDays: 5,
  weatherSummary: 'Oct 12 - Oct 18 • 15°C Partly Cloudy',
  aiSummary: 'A meticulously curated journey through ancient temples, serene bamboo groves, traditional tea houses, and exquisite kaiseki dining.',
  days: [
    {
      dayNumber: 1,
      title: 'Day 1: Arrival & Higashiyama',
      summary: 'Explore historic wooden streets and iconic hillside temples.',
      spots: [
        {
          id: 'k1',
          name: 'Kiyomizu-dera',
          description: 'Historic temple offering stunning views of the city. Best visited early morning or late afternoon.',
          timeSlot: '14:00 - 16:00',
          category: 'Culture',
          imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHzDtzxEsbeDsDrCdoNLEjTI_xuY-7wlUYq5ucT5Sl5URGnyJ1FWvjE5BPxE5SQUaGNKlsYlPalBk5SIZlZDwQ5ALiHCKPRK_tWth1bQbUu_B-eYcYoayo5QBhhDzreiCStQq35vn2gqDvsLLV1-S8cyJLXiVq6OsKfUZwdu0lKKD5eRgT9r44zdDLwiRIWHmiog-8gmKoxaIqvCCf5F0pBXgDAy9FuocuDV0oxqQYkhnA-d2NMqFU',
          aiTip: 'Beat the crowds by taking the scenic route up Ninenzaka street. Try the matcha soft serve near the entrance!',
          lat: 34.9949,
          lng: 135.7850
        },
        {
          id: 'k2',
          name: 'Ninenzaka & Sannenzaka Slopes',
          description: 'Preserved pedestrian stone lanes lined with wooden tea houses and artisan craft shops.',
          timeSlot: '16:30 - 18:30',
          category: 'Sightseeing',
          imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCptuAAzn_9bWzXKI9IgoizFj6EhV7JeaF96_xK_QNQRfiTAk_Spi4bVq7yXVIyJS1lze2USOQn17rW3Um1FF1I1BSO0D0SOKg3DztPPMtfa1gZ-UFiBxeuTuHLfeQ4Mjpo4Ib75SFq_klem821sVYHqyswM-63tYPDepO3oEV0Z0NPJTaimKRhaWOsyURpcH2gEJObS8Bc2qiIwOlqHOeyEVf83mSF8BrlopCRAf-dbNwYvjqDVtkx',
          aiTip: 'Look out for traditional paper lantern lightings around dusk for incredible photo opportunities.',
          lat: 34.9980,
          lng: 135.7810
        }
      ],
      aiInsight: 'Higashiyama is best experienced on foot. Wear comfortable walking shoes as stone steps are frequent.'
    },
    {
      dayNumber: 2,
      title: 'Day 2: Arashiyama Bamboo Grove & River Cruise',
      summary: 'Walk through towering bamboo stalks and take a traditional wooden boat down Hozu River.',
      spots: [
        {
          id: 'k3',
          name: 'Arashiyama Bamboo Grove',
          description: 'Soaring green stalks rustling in the breeze, creating a tranquil acoustic sanctuary.',
          timeSlot: '08:00 - 10:30',
          category: 'Nature',
          imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCptuAAzn_9bWzXKI9IgoizFj6EhV7JeaF96_xK_QNQRfiTAk_Spi4bVq7yXVIyJS1lze2USOQn17rW3Um1FF1I1BSO0D0SOKg3DztPPMtfa1gZ-UFiBxeuTuHLfeQ4Mjpo4Ib75SFq_klem821sVYHqyswM-63tYPDepO3oEV0Z0NPJTaimKRhaWOsyURpcH2gEJObS8Bc2qiIwOlqHOeyEVf83mSF8BrlopCRAf-dbNwYvjqDVtkx',
          aiTip: 'Arrive before 8:30 AM to capture clear photos without crowd clutter.',
          lat: 35.0170,
          lng: 135.6713
        },
        {
          id: 'k4',
          name: 'Tenryu-ji Zen Garden',
          description: 'UNESCO World Heritage temple with 14th-century pond garden reflecting autumn foliage.',
          timeSlot: '11:00 - 13:00',
          category: 'Culture',
          aiTip: 'Sit on the main veranda for 15 minutes to take in the quiet landscape design.',
          lat: 35.0158,
          lng: 135.6777
        }
      ],
      aiInsight: 'Book a Kaiseki lunch near Togetsukyo Bridge for authentic Kyoto seasonal delicacies.'
    },
    {
      dayNumber: 3,
      title: 'Day 3: Fushimi Inari & Gion Night Walk',
      summary: 'Hike through thousands of vermilion torii gates followed by evening Geisha spotting in Gion.',
      spots: [
        {
          id: 'k5',
          name: 'Fushimi Inari Taisha',
          description: 'Mountain shrine dedicated to the Shinto god of rice and sake with over 10,000 torii gates.',
          timeSlot: '07:30 - 11:00',
          category: 'Sightseeing',
          aiTip: 'Hike up past Yotsutsuji intersection for panoramic views of Kyoto without the crowd.',
          lat: 34.9671,
          lng: 135.7727
        }
      ],
      aiInsight: 'Reserve a spot at Pontocho Alley for dinner alongside the Kamogawa River.'
    }
  ],
  packingList: [
    {
      category: 'Clothing & Layering',
      items: ['Light jacket or cardigan (12-18°C)', 'Comfortable walking shoes/sneakers', 'Slip-on socks for temple entrances', 'Breathable linen shirt']
    },
    {
      category: 'Essentials & Tech',
      items: ['IC Card / Suica for transit', 'Portable power bank', 'Compact travel umbrella', 'Universal power adapter (Type A)']
    },
    {
      category: 'Smart Accessories',
      items: ['Reusable water bottle', 'Coin purse for cash transactions', 'Travel journal & camera']
    }
  ]
};
