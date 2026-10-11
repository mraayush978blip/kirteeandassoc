'use client';

import React, { useState } from 'react';
import { Mail, Phone, CheckCircle2, AlertCircle, Sparkles, Send, MessageCircle, FileText, Building2, PackageCheck } from 'lucide-react';
import { siteConfig } from '@/config/site';

export interface ContactFormProps {
  initialProduct?: string;
  initialTopic?: string;
}

const topicChips = [
  { id: 'bespoke', label: 'Bespoke Commission', icon: <Sparkles size={13} />, defaultSubject: 'Bespoke Luminaire Engineering Inquiry' },
  { id: 'photometrics', label: 'Photometric IES / Dialux', icon: <FileText size={13} />, defaultSubject: 'Request for Certified IES & Photometric Data' },
  { id: 'commercial', label: 'Commercial Specification', icon: <Building2 size={13} />, defaultSubject: 'Commercial Architectural Lighting Specification' },
  { id: 'sample', label: 'Physical Mockup / Sample', icon: <PackageCheck size={13} />, defaultSubject: 'Sample Luminaire & Mockup Request' },
];

const sectors = [
  'Select Project Sector...',
  'High-End Residential',
  'Commercial Workplace & Corporate HQ',
  'Hospitality, Hotel & Resort',
  'Subterranean, Landscape & Pool (IP68)',
  'Cultural, Gallery & Heritage Restoration',
  'Other Architectural Inquiry',
];

