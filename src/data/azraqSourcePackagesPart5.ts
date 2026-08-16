import { TourPackage } from '../types';

export const AZRAQ_SOURCE_PACKAGES_PART5: TourPackage[] = [
  // 18. Bhutan (Page 43-46)
  {
    id: "pkg_azraq_18",
    destination_id: "dest_bhutan",
    destination_name: "Thimphu, Paro & Punakha",
    country: "Bhutan",
    package_name: "Bhutan - Thimphu,Paro, Punakha, Tiger’s Nest",
    duration: "5 Night 6 Days",
    price: 34650,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 53350 },
      { pax: 4, price: 40700 },
      { pax: 10, price: 34650 }
    ],
    description: "5-Night, 6-Day iconic Bhutan journey including Tiger's Nest hike, Dochula Pass, Punakha Dzong, and Buddha Dordenma with SDF included.",
    itinerary: [
      {
        day: 1,
        title: "Arrival at Paro Airport – Transfer to Thimphu",
        activities: [
          "Arrive at Paro International Airport, meet Oma Tour & Travel representative.",
          "Scenic drive via Chhukha District and Isuna River to Thimphu.",
          "Check-in at hotel.",
          "Visit National Memorial Chorten, Simply Bhutan Museum, and Authentic Bhutanese Crafts Market.",
          "Overnight in Thimphu."
        ],
        meals: "On own",
        overnight: "Thimphu Hotel"
      },
      {
        day: 2,
        title: "Thimphu Sightseeing",
        activities: [
          "Visit Buddha Dordenma (169-foot statue housing 125,000 miniature Buddhas).",
          "Visit Devi Panchayan Mandir (unique Hindu temple blending Bhutanese elements).",
          "Visit Motithang Takin Preserve and Folk Heritage Museum.",
          "Evening free for Thimphu markets.",
          "Overnight in Thimphu."
        ],
        meals: "Breakfast",
        overnight: "Thimphu Hotel"
      },
      {
        day: 3,
        title: "Thimphu to Punakha via Dochula Pass",
        activities: [
          "Drive to Punakha via Dochula Pass (3,100 meters) with 108 memorial chortens and Himalayan views.",
          "In Punakha: Visit Punakha Dzong (Palace of Great Happiness at confluence of Pho & Mo Chu rivers), walk across Punakha Suspension Bridge, hike to Chimi Lhakhang (Fertility Temple).",
          "Overnight in Punakha."
        ],
        meals: "Breakfast",
        overnight: "Punakha Hotel"
      },
      {
        day: 4,
        title: "Punakha to Paro – Local Sightseeing",
        activities: [
          "Drive to Paro with Paro Airport Viewpoint stop.",
          "Visit National Museum (Ta Dzong), Kichu Lhakhang (7th century), Rinpung Dzong.",
          "Overnight in Paro."
        ],
        meals: "Breakfast",
        overnight: "Paro Hotel"
      },
      {
        day: 5,
        title: "Paro – Hike to Taktsang Monastery (Tiger’s Nest)",
        activities: [
          "Hike to Taktsang Monastery (Tiger’s Nest), perched 900 meters above Paro Valley (2-3 hour moderate trek).",
          "Sacred meditation cave of Guru Padmasambhava with awe-inspiring cliff views.",
          "Evening stroll through Paro town and shopping.",
          "Overnight in Paro."
        ],
        meals: "Breakfast",
        overnight: "Paro Hotel"
      },
      {
        day: 6,
        title: "Departure – Transfer to Paro International Airport",
        activities: [
          "Breakfast at hotel.",
          "Airport transfer for departure flight with cherished memories of Bhutan."
        ],
        meals: "Breakfast",
        overnight: "Departure"
      }
    ],
    hotel: "3-star hotels in Thimphu, Punakha and Paro approved by Tourism Council of Bhutan",
    meals: "Daily Breakfast included",
    transportation: "Bhutanese vehicle with licensed driver as per itinerary",
    inclusions: [
      "Sustainable Development Fees (SDF) mentioned in a separate column.",
      "Accommodation in 3-star hotels approved by Tourism Council of Bhutan",
      "English speaking licensed guide",
      "Bhutanese vehicle with licensed driver as per the itinerary only",
      "Breakfast",
      "Entry permits to visit municipal areas only"
    ],
    exclusions: [
      "Air Ticket",
      "Entrance fees to sightseeing places",
      "Personal expenses",
      "Insurance of any kind",
      "Extra outdoor activities",
      "Anything that is not mentioned in the inclusion is on extra cost"
    ],
    visa_information: "Bhutan permit and SDF included.",
    required_documents: ["Passport copy with 6+ months validity", "Photo"],
    important_notes: ["Tiger's Nest moderate hike requires comfortable walking shoes."],
    terms_conditions: ["Group tiered pricing."],
    source_pdf: "SOURCE PDF PAGE 43-46",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=75"],
    highlights: ["Tiger's Nest (Taktsang) Monastery Hike", "Dochula Pass 108 Chortens & Punakha Dzong", "Buddha Dordenma & Simply Bhutan Museum", "SDF Included & Licensed English Guide"]
  },

  // 19. Singapore (Page 47-48)
  {
    id: "pkg_azraq_19",
    destination_id: "dest_singapore",
    destination_name: "Singapore",
    country: "Singapore",
    package_name: "Singapore (3*) Marina Bay Sands SkyPark + Gardens by the Bay + City Tour",
    duration: "3 Night 4 Days",
    price: 28600,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 32450 },
      { pax: 4, price: 29920 },
      { pax: 6, price: 28600 }
    ],
    description: "3-Night Singapore tour featuring Marina Bay Sands SkyPark, Gardens by the Bay (Flower Dome & Cloud Forest), and City Tour.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Singapore",
        activities: [
          "Arrival at Changi International Airport",
          "Meet & greet by our representative",
          "Private transfer to your hotel",
          "Check-in at your hotel (standard check-in time: 2:00 PM)",
          "Evening at leisure (Optional: Explore Clarke Quay nightlife or take a River Cruise)",
          "Overnight stay in Singapore"
        ],
        meals: "On own",
        overnight: "Arianna Hotel or Similar"
      },
      {
        day: 2,
        title: "Half-Day Singapore City Tour",
        activities: [
          "Breakfast",
          "City Tour Highlights (4 to 6 hours)",
          "Afternoon free for leisure or shopping",
          "Overnight stay in Singapore"
        ],
        meals: "On own",
        overnight: "Arianna Hotel or Similar"
      },
      {
        day: 3,
        title: "Marina Bay Sands SkyPark + Gardens by the Bay",
        activities: [
          "Breakfast",
          "Morning free (Optional: Visit the Zoo or do a shopping tour)",
          "Afternoon/Evening visit to: Gardens by the Bay, Flower Dome & Cloud Forest, Supertree Grove light show (in the evening), Marina Bay Sands SkyPark Observation Deck",
          "Enjoy panoramic views of Singapore's skyline",
          "Return to hotel",
          "Overnight stay in Singapore"
        ],
        meals: "On own",
        overnight: "Arianna Hotel or Similar"
      },
      {
        day: 4,
        title: "Departure",
        activities: [
          "Breakfast",
          "Check-out from hotel",
          "Transfer to Changi Airport for your return flight"
        ],
        meals: "On own",
        overnight: "Departure"
      }
    ],
    hotel: "Arianna Hotel or Similar (3 Nights accommodation without breakfast)",
    meals: "Room only / without breakfast",
    transportation: "Private Airport Transfers (Arrival & Departure)",
    inclusions: [
      "3 Nights accommodation at Hotel without breakfast",
      "Daily hotel taxes & service charges",
      "Private Airport Transfers (Arrival & Departure)",
      "Half-Day Singapore City Tour (Group basis)",
      "Marina Bay Sands SkyPark + Gardens"
    ],
    exclusions: [
      "Air fare (International flights)",
      "Singapore Visa Fee",
      "All meals",
      "Entry tickets for optional attractions or additional tours",
      "Personal expenses (shopping, tips, etc.)"
    ],
    visa_information: "Singapore visa required.",
    required_documents: ["Passport copy", "Photo", "Bank statement"],
    important_notes: ["Includes entry ticket to Marina Bay Sands SkyPark + Gardens by the Bay (Flower Dome & Cloud Forest)"],
    terms_conditions: ["Prices per person based on pax."],
    source_pdf: "SOURCE PDF PAGE 47-48",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=75"],
    highlights: ["Marina Bay Sands SkyPark Observation Deck", "Gardens by the Bay Flower Dome & Cloud Forest", "Supertree Grove Light Show", "Half-Day Singapore City Tour"]
  },

  // 20. Combo (Singapore, Malaysia) (Page 49-51)
  {
    id: "pkg_azraq_20",
    destination_id: "dest_combo_sin_mys",
    destination_name: "Kuala Lumpur & Singapore",
    country: "Combo (Singapore, Malaysia)",
    package_name: "Malaysia & Singapore Basic -1",
    duration: "5 Night 6 Days",
    price: 31900,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 38500 },
      { pax: 4, price: 34100 },
      { pax: 6, price: 31900 }
    ],
    description: "3 Nights Malaysia + 2 Nights Singapore with daily breakfast, airport transfers, and half-day city tours in both capitals.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kuala Lumpur – Transfer to Hotel",
        activities: [
          "Arrival at Kuala Lumpur International Airport.",
          "Meet & greet by our local representative.",
          "Private/shared transfer to your 3-star hotel in Kuala Lumpur.",
          "Check-in and leisure time.",
          "Overnight stay in Kuala Lumpur."
        ],
        meals: "On own",
        overnight: "Kuala Lumpur Hotel"
      },
      {
        day: 2,
        title: "Half-Day Kuala Lumpur City Tour",
        activities: [
          "Breakfast at the hotel.",
          "Start your Half-Day Kuala Lumpur City Tour: KL Tower, Masjid Jamek, King Palace, National Museum, National Mosque.",
          "Return to hotel and relax.",
          "Free evening to explore the city or shopping.",
          "Overnight stay in Kuala Lumpur."
        ],
        meals: "Breakfast",
        overnight: "Kuala Lumpur Hotel"
      },
      {
        day: 3,
        title: "Leisure Day / Optional Tours (at own cost)",
        activities: [
          "Breakfast at hotel.",
          "Free day to relax or enjoy optional activities like: Sunway Lagoon Theme Park, Genting Highlands with Cable Car & Batu Caves, KL Tower or Aquaria KLCC.",
          "Overnight stay in Kuala Lumpur."
        ],
        meals: "Breakfast",
        overnight: "Kuala Lumpur Hotel"
      },
      {
        day: 4,
        title: "Departure from Kuala Lumpur to Singapore",
        activities: [
          "Arrival at Changi International Airport",
          "Meet & greet by local representative",
          "Private transfer to Ariana Hotel",
          "Check-in and relax",
          "Evening free for leisure or optional exploration (Jewel Changi, Bugis, etc.)"
        ],
        meals: "Breakfast in Malaysia",
        overnight: "Ariana Hotel Singapore"
      },
      {
        day: 5,
        title: "Half-Day Singapore City Tour",
        activities: [
          "Breakfast at hotel (if included)",
          "Join Half-Day Guided City Tour: Merlion Park, Chinatown, Little India.",
          "Tour Duration: Approx. 3.5–4 hours (morning)",
          "Afternoon and evening at leisure.",
          "Overnight stay in Singapore."
        ],
        meals: "Breakfast (if included)",
        overnight: "Ariana Hotel Singapore"
      },
      {
        day: 6,
        title: "Departure",
        activities: [
          "Breakfast at hotel (if included)",
          "Check-out from hotel",
          "Private transfer to Changi International Airport for departure"
        ],
        meals: "Breakfast (if included)",
        overnight: "Departure"
      }
    ],
    hotel: "3 Nights Malaysia Hotel + 2 Nights Singapore Hotel (Ariana Hotel or similar)",
    meals: "Daily breakfast included",
    transportation: "Airport Transfers (Arrival & Departure in both cities)",
    inclusions: [
      "2 Nights Singapore Hotel",
      "3 Nights Malaysia at Hotel (Twin/Triple sharing)",
      "Daily breakfast.",
      "Daily hotel taxes & service charges",
      "Airport Transfers (Arrival & Departure)",
      "Half-Day Singapore (Group basis)",
      "Malaysia City Tour (KL Tower, Masjid Jamek, King Palace, National Museum, National Mosque)"
    ],
    exclusions: [
      "Airfare",
      "Visa Fee",
      "Lunch & Dinner",
      "Entrance tickets for optional tours",
      "Personal expenses"
    ],
    visa_information: "Malaysia & Singapore eVisa required.",
    required_documents: ["Passports", "Photographs", "Bank statement"],
    important_notes: ["Includes guided city tours in both Kuala Lumpur and Singapore"],
    terms_conditions: ["Group tiered pricing."],
    source_pdf: "SOURCE PDF PAGE 49-51",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=75"],
    highlights: ["3 Nights KL + 2 Nights Singapore", "Kuala Lumpur Half-Day City Tour", "Singapore Merlion & Chinatown City Tour", "All Airport Return Transfers"]
  },

  // 21. Combo (Singapore, Malaysia) (Page 52-54)
  {
    id: "pkg_azraq_21",
    destination_id: "dest_combo_sin_mys",
    destination_name: "Kuala Lumpur, Genting & Singapore",
    country: "Combo (Singapore, Malaysia)",
    package_name: "Singapore & Malaysia Classic - 1",
    duration: "6 Night 7 Days",
    price: 48180,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 56870 },
      { pax: 4, price: 50050 },
      { pax: 6, price: 48180 }
    ],
    description: "6-Night, 7-Day premium classic with Genting Highlands & Batu Caves tour, Marina Bay Sands SkyPark & Gardens by the Bay tickets, and city tours.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kuala Lumpur",
        activities: [
          "Arrival at Kuala Lumpur International Airport",
          "Meet & Greet by our local representative",
          "Private/Shared transfer to 3-star hotel in Kuala Lumpur",
          "Check-in and leisure time",
          "Overnight stay in Kuala Lumpur"
        ],
        meals: "On own",
        overnight: "Kuala Lumpur Hotel"
      },
      {
        day: 2,
        title: "Half-Day Kuala Lumpur City Tour",
        activities: [
          "Breakfast at the hotel",
          "Start your Half-Day Kuala Lumpur City Tour",
          "Return to hotel and relax",
          "Free evening to explore the city or shopping",
          "Overnight stay in Kuala Lumpur"
        ],
        meals: "Breakfast",
        overnight: "Kuala Lumpur Hotel"
      },
      {
        day: 3,
        title: "Genting Highlands Tour (Enroute Batu Cave)",
        activities: [
          "Breakfast at the hotel",
          "Departure for Genting Highlands Tour (Enroute Batu Cave)",
          "Visit Batu Caves",
          "Continue to Genting Highlands",
          "Enjoy the cool mountain air, shopping, and entertainment options",
          "Return to Kuala Lumpur in the evening",
          "Overnight stay in Kuala Lumpur"
        ],
        meals: "Breakfast",
        overnight: "Kuala Lumpur Hotel"
      },
      {
        day: 4,
        title: "Departure from Kuala Lumpur To Singapore",
        activities: [
          "Early breakfast at the hotel",
          "Check-out from hotel",
          "Transfer to Kuala Lumpur International Airport",
          "Arrival at Changi International Airport",
          "Meet & greet by our representative",
          "Private transfer to your hotel",
          "Check-in at your hotel",
          "Evening at leisure (Optional: Explore Clarke Quay nightlife or take a River Cruise)",
          "Overnight stay in Singapore"
        ],
        meals: "Breakfast",
        overnight: "Singapore Hotel"
      },
      {
        day: 5,
        title: "Half-Day Singapore City Tour",
        activities: [
          "Breakfast at the hotel",
          "City Tour Highlights (4 to 6 hours)",
          "Afternoon free for leisure or shopping",
          "Overnight stay in Singapore"
        ],
        meals: "Breakfast",
        overnight: "Singapore Hotel"
      },
      {
        day: 6,
        title: "Marina Bay Sands SkyPark + Gardens by the Bay",
        activities: [
          "Breakfast at the hotel",
          "Morning free (Optional: Visit the Zoo or do a shopping tour)",
          "Afternoon/Evening visit to: Gardens by the Bay, Flower Dome & Cloud Forest, Supertree Grove light show (in the evening), Marina Bay Sands SkyPark Observation Deck",
          "Enjoy panoramic views of Singapore's skyline",
          "Return to hotel",
          "Overnight stay in Singapore"
        ],
        meals: "Breakfast",
        overnight: "Singapore Hotel"
      },
      {
        day: 7,
        title: "Departure",
        activities: [
          "Breakfast at the hotel",
          "Check-out from hotel",
          "Transfer to Changi Airport for your return flight"
        ],
        meals: "Breakfast",
        overnight: "Departure"
      }
    ],
    hotel: "3 Nights Hotel in KL + 3 Nights Hotel in Singapore",
    meals: "Daily breakfast at hotels",
    transportation: "Airport pick-up & drop-off in both cities + Genting Highlands transfer",
    inclusions: [
      "3 Nights accommodation at Hotel in KL & 3 Nights in Singapore",
      "Airport pick-up & drop-off",
      "Daily hotel taxes & service charges",
      "Half-Day Singapore City Tour (Group basis)",
      "Marina Bay Sands SkyPark + Gardens",
      "Half-Day Kuala Lumpur City Tour",
      "Genting Highlands Tour",
      "All taxes & service charges"
    ],
    exclusions: [
      "Air fare",
      "Visa Fee",
      "Lunch & Dinner",
      "Entrance tickets for optional tours",
      "Personal expenses"
    ],
    visa_information: "Malaysia & Singapore visas required.",
    required_documents: ["Passport copy", "Photo", "Bank statement"],
    important_notes: ["Includes Genting Highlands Tour with Batu Caves & Marina Bay Sands SkyPark + Gardens by the Bay tickets!"],
    terms_conditions: ["Group tiered pricing."],
    source_pdf: "SOURCE PDF PAGE 52-54",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=75"],
    highlights: ["Genting Highlands Tour en-route Batu Caves", "Marina Bay Sands SkyPark Observation Deck", "Gardens by the Bay Flower Dome & Cloud Forest", "Kuala Lumpur & Singapore City Tours"]
  }
];
