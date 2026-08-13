export interface VisaRequirementItem {
  id: string;
  country: string;
  visaType: 'Tourist' | 'Business' | 'Medical' | 'Student' | 'Transit' | 'Other';
  entryType: string; // e.g. E-Visa, Sticker Visa, ETA, VOA
  validity?: string;
  processingTime?: string;
  deliveryTime?: string;
  minBankBalance?: string;
  photoSpec?: string;
  passportValidity?: string;
  embassyFeeBDT?: string;
  serviceChargeBDT?: string;
  totalEstimatedBDT?: string;
  generalRequirements: string[];
  occupationRequirements?: {
    businessPerson?: string[];
    jobHolder?: string[];
    student?: string[];
    others?: string[];
  };
  notes?: string[];
  termsAndConditions?: string[];
}

export const OFFICIAL_VISA_REQUIREMENTS: VisaRequirementItem[] = [
  {
    id: 'malaysia-tourist-evisa',
    country: 'Malaysia',
    visaType: 'Tourist',
    entryType: 'Tourist (E-Visa)',
    validity: '3/6 months (Single entry)',
    processingTime: '3–5 Working Days',
    minBankBalance: 'BDT 100,000 per applicant',
    photoSpec: 'Size 35 mm x 50 mm (Original soft copy from studio + printed copy)',
    passportValidity: 'Minimum 7 months validity',
    embassyFeeBDT: 'BDT 4,500',
    serviceChargeBDT: 'BDT 1,500',
    totalEstimatedBDT: 'BDT 6,000',
    generalRequirements: [
      'Photograph of Applicant (Original soft copy from studio, size 35mm x 50mm + printed copy)',
      'Passport first page scan copy (Valid minimum 7 months)',
      'Latest Bank Statement for last 6 months (Minimum balance BDT 100,000 per applicant)',
      'Bank Solvency Certificate'
    ],
    occupationRequirements: {
      businessPerson: [
        'Renewal Trade License copy with notary public (English translated)',
        'Memorandum for Limited Company',
        'Office pad (Blank page on company letterhead)',
        'Visiting Card'
      ],
      jobHolder: [
        'No Objection Certificate (NOC) from employer',
        'BMDC Certificate (for Doctors)',
        'BAR Council Certificate (for Advocates)',
        'Salary Certificate with Pay Slips'
      ],
      student: [
        'Student ID Card photocopy',
        'Birth Certificate (Only for child & infant)',
        'Leave Certificate / School NOC'
      ],
      others: [
        'Marriage Certificate copy (For family application if husband name is not in passport)'
      ]
    }
  },
  {
    id: 'thailand-tourist-evisa',
    country: 'Thailand',
    visaType: 'Tourist',
    entryType: 'Tourist (E-Visa)',
    processingTime: '1 Working Day',
    deliveryTime: '10–45 Days (as per Embassy notice)',
    minBankBalance: 'BDT 100,000 per person',
    photoSpec: 'Size 35mm x 45mm with white background (recent last 3 months, 2 copies)',
    passportValidity: 'Minimum 7 months validity (include old passports if any)',
    embassyFeeBDT: 'BDT 5,500',
    serviceChargeBDT: 'BDT 1,500',
    totalEstimatedBDT: 'BDT 7,000',
    generalRequirements: [
      'Passport validity minimum 07 months (include old passports if available)',
      'Recent 02 copies Photograph with white background (Size 35mm x 45mm, taken in last 3 months)',
      'Bank Statement for last 6 months (Minimum balance BDT 100,000 per person)',
      'Visiting Card',
      'Bank Solvency Certificate'
    ],
    occupationRequirements: {
      businessPerson: [
        'Renewal Trade License copy with notary public (English translated)',
        'Memorandum for Limited Company'
      ],
      jobHolder: [
        'No Objection Certificate (NOC) on office letterhead',
        'BMDC Certificate for Doctor',
        'BAR Council Certificate for Advocate',
        'Salary Bank Statement (preferably) / Pay Slip / Salary Certificate'
      ],
      student: [
        'Student ID Card photocopy',
        'Birth Certificate (Only for child & infant)'
      ],
      others: [
        'Marriage Certificate copy (For family application - if in Bengali, notarized English translation and photocopy required)'
      ]
    },
    notes: [
      'If sponsored by applicant company: Submit company Bank Statement, Bank Solvency Letter, and attached Trade License.',
      'Salary Bank Statement (preferably) / Pay Slip / Salary Certificate required for employees.',
      'If applicant is unable to submit salary certificate, salary details must be explicitly mentioned in the Office NOC.',
      'All documents in foreign languages (including Bangla) must be translated into English and certified by a credible translator & notary public.'
    ]
  },
  {
    id: 'china-business-sticker',
    country: 'China',
    visaType: 'Business',
    entryType: 'Business (Sticker Visa)',
    processingTime: '30 Working Days (+/-)',
    passportValidity: 'Minimum 7 months validity from departure date',
    photoSpec: 'Size 33 mm x 48 mm with white background (2 copies)',
    embassyFeeBDT: 'BDT 8,500',
    serviceChargeBDT: 'BDT 3,500',
    totalEstimatedBDT: 'BDT 12,000',
    generalRequirements: [
      'Original Passport (Validity at least 07 months from departure date)',
      'Recent 33 mm x 48 mm size photo with white background (2 copies)',
      'Visiting Card'
    ],
    occupationRequirements: {
      businessPerson: [
        'Updated Trade License (Mandatory for business applicants)',
        'Notarized copy with English translation on official letterhead pad'
      ]
    }
  },
  {
    id: 'china-tourist-sticker',
    country: 'China',
    visaType: 'Tourist',
    entryType: 'Tourist (Sticker Visa)',
    processingTime: '15 Days (+/-)',
    minBankBalance: 'BDT 300,000 minimum balance',
    photoSpec: 'Size 33 mm x 48 mm with white background (2 copies on mat paper)',
    passportValidity: 'Minimum 6 months validity from departure date',
    embassyFeeBDT: 'BDT 7,500',
    serviceChargeBDT: 'BDT 2,500',
    totalEstimatedBDT: 'BDT 10,000',
    generalRequirements: [
      'Original Passport (Validity at least 06 months from date of departure)',
      'Recent 33 mm x 48 mm size photo with white background (2 copies, mat paper)',
      'Visiting Card & National ID Card',
      'N.O.C / G.O / Trade License (Notarized copy with English translation on letterhead pad)',
      'Original Bank Statement for last 6 months (Minimum balance BDT 300,000)',
      'Bank Solvency Certificate',
      'Confirmed Return Air Ticket',
      'Student ID Card (if a child is traveling)',
      'Birth Certificate (for infants)',
      'Marriage Certificate (only for newly married couples)'
    ],
    termsAndConditions: [
      'Visa fee is non-refundable, regardless of the outcome.',
      'Visa approval is at the sole discretion of the Embassy.',
      'Client must provide authentic and complete documents.',
      'We provide guidance, support, and document processing assistance only.',
      'Processing time may vary depending on Embassy operations.'
    ]
  },
  {
    id: 'singapore-tourist-evisa',
    country: 'Singapore',
    visaType: 'Tourist',
    entryType: 'Tourist (E-Visa)',
    processingTime: '7–10 Working Days',
    minBankBalance: 'BDT 100,000 minimum balance',
    photoSpec: 'Size 35 mm x 45 mm with white background (2 copies on mat paper)',
    passportValidity: 'Minimum 6 months validity from departure date',
    embassyFeeBDT: 'BDT 4,200',
    serviceChargeBDT: 'BDT 1,800',
    totalEstimatedBDT: 'BDT 6,000',
    generalRequirements: [
      'Original Passport (Validity at least 06 months from date of departure)',
      'Recent 35 mm x 45 mm photo with white background (Mat Paper, 2 copies)',
      'Visiting Card & National ID Card',
      'N.O.C / G.O / Trade License Notarized Copy with English translation on letterhead pad',
      'Original Bank Statement for last 6 months (Minimum balance BDT 100,000)',
      'Bank Solvency Certificate',
      'Student ID Card for Student (if child traveling with parent)',
      'Birth Certificate for Infant (if child traveling with parent)',
      'Marriage Certificate (only for newly married couple)'
    ]
  },
  {
    id: 'india-medical-visa',
    country: 'India',
    visaType: 'Medical',
    entryType: 'Medical Visa',
    processingTime: '5–7 Working Days',
    passportValidity: 'Valid for at least 6 months beyond intended date of travel',
    photoSpec: 'Two recent passport-sized photos',
    embassyFeeBDT: 'BDT 800 (IVAC)',
    serviceChargeBDT: 'BDT 1,200',
    totalEstimatedBDT: 'BDT 2,000',
    generalRequirements: [
      'Passport: Valid for at least 6 months beyond the intended date of travel',
      'Recent Medical Reports: Diagnosis certificates and referral letters from a local doctor or hospital in Bangladesh',
      'Visa Invitation Letter: Issued by the Indian hospital where treatment is planned (Must include Medical Visa Reference Number generated through AYUSH portal)',
      'Photographs: Two recent passport-sized photos',
      'Proof of Relationship: For Medical Attendants accompanying patient (Up to two blood relatives permitted)',
      'Proof of Profession',
      'Bank Statement'
    ],
    notes: [
      'Intended for individuals seeking medical treatment at recognized hospitals or treatment centers in India.',
      'Up to two attendants (blood relatives) can accompany the patient under separate Medical Attendant Visas, co-terminous with the patient visa.',
      'Indian hospital invitation letters must include an official AYUSH portal Medical Visa Reference Number.'
    ]
  },
  {
    id: 'china-medical-visa',
    country: 'China',
    visaType: 'Medical',
    entryType: 'Medical Visa',
    processingTime: '15–20 Working Days',
    minBankBalance: 'BDT 1,200,000 minimum balance',
    photoSpec: 'Size 33 mm x 48 mm photo with white background (2 copies, mat paper)',
    passportValidity: 'Minimum 6 months validity from departure date',
    embassyFeeBDT: 'BDT 9,000',
    serviceChargeBDT: 'BDT 3,500',
    totalEstimatedBDT: 'BDT 12,500',
    generalRequirements: [
      'Original Passport (Validity at least 06 months from date of departure)',
      'Recent 33 mm x 48 mm photo with white background (2 copies, mat paper)',
      'Visiting Card & National ID Card',
      'N.O.C / G.O / Trade License Notarized Copy with English translation on letterhead pad',
      'Original Bank Statement for last 6 months (Minimum balance BDT 1,200,000)',
      'Bank Solvency Certificate',
      'Hospital Invitation Letter from China',
      'Doctor Recommendation Letter from Bangladesh'
    ]
  },
  {
    id: 'srilanka-tourist-evisa',
    country: 'Sri Lanka',
    visaType: 'Tourist',
    entryType: 'Tourist (E-Visa / ETA)',
    processingTime: '1–2 Working Days',
    passportValidity: 'Minimum 6 months validity from departure date',
    photoSpec: 'Recent passport size photo soft / scan copy with white background',
    embassyFeeBDT: 'BDT 6,100 ($50 USD)',
    serviceChargeBDT: 'BDT 1,400',
    totalEstimatedBDT: 'BDT 7,500',
    generalRequirements: [
      'Passport Soft / Scan Copy (Validity at least 06 months from date of departure)',
      'Recent Passport size photo Soft / Scan Copy with white background'
    ],
    notes: [
      'Please inform us of your approximate travel date, intended travel duration, and port of entry before applying.'
    ]
  },
  {
    id: 'indonesia-tourist-sticker',
    country: 'Indonesia',
    visaType: 'Tourist',
    entryType: 'Tourist (Sticker Visa)',
    processingTime: '15–20 Working Days (subject to Embassy approval)',
    validity: 'Single-entry sticker visa: Valid for 90 days, allows stay up to 60 days',
    minBankBalance: 'USD 2,000 (approx. BDT 244,000)',
    photoSpec: 'Recent passport-size photo with white background',
    passportValidity: 'Valid for at least 6 months from planned departure date',
    embassyFeeBDT: 'BDT 18,300 ($150 USD)',
    serviceChargeBDT: 'BDT 4,700',
    totalEstimatedBDT: 'BDT 23,000',
    generalRequirements: [
      'Original passport – valid for at least 6 months from planned departure date',
      'Passport-size photo – recent, with white background',
      'Original bank statement – last 6 months, with minimum balance of USD 2,000 (~ BDT 244,000)',
      'Bank solvency certificate – plus one cheque book page copy',
      'Notarized NOC / Trade license – translated into English on company letterhead pad',
      'Visiting card and National ID card',
      'Round-trip flight booking – departure date must be at least 30 days after visa application date',
      'Hotel reservation / accommodation booking copy',
      'Travel history requirement: Minimum 2-3 previous country visits required on passport',
      'Main applicant age requirement: Above 30+ years old',
      'If family application: Father bank statement needs to be strong'
    ],
    notes: [
      'Single-entry sticker visa valid for 90 days allowing up to 60 days stay.',
      'Departure date must be at least 30 days after visa application submission.'
    ]
  },
  {
    id: 'uae-dubai-tourist-evisa',
    country: 'United Arab Emirates (Dubai)',
    visaType: 'Tourist',
    entryType: '30-Day E-Visa',
    processingTime: '2–4 Working Days',
    validity: '30 Days Single Entry',
    passportValidity: 'Minimum 6 months validity',
    photoSpec: 'Passport-size white background photo scan',
    embassyFeeBDT: 'BDT 9,500',
    serviceChargeBDT: 'BDT 2,000',
    totalEstimatedBDT: 'BDT 11,500',
    generalRequirements: [
      'Passport clear scan copy (Validity minimum 6 months)',
      'Recent photo with white background (Soft copy)',
      'Confirmed flight ticket & hotel booking'
    ]
  },
  {
    id: 'vietnam-tourist-evisa',
    country: 'Vietnam',
    visaType: 'Tourist',
    entryType: 'Tourist E-Visa',
    processingTime: '3–5 Working Days',
    validity: '30 / 90 Days Single or Multiple Entry',
    passportValidity: 'Minimum 6 months validity',
    photoSpec: '4x6 cm white background soft copy',
    embassyFeeBDT: 'BDT 3,800',
    serviceChargeBDT: 'BDT 1,700',
    totalEstimatedBDT: 'BDT 5,500',
    generalRequirements: [
      'Passport scan copy (minimum 6 months validity)',
      'Recent 4x6 cm digital photo with white background',
      'Entry & exit port details'
    ]
  },
  {
    id: 'japan-tourist-sticker',
    country: 'Japan',
    visaType: 'Tourist',
    entryType: 'Tourist Sticker Visa',
    processingTime: '7–10 Working Days',
    validity: '90 Days Single Entry',
    minBankBalance: 'BDT 250,000 minimum balance',
    passportValidity: 'Minimum 6 months validity',
    photoSpec: '2x2 inch white background photo (2 copies)',
    embassyFeeBDT: 'BDT 2,500',
    serviceChargeBDT: 'BDT 2,000',
    totalEstimatedBDT: 'BDT 4,500',
    generalRequirements: [
      'Original Passport (minimum 6 months validity)',
      'Recent 2x2 inch photo with white background (2 copies)',
      'Bank statement (6 months) & solvency certificate',
      'NOC / Trade License & Visiting Card',
      'Day-by-day travel itinerary in Japan'
    ]
  }
];

