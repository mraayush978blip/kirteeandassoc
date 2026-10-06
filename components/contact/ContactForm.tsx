'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, AlertCircle, Send } from 'lucide-react';

export interface ContactFormProps {
  initialProduct?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ initialProduct = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    topic: 'Commercial Specification & Quotation',
    product: initialProduct,
    message: '',
    consent: false,
    websiteHoneypot: '', // Spam bot protection
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid corporate or professional email.';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please provide details about your architectural project or inquiry.';
    } else if (formData.message.length < 15) {
      errs.message = 'Inquiry details should be at least 15 characters.';
    }
    if (!formData.consent) {
      errs.consent = 'Consent to process your project specification details is required.';
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Spam honeypot detection
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
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Submission failed. Please verify fields and try again.');
      }

      setSubmitSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError('A network error occurred while submitting your inquiry. Please try again or reach out directly.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          padding: '3rem 2rem',
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xs)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
        }}
      >
        <CheckCircle2 size={48} color="var(--color-accent)" />
        <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)' }}>
          Inquiry Successfully Dispatched
        </h3>
        <p style={{ maxWidth: '480px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
          Thank you. Your architectural specification details have been routed directly to our engineering division.
          A lighting specialist will review your photometric criteria and respond promptly.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitSuccess(false);
            setFormData({
              name: '',
              email: '',
              phone: '',
              company: '',
              topic: 'Commercial Specification & Quotation',
              product: '',
              message: '',
              consent: false,
              websiteHoneypot: '',
            });
          }}
          className="btn btn-secondary"
          style={{ marginTop: '1rem' }}
        >
          Submit Another Specification
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xs)',
        padding: 'clamp(1.5rem, 4vw, 2.75rem)',
      }}
    >
      {/* Hidden honeypot field for bot trapping */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <label htmlFor="websiteHoneypot">Leave blank</label>
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
            padding: '1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--color-error)',
            borderRadius: 'var(--radius-xs)',
            color: 'var(--color-error)',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
          }}
        >
          <AlertCircle size={18} />
          <span>{serverError}</span>
        </div>
      )}

      {/* Grid: Name & Email */}
      <div className="grid-2" style={{ gap: '1.25rem', marginBottom: '0.5rem' }}>
        <div className="form-group">
          <label htmlFor="contact-name" className="form-label">
            Full Name <span className="required">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            required
            aria-required="true"
            aria-invalid={!!errors.name}
            className="form-input"
            placeholder="e.g. Ar. Vikram Mehta"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {errors.name && <span className="form-error-msg">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="contact-email" className="form-label">
            Corporate Email <span className="required">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            required
            aria-required="true"
            aria-invalid={!!errors.email}
            className="form-input"
            placeholder="v.mehta@architects.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && <span className="form-error-msg">{errors.email}</span>}
        </div>
      </div>

      {/* Grid: Phone & Company */}
      <div className="grid-2" style={{ gap: '1.25rem', marginBottom: '0.5rem' }}>
        <div className="form-group">
          <label htmlFor="contact-phone" className="form-label">
            Telephone / Mobile
          </label>
          <input
            id="contact-phone"
            type="tel"
            className="form-input"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact-company" className="form-label">
            Firm / Organization
          </label>
          <input
            id="contact-company"
            type="text"
            className="form-input"
            placeholder="Studio Architecture Partners"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
        </div>
      </div>

      {/* Grid: Topic & Associated Product */}
      <div className="grid-2" style={{ gap: '1.25rem', marginBottom: '0.5rem' }}>
        <div className="form-group">
          <label htmlFor="contact-topic" className="form-label">
            Specification Nature
          </label>
          <select
            id="contact-topic"
            className="form-select"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          >
            <option value="Commercial Specification & Quotation">Commercial Specification &amp; Quotation</option>
            <option value="Bespoke Luminaire Engineering">Bespoke Luminaire Engineering</option>
            <option value="Photometric & IES File Request">Photometric &amp; IES File Request</option>
            <option value="Physical Fixture Mockup / Sample">Physical Fixture Mockup / Sample</option>
            <option value="General Architectural Inquiry">General Architectural Inquiry</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="contact-product" className="form-label">
            Luminaire Under Review (Optional)
          </label>
          <input
            id="contact-product"
            type="text"
            className="form-input"
            placeholder="e.g. Ingraze Frame 1000"
            value={formData.product}
            onChange={(e) => setFormData({ ...formData, product: e.target.value })}
          />
        </div>
      </div>

      {/* Message textarea */}
      <div className="form-group">
        <label htmlFor="contact-message" className="form-label">
          Project Specification Details <span className="required">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={5}
          required
          aria-required="true"
          aria-invalid={!!errors.message}
          className="form-textarea"
          placeholder="Please describe project scale, mounting conditions, required optical distributions, quantities, or schedule milestones..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
        {errors.message && <span className="form-error-msg">{errors.message}</span>}
      </div>

      {/* Consent Checkbox */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={formData.consent}
            onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
            style={{
              marginTop: '0.2rem',
              accentColor: 'var(--color-accent)',
              cursor: 'pointer',
            }}
          />
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
            I consent to Kirtee &amp; Associates processing my contact information and project requirements to provide technical recommendations and quotations.
          </span>
        </label>
        {errors.consent && <p className="form-error-msg">{errors.consent}</p>}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        isLoading={isSubmitting}
        rightIcon={<Send size={15} />}
        style={{ width: '100%' }}
      >
        Transmitting Specification Request
      </Button>
    </form>
  );
};
