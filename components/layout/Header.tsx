'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, ArrowUpRight } from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Eliminate duplicate header on admin routes (called after all hooks to satisfy React Rules of Hooks)
  if (isAdminRoute) {
    return null;
  }

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
          {/* Brand Logo: ZENVORA (Left Column) */}
          <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
            <Link
              href="/"
              aria-label="ZENVORA Architectural Lighting"
              style={{ display: 'inline-flex', flexDirection: 'column', textDecoration: 'none' }}
            >
              <span
                className="brand-title"
                style={{
                  fontFamily: 'var(--font-brand, var(--font-sans))',
                  fontSize: 'clamp(1.15rem, 3.8vw, 1.35rem)',
                  fontWeight: 700,
                  letterSpacing: 'var(--brand-spacing, 0.14em)',
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
                  letterSpacing: 'var(--accent-spacing, 0.22em)',
                  color: isLightHeader ? '#6b7280' : '#96938C',
                  textTransform: 'uppercase',
                  marginTop: '2px',
                }}
              >
                ARCHITECTURAL LIGHTING
              </span>
            </Link>
          </div>

          {/* Right Navigation Links: HOME, DRY GOODS, WET GOODS, CONTACT (Shifted to Right) */}
          <nav
            aria-label="Main Navigation"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 'clamp(1.5rem, 2.5vw, 2.75rem)',
              flexShrink: 0,
              marginLeft: 'auto',
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

            {/* 2. DRY GOODS */}
            <Link
              href="/dry-goods"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(1.1875rem, 4.5vw, 1.45rem)',
                fontWeight: 600,
                color: pathname === '/dry-goods' ? 'var(--color-accent)' : '#ffffff',
                textDecoration: 'none',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                transition: 'color 0.2s ease',
              }}
            >
              DRY GOODS
            </Link>

            {/* 3. WET GOODS */}
            <Link
              href="/wet-goods"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(1.1875rem, 4.5vw, 1.45rem)',
                fontWeight: 600,
                color: pathname === '/wet-goods' ? 'var(--color-accent)' : '#ffffff',
                textDecoration: 'none',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                transition: 'color 0.2s ease',
              }}
            >
              WET GOODS
            </Link>

            {/* 4. CONTACT */}
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

          {/* Drawer Footer: Get In Touch CTA */}
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
              <span>Get In Touch</span>
              <ArrowUpRight size={14} />
            </Link>


          </div>
        </div>
      )}
    </>
  );
};
