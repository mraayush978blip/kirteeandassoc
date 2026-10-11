'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, FileText, Clock, Palette, Award } from 'lucide-react';

interface FaqItem {
  id: string;
  icon: React.ReactNode;
  question: string;
  answer: string;
  badge?: string;
}

const faqs: FaqItem[] = [
  {
    id: 'faq-ies',
    icon: <FileText size={16} />,
    badge: 'SAME-DAY DISPATCH',
    question: 'How quickly can we obtain certified IES / LDT photometric files?',
    answer:
      'Our optical library contains verified IES, EULUMDAT (.ldt), and Revit BIM files for our entire standard range. Digital files are dispatched within 2 hours of inquiry for immediate DIALux or Relux lux-level modeling. Customized photometric distributions can also be generated for bespoke optical matrices.',
  },
  {
    id: 'faq-leadtime',
    icon: <Clock size={16} />,
    badge: '14-DAY MOCKUPS',
    question: 'What is the typical turnaround for bespoke luminaire prototypes?',
    answer:
      'For bespoke adaptations (custom dimensions, mounting plates, or beam optics), CAD submittals are delivered in 48 hours. Working physical mockups are CNC-machined, photometrically tested in our goniometer, and dispatched to your architectural studio within 14 business days.',
  },
  {
    id: 'faq-finishes',
    icon: <Palette size={16} />,
    badge: 'CUSTOM RAL & PATINAS',
    question: 'Can fixtures be customized in specific architectural patinas or RAL finishes?',
    answer:
      'Yes. Beyond our standard hard-anodized Matte Black, Brushed Aluminium, and Bronze, we formulate custom powder-coat finishes across the complete RAL and NCS palettes, as well as hand-applied architectural metal patinas (brushed brass, blackened steel, and verdigris).',
  },
  {
    id: 'faq-marine',
    icon: <Award size={16} />,
    badge: 'IP68 SUBMERSIBLE',
    question: 'Do you provide certified IP68 submersible fixtures for fountains and coastlines?',
    answer:
      'Our Wet Goods family features marine-grade 316L stainless steel and hermetically sealed nitrogen-purged optical chambers rated for continuous immersion up to 10 meters depth and severe saline atmospheric corrosion.',
  },
];

export const ContactFaq: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-ies');

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: 'clamp(1.5rem, 3vw, 2rem)',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
        <HelpCircle size={18} color="#111111" />
        <h3
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9375rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#111111',
            margin: 0,
          }}
        >
          SPECIFICATION FAQ
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              style={{
                border: isOpen ? '1px solid #111111' : '1px solid #e5e7eb',
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'border-color 0.2s ease',
              }}
            >
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                style={{
                  width: '100%',
                  padding: '1rem 1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  backgroundColor: isOpen ? '#f9fafb' : '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: isOpen ? '#111111' : '#6b7280', display: 'flex', alignItems: 'center' }}>
                    {faq.icon}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: isOpen ? '#111111' : '#374151',
                      lineHeight: 1.4,
                    }}
                  >
                    {faq.question}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                  {faq.badge && (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.625rem',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        color: isOpen ? '#111111' : '#6b7280',
                        backgroundColor: isOpen ? 'rgba(0,0,0,0.06)' : '#f3f4f6',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '3px',
                      }}
                      className="hidden sm:inline-block"
                    >
                      {faq.badge}
                    </span>
                  )}
                  <ChevronDown
                    size={16}
                    color="#111111"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease',
                    }}
                  />
                </div>
              </button>

              <div
                style={{
                  maxHeight: isOpen ? '240px' : '0px',
                  opacity: isOpen ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
                  backgroundColor: isOpen ? '#f9fafb' : '#ffffff',
                }}
              >
                <div
                  style={{
                    padding: '0 1.15rem 1rem 1.15rem',
                    fontSize: '0.8125rem',
                    lineHeight: 1.65,
                    color: '#4b5563',
                  }}
                >
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
