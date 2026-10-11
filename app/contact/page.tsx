import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactFaq } from '@/components/contact/ContactFaq';
import { JsonLd } from '@/components/seo/JsonLd';
import { siteConfig } from '@/config/site';
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  User,
  ShieldCheck,
  Clock,
  Sparkles,
  FileCheck,
  Compass,
  Layers,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact & Specification Consultancy | Kirtee & Associates',
  description:
    'Direct architectural collaboration with Kirtee & Associates. Contact Divvya at +91 70969 62640 for certified IES photometrics, bespoke luminaire commissions, and commercial project tenders.',
  openGraph: {
    title: 'Contact & Specification Consultancy | Kirtee & Associates',
    description: 'Technical collaboration with Kirtee & Associates architectural lighting engineering team.',
  },
};

interface ContactPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const resolvedSearchParams = await searchParams;
  const prefilledProduct = typeof resolvedSearchParams?.product === 'string' ? resolvedSearchParams.product : '';
  const prefilledTopic = typeof resolvedSearchParams?.topic === 'string' ? resolvedSearchParams.topic : '';

  return (
    <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh' }}>
      {/* 1. Dramatic Architectural Dark Hero Header */}
      <section
        style={{
          backgroundColor: '#0c0d10',
          color: '#ffffff',
          paddingTop: 'calc(var(--header-height) + 2.5rem)',
          paddingBottom: 'clamp(4rem, 6vw, 6rem)',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Subtle Architectural Glow & Grid Lines */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle at 70% 30%, rgba(197, 168, 128, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            {/* Live Availability Status Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '999px',
                padding: '0.35rem 0.85rem',
                marginBottom: '1.5rem',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  boxShadow: '0 0 8px #10b981',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                SPECIFICATION DESK ACTIVE · LEAD: {siteConfig.contactPerson.toUpperCase()}
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.75rem, 6vw, 4.5rem)',
                fontWeight: 500,
                color: '#ffffff',
                marginBottom: '1.25rem',
                letterSpacing: '-0.02em',
                lineHeight: 1.08,
              }}
            >
              LET&apos;S ENGINEER LIGHT TOGETHER
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(1.0625rem, 1.8vw, 1.25rem)',
                lineHeight: 1.7,
                color: 'rgba(255, 255, 255, 0.75)',
                marginBottom: '2.5rem',
                fontWeight: 300,
                maxWidth: '680px',
              }}
            >
              Direct technical collaboration for architects, interior designers, and commercial consultants.
              Bespoke luminaire adaptations, certified IES photometrics, and comprehensive project tenders.
            </p>

            {/* 4 Guarantees Badges Strip */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: '2rem',
              }}
            >
              {[
                { icon: <Clock size={16} color="#c5a880" />, label: '4-HOUR RESPONSE', desc: 'Direct review by Divvya' },
                { icon: <FileCheck size={16} color="#c5a880" />, label: 'IES & BIM DATA', desc: 'DIALux & Relux verified' },
                { icon: <Sparkles size={16} color="#c5a880" />, label: '14-DAY MOCKUPS', desc: 'Physical CNC prototypes' },
                { icon: <ShieldCheck size={16} color="#c5a880" />, label: 'CERTIFIED QUALITY', desc: 'IP68 & Low Glare UGR<10' },
              ].map((g, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <div style={{ marginTop: '0.15rem' }}>{g.icon}</div>
                  <div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        color: '#ffffff',
                        display: 'block',
                      }}
                    >
                      {g.label}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>{g.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Two-Column Layout */}
      <section style={{ paddingTop: 'clamp(3.5rem, 6vw, 5.5rem)', paddingBottom: 'clamp(4rem, 6vw, 6.5rem)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: 'clamp(2.5rem, 5vw, 4.5rem)',
              alignItems: 'start',
            }}
          >
            {/* Left Column: Executive Contact Profile, Studio Card & FAQ */}
            <div style={{ gridColumn: 'span 12' }} className="lg:col-span-5">
              {/* Executive Profile Card: Divvya */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '16px',
                  padding: 'clamp(1.75rem, 3vw, 2.25rem)',
                  boxShadow: '0 8px 30px -4px rgba(0, 0, 0, 0.05)',
                  marginBottom: '2rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  {/* Avatar / Monogram */}
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: '#111111',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.5rem',
                      fontWeight: 600,
                      flexShrink: 0,
                      border: '2px solid #c5a880',
                    }}
                  >
                    D
                  </div>
                  <div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#c5a880',
                        display: 'block',
                      }}
                    >
                      HEAD OF ARCHITECTURAL SPECIFICATION
                    </span>
                    <h2
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        color: '#111111',
                        margin: '0.15rem 0',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {siteConfig.contactPerson}
                    </h2>
                    <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                      Senior Commercial Specification Lead
                    </span>
                  </div>
                </div>

                <p
                  style={{
                    fontSize: '0.875rem',
                    lineHeight: 1.65,
                    color: '#4b5563',
                    marginBottom: '1.5rem',
                    borderBottom: '1px solid #f3f4f6',
                    paddingBottom: '1.25rem',
                  }}
                >
                  Direct point of contact for architectural practices, specifiers, and tender teams. Reach out directly for
                  photometric distribution calculations, custom finishes, or on-site mockups.
                </p>

                {/* Direct Action Channels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {/* WhatsApp Direct Chat Trigger */}
                  <a
                    href={`https://wa.me/91${siteConfig.phone}?text=Hello%20Divvya,%20I%20would%20like%20to%20discuss%20an%20architectural%20lighting%20specification`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.875rem 1.15rem',
                      backgroundColor: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: '#065f46',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <MessageCircle size={18} color="#059669" />
                      <div>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'block' }}>
                          WhatsApp Direct Chat
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#047857' }}>
                          Instant mobile correspondence
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={15} color="#059669" />
                  </a>

                  {/* Direct Phone Call */}
                  <a
                    href={`tel:${siteConfig.phone}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.875rem 1.15rem',
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: '#111111',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Phone size={18} color="#111111" />
                      <div>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'block' }}>
                          Direct Telephone
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#4b5563', fontFamily: 'var(--font-mono)' }}>
                          {siteConfig.formattedPhone} ({siteConfig.phone})
                        </span>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        backgroundColor: '#ffffff',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      CALL
                    </span>
                  </a>

                  {/* Direct Email */}
                  <a
                    href={`mailto:${siteConfig.email}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.875rem 1.15rem',
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: '#111111',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Mail size={18} color="#111111" />
                      <div>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'block' }}>
                          Specification Email
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#4b5563', fontFamily: 'var(--font-mono)' }}>
                          {siteConfig.email}
                        </span>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        backgroundColor: '#ffffff',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      WRITE
                    </span>
                  </a>
                </div>

                {/* Working Hours */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginTop: '1.25rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #f3f4f6',
                    fontSize: '0.75rem',
                    color: '#6b7280',
                  }}
                >
                  <Clock size={14} />
                  <span>{siteConfig.hours}</span>
                </div>
              </div>

              {/* Physical Demonstration Studio & Lighting Lab Card */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 30px -4px rgba(0, 0, 0, 0.05)',
                  marginBottom: '2rem',
                }}
              >
                {/* Visual Architectural Lab Image */}
                <div style={{ position: 'relative', width: '100%', height: '200px', backgroundColor: '#07080a' }}>
                  <Image
                    src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
                    alt="Kirtee and Associates architectural lighting laboratory and demonstration studio"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    style={{ objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 40%, rgba(12, 13, 16, 0.85) 100%)',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '1rem',
                      left: '1.25rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#ffffff',
                      backgroundColor: 'rgba(0, 0, 0, 0.75)',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '3px',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    DEMONSTRATION STUDIO &amp; LAB
                  </span>
                </div>

                <div style={{ padding: 'clamp(1.5rem, 3vw, 2rem)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
                    <MapPin size={18} color="#111111" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                    <div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: '#111111',
                          margin: 0,
                          marginBottom: '0.25rem',
                        }}
                      >
                        Kirtee &amp; Associates Architectural Studio
                      </h3>
                      <p style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.5, margin: 0 }}>
                        Polígono Industrial &amp; Demonstration Studio Space
                      </p>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: '#4b5563', lineHeight: 1.6, margin: 0, marginBottom: '1.25rem' }}>
                    Experience full-scale architectural cove reveals, UGR &lt; 10 glare assessments, and physical material
                    patina samples in person. Available by appointment for project specification teams.
                  </p>

                  <a
                    href={`mailto:${siteConfig.email}?subject=Studio%20Visit%20and%20Photometric%20Demonstration%20Appointment`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#111111',
                      borderBottom: '1px solid #111111',
                      paddingBottom: '0.25rem',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Schedule Studio Demonstration</span>
                    <ArrowRight size={13} />
                  </a>
                </div>
              </div>

              {/* Interactive Specification FAQ Component */}
              <ContactFaq />
            </div>

            {/* Right Column: Upgraded Architectural Contact Form */}
            <div style={{ gridColumn: 'span 12' }} className="lg:col-span-7">
              <ContactForm initialProduct={prefilledProduct} initialTopic={prefilledTopic} />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Architectural Engineering Pillars Strip */}
      <section
        style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e5e7eb',
          paddingTop: 'clamp(4rem, 6vw, 6rem)',
          paddingBottom: 'clamp(4rem, 6vw, 6rem)',
        }}
      >
        <div className="container">
          <div style={{ marginBottom: 'clamp(2.5rem, 4vw, 3.5rem)', textAlign: 'center' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#6b7280',
                display: 'block',
                marginBottom: '0.75rem',
              }}
            >
              TECHNICAL CAPABILITY
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 500,
                color: '#111111',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              THE SPECIFIER&apos;S ASSURANCE
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'clamp(1.5rem, 3vw, 2.5rem)',
            }}
          >
            {[
              {
                num: '01',
                title: 'GONIOPHOTOMETRIC LABORATORY',
                desc: 'Every luminaire is tested with high-precision goniometers to deliver certified luminous intensity distribution files for DIALux, Relux, and BIM calculations.',
              },
              {
                num: '02',
                title: 'METALLURGICAL CNC WORKSHOP',
                desc: 'Aeronautical grade 6063-T6 billet turning with sub-millimeter tolerances, customized mounting plates, and saltwater corrosion immersion passivation.',
              },
              {
                num: '03',
                title: 'ON-SITE AIMING & LUX AUDITS',
                desc: 'Our specification team provides ongoing support through prototype reviews, architectural mockups, and on-site optical aiming verification upon project commissioning.',
              },
            ].map((pillar) => (
              <div
                key={pillar.num}
                style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '2rem',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: '#c5a880',
                    display: 'block',
                    marginBottom: '1rem',
                  }}
                >
                  {pillar.num}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#111111',
                    marginBottom: '0.75rem',
                  }}
                >
                  {pillar.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.65, margin: 0 }}>
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Chat Widget Button */}
      <a
        href={`https://wa.me/91${siteConfig.phone}?text=Hello%20Divvya,%20I%20have%20an%20architectural%20lighting%20specification%20inquiry`}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-chat-btn"
        aria-label="Direct WhatsApp Consultation with Divvya"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#10b981',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
          zIndex: 90,
          border: 'none',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
      >
        <MessageCircle size={24} />
      </a>

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
