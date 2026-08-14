import { TourPackage } from '../types';

export const AZRAQ_SOURCE_PACKAGES_PART7: TourPackage[] = [
  // 26. Combo (Maldives, Srilanka) (Page 64-66)
  {
    id: "pkg_azraq_26",
    destination_id: "dest_combo_maldives_sl",
    destination_name: "Maafushi, Hulhumale, Kandy, Nuwara Eliya, Colombo",
    country: "Combo (Maldives, Srilanka)",
    package_name: "Maafushi, Hulhumale, Kandy, Nuwara Eliya, Colombo (3*)",
    duration: "6 Night 7 Days",
    price: 56650,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 65450 },
      { pax: 4, price: 56650 }
    ],
    description: "6-Night, 7-Day grand journey: 2 Nights Maafushi Island, 1 Night Hulhumale, 1 Night Kandy, 1 Night Nuwara Eliya, 1 Night Colombo with breakfast, speedboat, and private transport.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Maldives – Transfer to Maafushi Island",
        activities: [
          "Meet & Greet at Velana International Airport (Malé).",
          "Speedboat transfer to Maafushi Island (Approx. 30-40 mins).",
          "Check-in to your 3-star hotel in Maafushi.",
          "Free time to relax or explore the island beach, local shops, or join optional water activities.",
          "Overnight stay in Maafushi."
        ],
        meals: "On own",
        overnight: "Maafushi 3-Star Hotel"
      },
      {
        day: 2,
        title: "Leisure Day in Maafushi",
        activities: [
          "Breakfast at the hotel.",
          "Full day free to explore Maafushi at your own pace.",
          "Optional activities: Snorkeling, Sandbank Tour, Dolphin Cruise, Scuba Diving.",
          "Overnight stay in Maafushi."
        ],
        meals: "Breakfast",
        overnight: "Maafushi 3-Star Hotel"
      },
      {
        day: 3,
        title: "Transfer to Hulhumale",
        activities: [
          "Breakfast at the hotel.",
          "Speedboat transfer back to Malé and short transfer to Hulhumale.",
          "Check-in at your 3-star hotel in Hulhumale.",
          "Leisure time to explore Hulhumale beach or enjoy a local café.",
          "Overnight stay in Hulhumale."
        ],
        meals: "Breakfast",
        overnight: "Hulhumale 3-Star Hotel"
      },
      {
        day: 4,
        title: "Fly to Sri Lanka – Transfer to Kandy",
        activities: [
          "Early breakfast and transfer to Malé Airport for flight to Colombo (Flight not included).",
          "Arrival at Bandaranaike International Airport, Sri Lanka.",
          "Private transfer to Kandy with en route visit to Pinnawala Elephant Orphanage (optional).",
          "Check-in to 3-star hotel in Kandy.",
          "Overnight stay in Kandy."
        ],
        meals: "Breakfast",
        overnight: "Kandy 3-Star Hotel"
      },
      {
        day: 5,
        title: "Kandy to Nuwara Eliya",
        activities: [
          "Breakfast at the hotel.",
          "Sightseeing in Kandy: Temple of the Sacred Tooth Relic, Kandy Lake, Gem Museum.",
          "Scenic drive to Nuwara Eliya through tea plantations and waterfalls; visit a tea factory en route.",
          "Check-in at 3-star hotel in Nuwara Eliya.",
          "Overnight stay in Nuwara Eliya."
        ],
        meals: "Breakfast",
        overnight: "Nuwara Eliya 3-Star Hotel"
      },
      {
        day: 6,
        title: "Nuwara Eliya to Colombo",
        activities: [
          "Breakfast at the hotel.",
          "Drive to Colombo (approx. 5 hours).",
          "Check-in to deluxe room at a 3-star hotel in Colombo.",
          "Guided city tour of Colombo: Galle Face Green, Independence Square, Gangaramaya Temple, St. Clair waterfalls, Devon waterfalls.",
          "Explore Pettah Market and shopping malls.",
          "Overnight: Colombo hotel."
        ],
        meals: "Breakfast",
        overnight: "Colombo 3-Star Hotel"
      },
      {
        day: 7,
        title: "Transfer to Colombo – Departure",
        activities: [
          "Breakfast at the hotel.",
          "Transfer to your departure location (airport)."
        ],
        meals: "Breakfast",
        overnight: "Departure"
      }
    ],
    hotel: "2N Maafushi + 1N Hulhumale + 1N Kandy + 1N Nuwara Eliya + 1N Colombo (100% 3-star hotels)",
    meals: "Daily breakfast at all hotels",
    transportation: "Speedboat transfers in Maldives, private AC transportation in Sri Lanka with airport pick and drop",
    inclusions: [
      "2 Nights in Maafushi (100% 3-star hotel with breakfast)",
      "1 Night in Hulhumale (3-star hotel with breakfast)",
      "Speedboat transfers in Maldives",
      "Airport Pick and Drop at Maldives",
      "1 Night in Kandy (3-star hotel with breakfast)",
      "1 Night in Nuwara Eliya (3-star hotel with breakfast)",
      "1 Night in Colombo (100% 3-star hotel with breakfast)",
      "Private transportation in Sri Lanka",
      "Sightseeing tours as per itinerary",
      "Local taxes and tolls",
      "Airport Pick and Drop at Sri Lanka",
      "Tour assistance throughout the trip"
    ],
    exclusions: [
      "Air tickets.",
      "Visa fees.",
      "Entry fees to attractions.",
      "Lunch, dinner, and other meals not mentioned.",
      "Personal expenses (e.g., shopping, tips)."
    ],
    visa_information: "Maldives free on arrival, Sri Lanka ETA.",
    required_documents: ["Passports", "Photographs"],
    important_notes: ["Comprehensive multi-destination island and hill country expedition"],
    terms_conditions: ["Group tiered pricing."],
    source_pdf: "SOURCE PDF PAGE 64-66",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80"],
    highlights: ["Speedboat to Maafushi Island (2 Nights)", "Hulhumale Beach Stay", "Kandy Temple of the Tooth", "Nuwara Eliya Tea Gardens & Waterfalls", "Colombo City Tour"]
  },

  // 27. Indonesia (Page 67-69)
  {
    id: "pkg_azraq_27",
    destination_id: "dest_indonesia",
    destination_name: "Ubud & Kuta, Bali",
    country: "Indonesia",
    package_name: "Magical Bali Tour",
    duration: "5 Night 6 Days",
    price: 76450,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 76450 }
    ],
    description: "5 Nights Bali adventure with ATV Ride & White Water Rafting, Kintamani Volcano, Uluwatu Sunset Kecak Dance & Jimbaran Seafood BBQ.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Bali – Transfer to Ubud",
        activities: [
          "Arrive at Ngurah Rai International Airport, Denpasar.",
          "Meet & greet by our local representative.",
          "Transfer to Kiskenda Cottage Ubud (3-star) – Superior Room.",
          "Check-in and rest of the day free at leisure."
        ],
        meals: "On own",
        overnight: "Kiskenda Cottage Ubud"
      },
      {
        day: 2,
        title: "Ubud Highlights & Kintamani Volcano Tour (B, L)",
        activities: [
          "Visit to Ubud Royal Palace.",
          "Explore Tegallalang Rice Terraces.",
          "Scenic drive to Kintamani for breathtaking views of Mount Batur.",
          "Coffee Plantation Visit.",
          "Explore the sacred Tirta Empul Temple (Holy Spring Temple).",
          "Return to hotel and overnight in Ubud."
        ],
        meals: "Breakfast & Lunch",
        overnight: "Kiskenda Cottage Ubud"
      },
      {
        day: 3,
        title: "Bali Adventure – ATV Ride & White Water Rafting (B, L)",
        activities: [
          "Checkout and experience Bali’s longest ATV trek through rice fields, jungle, rivers, and Balinese villages.",
          "Continue with a thrilling Ayung River White Water Rafting Adventure (Class 2–3 rapids with expert guides, waterfalls & jungle scenery).",
          "Transfer to Sun Island Hotel, Kuta (4-star) – Deluxe Room.",
          "Overnight in Kuta."
        ],
        meals: "Breakfast & Lunch",
        overnight: "Sun Island Hotel Kuta (4-star)"
      },
      {
        day: 4,
        title: "Uluwatu Temple Sunset Tour & Kecak Dance (B, D)",
        activities: [
          "Afternoon drive to Uluwatu Temple perched on a cliff over the ocean.",
          "Witness a stunning Bali sunset.",
          "Enjoy the iconic Kecak Dance performance.",
          "End the evening with a BBQ Seafood Dinner at Jimbaran Beach.",
          "Return and overnight in Kuta."
        ],
        meals: "Breakfast & BBQ Seafood Dinner",
        overnight: "Sun Island Hotel Kuta"
      },
      {
        day: 5,
        title: "Leisure Day in Kuta (B)",
        activities: [
          "Free day to relax, shop or enjoy the beach.",
          "Optional activities available on request.",
          "Overnight in Kuta."
        ],
        meals: "Breakfast",
        overnight: "Sun Island Hotel Kuta"
      },
      {
        day: 6,
        title: "Departure from Bali (B)",
        activities: [
          "Check-out and transfer to Ngurah Rai International Airport.",
          "End of an unforgettable Bali holiday."
        ],
        meals: "Breakfast",
        overnight: "Departure"
      }
    ],
    hotel: "2 Nights Kiskenda Cottage Ubud (3*) + 3 Nights Sun Island Hotel Kuta (4*)",
    meals: "Daily Breakfast, 2 Lunches & 1 Jimbaran BBQ Seafood Dinner",
    transportation: "All Tours & Transfers in Private AC Vehicle with Professional English-Speaking Guide",
    inclusions: [
      "5 Nights Hotel Accommodation with Daily Breakfast",
      "All Tours & Transfers in Private AC Vehicle",
      "Professional English-Speaking Guide",
      "Lunches & Dinner as mentioned",
      "Entrance & Parking Fees",
      "Mineral Water during tours",
      "Bali ATV Ride & Ayung River White Water Rafting",
      "Uluwatu Kecak Dance & Jimbaran Seafood BBQ"
    ],
    exclusions: [
      "International Airfare & Visa",
      "Personal Expenses (Laundry, Tips, Beverages)",
      "Travel Insurance",
      "Anything not mentioned in inclusions"
    ],
    visa_information: "Indonesia visa on arrival / e-VOA.",
    required_documents: ["Passport copy", "Photographs"],
    important_notes: ["Includes ATV Ride & Ayung River Rafting + Jimbaran BBQ Dinner!"],
    terms_conditions: ["Price per person for 2 pax."],
    source_pdf: "SOURCE PDF PAGE 67-69",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80"],
    highlights: ["ATV Jungle Trek & Ayung River Rafting", "Kintamani Volcano & Tegallalang Rice Terraces", "Uluwatu Cliff Sunset & Kecak Fire Dance", "Jimbaran Beach Candlelight Seafood BBQ"]
  },

  // 28. Indonesia (Page 70-71)
  {
    id: "pkg_azraq_28",
    destination_id: "dest_indonesia",
    destination_name: "Ubud & Uluwatu, Bali",
    country: "Indonesia",
    package_name: "Bali (3N/4D)",
    duration: "3 Night 4 Days",
    price: 28600,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 39050 },
      { pax: 4, price: 32450 },
      { pax: 6, price: 28600 }
    ],
    description: "3-Night Bali tour covering Ubud Palace, Kintamani Mount Batur volcano, Tirta Empul, and Uluwatu Sunset Kecak Dance.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Bali – Transfer to Hotel",
        activities: [
          "Welcome to Indonesia! Upon arrival at Ngurah Rai International Airport (Bali), meet guide.",
          "Transfer to hotel for check-in and overnight stay."
        ],
        meals: "On own",
        overnight: "Bali Hotel"
      },
      {
        day: 2,
        title: "Ubud – Kintamani – Tirta Empul Temple (B)",
        activities: [
          "Visit Ubud Palace, known for traditional Balinese architecture and royal heritage.",
          "Drive to Kintamani with panoramic views of Mount Batur and Lake Batur.",
          "Continue to Tirta Empul, the Holy Spring Temple famed for sacred purification rituals.",
          "Return to hotel in afternoon and enjoy evening at leisure."
        ],
        meals: "Breakfast",
        overnight: "Bali Hotel"
      },
      {
        day: 3,
        title: "Uluwatu Temple – Kecak Dance Performance (B)",
        activities: [
          "Morning at leisure.",
          "Afternoon visit to Uluwatu Temple, perched atop a dramatic sea cliff overlooking the Indian Ocean.",
          "Enjoy the iconic Kecak Dance at sunset with ocean views.",
          "Return to hotel for overnight stay."
        ],
        meals: "Breakfast",
        overnight: "Bali Hotel"
      },
      {
        day: 4,
        title: "Departure from Bali (B)",
        activities: [
          "Enjoy breakfast at the hotel.",
          "Transfer to Bali International Airport for return flight."
        ],
        meals: "Breakfast",
        overnight: "Departure"
      }
    ],
    hotel: "3 nights’ hotel with daily breakfast (twin sharing basis)",
    meals: "Daily Breakfast",
    transportation: "Private air-conditioned transportation throughout the tour with English-speaking guide",
    inclusions: [
      "Private air-conditioned transportation throughout the tour",
      "3 nights’ hotel with daily breakfast (twin sharing basis)",
      "Tours and meals as per itinerary",
      "Mineral water during tours",
      "Entrance and parking fees as mentioned",
      "English-speaking guide"
    ],
    exclusions: [
      "High and peak season surcharges",
      "Personal expenses: soft drinks, alcohol, laundry, etc.",
      "Travel insurance",
      "Tips and gratuities for guide and driver",
      "Telecommunication charges",
      "Visa fees",
      "Air Ticket"
    ],
    visa_information: "Indonesia e-VOA on arrival.",
    required_documents: ["Passport copy", "Photo"],
    important_notes: ["Includes Uluwatu Kecak Dance ticket & entrance fees"],
    terms_conditions: ["Group tiered pricing."],
    source_pdf: "SOURCE PDF PAGE 70-71",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80"],
    highlights: ["Ubud Palace & Tirta Empul Holy Springs", "Kintamani Volcano & Lake Batur Views", "Uluwatu Sea Cliff Sunset & Kecak Dance", "English Speaking Guide & AC Transport"]
  },

  // 29. Combo (Thailand, Singapure, Malaysia) (Page 72-73)
  {
    id: "pkg_azraq_29",
    destination_id: "dest_combo_sea",
    destination_name: "Kuala Lumpur, Singapore & Bangkok",
    country: "Combo (Thailand, Singapure, Malaysia)",
    package_name: "Thailand, Malaysia, Singapore (Free & Easy 6N/7D)",
    duration: "6 Night 7 Days",
    price: 35750,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 35750 }
    ],
    description: "6-Night, 7-Day Free & Easy trination package with 2N Kuala Lumpur, 2N Singapore, 2N Bangkok, breakfast, and all 3 airport transfers.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kuala Lumpur, Malaysia",
        activities: [
          "Arrival at Kuala Lumpur Airport. Meet chauffeur guide for airport transfer to hotel.",
          "Check-in at Kuala Lumpur hotel and leisure time.",
          "Overnight in Kuala Lumpur."
        ],
        meals: "On own",
        overnight: "Kuala Lumpur Hotel"
      },
      {
        day: 2,
        title: "Kuala Lumpur Free Day",
        activities: ["Breakfast at hotel. Full day free for leisure.", "Overnight in Kuala Lumpur."],
        meals: "Breakfast",
        overnight: "Kuala Lumpur Hotel"
      },
      {
        day: 3,
        title: "Transfer to Singapore (By Road)",
        activities: [
          "Breakfast at hotel and checkout.",
          "Scenic road transfer to Singapore (approx 4-5 hours).",
          "Check-in at Singapore hotel.",
          "Overnight in Singapore."
        ],
        meals: "Breakfast",
        overnight: "Singapore Hotel"
      },
      {
        day: 4,
        title: "Singapore Free day",
        activities: ["Breakfast at hotel. Free day for leisure, shopping or Sentosa.", "Overnight in Singapore."],
        meals: "Breakfast",
        overnight: "Singapore Hotel"
      },
      {
        day: 5,
        title: "Fly to Bangkok, Thailand",
        activities: [
          "Breakfast at hotel and checkout.",
          "Transfer to Singapore Airport for flight to Bangkok.",
          "Arrival at Bangkok Airport and hotel transfer.",
          "Overnight in Bangkok."
        ],
        meals: "Breakfast",
        overnight: "Bangkok Hotel"
      },
      {
        day: 6,
        title: "Bangkok City Tour / Free Day",
        activities: ["Breakfast at hotel. Free day in Bangkok for shopping and temples.", "Overnight in Bangkok."],
        meals: "Breakfast",
        overnight: "Bangkok Hotel"
      },
      {
        day: 7,
        title: "Departure from Bangkok",
        activities: [
          "Breakfast at hotel and checkout.",
          "Transfer to Bangkok Airport for departure.",
          "End of tour."
        ],
        meals: "Breakfast",
        overnight: "Departure"
      }
    ],
    hotel: "2N Kuala Lumpur + 2N Singapore + 2N Bangkok (with breakfast)",
    meals: "Daily breakfast at all hotels",
    transportation: "Malaysia, Singapore & Bangkok Airport pick-up and drop",
    inclusions: [
      "2 nights at Kuala Lumpur with breakfast",
      "2 nights at Singapore with breakfast",
      "2 nights at Bangkok with breakfast",
      "Malasia Airport pick-up and drop",
      "Singapore Airport pick-up and drop",
      "Bangkok Airport pick-up and drop"
    ],
    exclusions: [
      "Air Ticket (DAC-KUL,SIN-BKK, BKK-DAC) approx. 40,000 to 55,000 taka/per person",
      "Meals not mentioned in the itinerary.",
      "Entry fees for optional attractions.",
      "Road transfer from Kuala Lumpur to Singapore. Approx. 2800-3500 taka/per person"
    ],
    visa_information: "Malaysia, Singapore, Thailand visas required.",
    required_documents: ["Passport copy", "Photo", "Bank statement"],
    important_notes: ["Budget-friendly Free & Easy Trination combination"],
    terms_conditions: ["Price per person for 2 pax."],
    source_pdf: "SOURCE PDF PAGE 72-73",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=1200&q=80"],
    highlights: ["2 Nights KL + 2 Nights Singapore + 2 Nights Bangkok", "Daily Breakfast Included", "All 3 International Airport Transfers"]
  }
];
