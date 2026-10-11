import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactFaq } from '@/components/contact/ContactFaq';
import { JsonLd } from '@/components/seo/JsonLd';
import { siteConfig } from '@/config/site';
import { Phone, Mail, MapPin, Clock, MessageSquare, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact & Specification | Kirtee & Associates',
  description:
    'Direct architectural collaboration with Kirtee & Associates. Contact Divvya at +91 70969 62640 for certified IES photometrics, bespoke luminaire commissions, and commercial project tenders.',
  openGraph: {
    title: 'Contact & Specification | Kirtee & Associates',
    description: 'Technical collaboration with Kirtee & Associates architectural lighting engineering team.',
  },
};

export default function ContactPage() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {/* Editorial Header */}
      <section
        style={{
          borderBottom: '1px solid #e5e7eb',
          paddingTop: 'calc(var(--header-height) + 3rem)',
          paddingBottom: 'clamp(3rem, 5vw, 4.5rem)',
          backgroundColor: '#fafafa',
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '860px' }}>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#6b7280',
                display: 'block',
                marginBottom: '1rem',
              }}
            >
              KIRTEE &amp; ASSOCIATES · ARCHITECTURAL STUDIO
            </span>

            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 500,
                color: '#111111',
                marginBottom: '1.25rem',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                textTransform: 'uppercase',
              }}
            >
              Specification &amp; Inquiries
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 1.6vw, 1.125rem)',
                lineHeight: 1.7,
                color: '#4b5563',
                margin: 0,
                fontWeight: 300,
                maxWidth: '720px',
              }}
            >
              Direct technical collaboration for architects, interior designers, and lighting consultants.
              Access certified IES/LDT photometric files, bespoke luminaire engineering, and project schedules.
            </p>
          </div>
        </div>
      </section>

      {/* Main 2-Column Responsive Section */}
      <section style={{ paddingTop: 'clamp(3rem, 5vw, 5rem)', paddingBottom: 'clamp(4rem, 6vw, 6rem)' }}>
        <div className="container">
          <div className="contact-layout-grid">
            {/* Left Column: Direct Studio Channels & Technical Information */}
            <div>
              {/* Specification Desk Card */}
              <div
                style={{
                  borderBottom: '1px solid #e5e7eb',
                  paddingBottom: '2.5rem',
                  marginBottom: '2.5rem',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#6b7280',
                    display: 'block',
                    marginBottom: '0.5rem',
                  }}
                >
                  Direct Specification Lead
                </span>

                <h2
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.625rem',
                    fontWeight: 500,
                    color: '#111111',
                    margin: 0,
                    marginBottom: '0.25rem',
                  }}
                >
                  {siteConfig.contactPerson}
                </h2>

                <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5, margin: 0, marginBottom: '1.75rem' }}>
                  Head of Architectural Specification &amp; Project Consultancy
                </p>

                {/* Direct Contact Channels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* Telephone */}
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="contact-channel-item"
                    aria-label={`Call ${siteConfig.contactPerson} at ${siteConfig.formattedPhone}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Phone size={16} color="#111111" />
                      <div>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', color: '#111111' }}>
                          Direct Telephone
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {siteConfig.formattedPhone} ({siteConfig.phone})
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={14} color="#6b7280" />
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="contact-channel-item"
                    aria-label={`Email specification desk at ${siteConfig.email}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Mail size={16} color="#111111" />
                      <div>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', color: '#111111' }}>
                          Specification Email
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {siteConfig.email}
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={14} color="#6b7280" />
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/91${siteConfig.phone}?text=Hello%20Divvya,%20I%20would%20like%20to%20discuss%20an%20architectural%20lighting%20specification`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-channel-item"
                    aria-label="Direct WhatsApp message to Divvya"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <MessageSquare size={16} color="#111111" />
                      <div>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', color: '#111111' }}>
                          WhatsApp Correspondence
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          Instant mobile specification exchange
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={14} color="#6b7280" />
                  </a>
                </div>

                {/* Operating Hours */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginTop: '1.25rem',
                    fontSize: '0.75rem',
                    color: '#6b7280',
                  }}
                >
                  <Clock size={14} />
                  <span>{siteConfig.hours}</span>
                </div>
              </div>

              {/* Demonstration Studio & Lab */}
              <div
                style={{
                  borderBottom: '1px solid #e5e7eb',
                  paddingBottom: '2.5rem',
                  marginBottom: '2.5rem',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#6b7280',
                    display: 'block',
                    marginBottom: '0.5rem',
                  }}
                >
                  Studio &amp; Demonstration Space
                </span>

                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    color: '#111111',
                    margin: 0,
                    marginBottom: '0.5rem',
                  }}
                >
                  Kirtee &amp; Associates Architectural Studio
                </h3>

                <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.65, margin: 0, marginBottom: '1.25rem' }}>
                  Architects, interior studios, and lighting specifiers are welcome to experience
                  full-scale optical reveals, UGR &lt; 10 glare assessments, and physical material finishes in person.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#6b7280' }}>
                  <MapPin size={15} color="#111111" />
                  <span>Studio visits and photometric demonstrations arranged by appointment.</span>
                </div>
              </div>

              {/* Minimalist Architectural FAQ Component */}
              <ContactFaq />
            </div>

            {/* Right Column: Specification Form */}
            <div>
              <Suspense
                fallback={
                  <div
                    className="contact-card"
                    style={{ minHeight: '520px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Loading specification form...</span>
                  </div>
                }
              >
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      <JsonLd
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Contact & Specification', url: `${siteConfig.url}/contact` },
        ]}
      />
    </div>
  );
}
