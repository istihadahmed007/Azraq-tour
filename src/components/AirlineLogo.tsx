import React, { useState, useEffect } from 'react';
import { Plane } from 'lucide-react';
import { getAirlineLogoUrls, resolveAirlineCode, AIRLINE_DIRECTORY } from '../utils/airlineLogos';

export interface AirlineLogoProps {
  airlineCode?: string;
  airlineName?: string;
  customLogoUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  imgClassName?: string;
  showTooltip?: boolean;
}

const SIZE_MAP = {
  xs: {
    container: 'w-6 h-6 rounded-md',
    img: 'w-5 h-5',
    text: 'text-[9px]',
    icon: 'w-3 h-3',
  },
  sm: {
    container: 'w-8 h-8 rounded-lg',
    img: 'w-6 h-6',
    text: 'text-[10px]',
    icon: 'w-3.5 h-3.5',
  },
  md: {
    container: 'w-10 h-10 rounded-lg',
    img: 'w-8 h-8',
    text: 'text-xs',
    icon: 'w-4 h-4',
  },
  lg: {
    container: 'w-12 h-12 rounded-xl',
    img: 'w-10 h-10',
    text: 'text-sm',
    icon: 'w-5 h-5',
  },
  xl: {
    container: 'w-16 h-16 rounded-2xl',
    img: 'w-12 h-12',
    text: 'text-base',
    icon: 'w-6 h-6',
  },
};

export const AirlineLogo: React.FC<AirlineLogoProps> = ({
  airlineCode,
  airlineName,
  customLogoUrl,
  size = 'md',
  className = '',
  imgClassName = '',
  showTooltip = true,
}) => {
  const info = getAirlineLogoUrls(airlineCode, airlineName, customLogoUrl);
  const [srcIndex, setSrcIndex] = useState<number>(0);
  const [isFailed, setIsFailed] = useState<boolean>(false);

  const sources = [
    info.primary,
    info.fallback,
    info.backup,
    `https://pics.avs.io/al_square/64/64/${info.code}.png`,
  ];

  // Reset error state if airline props change
  useEffect(() => {
    setSrcIndex(0);
    setIsFailed(false);
  }, [airlineCode, airlineName, customLogoUrl]);

  const handleError = () => {
    if (srcIndex < sources.length - 1) {
      setSrcIndex((prev) => prev + 1);
    } else {
      setIsFailed(true);
    }
  };

  const sizeStyle = SIZE_MAP[size] || SIZE_MAP.md;
  const currentSrc = sources[srcIndex];

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 bg-white border border-slate-200/80 shadow-2xs overflow-hidden ${sizeStyle.container} ${className}`}
      title={showTooltip ? `${info.name} (${info.code})` : undefined}
      style={{
        backgroundColor: '#FFFFFF',
      }}
    >
      {!isFailed && currentSrc ? (
        <img
          src={currentSrc}
          alt={`${info.name} logo`}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={handleError}
          className={`object-contain transition-opacity duration-200 ${sizeStyle.img} ${imgClassName}`}
        />
      ) : (
        /* Polished SVG / Monogram Fallback Badge using signature brand color */
        <div
          className="w-full h-full flex flex-col items-center justify-center font-bold tracking-tight text-white select-none"
          style={{
            backgroundColor: info.brandColor || '#006CE4',
          }}
        >
          {info.code && info.code !== 'FL' ? (
            <span className={`font-mono font-extrabold leading-none ${sizeStyle.text}`}>
              {info.code}
            </span>
          ) : (
            <Plane className={`${sizeStyle.icon} transform -rotate-45 text-white`} />
          )}
        </div>
      )}
    </div>
  );
};
