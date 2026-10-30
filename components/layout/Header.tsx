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
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          // Hysteresis prevents fluttering near threshold
          if (y > 35) {
            setIsScrolled(true);
          } else if (y < 12) {
            setIsScrolled(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAdminRoute]);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProductsDropdownOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isMobileMenuOpen]);

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
            ? isScrolled
              ? 'rgba(255, 255, 255, 0.94)'
              : 'rgba(255, 255, 255, 0.98)'
            : 'rgba(10, 10, 9, 0.96)',
          borderBottom: isLightHeader
            ? isScrolled
              ? '1px solid #e5e7eb'
              : '1px solid #f0f0f2'
            : isScrolled
            ? '1px solid #302F2B'
            : '1px solid rgba(48, 47, 43, 0.6)',
          boxShadow: isScrolled ? '0 8px 24px -6px rgba(0, 0, 0, 0.05)' : 'none',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          height: 'var(--header-height, 72px)',
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '100%',
            paddingLeft: 'clamp(1rem, 2.5vw, 3rem)',
            paddingRight: 'clamp(1rem, 2.5vw, 3rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            boxSizing: 'border-box',
          }}
        >
          {/* Brand Logo: ZENVORA (Left Column, flex 1) */}
          <div style={{ flex: '1 0 0', display: 'flex', alignItems: 'center', minWidth: 0 }}>
            <Link
              href="/"
              aria-label="ZENVORA Architectural Lighting"
              style={{ display: 'inline-flex', flexDirection: 'column', textDecoration: 'none' }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(1.15rem, 3.8vw, 1.35rem)',
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
          </div>

          {/* Center Navigation Links: HOME, DRY GOODS, WET GOODS, CONTACT */}
          <nav
            aria-label="Main Navigation"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(1.5rem, 2.5vw, 2.75rem)',
              flexShrink: 0,
            }}
            className="desktop-nav"
          >
            {/* 1. HOME */}
            <Link
              href="/"
              style={{
                position: 'relative',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: pathname === '/' ? 700 : 500,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: isLightHeader
                  ? pathname === '/' ? '#111827' : '#4b5563'
                  : pathname === '/' ? '#E9E6DE' : '#96938C',
                transition: 'color 0.2s ease',
                textDecoration: 'none',
                padding: '0.4rem 0',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = isLightHeader ? '#111827' : '#E9E6DE')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = isLightHeader
                  ? pathname === '/' ? '#111827' : '#4b5563'
                  : pathname === '/' ? '#E9E6DE' : '#96938C')
              }
            >
              <span>HOME</span>
              {pathname === '/' && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: isLightHeader ? '#111827' : '#E9E6DE',
                    borderRadius: '1px',
                  }}
                />
              )}
            </Link>

            {/* 2. DRY GOODS */}
            <Link
              href="/dry-goods"
              style={{
                position: 'relative',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: pathname === '/dry-goods' ? 700 : 500,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: isLightHeader
                  ? pathname === '/dry-goods' ? '#111827' : '#4b5563'
                  : pathname === '/dry-goods' ? '#E9E6DE' : '#96938C',
                transition: 'color 0.2s ease',
                textDecoration: 'none',
                padding: '0.4rem 0',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = isLightHeader ? '#111827' : '#E9E6DE')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = isLightHeader
                  ? pathname === '/dry-goods' ? '#111827' : '#4b5563'
                  : pathname === '/dry-goods' ? '#E9E6DE' : '#96938C')
              }
            >
              <span>DRY GOODS</span>
              {pathname === '/dry-goods' && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: isLightHeader ? '#111827' : '#E9E6DE',
                    borderRadius: '1px',
                  }}
                />
              )}
            </Link>

            {/* 3. WET GOODS */}
            <Link
              href="/wet-goods"
              style={{
                position: 'relative',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: pathname === '/wet-goods' ? 700 : 500,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: isLightHeader
                  ? pathname === '/wet-goods' ? '#111827' : '#4b5563'
                  : pathname === '/wet-goods' ? '#E9E6DE' : '#96938C',
                transition: 'color 0.2s ease',
                textDecoration: 'none',
                padding: '0.4rem 0',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = isLightHeader ? '#111827' : '#E9E6DE')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = isLightHeader
                  ? pathname === '/wet-goods' ? '#111827' : '#4b5563'
                  : pathname === '/wet-goods' ? '#E9E6DE' : '#96938C')
              }
            >
              <span>WET GOODS</span>
              {pathname === '/wet-goods' && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: isLightHeader ? '#111827' : '#E9E6DE',
                    borderRadius: '1px',
                  }}
                />
              )}
            </Link>

            {/* 4. CONTACT */}
            <Link
              href="/contact"
              style={{
                position: 'relative',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: pathname === '/contact' ? 700 : 500,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: isLightHeader
                  ? pathname === '/contact' ? '#111827' : '#4b5563'
                  : pathname === '/contact' ? '#E9E6DE' : '#96938C',
                transition: 'color 0.2s ease',
                textDecoration: 'none',
                padding: '0.4rem 0',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = isLightHeader ? '#111827' : '#E9E6DE')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = isLightHeader
                  ? pathname === '/contact' ? '#111827' : '#4b5563'
                  : pathname === '/contact' ? '#E9E6DE' : '#96938C')
              }
            >
              <span>CONTACT</span>
              {pathname === '/contact' && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: isLightHeader ? '#111827' : '#E9E6DE',
                    borderRadius: '1px',
                  }}
                />
              )}
            </Link>
          </nav>

          {/* Right Action: Desktop Inquiries CTA (Aligned to Far Right Hand Side) */}
          <div
            className="desktop-cta"
            style={{
              flex: '1 0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Link
              href="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 1.15rem',
                backgroundColor: isLightHeader ? '#111827' : '#ffffff',
                color: isLightHeader ? '#ffffff' : '#0a0a09',
                borderRadius: '9999px',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isLightHeader ? '#374151' : 'var(--color-accent)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isLightHeader ? '#111827' : '#ffffff';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Enquire</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* Mobile Right Action Area: Hamburger Toggle */}
          <div style={{ display: 'flex', alignItems: 'center' }}>

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
                borderRadius: '8px',
                color: isLightHeader ? '#111827' : '#ffffff',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                width: '42px',
                height: '42px',
                minWidth: '42px',
                minHeight: '42px',
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
            backgroundColor: 'rgba(12, 13, 16, 0.98)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
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
                width: '44px',
                height: '44px',
                minWidth: '44px',
                minHeight: '44px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
            >
              <X size={20} />
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
            {/* Direct Studio Call & Consultation (Priority #1 on Mobile Drawer) */}
            {contact.phoneNumber && (
              <div
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      color: 'rgba(255, 255, 255, 0.55)',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      marginBottom: '2px',
                    }}
                  >
                    Direct Consultation
                  </span>
                  <a
                    href={`tel:${contact.phoneNumber.replace(/[^0-9+]/g, '')}`}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      textDecoration: 'none',
                      letterSpacing: '0.04em',
                      display: 'block',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {contact.phoneNumber}
                  </a>
                </div>

                <a
                  href={`tel:${contact.phoneNumber.replace(/[^0-9+]/g, '')}`}
                  aria-label="Call Studio Now"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--color-accent, #c9a96e)',
                    color: '#0a0a09',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    flexShrink: 0,
                  }}
                >
                  <Phone size={11} strokeWidth={2.4} />
                  <span>Call</span>
                </a>
              </div>
            )}

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
                padding: '0.85rem 1.25rem',
                backgroundColor: '#ffffff',
                color: '#0c0d10',
                borderRadius: '9999px',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
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
