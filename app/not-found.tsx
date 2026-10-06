import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
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
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            marginBottom: '1.5rem',
            color: 'var(--color-accent)',
          }}
        >
          <Compass size={28} />
        </div>

        <span className="eyebrow">404 — Optical Disconnect</span>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--font-size-h2)',
            marginBottom: '1rem',
          }}
        >
          Architectural Surface Not Found
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
          The specified luminaire or architectural page does not exist or has been relocated to another coordinate.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link href="/" className="btn btn-primary">
            <ArrowLeft size={16} />
            <span>Return to Overview</span>
          </Link>
          <Link href="/products" className="btn btn-secondary">
            <span>Explore Catalogue</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
