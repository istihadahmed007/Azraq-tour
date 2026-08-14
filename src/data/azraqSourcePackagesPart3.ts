import { TourPackage } from '../types';

export const AZRAQ_SOURCE_PACKAGES_PART3: TourPackage[] = [
  // 9. Singapore (Page 20-21)
  {
    id: "pkg_azraq_09",
    destination_id: "dest_singapore",
    destination_name: "Singapore",
    country: "Singapore",
    package_name: "Singapore - Basic 1",
    duration: "2 Night 3 Days",
    price: 15950,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 19800 },
      { pax: 4, price: 17600 },
      { pax: 6, price: 15950 }
    ],
    description: "2-Night, 3-Day Singapore exploration with Private Airport Transfers and Half-Day City Tour.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Singapore – Check-in & Leisure",
        activities: [
          "Arrival at Changi International Airport",
          "Meet & greet by local representative",
          "Private transfer to Ariana Hotel",
          "Check-in and relax",
          "Evening free for leisure or optional exploration (Jewel Changi, Bugis, etc.)"
        ],
        meals: "On own",
        overnight: "Ariana Hotel"
      },
      {
        day: 2,
        title: "Half-Day Singapore City Tour",
        activities: [
          "Breakfast at hotel (if included)",
          "Join Half-Day Guided City Tour (on group basis), covering: Merlion Park – Capture photos with the iconic Merlion statue, Chinatown – Explore local temples and souvenir markets, Little India – Discover Singapore's vibrant Indian quarter",
          "Tour Duration: Approx. 3.5–4 hours (morning)",
          "Afternoon and evening at leisure (optional tours available upon request)"
        ],
        meals: "Breakfast (if included)",
        overnight: "Ariana Hotel"
      },
      {
        day: 3,
        title: "Departure",
        activities: [
          "Breakfast at hotel (if included)",
          "Check-out from hotel",
          "Private transfer to Changi International Airport",
          "Departure – Fly back home with sweet memories of Singapore"
        ],
        meals: "Breakfast (if included)",
        overnight: "Departure"
      }
    ],
    hotel: "Ariana Hotel or similar (Twin/Triple sharing)",
    meals: "Breakfast as per hotel policy",
    transportation: "Private Airport Transfers (Arrival & Departure)",
    inclusions: [
      "2 Nights accommodation at Hotel (Twin/Triple sharing)",
      "Daily hotel taxes & service charges",
      "Private Airport Transfers (Arrival & Departure)",
      "Half-Day Singapore City Tour (Group basis)"
    ],
    exclusions: [
      "Airfare (International flights)",
      "Singapore Visa Fee",
      "All meals (unless specified)",
      "Entry tickets for optional attractions or additional tours",
      "Personal expenses (shopping, tips, etc.)"
    ],
    visa_information: "Singapore eVisa required.",
    required_documents: ["Passport copy", "Photo", "Bank statement"],
    important_notes: ["Ariana Hotel or similar"],
    terms_conditions: ["Prices per person based on pax tier."],
    source_pdf: "SOURCE PDF PAGE 20-21",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80"],
    highlights: ["Merlion Park, Chinatown & Little India Guided Tour", "Private Changi Airport Transfers", "Ariana Hotel Singapore Stay"]
  },

  // 10. Combo (Maldives, Srilanka) (Page 22-24)
  {
    id: "pkg_azraq_10",
    destination_id: "dest_combo_maldives_sl",
    destination_name: "Hulhumale & Colombo",
    country: "Combo (Maldives, Srilanka)",
    package_name: "Maldives, Srilanka (6N)",
    duration: "6 Night 7 Days",
    price: 23650,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 29150 },
      { pax: 4, price: 28050 },
      { pax: 5, price: 26730 },
      { pax: 10, price: 23650 }
    ],
    description: "3 Nights Hulhumale (Maldives) + 3 Nights Colombo (Sri Lanka) with breakfast, transfers, and Colombo city tour.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Maldives – Hulhumale",
        activities: [
          "Arrival at Male International Airport",
          "Meet & Greet by our local representative.",
          "Transfer to your hotel in Hulhumale.",
          "Check-in & relax after your journey.",
          "Leisure time to explore nearby beaches or enjoy local cafes.",
          "Overnight stay in Hulhumale."
        ],
        meals: "On own",
        overnight: "Hulhumale Hotel"
      },
      {
        day: 2,
        title: "Free Day in Maldives",
        activities: [
          "Enjoy a delicious breakfast at the hotel.",
          "Day at leisure – optional activities (at own cost): Island hopping, Water sports (snorkeling, jet-skiing, diving), Visit to Male city.",
          "Overnight stay in Hulhumale."
        ],
        meals: "Breakfast",
        overnight: "Hulhumale Hotel"
      },
      {
        day: 3,
        title: "Leisure & Local Exploration",
        activities: [
          "Morning breakfast at the hotel.",
          "Continue enjoying the Maldives at your own pace.",
          "Optional: Book a sunset cruise or a spa session.",
          "Overnight stay in Hulhumale."
        ],
        meals: "Breakfast",
        overnight: "Hulhumale Hotel"
      },
      {
        day: 4,
        title: "Maldives to Sri Lanka – Transfer to Colombo",
        activities: [
          "Breakfast at the hotel & check-out.",
          "Transfer to Male International Airport for your flight to Colombo, Sri Lanka.",
          "Arrive in Colombo – Meet & Greet at the airport.",
          "Transfer to your hotel in Colombo.",
          "Check-in & unwind.",
          "Evening free to explore Colombo nightlife or markets.",
          "Overnight stay in Colombo."
        ],
        meals: "Breakfast",
        overnight: "Colombo Hotel"
      },
      {
        day: 5,
        title: "Colombo City Tour or Leisure Day",
        activities: [
          "Breakfast at the hotel.",
          "Half-day Colombo city tour including: Galle Face Green, Gangaramaya Temple, Independence Square, Pettah Bazaar.",
          "Evening at leisure.",
          "Overnight stay in Colombo."
        ],
        meals: "Breakfast",
        overnight: "Colombo Hotel"
      },
      {
        day: 6,
        title: "Colombo Free day",
        activities: ["Enjoy your breakfast.", "Enjoy your leisure time.", "Overnight in Colombo."],
        meals: "Breakfast",
        overnight: "Colombo Hotel"
      },
      {
        day: 7,
        title: "Departure from Colombo",
        activities: [
          "Enjoy your final breakfast.",
          "Check-out from the hotel.",
          "Transfer to Colombo International Airport for your onward flight."
        ],
        meals: "Breakfast",
        overnight: "Departure"
      }
    ],
    hotel: "Hulhumale: Beach Arena, Awesome Suite, Miracle View | Colombo: Grand Oriental Hotel, Berjaya Colombo",
    meals: "Daily breakfast at all hotels",
    transportation: "Return airport transfers in Maldives & Sri Lanka with Meet & Greet",
    inclusions: [
      "03 Nights hotel in Hulhumale (Maldives)",
      "03 Nights hotel in Colombo (Sri Lanka)",
      "Daily breakfast at all hotels",
      "Return airport transfers in Maldives & Sri Lanka",
      "Meet & Greet services at both airports",
      "All applicable taxes"
    ],
    exclusions: [
      "Air Ticket",
      "Srilanka Visa",
      "Lunch & Dinner",
      "Personal Expenses"
    ],
    visa_information: "Maldives free on arrival, Sri Lanka ETA required.",
    required_documents: ["Passport copy", "Photographs"],
    important_notes: ["Hulhumale Hotels: Beach Arena, Awesome Suite, Miracal View | Colombo Hotel: Grand Oriental Hotel, Berjaya -Colombo"],
    terms_conditions: ["Pricing tiers per pax."],
    source_pdf: "SOURCE PDF PAGE 22-24",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80"],
    highlights: ["3 Nights Hulhumale Beach & Island Exploration", "3 Nights Colombo Heritage & City Tour", "Galle Face Green & Gangaramaya Temple", "All Airport Return Transfers Included"]
  },

  // 11. Combo (Maldives, Srilanka) (Page 25-26)
  {
    id: "pkg_azraq_11",
    destination_id: "dest_combo_maldives_sl",
    destination_name: "Malé & Colombo",
    country: "Combo (Maldives, Srilanka)",
    package_name: "Maldives, Srilanka (2N Male, 2N Colobo)",
    duration: "4 Night 5 Days",
    price: 24695,
    currency: "BDT",
    pricing_tiers: [
      { pax: 2, price: 24695 }
    ],
    description: "4-Night, 5-Day combo with 2 Nights Hulhumale (Maldives) & 2 Nights Colombo (Sri Lanka).",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Maldives – Transfer to Hulhumale",
        activities: [
          "Arrive at Velana International Airport (Malé)",
          "Meet & Greet by our local representative",
          "Transfer to your hotel in Hulhumale",
          "Check-in and relax after your journey",
          "Explore the serene beaches of Hulhumale in the evening (optional)",
          "Overnight stay in Hulhumale"
        ],
        meals: "On own",
        overnight: "Hulhumale Hotel"
      },
      {
        day: 2,
        title: "Leisure Day in Hulhumale (Maldives)",
        activities: [
          "Enjoy a delicious breakfast at the hotel",
          "Free day to relax or explore nearby islands or take optional water sports like snorkeling, jet-skiing, or a day cruise (at additional cost)",
          "Experience the tropical vibe and crystal-clear waters",
          "Overnight stay in Hulhumale"
        ],
        meals: "Breakfast",
        overnight: "Hulhumale Hotel"
      },
      {
        day: 3,
        title: "Maldives to Sri Lanka – Transfer to Colombo",
        activities: [
          "Enjoy breakfast at the hotel",
          "Check out from your Hulhumale hotel",
          "Return transfer to the airport for your flight to Colombo, Sri Lanka",
          "Arrive at Bandaranaike International Airport",
          "Meet & Greet at the airport",
          "Transfer to your Colombo hotel",
          "Check-in and relax; optional evening city tour or shopping",
          "Overnight stay in Colombo"
        ],
        meals: "Breakfast",
        overnight: "Colombo Hotel"
      },
      {
        day: 4,
        title: "Explore Colombo",
        activities: [
          "Enjoy your final breakfast at the hotel",
          "Depending on your flight time, explore some local attractions in Colombo such as: Galle Face Green, Independence Square, Gangaramaya Temple, Colombo National Museum",
          "Overnight stay in Colombo"
        ],
        meals: "Breakfast",
        overnight: "Colombo Hotel"
      },
      {
        day: 5,
        title: "Departure",
        activities: [
          "Enjoy your final breakfast at the hotel",
          "Return transfer to the airport for your departure"
        ],
        meals: "Breakfast",
        overnight: "Departure"
      }
    ],
    hotel: "Hulhumale: Beach Arena, Awesome Suite, Miracle View | Colombo: Grand Oriental Hotel, Berjaya Colombo",
    meals: "Daily breakfast at all hotels",
    transportation: "Return airport transfers in Maldives & Sri Lanka",
    inclusions: [
      "02 Nights hotel in Hulhumale (Maldives)",
      "02 Nights hotel in Colombo (Sri Lanka)",
      "Daily breakfast at all hotels",
      "Return airport transfers in Maldives & Sri Lanka",
      "Meet & Greet services at both airports",
      "All applicable taxes"
    ],
    exclusions: [
      "Air Ticket",
      "Srilanka Visa",
      "Lunch & Dinner",
      "Personal Expenses"
    ],
    visa_information: "Maldives on arrival, Sri Lanka ETA.",
    required_documents: ["Passport copy", "Photos"],
    important_notes: ["Hulhumale Hotels: Beach Arena, Awesome Suite, Miracal View | Colombo Hotel: Grand Oriental Hotel, Berjaya -Colombo"],
    terms_conditions: ["Price per person for 2 pax."],
    source_pdf: "SOURCE PDF PAGE 25-26",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80"],
    highlights: ["2 Nights Hulhumale Maldives", "2 Nights Colombo Sri Lanka", "Galle Face Green & Independence Square", "Return Airport Transfers"]
  },

  // 12. Hospital Appointment Thailand (Page 27-28)
  {
    id: "pkg_azraq_12",
    destination_id: "dest_thailand",
    destination_name: "Bangkok & Pattaya Hospitals",
    country: "Hospital Appointment",
    package_name: "Hospital Appointment - Thailand",
    duration: "1 Night 2 Days",
    price: 2500,
    currency: "BDT",
    pricing_tiers: [
      { pax: 1, price: 2500 }
    ],
    description: "Official doctor and hospital appointment booking across top 10 premier medical institutions in Thailand.",
    itinerary: [
      {
        day: 1,
        title: "Medical Document Review & Appointment Booking",
        activities: [
          "Document verification and doctor schedule alignment",
          "Appointment confirmation at selected hospital: Bangkok Hospital Pattaya, Jetanin IVF Hospital, MedPark Hospital, Paolo Hospital, Phyathai 1 & 2, Samitivej Hospital, Yanhee Hospital, Sukhumvit Hospital, Praram 9 Hospital",
          "Issuance of official doctor appointment confirmation slip"
        ],
        meals: "Not included",
        overnight: "Hospital consultation arrangement"
      },
      {
        day: 2,
        title: "Hospital Visit Assistance",
        activities: [
          "Present appointment letter at international patient desk",
          "Specialist consultation and diagnostic coordination"
        ],
        meals: "Not included",
        overnight: "Service completed"
      }
    ],
    hotel: "Not included (Medical Appointment Service)",
    meals: "Not included",
    transportation: "Self arrangement",
    inclusions: [
      "Official Hospital Specialist Appointment Booking in Thailand",
      "Document processing and consultation confirmation slip",
      "Support for 10 top accredited hospitals (Bangkok Hospital, Samitivej, MedPark, Jetanin IVF, Yanhee, etc.)"
    ],
    exclusions: [
      "Hospital medical treatment/consultation fees",
      "Hotel, flights and local transport",
      "Visa fees and medicine costs"
    ],
    visa_information: "Medical tourist visa or tourist visa.",
    required_documents: [
      "Original Passport Copy",
      "Patient's all medical document scan copy",
      "Photo",
      "Bangladeshi doctor's recommendation letter"
    ],
    important_notes: [
      "Hospitals covered: Bangkok Hospital Pattaya, Jetanin IVF Hospital Bangkok, MedPark Hospital Bangkok, Paolo Hospital Bangkok, Payathai 1 Hospitals Bangkok, Payathai 2 Hospitals Bangkok, Samitivej Hospital Bangkok, Yanhee Hospital Bangkok, Sukhumvit Hospital Bangkok, Praram 9 Hospital Bangkok"
    ],
    terms_conditions: ["Processing time: 2-7 days."],
    source_pdf: "SOURCE PDF PAGE 27-28",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80"],
    highlights: ["Bangkok Hospital & MedPark specialist booking", "Jetanin IVF & Samitivej Hospital coordination", "Official confirmation within 2-7 days"]
  },

  // 13. Hospital Appointment India (Page 29-33)
  {
    id: "pkg_azraq_13",
    destination_id: "dest_india",
    destination_name: "India Super Specialty Hospitals",
    country: "Hospital Appointment",
    package_name: "Hospital Appointment - India",
    duration: "1 Night 2 Days",
    price: 2500,
    currency: "BDT",
    pricing_tiers: [
      { pax: 1, price: 2500 }
    ],
    description: "Doctor and hospital appointment facilitation across 44 top super-specialty hospitals in Chennai, Kolkata, Delhi, Hyderabad, Bangalore, Mumbai.",
    itinerary: [
      {
        day: 1,
        title: "Medical Record Assessment & Doctor Slot Booking",
        activities: [
          "Review of patient case files and recommendation letters",
          "Appointment booking with senior consultant/specialist across 44 leading Indian hospital networks (Apollo, Fortis, Medanta, Manipal, Global, BLK Max, Kokilaben, Narayana, Yashoda, etc.)",
          "Issuance of official invitation/appointment letter for Medical Visa application"
        ],
        meals: "Not included",
        overnight: "Hospital consultation service"
      },
      {
        day: 2,
        title: "Hospital Registration & Follow-up",
        activities: [
          "Patient report to International Patient Service desk",
          "Doctor consultation and diagnostic processing"
        ],
        meals: "Not included",
        overnight: "Service completed"
      }
    ],
    hotel: "Not included (Appointment Booking Service)",
    meals: "Not included",
    transportation: "Self arrangement",
    inclusions: [
      "Only hospital appointment",
      "Time: 2-7 days",
      "Network of 44 top hospitals across Chennai, Kolkata, Delhi/NCR, Hyderabad, Bangalore, Mumbai, Kochi, Ahmedabad"
    ],
    exclusions: [
      "Doctor consultation fees paid directly to hospital",
      "Diagnostic test fees and medicines",
      "Travel, flights, hotel and visa fees"
    ],
    visa_information: "Indian Medical Visa / Medical Attendant Visa invitation facilitation.",
    required_documents: [
      "Original Passport Copy",
      "Patient's all medical document scan copy",
      "Photo",
      "Bangladeshi doctor's recommendation letter"
    ],
    important_notes: [
      "Covers 44 top hospitals: Apollo (Chennai/Hyd/Delhi/Kolkata), Fortis (Kolkata/Bangalore/Gurugram/Delhi), Medanta, BLK Max, Artemis, Global, Kokilaben Ambani Mumbai, Manipal Bangalore, Yashoda Hyderabad, Aster Medicity Kochi, Dr Rela Chennai, etc."
    ],
    terms_conditions: ["Appointment processing takes 2 to 7 working days."],
    source_pdf: "SOURCE PDF PAGE 29-33",
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: ["https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80"],
    highlights: ["44 Premier Super Specialty Hospitals in India", "Apollo, Fortis, Medanta, Kokilaben & Manipal", "Fast 2-7 Days Processing", "Official Medical Visa Support Letter"]
  }
];
