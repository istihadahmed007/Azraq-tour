import { TourPackage } from '../types';

export const AZRAQ_SOURCE_PACKAGES_PART8: TourPackage[] = [
  // 30. Nepal Budget Tour (Page 74-75)
  {
    id: "pkg_azraq_30",
    destination_id: "dest_nepal",
    destination_name: "Kathmandu",
    country: "Budget Tour",
    package_name: "Nepal Budget Tour",
    duration: "3 Night 4 Days",
    price: 6600,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 6600 }
    ],
    description: "3 Nights Budget stay in Kathmandu with airport pick and drop.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kathmandu (Nepal)",
        activities: [
          "Arrival at Tribhuvan International Airport",
          "Warm welcome and airport pickup by our representative",
          "Transfer to your hotel in Kathmandu",
          "Check-in and rest after your journey",
          "Free time in the evening – explore nearby local markets or relax at the hotel",
          "Overnight stay in Kathmandu"
        ],
        meals: "On own",
        overnight: "Hotel Gallery Nepal or similar"
      },
      {
        day: 2,
        title: "Free Day for Leisure",
        activities: [
          "Day at leisure – explore Thamel, try local cuisine, or shop for souvenirs",
          "Optional add-ons: Visit Pashupatinath Temple and Boudhanath Stupa, mountain flight",
          "Overnight stay in Kathmandu"
        ],
        meals: "On own",
        overnight: "Hotel Gallery Nepal or similar"
      },
      {
        day: 3,
        title: "Free Day for Leisure / Optional Activities",
        activities: [
          "Day at leisure – explore Thamel or sightseeing",
          "Overnight stay in Kathmandu"
        ],
        meals: "On own",
        overnight: "Hotel Gallery Nepal or similar"
      },
      {
        day: 4,
        title: "Departure",
        activities: [
          "Check-out and airport drop-off for your onward journey",
          "Tour ends with unforgettable memories!"
        ],
        meals: "On own",
        overnight: "Departure"
      }
    ],
    hotel: "Hotel Gallery Nepal or similar budget hotel",
    meals: "Meals on own arrangement",
    transportation: "Airport pick and drop",
    inclusions: [
      "3 Night Hotel",
      "Aiport pick and drop"
    ],
    exclusions: [
      "Air fare",
      "Breakfast Lunch & Dinner",
      "Pesonal Expenses",
      "Any entry fees"
    ],
    visa_information: "Nepal visa on arrival.",
    required_documents: ["Passport copy"],
    important_notes: [
      "Hotel: Kathmandu >> Hotel Gallery Nepal or similar",
      "Note: Kindly note, this is a budget hotel. Hence, hotel-related complaints cannot be accommodated"
    ],
    terms_conditions: ["Price per person for 2 pax."],
    source_pdf: "SOURCE PDF PAGE 74-75",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=75"],
    highlights: ["3 Nights Budget Hotel Stay in Thamel", "Airport Return Pick & Drop Included", "Free days for Thamel & Kathmandu Exploration"]
  },

  // 31. Malaysia Budget Tour (Page 76-77)
  {
    id: "pkg_azraq_31",
    destination_id: "dest_malaysia",
    destination_name: "Kuala Lumpur",
    country: "Budget Tour",
    package_name: "Malaysia Budget Tour",
    duration: "3 Night 4 Days",
    price: 8800,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 8800 }
    ],
    description: "3 Nights Budget stay in Kuala Lumpur with airport transfers.",
    itinerary: [
      {
        day: 1,
        title: "Arrival Kuala Lumpur (Malaysia)",
        activities: [
          "Arrival at Kuala Lumpur International Airport",
          "Meet & Greet – Hotel Transfer",
          "Check-in at budget hotel",
          "Free time for rest & explore nearby areas"
        ],
        meals: "On own",
        overnight: "Tang City Hotel / MyCiti Hotel KL"
      },
      {
        day: 2,
        title: "Kuala Lumpur City (Free & Easy)",
        activities: [
          "Breakfast on own arrangement",
          "Explore Kuala Lumpur city at your own (shopping, food, sightseeing)",
          "Optional tours available (extra cost)"
        ],
        meals: "On own",
        overnight: "Tang City Hotel / MyCiti Hotel KL"
      },
      {
        day: 3,
        title: "Kuala Lumpur (Free Day)",
        activities: [
          "Full day free for personal activities",
          "You may visit Petronas Twin Tower, Bukit Bintang, KLCC area, Batu Caves, etc."
        ],
        meals: "On own",
        overnight: "Tang City Hotel / MyCiti Hotel KL"
      },
      {
        day: 4,
        title: "Departure",
        activities: [
          "Hotel check-out",
          "Airport transfer for departure flight"
        ],
        meals: "On own",
        overnight: "Departure"
      }
    ],
    hotel: "Tang City Hotel / MyCiti Hotel Kuala Lumpur (or similar budget hotel)",
    meals: "On own arrangement",
    transportation: "Airport pick and drop",
    inclusions: [
      "3 Night Hotel",
      "Aiport pick and drop"
    ],
    exclusions: [
      "Air fare",
      "Visa",
      "Breakfast Lunch & Dinner",
      "Pesonal Expenses",
      "Any entry fees"
    ],
    visa_information: "Malaysia eVisa required.",
    required_documents: ["Passport copy", "Photo"],
    important_notes: [
      "Hotel: Tang City Hotel / MyCiti Hotel Kuala Lumpur (or similar budget hotel)",
      "Note: Kindly note, this is a budget hotel. Hence, hotel-related complaints cannot be accommodated"
    ],
    terms_conditions: ["Price per person for 2 pax."],
    source_pdf: "SOURCE PDF PAGE 76-77",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=75"],
    highlights: ["3 Nights Budget Hotel Stay in KL", "Airport Return Pick & Drop Included", "Free exploration of Bukit Bintang & Chinatown"]
  },

  // 32. Bangkok Budget Tour (Page 78-79)
  {
    id: "pkg_azraq_32",
    destination_id: "dest_thailand",
    destination_name: "Bangkok",
    country: "Budget Tour",
    package_name: "Bangkok Budget Tour",
    duration: "3 Night 4 Days",
    price: 8800,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 8800 }
    ],
    description: "3 Nights Budget stay in Bangkok with airport transfers.",
    itinerary: [
      {
        day: 1,
        title: "Arrival Bangkok (Thailand)",
        activities: [
          "Arrival at Bangkok International Airport",
          "Pick up & transfer to hotel",
          "Check-in at budget hotel",
          "Free time to explore nearby areas"
        ],
        meals: "On own",
        overnight: "S30 Sukhumvit Hotel / Sukhumvit 20 Guest House"
      },
      {
        day: 2,
        title: "Bangkok City (Free & Easy)",
        activities: [
          "Breakfast on own arrangement",
          "Explore Bangkok city on your own (shopping, sightseeing, local food)",
          "Optional city tour available on extra cost"
        ],
        meals: "On own",
        overnight: "S30 Sukhumvit Hotel / Sukhumvit 20 Guest House"
      },
      {
        day: 3,
        title: "Bangkok (Free Day)",
        activities: [
          "Full day free for personal activities",
          "Suggested places: Grand Palace, Wat Arun, Floating Market, MBK Center, Siam Paragon"
        ],
        meals: "On own",
        overnight: "S30 Sukhumvit Hotel / Sukhumvit 20 Guest House"
      },
      {
        day: 4,
        title: "Departure",
        activities: [
          "Hotel check-out",
          "Transfer to Bangkok Airport for departure flight"
        ],
        meals: "On own",
        overnight: "Departure"
      }
    ],
    hotel: "S30 Sukhumvit Hotel / Sukhumvit 20 Guest House (or similar budget hotel)",
    meals: "On own arrangement",
    transportation: "Airport pick and drop",
    inclusions: [
      "3 Night Hotel",
      "Aiport pick and drop"
    ],
    exclusions: [
      "Air fare",
      "Visa",
      "Breakfast Lunch & Dinner",
      "Pesonal Expenses",
      "Any entry fees"
    ],
    visa_information: "Thailand tourist visa.",
    required_documents: ["Passport copy", "Photo"],
    important_notes: [
      "Hotel: S30 Sukhumvit Hotel / Sukhumvit 20 Guest House (or similar budget hotel)",
      "Note: Kindly note, this is a budget hotel. Hence, hotel-related complaints cannot be accommodated"
    ],
    terms_conditions: ["Price per person for 2 pax."],
    source_pdf: "SOURCE PDF PAGE 78-79",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=75"],
    highlights: ["3 Nights Sukhumvit Budget Hotel Stay", "Airport Return Pick & Drop Included", "Free days for Pratunam & MBK shopping"]
  },

  // 33. Srilanka Budget Tour (Page 80-81)
  {
    id: "pkg_azraq_33",
    destination_id: "dest_srilanka",
    destination_name: "Colombo",
    country: "Budget Tour",
    package_name: "Srilanka Budget Tour",
    duration: "3 Night 4 Days",
    price: 12650,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 12650 }
    ],
    description: "3 Nights Budget stay in Colombo with airport transfers.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Colombo",
        activities: [
          "Arrival at Colombo Airport",
          "Meet & greet, transfer to hotel",
          "Check-in & free time for rest",
          "Overnight stay at hotel in Colombo"
        ],
        meals: "On own",
        overnight: "Miracle City Inn Hostel"
      },
      {
        day: 2,
        title: "Colombo City Exploration",
        activities: [
          "Full day free for self-exploration in Colombo",
          "Suggested: Visit Galle Face Green, Independence Square, and shopping areas",
          "Overnight stay at hotel in Colombo"
        ],
        meals: "On own",
        overnight: "Miracle City Inn Hostel"
      },
      {
        day: 3,
        title: "Leisure Day in Colombo",
        activities: [
          "Leisure day in Colombo",
          "Suggested: Explore Pettah Market, Gangaramaya Temple, or nearby beaches",
          "Overnight stay at hotel in Colombo"
        ],
        meals: "On own",
        overnight: "Miracle City Inn Hostel"
      },
      {
        day: 4,
        title: "Departure",
        activities: [
          "Check out from hotel",
          "Airport drop for return flight"
        ],
        meals: "On own",
        overnight: "Departure"
      }
    ],
    hotel: "Miracle City Inn Hostel (or similar budget accommodation)",
    meals: "On own arrangement",
    transportation: "Airport pick and drop",
    inclusions: [
      "3 Night Hotel",
      "Aiport pick and drop"
    ],
    exclusions: [
      "Air fare",
      "Visa",
      "Breakfast Lunch & Dinner",
      "Pesonal Expenses",
      "Any entry fees"
    ],
    visa_information: "Sri Lanka ETA.",
    required_documents: ["Passport copy", "Photo"],
    important_notes: [
      "Hotel Colombo: Miracle City Inn Hostel",
      "Note: Kindly note, this is a budget hotel. Hence, hotel-related complaints cannot be accommodated"
    ],
    terms_conditions: ["Price per person for 2 pax."],
    source_pdf: "SOURCE PDF PAGE 80-81",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1588258524675-c61919a008c2?auto=format&fit=crop&w=800&q=75"],
    highlights: ["3 Nights Budget Colombo Stay", "Airport Return Pick & Drop Included", "Free exploration of Galle Face Green & Pettah"]
  },

  // 34. China - Guangzhou (Page 82-83)
  {
    id: "pkg_azraq_34",
    destination_id: "dest_china",
    destination_name: "Guangzhou",
    country: "China",
    package_name: "Guangzhou Basic",
    duration: "3 Night 4 Days",
    price: 14850,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 14850 }
    ],
    description: "3 Nights 3-Star Hotel in Sanyuanli, Guangzhou with daily breakfast and airport transfers.",
    itinerary: [
      {
        day: 1,
        title: "Departure from Bangladesh",
        activities: [
          "Departure flight from Bangladesh to Guangzhou, China.",
          "Overnight journey."
        ],
        meals: "On flight",
        overnight: "Flight / Transit"
      },
      {
        day: 2,
        title: "Arrival & Hotel Check-in",
        activities: [
          "Arrival at Guangzhou International Airport.",
          "Transfer to hotel.",
          "Hotel check-in at midnight.",
          "Rest after the journey."
        ],
        meals: "On own",
        overnight: "3* Hotel at Sanyuanli, Guangzhou"
      },
      {
        day: 3,
        title: "Free Day / Shopping",
        activities: [
          "Enjoy a free day at your own leisure.",
          "Explore local shopping malls, markets, and surrounding attractions.",
          "Overnight stay at hotel."
        ],
        meals: "Breakfast",
        overnight: "3* Hotel at Sanyuanli, Guangzhou"
      },
      {
        day: 4,
        title: "Free Day / Shopping",
        activities: [
          "Enjoy a free day at your own leisure.",
          "Explore local shopping malls, wholesale markets, Canton Tower area.",
          "Overnight stay at hotel."
        ],
        meals: "Breakfast",
        overnight: "3* Hotel at Sanyuanli, Guangzhou"
      },
      {
        day: 5,
        title: "Departure",
        activities: [
          "Midnight Check-out from hotel.",
          "Transfer to airport as per flight schedule.",
          "Departure flight back home."
        ],
        meals: "Breakfast",
        overnight: "Departure"
      }
    ],
    hotel: "3 Nights 3* Hotel at Sanyuanli, Guangzhou",
    meals: "Daily Breakfast",
    transportation: "Airport Pick-up & Drop-off",
    inclusions: [
      "Airport Pick-up & Drop-off",
      "3 Nights 3* Hotel at Sanyuanli, Guangzhou",
      "Daily Breakfast"
    ],
    exclusions: [
      "International Air Ticket",
      "Visa Fee",
      "Personal Expenses",
      "Lunch & Dinner",
      "Guide",
      "Any service not mentioned above"
    ],
    visa_information: "China tourist or business visa required.",
    required_documents: ["Passport copy", "Photo", "Bank statement & Solvency"],
    important_notes: ["Ideal for Canton Fair / wholesale market visits in Sanyuanli"],
    terms_conditions: ["Price per person for 2 pax."],
    source_pdf: "SOURCE PDF PAGE 82-83",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1584646098378-0874589d76b1?auto=format&fit=crop&w=800&q=75"],
    highlights: ["3 Nights 3-Star Hotel in Sanyuanli Market Hub", "Daily Breakfast Included", "Airport Return Transfers Included"]
  },

  // 35. China - Shanghai (Page 84-85)
  {
    id: "pkg_azraq_35",
    destination_id: "dest_china",
    destination_name: "Shanghai",
    country: "China",
    package_name: "Shanghai Basic",
    duration: "3 Night 4 Days",
    price: 24200,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 35200 },
      { pax: 4, price: 25300 },
      { pax: 6, price: 24200 }
    ],
    description: "3 Nights Shanghai with private 5-seater vehicle city tour (The Bund, Shanghai Museum, French Concession, Nanjing Road) and airport transfers.",
    itinerary: [
      {
        day: 1,
        title: "ARRIVAL IN SHANGHAI",
        activities: [
          "Upon arrival at Shanghai Airport, meet representative. Private transfer to hotel in 5-seater vehicle.",
          "Hotel check-in and relax.",
          "Free rest of day to explore surroundings or vibrant Shanghai atmosphere.",
          "Overnight stay in Shanghai."
        ],
        meals: "On own",
        overnight: "Shanghai Hotel"
      },
      {
        day: 2,
        title: "SHANGHAI CITY TOUR",
        activities: [
          "Full-day private city tour by 5-seater vehicle.",
          "Sightseeing at The Bund (iconic waterfront with Huangpu River views).",
          "Visit Shanghai Museum (ancient art, culture, collections).",
          "Visit Former French Concession (tree-lined streets, European architecture, cafes).",
          "Explore Nanjing Road Pedestrian Street (shopping and vibrant atmosphere).",
          "Overnight stay in Shanghai."
        ],
        meals: "Breakfast",
        overnight: "Shanghai Hotel"
      },
      {
        day: 3,
        title: "FREE DAY FOR LEISURE & SHOPPING",
        activities: [
          "Full day at leisure for shopping, markets, or modern landmarks.",
          "Overnight stay in Shanghai."
        ],
        meals: "Breakfast",
        overnight: "Shanghai Hotel"
      },
      {
        day: 4,
        title: "DEPARTURE FROM SHANGHAI",
        activities: [
          "Breakfast at hotel and checkout.",
          "Private 5-seater vehicle transfer to Shanghai Airport.",
          "End of tour."
        ],
        meals: "Breakfast",
        overnight: "Departure"
      }
    ],
    hotel: "3 Nights’ Hotel Accommodation in Shanghai",
    meals: "Daily Breakfast at the Hotel",
    transportation: "Private 5-Seater Vehicle for Airport Transfers & Full-Day City Tour",
    inclusions: [
      "3 Nights’ Hotel Accommodation",
      "Daily Breakfast at the Hotel",
      "Private Airport Transfer from Shanghai Airport to the Hotel by 5-Seater Vehicle",
      "Private Transfer from the Hotel to Shanghai Airport by 5-Seater Vehicle",
      "Full-Day Shanghai City Tour by Private 5-Seater Vehicle",
      "Hotel Pick-up and Drop-off for the City Tour"
    ],
    exclusions: [
      "International and Domestic Airfare",
      "Lunch and Dinner",
      "Entrance Fees, where applicable",
      "Tour Guide Service, unless requested",
      "Personal Expenses",
      "Tips and Gratuities",
      "Travel Insurance"
    ],
    visa_information: "China visa required.",
    required_documents: ["Passport copy", "Photo", "Bank solvency"],
    important_notes: ["Private 5-seater car for all transfers and Shanghai city tour"],
    terms_conditions: ["Group tiered pricing."],
    source_pdf: "SOURCE PDF PAGE 84-85",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=800&q=75"],
    highlights: ["The Bund & Huangpu River Waterfront", "Shanghai Museum & Former French Concession", "Nanjing Road Pedestrian Shopping Street", "Private 5-Seater Vehicle City Tour"]
  },

  // 36. China - Xi'an (Page 86-87)
  {
    id: "pkg_azraq_36",
    destination_id: "dest_china",
    destination_name: "Xi'an",
    country: "China",
    package_name: "Xi'an",
    duration: "3 Night 4 Days",
    price: 14300,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 23100 },
      { pax: 3, price: 14300 },
      { pax: 4, price: 17600 }
    ],
    description: "3 Nights Xi'an with 8-hour private car city tour (Ancient City Wall, Terracotta Warriors Museum area) and airport transfers.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Xi'an",
        activities: [
          "Xi'an Airport to Hotel Private Transfer (5-Seater)",
          "Hotel Check-in",
          "Overnight Stay at Hotel"
        ],
        meals: "On own",
        overnight: "Xi'an Hotel"
      },
      {
        day: 2,
        title: "Xi'an City Tour (Private Car – Approx. 8 Hours)",
        activities: [
          "Breakfast at Hotel",
          "Xi'an Ancient City Wall (Entry Ticket Not Included)",
          "Terracotta Warriors & Horses Museum (Entry Ticket Not Included)",
          "Return To Hotel",
          "Overnight Stay in Xi'an"
        ],
        meals: "Breakfast",
        overnight: "Xi'an Hotel"
      },
      {
        day: 3,
        title: "Free Day",
        activities: [
          "Breakfast at Hotel",
          "Enjoy the day at your leisure or explore Xi'an on your own (Muslim Quarter, Giant Wild Goose Pagoda).",
          "Overnight Stay in Xi'an"
        ],
        meals: "Breakfast",
        overnight: "Xi'an Hotel"
      },
      {
        day: 4,
        title: "Departure",
        activities: [
          "Breakfast at Hotel",
          "Hotel Check-out",
          "Private Transfer from Hotel to Xi'an Airport (5-Seater)"
        ],
        meals: "Breakfast",
        overnight: "Departure"
      }
    ],
    hotel: "3 Nights Hotel Accommodation in Xi'an",
    meals: "Daily Breakfast at Hotel",
    transportation: "Private 5-Seater Vehicle for Airport Transfers & 8-Hour City Tour",
    inclusions: [
      "3 Nights Hotel Accommodation",
      "Daily Breakfast at Hotel",
      "Xi'an Airport to Hotel Private Transfer (5-Seater)",
      "Full-Day Xi'an City Tour by Private Car (Approx. 8 Hours)",
      "Hotel to Xi'an Airport Private Transfer (5-Seater)"
    ],
    exclusions: [
      "International & Domestic Air Tickets",
      "Entry Tickets to Tourist Attractions",
      "Lunch & Dinner",
      "Personal Expenses",
      "Travel Insurance",
      "Guide Service (unless specified)",
      "Tips & Gratuities",
      "Anything not mentioned in the Package Includes section"
    ],
    visa_information: "China visa required.",
    required_documents: ["Passport copy", "Photo", "Bank statement"],
    important_notes: ["8-hour private car for Terracotta Warriors and Ancient Wall excursion"],
    terms_conditions: ["Group tiered pricing."],
    source_pdf: "SOURCE PDF PAGE 86-87",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=800&q=75"],
    highlights: ["Terracotta Warriors & Horses Museum", "Xi'an Ancient City Wall Excursion", "8-Hour Private Car City Tour", "Private 5-Seater Airport Transfers"]
  },

  // 37. China - Zhangjiajie (Page 88-89)
  {
    id: "pkg_azraq_37",
    destination_id: "dest_china",
    destination_name: "Zhangjiajie",
    country: "China",
    package_name: "Zhangjiajie Basic 01",
    duration: "2 Night 3 Days",
    price: 13750,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 22000 },
      { pax: 4, price: 15400 },
      { pax: 6, price: 13750 }
    ],
    description: "2 Nights Zhangjiajie with Tianmen Mountain scenic area transfer (Heaven's Gate, Glass Skywalk) and private 5-seater vehicle.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Zhangjiajie",
        activities: [
          "Arrival at Zhangjiajie Hehua International Airport (DYG).",
          "Meet & Greet by Driver.",
          "Zhangjiajie Airport to Hotel Transfer (Private 5-Seater Vehicle).",
          "Hotel Check-in & Free Time at Leisure.",
          "Overnight Stay at Hotel."
        ],
        meals: "On own",
        overnight: "Zhangjiajie Hotel"
      },
      {
        day: 2,
        title: "Tianmen Mountain Tour",
        activities: [
          "Breakfast at Hotel.",
          "Hotel to Tianmen Mountain Transfer (Private 5-Seater Vehicle).",
          "Visit Tianmen Mountain Scenic Area (Without Entry Ticket).",
          "Explore Tianmen Cave (Heaven's Gate), Glass Skywalk, and breathtaking mountain scenery.",
          "Optional Cable Car & Escalator Ride (Not Included).",
          "Free time for sightseeing and photography.",
          "Return Transfer to Hotel.",
          "Overnight Stay at Hotel."
        ],
        meals: "Breakfast",
        overnight: "Zhangjiajie Hotel"
      },
      {
        day: 3,
        title: "Departure",
        activities: [
          "Breakfast at Hotel.",
          "Hotel Check-out.",
          "Hotel to Zhangjiajie Hehua International Airport Transfer (Private 5-Seater Vehicle).",
          "Departure for Your Next Destination."
        ],
        meals: "Breakfast",
        overnight: "Departure"
      }
    ],
    hotel: "2 Nights Hotel Accommodation in Zhangjiajie",
    meals: "Daily Breakfast",
    transportation: "Private 5-Seater Vehicle for Airport Transfers & Sightseeing with Professional Driver",
    inclusions: [
      "2 Nights Hotel Accommodation",
      "Daily Breakfast",
      "Zhangjiajie Airport Pick-up & Drop-off",
      "Private 5-Seater Vehicle for Airport Transfers & Sightseeing",
      "Professional Driver"
    ],
    exclusions: [
      "International & Domestic Air Tickets",
      "Tianmen Mountain Entry Ticket",
      "Cable Car, Escalator & Shuttle Bus Tickets",
      "Tour Guide Service",
      "Lunch & Dinner",
      "Personal Expenses",
      "Travel Insurance",
      "Tips & Gratuities",
      "Any Services Not Mentioned in the Package Includes Section"
    ],
    visa_information: "China visa required.",
    required_documents: ["Passport copy", "Photo", "Bank statement"],
    important_notes: ["Tianmen Mountain Avatar-inspired scenery & Heaven's Gate"],
    terms_conditions: ["Group tiered pricing."],
    source_pdf: "SOURCE PDF PAGE 88-89",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=800&q=75"],
    highlights: ["Tianmen Mountain & Heaven's Gate (Tianmen Cave)", "Glass Skywalk & Avatar-inspired Landscapes", "Private 5-Seater Vehicle & Professional Driver", "Zhangjiajie Hehua Airport Return Transfers"]
  }
];
