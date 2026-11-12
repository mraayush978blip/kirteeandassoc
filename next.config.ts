import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        // Supabase Storage public bucket (admin image uploads)
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/ad',
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

// Payload CMS is optional and disabled by default (the live app uses lib/db.ts + Supabase).
// It is only wrapped when ENABLE_PAYLOAD=true and DATABASE_URI is set.
const isPayloadEnabled = process.env.ENABLE_PAYLOAD === 'true' && Boolean(process.env.DATABASE_URI);

async function buildConfig(): Promise<NextConfig> {
  if (!isPayloadEnabled) return nextConfig;
  try {
    const { withPayload } = await import('@payloadcms/next/withPayload');
    return withPayload(nextConfig);
  } catch (error) {
    console.warn('[next.config] withPayload failed to initialize:', error);
    return nextConfig;
  }
}

export default buildConfig;