export function getVisaRequirement(countryName: string, visaType?: string): VisaRequirementItem | null {
  if (!countryName) return null;
  const targetCountry = countryName.toLowerCase().trim();
  const targetType = (visaType || 'Tourist').toLowerCase().trim();

  // Try exact country + type match
  const exact = OFFICIAL_VISA_REQUIREMENTS.find(
    (v) => v.country.toLowerCase() === targetCountry && v.visaType.toLowerCase() === targetType
  );
  if (exact) return exact;

  // Partial match by country AND type
  const countryAndTypeMatch = OFFICIAL_VISA_REQUIREMENTS.find(
    (v) => (v.country.toLowerCase().includes(targetCountry) || targetCountry.includes(v.country.toLowerCase())) && v.visaType.toLowerCase() === targetType
  );
  if (countryAndTypeMatch) return countryAndTypeMatch;

  // Partial match by country
  const countryMatch = OFFICIAL_VISA_REQUIREMENTS.find(
    (v) => v.country.toLowerCase() === targetCountry || targetCountry.includes(v.country.toLowerCase()) || v.country.toLowerCase().includes(targetCountry)
  );
  return countryMatch || null;
}

export function getVisaFeeForDestination(countryName: string, visaType?: string): string {
  if (!countryName) return 'BDT 6,000';
  const norm = countryName.toLowerCase();
  
  if (norm.includes('maldives') || norm.includes('nepal')) {
    return 'VOA Free / On Arrival';
  }

  const req = getVisaRequirement(countryName, visaType);
  if (req && req.totalEstimatedBDT) {
    return req.totalEstimatedBDT;
  }
  
  if (norm.includes('malaysia')) return 'BDT 6,000';
  if (norm.includes('thailand')) return 'BDT 7,000';
  if (norm.includes('china')) return 'BDT 10,000';
  if (norm.includes('singapore')) return 'BDT 6,000';
  if (norm.includes('india')) return 'BDT 2,000';
  if (norm.includes('sri lanka') || norm.includes('srilanka')) return 'BDT 7,500';
  if (norm.includes('indonesia') || norm.includes('bali')) return 'BDT 23,000';
  if (norm.includes('dubai') || norm.includes('uae')) return 'BDT 11,500';
  if (norm.includes('vietnam')) return 'BDT 5,500';
  if (norm.includes('japan')) return 'BDT 4,500';

  return 'BDT 6,000 (Est.)';
}

