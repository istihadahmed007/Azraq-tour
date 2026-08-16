import { TourPackage } from '../types';

export const AZRAQ_SOURCE_PACKAGES: TourPackage[] = [
  // 1. Thailand (Page 1-2)
  {
    id: "pkg_azraq_01",
    destination_id: "dest_thailand",
    destination_name: "Pattaya and Bangkok",
    country: "Thailand",
    package_name: "Bangkok & Pattaya (Coral)",
    duration: "3 Night 4 Days",
    price: 16500,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 20350 },
      { pax: 4, price: 17050 },
      { pax: 6, price: 16500 }
    ],
    description: "3-Night, 4-Day Thailand Itinerary covering Pattaya and Bangkok with Coral Island Tour.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Bangkok & Transfer to Pattaya",
        activities: [
          "Arrival: Land at Bangkok’s Suvarnabhumi Airport. Meet & greet service at the airport.",
          "Transfer: Private/shared transfer to Pattaya (approx. 2 hours).",
          "Check-In: 3-star hotel in Pattaya. Standard double/twin-share room.",
          "Afternoon: Free to explore Pattaya or relax at the hotel. Options include: Visit Pattaya Beach for leisure or water sports (optional). Explore Walking Street for shopping and nightlife (optional).",
          "Evening: Dinner at a local restaurant (on your own)."
        ],
        meals: "On own",
        overnight: "3-star hotel in Pattaya"
      },
      {
        day: 2,
        title: "Coral Island Tour & Transfer to Bangkok",
        activities: [
          "Morning: Start the day with breakfast at the hotel. Embark on the Coral Island Tour, including a speedboat ride. Enjoy activities like snorkeling, parasailing, or just relaxing on the beach. Lunch will be provided.",
          "Afternoon: Return from the tour and transfer to Bangkok via private/shared vehicle (approx. 2-3 hours).",
          "Check-In: 3-star hotel in Bangkok. Standard double/twin-share room.",
          "Evening: Free time to explore Bangkok’s markets or street food (optional)."
        ],
        meals: "Breakfast & Lunch",
        overnight: "3-star hotel in Bangkok"
      },
      {
        day: 3,
        title: "Free day",
        activities: [
          "Morning: Enjoy breakfast at the hotel. Enjoy local market, Food. You may explore Bangkok further. Suggested activities: Visit the Grand Palace or Wat Arun (optional). Shop at MBK Center or Terminal 21 (optional).",
          "Evening: Return to the hotel. Relax or explore nearby attractions like the Asiatique Riverfront or local markets (optional)."
        ],
        meals: "Breakfast",
        overnight: "3-star hotel in Bangkok"
      },
      {
        day: 4,
        title: "Departure from Bangkok",
        activities: [
          "Morning: Breakfast at the hotel and check out. Depending on your flight schedule,",
          "Transfer: Hotel to Bangkok Airport for your departure."
        ],
        meals: "Breakfast",
        overnight: "Departure"
      }
    ],
    hotel: "Pattaya: Welcome Plaza or Similar | Bangkok: Anya Nana or Similar",
    meals: "Daily Breakfast, Coral Island Tour with lunch",
    transportation: "Bangkok airport-hotel return, Pattaya-Bangkok transfer (Private/shared vehicle)",
    inclusions: [
      "1 night in Pattaya with Breakfast",
      "2 nights in Bangkok with Breakfast",
      "Tours: Coral Island with lunch",
      "Transfers: Bangkok airport-hotel return, Pattaya-Bangkok transfer",
      "Taxes, VAT, and service charges"
    ],
    exclusions: [
      "Airfare and visa fees",
      "Personal expenses and meals (beyond those included)",
      "Early check-in/late check-out fees"
    ],
    visa_information: "Thailand tourist visa required.",
    required_documents: ["Passport valid 6+ months", "Photos (35x45mm)", "Bank statement"],
    important_notes: ["Hotel Pattaya: Welcome Plaza or Similar", "Hotel Bangkok: Anya Nana or Similar"],
    terms_conditions: ["Price per person based on pax tier."],
    source_pdf: "SOURCE PDF PAGE 1-2",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=800&q=75"],
    highlights: ["Coral Island with lunch", "Pattaya & Bangkok 3-star hotels with breakfast", "Airport & Intercity transfers"]
  },

  // 2. Thailand (Page 3-4)
  {
    id: "pkg_azraq_02",
    destination_id: "dest_thailand",
    destination_name: "Bangkok & Pattaya",
    country: "Thailand",
    package_name: "Bangkok & Pattaya (Option-2)",
    duration: "4 Night 5 Days",
    price: 19525,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 23375 },
      { pax: 4, price: 20075 },
      { pax: 6, price: 19525 }
    ],
    description: "Bangkok & Pattaya Tour Itinerary (4 Nights / 5 Days)",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Bangkok – Transfer to Pattaya",
        activities: [
          "Arrive at Bangkok Airport (Suvarnabhumi).",
          "Meet and greet by our representative.",
          "Transfer to Pattaya by private/shared vehicle (Approx. 2 hours).",
          "Check-in to your hotel and relax.",
          "Evening free for leisure or optional Alcazar Show / Walking Street.",
          "Overnight stay in Pattaya."
        ],
        meals: "On own",
        overnight: "Overnight stay in Pattaya."
      },
      {
        day: 2,
        title: "Coral Island Tour",
        activities: [
          "Breakfast at the hotel. Depart for Coral Island (Koh Larn) via speedboat/big boat. Enjoy the beach, sunbathing, and optional water sports like parasailing, jet ski, sea walk, etc.",
          "Lunch included at the island or on return.",
          "Return to hotel and relax.",
          "Evening free for shopping or exploring local markets.",
          "Overnight stay in Pattaya."
        ],
        meals: "Breakfast & Lunch",
        overnight: "Overnight stay in Pattaya."
      },
      {
        day: 3,
        title: "Pattaya to Bangkok – Free Day",
        activities: [
          "Breakfast at the hotel and check-out.",
          "Transfer back to Bangkok .",
          "Check-in to your Bangkok hotel.",
          "Day free to relax or explore the city at your own pace.",
          "Optional tours: Madame Tussauds , SEA LIFE Ocean World , Temple tour, or Asiatique Night Market.",
          "Overnight stay in Bangkok."
        ],
        meals: "Breakfast",
        overnight: "Overnight stay in Bangkok."
      },
      {
        day: 4,
        title: "Free Day in Bangkok – Shopping & Leisure",
        activities: [
          "Breakfast at the hotel.",
          "Full day at your leisure – ideal for shopping at: Platinum Fashion Mall, MBK Center, Siam Paragon,Chatuchak Weekend Market (if applicable)",
          "Optional activities: Visit Madame Tussauds, SEA LIFE Aquarium, or a Chao Phraya River Dinner Cruise.",
          "Overnight stay in Bangkok."
        ],
        meals: "Breakfast",
        overnight: "Overnight stay in Bangkok."
      },
      {
        day: 5,
        title: "Departure from Bangkok",
        activities: [
          "Breakfast at the hotel and check-out.",
          "Transfer to Bangkok Airport for your return flight.",
          "Tour Ends with Beautiful Memories!"
        ],
        meals: "Breakfast",
        overnight: "Departure"
      }
    ],
    hotel: "2 Nights Hotel in Pattaya + 2 Nights Hotel in Bangkok",
    meals: "Daily Breakfast, Coral Island Tour with lunch",
    transportation: "All Transfers: Airport-Hotel-Sightseeing",
    inclusions: [
      "2 Nights Hotel Accommodation in Pattaya",
      "2 Nights Hotel Accommodation in Bangkok",
      "Daily Breakfast",
      "Coral Island Tour with lunch",
      "All Transfers: Airport-Hotel-Sightseeing"
    ],
    exclusions: [
      "Airfare and visa fees.",
      "Personal expenses and meals (beyond those included).",
      "Early check-in/late check-out fees."
    ],
    visa_information: "Thailand visa required.",
    required_documents: ["Passport", "Photos", "Bank Statement"],
    important_notes: ["Tour Ends with Beautiful Memories!"],
    terms_conditions: ["Standard terms apply."],
    source_pdf: "SOURCE PDF PAGE 3-4",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=75"],
    highlights: ["2 Nights Pattaya + 2 Nights Bangkok", "Coral Island with lunch", "Full day Bangkok shopping leisure"]
  },

  // 3. Nepal (Page 5-8)
  {
    id: "pkg_azraq_03",
    destination_id: "dest_nepal",
    destination_name: "Kathmandu, Nagarkot & Pokhara",
    country: "Nepal",
    package_name: "Kathmandu, Nagarkot, Pokhara, (3* Delux)",
    duration: "4 Night 5 Days",
    price: 18700,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 29150 },
      { pax: 4, price: 24750 },
      { pax: 6, price: 20900 },
      { pax: 10, price: 18700 }
    ],
    description: "Kathmandu, Nagarkot, Pokhara (3* Delux) Nepal Tour Details.",
    itinerary: [
      {
        day: 1,
        title: "Arrival – Transfer to Nagarkot",
        activities: [
          "Meet and greet at Kathmandu Airport with traditional Nepali Khada or Mala.",
          "Drive to Nagarkot directly after airport pickup.",
          "Check-in at hotel in Nagarkot.",
          "Enjoy sunset views of the Himalayan ranges from the hotel.",
          "Overnight stay in Nagarkot."
        ],
        meals: "On own",
        overnight: "Overnight stay in Nagarkot."
      },
      {
        day: 2,
        title: "Nagarkot – Chandragiri – Pokhara",
        activities: [
          "Early morning sunrise view from Nagarkot.",
          "Breakfast at the hotel.",
          "Drive toward Pokhara.",
          "Stop at Chandragiri Hills: Optional cable car ride (self-paid), Scenic views of the valley and mountains, Optional zipline with GoPro (self-paid).",
          "Continue drive to Pokhara.",
          "Check-in at hotel in Pokhara.",
          "Overnight stay in Pokhara."
        ],
        meals: "Breakfast",
        overnight: "Overnight stay in Pokhara."
      },
      {
        day: 3,
        title: "Pokhara Sightseeing",
        activities: [
          "Early morning (5 AM) departure to Sarangkot for sunrise.",
          "View of Annapurna Range, Machapuchhre, Dhaulagiri, Nilgiri, etc.",
          "Return to hotel for breakfast and refreshment.",
          "Full-day Pokhara sightseeing: Devis Falls, Gupteshwor Cave, World Peace Pagoda, Fewa Lake and Lakeside Market.",
          "Overnight stay in Pokhara."
        ],
        meals: "Breakfast",
        overnight: "Overnight stay in Pokhara."
      },
      {
        day: 4,
        title: "Pokhara – Kathmandu",
        activities: [
          "Breakfast at the hotel.",
          "Drive back to Kathmandu.",
          "En route sightseeing: Swoyambhunath Stupa (Monkey Temple), Patan Durbar Square.",
          "Check-in at hotel in Thamel, Kathmandu.",
          "Overnight stay in Kathmandu."
        ],
        meals: "Breakfast",
        overnight: "Overnight stay in Kathmandu."
      },
      {
        day: 5,
        title: "Departure",
        activities: [
          "Breakfast at the hotel.",
          "Timely transfer to Kathmandu Airport as per flight schedule."
        ],
        meals: "Breakfast",
        overnight: "Departure"
      }
    ],
    hotel: "Kathmandu: Apsara Boutique Hotel/ Hotel Ama-La or Similar | Pokhara: Hotel Majestic Lake Front or Similar | Nagarkot: Hotel Himalayan Villa or Nagarkot Shangri-la Similar",
    meals: "Daily breakfast at the hotel",
    transportation: "All transport by private ac car with Hindi speaking driver",
    inclusions: [
      "Pick up & drop",
      "Welcome with traditional napali mala.",
      "1 Night 3 star Nagarkot hotel",
      "2 Night 3 star Pokhara hotel",
      "1 Night 3 star Kathmandu hotel",
      "Daily breakfast at the hotel",
      "All Double Room",
      "Hindi speaking driver",
      "All transport by private ac car",
      "All sightseeing as per mention in the itinerary",
      "Parking fees and toll fees",
      "Local & Government taxes"
    ],
    exclusions: [
      "Airfare",
      "Personal Expenses",
      "Lunch & dinner",
      "Cable car ride ticket",
      "Guide",
      "Zipline",
      "Heritage sites entrance ticket"
    ],
    visa_information: "Nepal visa on arrival.",
    required_documents: ["Passport", "Photos"],
    important_notes: ["Chandragiri cable car ticket self-paid"],
    terms_conditions: ["Subject to road & weather conditions."],
    source_pdf: "SOURCE PDF PAGE 5-8",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=75"],
    highlights: ["Traditional Nepali Mala welcome", "Nagarkot Himalayan Sunrise", "Sarangkot Annapurna Panorama", "Devis Falls & Fewa Lake Pokhara"]
  },

  // 4. Nepal (Page 9-10)
  {
    id: "pkg_azraq_04",
    destination_id: "dest_nepal",
    destination_name: "Kathmandu & Nagarkot",
    country: "Nepal",
    package_name: "Kathmandu, Nagarkot 3*",
    duration: "3 Night 4 Days",
    price: 12650,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 15950 },
      { pax: 3, price: 13750 },
      { pax: 4, price: 14300 },
      { pax: 6, price: 12650 }
    ],
    description: "Kathmandu, Nagarkot 3-Star Nepal tour covering Bhaktapur Durbar Square and UNESCO heritage sites.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kathmandu & Transfer to Nagarkot",
        activities: [
          "Arrival at Tribhuvan International Airport, Kathmandu",
          "Meet & greet by our representative",
          "Drive to Nagarkot (Approx. 1.5-2 hours drive)",
          "Check-in at the hotel & refresh",
          "Sunset View over the Himalayas from Nagarkot View Tower",
          "Leisure evening & overnight stay in Nagarkot"
        ],
        meals: "On own",
        overnight: "Nagarkot Hotel"
      },
      {
        day: 2,
        title: "Sunrise at Nagarkot & Bhaktapur Sightseeing",
        activities: [
          "Early morning Sunrise View over Mt. Everest and Langtang ranges",
          "Breakfast at the hotel",
          "Visit Nagarkot View Tower for panoramic mountain views",
          "Drive to Bhaktapur Durbar Square (UNESCO World Heritage Site). Explore Nyatapola Temple, 55-Window Palace, Pottery Square. Enjoy Newari cultural experiences",
          "Drive back to Kathmandu & check-in at hotel",
          "Free evening for leisure or shopping at Thamel",
          "Overnight stay in Kathmandu"
        ],
        meals: "Breakfast",
        overnight: "Kathmandu Hotel"
      },
      {
        day: 3,
        title: "Half day Kathmandu Sightseeing",
        activities: [
          "Breakfast at the hotel",
          "Explore major UNESCO Heritage Sites in Kathmandu: Swayambhunath Stupa (Monkey Temple) – Scenic hilltop views. Pashupatinath Temple – Sacred Hindu pilgrimage site. Boudhanath Stupa – Largest stupa in Nepal. Kathmandu Durbar Square – Historical royal palace",
          "Overnight stay in Kathmandu"
        ],
        meals: "Breakfast",
        overnight: "Kathmandu Hotel"
      },
      {
        day: 4,
        title: "Departure from Kathmandu",
        activities: [
          "Breakfast at the hotel",
          "Free time for shopping or relaxation",
          "Transfer to Tribhuvan International Airport for departure"
        ],
        meals: "Breakfast",
        overnight: "Departure"
      }
    ],
    hotel: "Kathmandu: Apsara Boutique Hotel/ Hotel Ama-La or similar | Nagarkot: Hotel Himalayan Glacier or Similar",
    meals: "Daily breakfast at hotels",
    transportation: "Private vehicle for all transfers & sightseeing with chauffeur guide",
    inclusions: [
      "2N katmandu with breakfast",
      "1N Nagarkot with breakfast",
      "Katmandu sightseeing",
      "Nagarkot sightseeing",
      "Private vehicle for all transfers & sightseeing",
      "Chauffeur guide"
    ],
    exclusions: [
      "Lunch & dinner",
      "Personal expenses & tips",
      "Air Ticket",
      "Entrance fees to heritage sites"
    ],
    visa_information: "Nepal on arrival visa.",
    required_documents: ["Passport copy", "Photographs"],
    important_notes: ["Hotel Kathmandu: Apsara Boutique Hotel/ Hotel Ama-La or similar", "Nagarkot: Hotel Himalayan Glacier or Similar"],
    terms_conditions: ["Prices per person based on group tier."],
    source_pdf: "SOURCE PDF PAGE 9-10",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=75"],
    highlights: ["Nagarkot Sunrise over Mt. Everest", "Bhaktapur Durbar Square UNESCO site", "Kathmandu Heritage Sightseeing", "Chauffeur Guide & Private Vehicle"]
  }
];
