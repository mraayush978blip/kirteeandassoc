import React from 'react';
import Link from 'next/link';
import { CtaSectionData } from '@/types/cms';
import { ArrowUpRight } from 'lucide-react';

export interface CtaSectionProps {
  data: CtaSectionData;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ data }) => {
  return (
    <section
      className="section-spacing"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle radial architectural spotlight effect */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(197, 168, 128, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container-editorial" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--font-size-h2)',
            lineHeight: '1.2',
            marginBottom: '1.25rem',
            maxWidth: '820px',
            marginLeft: 'auto',
            marginRight: 'auxto',
          }}
        >
          {data.heading}
        </h2>
        <p
          style={{
            fontSize: '1.125rem',
            lineHeight: '1.7',
            color: 'var(--color-text-secondary)',
            marginBottom: '2.5rem',
            maxWidth: '650px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {data.description}
        </p>

        <Link href={data.buttonHref} className="btn btn-primary" style={{ padding: '1rem 2.25rem' }}>
          <span>{data.buttonText}</span>
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  );
};
