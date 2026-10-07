'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'COLLECTIONS', href: '/products' },
    { label: 'PROJECTS', href: '/#projects' },
    { label: 'ABOUT', href: '/#difference' },
    { label: 'CONTACT', href: '/contact' },
  ];

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: isScrolled ? 'rgba(12, 13, 16, 0.94)' : 'transparent',
          borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.04)',
          backdropFilter: isScrolled ? 'blur(16px)' : 'none',
          transition: 'all 0.3s ease',
          paddingTop: isScrolled ? '1.1rem' : '1.75rem',
          paddingBottom: isScrolled ? '1.1rem' : '1.75rem',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Brand Logo: ZENVORA */}
          <Link
            href="/"
            aria-label="ZENVORA Homepage"
            style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.25rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: '#ffffff',
                textTransform: 'uppercase',
              }}
            >
              ZENVORA
            </span>
          </Link>

          {/* Center Navigation Links: COLLECTIONS | PROJECTS | ABOUT | CONTACT */}
          <nav
            aria-label="Main Navigation"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2.5rem',
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.18em',
                    color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                    transition: 'color 0.2s ease',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.75)')}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: MENU = */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.625rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.6875rem',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '0.4rem 0.6rem',
            }}
          >
            <span>MENU</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', width: '16px' }}>
              <div style={{ width: '100%', height: '1.5px', backgroundColor: '#ffffff' }} />
              <div style={{ width: '100%', height: '1.5px', backgroundColor: '#ffffff' }} />
            </div>
          </button>
        </div>
      </header>

      {/* Slide-out Menu Drawer */}
      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: '#0c0d10',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '2.5rem',
            paddingTop: '6rem',
          }}
        >
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
            style={{
              position: 'absolute',
              top: '2rem',
              right: '2.5rem',
              background: 'none',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              padding: '0.5rem',
              borderRadius: '50%',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '480px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.4)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              Navigation
            </span>

            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/dry-goods"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                fontSize: '1.125rem',
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              → Dry Goods Collection
            </Link>
            <Link
              href="/wet-goods"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                fontSize: '1.125rem',
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              → Wet Goods Collection
            </Link>
          </div>

          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '2rem',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              fontSize: '0.8125rem',
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <span>Direct Specification: +91 70969 62640</span>
            <span>inquiries@zenvora.com</span>
          </div>
        </div>
      )}
    </>
  );
};
