'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavbarContext } from '../context/NavbarContext';

interface ClientLayoutProps {
  navbar: React.ReactNode | ((navRef: React.RefObject<HTMLElement | null>) => React.ReactNode);
  children: React.ReactNode;
  className?: string;
  mainClassName?: string;
}

export function ClientLayout({
  navbar,
  children,
  className = '',
  mainClassName = '',
}: ClientLayoutProps) {
  const navbarRef = useRef<HTMLElement | null>(null);
  const [navbarHeight, setNavbarHeight] = useState<number>(80);

  const measureNavbar = useCallback(() => {
    const element = navbarRef.current;
    if (!element) return;

    const nextHeight = Math.ceil(element.getBoundingClientRect().height);

    if (nextHeight > 0) {
      setNavbarHeight((previousHeight) =>
        previousHeight === nextHeight ? previousHeight : nextHeight
      );
    }
  }, []);

  useEffect(() => {
    // Initial client-side measurement after mount
    measureNavbar();

    const element = navbarRef.current;
    let resizeObserver: ResizeObserver | null = null;

    if (typeof ResizeObserver !== 'undefined' && element) {
      resizeObserver = new ResizeObserver(() => {
        measureNavbar();
      });
      resizeObserver.observe(element);
    }

    // Debounced window resize and orientation change handlers
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleWindowResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        measureNavbar();
      }, 120);
    };

    const handleOrientationChange = () => {
      // Delay slightly for mobile browser viewport re-layout
      setTimeout(() => {
        measureNavbar();
      }, 150);
    };

    window.addEventListener('resize', handleWindowResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      window.removeEventListener('resize', handleWindowResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [measureNavbar]);

  return (
    <NavbarContext.Provider value={{ navbarHeight }}>
      <div
        className={className}
        style={
          {
            '--navbar-height': `${navbarHeight}px`,
          } as React.CSSProperties
        }
      >
        {typeof navbar === 'function' ? (
          navbar(navbarRef)
        ) : (
          <div ref={navbarRef as React.RefObject<HTMLDivElement>} className="w-full">
            {navbar}
          </div>
        )}

        <main className={mainClassName}>
          {children}
        </main>
      </div>
    </NavbarContext.Provider>
  );
}

export default ClientLayout;
