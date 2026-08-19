import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { TourPackage, DestinationRecord, PackageQuoteRequest } from '../types';
import { INITIAL_TOUR_PACKAGES, INITIAL_DESTINATIONS } from '../data/initialPackagesData';
import { geminiPdfService, GeminiPdfParseResult } from '../services/geminiPdfService';
import {
  importSourceTextPackagesToDb,
  parseSourceTextToSchema,
  validate37DistinctEntries,
  SourceTextImportResult,
} from '../utils/sourceTextParser';

export interface ImportConfirmationState {
  isConfirmed: boolean;
  totalImported: number;
  distinctCount: number;
  timestamp: string;
  message: string;
  packages: TourPackage[];
}

interface PackageContextType {
  packages: TourPackage[];
  destinations: DestinationRecord[];
  allCountries: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedDestinationId: string;
  setSelectedDestinationId: (id: string) => void;
  selectedDuration: string;
  setSelectedDuration: (duration: string) => void;
  maxPriceFilter: number;
  setMaxPriceFilter: (price: number) => void;
  filteredPackages: TourPackage[];
  isLoading: boolean;
  packageQuotes: PackageQuoteRequest[];
  
  // Modals & Active Selections
  activePackageModal: TourPackage | null;
  setActivePackageModal: (pkg: TourPackage | null) => void;
  activeQuotationModal: TourPackage | null;
  setActiveQuotationModal: (pkg: TourPackage | null) => void;
  
  // Wishlist & Saved Packages
  savedPackageIds: string[];
  toggleSavePackage: (id: string) => void;
  isPackageSaved: (id: string) => boolean;

  // 37 Package Import Confirmation State
  importConfirmation: ImportConfirmationState | null;
  clearImportConfirmation: () => void;
  parseAndImportFull37Packages: (sourceText?: string) => Promise<SourceTextImportResult>;

  // Admin Operations & Gemini PDF Integrations
  savePackages: (newPackages: TourPackage[]) => Promise<void>;
  updatePackage: (pkg: TourPackage) => Promise<void>;
  deletePackage: (id: string) => Promise<void>;
  togglePublishPackage: (id: string) => Promise<void>;
  togglePackagePublished: (id: string) => Promise<void>;
  clearAllPackages: () => Promise<void>;
  refreshPackages: () => Promise<void>;
  uploadPdfPackage: (file: File) => Promise<GeminiPdfParseResult>;
  uploadBatchPdfPackages: (
    files: File[],
    onProgress?: (completed: number, total: number, name: string) => void
  ) => Promise<{
    successCount: number;
    failedCount: number;
    allExtractedPackages: TourPackage[];
  }>;
  extractPDFData: (pdfText: string, fileName: string, pdfBase64?: string) => Promise<{
    packages: TourPackage[];
    detectedCount: number;
    detectedDestinations: string[];
  }>;
  submitPackageQuote: (quote: {
    customerName: string;
    email: string;
    phone: string;
    destination: string;
    package_id?: string;
    package_name?: string;
    travelDate: string;
    adults: number;
    children: number;
    specialRequirements?: string;
    message?: string;
  }) => Promise<{ success: boolean; message: string }>;
  import37SourcePackages: (sourceText?: string) => Promise<SourceTextImportResult>;
}

const PackageContext = createContext<PackageContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'globetrotter_tour_packages_v38';

