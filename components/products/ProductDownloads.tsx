import React from 'react';
import { ProductDownload } from '@/types/product';
import { Download, FileText } from 'lucide-react';

export interface ProductDownloadsProps {
  downloads: ProductDownload[];
}

export const ProductDownloads: React.FC<ProductDownloadsProps> = ({ downloads }) => {
  if (!downloads || downloads.length === 0) {
    return (
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
        No downloadable documentation currently registered for this luminaire.
      </p>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem',
      }}
    >
      {downloads.map((item) => (
        <a
          key={item.id}
          href={item.fileUrl}
          download
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1.25rem',
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xs)',
            transition: 'border-color var(--transition-fast), transform var(--transition-fast)',
            textDecoration: 'none',
          }}
          className="download-card"
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.1em',
                  color: 'var(--color-accent)',
                  backgroundColor: 'var(--color-accent-subtle)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--color-accent-border)',
                }}
              >
                {item.fileType}
              </span>
              {item.fileSize && (
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {item.fileSize}
                </span>
              )}
            </div>

            <h5
              style={{
                fontSize: '0.9375rem',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                lineHeight: '1.4',
                marginBottom: '0.5rem',
              }}
            >
              {item.title}
            </h5>

            {item.description && (
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>
                {item.description}
              </p>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-accent)',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              borderTop: '1px solid var(--color-border-subtle)',
              paddingTop: '0.75rem',
              marginTop: 'auto',
            }}
          >
            <Download size={14} />
            <span>Download Asset</span>
          </div>
        </a>
      ))}
    </div>
  );
};
