'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  Eye,
  LayoutGrid,
  Maximize2,
  X,
  UploadCloud,
  Sliders,
  Crop,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Columns,
  Grid,
} from 'lucide-react';
import { ImageCropperModal } from './ImageCropperModal';

export interface GridPhotoItem {
  id: string;
  url: string;
  alt: string;
  tag: string;
  caption: string;
}

interface ProductGridBuilderProps {
  initialPhotos?: GridPhotoItem[];
  productName?: string;
  onSave: (photos: GridPhotoItem[]) => void;
  onCancel: () => void;
}

type GridTemplateId = 'mosaic-5' | 'collage-6' | 'editorial-4' | 'panorama-3' | 'custom';

export const ProductGridBuilder: React.FC<ProductGridBuilderProps> = ({
  initialPhotos = [],
  productName = 'Product',
  onSave,
  onCancel,
}) => {
  const [step, setStep] = useState<'template' | 'editor'>('editor');
  const [selectedTemplate, setSelectedTemplate] = useState<GridTemplateId>('mosaic-5');
  const [customSlotCount, setCustomSlotCount] = useState<number>(5);

  // Slots State
  const [slots, setSlots] = useState<GridPhotoItem[]>(() => {
    if (initialPhotos && initialPhotos.length > 0) {
      return initialPhotos;
    }
    // Default 5 slots
    return [
      { id: 'slot-1', url: '', alt: '', tag: '01 / ARCHITECTURAL SPACE', caption: '' },
      { id: 'slot-2', url: '', alt: '', tag: '02 / OPTICAL DIFFUSER', caption: '' },
      { id: 'slot-3', url: '', alt: '', tag: '03 / GRAZING EMISSION', caption: '' },
      { id: 'slot-4', url: '', alt: '', tag: '04 / AMBIENT WARMTH', caption: '' },
      { id: 'slot-5', url: '', alt: '', tag: '05 / TACTILE CRAFTSMANSHIP', caption: '' },
    ];
  });

  // Active Slot Being Edited
  const [editingSlotIndex, setEditingSlotIndex] = useState<number | null>(null);
  const [slotFormData, setSlotFormData] = useState<{ url: string; alt: string; tag: string; caption: string }>({
    url: '',
    alt: '',
    tag: '',
    caption: '',
  });

  // Cropper Modal State
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState<string | null>(null);
  const [cropperFile, setCropperFile] = useState<File | null>(null);

  // Live Preview Modal State
  const [showLivePreview, setShowLivePreview] = useState(false);

  // When template changes, initialize required number of slots
  const handleSelectTemplate = (template: GridTemplateId) => {
    setSelectedTemplate(template);
    let count = 5;
    if (template === 'collage-6') count = 6;
    if (template === 'editorial-4') count = 4;
    if (template === 'panorama-3') count = 3;
    if (template === 'custom') count = customSlotCount;

    setSlots((prev) => {
      const newSlots: GridPhotoItem[] = [];
      const defaultTags = [
        '01 / ARCHITECTURAL SPACE',
        '02 / OPTICAL DIFFUSER',
        '03 / GRAZING EMISSION',
        '04 / AMBIENT WARMTH',
        '05 / TACTILE CRAFTSMANSHIP',
        '06 / DETAIL PERSPECTIVE',
        '07 / FACADE INTEGRATION',
        '08 / PHOTOMETRIC PURITY',
      ];

      for (let i = 0; i < count; i++) {
        if (prev[i]) {
          newSlots.push(prev[i]);
        } else {
          newSlots.push({
            id: `slot-${i + 1}`,
            url: '',
            alt: `${productName} view ${i + 1}`,
            tag: defaultTags[i] || `0${i + 1} / PERSPECTIVE`,
            caption: '',
          });
        }
      }
      return newSlots;
    });

    setStep('editor');
  };

  const handleCustomCountChange = (delta: number) => {
    const nextCount = Math.max(3, Math.min(8, customSlotCount + delta));
    setCustomSlotCount(nextCount);
    if (selectedTemplate === 'custom') {
      setSlots((prev) => {
        const newSlots: GridPhotoItem[] = [...prev];
        if (newSlots.length < nextCount) {
          for (let i = newSlots.length; i < nextCount; i++) {
            newSlots.push({
              id: `slot-${i + 1}`,
              url: '',
              alt: `${productName} view ${i + 1}`,
              tag: `0${i + 1} / DETAIL PERSPECTIVE`,
              caption: '',
            });
          }
        } else {
          newSlots.length = nextCount;
        }
        return newSlots;
      });
    }
  };

  const openSlotEditor = (index: number) => {
    setEditingSlotIndex(index);
    const existing = slots[index];
    setSlotFormData({
      url: existing?.url || '',
      alt: existing?.alt || `${productName} architectural detail ${index + 1}`,
      tag: existing?.tag || `0${index + 1} / PERSPECTIVE`,
      caption: existing?.caption || '',
    });
  };

  const saveSlotForm = () => {
    if (editingSlotIndex === null) return;
    setSlots((prev) => {
      const copy = [...prev];
      copy[editingSlotIndex] = {
        ...copy[editingSlotIndex],
        url: slotFormData.url,
        alt: slotFormData.alt,
        tag: slotFormData.tag,
        caption: slotFormData.caption,
      };
      return copy;
    });
    setEditingSlotIndex(null);
  };

  const clearSlot = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSlots((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        url: '',
        alt: '',
        caption: '',
      };
      return copy;
    });
  };

  const handleFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCropperFile(file);
      setCropperImageSrc(null);
      setCropperOpen(true);
    }
  };

  const handleCropComplete = async (result: { blob: Blob; dataUrl: string; filename: string }) => {
    // Convert to upload via /api/admin/compress or use dataUrl directly
    const formData = new FormData();
    formData.append('files', result.blob, result.filename);

    try {
      const res = await fetch('/api/admin/compress', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.files?.[0]?.url) {
        setSlotFormData((prev) => ({
          ...prev,
          url: data.files[0].url,
        }));
      } else {
        // Fallback to dataUrl
        setSlotFormData((prev) => ({
          ...prev,
          url: result.dataUrl,
        }));
      }
    } catch {
      // Fallback to dataUrl
      setSlotFormData((prev) => ({
        ...prev,
        url: result.dataUrl,
      }));
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}
    >
      {/* Top Bar Navigation */}
      <div
        style={{
          padding: '1.25rem 2rem',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#fafafa',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: '#6b7280',
              letterSpacing: '0.1em',
              display: 'block',
              marginBottom: '0.2rem',
            }}
          >
            PRODUCT DETAIL SUB-PAGE
          </span>
          <h3
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#111827',
              margin: 0,
            }}
          >
            Architectural Photo Grid Builder
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setStep(step === 'template' ? 'editor' : 'template')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: '1px solid #d1d5db',
              backgroundColor: '#ffffff',
              color: '#374151',
              fontSize: '0.8125rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
            }}
          >
            <LayoutGrid size={15} />
            {step === 'template' ? 'Back to Editor' : 'Change Grid Template'}
          </button>

          <button
            type="button"
            onClick={() => setShowLivePreview(true)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '4px',
              border: '1px solid #d1d5db',
              backgroundColor: '#ffffff',
              color: '#111827',
              fontSize: '0.8125rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
            }}
          >
            <Eye size={15} /> Live Preview
          </button>

          <button
            type="button"
            onClick={() => onSave(slots.filter((s) => Boolean(s.url)))}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#111827',
              color: '#ffffff',
              fontSize: '0.8125rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            }}
          >
            <Check size={16} /> Save Photo Grid
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ padding: '2rem' }}>
        {/* ======================================================== */}
        {/* STEP 1: TEMPLATE SELECTOR VIEW */}
        {/* ======================================================== */}
        {step === 'template' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h4
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#111827',
                  margin: '0 0 0.35rem 0',
                }}
              >
                Choose Grid Layout Template
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                Select a curated architectural grid or customize the slot count for this product&apos;s photographic gallery.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2.5rem',
              }}
            >
              {/* Template 1: 5-Slot Mosaic */}
              <div
                onClick={() => handleSelectTemplate('mosaic-5')}
                style={{
                  padding: '1.5rem',
                  borderRadius: '6px',
                  border: selectedTemplate === 'mosaic-5' ? '2px solid #111827' : '1px solid #e5e7eb',
                  backgroundColor: selectedTemplate === 'mosaic-5' ? '#f9fafb' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ height: '90px', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '4px', height: '55%' }}>
                    <div style={{ flex: 1, backgroundColor: '#3b82f6', opacity: 0.8, borderRadius: '2px' }} />
                    <div style={{ flex: 1, backgroundColor: '#3b82f6', opacity: 0.8, borderRadius: '2px' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '4px', height: '45%' }}>
                    <div style={{ flex: 1, backgroundColor: '#93c5fd', borderRadius: '2px' }} />
                    <div style={{ flex: 1, backgroundColor: '#93c5fd', borderRadius: '2px' }} />
                    <div style={{ flex: 1, backgroundColor: '#93c5fd', borderRadius: '2px' }} />
                  </div>
                </div>
                <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9375rem', fontWeight: 600, color: '#111827' }}>
                  Modern 5-Slot Mosaic
                </h5>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                  2 large top feature panels + 3 triplet bottom vignettes (Standard Calipso ratio).
                </p>
              </div>

              {/* Template 2: 6-Slot Collage (As in user screenshot!) */}
              <div
                onClick={() => handleSelectTemplate('collage-6')}
                style={{
                  padding: '1.5rem',
                  borderRadius: '6px',
                  border: selectedTemplate === 'collage-6' ? '2px solid #111827' : '1px solid #e5e7eb',
                  backgroundColor: selectedTemplate === 'collage-6' ? '#f9fafb' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ height: '90px', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '4px', height: '60%' }}>
                    <div style={{ flex: 1.6, backgroundColor: '#3b82f6', opacity: 0.85, borderRadius: '2px' }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ flex: 1, backgroundColor: '#93c5fd', borderRadius: '2px' }} />
                      <div style={{ flex: 1, backgroundColor: '#93c5fd', borderRadius: '2px' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', height: '40%' }}>
                    <div style={{ flex: 1, backgroundColor: '#60a5fa', borderRadius: '2px' }} />
                    <div style={{ flex: 1, backgroundColor: '#60a5fa', borderRadius: '2px' }} />
                    <div style={{ flex: 1, backgroundColor: '#60a5fa', borderRadius: '2px' }} />
                  </div>
                </div>
                <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9375rem', fontWeight: 600, color: '#111827' }}>
                  Collage 6-Slot Grid
                </h5>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                  1 large dominant panel + 2 stacked details + 3 bottom photo slots.
                </p>
              </div>

              {/* Template 3: 4-Slot Editorial */}
              <div
                onClick={() => handleSelectTemplate('editorial-4')}
                style={{
                  padding: '1.5rem',
                  borderRadius: '6px',
                  border: selectedTemplate === 'editorial-4' ? '2px solid #111827' : '1px solid #e5e7eb',
                  backgroundColor: selectedTemplate === 'editorial-4' ? '#f9fafb' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ height: '90px', display: 'flex', gap: '4px', marginBottom: '1rem' }}>
                  <div style={{ flex: 1.5, backgroundColor: '#3b82f6', opacity: 0.85, borderRadius: '2px' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ flex: 1, backgroundColor: '#93c5fd', borderRadius: '2px' }} />
                    <div style={{ flex: 1, backgroundColor: '#93c5fd', borderRadius: '2px' }} />
                    <div style={{ flex: 1, backgroundColor: '#93c5fd', borderRadius: '2px' }} />
                  </div>
                </div>
                <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9375rem', fontWeight: 600, color: '#111827' }}>
                  Editorial 4-Slot Showcase
                </h5>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                  1 wide hero visual on left with 3 vertical detail panels on right.
                </p>
              </div>

              {/* Template 4: 3-Column Panorama */}
              <div
                onClick={() => handleSelectTemplate('panorama-3')}
                style={{
                  padding: '1.5rem',
                  borderRadius: '6px',
                  border: selectedTemplate === 'panorama-3' ? '2px solid #111827' : '1px solid #e5e7eb',
                  backgroundColor: selectedTemplate === 'panorama-3' ? '#f9fafb' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ height: '90px', display: 'flex', gap: '4px', marginBottom: '1rem' }}>
                  <div style={{ flex: 1, backgroundColor: '#3b82f6', opacity: 0.8, borderRadius: '2px' }} />
                  <div style={{ flex: 1, backgroundColor: '#60a5fa', opacity: 0.8, borderRadius: '2px' }} />
                  <div style={{ flex: 1, backgroundColor: '#93c5fd', opacity: 0.8, borderRadius: '2px' }} />
                </div>
                <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9375rem', fontWeight: 600, color: '#111827' }}>
                  3-Column Panorama
                </h5>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                  3 equal architectural columns spanning the screen horizontally.
                </p>
              </div>

              {/* Template 5: Custom Grid Maker with Counter Selector */}
              <div
                onClick={() => handleSelectTemplate('custom')}
                style={{
                  padding: '1.5rem',
                  borderRadius: '6px',
                  border: selectedTemplate === 'custom' ? '2px solid #111827' : '1px solid #e5e7eb',
                  backgroundColor: selectedTemplate === 'custom' ? '#f9fafb' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    height: '90px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      backgroundColor: '#111827',
                      color: '#ffffff',
                      padding: '0.5rem 1rem',
                      borderRadius: '30px',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => handleCustomCountChange(-1)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '1.25rem',
                        cursor: 'pointer',
                        padding: '0 0.25rem',
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>
                      {customSlotCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCustomCountChange(1)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '1.25rem',
                        cursor: 'pointer',
                        padding: '0 0.25rem',
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9375rem', fontWeight: 600, color: '#111827' }}>
                  Custom Slot Creator
                </h5>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                  Choose custom photo count (3 to 8 photos) and configure each slot individually.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: INTERACTIVE GRID WITH (+) ADD ICONS (MATCHING USER SCREENSHOT) */}
        {/* ======================================================== */}
        {step === 'editor' && (
          <div>
            {/* Quick Template Status & Counter Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1.25rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '6px',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span
                  style={{
                    backgroundColor: '#111827',
                    color: '#ffffff',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                  }}
                >
                  {selectedTemplate.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.8125rem', color: '#4b5563' }}>
                  Showing {slots.length} photo slots. Tap any slot with <strong>(+)</strong> to upload and crop photo.
                </span>
              </div>

              {/* Slot Counter Controls (As in user's mobile screenshot: - 6 +) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Slots:</span>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#1f2937',
                    color: '#ffffff',
                    padding: '0.2rem 0.75rem',
                    borderRadius: '20px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleCustomCountChange(-1)}
                    style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '1rem' }}
                  >
                    -
                  </button>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.8125rem' }}>
                    {slots.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCustomCountChange(1)}
                    style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '1rem' }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* The Interactive Photographic Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: '8px',
                backgroundColor: '#1e2229',
                padding: '8px',
                borderRadius: '8px',
              }}
            >
              {slots.map((slot, index) => {
                const isConfigured = Boolean(slot.url);

                // Determine grid column span based on selected template
                let span = 4;
                let height = '240px';

                if (selectedTemplate === 'mosaic-5') {
                  if (index === 0 || index === 1) {
                    span = 6;
                    height = '300px';
                  } else {
                    span = 4;
                    height = '240px';
                  }
                } else if (selectedTemplate === 'collage-6') {
                  if (index === 0) {
                    span = 7;
                    height = '320px';
                  } else if (index === 1 || index === 2) {
                    span = 5;
                    height = '156px';
                  } else {
                    span = 4;
                    height = '220px';
                  }
                } else if (selectedTemplate === 'editorial-4') {
                  if (index === 0) {
                    span = 6;
                    height = '380px';
                  } else {
                    span = 6;
                    height = '120px';
                  }
                } else if (selectedTemplate === 'panorama-3') {
                  span = 4;
                  height = '340px';
                } else {
                  // Custom
                  if (slots.length <= 4) span = 12 / slots.length;
                  else if (slots.length === 5) span = index < 2 ? 6 : 4;
                  else span = 4;
                  height = '250px';
                }

                return (
                  <div
                    key={slot.id || index}
                    onClick={() => openSlotEditor(index)}
                    style={{
                      gridColumn: `span ${span}`,
                      position: 'relative',
                      height,
                      backgroundColor: isConfigured ? '#111827' : '#93c5fd', // Light blue background matching user screenshot!
                      borderRadius: '4px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                    className="group"
                  >
                    {isConfigured ? (
                      <>
                        <Image
                          src={slot.url}
                          alt={slot.alt || `Photo slot ${index + 1}`}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="400px"
                        />
                        {/* Overlay */}
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85) 100%)',
                          }}
                        />

                        {/* Tag & Info */}
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '0.75rem',
                            left: '0.75rem',
                            right: '0.75rem',
                            zIndex: 2,
                          }}
                        >
                          <span
                            style={{
                              display: 'inline-block',
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              padding: '0.2rem 0.5rem',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.625rem',
                              fontWeight: 600,
                              color: '#111827',
                              letterSpacing: '0.08em',
                              borderRadius: '2px',
                              marginBottom: '0.25rem',
                            }}
                          >
                            {slot.tag}
                          </span>
                          {slot.caption && (
                            <p
                              style={{
                                fontFamily: 'var(--font-sans)',
                                fontSize: '0.75rem',
                                color: '#ffffff',
                                margin: 0,
                                textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {slot.caption}
                            </p>
                          )}
                        </div>

                        {/* Top-Right Action Buttons */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                            display: 'flex',
                            gap: '0.35rem',
                            zIndex: 3,
                            opacity: 0.9,
                          }}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openSlotEditor(index);
                            }}
                            title="Edit this slot"
                            style={{
                              backgroundColor: '#ffffff',
                              border: 'none',
                              color: '#111827',
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                            }}
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => clearSlot(index, e)}
                            title="Remove photo"
                            style={{
                              backgroundColor: '#ef4444',
                              border: 'none',
                              color: '#ffffff',
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </>
                    ) : (
                      /* Empty Slot with Big Blue (+) Add Button exactly matching the user's uploaded screenshot! */
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.65rem',
                        }}
                      >
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            backgroundColor: '#2563eb', // Royal Blue matching reference screenshot
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
                            transition: 'transform 0.2s ease',
                          }}
                          className="group-hover:scale-110"
                        >
                          <Plus size={24} strokeWidth={2.5} />
                        </div>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            color: '#1e3a8a',
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                          }}
                        >
                          Slot {index + 1}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* SLOT CONFIGURATION MODAL */}
      {/* ======================================================== */}
      {editingSlotIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(10, 10, 9, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '640px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.75rem',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#f9fafb',
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  CONFIGURING SLOT {editingSlotIndex + 1}
                </span>
                <h4
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#111827',
                    margin: 0,
                  }}
                >
                  Add Photo &amp; Architectural Caption
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setEditingSlotIndex(null)}
                style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Image Preview / Upload Section */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.5rem',
                  }}
                >
                  Photo Source (Upload or Image URL)
                </label>

                {slotFormData.url ? (
                  <div
                    style={{
                      position: 'relative',
                      height: '180px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      backgroundColor: '#111827',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <Image src={slotFormData.url} alt="Slot preview" fill style={{ objectFit: 'cover' }} sizes="400px" />
                    <button
                      type="button"
                      onClick={() => {
                        setCropperImageSrc(slotFormData.url);
                        setCropperFile(null);
                        setCropperOpen(true);
                      }}
                      style={{
                        position: 'absolute',
                        bottom: '0.75rem',
                        right: '0.75rem',
                        backgroundColor: '#ffffff',
                        border: 'none',
                        color: '#111827',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      }}
                    >
                      <Crop size={14} /> Recrop &amp; Adjust Ratio
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      border: '2px dashed #d1d5db',
                      borderRadius: '6px',
                      padding: '2rem 1.5rem',
                      textAlign: 'center',
                      backgroundColor: '#fafafa',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <UploadCloud size={32} style={{ color: '#9ca3af', margin: '0 auto 0.75rem' }} />
                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                      Drag &amp; drop your image here, or choose from files
                    </p>
                    <p style={{ margin: '0 0 1rem', fontSize: '0.75rem', color: '#6b7280' }}>
                      Auto-converts to optimized high-res WebP (target 200–800 KB)
                    </p>
                    <label
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1.25rem',
                        borderRadius: '4px',
                        backgroundColor: '#111827',
                        color: '#ffffff',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Browse Image
                      <input type="file" accept="image/*" onChange={handleFilePicked} style={{ display: 'none' }} />
                    </label>
                  </div>
                )}

                {/* Direct URL input fallback */}
                <input
                  type="text"
                  placeholder="Or paste external high-res image URL..."
                  value={slotFormData.url}
                  onChange={(e) => setSlotFormData({ ...slotFormData, url: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.85rem',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.8125rem',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Tag / Category Badge */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.4rem',
                  }}
                >
                  Architectural Tag / Numeral
                </label>
                <input
                  type="text"
                  placeholder="e.g. 01 / ARCHITECTURAL SPACE"
                  value={slotFormData.tag}
                  onChange={(e) => setSlotFormData({ ...slotFormData, tag: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.85rem',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.8125rem',
                    fontFamily: 'var(--font-mono)',
                  }}
                />
              </div>

              {/* Description / Caption */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.4rem',
                  }}
                >
                  Editorial Caption / Narrative
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Micro-engineered fractal apertures delivering zero-glare, high visual comfort emission."
                  value={slotFormData.caption}
                  onChange={(e) => setSlotFormData({ ...slotFormData, caption: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.85rem',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.8125rem',
                    fontFamily: 'var(--font-sans)',
                    resize: 'none',
                  }}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '1rem 1.75rem',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                backgroundColor: '#f9fafb',
              }}
            >
              <button
                type="button"
                onClick={() => setEditingSlotIndex(null)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '4px',
                  border: '1px solid #d1d5db',
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveSlotForm}
                disabled={!slotFormData.url}
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: slotFormData.url ? '#111827' : '#9ca3af',
                  color: '#ffffff',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: slotFormData.url ? 'pointer' : 'not-allowed',
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* LIVE SUB-PAGE PREVIEW MODAL */}
      {/* ======================================================== */}
      {showLivePreview && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            backgroundColor: '#ffffff',
            overflowY: 'auto',
          }}
        >
          {/* Preview Navigation Bar */}
          <div
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 100,
              backgroundColor: '#111827',
              color: '#ffffff',
              padding: '0.85rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span
                style={{
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.5rem',
                  borderRadius: '2px',
                  letterSpacing: '0.08em',
                }}
              >
                SUB-PAGE LIVE PREVIEW
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                {productName} — Architectural Gallery Preview
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowLivePreview(false)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                color: '#ffffff',
                padding: '0.4rem 1rem',
                borderRadius: '4px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
              }}
            >
              <X size={16} /> Close Preview
            </button>
          </div>

          {/* Rendered Preview Gallery */}
          <div style={{ padding: '3.5rem 0', backgroundColor: '#ffffff' }}>
            <div style={{ padding: '0 clamp(1.5rem, 4vw, 3.75rem)' }}>
              <div style={{ marginBottom: '2.5rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: '#6b7280',
                    display: 'block',
                    marginBottom: '0.5rem',
                  }}
                >
                  VISUAL PERSPECTIVES &amp; CRAFT
                </span>
                <h2
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(1.5rem, 2.8vw, 2rem)',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    color: '#111827',
                    margin: 0,
                  }}
                >
                  Architectural Installation &amp; Detail Gallery
                </h2>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9375rem', color: '#4b5563', marginTop: '0.5rem' }}>
                  Photographic portfolio capturing {productName}&apos;s optical precision, tactile surface craft, and luminous dialogue.
                </p>
              </div>

              {/* Grid Output */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(12, 1fr)',
                  gap: 0,
                  backgroundColor: '#0a0a09',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                {slots.filter((s) => Boolean(s.url)).map((slot, idx) => {
                  const span = idx < 2 ? 6 : 4;
                  const height = idx < 2 ? '460px' : '360px';

                  return (
                    <div
                      key={slot.id || idx}
                      style={{
                        gridColumn: `span ${span}`,
                        position: 'relative',
                        height,
                        overflow: 'hidden',
                        backgroundColor: '#151514',
                      }}
                    >
                      <Image src={slot.url} alt={slot.alt} fill style={{ objectFit: 'cover' }} sizes="600px" />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, transparent 40%, rgba(10, 10, 9, 0.85) 100%)',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '1.5rem',
                          left: '1.75rem',
                          right: '1.75rem',
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-block',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            padding: '0.25rem 0.55rem',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.625rem',
                            fontWeight: 600,
                            color: '#111827',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            marginBottom: '0.4rem',
                            borderRadius: '2px',
                          }}
                        >
                          {slot.tag}
                        </span>
                        {slot.caption && (
                          <p style={{ margin: 0, color: '#ffffff', fontSize: '0.8125rem' }}>{slot.caption}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Cropper Modal */}
      {cropperOpen && (
        <ImageCropperModal
          isOpen={cropperOpen}
          onClose={() => setCropperOpen(false)}
          imageUrl={cropperImageSrc}
          imageFile={cropperFile}
          aspectRatioPreset="16:9"
          title="Crop & Optimize Photo Slot"
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
};
