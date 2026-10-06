import React from 'react';
import Link from 'next/link';
import { defaultFooter, siteConfig } from '@/config/site';
import { ArrowUpRight } from 'lucide-react';
import { InstagramIcon, LinkedinIcon, YoutubeIcon } from '@/components/ui/Icons';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderTop: '1px solid var(--color-border)',
        paddingTop: '5rem',
        paddingBottom: '3rem',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        {/* Main Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '3rem',
            marginBottom: '4rem',
          }}
        >
          {/* Brand Column */}
          <div style={{ maxWidth: '380px' }}>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.25rem',
              }}
            >
              Kirtee &amp; Associates
            </span>
            <span
              style={{
                fontSize: '0.6875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--color-accent)',
                display: 'block',
                marginBottom: '1.25rem',
              }}
            >
              Architectural Luminaires
            </span>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              {defaultFooter.tagline}
            </p>
            <div style={{ display: 'flex', gap: '0.875rem' }}>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <LinkedinIcon size={16} />
              </a>
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <YoutubeIcon size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: 'var(--color-accent)',
                display: 'block',
                marginBottom: '1.5rem',
              }}
            >
              Architectural Systems
            </span>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {defaultFooter.quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio & Specification Contact */}
          <div>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: 'var(--color-accent)',
                display: 'block',
                marginBottom: '1.5rem',
              }}
            >
              Specification Contact
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <p style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
                Primary Contact: {siteConfig.contactPerson}
              </p>
              <a
                href={`tel:${siteConfig.phone}`}
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Direct: {siteConfig.formattedPhone}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                style={{ color: 'var(--color-accent)' }}
              >
                {siteConfig.email}
              </a>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                {defaultFooter.addressLines.join(' • ')}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
          }}
        >
          <span>{defaultFooter.copyright}</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {defaultFooter.legalLinks.map((item) => (
              <Link key={item.label} href={item.href} style={{ color: 'var(--color-text-muted)' }}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
