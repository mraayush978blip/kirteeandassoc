'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export const ContactForm: React.FC = () => {
  const searchParams = useSearchParams();
  const paramProduct = searchParams.get('product') || '';
  const paramTopic = searchParams.get('topic') || '';

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    subject: paramProduct ? `Inquiry regarding ${paramProduct}` : (paramTopic || ''),
    message: '',
    websiteHoneypot: '',
  });

  useEffect(() => {
    if (paramProduct) {
      setFormData((prev) => ({
        ...prev,
        subject: `Inquiry regarding ${paramProduct}`,
      }));
    }
  }, [paramProduct]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Valid email is required';
    }
    if (!formData.subject.trim()) errs.subject = 'Subject is required';
    if (!formData.message.trim() || formData.message.trim().length < 5) {
      errs.message = 'Please tell us how we can help you';
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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          topic: formData.subject,
          product: paramProduct || null,
          message: formData.message,
          consent: true,
          websiteHoneypot: formData.websiteHoneypot,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitSuccess(true);
      } else {
        setServerError(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setServerError('Unable to connect to the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #eef0f2',
          boxShadow: '0 20px 48px -12px rgba(0, 0, 0, 0.05)',
          padding: 'clamp(2.5rem, 5vw, 4rem) 2.5rem',
          textAlign: 'center',
          minHeight: '480px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#374151',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <CheckCircle2 size={28} />
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#111827',
            marginBottom: '0.75rem',
          }}
        >
          Thank You
        </h3>

        <p
          style={{
            fontSize: '0.9375rem',
            lineHeight: 1.65,
            color: '#6b7280',
            maxWidth: '380px',
            margin: '0 auto 2rem auto',
          }}
        >
          Your enquiry has been received. Our team will review your message and get back to you shortly.
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
          style={{
            borderRadius: '9999px',
            padding: '0.75rem 2rem',
            backgroundColor: 'transparent',
            border: '1px solid #374151',
            color: '#374151',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#374151';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#374151';
          }}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    borderRadius: '9999px',
    border: '1px solid #e5e7eb',
    padding: '1.1rem 1.65rem',
    fontFamily: 'var(--font-sans)',
    fontSize: '1.0625rem',
    color: '#1f2937',
    backgroundColor: '#ffffff',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    borderRadius: '20px',
    border: '1px solid #e5e7eb',
    padding: '1.25rem 1.65rem',
    fontFamily: 'var(--font-sans)',
    fontSize: '1.0625rem',
    color: '#1f2937',
    backgroundColor: '#ffffff',
    outline: 'none',
    minHeight: '175px',
    resize: 'vertical',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '28px',
        border: '1px solid #f0f0f2',
        boxShadow: '0 24px 50px -12px rgba(0, 0, 0, 0.06)',
        padding: 'clamp(2.25rem, 4.5vw, 3.5rem)',
      }}
    >
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
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.95rem 1.35rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '14px',
              color: '#991b1b',
              marginBottom: '1.5rem',
              fontSize: '0.9375rem',
            }}
          >
            <AlertCircle size={18} />
            <span>{serverError}</span>
          </div>
        )}

        {/* Row 1: Name * and Company */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            <input
              type="text"
              placeholder="Name *"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              style={{
                ...inputStyle,
                borderColor: errors.name ? '#ef4444' : '#e5e7eb',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#4b5563')}
              onBlur={(e) => (e.currentTarget.style.borderColor = errors.name ? '#ef4444' : '#e5e7eb')}
            />
            {errors.name && (
              <span style={{ fontSize: '0.8125rem', color: '#ef4444', marginLeft: '1.25rem', marginTop: '0.35rem', display: 'block' }}>
                {errors.name}
              </span>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#4b5563')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
            />
          </div>
        </div>

        {/* Row 2: Email * and Phone */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            <input
              type="email"
              placeholder="Email *"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              style={{
                ...inputStyle,
                borderColor: errors.email ? '#ef4444' : '#e5e7eb',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#4b5563')}
              onBlur={(e) => (e.currentTarget.style.borderColor = errors.email ? '#ef4444' : '#e5e7eb')}
            />
            {errors.email && (
              <span style={{ fontSize: '0.8125rem', color: '#ef4444', marginLeft: '1.25rem', marginTop: '0.35rem', display: 'block' }}>
                {errors.email}
              </span>
            )}
          </div>

          <div>
            <input
              type="tel"
              placeholder="+91"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#4b5563')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
            />
          </div>
        </div>

        {/* Row 3: Subject * */}
        <div style={{ marginBottom: '1.25rem' }}>
          <input
            type="text"
            placeholder="Subject *"
            value={formData.subject}
            onChange={(e) => {
              setFormData({ ...formData, subject: e.target.value });
              if (errors.subject) setErrors({ ...errors, subject: '' });
            }}
            style={{
              ...inputStyle,
              borderColor: errors.subject ? '#ef4444' : '#e5e7eb',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#4b5563')}
            onBlur={(e) => (e.currentTarget.style.borderColor = errors.subject ? '#ef4444' : '#e5e7eb')}
          />
          {errors.subject && (
            <span style={{ fontSize: '0.8125rem', color: '#ef4444', marginLeft: '1.25rem', marginTop: '0.35rem', display: 'block' }}>
              {errors.subject}
            </span>
          )}
        </div>

        {/* Row 4: Message Textarea */}
        <div style={{ marginBottom: '1.75rem' }}>
          <textarea
            placeholder="Tell us how we can help you *"
            value={formData.message}
            onChange={(e) => {
              setFormData({ ...formData, message: e.target.value });
              if (errors.message) setErrors({ ...errors, message: '' });
            }}
            style={{
              ...textareaStyle,
              borderColor: errors.message ? '#ef4444' : '#e5e7eb',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#4b5563')}
            onBlur={(e) => (e.currentTarget.style.borderColor = errors.message ? '#ef4444' : '#e5e7eb')}
          />
          {errors.message && (
            <span style={{ fontSize: '0.8125rem', color: '#ef4444', marginLeft: '1.25rem', marginTop: '0.35rem', display: 'block' }}>
              {errors.message}
            </span>
          )}
        </div>

        {/* Row 5: Submit Button (Pill Rounded, Architectural Grey) */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            borderRadius: '9999px',
            backgroundColor: '#282b32', // Architectural Slate Grey (no pure black)
            color: '#ffffff',
            padding: '1.15rem 2.5rem',
            fontFamily: 'var(--font-sans)',
            fontSize: '1.0625rem',
            fontWeight: 600,
            border: 'none',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.75 : 1,
            transition: 'background-color 0.2s ease, transform 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.backgroundColor = '#374151';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.backgroundColor = '#282b32';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <span>Submit</span>
          )}
        </button>
      </form>
    </div>
  );
};
