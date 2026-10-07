'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import { siteConfig } from '@/config/site';

export interface ContactFormProps {
  initialProduct?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ initialProduct = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    subject: initialProduct ? `Inquiry regarding ${initialProduct}` : '',
    message: '',
    websiteHoneypot: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please enter your name.';
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!formData.subject.trim()) errs.subject = 'Please enter a subject.';
    if (!formData.message.trim()) errs.message = 'Please tell us how we can help you.';
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
          ...formData,
          consent: true,
          topic: formData.subject,
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
        setServerError('A network error occurred. Please try again or contact us directly.');
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
          padding: '3rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
        }}
      >
        <CheckCircle2 size={48} color="#111111" />
        <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-sans)', fontWeight: 600, color: '#111111' }}>
          Message Sent Successfully
        </h3>
        <p style={{ color: '#4b5563', lineHeight: 1.6, maxWidth: '440px' }}>
          Thank you for reaching out. Our Zenvora lighting team will review your inquiry and get back to you shortly.
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
              subject: '',
              message: '',
              websiteHoneypot: '',
            });
          }}
          className="btn btn-pill"
          style={{
            backgroundColor: '#111111',
            color: '#ffffff',
            marginTop: '1rem',
          }}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="contact-card">
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
            <input
              type="text"
              placeholder="Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%',
                padding: '0.875rem 1.125rem',
                backgroundColor: '#ffffff',
                border: errors.name ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.9375rem',
                color: '#111111',
                outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#111111')}
              onBlur={(e) => {
                if (!errors.name) e.currentTarget.style.borderColor = '#d1d5db';
              }}
            />
            {errors.name && <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem', display: 'block' }}>{errors.name}</span>}
          </div>

          <div>
            <input
              type="text"
              placeholder="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              style={{
                width: '100%',
                padding: '0.875rem 1.125rem',
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.9375rem',
                color: '#111111',
                outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#111111')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
            />
          </div>
        </div>

        {/* Row 2: Email * | +91 Phone */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <input
              type="email"
              placeholder="Email *"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: '100%',
                padding: '0.875rem 1.125rem',
                backgroundColor: '#ffffff',
                border: errors.email ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.9375rem',
                color: '#111111',
                outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#111111')}
              onBlur={(e) => {
                if (!errors.email) e.currentTarget.style.borderColor = '#d1d5db';
              }}
            />
            {errors.email && <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem', display: 'block' }}>{errors.email}</span>}
          </div>

          <div style={{ display: 'flex' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.875rem 0.875rem',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRight: 'none',
                borderRadius: '8px 0 0 8px',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#4b5563',
              }}
            >
              +91
            </span>
            <input
              type="tel"
              placeholder="Phone number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{
                width: '100%',
                padding: '0.875rem 1.125rem',
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '0 8px 8px 0',
                fontSize: '0.9375rem',
                color: '#111111',
                outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#111111')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
            />
          </div>
        </div>

        {/* Row 3: Subject * */}
        <div style={{ marginBottom: '1.25rem' }}>
          <input
            type="text"
            placeholder="Subject *"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            style={{
              width: '100%',
              padding: '0.875rem 1.125rem',
              backgroundColor: '#ffffff',
              border: errors.subject ? '1px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.9375rem',
              color: '#111111',
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#111111')}
            onBlur={(e) => {
              if (!errors.subject) e.currentTarget.style.borderColor = '#d1d5db';
            }}
          />
          {errors.subject && <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem', display: 'block' }}>{errors.subject}</span>}
        </div>

        {/* Row 4: Tell us how we can help you * */}
        <div style={{ marginBottom: '1.75rem' }}>
          <textarea
            rows={5}
            placeholder="Tell us how we can help you *"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            style={{
              width: '100%',
              padding: '0.875rem 1.125rem',
              backgroundColor: '#ffffff',
              border: errors.message ? '1px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.9375rem',
              color: '#111111',
              outline: 'none',
              resize: 'vertical',
              minHeight: '140px',
              transition: 'border-color 0.2s ease',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#111111')}
            onBlur={(e) => {
              if (!errors.message) e.currentTarget.style.borderColor = '#d1d5db';
            }}
          />
          {errors.message && <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem', display: 'block' }}>{errors.message}</span>}
        </div>

        {/* Submit Pill Button (Matching Page 4 black pill: Submit) */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-pill"
          style={{
            width: '100%',
            backgroundColor: '#111111',
            color: '#ffffff',
            padding: '1rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            border: 'none',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.7 : 1,
            transition: 'background-color 0.2s ease, transform 0.1s ease',
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) e.currentTarget.style.backgroundColor = '#000000';
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) e.currentTarget.style.backgroundColor = '#111111';
          }}
        >
          {isSubmitting ? 'Sending...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};
