'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log sanitized error telemetry (e.g. Sentry) without exposing secrets to client DOM
    console.error('[Application Error Caught]:', error.message);
  }, [error]);

  return (
    <div
      style={{
        paddingTop: 'calc(var(--header-height) + 6rem)',
        paddingBottom: '8rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
      }}
    >
      <div className="container-editorial">
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--color-error)',
            marginBottom: '1.5rem',
            color: 'var(--color-error)',
          }}
        >
          <AlertTriangle size={28} />
        </div>

        <span className="eyebrow" style={{ color: 'var(--color-error)' }}>
          System Disruption
        </span>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--font-size-h2)',
            marginBottom: '1rem',
          }}
        >
          Temporary System Anomaly
        </h1>

        <p
          style={{
            maxWidth: '520px',
            marginLeft: 'auto',
            marginRight: 'auto',
            color: 'var(--color-text-secondary)',
            marginBottom: '2.5rem',
            fontSize: '1rem',
            lineHeight: '1.7',
          }}
        >
          A temporary runtime condition prevented this page from rendering. Our operations team has received diagnostic telemetry.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button
            type="button"
            onClick={() => reset()}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RefreshCw size={15} />
            <span>Retry Operation</span>
          </button>
          <Link href="/" className="btn btn-secondary">
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
