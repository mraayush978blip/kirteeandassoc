'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LinkedinIcon, InstagramIcon } from '@/components/ui/Icons';
import { Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const [contact, setContact] = React.useState({
    phoneNumber: '+91 70969 62640',
    contactPerson: 'Divvya',
    inquiryEmail: 'inquiries@kirteeandassoc.com',
    studioAddress: 'Kirtee & Associates Architectural Studio',
    companyName: 'Kirtee & Associates Architectural Studio',
    linkedinUrl: 'https://linkedin.com/company/kirteeandassoc',
    instagramUrl: 'https://instagram.com/kirteeandassoc',
  });

  const isAdminRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/ad');

  React.useEffect(() => {
    if (isAdminRoute) return;
    fetch('/api/content?key=contact', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setContact((prev) => ({
            ...prev,
            ...data.data,
          }));
        }
      })
      .catch(() => {});
  }, [isAdminRoute]);

  // Hide public footer on admin panel
  if (isAdminRoute) {
    return null;
  }

  return (
    <footer
      style={{
        backgroundColor: '#0a0a09',
        color: '#ffffff',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: 'clamp(4rem, 6vw, 6rem)',
        paddingBottom: '2.5rem',
      }}
    >
      <div className="container">
        {/* Top Row: Brand & Main Navigation */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 'clamp(2rem, 4vw, 3rem)',
            paddingBottom: 'clamp(2.5rem, 5vw, 4.5rem)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Brand Monogram */}
          <div style={{ maxWidth: '380px' }}>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.25rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: '#ffffff',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.4rem',
              }}
            >
              KIRTEE &amp; ASSOCIATES
            </span>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.6875rem',
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.5)',
                display: 'block',
                marginBottom: '1rem',
              }}
            >
              Architectural Lighting &amp; Bespoke Luminaires
            </span>
            <p
              style={{
                fontSize: '0.875rem',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.6)',
                margin: 0,
              }}
            >
              Precision engineered architectural lighting instruments, custom optical grazers, and bespoke luminaire design.
            </p>
          </div>

          {/* Links & Direct Contact */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'clamp(2rem, 4vw, 3.5rem)' }}>
            <nav
              aria-label="Footer Navigation"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.4)',
                  marginBottom: '0.25rem',
                }}
              >
                NAVIGATION
              </span>
              <Link
                href="/"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: 'rgba(255, 255, 255, 0.75)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)')}
              >
                HOME
              </Link>
              <Link
                href="/products"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: 'rgba(255, 255, 255, 0.75)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)')}
              >
                PRODUCTS
              </Link>
              <Link
                href="/dry-goods"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: 'rgba(255, 255, 255, 0.75)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)')}
              >
                DRY GOODS (INDOOR)
              </Link>
              <Link
                href="/wet-goods"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: 'rgba(255, 255, 255, 0.75)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)')}
              >
                WET GOODS (OUTDOOR)
              </Link>
              <Link
                href="/contact"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: 'rgba(255, 255, 255, 0.75)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)')}
              >
                CONTACT
              </Link>
            </nav>

            {/* Direct Specification & Contact Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.4)',
                  marginBottom: '0.25rem',
                }}
              >
                SPECIFICATION CONTACT
              </span>
              <a
                href={`tel:${(contact.phoneNumber || '7096962640').replace(/[^0-9+]/g, '')}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#ffffff',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
              >
                <Phone size={14} style={{ color: 'var(--color-accent)' }} />
                <span>{contact.contactPerson ? `${contact.contactPerson} — ` : ''}{contact.phoneNumber || '+91 70969 62640'}</span>
              </a>
              <a
                href={`mailto:${contact.inquiryEmail || 'inquiries@kirteeandassoc.com'}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)')}
              >
                <Mail size={14} />
                <span>{contact.inquiryEmail || 'inquiries@kirteeandassoc.com'}</span>
              </a>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  fontSize: '0.8125rem',
                  color: 'rgba(255, 255, 255, 0.55)',
                  marginTop: '0.25rem',
                  maxWidth: '260px',
                }}
              >
                <MapPin size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{contact.studioAddress || contact.companyName || 'Kirtee & Associates Architectural Studio'}</span>
              </div>

              {/* Social Icons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem' }}>
                <a
                  href={contact.linkedinUrl || 'https://linkedin.com/company/kirteeandassoc'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  style={{ color: 'rgba(255, 255, 255, 0.7)', transition: 'color 0.2s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)')}
                >
                  <LinkedinIcon size={16} />
                </a>
                <a
                  href={contact.instagramUrl || 'https://instagram.com/kirteeandassoc'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  style={{ color: 'rgba(255, 255, 255, 0.7)', transition: 'color 0.2s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)')}
                >
                  <InstagramIcon size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div
          style={{
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.45)',
          }}
        >
          <span>&copy; {currentYear} Kirtee &amp; Associates. All rights reserved.</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link
              href="/privacy"
              style={{ color: 'inherit', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.45)')}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              style={{ color: 'inherit', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.45)')}
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
