'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { defaultNavigation } from '@/config/site';
import { Menu, X, ArrowUpRight } from 'lucide-react';

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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0a0b0d]/95 backdrop-blur-md border-b border-white/10 shadow-lg py-4'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-6'
        }`}
        style={{
          backgroundColor: isScrolled ? 'rgba(10, 11, 13, 0.95)' : 'transparent',
          borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Brand Logo / Monogram */}
          <Link
            href="/"
            aria-label="Kirtee & Associates Homepage"
            style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none' }}
          >
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                color: 'var(--color-text-primary)',
                textTransform: 'uppercase',
              }}
            >
              Kirtee &amp; Associates
            </span>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.625rem',
                fontWeight: 500,
                letterSpacing: '0.24em',
                color: 'var(--color-accent)',
                textTransform: 'uppercase',
                marginTop: '1px',
              }}
            >
              Architectural Luminaires
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main Navigation"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2.25rem',
            }}
            className="desktop-nav"
          >
            {defaultNavigation.links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    transition: 'color var(--transition-fast)',
                    position: 'relative',
                    padding: '0.25rem 0',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)')
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTA & Mobile Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link
              href="/contact"
              className="btn btn-primary desktop-cta"
              style={{
                padding: '0.625rem 1.25rem',
                fontSize: '0.75rem',
              }}
            >
              Consultation
              <ArrowUpRight size={14} />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="mobile-toggle"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                background: 'none',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'var(--color-text-primary)',
                padding: '0.5rem',
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer',
                display: 'none',
              }}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Drawer"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 49,
            backgroundColor: 'var(--color-bg-primary)',
            paddingTop: '6rem',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingBottom: '2.5rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <span className="eyebrow">Navigation</span>
            {defaultNavigation.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.5rem',
                  letterSpacing: '0.04em',
                  color: 'var(--color-text-primary)',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  paddingBottom: '0.75rem',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link
              href="/contact"
              className="btn btn-primary"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ width: '100%' }}
            >
              Contact Specification Team
              <ArrowUpRight size={16} />
            </Link>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
              Direct: +91 70969 62640 (Divvya)
            </p>
          </div>
        </div>
      )}
    </>
  );
};
