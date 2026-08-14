import { TourPackage } from '../types';

export const AZRAQ_SOURCE_PACKAGES_PART6: TourPackage[] = [
  // 22. Combo (Singapore, Malaysia) (Page 55-56)
  {
    id: "pkg_azraq_22",
    destination_id: "dest_combo_sin_mys",
    destination_name: "Kuala Lumpur & Singapore",
    country: "Combo (Singapore, Malaysia)",
    package_name: "Malaysia & Singapore Basic -2",
    duration: "4 Night 5 Days",
    price: 23870,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 29590 },
      { pax: 4, price: 25850 },
      { pax: 6, price: 23870 }
    ],
    description: "4-Night, 5-Day combo with 2 Nights Kuala Lumpur & 2 Nights Singapore (3-star hotels) with Malaysia breakfast and transfers.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kuala Lumpur",
        activities: [
          "Arrive at Kuala Lumpur International Airport",
          "Meet & greet with airport pickup",
          "Transfer to your 3-star hotel, check-in & rest",
          "Optional evening: Visit Petronas Twin Towers, KL Tower, or explore local night markets",
          "Overnight in Kuala Lumpur"
        ],
        meals: "On own",
        overnight: "Kuala Lumpur 3-Star Hotel"
      },
      {
        day: 2,
        title: "Kuala Lumpur – Free Day / Optional Tours",
        activities: [
          "Enjoy breakfast at the hotel",
          "Day free for personal activities or optional tours: Batu Caves & Genting Highlands (with cable car ride), Sunway Lagoon Theme Park, KL City Half-Day Tour",
          "Overnight in Kuala Lumpur"
        ],
        meals: "Breakfast",
        overnight: "Kuala Lumpur 3-Star Hotel"
      },
      {
        day: 3,
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
        day: 4,
        title: "Singapore – Free Day / Optional Activities",
        activities: [
          "Day is free to explore Singapore at your own pace",
          "Optional Tours (extra cost): Universal Studios Singapore, Sentosa Island Tour (Cable Car + Wings of Time), Gardens by the Bay & Marina Bay Sands SkyPark, Singapore Zoo or Night Safari",
          "Overnight in Singapore"
        ],
        meals: "On own",
        overnight: "Ariana Hotel Singapore"
      },
      {
        day: 5,
        title: "Departure from Singapore",
        activities: [
          "Check-out and transfer to Singapore Changi Airport for your return flight"
        ],
        meals: "On own",
        overnight: "Departure"
      }
    ],
    hotel: "2 nights in Kuala Lumpur (3-star hotel) + 2 nights in Singapore (3-star hotel)",
    meals: "Daily breakfast at Malaysia hotels Only",
    transportation: "Airport pick-up in Kuala Lumpur & drop-off in Singapore",
    inclusions: [
      "2 nights in Kuala Lumpur (3-star hotel)",
      "2 nights in Singapore (3-star hotel)",
      "Daily breakfast at Malaysia hotels Only",
      "Airport pick-up in Kuala Lumpur & drop-off in Singapore"
    ],
    exclusions: [
      "Lunches, dinners, breakfast in Singapore and personal expenses",
      "Visa fees Air tickets (if applicable)",
      "Entry tickets for optional tours"
    ],
    visa_information: "Malaysia & Singapore visas required.",
    required_documents: ["Passport copy", "Photo", "Bank statement"],
    important_notes: ["Breakfast included at Malaysia hotel only."],
    terms_conditions: ["Group tiered pricing."],
    source_pdf: "SOURCE PDF PAGE 55-56",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80"],
    highlights: ["2 Nights Kuala Lumpur 3-Star Hotel", "2 Nights Singapore 3-Star Hotel", "KL Airport Pick-up & Singapore Drop-off"]
  },

  // 23. Thailand (Page 57-58)
  {
    id: "pkg_azraq_23",
    destination_id: "dest_thailand",
    destination_name: "Bangkok",
    country: "Thailand",
    package_name: "Only Bangkok With City Tour",
    duration: "2 Night 3 Days",
    price: 12650,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 15400 },
      { pax: 4, price: 12925 },
      { pax: 6, price: 12650 }
    ],
    description: "2-Night Bangkok getaway with Half-Day City & Temple Tour (Wat Traimit, Wat Pho, Wat Arun) and airport transfers.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Bangkok & Leisure",
        activities: [
          "Arrival at Suvarnabhumi or Don Mueang Airport",
          "Airport Pick-Up by private/shared transfer",
          "Check-in to your 3-star hotel (standard check-in: 2 PM)",
          "Afternoon at leisure – relax or explore nearby markets (suggested: Terminal 21 or MBK Mall)",
          "Evening (Optional): Visit Asiatique Riverfront or watch Siam Niramit show (on your own)",
          "Overnight at hotel"
        ],
        meals: "On own",
        overnight: "Bangkok 3-Star Hotel"
      },
      {
        day: 2,
        title: "Bangkok City Tour",
        activities: [
          "Breakfast at hotel",
          "Pick-up from hotel for a Half-Day Bangkok City & Temple Tour, including: Wat Traimit (Temple of the Golden Buddha), Wat Pho (Reclining Buddha), Wat Arun (Temple of Dawn), Pass by the Grand Palace and other historical landmarks",
          "Return to hotel around midday",
          "Afternoon: Free time for shopping or exploring on your own (suggested: Siam Paragon, Chatuchak Market, or local cafes)",
          "Evening: Optional activities like a Thai massage or visiting a rooftop bar",
          "Overnight at hotel"
        ],
        meals: "Breakfast",
        overnight: "Bangkok 3-Star Hotel"
      },
      {
        day: 3,
        title: "Departure",
        activities: [
          "Breakfast at hotel",
          "Check-out (usually by 12 PM)",
          "Airport Drop for your onward flight"
        ],
        meals: "Breakfast",
        overnight: "Departure"
      }
    ],
    hotel: "2 Nights stay at 3-star hotel in Bangkok with breakfast",
    meals: "Daily Breakfast at hotel",
    transportation: "Airport transfers (Pick-up & Drop)",
    inclusions: [
      "2 Nights stay at 3-star hotel in Bangkok with breakfast",
      "Airport transfers (Pick-up & Drop)",
      "Half-day Bangkok City Tour"
    ],
    exclusions: [
      "Airticket",
      "Visa",
      "Entry fees",
      "Any personal expenses."
    ],
    visa_information: "Thailand tourist visa required.",
    required_documents: ["Passport copy", "Photo", "Bank statement"],
    important_notes: ["Half-day city tour covers Wat Traimit, Wat Pho & Wat Arun external"],
    terms_conditions: ["Group tiered pricing."],
    source_pdf: "SOURCE PDF PAGE 57-58",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80"],
    highlights: ["Half-Day Bangkok Temple & City Tour", "Wat Traimit & Wat Pho Reclining Buddha", "2 Nights 3-Star Hotel with Breakfast", "Airport Return Transfers"]
  },

  // 24. Srilanka (Page 59-61)
  {
    id: "pkg_azraq_24",
    destination_id: "dest_srilanka",
    destination_name: "Colombo",
    country: "Srilanka",
    package_name: "Colombo - Standard Hotel",
    duration: "2 Night 3 Days",
    price: 20350,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 20350 }
    ],
    description: "2 Nights Colombo stay at BEST WESTERN with daily breakfast & dinner, private transfers with chauffeur guide, and Colombo city tour.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Sri Lanka – Transfer to Colombo",
        activities: [
          "Welcome to Sri Lanka! Arrival at Bandaranaike International Airport (BIA), meet dedicated chauffeur/guide.",
          "Transfer to your hotel in Colombo.",
          "Check-in and refresh after your journey. Relax at leisure.",
          "Evening: Enjoy a delicious dinner at the hotel.",
          "Overnight Stay: Colombo (BEST WESTERN)"
        ],
        meals: "Dinner at hotel",
        overnight: "BEST WESTERN Colombo"
      },
      {
        day: 2,
        title: "Colombo City Exploration",
        activities: [
          "Start your day with a leisurely breakfast at the hotel.",
          "City Tour Highlights: Old Parliament Building, New Parliament (Diyatha Uyana vicinity), BMICH, Independence Square, Gangaramaya Temple, Lotus Tower.",
          "Afternoon: Shopping experience at Colombo City Centre, One Galle Face Mall, Dutch Hospital Shopping Precinct.",
          "Evening dinner at the hotel or recommended restaurant.",
          "Overnight Stay: Colombo (BEST WESTERN)"
        ],
        meals: "Breakfast & Dinner",
        overnight: "BEST WESTERN Colombo"
      },
      {
        day: 3,
        title: "Departure from Colombo",
        activities: [
          "Relish your final breakfast in Sri Lanka.",
          "Check-out from the hotel and airport transfer."
        ],
        meals: "Breakfast",
        overnight: "Departure"
      }
    ],
    hotel: "BEST WESTERN Colombo (2 nights’ accommodation)",
    meals: "Daily breakfast and dinner included (Half Board)",
    transportation: "Private transfers with a chauffeur/guide + Airport pick-up and drop-off",
    inclusions: [
      "Airport pick-up and drop-off",
      "Private transfers with a chauffeur/guide",
      "2 nights’ accommodation in Colombo",
      "Daily breakfast and dinner",
      "Colombo city tour and shopping experience"
    ],
    exclusions: [
      "Air Ticket",
      "Visa",
      "Personal expenses",
      "Entry fees."
    ],
    visa_information: "Sri Lanka ETA required.",
    required_documents: ["Passport copy", "Photo"],
    important_notes: ["Hotel: BEST WESTERN Colombo with Daily Breakfast & Dinner!"],
    terms_conditions: ["Price per person for 2 pax."],
    source_pdf: "SOURCE PDF PAGE 59-61",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1588258524675-c61919a008c2?auto=format&fit=crop&w=1200&q=80"],
    highlights: ["BEST WESTERN Colombo 4-Star Hotel", "Daily Breakfast & Dinner (Half Board) Included", "Colombo City Tour & Lotus Tower Exploration", "Private Transfers with Chauffeur Guide"]
  },

  // 25. Thailand (Page 62-63)
  {
    id: "pkg_azraq_25",
    destination_id: "dest_thailand",
    destination_name: "Bangkok",
    country: "Thailand",
    package_name: "Only Bangkok",
    duration: "2 Night 3 Days",
    price: 9350,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 11550 },
      { pax: 4, price: 9570 },
      { pax: 6, price: 9350 }
    ],
    description: "2 Nights Bangkok free & easy with 3-star hotel, breakfast, and airport transfers.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Bangkok & Leisure",
        activities: [
          "Arrival at Suvarnabhumi or Don Mueang Airport",
          "Airport Pick-Up by private/shared transfer",
          "Check-in to your 3-star hotel (standard check-in: 2 PM)",
          "Afternoon at leisure – relax or explore nearby markets (Terminal 21 / MBK)",
          "Overnight at hotel"
        ],
        meals: "On own",
        overnight: "Bangkok 3-Star Hotel"
      },
      {
        day: 2,
        title: "Bangkok City Tour (Optional or Add-on)",
        activities: [
          "Enjoy breakfast at the hotel.",
          "You may explore Bangkok at your own pace or book an optional city tour: Grand Palace and Emerald Buddha Temple, Wat Pho, Chao Phraya River Cruise, Shopping at MBK or Siam Paragon.",
          "Overnight stay at the hotel in Bangkok."
        ],
        meals: "Breakfast",
        overnight: "Bangkok 3-Star Hotel"
      },
      {
        day: 3,
        title: "Departure",
        activities: [
          "Breakfast at hotel",
          "Check-out (usually by 12 PM)",
          "Airport Drop for your onward flight"
        ],
        meals: "Breakfast",
        overnight: "Departure"
      }
    ],
    hotel: "2 Nights stay at 3-star hotel in Bangkok with breakfast",
    meals: "Daily Breakfast at hotel",
    transportation: "Airport transfers (Pick-up & Drop)",
    inclusions: [
      "2 Nights stay at 3-star hotel in Bangkok with breakfast",
      "Airport transfers (Pick-up & Drop)"
    ],
    exclusions: [
      "Airticket",
      "Visa",
      "Entry fees",
      "Any personal expenses."
    ],
    visa_information: "Thailand tourist visa.",
    required_documents: ["Passport", "Photo", "Bank statement"],
    important_notes: ["Budget-friendly 2-night stay in Bangkok"],
    terms_conditions: ["Group tiered pricing."],
    source_pdf: "SOURCE PDF PAGE 62-63",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80"],
    highlights: ["2 Nights 3-Star Hotel with Breakfast", "Airport Return Pick-up & Drop", "Free time for shopping at MBK & Pratunam"]
  }
];
