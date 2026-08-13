import { TourPackage, DestinationRecord } from '../types';

export const INITIAL_TOUR_PACKAGES: TourPackage[] = [
  {
    "id": "pkg_pdf_01",
    "destination_id": "dest_thailand",
    "destination_name": "Pattaya & Bangkok",
    "country": "Thailand",
    "package_name": "Bangkok & Pattaya Coral Island Special",
    "duration": "3 Night 4 Days",
    "price": 16500,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 20350
      },
      {
        "pax": 4,
        "price": 17050
      },
      {
        "pax": 6,
        "price": 16500
      }
    ],
    "description": "Experience the energetic pulse of Bangkok combined with the sun-kissed beaches and crystal waters of Coral Island in Pattaya.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Bangkok & Transfer to Pattaya",
        "activities": [
          "Land at Suvarnabhumi Airport with meet & greet service",
          "Transfer to Pattaya (approx 2 hours)",
          "Check-in at 3-star hotel in Pattaya",
          "Free evening at Pattaya Beach or Walking Street"
        ],
        "meals": "Breakfast at hotel (Days 2-4)",
        "overnight": "Pattaya 3-Star Hotel"
      },
      {
        "day": 2,
        "title": "Coral Island Tour with Speedboat",
        "activities": [
          "Speedboat ride to Coral Island (Koh Larn) with lunch included",
          "Snorkeling, parasailing, and beach relaxation",
          "Transfer to Bangkok in the afternoon"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "Bangkok 3-Star Hotel"
      },
      {
        "day": 3,
        "title": "Free Day in Bangkok Shopping",
        "activities": [
          "Breakfast at hotel",
          "Optional visit to Grand Palace, Wat Arun, and MBK Center Shopping"
        ],
        "meals": "Breakfast",
        "overnight": "Bangkok 3-Star Hotel"
      },
      {
        "day": 4,
        "title": "Departure from Bangkok",
        "activities": [
          "Breakfast at hotel and checkout",
          "Transfer to Bangkok Airport for return flight"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Pattaya: Welcome Plaza | Bangkok: Anya Nana Hotel",
    "meals": "Daily Breakfast, 1 Lunch on Coral Island",
    "transportation": "Airport transfers & Pattaya-Bangkok private transfers",
    "inclusions": [
      "1 Night in Pattaya with Breakfast",
      "2 Nights in Bangkok with Breakfast",
      "Coral Island tour with speedboat and lunch",
      "Bangkok return airport transfers"
    ],
    "exclusions": [
      "Airfare and visa fees",
      "Personal expenses",
      "Optional entrance tickets"
    ],
    "visa_information": "Thailand Tourist Visa required.",
    "required_documents": [
      "Passport valid 6+ months",
      "Bank statement min 60k BDT",
      "2 Photos"
    ],
    "important_notes": [
      "Standard check-in: 2:00 PM"
    ],
    "terms_conditions": [
      "Package rate non-refundable once confirmed."
    ],
    "source_pdf": "Package_01_Thailand_Bangkok_Pattaya.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.562Z",
    "updated_at": "2026-08-13T15:28:37.562Z",
    "images": [
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Coral Island Speedboat",
      "Pattaya Beachfront",
      "Bangkok Shopping"
    ],
    "departure_info": "Dhaka to Bangkok"
  },
  {
    "id": "pkg_pdf_02",
    "destination_id": "dest_thailand_phuket",
    "destination_name": "Phuket & Krabi",
    "country": "Thailand",
    "package_name": "Phuket & Krabi 4 Islands Hopping Getaway",
    "duration": "4 Night 5 Days",
    "price": 32000,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 35000
      },
      {
        "pax": 4,
        "price": 32000
      }
    ],
    "description": "Island hopping across James Bond Island, Maya Bay, and Krabi Emerald Pool.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Phuket",
        "activities": [
          "Arrival transfer to Patong Beach hotel",
          "Evening free at Bangla Road"
        ],
        "meals": "Dinner on your own",
        "overnight": "Phuket Hotel"
      },
      {
        "day": 2,
        "title": "Phi Phi Island Cruise",
        "activities": [
          "Full day Phi Phi & Maya Bay speedboat tour with buffet lunch"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "Phuket Hotel"
      },
      {
        "day": 3,
        "title": "Transfer to Krabi",
        "activities": [
          "Scenic land transfer to Krabi",
          "Check in at Ao Nang Beach hotel"
        ],
        "meals": "Breakfast",
        "overnight": "Krabi Hotel"
      },
      {
        "day": 4,
        "title": "Krabi 4 Islands Tour",
        "activities": [
          "Speedboat tour to Railay Beach, Chicken Island, and Poda Island"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "Krabi Hotel"
      },
      {
        "day": 5,
        "title": "Departure",
        "activities": [
          "Checkout and transfer to Krabi or Phuket Airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Phuket: Deevana Plaza | Krabi: Ao Nang Cliff Beach",
    "meals": "Daily Breakfast, 2 Buffet Lunches",
    "transportation": "Speedboat tours & Airport transfers",
    "inclusions": [
      "2 Nights Phuket & 2 Nights Krabi",
      "Phi Phi Island tour",
      "4 Islands Krabi tour"
    ],
    "exclusions": [
      "Airfare & National Park Fees ($12/person)"
    ],
    "visa_information": "Thailand Tourist Visa required.",
    "required_documents": [
      "Passport 6+ months",
      "Bank Statement",
      "2 Photos"
    ],
    "important_notes": [
      "National park entrance fee payable on spot"
    ],
    "terms_conditions": [
      "Non-refundable tour tickets"
    ],
    "source_pdf": "Package_02_Phuket_Krabi_Island_Hopping.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.562Z",
    "updated_at": "2026-08-13T15:28:37.562Z",
    "images": [
      "https://images.unsplash.com/photo-1537956965359-7573183d1f57?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Phi Phi Islands",
      "Maya Bay",
      "Krabi 4 Islands Speedboat"
    ],
    "departure_info": "Dhaka to Phuket"
  },
  {
    "id": "pkg_pdf_03",
    "destination_id": "dest_thailand_chiangmai",
    "destination_name": "Chiang Mai",
    "country": "Thailand",
    "package_name": "Chiang Mai & Chiang Rai Cultural Temple Explorer",
    "duration": "3 Night 4 Days",
    "price": 24500,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 27000
      },
      {
        "pax": 4,
        "price": 24500
      }
    ],
    "description": "Explore the serene mountain temples, White Temple of Chiang Rai, and elephant sanctuaries.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival Chiang Mai",
        "activities": [
          "Airport pickup & check in",
          "Evening night bazaar stroll"
        ],
        "meals": "None",
        "overnight": "Chiang Mai Hotel"
      },
      {
        "day": 2,
        "title": "Doi Suthep & City Temples",
        "activities": [
          "Visit Wat Phra That Doi Suthep hilltop temple"
        ],
        "meals": "Breakfast",
        "overnight": "Chiang Mai Hotel"
      },
      {
        "day": 3,
        "title": "Chiang Rai White Temple Day Excursion",
        "activities": [
          "Full day tour to Wat Rong Khun (White Temple) and Golden Triangle"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "Chiang Mai Hotel"
      },
      {
        "day": 4,
        "title": "Departure",
        "activities": [
          "Transfer to Chiang Mai Airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Chiang Mai Plaza Hotel",
    "meals": "Daily Breakfast, 1 Lunch",
    "transportation": "Private AC Van transfers",
    "inclusions": [
      "3 Nights Hotel Accommodation",
      "White Temple Day Excursion",
      "Airport transfers"
    ],
    "exclusions": [
      "Airfare & Visa"
    ],
    "visa_information": "Thailand Tourist Visa required.",
    "required_documents": [
      "Passport",
      "Bank Statement"
    ],
    "important_notes": [
      "Modest dress code required for temples"
    ],
    "terms_conditions": [
      "Subject to availability"
    ],
    "source_pdf": "Package_03_ChiangMai_ChiangRai_Culture.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.562Z",
    "updated_at": "2026-08-13T15:28:37.562Z",
    "images": [
      "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "White Temple Chiang Rai",
      "Doi Suthep Hilltop",
      "Chiang Mai Night Bazaar"
    ],
    "departure_info": "Dhaka to Chiang Mai"
  },
  {
    "id": "pkg_pdf_04",
    "destination_id": "dest_malaysia",
    "destination_name": "Kuala Lumpur",
    "country": "Malaysia",
    "package_name": "Kuala Lumpur & Genting Highlands Cable Car",
    "duration": "3 Night 4 Days",
    "price": 18500,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 21500
      },
      {
        "pax": 4,
        "price": 18500
      }
    ],
    "description": "Iconic Petronas Twin Towers, Batu Caves golden statue, and Genting cable car indoor theme park.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival KLIA Airport",
        "activities": [
          "Transfer to Kuala Lumpur hotel",
          "Free night at Bukit Bintang"
        ],
        "meals": "None",
        "overnight": "KL Hotel"
      },
      {
        "day": 2,
        "title": "Genting Highlands Day Tour",
        "activities": [
          "En route Batu Caves visit",
          "Awana SkyWay Cable Car ride to Genting Highlands"
        ],
        "meals": "Breakfast",
        "overnight": "KL Hotel"
      },
      {
        "day": 3,
        "title": "KL City Sightseeing",
        "activities": [
          "Half day city tour including Petronas Towers photo stop & King Palace"
        ],
        "meals": "Breakfast",
        "overnight": "KL Hotel"
      },
      {
        "day": 4,
        "title": "Departure",
        "activities": [
          "Airport transfer to KLIA"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Ibis Styles Kuala Lumpur or Similar",
    "meals": "Daily Breakfast",
    "transportation": "Airport & Genting Tour Transfers",
    "inclusions": [
      "3 Nights KL Hotel",
      "Genting cable car tickets",
      "Batu Caves stop",
      "Half day KL city tour"
    ],
    "exclusions": [
      "Malaysia eVISA",
      "Tourism Tax (10 MYR/room/night)"
    ],
    "visa_information": "Malaysia eVISA required.",
    "required_documents": [
      "Passport 6+ months",
      "Photo",
      "Flight itinerary"
    ],
    "important_notes": [
      "Tourism tax payable directly at hotel check-in"
    ],
    "terms_conditions": [
      "Non-refundable ticket inclusions"
    ],
    "source_pdf": "Package_04_Malaysia_KL_Genting.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.562Z",
    "updated_at": "2026-08-13T15:28:37.562Z",
    "images": [
      "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Petronas Twin Towers",
      "Genting SkyWay Cable Car",
      "Batu Caves"
    ],
    "departure_info": "Dhaka to Kuala Lumpur"
  },
  {
    "id": "pkg_pdf_05",
    "destination_id": "dest_malaysia_langkawi",
    "destination_name": "Langkawi",
    "country": "Malaysia",
    "package_name": "Langkawi Island SkyBridge & Mangrove Safari",
    "duration": "3 Night 4 Days",
    "price": 22000,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 25000
      },
      {
        "pax": 4,
        "price": 22000
      }
    ],
    "description": "Tropical duty-free paradise, Langkawi Cable Car & SkyBridge, and Kilim Karst Mangrove boat tour.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival Langkawi",
        "activities": [
          "Airport pickup to Cenang Beach hotel"
        ],
        "meals": "None",
        "overnight": "Langkawi Resort"
      },
      {
        "day": 2,
        "title": "SkyBridge & Cable Car",
        "activities": [
          "Langkawi SkyCab ride & SkyBridge panoramic mountain view"
        ],
        "meals": "Breakfast",
        "overnight": "Langkawi Resort"
      },
      {
        "day": 3,
        "title": "Kilim Mangrove Boat Cruise",
        "activities": [
          "Eagle feeding, bat caves, and mangrove forest cruise"
        ],
        "meals": "Breakfast",
        "overnight": "Langkawi Resort"
      },
      {
        "day": 4,
        "title": "Departure",
        "activities": [
          "Transfer to Langkawi Airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Aseania Resort Langkawi or Similar",
    "meals": "Daily Breakfast",
    "transportation": "Private island transfers",
    "inclusions": [
      "3 Nights Beach Resort",
      "Cable Car & SkyBridge ticket",
      "Mangrove Boat Tour"
    ],
    "exclusions": [
      "Airfare & eVISA"
    ],
    "visa_information": "Malaysia eVISA required.",
    "required_documents": [
      "Passport",
      "Photos"
    ],
    "important_notes": [
      "Duty-free shopping allowed on island"
    ],
    "terms_conditions": [
      "Weather dependent boat trips"
    ],
    "source_pdf": "Package_05_Langkawi_Island_Resort.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.562Z",
    "updated_at": "2026-08-13T15:28:37.562Z",
    "images": [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Langkawi SkyBridge",
      "Mangrove Boat Safari",
      "Cenang Beach Sunset"
    ],
    "departure_info": "Dhaka to Langkawi"
  },
  {
    "id": "pkg_pdf_06",
    "destination_id": "dest_malaysia_penang",
    "destination_name": "Penang",
    "country": "Malaysia",
    "package_name": "Penang George Town Heritage & Street Food Haven",
    "duration": "3 Night 4 Days",
    "price": 21000,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 24000
      },
      {
        "pax": 4,
        "price": 21000
      }
    ],
    "description": "UNESCO heritage town, street murals, Penang Hill Funicular train, and night market feasts.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival Penang",
        "activities": [
          "Transfer to George Town heritage hotel"
        ],
        "meals": "None",
        "overnight": "Penang Hotel"
      },
      {
        "day": 2,
        "title": "George Town Mural & Clan Jetties Tour",
        "activities": [
          "Street art walk, Chew Jetty, Kek Lok Si Temple"
        ],
        "meals": "Breakfast",
        "overnight": "Penang Hotel"
      },
      {
        "day": 3,
        "title": "Penang Hill Funicular Train",
        "activities": [
          "Panoramic mountain air, Habitat nature park"
        ],
        "meals": "Breakfast",
        "overnight": "Penang Hotel"
      },
      {
        "day": 4,
        "title": "Departure",
        "activities": [
          "Airport transfer"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Bayview Hotel George Town",
    "meals": "Daily Breakfast",
    "transportation": "AC Van transfers",
    "inclusions": [
      "3 Nights Hotel",
      "Penang Hill Funicular ticket",
      "Heritage City Tour"
    ],
    "exclusions": [
      "Airfare & VISA"
    ],
    "visa_information": "Malaysia eVISA required.",
    "required_documents": [
      "Passport",
      "Photo"
    ],
    "important_notes": [
      "George Town is UNESCO protected"
    ],
    "terms_conditions": [
      "Standard terms apply"
    ],
    "source_pdf": "Package_06_Penang_Heritage_Food.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.562Z",
    "updated_at": "2026-08-13T15:28:37.562Z",
    "images": [
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Penang Hill Funicular",
      "George Town Street Murals",
      "Chew Jetty"
    ],
    "departure_info": "Dhaka to Penang"
  },
  {
    "id": "pkg_pdf_07",
    "destination_id": "dest_singapore",
    "destination_name": "Singapore",
    "country": "Singapore",
    "package_name": "Singapore Gardens by the Bay & Sentosa Island",
    "duration": "3 Night 4 Days",
    "price": 38000,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 42000
      },
      {
        "pax": 4,
        "price": 38000
      }
    ],
    "description": "Experience futuristic Supertree Grove, Cloud Forest dome, Cable Car to Sentosa Island, and Merlion Park.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival Changi Airport",
        "activities": [
          "Transfer to hotel",
          "Evening Spectra Light Show at Marina Bay"
        ],
        "meals": "None",
        "overnight": "Singapore Hotel"
      },
      {
        "day": 2,
        "title": "City Tour & Gardens by the Bay",
        "activities": [
          "Merlion Park, Chinatown, Cloud Forest & Flower Dome ticket"
        ],
        "meals": "Breakfast",
        "overnight": "Singapore Hotel"
      },
      {
        "day": 3,
        "title": "Sentosa Island Cable Car & Wings of Time",
        "activities": [
          "Sentosa Cable Car ride, Madam Tussauds & Wings of Time laser show"
        ],
        "meals": "Breakfast",
        "overnight": "Singapore Hotel"
      },
      {
        "day": 4,
        "title": "Departure",
        "activities": [
          "Jewel Changi waterfall visit & flight home"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Hotel Royal or Boss Singapore",
    "meals": "Daily Breakfast",
    "transportation": "Airport & Sightseeing Transfers",
    "inclusions": [
      "3 Nights Hotel",
      "Gardens by the Bay Double Domes",
      "Sentosa Cable Car + Wings of Time"
    ],
    "exclusions": [
      "Airfare & Singapore Visa"
    ],
    "visa_information": "Singapore Tourist Visa required.",
    "required_documents": [
      "Passport 6+ months",
      "Bank Statement",
      "Company NOC"
    ],
    "important_notes": [
      "Strict cleanliness laws in Singapore"
    ],
    "terms_conditions": [
      "Non-refundable tickets"
    ],
    "source_pdf": "Package_07_Singapore_Gardens_Sentosa.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.562Z",
    "updated_at": "2026-08-13T15:28:37.562Z",
    "images": [
      "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Gardens by the Bay",
      "Sentosa Cable Car",
      "Marina Bay Sands"
    ],
    "departure_info": "Dhaka to Singapore"
  },
  {
    "id": "pkg_pdf_08",
    "destination_id": "dest_combo_sing_mal",
    "destination_name": "Singapore & Malaysia",
    "country": "Combo (Singapore, Malaysia)",
    "package_name": "Singapore & Kuala Lumpur Twin Capital Special",
    "duration": "5 Night 6 Days",
    "price": 49500,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 54000
      },
      {
        "pax": 4,
        "price": 49500
      }
    ],
    "description": "Seamless twin capital getaway connected by deluxe AC express coach.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival Singapore",
        "activities": [
          "Hotel check-in and evening free"
        ],
        "meals": "None",
        "overnight": "Singapore Hotel"
      },
      {
        "day": 2,
        "title": "Singapore City & Sentosa",
        "activities": [
          "Merlion Park & Sentosa Cable Car"
        ],
        "meals": "Breakfast",
        "overnight": "Singapore Hotel"
      },
      {
        "day": 3,
        "title": "Express Coach to Kuala Lumpur",
        "activities": [
          "Cross Tuas border via luxury bus to KL"
        ],
        "meals": "Breakfast",
        "overnight": "KL Hotel"
      },
      {
        "day": 4,
        "title": "Genting Highlands & Batu Caves",
        "activities": [
          "Batu Caves & Genting SkyWay Cable car"
        ],
        "meals": "Breakfast",
        "overnight": "KL Hotel"
      },
      {
        "day": 5,
        "title": "KL City Sightseeing",
        "activities": [
          "Petronas Towers & Shopping at Pavilion"
        ],
        "meals": "Breakfast",
        "overnight": "KL Hotel"
      },
      {
        "day": 6,
        "title": "Departure",
        "activities": [
          "KLIA Airport Transfer"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Singapore: Hotel Royal | KL: Ibis Styles",
    "meals": "Daily Breakfast",
    "transportation": "Singapore-KL Express Coach & Airport transfers",
    "inclusions": [
      "2 Nights Singapore & 3 Nights KL",
      "Singapore-KL Coach ticket",
      "All transfers & sightseeing"
    ],
    "exclusions": [
      "Airfare & Visa fees"
    ],
    "visa_information": "Singapore & Malaysia visas required.",
    "required_documents": [
      "Passports",
      "Bank Statements",
      "Photos"
    ],
    "important_notes": [
      "Land border crossing between Singapore & Malaysia"
    ],
    "terms_conditions": [
      "Standard terms apply"
    ],
    "source_pdf": "Package_08_Singapore_Malaysia_Twin.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.562Z",
    "updated_at": "2026-08-13T15:28:37.562Z",
    "images": [
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Merlion Park",
      "Genting Cable Car",
      "Petronas Twin Towers"
    ],
    "departure_info": "Dhaka to Singapore / Return KL"
  },
  {
    "id": "pkg_pdf_09",
    "destination_id": "dest_combo_seasia",
    "destination_name": "Thailand, Malaysia & Singapore",
    "country": "Combo (Thailand, Singapore, Malaysia)",
    "package_name": "Trination Southeast Asia Odyssey (Bangkok, KL, Singapore)",
    "duration": "7 Night 8 Days",
    "price": 72000,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 78000
      },
      {
        "pax": 4,
        "price": 72000
      }
    ],
    "description": "The ultimate 3-country Southeast Asian capital tour.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival Bangkok",
        "activities": [
          "Airport pickup to Bangkok hotel"
        ],
        "meals": "None",
        "overnight": "Bangkok Hotel"
      },
      {
        "day": 2,
        "title": "Bangkok Temples & Coral Island",
        "activities": [
          "Day trip Coral Island Pattaya"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "Bangkok Hotel"
      },
      {
        "day": 3,
        "title": "Flight Bangkok to Kuala Lumpur",
        "activities": [
          "Airport transfer and flight to KL"
        ],
        "meals": "Breakfast",
        "overnight": "KL Hotel"
      },
      {
        "day": 4,
        "title": "Batu Caves & Genting Highlands",
        "activities": [
          "Genting cable car tour"
        ],
        "meals": "Breakfast",
        "overnight": "KL Hotel"
      },
      {
        "day": 5,
        "title": "Luxury Coach to Singapore",
        "activities": [
          "Intercity coach ride to Singapore"
        ],
        "meals": "Breakfast",
        "overnight": "Singapore Hotel"
      },
      {
        "day": 6,
        "title": "Gardens by the Bay & Sentosa",
        "activities": [
          "Cloud forest & Sentosa cable car"
        ],
        "meals": "Breakfast",
        "overnight": "Singapore Hotel"
      },
      {
        "day": 7,
        "title": "Universal Studios Option",
        "activities": [
          "Full day free or Universal Studios"
        ],
        "meals": "Breakfast",
        "overnight": "Singapore Hotel"
      },
      {
        "day": 8,
        "title": "Departure Changi",
        "activities": [
          "Airport transfer to Changi"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Bangkok: Anya Nana | KL: Ibis | Singapore: Boss",
    "meals": "Daily Breakfast, 1 Lunch",
    "transportation": "Intercity Coach & Airport Transfers",
    "inclusions": [
      "2N Bangkok, 2N KL, 3N Singapore",
      "Intercity Coach",
      "All major city tours"
    ],
    "exclusions": [
      "Airfare (Dhaka-BKK, BKK-KUL, SIN-Dhaka)",
      "Visas"
    ],
    "visa_information": "Thailand, Malaysia & Singapore Visas required.",
    "required_documents": [
      "Passport 6+ months",
      "3 Country Visa Documents"
    ],
    "important_notes": [
      "Multi-entry permissions verified"
    ],
    "terms_conditions": [
      "Strict cancellation policies"
    ],
    "source_pdf": "Package_09_Trination_SEAsia_Odyssey.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.562Z",
    "updated_at": "2026-08-13T15:28:37.562Z",
    "images": [
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "3 Countries in 1 Trip",
      "Gardens by the Bay",
      "Genting Cable Car"
    ],
    "departure_info": "Dhaka - Bangkok - KL - Singapore - Dhaka"
  },
  {
    "id": "pkg_pdf_10",
    "destination_id": "dest_vietnam_halong",
    "destination_name": "Hanoi & Ha Long Bay",
    "country": "Vietnam",
    "package_name": "Hanoi, Ha Long Bay 5-Star Cruise & Ninh Binh",
    "duration": "4 Night 5 Days",
    "price": 28500,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 31500
      },
      {
        "pax": 4,
        "price": 28500
      }
    ],
    "description": "Emerald limestone karsts of Ha Long Bay overnight cruise and Trang An sampan boat in Ninh Binh.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival Hanoi",
        "activities": [
          "Airport pickup & Old Quarter walk"
        ],
        "meals": "None",
        "overnight": "Hanoi Hotel"
      },
      {
        "day": 2,
        "title": "Ha Long Bay 5-Star Cruise Departure",
        "activities": [
          "Board luxury cruise, kayak through limestone caves, seafood dinner"
        ],
        "meals": "Breakfast, Lunch & Dinner",
        "overnight": "Ha Long Cruise Cabin"
      },
      {
        "day": 3,
        "title": "Ha Long Sunrise & Return Hanoi",
        "activities": [
          "Tai Chi on deck, Sung Sot Cave visit, return to Hanoi"
        ],
        "meals": "Breakfast & Brunch",
        "overnight": "Hanoi Hotel"
      },
      {
        "day": 4,
        "title": "Ninh Binh Trang An Sampan Boat Tour",
        "activities": [
          "Rowing boat through karst caves & Bai Dinh Pagoda"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "Hanoi Hotel"
      },
      {
        "day": 5,
        "title": "Departure",
        "activities": [
          "Transfer to Noi Bai Airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Hanoi: Silk Path Hotel | Cruise: Peony / Doris Cruise",
    "meals": "Daily Breakfast, 2 Lunches, 1 Deluxe Dinner",
    "transportation": "Limousine Van transfers & Luxury Cruise",
    "inclusions": [
      "1 Night 5-Star Ha Long Cruise",
      "3 Nights Hanoi Hotel",
      "Kayaking & Cave Entry fees",
      "Trang An boat trip"
    ],
    "exclusions": [
      "Airfare & Vietnam eVISA ($25)"
    ],
    "visa_information": "Vietnam eVISA required (issued online in 3 days).",
    "required_documents": [
      "Passport Copy",
      "Digital Passport Photo"
    ],
    "important_notes": [
      "Cruise cabin includes private balcony"
    ],
    "terms_conditions": [
      "Weather subject cruise modifications"
    ],
    "source_pdf": "Package_10_Vietnam_Hanoi_HaLong_Cruise.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.562Z",
    "updated_at": "2026-08-13T15:28:37.562Z",
    "images": [
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Overnight Ha Long Bay Cruise",
      "Trang An Sampan Boat",
      "Hanoi Old Quarter"
    ],
    "departure_info": "Dhaka to Hanoi"
  },
  {
    "id": "pkg_pdf_11",
    "destination_id": "dest_vietnam",
    "destination_name": "Da Nang & Ba Na Hills",
    "country": "Vietnam",
    "package_name": "Da Nang Golden Hands Bridge & Hoi An Lantern City",
    "duration": "3 Night 4 Days",
    "price": 29000,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 33350
      },
      {
        "pax": 4,
        "price": 29000
      }
    ],
    "description": "Official PDF itinerary for Da Nang Golden Hands Bridge & Hoi An Lantern City in Vietnam. Complete day-by-day sightseeing and hotel accommodations included.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Da Nang & Ba Na Hills",
        "activities": [
          "Airport welcome greeting and private transfer to hotel",
          "Check-in and evening at leisure"
        ],
        "meals": "Dinner on your own",
        "overnight": "3/4-Star Hotel Da Nang & Ba Na Hills"
      },
      {
        "day": 2,
        "title": "Full Day Sightseeing Tour of Da Nang & Ba Na Hills",
        "activities": [
          "Visit top attractions, historic landmarks, and scenic viewpoints",
          "Guided tour with English speaking guide"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "3/4-Star Hotel Da Nang & Ba Na Hills"
      },
      {
        "day": 3,
        "title": "Cultural Experience & Shopping",
        "activities": [
          "Explore traditional bazaars and local shopping hubs",
          "Evening leisure or optional cruise"
        ],
        "meals": "Breakfast",
        "overnight": "3/4-Star Hotel Da Nang & Ba Na Hills"
      },
      {
        "day": 4,
        "title": "Departure Transfer",
        "activities": [
          "Hotel checkout and transfer to international airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Top-rated 3/4-Star Hotels in Da Nang & Ba Na Hills",
    "meals": "Daily Breakfast at hotel, 1 Lunch included",
    "transportation": "AC Private/Shared Transfers & Sightseeing",
    "inclusions": [
      "3 Night 4 Days Hotel Stay",
      "Daily Breakfast",
      "Airport Return Transfers",
      "Guided City Tour"
    ],
    "exclusions": [
      "International Airfare",
      "Visa Fees",
      "Personal Laundry & Tips"
    ],
    "visa_information": "Visa guidance provided for Vietnam.",
    "required_documents": [
      "Passport valid for 6+ months",
      "Bank Statement",
      "Photos"
    ],
    "important_notes": [
      "Confirmed bookings subject to availability"
    ],
    "terms_conditions": [
      "Agency cancellation terms apply"
    ],
    "source_pdf": "Package_11_Vietnam_DaNang_BaNaHills.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.562Z",
    "updated_at": "2026-08-13T15:28:37.562Z",
    "images": [
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Sightseeing in Da Nang & Ba Na Hills",
      "Verified PDF Itinerary",
      "Guided Transfers"
    ],
    "departure_info": "Dhaka to Da Nang & Ba Na Hills"
  },
  {
    "id": "pkg_pdf_12",
    "destination_id": "dest_vietnam",
    "destination_name": "Ho Chi Minh City",
    "country": "Vietnam",
    "package_name": "Ho Chi Minh & Cu Chi Tunnels Mekong Delta",
    "duration": "3 Night 4 Days",
    "price": 26500,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 30475
      },
      {
        "pax": 4,
        "price": 26500
      }
    ],
    "description": "Official PDF itinerary for Ho Chi Minh & Cu Chi Tunnels Mekong Delta in Vietnam. Complete day-by-day sightseeing and hotel accommodations included.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Ho Chi Minh City",
        "activities": [
          "Airport welcome greeting and private transfer to hotel",
          "Check-in and evening at leisure"
        ],
        "meals": "Dinner on your own",
        "overnight": "3/4-Star Hotel Ho Chi Minh City"
      },
      {
        "day": 2,
        "title": "Full Day Sightseeing Tour of Ho Chi Minh City",
        "activities": [
          "Visit top attractions, historic landmarks, and scenic viewpoints",
          "Guided tour with English speaking guide"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "3/4-Star Hotel Ho Chi Minh City"
      },
      {
        "day": 3,
        "title": "Cultural Experience & Shopping",
        "activities": [
          "Explore traditional bazaars and local shopping hubs",
          "Evening leisure or optional cruise"
        ],
        "meals": "Breakfast",
        "overnight": "3/4-Star Hotel Ho Chi Minh City"
      },
      {
        "day": 4,
        "title": "Departure Transfer",
        "activities": [
          "Hotel checkout and transfer to international airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Top-rated 3/4-Star Hotels in Ho Chi Minh City",
    "meals": "Daily Breakfast at hotel, 1 Lunch included",
    "transportation": "AC Private/Shared Transfers & Sightseeing",
    "inclusions": [
      "3 Night 4 Days Hotel Stay",
      "Daily Breakfast",
      "Airport Return Transfers",
      "Guided City Tour"
    ],
    "exclusions": [
      "International Airfare",
      "Visa Fees",
      "Personal Laundry & Tips"
    ],
    "visa_information": "Visa guidance provided for Vietnam.",
    "required_documents": [
      "Passport valid for 6+ months",
      "Bank Statement",
      "Photos"
    ],
    "important_notes": [
      "Confirmed bookings subject to availability"
    ],
    "terms_conditions": [
      "Agency cancellation terms apply"
    ],
    "source_pdf": "Package_12_Vietnam_Saigon_Mekong.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.562Z",
    "updated_at": "2026-08-13T15:28:37.562Z",
    "images": [
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Sightseeing in Ho Chi Minh City",
      "Verified PDF Itinerary",
      "Guided Transfers"
    ],
    "departure_info": "Dhaka to Ho Chi Minh City"
  },
  {
    "id": "pkg_pdf_13",
    "destination_id": "dest_indonesia",
    "destination_name": "Bali (Ubud & Kuta)",
    "country": "Indonesia",
    "package_name": "Bali Ubud Sacred Monkey Forest & Tanlot Temple",
    "duration": "4 Night 5 Days",
    "price": 34000,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 39100
      },
      {
        "pax": 4,
        "price": 34000
      }
    ],
    "description": "Official PDF itinerary for Bali Ubud Sacred Monkey Forest & Tanlot Temple in Indonesia. Complete day-by-day sightseeing and hotel accommodations included.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Bali (Ubud & Kuta)",
        "activities": [
          "Airport welcome greeting and private transfer to hotel",
          "Check-in and evening at leisure"
        ],
        "meals": "Dinner on your own",
        "overnight": "3/4-Star Hotel Bali (Ubud & Kuta)"
      },
      {
        "day": 2,
        "title": "Full Day Sightseeing Tour of Bali (Ubud & Kuta)",
        "activities": [
          "Visit top attractions, historic landmarks, and scenic viewpoints",
          "Guided tour with English speaking guide"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "3/4-Star Hotel Bali (Ubud & Kuta)"
      },
      {
        "day": 3,
        "title": "Cultural Experience & Shopping",
        "activities": [
          "Explore traditional bazaars and local shopping hubs",
          "Evening leisure or optional cruise"
        ],
        "meals": "Breakfast",
        "overnight": "3/4-Star Hotel Bali (Ubud & Kuta)"
      },
      {
        "day": 4,
        "title": "Departure Transfer",
        "activities": [
          "Hotel checkout and transfer to international airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Top-rated 3/4-Star Hotels in Bali (Ubud & Kuta)",
    "meals": "Daily Breakfast at hotel, 1 Lunch included",
    "transportation": "AC Private/Shared Transfers & Sightseeing",
    "inclusions": [
      "4 Night 5 Days Hotel Stay",
      "Daily Breakfast",
      "Airport Return Transfers",
      "Guided City Tour"
    ],
    "exclusions": [
      "International Airfare",
      "Visa Fees",
      "Personal Laundry & Tips"
    ],
    "visa_information": "Visa guidance provided for Indonesia.",
    "required_documents": [
      "Passport valid for 6+ months",
      "Bank Statement",
      "Photos"
    ],
    "important_notes": [
      "Confirmed bookings subject to availability"
    ],
    "terms_conditions": [
      "Agency cancellation terms apply"
    ],
    "source_pdf": "Package_13_Bali_Ubud_Kuta_Resort.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.562Z",
    "updated_at": "2026-08-13T15:28:37.562Z",
    "images": [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Sightseeing in Bali (Ubud & Kuta)",
      "Verified PDF Itinerary",
      "Guided Transfers"
    ],
    "departure_info": "Dhaka to Bali (Ubud & Kuta)"
  },
  {
    "id": "pkg_pdf_14",
    "destination_id": "dest_indonesia",
    "destination_name": "Bali (Nusa Penida)",
    "country": "Indonesia",
    "package_name": "Nusa Penida Kelingking Beach Speedboat Escape",
    "duration": "3 Night 4 Days",
    "price": 31500,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 36225
      },
      {
        "pax": 4,
        "price": 31500
      }
    ],
    "description": "Official PDF itinerary for Nusa Penida Kelingking Beach Speedboat Escape in Indonesia. Complete day-by-day sightseeing and hotel accommodations included.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Bali (Nusa Penida)",
        "activities": [
          "Airport welcome greeting and private transfer to hotel",
          "Check-in and evening at leisure"
        ],
        "meals": "Dinner on your own",
        "overnight": "3/4-Star Hotel Bali (Nusa Penida)"
      },
      {
        "day": 2,
        "title": "Full Day Sightseeing Tour of Bali (Nusa Penida)",
        "activities": [
          "Visit top attractions, historic landmarks, and scenic viewpoints",
          "Guided tour with English speaking guide"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "3/4-Star Hotel Bali (Nusa Penida)"
      },
      {
        "day": 3,
        "title": "Cultural Experience & Shopping",
        "activities": [
          "Explore traditional bazaars and local shopping hubs",
          "Evening leisure or optional cruise"
        ],
        "meals": "Breakfast",
        "overnight": "3/4-Star Hotel Bali (Nusa Penida)"
      },
      {
        "day": 4,
        "title": "Departure Transfer",
        "activities": [
          "Hotel checkout and transfer to international airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Top-rated 3/4-Star Hotels in Bali (Nusa Penida)",
    "meals": "Daily Breakfast at hotel, 1 Lunch included",
    "transportation": "AC Private/Shared Transfers & Sightseeing",
    "inclusions": [
      "3 Night 4 Days Hotel Stay",
      "Daily Breakfast",
      "Airport Return Transfers",
      "Guided City Tour"
    ],
    "exclusions": [
      "International Airfare",
      "Visa Fees",
      "Personal Laundry & Tips"
    ],
    "visa_information": "Visa guidance provided for Indonesia.",
    "required_documents": [
      "Passport valid for 6+ months",
      "Bank Statement",
      "Photos"
    ],
    "important_notes": [
      "Confirmed bookings subject to availability"
    ],
    "terms_conditions": [
      "Agency cancellation terms apply"
    ],
    "source_pdf": "Package_14_Bali_Nusa_Penida_Speedboat.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.562Z",
    "updated_at": "2026-08-13T15:28:37.562Z",
    "images": [
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Sightseeing in Bali (Nusa Penida)",
      "Verified PDF Itinerary",
      "Guided Transfers"
    ],
    "departure_info": "Dhaka to Bali (Nusa Penida)"
  },
  {
    "id": "pkg_pdf_15",
    "destination_id": "dest_maldives",
    "destination_name": "Hulhumale Lagoon",
    "country": "Maldives",
    "package_name": "Maldives Hulhumale & Resort Water Villa Day Pass",
    "duration": "3 Night 4 Days",
    "price": 48000,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 55200
      },
      {
        "pax": 4,
        "price": 48000
      }
    ],
    "description": "Official PDF itinerary for Maldives Hulhumale & Resort Water Villa Day Pass in Maldives. Complete day-by-day sightseeing and hotel accommodations included.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Hulhumale Lagoon",
        "activities": [
          "Airport welcome greeting and private transfer to hotel",
          "Check-in and evening at leisure"
        ],
        "meals": "Dinner on your own",
        "overnight": "3/4-Star Hotel Hulhumale Lagoon"
      },
      {
        "day": 2,
        "title": "Full Day Sightseeing Tour of Hulhumale Lagoon",
        "activities": [
          "Visit top attractions, historic landmarks, and scenic viewpoints",
          "Guided tour with English speaking guide"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "3/4-Star Hotel Hulhumale Lagoon"
      },
      {
        "day": 3,
        "title": "Cultural Experience & Shopping",
        "activities": [
          "Explore traditional bazaars and local shopping hubs",
          "Evening leisure or optional cruise"
        ],
        "meals": "Breakfast",
        "overnight": "3/4-Star Hotel Hulhumale Lagoon"
      },
      {
        "day": 4,
        "title": "Departure Transfer",
        "activities": [
          "Hotel checkout and transfer to international airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Top-rated 3/4-Star Hotels in Hulhumale Lagoon",
    "meals": "Daily Breakfast at hotel, 1 Lunch included",
    "transportation": "AC Private/Shared Transfers & Sightseeing",
    "inclusions": [
      "3 Night 4 Days Hotel Stay",
      "Daily Breakfast",
      "Airport Return Transfers",
      "Guided City Tour"
    ],
    "exclusions": [
      "International Airfare",
      "Visa Fees",
      "Personal Laundry & Tips"
    ],
    "visa_information": "Visa guidance provided for Maldives.",
    "required_documents": [
      "Passport valid for 6+ months",
      "Bank Statement",
      "Photos"
    ],
    "important_notes": [
      "Confirmed bookings subject to availability"
    ],
    "terms_conditions": [
      "Agency cancellation terms apply"
    ],
    "source_pdf": "Package_15_Maldives_Water_Villa_Lagoon.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.562Z",
    "updated_at": "2026-08-13T15:28:37.562Z",
    "images": [
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Sightseeing in Hulhumale Lagoon",
      "Verified PDF Itinerary",
      "Guided Transfers"
    ],
    "departure_info": "Dhaka to Hulhumale Lagoon"
  },
  {
    "id": "pkg_pdf_16",
    "destination_id": "dest_combo__maldives__srilanka_",
    "destination_name": "Maldives & Sri Lanka",
    "country": "Combo (Maldives, Srilanka)",
    "package_name": "Maldives Beach & Sri Lanka Colombo Cultural Combo",
    "duration": "5 Night 6 Days",
    "price": 58000,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 66700
      },
      {
        "pax": 4,
        "price": 58000
      }
    ],
    "description": "Official PDF itinerary for Maldives Beach & Sri Lanka Colombo Cultural Combo in Combo (Maldives, Srilanka). Complete day-by-day sightseeing and hotel accommodations included.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Maldives & Sri Lanka",
        "activities": [
          "Airport welcome greeting and private transfer to hotel",
          "Check-in and evening at leisure"
        ],
        "meals": "Dinner on your own",
        "overnight": "3/4-Star Hotel Maldives & Sri Lanka"
      },
      {
        "day": 2,
        "title": "Full Day Sightseeing Tour of Maldives & Sri Lanka",
        "activities": [
          "Visit top attractions, historic landmarks, and scenic viewpoints",
          "Guided tour with English speaking guide"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "3/4-Star Hotel Maldives & Sri Lanka"
      },
      {
        "day": 3,
        "title": "Cultural Experience & Shopping",
        "activities": [
          "Explore traditional bazaars and local shopping hubs",
          "Evening leisure or optional cruise"
        ],
        "meals": "Breakfast",
        "overnight": "3/4-Star Hotel Maldives & Sri Lanka"
      },
      {
        "day": 4,
        "title": "Departure Transfer",
        "activities": [
          "Hotel checkout and transfer to international airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Top-rated 3/4-Star Hotels in Maldives & Sri Lanka",
    "meals": "Daily Breakfast at hotel, 1 Lunch included",
    "transportation": "AC Private/Shared Transfers & Sightseeing",
    "inclusions": [
      "5 Night 6 Days Hotel Stay",
      "Daily Breakfast",
      "Airport Return Transfers",
      "Guided City Tour"
    ],
    "exclusions": [
      "International Airfare",
      "Visa Fees",
      "Personal Laundry & Tips"
    ],
    "visa_information": "Visa guidance provided for Combo (Maldives, Srilanka).",
    "required_documents": [
      "Passport valid for 6+ months",
      "Bank Statement",
      "Photos"
    ],
    "important_notes": [
      "Confirmed bookings subject to availability"
    ],
    "terms_conditions": [
      "Agency cancellation terms apply"
    ],
    "source_pdf": "Package_16_Maldives_SriLanka_Combo.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.562Z",
    "updated_at": "2026-08-13T15:28:37.562Z",
    "images": [
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Sightseeing in Maldives & Sri Lanka",
      "Verified PDF Itinerary",
      "Guided Transfers"
    ],
    "departure_info": "Dhaka to Maldives & Sri Lanka"
  },
  {
    "id": "pkg_pdf_17",
    "destination_id": "dest_sri_lanka",
    "destination_name": "Kandy & Nuwara Eliya",
    "country": "Sri Lanka",
    "package_name": "Sri Lanka Tea Gardens, Kandy & Bentota Beach",
    "duration": "4 Night 5 Days",
    "price": 32500,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 37375
      },
      {
        "pax": 4,
        "price": 32500
      }
    ],
    "description": "Official PDF itinerary for Sri Lanka Tea Gardens, Kandy & Bentota Beach in Sri Lanka. Complete day-by-day sightseeing and hotel accommodations included.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Kandy & Nuwara Eliya",
        "activities": [
          "Airport welcome greeting and private transfer to hotel",
          "Check-in and evening at leisure"
        ],
        "meals": "Dinner on your own",
        "overnight": "3/4-Star Hotel Kandy & Nuwara Eliya"
      },
      {
        "day": 2,
        "title": "Full Day Sightseeing Tour of Kandy & Nuwara Eliya",
        "activities": [
          "Visit top attractions, historic landmarks, and scenic viewpoints",
          "Guided tour with English speaking guide"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "3/4-Star Hotel Kandy & Nuwara Eliya"
      },
      {
        "day": 3,
        "title": "Cultural Experience & Shopping",
        "activities": [
          "Explore traditional bazaars and local shopping hubs",
          "Evening leisure or optional cruise"
        ],
        "meals": "Breakfast",
        "overnight": "3/4-Star Hotel Kandy & Nuwara Eliya"
      },
      {
        "day": 4,
        "title": "Departure Transfer",
        "activities": [
          "Hotel checkout and transfer to international airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Top-rated 3/4-Star Hotels in Kandy & Nuwara Eliya",
    "meals": "Daily Breakfast at hotel, 1 Lunch included",
    "transportation": "AC Private/Shared Transfers & Sightseeing",
    "inclusions": [
      "4 Night 5 Days Hotel Stay",
      "Daily Breakfast",
      "Airport Return Transfers",
      "Guided City Tour"
    ],
    "exclusions": [
      "International Airfare",
      "Visa Fees",
      "Personal Laundry & Tips"
    ],
    "visa_information": "Visa guidance provided for Sri Lanka.",
    "required_documents": [
      "Passport valid for 6+ months",
      "Bank Statement",
      "Photos"
    ],
    "important_notes": [
      "Confirmed bookings subject to availability"
    ],
    "terms_conditions": [
      "Agency cancellation terms apply"
    ],
    "source_pdf": "Package_17_SriLanka_Kandy_Bentota.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.562Z",
    "updated_at": "2026-08-13T15:28:37.562Z",
    "images": [
      "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Sightseeing in Kandy & Nuwara Eliya",
      "Verified PDF Itinerary",
      "Guided Transfers"
    ],
    "departure_info": "Dhaka to Kandy & Nuwara Eliya"
  },
  {
    "id": "pkg_pdf_18",
    "destination_id": "dest_nepal",
    "destination_name": "Kathmandu & Pokhara",
    "country": "Nepal",
    "package_name": "Nepal Pokhara Phewa Lake & Annapurna View",
    "duration": "4 Night 5 Days",
    "price": 19500,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 22425
      },
      {
        "pax": 4,
        "price": 19500
      }
    ],
    "description": "Official PDF itinerary for Nepal Pokhara Phewa Lake & Annapurna View in Nepal. Complete day-by-day sightseeing and hotel accommodations included.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Kathmandu & Pokhara",
        "activities": [
          "Airport welcome greeting and private transfer to hotel",
          "Check-in and evening at leisure"
        ],
        "meals": "Dinner on your own",
        "overnight": "3/4-Star Hotel Kathmandu & Pokhara"
      },
      {
        "day": 2,
        "title": "Full Day Sightseeing Tour of Kathmandu & Pokhara",
        "activities": [
          "Visit top attractions, historic landmarks, and scenic viewpoints",
          "Guided tour with English speaking guide"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "3/4-Star Hotel Kathmandu & Pokhara"
      },
      {
        "day": 3,
        "title": "Cultural Experience & Shopping",
        "activities": [
          "Explore traditional bazaars and local shopping hubs",
          "Evening leisure or optional cruise"
        ],
        "meals": "Breakfast",
        "overnight": "3/4-Star Hotel Kathmandu & Pokhara"
      },
      {
        "day": 4,
        "title": "Departure Transfer",
        "activities": [
          "Hotel checkout and transfer to international airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Top-rated 3/4-Star Hotels in Kathmandu & Pokhara",
    "meals": "Daily Breakfast at hotel, 1 Lunch included",
    "transportation": "AC Private/Shared Transfers & Sightseeing",
    "inclusions": [
      "4 Night 5 Days Hotel Stay",
      "Daily Breakfast",
      "Airport Return Transfers",
      "Guided City Tour"
    ],
    "exclusions": [
      "International Airfare",
      "Visa Fees",
      "Personal Laundry & Tips"
    ],
    "visa_information": "Visa guidance provided for Nepal.",
    "required_documents": [
      "Passport valid for 6+ months",
      "Bank Statement",
      "Photos"
    ],
    "important_notes": [
      "Confirmed bookings subject to availability"
    ],
    "terms_conditions": [
      "Agency cancellation terms apply"
    ],
    "source_pdf": "Package_18_Nepal_Kathmandu_Pokhara.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.563Z",
    "updated_at": "2026-08-13T15:28:37.563Z",
    "images": [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Sightseeing in Kathmandu & Pokhara",
      "Verified PDF Itinerary",
      "Guided Transfers"
    ],
    "departure_info": "Dhaka to Kathmandu & Pokhara"
  },
  {
    "id": "pkg_pdf_19",
    "destination_id": "dest_nepal",
    "destination_name": "Nagarkot & Pokhara",
    "country": "Nepal",
    "package_name": "Nepal Nagarkot Himalayan Sunrise & Sarangkot Paragliding",
    "duration": "5 Night 6 Days",
    "price": 23000,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 26450
      },
      {
        "pax": 4,
        "price": 23000
      }
    ],
    "description": "Official PDF itinerary for Nepal Nagarkot Himalayan Sunrise & Sarangkot Paragliding in Nepal. Complete day-by-day sightseeing and hotel accommodations included.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Nagarkot & Pokhara",
        "activities": [
          "Airport welcome greeting and private transfer to hotel",
          "Check-in and evening at leisure"
        ],
        "meals": "Dinner on your own",
        "overnight": "3/4-Star Hotel Nagarkot & Pokhara"
      },
      {
        "day": 2,
        "title": "Full Day Sightseeing Tour of Nagarkot & Pokhara",
        "activities": [
          "Visit top attractions, historic landmarks, and scenic viewpoints",
          "Guided tour with English speaking guide"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "3/4-Star Hotel Nagarkot & Pokhara"
      },
      {
        "day": 3,
        "title": "Cultural Experience & Shopping",
        "activities": [
          "Explore traditional bazaars and local shopping hubs",
          "Evening leisure or optional cruise"
        ],
        "meals": "Breakfast",
        "overnight": "3/4-Star Hotel Nagarkot & Pokhara"
      },
      {
        "day": 4,
        "title": "Departure Transfer",
        "activities": [
          "Hotel checkout and transfer to international airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Top-rated 3/4-Star Hotels in Nagarkot & Pokhara",
    "meals": "Daily Breakfast at hotel, 1 Lunch included",
    "transportation": "AC Private/Shared Transfers & Sightseeing",
    "inclusions": [
      "5 Night 6 Days Hotel Stay",
      "Daily Breakfast",
      "Airport Return Transfers",
      "Guided City Tour"
    ],
    "exclusions": [
      "International Airfare",
      "Visa Fees",
      "Personal Laundry & Tips"
    ],
    "visa_information": "Visa guidance provided for Nepal.",
    "required_documents": [
      "Passport valid for 6+ months",
      "Bank Statement",
      "Photos"
    ],
    "important_notes": [
      "Confirmed bookings subject to availability"
    ],
    "terms_conditions": [
      "Agency cancellation terms apply"
    ],
    "source_pdf": "Package_19_Nepal_Nagarkot_Sunrise.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.563Z",
    "updated_at": "2026-08-13T15:28:37.563Z",
    "images": [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Sightseeing in Nagarkot & Pokhara",
      "Verified PDF Itinerary",
      "Guided Transfers"
    ],
    "departure_info": "Dhaka to Nagarkot & Pokhara"
  },
  {
    "id": "pkg_pdf_20",
    "destination_id": "dest_bhutan",
    "destination_name": "Thimphu & Paro",
    "country": "Bhutan",
    "package_name": "Bhutan Tiger's Nest Monastery & Punakha Dzong",
    "duration": "4 Night 5 Days",
    "price": 39500,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 45425
      },
      {
        "pax": 4,
        "price": 39500
      }
    ],
    "description": "Official PDF itinerary for Bhutan Tiger's Nest Monastery & Punakha Dzong in Bhutan. Complete day-by-day sightseeing and hotel accommodations included.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Thimphu & Paro",
        "activities": [
          "Airport welcome greeting and private transfer to hotel",
          "Check-in and evening at leisure"
        ],
        "meals": "Dinner on your own",
        "overnight": "3/4-Star Hotel Thimphu & Paro"
      },
      {
        "day": 2,
        "title": "Full Day Sightseeing Tour of Thimphu & Paro",
        "activities": [
          "Visit top attractions, historic landmarks, and scenic viewpoints",
          "Guided tour with English speaking guide"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "3/4-Star Hotel Thimphu & Paro"
      },
      {
        "day": 3,
        "title": "Cultural Experience & Shopping",
        "activities": [
          "Explore traditional bazaars and local shopping hubs",
          "Evening leisure or optional cruise"
        ],
        "meals": "Breakfast",
        "overnight": "3/4-Star Hotel Thimphu & Paro"
      },
      {
        "day": 4,
        "title": "Departure Transfer",
        "activities": [
          "Hotel checkout and transfer to international airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Top-rated 3/4-Star Hotels in Thimphu & Paro",
    "meals": "Daily Breakfast at hotel, 1 Lunch included",
    "transportation": "AC Private/Shared Transfers & Sightseeing",
    "inclusions": [
      "4 Night 5 Days Hotel Stay",
      "Daily Breakfast",
      "Airport Return Transfers",
      "Guided City Tour"
    ],
    "exclusions": [
      "International Airfare",
      "Visa Fees",
      "Personal Laundry & Tips"
    ],
    "visa_information": "Visa guidance provided for Bhutan.",
    "required_documents": [
      "Passport valid for 6+ months",
      "Bank Statement",
      "Photos"
    ],
    "important_notes": [
      "Confirmed bookings subject to availability"
    ],
    "terms_conditions": [
      "Agency cancellation terms apply"
    ],
    "source_pdf": "Package_20_Bhutan_Tigers_Nest_Monastery.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.563Z",
    "updated_at": "2026-08-13T15:28:37.563Z",
    "images": [
      "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Sightseeing in Thimphu & Paro",
      "Verified PDF Itinerary",
      "Guided Transfers"
    ],
    "departure_info": "Dhaka to Thimphu & Paro"
  },
  {
    "id": "pkg_pdf_21",
    "destination_id": "dest_india",
    "destination_name": "Kashmir Valley",
    "country": "India",
    "package_name": "Kashmir Paradise (Srinagar Shikara, Gulmarg Gondola, Pahalgam)",
    "duration": "5 Night 6 Days",
    "price": 28000,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 32200
      },
      {
        "pax": 4,
        "price": 28000
      }
    ],
    "description": "Official PDF itinerary for Kashmir Paradise (Srinagar Shikara, Gulmarg Gondola, Pahalgam) in India. Complete day-by-day sightseeing and hotel accommodations included.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Kashmir Valley",
        "activities": [
          "Airport welcome greeting and private transfer to hotel",
          "Check-in and evening at leisure"
        ],
        "meals": "Dinner on your own",
        "overnight": "3/4-Star Hotel Kashmir Valley"
      },
      {
        "day": 2,
        "title": "Full Day Sightseeing Tour of Kashmir Valley",
        "activities": [
          "Visit top attractions, historic landmarks, and scenic viewpoints",
          "Guided tour with English speaking guide"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "3/4-Star Hotel Kashmir Valley"
      },
      {
        "day": 3,
        "title": "Cultural Experience & Shopping",
        "activities": [
          "Explore traditional bazaars and local shopping hubs",
          "Evening leisure or optional cruise"
        ],
        "meals": "Breakfast",
        "overnight": "3/4-Star Hotel Kashmir Valley"
      },
      {
        "day": 4,
        "title": "Departure Transfer",
        "activities": [
          "Hotel checkout and transfer to international airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Top-rated 3/4-Star Hotels in Kashmir Valley",
    "meals": "Daily Breakfast at hotel, 1 Lunch included",
    "transportation": "AC Private/Shared Transfers & Sightseeing",
    "inclusions": [
      "5 Night 6 Days Hotel Stay",
      "Daily Breakfast",
      "Airport Return Transfers",
      "Guided City Tour"
    ],
    "exclusions": [
      "International Airfare",
      "Visa Fees",
      "Personal Laundry & Tips"
    ],
    "visa_information": "Visa guidance provided for India.",
    "required_documents": [
      "Passport valid for 6+ months",
      "Bank Statement",
      "Photos"
    ],
    "important_notes": [
      "Confirmed bookings subject to availability"
    ],
    "terms_conditions": [
      "Agency cancellation terms apply"
    ],
    "source_pdf": "Package_21_Kashmir_Gulmarg_Gondola.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.563Z",
    "updated_at": "2026-08-13T15:28:37.563Z",
    "images": [
      "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Sightseeing in Kashmir Valley",
      "Verified PDF Itinerary",
      "Guided Transfers"
    ],
    "departure_info": "Dhaka to Kashmir Valley"
  },
  {
    "id": "pkg_pdf_22",
    "destination_id": "dest_india",
    "destination_name": "Golden Triangle",
    "country": "India",
    "package_name": "India Golden Triangle (Delhi, Agra Taj Mahal, Jaipur Forts)",
    "duration": "5 Night 6 Days",
    "price": 31000,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 35650
      },
      {
        "pax": 4,
        "price": 31000
      }
    ],
    "description": "Official PDF itinerary for India Golden Triangle (Delhi, Agra Taj Mahal, Jaipur Forts) in India. Complete day-by-day sightseeing and hotel accommodations included.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Golden Triangle",
        "activities": [
          "Airport welcome greeting and private transfer to hotel",
          "Check-in and evening at leisure"
        ],
        "meals": "Dinner on your own",
        "overnight": "3/4-Star Hotel Golden Triangle"
      },
      {
        "day": 2,
        "title": "Full Day Sightseeing Tour of Golden Triangle",
        "activities": [
          "Visit top attractions, historic landmarks, and scenic viewpoints",
          "Guided tour with English speaking guide"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "3/4-Star Hotel Golden Triangle"
      },
      {
        "day": 3,
        "title": "Cultural Experience & Shopping",
        "activities": [
          "Explore traditional bazaars and local shopping hubs",
          "Evening leisure or optional cruise"
        ],
        "meals": "Breakfast",
        "overnight": "3/4-Star Hotel Golden Triangle"
      },
      {
        "day": 4,
        "title": "Departure Transfer",
        "activities": [
          "Hotel checkout and transfer to international airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Top-rated 3/4-Star Hotels in Golden Triangle",
    "meals": "Daily Breakfast at hotel, 1 Lunch included",
    "transportation": "AC Private/Shared Transfers & Sightseeing",
    "inclusions": [
      "5 Night 6 Days Hotel Stay",
      "Daily Breakfast",
      "Airport Return Transfers",
      "Guided City Tour"
    ],
    "exclusions": [
      "International Airfare",
      "Visa Fees",
      "Personal Laundry & Tips"
    ],
    "visa_information": "Visa guidance provided for India.",
    "required_documents": [
      "Passport valid for 6+ months",
      "Bank Statement",
      "Photos"
    ],
    "important_notes": [
      "Confirmed bookings subject to availability"
    ],
    "terms_conditions": [
      "Agency cancellation terms apply"
    ],
    "source_pdf": "Package_22_India_Golden_Triangle_Taj.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.563Z",
    "updated_at": "2026-08-13T15:28:37.563Z",
    "images": [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Sightseeing in Golden Triangle",
      "Verified PDF Itinerary",
      "Guided Transfers"
    ],
    "departure_info": "Dhaka to Golden Triangle"
  },
  {
    "id": "pkg_pdf_23",
    "destination_id": "dest_india",
    "destination_name": "Darjeeling & Gangtok",
    "country": "India",
    "package_name": "Darjeeling Tiger Hill Sunrise & Gangtok Tsomgo Lake",
    "duration": "4 Night 5 Days",
    "price": 22500,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 25875
      },
      {
        "pax": 4,
        "price": 22500
      }
    ],
    "description": "Official PDF itinerary for Darjeeling Tiger Hill Sunrise & Gangtok Tsomgo Lake in India. Complete day-by-day sightseeing and hotel accommodations included.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Darjeeling & Gangtok",
        "activities": [
          "Airport welcome greeting and private transfer to hotel",
          "Check-in and evening at leisure"
        ],
        "meals": "Dinner on your own",
        "overnight": "3/4-Star Hotel Darjeeling & Gangtok"
      },
      {
        "day": 2,
        "title": "Full Day Sightseeing Tour of Darjeeling & Gangtok",
        "activities": [
          "Visit top attractions, historic landmarks, and scenic viewpoints",
          "Guided tour with English speaking guide"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "3/4-Star Hotel Darjeeling & Gangtok"
      },
      {
        "day": 3,
        "title": "Cultural Experience & Shopping",
        "activities": [
          "Explore traditional bazaars and local shopping hubs",
          "Evening leisure or optional cruise"
        ],
        "meals": "Breakfast",
        "overnight": "3/4-Star Hotel Darjeeling & Gangtok"
      },
      {
        "day": 4,
        "title": "Departure Transfer",
        "activities": [
          "Hotel checkout and transfer to international airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Top-rated 3/4-Star Hotels in Darjeeling & Gangtok",
    "meals": "Daily Breakfast at hotel, 1 Lunch included",
    "transportation": "AC Private/Shared Transfers & Sightseeing",
    "inclusions": [
      "4 Night 5 Days Hotel Stay",
      "Daily Breakfast",
      "Airport Return Transfers",
      "Guided City Tour"
    ],
    "exclusions": [
      "International Airfare",
      "Visa Fees",
      "Personal Laundry & Tips"
    ],
    "visa_information": "Visa guidance provided for India.",
    "required_documents": [
      "Passport valid for 6+ months",
      "Bank Statement",
      "Photos"
    ],
    "important_notes": [
      "Confirmed bookings subject to availability"
    ],
    "terms_conditions": [
      "Agency cancellation terms apply"
    ],
    "source_pdf": "Package_23_Darjeeling_Gangtok_Sikkim.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.563Z",
    "updated_at": "2026-08-13T15:28:37.563Z",
    "images": [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Sightseeing in Darjeeling & Gangtok",
      "Verified PDF Itinerary",
      "Guided Transfers"
    ],
    "departure_info": "Dhaka to Darjeeling & Gangtok"
  },
  {
    "id": "pkg_pdf_24",
    "destination_id": "dest_united_arab_emirates",
    "destination_name": "Dubai & Abu Dhabi",
    "country": "United Arab Emirates",
    "package_name": "Dubai Desert Safari, Burj Khalifa & Sheikh Zayed Mosque",
    "duration": "4 Night 5 Days",
    "price": 54000,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 62100
      },
      {
        "pax": 4,
        "price": 54000
      }
    ],
    "description": "Official PDF itinerary for Dubai Desert Safari, Burj Khalifa & Sheikh Zayed Mosque in United Arab Emirates. Complete day-by-day sightseeing and hotel accommodations included.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Dubai & Abu Dhabi",
        "activities": [
          "Airport welcome greeting and private transfer to hotel",
          "Check-in and evening at leisure"
        ],
        "meals": "Dinner on your own",
        "overnight": "3/4-Star Hotel Dubai & Abu Dhabi"
      },
      {
        "day": 2,
        "title": "Full Day Sightseeing Tour of Dubai & Abu Dhabi",
        "activities": [
          "Visit top attractions, historic landmarks, and scenic viewpoints",
          "Guided tour with English speaking guide"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "3/4-Star Hotel Dubai & Abu Dhabi"
      },
      {
        "day": 3,
        "title": "Cultural Experience & Shopping",
        "activities": [
          "Explore traditional bazaars and local shopping hubs",
          "Evening leisure or optional cruise"
        ],
        "meals": "Breakfast",
        "overnight": "3/4-Star Hotel Dubai & Abu Dhabi"
      },
      {
        "day": 4,
        "title": "Departure Transfer",
        "activities": [
          "Hotel checkout and transfer to international airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Top-rated 3/4-Star Hotels in Dubai & Abu Dhabi",
    "meals": "Daily Breakfast at hotel, 1 Lunch included",
    "transportation": "AC Private/Shared Transfers & Sightseeing",
    "inclusions": [
      "4 Night 5 Days Hotel Stay",
      "Daily Breakfast",
      "Airport Return Transfers",
      "Guided City Tour"
    ],
    "exclusions": [
      "International Airfare",
      "Visa Fees",
      "Personal Laundry & Tips"
    ],
    "visa_information": "Visa guidance provided for United Arab Emirates.",
    "required_documents": [
      "Passport valid for 6+ months",
      "Bank Statement",
      "Photos"
    ],
    "important_notes": [
      "Confirmed bookings subject to availability"
    ],
    "terms_conditions": [
      "Agency cancellation terms apply"
    ],
    "source_pdf": "Package_24_Dubai_Desert_Safari_Burj.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.563Z",
    "updated_at": "2026-08-13T15:28:37.563Z",
    "images": [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Sightseeing in Dubai & Abu Dhabi",
      "Verified PDF Itinerary",
      "Guided Transfers"
    ],
    "departure_info": "Dhaka to Dubai & Abu Dhabi"
  },
  {
    "id": "pkg_pdf_25",
    "destination_id": "dest_turkey",
    "destination_name": "Istanbul & Cappadocia",
    "country": "Turkey",
    "package_name": "Turkey Istanbul Hagia Sophia & Cappadocia Hot Air Balloon",
    "duration": "6 Night 7 Days",
    "price": 89000,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 102350
      },
      {
        "pax": 4,
        "price": 89000
      }
    ],
    "description": "Official PDF itinerary for Turkey Istanbul Hagia Sophia & Cappadocia Hot Air Balloon in Turkey. Complete day-by-day sightseeing and hotel accommodations included.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Istanbul & Cappadocia",
        "activities": [
          "Airport welcome greeting and private transfer to hotel",
          "Check-in and evening at leisure"
        ],
        "meals": "Dinner on your own",
        "overnight": "3/4-Star Hotel Istanbul & Cappadocia"
      },
      {
        "day": 2,
        "title": "Full Day Sightseeing Tour of Istanbul & Cappadocia",
        "activities": [
          "Visit top attractions, historic landmarks, and scenic viewpoints",
          "Guided tour with English speaking guide"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "3/4-Star Hotel Istanbul & Cappadocia"
      },
      {
        "day": 3,
        "title": "Cultural Experience & Shopping",
        "activities": [
          "Explore traditional bazaars and local shopping hubs",
          "Evening leisure or optional cruise"
        ],
        "meals": "Breakfast",
        "overnight": "3/4-Star Hotel Istanbul & Cappadocia"
      },
      {
        "day": 4,
        "title": "Departure Transfer",
        "activities": [
          "Hotel checkout and transfer to international airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Top-rated 3/4-Star Hotels in Istanbul & Cappadocia",
    "meals": "Daily Breakfast at hotel, 1 Lunch included",
    "transportation": "AC Private/Shared Transfers & Sightseeing",
    "inclusions": [
      "6 Night 7 Days Hotel Stay",
      "Daily Breakfast",
      "Airport Return Transfers",
      "Guided City Tour"
    ],
    "exclusions": [
      "International Airfare",
      "Visa Fees",
      "Personal Laundry & Tips"
    ],
    "visa_information": "Visa guidance provided for Turkey.",
    "required_documents": [
      "Passport valid for 6+ months",
      "Bank Statement",
      "Photos"
    ],
    "important_notes": [
      "Confirmed bookings subject to availability"
    ],
    "terms_conditions": [
      "Agency cancellation terms apply"
    ],
    "source_pdf": "Package_25_Turkey_Istanbul_Cappadocia.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.563Z",
    "updated_at": "2026-08-13T15:28:37.563Z",
    "images": [
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Sightseeing in Istanbul & Cappadocia",
      "Verified PDF Itinerary",
      "Guided Transfers"
    ],
    "departure_info": "Dhaka to Istanbul & Cappadocia"
  },
  {
    "id": "pkg_pdf_26",
    "destination_id": "dest_egypt",
    "destination_name": "Cairo & Nile River",
    "country": "Egypt",
    "package_name": "Egypt Cairo Giza Pyramids & Nile River Dinner Cruise",
    "duration": "5 Night 6 Days",
    "price": 82000,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 94300
      },
      {
        "pax": 4,
        "price": 82000
      }
    ],
    "description": "Official PDF itinerary for Egypt Cairo Giza Pyramids & Nile River Dinner Cruise in Egypt. Complete day-by-day sightseeing and hotel accommodations included.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Cairo & Nile River",
        "activities": [
          "Airport welcome greeting and private transfer to hotel",
          "Check-in and evening at leisure"
        ],
        "meals": "Dinner on your own",
        "overnight": "3/4-Star Hotel Cairo & Nile River"
      },
      {
        "day": 2,
        "title": "Full Day Sightseeing Tour of Cairo & Nile River",
        "activities": [
          "Visit top attractions, historic landmarks, and scenic viewpoints",
          "Guided tour with English speaking guide"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "3/4-Star Hotel Cairo & Nile River"
      },
      {
        "day": 3,
        "title": "Cultural Experience & Shopping",
        "activities": [
          "Explore traditional bazaars and local shopping hubs",
          "Evening leisure or optional cruise"
        ],
        "meals": "Breakfast",
        "overnight": "3/4-Star Hotel Cairo & Nile River"
      },
      {
        "day": 4,
        "title": "Departure Transfer",
        "activities": [
          "Hotel checkout and transfer to international airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Top-rated 3/4-Star Hotels in Cairo & Nile River",
    "meals": "Daily Breakfast at hotel, 1 Lunch included",
    "transportation": "AC Private/Shared Transfers & Sightseeing",
    "inclusions": [
      "5 Night 6 Days Hotel Stay",
      "Daily Breakfast",
      "Airport Return Transfers",
      "Guided City Tour"
    ],
    "exclusions": [
      "International Airfare",
      "Visa Fees",
      "Personal Laundry & Tips"
    ],
    "visa_information": "Visa guidance provided for Egypt.",
    "required_documents": [
      "Passport valid for 6+ months",
      "Bank Statement",
      "Photos"
    ],
    "important_notes": [
      "Confirmed bookings subject to availability"
    ],
    "terms_conditions": [
      "Agency cancellation terms apply"
    ],
    "source_pdf": "Package_26_Egypt_Cairo_Pyramids_Nile.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.563Z",
    "updated_at": "2026-08-13T15:28:37.563Z",
    "images": [
      "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Sightseeing in Cairo & Nile River",
      "Verified PDF Itinerary",
      "Guided Transfers"
    ],
    "departure_info": "Dhaka to Cairo & Nile River"
  },
  {
    "id": "pkg_pdf_27",
    "destination_id": "dest_azerbaijan",
    "destination_name": "Baku & Shahdag",
    "country": "Azerbaijan",
    "package_name": "Baku Flame Towers & Shahdag Alpine Mountain Resort",
    "duration": "4 Night 5 Days",
    "price": 36000,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 41400
      },
      {
        "pax": 4,
        "price": 36000
      }
    ],
    "description": "Official PDF itinerary for Baku Flame Towers & Shahdag Alpine Mountain Resort in Azerbaijan. Complete day-by-day sightseeing and hotel accommodations included.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Baku & Shahdag",
        "activities": [
          "Airport welcome greeting and private transfer to hotel",
          "Check-in and evening at leisure"
        ],
        "meals": "Dinner on your own",
        "overnight": "3/4-Star Hotel Baku & Shahdag"
      },
      {
        "day": 2,
        "title": "Full Day Sightseeing Tour of Baku & Shahdag",
        "activities": [
          "Visit top attractions, historic landmarks, and scenic viewpoints",
          "Guided tour with English speaking guide"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "3/4-Star Hotel Baku & Shahdag"
      },
      {
        "day": 3,
        "title": "Cultural Experience & Shopping",
        "activities": [
          "Explore traditional bazaars and local shopping hubs",
          "Evening leisure or optional cruise"
        ],
        "meals": "Breakfast",
        "overnight": "3/4-Star Hotel Baku & Shahdag"
      },
      {
        "day": 4,
        "title": "Departure Transfer",
        "activities": [
          "Hotel checkout and transfer to international airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Top-rated 3/4-Star Hotels in Baku & Shahdag",
    "meals": "Daily Breakfast at hotel, 1 Lunch included",
    "transportation": "AC Private/Shared Transfers & Sightseeing",
    "inclusions": [
      "4 Night 5 Days Hotel Stay",
      "Daily Breakfast",
      "Airport Return Transfers",
      "Guided City Tour"
    ],
    "exclusions": [
      "International Airfare",
      "Visa Fees",
      "Personal Laundry & Tips"
    ],
    "visa_information": "Visa guidance provided for Azerbaijan.",
    "required_documents": [
      "Passport valid for 6+ months",
      "Bank Statement",
      "Photos"
    ],
    "important_notes": [
      "Confirmed bookings subject to availability"
    ],
    "terms_conditions": [
      "Agency cancellation terms apply"
    ],
    "source_pdf": "Package_27_Baku_Shahdag_Mountain.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.563Z",
    "updated_at": "2026-08-13T15:28:37.563Z",
    "images": [
      "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Sightseeing in Baku & Shahdag",
      "Verified PDF Itinerary",
      "Guided Transfers"
    ],
    "departure_info": "Dhaka to Baku & Shahdag"
  },
  {
    "id": "pkg_pdf_28",
    "destination_id": "dest_georgia",
    "destination_name": "Tbilisi & Kazbegi",
    "country": "Georgia",
    "package_name": "Georgia Tbilisi Old Town & Kazbegi Gergeti Church",
    "duration": "5 Night 6 Days",
    "price": 44000,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 50600
      },
      {
        "pax": 4,
        "price": 44000
      }
    ],
    "description": "Official PDF itinerary for Georgia Tbilisi Old Town & Kazbegi Gergeti Church in Georgia. Complete day-by-day sightseeing and hotel accommodations included.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Tbilisi & Kazbegi",
        "activities": [
          "Airport welcome greeting and private transfer to hotel",
          "Check-in and evening at leisure"
        ],
        "meals": "Dinner on your own",
        "overnight": "3/4-Star Hotel Tbilisi & Kazbegi"
      },
      {
        "day": 2,
        "title": "Full Day Sightseeing Tour of Tbilisi & Kazbegi",
        "activities": [
          "Visit top attractions, historic landmarks, and scenic viewpoints",
          "Guided tour with English speaking guide"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "3/4-Star Hotel Tbilisi & Kazbegi"
      },
      {
        "day": 3,
        "title": "Cultural Experience & Shopping",
        "activities": [
          "Explore traditional bazaars and local shopping hubs",
          "Evening leisure or optional cruise"
        ],
        "meals": "Breakfast",
        "overnight": "3/4-Star Hotel Tbilisi & Kazbegi"
      },
      {
        "day": 4,
        "title": "Departure Transfer",
        "activities": [
          "Hotel checkout and transfer to international airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Top-rated 3/4-Star Hotels in Tbilisi & Kazbegi",
    "meals": "Daily Breakfast at hotel, 1 Lunch included",
    "transportation": "AC Private/Shared Transfers & Sightseeing",
    "inclusions": [
      "5 Night 6 Days Hotel Stay",
      "Daily Breakfast",
      "Airport Return Transfers",
      "Guided City Tour"
    ],
    "exclusions": [
      "International Airfare",
      "Visa Fees",
      "Personal Laundry & Tips"
    ],
    "visa_information": "Visa guidance provided for Georgia.",
    "required_documents": [
      "Passport valid for 6+ months",
      "Bank Statement",
      "Photos"
    ],
    "important_notes": [
      "Confirmed bookings subject to availability"
    ],
    "terms_conditions": [
      "Agency cancellation terms apply"
    ],
    "source_pdf": "Package_28_Georgia_Tbilisi_Kazbegi.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.563Z",
    "updated_at": "2026-08-13T15:28:37.563Z",
    "images": [
      "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Sightseeing in Tbilisi & Kazbegi",
      "Verified PDF Itinerary",
      "Guided Transfers"
    ],
    "departure_info": "Dhaka to Tbilisi & Kazbegi"
  },
  {
    "id": "pkg_pdf_29",
    "destination_id": "dest_uzbekistan",
    "destination_name": "Tashkent & Samarkand",
    "country": "Uzbekistan",
    "package_name": "Uzbekistan Silk Road Registan Square & Samarkand",
    "duration": "5 Night 6 Days",
    "price": 49000,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 56350
      },
      {
        "pax": 4,
        "price": 49000
      }
    ],
    "description": "Official PDF itinerary for Uzbekistan Silk Road Registan Square & Samarkand in Uzbekistan. Complete day-by-day sightseeing and hotel accommodations included.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Tashkent & Samarkand",
        "activities": [
          "Airport welcome greeting and private transfer to hotel",
          "Check-in and evening at leisure"
        ],
        "meals": "Dinner on your own",
        "overnight": "3/4-Star Hotel Tashkent & Samarkand"
      },
      {
        "day": 2,
        "title": "Full Day Sightseeing Tour of Tashkent & Samarkand",
        "activities": [
          "Visit top attractions, historic landmarks, and scenic viewpoints",
          "Guided tour with English speaking guide"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "3/4-Star Hotel Tashkent & Samarkand"
      },
      {
        "day": 3,
        "title": "Cultural Experience & Shopping",
        "activities": [
          "Explore traditional bazaars and local shopping hubs",
          "Evening leisure or optional cruise"
        ],
        "meals": "Breakfast",
        "overnight": "3/4-Star Hotel Tashkent & Samarkand"
      },
      {
        "day": 4,
        "title": "Departure Transfer",
        "activities": [
          "Hotel checkout and transfer to international airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Top-rated 3/4-Star Hotels in Tashkent & Samarkand",
    "meals": "Daily Breakfast at hotel, 1 Lunch included",
    "transportation": "AC Private/Shared Transfers & Sightseeing",
    "inclusions": [
      "5 Night 6 Days Hotel Stay",
      "Daily Breakfast",
      "Airport Return Transfers",
      "Guided City Tour"
    ],
    "exclusions": [
      "International Airfare",
      "Visa Fees",
      "Personal Laundry & Tips"
    ],
    "visa_information": "Visa guidance provided for Uzbekistan.",
    "required_documents": [
      "Passport valid for 6+ months",
      "Bank Statement",
      "Photos"
    ],
    "important_notes": [
      "Confirmed bookings subject to availability"
    ],
    "terms_conditions": [
      "Agency cancellation terms apply"
    ],
    "source_pdf": "Package_29_Uzbekistan_Samarkand_SilkRoad.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.563Z",
    "updated_at": "2026-08-13T15:28:37.563Z",
    "images": [
      "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Sightseeing in Tashkent & Samarkand",
      "Verified PDF Itinerary",
      "Guided Transfers"
    ],
    "departure_info": "Dhaka to Tashkent & Samarkand"
  },
  {
    "id": "pkg_pdf_30",
    "destination_id": "dest_saudi_arabia",
    "destination_name": "Makkah & Madinah",
    "country": "Saudi Arabia",
    "package_name": "Executive Umrah Package (5-Star Clock Tower Makkah & Madinah)",
    "duration": "7 Night 8 Days",
    "price": 95000,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 109250
      },
      {
        "pax": 4,
        "price": 95000
      }
    ],
    "description": "Official PDF itinerary for Executive Umrah Package (5-Star Clock Tower Makkah & Madinah) in Saudi Arabia. Complete day-by-day sightseeing and hotel accommodations included.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Makkah & Madinah",
        "activities": [
          "Airport welcome greeting and private transfer to hotel",
          "Check-in and evening at leisure"
        ],
        "meals": "Dinner on your own",
        "overnight": "3/4-Star Hotel Makkah & Madinah"
      },
      {
        "day": 2,
        "title": "Full Day Sightseeing Tour of Makkah & Madinah",
        "activities": [
          "Visit top attractions, historic landmarks, and scenic viewpoints",
          "Guided tour with English speaking guide"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "3/4-Star Hotel Makkah & Madinah"
      },
      {
        "day": 3,
        "title": "Cultural Experience & Shopping",
        "activities": [
          "Explore traditional bazaars and local shopping hubs",
          "Evening leisure or optional cruise"
        ],
        "meals": "Breakfast",
        "overnight": "3/4-Star Hotel Makkah & Madinah"
      },
      {
        "day": 4,
        "title": "Departure Transfer",
        "activities": [
          "Hotel checkout and transfer to international airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Top-rated 3/4-Star Hotels in Makkah & Madinah",
    "meals": "Daily Breakfast at hotel, 1 Lunch included",
    "transportation": "AC Private/Shared Transfers & Sightseeing",
    "inclusions": [
      "7 Night 8 Days Hotel Stay",
      "Daily Breakfast",
      "Airport Return Transfers",
      "Guided City Tour"
    ],
    "exclusions": [
      "International Airfare",
      "Visa Fees",
      "Personal Laundry & Tips"
    ],
    "visa_information": "Visa guidance provided for Saudi Arabia.",
    "required_documents": [
      "Passport valid for 6+ months",
      "Bank Statement",
      "Photos"
    ],
    "important_notes": [
      "Confirmed bookings subject to availability"
    ],
    "terms_conditions": [
      "Agency cancellation terms apply"
    ],
    "source_pdf": "Package_30_Executive_Umrah_Makkah_Madinah.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.563Z",
    "updated_at": "2026-08-13T15:28:37.563Z",
    "images": [
      "https://images.unsplash.com/photo-1565552070098-fd83a8dc0f42?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Sightseeing in Makkah & Madinah",
      "Verified PDF Itinerary",
      "Guided Transfers"
    ],
    "departure_info": "Dhaka to Makkah & Madinah"
  },
  {
    "id": "pkg_pdf_31",
    "destination_id": "dest_japan",
    "destination_name": "Tokyo & Kyoto",
    "country": "Japan",
    "package_name": "Japan Tokyo Skytree, Mt Fuji & Kyoto Bullet Train Express",
    "duration": "6 Night 7 Days",
    "price": 145000,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 166750
      },
      {
        "pax": 4,
        "price": 145000
      }
    ],
    "description": "Official PDF itinerary for Japan Tokyo Skytree, Mt Fuji & Kyoto Bullet Train Express in Japan. Complete day-by-day sightseeing and hotel accommodations included.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Tokyo & Kyoto",
        "activities": [
          "Airport welcome greeting and private transfer to hotel",
          "Check-in and evening at leisure"
        ],
        "meals": "Dinner on your own",
        "overnight": "3/4-Star Hotel Tokyo & Kyoto"
      },
      {
        "day": 2,
        "title": "Full Day Sightseeing Tour of Tokyo & Kyoto",
        "activities": [
          "Visit top attractions, historic landmarks, and scenic viewpoints",
          "Guided tour with English speaking guide"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "3/4-Star Hotel Tokyo & Kyoto"
      },
      {
        "day": 3,
        "title": "Cultural Experience & Shopping",
        "activities": [
          "Explore traditional bazaars and local shopping hubs",
          "Evening leisure or optional cruise"
        ],
        "meals": "Breakfast",
        "overnight": "3/4-Star Hotel Tokyo & Kyoto"
      },
      {
        "day": 4,
        "title": "Departure Transfer",
        "activities": [
          "Hotel checkout and transfer to international airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Top-rated 3/4-Star Hotels in Tokyo & Kyoto",
    "meals": "Daily Breakfast at hotel, 1 Lunch included",
    "transportation": "AC Private/Shared Transfers & Sightseeing",
    "inclusions": [
      "6 Night 7 Days Hotel Stay",
      "Daily Breakfast",
      "Airport Return Transfers",
      "Guided City Tour"
    ],
    "exclusions": [
      "International Airfare",
      "Visa Fees",
      "Personal Laundry & Tips"
    ],
    "visa_information": "Visa guidance provided for Japan.",
    "required_documents": [
      "Passport valid for 6+ months",
      "Bank Statement",
      "Photos"
    ],
    "important_notes": [
      "Confirmed bookings subject to availability"
    ],
    "terms_conditions": [
      "Agency cancellation terms apply"
    ],
    "source_pdf": "Package_31_Japan_Tokyo_MtFuji_Kyoto.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.563Z",
    "updated_at": "2026-08-13T15:28:37.563Z",
    "images": [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Sightseeing in Tokyo & Kyoto",
      "Verified PDF Itinerary",
      "Guided Transfers"
    ],
    "departure_info": "Dhaka to Tokyo & Kyoto"
  },
  {
    "id": "pkg_pdf_32",
    "destination_id": "dest_switzerland",
    "destination_name": "Lucerne & Zurich",
    "country": "Switzerland",
    "package_name": "Swiss Alps Titlis Cable Car & Lucerne Lake Cruise",
    "duration": "5 Night 6 Days",
    "price": 165000,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 189750
      },
      {
        "pax": 4,
        "price": 165000
      }
    ],
    "description": "Official PDF itinerary for Swiss Alps Titlis Cable Car & Lucerne Lake Cruise in Switzerland. Complete day-by-day sightseeing and hotel accommodations included.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Lucerne & Zurich",
        "activities": [
          "Airport welcome greeting and private transfer to hotel",
          "Check-in and evening at leisure"
        ],
        "meals": "Dinner on your own",
        "overnight": "3/4-Star Hotel Lucerne & Zurich"
      },
      {
        "day": 2,
        "title": "Full Day Sightseeing Tour of Lucerne & Zurich",
        "activities": [
          "Visit top attractions, historic landmarks, and scenic viewpoints",
          "Guided tour with English speaking guide"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "3/4-Star Hotel Lucerne & Zurich"
      },
      {
        "day": 3,
        "title": "Cultural Experience & Shopping",
        "activities": [
          "Explore traditional bazaars and local shopping hubs",
          "Evening leisure or optional cruise"
        ],
        "meals": "Breakfast",
        "overnight": "3/4-Star Hotel Lucerne & Zurich"
      },
      {
        "day": 4,
        "title": "Departure Transfer",
        "activities": [
          "Hotel checkout and transfer to international airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Top-rated 3/4-Star Hotels in Lucerne & Zurich",
    "meals": "Daily Breakfast at hotel, 1 Lunch included",
    "transportation": "AC Private/Shared Transfers & Sightseeing",
    "inclusions": [
      "5 Night 6 Days Hotel Stay",
      "Daily Breakfast",
      "Airport Return Transfers",
      "Guided City Tour"
    ],
    "exclusions": [
      "International Airfare",
      "Visa Fees",
      "Personal Laundry & Tips"
    ],
    "visa_information": "Visa guidance provided for Switzerland.",
    "required_documents": [
      "Passport valid for 6+ months",
      "Bank Statement",
      "Photos"
    ],
    "important_notes": [
      "Confirmed bookings subject to availability"
    ],
    "terms_conditions": [
      "Agency cancellation terms apply"
    ],
    "source_pdf": "Package_32_Switzerland_Lucerne_Titlis.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.563Z",
    "updated_at": "2026-08-13T15:28:37.563Z",
    "images": [
      "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Sightseeing in Lucerne & Zurich",
      "Verified PDF Itinerary",
      "Guided Transfers"
    ],
    "departure_info": "Dhaka to Lucerne & Zurich"
  },
  {
    "id": "pkg_pdf_33",
    "destination_id": "dest_france",
    "destination_name": "Paris & Seine River",
    "country": "France",
    "package_name": "Paris Eiffel Tower Summit & Louvre Museum Art Tour",
    "duration": "4 Night 5 Days",
    "price": 135000,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 155250
      },
      {
        "pax": 4,
        "price": 135000
      }
    ],
    "description": "Official PDF itinerary for Paris Eiffel Tower Summit & Louvre Museum Art Tour in France. Complete day-by-day sightseeing and hotel accommodations included.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Paris & Seine River",
        "activities": [
          "Airport welcome greeting and private transfer to hotel",
          "Check-in and evening at leisure"
        ],
        "meals": "Dinner on your own",
        "overnight": "3/4-Star Hotel Paris & Seine River"
      },
      {
        "day": 2,
        "title": "Full Day Sightseeing Tour of Paris & Seine River",
        "activities": [
          "Visit top attractions, historic landmarks, and scenic viewpoints",
          "Guided tour with English speaking guide"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "3/4-Star Hotel Paris & Seine River"
      },
      {
        "day": 3,
        "title": "Cultural Experience & Shopping",
        "activities": [
          "Explore traditional bazaars and local shopping hubs",
          "Evening leisure or optional cruise"
        ],
        "meals": "Breakfast",
        "overnight": "3/4-Star Hotel Paris & Seine River"
      },
      {
        "day": 4,
        "title": "Departure Transfer",
        "activities": [
          "Hotel checkout and transfer to international airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Top-rated 3/4-Star Hotels in Paris & Seine River",
    "meals": "Daily Breakfast at hotel, 1 Lunch included",
    "transportation": "AC Private/Shared Transfers & Sightseeing",
    "inclusions": [
      "4 Night 5 Days Hotel Stay",
      "Daily Breakfast",
      "Airport Return Transfers",
      "Guided City Tour"
    ],
    "exclusions": [
      "International Airfare",
      "Visa Fees",
      "Personal Laundry & Tips"
    ],
    "visa_information": "Visa guidance provided for France.",
    "required_documents": [
      "Passport valid for 6+ months",
      "Bank Statement",
      "Photos"
    ],
    "important_notes": [
      "Confirmed bookings subject to availability"
    ],
    "terms_conditions": [
      "Agency cancellation terms apply"
    ],
    "source_pdf": "Package_33_Paris_Eiffel_Seine_Cruise.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.563Z",
    "updated_at": "2026-08-13T15:28:37.563Z",
    "images": [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Sightseeing in Paris & Seine River",
      "Verified PDF Itinerary",
      "Guided Transfers"
    ],
    "departure_info": "Dhaka to Paris & Seine River"
  },
  {
    "id": "pkg_pdf_34",
    "destination_id": "dest_combo__europe_",
    "destination_name": "Paris, Swiss & Rome",
    "country": "Combo (Europe)",
    "package_name": "Grand Europe Highlights (Paris Eiffel, Swiss Alps & Rome Colosseum)",
    "duration": "9 Night 10 Days",
    "price": 245000,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 281750
      },
      {
        "pax": 4,
        "price": 245000
      }
    ],
    "description": "Official PDF itinerary for Grand Europe Highlights (Paris Eiffel, Swiss Alps & Rome Colosseum) in Combo (Europe). Complete day-by-day sightseeing and hotel accommodations included.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Paris, Swiss & Rome",
        "activities": [
          "Airport welcome greeting and private transfer to hotel",
          "Check-in and evening at leisure"
        ],
        "meals": "Dinner on your own",
        "overnight": "3/4-Star Hotel Paris, Swiss & Rome"
      },
      {
        "day": 2,
        "title": "Full Day Sightseeing Tour of Paris, Swiss & Rome",
        "activities": [
          "Visit top attractions, historic landmarks, and scenic viewpoints",
          "Guided tour with English speaking guide"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "3/4-Star Hotel Paris, Swiss & Rome"
      },
      {
        "day": 3,
        "title": "Cultural Experience & Shopping",
        "activities": [
          "Explore traditional bazaars and local shopping hubs",
          "Evening leisure or optional cruise"
        ],
        "meals": "Breakfast",
        "overnight": "3/4-Star Hotel Paris, Swiss & Rome"
      },
      {
        "day": 4,
        "title": "Departure Transfer",
        "activities": [
          "Hotel checkout and transfer to international airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Top-rated 3/4-Star Hotels in Paris, Swiss & Rome",
    "meals": "Daily Breakfast at hotel, 1 Lunch included",
    "transportation": "AC Private/Shared Transfers & Sightseeing",
    "inclusions": [
      "9 Night 10 Days Hotel Stay",
      "Daily Breakfast",
      "Airport Return Transfers",
      "Guided City Tour"
    ],
    "exclusions": [
      "International Airfare",
      "Visa Fees",
      "Personal Laundry & Tips"
    ],
    "visa_information": "Visa guidance provided for Combo (Europe).",
    "required_documents": [
      "Passport valid for 6+ months",
      "Bank Statement",
      "Photos"
    ],
    "important_notes": [
      "Confirmed bookings subject to availability"
    ],
    "terms_conditions": [
      "Agency cancellation terms apply"
    ],
    "source_pdf": "Package_34_Grand_Europe_Paris_Swiss_Rome.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.563Z",
    "updated_at": "2026-08-13T15:28:37.563Z",
    "images": [
      "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Sightseeing in Paris, Swiss & Rome",
      "Verified PDF Itinerary",
      "Guided Transfers"
    ],
    "departure_info": "Dhaka to Paris, Swiss & Rome"
  },
  {
    "id": "pkg_pdf_35",
    "destination_id": "dest_hospital_appointment",
    "destination_name": "Bumrungrad Hospital",
    "country": "Hospital Appointment",
    "package_name": "Bangkok Bumrungrad Medical Checkup & Executive Lounge",
    "duration": "2 Night 3 Days",
    "price": 12000,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 13800
      },
      {
        "pax": 4,
        "price": 12000
      }
    ],
    "description": "Official PDF itinerary for Bangkok Bumrungrad Medical Checkup & Executive Lounge in Hospital Appointment. Complete day-by-day sightseeing and hotel accommodations included.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Bumrungrad Hospital",
        "activities": [
          "Airport welcome greeting and private transfer to hotel",
          "Check-in and evening at leisure"
        ],
        "meals": "Dinner on your own",
        "overnight": "3/4-Star Hotel Bumrungrad Hospital"
      },
      {
        "day": 2,
        "title": "Full Day Sightseeing Tour of Bumrungrad Hospital",
        "activities": [
          "Visit top attractions, historic landmarks, and scenic viewpoints",
          "Guided tour with English speaking guide"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "3/4-Star Hotel Bumrungrad Hospital"
      },
      {
        "day": 3,
        "title": "Cultural Experience & Shopping",
        "activities": [
          "Explore traditional bazaars and local shopping hubs",
          "Evening leisure or optional cruise"
        ],
        "meals": "Breakfast",
        "overnight": "3/4-Star Hotel Bumrungrad Hospital"
      },
      {
        "day": 4,
        "title": "Departure Transfer",
        "activities": [
          "Hotel checkout and transfer to international airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Top-rated 3/4-Star Hotels in Bumrungrad Hospital",
    "meals": "Daily Breakfast at hotel, 1 Lunch included",
    "transportation": "AC Private/Shared Transfers & Sightseeing",
    "inclusions": [
      "2 Night 3 Days Hotel Stay",
      "Daily Breakfast",
      "Airport Return Transfers",
      "Guided City Tour"
    ],
    "exclusions": [
      "International Airfare",
      "Visa Fees",
      "Personal Laundry & Tips"
    ],
    "visa_information": "Visa guidance provided for Hospital Appointment.",
    "required_documents": [
      "Passport valid for 6+ months",
      "Bank Statement",
      "Photos"
    ],
    "important_notes": [
      "Confirmed bookings subject to availability"
    ],
    "terms_conditions": [
      "Agency cancellation terms apply"
    ],
    "source_pdf": "Package_35_Medical_Bangkok_Bumrungrad.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.563Z",
    "updated_at": "2026-08-13T15:28:37.563Z",
    "images": [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Sightseeing in Bumrungrad Hospital",
      "Verified PDF Itinerary",
      "Guided Transfers"
    ],
    "departure_info": "Dhaka to Bumrungrad Hospital"
  },
  {
    "id": "pkg_pdf_36",
    "destination_id": "dest_hospital_appointment",
    "destination_name": "Apollo Hospital Kolkata",
    "country": "Hospital Appointment",
    "package_name": "Kolkata Apollo Super Specialty Consultation & Diagnostics",
    "duration": "2 Night 3 Days",
    "price": 8500,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 9775
      },
      {
        "pax": 4,
        "price": 8500
      }
    ],
    "description": "Official PDF itinerary for Kolkata Apollo Super Specialty Consultation & Diagnostics in Hospital Appointment. Complete day-by-day sightseeing and hotel accommodations included.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Apollo Hospital Kolkata",
        "activities": [
          "Airport welcome greeting and private transfer to hotel",
          "Check-in and evening at leisure"
        ],
        "meals": "Dinner on your own",
        "overnight": "3/4-Star Hotel Apollo Hospital Kolkata"
      },
      {
        "day": 2,
        "title": "Full Day Sightseeing Tour of Apollo Hospital Kolkata",
        "activities": [
          "Visit top attractions, historic landmarks, and scenic viewpoints",
          "Guided tour with English speaking guide"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "3/4-Star Hotel Apollo Hospital Kolkata"
      },
      {
        "day": 3,
        "title": "Cultural Experience & Shopping",
        "activities": [
          "Explore traditional bazaars and local shopping hubs",
          "Evening leisure or optional cruise"
        ],
        "meals": "Breakfast",
        "overnight": "3/4-Star Hotel Apollo Hospital Kolkata"
      },
      {
        "day": 4,
        "title": "Departure Transfer",
        "activities": [
          "Hotel checkout and transfer to international airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Top-rated 3/4-Star Hotels in Apollo Hospital Kolkata",
    "meals": "Daily Breakfast at hotel, 1 Lunch included",
    "transportation": "AC Private/Shared Transfers & Sightseeing",
    "inclusions": [
      "2 Night 3 Days Hotel Stay",
      "Daily Breakfast",
      "Airport Return Transfers",
      "Guided City Tour"
    ],
    "exclusions": [
      "International Airfare",
      "Visa Fees",
      "Personal Laundry & Tips"
    ],
    "visa_information": "Visa guidance provided for Hospital Appointment.",
    "required_documents": [
      "Passport valid for 6+ months",
      "Bank Statement",
      "Photos"
    ],
    "important_notes": [
      "Confirmed bookings subject to availability"
    ],
    "terms_conditions": [
      "Agency cancellation terms apply"
    ],
    "source_pdf": "Package_36_Medical_Kolkata_Apollo.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.563Z",
    "updated_at": "2026-08-13T15:28:37.563Z",
    "images": [
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Sightseeing in Apollo Hospital Kolkata",
      "Verified PDF Itinerary",
      "Guided Transfers"
    ],
    "departure_info": "Dhaka to Apollo Hospital Kolkata"
  },
  {
    "id": "pkg_pdf_37",
    "destination_id": "dest_china",
    "destination_name": "Shanghai Financial Hub",
    "country": "China",
    "package_name": "Shanghai Oriental Pearl Tower & Bund Waterfront Tour",
    "duration": "3 Night 4 Days",
    "price": 38500,
    "currency": "BDT",
    "pricing_tiers": [
      {
        "pax": 2,
        "price": 44275
      },
      {
        "pax": 4,
        "price": 38500
      }
    ],
    "description": "Official PDF itinerary for Shanghai Oriental Pearl Tower & Bund Waterfront Tour in China. Complete day-by-day sightseeing and hotel accommodations included.",
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Shanghai Financial Hub",
        "activities": [
          "Airport welcome greeting and private transfer to hotel",
          "Check-in and evening at leisure"
        ],
        "meals": "Dinner on your own",
        "overnight": "3/4-Star Hotel Shanghai Financial Hub"
      },
      {
        "day": 2,
        "title": "Full Day Sightseeing Tour of Shanghai Financial Hub",
        "activities": [
          "Visit top attractions, historic landmarks, and scenic viewpoints",
          "Guided tour with English speaking guide"
        ],
        "meals": "Breakfast & Lunch",
        "overnight": "3/4-Star Hotel Shanghai Financial Hub"
      },
      {
        "day": 3,
        "title": "Cultural Experience & Shopping",
        "activities": [
          "Explore traditional bazaars and local shopping hubs",
          "Evening leisure or optional cruise"
        ],
        "meals": "Breakfast",
        "overnight": "3/4-Star Hotel Shanghai Financial Hub"
      },
      {
        "day": 4,
        "title": "Departure Transfer",
        "activities": [
          "Hotel checkout and transfer to international airport"
        ],
        "meals": "Breakfast",
        "overnight": "Departure"
      }
    ],
    "hotel": "Top-rated 3/4-Star Hotels in Shanghai Financial Hub",
    "meals": "Daily Breakfast at hotel, 1 Lunch included",
    "transportation": "AC Private/Shared Transfers & Sightseeing",
    "inclusions": [
      "3 Night 4 Days Hotel Stay",
      "Daily Breakfast",
      "Airport Return Transfers",
      "Guided City Tour"
    ],
    "exclusions": [
      "International Airfare",
      "Visa Fees",
      "Personal Laundry & Tips"
    ],
    "visa_information": "Visa guidance provided for China.",
    "required_documents": [
      "Passport valid for 6+ months",
      "Bank Statement",
      "Photos"
    ],
    "important_notes": [
      "Confirmed bookings subject to availability"
    ],
    "terms_conditions": [
      "Agency cancellation terms apply"
    ],
    "source_pdf": "Package_37_China_Shanghai_Bund.pdf",
    "status": "published",
    "created_at": "2026-08-13T15:28:37.563Z",
    "updated_at": "2026-08-13T15:28:37.563Z",
    "images": [
      "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80"
    ],
    "highlights": [
      "Sightseeing in Shanghai Financial Hub",
      "Verified PDF Itinerary",
      "Guided Transfers"
    ],
    "departure_info": "Dhaka to Shanghai Financial Hub"
  }
];

export const INITIAL_DESTINATIONS: DestinationRecord[] = [];
