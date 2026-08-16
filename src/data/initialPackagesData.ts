import { TourPackage, DestinationRecord } from '../types';
import { AZRAQ_SOURCE_PACKAGES } from './azraqSourcePackagesPart1';
import { AZRAQ_SOURCE_PACKAGES_PART2 } from './azraqSourcePackagesPart2';
import { AZRAQ_SOURCE_PACKAGES_PART3 } from './azraqSourcePackagesPart3';
import { AZRAQ_SOURCE_PACKAGES_PART4 } from './azraqSourcePackagesPart4';
import { AZRAQ_SOURCE_PACKAGES_PART5 } from './azraqSourcePackagesPart5';
import { AZRAQ_SOURCE_PACKAGES_PART6 } from './azraqSourcePackagesPart6';
import { AZRAQ_SOURCE_PACKAGES_PART7 } from './azraqSourcePackagesPart7';
import { AZRAQ_SOURCE_PACKAGES_PART8 } from './azraqSourcePackagesPart8';

export const INITIAL_TOUR_PACKAGES: TourPackage[] = [
  ...AZRAQ_SOURCE_PACKAGES,
  ...AZRAQ_SOURCE_PACKAGES_PART2,
  ...AZRAQ_SOURCE_PACKAGES_PART3,
  ...AZRAQ_SOURCE_PACKAGES_PART4,
  ...AZRAQ_SOURCE_PACKAGES_PART5,
  ...AZRAQ_SOURCE_PACKAGES_PART6,
  ...AZRAQ_SOURCE_PACKAGES_PART7,
  ...AZRAQ_SOURCE_PACKAGES_PART8,
];

export const INITIAL_DESTINATIONS: DestinationRecord[] = [
  {
    id: "dest_thailand",
    name: "Thailand",
    country: "Thailand",
    description: "Bangkok Grand Palace, Pattaya Coral Island, floating markets, and exotic culinary delights.",
    image: "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=800&q=75",
    active: true,
    packageCount: 4
  },
  {
    id: "dest_nepal",
    name: "Nepal",
    country: "Nepal",
    description: "Kathmandu UNESCO heritage sites, Nagarkot sunrise mountain views, Pokhara Annapurna panorama.",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=75",
    active: true,
    packageCount: 5
  },
  {
    id: "dest_malaysia",
    name: "Malaysia",
    country: "Malaysia",
    description: "Kuala Lumpur Petronas Towers, Batu Caves, Genting Highlands cable cars, and Bukit Bintang shopping.",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=75",
    active: true,
    packageCount: 4
  },
  {
    id: "dest_singapore",
    name: "Singapore",
    country: "Singapore",
    description: "Marina Bay Sands SkyPark, Gardens by the Bay Flower Dome, Merlion Park, and Sentosa Island.",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=75",
    active: true,
    packageCount: 2
  },
  {
    id: "dest_combo_sea",
    name: "Thailand, Malaysia & Singapore Combo",
    country: "Combo (Thailand, Singapure, Malaysia)",
    description: "Complete Trination Southeast Asia packages with city tours, hotel stays, and airport transfers.",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=75",
    active: true,
    packageCount: 3
  },
  {
    id: "dest_combo_sin_mys",
    name: "Singapore & Malaysia Combo",
    country: "Combo (Singapore, Malaysia)",
    description: "Twin capital experiences featuring Genting Highlands, Marina Bay Sands SkyPark, and city sightseeing.",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=75",
    active: true,
    packageCount: 3
  },
  {
    id: "dest_combo_maldives_sl",
    name: "Maldives & Sri Lanka Combo",
    country: "Combo (Maldives, Srilanka)",
    description: "Tropical Hulhumale & Maafushi island escapes combined with Colombo, Kandy and Nuwara Eliya tea hills.",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=75",
    active: true,
    packageCount: 3
  },
  {
    id: "dest_bhutan",
    name: "Bhutan",
    country: "Bhutan",
    description: "Tiger's Nest (Taktsang) Monastery, Buddha Dordenma, Dochula Pass 108 Chortens with SDF included.",
    image: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=75",
    active: true,
    packageCount: 2
  },
  {
    id: "dest_srilanka",
    name: "Sri Lanka",
    country: "Srilanka",
    description: "Colombo Lotus Tower, Galle Face Green, Gangaramaya Temple, and shopping precincts.",
    image: "https://images.unsplash.com/photo-1588258524675-c61919a008c2?auto=format&fit=crop&w=800&q=75",
    active: true,
    packageCount: 2
  },
  {
    id: "dest_indonesia",
    name: "Indonesia (Bali)",
    country: "Indonesia",
    description: "Ubud cultural heritage, Kintamani Mount Batur volcano, ATV adventure, and Uluwatu cliff Kecak dance.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=75",
    active: true,
    packageCount: 2
  },
  {
    id: "dest_china",
    name: "China",
    country: "China",
    description: "Shanghai Bund waterfront, Guangzhou Sanyuanli wholesale, Xi'an Terracotta Warriors, Zhangjiajie Tianmen Mountain.",
    image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=800&q=75",
    active: true,
    packageCount: 4
  },
  {
    id: "dest_hospital",
    name: "Medical Tourism & Hospital Appointments",
    country: "Hospital Appointment",
    description: "Specialist doctor appointment bookings across 10 top Thailand hospitals and 44 super-specialty hospitals in India.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=75",
    active: true,
    packageCount: 2
  },
  {
    id: "dest_budget",
    name: "Budget Tours",
    country: "Budget Tour",
    description: "Cost-effective, essential accommodation and transfer packages for Nepal, Malaysia, Bangkok and Sri Lanka.",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=75",
    active: true,
    packageCount: 4
  }
];
