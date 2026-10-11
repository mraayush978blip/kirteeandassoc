'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface InquiryType {
  id: string;
  label: string;
  defaultSubject: string;
}

const inquiryTypes: InquiryType[] = [
  { id: 'commercial', label: 'Project Specification', defaultSubject: 'Commercial Architectural Specification' },
  { id: 'bespoke', label: 'Bespoke Commission', defaultSubject: 'Bespoke Luminaire Adaptation Inquiry' },
  { id: 'photometrics', label: 'Photometric Data (IES)', defaultSubject: 'Request for Certified IES & Photometric Files' },
  { id: 'sample', label: 'Sample & Mockup', defaultSubject: 'Physical Luminaire Sample Request' },
];

export const ContactForm: React.FC = () => {
  const searchParams = useSearchParams();
  const paramProduct = searchParams.get('product') || '';
  const paramTopic = searchParams.get('topic') || '';

  const [activeType, setActiveType] = useState<string>(
    paramTopic || (paramProduct ? 'bespoke' : 'commercial')
  );

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    project: '',
    subject: paramProduct ? `Specification regarding ${paramProduct}` : 'Commercial Architectural Specification',
    message: paramProduct ? `Hello Divvya, we would like to review technical specifications, photometrics, and sample availability for ${paramProduct}.` : '',
    consent: true,
    websiteHoneypot: '',
  });

  useEffect(() => {
    if (paramProduct) {
      setFormData((prev) => ({
        ...prev,
        subject: `Specification regarding ${paramProduct}`,
        message: `Hello Divvya, we would like to review technical specifications, photometrics, and sample availability for ${paramProduct}.`,
      }));
      setActiveType('bespoke');
    }
  }, [paramProduct]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleTypeSelect = (type: InquiryType) => {
    setActiveType(type.id);
    setFormData((prev) => ({
      ...prev,
      subject: type.defaultSubject,
    }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please enter your full name.';
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid work email address.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Please provide project details (minimum 10 characters).';
    }
    if (!formData.consent) {
      errs.consent = 'Please confirm specification consent to proceed.';
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
          topic: `${formData.subject}${formData.project ? ` [Project: ${formData.project}]` : ''}`,
          product: paramProduct,
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
        setServerError('Unable to transmit inquiry. Please contact our studio directly.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="contact-card" style={{ padding: 'clamp(2.5rem, 5vw, 4rem) 2rem', textAlign: 'center' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#111111',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
          }}
        >
          <CheckCircle2 size={28} />
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 500,
            color: '#111111',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}
        >
          Inquiry Received
        </h3>

        <p
          style={{
            fontSize: '0.9375rem',
            lineHeight: 1.7,
            color: '#4b5563',
            maxWidth: '520px',
            margin: '0 auto 2rem auto',
          }}
        >
          Thank you for contacting Kirtee &amp; Associates. Your inquiry has been routed to{' '}
          <strong>Divvya</strong> and our architectural specification team. We will review your project
          parameters and respond with technical submittals within one business day.
        </p>

        <button
          type="button"
          onClick={() => {
            setSubmitSuccess(false);
            setFormData({
              name: '',
              company: '',
              email: '',
              phone: '',
              project: '',
              subject: 'Commercial Architectural Specification',
              message: '',
              consent: true,
              websiteHoneypot: '',
            });
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#ffffff',
            border: '1px solid #111111',
            borderRadius: '2px',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#111111',
            cursor: 'pointer',
          }}
        >
          <span>Submit Another Specification</span>
        </button>
      </div>
    );
  }

  return (
    <div className="contact-card">
      <div style={{ marginBottom: '2rem' }}>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
            fontWeight: 500,
            color: '#111111',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
          }}
        >
          Specification Inquiry
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
          Submit project parameters, luminaire schedules, or bespoke engineering requirements for direct consultation.
        </p>
      </div>

      {/* Inquiry Type Tabs */}
      <div style={{ marginBottom: '1.75rem' }}>
        <span
          style={{
            display: 'block',
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#6b7280',
            marginBottom: '0.65rem',
          }}
        >
          Inquiry Classification
        </span>
        <div className="contact-pills-container" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {inquiryTypes.map((type) => {
            const isSelected = activeType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => handleTypeSelect(type)}
                className={`contact-tag-pill ${isSelected ? 'active' : ''}`}
              >
                {type.label}
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
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '2px',
              color: '#991b1b',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{serverError}</span>
          </div>
        )}

        {/* Name & Studio / Firm */}
        <div className="contact-form-row contact-form-row-2col" style={{ marginBottom: '1.25rem' }}>
          <div>
            <label
              htmlFor="contact-name"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#374151',
                marginBottom: '0.4rem',
              }}
            >
              Full Name <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              placeholder="e.g. Ar. Devendra Rathore"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="contact-input-field"
              style={{ borderColor: errors.name ? '#ef4444' : undefined }}
            />
            {errors.name && (
              <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.35rem', display: 'block' }}>
                {errors.name}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="contact-company"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#374151',
                marginBottom: '0.4rem',
              }}
            >
              Studio / Architecture Practice
            </label>
            <input
              id="contact-company"
              type="text"
              placeholder="e.g. Studio Lotus / Foster + Partners"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="contact-input-field"
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="contact-form-row contact-form-row-2col" style={{ marginBottom: '1.25rem' }}>
          <div>
            <label
              htmlFor="contact-email"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#374151',
                marginBottom: '0.4rem',
              }}
            >
              Email Address <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              placeholder="name@studiopractice.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="contact-input-field"
              style={{ borderColor: errors.email ? '#ef4444' : undefined }}
            />
            {errors.email && (
              <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.35rem', display: 'block' }}>
                {errors.email}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="contact-phone"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#374151',
                marginBottom: '0.4rem',
              }}
            >
              Telephone / Mobile
            </label>
            <input
              id="contact-phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="contact-input-field"
            />
          </div>
        </div>

        {/* Project Name / Location */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label
            htmlFor="contact-project"
            style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#374151',
              marginBottom: '0.4rem',
            }}
          >
            Project Name / Location
          </label>
          <input
            id="contact-project"
            type="text"
            placeholder="e.g. Alibaug Private Villa or Mumbai Commercial Tower"
            value={formData.project}
            onChange={(e) => setFormData({ ...formData, project: e.target.value })}
            className="contact-input-field"
          />
        </div>

        {/* Message / Requirements */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor="contact-message"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#374151',
              marginBottom: '0.4rem',
            }}
          >
            <span>Project Details &amp; Optical Notes <span style={{ color: '#ef4444' }}>*</span></span>
            <span style={{ fontSize: '0.6875rem', color: '#9ca3af', fontWeight: 400, textTransform: 'none' }}>
              Beam angles, CCT, mounting constraints, or schedules
            </span>
          </label>
          <textarea
            id="contact-message"
            rows={5}
            placeholder="Please outline your luminaire requirements, target lux level, mounting constraints, or custom finishing specifications..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="contact-input-field"
            style={{
              resize: 'vertical',
              minHeight: '130px',
              borderColor: errors.message ? '#ef4444' : undefined,
            }}
          />
          {errors.message && (
            <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.35rem', display: 'block' }}>
              {errors.message}
            </span>
          )}
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
              I agree to transmit this architectural inquiry to Kirtee &amp; Associates for technical review, photometric data preparation, and quotation.
            </span>
          </label>
          {errors.consent && (
            <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.35rem', display: 'block' }}>
              {errors.consent}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            backgroundColor: '#111111',
            color: '#ffffff',
            padding: '1.05rem 2rem',
            fontSize: '0.8125rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            border: 'none',
            borderRadius: '2px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.75 : 1,
            transition: 'background-color 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) e.currentTarget.style.backgroundColor = '#2a2a2a';
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) e.currentTarget.style.backgroundColor = '#111111';
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Transmitting Inquiry...</span>
            </>
          ) : (
            <>
              <span>Transmit Specification Inquiry</span>
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
