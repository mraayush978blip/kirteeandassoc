'use client';

import { useState, useEffect } from 'react';

export interface SiteImageRecord {
  url: string;
  alt: string;
}

// In-memory cache for fast transitions between pages
let cachedSiteImages: Record<string, SiteImageRecord> | null = null;

export function useSiteImages() {
  const [images, setImages] = useState<Record<string, SiteImageRecord>>(cachedSiteImages || {});
  const [isLoading, setIsLoading] = useState(!cachedSiteImages);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (cachedSiteImages && Object.keys(cachedSiteImages).length > 0) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/site-images');
        const data = await res.json();
        if (data.success && data.images && isMounted) {
          cachedSiteImages = data.images;
          setImages(data.images);
        }
      } catch (err) {
        console.warn('Failed to load dynamic site images, using defaults', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const getImage = (id: string, fallbackUrl: string, fallbackAlt: string = ''): SiteImageRecord => {
    if (images[id] && images[id].url) {
      return {
        url: images[id].url,
        alt: images[id].alt || fallbackAlt,
      };
    }
    return { url: fallbackUrl, alt: fallbackAlt };
  };

  return { images, getImage, isLoading };
}
