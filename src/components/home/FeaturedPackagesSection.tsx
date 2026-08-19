import React from 'react';
import { Package, ArrowRight } from 'lucide-react';
import { TourPackage } from '../../types';
import { PackageCard } from '../PackageCard';

interface FeaturedPackagesSectionProps {
  packages: TourPackage[];
  onViewDetails: (pkg: TourPackage) => void;
  onRequestQuote: (pkg: TourPackage) => void;
  onNavigateToPackages?: () => void;
}

export const FeaturedPackagesSection: React.FC<FeaturedPackagesSectionProps> = ({
  packages,
  onViewDetails,
  onRequestQuote,
  onNavigateToPackages,
}) => {
  const featured = packages.slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0D6EFD]">
            <Package className="w-3.5 h-3.5" />
            <span>Handpicked Holidays</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#071A33] tracking-tight font-poppins">
            Featured Tour Packages
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Complete Asian itineraries with verified hotels, private transfers, and visa checklists.
          </p>
        </div>

        {onNavigateToPackages && (
          <button
            onClick={onNavigateToPackages}
            type="button"
            className="min-h-[44px] px-4 py-2 rounded-xl bg-blue-50 text-[#003580] hover:bg-blue-100 font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-2 self-start sm:self-auto"
          >
            <span>View All Packages ({packages.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {featured.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            onViewDetails={onViewDetails}
            onRequestQuote={onRequestQuote}
          />
        ))}
      </div>
    </section>
  );
};
