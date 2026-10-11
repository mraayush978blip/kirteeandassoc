'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    id: 'faq-ies',
    question: 'How are certified IES and photometric files distributed?',
    answer:
      'Luminous intensity distribution files (IES and EULUMDAT .ldt) and Revit BIM families are available for all standard and configured luminaires. Files are prepared for direct integration into DIALux evo, Relux, and lighting calculation software.',
  },
  {
    id: 'faq-prototypes',
    question: 'What is the schedule for bespoke luminaire mockups and prototypes?',
    answer:
      'Following project design approval and 3D CAD sign-off, working CNC architectural prototypes are produced in our workshop. Prototype luminaires undergo optical and thermal bench validation prior to studio dispatch.',
  },
  {
    id: 'faq-finishes',
    question: 'Can luminaires be specified in bespoke architectural patinas or RAL colours?',
    answer:
      'Yes. In addition to our architectural Matte Black and Natural Anodized aluminium, we fabricate custom finishes across the complete RAL Classic palette, as well as hand-burnished bronze, weathered brass, and architectural powder-coatings tailored to project interior palettes.',
  },
  {
    id: 'faq-submersible',
    question: 'Are Wet Goods luminaires certified for continuous submersion?',
    answer:
      'Our Wet Goods architectural series is engineered from marine-grade 316L stainless steel with hermetically sealed optical cavities, rated IP68 for permanent underwater placement up to 10 meters depth and severe coastal environments.',
  },
];

export const ContactFaq: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #111111' }}>
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.125rem',
            fontWeight: 500,
            letterSpacing: '0.04em',
            color: '#111111',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          Specification Notes &amp; FAQ
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              style={{
                borderBottom: '1px solid #e5e7eb',
                transition: 'background-color 0.2s ease',
              }}
            >
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                aria-expanded={isOpen}
                style={{
                  width: '100%',
                  padding: '1.1rem 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1.25rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    color: isOpen ? '#111111' : '#374151',
                    lineHeight: 1.45,
                  }}
                >
                  {faq.question}
                </span>

                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    flexShrink: 0,
                    color: '#111111',
                  }}
                >
                  {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>

              <div
                style={{
                  maxHeight: isOpen ? '300px' : '0px',
                  opacity: isOpen ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease',
                }}
              >
                <p
                  style={{
                    paddingBottom: '1.25rem',
                    fontSize: '0.875rem',
                    lineHeight: 1.7,
                    color: '#6b7280',
                    margin: 0,
                  }}
                >
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
