import { TourPackage, PricingTier, PackageItineraryDay } from '../types';

export interface GeminiPdfParseResult {
  success: boolean;
  message: string;
  detectedCount: number;
  detectedDestinations: string[];
  packages: TourPackage[];
}

/**
 * Utility Service to interface with the Gemini AI API for parsing uploaded
 * tour package PDFs into the structured TourPackage database schema.
 */
class GeminiPdfService {
  /**
   * Helper function to convert a browser File to base64 string
   */
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Strip data URI header if present
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  /**
   * Validates and transforms raw object into a complete, safe TourPackage record conforming to schema
   */
  public normalizeTourPackage(rawPkg: any, sourceFileName: string, index: number = 0): TourPackage {
    const timestamp = Date.now();
    const pkgId = rawPkg.id || `pkg_pdf_${timestamp}_${index}`;
    const startingPrice = typeof rawPkg.price === 'number' ? rawPkg.price : parseFloat(rawPkg.price) || 0;

    const country = rawPkg.country || 'International';
    const destName = rawPkg.destination_name || rawPkg.country || 'Tour Destination';
    const destId = rawPkg.destination_id || `dest_${country.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    // Normalize pricing tiers
    let pricingTiers: PricingTier[] = [];
    if (Array.isArray(rawPkg.pricing_tiers) && rawPkg.pricing_tiers.length > 0) {
      pricingTiers = rawPkg.pricing_tiers.map((pt: any) => ({
        pax: typeof pt.pax === 'number' ? pt.pax : parseInt(pt.pax, 10) || 2,
        price: typeof pt.price === 'number' ? pt.price : parseFloat(pt.price) || startingPrice,
      }));
    } else {
      pricingTiers = [
        { pax: 2, price: Math.round(startingPrice * 1.15) },
        { pax: 4, price: startingPrice },
      ];
    }

    // Normalize day-by-day itinerary
    let itinerary: PackageItineraryDay[] = [];
    if (Array.isArray(rawPkg.itinerary)) {
      itinerary = rawPkg.itinerary.map((dayItem: any, idx: number) => ({
        day: dayItem.day || idx + 1,
        title: dayItem.title || `Day ${idx + 1} Sightseeing`,
        activities: Array.isArray(dayItem.activities) ? dayItem.activities : [String(dayItem.activities || 'Sightseeing and transfers')],
        meals: dayItem.meals || 'Breakfast at hotel',
        overnight: dayItem.overnight || `${destName} Hotel`,
      }));
    }

    // Fallback images based on destination
    const defaultImage = rawPkg.images?.[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';

    return {
      id: pkgId,
      destination_id: destId,
      destination_name: destName,
      country: country,
      package_name: rawPkg.package_name || `${destName} Special Tour Package`,
      duration: rawPkg.duration || '3 Night 4 Days',
      price: startingPrice,
      currency: rawPkg.currency || 'BDT',
      pricing_tiers: pricingTiers,
      description: rawPkg.description || `Comprehensive tour package for ${destName} extracted from PDF document.`,
      itinerary: itinerary,
      hotel: rawPkg.hotel || 'Standard 3-Star or 4-Star Accommodations',
      meals: rawPkg.meals || 'Daily Breakfast included',
      transportation: rawPkg.transportation || 'Private AC Vehicle & Sightseeing Transfers',
      inclusions: Array.isArray(rawPkg.inclusions) ? rawPkg.inclusions : ['Hotel Stay', 'Daily Breakfast', 'Airport Transfers'],
      exclusions: Array.isArray(rawPkg.exclusions) ? rawPkg.exclusions : ['International Airfare', 'Personal Expenses', 'Visa Fees'],
      visa_information: rawPkg.visa_information || `Visa processing assistance provided for ${country}.`,
      required_documents: Array.isArray(rawPkg.required_documents) ? rawPkg.required_documents : ['Passport valid 6+ months', 'Bank Statement', '2 Recent Photos'],
      important_notes: Array.isArray(rawPkg.important_notes) ? rawPkg.important_notes : ['Standard Hotel Check-In: 2:00 PM', 'Subject to weather conditions'],
      terms_conditions: Array.isArray(rawPkg.terms_conditions) ? rawPkg.terms_conditions : ['Non-refundable package rate after confirmation'],
      source_pdf: sourceFileName,
      status: (rawPkg.status === 'published' || rawPkg.status === 'draft') ? rawPkg.status : 'published',
      created_at: rawPkg.created_at || new Date().toISOString(),
      updated_at: rawPkg.updated_at || new Date().toISOString(),
      images: Array.isArray(rawPkg.images) && rawPkg.images.length > 0 ? rawPkg.images : [defaultImage],
      highlights: Array.isArray(rawPkg.highlights) ? rawPkg.highlights : [`Explore ${destName}`, 'Guided Sightseeing', 'Airport Transfer'],
      departure_info: rawPkg.departure_info || 'Dhaka International Airport',
      number_of_travelers: rawPkg.number_of_travelers || 'Min 2 Pax',
      contact_info: rawPkg.contact_info || 'Globetrotter AI Travel Desk',
    };
  }

  /**
   * Parse a File object by converting it to base64 and calling Gemini extraction endpoint
   */
  public async parsePdfFile(file: File): Promise<GeminiPdfParseResult> {
    try {
      const base64Data = await this.fileToBase64(file);
      return await this.parsePdfBase64(base64Data, file.name);
    } catch (err: any) {
      console.error(`Error processing PDF file ${file.name}:`, err);
      return {
        success: false,
        message: err.message || `Failed to read ${file.name}`,
        detectedCount: 0,
        detectedDestinations: [],
        packages: [],
      };
    }
  }

  /**
   * Parse base64 PDF string directly using Gemini API endpoint
   */
  public async parsePdfBase64(pdfBase64: string, fileName: string = 'uploaded_package.pdf'): Promise<GeminiPdfParseResult> {
    try {
      const response = await fetch('/api/pdf/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfBase64, fileName }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      const rawPackages = data.packages || [];
      const normalizedPackages = rawPackages.map((pkg: any, idx: number) =>
        this.normalizeTourPackage(pkg, fileName, idx)
      );

      return {
        success: true,
        message: data.message || `Extracted ${normalizedPackages.length} package(s) from ${fileName}`,
        detectedCount: normalizedPackages.length,
        detectedDestinations: data.detectedDestinations || [],
        packages: normalizedPackages,
      };
    } catch (err: any) {
      console.error(`Gemini PDF parse failed for ${fileName}:`, err);
      return {
        success: false,
        message: err.message || 'Failed to extract package from PDF.',
        detectedCount: 0,
        detectedDestinations: [],
        packages: [],
      };
    }
  }

  /**
   * Parse raw text extracted from a PDF
   */
  public async parsePdfText(pdfText: string, fileName: string = 'extracted_text.pdf'): Promise<GeminiPdfParseResult> {
    try {
      const response = await fetch('/api/pdf/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfText, fileName }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      const rawPackages = data.packages || [];
      const normalizedPackages = rawPackages.map((pkg: any, idx: number) =>
        this.normalizeTourPackage(pkg, fileName, idx)
      );

      return {
        success: true,
        message: data.message || `Extracted ${normalizedPackages.length} package(s)`,
        detectedCount: normalizedPackages.length,
        detectedDestinations: data.detectedDestinations || [],
        packages: normalizedPackages,
      };
    } catch (err: any) {
      console.error('Gemini PDF text parse failed:', err);
      return {
        success: false,
        message: err.message || 'Failed to parse text with Gemini.',
        detectedCount: 0,
        detectedDestinations: [],
        packages: [],
      };
    }
  }

  /**
   * Process multiple PDF files sequentially with progress reporting
   */
  public async batchParsePdfFiles(
    files: File[],
    onProgress?: (completed: number, total: number, currentFileName: string) => void
  ): Promise<{
    successCount: number;
    failedCount: number;
    allExtractedPackages: TourPackage[];
    results: GeminiPdfParseResult[];
  }> {
    const total = files.length;
    let successCount = 0;
    let failedCount = 0;
    const allExtractedPackages: TourPackage[] = [];
    const results: GeminiPdfParseResult[] = [];

    for (let i = 0; i < total; i++) {
      const file = files[i];
      if (onProgress) {
        onProgress(i + 1, total, file.name);
      }

      const res = await this.parsePdfFile(file);
      results.push(res);

      if (res.success && res.packages.length > 0) {
        successCount++;
        allExtractedPackages.push(...res.packages);
      } else {
        failedCount++;
      }
    }

    return {
      successCount,
      failedCount,
      allExtractedPackages,
      results,
    };
  }
}

export const geminiPdfService = new GeminiPdfService();
