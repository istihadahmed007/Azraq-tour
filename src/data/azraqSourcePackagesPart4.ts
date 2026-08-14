import { TourPackage } from '../types';

export const AZRAQ_SOURCE_PACKAGES_PART4: TourPackage[] = [
  // 14. Nepal (Page 34-35)
  {
    id: "pkg_azraq_14",
    destination_id: "dest_nepal",
    destination_name: "Kathmandu",
    country: "Nepal",
    package_name: "Only Kathmandu - Group 1",
    duration: "3 Night 4 Days",
    price: 5390,
    currency: "BDT",
    pricing_tiers: [
      { pax: 6, price: 6270 },
      { pax: 10, price: 5390 }
    ],
    description: "3 Nights Kathmandu Group Tour with Thamel hotel, breakfast, airport transfers, and half-day city tour.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kathmandu",
        activities: [
          "Arrival at Tribhuvan International Airport",
          "Warm welcome and airport pickup by our representative",
          "Transfer to your hotel in Kathmandu",
          "Check-in and rest after your journey",
          "Free time in the evening – explore nearby local markets or relax at the hotel",
          "Overnight stay in Kathmandu"
        ],
        meals: "On own",
        overnight: "Kathmandu Hotel in Thamel"
      },
      {
        day: 2,
        title: "Half-Day City Tour",
        activities: [
          "Breakfast at the hotel",
          "Start your Half-Day Kathmandu City Tour",
          "Visit Swayambhunath Stupa (Monkey Temple) – panoramic views of the valley",
          "Explore the historic Kathmandu Durbar Square – temples, palaces, and local life",
          "Return to the hotel by afternoon",
          "Free time in the evening to relax or explore on your own",
          "Overnight stay in Kathmandu"
        ],
        meals: "Breakfast",
        overnight: "Kathmandu Hotel in Thamel"
      },
      {
        day: 3,
        title: "Free Day for Leisure / Optional Activities",
        activities: [
          "Enjoy breakfast at the hotel",
          "Day at leisure – explore Thamel, try local cuisine, or shop for souvenirs",
          "Optional add-ons (not included): Visit Pashupatinath Temple and Boudhanath Stupa, Go for a mountain flight for a view of the Himalayas (weather permitting)",
          "Overnight stay in Kathmandu"
        ],
        meals: "Breakfast",
        overnight: "Kathmandu Hotel in Thamel"
      },
      {
        day: 4,
        title: "Departure",
        activities: [
          "Breakfast at the hotel",
          "Check-out and airport drop-off for your onward journey",
          "Tour ends with unforgettable memories!"
        ],
        meals: "Breakfast",
        overnight: "Departure"
      }
    ],
    hotel: "3 Night Hotel in Thamel with breakfast",
    meals: "Daily Breakfast at hotel",
    transportation: "Airport pick and drop + Half day city tour transfer",
    inclusions: [
      "3 Night Hotel with breakfast at thamel",
      "Aiport pick and drop",
      "Half day city tour"
    ],
    exclusions: [
      "Air fare",
      "Lunch & Dinner",
      "Pesonal Expenses",
      "Any entry fees"
    ],
    visa_information: "Nepal visa on arrival for Bangladeshis.",
    required_documents: ["Passport copy", "Photographs"],
    important_notes: ["Special group pricing for 6 and 10 pax"],
    terms_conditions: ["Group minimum applies."],
    source_pdf: "SOURCE PDF PAGE 34-35",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"],
    highlights: ["3 Nights Hotel at Thamel with Breakfast", "Swayambhunath Monkey Temple & Durbar Square Tour", "Airport Return Transfers Included"]
  },

  // 15. Nepal (Page 36-37)
  {
    id: "pkg_azraq_15",
    destination_id: "dest_nepal",
    destination_name: "Kathmandu",
    country: "Nepal",
    package_name: "Only Kathmandu - Group 2",
    duration: "3 Night 4 Days",
    price: 4785,
    currency: "BDT",
    pricing_tiers: [
      { pax: 6, price: 5720 },
      { pax: 10, price: 4785 }
    ],
    description: "3 Nights Free & Easy Kathmandu Group Tour with Thamel hotel, breakfast, and airport transfers.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kathmandu",
        activities: [
          "Arrival at Tribhuvan International Airport",
          "Warm welcome and airport pickup by our representative",
          "Transfer to your hotel in Kathmandu",
          "Check-in and rest after your journey",
          "Free time in the evening – explore nearby local markets or relax at the hotel",
          "Overnight stay in Kathmandu"
        ],
        meals: "On own",
        overnight: "Kathmandu Hotel in Thamel"
      },
      {
        day: 2,
        title: "Free Day for Leisure",
        activities: [
          "Enjoy breakfast at the hotel",
          "Day at leisure – explore Thamel, try local cuisine, or shop for souvenirs",
          "Optional add-ons: Visit Pashupatinath Temple and Boudhanath Stupa",
          "Overnight stay in Kathmandu"
        ],
        meals: "Breakfast",
        overnight: "Kathmandu Hotel in Thamel"
      },
      {
        day: 3,
        title: "Free Day for Leisure / Optional Activities",
        activities: [
          "Enjoy breakfast at the hotel",
          "Day at leisure – explore Thamel, shopping or optional mountain flight",
          "Overnight stay in Kathmandu"
        ],
        meals: "Breakfast",
        overnight: "Kathmandu Hotel in Thamel"
      },
      {
        day: 4,
        title: "Departure",
        activities: [
          "Breakfast at the hotel",
          "Check-out and airport drop-off for your onward journey",
          "Tour ends with unforgettable memories!"
        ],
        meals: "Breakfast",
        overnight: "Departure"
      }
    ],
    hotel: "3 Night Hotel with breakfast at thamel",
    meals: "Daily Breakfast at hotel",
    transportation: "Airport pick and drop",
    inclusions: [
      "3 Night Hotel with breakfast at thamel",
      "Aiport pick and drop"
    ],
    exclusions: [
      "Air fare",
      "Lunch & Dinner",
      "Pesonal Expenses",
      "Any entry fees"
    ],
    visa_information: "Nepal on arrival visa.",
    required_documents: ["Passport copy"],
    important_notes: ["Ultra-budget group package for 6 & 10 pax."],
    terms_conditions: ["Based on group size."],
    source_pdf: "SOURCE PDF PAGE 36-37",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"],
    highlights: ["3 Nights Hotel at Thamel", "Daily Breakfast Included", "Airport Return Pick & Drop"]
  },

  // 16. Malaysia (Page 38-39)
  {
    id: "pkg_azraq_16",
    destination_id: "dest_malaysia",
    destination_name: "Kuala Lumpur",
    country: "Malaysia",
    package_name: "Malaysia - Basic 3",
    duration: "3 Night 4 Days",
    price: 14850,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 14850 }
    ],
    description: "3 Nights Kuala Lumpur free & easy with private airport transfers and daily breakfast at 3-star hotel.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kuala Lumpur",
        activities: [
          "Arrive at Kuala Lumpur International Airport",
          "Meet & Greet by driver at the airport",
          "Private transfer to Hotel",
          "Check-in to hotel",
          "Rest of the day free at leisure to explore Bukit Bintang area (shopping, local food, nightlife)",
          "Overnight stay at Hotel"
        ],
        meals: "On own",
        overnight: "3* Hotel in Kuala Lumpur"
      },
      {
        day: 2,
        title: "Free Day in Kuala Lumpur",
        activities: [
          "Breakfast at the hotel",
          "Full day free for your own activities",
          "Suggested: Visit Petronas Twin Towers, KL Tower, Pavilion Mall, Central Market, Jalan Alor Night Market",
          "Overnight stay at Hotel"
        ],
        meals: "Breakfast",
        overnight: "3* Hotel in Kuala Lumpur"
      },
      {
        day: 3,
        title: "Free Day in Kuala Lumpur",
        activities: [
          "Breakfast at the hotel",
          "Another full day for leisure",
          "Suggested optional tours (at extra cost): Genting Highlands, Batu Caves, KL City Tour",
          "Overnight stay at Hotel"
        ],
        meals: "Breakfast",
        overnight: "3* Hotel in Kuala Lumpur"
      },
      {
        day: 4,
        title: "Departure",
        activities: [
          "Breakfast at the hotel",
          "Check-out from hotel",
          "Private transfer to Kuala Lumpur International Airport for your flight"
        ],
        meals: "Breakfast",
        overnight: "Departure"
      }
    ],
    hotel: "3 Nights accommodation at 3* Hotel (Double or Twin Share Basis)",
    meals: "Daily Breakfast",
    transportation: "Transfers on private basis (Airport Pick-up and Drop-off)",
    inclusions: [
      "Airport Pick-up and Drop-off",
      "3 Nights accommodation at 3* Hotel",
      "Daily Breakfast",
      "Transfers on private basis",
      "Hotels & Accommodation: 3* Hotel. (Hotel room Double or Twin Share Basis)",
      "All hotel tax, VAT, and service charges"
    ],
    exclusions: [
      "Airfare",
      "Malaysia Visa Fee",
      "Lunch & Dinner",
      "Entrance tickets for optional tours",
      "Personal expenses",
      "Sightseeing tours or activities",
      "Anything not mentioned under Inclusions"
    ],
    visa_information: "Malaysia eVisa required.",
    required_documents: ["Passport copy", "Photo", "Bank statement"],
    important_notes: ["Transfers on private basis"],
    terms_conditions: ["Price per person for 2 pax."],
    source_pdf: "SOURCE PDF PAGE 38-39",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80"],
    highlights: ["3 Nights 3* Hotel Stay", "Private Airport Return Transfers", "Daily Breakfast Included", "Free days for Bukit Bintang & KLCC exploration"]
  },

  // 17. Bhutan (Page 40-42)
  {
    id: "pkg_azraq_17",
    destination_id: "dest_bhutan",
    destination_name: "Thimphu & Paro",
    country: "Bhutan",
    package_name: "Bhutan - Thimphu,Paro",
    duration: "3 Night 4 Days",
    price: 22990,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 35200 },
      { pax: 4, price: 26950 },
      { pax: 7, price: 24970 },
      { pax: 10, price: 22990 }
    ],
    description: "3-Night Bhutan package with SDF fee, licensed guide, private car, covering Thimphu Memorial Chorten, Buddha Dordenma, Paro Dzong, and Chele La Pass.",
    itinerary: [
      {
        day: 1,
        title: "Arrival at Paro International Airport – Transfer to Thimphu",
        activities: [
          "Upon arrival at Paro International Airport, meet Oma Tours & Travels representative. Permit assistance.",
          "Scenic drive along Issuna river with brief stop at Chuzom confluence.",
          "Check-in at Thimphu hotel.",
          "Visit National Memorial Chorten (Tibetan-style stupa).",
          "Explore Authentic Bhutanese Crafts Bazaar.",
          "Overnight stay: Thimphu"
        ],
        meals: "On own",
        overnight: "Thimphu: Bd hotel/Layel n similar"
      },
      {
        day: 2,
        title: "Thimphu Sightseeing – Transfer to Paro",
        activities: [
          "After breakfast, visit Buddha Dordenma Statue (169-foot tall golden statue with 125,000 mini Buddhas).",
          "Visit Takin Preserve Centre at Motithang to see Bhutan’s national animal.",
          "Depart for Paro: Paro Airport Viewpoint, Kichu Lhakhang (7th-century sacred temple), National Museum of Bhutan (Ta Dzong), Rinpung Dzong fortress.",
          "Overnight stay: Paro"
        ],
        meals: "Breakfast",
        overnight: "Paro: Padma gayel / Penchu hotel similar"
      },
      {
        day: 3,
        title: "Excursion to Chele La Pass – Explore Paro",
        activities: [
          "Scenic drive to Chele La Pass (3,988 meters / 13,000 feet) - highest motorable pass in Bhutan with Mt. Jomolhari views.",
          "Short trek amidst alpine meadows and prayer flags.",
          "Evening stroll around Paro town and local cafes.",
          "Overnight stay: Paro"
        ],
        meals: "Breakfast",
        overnight: "Paro: Padma gayel / Penchu hotel similar"
      },
      {
        day: 4,
        title: "Departure",
        activities: [
          "After breakfast, complete checkout.",
          "Transfer to Paro International Airport for departure flight."
        ],
        meals: "Breakfast",
        overnight: "Departure"
      }
    ],
    hotel: "Thimphu: Bd hotel/Layel n similar | Paro: Padma gayel / Penchu hotelsimilar",
    meals: "Daily Breakfast included",
    transportation: "Private Bhutanese vehicle with licensed driver",
    inclusions: [
      "Sustainable Development Fee (SDF)",
      "Accommodation in 3-star hotels approved by the Tourism Council of Bhutan",
      "English-speaking licensed guide",
      "Private Bhutanese vehicle with licensed driver (for the itinerary)",
      "Breakfast",
      "Entry permits to municipal areas"
    ],
    exclusions: [
      "Flight tickets of any kind",
      "Entrance fees to sightseeing places",
      "Personal expenses (shopping, tips, etc.)",
      "Extra activities outside the itinerary",
      "Any service not specifically mentioned under Package Inclusions"
    ],
    visa_information: "Bhutan SDF and entry permit included.",
    required_documents: ["Passport copy with 6 months validity", "Passport photo"],
    important_notes: ["SDF (Sustainable Development Fee) is fully included in the price!"],
    terms_conditions: ["Subject to weather on mountain passes."],
    source_pdf: "SOURCE PDF PAGE 40-42",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80"],
    highlights: ["SDF Fee Included", "Buddha Dordenma 169ft Statue", "Chele La Pass (3,988m Altitude)", "Licensed English Guide & Private Car"]
  }
];
