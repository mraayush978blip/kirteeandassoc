'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Phone, ArrowUpRight, ChevronDown } from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  const isAdminRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/ad');

  useEffect(() => {
    if (isAdminRoute) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAdminRoute]);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProductsDropdownOpen(false);
  }, [pathname]);

  // Click outside to close dropdown
  useEffect(() => {
    if (isAdminRoute) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(e.target as Node)
      ) {
        setIsProductsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAdminRoute]);

  const [contact, setContact] = useState({
    phoneNumber: '+91 70969 62640',
    contactPerson: 'Divvya',
    inquiryEmail: 'inquiries@kirteeandassoc.com',
  });

  useEffect(() => {
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

  const handleMouseEnterProducts = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsProductsDropdownOpen(true);
  };

  const handleMouseLeaveProducts = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsProductsDropdownOpen(false);
    }, 150);
  };

  // Eliminate duplicate header on admin routes (called after all hooks to satisfy React Rules of Hooks)
  if (isAdminRoute) {
    return null;
  }

  const isProductsActive =
    pathname.startsWith('/products') || pathname === '/dry-goods' || pathname === '/wet-goods';
  const isLightHeader = !pathname.startsWith('/admin') && !pathname.startsWith('/ad');

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: isLightHeader
            ? isScrolled ? 'rgba(255, 255, 255, 0.98)' : '#ffffff'
            : 'rgba(10, 10, 9, 0.96)',
          borderBottom: isLightHeader
            ? '1px solid #f0f0f2'
            : isScrolled
            ? '1px solid #302F2B'
            : '1px solid rgba(48, 47, 43, 0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          transition: 'padding 0.3s ease, border-color 0.3s ease, background-color 0.3s ease',
          paddingTop: isScrolled ? '0.85rem' : '1.15rem',
          paddingBottom: isScrolled ? '0.85rem' : '1.15rem',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          {/* Brand Logo: ZENVORA */}
          <Link
            href="/"
            aria-label="ZENVORA Architectural Lighting"
            style={{ display: 'inline-flex', flexDirection: 'column', textDecoration: 'none' }}
          >
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(1.1rem, 3.8vw, 1.35rem)',
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: isLightHeader ? '#111827' : '#E9E6DE',
                textTransform: 'uppercase',
                lineHeight: 1.1,
              }}
            >
              ZENVORA
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(0.48rem, 1.8vw, 0.5625rem)',
                fontWeight: 500,
                letterSpacing: '0.22em',
                color: isLightHeader ? '#6b7280' : '#96938C',
                textTransform: 'uppercase',
                marginTop: '2px',
              }}
            >
              ARCHITECTURAL LIGHTING
            </span>
          </Link>

          {/* Center Navigation Links: HOME, DRY GOODS, WET GOODS, CONTACT */}
          <nav
            aria-label="Main Navigation"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(1.5rem, 3vw, 2.75rem)',
            }}
            className="desktop-nav"
          >
            {/* 1. HOME */}
            <Link
              href="/"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: isLightHeader
                  ? pathname === '/' ? '#111827' : '#4b5563'
                  : pathname === '/' ? '#E9E6DE' : '#96938C',
                transition: 'color 0.2s ease',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = isLightHeader ? '#111827' : '#E9E6DE')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = isLightHeader
                  ? pathname === '/' ? '#111827' : '#4b5563'
                  : pathname === '/' ? '#E9E6DE' : '#96938C')
              }
            >
              HOME
            </Link>

            {/* 2. DRY GOODS */}
            <Link
              href="/dry-goods"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: isLightHeader
                  ? pathname === '/dry-goods' ? '#111827' : '#4b5563'
                  : pathname === '/dry-goods' ? '#E9E6DE' : '#96938C',
                transition: 'color 0.2s ease',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = isLightHeader ? '#111827' : '#E9E6DE')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = isLightHeader
                  ? pathname === '/dry-goods' ? '#111827' : '#4b5563'
                  : pathname === '/dry-goods' ? '#E9E6DE' : '#96938C')
              }
            >
              DRY GOODS
            </Link>

            {/* 3. WET GOODS */}
            <Link
              href="/wet-goods"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: isLightHeader
                  ? pathname === '/wet-goods' ? '#111827' : '#4b5563'
                  : pathname === '/wet-goods' ? '#E9E6DE' : '#96938C',
                transition: 'color 0.2s ease',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = isLightHeader ? '#111827' : '#E9E6DE')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = isLightHeader
                  ? pathname === '/wet-goods' ? '#111827' : '#4b5563'
                  : pathname === '/wet-goods' ? '#E9E6DE' : '#96938C')
              }
            >
              WET GOODS
            </Link>

            {/* 3. CONTACT */}
            <Link
              href="/contact"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: isLightHeader
                  ? pathname === '/contact' ? '#111827' : '#4b5563'
                  : pathname === '/contact' ? '#E9E6DE' : '#96938C',
                transition: 'color 0.2s ease',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = isLightHeader ? '#111827' : '#E9E6DE')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = isLightHeader
                  ? pathname === '/contact' ? '#111827' : '#4b5563'
                  : pathname === '/contact' ? '#E9E6DE' : '#96938C')
              }
            >
              CONTACT
            </Link>
          </nav>

          {/* Mobile Navigation Toggle (Visible ONLY on mobile devices <=900px) */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open mobile navigation menu"
            aria-expanded={isMobileMenuOpen}
            style={{
              background: isLightHeader ? '#f3f4f6' : 'rgba(255, 255, 255, 0.06)',
              border: isLightHeader ? '1px solid #e5e7eb' : '1px solid rgba(255, 255, 255, 0.16)',
              borderRadius: '4px',
              color: isLightHeader ? '#111827' : '#ffffff',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              width: '40px',
              height: '40px',
              padding: 0,
              transition: 'background-color 0.2s ease, border-color 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '18px' }}>
              <div style={{ width: '100%', height: '1.5px', backgroundColor: isLightHeader ? '#111827' : '#ffffff', borderRadius: '1px' }} />
              <div style={{ width: '100%', height: '1.5px', backgroundColor: isLightHeader ? '#111827' : '#ffffff', borderRadius: '1px' }} />
            </div>
          </button>
        </div>
      </header>

      {/* Slide-out Menu Drawer (Mobile View - Modern Architectural Sans-Serif UI) */}
      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: '#282b32',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 'clamp(1.25rem, 4vw, 2rem)',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Drawer Top Bar: Brand & Close Button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: '#ffffff',
                  textTransform: 'uppercase',
                }}
              >
                ZENVORA
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5rem',
                  fontWeight: 500,
                  letterSpacing: '0.22em',
                  color: 'rgba(255, 255, 255, 0.55)',
                  textTransform: 'uppercase',
                  marginTop: '2px',
                }}
              >
                ARCHITECTURAL LIGHTING
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                color: '#ffffff',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Nav Links (Clean Artemide-Inspired Architectural Typography) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.75rem',
              paddingTop: '2rem',
              paddingBottom: '2.5rem',
              maxWidth: '480px',
            }}
          >
            {/* 1. HOME */}
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(1.1875rem, 4.5vw, 1.45rem)',
                fontWeight: 600,
                color: pathname === '/' ? 'var(--color-accent)' : '#ffffff',
                textDecoration: 'none',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                transition: 'color 0.2s ease',
              }}
            >
              HOME
            </Link>

            {/* 2. PRODUCTS with DRY & WET GOODS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Link
                  href="/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(1.1875rem, 4.5vw, 1.45rem)',
                    fontWeight: 600,
                    color: isProductsActive ? 'var(--color-accent)' : '#ffffff',
                    textDecoration: 'none',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                  }}
                >
                  PRODUCTS
                </Link>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.625rem',
                    letterSpacing: '0.1em',
                    color: 'rgba(255, 255, 255, 0.45)',
                    textTransform: 'uppercase',
                  }}
                >
                  CATALOGUE
                </span>
              </div>

              {/* Sub-items for Dry Goods & Wet Goods */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  paddingLeft: '1rem',
                  borderLeft: '2px solid rgba(255, 255, 255, 0.14)',
                  marginTop: '0.25rem',
                }}
              >
                <Link
                  href="/dry-goods"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color:
                        pathname === '/dry-goods'
                          ? 'var(--color-accent)'
                          : 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    DRY GOODS
                  </span>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      color: 'rgba(255, 255, 255, 0.5)',
                      marginTop: '2px',
                    }}
                  >
                    Architectural Indoor Systems
                  </span>
                </Link>

                <Link
                  href="/wet-goods"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color:
                        pathname === '/wet-goods'
                          ? 'var(--color-accent)'
                          : 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    WET GOODS
                  </span>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      color: 'rgba(255, 255, 255, 0.5)',
                      marginTop: '2px',
                    }}
                  >
                    Outdoor &amp; IP68 Submersible
                  </span>
                </Link>

                <Link
                  href="/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: 'rgba(255, 255, 255, 0.55)',
                    textDecoration: 'none',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginTop: '0.25rem',
                  }}
                >
                  View All Products Catalogue →
                </Link>
              </div>
            </div>

            {/* 3. CONTACT */}
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(1.1875rem, 4.5vw, 1.45rem)',
                fontWeight: 600,
                color: pathname === '/contact' ? 'var(--color-accent)' : '#ffffff',
                textDecoration: 'none',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                transition: 'color 0.2s ease',
              }}
            >
              CONTACT
            </Link>
          </div>

          {/* Drawer Footer: Quick Consultation CTA & Direct Contact Info */}
          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                backgroundColor: '#ffffff',
                color: '#282b32',
                borderRadius: '3px',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              <span>Schedule Consultation</span>
              <ArrowUpRight size={14} />
            </Link>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              <a
                href={`tel:${(contact.phoneNumber || '7096962640').replace(/[^0-9+]/g, '')}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                }}
              >
                <Phone size={13} style={{ color: 'var(--color-accent)' }} />
                <span>Primary Contact: {contact.contactPerson ? `${contact.contactPerson} (` : ''}{contact.phoneNumber || '+91 70969 62640'}{contact.contactPerson ? ')' : ''}</span>
              </a>

              <a
                href={`mailto:${contact.inquiryEmail || 'inquiries@kirteeandassoc.com'}`}
                style={{
                  color: 'rgba(255, 255, 255, 0.55)',
                  textDecoration: 'none',
                  paddingLeft: '1.3rem',
                }}
              >
                {contact.inquiryEmail || 'inquiries@kirteeandassoc.com'}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
