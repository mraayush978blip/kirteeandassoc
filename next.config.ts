import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

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
    ],
    formats: ['image/avif', 'image/webp'],
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

// Payload CMS requires a running PostgreSQL instance. When deployed on Vercel or statically
// without an external database, enabling withPayload causes the serverless functions to hang
// attempting to connect to 127.0.0.1:5432.
// Payload is only wrapped if ENABLE_PAYLOAD is explicitly set to 'true' AND DATABASE_URI is defined.
const isPayloadEnabled = process.env.ENABLE_PAYLOAD === 'true' && Boolean(process.env.DATABASE_URI);

let finalConfig = nextConfig;
if (isPayloadEnabled) {
  try {
    // Dynamic import to avoid bundling Payload during regular frontend builds
    const { withPayload } = require('@payloadcms/next/withPayload');
    finalConfig = withPayload(nextConfig);
  } catch (error) {
    console.warn('[next.config] withPayload failed to initialize:', error);
  }
}

export default finalConfig;
