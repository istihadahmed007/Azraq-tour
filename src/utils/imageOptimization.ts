/**
 * Unsplash Image Optimization Utility
 * Dynamically formats URLs with optimal width and quality, and produces responsive srcSet strings
 */

export function getOptimizedUnsplashUrl(url: string, width = 800, quality = 75): string {
  if (!url || typeof url !== 'string' || !url.includes('images.unsplash.com')) {
    return url || '';
  }
  const baseUrl = url.split('?')[0];
  return `${baseUrl}?auto=format&fit=crop&w=${width}&q=${quality}`;
}

export function getUnsplashSrcSet(
  url: string,
  widths: number[] = [400, 800, 1200],
  quality = 75
): string {
  if (!url || typeof url !== 'string' || !url.includes('images.unsplash.com')) {
    return '';
  }
  const baseUrl = url.split('?')[0];
  return widths.map((w) => `${baseUrl}?auto=format&fit=crop&w=${w}&q=${quality} ${w}w`).join(', ');
}
