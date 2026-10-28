import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';
import { JsonLd } from '@/components/seo/JsonLd';
import { siteConfig } from '@/config/site';
import { Phone, Mail, MapPin, MessageSquare } from 'lucide-react';
import { getSetting, DEFAULT_CONTACT, ContactConfig } from '@/lib/site-settings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Contact us | Kirtee & Associates Architectural Lighting',
  description:
    'Our architectural lighting team will be delighted to assist you. If you would like more information about our products or services, please contact us.',
  openGraph: {
    title: 'Contact us | Kirtee & Associates Architectural Lighting',
    description: 'Technical and commercial architectural lighting inquiries.',
  },
};

export default async function ContactPage() {
  const contact = await getSetting<ContactConfig>('site_contact', DEFAULT_CONTACT);

  const cleanPhone = (contact.phoneNumber || '+91 70969 62640').replace(/[^0-9+]/g, '');
  const cleanWhatsapp = (contact.whatsappNumber || '+91 70969 62640').replace(/[^0-9]/g, '');
  const whatsappMsg = encodeURIComponent(
    contact.whatsappMessage ||
      'Hello Kirtee & Associates, I would like to inquire about architectural luminaire specifications for an upcoming project.'
  );

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
                  {contact.heading || 'Contact us'}
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
                  {contact.teamNotice || 'Our architectural lighting team will be delighted to assist you.'}
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
                  {contact.description ||
                    'If you would like more information about our products or services, or wish to make a technical or commercial enquiry, please contact us using the form below.'}
                </p>

                {/* Direct Contact Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Email */}
                  <a href={`mailto:${contact.inquiryEmail || 'inquiries@kirteeandassoc.com'}`} className="contact-detail-link">
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
                    <span>{contact.inquiryEmail || 'inquiries@kirteeandassoc.com'}</span>
                  </a>

                  {/* Phone */}
                  <a href={`tel:${cleanPhone}`} className="contact-detail-link">
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
                    <span>
                      {contact.contactPerson ? `${contact.contactPerson} — ` : ''}
                      {contact.phoneNumber || '+91 70969 62640'}
                    </span>
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
                        {contact.companyName || 'Kirtee & Associates Studio'}
                      </span>
                      {contact.addressLine1 && (
                        <span style={{ display: 'block', color: '#6b7280', fontSize: '0.9375rem', marginTop: '0.15rem' }}>
                          {contact.addressLine1}
                        </span>
                      )}
                      {contact.addressLine2 ? (
                        <span style={{ display: 'block', color: '#6b7280', fontSize: '0.9375rem' }}>
                          {contact.addressLine2}
                        </span>
                      ) : (
                        <span style={{ display: 'block', color: '#6b7280', fontSize: '0.9375rem' }}>
                          {contact.studioAddress}
                        </span>
                      )}
                      {contact.businessHours && (
                        <span style={{ display: 'block', color: '#9ca3af', fontSize: '0.8125rem', marginTop: '0.35rem' }}>
                          {contact.businessHours}
                        </span>
                      )}
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
        href={`https://wa.me/${cleanWhatsapp}?text=${whatsappMsg}`}
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
