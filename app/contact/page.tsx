import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';
import { JsonLd } from '@/components/seo/JsonLd';
import { siteConfig } from '@/config/site';
import { Phone, Mail, MapPin, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact us | Onok Lighting & Kirtee Associates',
  description:
    'Our lighting team will be delighted to assist you. If you would like more information about our products or services, please contact us.',
  openGraph: {
    title: 'Contact us | Onok Lighting & Kirtee Associates',
    description: 'Technical and commercial architectural lighting inquiries.',
  },
};

export default function ContactPage() {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <main
        style={{
          paddingTop: 'calc(var(--header-height) + clamp(2.5rem, 4.5vh, 4.5rem))',
          paddingBottom: 'clamp(4rem, 6vh, 6.5rem)',
        }}
      >
        <div className="container" style={{ maxWidth: '1440px', paddingLeft: 'clamp(1.5rem, 4vw, 4rem)', paddingRight: 'clamp(1.5rem, 4vw, 4rem)' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: 'clamp(3rem, 6vw, 6.5rem)',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Contact Us Text & Info */}
            <div style={{ gridColumn: 'span 12' }} className="lg:col-span-6">
              <div style={{ maxWidth: '580px' }}>
                <h1
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(3.25rem, 5.5vw, 4.75rem)',
                    fontWeight: 600,
                    color: '#111827',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.06,
                    marginBottom: '1.5rem',
                  }}
                >
                  Contact us
                </h1>

                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(1.1875rem, 1.8vw, 1.35rem)',
                    color: '#1f2937',
                    lineHeight: 1.5,
                    marginBottom: '1.25rem',
                    fontWeight: 500,
                  }}
                >
                  Our Onok Lighting team will be delighted to assist you.
                </p>

                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(1rem, 1.3vw, 1.125rem)',
                    color: '#4b5563',
                    lineHeight: 1.7,
                    marginBottom: 'clamp(2.5rem, 4vw, 3.5rem)',
                    fontWeight: 400,
                  }}
                >
                  If you would like more information about our products or services, or wish to make a technical or commercial enquiry, please contact us using the form below.
                </p>

                {/* Direct Contact Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Email */}
                  <a href="mailto:onok@onok.es" className="contact-detail-link">
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        backgroundColor: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Mail size={20} style={{ color: '#111827' }} />
                    </div>
                    <span>onok@onok.es</span>
                  </a>

                  {/* Phone */}
                  <a href="tel:+34962259020" className="contact-detail-link">
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        backgroundColor: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Phone size={20} style={{ color: '#111827' }} />
                    </div>
                    <span>+34 962259020</span>
                  </a>

                  {/* Address */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1.15rem',
                      color: '#4b5563',
                      fontSize: '1.0625rem',
                      lineHeight: 1.55,
                    }}
                  >
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        backgroundColor: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      <MapPin size={20} style={{ color: '#111827' }} />
                    </div>
                    <div>
                      <span style={{ display: 'block', fontWeight: 600, color: '#111827', fontSize: '1.0625rem' }}>
                        Onok Luz Técnica, S.L
                      </span>
                      <span style={{ display: 'block', color: '#6b7280', fontSize: '0.9375rem', marginTop: '0.15rem' }}>
                        Polígono industrial B, Parcela 3
                      </span>
                      <span style={{ display: 'block', color: '#6b7280', fontSize: '0.9375rem' }}>
                        46800 Xàtiva, España
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Pill-Shaped Rounded Card Form */}
            <div style={{ gridColumn: 'span 12' }} className="lg:col-span-6">
              <Suspense
                fallback={
                  <div
                    style={{
                      minHeight: '480px',
                      backgroundColor: '#ffffff',
                      borderRadius: '24px',
                      border: '1px solid #eef0f2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Loading form...</span>
                  </div>
                }
              >
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Chat Bubble (Bottom Right) */}
      <a
        href="https://wa.me/34962259020?text=Hello%20Onok%20Lighting,%20I%20would%20like%20to%20make%20an%20enquiry"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open chat message"
        className="floating-chat-bubble"
      >
        <MessageSquare size={20} />
      </a>

      <JsonLd
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Contact us', url: `${siteConfig.url}/contact` },
        ]}
      />
    </div>
  );
}
