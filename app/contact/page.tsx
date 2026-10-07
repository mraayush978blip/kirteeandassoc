import React from 'react';
import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';
import { JsonLd } from '@/components/seo/JsonLd';
import { siteConfig } from '@/config/site';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact us | ZENVORA',
  description:
    'Our Zenvora team will be delighted to assist you with commercial inquiries, photometric data, or technical support.',
  openGraph: {
    title: 'Contact us | ZENVORA',
    description: 'Get in touch with the Zenvora architectural lighting engineering team.',
  },
};

interface ContactPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const resolvedSearchParams = await searchParams;
  const prefilledProduct = typeof resolvedSearchParams?.product === 'string' ? resolvedSearchParams.product : '';

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        paddingTop: 'calc(var(--header-height) + 3.5rem)',
        paddingBottom: '7rem',
      }}
    >
      <div className="container">
        {/* Onok Lighting Two-Column Layout (PDF Page 4) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 'clamp(2.5rem, 6vw, 5.5rem)',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Contact Information */}
          <div
            style={{
              gridColumn: 'span 12',
            }}
            className="lg:col-span-5"
          >
            <h1
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(2.75rem, 5.5vw, 4rem)',
                fontWeight: 700,
                color: '#111111',
                marginBottom: '2rem',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              Contact us
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.125rem',
                lineHeight: 1.65,
                color: '#374151',
                marginBottom: '1.5rem',
                fontWeight: 400,
              }}
            >
              Our Zenvora team will be delighted to assist you.
            </p>

            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9375rem',
                lineHeight: 1.7,
                color: '#6b7280',
                marginBottom: '3rem',
              }}
            >
              If you would like more information about our products or services, or wish to make a technical or commercial
              enquiry, please contact us using the form below.
            </p>

            {/* Direct Contact Items with Icons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#111111',
                  }}
                >
                  <Mail size={16} />
                </div>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="contact-link"
                  style={{
                    fontSize: '0.9375rem',
                    color: '#111111',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  {siteConfig.email}
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#111111',
                  }}
                >
                  <Phone size={16} />
                </div>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="contact-link"
                  style={{
                    fontSize: '0.9375rem',
                    color: '#111111',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  {siteConfig.formattedPhone}
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#111111',
                    marginTop: '0.15rem',
                  }}
                >
                  <MapPin size={16} />
                </div>
                <div>
                  <p style={{ fontSize: '0.9375rem', color: '#111111', fontWeight: 600, marginBottom: '0.2rem' }}>
                    Zenvora Architectural Studio
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5 }}>
                    Polígono Industrial &amp; Demonstration Lab, 46800 Studio Space
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Card Form */}
          <div
            style={{
              gridColumn: 'span 12',
            }}
            className="lg:col-span-7"
          >
            <ContactForm initialProduct={prefilledProduct} />
          </div>
        </div>
      </div>

      {/* Floating Chat Widget Button (Bottom Right icon in Page 4) */}
      <a
        href={`mailto:${siteConfig.email}?subject=Live%20Inquiry`}
        className="floating-chat-btn"
        aria-label="Direct Chat or Inquiry"
      >
        <MessageSquare size={22} />
      </a>

      <JsonLd
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Contact', url: `${siteConfig.url}/contact` },
        ]}
      />
    </div>
  );
}