export const ContactForm: React.FC<ContactFormProps> = ({ initialProduct = '', initialTopic = '' }) => {
  const [activeTopic, setActiveTopic] = useState<string>(
    initialTopic || (initialProduct ? 'bespoke' : 'commercial')
  );

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    sector: '',
    subject: initialProduct ? `Inquiry regarding ${initialProduct}` : (initialTopic || 'Commercial Architectural Lighting Specification'),
    message: initialProduct ? `Hello Divvya, I would like to receive detailed technical specifications, photometrics, and pricing for ${initialProduct}.` : '',
    consent: true,
    websiteHoneypot: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleTopicClick = (topicId: string, defaultSubj: string) => {
    setActiveTopic(topicId);
    setFormData((prev) => ({
      ...prev,
      subject: defaultSubj,
    }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please provide your full name.';
    if (!formData.email.trim()) {
      errs.email = 'Please provide your work email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.subject.trim()) errs.subject = 'Please enter a subject.';
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Please provide at least 10 characters detailing your project or enquiry.';
    }
    if (!formData.consent) {
      errs.consent = 'Please check the box to confirm specification consent.';
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (formData.websiteHoneypot) {
      setSubmitSuccess(true);
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          topic: `${formData.subject} [Sector: ${formData.sector || 'Not Specified'}]`,
          product: initialProduct,
          message: formData.message,
          consent: formData.consent,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Submission failed. Please try again.');
      }

      setSubmitSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError('A network error occurred. Please try again or contact Divvya directly via phone/WhatsApp.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div
        className="contact-card"
        style={{
          textAlign: 'center',
          padding: 'clamp(3rem, 5vw, 4.5rem) 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.08)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10b981',
          }}
        >
          <CheckCircle2 size={36} />
        </div>

        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            padding: '0.3rem 0.75rem',
            borderRadius: '999px',
          }}
        >
          SPECIFICATION TRANSMITTED
        </span>

        <h3
          style={{
            fontSize: '1.75rem',
            fontFamily: 'var(--font-serif)',
            fontWeight: 600,
            color: '#111111',
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          Thank you for reaching out
        </h3>

        <p style={{ color: '#4b5563', lineHeight: 1.65, maxWidth: '480px', fontSize: '0.9375rem', margin: 0 }}>
          Your inquiry has been assigned directly to <strong>Divvya</strong> and our technical luminaire engineering team.
          We will review your project parameters and respond within <strong>4 business hours</strong> with photometric data and recommendations.
        </p>

        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
          }}
        >
          <a
            href={`https://wa.me/91${siteConfig.phone}?text=Hello%20Divvya,%20I%20just%20submitted%20an%20inquiry%20regarding%20${encodeURIComponent(
              formData.subject
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-pill"
            style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              fontSize: '0.8125rem',
              gap: '0.5rem',
            }}
          >
            <MessageCircle size={15} />
            <span>Notify on WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => {
              setSubmitSuccess(false);
              setFormData({
                name: '',
                company: '',
                email: '',
                phone: '',
                sector: '',
                subject: '',
                message: '',
                consent: true,
                websiteHoneypot: '',
              });
            }}
            className="btn btn-pill"
            style={{
              backgroundColor: '#ffffff',
              color: '#111111',
              border: '1px solid #e5e7eb',
              fontSize: '0.8125rem',
            }}
          >
            Submit Another Specification
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="contact-card"
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        padding: 'clamp(2rem, 4vw, 3rem)',
        boxShadow: '0 12px 40px -10px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Header Inside Form */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#c5a880',
            }}
          >
            SPECIFICATION INQUIRY DESK
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.6875rem',
              color: '#10b981',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            4H RESPONSE
          </span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: '#111111',
            marginBottom: '0.5rem',
          }}
        >
          Send project specifications
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
          Fill out the parameters below or select an inquiry topic to accelerate your photometric dispatch.
        </p>
      </div>

      {/* Interactive Topic Selector Chips */}
      <div style={{ marginBottom: '1.75rem' }}>
        <span
          style={{
            display: 'block',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#4b5563',
            marginBottom: '0.6rem',
            fontFamily: 'var(--font-mono)',
          }}
        >
          SELECT INQUIRY TYPE
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {topicChips.map((chip) => {
            const isSelected = activeTopic === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleTopicClick(chip.id, chip.defaultSubject)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '999px',
                  border: isSelected ? '1px solid #111111' : '1px solid #e5e7eb',
                  backgroundColor: isSelected ? '#111111' : '#f9fafb',
                  color: isSelected ? '#ffffff' : '#374151',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.02em',
                }}
              >
                {chip.icon}
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Spam Honeypot */}
        <div style={{ display: 'none' }} aria-hidden="true">
          <input
            id="websiteHoneypot"
            name="websiteHoneypot"
            type="text"
            value={formData.websiteHoneypot}
            onChange={(e) => setFormData({ ...formData, websiteHoneypot: e.target.value })}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {serverError && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.875rem 1rem',
              backgroundColor: '#fee2e2',
              border: '1px solid #ef4444',
              borderRadius: '8px',
              color: '#b91c1c',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
            }}
          >
            <AlertCircle size={18} />
            <span>{serverError}</span>
          </div>
        )}

        {/* Row 1: Name * | Company */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <label
              htmlFor="contact-name"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#374151',
                marginBottom: '0.4rem',
              }}
            >
              Full Name <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              placeholder="e.g. Ar. Rajesh Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                backgroundColor: '#f9fafb',
                border: errors.name ? '1px solid #ef4444' : '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.9375rem',
                color: '#111111',
                outline: 'none',
                transition: 'border-color 0.2s ease, background-color 0.2s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#111111';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
              onBlur={(e) => {
                if (!errors.name) e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
            />
            {errors.name && <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem', display: 'block' }}>{errors.name}</span>}
          </div>

          <div>
            <label
              htmlFor="contact-company"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#374151',
                marginBottom: '0.4rem',
              }}
            >
              Architecture / Design Firm
            </label>
            <input
              id="contact-company"
              type="text"
              placeholder="e.g. Studio Lotus / Foster + Partners"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.9375rem',
                color: '#111111',
                outline: 'none',
                transition: 'border-color 0.2s ease, background-color 0.2s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#111111';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
            />
          </div>
        </div>

        {/* Row 2: Email * | Phone (+91) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <label
              htmlFor="contact-email"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#374151',
                marginBottom: '0.4rem',
              }}
            >
              Work Email <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              placeholder="name@architecturefirm.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                backgroundColor: '#f9fafb',
                border: errors.email ? '1px solid #ef4444' : '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.9375rem',
                color: '#111111',
                outline: 'none',
                transition: 'border-color 0.2s ease, background-color 0.2s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#111111';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
              onBlur={(e) => {
                if (!errors.email) e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
            />
            {errors.email && <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem', display: 'block' }}>{errors.email}</span>}
          </div>

          <div>
            <label
              htmlFor="contact-phone"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#374151',
                marginBottom: '0.4rem',
              }}
            >
              Telephone / Mobile
            </label>
            <div style={{ display: 'flex' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.875rem 0.85rem',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  borderRight: 'none',
                  borderRadius: '8px 0 0 8px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#4b5563',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                +91
              </span>
              <input
                id="contact-phone"
                type="tel"
                placeholder="70969 62640"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0 8px 8px 0',
                  fontSize: '0.9375rem',
                  color: '#111111',
                  outline: 'none',
                  transition: 'border-color 0.2s ease, background-color 0.2s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#111111';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
              />
            </div>
          </div>
        </div>

        {/* Row 3: Sector & Subject */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <label
              htmlFor="contact-sector"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#374151',
                marginBottom: '0.4rem',
              }}
            >
              Project Sector
            </label>
            <select
              id="contact-sector"
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: formData.sector ? '#111111' : '#6b7280',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {sectors.map((sec, i) => (
                <option key={i} value={i === 0 ? '' : sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="contact-subject"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#374151',
                marginBottom: '0.4rem',
              }}
            >
              Subject / Project Code <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="contact-subject"
              type="text"
              placeholder="e.g. Goa Boutique Resort Facade Specification"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                backgroundColor: '#f9fafb',
                border: errors.subject ? '1px solid #ef4444' : '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.9375rem',
                color: '#111111',
                outline: 'none',
                transition: 'border-color 0.2s ease, background-color 0.2s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#111111';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
              onBlur={(e) => {
                if (!errors.subject) e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
            />
            {errors.subject && <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem', display: 'block' }}>{errors.subject}</span>}
          </div>
        </div>

        {/* Row 4: Project Message / Requirements */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label
            htmlFor="contact-message"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#374151',
              marginBottom: '0.4rem',
            }}
          >
            <span>Project Details &amp; Optical Parameters <span style={{ color: '#ef4444' }}>*</span></span>
            <span style={{ fontSize: '0.6875rem', color: '#9ca3af', fontWeight: 400, textTransform: 'none' }}>
              Beam angles, CCT, quantity, or bespoke details
            </span>
          </label>
          <textarea
            id="contact-message"
            rows={5}
            placeholder="Please detail your architectural lighting requirement: e.g. target lux level, mounting constraints, desired CCT (2700K / 3000K), control protocol (DALI / 0-10V), or bespoke luminaire adaptation needs..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              backgroundColor: '#f9fafb',
              border: errors.message ? '1px solid #ef4444' : '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '0.9375rem',
              color: '#111111',
              outline: 'none',
              resize: 'vertical',
              minHeight: '130px',
              transition: 'border-color 0.2s ease, background-color 0.2s ease',
              fontFamily: 'inherit',
              lineHeight: 1.6,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#111111';
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
            onBlur={(e) => {
              if (!errors.message) e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
          />
          {errors.message && <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem', display: 'block' }}>{errors.message}</span>}
        </div>

        {/* Consent Checkbox */}
        <div style={{ marginBottom: '1.75rem' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
              cursor: 'pointer',
              fontSize: '0.8125rem',
              color: '#4b5563',
              lineHeight: 1.5,
            }}
          >
            <input
              type="checkbox"
              checked={formData.consent}
              onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
              style={{
                marginTop: '0.2rem',
                accentColor: '#111111',
                width: '16px',
                height: '16px',
                cursor: 'pointer',
              }}
            />
            <span>
              I agree to transmit this architectural specification to Kirtee &amp; Associates for technical evaluation, photometric files, and quotation.
            </span>
          </label>
          {errors.consent && <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem', display: 'block' }}>{errors.consent}</span>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-pill"
          style={{
            width: '100%',
            backgroundColor: '#111111',
            color: '#ffffff',
            padding: '1.1rem 2rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            border: 'none',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.7 : 1,
            transition: 'background-color 0.2s ease, transform 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) e.currentTarget.style.backgroundColor = '#262626';
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) e.currentTarget.style.backgroundColor = '#111111';
          }}
        >
          {isSubmitting ? (
            <span>TRANSMITTING SPECIFICATION...</span>
          ) : (
            <>
              <span>SUBMIT SPECIFICATION INQUIRY</span>
              <Send size={15} />
            </>
          )}
        </button>

        {/* Direct WhatsApp Quick Alternative */}
        <div
          style={{
            marginTop: '1.25rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid #f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
            Prefer instant mobile correspondence?
          </span>
          <a
            href={`https://wa.me/91${siteConfig.phone}?text=Hello%20Divvya,%20I%20would%20like%20to%20discuss%20an%20architectural%20lighting%20specification`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#059669',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textDecoration: 'none',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <MessageCircle size={15} />
            <span>Chat directly with Divvya</span>
          </a>
        </div>
      </form>
    </div>
  );
};
