import React from 'react';
import type { Metadata } from 'next';
import { initialContactPageData } from '@/lib/data/cms';
import { siteConfig } from '@/config/site';
import { ContactForm } from '@/components/contact/ContactForm';
import { JsonLd } from '@/components/seo/JsonLd';
import { Phone, Mail, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { InstagramIcon, LinkedinIcon, YoutubeIcon } from '@/components/ui/Icons';

export const metadata: Metadata = {
  title: initialContactPageData.seo.title,
  description: initialContactPageData.seo.description,
  openGraph: {
    title: initialContactPageData.seo.title,
    description: initialContactPageData.seo.description,
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
        paddingTop: 'calc(var(--header-height) + 3rem)',
        paddingBottom: '6rem',
        backgroundColor: 'var(--color-bg-primary)',
        flexGrow: 1,
      }}
    >
      <div className="container">
        {/* Page Heading */}
        <div style={{ marginBottom: '3.5rem' }}>
          <span className="eyebrow">Project Consultations</span>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--font-size-h2)',
              marginBottom: '1rem',
            }}
          >
            {initialContactPageData.heading}
          </h1>
          <p style={{ maxWidth: '680px', fontSize: '1.0625rem', color: 'var(--color-text-secondary)' }}>
            {initialContactPageData.subheading}
          </p>
        </div>

        {/* Split Grid: Information Column + Contact Form */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(2.5rem, 5vw, 5rem)',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Direct Studio & Person Contacts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* Primary Contact Card */}
            <div
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xs)',
                padding: '2rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: 'var(--color-accent)',
                  display: 'block',
                  marginBottom: '1rem',
                }}
              >
                Key Representative
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.5rem',
                  marginBottom: '0.5rem',
                }}
              >
                {initialContactPageData.contactDetails.primaryContactPerson}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                Senior Specification Specialist &amp; Architectural Project Coordinator
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
                <a
                  href={`tel:${siteConfig.phone}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <Phone size={16} color="var(--color-accent)" />
                  <span>Direct: {siteConfig.formattedPhone}</span>
                </a>

                <a
                  href={`mailto:${siteConfig.email}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: 'var(--color-accent)',
                  }}
                >
                  <Mail size={16} color="var(--color-accent)" />
                  <span>{siteConfig.email}</span>
                </a>
              </div>
            </div>

            {/* Studio Hours & Address */}
            <div
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xs)',
                padding: '2rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <MapPin size={18} color="var(--color-accent)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                    Design &amp; Demonstration Lab
                  </h4>
                  {initialContactPageData.contactDetails.officeAddress.map((line, idx) => (
                    <p key={idx} style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1.25rem' }}>
                <Clock size={16} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                  {initialContactPageData.contactDetails.businessHours}
                </span>
              </div>
            </div>

            {/* Social Channels */}
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: 'var(--color-text-muted)',
                  display: 'block',
                  marginBottom: '1rem',
                }}
              >
                Studio Broadcasts &amp; Media
              </span>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ padding: '0.625rem 1rem', fontSize: '0.75rem' }}
                >
                  <InstagramIcon size={14} />
                  <span>Instagram</span>
                </a>
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ padding: '0.625rem 1rem', fontSize: '0.75rem' }}
                >
                  <LinkedinIcon size={14} />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={siteConfig.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ padding: '0.625rem 1rem', fontSize: '0.75rem' }}
                >
                  <YoutubeIcon size={14} />
                  <span>YouTube</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Production-grade Contact Form */}
          <div>
            <ContactForm initialProduct={prefilledProduct} />
          </div>
        </div>
      </div>

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