export const PackageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [packages, setPackages] = useState<TourPackage[]>(() => {
    try {
      // Clean up old keys to prevent stale cached data
      localStorage.removeItem('globetrotter_tour_packages_v37');
      localStorage.removeItem('globetrotter_tour_packages_v2');
      localStorage.removeItem('globetrotter_tour_packages_v1');
      
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 37) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved packages:', e);
    }
    // Default to all 37 PDF extracted packages
    return INITIAL_TOUR_PACKAGES;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedDestinationId, setSelectedDestinationId] = useState<string>('All');
  const [selectedDuration, setSelectedDuration] = useState<string>('All');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(100000);

  const [activePackageModal, setActivePackageModal] = useState<TourPackage | null>(null);
  const [activeQuotationModal, setActiveQuotationModal] = useState<TourPackage | null>(null);
  const [importConfirmation, setImportConfirmation] = useState<ImportConfirmationState | null>(null);

  // Wishlist / Saved Packages state
  const [savedPackageIds, setSavedPackageIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('azraq_saved_packages_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('azraq_saved_packages_wishlist', JSON.stringify(savedPackageIds));
    } catch (e) {
      console.error('Error saving wishlist:', e);
    }
  }, [savedPackageIds]);

  const toggleSavePackage = (id: string) => {
    setSavedPackageIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const isPackageSaved = (id: string) => {
    return savedPackageIds.includes(id);
  };

  const clearImportConfirmation = () => {
    setImportConfirmation(null);
  };

  // Sync to API and LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(packages));
    } catch (e) {
      console.error('Error saving packages to localStorage:', e);
    }
  }, [packages]);

  const [packageQuotes, setPackageQuotes] = useState<PackageQuoteRequest[]>([]);

  const fetchServerPackages = async () => {
    try {
      const res = await fetch('/api/packages?status=all');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.packages) && data.packages.length > 0) {
          setPackages(data.packages);
        }
      }
    } catch (e) {
      console.log('Server packages endpoint fallback to local store.');
    }
  };

  const fetchPackageQuotes = async () => {
    try {
      const res = await fetch('/api/quotes/admin');
      if (res.ok) {
        const data = await res.json();
        if (data.quotes && Array.isArray(data.quotes)) {
          const filtered = data.quotes.filter((q: any) => q.type === 'package');
          setPackageQuotes(filtered);
        }
      }
    } catch (e) {
      console.log('Could not fetch admin quotes list');
    }
  };

  // Fetch published packages and quotes from server on mount
  useEffect(() => {
    fetchServerPackages();
    fetchPackageQuotes();
  }, []);

  const refreshPackages = async () => {
    await fetchServerPackages();
    await fetchPackageQuotes();
  };

  // Compute dynamic destinations array derived strictly from active published packages
  const destinations = useMemo(() => {
    const publishedList = packages.filter((p) => p.status === 'published');
    const destMap = new Map<string, DestinationRecord>();

    publishedList.forEach((pkg) => {
      const key = pkg.destination_id || `dest_${pkg.country.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      if (!destMap.has(key)) {
        // Find match in initial or build fresh record
        const known = INITIAL_DESTINATIONS.find((d) => d.id === key || d.country === pkg.country);
        destMap.set(key, {
          id: key,
          name: pkg.destination_name || pkg.country,
          country: pkg.country,
          description: pkg.description || `Tour packages for ${pkg.destination_name}`,
          image: pkg.images[0] || known?.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
          active: true,
          packageCount: 1,
        });
      } else {
        const existing = destMap.get(key)!;
        destMap.set(key, {
          ...existing,
          packageCount: (existing.packageCount || 0) + 1,
        });
      }
    });

    return Array.from(destMap.values());
  }, [packages]);

  // Get unique list of countries strictly from existing published packages
  const allCountries = useMemo(() => {
    const set = new Set<string>();
    packages
      .filter((p) => p.status === 'published')
      .forEach((p) => {
        if (p.country) set.add(p.country);
      });
    return Array.from(set).sort();
  }, [packages]);

  // Filtered packages logic
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      if (pkg.status !== 'published') return false;

      // Country filter
      if (selectedCountry !== 'All' && pkg.country !== selectedCountry) {
        return false;
      }

      // Destination filter
      if (
        selectedDestinationId !== 'All' &&
        pkg.destination_id !== selectedDestinationId &&
        pkg.destination_name !== selectedDestinationId
      ) {
        return false;
      }

      // Duration filter
      if (selectedDuration !== 'All') {
        if (selectedDuration === 'Short (1-3 Days)' && !/1|2|3 Night/i.test(pkg.duration)) {
          return false;
        }
        if (selectedDuration === 'Medium (4-6 Days)' && !/4|5|6 Night/i.test(pkg.duration)) {
          return false;
        }
        if (selectedDuration === 'Long (7+ Days)' && !/7|8|9|10|14 Night/i.test(pkg.duration)) {
          return false;
        }
      }

      // Price filter
      if (pkg.price > maxPriceFilter) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = pkg.package_name.toLowerCase().includes(query);
        const matchesDest = pkg.destination_name.toLowerCase().includes(query);
        const matchesCountry = pkg.country.toLowerCase().includes(query);
        const matchesDesc = pkg.description.toLowerCase().includes(query);
        const matchesHotel = pkg.hotel.toLowerCase().includes(query);
        if (!matchesName && !matchesDest && !matchesCountry && !matchesDesc && !matchesHotel) {
          return false;
        }
      }

      return true;
    });
  }, [
    packages,
    selectedCountry,
    selectedDestinationId,
    selectedDuration,
    maxPriceFilter,
    searchQuery,
  ]);

  // Actions
  const savePackages = async (newPackages: TourPackage[]) => {
    setIsLoading(true);
    try {
      // Update local state
      setPackages((prev) => {
        const map = new Map(prev.map((p) => [p.id, p]));
        newPackages.forEach((p) => map.set(p.id, p));
        return Array.from(map.values());
      });

      // Save to server API
      await fetch('/api/packages/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packages: newPackages }),
      });
    } catch (e) {
      console.error('Error saving packages:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePackage = async (updated: TourPackage) => {
    setPackages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    try {
      await fetch(`/api/packages/${updated.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.error('Error updating package on server:', e);
    }
  };

  const deletePackage = async (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch(`/api/packages/${id}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.error('Error deleting package:', e);
    }
  };

  const togglePublishPackage = async (id: string) => {
    const target = packages.find((p) => p.id === id);
    if (!target) return;
    const newStatus = target.status === 'published' ? 'draft' : 'published';
    const updated = { ...target, status: newStatus as any };
    await updatePackage(updated);
  };

  const togglePackagePublished = togglePublishPackage;

  const clearAllPackages = async () => {
    setPackages([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const uploadPdfPackage = async (file: File) => {
    setIsLoading(true);
    try {
      const result = await geminiPdfService.parsePdfFile(file);
      if (result.success && result.packages.length > 0) {
        await savePackages(result.packages);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadBatchPdfPackages = async (
    files: File[],
    onProgress?: (completed: number, total: number, name: string) => void
  ) => {
    setIsLoading(true);
    try {
      const batchResult = await geminiPdfService.batchParsePdfFiles(files, onProgress);
      if (batchResult.allExtractedPackages.length > 0) {
        await savePackages(batchResult.allExtractedPackages);
      }
      return {
        successCount: batchResult.successCount,
        failedCount: batchResult.failedCount,
        allExtractedPackages: batchResult.allExtractedPackages,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const extractPDFData = async (pdfText: string, fileName: string, pdfBase64?: string) => {
    setIsLoading(true);
    try {
      let result;
      if (pdfBase64) {
        result = await geminiPdfService.parsePdfBase64(pdfBase64, fileName);
      } else {
        result = await geminiPdfService.parsePdfText(pdfText, fileName);
      }

      if (result.success && result.packages.length > 0) {
        await savePackages(result.packages);
      }

      return {
        packages: result.packages,
        detectedCount: result.detectedCount,
        detectedDestinations: result.detectedDestinations,
      };
    } catch (err: any) {
      console.error('PDF extraction failed:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const submitPackageQuote = async (quote: {
    customerName: string;
    email: string;
    phone: string;
    destination: string;
    package_id?: string;
    package_name?: string;
    travelDate: string;
    adults: number;
    children: number;
    specialRequirements?: string;
    message?: string;
  }) => {
    try {
      const res = await fetch('/api/quotes/package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quote),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit quotation');
      }

      return {
        success: true,
        message: data.message || 'Quotation submitted successfully!',
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Error submitting quotation.',
      };
    }
  };

  /**
   * Handles parsing and importing of the full 37-package list.
   * Includes a logic gate to check for exactly 37 distinct entries,
   * preventing partial imports if the gate check fails, and triggers
   * a confirmation state after processing succeeds.
   */
  const parseAndImportFull37Packages = async (
    sourceText?: string
  ): Promise<SourceTextImportResult> => {
    setIsLoading(true);
    try {
      // 1. Parse full raw text or load canonical dataset
      const parsedPackages = parseSourceTextToSchema(sourceText);

      // 2. LOGIC GATE: Check for exactly 37 distinct entries
      const gateValidation = validate37DistinctEntries(parsedPackages);

      if (!gateValidation.isValid) {
        // PREVENT PARTIAL IMPORT: Do NOT update packages or save partial records
        const errorMessage = `Gate Check Failed: Required exactly 37 distinct packages, but detected ${gateValidation.distinctCount} distinct entries out of ${gateValidation.totalCount} total. Partial import strictly prevented.`;
        console.warn(`[PackageProvider Gatekeeper] ${errorMessage}`);

        const failedResult: SourceTextImportResult = {
          success: false,
          totalImported: 0,
          distinctCount: gateValidation.distinctCount,
          gatePassed: false,
          displayMessage: errorMessage,
          importedPackages: [],
          logs: [
            `Starting package import...`,
            `Logic gate check failed: Found ${gateValidation.distinctCount}/37 distinct entries.`,
            `Partial import strictly prevented by logic gate.`
          ],
        };

        return failedResult;
      }

      // 3. Logic Gate Passed (37 distinct entries verified)
      const res = await importSourceTextPackagesToDb(sourceText);

      if (res.success && res.importedPackages.length === 37) {
        setPackages(res.importedPackages);

        // 4. TRIGGER CONFIRMATION STATE
        const confirmationState: ImportConfirmationState = {
          isConfirmed: true,
          totalImported: res.importedPackages.length,
          distinctCount: gateValidation.distinctCount,
          timestamp: new Date().toISOString(),
          message: `Confirmation State Passed: Successfully parsed, validated, and synchronized all 37 distinct tour packages into database.`,
          packages: res.importedPackages,
        };

        setImportConfirmation(confirmationState);
      }

      return res;
    } catch (err: any) {
      console.error('Error during 37-package import:', err);
      return {
        success: false,
        totalImported: 0,
        distinctCount: 0,
        gatePassed: false,
        displayMessage: `Import Error: ${err.message || 'Unknown failure'}`,
        importedPackages: [],
        logs: [`Parsing error: ${err.message}`],
      };
    } finally {
      setIsLoading(false);
    }
  };

  const import37SourcePackages = parseAndImportFull37Packages;

  return (
    <PackageContext.Provider
      value={{
        packages,
        destinations,
        allCountries,
        searchQuery,
        setSearchQuery,
        selectedCountry,
        setSelectedCountry,
        selectedDestinationId,
        setSelectedDestinationId,
        selectedDuration,
        setSelectedDuration,
        maxPriceFilter,
        setMaxPriceFilter,
        filteredPackages,
        isLoading,
        packageQuotes,
        activePackageModal,
        setActivePackageModal,
        activeQuotationModal,
        setActiveQuotationModal,
        savedPackageIds,
        toggleSavePackage,
        isPackageSaved,
        importConfirmation,
        clearImportConfirmation,
        parseAndImportFull37Packages,
        savePackages,
        updatePackage,
        deletePackage,
        togglePublishPackage,
        togglePackagePublished,
        clearAllPackages,
        refreshPackages,
        uploadPdfPackage,
        uploadBatchPdfPackages,
        extractPDFData,
        submitPackageQuote,
        import37SourcePackages,
      }}
    >
      {children}
    </PackageContext.Provider>
  );
};

export const usePackages = () => {
  const context = useContext(PackageContext);
  if (!context) {
    throw new Error('usePackages must be used within a PackageProvider');
  }
  return context;
};
